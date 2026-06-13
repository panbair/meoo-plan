<template>
  <!-- 触发按钮 -->
  <button
    class="ai-trigger-btn"
    :class="{ active: visible, pulsing: !visible && hasSelections }"
    @click="handleTriggerClick"
    title="AI 生成详细制作方案"
  >
    <span class="trigger-icon">🤖</span>
    <span class="trigger-text">AI 方案</span>
    <span v-if="hasSelections && !visible" class="trigger-badge">可用</span>
  </button>

  <!-- API Key 配置对话框 -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showApiDialog" class="api-dialog-overlay" @click.self="showApiDialog = false">
        <div class="api-dialog">
          <!-- 已配置状态 -->
          <template v-if="aiConfigured">
            <div class="api-dialog-icon">✅</div>
            <h3>DeepSeek API 已配置</h3>
            <p style="color:#4ade80;font-size:0.85rem;">AI 方案生成功能已就绪</p>
            <div class="api-dialog-actions">
              <button class="api-dialog-btn skip" @click="showApiDialog = false">取消</button>
              <button class="api-dialog-btn change" @click="switchToInputMode">🔄 更换 Key</button>
              <button class="api-dialog-btn save" @click="openPanel">🚀 打开 AI 面板</button>
            </div>
          </template>
          <!-- 未配置状态 -->
          <template v-else>
            <div class="api-dialog-icon">🔑</div>
            <h3>配置 DeepSeek API Key</h3>
            <p>使用 AI 生成详细方案需要 API Key</p>
            <a href="https://platform.deepseek.com/" target="_blank" class="api-dialog-link">
              免费获取 DeepSeek API Key →
            </a>
            <div class="api-dialog-input-row">
              <input
                ref="apiKeyInputRef"
                v-model="apiKeyInput"
                type="password"
                class="api-dialog-input"
                placeholder="sk-..."
                @keydown.enter="saveApiKeyAndOpen"
              />
            </div>
            <p class="api-dialog-note">🔒 Key 仅存储在浏览器本地</p>
            <div class="api-dialog-actions">
              <button class="api-dialog-btn skip" @click="openPanel">跳过，本地模式</button>
              <button class="api-dialog-btn save" @click="saveApiKeyAndOpen" :disabled="!apiKeyInput.trim() || apiSaving">
                {{ apiSaving ? '验证中...' : '保存并打开' }}
              </button>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- 侧边栏 -->
  <Teleport to="body">
    <Transition name="slide">
      <div v-if="visible" class="ai-panel-overlay" @click.self="visible = false">
        <div class="ai-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span class="title-icon">🤖</span>
              <span>AI 智能方案生成</span>
              <span class="powered-by">DeepSeek</span>
            </div>
            <button class="panel-close" @click="visible = false">✕</button>
          </div>

          <div class="panel-body">
            <!-- 当前选择摘要 -->
            <div class="section">
              <h4 class="section-title">📋 当前选择</h4>
              <div class="summary-grid">
                <div class="summary-item">
                  <span class="s-label">组件</span>
                  <span class="s-value">{{ componentCount }} 个</span>
                </div>
                <div class="summary-item">
                  <span class="s-label">模板</span>
                  <span class="s-value">{{ templateCount }} 个</span>
                </div>
                <div class="summary-item">
                  <span class="s-label">企业信息</span>
                  <span class="s-value" :class="{ ok: hasEnterprise }">
                    {{ hasEnterprise ? '✓ 已填写' : '⚠ 未填写' }}
                  </span>
                </div>
              </div>
              <div v-if="!hasSelections" class="empty-hint">
                请先选择组件和模板，再使用 AI 生成方案
              </div>
            </div>

            <!-- 生成操作 -->
            <div class="section">
              <h4 class="section-title">🚀 生成方案</h4>

              <div class="gen-options">
                <label class="option-row">
                  <span class="option-label">详细程度</span>
                  <select v-model="planDetail" class="option-select">
                    <option value="brief">简要（要点概览）</option>
                    <option value="standard">标准（含配置建议）</option>
                    <option value="detailed">详细（含代码示例）</option>
                  </select>
                </label>
              </div>

              <button
                class="gen-btn"
                :disabled="!canGenerate || isGenerating"
                @click="handleGenerate"
              >
                <span v-if="isGenerating" class="gen-spinner"></span>
                <span v-else>🚀</span>
                {{ isGenerating ? generationStatus : '生成制作方案' }}
              </button>

              <div v-if="genError" class="gen-error">{{ genError }}</div>
            </div>

            <!-- AI 对话 -->
            <div class="section">
              <h4 class="section-title">💬 快速咨询</h4>
              <div class="chat-mini" ref="chatRef">
                <div v-if="chatMessages.length === 0" class="chat-empty">
                  对我的选择有什么疑问？直接问 AI...
                </div>
                <div
                  v-for="(msg, i) in chatMessages"
                  :key="i"
                  class="chat-msg"
                  :class="'msg-' + msg.role"
                >
                  <span class="msg-avatar">{{ msg.role === 'user' ? '👤' : '🤖' }}</span>
                  <span class="msg-text">{{ msg.content }}</span>
                </div>
                <div v-if="chatLoading" class="chat-msg msg-assistant">
                  <span class="msg-avatar">🤖</span>
                  <span class="msg-text typing">思考中...</span>
                </div>
              </div>
              <div class="chat-input-row">
                <input
                  v-model="chatInput"
                  class="chat-input"
                  placeholder="问 AI..."
                  @keydown.enter="sendChat"
                  :disabled="chatLoading"
                />
                <button class="chat-send" @click="sendChat" :disabled="!chatInput.trim() || chatLoading">➤</button>
              </div>
            </div>
          </div>

          <!-- 方案结果区 -->
          <div v-if="planContent" class="panel-result">
            <div class="result-header">
              <span>📄 生成的方案</span>
              <div class="result-actions">
                <button class="r-action-btn export-btn" @click="exportMeooProject">🚀 导出 Vue 项目</button>
                <button class="r-action-btn" @click="copyPlan">📋 复制</button>
                <button class="r-action-btn" @click="downloadPlan">📥 下载</button>
                <button class="r-action-btn" @click="planContent = ''">🗑️ 清除</button>
              </div>
            </div>
            <div class="result-body">
              <!-- meoo CLI 使用提示 -->
              <div v-if="showCliTip" class="cli-tip-box">
                <div class="cli-tip-header">
                  <span>📦 {{ projectFileName }}</span>
                  <button class="r-action-btn" @click="showCliTip = false">✕</button>
                </div>
                <p class="cli-tip-desc">项目已下载，解压后执行以下命令：</p>
                <pre class="cli-code">cd {{ projectFileName.replace(/-meoo-project\.zip$/, '').replace(/-project-files\.json$/, '') || 'meoo-project' }}
