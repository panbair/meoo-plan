/**
 * 虚拟滚动实现 - 针对200+组件的性能优化
 * 
 * 设计原则：
 * 1. 只渲染可见区域的组件（3-5个）
 * 2. 使用占位符确保滚动空间
 * 3. 动态加载/卸载组件
 * 4. 保持流畅的滚动体验
 */

<template>
  <div class="virtual-scroll-wrapper" ref="scrollWrapper">
    <!-- 组件选择器 -->
    <div class="component-selector">
      <select v-model="currentCategory" @change="handleCategoryChange">
        <option value="all">全部组件 ({{ allComponents.length }})</option>
        <option value="3d">3D动画 ({{ countCategory('3d') }})</option>
        <option value="creative">创意特效 ({{ countCategory('creative') }})</option>
        <option value="scroll">滚动交互 ({{ countCategory('scroll') }})</option>
        <option value="card">卡片特效 ({{ countCategory('card') }})</option>
        <option value="text">文字特效 ({{ countCategory('text') }})</option>
        <option value="image">图片特效 ({{ countCategory('image') }})</option>
      </select>
    </div>

    <!-- 虚拟滚动容器 -->
    <div class="virtual-scroll-container" @scroll="handleScroll">
      <!-- 占位div：确保总高度 -->
      <div 
        class="scroll-spacer" 
        :style="{ height: totalHeight + 'px' }"
      ></div>
      
      <!-- 当前可见的组件 -->
      <div 
        v-for="item in visibleItems" 
        :key="item.id"
        class="virtual-item"
        :style="getItemStyle(item.index)"
        :data-component-id="item.id"
      >
        <div class="item-header">
          <span class="item-index">#{{ item.index + 1 }}</span>
          <span class="item-name">{{ item.name }}</span>
          <span class="item-category">{{ item.category }}</span>
        </div>
        
        <!-- 组件容器 -->
        <div class="component-content">
          <component :is="item.component" v-if="item.loaded" />
          <div v-else class="component-placeholder">
            <div class="placeholder-spinner"></div>
            <p>加载中...</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 滚动进度指示器 -->
    <div class="scroll-indicator">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: scrollProgress + '%' }"></div>
      </div>
      <div class="progress-text">{{ scrollProgress }}% ({{ visibleItems.length }}/{{ currentComponents.length }} 可见)</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 配置参数
const CONFIG = {
  itemHeight: 600,      // 每个组件的高度
  visibleCount: 3,      // 同时可见的组件数量
  bufferSize: 2,        // 上下缓冲区大小
  scrollDebounce: 50,   // 滚动防抖时间
  loadingDelay: 100     // 组件加载延迟
}

// 状态
const scrollWrapper = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const currentCategory = ref('all')
const allComponents = ref<any[]>([])
const loadedComponents = ref(new Set<string>())

// 动态导入所有组件
const componentImports = {
  // 核心组件
  Card3DFlipGallery: () => import('./components/Card3DFlipGallery.vue'),
  Timeline: () => import('./components/Timeline.vue'),
  TextTypewriter: () => import('./components/TextTypewriter.vue'),
  Cube3D: () => import('./components/Cube3D.vue'),
  ImageParallax: () => import('./components/ImageParallax.vue'),

  // 卡片组件
  AccordionCards: () => import('./components/AccordionCards.vue'),

  // 3D组件
  Scroll3DCube: () => import('./components/Scroll3DCube.vue'),
  Scroll3DTunnel: () => import('./components/Scroll3DTunnel.vue'),
  Scroll3DGallery: () => import('./components/Scroll3DGallery.vue'),

  // 可以继续添加其他组件...
}

// 组件分类
const componentCategories: Record<string, string> = {
  Card3DFlipGallery: 'core',
  Timeline: 'core',
  TextTypewriter: 'core',
  Cube3D: 'core',
  ImageParallax: 'core',
  AccordionCards: 'card',
  Scroll3DCube: '3d',
  Scroll3DTunnel: '3d',
  Scroll3DGallery: '3d',
  // 可以继续添加...
}

// 初始化组件列表
const initializeComponents = () => {
  const components: any[] = []
  
  Object.keys(componentImports).forEach((name, index) => {
    components.push({
      id: `component-${index}`,
      name,
      component: componentImports[name as keyof typeof componentImports],
      category: componentCategories[name] || 'creative',
      loaded: false,
      index
    })
  })
  
  allComponents.value = components
}

