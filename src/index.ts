import { generateAvatarManifest } from './scripts/habiticaProcessor';
import type { HabiticaContent } from './types/habitica-content';
import { writeFileSync, readFileSync, mkdirSync, existsSync, copyFileSync } from 'fs';
import { fetchHabiticaContent } from './scripts/habiticaContentProvider';
import { ImagesMeta } from './types';
import { getImagesMeta, handleAddedAndRemovedImages } from './scripts/imagesDetailsProvider';
import { OUTPUT_DIR, IMAGE_FILE_NAMES, IMAGES_META_FILE, ITEMS_DETAILS_FILE, PREV_VERSION } from './constants';

// Get Habitica content data
const habiticaData = await fetchHabiticaContent();

// Create avatar manifest
const manifest = await generateAvatarManifest(habiticaData as HabiticaContent);

// Check if there is directory to write files
// If not, create it
if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    //copy files from previous version
    const previousVersion = `output/${PREV_VERSION}/`;
    if (existsSync(previousVersion)) {
        copyFileSync(`${previousVersion}/imagesMeta.json`, IMAGES_META_FILE);
        copyFileSync(`${previousVersion}/imageFileNames.json`, IMAGE_FILE_NAMES);
    }
}

// Write avatar manifest items to file
writeFileSync(ITEMS_DETAILS_FILE, JSON.stringify(manifest.items, null, 2));

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
