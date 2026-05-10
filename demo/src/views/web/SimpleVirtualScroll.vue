<template>
  <div class="simple-virtual-scroll">
    <!-- 页面标题 -->
    <header class="page-header">
      <h1 class="page-title">滚动动画组件库</h1>
      <p class="page-subtitle">{{ filteredComponents.length }} 个组件 · 只渲染可见区域</p>
    </header>
    <!-- 分类筛选 -->
    <div class="filter-bar">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        :class="['filter-btn', { active: currentCategory === cat.id }]"
        @click="currentCategory = cat.id"
      >
        {{ cat.name }} ({{ cat.count }})
      </button>
    </div>

    <!-- 虚拟滚动容器 -->
    <div 
      class="scroll-container"
      ref="scrollContainer"
      @scroll="handleScroll"
    >
      <!-- 占位符：确保总滚动高度 -->
      <div 
        class="scroll-spacer" 
        :style="{ height: totalHeight + 'px' }"
      ></div>

      <!-- 可见组件 -->
      <div
        v-for="item in visibleItems"
        :key="item.id"
        class="component-item"
        :style="{ transform: `translateY(${item.offset}px)` }"
      >
        <div class="item-header">
          <span class="item-number">#{{ item.index + 1 }}</span>
          <span class="item-category">{{ item.category }}</span>
          <span class="item-name">{{ item.name }}</span>
        </div>

        <!-- 组件内容 -->
        <Suspense @resolve="() => onComponentLoaded(item.id)">
          <template #default>
            <component :is="item.component" />
          </template>
          <template #fallback>
            <div class="loading-placeholder">
              <div class="spinner"></div>
              <p>加载中...</p>
            </div>
          </template>
        </Suspense>
      </div>
    </div>

    <!-- 底部状态栏 -->
    <div class="status-bar">
      <div class="status-item">
        <span>位置:</span>
        <span>{{ startIndex + 1 }} - {{ endIndex + 1 }} / {{ filteredComponents.length }}</span>
      </div>
      <div class="status-item">
        <span>可见:</span>
        <span>{{ visibleItems.length }} 个</span>
      </div>
      <div class="status-item">
        <span>进度:</span>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: scrollProgress + '%' }"></div>
        </div>
        <span>{{ Math.round(scrollProgress) }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, computed, onMounted, onUnmounted, markRaw, nextTick } from 'vue'
import { defineAsyncComponent } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 配置
const ITEM_HEIGHT = 600  // 每个组件的高度
const VISIBLE_COUNT = 3  // 同时可见的组件数
const BUFFER_SIZE = 2    // 缓冲区大小

// 状态
const scrollContainer = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const currentCategory = ref('all')
const loadedComponents = ref<Set<string>>(new Set())  // 跟踪已加载的组件

// 分类定义
const categories = ref([
  { id: 'all', name: '全部', count: 0 },
  { id: 'core', name: '核心', count: 0 },
  { id: 'scroll', name: '滚动', count: 0 },
  { id: 'creative', name: '创意', count: 0 },
  { id: 'card', name: '卡片', count: 0 },
  { id: 'text', name: '文字', count: 0 },
  { id: 'image', name: '图片', count: 0 },
  { id: '3d', name: '3D', count: 0 },
])

// 所有组件
const allComponents = shallowRef<ComponentInfo[]>([])

// 初始化组件列表
const initializeComponents = () => {
  // 动态导入所有组件 (包括 Scroll* 和 AccordionCards 等)
  const componentFiles = {
    ...import.meta.glob('./components/Scroll*.vue'),
    ...import.meta.glob('./components/Accordion*.vue'),
    ...import.meta.glob('./components/Card3D*.vue'),
    ...import.meta.glob('./components/Timeline*.vue'),
    ...import.meta.glob('./components/Text*.vue'),
    ...import.meta.glob('./components/Cube*.vue'),
    ...import.meta.glob('./components/Image*.vue'),
    ...import.meta.glob('./components/Horizontal*.vue'),
    ...import.meta.glob('./components/Parallax*.vue'),
    ...import.meta.glob('./components/Infinite*.vue'),
    ...import.meta.glob('./components/Magnetic*.vue'),
    ...import.meta.glob('./components/Morph*.vue'),
    ...import.meta.glob('./components/Nebula*.vue'),
    ...import.meta.glob('./components/Quantum*.vue'),
    ...import.meta.glob('./components/Rotate*.vue'),
    ...import.meta.glob('./components/Rotation*.vue')
  }

  allComponents.value = Object.keys(componentFiles).map(path => {
    const name = path.split('/').pop()?.replace('.vue', '') || ''
    const category = getCategory(name)
    const asyncComponent = defineAsyncComponent({
      loader: componentFiles[path] as () => Promise<any>,
      delay: 200,
      timeout: 10000
    })
    return {
      id: name,
      name,
      category,
      component: markRaw(asyncComponent)
    }
  })

  // 更新分类计数
  updateCategoryCounts()
}

