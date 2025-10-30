import { IMAGES_META_FILE, MANIFEST_FILE, IMAGE_FILE_NAMES } from "../constants.js";
const GITHUB_URL_BASE = `https://raw.githubusercontent.com/anitawlosek/habitica-avatar-manifest/refs/heads/main`;
async function getJsonFromUrl(file) {
    const response = await fetch(`${GITHUB_URL_BASE}/${file}`);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}
export async function getHabiticaAvatarManifest() {
    return getJsonFromUrl(MANIFEST_FILE);
}
export async function getHabiticaImagesMeta() {
    return getJsonFromUrl(IMAGES_META_FILE);
}
export async function getHabiticaImageFileNames() {
    return getJsonFromUrl(IMAGE_FILE_NAMES);
}
//# sourceMappingURL=habiticaAvatarManifestService.js.map