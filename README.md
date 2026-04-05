# Habitica Avatar Manifest

> **Preprocessed, structured Habitica avatar data including sprites, items, and metadata, ready for use in apps and frontend projects.**

[![Generate Habitica Avatar Manifest](https://github.com/anitawlosek/habitica-avatar-manifest/actions/workflows/generate.yml/badge.svg)](https://github.com/anitawlosek/habitica-avatar-manifest/actions/workflows/generate.yml)

This project provides a clean, structured JSON manifest of all Habitica avatar customization options by fetching data from the official Habitica API and transforming it into a developer-friendly format. Perfect for building avatar creators, character visualizers, or any app that needs Habitica avatar data.

## 🚀 What You Get

- **📦 Single JSON file** (~855KB) with all avatar items and metadata
- **🎨 26,000+ lines** of structured avatar data
- **🔄 Daily updates** via automated GitHub Actions
- **📱 Frontend-optimized** data structure
- **🎯 TypeScript definitions** included
- **🖼️ Image metadata** with dimensions and format detection

## 📋 Features

### Avatar Categories Included
- **Backgrounds** - All available background scenes
- **Gear** - Weapons, armor, accessories organized by type and sets
- **Eggs** - All hatchable eggs with mount text metadata
- **Hatching Potions** - All hatching potions, including premium and wacky variants
- **Pets** - All collectible pets with metadata
- **Pet Tree** - Relational map of pets organized by egg, hatching potion, and special pets
- **Mounts** - All rideable mounts
- **Mount Tree** - Relational map of mounts organized by egg, hatching potion, and special mounts
- **Hair** - Colors, styles, bangs, flowers, beards, mustaches
- **Body** - Shirt styles and body sizes (slim/broad)
- **Skin** - All available skin tones
- **Chair** - Wheelchair and accessibility options
- **Buff** - Special effect items (snowballs, sparkles, seeds, etc.)
- **Sleep** - Sleep mode indicator

### Data Structure
All items follow a consistent `ItemMeta` structure:
```typescript
{
  key: string;             // Unique identifier
  text: string;            // Display name
  imageFileNames: string[]; // Array of image file references
  notes?: string;
  price?: number;
  currency?: string;
  set?: string;
}
```

#### Extended Types

**`EggItemMeta`** (used in `egg`):
```typescript
{
  // ...ItemMeta
  mountText: string; // Display name for the hatched mount
}
```

**`HatchingPotionItemMeta`** (used in `hatchingPotion`):
```typescript
{
  // ...ItemMeta
  premium: boolean; // Whether this is a premium potion
  wacky?: boolean;  // Whether this is a wacky/limited potion
}
```

**`StableTree`** (used in `petTree` and `mountTree`):
```typescript
{
  byEgg: Record<string, string[]>;            // egg id → list of pet/mount ids
  byHatchingPotion: Record<string, string[]>; // hatchingPotion id → list of pet/mount ids
  special: string[];                          // ids not hatched from eggs
}
```

### Image Metadata (Optional)
When generated with `--all-images` flag, includes detailed image information:
```typescript
{
  fileName: string;      // Full filename with extension
  width: number;         // Image width in pixels
  height: number;        // Image height in pixels
  format: 'png' | 'gif'; // Image format
}
```

### Special Features
- **Gear Sets**: Automatically groups gear items into sets (minimum 2 items per set)
- **Performance Optimized**: Uses concurrent image probing with p-limit (10 concurrent requests)
- **Image Format Detection**: Automatically detects PNG and GIF formats
- **Hierarchical Hair**: Complex nested structure for hair customization options
- **Type Safety**: Full TypeScript definitions for both input and output data

## 🛠️ Usage

### As a Package (Recommended)
```bash
npm install github:anitawlosek/habitica-avatar-manifest#v1.2.1
```

```typescript
import {
  getHabiticaAvatarManifestItems, 
  getHabiticaImagesMeta,
  type AvatarManifestItems, 
  type ItemMeta 
} from 'habitica-avatar-manifest';

// Fetch the latest manifest directly from GitHub
const manifestItems: AvatarManifestItems = await getHabiticaAvatarManifestItems();

// Get image metadata (if generated with --all-images)
const imagesMeta = await getHabiticaImagesMeta();

// Access avatar data
console.log(manifestItems.background.beach); // Beach background item
console.log(manifestItems.gear.sets.animal); // Animal gear set items
```

### Direct Download
Download the latest files from the [output directory](./output/1.2.1/) or directly from the repository:
- `avatarManifestItems.json` - Main manifest data
- `imagesMeta.json` - Image metadata 
- `imageFileNames.json` - Image filename list

### Example Data Structure
```json
{
  "background": {
    "beach": {
      "key": "beach",
      "text": "Beach",
      "imageFileNames": ["background_beach", "icon_background_beach"]
    }
  },
  "gear": {
    "sets": {
      "animal": ["armor_animal_bear", "head_animal_bear"]
    },
    "weapon": { /* ... */ },
    "armor": { /* ... */ }
  },
  "egg": {
    "Wolf": {
      "key": "Wolf",
      "text": "Wolf Egg",
      "mountText": "Wolf",
      "imageFileNames": ["Pet_Egg_Wolf"]
    }
  },
  "hatchingPotion": {
    "Base": {
      "key": "Base",
      "text": "Base Potion",
      "premium": false,
      "imageFileNames": ["Pet_HatchingPotion_Base"]
    },
    "Vampire": {
      "key": "Vampire",
      "text": "Vampire Potion",
      "premium": true,
      "wacky": true,
      "imageFileNames": ["Pet_HatchingPotion_Vampire"]
    }
  },
  "petTree": {
    "byEgg": {
      "Wolf": ["Wolf-Base", "Wolf-CottonCandyBlue", "Wolf-Vampire"]
    },
    "byHatchingPotion": {
      "Base": ["Wolf-Base", "TigerCub-Base"]
    },
    "special": ["Wolf-Veteran", "BearCub-Polar"]
  },
  "mountTree": {
    "byEgg": {
      "Wolf": ["Wolf-Base", "Wolf-CottonCandyBlue", "Wolf-Vampire"]
    },
    "byHatchingPotion": {
      "Base": ["Wolf-Base", "TigerCub-Base"]
    },
    "special": ["Gryphon-RoyalPurple", "Aether-Invisible"]
  },
  "hair": {
    "color": { /* ... */ },
    "base": { /* ... */ },
    "bangs": { /* ... */ }
  },
  "buff": {
    "snowball_wizard": {
      "key": "snowball_wizard",
      "text": "Snowball (Wizard)",
      "imageFileNames": ["avatar_snowball_wizard"]
    }
  },
  "sleep": {
    "true": {
      "key": "true",
      "text": "Sleep mode",
      "imageFileNames": ["zzz"]
    }
  }
}
```

## 🔧 Development

### Prerequisites
- Node.js 18+
- TypeScript

### Setup
```bash
git clone https://github.com/anitawlosek/habitica-avatar-manifest.git
cd habitica-avatar-manifest
npm install
```

### Generate Manifest

#### Basic Generation (Recommended)
```bash
npm run generate
```

Generates the manifest without image metadata probing. This is faster and suitable for most use cases.

#### Full Generation with Image Metadata
```bash
npm run generate:all-images
```

This will:
1. Fetch latest data from Habitica API (`/api/v3/content`)
2. Transform and normalize the data structure
3. Probe all image URLs for dimensions and format
4. Output files to the versioned `output/1.2.1/` directory:
   - `avatarManifestItems.json` - Main manifest data
   - `imagesMeta.json` - Image metadata (dimensions, format)
   - `imageFileNames.json` - List of all image filenames

**Note**: Full generation with image metadata can take 10+ minutes due to the large number of images (~30,000+ URLs to check).

### Project Structure
```
src/
├── index.ts                         # Main entry point
├── constants.ts                     # Version and output paths
├── lib/                             # Library exports for npm package
│   ├── index.ts                     # Main library export
│   └── habiticaAvatarManifestService.ts  # Service functions
├── scripts/
│   ├── constants.ts                 # Static data (buffs, sleep items)
│   ├── habiticaContentProvider.ts   # API client
│   ├── habiticaProcessor.ts         # Data transformation logic
│   └── imagesDetailsProvider.ts     # Image metadata detection
└── types/
    ├── habitica-content.ts          # Input API types
    ├── manifest.ts                  # Output manifest types
    └── index.ts                     # Type exports
```

## 🤖 Automated Updates

The manifest is automatically updated daily at 8:00 AM UTC via GitHub Actions. The workflow:
- Fetches the latest Habitica API data
- Regenerates the manifest (without image metadata for performance)
- Commits changes with `[skip ci]` tag

Manual updates can be triggered via the GitHub Actions "workflow_dispatch" event.

## � Library API

### Functions

- **`getHabiticaAvatarManifestItems()`** - Fetches the complete avatar manifest items from GitHub
- **`getHabiticaImagesMeta()`** - Fetches image metadata (dimensions, format)  
- **`getHabiticaImageFileNames()`** - Fetches list of all image filenames

### Data Sources

All data is fetched directly from this repository's GitHub releases:
- `https://raw.githubusercontent.com/anitawlosek/habitica-avatar-manifest/main/output/1.2.1/avatarManifestItems.json`
- `https://raw.githubusercontent.com/anitawlosek/habitica-avatar-manifest/main/output/1.2.1/imagesMeta.json`
- `https://raw.githubusercontent.com/anitawlosek/habitica-avatar-manifest/main/output/1.2.1/imageFileNames.json`

This ensures you always get the latest data without needing to update the package. Output files are versioned to maintain backward compatibility.

## �📄 TypeScript Support

Full TypeScript definitions are included:

```typescript
// Library functions
import { getHabiticaAvatarManifestItems, getHabiticaImagesMeta } from 'habitica-avatar-manifest';

// Output types (processed manifest)
import type {
  AvatarManifestItems,
  ItemMeta,
  GearItems,
  ImageMeta,
  StableTree,
  EggItemMeta,
  HatchingPotionItemMeta,
  StableItemMeta,
} from 'habitica-avatar-manifest';
```

For detailed usage examples, see [USAGE.md](./USAGE.md).

## 📜 License

ISC License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Habitica](https://habitica.com) for providing the public API
- The Habitica community for creating amazing avatar content
- [probe-image-size](https://github.com/nodeca/probe-image-size) for efficient image metadata detection
- [p-limit](https://github.com/sindresorhus/p-limit) for concurrency control

---

**Note**: This project is not officially affiliated with Habitica. It's an independent tool that uses Habitica's public API to provide structured data for developers.