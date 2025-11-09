# Example Usage

Here's how to use the habitica-avatar-manifest library in your projects:

## Installation

```bash
npm install github:anitawlosek/habitica-avatar-manifest#v1.1.0-beta
```

## Basic Usage

```typescript
import { 
  getHabiticaAvatarManifestItems, 
  getHabiticaImagesMeta, 
  type AvatarManifestItems, 
  type ImagesMeta 
} from 'habitica-avatar-manifest';

// Get the complete avatar manifest items
const manifestItems: AvatarManifestItems = await getHabiticaAvatarManifestItems();

// Access different avatar categories
console.log(manifestItems.background); // All backgrounds
console.log(manifestItems.gear.weapon); // All weapons
console.log(manifestItems.hair.color); // All hair colors
console.log(manifestItems.buff); // Buff items (snowballs, sparkles, etc.)
console.log(manifestItems.sleep); // Sleep mode

// Get image metadata (if available)
const imagesMeta: ImagesMeta = await getHabiticaImagesMeta();
console.log(imagesMeta['background_beach.png']); // { fileName: 'background_beach.png', width: 512, height: 512, format: 'png' }
```

## Working with Gear Sets

```typescript
const manifestItems = await getHabiticaAvatarManifestItems();

// Find all gear sets
const gearSets = manifestItems.gear.sets;
console.log(Object.keys(gearSets)); // ['animal', 'wizard', ...]

// Get all items in the 'animal' set
const animalSetItems = gearSets.animal;
console.log(animalSetItems); // ['armor_animal_bear', 'head_animal_bear']

// Get details for a specific gear item
const bearArmor = manifestItems.gear.armor['armor_animal_bear'];
console.log(bearArmor.text); // "Bear Armor"
console.log(bearArmor.imageFileNames); // ['broad_armor_animal_bear', 'slim_armor_animal_bear', 'shop_armor_animal_bear']
```

## Image URL Construction

```typescript
const S3_BASE_URL = 'https://habitica-assets.s3.amazonaws.com/mobileApp/images';

function getImageUrl(imageFileName: string, format: 'png' | 'gif' = 'png'): string {
  return `${S3_BASE_URL}/${imageFileName}.${format}`;
}

// Example usage
const manifestItems = await getHabiticaAvatarManifestItems();
const beachBackground = manifestItems.background.beach;

// Get all image URLs for this item
const imageUrls = beachBackground.imageFileNames.map(fileName => getImageUrl(fileName));
console.log(imageUrls); 
// [
//   'https://habitica-assets.s3.amazonaws.com/mobileApp/images/background_beach.png',
//   'https://habitica-assets.s3.amazonaws.com/mobileApp/images/icon_background_beach.png'
// ]

// Get a specific image (first one)
const primaryImageUrl = getImageUrl(beachBackground.imageFileNames[0]);
console.log(primaryImageUrl); // https://habitica-assets.s3.amazonaws.com/mobileApp/images/background_beach.png
```

## Working with New Item Categories

```typescript
const manifestItems = await getHabiticaAvatarManifestItems();

// Access buff items (special effects)
console.log(manifestItems.buff.snowball_wizard); 
// { key: 'snowball_wizard', text: 'Snowball (Wizard)', imageFileNames: ['avatar_snowball_wizard'] }

// Access sleep mode
console.log(manifestItems.sleep.true);
// { key: 'true', text: 'Sleep mode', imageFileNames: ['zzz'] }

// Work with hair items that have color variations
const blackHair = manifestItems.hair.color.black;
const curlyHair = manifestItems.hair.base.curly;
console.log(curlyHair.imageFileNames); // Multiple color variations for this hair style
```

## Error Handling

```typescript
import { getHabiticaAvatarManifestItems } from 'habitica-avatar-manifest';

try {
  const manifestItems = await getHabiticaAvatarManifestItems();
  // Use manifestItems...
} catch (error) {
  console.error('Failed to load Habitica manifest:', error);
  // Handle error appropriately - maybe show cached data or retry
}
```