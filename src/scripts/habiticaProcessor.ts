import { buffImageFileNames, buffItems, headBase, sleepItem } from './constants';
import {
  HabiticaContent,
  HabiticaGearItem,
  HabiticaPet,
  HabiticaMount,
  HabiticaAppearanceItem,
  HabiticaBackground,
  HabiticaEgg,
  HabiticaHatchingPotion,
} from '../types/habitica-content';
import {
  AvatarManifest,
  GearItems,
  HairItems,
  BodyItems,
  PetTree,
} from '../types/manifest';
import { getImageFileNames } from './imagesDetailsProvider';
import { EggItemMeta, GearItemMeta, HatchingPotionItemMeta, ItemMeta, StableItemMeta } from '../types/item-meta';

// -------------------------
// Helpers
// -------------------------

const imageFileNamesList: string[] = [];

function createItemMeta(
  type: string,
  key: string,
  text: string,
  habiticaContent: HabiticaContent,
  options?: {
    notes?: string;
    price?: number;
    currency?: string;
    set?: string;
  }
) {
  const imageFileNames = getImageFileNames(type, key, habiticaContent);
  imageFileNamesList.push(...imageFileNames);

  const itemMeta: ItemMeta = { key, text, imageFileNames };

  if (options?.notes) itemMeta.notes = options.notes;
  if (options?.price !== undefined) itemMeta.price = options.price;
  if (options?.currency) itemMeta.currency = options.currency;
  if (options?.set) itemMeta.set = options.set;

  return itemMeta;
}

function createGearItemMeta(
  type: string,
  key: string,
  text: string,
  habiticaContent: HabiticaContent,
  options?: {
    notes?: string;
    price?: number;
    currency?: string;
    set?: string;
    twoHanded?: boolean;
  }
) {
  const itemMeta: GearItemMeta = createItemMeta(type, key, text, habiticaContent, { 
    notes: options?.notes, 
    price: options?.price, 
    currency: options?.currency, 
    set: options?.set 
  });

  if (options?.twoHanded !== undefined) itemMeta.twoHanded = options.twoHanded;

  return itemMeta;
}

// -------------------------
// Processing Functions
// -------------------------

function processGear(habiticaContent: HabiticaContent): GearItems {
  const gearFlat = habiticaContent.gear.flat;
  const gear: GearItems = {
    sets: {},
    weapon: {},
    armor: {},
    head: {},
    shield: {},
    back: {},
    body: {},
    headAccessory: {},
    eyewear: {},
  };

  Object.values(gearFlat).forEach((item: HabiticaGearItem) => {
    const { key, text, type, set, notes, twoHanded } = item;
    if (type in gear) {
      (gear[type] as Record<string, ItemMeta>)[key] = createGearItemMeta(`gear.${type}`, key, text, habiticaContent, {
        notes,
        set,
        twoHanded,
      });
    }

    if (set) {
      if (!gear.sets[set]) gear.sets[set] = [];
      gear.sets[set].push(key);
    }
  });

  const filteredSets = Object.fromEntries(
    Object.entries(gear.sets).filter(([, items]) => items.length >= 2)
  );
  gear.sets = filteredSets;

  return gear;
}

function processBackgrounds(habiticaContent: HabiticaContent): Record<string, ItemMeta> {
  const result: Record<string, ItemMeta> = {};
  Object.values(habiticaContent.backgroundsFlat).forEach((bg: HabiticaBackground) => {
    result[bg.key] = createItemMeta('background', bg.key, bg.text, habiticaContent, {
      notes: bg.notes,
      price: bg.price,
      currency: bg.currency,
      set: bg.set?.key,
    });
  });
  return result;
}

function processEggs(habiticaContent: HabiticaContent): Record<string, EggItemMeta> {
  const result: Record<string, EggItemMeta> = {};
  Object.values(habiticaContent.eggs).forEach((egg: HabiticaEgg) => {
    const fileNames = getImageFileNames('egg', egg.key, habiticaContent);
    imageFileNamesList.push(...fileNames);
    result[egg.key] = {
      key: egg.key,
      text: egg.text,
      imageFileNames: fileNames,
      notes: egg.notes,
      mountText: egg.mountText,
    };
  });
  return result;
}

function processHatchingPotions(habiticaContent: HabiticaContent): Record<string, HatchingPotionItemMeta> {
  const result: Record<string, HatchingPotionItemMeta> = {};
  Object.values(habiticaContent.hatchingPotions).forEach((potion: HabiticaHatchingPotion) => {
    const fileNames = getImageFileNames('hatchingPotion', potion.key, habiticaContent);
    imageFileNamesList.push(...fileNames);

    result[potion.key] = {
      key: potion.key,
      text: potion.text,
      imageFileNames: fileNames,
      notes: potion.notes,
      premium: potion.premium,
      wacky: potion.wacky,
    };
  });

  return result;
}

