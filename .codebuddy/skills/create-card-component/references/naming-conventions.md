# Naming Conventions & Project Structure Reference

## Directory Structure

```
src/views/web-list/
├── config.ts                    # Component registration list
├── index.vue                    # Main display page (6228 lines)
├── card-image/                  # 87 components - CardImage prefix
│   └── CardImage3DAlbum/
│       ├── CardImage3DAlbum.vue
│       └── README.md
├── card-img/                    # 97 components - CardImg prefix
├── card-text/                   # 45 components - CardText prefix
├── card-3d/                     # 9 components - Card3d prefix
├── card-time/                   # 83 components - CardTime prefix
├── card-list/                   # 66 components - Card prefix (no middle word)
└── card-other/                  # 36 components - varied naming
```

## Name Prefix Rules

| Directory | Prefix | Example | Notes |
|-----------|--------|---------|-------|
| `card-image/` | `CardImage` | `CardImage3DAlbum` | Image effects, filters, 3D |
| `card-img/` | `CardImg` | `CardImgBokeh` | Image interaction |
| `card-text/` | `CardText` | `CardTextAurora` | Text effects |
| `card-3d/` | `Card3d` | `Card3dCube` | Three.js/WebGL |
| `card-time/` | `CardTime` | `CardTimeBeat` | Timeline/sequence |
| `card-list/` | `Card` | `CardAurora` | No middle word |
| `card-other/` | (varies) | `KanbanBoard` | No standard prefix |

## Critical Rule

**Folder name = Vue file name = CSS base class name**

Example: `CardImage3DAlbum/CardImage3DAlbum.vue` uses CSS class `.CardImage3DAlbum`

The Vite glob pattern `./card-{type}/*/[^/]*.vue` relies on this convention.
The `dirName` is extracted via regex: `/\/card-image\/([^/]+)\/[^/]+\.vue$/`

## Component Registration

In `src/views/web-list/config.ts`:
```typescript
export const componentsList = []  // Currently empty = all components loaded
```

When adding to the list (if activated), use the folder name:
```typescript
export const componentsList = [
  'CardImage3DAlbum',
  'CardImageNewComponent',
]
```

The `componentsList` acts as an EXCLUDE list - components in the list are filtered out.
With an empty array, ALL glob-discovered components are loaded.

## Vue SFC Conventions

1. `<script setup lang="ts">` - Composition API + TypeScript
2. Import order: vue → gsap → project modules
3. `gsap.registerPlugin(ScrollTrigger)` at top level
4. Props defined with `defineProps<Props>()` and `withDefaults()`
5. Template refs typed with `ref<HTMLElement>()`
6. Canvas refs typed with `ref<HTMLCanvasElement>()`
7. Animation cleanup in `onUnmounted`: `ScrollTrigger.getAll().forEach(st => st.kill())`

## Six-Layer Architecture

All components use a z-index layered structure:

| Layer | z-index | Typical Content |
|-------|---------|-----------------|
| 1 | 1 | Canvas particle background |
| 2 | 2 | 3D stage / main content area |
| 3 | 3 | Center glow / pulse element |
| 4 | 4 | Ground reflection / shadow |
| 5 | 8 | Vignette overlay (radial-gradient) |
| 6 | 14-15 | Text overlay, progress bar, scroll hint |

## Suffix Number Rules (for card-base components)

When creating components in `card-base/` or components with numbered CSS suffixes:
- Suffix numbers must be globally unique across all components
- New suffix = max(all existing suffixes) + 1
- Check for conflicts before finalizing
- Update all CSS class names, GSAP selectors, and template classes
