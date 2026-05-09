<template>
  <div class="lazy-load-gallery">
    <!-- 页面标题 -->
    <header class="page-header">
      <h1 class="page-title">滚动动画组件库</h1>
      <div class="page-subtitle">
        <span>{{ filteredComponents.length }} 个组件 · 懒加载优化</span>
      </div>
    </header>

    <!-- 搜索框 -->
    <div class="search-container">
      <div class="search-wrapper" :class="{ 'has-search': searchQuery }">
        <div class="search-input-container">
          <svg
            class="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="搜索组件名称..."
            @input="handleSearch"
          />
          <button class="search-clear" title="清空搜索" @click="clearSearch">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <button class="nav-btn create-btn" @click="goToCreate" style="margin-left: 80px">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          创建模板
        </button>
        <button class="nav-btn project-btn" @click="goToProjectList">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
          </svg>
          项目列表
        </button>
      </div>
      <div v-if="searchQuery && filteredComponents.length === 0" class="search-empty">
        <div class="empty-icon">🔍</div>
        <p>未找到匹配的组件</p>
        <p class="empty-hint">尝试搜索其他关键词</p>
        <button class="clear-search-btn" @click="clearSearch">清空搜索</button>
      </div>
      <div v-if="searchQuery && filteredComponents.length > 0" class="search-result-count">
        <span class="result-icon">✓</span>
        在所有分类中找到 {{ filteredComponents.length }} 个匹配组件
      </div>
    </div>

    <!-- 分类筛选 -->
    <div class="filter-bar">
      <button
        v-for="cat in categories"
        :key="cat.id"
        :class="['filter-btn', { active: currentCategory === cat.id && !searchQuery }]"
        :disabled="!!searchQuery"
        :data-category="cat.id"
        @click="handleCategoryChange(cat.id)"
      >
        {{ cat.name }} ({{ cat.count }})
      </button>

      <button
        v-if="selectedComponents.size > 0"
        :key="88888888"
        :class="['filter-btn', 'clear-btn']"
        title="清除所有选中"
        @click="clearAllSelections"
      >
        清除 ({{ selectedComponents.size }})
      </button>

      <button
        v-if="selectedComponents.size > 0"
        :key="9999999"
        :class="['filter-btn', 'save-btn']"
        title="保存到IndexedDB"
        @click="saveSelections"
      >
        保存到数据库
      </button>

      <button
        :key="7777777"
        :class="['filter-btn', 'load-btn']"
        title="查看已保存的收藏集"
        @click="openCollectionsModal"
      >
        📚 我的收藏
      </button>
    </div>

    <!-- 组件容器 -->
    <div ref="containerRef" class="components-container">
      <div
        v-for="(item, index) in filteredComponents"
        :key="item.id"
        class="component-wrapper"
        :class="{
          'component-visible': index <= visibleIndex,
          'selected-wrapper': selectedComponents.has(item.id)
        }"
      >
        <div class="item-header">
          <span class="item-number">#{{ index + 1 }}</span>
          <label class="item-checkbox" :class="{ checked: selectedComponents.has(item.id) }">
            <input
              type="checkbox"
              :checked="selectedComponents.has(item.id)"
              @change="toggleComponentSelection(item.id)"
            />
            <span class="checkmark"></span>
          </label>
          <span class="item-name">{{ item.name }}</span>
        </div>

        <!-- 懒加载组件或占位符 -->
        <template v-if="index <= visibleIndex && visibleIndex >= 0">
          <Suspense>
            <template #default>
              <component :is="item.component" :key="`${item.id}-${visibleIndex}`" />
            </template>
            <template #fallback>
              <div class="component-loading">
                <div class="loading-spinner"></div>
                <p>加载组件中...</p>
              </div>
            </template>
          </Suspense>
        </template>
        <div v-else class="component-placeholder">
          <div class="placeholder-content">
            <div class="placeholder-icon">📦</div>
            <p>滚动加载组件 #{{ index + 1 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部状态栏 -->
    <div class="status-bar">
      <div class="status-item">
        <span>已加载:</span>
        <span>
          {{ Math.min(visibleIndex + 1, filteredComponents.length) }} /
          {{ filteredComponents.length }}
        </span>
      </div>
      <div class="status-item">
        <span>当前:</span>
        <span>#{{ Math.min(visibleIndex + 1, filteredComponents.length) }}</span>
      </div>
      <div class="status-item">
        <span>分类:</span>
        <span>{{ categories.find(c => c.id === currentCategory)?.name || currentCategory }}</span>
      </div>
      <div v-if="selectedComponents.size > 0" class="status-item selected-highlight">
        <span>已选中:</span>
        <span>{{ selectedComponents.size }} 个组件</span>
      </div>
    </div>

    <!-- 收藏集弹窗 -->
    <CollectionsModal
      :visible="showCollectionsModal"
      @close="closeCollectionsModal"
      @load="handleLoadCollection"
      @delete="closeCollectionsModal"
    />

    <!-- 错误提示 -->
    <div v-if="loadingError" class="error-toast">
      <span class="error-icon">⚠️</span>
      <span>{{ loadingError }}</span>
      <button class="close-btn" @click="loadingError = null">×</button>
    </div>

    <!-- 返回顶部按钮 -->
    <button
      class="back-to-top"
      :class="{ 'is-visible': showBackToTop }"
      title="返回顶部"
      @click="scrollToTop"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, computed, onMounted, onUnmounted, markRaw, nextTick, watch } from 'vue'
import { defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { safeRefreshScrollTrigger } from '@/utils/gsapHelper'
import CollectionsModal from './components/CollectionsModal.vue'

gsap.registerPlugin(ScrollTrigger)

const router = useRouter()

// 状态
const containerRef = ref<HTMLElement | null>(null)
const currentCategory = ref('animation-1')
const searchQuery = ref('')
const visibleIndex = ref(0) // 初始只显示第1个组件
const loadingError = ref<string | null>(null)
const isLoading = ref(false)
const showBackToTop = ref(false) // 是否显示返回顶部按钮
const showCollectionsModal = ref(false) // 是否显示收藏集弹窗

// 选中的组件集合
const selectedComponents = ref<Set<string>>(new Set())

// 分类定义 - 动态生成
const categories = ref<{ id: string; name: string; count: number }[]>([])

// 所有组件
const allComponents = shallowRef<ComponentInfo[]>([])

// 初始化组件列表
const initializeComponents = () => {
  const componentFiles = import.meta.glob('./components/*.vue')
  const paths = Object.keys(componentFiles)

  allComponents.value = paths
    .filter(path => {
      const name = path.split('/').pop()?.replace('.vue', '') || ''
      // 排除 CollectionsModal 组件，因为它不应该在画廊中显示
      return name !== 'CollectionsModal'
    })
    .map((path, index) => {
      const name = path.split('/').pop()?.replace('.vue', '') || ''
      const category = getCategoryByIndex(index)

      // 创建带错误处理的异步组件
      const asyncComponent = defineAsyncComponent({
        loader: () => {
          console.log(`[LazyLoad] Loading component: ${name}`)
          return componentFiles[path]()
            .then(module => {
              console.log(`[LazyLoad] Successfully loaded: ${name}`)
              return module
            })
            .catch(error => {
              console.error(`[LazyLoad] Failed to load ${name}:`, error)
              loadingError.value = `Failed to load ${name}: ${error.message}`
              throw error
            })
        },
        loadingComponent: {
          template: '<div class="component-loading">加载中...</div>'
        },
        errorComponent: {
          template: '<div   class="component-error">加载失败</div>'
        },
        delay: 200,
        timeout: 30000 // 增加到30秒
      })

      return {
        id: name,
        name,
        category,
        component: markRaw(asyncComponent)
      }
    })

  updateCategoryCounts()
}

// 获取分类 - 基于索引，每20个组件为一组
const getCategoryByIndex = (index: number): string => {
  const groupIndex = Math.floor(index / 20)
  return `animation-${groupIndex + 1}`
}

// 更新分类计数 - 动态生成分类
const updateCategoryCounts = () => {
  const components = allComponents.value
  if (!components || !Array.isArray(components)) return

  const totalCategories = Math.ceil(components.length / 20)
  const cats: { id: string; name: string; count: number }[] = []

  // 添加动画分类
  for (let i = 0; i < totalCategories; i++) {
    const start = i * 20
    const end = Math.min((i + 1) * 20, components.length)
    cats.push({
      id: `animation-${i + 1}`,
      name: `动画${i + 1}`,
      count: end - start
    })
  }

  // 添加选中分类
  cats.push({
    id: 'selected',
    name: '✓ 已选中',
    count: selectedComponents.value.size
  })

  categories.value = cats
}

// 过滤后的组件
const filteredComponents = computed(() => {
  const components = allComponents.value
  if (!components || !Array.isArray(components)) {
    return []
  }

  // 如果有搜索词，在所有组件中搜索
  if (searchQuery.value && searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    console.log('[搜索] 搜索词:', query)
    console.log('[搜索] 总组件数:', components.length)

    const results = components.filter(c => {
      const name = c.name.toLowerCase()
      // 移除空格、连字符、下划线，使搜索更灵活
      const normalizedName = name.replace(/[\s-_]/g, '')
      const normalizedQuery = query.replace(/[\s-_]/g, '')
      const matches = normalizedName.includes(normalizedQuery)

      if (matches) {
        console.log('[搜索] 匹配:', c.name)
      }
      return matches
    })

    console.log('[搜索] 结果数:', results.length)
    return results
  }

  // 选中分类：显示选中的组件
  if (currentCategory.value === 'selected') {
    return components.filter(c => selectedComponents.value.has(c.id))
  }

  // 否则按分类过滤
  return components.filter(c => c.category === currentCategory.value)
})

// 处理滚动加载
let refreshTimeout: ReturnType<typeof setTimeout> | null = null
let isScrolling = false
let searchDebounce: ReturnType<typeof setTimeout> | null = null

const handleScroll = () => {
  // 检查是否显示返回顶部按钮
  const scrollY = window.scrollY || document.documentElement.scrollTop
  showBackToTop.value = scrollY > 300

  // 如果visibleIndex为负数，跳过检查
  if (visibleIndex.value < 0) return

  if (isScrolling) return
  isScrolling = true

  requestAnimationFrame(() => {
    checkVisibleComponents()
    isScrolling = false
  })

  if (refreshTimeout) {
    clearTimeout(refreshTimeout)
  }
  refreshTimeout = setTimeout(() => {
    safeRefreshScrollTrigger()
    refreshTimeout = null
  }, 150)
}

// 返回顶部
const scrollToTop = () => {
  // 临时禁用滚动监听，避免触发昂贵的刷新操作
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleScroll)
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, 600) // 600ms 足够 smooth 滚动完成
  // 等待滚动完成后重新启用监听
  setTimeout(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    // 重置滚动位置相关的状态
    showBackToTop.value = false
    // 重新检查可见组件
    checkVisibleComponents()
  }, 600) // 600ms 足够 smooth 滚动完成
}