function processPets(habiticaContent: HabiticaContent): Record<string, StableItemMeta> {
  const result: Record<string, StableItemMeta> = {};
  Object.values(habiticaContent.petInfo).forEach((pet: HabiticaPet) => {
    const fileNames = getImageFileNames('pet', pet.key, habiticaContent);
    imageFileNamesList.push(...fileNames);
    result[pet.key] = {
      key: pet.key,
      text: pet.text,
      imageFileNames: fileNames,
      type: pet.type,
      potion: pet.potion ?? '',
      egg: pet.egg ?? '',
    };
  });
  return result;
}

function processMounts(habiticaContent: HabiticaContent): Record<string, StableItemMeta> {
  const result: Record<string, StableItemMeta> = {};
  Object.values(habiticaContent.mountInfo).forEach((mount: HabiticaMount) => {
    const fileNames = getImageFileNames('mount', mount.key, habiticaContent);
    imageFileNamesList.push(...fileNames);
    result[mount.key] = {
      key: mount.key,
      text: mount.text,
      imageFileNames: fileNames,
      type: mount.type,
      potion: mount.potion ?? '',
      egg: mount.egg ?? '',
    };
  });
  return result;
}

function processPetTree(habiticaContent: HabiticaContent): PetTree {
  const byEgg: Record<string, string[]> = {};
  const byHatchingPotion: Record<string, string[]> = {};
  const special: string[] = [];

  Object.values(habiticaContent.petInfo).forEach((pet: HabiticaPet) => {
    if (pet.egg && pet.potion) {
      if (!byEgg[pet.egg]) byEgg[pet.egg] = [];
      byEgg[pet.egg].push(pet.key);

      if (!byHatchingPotion[pet.potion]) byHatchingPotion[pet.potion] = [];
      byHatchingPotion[pet.potion].push(pet.key);
    } else {
      special.push(pet.key);
    }
    
  });

  return { byEgg, byHatchingPotion, special };
}

const processPart = (type: string, part: Record<string, HabiticaAppearanceItem>, habiticaContent: HabiticaContent) =>
  Object.fromEntries(
    Object.values(part).map((i) => [i.key, createItemMeta(type, i.key, i.text, habiticaContent, {
      price: i.price,
      set: i.set?.key,
    })])
  );

function processHair(habiticaContent: HabiticaContent): HairItems {
  const habiticaHair = habiticaContent.appearances.hair;

  return {
    color: processPart('hair.color', habiticaHair.color, habiticaContent),
    base: processPart('hair.base', habiticaHair.base, habiticaContent),
    bangs: processPart('hair.bangs', habiticaHair.bangs, habiticaContent),
    flower: processPart('hair.flower', habiticaHair.flower, habiticaContent),
    beard: processPart('hair.beard', habiticaHair.beard, habiticaContent),
    mustache: processPart('hair.mustache', habiticaHair.mustache, habiticaContent),
  };
}

function processBody(habiticaContent: HabiticaContent): BodyItems {
  const { size, shirt } = habiticaContent.appearances;

  return {
    shirt: processPart('body.shirt', shirt, habiticaContent),
    size: processPart('body.size', size, habiticaContent) as BodyItems['size'],
  };
}

function processSkin(habiticaContent: HabiticaContent): Record<string, ItemMeta> {
  return Object.fromEntries(
    Object.values(habiticaContent.appearances.skin).map((i) => [i.key, createItemMeta('skin', i.key, i.text, habiticaContent, {
      price: i.price,
      set: i.set?.key,
    })])
  );
}

function processChair(habiticaContent: HabiticaContent): Record<string, ItemMeta> {
  return Object.fromEntries(
    Object.values(habiticaContent.appearances.chair).map((i) => [i.key, createItemMeta('chair', i.key, i.text, habiticaContent)])
  );
}

// -------------------------
// Main processor
// -------------------------

export async function generateAvatarManifest(habiticaContent: HabiticaContent): Promise<AvatarManifest> {
  const items = {
    background: processBackgrounds(habiticaContent),
    gear: processGear(habiticaContent),
    egg: processEggs(habiticaContent),
    hatchingPotion: processHatchingPotions(habiticaContent),
    pet: processPets(habiticaContent),
    petTree: processPetTree(habiticaContent),
    mount: processMounts(habiticaContent),
    hair: processHair(habiticaContent),
    skin: processSkin(habiticaContent),
    body: processBody(habiticaContent),
    chair: processChair(habiticaContent),
    buff: Object.fromEntries(
      buffItems.map((i) => [i.key, i])
    ),
    sleep: { [sleepItem.key]: sleepItem },
  };

  const imageFileNames = Array.from(new Set([
    ...imageFileNamesList,
    ...buffImageFileNames,
    ...sleepItem.imageFileNames,
    headBase
  ]));

  return {
    imageFileNames,
    items,
  };
}
