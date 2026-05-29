<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { templates, firstKey } from './template/registry'

const activeKey = ref(firstKey)
const overlayOpen = ref(false)
const searchQuery = ref('')
const activeSideCat = ref('scrollBasic')
const searchInputRef = ref<HTMLInputElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

// ── 分类分组 ──
const SCROLL_EFFECT_KEYS = new Set([
  'scroll-alternate-slide', 'scroll-blinds-reveal', 'scroll-book-flip',
  'scroll-bullet-screen', 'scroll-card-fan', 'scroll-carousel-ring',
  'scroll-chess-flip', 'scroll-clock-wipe', 'scroll-conveyor-belt',
  'scroll-crossfade-stack', 'scroll-curtain-peel', 'scroll-depth-dive',
  'scroll-diagonal-slide', 'scroll-diamond-path', 'scroll-door-open',
  'scroll-drift-grid', 'scroll-echo-grid', 'scroll-elevator-ride',
  'scroll-film-reel', 'scroll-flat-to-3d', 'scroll-gravity-depression',
  'scroll-h-then-v', 'scroll-helix-tower', 'scroll-infinite-horizontal',
  'scroll-iris-open', 'scroll-lens-focus', 'scroll-loop-conveyor',
  'scroll-magnet-assemble', 'scroll-magnet-pull', 'scroll-matrix-rain',
  'scroll-multi-direction', 'scroll-orbit-grid', 'scroll-orbit-wheel',
  'scroll-origami-unfold', 'scroll-parallax-depth', 'scroll-parallax-layers',
  'scroll-parallax-split', 'scroll-pendulum-grid', 'scroll-pendulum-swing',
  'scroll-picture-in-picture', 'scroll-prism-refract', 'scroll-quad-corner',
  'scroll-radar-scan', 'scroll-ripple-reveal', 'scroll-rotate-reveal',
  'scroll-rubber-stretch', 'scroll-sand-hourglass', 'scroll-scan-reveal',
  'scroll-shutter-split', 'scroll-slot-machine', 'scroll-snake-path',
  'scroll-spiral-in', 'scroll-split-merge', 'scroll-spread-gather',
  'scroll-strobe-freeze', 'scroll-telescope-zoom', 'scroll-typewriter',
  'scroll-u-turn', 'scroll-v-h-v', 'scroll-v-then-h', 'scroll-wave-grid',
  'scroll-zigzag-drift', 'scroll-zoom-lane'
])

const TRANSITION_BASIC_KEYS = new Set([
  'transition-fade', 'transition-slide-h', 'transition-slide-v',
  'transition-scale', 'transition-rotate3d', 'transition-elastic',
  'transition-blur', 'transition-clip', 'transition-fold',
  'transition-flyin', 'transition-spin', 'transition-zoom-blur',
  'transition-wipe', 'transition-swing'
])

const CREATIVE_KEYS = new Set([
  'interstellar', 'liquid-metal', 'cyber-scanner', 'kaleidoscope',
  'neon-city', 'folding-universe', 'memory-fragments', 'light-theater',
  'elemental-portals', 'liquid-sculpture', 'kaleidoscope-world',
  'chrono-gallery', 'storm-eye', 'digital-deconstruction',
  'mirror-world', 'calligraphy-flow', 'metamorphosis',
  'pixel-evolution', 'gravity-shift', 'theater-curtain',
  'dimension-blur', 'z-tunnel', 'gallery-wander', 'mobius-strip',
  'fractal-recursion', 'parallel-universe', 'speed-corridor',
  'cross-hatch', 'spiral-descent', 'elevator-lobby', 'snake-path',
  'cube-navigator', 'double-helix', 'slide-deck', 'timeline-journey',
  'compare-slider', 'feature-tour', 'before-after-reveal', 'catalog-browser'
])