// 搜索相关方法
const handleSearch = () => {
  // 使用防抖减少频繁更新
  if (searchDebounce.value) {
    clearTimeout(searchDebounce.value)
  }
  searchDebounce.value = setTimeout(async () => {
    // 搜索时重置可见索引
    visibleIndex.value = -1
    await nextTick()
    visibleIndex.value = 0
    // 延迟检查可见组件
    setTimeout(async () => {
      await checkVisibleComponents()
    }, 200)
    searchDebounce.value = null
  }, 300)
}

const clearSearch = () => {
  searchQuery.value = ''
  if (searchDebounce.value) {
    clearTimeout(searchDebounce.value)
    searchDebounce.value = null
  }
  visibleIndex.value = -1
  nextTick(() => {
    visibleIndex.value = 0
    setTimeout(async () => {
      await checkVisibleComponents()
    }, 200)
  })
}

const handleCategoryChange = (categoryId: string) => {
  currentCategory.value = categoryId
  // 切换分类时清空搜索
  searchQuery.value = ''
  visibleIndex.value = -1
  nextTick(() => {
    visibleIndex.value = 0
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // 延迟加载新组件
    setTimeout(async () => {
      visibleIndex.value = 0
      await nextTick()
      await checkVisibleComponents()

      // 延迟刷新确保新组件完全渲染
      setTimeout(() => {
        safeRefreshScrollTrigger()
      }, 200)
    }, 500)
  })
}

