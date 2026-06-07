<template>
  <div class="component-library">
    <!-- 头部 -->
    <div class="library-header">
      <h3 class="library-title">
        <span class="title-icon">🧩</span>
        组件库
        <span class="component-count">{{ filteredComponents.length }}</span>
      </h3>
    </div>

    <!-- 搜索框 -->
    <div class="search-box">
      <input
        v-model="searchText"
        type="text"
        class="search-input"
        placeholder="🔍 搜索组件名称..."
        @input="onSearch"
      />
    </div>

    <!-- 分类筛选 -->
    <div class="category-filters">
      <button
        v-for="cat in categories"
        :key="cat.key"
        class="filter-btn"
        :class="{ active: activeCategory === cat.key }"
        @click="activeCategory = cat.key"
      >
        <span class="filter-icon">{{ cat.icon }}</span>
        <span class="filter-label">{{ cat.label }}</span>
        <span class="filter-count">{{ cat.count }}</span>
      </button>
    </div>

    <!-- 组件网格 -->
    <div class="components-grid" v-if="filteredComponents.length > 0">
      <ComponentCard
        v-for="comp in paginatedComponents"
        :key="comp.name"
        :component="comp"
        :is-selected="store.selectedComponents.some(c => c.name === comp.name)"
        @toggle="store.toggleComponent(comp)"
      />
    </div>

    <!-- 空状态 -->
    <div class="empty-state" v-else>
      <div class="empty-icon">🔍</div>
      <p>未找到匹配的组件</p>
      <p class="empty-hint">尝试其他搜索关键词或切换分类</p>
    </div>

    <!-- 加载更多 -->
    <div class="load-more" v-if="hasMore">
      <button class="load-more-btn" @click="loadMore" :disabled="isLoadingMore">
        {{ isLoadingMore ? '加载中...' : `加载更多 (剩余 ${remaining})` }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useOrchestrationStore } from '../store/orchestrationStore'
import { useOrchestration, CATEGORY_LABELS, CATEGORY_ICONS } from '../composables/useOrchestration'
import ComponentCard from './ComponentCard.vue'
import type { ComponentItem } from '../types/orchestration'
import type { ComponentCategory } from '@/api/ai/component-knowledge-builder'

const { getAvailableComponents } = useOrchestration()
const store = useOrchestrationStore()

// ==================== 状态 ====================
const searchText = ref('')
const activeCategory = ref('all')
const currentPage = ref(1)
const isLoadingMore = ref(false)
const PAGE_SIZE = 12

// ==================== 数据 ====================
const allComponents = ref<ComponentItem[]>([])

onMounted(() => {
  allComponents.value = getAvailableComponents()
})

// ==================== 分类 ====================
const categoryKeys: ComponentCategory[] = [
  'card-image', 'card-img', 'card-text', 'card-3d',
  'card-time', 'card-list', 'card-base', 'card-other'
]

const categories = computed(() => {
  const cats = [{
    key: 'all',
    label: '全部',
    icon: '📦',
    count: allComponents.value.length
  }]
  categoryKeys.forEach(key => {
    const count = allComponents.value.filter(c => c.category === key).length
    if (count > 0) {
      cats.push({
        key,
        label: CATEGORY_LABELS[key] || key,
        icon: CATEGORY_ICONS[key] || '📦',
        count
      })
    }
  })
  return cats
})

// ==================== 筛选 ====================
const filteredComponents = computed(() => {
  let list = allComponents.value

  // 分类筛选
  if (activeCategory.value !== 'all') {
    list = list.filter(c => c.category === activeCategory.value)
  }

  // 搜索
  const query = searchText.value.trim().toLowerCase()
  if (query.length >= 2) {
    list = list.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.categoryLabel.toLowerCase().includes(query) ||
      c.dirName.toLowerCase().includes(query)
    )
  }

  return list
})

// ==================== 分页 ====================
const paginatedComponents = computed(() =>
  filteredComponents.value.slice(0, currentPage.value * PAGE_SIZE)
)

const hasMore = computed(() =>
  currentPage.value * PAGE_SIZE < filteredComponents.value.length
)

const remaining = computed(() =>
  filteredComponents.value.length - currentPage.value * PAGE_SIZE
)

function loadMore() {
  isLoadingMore.value = true
  setTimeout(() => {
    currentPage.value++
    isLoadingMore.value = false
  }, 200)
}

// 分类切换时重置分页
watch(activeCategory, () => {
  currentPage.value = 1
})

function onSearch() {
  currentPage.value = 1
}
</script>

<style scoped lang="scss">
.component-library {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(15, 23, 42, 0.6);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
}

.library-header {
  padding: 20px 16px 12px;
  flex-shrink: 0;
}

.library-title {
  font-size: 1.1rem;
  color: #e2e8f0;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  .title-icon {
    font-size: 1.3rem;
  }

  .component-count {
    margin-left: auto;
    background: rgba(99, 102, 241, 0.2);
    color: #818cf8;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 0.8rem;
  }
}

.search-box {
  padding: 0 16px 12px;
  flex-shrink: 0;
}

.search-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1.5px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: #e2e8f0;
  font-size: 0.85rem;
  outline: none;
  transition: all 0.25s;

  &:focus {
    border-color: rgba(99, 102, 241, 0.5);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    background: rgba(255, 255, 255, 0.06);
  }

  &::placeholder {
    color: #64748b;
  }
}

.category-filters {
  padding: 0 12px 12px;
  display: flex;
  overflow-x: auto;
  gap: 6px;
  flex-shrink: 0;

  &::-webkit-scrollbar {
    height: 0;
  }
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
  color: #94a3b8;
  font-size: 0.75rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #cbd5e1;
  }

  &.active {
    background: rgba(99, 102, 241, 0.15);
    border-color: rgba(99, 102, 241, 0.3);
    color: #818cf8;
  }

  .filter-icon {
    font-size: 0.9rem;
  }

  .filter-label {
    font-weight: 500;
  }

  .filter-count {
    font-size: 0.65rem;
    padding: 1px 6px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.06);
  }
}

.components-grid {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px 12px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  align-content: start;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
  text-align: center;
  padding: 40px 20px;

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 12px;
  }

  p {
    margin: 0 0 4px;
    font-size: 0.9rem;
  }

  .empty-hint {
    font-size: 0.75rem;
    color: #475569;
  }
}

.load-more {
  padding: 8px 12px 16px;
  text-align: center;
  flex-shrink: 0;
}

.load-more-btn {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  background: transparent;
  color: #64748b;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    color: #94a3b8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
