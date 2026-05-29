<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { templates, firstKey } from './template/registry'

const activeKey = ref(firstKey)
const menuOpen = ref(false)
const searchQuery = ref('')
const navRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)

// ── 分类分组 ──
const categories = computed(() => {
  const map: Record<string, { label: string; items: typeof templates }> = {
    scroll: { label: '滚动样式', items: [] },
    transition: { label: '过渡动画', items: [] },
    creative: { label: '创意特效', items: [] }
  }
  for (const t of templates) {
    if (t.key.startsWith('transition-')) {
      map.transition.items.push(t)
    } else if (
      [
        'interstellar',
        'liquid-metal',
        'cyber-scanner',
        'kaleidoscope',
        'neon-city',
        'folding-universe',
        'memory-fragments',
        'light-theater',
        'elemental-portals',
        'liquid-sculpture',
        'kaleidoscope-world',
        'chrono-gallery',
        'storm-eye',
        'digital-deconstruction',
        'mirror-world',
        'calligraphy-flow',
        'metamorphosis',
        'pixel-evolution',
        'gravity-shift',
        'theater-curtain',
        'dimension-blur',
        'z-tunnel',
        'gallery-wander',
        'mobius-strip',
        'fractal-recursion',
        'parallel-universe',
        'speed-corridor',
        'cross-hatch',
        'spiral-descent',
        'elevator-lobby',
        'snake-path',
        'cube-navigator',
        'double-helix',
        'slide-deck',
        'timeline-journey',
        'compare-slider',
        'feature-tour',
        'before-after-reveal',
        'catalog-browser'
      ].includes(t.key)
    ) {
      map.creative.items.push(t)
    } else {
      map.scroll.items.push(t)
    }
  }
  return Object.values(map).filter((c) => c.items.length > 0)
})

// ── 搜索过滤 ──
const filteredCategories = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return categories.value
  return categories.value
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (t) =>
          t.label.toLowerCase().includes(q) ||
          t.key.toLowerCase().includes(q)
      )
    }))
    .filter((cat) => cat.items.length > 0)
})

const activeCom = computed(() => {
  const t = templates.find((t) => t.key === activeKey.value)
  return t?.com ?? null
})

function selectTemplate(key: string) {
  activeKey.value = key
  menuOpen.value = false
  searchQuery.value = ''
  // 切换模板时恢复滚动条到顶部
  // 立即滚动一次
  window.scrollTo(0, 0)
  // nextTick 后再滚动一次（确保新组件 DOM 已挂载）
  nextTick(() => {
    window.scrollTo(0, 0)
    // 延迟一帧再滚动（确保 ScrollTrigger 初始化后位置正确）
    requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
  })
}

// 菜单打开时自动聚焦搜索框
watch(menuOpen, async (open) => {
  if (open) {
    await nextTick()
    searchInputRef.value?.focus()
  }
})