pnpm install
pnpm dev                     # 本地预览 (http://localhost:3015)
meoo projects create "我的企业网站"
meoo sandbox push            # 推送代码到 Meoo 沙箱
# 在 https://meoo.com 中打开项目继续 AI 编辑</pre>
                <button class="r-action-btn copy-cli-btn" @click="copyCliCommands">📋 复制指令</button>
              </div>
              <div class="markdown-content" v-html="renderedPlan"></div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { aiService } from '@/api/ai'
import { aiConfig } from '@/api/ai/ai.config'
import { marked } from 'marked'
import { buildCopyContent, type ComponentSelectInfo, type EnterpriseInfo, type ModulePosition } from '@/views/web-list/utils/buildCopyContent.ts'

interface Props {
  componentCount: number
  templateCount: number
  hasEnterprise: boolean
  selectedComponents: Array<{ name: string; dirName: string; category?: string; path?: string }>
  selectedTemplateKeys: string[]
  templateLabels: Record<string, string>
  enterpriseInfo: { name?: string; industry?: string; description?: string }
  modulePositions: Array<{ key: string; label: string; icon: string }>
  getComponentsByPosition: (pos: string) => any[]
  // 本地增强模式所需
  selectedComponentsRaw?: ComponentSelectInfo[]
  vueModules?: Record<string, string>
  readmeModules?: Record<string, string>
  templateRawModules?: Record<string, string>
}

const props = defineProps<Props>()

// ==================== 状态 ====================
const visible = ref(false)
const isGenerating = ref(false)
const generationStatus = ref('')
const genError = ref('')
const planDetail = ref<'brief' | 'standard' | 'detailed'>('standard')
const planContent = ref('')

// API Key 对话框
const showApiDialog = ref(false)
const apiKeyInput = ref('')
const apiSaving = ref(false)
const apiKeyInputRef = ref<HTMLInputElement | null>(null)
const aiConfigured = ref(false)

// 聊天
const chatInput = ref('')
const chatLoading = ref(false)
const chatMessages = ref<Array<{ role: 'user' | 'assistant'; content: string }>>([])
const chatRef = ref<HTMLElement | null>(null)

// ==================== 计算 ====================
const hasSelections = computed(() => props.componentCount > 0 && props.templateCount > 0)
const canGenerate = computed(() => hasSelections.value && !isGenerating.value)

const renderedPlan = computed(() => {
  if (!planContent.value) return ''
  try { return marked.parse(planContent.value) as string }
  catch { return planContent.value.replace(/\n/g, '<br>') }
})

// ==================== API Key 管理 ====================
function checkAIConfig(): boolean {
  const saved = localStorage.getItem('ai-api-config')
  if (saved) {
    try {
      const config = JSON.parse(saved)
      if (config.apiKey) {
        aiService.configure({ provider: config.provider || 'deepseek', apiKey: config.apiKey, baseUrl: config.baseUrl || '' })
        aiConfigured.value = true
        return true
      }
    } catch { /* ignore */ }
  }
  if (aiConfig.apiKey) {
    aiService.configure(aiConfig)
    aiConfigured.value = true
    return true
  }
  aiConfigured.value = false
  return false
}

