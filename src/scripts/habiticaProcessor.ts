import {
  HabiticaContent,
  HabiticaGearItem,
  HabiticaPet,
  HabiticaMount,
  HabiticaAppearanceItem,
  HabiticaBackground,
  HabiticaAppearances,
} from '../types/habitica-content';
import {
  AvatarManifest,
  ImageMeta,
  ItemMeta,
  GearItems,
  HairItems,
  BodyItems,
} from '../types/manifest';

// -------------------------
// Helpers
// -------------------------

const images: Record<string, ImageMeta> = {};

function createImageMeta(fileName: string): ImageMeta {
  if (!images[fileName]) {
    images[fileName] = {
      fileName,
      width: 512,
      height: 512,
      format: fileName.endsWith('.gif') ? 'gif' : 'png',
    };
  }
  return images[fileName];
}

function createItemMeta(key: string, text: string): ItemMeta {
  const fileName = `${key}.png`;
  createImageMeta(fileName);
  return { key, text, imageFileName: fileName };
}

// -------------------------
// Processing Functions
// -------------------------

function processGear(habitica: HabiticaContent): GearItems {
  const gearFlat = habitica.gear.flat;
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
      (gear[type] as Record<string, ItemMeta>)[key] = createItemMeta(key, text);
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

function processBackgrounds(habitica: HabiticaContent): Record<string, ItemMeta> {
  const result: Record<string, ItemMeta> = {};
  Object.values(habitica.backgroundsFlat).forEach((bg: HabiticaBackground) => {
    result[bg.key] = createItemMeta(bg.key, bg.text);
  });
  return result;
}

function processPets(habitica: HabiticaContent): Record<string, ItemMeta> {
  const result: Record<string, ItemMeta> = {};
  Object.values(habitica.petInfo).forEach((pet: HabiticaPet) => {
    result[pet.key] = createItemMeta(pet.key, pet.text);
  });
  return result;
}

function processMounts(habitica: HabiticaContent): Record<string, ItemMeta> {
  const result: Record<string, ItemMeta> = {};
  Object.values(habitica.mountInfo).forEach((mount: HabiticaMount) => {
    result[mount.key] = createItemMeta(mount.key, mount.text);
  });
  return result;
}

  const processPart = (part: Record<string, HabiticaAppearanceItem>) =>
    Object.fromEntries(
      Object.values(part).map((i) => [i.key, createItemMeta(i.key, i.text)])
    );

function processHair(hair: any): HairItems {
  return {
    color: processPart(hair.color),
    base: processPart(hair.base),
    bangs: processPart(hair.bangs),
    flower: processPart(hair.flower),
    beard: processPart(hair.beard),
    mustache: processPart(hair.mustache),
  };
}

function processBody(size: HabiticaAppearances['size'], shirt: HabiticaAppearances['shirt']): BodyItems {
  return {
    shirt: processPart(shirt),
    size: processPart(size) as BodyItems['size'],
  };
}

function processSkin(skin: Record<string, HabiticaAppearanceItem>): Record<string, ItemMeta> {
  return Object.fromEntries(
    Object.values(skin).map((i) => [i.key, createItemMeta(i.key, i.text)])
  );
}

function processChair(chair: Record<string, HabiticaAppearanceItem>): Record<string, ItemMeta> {
  return Object.fromEntries(
    Object.values(chair).map((i) => [i.key, createItemMeta(i.key, i.text)])
  );
}

// -------------------------
// Main processor
// -------------------------

export function generateAvatarManifest(habitica: HabiticaContent): AvatarManifest {
  const appearances = habitica.appearances as any;

  return {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    items: {
      backgrounds: processBackgrounds(habitica),
      gear: processGear(habitica),
      pets: processPets(habitica),
      mounts: processMounts(habitica),
      hair: processHair(appearances.hair),
      skin: processSkin(appearances.skin),
      body: processBody(appearances.size, appearances.shirt),
      chair: processChair(appearances.chair),
    },
  };
}