// 切换组件选中状态
const toggleComponentSelection = (componentId: string) => {
  if (selectedComponents.value.has(componentId)) {
    selectedComponents.value.delete(componentId)
  } else {
    selectedComponents.value.add(componentId)
  }
  // 更新选中分类的计数
  updateCategoryCounts()
}

// 清除所有选中
const clearAllSelections = () => {
  if (confirm('确定要清除所有已选中的组件吗？')) {
    selectedComponents.value.clear()
    updateCategoryCounts()
  }
}

// 跳转到创建模板页面
const goToCreate = () => {
  router.push({
    path: '/template',
    query: {
      state: 'create'
    }
  })
}

// 跳转到项目列表页面
const goToProjectList = () => {
  router.push({
    path: '/template-list'
  })
}

// IndexedDB 数据库初始化
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AnimationGalleryDB', 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains('collections')) {
        const store = db.createObjectStore('collections', { keyPath: 'id', autoIncrement: true })
        store.createIndex('name', 'name', { unique: false })
        store.createIndex('createdAt', 'createdAt', { unique: false })
      }
    }
  })
}

// 保存选中状态到 IndexedDB
const saveSelections = async () => {
  const name = prompt('请输入收藏集名称：', `收藏集 ${new Date().toLocaleDateString()}`)
  if (!name || name.trim() === '') {
    alert('请输入有效的名称！')
    return
  }

  const selections = Array.from(selectedComponents.value)
  const collection = {
    name: name.trim(),
    data: JSON.stringify(selections),
    createdAt: new Date().toISOString()
  }

  try {
    const db = await initDB()
    const transaction = db.transaction('collections', 'readwrite')
    const store = transaction.objectStore('collections')
    const request = store.add(collection)
    request.onsuccess = () => {
      const id = request.result as number
      alert(`✅ 保存成功！\n\n名称：${name}\n组件数量：${selections.length}\nID：${id}`)
      db.close()

      // 清除所有选中状态
      selectedComponents.value.clear()
      updateCategoryCounts()
    }

    request.onerror = () => {
      alert(`❌ 保存失败：${request.error?.message}`)
      db.close()
    }
  } catch (error) {
    console.error('[IndexedDB] 保存失败:', error)
    alert(`❌ 保存失败：${error}`)
  }
}

// 打开收藏集弹窗
const openCollectionsModal = () => {
  showCollectionsModal.value = true
}

// 关闭收藏集弹窗
const closeCollectionsModal = () => {
  showCollectionsModal.value = false
}

// 加载收藏集到选中状态
const handleLoadCollection = (selections: string[]) => {
  selectedComponents.value = new Set(selections)
  updateCategoryCounts()

  // 切换到"已选中"分类
  currentCategory.value = 'selected'

  // 清空搜索
  searchQuery.value = ''

  // 重置可见索引
  visibleIndex.value = -1
  nextTick(() => {
    visibleIndex.value = 0
    setTimeout(() => {
      checkVisibleComponents()
    }, 100)
  })

  // alert(`✅ 已加载收藏集，共 ${selections.length} 个组件`)
  closeCollectionsModal()
}

const checkVisibleComponents = async () => {
  if (!containerRef.value || isLoading.value) return

  // 如果visibleIndex为负数，跳过检查
  if (visibleIndex.value < 0) return

  const container = containerRef.value
  const containerRect = container.getBoundingClientRect()
  const viewportHeight = window.innerHeight

  // 找到当前可见的组件
  const wrappers = container.querySelectorAll('.component-wrapper')
  let newVisibleIndex = visibleIndex.value

  wrappers.forEach((wrapper, index) => {
    const rect = wrapper.getBoundingClientRect()
    const isVisible = rect.top < viewportHeight * 1.2 // 只加载即将进入视口的组件

    if (isVisible && index > visibleIndex.value) {
      newVisibleIndex = index
    }
  })

  // 如果有新的组件需要加载
  if (newVisibleIndex > visibleIndex.value) {
    isLoading.value = true

    // 逐个加载组件,避免同时加载太多
    for (let i = visibleIndex.value + 1; i <= newVisibleIndex; i++) {
      visibleIndex.value = i
      await nextTick()
      // 短暂延迟,让组件有时间初始化
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    isLoading.value = false

    // 所有组件加载完成后刷新 ScrollTrigger
    safeRefreshScrollTrigger()
  }
}

// 监听分类变化,重置可见索引
watch(currentCategory, async newCategory => {
  console.log('[LazyLoad] Category changed to:', newCategory)
  console.log('[LazyLoad] Filtered components count:', filteredComponents.value.length)

  // 先重置可见索引，强制重新渲染
  visibleIndex.value = -1
  isLoading.value = false

  await nextTick()

  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })

  // 等待滚动后再加载组件
  setTimeout(async () => {
    visibleIndex.value = 0
    await nextTick()
    await checkVisibleComponents()

    // 延迟刷新确保新组件完全渲染
    setTimeout(() => {
      safeRefreshScrollTrigger()
    }, 200)
  }, 500)
})

