<template>
  <div
    class="template-panel"
    :class="{
      'drag-over': isDragOver,
      'has-components': panel.assignedComponents.length > 0
    }"
    @dragover="onDragOver"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <!-- 面板头部 -->
    <div class="panel-header">
      <span class="panel-index">{{ panel.index + 1 }}</span>
      <div class="panel-title-group">
        <span class="panel-name">{{ panel.name }}</span>
        <span class="panel-purpose">{{ panel.purpose }}</span>
      </div>
      <span class="panel-comp-count" v-if="panel.assignedComponents.length > 0">
        {{ panel.assignedComponents.length }} 个组件
      </span>
    </div>

    <!-- 分配组件列表 -->
    <div class="panel-components" v-if="panel.assignedComponents.length > 0">
      <div
        v-for="comp in panel.assignedComponents"
        :key="comp.name"
        class="assigned-comp"
        :class="getComplexityClass(comp.complexity)"
      >
        <span class="comp-icon">{{ getCategoryIcon(comp.category) }}</span>
        <span class="comp-name">{{ comp.name }}</span>
        <button class="comp-remove" @click="$emit('remove', comp.name)" title="从此面板移除">
          ×
        </button>
      </div>
    </div>

    <!-- 空状态 -->
    <div class="panel-empty" v-else>
      <div class="drop-hint">
        <span class="hint-icon">📥</span>
        <span>拖拽组件到此处</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TemplatePanel } from '../types/orchestration'
import { CATEGORY_ICONS } from '../composables/useOrchestration'
import type { ComponentCategory } from '@/api/ai/component-knowledge-builder'

interface Props {
  panel: TemplatePanel
}

defineProps<Props>()
const emit = defineEmits<{
  drop: [componentName: string, panelIndex: number]
  remove: [componentName: string]
}>()

const isDragOver = ref(false)

function onDragOver(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy'
  }
}

function onDragEnter(event: DragEvent) {
  event.preventDefault()
  isDragOver.value = true
}

function onDragLeave() {
  isDragOver.value = false
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  isDragOver.value = false
  const compName = event.dataTransfer?.getData('application/component-name')
  if (compName) {
    // 通过父组件通信
    emit('drop', compName, -1) // panelIndex 由父组件提供
  }
}

function getComplexityClass(complexity: string): string {
  return `comp-${complexity}`
}

function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category as ComponentCategory] || '📦'
}
</script>

<style scoped lang="scss">
.template-panel {
  background: rgba(255, 255, 255, 0.03);
  border: 2px dashed rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 14px;
  transition: all 0.3s;
  min-height: 80px;

  &.drag-over {
    border-color: rgba(99, 102, 241, 0.5);
    background: rgba(99, 102, 241, 0.08);
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.1);
    transform: scale(1.02);
  }

  &.has-components {
    border-style: solid;
    border-color: rgba(255, 255, 255, 0.1);
  }
}

.panel-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 10px;
}

.panel-index {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  flex-shrink: 0;
}

.panel-title-group {
  flex: 1;
  min-width: 0;
}

.panel-name {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 2px;
}

.panel-purpose {
  display: block;
  font-size: 0.7rem;
  color: #64748b;
}

.panel-comp-count {
  font-size: 0.68rem;
  color: #818cf8;
  background: rgba(99, 102, 241, 0.1);
  padding: 2px 8px;
  border-radius: 6px;
  flex-shrink: 0;
}

.panel-components {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.assigned-comp {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  transition: all 0.15s;

  &.comp-low {
    background: rgba(34, 197, 94, 0.06);
    border: 1px solid rgba(34, 197, 94, 0.1);
  }
  &.comp-medium {
    background: rgba(245, 158, 11, 0.06);
    border: 1px solid rgba(245, 158, 11, 0.1);
  }
  &.comp-high {
    background: rgba(239, 68, 68, 0.06);
    border: 1px solid rgba(239, 68, 68, 0.1);
  }
}

.comp-icon {
  font-size: 0.9rem;
  flex-shrink: 0;
}

.comp-name {
  flex: 1;
  color: #cbd5e1;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.comp-remove {
  background: none;
  border: none;
  color: #64748b;
  font-size: 1rem;
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;
  transition: color 0.15s;

  &:hover {
    color: #ef4444;
  }
}

.panel-empty {
  padding: 16px;
  text-align: center;
}

.drop-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #475569;
  font-size: 0.75rem;

  .hint-icon {
    font-size: 1.3rem;
    opacity: 0.5;
  }
}
</style>
