import { HabiticaContent } from "../types";
import { ImageMeta, ImagesMeta } from "../types/manifest";
import probe from 'probe-image-size';
import pLimit from 'p-limit';

const AMAZON_S3_BASE_URL = 'https://habitica-assets.s3.amazonaws.com/mobileApp/images';

export const getImageFileNames = (settingType: string, value: string | number | boolean, habiticaContent: HabiticaContent): string[] => {
    const fileNames = [];

    switch (settingType) {
        case 'hair.color':
            for (const bang in habiticaContent.appearances.hair.bangs) {
                if (bang == '0') continue;

                fileNames.push(
                    `icon_color_hair_bangs_${bang}_${value}`,
                );
            }
            break;
        case 'hair.base':
        case 'hair.bangs':
        case 'hair.beard':
        case 'hair.mustache':
            if (value == '0') return [];

            for (const color in habiticaContent.appearances.hair.color) {
                fileNames.push(
                    `${settingType.replace('.', '_')}_${value}_${color}`,
                    `icon_${settingType.replace('.', '_')}_${value}_${color}`);
            }
            break;
        case 'hair.flower':
            if (value == '0') break;

            fileNames.push(`icon_hair_flower_${value}`, `hair_flower_${value}`);
            break;
        case 'body.shirt':
            for (const size in habiticaContent.appearances.size) {
                fileNames.push(
                    `${size}_shirt_${value}`,
                    `icon_${size}_shirt_${value}`);
            }
            break;
        case 'body.size':
            for (const shirt in habiticaContent.appearances.shirt) {
                fileNames.push(
                    `${value}_shirt_${shirt}`,
                    `icon_${value}_shirt_${shirt}`);
            }
            break;
        case 'pet':
            fileNames.push(
                `Pet-${value}`,
                `stable_Pet-${value}`);
            break;
        case 'mount':
            fileNames.push(
                `Mount_Head_${value}`,
                `Mount_Body_${value}`,
                `Mount_Icon_${value}`,
                `stable_Mount_Icon_${value}`);
            break;
        case 'gear.armor':
            if (`${value}`.endsWith('_base_0')) return [];

            fileNames.push(`broad_${value}`, `slim_${value}`, `shop_${value}`);
            break;
        case 'gear.head':
        case 'gear.shield':
        case 'gear.weapon':
        case 'gear.back':
        case 'gear.body':
        case 'gear.headAccessory':
        case 'gear.eyewear':
            if (`${value}`.endsWith('_base_0')) return [];

            fileNames.push(`${value}`, `shop_${value}`);
            break;
        case 'skin':
            fileNames.push(`skin_${value}`, `icon_skin_${value}`, `skin_${value}_sleep`);
            break;
        case 'chair':
        case 'background':
        default:
            if (value === 'none') return [];

            fileNames.push(`${settingType}_${value}`, `icon_${settingType}_${value}`);
    }

    return fileNames;
};

// Helper function to probe a single image format
const probeImage = async (url: string, fileName: string, format: 'png' | 'gif'): Promise<ImageMeta | null> => {
    try {
        const result = await probe(url);
        if (result && result.width && result.height) {
            return {
                fileName: `${fileName}.${format}`,
                width: result.width,
                height: result.height,
                format,
            };
        }
    } catch {
        // Image doesn't exist or failed to probe - this is expected for many images
    }

    return null;
};

export const getImagesMeta = async (imageFileNames: string[]): Promise<Record<string, ImageMeta>> => {
    const startTime = Date.now();
    const imageMetas: Record<string, ImageMeta> = {};
    const uniqueFileNames = Array.from(new Set(imageFileNames));

    // Limit concurrent requests to be respectful to the server
    // 10 concurrent requests is a good balance between speed and server load
    const limit = pLimit(10);

    console.log(`Processing ${uniqueFileNames.length} images with max 10 concurrent requests...`);

    const promises = uniqueFileNames.flatMap(fileName => [
        // Check both PNG and GIF formats for each image
        limit(() => probeImage(`${AMAZON_S3_BASE_URL}/${fileName}.png`, fileName, 'png')),
        limit(() => probeImage(`${AMAZON_S3_BASE_URL}/${fileName}.gif`, fileName, 'gif'))
    ]);

    const results = await Promise.all(promises);

    // Filter out null results and add valid images to the result object
    results.forEach((result) => {
        if (result) {
            imageMetas[result.fileName] = result;
        }
    });

    // Check for images that were not found in either format or had both formats
    uniqueFileNames.forEach(fileName => {
        const pngFileName = `${fileName}.png`;
        const gifFileName = `${fileName}.gif`;

        if (!imageMetas[pngFileName] && !imageMetas[gifFileName]) {
            console.log(`Image not found or failed: ${fileName}`);
        } else if (imageMetas[pngFileName] && imageMetas[gifFileName]) {
            console.log(`Both formats found for image: ${fileName}`);
        }
    });

    console.log(`Found ${Object.keys(imageMetas).length} existing images out of ${uniqueFileNames.length} checked URLs`);
    console.log(`Image processing took ${(Date.now() - startTime) / 1000} seconds`);

    return imageMetas;
};

export const handleAddedAndRemovedImages = async (
    previousImagesMeta: Record<string, ImageMeta>,
    addedImages: string[],
    removedImages: string[],
    newImageList: string[],
): Promise<Record<string, ImageMeta>> => {
    const imagesMeta: Record<string, ImageMeta> = previousImagesMeta;

    if (removedImages.length > 0) {
        // Remove deleted images from imagesMeta
        removedImages.forEach(image => {
            delete imagesMeta[`${image}.png`];
            delete imagesMeta[`${image}.gif`];
        });

        console.log('❌ Removed images:', removedImages);
    }

    if (addedImages.length > 0) {
        // Generate images meta for new images only
        const newImagesMeta = await getImagesMeta(addedImages);
        // Add newImagesMeta to imagesMeta
        const mergedImagesData = Object.assign(imagesMeta, newImagesMeta);
        // Sort final imagesMeta by newImageList order
        const sortedImagesData = Object.fromEntries(
            Object.entries(mergedImagesData).sort(([a], [b]) => newImageList.indexOf(a.split('.')[0]) - newImageList.indexOf(b.split('.')[0]))
        );

        console.log('✅ Added images:', addedImages);

        return sortedImagesData;
    }

    return imagesMeta;
}