function isAIAvailable(): boolean {
  return aiConfigured.value
}

// ==================== 触发流程 ====================
function handleTriggerClick() {
  apiKeyInput.value = ''
  checkAIConfig()
  // 始终弹出对话框，让用户看到 API 配置状态
  showApiDialog.value = true
  if (!aiConfigured.value) {
    nextTick(() => apiKeyInputRef.value?.focus())
  }
}

function openPanel() {
  showApiDialog.value = false
  visible.value = true
}

function switchToInputMode() {
  // 清除旧配置，切回输入状态
  localStorage.removeItem('ai-api-config')
  aiConfigured.value = false
  apiKeyInput.value = ''
  nextTick(() => apiKeyInputRef.value?.focus())
}

async function saveApiKeyAndOpen() {
  const key = apiKeyInput.value.trim()
  if (!key) return

  apiSaving.value = true
  try {
    aiService.configure({ provider: 'deepseek', apiKey: key, baseUrl: 'https://api.deepseek.com/v1' })
    localStorage.setItem('ai-api-config', JSON.stringify({ provider: 'deepseek', apiKey: key }))
    aiConfigured.value = true
    openPanel()
  } catch (e: any) {
    genError.value = '配置失败: ' + (e.message || '未知错误')
  } finally {
    apiSaving.value = false
  }
}

// ==================== 方案生成 ====================
async function handleGenerate() {
  if (!canGenerate.value) return
  isGenerating.value = true
  genError.value = ''
  planContent.value = ''

  try {
    if (!isAIAvailable()) {
      generationStatus.value = '使用本地模式...'
      planContent.value = buildLocalPlan()
      return
    }

    generationStatus.value = '正在连接 DeepSeek...'

    const comps = props.selectedComponents.map(c => ({
      name: c.name, category: c.category || '', complexity: 'medium' as const, summary: ''
    }))

    const panelMappings = props.modulePositions.map(pos => ({
      name: pos.label, purpose: `网站${pos.label}模块`,
      components: props.getComponentsByPosition(pos.key).map((c: any) => c.name)
    }))

    const tplInfo = props.selectedTemplateKeys.length > 0
      ? { key: props.selectedTemplateKeys[0], label: props.templateLabels[props.selectedTemplateKeys[0]] || props.selectedTemplateKeys[0], panelCount: props.modulePositions.length, architecture: 'unknown' as const }
      : null

    generationStatus.value = 'AI 分析中...'
    planContent.value = await aiService.generateOrchestrationPlan({
      selectedComponents: comps, selectedTemplate: tplInfo, panelMappings,
      userNotes: props.hasEnterprise
        ? `企业: ${props.enterpriseInfo.name || ''}, 行业: ${props.enterpriseInfo.industry || ''}, 业务: ${props.enterpriseInfo.description || ''}`
        : undefined
    })
    generationStatus.value = '完成！'
  } catch (e: any) {
    genError.value = e.message || '生成失败'
    planContent.value = buildLocalPlan()
  } finally {
    isGenerating.value = false
  }
}

function buildLocalPlan(): string {
  // 如果有完整组件数据，使用增强的 buildCopyContent
  if (props.selectedComponentsRaw && props.selectedComponentsRaw.length > 0) {
    try {
      const config = {
        selectedComponents: props.selectedComponentsRaw,
        enterpriseInfo: {
          name: props.enterpriseInfo.name || '',
          industry: props.enterpriseInfo.industry || '',
          description: props.enterpriseInfo.description || '',
          targetAudience: '',
          mainColors: '',
          websiteType: '',
          designPhilosophy: '',
        } as EnterpriseInfo,
        modulePositions: props.modulePositions.map(p => ({
          key: p.key,
          label: p.label,
          icon: p.icon,
          desc: '',
        })) as ModulePosition[],
        vueModules: props.vueModules || {},
        readmeModules: props.readmeModules || {},
        propsMap: new Map(),
        cardComponents: [],
      }
      return buildCopyContent(config)
    } catch (e) {
      console.warn('buildCopyContent 失败，使用简化方案:', e)
    }
  }

  // 降级：简化方案
  const panels = props.modulePositions
  const panelList = panels.map(p => {
    const cs = props.getComponentsByPosition(p.key)
    return `- **${p.icon} ${p.label}**: ${cs.length > 0 ? cs.map((c: any) => c.name).join(', ') : '(待分配)'}`
  }).join('\n')

  return `# 🌐 企业网站制作方案 (Vue 3)

## 📋 项目概览
- **技术栈**: Vue 3 + TypeScript + Tailwind CSS + GSAP
- **选择组件**: ${props.componentCount} 个
- **选择模板**: ${props.selectedTemplateKeys.map(k => props.templateLabels[k] || k).join(', ') || '未选择'}
- **企业**: ${props.enterpriseInfo.name || '未填写'}
${props.enterpriseInfo.industry ? `- **行业**: ${props.enterpriseInfo.industry}` : ''}

## 🏗️ 页面结构
${panelList}

## 📦 组件清单
${props.selectedComponents.map(c => `- **${c.name}**`).join('\n')}

## 🎨 设计建议
- 配色使用品牌主色 + 深色背景
- 组件间动画通过 GSAP Timeline 协调
- Hero 区使用最高视觉冲击力的组件

## ⚡ 性能提示
- 使用 Vue 3 defineAsyncComponent 懒加载
- Canvas 粒子组件限制移动端 <= 30 个
- 首屏 LCP < 2.5s

---
> 📝 本地模式生成 | ${new Date().toLocaleString('zh-CN')}
> 💡 配置 DeepSeek API Key 可获得更详细的 AI 定制方案`
}

