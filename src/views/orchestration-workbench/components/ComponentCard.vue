<template>
  <div
    class="component-card"
    :class="{
      selected: isSelected,
      dragging: isDragging,
      [complexityClass]: true
    }"
    :draggable="true"
    @click="$emit('toggle')"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <!-- 选中标记 -->
    <div class="select-indicator" v-if="isSelected">
      <span class="check-icon">✓</span>
    </div>

    <!-- 复杂度标签 -->
    <div class="complexity-badge" :class="complexityClass">
      {{ complexityLabel }}
    </div>

    <!-- 组件信息 -->
    <div class="card-body">
      <div class="component-icon">{{ categoryIcon }}</div>
      <h4 class="component-name">{{ component.name }}</h4>
      <p class="component-category">{{ component.categoryLabel }}</p>
    </div>

    <!-- 底部标签 -->
    <div class="card-footer">
      <span v-if="component.has3D" class="tag tag-3d">3D</span>
      <span v-if="component.hasCanvas" class="tag tag-canvas">Canvas</span>
      <span class="tag tag-scroll">Scroll</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ComponentItem } from '../types/orchestration'
import { CATEGORY_ICONS } from '../composables/useOrchestration'
import type { ComponentCategory } from '@/api/ai/component-knowledge-builder'

interface Props {
  component: ComponentItem
  isSelected: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  toggle: []
}>()

const isDragging = ref(false)

const categoryIcon = computed(() =>
  CATEGORY_ICONS[props.component.category as ComponentCategory] || '📦'
)

const complexityClass = computed(() => `complexity-${props.component.complexity}`)

const complexityLabel = computed(() => {
  const map = { low: '初级', medium: '中级', high: '高级' }
  return map[props.component.complexity] || '中级'
})

function onDragStart(event: DragEvent) {
  isDragging.value = true
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData('application/component-name', props.component.name)
  }
}

function onDragEnd() {
  isDragging.value = false
}
</script>

<style scoped lang="scss">
.component-card {
  position: relative;
  background: rgba(255, 255, 255, 0.06);
  border: 2px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }

  &.selected {
    border-color: #22c55e;
    background: rgba(34, 197, 94, 0.1);
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.15);

    .select-indicator {
      opacity: 1;
      transform: scale(1);
    }
  }

  &.dragging {
    opacity: 0.5;
    transform: scale(0.95);
  }

  // Complexity border colors
  &.complexity-low { border-left: 3px solid #22c55e; }
  &.complexity-medium { border-left: 3px solid #f59e0b; }
  &.complexity-high { border-left: 3px solid #ef4444; }
}

.select-indicator {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 2;

  .check-icon {
    color: white;
    font-size: 14px;
    font-weight: bold;
  }
}

.complexity-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;

  &.complexity-low {
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
  }
  &.complexity-medium {
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
  }
  &.complexity-high {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
  }
}

.card-body {
  text-align: center;
  padding: 8px 0 12px;
}

.component-icon {
  font-size: 2rem;
  margin-bottom: 8px;
  line-height: 1;
}

.component-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 4px;
  word-break: break-word;
  line-height: 1.3;
}

.component-category {
  font-size: 0.7rem;
  color: #94a3b8;
  margin: 0;
}

.card-footer {
  display: flex;
  gap: 4px;
  justify-content: center;
  flex-wrap: wrap;
}

.tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 600;

  &.tag-3d {
    background: rgba(168, 85, 247, 0.15);
    color: #a855f7;
  }
  &.tag-canvas {
    background: rgba(6, 182, 212, 0.15);
    color: #06b6d4;
  }
  &.tag-scroll {
    background: rgba(99, 102, 241, 0.15);
    color: #818cf8;
  }
}
</style>
