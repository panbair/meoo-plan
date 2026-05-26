<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { templates, firstKey } from './template/registry'

const activeKey = ref(firstKey)
const menuOpen = ref(false)
const navRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)

// ── 分类分组 ──
const categories = computed(() => {
  const map: Record<string, { label: string; items: typeof templates }> = {
    scroll: { label: '滚动范式', items: [] },
    transition: { label: '过渡动画', items: [] },
    creative: { label: '创意特效', items: [] },
  }
  for (const t of templates) {
    if (t.key.startsWith('transition-')) {
      map.transition.items.push(t)
    } else if (['interstellar', 'liquid-metal', 'cyber-scanner', 'kaleidoscope', 'neon-city', 'folding-universe', 'memory-fragments', 'light-theater', 'elemental-portals', 'liquid-sculpture', 'kaleidoscope-world', 'chrono-gallery', 'storm-eye', 'digital-deconstruction', 'mirror-world', 'calligraphy-flow', 'metamorphosis', 'pixel-evolution', 'gravity-shift', 'theater-curtain', 'dimension-blur'].includes(t.key)) {
      map.creative.items.push(t)
    } else {
      map.scroll.items.push(t)
    }
  }
  return Object.values(map).filter((c) => c.items.length > 0)
})

const activeCom = computed(() => {
  const t = templates.find((t) => t.key === activeKey.value)
  return t?.com ?? null
})

function selectTemplate(key: string) {
  activeKey.value = key
  menuOpen.value = false
}

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
          <div
            v-for="cat in categories"
            :key="cat.label"
            class="menu-category"
          >
            <div class="menu-cat-head">{{ cat.label }}</div>
            <div class="menu-cat-grid">
              <div
                v-for="t in cat.items"
                :key="t.key"
                class="showcase-item"
                :class="{ active: activeKey === t.key }"
                @click="selectTemplate(t.key)"
              >
                {{ t.label }} <span @click.stop> {{ t.key }}</span>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- 背景遮罩 -->
    <transition name="menu-drop">
      <div v-if="menuOpen" class="menu-backdrop" @click="menuOpen = false" />
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
  width: 480px;
  max-height: 420px;
  overflow-y: auto;
  background: rgba(15, 15, 18, 0.92);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 20px 18px 14px;
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
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.menu-drop-enter-from,
.menu-drop-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-6px) scale(0.96);
}
</style>
