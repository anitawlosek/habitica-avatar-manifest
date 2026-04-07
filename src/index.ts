import { generateAvatarManifest } from './scripts/habiticaProcessor';
import type { HabiticaContent } from './types/habitica-content';
import { writeFileSync, readFileSync, mkdirSync, existsSync, copyFileSync } from 'fs';
import { fetchHabiticaContent } from './scripts/habiticaContentProvider';
import { ImagesMeta } from './types';
import { getImagesMeta, handleAddedAndRemovedImages } from './scripts/imagesDetailsProvider';
import { OUTPUT_DIR, IMAGE_FILE_NAMES, IMAGES_META_FILE, ITEMS_DETAILS_FILE, PREV_VERSION, HABITICA_CONTENT_FILE } from './constants';
import { AvatarManifestItems } from './types/manifest';
import { mergeManifestItems } from './scripts/manifestMerger';
import { validateRemovedImages } from './scripts/removedImagesValidator';

const cleanAPIState = process.argv.includes('--clean');
const shouldGenerateAllImages = process.argv.includes('--all-images');

// Get Habitica content data
const habiticaData = await fetchHabiticaContent();

// Create avatar manifest
const manifest = await generateAvatarManifest(habiticaData as HabiticaContent);

// Check if there is directory to write files
// If not, create it
if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    //copy files from previous version
    const previousVersionDir = `output/${PREV_VERSION}/`;

    if (existsSync(previousVersionDir)) {
        copyFileSync(`${previousVersionDir}/imagesMeta.json`, IMAGES_META_FILE);
        copyFileSync(`${previousVersionDir}/imageFileNames.json`, IMAGE_FILE_NAMES);
    }
}

let manifestItems = manifest.items;
// If not clean API state, merge with existing items to preserve items missing from API (e.g. due to Habitica API bugs)
if (!cleanAPIState && existsSync(ITEMS_DETAILS_FILE)) {
    const existingItems: AvatarManifestItems = JSON.parse(readFileSync(ITEMS_DETAILS_FILE, 'utf-8'));
    manifestItems = mergeManifestItems(existingItems, manifest.items);
}

// Write avatar manifest items to file
writeFileSync(ITEMS_DETAILS_FILE, JSON.stringify(manifestItems, null, 2));

// Regenerate images manifest only for all images if --all-images flag is provided
if (shouldGenerateAllImages) {
    const allImagesMeta: ImagesMeta = await getImagesMeta(manifest.imageFileNames);

    writeFileSync(IMAGES_META_FILE, JSON.stringify(allImagesMeta, null, 2));
} else {
    // Check for new or removed images compared to previous image list
    const previousImageList: string[] = JSON.parse(readFileSync(IMAGE_FILE_NAMES, 'utf-8'));
    const newImageList = manifest.imageFileNames;

    const addedImages = newImageList.filter(image => !previousImageList.includes(image));
    const removedImages = previousImageList.filter(image => !newImageList.includes(image));

    if (addedImages.length > 0 || removedImages.length > 0) {
        let updatedImagesMeta;

        if (cleanAPIState) {
            updatedImagesMeta = await handleAddedAndRemovedImages(
                JSON.parse(readFileSync(IMAGES_META_FILE, 'utf-8')),
                addedImages,
                removedImages,
                newImageList
            );

            writeFileSync(IMAGE_FILE_NAMES, JSON.stringify(newImageList, null, 2));
        } else {
            // For images no longer in the API response, check S3 before removing —
            // the API sometimes omits items due to bugs, but the images are still there
            const { confirmedRemoved, keptFromRemoved } = await validateRemovedImages(removedImages);
            const combinedImageList = Array.from(new Set([...newImageList, ...keptFromRemoved]));

            updatedImagesMeta = await handleAddedAndRemovedImages(
                JSON.parse(readFileSync(IMAGES_META_FILE, 'utf-8')),
                addedImages,
                confirmedRemoved,
                combinedImageList
            );

            writeFileSync(IMAGE_FILE_NAMES, JSON.stringify(combinedImageList, null, 2));
        }

        writeFileSync(IMAGES_META_FILE, JSON.stringify(updatedImagesMeta, null, 2));
    }
}

console.log('✅ Avatar manifest generated!');