// 当前显示的组件（根据分类）
const currentComponents = computed(() => {
  if (currentCategory.value === 'all') {
    return allComponents.value
  }
  return allComponents.value.filter(c => c.category === currentCategory.value)
})

// 计算总高度
const totalHeight = computed(() => currentComponents.value.length * CONFIG.itemHeight)

// 计算当前索引
const currentIndex = computed(() => Math.floor(scrollTop.value / CONFIG.itemHeight))

// 计算可见范围
const startIndex = computed(() => Math.max(0, currentIndex.value - CONFIG.bufferSize))
const endIndex = computed(() => Math.min(currentComponents.value.length - 1, currentIndex.value + CONFIG.visibleCount + CONFIG.bufferSize))

// 可见组件列表
const visibleItems = computed(() => {
  return currentComponents.value
    .slice(startIndex.value, endIndex.value + 1)
    .map((comp, idx) => ({
      ...comp,
      index: startIndex.value + idx
    }))
})

// 滚动进度
const scrollProgress = computed(() => {
  const totalScroll = totalHeight.value - window.innerHeight
  if (totalScroll <= 0) return 100
  return Math.min(100, Math.round((scrollTop.value / totalScroll) * 100))
})

// 获取项目样式
const getItemStyle = (index: number) => {
  return {
    position: 'absolute' as const,
    top: `${index * CONFIG.itemHeight}px`,
    height: `${CONFIG.itemHeight}px`,
    width: '100%'
  }
}

// 统计分类数量
const countCategory = (category: string) => {
  return allComponents.value.filter(c => c.category === category).length
}

// 滚动处理
let scrollTimeout: ReturnType<typeof setTimeout> | null = null
const handleScroll = (e: Event) => {
  if (scrollTimeout) clearTimeout(scrollTimeout)
  
  scrollTimeout = setTimeout(() => {
    const target = e.target as HTMLElement
    scrollTop.value = target.scrollTop
    
    // 加载可见组件
    loadVisibleComponents()
  }, CONFIG.scrollDebounce)
}

// 加载可见组件
const loadVisibleComponents = () => {
  visibleItems.value.forEach(item => {
    if (!loadedComponents.value.has(item.id)) {
      // 延迟加载，避免阻塞滚动
      setTimeout(() => {
        item.loaded = true
        loadedComponents.value.add(item.id)
        
        // 刷新ScrollTrigger
        nextTick(() => {
          ScrollTrigger.refresh()
        })
      }, CONFIG.loadingDelay)
    }
  })
}

// 分类切换处理
const handleCategoryChange = () => {
  scrollTop.value = 0
  loadedComponents.value.clear()
  
  // 重置组件加载状态
  currentComponents.value.forEach(c => {
    c.loaded = false
  })
  
  // 重新加载可见组件
  nextTick(() => {
    loadVisibleComponents()
  })
}

// 生命周期
onMounted(() => {
  initializeComponents()
  loadVisibleComponents()
  
  // 滚动到顶部
  if (scrollWrapper.value) {
    scrollWrapper.value.scrollTop = 0
  }
})

onUnmounted(() => {
  if (scrollTimeout) clearTimeout(scrollTimeout)
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped>
.virtual-scroll-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.component-selector {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  padding: 10px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.component-selector select {
  background: #1a1a2e;
  color: #fff;
  border: 1px solid #a855f7;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.virtual-scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
}

.scroll-spacer {
  width: 100%;
  background: transparent;
}

.virtual-item {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.item-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
}

.item-index {
  font-size: 14px;
  color: #a855f7;
  font-weight: bold;
}

.item-name {
  font-size: 16px;
  color: #fff;
  font-weight: 600;
}

.item-category {
  font-size: 12px;
  color: #64748b;
  padding: 2px 8px;
  background: rgba(168, 85, 247, 0.2);
  border-radius: 4px;
}

.component-content {
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.component-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
}

.placeholder-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(168, 85, 247, 0.3);
  border-top-color: #a855f7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.scroll-indicator {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  padding: 10px 20px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 200px;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #a855f7, #6366f1);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #64748b;
}

/* 滚动条美化 */
.virtual-scroll-container::-webkit-scrollbar {
  width: 8px;
}

.virtual-scroll-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}

.virtual-scroll-container::-webkit-scrollbar-thumb {
  background: #a855f7;
  border-radius: 4px;
}

.virtual-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #7c3aed;
}
</style>
