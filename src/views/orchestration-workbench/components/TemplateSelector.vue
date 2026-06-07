<template>
  <div class="template-selector" v-if="visible">
    <div class="selector-overlay" @click="$emit('close')"></div>
    <div class="selector-dialog">
      <div class="dialog-header">
        <h3>🎨 选择页面模板</h3>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <!-- 搜索 -->
      <div class="dialog-search">
        <input
          v-model="searchText"
          type="text"
          class="search-input"
          placeholder="🔍 搜索模板名称..."
        />
      </div>

      <!-- 分类标签 -->
      <div class="dialog-categories">
        <button
          v-for="cat in categories"
          :key="cat.key"
          class="cat-btn"
          :class="{ active: activeCategory === cat.key }"
          @click="activeCategory = cat.key"
        >
          {{ cat.icon }} {{ cat.label }}
          <span class="cat-count">{{ cat.count }}</span>
        </button>
      </div>

      <!-- 模板网格 -->
      <div class="templates-grid">
        <div
          v-for="tpl in filteredTemplates"
          :key="tpl.key"
          class="template-card"
          :class="{ selected: selectedKey === tpl.key }"
          @click="selectTemplate(tpl)"
        >
          <div class="tpl-icon">{{ getTemplateIcon(tpl) }}</div>
          <div class="tpl-info">
            <div class="tpl-label">{{ tpl.label }}</div>
            <div class="tpl-meta">
              <span>{{ tpl.categoryLabel }}</span>
              <span>·</span>
              <span>{{ tpl.panelCount }} 面板</span>
            </div>
          </div>
          <div class="tpl-arch" :class="`arch-${tpl.architecture}`">
            {{ tpl.architecture === 'A' ? 'onUpdate' : tpl.architecture === 'B' ? 'Timeline' : '混合' }}
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-if="filteredTemplates.length === 0">
        <p>未找到匹配的模板</p>
      </div>

      <!-- 底部操作 -->
      <div class="dialog-footer">
        <button class="footer-btn cancel-btn" @click="$emit('close')">取消</button>
        <button class="footer-btn confirm-btn" @click="confirmSelection" :disabled="!selectedKey">
          确认选择 {{ selectedKey ? '✓' : '' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useOrchestration, getTemplateCategory, TEMPLATE_CATEGORY_LABELS } from '../composables/useOrchestration'
import type { TemplateItem, TemplateCategory } from '../types/orchestration'

interface Props {
  visible: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  close: []
  select: [template: TemplateItem]
}>()

const { getAvailableTemplates, init } = useOrchestration()

const searchText = ref('')
const activeCategory = ref('all')
const selectedKey = ref<string | null>(null)
const allTemplates = ref<TemplateItem[]>([])

onMounted(async () => {
  await init()
  allTemplates.value = getAvailableTemplates()
})

// ==================== 分类 ====================
const categories = computed(() => {
  const cats: Record<string, { key: string; label: string; icon: string; count: number }> = {
    all: { key: 'all', label: '全部', icon: '📂', count: allTemplates.value.length },
    'scroll-basic': { key: 'scroll-basic', label: '滚动基础', icon: '📜', count: 0 },
    'scroll-effect': { key: 'scroll-effect', label: '滚动特效', icon: '✨', count: 0 },
    transition: { key: 'transition', label: '过渡动画', icon: '🔄', count: 0 },
    creative: { key: 'creative', label: '创意视效', icon: '🎭', count: 0 }
  }

  allTemplates.value.forEach(t => {
    if (cats[t.category]) {
      cats[t.category].count++
    }
  })

  return Object.values(cats).filter(c => c.count > 0 || c.key === 'all')
})

// ==================== 筛选 ====================
const filteredTemplates = computed(() => {
  let list = allTemplates.value

  if (activeCategory.value !== 'all') {
    list = list.filter(t => t.category === activeCategory.value)
  }

  const query = searchText.value.trim().toLowerCase()
  if (query.length >= 2) {
    list = list.filter(t =>
      t.label.toLowerCase().includes(query) ||
      t.key.toLowerCase().includes(query)
    )
  }

  return list
})

// ==================== 操作 ====================
function selectTemplate(tpl: TemplateItem) {
  selectedKey.value = tpl.key
}

function confirmSelection() {
  const tpl = allTemplates.value.find(t => t.key === selectedKey.value)
  if (tpl) {
    emit('select', tpl)
    emit('close')
  }
}

function getTemplateIcon(tpl: TemplateItem): string {
  const icons: Record<TemplateCategory, string> = {
    'scroll-basic': '📜',
    'scroll-effect': '✨',
    'transition': '🔄',
    'creative': '🎭'
  }
  return icons[tpl.category] || '📄'
}
</script>

<style scoped lang="scss">
.template-selector {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}
.selector-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}
.selector-dialog {
  position: relative;
  width: 90vw;
  max-width: 800px;
  max-height: 80vh;
  background: #1e293b;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dialog-header {
  padding: 20px 24px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;

  h3 {
    margin: 0;
    color: #e2e8f0;
    font-size: 1.2rem;
  }
}

.close-btn {
  background: none;
  border: none;
  color: #64748b;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    color: #e2e8f0;
    background: rgba(255, 255, 255, 0.05);
  }
}

.dialog-search {
  padding: 0 24px 12px;
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
  }

  &::placeholder {
    color: #64748b;
  }
}

.dialog-categories {
  padding: 0 20px 12px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.cat-btn {
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: #94a3b8;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  &.active {
    background: rgba(99, 102, 241, 0.15);
    border-color: rgba(99, 102, 241, 0.3);
    color: #a5b4fc;
  }

  .cat-count {
    font-size: 0.65rem;
    padding: 1px 6px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.06);
    margin-left: 4px;
  }
}

.templates-grid {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 12px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
}

.template-card {
  padding: 14px;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
  }

  &.selected {
    background: rgba(99, 102, 241, 0.1);
    border-color: rgba(99, 102, 241, 0.4);
    box-shadow: 0 0 16px rgba(99, 102, 241, 0.1);
  }
}

.tpl-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.tpl-info {
  flex: 1;
  min-width: 0;
}

.tpl-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tpl-meta {
  font-size: 0.68rem;
  color: #64748b;
  display: flex;
  gap: 4px;
}

.tpl-arch {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 600;
  flex-shrink: 0;

  &.arch-A {
    background: rgba(6, 182, 212, 0.1);
    color: #22d3ee;
  }
  &.arch-B {
    background: rgba(168, 85, 247, 0.1);
    color: #c084fc;
  }
  &.arch-unknown {
    background: rgba(255, 255, 255, 0.05);
    color: #64748b;
  }
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 0.9rem;
}

.dialog-footer {
  padding: 12px 24px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}

.footer-btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &.cancel-btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #94a3b8;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  &.confirm-btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none;
    color: white;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
}
</style>
