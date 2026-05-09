<template>
  <div class="smart-scroll-gallery">
    <!-- 顶部控制栏 -->
    <div class="control-bar">
      <div class="search-box">
        <input
          v-model="searchQuery"
          placeholder="搜索组件..."
          @input="handleSearch"
        />
      </div>
      
      <div class="filter-tabs">
        <button
          v-for="cat in categories"
          :key="cat.id"
          :class="['tab-btn', { active: currentCategory === cat.id }]"
          @click="selectCategory(cat.id)"
        >
          {{ cat.name }}
          <span class="count">{{ cat.count }}</span>
        </button>
      </div>
    </div>

    <!-- 虚拟滚动容器 -->
    <div 
      class="virtual-scroll-container"
      ref="scrollContainer"
      @scroll="handleScroll"
    >
      <!-- 占位div：确保总高度 -->
      <div 
        class="scroll-spacer"
        :style="{ height: totalHeight + 'px' }"
      ></div>
      
      <!-- 可见组件 -->
      <div
        v-for="item in visibleItems"
        :key="item.id"
        class="virtual-item"
        :style="getItemStyle(item)"
      >
        <!-- 组件卡片 -->
        <div class="component-card">
          <!-- 卡片头部 -->
          <div class="card-header">
            <div class="header-left">
              <span class="item-number">#{{ item.index + 1 }}</span>
              <span class="item-category">{{ getCategoryName(item.category) }}</span>
            </div>
            <div class="header-right">
              <button 
                class="action-btn"
                @click="toggleFavorite(item.id)"
                :class="{ active: favorites.has(item.id) }"
              >
                ♥
              </button>
              <button 
                class="action-btn"
                @click="copyComponentName(item.name)"
                title="复制组件名"
              >
                📋
              </button>
            </div>
          </div>

          <!-- 组件名称 -->
          <div class="card-title">
            <h2>{{ item.name }}</h2>
            <p v-if="item.description">{{ item.description }}</p>
          </div>

          <!-- 组件内容 -->
          <div class="card-content">
            <Suspense>
              <template #default>
                <component 
                  :is="item.component" 
                  v-if="item.loaded"
                  @mounted="onComponentMounted(item)"
                />
              </template>
              <template #fallback>
                <div class="loading-placeholder">
                  <div class="loading-spinner"></div>
                  <p>加载组件...</p>
                </div>
              </template>
            </Suspense>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部状态栏 -->
    <div class="status-bar">
      <div class="status-left">
        <span class="progress-text">
          {{ currentIndex + 1 }} / {{ filteredComponents.length }}
        </span>
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: scrollProgress + '%' }"
          ></div>
        </div>
      </div>
      <div class="status-right">
        <span class="visible-count">
          可见: {{ visibleItems.length }} / {{ filteredComponents.length }}
        </span>
        <span class="memory-info">
          内存: {{ memoryUsage }}
        </span>
      </div>
    </div>

    <!-- 快速导航 -->
    <div class="quick-nav" v-if="showQuickNav">
      <div class="nav-list">
        <button
          v-for="(_, idx) in Math.min(10, filteredComponents.length)"
          :key="idx"
          class="nav-item"
          :class="{ active: currentIndex === idx }"
          @click="scrollToIndex(idx)"
        >
          {{ idx + 1 }}
        </button>
        <button v-if="filteredComponents.length > 10" class="nav-item more">
          ...
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { defineAsyncComponent } from 'vue'

// 配置
const CONFIG = {
  itemHeight: 650,        // 每个组件的高度
  visibleCount: 3,        // 同时可见的组件数量
  bufferSize: 2,          // 上下缓冲区大小
  scrollDebounce: 50,     // 滚动防抖时间
  loadingDelay: 50,       // 组件加载延迟
  prefetchDistance: 3,    // 预加载距离
}

// 状态
const scrollContainer = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const searchQuery = ref('')
const currentCategory = ref('all')
const favorites = ref(new Set<string>())
const loadedComponents = ref(new Map<string, any>())
const showQuickNav = ref(false)
const memoryUsage = ref('0 MB')

// 分类
const categories = ref([
  { id: 'all', name: '全部', count: 0 },
  { id: 'core', name: '核心', count: 0 },
  { id: '3d', name: '3D', count: 0 },
  { id: 'creative', name: '创意', count: 0 },
  { id: 'scroll', name: '滚动', count: 0 },
  { id: 'card', name: '卡片', count: 0 },
  { id: 'text', name: '文字', count: 0 },
  { id: 'image', name: '图片', count: 0 },
])

