export type HabiticaAppearances = {
    hair: HabiticaHair;
    shirt: Record<string, HabiticaAppearanceItem>;
    size: HabiticaBodySize;
    skin: Record<string, HabiticaAppearanceItem>;
    chair: Record<string, HabiticaAppearanceItem>;
    background: Record<string, HabiticaBackground>;
};
export type HabiticaBackground = {
    key: string;
    set: HabiticaBackgroundSet;
    price: number;
    text: string;
    notes: string;
    currency?: string;
};
export type HabiticaBackgroundSet = {
    text: string;
    key: string;
    setPrice: number;
};
export type HabiticaAppearanceItem = {
    key: string;
    price: number;
    text: string;
    set?: HabiticaAppearanceItem;
    setPrice?: number;
};
export type HabiticaHair = {
    color: Record<string, HabiticaAppearanceItem>;
    base: Record<string, HabiticaAppearanceItem>;
    bangs: Record<string, HabiticaAppearanceItem>;
    flower: Record<string, HabiticaAppearanceItem>;
    beard: Record<string, HabiticaAppearanceItem>;
    mustache: Record<string, HabiticaAppearanceItem>;
};
export type HabiticaBodySize = {
    slim: HabiticaAppearanceItem;
    broad: HabiticaAppearanceItem;
};
export type HabiticaBackgroundList = Record<string, HabiticaBackground>;
export type HabiticaGearItem = {
    text: string;
    notes: string;
    value: number;
    type: HabiticaGearType;
    key: string;
    set: string;
    klass: HabiticaGearClass;
    index: string;
    str: number;
    int: number;
    per: number;
    con: number;
    last?: boolean;
    twoHanded?: boolean;
    specialClass?: HabiticaMemberClass;
    season?: HabiticaSeason;
    mystery?: string;
    event?: HabiticaEvent;
    gearSet?: HabiticaGearSet;
};
export type HabiticaEvent = {
    start: string;
    end: string;
};
export type HabiticaGearSet = "animal" | "headband" | "glasses";
export type HabiticaMemberClass = "healer" | "wizard" | "rogue" | "warrior";
export type HabiticaGearClass = HabiticaMemberClass | "base" | "special" | "mystery" | "armoire";
export type HabiticaSeason = "winter" | "spring" | "summer" | "fall";
export type HabiticaGearType = "weapon" | "armor" | "head" | "shield" | "body" | "back" | "headAccessory" | "eyewear";
export type HabiticaGearTree = {
    weapon: HabiticaGearGroups;
    armor: HabiticaGearGroups;
    head: HabiticaGearGroups;
    shield: HabiticaGearGroups;
    back: HabiticaGearGroups;
    body: HabiticaGearGroups;
    headAccessory: HabiticaGearGroups;
    eyewear: HabiticaGearGroups;
};
export type HabiticaGearGroups = {
    base: HabiticaGearBase;
    warrior?: {
        [key: string]: HabiticaGearItem;
    };
    rogue?: {
        [key: string]: HabiticaGearItem;
    };
    wizard?: {
        [key: string]: HabiticaGearItem;
    };
    healer?: {
        [key: string]: HabiticaGearItem;
    };
    special: {
        [key: string]: HabiticaGearItem;
    };
    mystery: {
        [key: string]: HabiticaGearItem;
    };
    armoire?: {
        [key: string]: HabiticaGearItem;
    };
};
export type HabiticaGearBase = {
    "0": HabiticaGearItem;
};
export type HabiticaPet = {
    key: string;
    type: HabiticaPetType;
    potion?: string;
    egg?: string;
    text: string;
    canFind?: boolean;
    currency?: string;
    event?: string;
    value?: number;
    purchaseType?: string;
};
export type HabiticaPetType = "drop" | "premium" | "quest" | "wacky" | "special";
export type HabiticaMount = {
    key: string;
    type: HabiticaMountType;
    potion?: string;
    egg?: string;
    text: string;
    canFind?: boolean;
};
export type HabiticaMountType = "drop" | "premium" | "quest" | "special";
export type HabiticaContent = {
    achievements: object;
    animalColorAchievements: object[];
    animalSetAchievements: Record<string, object>;
    appearances: HabiticaAppearances;
    armoire: object;
    audioThemes: string[];
    backgrounds: Record<string, HabiticaBackgroundList>;
    backgroundsFlat: HabiticaBackgroundList;
    bundles: Record<string, object>;
    cardTypes: object;
    categoryOptions: object[];
    classes: HabiticaMemberClass[];
    dropEggs: object;
    dropHatchingPotions: object;
    eggs: Record<string, object>;
    events: object;
    faq: object;
    food: object;
    gear: {
        flat: Record<string, HabiticaGearItem>;
        tree: HabiticaGearTree;
    };
    gearTypes: HabiticaGearType[];
    gems: Record<string, object>;
    hatchingPotions: Record<string, object>;
    itemList: Record<string, object>;
    loginIncentives: Record<string, object>;
    mountInfo: Record<string, HabiticaMount>;
    mounts: Record<string, boolean>;
    mystery: Record<string, object>;
    petInfo: Record<string, HabiticaPet>;
    pets: Record<string, boolean>;
    potion: object;
    premiumHatchingPotions: Record<string, object>;
    premiumMounts: Record<string, boolean>;
    premiumPets: Record<string, boolean>;
    questEggs: Record<string, object>;
    questMounts: Record<string, boolean>;
    questPets: Record<string, boolean>;
    questSeriesAchievements: object;
    quests: object;
    questsByLevel: object[];
    repeatingEvents: object;
    special: Record<string, object>;
    specialMounts: object;
    specialPets: object;
    spells: object;
    stableAchievements: object;
    subscriptionBlocks: object;
    tasksByCategory: object;
    timeTravelStable: object;
    userCanOwnQuestCategories: string[];
    userDefaults: object;
    userDefaultsMobile: object;
    wackyHatchingPotions: object;
    wackyPets: Record<string, boolean>;
};
//# sourceMappingURL=habitica-content.d.ts.map