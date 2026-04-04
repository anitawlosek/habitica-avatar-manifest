import { EggItemMeta, HatchingPotionItemMeta, ItemMeta, StableItemMeta, WeaponItemMeta } from "./item-meta";

export type ImageMeta = {
  fileName: string;
  width: number;
  height: number;
  format: 'png' | 'gif';
};

export type GearItems = {
  sets: Record<string, string[]>; // set name as key
  weapon: Record<string, WeaponItemMeta>;
  armor: Record<string, ItemMeta>;
  head: Record<string, ItemMeta>;
  shield: Record<string, ItemMeta>;
  back: Record<string, ItemMeta>;
  body: Record<string, ItemMeta>;
  headAccessory: Record<string, ItemMeta>;
  eyewear: Record<string, ItemMeta>;
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

export type PetTree = {
  byType: Record<string, string[]>; // egg id, list of pet ids
  byColor: Record<string, string[]>; // hatchingPotion id, list od pet ids
  special: string[]; // list of pet ids that are not hached from eggs
}

export type AvatarManifestItems = {
  background: Record<string, ItemMeta>;
  gear: GearItems;
  egg: Record<string, EggItemMeta>;
  hatchingPotion: Record<string, HatchingPotionItemMeta>;
  pet: Record<string, StableItemMeta>;
  petTree: PetTree;
  mount: Record<string, StableItemMeta>;
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