export type ImageMeta = {
  fileName: string;
  width: number;
  height: number;
  format: 'png' | 'gif';
};

export type ItemMeta = {
  key: string;
  text: string;
  imageFileName: string; // reference to ImageMeta.fileName
};

export type GearItems = {
  sets: Record<string, string[]>; // set name as key
  weapon: Record<string, ItemMeta>;
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
  slim: ItemMeta;
  broad: ItemMeta;
}

export type AvatarManifest = {
  version: string;
  generatedAt: string;
  // images: Record<string, ImageMeta>; // fileName as key
  items: {
    backgrounds: Record<string, ItemMeta>;
    gear: GearItems;
    pets: Record<string, ItemMeta>;
    mounts: Record<string, ItemMeta>;
    hair: HairItems;
    skin: Record<string, ItemMeta>;
    body: BodyItems;
    chair: Record<string, ItemMeta>;
  }
};