# Habitica Avatar Manifest

> Preprocessed, structured Habitica avatar data — items, metadata, and image references — ready to use in your app.

[![Generate Habitica Avatar Manifest](https://github.com/anitawlosek/habitica-avatar-manifest/actions/workflows/generate.yml/badge.svg)](https://github.com/anitawlosek/habitica-avatar-manifest/actions/workflows/generate.yml)

## Install

```bash
npm install github:anitawlosek/habitica-avatar-manifest#v1.3.0
```

## Quick Start

```typescript
import { getHabiticaAvatarManifestItems } from 'habitica-avatar-manifest';

const items = await getHabiticaAvatarManifestItems();

items.background.beach;          // beach background
items.gear.weapon;               // all weapons
items.gearSets['healer-1'];      // healer set with gear references
items.egg.Wolf;                  // Wolf egg
items.pet['Wolf-Base'];          // Wolf-Base pet
items.hair.color;                // all hair colors
```

Data is fetched directly from this repository, so you always get the latest without reinstalling.

## Data Reference

| Key | Type | Contents |
|---|---|---|
| `background` | `Record<string, ItemMeta>` | Background scenes |
| `gear` | `GearItems` | Weapons, armor, accessories by type |
| `gearSets` | `GearSets` | Named gear sets with item references |
| `egg` | `Record<string, EggItemMeta>` | Hatchable eggs |
| `hatchingPotion` | `Record<string, HatchingPotionItemMeta>` | Hatching potions |
| `pet` | `Record<string, StableItemMeta>` | Collectible pets |
| `petTree` | `StableTree` | Pets indexed by egg and potion |
| `mount` | `Record<string, StableItemMeta>` | Rideable mounts |
| `mountTree` | `StableTree` | Mounts indexed by egg and potion |
| `hair` | `HairItems` | Colors, styles, bangs, flowers, beards, mustaches |
| `skin` | `Record<string, ItemMeta>` | Skin tones |
| `body` | `BodyItems` | Shirt styles and slim/broad sizes |
| `chair` | `Record<string, ItemMeta>` | Wheelchair and accessibility options |
| `buff` | `Record<string, ItemMeta>` | Special effect items (snowballs, sparkles, etc.) |
| `sleep` | `Record<string, ItemMeta>` | Sleep mode indicator |

### Types

All items share a base `ItemMeta` shape:

```typescript
type ItemMeta = {
  key: string;
  text: string;
  imageFileNames: string[]; // filenames without extension, for use with the Habitica S3 CDN
  notes?: string;
  price?: number;
  currency?: string;
  set?: string;
};
```

Extended types for specific categories:

```typescript
type EggItemMeta = ItemMeta & {
  mountText: string; // display name of the hatched mount
};

type HatchingPotionItemMeta = ItemMeta & {
  premium: boolean;
  wacky?: boolean;
};

type GearSetItemMeta = ItemMeta & {
  gear: Record<string, string>; // gear type → item key, e.g. { armor: "armor_healer_1" }
};

type StableTree = {
  byEgg: Record<string, string[]>;
  byHatchingPotion: Record<string, string[]>;
  special: string[];
};
```

### Image URLs

Image filenames from `imageFileNames` can be resolved against the Habitica S3 CDN:

```typescript
const BASE = 'https://habitica-assets.s3.amazonaws.com/mobileApp/images';
const url = `${BASE}/${item.imageFileNames[0]}.png`;
```

## Image Metadata (Optional)

Running `npm run generate:all-images` probes every image and produces `imagesMeta.json` with dimensions and format:

```typescript
import { getHabiticaImagesMeta } from 'habitica-avatar-manifest';

const meta = await getHabiticaImagesMeta();
meta['background_beach.png']; // { fileName, width, height, format }
```

This file is generated separately because probing ~30,000 images takes 10+ minutes.

## TypeScript

```typescript
import {
  getHabiticaAvatarManifestItems,
  getHabiticaImagesMeta,
  getHabiticaImageFileNames,
  type AvatarManifestItems,
  type ItemMeta,
  type GearItems,
  type GearSets,
  type GearSetItemMeta,
  type EggItemMeta,
  type HatchingPotionItemMeta,
  type StableItemMeta,
  type StableTree,
  type ImageMeta,
} from 'habitica-avatar-manifest';
```

For more usage examples, see [USAGE.md](./USAGE.md).

## Development

```bash
git clone https://github.com/anitawlosek/habitica-avatar-manifest.git
cd habitica-avatar-manifest
npm install

npm run generate            # fast, no image probing
npm run generate:all-images # includes image dimensions and format
```

Output is written to `output/1.3.0/`:
- `avatarManifestItems.json` — main manifest
- `imagesMeta.json` — image metadata
- `imageFileNames.json` — flat list of all image filenames

### Project Structure

```
src/
├── index.ts
├── constants.ts
├── lib/
│   ├── index.ts
│   └── habiticaAvatarManifestService.ts
├── scripts/
│   ├── constants.ts
│   ├── habiticaContentProvider.ts
│   ├── habiticaProcessor.ts
│   └── imagesDetailsProvider.ts
└── types/
    ├── habitica-content.ts
    ├── manifest.ts
    └── index.ts
```

## Automated Updates

The manifest is regenerated daily at 6:00 AM UTC via GitHub Actions and committed automatically. Manual runs can be triggered via `workflow_dispatch`.

## License

ISC — see [LICENSE](LICENSE).

---

Not affiliated with Habitica. Uses the public Habitica API.