// ==================== 聊天 ====================
async function sendChat() {
  const text = chatInput.value.trim()
  if (!text || chatLoading.value) return
  chatInput.value = ''
  chatMessages.value.push({ role: 'user', content: text })
  chatLoading.value = true

  try {
    if (!isAIAvailable()) {
      chatMessages.value.push({ role: 'assistant', content: '⚠️ 未配置 API Key，请在面板中配置后重试。' })
      chatLoading.value = false; scrollChat(); return
    }

    const response = await aiService.chat({
      messages: [
        { role: 'system', content: `你是组件选择顾问。当前选择: 组件=[${props.selectedComponents.map(c => c.name).join(', ')}], 模板=[${props.selectedTemplateKeys.map(k => props.templateLabels[k] || k).join(', ')}]。简洁专业回答，不超过200字。` },
        { role: 'user', content: text }
      ],
      temperature: 0.7, maxTokens: 500, timeout: 30000
    })

    chatMessages.value.push({ role: 'assistant', content: response.success && response.data?.content ? response.data.content : '请求失败，请重试。' })
  } catch (e: any) {
    chatMessages.value.push({ role: 'assistant', content: `请求失败: ${e.message}` })
  } finally {
    chatLoading.value = false; scrollChat()
  }
}

function scrollChat() { nextTick(() => { if (chatRef.value) chatRef.value.scrollTop = chatRef.value.scrollHeight }) }

// ==================== 导出 ====================
const showCliTip = ref(false)
const projectFileName = ref('')

