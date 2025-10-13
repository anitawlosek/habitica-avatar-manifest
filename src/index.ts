import { generateAvatarManifest } from './scripts/habiticaProcessor';
import type { HabiticaContent } from './types/habitica-content';
import { writeFileSync } from 'fs';
import { fetchHabiticaContent } from './scripts/habiticaContentProvider';

const habiticaData = await fetchHabiticaContent();

const manifest = generateAvatarManifest(habiticaData as HabiticaContent);

writeFileSync('output/avatarManifest.json', JSON.stringify(manifest, null, 2));
console.log('✅ Avatar manifest generated!');
