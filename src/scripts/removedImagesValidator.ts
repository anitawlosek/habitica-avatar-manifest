import { getImagesMeta } from './imagesDetailsProvider';

export type RemovedImagesValidationResult = {
    confirmedRemoved: string[];
    keptFromRemoved: string[];
};

export async function validateRemovedImages(removedImages: string[]): Promise<RemovedImagesValidationResult> {
    if (removedImages.length === 0) {
        return { confirmedRemoved: [], keptFromRemoved: [] };
    }

    const removedImagesMeta = await getImagesMeta(removedImages);
    const stillOnS3 = new Set(
        Object.keys(removedImagesMeta).map(f => f.replace(/\.(png|gif)$/, ''))
    );

    const confirmedRemoved = removedImages.filter(img => !stillOnS3.has(img));
    const keptFromRemoved = removedImages.filter(img => stillOnS3.has(img));

    if (keptFromRemoved.length > 0) {
        console.log('🔒 Kept images still present on S3:', keptFromRemoved);
    }

    return { confirmedRemoved, keptFromRemoved };
}
