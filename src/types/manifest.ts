import { EggItemMeta, HatchingPotionItemMeta, ItemMeta, StableItemMeta, GearItemMeta } from "./item-meta";

export type ImageMeta = {
  fileName: string;
  width: number;
  height: number;
  format: 'png' | 'gif';
};

export type GearItems = {
  sets: Record<string, ItemMeta>
  bySet: Record<string, Record<string, string>> // { "warrior_1": { armor: "armor_warrior_1", head: "head_warrior_1", ... } }
  byType: {
    weapon: Record<string, GearItemMeta>;
    armor: Record<string, GearItemMeta>;
    head: Record<string, GearItemMeta>;
    shield: Record<string, GearItemMeta>;
    back: Record<string, GearItemMeta>;
    body: Record<string, GearItemMeta>;
    headAccessory: Record<string, GearItemMeta>;
    eyewear: Record<string, GearItemMeta>;
  }
}

export type HairItems = {
  color: Record<string, ItemMeta>;
  base: Record<string, ItemMeta>;
  bangs: Record<string, ItemMeta>;
  flower: Record<string, ItemMeta>;
  beard: Record<string, ItemMeta>;
  mustache: Record<string, ItemMeta>;
}

export type BodyItems = {
  shirt: Record<string, ItemMeta>;
  size: {
    slim: ItemMeta;
    broad: ItemMeta;
  };
}

export type StableTree = {
  byEgg: Record<string, string[]>; // egg id, list of pet ids
  byHatchingPotion: Record<string, string[]>; // hatchingPotion id, list od pet ids
  special: string[]; // list of pet ids that are not hached from eggs
}

export type AvatarManifestItems = {
  background: Record<string, ItemMeta>;
  gear: GearItems;
  egg: Record<string, EggItemMeta>;
  hatchingPotion: Record<string, HatchingPotionItemMeta>;
  pet: Record<string, StableItemMeta>;
  petTree: StableTree;
  mount: Record<string, StableItemMeta>;
  mountTree: StableTree;
  hair: HairItems;
  skin: Record<string, ItemMeta>;
  body: BodyItems;
  chair: Record<string, ItemMeta>;
  buff: Record<string, ItemMeta>;
  sleep: Record<string, ItemMeta>;
};

export type AvatarManifest = {
  imageFileNames: string[]; // fileName as key
  items: AvatarManifestItems;
}

export type ImagesMeta = Record<string, ImageMeta>; // fileName as key