interface CatItem { key: string; label: string; items: typeof templates }
const categories = computed(() => {
  const map: Record<string, CatItem> = {
    scrollBasic: { key: 'scrollBasic', label: '滚动基础', items: [] },
    scrollEffect: { key: 'scrollEffect', label: '滚动特效', items: [] },
    transitionBasic: { key: 'transitionBasic', label: '基础过渡', items: [] },
    transitionCreative: { key: 'transitionCreative', label: '创意过渡', items: [] },
    visualCreative: { key: 'visualCreative', label: '创意视效', items: [] }
  }
  for (const t of templates) {
    if (t.key.startsWith('transition-')) {
      TRANSITION_BASIC_KEYS.has(t.key)
        ? map.transitionBasic.items.push(t)
        : map.transitionCreative.items.push(t)
    } else if (SCROLL_EFFECT_KEYS.has(t.key)) {
      map.scrollEffect.items.push(t)
    } else if (CREATIVE_KEYS.has(t.key)) {
      map.visualCreative.items.push(t)
    } else {
      map.scrollBasic.items.push(t)
    }
  }
  const list = Object.values(map).filter((c) => c.items.length > 0)
  if (!activeSideCat.value || !list.find(c => c.key === activeSideCat.value)) {
    activeSideCat.value = list[0]?.key ?? 'scrollBasic'
  }
  return list
})

// 搜索过滤
const filteredCategories = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return categories.value
  return categories.value
    .map((cat) => ({ ...cat, items: cat.items.filter(t => t.label.toLowerCase().includes(q) || t.key.toLowerCase().includes(q)) }))
    .filter((cat) => cat.items.length > 0)
})

const activeCom = computed(() => {
  const t = templates.find((t) => t.key === activeKey.value)
  return t?.com ?? null
})

const dotColors = ['#FF6B9D', '#4FC3F7', '#FFD54F', '#69F0AE', '#B388FF'] as const
const catEmojis: Record<string, string> = {
  scrollBasic: '📜',
  scrollEffect: '✨',
  transitionBasic: '🔄',
  transitionCreative: '🎬',
  visualCreative: '🌟'
}

function selectTemplate(key: string) {
  activeKey.value = key
  closeOverlay()
}

function closeOverlay() {
  overlayOpen.value = false
  searchQuery.value = ''
  window.scrollTo(0, 0)
  nextTick(() => {
    window.scrollTo(0, 0)
    requestAnimationFrame(() => window.scrollTo(0, 0))
  })
}