// 点击外部关闭
function onDocClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (navRef.value && !navRef.value.contains(target)) {
    menuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <div class="web-template-showcase">
    <!-- 模板切换面板 -->
    <div ref="navRef" class="showcase-nav">
      <div class="showcase-toggle" :class="{ open: menuOpen }" @click.stop="menuOpen = !menuOpen">
        <div class="toggle-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
        </div>
        <span class="toggle-label">{{ templates.find((t) => t.key === activeKey)?.label }}</span>
        <span class="toggle-count">{{ templates.length }}</span>
        <svg class="toggle-chevron" :class="{ flipped: menuOpen }" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
      <transition name="menu-pop">
        <div v-if="menuOpen" ref="menuRef" class="showcase-menu" @click.stop>
          <!-- 菜单头部 -->
          <div class="menu-header">
            <div class="menu-header-left">
              <div class="menu-header-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </div>
              <span class="menu-header-title">模板库</span>
              <span class="menu-header-count">{{ templates.length }}</span>
            </div>
            <button class="menu-close-btn" @click="menuOpen = false" title="关闭">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>

          <!-- 搜索框 -->
          <div class="menu-search-box">
            <svg class="menu-search-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              class="menu-search-input"
              type="text"
              placeholder="搜索模板..."
              @keydown.escape="searchQuery = ''; searchInputRef?.blur()"
            />
            <button v-if="searchQuery" class="menu-search-clear" @click="searchQuery = ''; searchInputRef?.focus()" title="清除">
              <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>

          <!-- 无结果提示 -->
          <div v-if="filteredCategories.length === 0" class="menu-no-result">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="36" height="36">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <span>未找到匹配的模板</span>
          </div>

          <!-- 分类列表 -->
          <div v-for="(cat, ci) in filteredCategories" :key="cat.label" class="menu-category">
            <div class="menu-cat-head">
              <span class="menu-cat-dot" :class="`cat-dot-${ci}`"></span>
              <span class="menu-cat-label">{{ cat.label }}</span>
              <span class="menu-cat-count">{{ cat.items.length }}</span>
            </div>
            <div class="menu-cat-grid">
              <div
                v-for="t in cat.items"
                :key="t.key"
                class="showcase-item"
                :class="{ active: activeKey === t.key }"
                @click="selectTemplate(t.key)"
              >
                {{ t.label }}
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- 背景遮罩 -->
    <transition name="menu-pop">
      <div v-if="menuOpen" class="menu-backdrop" @click="menuOpen = false"></div>
    </transition>

    <!-- 当前模板 -->
    <component :is="activeCom" :key="activeKey" />
  </div>
</template>

<style scoped lang="scss">
/* ======================== */
//  Cosmic Glass — 配色系统
/* ======================== */
//  深空基底: #09091A → #101028
//  主强调紫: #7C3AED → #A78BFA → #C4B5FD
//  次强调青: #0D9488 → #2DD4BF → #5EEAD4
//  暖强调玫: #E11D48 → #FB7185 → #FDA4AF
//  表面玻璃: rgba(18,18,42,0.88~0.96)
/* ======================== */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.web-template-showcase {
  width: 100%;
  min-height: 100vh;
  position: relative;
  // 深空基底色 + 微弱径向光晕
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124, 58, 237, 0.06) 0%, transparent 70%),
    radial-gradient(ellipse 60% 50% at 85% 100%, rgba(13, 148, 136, 0.04) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 15% 80%, rgba(225, 29, 72, 0.03) 0%, transparent 50%),
    linear-gradient(180deg, #09091A 0%, #0F0F26 40%, #0A0A1E 100%);
}

/* ======================== */
// 遮罩
/* ======================== */
.menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: rgba(6, 6, 16, 0.45);
  backdrop-filter: blur(3px);
}

/* ======================== */
// 导航容器
/* ======================== */
.showcase-nav {
  position: fixed;
  top: 26px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
}

/* ======================== */
// 触发按钮 — 深邃玻璃胶囊
/* ======================== */
.showcase-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 22px;
  background: rgba(18, 18, 42, 0.82);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 32px;
  color: #edf0fc;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  white-space: nowrap;
  box-shadow:
    0 2px 16px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.03) inset,
    0 1px 0 rgba(255, 255, 255, 0.04) inset;
  user-select: none;

  &:hover {
    background: rgba(26, 26, 56, 0.88);
    border-color: rgba(167, 139, 250, 0.2);
    box-shadow:
      0 4px 24px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(167, 139, 250, 0.08) inset,
      0 0 32px rgba(124, 58, 237, 0.1);
    transform: translateY(-1px);
  }

  &.open {
    background: rgba(28, 24, 54, 0.9);
    border-color: rgba(124, 58, 237, 0.45);
    box-shadow:
      0 2px 20px rgba(0, 0, 0, 0.35),
      0 0 0 1px rgba(124, 58, 237, 0.15) inset,
      0 0 36px rgba(124, 58, 237, 0.2),
      0 8px 32px rgba(124, 58, 237, 0.08);
  }
}

.toggle-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #A78BFA;
  filter: drop-shadow(0 0 6px rgba(167, 139, 250, 0.4));
}

.toggle-label {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.toggle-count {
  font-size: 0.64rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #7C3AED, #A78BFA);
  border-radius: 12px;
  padding: 2px 10px;
  letter-spacing: 0.3px;
  box-shadow: 0 0 12px rgba(124, 58, 237, 0.35);
}

.toggle-chevron {
  color: rgba(255, 255, 255, 0.4);
  transition: all 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  &.flipped {
    transform: rotate(180deg);
    color: #A78BFA;
    filter: drop-shadow(0 0 4px rgba(167, 139, 250, 0.5));
  }
}

/* ======================== */
// 下拉菜单 — 深空霜玻璃
/* ======================== */
.showcase-menu {
  position: absolute;
  top: calc(100% + 14px);
  left: 50%;
  transform: translateX(-50%);
  width: 680px;
  max-height: 530px;
  overflow-y: auto;
  background: rgba(14, 14, 32, 0.96);
  backdrop-filter: blur(32px) saturate(180%);
  -webkit-backdrop-filter: blur(32px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  padding: 0;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 24px 72px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(255, 255, 255, 0.02) inset,
    0 1px 0 rgba(255, 255, 255, 0.03) inset;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
    margin: 8px 0;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(167, 139, 250, 0.15);
    border-radius: 3px;
    &:hover { background: rgba(167, 139, 250, 0.28); }
  }
}

/* ======================== */
// 菜单头部
/* ======================== */
.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.menu-header-left {
  display: flex;
  align-items: center;
  gap: 11px;
}

.menu-header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.22), rgba(13, 148, 136, 0.16));
  border-radius: 11px;
  color: #A78BFA;
  box-shadow: 0 0 12px rgba(124, 58, 237, 0.15);
}