// 所有组件配置
const allComponents = ref<any[]>([])

// 初始化组件
const initializeComponents = async () => {
  // 动态导入所有组件 (包括 Scroll* 和 AccordionCards 等)
  const componentModules = {
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

  const components = await Promise.all(
    Object.entries(componentModules).map(async ([path, module]: [string, any]) => {
      const name = path.split('/').pop()?.replace('.vue', '') || ''
      const category = categorizeComponent(name)

      return {
        id: name,
        name,
        component: defineAsyncComponent({
          loader: module,
          loadingComponent: {
            template: '<div class="loading-placeholder"><div class="loading-spinner"></div></div>'
          },
          delay: 200,
          timeout: 30000
        }),
        category,
        priority: getPriority(category),
        loaded: false
      }
    })
  )

  allComponents.value = components
  updateCategoryCounts()
}

// 组件分类
const categorizeComponent = (name: string): string => {
  const lowerName = name.toLowerCase()
  
  if (lowerName.includes('3d') || lowerName.includes('tunnel') || lowerName.includes('cube') || lowerName.includes('gallery')) return '3d'
  if (lowerName.includes('card')) return 'card'
  if (lowerName.includes('text')) return 'text'
  if (lowerName.includes('image')) return 'image'
  if (lowerName.includes('scroll') || lowerName.includes('parallax') || lowerName.includes('reveal')) return 'scroll'
  if (lowerName.includes('particle') || lowerName.includes('wave') || lowerName.includes('liquid')) return 'creative'
  
  return 'core'
}

// 获取优先级
const getPriority = (category: string): number => {
  const priorities: Record<string, number> = {
    core: 1,
    3d: 10,
    scroll: 20,
    creative: 30,
    card: 40,
    text: 50,
    image: 60
  }
  return priorities[category] || 100
}

// 更新分类计数
const updateCategoryCounts = () => {
  categories.value.forEach(cat => {
    if (cat.id === 'all') {
      cat.count = allComponents.value.length
    } else {
      cat.count = allComponents.value.filter(c => c.category === cat.id).length
    }
  })
}

// 过滤后的组件
const filteredComponents = computed(() => {
  let result = allComponents.value

  // 分类过滤
  if (currentCategory.value !== 'all') {
    result = result.filter(c => c.category === currentCategory.value)
  }

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(c => 
      c.name.toLowerCase().includes(query)
    )
  }

  return result
})

// 计算总高度
const totalHeight = computed(() => filteredComponents.value.length * CONFIG.itemHeight)

// 计算当前索引
const currentIndex = computed(() => Math.floor(scrollTop.value / CONFIG.itemHeight))

// 计算可见范围
const startIndex = computed(() => Math.max(0, currentIndex.value - CONFIG.bufferSize))
const endIndex = computed(() => Math.min(filteredComponents.value.length - 1, currentIndex.value + CONFIG.visibleCount + CONFIG.bufferSize))

// 可见组件
const visibleItems = computed(() => {
  return filteredComponents.value
    .slice(startIndex.value, endIndex.value + 1)
    .map((comp, idx) => ({
      ...comp,
      index: startIndex.value + idx,
      absoluteIndex: allComponents.value.indexOf(comp)
    }))
})

// 滚动进度
const scrollProgress = computed(() => {
  const totalScroll = totalHeight.value - (scrollContainer.value?.clientHeight || 0)
  if (totalScroll <= 0) return 100
  return Math.min(100, Math.round((scrollTop.value / totalScroll) * 100))
})

// 获取分类名称
const getCategoryName = (category: string) => {
  const cat = categories.value.find(c => c.id === category)
  return cat?.name || category
}

// 获取项目样式
const getItemStyle = (item: any) => {
  return {
    position: 'absolute' as const,
    top: `${item.index * CONFIG.itemHeight}px`,
    height: `${CONFIG.itemHeight}px`,
    width: '100%'
  }
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
    if (!item.loaded) {
      setTimeout(() => {
        item.loaded = true
      }, CONFIG.loadingDelay)
    }
  })
}

// 组件挂载回调
const onComponentMounted = (item: any) => {
  console.log(`组件已加载: ${item.name}`)
  updateMemoryUsage()
}

// 更新内存使用
const updateMemoryUsage = () => {
  if (performance && (performance as any).memory) {
    const used = Math.round((performance as any).memory.usedJSHeapSize / 1048576)
    memoryUsage.value = `${used} MB`
  }
}

