<template>
  <div class="plan-viewer">
    <!-- 头部 -->
    <div class="viewer-header">
      <h3 class="viewer-title">
        <span class="title-icon">📋</span>
        方案查看
      </h3>
    </div>

    <!-- 无方案 -->
    <div class="no-plan" v-if="store.generatedPlans.length === 0">
      <div class="no-plan-icon">📄</div>
      <p>尚未生成方案</p>
      <p class="no-plan-hint">选择组件和模板后，点击右侧"生成方案"按钮</p>
    </div>

    <!-- 方案列表 -->
    <div class="plan-content" v-else>
      <!-- 方案标签切换 -->
      <div class="plan-tabs">
        <button
          v-for="(plan, idx) in store.generatedPlans"
          :key="plan.id"
          class="plan-tab"
          :class="{ active: store.activePlanIndex === idx }"
          @click="store.setActivePlan(idx)"
        >
          <span class="tab-icon">{{ plan.icon }}</span>
          <span class="tab-text">{{ plan.name }}</span>
        </button>
      </div>

      <!-- 方案详情 -->
      <div class="plan-detail" v-if="store.activePlan">
        <!-- 元数据 -->
        <div class="plan-meta">
          <div class="meta-item">
            <span class="meta-label">组件数</span>
            <span class="meta-value">{{ store.activePlan.metadata.componentCount }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">面板数</span>
            <span class="meta-value">{{ store.activePlan.metadata.panelCount }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">预估工时</span>
            <span class="meta-value">{{ store.activePlan.metadata.estimatedHours }}h</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">复杂度</span>
            <span class="meta-value complexity-tag" :class="'comp-' + store.activePlan.metadata.complexityLevel">
              {{ complexityLabel(store.activePlan.metadata.complexityLevel) }}
            </span>
          </div>
        </div>

        <!-- 方案内容（Markdown 渲染） -->
        <div class="plan-body">
          <div class="markdown-content" v-html="renderedContent"></div>
        </div>
      </div>
    </div>

    <!-- 导出操作 -->
    <div class="export-bar" v-if="store.generatedPlans.length > 0">
      <button class="export-btn" @click="exportPlan('markdown')">
        📥 导出 MD
      </button>
      <button class="export-btn" @click="exportPlan('txt')">
        📄 导出 TXT
      </button>
      <button class="export-btn" @click="exportPlan('json')">
        🔧 导出 JSON
      </button>
      <button class="export-btn copy-btn" @click="copyPlan">
        📋 复制
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useOrchestrationStore } from '../store/orchestrationStore'
import { marked } from 'marked'

const store = useOrchestrationStore()

// ==================== Markdown 渲染 ====================
const renderedContent = computed(() => {
  if (!store.activePlan?.content) return ''
  try {
    return marked.parse(store.activePlan.content) as string
  } catch {
    return store.activePlan.content.replace(/\n/g, '<br>')
  }
})

// ==================== 辅助 ====================
function complexityLabel(level: string): string {
  const map: Record<string, string> = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return map[level] || level
}

// ==================== 导出 ====================
function exportPlan(format: 'markdown' | 'txt' | 'json') {
  const plan = store.activePlan
  if (!plan) return

  let content = ''
  let filename = ''
  let mimeType = ''

  switch (format) {
    case 'markdown':
      content = plan.content
      filename = `orchestration-plan-${plan.id}.md`
      mimeType = 'text/markdown'
      break
    case 'txt':
      content = plan.content
      filename = `orchestration-plan-${plan.id}.txt`
      mimeType = 'text/plain'
      break
    case 'json':
      content = JSON.stringify({
        plan,
        selectedComponents: store.selectedComponents.map(c => ({
          name: c.name,
          category: c.category,
          complexity: c.complexity
        })),
        selectedTemplate: store.selectedTemplate ? {
          key: store.selectedTemplate.key,
          label: store.selectedTemplate.label
        } : null,
        panelMappings: store.templatePanels.map(p => ({
          name: p.name,
          purpose: p.purpose,
          components: p.assignedComponents.map(c => c.name)
        }))
      }, null, 2)
      filename = `orchestration-plan-${plan.id}.json`
      mimeType = 'application/json'
      break
  }

  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

async function copyPlan() {
  const plan = store.activePlan
  if (!plan) return

  try {
    await navigator.clipboard.writeText(plan.content)
    alert('✅ 方案已复制到剪贴板')
  } catch {
    alert('❌ 复制失败，请尝试导出功能')
  }
}
</script>

<style scoped lang="scss">
.plan-viewer {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.viewer-header {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}

.viewer-title {
  font-size: 1rem;
  color: #e2e8f0;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  .title-icon {
    font-size: 1.2rem;
  }
}

// 无方案
.no-plan {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
  padding: 40px;

  .no-plan-icon {
    font-size: 3rem;
    margin-bottom: 12px;
    opacity: 0.5;
  }

  p {
    margin: 0 0 4px;
    font-size: 0.9rem;
  }

  .no-plan-hint {
    font-size: 0.75rem;
    color: #475569;
    text-align: center;
    line-height: 1.5;
  }
}

// 方案内容
.plan-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.plan-tabs {
  display: flex;
  padding: 10px 16px;
  gap: 6px;
  overflow-x: auto;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);

  &::-webkit-scrollbar {
    height: 0;
  }
}

.plan-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
  color: #94a3b8;
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  &.active {
    background: rgba(99, 102, 241, 0.12);
    border-color: rgba(99, 102, 241, 0.3);
    color: #a5b4fc;
  }

  .tab-icon {
    font-size: 1rem;
  }
}

