import { AvatarManifestItems, GearItems, StableTree } from '../types/manifest';

function mergeStableTree(existing: StableTree, updated: StableTree): StableTree {
    const byEgg: Record<string, string[]> = { ...existing.byEgg };
    for (const [egg, pets] of Object.entries(updated.byEgg)) {
        byEgg[egg] = Array.from(new Set([...(byEgg[egg] ?? []), ...pets]));
    }
    const byHatchingPotion: Record<string, string[]> = { ...existing.byHatchingPotion };
    for (const [potion, pets] of Object.entries(updated.byHatchingPotion)) {
        byHatchingPotion[potion] = Array.from(new Set([...(byHatchingPotion[potion] ?? []), ...pets]));
    }
    const special = Array.from(new Set([...existing.special, ...updated.special]));
    return { byEgg, byHatchingPotion, special };
}

function mergeGear(existing: GearItems, updated: GearItems): GearItems {
    return {
        weapon: { ...existing.weapon, ...updated.weapon },
        armor: { ...existing.armor, ...updated.armor },
        head: { ...existing.head, ...updated.head },
        shield: { ...existing.shield, ...updated.shield },
        back: { ...existing.back, ...updated.back },
        body: { ...existing.body, ...updated.body },
        headAccessory: { ...existing.headAccessory, ...updated.headAccessory },
        eyewear: { ...existing.eyewear, ...updated.eyewear },
    };
}

export function mergeManifestItems(existing: AvatarManifestItems, updated: AvatarManifestItems): AvatarManifestItems {
    return {
        background: { ...existing.background, ...updated.background },
        gear: mergeGear(existing.gear, updated.gear),
        gearSets: { ...existing.gearSets, ...updated.gearSets },
        egg: { ...existing.egg, ...updated.egg },
        hatchingPotion: { ...existing.hatchingPotion, ...updated.hatchingPotion },
        pet: { ...existing.pet, ...updated.pet },
        petTree: mergeStableTree(existing.petTree, updated.petTree),
        mount: { ...existing.mount, ...updated.mount },
        mountTree: mergeStableTree(existing.mountTree, updated.mountTree),
        hair: {
            color: { ...existing.hair.color, ...updated.hair.color },
            base: { ...existing.hair.base, ...updated.hair.base },
            bangs: { ...existing.hair.bangs, ...updated.hair.bangs },
            flower: { ...existing.hair.flower, ...updated.hair.flower },
            beard: { ...existing.hair.beard, ...updated.hair.beard },
            mustache: { ...existing.hair.mustache, ...updated.hair.mustache },
        },
        skin: { ...existing.skin, ...updated.skin },
        body: {
            shirt: { ...existing.body.shirt, ...updated.body.shirt },
            size: updated.body.size,
        },
        chair: { ...existing.chair, ...updated.chair },
        buff: { ...existing.buff, ...updated.buff },
        sleep: { ...existing.sleep, ...updated.sleep },
    };
}
