// index.ts
import { join } from 'path';
import { generateAvatarManifest } from './scripts/habiticaProcessor.ts';
import type { HabiticaContent } from './types/habitica-content';
import { readFileSync, writeFileSync } from 'fs';

const contentPath = join(process.cwd(), 'input/content.json');
const habiticaData = JSON.parse(readFileSync(contentPath, 'utf-8'));

const manifest = generateAvatarManifest(habiticaData as HabiticaContent);

writeFileSync('output/avatarManifest.json', JSON.stringify(manifest, null, 2));
console.log('✅ Avatar manifest generated!');