.plan-meta {
  display: flex;
  gap: 16px;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  flex-shrink: 0;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.meta-label {
  font-size: 0.65rem;
  color: #64748b;
  text-transform: uppercase;
}

.meta-value {
  font-size: 0.82rem;
  font-weight: 600;
  color: #e2e8f0;
}

.complexity-tag {
  padding: 1px 8px;
  border-radius: 4px;
  font-size: 0.7rem;

  &.comp-high { background: rgba(239, 68, 68, 0.1); color: #f87171; }
  &.comp-medium { background: rgba(245, 158, 11, 0.1); color: #fbbf24; }
  &.comp-low { background: rgba(34, 197, 94, 0.1); color: #4ade80; }
}

.plan-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
}

.markdown-content {
  font-size: 0.82rem;
  color: #cbd5e1;
  line-height: 1.7;

  :deep(h1) { font-size: 1.4rem; color: #e2e8f0; margin: 0 0 16px; }
  :deep(h2) { font-size: 1.1rem; color: #e2e8f0; margin: 20px 0 10px; padding-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  :deep(h3) { font-size: 0.95rem; color: #e2e8f0; margin: 16px 0 8px; }
  :deep(h4) { font-size: 0.85rem; color: #cbd5e1; margin: 12px 0 6px; }
  :deep(p) { margin: 0 0 8px; }
  :deep(ul), :deep(ol) { padding-left: 20px; margin: 0 0 8px; }
  :deep(li) { padding: 2px 0; }
  :deep(strong) { color: #e2e8f0; }
  :deep(code) {
    padding: 1px 5px;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.3);
    font-size: 0.75rem;
  }
  :deep(pre) {
    padding: 12px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.3);
    overflow-x: auto;
    font-size: 0.75rem;
    margin: 8px 0;

    code {
      background: none;
      padding: 0;
    }
  }
  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0;
  }
  :deep(th), :deep(td) {
    padding: 6px 10px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    text-align: left;
    font-size: 0.78rem;
  }
  :deep(th) {
    background: rgba(255, 255, 255, 0.03);
    color: #e2e8f0;
    font-weight: 600;
  }
  :deep(blockquote) {
    border-left: 3px solid rgba(99, 102, 241, 0.4);
    padding: 8px 14px;
    margin: 8px 0;
    background: rgba(99, 102, 241, 0.04);
    border-radius: 0 8px 8px 0;
    color: #a5b4fc;
  }
  :deep(hr) {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    margin: 16px 0;
  }
}

// 导出栏
.export-bar {
  padding: 10px 16px;
  display: flex;
  gap: 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
  flex-wrap: wrap;
}

.export-btn {
  flex: 1;
  min-width: 60px;
  padding: 7px 10px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: #94a3b8;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #e2e8f0;
    border-color: rgba(255, 255, 255, 0.15);
  }

  &.copy-btn:hover {
    border-color: rgba(34, 197, 94, 0.3);
    color: #4ade80;
  }
}
</style>