// 分类选择
const selectCategory = (categoryId: string) => {
  currentCategory.value = categoryId
  scrollTop.value = 0
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = 0
  }
  // 重置加载状态
  allComponents.value.forEach(c => c.loaded = false)
}

// 搜索处理
const handleSearch = () => {
  scrollTop.value = 0
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = 0
  }
}

// 收藏切换
const toggleFavorite = (id: string) => {
  if (favorites.value.has(id)) {
    favorites.value.delete(id)
  } else {
    favorites.value.add(id)
  }
}

// 复制组件名
const copyComponentName = (name: string) => {
  navigator.clipboard.writeText(name)
}

// 滚动到指定索引
const scrollToIndex = (index: number) => {
  scrollTop.value = index * CONFIG.itemHeight
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollTop.value
  }
}

// 生命周期
onMounted(async () => {
  await initializeComponents()
  
  // 初始加载可见组件
  setTimeout(() => {
    loadVisibleComponents()
    showQuickNav.value = true
  }, 100)

  // 定期更新内存使用
  setInterval(updateMemoryUsage, 5000)
})

onUnmounted(() => {
  if (scrollTimeout) clearTimeout(scrollTimeout)
  
  // 清理组件
  loadedComponents.value.clear()
})
</script>

<style scoped>
.smart-scroll-gallery {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
}

/* 控制栏 */
.control-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(15, 15, 26, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-box {
  flex: 0 0 200px;
}

.search-box input {
  width: 100%;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
}

.search-box input:focus {
  border-color: #a855f7;
  background: rgba(255, 255, 255, 0.1);
}

.filter-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  flex: 1;
}

.tab-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #64748b;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.tab-btn.active {
  background: #a855f7;
  border-color: #a855f7;
  color: #fff;
}

.tab-btn .count {
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
}

/* 虚拟滚动容器 */
.virtual-scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  padding-top: 60px; /* 为控制栏留空间 */
  padding-bottom: 60px; /* 为状态栏留空间 */
}

.scroll-spacer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
}

/* 虚拟项目 */
.virtual-item {
  padding: 10px 20px;
}

.component-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
}

.component-card:hover {
  border-color: rgba(168, 85, 247, 0.3);
  box-shadow: 0 4px 20px rgba(168, 85, 247, 0.1);
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-number {
  font-size: 12px;
  color: #a855f7;
  font-weight: bold;
  padding: 2px 8px;
  background: rgba(168, 85, 247, 0.1);
  border-radius: 4px;
}

.item-category {
  font-size: 11px;
  color: #64748b;
  padding: 2px 6px;
  background: rgba(100, 116, 139, 0.1);
  border-radius: 3px;
  text-transform: uppercase;
}

.header-right {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  color: #64748b;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.action-btn.active {
  background: #ef4444;
  color: #fff;
}

/* 卡片标题 */
.card-title {
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.card-title h2 {
  font-size: 18px;
  color: #fff;
  margin: 0 0 6px 0;
}

.card-title p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

/* 卡片内容 */
.card-content {
  flex: 1;
  position: relative;
  min-height: 400px;
}

.loading-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
  color: #64748b;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(168, 85, 247, 0.2);
  border-top-color: #a855f7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 状态栏 */
.status-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(15, 15, 26, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.progress-text {
  font-size: 13px;
  color: #64748b;
  white-space: nowrap;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  max-width: 200px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #a855f7, #6366f1);
  transition: width 0.3s ease;
}

.status-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.visible-count,
.memory-info {
  font-size: 12px;
  color: #64748b;
}

/* 快速导航 */
.quick-nav {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 900;
  background: rgba(15, 15, 26, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 8px;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  color: #64748b;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.nav-item.active {
  background: #a855f7;
  color: #fff;
}

.nav-item.more {
  cursor: default;
}

/* 滚动条美化 */
.virtual-scroll-container::-webkit-scrollbar {
  width: 8px;
}

.virtual-scroll-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}

.virtual-scroll-container::-webkit-scrollbar-thumb {
  background: rgba(168, 85, 247, 0.3);
  border-radius: 4px;
}

.virtual-scroll-container::-webkit-scrollbar-thumb:hover {
  background: rgba(168, 85, 247, 0.5);
}

/* 响应式 */
@media (max-width: 768px) {
  .control-bar {
    flex-direction: column;
    gap: 10px;
    padding: 10px;
  }
  
  .search-box {
    width: 100%;
    flex: none;
  }
  
  .filter-tabs {
    width: 100%;
  }
  
  .quick-nav {
    display: none;
  }
}
</style>
