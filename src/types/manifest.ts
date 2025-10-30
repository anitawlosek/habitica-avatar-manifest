export type ImageMeta = {
  fileName: string;
  width: number;
  height: number;
  format: 'png' | 'gif';
};

export type ItemMeta = {
  key: string;
  text: string;
  imageFileNames: string[]; // reference to ImageMeta.fileName
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
  shirt: Record<string, ItemMeta>;
  size: {
    slim: ItemMeta;
    broad: ItemMeta;
  };
}

export type AvatarItemsDetails = {
  background: Record<string, ItemMeta>;
  gear: GearItems;
  pet: Record<string, ItemMeta>;
  mount: Record<string, ItemMeta>;
  hair: HairItems;
  skin: Record<string, ItemMeta>;
  body: BodyItems;
  chair: Record<string, ItemMeta>;
  buff: Record<string, ItemMeta>;
  sleep: Record<string, ItemMeta>;
};

export type AvatarManifest = {
  imageFileNames: string[]; // fileName as key
  items: AvatarItemsDetails;
}

export type ImagesMeta = Record<string, ImageMeta>; // fileName as key