import { generateAvatarManifest } from './scripts/habiticaProcessor';
import type { HabiticaContent } from './types/habitica-content';
import { writeFileSync, readFileSync } from 'fs';
import { fetchHabiticaContent } from './scripts/habiticaContentProvider';
import { ImagesMeta } from './types';
import { getImagesMeta } from './scripts/imagesDetailsProvider';

const VERSION = '1.0.1';
const OUTPUT_DIR = 'output';
const MANIFEST_FILE = `${OUTPUT_DIR}/avatarManifest-${VERSION}.json`;
const IMAGE_FILE_NAMES = `${OUTPUT_DIR}/imageFileNames-${VERSION}.json`;
const IMAGES_META_FILE = `${OUTPUT_DIR}/imagesMeta-${VERSION}.json`;

// Get Habitica content data
const habiticaData = await fetchHabiticaContent();

// Create avatar manifest
const manifest = await generateAvatarManifest(habiticaData as HabiticaContent);

writeFileSync(MANIFEST_FILE, JSON.stringify(manifest.items, null, 2));

// Regenerate images manifest only for all images if --all-images flag is provided
if (process.argv.includes('--all-images')) {
    const allImagesMeta: ImagesMeta = await getImagesMeta(manifest.imageFileNames);

    writeFileSync(IMAGES_META_FILE, JSON.stringify(allImagesMeta, null, 2));
} else {
    // Check for new or removed images compared to previous image list
    const previousImageList: string[] = JSON.parse(readFileSync(IMAGE_FILE_NAMES, 'utf-8'));
    const newImageList = manifest.imageFileNames;

    const addedImages = newImageList.filter(image => !previousImageList.includes(image));
    const removedImages = previousImageList.filter(image => !newImageList.includes(image));

    if (addedImages.length > 0) {
        // Generate images meta for new images only
        console.log('✅ Added images:', addedImages);
        const newImagesMeta: ImagesMeta = await getImagesMeta(addedImages);

        // Merge previous and new images manifest
        const previousImagesMeta: ImagesMeta = JSON.parse(readFileSync(IMAGES_META_FILE, 'utf-8'));
        const mergedImagesMeta = Object.assign(newImagesMeta, previousImagesMeta);

        writeFileSync(IMAGES_META_FILE, JSON.stringify(mergedImagesMeta, null, 2));
    }

    if (removedImages.length > 0) {
        console.log('❌ Removed images:', removedImages);
    }
}

writeFileSync(IMAGE_FILE_NAMES, JSON.stringify(manifest.imageFileNames, null, 2));


console.log('✅ Avatar manifest generated!');