// 组件类型
interface ComponentInfo {
  id: string
  name: string
  category: string
  component: any
}

// 从 localStorage 恢复选中状态
const restoreSelections = () => {
  const saved = localStorage.getItem('selected-components')
  if (saved) {
    try {
      const selections = JSON.parse(saved)
      selectedComponents.value = new Set(selections)
      updateCategoryCounts()
      console.log('[LazyLoad] 恢复选中状态:', selections.length, '个组件')
    } catch (error) {
      console.error('[LazyLoad] 恢复选中状态失败:', error)
    }
  }
}

// 生命周期
onMounted(async () => {
  if (!allComponents.value || !Array.isArray(allComponents.value)) {
    allComponents.value = []
  }
  initializeComponents()

  // 恢复之前保存的选中状态
  restoreSelections()

  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleScroll, { passive: true })

  await nextTick()
  await checkVisibleComponents()

  // 延迟刷新确保初始组件完全渲染
  setTimeout(() => {
    safeRefreshScrollTrigger()
  }, 300)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleScroll)
  if (refreshTimeout) {
    clearTimeout(refreshTimeout)
  }
  if (searchDebounce) {
    clearTimeout(searchDebounce)
  }

  // 清理所有 ScrollTrigger 实例
  try {
    ScrollTrigger.getAll().forEach(trigger => {
      try {
        trigger.kill()
      } catch (error) {
        // 忽略单个 trigger 清理失败
      }
    })
  } catch (error) {
    console.warn('Error during ScrollTrigger cleanup:', error)
  }
})
</script>

<style scoped lang="scss">
.lazy-load-gallery {
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

// 搜索框样式
.search-container {
  margin-bottom: 20px;
  position: relative;
}

.search-wrapper {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  align-items: stretch;
  gap: 12px;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 10px 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
  }

  &.has-search {
    background: rgba(167, 139, 250, 0.08);
    border-color: rgba(167, 139, 250, 0.2);
  }
}

.search-input-container {
  position: relative;
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 22px;
  width: 20px;
  height: 20px;
  color: #94a3b8;
  pointer-events: none;
  z-index: 5;
  transition: color 0.3s;
}

.search-input {
  width: 100%;
  padding: 14px 50px 14px 45px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 15px;
  transition: all 0.3s;

  &::placeholder {
    color: #64748b;
  }

  &:focus {
    outline: none;
    border-color: #a78bfa;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.2);
  }

  &:focus ~ .search-icon {
    color: #a78bfa;
  }
}

.search-clear {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #f87171;
  z-index: 10;
  backdrop-filter: blur(10px);

  svg {
    width: 16px;
    height: 16px;
    pointer-events: none;
  }

  &:hover {
    background: rgba(239, 68, 68, 0.3);
    border-color: rgba(239, 68, 68, 0.5);
    transform: translateY(-50%) scale(1.15);
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  }

  &:active {
    transform: translateY(-50%) scale(1.05);
  }
}

// 导航按钮样式
.nav-btn {
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  &.create-btn {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1));
    border-color: rgba(34, 197, 94, 0.3);

    &:hover {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.2));
      border-color: rgba(34, 197, 94, 0.5);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
    }
  }

  &.project-btn {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1));
    border-color: rgba(59, 130, 246, 0.3);

    &:hover {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.2));
      border-color: rgba(59, 130, 246, 0.5);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    }
  }

  &:active {
    transform: translateY(0);
  }
}

