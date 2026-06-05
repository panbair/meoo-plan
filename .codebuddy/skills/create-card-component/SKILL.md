---
name: create-card-component
description: >
  This skill should be used when the user wants to create a new card animation component
  in the meoo-plan project's web-list directory. It covers the full workflow: determining
  the correct category directory (card-image/card-img/card-text/card-3d/card-time/card-list/card-other),
  generating the Vue SFC file with GSAP+ScrollTrigger boilerplate, generating a README.md
  with the six-layer architecture table, and registering the component in config.ts.
  Trigger phrases include "新建一个组件", "create a component", "add a card component",
  "创建一个卡片组件", "新建动画组件" and similar.
---

# Create Card Component - 创建卡片动画组件

This skill provides the standard workflow for creating a new card animation component
in the `meoo-plan` project's `src/views/web-list/` directory.

## Purpose

To create a new animated card component following the project's established conventions:
correct category placement, Vue SFC with GSAP+ScrollTrigger, README with six-layer
architecture documentation, and proper registration.

## When to Use

Trigger this skill when the user says things like:
- "新建一个 X 效果的组件"
- "在 card-image 下创建一个组件"
- "创建一个卡片动画组件"
- "帮我加一个 X 组件"

## Workflow

### Step 1: Determine the Category Directory

Ask the user which category the component belongs to, or infer from the component's purpose:

| Category | Directory | Name Prefix | Typical Use |
|----------|-----------|-------------|-------------|
| Image Effects | `card-image/` | `CardImage` | 3D image effects, filters, reveal effects |
| Image Interaction | `card-img/` | `CardImg` | Image hover, click, drag interactions |
| Text Effects | `card-text/` | `CardText` | Text animations, typography effects |
| 3D Scenes | `card-3d/` | `Card3d` | Three.js, 3D WebGL scenes |
| Time Animation | `card-time/` | `CardTime` | Timeline, sequence, temporal animations |
| Basic Cards | `card-list/` | `Card` | Standard card layouts, grid displays |
| Other | `card-other/` | (varies) | Miscellaneous, utility components |

**Naming Rule**: Folder name = Vue file name = README directory name. Must be PascalCase.

### Step 2: Read the Vue Template

Read `assets/vue-template.vue` for the complete Vue SFC boilerplate. Adapt it for the
specific component by:

1. Replacing `ComponentName` with the actual component name throughout
2. Adjusting the six-layer DOM structure to match the animation design
3. Implementing the specific GSAP+ScrollTrigger animation logic in `onMounted`
4. Keeping the standard cleanup in `onUnmounted`

### Step 3: Create the Component Files

Create exactly TWO files in the target directory:

```
src/views/web-list/{category}/{ComponentName}/
  ├── {ComponentName}.vue    ← Adapted from assets/vue-template.vue
  └── README.md              ← Adapted from assets/readme-template.md
```

Key conventions to follow (see `references/naming-conventions.md` for details):
- File name MUST match folder name exactly
- Use `<script setup lang="ts">` with Composition API
- Import `gsap` and `ScrollTrigger`, register with `gsap.registerPlugin(ScrollTrigger)`
- Use `ref<HTMLElement>()` for template refs
- Clean up all ScrollTrigger instances in `onUnmounted`
- Six-layer DOM structure with z-index comments
- SCSS scoped styles

### Step 4: Generate README

Adapt `assets/readme-template.md`, filling in:

1. Chinese component name and concept description
2. Six-layer architecture table (Layer 1-6 with content, behavior, z-index)
3. ScrollTrigger linkage tree (what animates at what progress point)
4. Key techniques table
5. Image resources (if any)
6. Usage example

### Step 5: Register in config.ts

Read `src/views/web-list/config.ts` to find the current `componentsList` array.
Add the new component's folder name to the array.

If `componentsList` is empty `[]` (as currently observed), the component will be
auto-discovered by the Vite `import.meta.glob` pattern and adding to the list is optional.

### Step 6: Verify

After creation, verify the following checklist:
- [ ] Vue file uses `<script setup lang="ts">`
- [ ] GSAP and ScrollTrigger are properly imported and registered
- [ ] `onUnmounted` cleans up all ScrollTrigger instances
- [ ] README has six-layer architecture table
- [ ] Folder name, file name, and class name are consistent
- [ ] No suffix number conflicts (scan existing components if using numbered suffixes)
