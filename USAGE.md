# Usage Examples

## Gear Sets

```typescript
const items = await getHabiticaAvatarManifestItems();

// List all set names
Object.keys(items.gearSets); // ['healer-1', 'healer-2', 'warrior-1', ...]

// Get the items in a set
const set = items.gearSets['healer-1'];
set.gear; // { weapon: 'weapon_healer_1', armor: 'armor_healer_1', head: 'head_healer_1', shield: 'shield_healer_1' }

// Resolve a gear item from a set
const armor = items.gear.armor[set.gear.armor];
armor.text;           // "Healer Armor"
armor.imageFileNames; // ['broad_armor_healer_1', 'slim_armor_healer_1', 'shop_armor_healer_1']
```

## Image URLs

```typescript
const BASE = 'https://habitica-assets.s3.amazonaws.com/mobileApp/images';

const items = await getHabiticaAvatarManifestItems();
const beach = items.background.beach;

beach.imageFileNames.map(f => `${BASE}/${f}.png`);
// [
//   'https://habitica-assets.s3.amazonaws.com/mobileApp/images/background_beach.png',
//   'https://habitica-assets.s3.amazonaws.com/mobileApp/images/icon_background_beach.png'
// ]
```

## Image Metadata

```typescript
const meta = await getHabiticaImagesMeta();

meta['background_beach.png']; // { fileName: 'background_beach.png', width: 512, height: 512, format: 'png' }
```

Only available when generated with `npm run generate:all-images`. See README for details.

## Pets and Mounts

```typescript
const items = await getHabiticaAvatarManifestItems();

// All pets hatched from Wolf eggs
items.petTree.byEgg.Wolf; // ['Wolf-Base', 'Wolf-CottonCandyBlue', ...]

// All pets hatched with Base potion
items.petTree.byHatchingPotion.Base; // ['Wolf-Base', 'TigerCub-Base', ...]

// Pets not hatched from eggs
items.petTree.special; // ['Wolf-Veteran', 'BearCub-Polar', ...]

// Resolve a pet item
const pet = items.pet['Wolf-Base'];
pet.text; // "Wolf (Base)"
pet.type; // "drop" | "premium" | "quest" | "wacky" | "special"
```

Same structure applies to `mountTree` and `mount`.

## Hair

```typescript
const items = await getHabiticaAvatarManifestItems();

items.hair.color.black;
items.hair.base.curly;   // imageFileNames contains one entry per color variation
items.hair.bangs;
items.hair.flower;
items.hair.beard;
items.hair.mustache;
```

## Error Handling

```typescript
try {
  const items = await getHabiticaAvatarManifestItems();
} catch (error) {
  // Network or parse failure — show cached data or retry
}
```