// 获取分类
const getCategory = (name: string): string => {
  const lowerName = name.toLowerCase()
  if (lowerName.includes('card')) return 'card'
  if (lowerName.includes('text')) return 'text'
  if (lowerName.includes('image')) return 'image'
  if (lowerName.includes('3d')) return '3d'
  if (lowerName.includes('cube') || lowerName.includes('galaxy') || lowerName.includes('particle')) return 'creative'
  return 'scroll'
}

// 更新分类计数
const updateCategoryCounts = () => {
  const components = allComponents.value
  if (!components || !Array.isArray(components)) return
  categories.value = categories.value.map(cat => ({
    ...cat,
    count: cat.id === 'all'
      ? components.length
      : components.filter(c => c.category === cat.id).length
  }))
}

// 过滤后的组件
const filteredComponents = computed(() => {
  const components = allComponents.value
  if (!components || !Array.isArray(components)) {
    return []
  }
  if (currentCategory.value === 'all') {
    return components
  }
  return components.filter(c => c.category === currentCategory.value)
})

// 总高度
const totalHeight = computed(() => {
  const components = filteredComponents.value
  return (components?.length || 0) * ITEM_HEIGHT
})

// 开始索引
const startIndex = computed(() => {
  return Math.max(0, Math.floor(scrollTop.value / ITEM_HEIGHT) - BUFFER_SIZE)
})

// 结束索引
const endIndex = computed(() => {
  const components = filteredComponents.value
  if (!components || components.length === 0) return -1
  return Math.min(
    components.length - 1,
    startIndex.value + VISIBLE_COUNT + BUFFER_SIZE * 2
  )
})

// 可见组件
const visibleItems = computed(() => {
  const components = filteredComponents.value
  if (!components || !Array.isArray(components) || components.length === 0) {
    return []
  }
  return components
    .slice(startIndex.value, endIndex.value + 1)
    .map((comp, idx) => ({
      ...comp,
      index: startIndex.value + idx,
      offset: (startIndex.value + idx) * ITEM_HEIGHT
    }))
})

// 滚动进度
const scrollProgress = computed(() => {
  if (totalHeight.value === 0) return 0
  return Math.min(100, (scrollTop.value / (totalHeight.value - window.innerHeight)) * 100)
})

// 处理滚动
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  scrollTop.value = target.scrollTop

  // 滚动时也刷新ScrollTrigger(防抖)
  if (refreshTimeout) {
    clearTimeout(refreshTimeout)
  }
  refreshTimeout = setTimeout(() => {
    ScrollTrigger.refresh()
    refreshTimeout = null
  }, 200)
}

// 刷新ScrollTrigger
let refreshTimeout: ReturnType<typeof setTimeout> | null = null

const refreshScrollTrigger = () => {
  if (refreshTimeout) {
    clearTimeout(refreshTimeout)
  }
  refreshTimeout = setTimeout(() => {
    ScrollTrigger.refresh()
    refreshTimeout = null
  }, 100)
}

// 组件加载完成处理
const onComponentLoaded = (componentId: string) => {
  if (!loadedComponents.value.has(componentId)) {
    loadedComponents.value.add(componentId)
    // 等待DOM更新后刷新ScrollTrigger
    nextTick(() => {
      refreshScrollTrigger()
    })
  }
}

// 组件类型
interface ComponentInfo {
  id: string
  name: string
  category: string
  component: any
}

// 生命周期
onMounted(() => {
  // 确保 allComponents 已初始化
  if (!allComponents.value || !Array.isArray(allComponents.value)) {
    allComponents.value = []
  }
  initializeComponents()

  // 初始刷新ScrollTrigger
  nextTick(() => {
    refreshScrollTrigger()
  })
})

onUnmounted(() => {
  // 清理ScrollTrigger
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  if (refreshTimeout) {
    clearTimeout(refreshTimeout)
  }
})

onUnmounted(() => {
  // 清理逻辑
})
</script>

<style scoped lang="scss">
.simple-virtual-scroll {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a2a 100%);
  padding: 20px;
}

.page-header {
  text-align: center;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #a78bfa, #60a5fa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #94a3b8;
}

.filter-bar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.filter-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &.active {
    background: linear-gradient(135deg, #a78bfa, #60a5fa);
    border-color: transparent;
  }
}

.scroll-container {
  position: relative;
  height: calc(100vh - 250px);
  overflow-y: auto;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.scroll-spacer {
  width: 100%;
}

.component-item {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 600px;
  overflow: hidden;
  transition: opacity 0.3s;
}

.item-header {
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
}

.item-number {
  padding: 4px 10px;
  background: linear-gradient(135deg, #a78bfa, #60a5fa);
  border-radius: 6px;
  font-size: 12px;
  font-weight: bold;
}

.item-category {
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  font-size: 12px;
  color: #94a3b8;
}

.item-name {
  flex: 1;
  font-weight: 600;
  color: #e2e8f0;
}

.loading-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #a78bfa;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.status-bar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 30px;
  padding: 15px 30px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-size: 14px;

  span:last-child {
    color: #e2e8f0;
    font-weight: 600;
  }
}

.progress-bar {
  width: 80px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #a78bfa, #60a5fa);
  transition: width 0.1s;
}
</style>
