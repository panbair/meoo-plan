# web-e2e architecture and optimization notes

This document summarizes the current design of `src/views/web-e2e/index.vue` and the latest professional-grade hardening work.

## Architecture overview

- `index.vue`: orchestration layer for AI generation, AI modification, preview rendering, telemetry, and history.
- `components/E2EInputSidebar.vue`: requirement input, template selection, recommendation, and generate trigger.
- `components/E2EPreviewToolbar.vue`: tab switcher + preview controls + copy/download.
- `components/E2EChatBar.vue`: modify-by-chat interaction, assistant feedback, and undo entry point.
- `components/E2EHistoryPanel.vue`: local history drawer and replay controls.
- `composables/useE2EHistory.ts`: localStorage-backed history persistence.
- `composables/useRunGuard.ts`: stale-run protection token.
- `composables/useE2ERunState.ts`: explicit lifecycle state machine.
- `composables/useE2EKeyboardShortcuts.ts`: shortcut wiring (`Cmd/Ctrl+Enter`, `Cmd/Ctrl+C`).
- `composables/useE2EDraft.ts`: debounced draft persistence and restore.
- `composables/useE2EGenerationController.ts`: generation/modify orchestration, streaming guards, preview scheduling, and undo flow.
- `composables/useE2ETemplateAdvisor.ts`: template selection toggle, lazy source/README loading, and AI analysis.

## Latest optimization pass (professional hardening)

### 1) Reliability and race-condition fixes

- Added stale-run protection in the `handleModify()` catch path to avoid old async failures overwriting current state.
- Centralized streaming message updates with index guards (`updateStreamingMessage`) to prevent out-of-range writes.
- Reset stream render clock per run, avoiding cross-run throttling side effects.

### 2) Preview performance stabilization

- Introduced scheduled preview rendering (`schedulePreviewRender`) with de-duplication and short debounce.
- Replaced repeated direct `setCode()` calls in stream/watch/history paths to reduce iframe rewrite pressure.
- Added cleanup for pending preview timers on unmount.

### 3) UX and safety upgrades

- Added minimum prompt-length validation before generation.
- Added safer primary code extraction for both `single-html` and `multi-file` responses.
- Improved clipboard logic with secure-context check + explicit fallback failure feedback.

### 4) Draft persistence

- Added local draft persistence for core inputs and generation preferences.
- Added draft restoration on mount to improve continuity after refresh.

### 5) History and memory hygiene

- Save generated history using resolved final code (not only `result.html`).
- Trim in-memory chat history to a bounded window to avoid long-session memory growth.

## Known design trade-offs

- Template recommendations are not auto-refetched on draft restore to avoid unexpected background AI requests.
- Preview debouncing prioritizes UI smoothness; there can be a slight delay during very high-frequency streams.

## Local verification used in this workspace

```powershell
npm run type-check
npm run test:unit
```

Test status at update time:

- Type-check: passed
- Unit + integration tests: all web-e2e tests passed (8 files / 17 tests)

## Second-wave test coverage

Added `src/views/web-e2e/composables/__tests__/webE2EFlow.integration.test.ts` to verify page-level orchestration behaviors with mocked AI and preview dependencies:

- generate -> stream -> final render flow
- modify -> stream -> final render flow
- undo last modify snapshot restore
- history drawer restore of older generated result

Added `src/views/web-e2e/composables/__tests__/useE2EDraft.test.ts` to verify:

- debounced draft saving behavior
- safe draft restore behavior from localStorage

Added `src/views/web-e2e/composables/__tests__/useE2EGenerationController.test.ts` to verify:

- generate flow state transitions + history callback
- modify + undo behavior around code snapshots

## Third-wave refactor notes

- `index.vue` now acts as a thin page shell.
- Heavy async flow logic moved to `useE2EGenerationController.ts`.
- Draft storage logic moved to `useE2EDraft.ts`.
- History clear action now uses persistence-aware clear handler.

## Fourth-wave refactor notes

- Template selection + AI analysis logic extracted to `useE2ETemplateAdvisor.ts`.
- `index.vue` `<script setup>` now only contains composable wiring, watchers, and two utility functions (download, copy).
- Added `useE2ETemplateAdvisor.test.ts` with 4 cases: select, toggle-off, AI error handling, and `clearTemplate`.

## Sixth-wave generator hardening notes

- Optimized `src/api/ai/e2e-generator.ts` prompt payload strategy:
  - full GSAP guidance kept for first panel
  - compact GSAP guidance used for subsequent panels
  - component summary reduced from 15 to 8 items and compressed format
- Added panel-level telemetry logs: per-panel generated length + latency (`ms`).
- Strengthened validation and post-assembly sanitization:
  - auto-fix common malformed output (`classicon`, invalid `style=":rgba(...)`, `margin-top:px`)
  - auto-inject `:root` variables when CSS vars are used but root block is missing
  - validator warns on excessive `gsap.registerPlugin(...)` duplication

## Seventh-wave quality instrumentation notes

- Introduced a rule-based HTML sanitization engine in `src/api/ai/e2e-generator.ts`:
  - reusable `HTML_SANITIZE_RULES` list
  - structured sanitization report (`totalFixes`, `rootInjected`, per-rule hit counts)
  - assembly/template paths both run through the same sanitization pipeline
- Validation now consumes sanitization report and emits operational warnings for auto-fix activity.
- Added generator regression test: `src/api/ai/__tests__/e2e-generator.sanitize.test.ts`.
- Current workspace verification:
  - `npx vitest run src/api/ai/__tests__/e2e-generator.sanitize.test.ts`
  - `npm run type-check`
  - `npm run test:unit`

## Eighth-wave diagnostics exposure notes

- Stream protocol now supports `telemetry` events in `src/api/ai/index.ts` and `src/api/ai/e2e-generator.ts`.
- `e2e-generator` emits:
  - per-panel metric telemetry (`panelName`, `panelIndex`, `outputLength`, `durationMs`, `retries`)
  - validation telemetry (`score`, `passed`, `sanitizeFixes`, rule hits)
- `useE2EGenerationController.ts` now aggregates telemetry into `diagnostics` state.
- `index.vue` status bar now shows diagnostics summary:
  - panel count
  - average panel duration
  - auto-fix count

## Ninth-wave observability UX notes

- `useE2EGenerationController.ts` diagnostics model expanded with:
  - `sanitizeRuleHits`
  - `issueCount` / `warningCount`
- `index.vue` now includes an in-sidebar diagnostics block showing:
  - per-panel latency/output metrics
  - slowest panel summary
  - sanitize rule hit breakdown
- Added diagnostics JSON export from status bar (`导出诊断`) for offline analysis and benchmarking.

## Tenth-wave dashboard notes

- Added an in-page diagnostics dashboard block in `src/views/web-e2e/index.vue` sidebar:
  - panel-by-panel latency/output/retry list
  - slowest panel summary
  - sanitize rule hit list
  - issue/warning counters
- Status bar diagnostics summary now includes:
  - panel count
  - average panel latency
  - sanitize fix count
  - one-click diagnostics export (`e2e-diagnostics-*.json`)














