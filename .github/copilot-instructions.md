# Habitica Avatar Manifest - AI Coding Agent Instructions

## Overview
This project generates a preprocessed, structured manifest of Habitica's avatar customization data by fetching from the Habitica API and transforming it into a developer-friendly format. The output is a single JSON file containing all avatar items with metadata.

## Architecture & Data Flow

### Core Pipeline
1. **Data Fetching** (`habiticaContentProvider.ts`) → **Processing** (`habiticaProcessor.ts`) → **Output** (`avatarManifest.json`)
2. Entry point: `src/index.ts` orchestrates the entire pipeline
3. Output: Single manifest JSON file in `output/` directory with structured avatar data

### Key Components
- **`HabiticaContent`** (input): Raw API response types from Habitica's `/api/v3/content` endpoint
- **`AvatarManifest`** (output): Processed, normalized data structure with consistent `ItemMeta` format
- **Type System**: Separate type definitions for input (`habitica-content.d.ts`) and output (`manifest.d.ts`)

## Critical Patterns

### ItemMeta Standardization
All avatar items are normalized to this consistent structure:
```typescript
type ItemMeta = {
  key: string;        // Unique identifier
  text: string;       // Display name
  imageFileName: string; // Always {key}.png format
}
```

### Image Metadata Management
- All images assumed to be 512x512 PNG (with GIF support)
- `createImageMeta()` function deduplicates image references
- Images are referenced by fileName, not stored inline

### Gear Set Processing
- Filters gear sets to only include sets with ≥2 items
- Organizes gear by type (weapon, armor, head, etc.) AND by sets
- Special handling for `gearFlat` structure from Habitica API

## Development Workflows

### Build & Generate
```bash
npm run generate  # Runs tsx ./src/index.ts
```

### Automated Updates
- GitHub Actions runs daily at 2 AM UTC (`generate.yml`)
- Auto-commits updated manifest files with `[skip ci]` tag
- Uses `workflow_dispatch` for manual triggers

## Type System Conventions

### Input Types (`habitica-content.d.ts`)
- Prefix with `Habitica` (e.g., `HabiticaGearItem`, `HabiticaPet`)
- Mirror Habitica API structure exactly
- Complex nested types for appearances, gear trees, etc.

### Output Types (`manifest.d.ts`)
- Clean, flat structures optimized for frontend consumption
- Consistent naming without prefixes
- Specialized types like `GearItems`, `HairItems`, `BodyItems`

## Key Files & Responsibilities

- **`src/index.ts`**: Main orchestrator, minimal logic
- **`habiticaContentProvider.ts`**: API client with proper headers (`x-client` required)
- **`habiticaProcessor.ts`**: Core transformation logic, contains all processing functions
- **`output/avatarManifest.json`**: Generated artifact (~26k lines), committed to repo
- **Type definitions**: Separate files for API contracts vs. output contracts

## Special Considerations

### API Integration
- Habitica API requires `x-client` header with app identifier
- Error handling for network failures
- No authentication needed for content endpoint

### Processing Logic
- Hair items have complex nested structure (color, base, bangs, flower, beard, mustache)
- Body size has only two options: slim/broad (special handling)
- Background processing includes set information from `backgroundsFlat`
- Gear processing involves flattening complex nested class/type structure

### Version Management
- Manifest includes version field (currently "1.0.0")
- `generatedAt` field commented out but available for timestamps
- Package version is alpha stage (0.0.1-alpha)