import {
  HabiticaContent,
  HabiticaGearItem,
  HabiticaPet,
  HabiticaMount,
  HabiticaAppearanceItem,
  HabiticaBackground,
} from '../types/habitica-content';
import {
  AvatarManifest,
  ItemMeta,
  GearItems,
  HairItems,
  BodyItems,
} from '../types/manifest';
import { getImageFileNames } from './imagesDetailsProvider';

// -------------------------
// Helpers
// -------------------------

const imageFileNames: string[] = [];

function createItemMeta(type: string, key: string, text: string, habiticaContent: HabiticaContent) {
  const fileNames = getImageFileNames(type, key, habiticaContent);
  imageFileNames.push(...fileNames);

  return { key, text, imageFileNames: fileNames };
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
    const { key, text, type, set } = item;
    if (type in gear) {
      (gear[type] as Record<string, ItemMeta>)[key] = createItemMeta(`gear.${type}`, key, text, habiticaContent);
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
    result[bg.key] = createItemMeta('background', bg.key, bg.text, habiticaContent);
  });
  return result;
}

function processPets(habiticaContent: HabiticaContent): Record<string, ItemMeta> {
  const result: Record<string, ItemMeta> = {};
  Object.values(habiticaContent.petInfo).forEach((pet: HabiticaPet) => {
    result[pet.key] = createItemMeta('pet', pet.key, pet.text, habiticaContent);
  });
  return result;
}

function processMounts(habiticaContent: HabiticaContent): Record<string, ItemMeta> {
  const result: Record<string, ItemMeta> = {};
  Object.values(habiticaContent.mountInfo).forEach((mount: HabiticaMount) => {
    result[mount.key] = createItemMeta('mount', mount.key, mount.text, habiticaContent);
  });
  return result;
}

  const processPart = (type: string, part: Record<string, HabiticaAppearanceItem>, habiticaContent: HabiticaContent) =>
    Object.fromEntries(
      Object.values(part).map((i) => [i.key, createItemMeta(type, i.key, i.text, habiticaContent)])
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
    Object.values(habiticaContent.appearances.skin).map((i) => [i.key, createItemMeta('skin', i.key, i.text, habiticaContent)])
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
      pet: processPets(habiticaContent),
      mount: processMounts(habiticaContent),
      hair: processHair(habiticaContent),
      skin: processSkin(habiticaContent),
      body: processBody(habiticaContent),
      chair: processChair(habiticaContent),
    };

  return {
    imageFileNames: Array.from(new Set(imageFileNames)),
    items,
  };
}
