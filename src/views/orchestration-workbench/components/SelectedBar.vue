<template>
  <div class="selected-bar" v-if="store.selectedComponents.length > 0">
    <div class="bar-info">
      <span class="bar-label">
        📋 已选 <strong>{{ store.selectedComponents.length }}</strong> 个组件
      </span>
    </div>

    <div class="bar-chips">
      <div
        v-for="comp in store.selectedComponents"
        :key="comp.name"
        class="chip"
        :class="getComplexityClass(comp.complexity)"
        :title="`${comp.name} — ${comp.categoryLabel}`"
        :draggable="true"
        @dragstart="onChipDragStart(comp, $event)"
      >
        <span class="chip-text">{{ truncate(comp.name, 18) }}</span>
        <button class="chip-remove" @click="store.removeComponent(comp.name)" title="移除">
          ×
        </button>
      </div>
    </div>

    <div class="bar-actions">
      <button class="action-btn clear-btn" @click="store.clearComponents()" title="清空所有选择">
        🗑️ 清空
      </button>
      <button class="action-btn auto-btn" @click="store.autoAssignPanels()"
        :disabled="!store.hasTemplate"
        title="智能分配到模板面板">
        🪄 智能分配
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrchestrationStore } from '../store/orchestrationStore'
import type { ComponentItem } from '../types/orchestration'

const store = useOrchestrationStore()

function truncate(str: string, max: number): string {
  return str.length > max ? str.substring(0, max) + '...' : str
}

function getComplexityClass(complexity: string): string {
  return `chip-${complexity}`
}

function onChipDragStart(comp: ComponentItem, event: DragEvent) {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData('application/component-name', comp.name)
  }
}
</script>

<style scoped lang="scss">
.selected-bar {
  background: rgba(15, 23, 42, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.bar-info {
  flex-shrink: 0;
}

.bar-label {
  font-size: 0.78rem;
  color: #94a3b8;

  strong {
    color: #818cf8;
  }
}

.bar-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
  max-height: 60px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 2px;
  }
}

.chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  cursor: grab;
  transition: all 0.15s;

  &:active {
    cursor: grabbing;
  }

  &.chip-low {
    background: rgba(34, 197, 94, 0.12);
    border: 1px solid rgba(34, 197, 94, 0.2);
    color: #4ade80;
  }
  &.chip-medium {
    background: rgba(245, 158, 11, 0.12);
    border: 1px solid rgba(245, 158, 11, 0.2);
    color: #fbbf24;
  }
  &.chip-high {
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: #f87171;
  }
}

.chip-text {
  white-space: nowrap;
  font-weight: 500;
}

.chip-remove {
  background: none;
  border: none;
  color: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;
  opacity: 0.6;
  transition: opacity 0.15s;

  &:hover {
    opacity: 1;
  }
}

.bar-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.action-btn {
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: #94a3b8;
  font-size: 0.7rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.08);
    color: #e2e8f0;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &.clear-btn:hover:not(:disabled) {
    border-color: rgba(239, 68, 68, 0.3);
    color: #f87171;
  }

  &.auto-btn:not(:disabled) {
    border-color: rgba(34, 197, 94, 0.2);
    color: #4ade80;
  }
}
</style>