.menu-header-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #edf0fc;
  letter-spacing: 0.4px;
}

.menu-header-count {
  font-size: 0.66rem;
  font-weight: 700;
  padding: 2px 9px;
  border-radius: 10px;
  background: rgba(124, 58, 237, 0.16);
  color: #C4B5FD;
}

.menu-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: rgba(225, 29, 72, 0.18);
    color: #FB7185;
  }
}

// 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
// 鎼滅储妗?鈥?寰厜杈撳叆鍖?
// 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
.menu-search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 14px 22px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  transition: all 0.28s;

  &:focus-within {
    border-color: rgba(124, 58, 237, 0.4);
    background: rgba(255, 255, 255, 0.06);
    box-shadow:
      0 0 0 3px rgba(124, 58, 237, 0.06),
      0 0 20px rgba(124, 58, 237, 0.06);
  }
}

.menu-search-icon {
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.25);
  transition: color 0.28s;
}

.menu-search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: #edf0fc;
  font-size: 0.82rem;
  font-family: inherit;
  &::placeholder { color: rgba(255, 255, 255, 0.22); }
}

.menu-search-clear {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.35);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s;
  &:hover {
    background: rgba(225, 29, 72, 0.25);
    color: #FB7185;
  }
}

// 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
// 鏃犵粨鏋?
// 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
.menu-no-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 0;
  color: rgba(255, 255, 255, 0.15);
  font-size: 0.85rem;
}

// 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
// 鍒嗙被鍖哄潡
// 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
.menu-category {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 22px;
  &:last-child { padding-bottom: 22px; }
}

.menu-cat-head {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 4px 2px;
}

// 涓夎壊鍒嗙被鎸囩ず鐐?
.menu-cat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    opacity: 0.25;
  }
  &.cat-dot-0 {
    background: #A78BFA;
    box-shadow: 0 0 10px rgba(167, 139, 250, 0.5);
  }
  &.cat-dot-1 {
    background: #2DD4BF;
    box-shadow: 0 0 10px rgba(45, 212, 191, 0.5);
  }
  &.cat-dot-2 {
    background: #FB7185;
    box-shadow: 0 0 10px rgba(251, 113, 133, 0.5);
  }
}

.menu-cat-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
  letter-spacing: 1.2px;
}

.menu-cat-count {
  font-size: 0.6rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  padding: 1px 7px;
}

.menu-cat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

// 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
// 妯℃澘鍗＄墖 鈥?绮惧灞傜骇
// 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
.showcase-item {
  padding: 9px 12px;
  background: rgba(255, 255, 255, 0.022);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.74rem;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  white-space: nowrap;
  letter-spacing: 0.3px;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #edf0fc;
    border-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
    box-shadow:
      0 4px 16px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.03) inset;
  }

  &:active {
    transform: translateY(0) scale(0.97);
  }

  &.active {
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(13, 148, 136, 0.15));
    border-color: rgba(124, 58, 237, 0.45);
    color: #fff;
    font-weight: 600;
    box-shadow:
      0 2px 14px rgba(124, 58, 237, 0.22),
      0 0 0 1px rgba(167, 139, 250, 0.12) inset;
  }
}

// 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
// 寮瑰嚭鍔ㄧ敾
// 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
.menu-pop-enter-active {
  transition:
    opacity 0.24s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    transform 0.24s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.menu-pop-leave-active {
  transition:
    opacity 0.14s ease,
    transform 0.14s ease;
}
.menu-pop-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-14px) scale(0.93);
}
.menu-pop-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px) scale(0.95);
}

// 閬僵鐙珛杩囨浮
.menu-backdrop.menu-pop-enter-active,
.menu-backdrop.menu-pop-leave-active {
  transition: opacity 0.22s ease;
}
.menu-backdrop.menu-pop-enter-from,
.menu-backdrop.menu-pop-leave-to {
  opacity: 0;
}
</style>