function scrollToCat(key: string) {
  activeSideCat.value = key
  nextTick(() => {
    const el = document.getElementById(`cat-section-${key}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

// 键盘快捷键
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && overlayOpen.value) {
    closeOverlay()
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    overlayOpen.value = true
  }
}

// 打开时聚焦搜索
watch(overlayOpen, async (open) => {
  if (open) {
    await nextTick()
    searchInputRef.value?.focus()
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="showcase-root">
    <!-- 浮动触发按钮 -->
    <div class="fab-trigger" @click="overlayOpen = true">
      <div class="fab-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      </div>
      <span class="fab-label">{{ templates.find((t) => t.key === activeKey)?.label }}</span>
      <span class="fab-tip">Ctrl+K</span>
    </div>

    <!-- 全屏覆盖层 -->
    <Teleport to="body">
      <transition name="overlay-slide">
        <div v-if="overlayOpen" class="overlay-root">
          <!-- 左侧栏 -->
          <aside class="overlay-sidebar">
            <div class="sidebar-brand">
              <div class="brand-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </div>
              <div class="brand-text">
                <span class="brand-title">模板库</span>
                <span class="brand-sub">Template Gallery</span>
              </div>
            </div>

            <!-- 搜索 -->
            <div class="sidebar-search">
              <svg class="ss-icon" viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
              <input ref="searchInputRef" v-model="searchQuery" class="ss-input" type="text" placeholder="搜索 131 个模板..." />
              <button v-if="searchQuery" class="ss-clear" @click="searchQuery = ''; searchInputRef?.focus()">Esc</button>
            </div>

            <!-- 分类导航 -->
            <nav class="sidebar-nav">
              <button
                v-for="(cat, ci) in filteredCategories"
                :key="cat.key"
                class="sidenav-item"
                :class="{ active: activeSideCat === cat.key }"
                :style="{ '--cat-color': dotColors[ci % dotColors.length] }"
                @click="scrollToCat(cat.key)"
              >
                <span class="sidenav-emoji">{{ catEmojis[cat.key] || '📦' }}</span>
                <span class="sidenav-label">{{ cat.label }}</span>
                <span class="sidenav-count" :style="{ background: dotColors[ci % dotColors.length] + '22', color: dotColors[ci % dotColors.length] }">{{ cat.items.length }}</span>
              </button>
            </nav>

            <!-- 底部 -->
            <div class="sidebar-footer">
              <span class="sidebar-total">{{ templates.length }} 个模板</span>
              <button class="sidebar-esc" @click="closeOverlay">ESC 关闭</button>
            </div>
          </aside>

          <!-- 右侧内容 -->
          <main ref="contentRef" class="overlay-content">
            <!-- 无结果 -->
            <div v-if="filteredCategories.length === 0" class="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" width="56" height="56">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <p class="empty-title">没有找到匹配的模板</p>
              <p class="empty-desc">试试其他关键词</p>
            </div>

            <!-- 分类内容区 -->
            <section
              v-for="(cat, ci) in filteredCategories"
              :id="`cat-section-${cat.key}`"
              :key="cat.key"
              class="content-section"
            >
              <header class="section-head" :style="{ '--section-color': dotColors[ci % dotColors.length] }">
                <span class="section-emoji">{{ catEmojis[cat.key] || '📦' }}</span>
                <h2 class="section-title" :style="{ backgroundImage: `linear-gradient(135deg, ${dotColors[ci % dotColors.length]}, ${dotColors[(ci + 1) % dotColors.length]})` }">{{ cat.label }}</h2>
                <span class="section-count" :style="{ background: dotColors[ci % dotColors.length] + '18', color: dotColors[ci % dotColors.length], borderColor: dotColors[ci % dotColors.length] + '33' }">{{ cat.items.length }}</span>
                <span class="section-line" :style="{ background: `linear-gradient(90deg, ${dotColors[ci % dotColors.length]}44, transparent)` }"></span>
              </header>
              <div class="section-grid">
                <button
                  v-for="t in cat.items"
                  :key="t.key"
                  class="tpl-card"
                  :class="{ selected: activeKey === t.key }"
                  :style="{ '--card-color': dotColors[ci % dotColors.length] }"
                  @click="selectTemplate(t.key)"
                >
                  <span class="tpl-name">{{ t.label }}</span>
                  <span class="tpl-key">{{ t.key }}</span>
                </button>
              </div>
            </section>
          </main>
        </div>
      </transition>
    </Teleport>

    <!-- 当前模板 -->
    <component :is="activeCom" :key="activeKey" />
  </div>
</template>

<style scoped lang="scss">
/* ================================================
   Neon Pop — 青春时尚全屏模板库（浅色主题）
   配色：珊瑚粉 #FF6B9D · 天空蓝 #4FC3F7 · 阳光黄 #FFD54F
        薄荷绿 #69F0AE · 薰衣草紫 #B388FF
   ================================================ */

/* ═══════════ 变量 ═══════════ */
$bg-root: #F8F7FC;
$bg-overlay: rgba(250, 249, 254, 0.78);
$bg-sidebar: rgba(255, 255, 255, 0.82);
$border-subtle: rgba(0, 0, 0, 0.06);
$border-mid: rgba(0, 0, 0, 0.10);
$text-primary: #1A1A2E;
$text-secondary: rgba(26, 26, 46, 0.62);
$text-muted: rgba(26, 26, 46, 0.35);

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.showcase-root {
  width: 100%;
  min-height: 100vh;
  position: relative;
  background:
    radial-gradient(ellipse 70% 50% at 20% 10%, rgba(255, 107, 157, 0.06) 0%, transparent 60%),
    radial-gradient(ellipse 60% 45% at 80% 20%, rgba(79, 195, 247, 0.06) 0%, transparent 55%),
    radial-gradient(ellipse 55% 40% at 50% 90%, rgba(105, 240, 174, 0.05) 0%, transparent 55%),
    radial-gradient(ellipse 45% 35% at 10% 80%, rgba(179, 136, 255, 0.05) 0%, transparent 50%),
    linear-gradient(180deg, #FDFBFE 0%, #F5F3FA 30%, #F8F7FC 60%, #FDFCFF 100%);
}

/* ═══════════ FAB 触发 — 彩虹胶囊 ═══════════ */
.fab-trigger {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 22px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border: 1.5px solid rgba(255, 107, 157, 0.15);
  border-radius: 32px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  user-select: none;
  box-shadow:
    0 2px 20px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset,
    0 1px 0 rgba(255, 107, 157, 0.08) inset;

  &:hover {
    background: rgba(255, 255, 255, 0.92);
    border-color: rgba(255, 107, 157, 0.4);
    box-shadow:
      0 6px 32px rgba(255, 107, 157, 0.1),
      0 0 56px rgba(255, 107, 157, 0.06),
      0 0 0 1px rgba(255, 107, 157, 0.12) inset;
    transform: translateX(-50%) translateY(-2px) scale(1.02);
  }

  &:active {
    transform: translateX(-50%) scale(0.97);
  }
}

.fab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 11px;
  background: linear-gradient(135deg, #FF6B9D, #FFD54F);
  color: #fff;
  box-shadow: 0 4px 14px rgba(255, 107, 157, 0.3);
  animation: fab-pulse 3s ease-in-out infinite;
}

@keyframes fab-pulse {
  0%, 100% { box-shadow: 0 4px 14px rgba(255, 107, 157, 0.3); }
  50% { box-shadow: 0 4px 22px rgba(79, 195, 247, 0.45), 0 0 36px rgba(255, 107, 157, 0.2); }
}

.fab-label {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.82rem;
  font-weight: 700;
  color: $text-primary;
  letter-spacing: 0.2px;
}

.fab-tip {
  font-size: 0.6rem;
  font-weight: 700;
  color: $text-muted;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 7px;
  padding: 3px 8px;
  letter-spacing: 0.5px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

/* ═══════════ 全屏覆盖 — 毛玻璃层 ═══════════ */
.overlay-root {
  position: fixed;
  inset: 0;
  z-index: 100000;
  display: flex;
  background: $bg-overlay;
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
}

/* ═══════════ 左侧栏 — 彩虹玻璃 ═══════════ */
.overlay-sidebar {
  width: 268px;
  min-width: 268px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: $bg-sidebar;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-right: 1px solid $border-subtle;
  position: relative;
  box-shadow: 1px 0 24px rgba(0, 0, 0, 0.03);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 30px 24px 22px;
  border-bottom: 1px solid $border-subtle;
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 15px;
  background: linear-gradient(135deg, #FF6B9D, #FFD54F);
  color: #fff;
  box-shadow: 0 6px 20px rgba(255, 107, 157, 0.25);
  flex-shrink: 0;
  animation: brand-glow 4s ease-in-out infinite;
}

@keyframes brand-glow {
  0%, 100% { box-shadow: 0 6px 20px rgba(255, 107, 157, 0.25); }
  50% { box-shadow: 0 8px 28px rgba(79, 195, 247, 0.35), 0 0 40px rgba(255, 107, 157, 0.15); }
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-title {
  font-size: 1.1rem;
  font-weight: 800;
  background: linear-gradient(135deg, #FF6B9D, #FFD54F);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
}

.brand-sub {
  font-size: 0.62rem;
  font-weight: 600;
  color: $text-muted;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* ═══════════ 搜索 ═══════════ */
.sidebar-search {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 16px 18px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.03);
  border: 1.5px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:focus-within {
    border-color: rgba(255, 107, 157, 0.4);
    background: rgba(255, 107, 157, 0.04);
    box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.08), 0 0 20px rgba(255, 107, 157, 0.06);
    transform: scale(1.02);
  }
}

.ss-icon {
  flex-shrink: 0;
  color: $text-muted;
}

.ss-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: $text-primary;
  font-size: 0.8rem;
  font-weight: 500;
  font-family: inherit;
  min-width: 0;

  &::placeholder {
    color: rgba(26, 26, 46, 0.2);
  }
}

.ss-clear {
  flex-shrink: 0;
  border: none;
  background: rgba(255, 107, 157, 0.12);
  color: #FF6B9D;
  font-size: 0.58rem;
  font-weight: 700;
  border-radius: 6px;
  padding: 3px 8px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 107, 157, 0.25);
    transform: scale(1.06);
  }
}

/* ═══════════ 分类导航 ═══════════ */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 6px 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 107, 157, 0.15);
    border-radius: 2px;
  }
}

.sidenav-item {
  --cat-color: #FF6B9D;
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  padding: 11px 15px;
  border: 1.5px solid transparent;
  border-radius: 13px;
  background: transparent;
  color: $text-secondary;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-align: left;
  position: relative;

  &:hover {
    background: rgba(0, 0, 0, 0.03);
    color: $text-primary;
    transform: translateX(3px);
  }

  &.active {
    background: color-mix(in srgb, var(--cat-color) 12%, transparent);
    border-color: color-mix(in srgb, var(--cat-color) 30%, transparent);
    color: $text-primary;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    transform: translateX(4px);
  }
}

.sidenav-emoji {
  font-size: 1.15rem;
  flex-shrink: 0;
  line-height: 1;
}

.sidenav-label {
  flex: 1;
  font-weight: 600;
}

.sidenav-count {
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 8px;
  padding: 2px 9px;
  min-width: 24px;
  text-align: center;
}

/* ═══════════ 侧栏底部 ═══════════ */
.sidebar-footer {
  padding: 14px 18px;
  border-top: 1px solid $border-subtle;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-total {
  font-size: 0.7rem;
  color: $text-muted;
  font-weight: 600;
}

.sidebar-esc {
  font-size: 0.64rem;
  font-weight: 700;
  color: $text-muted;
  background: rgba(0, 0, 0, 0.03);
  border: 1.5px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  padding: 4px 12px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:hover {
    background: rgba(255, 107, 157, 0.15);
    color: #FF6B9D;
    border-color: rgba(255, 107, 157, 0.25);
    transform: scale(1.05);
  }
}

/* ═══════════ 右侧内容区 ═══════════ */
.overlay-content {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 40px 52px 100px;
  scroll-behavior: smooth;

  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 107, 157, 0.12);
    border-radius: 3px;
    &:hover { background: rgba(255, 107, 157, 0.22); }
  }
}

/* ═══════════ 空状态 ═══════════ */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  gap: 14px;
  color: rgba(0, 0, 0, 0.06);

  svg {
    opacity: 0.25;
    animation: empty-float 3s ease-in-out infinite;
  }
}

@keyframes empty-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.empty-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: $text-muted;
}

.empty-desc {
  font-size: 0.78rem;
  color: rgba(26, 26, 46, 0.18);
  font-weight: 500;
}

/* ═══════════ 分类内容区 ═══════════ */
.content-section {
  margin-bottom: 52px;
}

.section-head {
  --section-color: #FF6B9D;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  position: sticky;
  top: 0;
  background: linear-gradient(180deg, rgba(248, 247, 252, 0.94) 50%, transparent);
  padding: 14px 0 20px;
  z-index: 2;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.section-emoji {
  font-size: 1.3rem;
  flex-shrink: 0;
  line-height: 1;
}

.section-title {
  font-size: 1.15rem;
  font-weight: 800;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.3px;
}

.section-count {
  font-size: 0.68rem;
  font-weight: 700;
  border-radius: 9px;
  padding: 3px 10px;
  border: 1px solid;
}

.section-line {
  flex: 1;
  height: 1.5px;
  margin-left: 10px;
  border-radius: 1px;
}

/* ═══════════ 模板卡片 — 时尚卡片 ═══════════ */
.section-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.tpl-card {
  --card-color: #FF6B9D;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 16px 18px;
  background: rgba(255, 255, 255, 0.55);
  border: 1.5px solid rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 12px;
    bottom: 12px;
    width: 3px;
    border-radius: 0 2px 2px 0;
    background: var(--card-color);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    transform: scaleY(0);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    opacity: 0;
    background: linear-gradient(135deg, color-mix(in srgb, var(--card-color) 5%, transparent), transparent 60%);
    transition: opacity 0.3s;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.85);
    border-color: rgba(0, 0, 0, 0.1);
    transform: translateY(-3px) scale(1.01);
    box-shadow:
      0 8px 28px rgba(0, 0, 0, 0.06),
      0 0 0 1px rgba(255, 255, 255, 0.5) inset;

    &::before {
      opacity: 1;
      transform: scaleY(1);
    }

    &::after {
      opacity: 1;
    }
  }

  &:active {
    transform: scale(0.96);
    transition: all 0.1s;
  }

  &.selected {
    background: color-mix(in srgb, var(--card-color) 14%, transparent);
    border-color: color-mix(in srgb, var(--card-color) 40%, transparent);
    box-shadow:
      0 4px 20px color-mix(in srgb, var(--card-color) 14%, transparent),
      0 0 0 1px color-mix(in srgb, var(--card-color) 10%, transparent) inset;

    &::before {
      opacity: 1;
      transform: scaleY(1);
      width: 4px;
    }

    &::after { display: none; }
  }
}

.tpl-name {
  font-size: 0.8rem;
  font-weight: 700;
  color: $text-secondary;
  line-height: 1.45;
  transition: color 0.25s;

  .tpl-card:hover & { color: $text-primary; }
  .tpl-card.selected & { color: $text-primary; }
}

.tpl-key {
  font-size: 0.58rem;
  color: rgba(26, 26, 46, 0.18);
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
  font-weight: 500;
  transition: color 0.25s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;

  .tpl-card.selected & { color: rgba(26, 26, 46, 0.35); }
}

/* ═══════════ 动画 — 弹性入场 ═══════════ */
.overlay-slide-enter-active {
  transition: opacity 0.35s ease;

  .overlay-sidebar {
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .overlay-content {
    transition: opacity 0.35s ease 0.06s, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.06s;
  }
}

.overlay-slide-leave-active {
  transition: opacity 0.2s ease;

  .overlay-sidebar {
    transition: transform 0.22s cubic-bezier(0.55, 0, 1, 0.45);
  }

  .overlay-content {
    transition: opacity 0.16s ease, transform 0.22s cubic-bezier(0.55, 0, 1, 0.45);
  }
}

.overlay-slide-enter-from {
  opacity: 0;

  .overlay-sidebar { transform: translateX(-70px); }
  .overlay-content { opacity: 0; transform: translateY(20px); }
}

.overlay-slide-leave-to {
  opacity: 0;

  .overlay-sidebar { transform: translateX(-40px); }
  .overlay-content { opacity: 0; transform: translateY(8px); }
}

/* ═══════════ 响应式 ═══════════ */
@media (max-width: 1100px) {
  .section-grid { grid-template-columns: repeat(3, 1fr); }
  .overlay-content { padding: 32px 32px 80px; }
}

@media (max-width: 768px) {
  .overlay-sidebar { width: 220px; min-width: 220px; }
  .section-grid { grid-template-columns: repeat(2, 1fr); }
  .overlay-content { padding: 24px 20px 60px; }
}
</style>
