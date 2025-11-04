import { IMAGES_META_FILE, ITEMS_DETAILS_FILE, IMAGE_FILE_NAMES } from "../constants";
import { AvatarManifestItems, ImagesMeta } from "../types/manifest";

const GITHUB_URL_BASE = `https://raw.githubusercontent.com/anitawlosek/habitica-avatar-manifest/refs/heads/main`;

async function getJsonFromUrl<T>(file: string): Promise<T> {
  const response = await fetch(`${GITHUB_URL_BASE}/${file}`);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data: T = await response.json();
  return data;
}

export async function getHabiticaAvatarManifestItems(): Promise<AvatarManifestItems> {
    return getJsonFromUrl<AvatarManifestItems>(ITEMS_DETAILS_FILE);
}

export async function getHabiticaImagesMeta() {
    return getJsonFromUrl<ImagesMeta>(IMAGES_META_FILE);
}

export async function getHabiticaImageFileNames() {
    return getJsonFromUrl<string[]>(IMAGE_FILE_NAMES);
}