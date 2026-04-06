import { HabiticaContent, HabiticaGearItem } from '../types/habitica-content';
import { GearItems, GearSets } from '../types/manifest';
import { GearItemMeta, GearSetItemMeta, ItemMeta } from '../types/item-meta';
import { getImageFileNames } from './imagesDetailsProvider';

// -------------------------
// Helpers
// -------------------------

function createGearItemMeta(
  type: string,
  key: string,
  text: string,
  habiticaContent: HabiticaContent,
  imageCollector: string[],
  options?: {
    notes?: string;
    price?: number;
    currency?: string;
    set?: string;
    twoHanded?: boolean;
  }
): GearItemMeta {
  const imageFileNames = getImageFileNames(type, key, habiticaContent);
  imageCollector.push(...imageFileNames);

  const itemMeta: GearItemMeta = { key, text, imageFileNames };

  if (options?.notes) itemMeta.notes = options.notes;
  if (options?.price !== undefined) itemMeta.price = options.price;
  if (options?.currency) itemMeta.currency = options.currency;
  if (options?.set) itemMeta.set = options.set;
  if (options?.twoHanded !== undefined) itemMeta.twoHanded = options.twoHanded;

  return itemMeta;
}

function extractArmoireSetName(items: HabiticaGearItem[]): string | undefined {
  for (const item of items) {
    const match = item.notes?.match(/Enchanted Armoire: (.+?) \(Item/);
    if (match) return match[1];
  }
  return undefined;
}

/** Returns the longest common leading word sequence shared by all item names. */
function getCommonWordPrefix(names: string[]): string | undefined {
  if (names.length < 2) return undefined;
  const wordArrays = names.map(n => n.split(/\s+/));
  const first = wordArrays[0];
  let commonLen = 0;
  for (let i = 0; i < first.length; i++) {
    if (wordArrays.every(words => words[i] === first[i])) {
      commonLen++;
    } else {
      break;
    }
  }
  return commonLen > 0 ? first.slice(0, commonLen).join(' ') : undefined;
}

/** Strips trailing " Set" and leading "Season Year " from a set name.
 *  e.g. "Summer 2017 Sandcastle Warrior Set" -> "Sandcastle Warrior"
 *       "Winged Messenger Set" -> "Winged Messenger"
 *       "Gingerbread Set" -> "Gingerbread"
 */
function normalizeSetText(text: string): string {
  return text
    .replace(/\bSet$/, '')
    .replace(/^(Winter|Spring|Summer|Fall)\s+\d{4}\s+/i, '')
    .trim();
}

/** Converts a camelCase/dash/underscore set key to title-case words.
 *  e.g. "northMageSet" -> "North Mage"
 *       "summer2017SandcastleWarriorSet" -> "Sandcastle Warrior"
 *       "special-wondercon_red" -> "Special Wondercon Red"
 */
function setKeyToText(key: string): string {
  const raw = key
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Za-z])(\d)/g, '$1 $2')
    .replace(/(\d)([A-Za-z])/g, '$1 $2')
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
  return normalizeSetText(raw);
}

function getSetText(setKey: string, items: HabiticaGearItem[]): string {
  const commonPrefix = getCommonWordPrefix(items.map(i => i.text));
  return commonPrefix ?? setKeyToText(setKey);
}

// -------------------------
// Main export
// -------------------------

export function processGear(habiticaContent: HabiticaContent): { sets: GearSets; gear: GearItems; imageFileNames: string[] } {
  const gearFlat = habiticaContent.gear.flat;
  const imageFileNames: string[] = [];

  const gearByType: GearItems = {
    weapon: {},
    armor: {},
    head: {},
    shield: {},
    back: {},
    body: {},
    headAccessory: {},
    eyewear: {},
  };

  const setItemsMap: Record<string, HabiticaGearItem[]> = {};

  Object.values(gearFlat).forEach((item: HabiticaGearItem) => {
    const { key, text, type, set, notes, twoHanded } = item;

    if (type in gearByType) {
      gearByType[type][key] = createGearItemMeta(`gear.${type}`, key, text, habiticaContent, imageFileNames, {
        notes,
        set,
        twoHanded,
      });
    }

    if (set) {
      if (!setItemsMap[set]) setItemsMap[set] = [];
      setItemsMap[set].push(item);
    }
  });

  // Only keep sets with 2+ items
  const multiItemSetKeys = Object.keys(setItemsMap).filter(k => setItemsMap[k].length >= 2);

  const sets: GearSets = {};
  for (const setKey of multiItemSetKeys) {
    const items = setItemsMap[setKey];
    const gearMap: GearSetItemMeta["gear"] = {};

    for (const item of items) {
      gearMap[item.type] = item.key;
    }

    if (setKey.startsWith('mystery-')) {
      const mysteryKey = setKey.replace('mystery-', '');
      const mysteryData = habiticaContent.mystery[mysteryKey];
      if (mysteryData) {
        const setImageFileNames = mysteryData.class ? [mysteryData.class] : [];
        imageFileNames.push(...setImageFileNames);
        sets[setKey] = { key: setKey, text: normalizeSetText(mysteryData.text), imageFileNames: setImageFileNames, gear: gearMap };
      }
    } else if (items[0].klass === 'armoire') {
      const raw = extractArmoireSetName(items) ?? getSetText(setKey, items);
      const text = normalizeSetText(raw);
      sets[setKey] = { key: setKey, text, imageFileNames: [], gear: gearMap };
    } else {
      sets[setKey] = { key: setKey, text: getSetText(setKey, items), imageFileNames: [], gear: gearMap };  // getSetText already normalizes
    }
  }

  return { sets, gear: gearByType, imageFileNames };
}