.search-empty {
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.clear-search-btn {
  margin-top: 15px;
  padding: 10px 24px;
  background: linear-gradient(135deg, #a78bfa, #60a5fa);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(167, 139, 250, 0.4);
  }
}

.search-result-count {
  text-align: center;
  padding: 12px 20px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 8px;
  color: #22c55e;
  font-size: 14px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  animation: slideDown 0.3s ease-out;
}

.result-icon {
  font-weight: bold;
  font-size: 16px;
}

.empty-hint {
  font-size: 13px;
  color: #64748b;
  margin-top: 5px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

  &.small {
    margin-left: 10px;
    padding: 4px 10px;
  }

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
  }

  &.active {
    background: linear-gradient(135deg, #a78bfa, #60a5fa);
    border-color: transparent;

    // 选中分类的特殊样式
    &[data-category='selected'] {
      background: linear-gradient(135deg, #22c55e, #16a34a);
    }
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: rgba(255, 255, 255, 0.05);

    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  &.clear-btn {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.4);

    &:hover {
      background: rgba(239, 68, 68, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
    }
  }

  &.save-btn {
    background: rgba(34, 197, 94, 0.2);
    border-color: rgba(34, 197, 94, 0.4);

    &:hover {
      background: rgba(34, 197, 94, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
    }
  }

  &.load-btn {
    background: rgba(59, 130, 246, 0.2);
    border-color: rgba(59, 130, 246, 0.4);

    &:hover {
      background: rgba(59, 130, 246, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    }
  }
}

.components-container {
  width: 100%;
  margin: 0 auto;
}

.component-wrapper {
  margin-bottom: 40px;
  min-height: 400px;
  transition: all 0.3s;

  &.selected-wrapper {
    border: 2px solid rgba(34, 197, 94, 0.5);
    border-radius: 14px;
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.15);

    .item-header {
      background: rgba(34, 197, 94, 0.1);
      border-color: rgba(34, 197, 94, 0.3);
    }
  }
}

.item-header {
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
  border-radius: 12px 12px 0 0;
}

.item-number {
  padding: 4px 10px;
  background: linear-gradient(135deg, #a78bfa, #60a5fa);
  border-radius: 6px;
  font-size: 12px;
  font-weight: bold;
}

.item-checkbox {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkmark {
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &::after {
      content: '✓';
      color: white;
      font-size: 14px;
      font-weight: bold;
      opacity: 0;
      transform: scale(0);
      transition: all 0.2s ease;
    }
  }

  &.checked .checkmark {
    background: linear-gradient(135deg, #a78bfa, #60a5fa);
    border-color: transparent;

    &::after {
      opacity: 1;
      transform: scale(1);
    }
  }

  &:hover .checkmark {
    border-color: rgba(167, 139, 250, 0.6);
  }

  &.checked:hover .checkmark {
    background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  }
}

.item-name {
  flex: 1;
  font-weight: 600;
  color: #e2e8f0;
}

.component-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0 0 12px 12px;
}

.placeholder-content {
  text-align: center;
  color: #94a3b8;
}

.placeholder-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.component-visible {
  opacity: 1;
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

  &.selected-highlight {
    background: rgba(34, 197, 94, 0.2);
    padding: 4px 12px;
    border-radius: 6px;

    span:last-child {
      color: #22c55e;
    }
  }
}

// 加载状态样式
.component-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0 0 12px 12px;
  color: #94a3b8;
}

.loading-spinner {
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

.component-error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0 0 12px 12px;
  color: #f87171;
}

// 错误提示
.error-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(239, 68, 68, 0.95);
  color: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  z-index: 10000;
  animation: slideIn 0.3s ease-out;
  max-width: 500px;
}

.error-icon {
  font-size: 24px;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

// 返回顶部按钮
.back-to-top {
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #a78bfa, #60a5fa);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 9999;
  box-shadow: 0 4px 15px rgba(167, 139, 250, 0.4);
  transition: all 0.3s ease;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);

  svg {
    width: 24px;
    height: 24px;
    transition: transform 0.3s ease;
  }

  &.is-visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(167, 139, 250, 0.6);

    svg {
      transform: translateY(-2px);
    }
  }

  &:active {
    transform: translateY(0);
  }
}
</style>
