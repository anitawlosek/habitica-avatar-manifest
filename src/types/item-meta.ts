export type ItemMeta = {
    key: string;
    text: string;
    imageFileNames: string[]; // reference to ImageMeta.fileName
    notes?: string;
    price?: number;
    currency?: string;
    set?: string;
};

export type WeaponItemMeta = ItemMeta & {
    twoHanded?: boolean;
};

export type StableItemMeta = ItemMeta & {
    type: "drop" | "premium" | "quest" | "wacky" | "special",
    potion: string,
    egg: string,
};

export type EggItemMeta = ItemMeta & {
    mountText: string;
};

export type HatchingPotionItemMeta = ItemMeta & {
    premium: boolean;
}

