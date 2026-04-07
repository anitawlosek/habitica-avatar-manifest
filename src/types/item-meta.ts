export type ItemMeta = {
    key: string;
    text: string;
    imageFileNames: string[]; // reference to ImageMeta.fileName
    notes?: string;
    price?: number;
    currency?: string;
    set?: string;
};

export type GearItemMeta = ItemMeta & {
    twoHanded?: boolean;
};

export type GearSetItemMeta = ItemMeta & {
    gear: Record<string, string>; // { armor: "armor_warrior_1", head: "head_warrior_1", ... }
};

export type StableItemMeta = ItemMeta & {
    type: "drop" | "premium" | "quest" | "wacky" | "special",
    potion?: string,
    egg?: string,
};

export type EggItemMeta = ItemMeta & {
    mountText: string;
};

export type HatchingPotionItemMeta = ItemMeta & {
    premium: boolean;
    wacky?: boolean;
}

