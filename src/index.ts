import { generateAvatarManifest } from './scripts/habiticaProcessor';
import type { HabiticaContent } from './types/habitica-content';
import { writeFileSync, readFileSync } from 'fs';
import { fetchHabiticaContent } from './scripts/habiticaContentProvider';
import { ImagesMeta } from './types';
import { getImagesMeta, handleAddedAndRemovedImages } from './scripts/imagesDetailsProvider';

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

    if (addedImages.length > 0 || removedImages.length > 0) {
        const updatedImagesMeta = await handleAddedAndRemovedImages(
            JSON.parse(readFileSync(IMAGES_META_FILE, 'utf-8')),
            addedImages,
            removedImages,
            newImageList
        );

        writeFileSync(IMAGES_META_FILE, JSON.stringify(updatedImagesMeta, null, 2));
        writeFileSync(IMAGE_FILE_NAMES, JSON.stringify(newImageList, null, 2));
    }
}

console.log('✅ Avatar manifest generated!');
