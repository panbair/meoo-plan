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
    scroll: { label: '滚动范式', items: [] },
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
      <div class="showcase-toggle" @click.stop="menuOpen = !menuOpen">
        <span class="toggle-label">{{ templates.find((t) => t.key === activeKey)?.label }}</span>
        <span class="toggle-count">{{ templates.length }}</span>
        <span class="showcase-arrow">▾</span>
      </div>
      <transition name="menu-drop">
        <div v-if="menuOpen" ref="menuRef" class="showcase-menu" @click.stop>
          <!-- 搜索框 -->
          <div class="menu-search-box">
            <svg class="menu-search-icon" viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              class="menu-search-input"
              type="text"
              placeholder="搜索模板名称..."
              @keydown.escape="searchQuery = ''; searchInputRef?.blur()"
            />
            <button v-if="searchQuery" class="menu-search-clear" @click="searchQuery = ''; searchInputRef?.focus()" title="清除">
              ╳
            </button>
          </div>

          <!-- 无结果提示 -->
          <div v-if="filteredCategories.length === 0" class="menu-no-result">
            未找到匹配的模板
          </div>

          <!-- 分类列表 -->
          <div v-for="cat in filteredCategories" :key="cat.label" class="menu-category">
            <div class="menu-cat-head">{{ cat.label }} <span class="menu-cat-count">{{ cat.items.length }}</span></div>
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
    <transition name="menu-drop">
      <div v-if="menuOpen" class="menu-backdrop" @click="menuOpen = false"></div>
    </transition>

    <!-- 当前模板 -->
    <component :is="activeCom" :key="activeKey" />
  </div>
</template>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.web-template-showcase {
  width: 100%;
  min-height: 100vh;
  position: relative;
}

// ── 遮罩 ──
.menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9998;
}

// ── 导航容器 ──
.showcase-nav {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
}

// ── 触发按钮 ──
.showcase-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s;
  white-space: nowrap;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    border-color: rgba(255, 255, 255, 0.25);
  }
}

.toggle-label {
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toggle-count {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.45);
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 1px 7px;
}

.showcase-arrow {
  font-size: 0.55rem;
  transition: transform 0.25s;
}

// ── 下拉菜单 ──
.showcase-menu {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  width: 610px;
  max-height: 450px;
  overflow-y: auto;
  background: rgba(15, 15, 18, 0.92);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 18px 18px 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  // 美化滚动条
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 2px;
  }
}

// ── 搜索框 ──
.menu-search-box {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: rgba(99, 130, 255, 0.5);
    background: rgba(255, 255, 255, 0.09);
  }
}

.menu-search-icon {
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.35);
}

.menu-search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: #fff;
  font-size: 0.78rem;
  font-family: inherit;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
}

.menu-search-clear {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
  }
}

.menu-no-result {
  text-align: center;
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.8rem;
  padding: 20px 0;
}

.menu-category {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-cat-head {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.menu-cat-count {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 0 6px;
}

.menu-cat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
}

.showcase-item {
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid transparent;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.75rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    border-color: rgba(255, 255, 255, 0.15);
  }

  &.active {
    background: rgba(99, 130, 255, 0.3);
    border-color: rgba(99, 130, 255, 0.5);
    color: #fff;
    box-shadow: 0 0 12px rgba(99, 130, 255, 0.15);
  }
}

// ── 过渡动画 ──
.menu-drop-enter-active,
.menu-drop-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}
.menu-drop-enter-from,
.menu-drop-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-6px) scale(0.96);
}
</style>
