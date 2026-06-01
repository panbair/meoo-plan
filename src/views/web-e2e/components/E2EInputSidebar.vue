<template>
  <aside class="e2e-sidebar" :class="{ collapsed: sidebarCollapsed }">
    <button class="e2e-toggle" @click="emit('update:sidebarCollapsed', !sidebarCollapsed)">
      {{ sidebarCollapsed ? '▶' : '◀' }}
    </button>

    <div v-if="!sidebarCollapsed" class="e2e-sidebar-content">
      <div class="e2e-form-group">
        <label class="e2e-label">
          <span class="label-icon">💬</span> 描述你想要的网站
        </label>
        <textarea
          :value="description"
          class="e2e-textarea"
          placeholder="例如：做一个赛博朋克风格的独立游戏公司官网，Hero要大标题+粒子背景，展示3款游戏产品，要有团队介绍和联系表单..."
          rows="5"
          @input="emit('update:description', ($event.target as HTMLTextAreaElement).value)"
        ></textarea>
      </div>

      <details class="e2e-details" :open="!!companyName">
        <summary class="e2e-summary">🏢 公司信息（可选）</summary>
        <div class="e2e-details-body">
          <input
            :value="companyName"
            class="e2e-input"
            placeholder="公司名称"
            @input="emit('update:companyName', ($event.target as HTMLInputElement).value)"
          />
          <input
            :value="companyIndustry"
            class="e2e-input"
            placeholder="行业"
            @input="emit('update:companyIndustry', ($event.target as HTMLInputElement).value)"
          />
          <input
            :value="companyDesc"
            class="e2e-input"
            placeholder="业务描述（一句话）"
            @input="emit('update:companyDesc', ($event.target as HTMLInputElement).value)"
          />
        </div>
      </details>

      <details class="e2e-details">
        <summary class="e2e-summary">🎨 视觉风格（可选）</summary>
        <div class="e2e-details-body">
          <div class="e2e-style-chips">
            <button
              v-for="s in visualStyles"
              :key="s.key"
              class="e2e-chip"
              :class="{ active: visualStyle === s.key }"
              @click="emit('update:visualStyle', visualStyle === s.key ? '' : s.key)"
            >
              {{ s.emoji }} {{ s.label }}
            </button>
          </div>
          <input
            :value="colorPreference"
            class="e2e-input mt-3"
            placeholder="或自定义配色描述..."
            @input="emit('update:colorPreference', ($event.target as HTMLInputElement).value)"
          />
        </div>
      </details>

      <details class="e2e-details" :open="!!selectedTemplate">
        <summary class="e2e-summary">🎯 选择模板（可选，AI将按模板结构生成）</summary>
        <div class="e2e-details-body">
          <div class="e2e-template-grid">
            <button
              v-for="t in templates"
              :key="t.key"
              class="e2e-template-chip"
              :class="{ active: selectedTemplate === t.key }"
              @click="emit('select-template', t.key, t.label)"
            >
              {{ t.label }}
            </button>
          </div>
          <div v-if="templateRecommendation" class="e2e-template-info">
            <div class="info-row">
              <span class="info-tag">{{ templateRecommendation.scrollPattern }}</span>
              <span class="info-tag">{{ templateRecommendation.visualStyle }}</span>
            </div>
            <p class="info-text">{{ templateRecommendation.analysis }}</p>
          </div>
        </div>
      </details>

      <div class="e2e-quick-examples">
        <span class="e2e-example-label">快捷示例：</span>
        <button
          v-for="ex in quickExamples"
          :key="ex.label"
          class="e2e-example-btn"
          @click="emit('update:description', ex.desc)"
        >
          {{ ex.label }}
        </button>
      </div>

      <button
        class="e2e-generate-btn"
        :class="{ loading: isGenerating }"
        :disabled="!description.trim() || isGenerating"
        @click="emit('generate')"
      >
        <span v-if="isGenerating" class="btn-spinner"></span>
        <span>{{ isGenerating ? 'AI 正在生成...' : '🚀 生成网站' }}</span>
      </button>

      <div v-if="selectedComponents.length > 0 && !isGenerating" class="e2e-ai-selection">
        <h4>🤖 AI 自动选用了 {{ selectedComponents.length }} 个组件</h4>
        <p class="ai-reasoning">{{ aiReasoning }}</p>
        <div class="ai-comp-chips">
          <span v-for="c in selectedComponents" :key="c" class="ai-comp-chip" :title="c">{{ c }}</span>
        </div>
        <div
          v-if="qualityReport"
          class="quality-report"
          :class="{ passed: qualityReport.passed, failed: !qualityReport.passed }"
        >
          <div class="quality-score">
            <span class="score-label">代码质量</span>
            <span class="score-value">{{ qualityReport.score }}/100</span>
          </div>
          <div v-if="qualityReport.issues.length" class="quality-issues">
            <div v-for="issue in qualityReport.issues" :key="issue" class="quality-issue">❌ {{ issue }}</div>
          </div>
          <div v-if="qualityReport.warnings.length" class="quality-warnings">
            <div v-for="warning in qualityReport.warnings" :key="warning" class="quality-warn">⚡ {{ warning }}</div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
interface TemplateOption {
  key: string
  label: string
}

interface VisualStyleOption {
  key: string
  label: string
  emoji: string
}

interface QuickExample {
  label: string
  desc: string
}

interface TemplateRecommendation {
  scrollPattern: string
  visualStyle: string
  analysis: string
}

interface QualityReport {
  score: number
  passed: boolean
  issues: string[]
  warnings: string[]
}

defineProps<{
  sidebarCollapsed: boolean
  description: string
  companyName: string
  companyIndustry: string
  companyDesc: string
  visualStyle: string
  colorPreference: string
  selectedTemplate: string
  templates: TemplateOption[]
  visualStyles: VisualStyleOption[]
  quickExamples: QuickExample[]
  templateRecommendation: TemplateRecommendation | null
  selectedComponents: string[]
  aiReasoning: string
  qualityReport: QualityReport | null
  isGenerating: boolean
}>()

const emit = defineEmits<{
  (e: 'update:sidebarCollapsed', value: boolean): void
  (e: 'update:description', value: string): void
  (e: 'update:companyName', value: string): void
  (e: 'update:companyIndustry', value: string): void
  (e: 'update:companyDesc', value: string): void
  (e: 'update:visualStyle', value: string): void
  (e: 'update:colorPreference', value: string): void
  (e: 'select-template', key: string, label: string): void
  (e: 'generate'): void
}>()
</script>

