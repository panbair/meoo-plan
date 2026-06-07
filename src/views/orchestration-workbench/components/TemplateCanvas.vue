<template>
  <div class="template-canvas">
    <!-- 头部 -->
    <div class="canvas-header">
      <div class="canvas-info">
        <h3 class="canvas-title">
          <span class="title-icon">🎯</span>
          模板编排画布
        </h3>
      </div>
      <button class="select-template-btn" @click="showSelector = true">
        {{ store.selectedTemplate ? '🔄 更换模板' : '📋 选择模板' }}
      </button>
    </div>

    <!-- 未选择模板 -->
    <div class="canvas-empty" v-if="!store.selectedTemplate">
      <div class="empty-illustration">
        <div class="empty-icon">🖼️</div>
        <h4>选择模板开始编排</h4>
        <p>从 148 个页面模板中选择一个作为您的网站结构骨架</p>
        <button class="btn-start" @click="showSelector = true">
          🚀 浏览模板库
        </button>
      </div>
    </div>

    <!-- 模板已选 -->
    <div class="canvas-workspace" v-else>
      <!-- 模板信息 -->
      <div class="template-info-bar">
        <div class="tpl-details">
          <span class="tpl-label">{{ store.selectedTemplate.label }}</span>
          <span class="tpl-meta">
            {{ store.selectedTemplate.categoryLabel }} ·
            {{ store.selectedTemplate.panelCount }} 面板 ·
            架构 {{ store.selectedTemplate.architecture }}
          </span>
        </div>
        <button class="btn-remove-tpl" @click="store.clearTemplate()" title="移除模板">
          ✕
        </button>
      </div>

      <!-- 面板列表 -->
      <div class="panels-list">
        <TemplatePanel
          v-for="panel in store.templatePanels"
          :key="panel.index"
          :panel="panel"
          @drop="onPanelDrop(panel.index, $event)"
          @remove="(compName: string) => store.removeFromPanel(compName, panel.index)"
        />
      </div>

      <!-- 未分配组件提示 -->
      <div class="unassigned-hint" v-if="unassignedComponents.length > 0">
        <span>⚠️ {{ unassignedComponents.length }} 个组件尚未分配到面板</span>
      </div>
    </div>

    <!-- 模板选择器 -->
    <TemplateSelector
      :visible="showSelector"
      @close="showSelector = false"
      @select="onTemplateSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useOrchestrationStore } from '../store/orchestrationStore'
import { useTemplateMapping } from '../composables/useTemplateMapping'
import TemplatePanel from './TemplatePanel.vue'
import TemplateSelector from './TemplateSelector.vue'
import type { TemplateItem } from '../types/orchestration'

const store = useOrchestrationStore()
const { unassignedComponents } = useTemplateMapping()

const showSelector = ref(false)

function onTemplateSelect(template: TemplateItem) {
  store.selectTemplate(template)
}

function onPanelDrop(panelIndex: number, _compName: string) {
  // 通过 store 进行分配
  const compName = _compName
  if (compName) {
    store.assignToPanel(compName, panelIndex)
  }
}
</script>

<style scoped lang="scss">
.template-canvas {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.canvas-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}

.canvas-title {
  font-size: 1.05rem;
  color: #e2e8f0;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  .title-icon {
    font-size: 1.2rem;
  }
}

.select-template-btn {
  padding: 8px 18px;
  border-radius: 8px;
  border: 1px solid rgba(99, 102, 241, 0.3);
  background: rgba(99, 102, 241, 0.1);
  color: #a5b4fc;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(99, 102, 241, 0.2);
    border-color: rgba(99, 102, 241, 0.5);
    transform: translateY(-1px);
  }
}

.canvas-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.empty-illustration {
  text-align: center;
  max-width: 360px;

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 16px;
    opacity: 0.6;
  }

  h4 {
    color: #e2e8f0;
    margin: 0 0 8px;
    font-size: 1.1rem;
  }

  p {
    color: #64748b;
    margin: 0 0 24px;
    font-size: 0.85rem;
    line-height: 1.6;
  }
}

.btn-start {
  padding: 12px 28px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
  }
}

.canvas-workspace {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.template-info-bar {
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(99, 102, 241, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  flex-shrink: 0;
}

.tpl-details {
  display: flex;
  flex-direction: column;
  gap: 2px;

  .tpl-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #e2e8f0;
  }

  .tpl-meta {
    font-size: 0.7rem;
    color: #64748b;
  }
}

.btn-remove-tpl {
  background: none;
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #f87171;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.4);
  }
}

.panels-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
}

.unassigned-hint {
  padding: 10px 20px;
  background: rgba(245, 158, 11, 0.08);
  border-top: 1px solid rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  font-size: 0.78rem;
  text-align: center;
  flex-shrink: 0;
}
</style>