async function copyPlan() {
  try { await navigator.clipboard.writeText(planContent.value); alert('✅ 已复制') }
  catch { alert('❌ 复制失败') }
}
function downloadPlan() {
  const blob = new Blob([planContent.value], { type: 'text/markdown;charset=utf-8' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
  a.download = `website-plan-${Date.now()}.md`; document.body.appendChild(a); a.click()
  document.body.removeChild(a); URL.revokeObjectURL(a.href)
}

// ==================== meoo CLI 项目导出 ====================
function generatePackageJson(projectName: string): string {
  return JSON.stringify({
    name: projectName,
    private: true,
    version: '1.0.0',
    type: 'module',
    scripts: {
      dev: 'vite --port 3015 --strictPort --host 0.0.0.0',
      build: 'vue-tsc && vite build',
      preview: 'vite preview'
    },
    dependencies: {
      'vue': '^3.4.0',
      'vue-router': '^4.3.0',
      'gsap': '^3.12.0',
      'pinia': '^2.1.0'
    },
    devDependencies: {
      '@vitejs/plugin-vue': '^5.0.0',
      'typescript': '^5.3.0',
      'vite': '^5.4.0',
      'vue-tsc': '^2.0.0',
      'tailwindcss': '^3.4.0',
      'postcss': '^8.4.0',
      'autoprefixer': '^10.4.0'
    }
  }, null, 2)
}

function generateViteConfig(): string {
  return `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') }
  },
  base: './',
  server: {
    port: 3015,
    strictPort: true,
    host: '0.0.0.0'
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    assetsInlineLimit: 1048576
  }
})`
}

function generateMainTs(): string {
  return `import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// GSAP 全局注册
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')`
}

function generateRouterTs(): string {
  return `import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView }
  ]
})

export default router`
}

function generateAppVue(): string {
  return `<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import HomeView from '@/views/HomeView.vue'
</scr' + 'ipt>

<template>
  <Navbar />
  <main>
    <HomeView />
  </main>
  <Footer />
</template>`
}

function generateReadme(projectName: string): string {
  return `# ${projectName}

基于 Meoo 平台构建的 Vue 3 企业网站，使用 GSAP 动画组件库。

## 本地开发

\`\`\`bash
pnpm install
pnpm dev          # 启动开发服务器 (http://localhost:3015)
\`\`\`

## 部署到 Meoo 平台

\`\`\`bash
# 1. 在 meoo.com 创建项目
meoo projects create "${projectName}"

# 2. 推送代码到沙箱
meoo sandbox push

# 3. 在 https://meoo.com 中打开项目，AI 继续编辑

# 4. 发布到 CDN
meoo deploy
\`\`\`

## 技术栈

- Vue 3 + TypeScript + Composition API
- Vite 5
- Tailwind CSS
- GSAP (ScrollTrigger)
- Vue Router (Hash 模式)
- Pinia

## 项目结构

\`\`\`
src/
  components/     # 导航栏、页脚等通用组件
  sections/       # 各页面模块组件
  views/          # 页面视图
  router/         # 路由配置
  App.vue         # 根组件
  main.ts         # 入口文件
  style.css       # 全局样式
\`\`\`
`
}

async function exportMeooProject() {
  if (!planContent.value) {
    alert('⚠️ 请先生成方案')
    return
  }

  const companyName = props.enterpriseInfo.name || '企业网站'
  const projectName = companyName.replace(/[^a-zA-Z一-龥\s-]/g, '').trim() || 'meoo-project'
  const safeName = projectName.replace(/\s+/g, '-').toLowerCase() || 'meoo-project'

  const files: Record<string, string> = {
    'package.json': generatePackageJson(safeName),
    'vite.config.ts': generateViteConfig(),
    'tsconfig.json': JSON.stringify({
      compilerOptions: {
        target: 'ES2020', module: 'ESNext', moduleResolution: 'bundler',
        strict: true, jsx: 'preserve', resolveJsonModule: true, isolatedModules: true,
        esModuleInterop: true, lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        skipLibCheck: true, noEmit: true, paths: { '@/*': ['./src/*'] },
        baseUrl: '.', types: ['vite/client']
      },
      include: ['src/**/*.ts', 'src/**/*.d.ts', 'src/**/*.vue']
    }, null, 2),
    'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: []
}`,
    'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}`,
    'index.html': `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${companyName}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></scr' + 'ipt>
  </body>
</html>`,
    'README.md': generateReadme(companyName),
    'src/main.ts': generateMainTs(),
    'src/App.vue': generateAppVue(),
    'src/style.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary-color: #667eea;
  --primary-dark: #5a67d8;
  --bg-primary: #ffffff;
  --bg-secondary: #f7fafc;
  --text-primary: #1a202c;
  --text-secondary: #4a5568;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text-primary);
  background: var(--bg-primary);
  -webkit-font-smoothing: antialiased;
}

/* GSAP 动画降级 */
.no-gsap .animated-element {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}`,
    'src/router/index.ts': generateRouterTs(),
    'src/views/HomeView.vue': `<script setup lang="ts">
// 在此导入各 Section 组件
// import HeroSection from '@/sections/HeroSection.vue'
</scr' + 'ipt>

<template>
  <div class="home-view">
    <!-- 模块将从方案内容中生成 -->
    <section class="hero-placeholder min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
      <div class="text-center">
        <h1 class="text-5xl font-bold mb-4">${companyName}</h1>
        <p class="text-xl opacity-80">请根据生成的方案内容替换此占位模块</p>
      </div>
    </section>
  </div>
</template>`,
    'src/components/Navbar.vue': `<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)
</scr' + 'ipt>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <a href="/" class="text-xl font-bold text-gray-900">${companyName}</a>
        <button @click="isOpen = !isOpen" class="md:hidden p-2">
          <span class="sr-only">菜单</span>
          <div class="w-6 h-0.5 bg-gray-600 mb-1"></div>
          <div class="w-6 h-0.5 bg-gray-600 mb-1"></div>
          <div class="w-6 h-0.5 bg-gray-600"></div>
        </button>
        <div :class="['md:flex gap-6', isOpen ? 'flex flex-col absolute top-16 left-0 right-0 bg-white p-4 border-b' : 'hidden']">
          <a href="#hero" class="text-gray-600 hover:text-gray-900 transition-colors">首页</a>
          <a href="#about" class="text-gray-600 hover:text-gray-900 transition-colors">关于</a>
          <a href="#products" class="text-gray-600 hover:text-gray-900 transition-colors">产品</a>
          <a href="#contact" class="text-gray-600 hover:text-gray-900 transition-colors">联系</a>
        </div>
      </div>
    </div>
  </nav>
</template>`,
    'src/components/Footer.vue': `<script setup lang="ts">
</scr' + 'ipt>

<template>
  <footer class="bg-gray-900 text-gray-400 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p>&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
    </div>
  </footer>
</template>`,
    'src/env.d.ts': `/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}`,
  }

  // 构建 zip 文件（使用简单的 zip 格式，无需外部依赖）
  try {
    const zipParts: Uint8Array[] = []
    const encoder = new TextEncoder()
    const centralDir: Uint8Array[] = []
    let offset = 0

    const allFiles = { ...files, 'MEOO_PLAN.md': planContent.value }

    for (const [path, content] of Object.entries(allFiles)) {
      const encoded = encoder.encode(content)
      const nameBytes = encoder.encode(path)

      // Local file header
      const localHeader = new Uint8Array(30 + nameBytes.length)
      const view = new DataView(localHeader.buffer)
      view.setUint32(0, 0x04034b50, true) // signature
      view.setUint16(4, 20, true)          // version needed
      view.setUint16(6, 0x0800, true)      // flags (UTF-8)
      view.setUint16(8, 0, true)           // compression (store)
      view.setUint16(10, 0, true)          // mod time
      view.setUint16(12, 0, true)          // mod date
      const crc = crc32(encoded)
      view.setUint32(14, crc, true)        // CRC-32
      view.setUint32(18, encoded.length, true) // compressed size
      view.setUint32(22, encoded.length, true) // uncompressed size
      view.setUint16(26, nameBytes.length, true)
      view.setUint16(28, 0, true)          // extra field length
      localHeader.set(nameBytes, 30)

      zipParts.push(localHeader, encoded)
      const entrySize = 30 + nameBytes.length + encoded.length

      // Central directory entry
      const cdEntry = new Uint8Array(46 + nameBytes.length)
      const cdView = new DataView(cdEntry.buffer)
      cdView.setUint32(0, 0x02014b50, true) // signature
      cdView.setUint16(4, 20, true)          // version made by
      cdView.setUint16(6, 20, true)          // version needed
      cdView.setUint16(8, 0x0800, true)      // flags
      cdView.setUint16(10, 0, true)          // compression
      cdView.setUint16(12, 0, true)          // mod time
      cdView.setUint16(14, 0, true)          // mod date
      cdView.setUint32(16, crc, true)
      cdView.setUint32(20, encoded.length, true)
      cdView.setUint32(24, encoded.length, true)
      cdView.setUint16(28, nameBytes.length, true)
      cdView.setUint16(30, 0, true)          // extra
      cdView.setUint16(32, 0, true)          // comment
      cdView.setUint16(34, 0, true)          // disk start
      cdView.setUint16(36, 0, true)          // internal attrs
      cdView.setUint32(38, 0, true)          // external attrs
      cdView.setUint32(42, offset, true)     // local header offset
      cdEntry.set(nameBytes, 46)
      centralDir.push(cdEntry)

      offset += entrySize
    }

    const cdOffset = offset
    const cdSize = centralDir.reduce((s, e) => s + e.length, 0)

    // End of central directory
    const eocd = new Uint8Array(22)
    const eocdView = new DataView(eocd.buffer)
    eocdView.setUint32(0, 0x06054b50, true)
    eocdView.setUint16(4, 0, true)           // disk
    eocdView.setUint16(6, 0, true)           // cd disk
    eocdView.setUint16(8, Object.keys(allFiles).length, true) // entries
    eocdView.setUint16(10, Object.keys(allFiles).length, true) // total entries
    eocdView.setUint32(12, cdSize, true)
    eocdView.setUint32(16, cdOffset, true)
    eocdView.setUint16(20, 0, true)          // comment len

    const allParts = [...zipParts, ...centralDir, eocd]
    const totalLen = allParts.reduce((s, a) => s + a.length, 0)
    const result = new Uint8Array(totalLen)
    let pos = 0
    for (const part of allParts) {
      result.set(part, pos)
      pos += part.length
    }

    const blob = new Blob([result], { type: 'application/zip' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${safeName}-meoo-project.zip`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    projectFileName.value = `${safeName}-meoo-project.zip`
    showCliTip.value = true
  } catch (e) {
    console.error('Zip generation failed:', e)
    // Fallback
    const blob = new Blob([JSON.stringify(files, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${safeName}-project-files.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(a.href)

    projectFileName.value = `${safeName}-project-files.json`
    showCliTip.value = true
  }
}

// Simple CRC-32 implementation for zip format
function crc32(data: Uint8Array): number {
  let crc = 0xFFFFFFFF
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i]
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0)
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function copyCliCommands() {
  const name = projectFileName.value.replace(/-meoo-project\.zip$/, '').replace(/-project-files\.json$/, '')
  const commands = [
    `# 解压项目并进入目录`,
    `cd ${name || 'meoo-project'}`,
    `pnpm install`,
    `pnpm dev`,
    '',
    `# 部署到 Meoo 平台`,
    `meoo projects create "我的企业网站"`,
    `meoo sandbox push`,
    `# 在 https://meoo.com 中打开项目继续 AI 编辑`,
  ].join('\n')
  navigator.clipboard.writeText(commands).then(() => alert('✅ CLI 指令已复制'))
}
</script>

<style scoped lang="scss">
// ==================== 触发按钮 ====================
.ai-trigger-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 9px 16px; border-radius: 10px;
  border: 1px solid rgba(99,102,241,0.25);
  background: rgba(99,102,241,0.08);
  color: #a5b4fc; font-size: 0.8rem; font-weight: 600;
  cursor: pointer; transition: all 0.3s; position: relative;

  &:hover { background: rgba(99,102,241,0.18); border-color: rgba(99,102,241,0.4); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(99,102,241,0.15); }
  &.active { background: rgba(99,102,241,0.2); border-color: rgba(99,102,241,0.5); box-shadow: 0 0 20px rgba(99,102,241,0.2); }
  &.pulsing { animation: pulse-btn 2s infinite; }

  .trigger-icon { font-size: 1.1rem; }
  .trigger-text { white-space: nowrap; }
  .trigger-badge { padding: 2px 8px; border-radius: 6px; background: rgba(34,197,94,0.2); color: #4ade80; font-size: 0.65rem; font-weight: 700; }
}
@keyframes pulse-btn {
  0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
  50% { box-shadow: 0 0 0 8px rgba(99,102,241,0); }
}

// ==================== API Key 对话框 ====================
.api-dialog-overlay {
  position: fixed; inset: 0; z-index: 10000;
  background: rgba(0,0,0,0.6); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
}
.api-dialog {
  width: 420px; max-width: 92vw;
  background: linear-gradient(135deg, #1e293b, #1a1a2e);
  border: 1px solid rgba(245,158,11,0.2);
  border-radius: 20px; padding: 32px 28px 24px;
  box-shadow: 0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(245,158,11,0.05);
  text-align: center;
}
.api-dialog-icon { font-size: 2.5rem; margin-bottom: 12px; }
.api-dialog h3 { color: #e2e8f0; margin: 0 0 6px; font-size: 1.1rem; }
.api-dialog p { color: #94a3b8; font-size: 0.82rem; margin: 0 0 8px; }
.api-dialog-link { display: inline-block; color: #fbbf24; font-size: 0.8rem; margin-bottom: 16px; &:hover { color: #f59e0b; } }
.api-dialog-input-row { margin-bottom: 8px; }
.api-dialog-input {
  width: 100%; padding: 12px 16px; border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.4);
  color: #e2e8f0; font-size: 0.85rem; font-family: monospace;
  outline: none; text-align: center;
  &:focus { border-color: rgba(245,158,11,0.5); box-shadow: 0 0 0 3px rgba(245,158,11,0.1); }
  &::placeholder { color: #475569; }
}
.api-dialog-note { font-size: 0.7rem; color: #64748b; margin: 0 0 16px; }
.api-dialog-actions { display: flex; gap: 10px; justify-content: center; }
.api-dialog-btn {
  padding: 10px 20px; border-radius: 8px; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
  &.skip { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #64748b; &:hover { color: #94a3b8; background: rgba(255,255,255,0.03); } }
  &.change { background: transparent; border: 1px solid rgba(239,68,68,0.25); color: #f87171; &:hover { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.4); } }
  &.save { border: none; background: linear-gradient(135deg,#f59e0b,#d97706); color: #fff; &:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(245,158,11,0.3); } &:disabled { opacity: 0.4; cursor: not-allowed; } }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

// ==================== 侧边栏 ====================
.ai-panel-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.3); display: flex; justify-content: flex-end; }
.ai-panel { width: 440px; max-width: 95vw; height: 100vh; background: linear-gradient(180deg,#0f172a 0%,#1a1a2e 100%); border-left: 1px solid rgba(255,255,255,0.08); box-shadow: -10px 0 40px rgba(0,0,0,0.5); display: flex; flex-direction: column; overflow: hidden; }
.panel-header { padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
.panel-title { display: flex; align-items: center; gap: 8px; font-size: 1rem; font-weight: 700; color: #e2e8f0;
  .title-icon { font-size: 1.2rem; }
  .powered-by { padding: 2px 8px; border-radius: 4px; background: rgba(99,102,241,0.15); color: #818cf8; font-size: 0.65rem; font-weight: 600; }
}
.panel-close { background: none; border: none; color: #64748b; font-size: 1.2rem; cursor: pointer; padding: 4px 8px; border-radius: 6px; &:hover { color: #e2e8f0; background: rgba(255,255,255,0.05); } }
.panel-body { flex: 1; overflow-y: auto; padding: 16px 20px; &::-webkit-scrollbar { width: 4px; } &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; } }
.section { margin-bottom: 20px; }
.section-title { font-size: 0.82rem; color: #94a3b8; margin: 0 0 10px; font-weight: 600; }
.summary-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
.summary-item { padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.04); text-align: center;
  .s-label { display: block; font-size: 0.65rem; color: #64748b; margin-bottom: 4px; }
  .s-value { font-size: 0.85rem; font-weight: 600; color: #e2e8f0; &.ok { color: #4ade80; } }
}
.empty-hint { margin-top: 8px; font-size: 0.75rem; color: #fbbf24; text-align: center; }

.gen-options { margin-bottom: 12px; }
.option-row { display: flex; align-items: center; gap: 10px; }
.option-label { font-size: 0.75rem; color: #94a3b8; flex-shrink: 0; }
.option-select {
  flex: 1; padding: 7px 10px; border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04);
  color: #e2e8f0; color-scheme: dark; font-size: 0.78rem; outline: none; cursor: pointer;
  &:focus { border-color: rgba(99,102,241,0.4); }
  option { background: #1e293b; color: #e2e8f0; }
}
.gen-btn { width: 100%; padding: 12px; border-radius: 10px; border: none; background: linear-gradient(135deg,#667eea,#764ba2); color: #fff; font-size: 0.9rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s;
  &:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.4); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
}
.gen-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.2); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.gen-error { margin-top: 8px; padding: 8px 12px; border-radius: 6px; background: rgba(239,68,68,0.1); color: #f87171; font-size: 0.75rem; }

// 聊天
.chat-mini { max-height: 180px; overflow-y: auto; margin-bottom: 8px; padding: 8px; border-radius: 8px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); &::-webkit-scrollbar { width: 3px; } &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; } }
.chat-empty { font-size: 0.72rem; color: #475569; text-align: center; padding: 12px; }
.chat-msg { display: flex; gap: 8px; margin-bottom: 8px; font-size: 0.75rem;
  &.msg-assistant .msg-text { color: #cbd5e1; }
  &.msg-user { flex-direction: row-reverse; .msg-text { background: rgba(99,102,241,0.1); color: #a5b4fc; } }
}
.msg-avatar { flex-shrink: 0; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; background: rgba(255,255,255,0.05); }
.msg-text { padding: 6px 10px; border-radius: 8px; line-height: 1.5; max-width: 85%; &.typing { color: #64748b; font-style: italic; } }
.chat-input-row { display: flex; gap: 6px; }
.chat-input { flex: 1; padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04); color: #e2e8f0; font-size: 0.78rem; outline: none; &:focus { border-color: rgba(99,102,241,0.4); } &::placeholder { color: #475569; } }
.chat-send { width: 32px; height: 32px; border-radius: 8px; border: none; background: rgba(99,102,241,0.2); color: #818cf8; cursor: pointer; display: flex; align-items: center; justify-content: center; &:hover:not(:disabled) { background: rgba(99,102,241,0.4); color: #fff; } &:disabled { opacity: 0.3; cursor: not-allowed; } }

// 方案结果
.panel-result { border-top: 1px solid rgba(255,255,255,0.06); flex-shrink: 0; max-height: 50vh; display: flex; flex-direction: column; }
.result-header { padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; color: #e2e8f0; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.04); }
.result-actions { display: flex; gap: 4px; }
.r-action-btn { padding: 4px 10px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: #94a3b8; font-size: 0.68rem; cursor: pointer; &:hover { background: rgba(255,255,255,0.06); color: #e2e8f0; } }
.r-action-btn.export-btn { background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(118,75,162,0.15)); border-color: rgba(99,102,241,0.3); color: #a5b4fc; font-weight: 600; &:hover { background: linear-gradient(135deg, rgba(99,102,241,0.35), rgba(118,75,162,0.25)); color: #fff; transform: translateY(-1px); } }
.cli-tip-box { padding: 12px 16px; margin: 0 0 12px; border-radius: 10px; background: rgba(34,197,94,0.06); border: 1px solid rgba(34,197,94,0.15); }
.cli-tip-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 0.8rem; color: #4ade80; font-weight: 600; }
.cli-tip-desc { font-size: 0.72rem; color: #94a3b8; margin: 0 0 8px; }
.cli-code { padding: 10px 14px; border-radius: 6px; background: rgba(0,0,0,0.3); color: #a5d6ff; font-family: monospace; font-size: 0.72rem; line-height: 1.6; margin: 0 0 8px; overflow-x: auto; white-space: pre; }
.copy-cli-btn { font-size: 0.7rem; padding: 5px 12px; &:hover { color: #4ade80 !important; border-color: rgba(34,197,94,0.3) !important; } }
.result-body { flex: 1; overflow-y: auto; padding: 12px 20px; &::-webkit-scrollbar { width: 4px; } &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; } }
.markdown-content { font-size: 0.78rem; color: #cbd5e1; line-height: 1.6;
  :deep(h1) { font-size: 1.2rem; color: #e2e8f0; }
  :deep(h2) { font-size: 1rem; color: #e2e8f0; margin-top: 16px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 4px; }
  :deep(h3) { font-size: 0.85rem; color: #e2e8f0; margin-top: 12px; }
  :deep(p) { margin: 4px 0; }
  :deep(ul),:deep(ol) { padding-left: 16px; }
  :deep(li) { padding: 1px 0; }
  :deep(strong) { color: #e2e8f0; }
  :deep(code) { padding: 1px 4px; border-radius: 3px; background: rgba(0,0,0,0.3); font-size: 0.72rem; }
  :deep(pre) { padding: 8px 12px; border-radius: 6px; background: rgba(0,0,0,0.3); overflow-x: auto; font-size: 0.72rem; }
  :deep(blockquote) { border-left: 3px solid rgba(99,102,241,0.4); padding: 4px 12px; margin: 6px 0; background: rgba(99,102,241,0.04); border-radius: 0 6px 6px 0; color: #a5b4fc; }
  :deep(hr) { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 12px 0; }
}

.slide-enter-active,.slide-leave-active { transition: all 0.3s ease; .ai-panel { transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); } }
.slide-enter-from,.slide-leave-to { background: rgba(0,0,0,0); .ai-panel { transform: translateX(100%); } }
</style>
