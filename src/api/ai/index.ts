/**
 * AI API 服务
 * 支持多种AI提供商：通义千问、DeepSeek、OpenAI等
 *
 * V3.0 更新：
 * - E2E 代码生成引擎全面重构 (E2EGenerator)
 *   - 流式原生 HTML 输出，废除 JSON 包裹反模式
 *   - 分阶段生成：Plan → Generate → Assemble → Validate
 *   - System Prompt < 8000 tokens (从 54000 大幅缩减)
 *   - 加权质量评分：内容40% + 结构30% + 动画20% + 加分10%
 *   - 智能风格匹配 + 面板级并行生成
 *
 * V2.0 更新：
 * - 集成动态组件知识库引擎 (ComponentKnowledgeBuilder)
 * - 替换硬编码组件列表为动态扫描的完整 276+ 组件知识
 * - 新增智能组件推荐、场景匹配、代码生成等功能
 */

import axios from 'axios'
import type { AxiosInstance } from 'axios'
import {
  buildComponentKnowledgeBase,
  formatKnowledgeForAI,
  estimateTokens,
  type ComponentKnowledge
} from './component-knowledge-builder'
import { E2EGenerator, type GenerateResult, type QualityReport } from './e2e-generator'

// ==================== 模板源码自动加载 ====================
// 使用 Vite import.meta.glob 预加载所有模板 .vue 源文件（raw 模式）
// 注意: 当前文件位于 src/api/ai，模板实际在 src/views/web-template/template
const templateSources: Record<string, () => Promise<string>> = import.meta.glob(
  '../../views/web-template/template/*/*.vue',
  { query: '?raw', import: 'default' }
)

/** 模板源码缓存（异步加载后缓存） */
const templateSourceCache = new Map<string, string>()

/** 加载指定模板的源码 */
async function loadTemplateSource(templateKey: string): Promise<string | null> {
  if (templateSourceCache.has(templateKey)) {
    return templateSourceCache.get(templateKey)!
  }

  // 匹配路径: ../../views/web-template/template/{key}/{key}.vue
  const matchKey = `../../views/web-template/template/${templateKey}/${templateKey}.vue`
  const loader = templateSources[matchKey]
  if (!loader) {
    // 尝试匹配任意 .vue 文件（部分旧模板命名不规范）
    for (const [path, fn] of Object.entries(templateSources)) {
      const folder = path.split('/').slice(-2)[0]
      if (folder === templateKey || path.includes(`/${templateKey}/`)) {
        const source = await fn()
        templateSourceCache.set(templateKey, source)
        return source
      }
    }
    console.warn(`⚠️ 模板源码未找到: ${templateKey}`)
    return null
  }

  const source = await loader()
  templateSourceCache.set(templateKey, source)
  return source
}

// AI提供商类型
export type AIProvider = 'qwen' | 'deepseek' | 'openai' | 'custom'

// AI配置接口
export interface AIConfig {
  provider: AIProvider
  apiKey: string
  baseUrl?: string
  model?: string
  /** E2E 代码生成专用模型（推理模型如 deepseek-reasoner，生成质量更高） */
  e2eModel?: string
}

// 消息角色
export type MessageRole = 'system' | 'user' | 'assistant'

// 消息结构
export interface ChatMessage {
  role: MessageRole
  content: string
}

// AI请求参数
export interface AIRequestParams {
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  stream?: boolean
  timeout?: number // 自定义超时时间(ms)
  model?: string // 覆盖默认模型（E2E生成用 reasoning 模型等）
  /** JSON Schema 结构化输出（DeepSeek/OpenAI 兼容） */
  responseFormat?: { type: 'json_object' } | { type: 'json_schema'; json_schema: { name: string; schema: object } }
}

// AI响应结构
export interface AIResponse {
  success: boolean
  data?: any
  error?: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

// 方案生成请求
export interface SolutionGenerationRequest {
  websiteType: string
  industry: string
  companyName: string
  businessDesc: string
  targetAudience: string // 新增：目标用户群体
  brandKeywords: string // 新增：品牌关键词
  visualStyle: string
  emotions: string[] // 新增：情感氛围
  selectedModules: string[]
  priorityModule: string // 新增：重点模块
  targetDevice: string
  budget: string
  timeline: string
  performancePriority: number // 新增：性能优先级 1=视觉优先 2=平衡 3=速度优先
  specialRequirements: string
}

// 方案生成响应
export interface SolutionGenerationResponse {
  solutions: GeneratedSolution[]
  analysis: string
  recommendations: string[]
}

// 生成的方案
export interface GeneratedSolution {
  name: string
  icon: string
  badge: string
  description: string
  performanceRating: number
  complexity: string
  estimatedTime: string
  reasons: string[]
  modules: ModuleSolution[]
  colorScheme?: ColorScheme[]
}

// 模块方案
export interface ModuleSolution {
  icon: string
  name: string
  components: ComponentRecommendation[]
}

// 组件推荐
export interface ComponentRecommendation {
  name: string
  type: string
  purpose: string
}

// 配色方案
export interface ColorScheme {
  role: string
  hex: string
}

// ==================== V2.0 新增接口 ====================

/** 组件推荐请求 */
export interface ComponentRecommendationRequest {
  /** 场景描述（自然语言） */
  sceneDescription: string
  /** 网站类型 */
  websiteType?: string
  /** 视觉风格偏好 */
  visualStyle?: string
  /** 需要的组件类别（可选，不传则全类别推荐） */
  categories?: string[]
  /** 推荐数量 */
  count?: number
  /** 复杂度限制 */
  maxComplexity?: 'low' | 'medium' | 'high'
}

/** 组件推荐响应 */
export interface ComponentRecommendationResponse {
  recommendations: ComponentMatch[]
  reasoning: string
}

/** 组件匹配结果 */
export interface ComponentMatch {
  name: string
  category: string
  confidence: number // 0-1
  reason: string
  alternatives: string[]
}

/** 代码生成请求 */
export interface CodeGenerationRequest {
  /** 自然语言描述 */
  description: string
  /** 选中的组件名称列表 */
  selectedComponents: string[]
  /** 企业信息 */
  companyInfo?: {
    name?: string
    industry?: string
    description?: string
  }
  /** 视觉风格 */
  visualStyle?: string
  /** 配色方案 */
  colorScheme?: string
  /** 目标框架 (默认 react) */
  framework?: 'react' | 'vue'
  /** 是否流式输出 */
  stream?: boolean
}

/** 代码生成响应 */
export interface CodeGenerationResponse {
  code: string
  files: GeneratedFile[]
  explanation: string
}

/** 生成的文件 */
export interface GeneratedFile {
  path: string
  content: string
  description: string
}

// ==================== V2.0 模板⇄组件关联接口 ====================

/** 模板组件映射请求 */
export interface TemplateComponentMapRequest {
  /** 模板 key (如 horizontal-scroll, neon-city) */
  templateKey: string
  /** 模板中文名 */
  templateLabel: string
  /** 模板源码（完整 .vue 文件内容） */
  sourceCode: string
  /** 模板 README (如果有) */
  readme?: string
  /** 每个面板推荐几个组件 */
  componentsPerPanel?: number
}

/** 面板级组件推荐 */
export interface PanelComponentRecommendation {
  /** 面板序号 (0-based) */
  panelIndex: number
  /** 面板名称/描述 */
  panelName: string
  /** 面板用途（AI 分析） */
  panelPurpose: string
  /** 推荐组件列表 */
  recommendedComponents: ComponentMatch[]
}

/** 模板组件映射结果 */
export interface TemplateComponentMapResult {
  templateKey: string
  templateLabel: string
  /** 模板整体分析 */
  analysis: string
  /** 模板滚动模式 */
  scrollPattern: string
  /** 视觉风格标签 */
  visualStyle: string
  /** 适用行业场景 */
  targetScenes: string[]
  /** 各面板的组件推荐 */
  panels: PanelComponentRecommendation[]
}

// ==================== V2.0 端到端代码生成接口 (方案一) ====================

/** 端到端代码生成请求 */
export interface WebsiteE2ERequest {
  /** 自然语言描述 */
  description: string
  /** 公司信息 */
  companyInfo?: {
    name?: string
    industry?: string
    description?: string
  }
  /** 视觉风格偏好 */
  visualStyle?: string
  /** 配色偏好 */
  colorPreference?: string
  /** 可选：指定模板 key */
  templateKey?: string
  /** 可选：指定模板面板结构（AI会按此结构生成各段代码） */
  templatePanels?: Array<{ index: number; name: string; purpose: string }>
  /** 可选：已推荐的组件映射（模板⇄组件关联的结果） */
  recommendedComponents?: TemplateComponentMapResult
  /** 目标框架 */
  framework?: 'react' | 'vue'
  /** 生成模式: 'single-html'(iframe预览) | 'multi-file'(下载用) */
  mode?: 'single-html' | 'multi-file'
  /** 是否流式输出 */
  stream?: boolean
}

/** 端到端代码生成响应 */
export interface WebsiteE2EResponse {
  /** 生成模式 */
  mode: 'single-html' | 'multi-file'
  /** 单文件HTML（mode='single-html'时） */
  html?: string
  /** 多文件列表（mode='multi-file'时） */
  files?: GeneratedFile[]
  /** AI 选中的组件列表 */
  selectedComponents: string[]
  /** AI 解释（为什么选这些组件） */
  reasoning: string
  /** V3.0 质量报告 */
  qualityReport?: { score: number; passed: boolean; issues: string[]; warnings: string[] }
}

/** 流式回调 */
export type E2EStreamCallback = (chunk: {
  type: 'reasoning' | 'code' | 'components' | 'telemetry' | 'done' | 'error'
  content?: string
  data?: any
}) => void

/** System Prompt 缓存条目 */
interface SystemPromptCache {
  /** 静态模块的 hash */
  staticHash: string
  /** 缓存时间 */
  timestamp: number
  /** 静态部分的 prompt 文本 */
  staticPrompt: string
}

/** 计算简单字符串 hash */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return hash.toString(36)
}

// 用 fromCharCode(96) 构建反引号，避免 esbuild 将连续反引号误解析为模板字符串
var _BT = String.fromCharCode(96)
var _TB = _BT + _BT + _BT

/** 从 markdown 文本中提取指定语言的代码块内容 */
function extractMdBlock(content: string, tag?: string): string | null {
  var openMark = _TB + (tag || '')
  var closeMark = _TB
  var startIdx = content.indexOf(openMark)
  if (startIdx === -1) return null
  var codeStart = startIdx + openMark.length
  var idx = codeStart
  while (idx < content.length && (content[idx] === '\n' || content[idx] === '\r')) idx++
  var endIdx = content.indexOf(closeMark, idx)
  if (endIdx === -1) return null
  return content.substring(idx, endIdx).trim()
}

/**
 * 解析 AI 返回的结构化 JSON 响应
 * 支持：纯 JSON / markdown json 块 / 首尾有大括号的 JSON
 */
function parseStructuredResponse(content: string): Record<string, any> | null {
  const trimmed = content.trim()

  // 1. 尝试直接解析（最佳情况：纯 JSON）
  try {
    return JSON.parse(trimmed)
  } catch { /* not pure JSON */ }

  // 2. 尝试提取 ```json ... ``` 块
  const jsonBlockStr = extractMdBlock(trimmed, 'json')
  if (jsonBlockStr) {
    try {
      return JSON.parse(jsonBlockStr)
    } catch { /* ignore */ }
  }

  // 3. 尝试提取首尾大括号（AI 有时会前后加说明文字）
  const firstBrace = trimmed.indexOf('{')
  const lastBrace = trimmed.lastIndexOf('}')
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    try {
      return JSON.parse(trimmed.substring(firstBrace, lastBrace + 1))
    } catch { /* ignore */ }
  }

  return null
}

/**
 * 在流式输出中查找 JSON 对象的结束位置
 * 通过计数大括号匹配来定位
 */
function tryFindJsonEnd(text: string): number {
  let depth = 0
  let inString = false
  let escaped = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]

    if (escaped) { escaped = false; continue }

    if (ch === '\\' && inString) { escaped = true; continue }

    if (ch === '"' && !escaped) { inString = !inString; continue }

    if (inString) continue

    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) return i + 1
    }
  }

  return 0 // JSON 未闭合
}

class AIService {
  private client: AxiosInstance
  private config: AIConfig | null = null
  private knowledgeBase: ComponentKnowledge[] | null = null
  private knowledgeBasePromise: Promise<ComponentKnowledge[]> | null = null
  /** Prompt 缓存（静态模块可跨请求复用，节省 ~60% tokens） */
  private promptCache: Map<string, SystemPromptCache> = new Map()
  /** V3.0 E2E 生成引擎（懒初始化） */
  private e2eGenerator: E2EGenerator | null = null

  constructor() {
    this.client = axios.create({
      timeout: 300000, // 5分钟超时（知识库注入模型需要较长时间）
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  /**
   * 生成 GSAP 组件实现代码模式参考（紧凑格式，~3K tokens）
   * 告诉 AI 如何用原生 JS + GSAP 实现各类动画效果
   */
  getComponentCodePatterns(): string {
    return `## GSAP 动画实现模式参考

### 通用规范
- 必须 \`gsap.registerPlugin(ScrollTrigger)\`
- 所有 DOM 元素选择器使用唯一类名后缀（如 \`-271\`），避免冲突
- 首屏 Hero 动画在 \`DOMContentLoaded\` 中立即执行，不绑定 ScrollTrigger
- 后续面板动画用 \`ScrollTrigger\` + \`toggleActions: 'play none none reverse'\`

### Hero 入场动画（无 ScrollTrigger）
\`\`\`js
gsap.fromTo('.hero-title-xxx', { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: 'power3.out' })
gsap.fromTo('.hero-subtitle-xxx', { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.8, ease: 'power3.out' })
// 按钮、背景装饰也用 gsap.fromTo 逐个延迟
\`\`\`

### 卡片序列入场（stagger + ScrollTrigger）
\`\`\`js
gsap.utils.toArray('.card-xxx').forEach((card, i) => {
  gsap.fromTo(card,
    { y: 120, opacity: 0, scale: 0.9 },
    { y: 0, opacity: 1, scale: 1, duration: 0.8, delay: i * 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none reverse' }
    }
  )
})
\`\`\`

### 数字递增动画
\`\`\`js
gsap.fromTo(numEl, { textContent: 0 }, {
  textContent: targetValue, duration: 2.5, ease: 'power2.out',
  scrollTrigger: { trigger: '.stats-section-xxx', start: 'top 60%' },
  snap: { textContent: 1 },
  onUpdate: function() { numEl.textContent = Math.round(this.targets()[0].textContent).toLocaleString() }
})
\`\`\`

### 视差/滚动绑定（scrub）
\`\`\`js
gsap.to('.parallax-bg-xxx', {
  y: -100, scale: 1.1,
  scrollTrigger: { trigger: '.hero-xxx', start: 'top top', end: 'bottom top', scrub: 1.5 }
})
\`\`\`

### 导航栏状态切换
\`\`\`js
ScrollTrigger.create({
  start: 100,
  onUpdate: (self) => navbar.classList.toggle('scrolled', self.scroll() > 100)
})
\`\`\`

### 卡片 hover 3D 倾斜
\`\`\`js
card.addEventListener('mousemove', function(e) {
  const rect = card.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  gsap.to(card, { rotateX: y * -8, rotateY: x * 8, duration: 0.4, ease: 'power2.out' })
})
card.addEventListener('mouseleave', () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.4 }))
\`\`\`

### 平滑页面滚动
\`\`\`js
// CDN 需引入 ScrollToPlugin
gsap.to(window, { duration: 1.5, scrollTo: { y: targetSection, offsetY: 80 }, ease: 'power3.inOut' })
\`\`\`

### 回流避坑
- GSAP 动画不传 \`transform: translate3d()\`，用 \`x/y\` 替代
- 大规模 stager 动画用 \`will-change: transform, opacity\`
- 移动端禁用或简化复杂粒子/Canvas 动画`
  }

  /**
   * 专业级 Few-Shot 范例（完整可运行，1100+ 行，10面板完整网站）
   *
   * 设计策略：深色调宠物/消费品牌风格的完整企业官网。
   * 此范例强制展示了 Footer、Team、FAQ、Testimonials 等"容易被省略"的面板，
   * 以及 DRY 的 Canvas 粒子封装、FAQ 折叠交互、团队社交卡片、证言轮播等高级模式。
   * AI 必须学习此完整度，而不是输出 6 面板的简化版。
   */
  getFewShotExample(): string {
    return `## Few-Shot 范例：专业级企业官网（1100+ 行完整参考，必学此标准）

\`\`\`html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="企业官网">
  <title>【品牌名】- 企业官网</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js"></script>
  <style>
    :root {
      --bg-primary: #0a1410; --bg-secondary: #0f1f18;
      --accent-primary: #22c55e; --accent-secondary: #a3e635;
      --text-primary: #e8f5e9; --text-secondary: #81a889;
      --card-bg: rgba(34,197,94,0.05); --card-border: rgba(34,197,94,0.1);
      --gradient-hero: linear-gradient(135deg, #0a1410 0%, #0d1f16 50%, #0a1410 100%);
    }
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter',system-ui,sans-serif; background:var(--bg-primary); color:var(--text-primary); overflow-x:hidden; }
    .panel { min-height:100vh; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; }
    .panel-inner { max-width:1200px; width:100%; margin:0 auto; padding:80px 40px; position:relative; z-index:1; }
    .navbar { position:fixed; top:0; width:100%; z-index:100; padding:20px 60px; transition:all 0.35s; display:flex; justify-content:space-between; align-items:center; }
    .navbar.scrolled { background:rgba(10,20,16,0.92); backdrop-filter:blur(12px); padding:12px 60px; box-shadow:0 2px 24px rgba(0,0,0,0.3); }
    .glass-card { background:var(--card-bg); border:1px solid var(--card-border); border-radius:16px; backdrop-filter:blur(10px); transition:all 0.35s cubic-bezier(0.25,0.46,0.45,0.94); }
    .glass-card:hover { transform:translateY(-6px); box-shadow:0 24px 48px rgba(0,0,0,0.4); border-color:var(--accent-primary); }
    .gradient-text { background:linear-gradient(135deg,var(--accent-primary),var(--accent-secondary)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .btn-primary { background:linear-gradient(135deg,var(--accent-primary),var(--accent-secondary)); color:white; padding:14px 36px; border-radius:50px; font-weight:700; border:none; cursor:pointer; transition:all 0.3s; box-shadow:0 4px 16px rgba(34,197,94,0.3); }
    .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(34,197,94,0.45); }
    .btn-outline { background:transparent; color:var(--accent-primary); padding:13px 34px; border-radius:50px; font-weight:700; border:2px solid var(--accent-primary); cursor:pointer; transition:all 0.3s; }
    .btn-outline:hover { background:var(--accent-primary); color:white; }
    .scroll-indicator { position:absolute; bottom:32px; left:50%; transform:translateX(-50%); animation:bounce 2s infinite; cursor:pointer; z-index:2; }
    @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0);} 50%{transform:translateX(-50%) translateY(12px);} }
    .section-title { font-size:2.5rem; font-weight:700; margin-bottom:1rem; }
    .section-subtitle { font-size:1.1rem; color:var(--text-secondary); max-width:600px; }
    .form-input { width:100%; padding:14px 18px; border-radius:12px; border:1.5px solid #2d4a3e; background:#0f1f18; color:var(--text-primary); font-size:1rem; transition:all 0.3s; outline:none; font-family:inherit; }
    .form-input:focus { border-color:var(--accent-primary); box-shadow:0 0 0 3px rgba(34,197,94,0.1); }
    .canvas-bg { position:absolute; inset:0; pointer-events:none; z-index:0; }
    /* FAQ折叠 */
    .faq-item { border-bottom:1px solid #1a3a25; overflow:hidden; }
    .faq-question { padding:20px 0; cursor:pointer; display:flex; justify-content:space-between; align-items:center; font-weight:600; transition:color 0.3s; }
    .faq-question:hover { color:var(--accent-primary); }
    .faq-answer { max-height:0; overflow:hidden; transition:max-height 0.4s ease, padding 0.4s; color:var(--text-secondary); line-height:1.7; }
    .faq-answer.open { max-height:300px; padding-bottom:20px; }
    .faq-icon { transition:transform 0.3s; font-size:1.2rem; }
    .faq-icon.open { transform:rotate(45deg); }
    /* Footer */
    .footer { background:var(--bg-secondary); border-top:1px solid #1a3a25; padding:64px 40px 32px; }
    .footer a { color:var(--text-secondary); transition:color 0.3s; text-decoration:none; }
    .footer a:hover { color:var(--accent-primary); }
    @media (max-width:768px) {
      .navbar { padding:16px 20px; flex-wrap:wrap; }
      .navbar .hidden { display:none; }
      .panel-inner { padding:60px 20px; }
      .section-title { font-size:2rem; }
      .footer { padding:40px 20px 24px; }
    }
  </style>
</head>
<body>
  <nav class="navbar" id="navbar">
    <div class="text-2xl font-black gradient-text">LOGO</div>
    <div class="flex gap-8 font-semibold text-sm">
      <a class="nav-link" href="#hero">首页</a><a class="nav-link" href="#about">品牌故事</a><a class="nav-link" href="#products">产品服务</a><a class="nav-link" href="#team">专业团队</a><a class="nav-link" href="#testimonials">客户心声</a><a class="nav-link" href="#faq">常见问题</a><a class="nav-link" href="#stats">数据见证</a><a class="nav-link" href="#contact">联系我们</a>
    </div>
  </nav>

  <!-- ===== Hero ===== -->
  <section class="panel" id="hero" style="background:var(--gradient-hero);">
    <canvas class="canvas-bg" id="heroCanvas"></canvas>
    <div class="panel-inner text-center">
      <span class="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-6" style="background:rgba(34,197,94,0.1);color:var(--accent-primary)">行业领先解决方案</span>
      <h1 class="hero-title text-5xl md:text-7xl font-black mb-6 leading-tight gradient-text">让创新驱动<br>业务持续增长</h1>
      <p class="hero-desc text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">我们专注为企业提供卓越的解决方案，服务覆盖全球500+客户，98%客户满意度，10年深耕行业经验。</p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button class="btn-primary" onclick="document.querySelector('#products').scrollIntoView({behavior:'smooth'})">探索产品服务</button>
        <button class="btn-outline" onclick="document.querySelector('#contact').scrollIntoView({behavior:'smooth'})">预约演示</button>
      </div>
      <div class="scroll-indicator" onclick="document.querySelector('#about').scrollIntoView({behavior:'smooth'})">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="2" stroke-linecap="round"><path d="M7 13l5 5 5-5"/><path d="M7 6l5 5 5-5"/></svg>
      </div>
    </div>
  </section>

  <!-- ===== About Story 左右分栏 ===== -->
  <section class="panel" id="about" style="background:var(--bg-primary);">
    <div class="panel-inner">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div class="relative">
          <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80" alt="团队" class="rounded-2xl shadow-2xl w-full" style="aspect-ratio:4/3;object-fit:cover;">
          <div class="absolute -bottom-6 -right-6 glass-card p-6 rounded-2xl shadow-xl" style="background:rgba(15,31,24,0.9)">
            <div class="text-3xl font-black gradient-text">10+</div><div class="text-sm text-gray-400">年行业深耕</div>
          </div>
        </div>
        <div>
          <span class="text-sm font-semibold tracking-wider uppercase" style="color:var(--accent-primary)">Brand Story</span>
          <h2 class="section-title mt-2">用专业与热情<br>成就每一个梦想</h2>
          <p class="text-gray-400 leading-relaxed mb-6">我们成立于2015年，从一个小型工作室起步，如今已成为行业领先的服务提供商。我们始终坚持"品质第一"的理念，为每一位客户创造真正的价值。</p>
          <p class="text-gray-400 leading-relaxed mb-8">团队由来自顶尖公司的资深专家组成，平均从业经验超过8年。我们相信，好的产品和服务应该让复杂变得简单，让专业触手可及。</p>
          <div class="grid grid-cols-3 gap-4">
            <div class="glass-card p-4 text-center" style="background:rgba(15,31,24,0.8)"><div class="text-2xl mb-1">🏆</div><div class="text-xs font-semibold">500+客户</div></div>
            <div class="glass-card p-4 text-center" style="background:rgba(15,31,24,0.8)"><div class="text-2xl mb-1">🌍</div><div class="text-xs font-semibold">30+国家</div></div>
            <div class="glass-card p-4 text-center" style="background:rgba(15,31,24,0.8)"><div class="text-2xl mb-1">⭐</div><div class="text-xs font-semibold">98%满意度</div></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== Products 4列网格 ===== -->
  <section class="panel" id="products" style="background:var(--bg-secondary);">
    <div class="panel-inner text-center">
      <span class="text-sm font-semibold tracking-wider uppercase" style="color:var(--accent-primary)">Products & Services</span>
      <h2 class="section-title mt-2 mx-auto">全栈能力覆盖，一站式交付</h2>
      <p class="section-subtitle mx-auto mt-4">从战略规划到执行落地，我们提供端到端的完整解决方案</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        <div class="glass-card p-8 text-left" style="background:rgba(15,31,24,0.8)">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6" style="background:rgba(34,197,94,0.1)">⚡</div>
          <h3 class="text-xl font-bold mb-3">核心产品A</h3>
          <p class="text-gray-400 leading-relaxed mb-4 text-sm">基于前沿技术打造的产品，帮助企业实现效率提升与成本优化。</p>
          <a href="#" class="text-sm font-semibold" style="color:var(--accent-primary)">了解详情 →</a>
        </div>
        <div class="glass-card p-8 text-left" style="background:rgba(15,31,24,0.8)">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6" style="background:rgba(34,197,94,0.1)">📊</div>
          <h3 class="text-xl font-bold mb-3">数据分析平台</h3>
          <p class="text-gray-400 leading-relaxed mb-4 text-sm">深度挖掘数据价值，提供可视化洞察报告与预测分析能力。</p>
          <a href="#" class="text-sm font-semibold" style="color:var(--accent-primary)">了解详情 →</a>
        </div>
        <div class="glass-card p-8 text-left" style="background:rgba(15,31,24,0.8)">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6" style="background:rgba(34,197,94,0.1)">🔒</div>
          <h3 class="text-xl font-bold mb-3">安全合规服务</h3>
          <p class="text-gray-400 leading-relaxed mb-4 text-sm">全面的信息安全评估与合规咨询，确保系统满足行业标准。</p>
          <a href="#" class="text-sm font-semibold" style="color:var(--accent-primary)">了解详情 →</a>
        </div>
        <div class="glass-card p-8 text-left" style="background:rgba(15,31,24,0.8)">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6" style="background:rgba(34,197,94,0.1)">🎯</div>
          <h3 class="text-xl font-bold mb-3">战略咨询服务</h3>
          <p class="text-gray-400 leading-relaxed mb-4 text-sm">资深顾问团队提供定制化战略规划，助力企业把握行业机遇。</p>
          <a href="#" class="text-sm font-semibold" style="color:var(--accent-primary)">了解详情 →</a>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== Team 4列人物卡片（差异化面板） ===== -->
  <section class="panel" id="team" style="background:var(--bg-primary);">
    <canvas class="canvas-bg" id="teamCanvas"></canvas>
    <div class="panel-inner text-center">
      <span class="text-sm font-semibold tracking-wider uppercase" style="color:var(--accent-primary)">Our Team</span>
      <h2 class="section-title mt-2 mx-auto">专业团队，匠心服务</h2>
      <p class="section-subtitle mx-auto mt-4">汇聚行业顶尖人才，用心成就每一个项目</p>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14">
        <div class="glass-card p-6 text-center" style="background:rgba(15,31,24,0.8)">
          <div class="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" alt="CEO" class="w-full h-full object-cover"></div>
          <h3 class="text-lg font-bold">张伟</h3><p class="text-sm text-gray-400 mb-3">CEO & 创始人</p>
          <p class="text-xs text-gray-400 leading-relaxed">15年行业经验，连续创业者，专注于技术创新与商业落地。</p>
          <div class="flex gap-3 justify-center mt-4 text-xs"><a href="#" style="color:var(--accent-primary)">LinkedIn</a><a href="#" style="color:var(--accent-primary)">Twitter</a></div>
        </div>
        <div class="glass-card p-6 text-center" style="background:rgba(15,31,24,0.8)">
          <div class="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" alt="CTO" class="w-full h-full object-cover"></div>
          <h3 class="text-lg font-bold">李娜</h3><p class="text-sm text-gray-400 mb-3">CTO</p>
          <p class="text-xs text-gray-400 leading-relaxed">前大厂技术总监，10年架构设计经验，开源社区活跃贡献者。</p>
          <div class="flex gap-3 justify-center mt-4 text-xs"><a href="#" style="color:var(--accent-primary)">LinkedIn</a><a href="#" style="color:var(--accent-primary)">GitHub</a></div>
        </div>
        <div class="glass-card p-6 text-center" style="background:rgba(15,31,24,0.8)">
          <div class="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden"><img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" alt="Design" class="w-full h-full object-cover"></div>
          <h3 class="text-lg font-bold">王磊</h3><p class="text-sm text-gray-400 mb-3">设计总监</p>
          <p class="text-xs text-gray-400 leading-relaxed">国际获奖设计师，曾服务多家世界500强企业品牌重塑项目。</p>
          <div class="flex gap-3 justify-center mt-4 text-xs"><a href="#" style="color:var(--accent-primary)">Dribbble</a><a href="#" style="color:var(--accent-primary)">Behance</a></div>
        </div>
        <div class="glass-card p-6 text-center" style="background:rgba(15,31,24,0.8)">
          <div class="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden"><img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80" alt="COO" class="w-full h-full object-cover"></div>
          <h3 class="text-lg font-bold">陈晓</h3><p class="text-sm text-gray-400 mb-3">运营总监</p>
          <p class="text-xs text-gray-400 leading-relaxed">供应链管理专家，主导过数十个大型项目从0到1的商业化落地。</p>
          <div class="flex gap-3 justify-center mt-4 text-xs"><a href="#" style="color:var(--accent-primary)">LinkedIn</a><a href="#" style="color:var(--accent-primary)">Twitter</a></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== Testimonials 证言轮播（差异化面板） ===== -->
  <section class="panel" id="testimonials" style="background:var(--bg-secondary);">
    <div class="panel-inner text-center">
      <span class="text-sm font-semibold tracking-wider uppercase" style="color:var(--accent-primary)">Testimonials</span>
      <h2 class="section-title mt-2 mx-auto">客户怎么说</h2>
      <p class="section-subtitle mx-auto mt-4">来自各行业客户的真实评价</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div class="glass-card p-8 text-left" style="background:rgba(15,31,24,0.8)">
          <div class="flex gap-0.5 mb-4" style="color:var(--accent-secondary)">★★★★★</div>
          <p class="text-gray-300 leading-relaxed mb-6 text-sm">"专业团队的服务远超预期，项目交付质量和效率都非常出色。已经成为我们的长期合作伙伴。"</p>
          <div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full overflow-hidden"><img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80" alt="客户" class="w-full h-full object-cover"></div><div><div class="font-semibold text-sm">赵总</div><div class="text-xs text-gray-400">某集团公司CEO</div></div></div>
        </div>
        <div class="glass-card p-8 text-left" style="background:rgba(15,31,24,0.8)">
          <div class="flex gap-0.5 mb-4" style="color:var(--accent-secondary)">★★★★★</div>
          <p class="text-gray-300 leading-relaxed mb-6 text-sm">"从需求沟通到最终交付，每个环节都体现了极高的专业水准。强烈推荐给所有需要的企业。"</p>
          <div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full overflow-hidden"><img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80" alt="客户" class="w-full h-full object-cover"></div><div><div class="font-semibold text-sm">孙总监</div><div class="text-xs text-gray-400">某上市企业技术总监</div></div></div>
        </div>
        <div class="glass-card p-8 text-left" style="background:rgba(15,31,24,0.8)">
          <div class="flex gap-0.5 mb-4" style="color:var(--accent-secondary)">★★★★★</div>
          <p class="text-gray-300 leading-relaxed mb-6 text-sm">"合作三年来，他们始终保持着高度的责任心和创新精神，帮助我们实现了多个关键业务目标。"</p>
          <div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full overflow-hidden"><img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=80" alt="客户" class="w-full h-full object-cover"></div><div><div class="font-semibold text-sm">周经理</div><div class="text-xs text-gray-400">某金融集团项目经理</div></div></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== FAQ 折叠面板（差异化面板） ===== -->
  <section class="panel" id="faq" style="background:var(--bg-primary);">
    <div class="panel-inner" style="max-width:800px">
      <div class="text-center mb-12">
        <span class="text-sm font-semibold tracking-wider uppercase" style="color:var(--accent-primary)">FAQ</span>
        <h2 class="section-title mt-2 mx-auto">常见问题</h2>
        <p class="section-subtitle mx-auto mt-4">您关心的问题，这里都有答案</p>
      </div>
      <div class="space-y-0">
        <div class="faq-item"><div class="faq-question" onclick="var a=this.nextElementSibling;var i=this.querySelector('.faq-icon');a.classList.toggle('open');i.classList.toggle('open')"><span>你们的服务流程是怎样的？</span><span class="faq-icon">+</span></div><div class="faq-answer"><p>我们的服务分为四个阶段：需求沟通（1-3天）→ 方案设计（5-7天）→ 开发执行（按项目规模）→ 交付验收与持续优化。全程有专属项目经理一对一跟进。</p></div></div>
        <div class="faq-item"><div class="faq-question" onclick="var a=this.nextElementSibling;var i=this.querySelector('.faq-icon');a.classList.toggle('open');i.classList.toggle('open')"><span>项目周期一般是多久？</span><span class="faq-icon">+</span></div><div class="faq-answer"><p>标准项目周期为2-6个月，具体取决于项目规模和复杂度。我们会在需求评估阶段给出详细的时间规划，确保每个里程碑按时交付。</p></div></div>
        <div class="faq-item"><div class="faq-question" onclick="var a=this.nextElementSibling;var i=this.querySelector('.faq-icon');a.classList.toggle('open');i.classList.toggle('open')"><span>是否提供售后服务和技术支持？</span><span class="faq-icon">+</span></div><div class="faq-answer"><p>是的，我们提供完善的售后服务体系。包括7×24小时技术支持、定期系统巡检、免费升级维护，以及专属客户成功经理持续跟进。</p></div></div>
        <div class="faq-item"><div class="faq-question" onclick="var a=this.nextElementSibling;var i=this.querySelector('.faq-icon');a.classList.toggle('open');i.classList.toggle('open')"><span>如何开始合作？</span><span class="faq-icon">+</span></div><div class="faq-answer"><p>您可以通过下方联系表单提交需求，或直接拨打我们的咨询热线。商务团队会在24小时内与您取得联系，安排免费的需求评估会议。</p></div></div>
      </div>
    </div>
  </section>

  <!-- ===== Stats 数据面板 ===== -->
  <section class="panel" id="stats" style="background:var(--gradient-hero);">
    <canvas class="canvas-bg" id="statsCanvas"></canvas>
    <div class="panel-inner text-center">
      <span class="text-sm font-semibold tracking-wider uppercase" style="color:var(--accent-primary)">By The Numbers</span>
      <h2 class="section-title mt-2 mx-auto">数字见证实力</h2>
      <p class="section-subtitle mx-auto mt-4">每一个数字背后，都是我们对品质的坚守与客户的信任</p>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14">
        <div class="glass-card p-8" style="background:rgba(15,31,24,0.8)"><div class="text-5xl font-black gradient-text counter-num" data-target="500">0</div><div class="text-sm text-gray-400 mt-3 font-medium">服务企业客户</div></div>
        <div class="glass-card p-8" style="background:rgba(15,31,24,0.8)"><div class="text-5xl font-black gradient-text counter-num" data-target="99">0</div><div class="text-sm text-gray-400 mt-3 font-medium">客户满意度%</div></div>
        <div class="glass-card p-8" style="background:rgba(15,31,24,0.8)"><div class="text-5xl font-black gradient-text counter-num" data-target="30">0</div><div class="text-sm text-gray-400 mt-3 font-medium">覆盖国家地区</div></div>
        <div class="glass-card p-8" style="background:rgba(15,31,24,0.8)"><div class="text-5xl font-black gradient-text counter-num" data-target="10">0</div><div class="text-sm text-gray-400 mt-3 font-medium">年行业深耕</div></div>
      </div>
    </div>
  </section>

  <!-- ===== Contact 联系表单 ===== -->
  <section class="panel" id="contact" style="background:var(--bg-secondary);">
    <div class="panel-inner">
      <div class="text-center mb-12">
        <span class="text-sm font-semibold tracking-wider uppercase" style="color:var(--accent-primary)">Get In Touch</span>
        <h2 class="section-title mt-2 mx-auto">开启合作之旅</h2>
        <p class="section-subtitle mx-auto mt-4">留下联系方式，我们的专家将在24小时内与您联系</p>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
        <form class="lg:col-span-3 glass-card p-8" style="background:rgba(15,31,24,0.8)" id="contactForm">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div><label class="block text-sm font-semibold mb-1.5">姓名 *</label><input type="text" class="form-input" placeholder="您的称呼" required></div>
            <div><label class="block text-sm font-semibold mb-1.5">手机 *</label><input type="tel" class="form-input" placeholder="手机号码" required></div>
          </div>
          <div class="mb-4"><label class="block text-sm font-semibold mb-1.5">电子邮箱</label><input type="email" class="form-input" placeholder="you@company.com"></div>
          <div class="mb-4"><label class="block text-sm font-semibold mb-1.5">咨询方向</label>
            <select class="form-input"><option>产品咨询</option><option>预约演示</option><option>商务合作</option><option>其他</option></select>
          </div>
          <div class="mb-5"><label class="block text-sm font-semibold mb-1.5">需求描述</label><textarea rows="4" class="form-input" placeholder="请简要描述您的需求..."></textarea></div>
          <button type="submit" class="btn-primary w-full">提交咨询</button>
          <p id="formSuccess" class="text-green-400 text-sm mt-3 text-center hidden">✓ 已提交成功！我们会尽快联系您。</p>
        </form>
        <div class="lg:col-span-2 space-y-6">
          <div class="glass-card p-6" style="background:rgba(15,31,24,0.8)"><div class="text-2xl mb-2">📍</div><h3 class="font-bold mb-1">总部地址</h3><p class="text-sm text-gray-400">深圳市南山区科技园创新大厦28F</p></div>
          <div class="glass-card p-6" style="background:rgba(15,31,24,0.8)"><div class="text-2xl mb-2">📞</div><h3 class="font-bold mb-1">咨询热线</h3><p class="text-sm text-gray-400">400-888-9999</p></div>
          <div class="glass-card p-6" style="background:rgba(15,31,24,0.8)"><div class="text-2xl mb-2">📧</div><h3 class="font-bold mb-1">电子邮箱</h3><p class="text-sm text-gray-400">hello@company.com</p></div>
          <div class="glass-card p-6" style="background:rgba(15,31,24,0.8)"><div class="text-2xl mb-2">🕐</div><h3 class="font-bold mb-1">工作时间</h3><p class="text-sm text-gray-400">周一至周五 09:00-18:00</p></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== Footer（必有的面板） ===== -->
  <footer class="footer">
    <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
      <div>
        <h3 class="text-xl font-black gradient-text mb-4">LOGO</h3>
        <p class="text-sm text-gray-400 leading-relaxed">用专业与创新为企业赋能，持续创造商业价值。</p>
      </div>
      <div>
        <h4 class="font-semibold mb-4">产品服务</h4>
        <div class="space-y-2 text-sm"><div><a href="#">核心产品A</a></div><div><a href="#">数据分析平台</a></div><div><a href="#">安全合规服务</a></div><div><a href="#">战略咨询</a></div></div>
      </div>
      <div>
        <h4 class="font-semibold mb-4">关于我们</h4>
        <div class="space-y-2 text-sm"><div><a href="#">品牌故事</a></div><div><a href="#">专业团队</a></div><div><a href="#">客户心声</a></div><div><a href="#">联系我们</a></div></div>
      </div>
      <div>
        <h4 class="font-semibold mb-4">联系方式</h4>
        <div class="space-y-2 text-sm text-gray-400"><div>📍 深圳南山区科技园</div><div>📞 400-888-9999</div><div>📧 hello@company.com</div></div>
        <div class="flex gap-3 mt-4 text-sm"><a href="#">微</a><a href="#">博</a><a href="#">领</a><a href="#">邮</a></div>
      </div>
    </div>
    <div class="max-w-6xl mx-auto border-t pt-6 text-center text-xs text-gray-400" style="border-color:#1a3a25">
      © 2025 Company Name. All rights reserved. | 粤ICP备XXXXXXXX号 | <a href="#">隐私政策</a> | <a href="#">服务条款</a>
    </div>
  </footer>

  <script>
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    document.addEventListener('DOMContentLoaded', function() {
      // ★ DRY：可重用的 Canvas 粒子工厂函数
      function createParticleCanvas(canvasId, count, color, mode) {
        var c = document.getElementById(canvasId); if (!c) return;
        var ctx = c.getContext('2d');
        function resize() { c.width = window.innerWidth; c.height = window.innerHeight; }
        resize(); window.addEventListener('resize', resize);
        var pts = [];
        if (mode === 'float') {
          for (var i = 0; i < count; i++) pts.push({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*3+1,vx:(Math.random()-0.5)*0.5,vy:(Math.random()-0.5)*0.5,o:Math.random()*0.4+0.15});
        } else if (mode === 'rise') {
          for (var i = 0; i < count; i++) pts.push({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*2+0.5,vy:Math.random()*0.3+0.1,o:Math.random()*0.3+0.1});
        }
        (function draw() {
          ctx.clearRect(0,0,c.width,c.height);
          for (var j = 0; j < pts.length; j++) {
            var p = pts[j];
            if (mode === 'float') { p.x += p.vx; p.y += p.vy; if(p.x<0||p.x>c.width)p.vx*=-1; if(p.y<0||p.y>c.height)p.vy*=-1; }
            else if (mode === 'rise') { p.y -= p.vy; if(p.y < -10) { p.y = c.height + 10; p.x = Math.random() * c.width; } }
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
            ctx.fillStyle = 'rgba(' + color + ',' + p.o + ')'; ctx.fill();
          }
          requestAnimationFrame(draw);
        })();
      }
      createParticleCanvas('heroCanvas', 50, '34,197,94', 'float');
      createParticleCanvas('teamCanvas', 30, '34,197,94', 'rise');
      createParticleCanvas('statsCanvas', 40, '34,197,94', 'float');

      // Hero入场
      var tl = gsap.timeline();
      tl.fromTo('.hero-title',{y:100,opacity:0},{y:0,opacity:1,duration:1,ease:'power3.out'})
        .fromTo('.hero-desc',{y:60,opacity:0},{y:0,opacity:1,duration:0.8,ease:'power3.out'},'-=0.5')
        .fromTo('.btn-primary,.btn-outline',{y:40,opacity:0},{y:0,opacity:1,duration:0.6,stagger:0.15,ease:'power3.out'},'-=0.3');

      // 导航栏滚动
      ScrollTrigger.create({start:100,onUpdate:function(s){document.getElementById('navbar').classList.toggle('scrolled',s.scroll()>100)}});

      // 导航平滑跳转
      document.querySelectorAll('.nav-link').forEach(function(l){l.addEventListener('click',function(e){e.preventDefault();var t=document.querySelector(this.getAttribute('href'));if(t)gsap.to(window,{duration:1.2,scrollTo:{y:t,offsetY:80},ease:'power3.inOut'})})});

      // 面板标题逐组入场
      gsap.utils.toArray('.section-title').forEach(function(t,i){gsap.fromTo(t,{y:80,opacity:0},{y:0,opacity:1,duration:0.8,ease:'power3.out',scrollTrigger:{trigger:t,start:'top 85%',toggleActions:'play none none reverse'}})});

      // 卡片 stagger（所有 glass-card 共用一套逻辑）
      gsap.utils.toArray('.glass-card').forEach(function(c,i){gsap.fromTo(c,{y:100,opacity:0,scale:0.92},{y:0,opacity:1,scale:1,duration:0.7,delay:i*0.08,ease:'power3.out',scrollTrigger:{trigger:c,start:'top 90%',toggleActions:'play none none reverse'}})});

      // 数字递增
      gsap.utils.toArray('.counter-num').forEach(function(el){var t=parseInt(el.dataset.target),o={v:0};gsap.to(o,{v:t,duration:2.5,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 75%',toggleActions:'play none none reverse'},onUpdate:function(){el.textContent=Math.round(o.v).toLocaleString()}})});

      // 表单提交
      document.getElementById('contactForm').addEventListener('submit',function(e){e.preventDefault();var s=document.getElementById('formSuccess');s.classList.remove('hidden');gsap.fromTo(s,{y:-10,opacity:0},{y:0,opacity:1,duration:0.4});setTimeout(function(){s.classList.add('hidden')},3000);this.reset()});

      ScrollTrigger.refresh();
    });
  </script>
</body>
</html>
\`\`\`

**专业要点（基线标准，缺一不可）：**
- ★ 10 个面板：Hero → Story → Products(4列) → Team → Testimonials → FAQ → Stats → Contact → **Footer**
- ★ **Footer 是必须的**（网站地图 + 版权 + ICP备案 + 隐私/条款链接）
- ★ Canvas 粒子用 **DRY 工厂函数**（createParticleCanvas），一个函数支持多种模式，代码不重复
- ★ 至少 3 种差异化面板（Team 人物卡片 / Testimonials 证言 / FAQ 折叠）
- ★ FAQ 用纯 CSS + classList 折叠动画（不用 GSAP 以免过度复杂）
- ★ ScrollToPlugin 平滑导航跳转
- ★ 表单 5 字段 + submit 事件 + GSAP 成功动画
- ★ 数字递增用 GSAP 对象属性驱动
- ★ 联系信息 4 项完整（地址/电话/邮箱/工作时间）
- ★ 导航栏 8 个链接（体现完整网站结构），不是只有 4-5 个
- ★ 移动端 @media 响应式完整覆盖`
  }

  /**
   * 第二 Few-Shot 范例：横向滚动模板（~2K tokens）
   */
  getFewShotExample2(): string {
    return `## Few-Shot 范例二：横向滚动 GSAP 网站

以下是基于真实 demo27 的横向滚动模板结构（与竖版不同风格的布局模式）：

\`\`\`html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>品牌官网 - 横滚</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <style>
    :root { --primary: #6366f1; --accent: #06b6d4; --dark: #0f172a; --text: #e2e8f0; }
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background: var(--dark); color: var(--text); overflow-x: hidden; }
    .horizontal-wrapper { position: relative; height: 100vh; overflow: hidden; }
    .horizontal-container { display: flex; width: fit-content; height: 100vh; }
    .panel { min-width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; }
    .hero-title-xxx, .card-xxx { opacity: 0; visibility: hidden; }
    .gradient-text { background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  </style>
</head>
<body>
  <nav class="navbar fixed top-0 w-full z-50 flex justify-between items-center px-16 py-5 transition-all">LOGO</nav>
  <div class="horizontal-wrapper" id="horizontalWrapper">
    <div class="horizontal-container" id="horizontalContainer">
      <section class="panel" id="hero"><div class="text-center"><h1 class="hero-title-xxx text-7xl font-bold gradient-text">标题</h1><p class="hero-subtitle-xxx text-xl text-gray-400 mt-6">副标题</p></div></section>
      <section class="panel" id="about"><div class="max-w-5xl mx-auto px-20"><h2 class="text-5xl font-bold mb-12">关于</h2><div class="grid grid-cols-2 gap-8"><div class="card-xxx glass-card p-8">...</div></div></div></section>
      <section class="panel" id="services"><div class="max-w-6xl mx-auto px-16"><h2 class="text-5xl font-bold mb-12">服务</h2><div class="grid grid-cols-3 gap-6"><div class="card-xxx glass-card p-6">...</div></div></div></section>
      <section class="panel" id="stats"><div class="max-w-5xl mx-auto px-16"><h2 class="text-5xl font-bold mb-12">数据</h2><div class="grid grid-cols-4 gap-8"><div class="stat-xxx text-center"><div class="text-5xl font-bold">1000</div><p class="text-gray-400 mt-2">用户</p></div></div></div></section>
      <section class="panel" id="contact"><div class="max-w-4xl mx-auto px-16"><h2 class="text-5xl font-bold mb-12">联系</h2>...</div></section>
    </div>
  </div>
  <script>
  gsap.registerPlugin(ScrollTrigger)
  document.addEventListener('DOMContentLoaded', () => {
    const sections = gsap.utils.toArray('.panel')
    const totalWidth = sections.reduce((sum, p) => sum + p.offsetWidth, 0)
    const scrollDist = totalWidth - window.innerWidth
    // 横向滚动主动画
    gsap.to('#horizontalContainer', {
      x: () => -scrollDist, ease: 'none',
      scrollTrigger: { trigger: '#horizontalWrapper', pin: true, scrub: 0.8,
        snap: { snapTo: 1/(sections.length-1), duration:{min:0.2,max:0.4} },
        end: () => '+=' + scrollDist, invalidateOnRefresh: true }
    })
    // Hero 入场
    gsap.fromTo('.hero-title-xxx', { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
    // 面板子元素绑定主横向动画
    const mainST = ScrollTrigger.getAll().find(st => st.vars?.pin === true)
    const containerAnim = mainST ? mainST.animation : null
    gsap.utils.toArray('.card-xxx').forEach((card, i) => {
      gsap.fromTo(card, { y: 80, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, delay: i*0.1, ease: 'power3.out',
        scrollTrigger: { trigger: card, containerAnimation: containerAnim, start: 'left 85%', toggleActions: 'play none none reverse' } })
    })
    ScrollTrigger.refresh()
  })
  </script>
</body></html>
\`\`\`

**横向滚动要点：** 外层 pin:true 固定视口，内层 flex + translateX 滑动；scrollDist=(N-1)×100vw；子元素动画加 containerAnimation 绑定主横向动画`
  }

  /**
   * 真实组件 JS 实现精炼（~3K tokens）
   * 从项目 80+ 运行组件中提取核心 GSAP 模式
   */
  getComponentJSPatterns(): string {
    return `## 真实组件 JS 实现参考（从项目组件库提炼）

### 1. Stagger Cards 交错入场
\`\`\`js
// 每卡独立 fromTo + ScrollTrigger + 卡片内元素多轨道
gsap.utils.toArray('.card-item-xxx').forEach((card, i) => {
  gsap.fromTo(card,
    { y: 150, opacity: 0, scale: 0.5, rotateX: 45 },
    { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 1, delay: i * 0.15, ease: 'back.out(1.7)',
      scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' } }
  )
  const bg = card.querySelector('.card-bg-xxx')
  gsap.fromTo(bg, { scale: 0, rotate: 180 }, { scale: 1, rotate: 0, duration: 1.2,
    scrollTrigger: { trigger: card, start: 'top 80%', end: 'top 30%', scrub: true } })
})
\`\`\`

### 2. Hero 文字分割揭示 (Split Reveal)
\`\`\`js
// 每个字符上半/下半分离，滚动触发合拢
const chars = gsap.utils.toArray('.split-char-xxx')
chars.forEach((char, i) => {
  const top = char.querySelector('.char-top-xxx'); const bottom = char.querySelector('.char-bottom-xxx')
  gsap.set(top, { y: '-100%' }); gsap.set(bottom, { y: '100%' })
  gsap.to(top, { y: '-10%', duration: 0.8, delay: i * 0.05, ease: 'power3.out',
    scrollTrigger: { trigger: '.reveal-section-xxx', start: 'top 60%', end: 'top 20%', scrub: 1 } })
  gsap.to(bottom, { y: '10%', duration: 0.8, delay: i * 0.05, ease: 'power3.out',
    scrollTrigger: { trigger: '.reveal-section-xxx', start: 'top 60%', end: 'top 20%', scrub: 1 } })
})
\`\`\`

### 3. 数字递增 (Number Counter)
\`\`\`js
// innerText 动画 + snap 保证整数 + scrub 跟随滚动
gsap.utils.toArray('.counter-num-xxx').forEach((el, i) => {
  const target = parseInt(el.dataset.target || '100')
  gsap.fromTo(el, { innerText: 0 }, {
    innerText: target, duration: 2.5,
    snap: { innerText: 1 }, // 步进1保证整数
    scrollTrigger: { trigger: '.stats-section-xxx', start: 'top 70%', end: 'top 20%', scrub: 1.5 }
  })
})
// 配合单位后缀：数字放 <span class="counter-num-xxx"> 内，单位放旁边 <span> 万</span>
\`\`\`

### 4. 多层视差 (Parallax Layers)
\`\`\`js
// 每层按 data-speed 不同速度位移
const layers = gsap.utils.toArray('.parallax-layer-xxx')
layers.forEach(layer => {
  const speed = parseFloat(layer.dataset.speed || '0.4')
  gsap.fromTo(layer,
    { y: -100 * speed }, { y: 100 * speed },
    { scrollTrigger: { trigger: '.parallax-section-xxx', start: 'top bottom', end: 'bottom top', scrub: true }, ease: 'none' }
  )
})
// HTML: <div class="parallax-layer-xxx" data-speed="0.2">背景层</div>
//       <div class="parallax-layer-xxx" data-speed="0.8">前景层</div>
\`\`\`

### 5. 卡片 Hover 3D 倾斜
\`\`\`js
document.querySelectorAll('.card-3d-xxx').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    gsap.to(card, { rotateX: y * -10, rotateY: x * 10, duration: 0.4, ease: 'power2.out' })
  })
  card.addEventListener('mouseleave', () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.4 }))
})
\`\`\`

### 6. 导航平滑跳转
\`\`\`js
document.querySelectorAll('.nav-link-xxx').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault()
    const target = document.querySelector(link.getAttribute('href'))
    gsap.to(window, { duration: 1.5, scrollTo: { y: target, offsetY: 80 }, ease: 'power3.inOut' })
  })
})
// CDN 需引入 ScrollToPlugin: <script src="...gsap/ScrollToPlugin.min.js"></script>
\`\`\`

### 7. 组件卸载清理（重要）
\`\`\`js
// 页面跳转或销毁时清理
ScrollTrigger.getAll().forEach(st => st.kill())
gsap.killTweensOf('*')
\`\`\``
  }

  /**
   * 生成质量自检清单（注入 system prompt，让 AI 自我审查）
   */
  getQualityChecklist(): string {
    return `## 质量自检清单（输出代码前必须逐项确认，遗漏任一项即为不专业）

### 结构完整性
- [ ] 以 \`<!DOCTYPE html>\` 开头
- [ ] \`<head>\` 包含 GSAP 3.12.5 + ScrollTrigger + **ScrollToPlugin** + Tailwind CDN 四个标签
- [ ] 无任何 \`// ... 省略 ...\` 或占位符
- [ ] 无 HTML 标签闭合错误（如 \`</   div>\`）
- [ ] 所有 \`<img>\` 标签有 \`alt\` 属性

### GSAP 动画规范
- [ ] 第一行 JS: \`gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)\`
- [ ] Hero 入场动画在 \`DOMContentLoaded\` 中立即执行（不用 ScrollTrigger）
- [ ] 后续面板用 ScrollTrigger + \`toggleActions: 'play none none reverse'\`
- [ ] 所有动画用 \`gsap.fromTo\` 精确控制起止状态
- [ ] 最后调用 \`ScrollTrigger.refresh()\`

### 导航与交互（专业级必须，缺一不可）
- [ ] 所有导航链接有 click 事件，用 \`gsap.to(window, {scrollTo:...})\` 实现平滑跳转
- [ ] 导航栏至少 7 个链接（体现完整网站结构，不是只 4-5 个）
- [ ] 至少 2 个 CTA 按钮有实际 click 行为（滚动到目标面板）
- [ ] Hero 面板有向下滚动指示器（箭头图标 + bounce 动画）
- [ ] 每个 \`.glass-card\` 有 hover 微交互（translateY + box-shadow + border-color）

### 面板完整度（专业标准，缺一不可）
- [ ] **Hero**：品牌标语 + Canvas粒子 + 2 CTA + 滚动指示器 ✓
- [ ] **About/Story**：左右分栏（大图+文字+3个小卡片）✓
- [ ] **Product/Service**：4 个卡片（不是 3 个），各有图标+标题+描述+链接 ✓
- [ ] **至少 1 个差异化面板**：Team人物 / Testimonials证言 / FAQ折叠（选2个以上更好）✓
- [ ] **Stats**：4 个数字 + 递增动画 ✓
- [ ] **Contact**：5 字段表单 + 4 项联系信息（地址/电话/邮箱/时间）✓
- [ ] ★ **Footer**：4列站点地图 + 版权©️年份 + ICP备案号 + 隐私/条款链接 ✓（必须！）
- [ ] 面板顺序有逻辑叙事线：品牌引入 → 价值展示 → 信任建立 → 行动号召

### 面板设计规范（高质量标准）
- [ ] 至少 7 个 \`<section class="panel">\` 全屏面板（含 Footer 至少 8 个区块）
- [ ] 每个面板有独立渐变背景区分章节
- [ ] 每个面板标题用 \`<h2>\` 包装，英文用 \`text-sm uppercase tracking-wider\` 作为 subtitle
- [ ] ★ 至少 3 种不同面板布局（居中/左右/网格/图文卡片/表单双栏/FAQ折叠 — 不能全部相同）

### 视觉质量
- [ ] CSS 变量严格从上方的11套风格模板中选择，不自定义随意配色
- [ ] ★ Hero 有 Canvas 粒子背景（50个粒子 + requestAnimationFrame 循环）— 不能是空div
- [ ] ★ Canvas 粒子用 DRY 工厂函数（一个函数参数化 canvasId/color/mode），不重复粘贴相同代码
- [ ] 有玻璃拟态卡片: \`background: var(--card-bg); backdrop-filter: blur(10px); border-radius: 16px;\`
- [ ] 至少一处渐变文字标题: \`background: linear-gradient(); -webkit-background-clip: text;\`
- [ ] 导航栏固定定位 + ScrollTrigger 控制 scrolled 状态

### 代码质量（专业标准）
- [ ] 重复元素（粒子/社交图标/风格统一的卡片）用 JS 循环动态生成，禁止 HTML 硬编码 >3 个相同结构
- [ ] 相同的 SVG 图标不重复内联——定义一次或抽成函数重用
- [ ] Canvas 粒子代码不重复——用一个参数化函数搞定所有 Canvas
- [ ] 不使用 \`...\` 或 \`// 省略\` 等占位符
- [ ] 无死链接——所有 href 用 \`#\` 或合理的锚点且有对应的事件处理

### 表单与功能
- [ ] Contact 面板有完整表单（5个字段：姓名/手机/邮箱/主题/留言 + 提交按钮）
- [ ] 表单有 submit 事件处理（e.preventDefault + 成功提示 GSAP 动画）
- [ ] 表单输入框有 focus 高亮样式（border-color + box-shadow）
- [ ] Contact 面板有联系信息（地址/电话/邮箱/工作时间 4 项）

### 响应式
- [ ] \`@media (max-width: 768px)\` 适配移动端
- [ ] 移动端面板内边距缩小，字号缩小，网格列数减少

=== 数据分析自检（统计数字） ===
- [ ] 全文 >= 700 行代码（CSS约100行 + HTML约400行 + JS约150行 + 内容约50行）
- [ ] 中文内容 >= 600 字（不含代码注释）
- [ ] 至少 6 张 Unsplash 图片，风格统一、色调协调
- [ ] 至少 10 个交互元素（按钮+链接 >= 10 个）
- [ ] Footer 完整（4列链接 + 版权 + ICP + 隐私/条款）`
  }

  /**
   * 设计风格知识库（~4K tokens）
   * 注入专业设计方法论，让 AI 按品牌人格自动匹配风格模板
   */
  getDesignStyleKB(): string {
    return `## 专业设计风格知识库

### 配色科学铁则
1. **60-30-10 法则**：60% 主背景色、30% 辅助色、10% 强调色
2. **HSL 调色**：用 HSL 色彩空间，H(色相) 换颜色，S(饱和度) 控鲜艳度，L(明度) 控亮度
3. **对比度**：文字与背景 >= 4.5:1，大标题 >= 3:1
4. **色相环**：邻近色(±30°)和谐、互补色(±180°)冲击、三角色(±120°)丰富

---

### 11套专业设计风格模板
根据用户品牌/行业匹配最合适的风格，用 CSS 变量实现。

#### 1. 高端黑金（金融/奢侈/企业官网）
\`\`\`css
:root {
  --bg-primary: #0a0a0a;       --bg-secondary: #111111;
  --accent-primary: #d4a853;   --accent-secondary: #b8960c;
  --text-primary: #f5f0e8;     --text-secondary: #a89878;
  --card-bg: rgba(212,168,83,0.04); --card-border: rgba(212,168,83,0.12);
  --gradient-hero: linear-gradient(135deg, #0a0a0a 0%, #1a1410 50%, #0a0a0a 100%);
}
\`\`\`
特征：金属光泽、暗场底、金线分隔、极简排版、留白大方

#### 2. 赛博紫电（游戏/科技/Web3/区块链）
\`\`\`css
:root {
  --bg-primary: #050510;       --bg-secondary: #0a0a1a;
  --accent-primary: #a855f7;   --accent-secondary: #06b6d4;
  --text-primary: #e8e0ff;     --text-secondary: #9484c8;
  --card-bg: rgba(168,85,247,0.05); --card-border: rgba(168,85,247,0.15);
  --gradient-hero: linear-gradient(135deg, #050510 0%, #0d0d2b 50%, #050510 100%);
}
\`\`\`
特征：霓虹发光、深色炫彩、电光描边、渐变文字紫→蓝

#### 3. 清爽科技蓝（SaaS/企业服务/云平台）
\`\`\`css
:root {
  --bg-primary: #0f172a;       --bg-secondary: #1e293b;
  --accent-primary: #3b82f6;   --accent-secondary: #06b6d4;
  --text-primary: #f1f5f9;     --text-secondary: #94a3b8;
  --card-bg: rgba(59,130,246,0.06); --card-border: rgba(59,130,246,0.1);
  --gradient-hero: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
}
\`\`\`
特征：极简主义、大留白、几何图表、数据可视化感

#### 4. 自然有机绿（环保/农业/健康/教育）
\`\`\`css
:root {
  --bg-primary: #0a1410;       --bg-secondary: #0f1f18;
  --accent-primary: #22c55e;   --accent-secondary: #a3e635;
  --text-primary: #e8f5e9;     --text-secondary: #81a889;
  --card-bg: rgba(34,197,94,0.05); --card-border: rgba(34,197,94,0.1);
  --gradient-hero: linear-gradient(135deg, #0a1410 0%, #0d1f16 50%, #0a1410 100%);
}
\`\`\`
特征：柔和自然、圆角设计、有机曲线、大量留白

#### 5. 极简白灰（设计/创意/作品集）
\`\`\`css
:root {
  --bg-primary: #ffffff;       --bg-secondary: #f8fafc;
  --accent-primary: #0f172a;   --accent-secondary: #6366f1;
  --text-primary: #1e293b;     --text-secondary: #64748b;
  --card-bg: rgba(15,23,42,0.03); --card-border: rgba(15,23,42,0.06);
  --gradient-hero: linear-gradient(135deg, #ffffff 0%, #f1f5f9 50%, #ffffff 100%);
}
\`\`\`
特征：日式侘寂美学、不对称布局、大量负空间、点缀色极克制

#### 6. 温暖日落橙（电商/消费品牌/餐饮/社交）
\`\`\`css
:root {
  --bg-primary: #1c1917;       --bg-secondary: #292524;
  --accent-primary: #f97316;   --accent-secondary: #fbbf24;
  --text-primary: #fef3c7;     --text-secondary: #b8a68e;
  --card-bg: rgba(249,115,22,0.06); --card-border: rgba(249,115,22,0.12);
  --gradient-hero: linear-gradient(135deg, #1c1917 0%, #2d2010 50%, #1c1917 100%);
}
\`\`\`
特征：温暖亲切、圆润卡片、大图+文字叠加、CTA 明亮突出

#### 7. 动感渐变多色（创意/娱乐/音乐/活动）
\`\`\`css
:root {
  --bg-primary: #0f0f1a;       --bg-secondary: #1a1a2e;
  --accent-primary: #ec4899;   --accent-secondary: #8b5cf6;
  --accent-tertiary: #06b6d4;
  --text-primary: #f5f3ff;     --text-secondary: #b4a8d4;
  --card-bg: rgba(236,72,153,0.05); --card-border: rgba(236,72,153,0.12);
  --gradient-hero: linear-gradient(135deg, #0f0f1a 0%, #1a0f2e 30%, #0f1a2e 60%, #0f0f1a 100%);
}
\`\`\`
特征：丰富渐变、色彩碰撞、动态图案背景、霓虹描边

#### 8. 纯净白 + 渐变点缀（医疗/美容/金融科技）
\`\`\`css
:root {
  --bg-primary: #ffffff;       --bg-secondary: #f0f4ff;
  --accent-primary: #6366f1;   --accent-secondary: #a78bfa;
  --text-primary: #1e293b;     --text-secondary: #64748b;
  --card-bg: rgba(99,102,241,0.04); --card-border: rgba(99,102,241,0.08);
  --gradient-hero: linear-gradient(135deg, #ffffff 0%, #eef2ff 40%, #f5f3ff 100%);
}
\`\`\`
特征：干净清新、柔和渐变色块、悬浮阴影、圆角统一12-16px

#### 9. 暖白活力（宠物/母婴/生活服务/家庭品牌）
\`\`\`css
:root {
  --bg-primary: #fef9f0;       --bg-secondary: #fff5e6;
  --accent-primary: #f59e0b;   --accent-secondary: #f97316;
  --text-primary: #1e293b;     --text-secondary: #64748b;
  --card-bg: rgba(255,255,255,0.85); --card-border: rgba(245,158,11,0.15);
  --gradient-hero: linear-gradient(135deg, #fef9f0 0%, #ffedd5 50%, #fef9f0 100%);
}
\`\`\`
特征：明亮暖白底色、琥珀橙点缀、圆润卡片、温馨亲切、大图温暖色调

#### 10. 北欧浅灰（极简/建筑/家具/高端设计工作室）
\`\`\`css
:root {
  --bg-primary: #f5f2ed;       --bg-secondary: #ede8e0;
  --accent-primary: #2d2d2d;   --accent-secondary: #8b7355;
  --text-primary: #1a1a1a;     --text-secondary: #6b6b6b;
  --card-bg: rgba(255,255,255,0.6); --card-border: rgba(0,0,0,0.06);
  --gradient-hero: linear-gradient(135deg, #f5f2ed 0%, #e8e2d8 50%, #f5f2ed 100%);
}
\`\`\`
特征：高级灰米色调、克制留白、木纹质感、建筑感排版、无多余装饰

#### 11. 渐变活力多彩（运动/健身/潮流品牌/年轻人社区）
\`\`\`css
:root {
  --bg-primary: #ffffff;       --bg-secondary: #faf5ff;
  --accent-primary: #ec4899;   --accent-secondary: #8b5cf6;
  --accent-tertiary: #f59e0b;
  --text-primary: #1e293b;     --text-secondary: #64748b;
  --card-bg: rgba(255,255,255,0.9); --card-border: rgba(236,72,153,0.12);
  --gradient-hero: linear-gradient(135deg, #ffffff 0%, #fdf2f8 30%, #f5f3ff 60%, #ffffff 100%);
}
\`\`\`
特征：白底多彩、粉紫渐变点缀、大胆色块碰撞、圆角Card、高饱和度CTA

---

### 风格匹配指南

| 关键词 | 推荐 | 备选 |
|---|---|---|
| 高端/奢侈/金融/企业/总裁 | ①黑金 | ⑤极简白灰 |
| 游戏/科技/Web3/区块链/AI | ②赛博紫电 | ③清爽科技蓝 |
| SaaS/API/云/企业服务 | ③清爽科技蓝 | ⑧白底渐变 |
| 环保/自然/健康/农业 | ④自然有机绿 | ⑥温暖日落 |
| 设计/创意/作品集/个人 | ⑤极简白灰 | ⑩北欧浅灰 |
| 电商/消费/餐饮/社媒 | ⑥温暖日落 | ⑨暖白活力 |
| 音乐/活动/娱乐/节日 | ⑦动感渐变 | ⑪渐变活力 |
| 医疗/美容/教育/金融科技 | ⑧白底渐变 | ③清爽科技蓝 |
| 宠物/母婴/生活服务/家庭 | ⑨暖白活力 | ⑤极简白灰 |
| 建筑/家具/高端设计/极简 | ⑩北欧浅灰 | ⑤极简白灰 |
| 运动/健身/潮流/年轻人品牌 | ⑪渐变活力 | ⑦动感渐变 |

---

### 排版层级规范
\`\`\`
H1(Hero):  56-88px / fw700-900 / ls-1px
H2(面板):  36-52px / fw600-700 / ls-0.5px
H3(卡片):  20-28px / fw600
Body:      16-18px / lh1.7
Caption:   13-14px / opacity0.6 / uppercase / ls1px
\`\`\`

### 间距系统（8pt grid）
margin: 8/16/24/32/48/64/96
padding: 16/20/24/32 (卡片) / 64/80/120 (面板)

### 动画节奏
Hero:0.8-1.2s / Stagger:0.08-0.15s / Scrub:1.2-2.0s / Hover:<220ms / 面板:1.2-2.4s / 微动:4-12s

### 卡片设计
\`\`\`css
.card-glass {
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--card-border);
  border-radius: 16px;
}
.card-glass:hover {
  border-color: var(--accent-primary);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}
.text-gradient {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
\`\`\``
  }

  /**
   * 内容密度标准（~3K tokens）
   * 强制每个面板类型的最小子元素数量，解决"内容不够丰富"的问题
   * 每个面板必须包含的具体元素类型和数量，不可偷懒
   */
  getContentDensityStandard(): string {
    return `## 设计质量原则（替代数量清单，追求品质而非凑数）

### 设计核心理念
数量达标≠质量好。以下原则指导你做出"看起来值 5 万块"而非"看起来像模板"的设计。

### 1. 面板叙事节奏
- 每个网站有明确的叙事线：品牌引入 → 价值展示 → 信任建立 → 行动号召
- 4-8 个面板，不需要凑满 7 个——5 个高质量面板 > 7 个凑数面板
- 相邻面板必须有设计节奏变化：深/浅、密/疏、图文/纯文字、网格/自由布局
- ★ 必须有至少 1 个"差异化面板"——不是 About/Service/Stats 老三样，而是品牌特有的内容类型

### 2. Hero 面板质量标准
- 标题 + 副标题 + 品牌主视觉（图片/插画/品牌符号）三者缺一不可
- CTA 按钮 1-2 个，主次分明
- 背景装饰用 Canvas 或 JS 动画循环（粒子/光晕/几何图形），不用 \<div\> 堆砌
- 有向下滚动引导元素
- ★ Hero 必须让用户在 3 秒内理解这个网站是做什么的

### 3. 卡片设计标准
- 特性/服务卡片 3-6 个（按实际内容需要，不强制 4 或 6）
- 每个卡片：图标 + 标题 + 1-2 句描述 + 可选的链接
- 卡片有 hover 微交互（上浮 + 阴影/边框变色）
- ★ 同一面板的卡片风格统一但内容有层次（如 3 个核心服务 + 1 个特色服务 = 4 张卡片就用不同大小）

### 4. 图片使用标准
- 案例/产品面板必须有真实场景图片（Unsplash URL）
- 人物面板用统一风格的头像（同一 Unsplash 摄影师系列）
- ★ 图片色调与网站配色协调（暖色网站选暖色调图片，冷色网站选冷色调图片）
- 不强制 4 张——有 3 张好图就放 3 张

### 5. 数据/信任面板标准
- 统计数据 3-4 个（有意义的数字，不编造荒谬数据）
- 数字递增动画
- 客户标识/合作伙伴 logo 行（如有）
- 真实感 > 数字大

### 6. 联系表单标准
- 4-5 个字段（姓名/邮箱/主题/消息 + 提交按钮）
- 联系信息（地址/电话/邮箱/工作时间）
- 社交图标 4 个（不要每组重复内联 SVG，用 JS 循环生成或定义模板函数）
- 表单输入框有 focus 高亮样式

---

### 通用质量规则
1. **文字真实感**：用中文写有业务场景感的文字，不要空洞套话
2. **图片风格统一**：同一网站选同一 Unsplash 摄影师/主题的图片
3. **图标不重复硬编码**：相同图标用 JS 循环或函数生成
4. **布局有变化**：不要让所有面板都是"标题+4列网格卡片"——至少 2 种不同布局模式
5. **每个面板至少 1 个交互元素**（按钮/链接/hover 效果）
6. **全文 >= 500 字中文内容**

### 面板数量建议
- 最少 4 个，最多 8 个，推荐 5-6 个精炼面板
- 根据行业灵活组合，不强制固定模板`
  }

  /**
   * 配置AI服务
   */
  configure(config: AIConfig) {
    this.config = config

    // 设置基础URL
    let baseUrl = ''
    switch (config.provider) {
      case 'qwen':
        // 开发环境使用代理，生产环境使用直连
        // 通义千问兼容OpenAI格式的API端点
        baseUrl = config.baseUrl ||
          (import.meta.env.DEV ? '/ai-proxy' : 'https://dashscope.aliyuncs.com/compatible-mode/v1')
        break
      case 'deepseek':
        baseUrl = config.baseUrl || 'https://api.deepseek.com/v1'
        break
      case 'openai':
        baseUrl = config.baseUrl || 'https://api.openai.com/v1'
        break
      case 'custom':
        baseUrl = config.baseUrl || ''
        break
    }

    console.log('🔧 配置AI服务:', {
      provider: config.provider,
      baseUrl,
      isDev: import.meta.env.DEV,
      usingProxy: baseUrl.includes('/ai-proxy'),
      fullUrl: import.meta.env.DEV ? `http://localhost:5173${baseUrl}/chat/completions` : `${baseUrl}/chat/completions`
    })

    this.client.defaults.baseURL = baseUrl

    // 设置认证头
    this.client.interceptors.request.use((request) => {
      if (this.config?.apiKey) {
        request.headers.Authorization = `Bearer ${this.config.apiKey}`
      }
      return request
    })
  }

  // ==================== 知识库管理 ====================

  /**
   * 初始化组件知识库 (懒加载)
   * 首次调用时扫描全部组件，后续使用缓存
   */
  async initKnowledgeBase(forceRefresh = false): Promise<ComponentKnowledge[]> {
    if (this.knowledgeBase && !forceRefresh) {
      return this.knowledgeBase
    }

    // 防止并发重复加载
    if (this.knowledgeBasePromise) {
      return this.knowledgeBasePromise
    }

    this.knowledgeBasePromise = buildComponentKnowledgeBase({ forceRefresh })
    this.knowledgeBase = await this.knowledgeBasePromise
    this.knowledgeBasePromise = null

    console.log(
      '\uD83D\uDCDA 知识库就绪: ' + this.knowledgeBase.length + ' 个组件, ' +
      '约 ' + estimateTokens(this.knowledgeBase) + ' tokens'
    )
    return this.knowledgeBase
  }

  /**
   * 获取知识库（如果未初始化则返回 null）
   */
  getKnowledgeBase(): ComponentKnowledge[] | null {
    return this.knowledgeBase
  }

  /**
   * 构建动态系统提示词（基于完整组件知识库）
   * 替代原有硬编码的 buildSystemPrompt()
   */
  private async buildDynamicSystemPrompt(): Promise<string> {
    const kb = await this.initKnowledgeBase()
    const componentCatalog = formatKnowledgeForAI(kb)

    return `你是专业的企业网站动画组件推荐与代码生成专家。

## 可用组件库 (${kb.length} 个 GSAP 动画组件)

以下是完整的组件库，每个组件标注了名称、概要、视觉风格、适用场景、技术栈和复杂度：

${componentCatalog}

## 类别说明
- card-image: 震撼图片特效，高强度视觉冲击，适用于 Hero/产品展示/画廊
- card-img: 图片过渡变换滤镜特效，适用于产品/背景/卡片
- card-text: 文字动画特效，适用于标题/CTA/导航/数据展示
- card-3d: 3D 立体效果，适用于产品3D展示/技术架构
- card-time: 时间轴组件，适用于品牌故事/发展历程
- card-list: 通用多功能卡片列表，适用于特性/服务/案例/团队
- card-base: 基础滚动动画组件，适用于 Hero/特性区/统计/CTA
- card-other: 特殊工具与创意交互组件

## 组件选择原则

### 根据预算选择组件数量
- 紧张预算（1-3万）：每模块选择3-5个核心组件
- 适中预算（3-8万）：每模块选择5-8个组件
- 充裕预算（8-15万）：每模块选择8-12个组件
- 不限预算（15万+）：每模块可以选择12-20个组件

### 根据性能优先级调整
- 视觉效果优先：多使用 Canvas/WebGL/3D/粒子等高级特效组件（🔴高复杂度）
- 平衡模式：混合使用基础和中级组件（🟡中复杂度）
- 加载速度优先：优先选择纯CSS动画和轻量级组件（🟢低复杂度）

### 根据情感氛围调整动画参数
- 专业可靠：稳重动画，easeInOut，速度中等
- 友好亲和：柔和动画，easeOut，速度稍慢
- 创新前沿：创新动画效果，可包含实验性组件
- 优雅精致：流畅细腻动画，注重细节
- 活力动感：快速动画，弹跳效果
- 平静舒缓：缓慢流畅动画，避免突兀
- 活泼有趣：playful 动画，互动性强
- 严肃权威：庄重动画，避免花哨

### 模块组件推荐指南
1. 首页Hero: 必须视觉冲击力强（card-image/* 或 card-img/* + card-text/* 标题）
2. 产品展示: 优先3D和特效组件（card-3d/*, card-image/*）
3. 技术优势: 科技感和结构化组件（card-base/tech 风格 + card-list/*）
4. 案例展示: 动态吸引眼球的组件（card-image/gallery 场景）
5. 关于我们: 温和有深度的组件（card-time/*, card-list/team 场景）
6. 联系我们: 交互性强的组件（card-text/cta 场景）
7. 新闻动态: 内容丰富易浏览（card-list/news 场景）
8. 合作伙伴: 规整大气的组件（card-list/partner 场景）

## 避免重复
- 同一方案中避免多次使用相同组件
- 每个模块至少包含2-3个不同类别的组件
- 同一视觉风格的组件不要全部堆在同一页

## 配色指南
- 科技感: 霓虹色(#00FFFF, #FF00FF)、深色背景
- 自然生态: 绿色系(#2E8B57)、蓝色系(#87CEEB)
- 高端奢华: 金色(#FFD700)、银色(#C0C0C0)、黑色背景
- 简约现代: 黑白灰、留白、几何形状
- 创意艺术: 多彩(#FF6B6B, #4ECDC4)、抽象

## 方案类型
1. 方案A - 视觉冲击版：使用高复杂度组件，性能评级3-4星
2. 方案B - 平衡优化版（推荐）：混合中复杂度组件，性能评级4星
3. 方案C - 快速交付版：轻量级低复杂度组件，性能评级5星

请根据用户需求，从上述完整组件库中智能选择最合适的组件组合。`
  }

  /**
   * 发送聊天消息
   */
  async chat(params: AIRequestParams): Promise<AIResponse> {
    if (!this.config) {
      return {
        success: false,
        error: 'AI服务未配置，请先调用configure()方法'
      }
    }

    console.log('🔧 AI服务配置:', {
      provider: this.config.provider,
      model: this.config.model || this.getDefaultModel(),
      baseUrl: this.client.defaults.baseURL,
      hasApiKey: !!this.config.apiKey
    })

    try {
      const model = params.model || this.config.model || this.getDefaultModel()

      console.log('📤 发送AI请求...')
      console.log('模型:', model)
      console.log('消息数量:', params.messages.length)
      console.log('Temperature:', params.temperature || 0.7)
      console.log('Max Tokens:', params.maxTokens || 2000)

      const payload: Record<string, any> = {
        model,
        messages: params.messages,
        temperature: params.temperature || 0.7,
        max_tokens: params.maxTokens || 2000,
        stream: params.stream || false
      }
      if (params.responseFormat) {
        payload.response_format = params.responseFormat
      }

      const response = await this.client.post('/chat/completions', payload, {
        timeout: params.timeout || 300000 // 支持单次请求自定义超时
      })

      console.log('📥 收到AI响应')
      console.log('响应状态:', response.status)
      console.log('Token使用:', response.data.usage)

      return {
        success: true,
        data: response.data.choices[0]?.message,
        usage: response.data.usage
      }
    } catch (error: any) {
      console.error('❌ AI聊天请求失败:')
      console.error('错误类型:', error.constructor.name)
      console.error('错误消息:', error.message)
      if (error.response) {
        console.error('HTTP状态:', error.response.status)
        console.error('响应数据:', error.response.data)
      }
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message || '请求失败'
      }
    }
  }

  /**
   * 流式聊天（SSE Streaming）
   * 使用 fetch + ReadableStream 实现逐 token 推送
   */
  async chatStream(
    params: AIRequestParams,
    onChunk: (chunk: { content: string; finishReason?: string }) => void
  ): Promise<AIResponse> {
    if (!this.config) {
      return { success: false, error: 'AI服务未配置，请先调用configure()方法' }
    }

    const model = params.model || this.config.model || this.getDefaultModel()
    const baseUrl = this.client.defaults.baseURL || 'https://api.deepseek.com/v1'
    const url = baseUrl.endsWith('/') ? `${baseUrl}chat/completions` : `${baseUrl}/chat/completions`

    console.log('🌊 流式请求:', { model, baseUrl })

    try {
      const bodyPayload: Record<string, any> = {
        model,
        messages: params.messages,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 2000,
        stream: true
      }
      if (params.responseFormat) {
        bodyPayload.response_format = params.responseFormat
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify(bodyPayload),
        signal: AbortSignal.timeout(params.timeout || 600000)
      })

      if (!response.ok) {
        const errText = await response.text()
        console.error('❌ 流式请求失败:', response.status, errText)
        return { success: false, error: `HTTP ${response.status}: ${errText.substring(0, 200)}` }
      }

      const reader = response.body?.getReader()
      if (!reader) {
        return { success: false, error: '无法读取响应流' }
      }

      const decoder = new TextDecoder()
      let fullContent = ''
      let finishReason = ''
      let promptTokens = 0
      let completionTokens = 0

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value, { stream: true })
        const lines = text.split('\n').filter(line => line.startsWith('data: '))

        for (const line of lines) {
          const data = line.slice(6).trim()
          if (data === '[DONE]') break

          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices?.[0]?.delta
            if (delta?.content) {
              fullContent += delta.content
              onChunk({ content: delta.content })
            }
            if (parsed.choices?.[0]?.finish_reason) {
              finishReason = parsed.choices[0].finish_reason
            }
            if (parsed.usage) {
              promptTokens = parsed.usage.prompt_tokens || 0
              completionTokens = parsed.usage.completion_tokens || 0
            }
          } catch { /* 跳过解析失败的行 */ }
        }
      }

      console.log('\u2705 流式完成: ' + fullContent.length + ' 字符, 结束原因: ' + (finishReason || 'N/A'))

      return {
        success: true,
        data: {
          role: 'assistant',
          content: fullContent
        },
        usage: {
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens
        }
      }
    } catch (error: any) {
      if (error.name === 'TimeoutError' || error.name === 'AbortError') {
        return { success: false, error: '请求超时' }
      }
      console.error('❌ 流式请求异常:', error.message)
      return { success: false, error: error.message || '流式请求失败' }
    }
  }

  /**
   * 生成网站方案 (V2.0 - 使用动态知识库)
   */
  async generateSolution(request: SolutionGenerationRequest): Promise<SolutionGenerationResponse> {
    console.log('\n🎯 ========== 开始生成网站方案 (V2.0 动态知识库) ==========')
    console.log('用户需求:', request)

    const systemPrompt = await this.buildDynamicSystemPrompt()
    const userPrompt = this.buildUserPrompt(request)

    console.log('\n📝 系统提示词长度:', systemPrompt.length, '字符')
    console.log('📝 用户提示词长度:', userPrompt.length, '字符')

    const response = await this.chat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      maxTokens: 8000  // V2.0: 从 4000 提升到 8000，有完整知识库后需要更多输出空间
    })

    if (!response.success || !response.data) {
      console.error('❌ AI响应失败:', response.error)
      throw new Error(response.error || '方案生成失败')
    }

    console.log('\n✅ AI返回成功')
    console.log('响应内容长度:', response.data.content?.length || 0, '字符')

    // 解析AI返回的JSON
    try {
      const content = response.data.content
      console.log('\n🔍 开始解析AI响应...')

      // 尝试提取JSON（AI可能返回markdown格式）
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      const jsonStr = jsonMatch ? jsonMatch[0] : content

      console.log('提取的JSON字符串长度:', jsonStr.length, '字符')

      const parsed = JSON.parse(jsonStr)

      console.log('✅ JSON解析成功')
      console.log('方案数量:', parsed.solutions?.length || 0)
      console.log('分析内容:', parsed.analysis?.substring(0, 100) + '...')

      return {
        solutions: parsed.solutions || [],
        analysis: parsed.analysis || '',
        recommendations: parsed.recommendations || []
      }
    } catch (error) {
      console.error('❌ 解析AI响应失败:', error)
      console.error('原始响应内容:', response.data.content?.substring(0, 500))
      // 如果解析失败，返回模拟数据
      console.log('⚠️ 使用降级方案（本地模拟数据）')
      return this.getFallbackSolution(request)
    }
  }

  /**
   * 构建系统提示词 (V2.0 委托给动态版本)
   * @deprecated 使用 buildDynamicSystemPrompt() 替代
   */
  private buildSystemPrompt(): string {
    // 保留向后兼容，实际调用由 generateSolution 中的动态版本处理
    return `你是专业的企业网站设计方案生成器，基于动态组件知识库。
请根据用户需求生成3套不同风格的网站设计方案。
严格按JSON格式输出，包含 analysis, recommendations, solutions 字段。`
  }

  /**
   * 构建用户提示词
   */
  private buildUserPrompt(request: SolutionGenerationRequest): string {
    const moduleNames = this.getModuleNames(request.selectedModules)
    const emotionNames = request.emotions.map(e => this.getEmotionName(e)).filter(Boolean)

    return `请为以下企业网站生成3套设计方案：

## 基本信息
- **网站类型**: ${this.getWebsiteTypeName(request.websiteType)}
- **所属行业**: ${this.getIndustryName(request.industry)}
- **公司名称**: ${request.companyName || '未指定'}
- **核心业务**: ${request.businessDesc}
- **目标用户**: ${request.targetAudience || '未指定'}
- **品牌关键词**: ${request.brandKeywords || '未指定'}

## 设计偏好
- **视觉风格**: ${this.getStyleName(request.visualStyle)}
- **情感氛围**: ${emotionNames.length > 0 ? emotionNames.join('、') : '未指定'}
- **功能模块**: ${moduleNames.join('、')}
- **重点模块**: ${request.priorityModule ? this.getModuleName(request.priorityModule) + '（需要更炫酷的效果）' : '无特别要求'}
- **目标设备**: ${this.getDeviceName(request.targetDevice)}
- **预算范围**: ${this.getBudgetName(request.budget)}
- **开发周期**: ${this.getTimelineName(request.timeline)}
- **性能优先级**: ${this.getPerformancePriorityLabel(request.performancePriority)}

## 特殊要求
${request.specialRequirements || '无特殊要求'}

## 方案生成要求

请根据以上信息生成3套方案：

1. **方案A - 视觉冲击版**（炫酷效果）
   - 适合预算充裕、追求视觉效果的项目
   - 使用更多高级动画组件（WebGL、3D、粒子等）
   - 性能评级：3-4星

2. **方案B - 平衡优化版**（推荐）
   - 平衡效果和性能，适合大多数情况
   - 混合使用基础和中级组件
   - 性能评级：4星

3. **方案C - 快速交付版**（高效）
   - 轻量级组件，快速开发和部署
   - 优先选择纯CSS动画
   - 性能评级：5星

### 重要考虑因素：

1. **预算适配**：根据预算范围调整每个模块的组件数量
   - 紧张预算：每模块3-5个组件
   - 适中预算：每模块5-8个组件
   - 充裕预算：每模块8-12个组件
   - 不限预算：每模块12-20个组件

2. **性能优先级**：
   - 如果priority=1（视觉优先）：多使用高级特效组件
   - 如果priority=2（平衡）：混合使用各类组件
   - 如果priority=3（速度优先）：优先轻量级组件

3. **情感氛围**：根据选择的情感特质调整动画风格
   - 例如：选择"活力动感"可以使用更快的动画和弹跳效果
   - 例如：选择"平静舒缓"应该使用缓慢流畅的动画

4. **重点模块**：如果指定了priorityModule，该模块应该获得更多视觉投入

5. **品牌关键词**：配色方案应该反映品牌关键词
   - 例如："创新"可以加入亮蓝色或紫色
   - 例如："温暖"可以加入橙色或黄色

每套方案需要包含：
- 方案概述和推荐理由
- 每个选中模块的具体组件推荐（注意组件数量要符合预算）
- 配色方案建议（结合品牌关键词）
- 性能评级和预估工时`
  }

  // ==================== V2.0 新功能 ====================

  /**
   * V2.0: 智能组件推荐
   * 根据自然语言场景描述，从完整知识库中推荐最合适的组件
   */
  async recommendComponentsForScene(
    request: ComponentRecommendationRequest
  ): Promise<ComponentRecommendationResponse> {
    console.log('\n🔍 ========== 智能组件推荐 (V2.0) ==========')
    console.log('场景描述:', request.sceneDescription)

    const kb = await this.initKnowledgeBase()
    const componentCatalog = formatKnowledgeForAI(kb)

    const systemPrompt = `你是GSAP动画组件推荐专家。基于以下完整的组件知识库，为用户的需求推荐最合适的组件。

${componentCatalog}

## 推荐规则
- 根据场景描述精确匹配视觉风格和用途
- 优先推荐复杂度匹配的组件（用户要求轻量则选🟢，要求视觉冲击则选🔴）
- 每个推荐附带推荐理由
- 提供2-3个备选方案
- 推荐数量不超过请求的count参数

请严格返回JSON格式：
{
  "recommendations": [
    {
      "name": "组件名",
      "category": "类别",
      "confidence": 0.95,
      "reason": "推荐理由",
      "alternatives": ["备选1", "备选2"]
    }
  ],
  "reasoning": "整体推荐逻辑简述"
}`

    const userPrompt = `请为以下需求推荐组件：
- 场景描述: ${request.sceneDescription}
- 网站类型: ${request.websiteType || '未指定'}
- 视觉风格: ${request.visualStyle || '未指定'}
- 类别限制: ${request.categories?.join(', ') || '不限'}
- 推荐数量: ${request.count || 5}
- 最大复杂度: ${request.maxComplexity || '不限'}

请从知识库中精确匹配最合适的组件。`

    const response = await this.chat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.5, // 低温度确保精确匹配
      maxTokens: 4000
    })

    if (!response.success || !response.data) {
      throw new Error(response.error || '组件推荐失败')
    }

    try {
      const content = response.data.content
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      const jsonStr = jsonMatch ? jsonMatch[0] : content
      return JSON.parse(jsonStr)
    } catch {
      return {
        recommendations: [],
        reasoning: 'AI响应解析失败，请重试'
      }
    }
  }

  /**
   * V2.0: 基于知识库的代码生成
   * 根据自然语言描述和选中的组件，直接生成 React/Vue 代码
   */
  async generateCodeWithContext(
    request: CodeGenerationRequest
  ): Promise<CodeGenerationResponse> {
    console.log('\n💻 ========== 代码生成 (V2.0 动态知识库) ==========')
    console.log('需求描述:', request.description)
    console.log('选中组件:', request.selectedComponents)

    const kb = await this.initKnowledgeBase()

    // 为选中的组件构建详细知识
    const selectedKb = kb.filter(k =>
      request.selectedComponents.includes(k.name)
    )

    if (selectedKb.length === 0) {
      throw new Error('未找到选中的组件，请检查组件名称')
    }

    const selectedInfo = selectedKb.map(k =>
      `### ${k.name} (${k.category})
- 概要: ${k.summary}
- 特性: ${k.features}
- 风格: ${k.visualTags}
- 场景: ${k.sceneTags}
- 技术: ${k.techTags}
- 复杂度: ${k.complexity}`
    ).join('\n\n')

    const framework = request.framework || 'react'

    const systemPrompt = `你是专业的${framework === 'react' ? 'React + TypeScript + Tailwind CSS' : 'Vue 3 + TypeScript + SCSS'} 网站代码生成专家。

## 选中的组件详情

${selectedInfo}

## 技术要求
- 框架: ${framework === 'react' ? 'React 18 + TypeScript + Tailwind CSS + GSAP (ScrollTrigger)' : 'Vue 3 + TypeScript + SCSS + GSAP (ScrollTrigger)'}
- GSAP 插件注册: 每个使用 ScrollTrigger 的组件必须注册 gsap.registerPlugin(ScrollTrigger)
- Canvas API: 如果组件使用 Canvas, 使用 useRef + useEffect 实现
- 图片: 使用 Unsplash 格式 https://images.unsplash.com/photo-XXXXXXXX?w=1920&q=80
- 组件卸载时必须清理所有 GSAP 动画 (kill())
- 首屏 Hero 动画在 useEffect 中立即执行，不使用 ScrollTrigger
- 非首屏模块使用 ScrollTrigger 根据滚动触发
- 确保动画流畅度 >=60fps

## 输出要求
生成一个完整的、可直接运行的单文件应用。包含所有 import、组件定义、样式。`

    const userPrompt = `请根据以下需求生成完整代码：

## 项目信息
- 描述: ${request.description}
- 公司名称: ${request.companyInfo?.name || '未指定'}
- 行业: ${request.companyInfo?.industry || '未指定'}
- 业务描述: ${request.companyInfo?.description || '未指定'}
- 视觉风格: ${request.visualStyle || 'modern'}
- 配色方案: ${request.colorScheme || '由AI自行决定'}

请生成完整可运行的 ${framework} 代码，每个组件封装为独立文件。`

    const response = await this.chat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      maxTokens: 16000,
      stream: request.stream || false
    })

    if (!response.success || !response.data) {
      throw new Error(response.error || '代码生成失败')
    }

    const content = response.data.content

    // 尝试提取代码块
    return {
      code: content,
      files: extractFilesFromResponse(content),
      explanation: '基于动态组件知识库生成的完整代码'
    }
  }

  /**
   * V2.0: 模板→组件智能关联
   * 自动分析模板源码结构与滚动模式，为每个面板推荐最匹配的组件
   *
   * @example
   * const map = await aiService.analyzeTemplateForComponents({
   *   templateKey: 'horizontal-scroll',
   *   templateLabel: '横向无限滚动',
   *   sourceCode: '...',
   *   readme: '...',
   *   componentsPerPanel: 3
   * })
   */
  async analyzeTemplateForComponents(
    request: TemplateComponentMapRequest
  ): Promise<TemplateComponentMapResult> {
    console.log('\n🧩 ========== 模板→组件智能关联 (V2.0) ==========')
    console.log('模板:', request.templateLabel, `(${request.templateKey})`)

    const kb = await this.initKnowledgeBase()
    const componentCatalog = formatKnowledgeForAI(kb)

    // 截断源码避免 token 爆炸：取前 5000 字符 + 关键结构
    const sourceSummary = extractTemplateSummary(request.sourceCode)
    const readmeSummary = request.readme
      ? request.readme.substring(0, 2000)
      : '无 README 文档'

    const perPanel = request.componentsPerPanel || 3

    const systemPrompt = `你是网站模板与组件匹配专家。你需要分析一个滚动动画模板的源码，为它的每个面板推荐最合适的组件。

## 全部可用组件库

${componentCatalog}

## 分析任务

根据提供的模板源码，你需要：
1. 识别模板的滚动模式（横向/纵向/吸附/3D变换等）
2. 识别模板的视觉风格
3. 分析每个面板的用途（Hero、特性、产品、团队、CTA等）
4. 为每个面板推荐 ${perPanel} 个最佳匹配组件

## 匹配原则
- 面板用途与组件场景标签高度匹配（如 product-showcase → CardImageXxx）
- 视觉风格标签一致（如 cyber → 赛博朋克系列）
- 复杂度适宜（Hero选🟡/🔴，about选🟢/🟡）
- 避免同一面板推荐过多同类组件

请严格返回JSON格式（不要包含markdown代码块标记）：
{
  "analysis": "模板整体分析（30-60字）",
  "scrollPattern": "滚动模式（横向/纵向/吸附/3D/视差）",
  "visualStyle": "视觉风格标签",
  "targetScenes": ["适用场景1", "适用场景2"],
  "panels": [
    {
      "panelIndex": 0,
      "panelName": "面板描述",
      "panelPurpose": "面板用途（hero/products/features/about/team/cta/contact/cases/partners）",
      "recommendedComponents": [
        {
          "name": "组件名",
          "category": "card-image",
          "confidence": 0.95,
          "reason": "推荐理由",
          "alternatives": ["备选1", "备选2"]
        }
      ]
    }
  ]
}`

    const userPrompt = `请分析以下模板并推荐组件：

## 模板信息
- 名称: ${request.templateLabel}
- Key: ${request.templateKey}

## README (如有)
${readmeSummary}

## 模板源码
\`\`\`typescript
${sourceSummary}
\`\`\`

请为每个面板推荐 ${perPanel} 个最佳匹配组件，直接返回JSON。`

    const response = await this.chat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      maxTokens: 8000
    })

    if (!response.success || !response.data) {
      throw new Error(response.error || '模板分析失败')
    }

    try {
      const content = response.data.content
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      const jsonStr = jsonMatch ? jsonMatch[0] : content
      const result: TemplateComponentMapResult = JSON.parse(jsonStr)
      result.templateKey = request.templateKey
      result.templateLabel = request.templateLabel
      return result
    } catch (e) {
      console.error('模板分析JSON解析失败:', e)
      // 返回降级结果（空面板）
      return {
        templateKey: request.templateKey,
        templateLabel: request.templateLabel,
        analysis: 'AI响应解析失败',
        scrollPattern: '',
        visualStyle: '',
        targetScenes: [],
        panels: []
      }
    }
  }

  /**
   * 批量分析所有模板（带缓存）
   * 适用于一次性为 ~80 个模板预计算所有映射关系
   */
  async analyzeAllTemplates(
    templates: Array<{ key: string; label: string; source: string; readme?: string }>,
    concurrency = 3
  ): Promise<Map<string, TemplateComponentMapResult>> {
    console.log('\n\uD83D\uDCCA ========== 批量模板分析 (共 ' + templates.length + ' 个) ==========')

    const results = new Map<string, TemplateComponentMapResult>()
    const queue = [...templates]

    async function processNext(): Promise<void> {
      const tmpl = queue.shift()
      if (!tmpl) return
      try {
        const result = await this.analyzeTemplateForComponents({
          templateKey: tmpl.key,
          templateLabel: tmpl.label,
          sourceCode: tmpl.source,
          readme: tmpl.readme
        })
        results.set(tmpl.key, result)
        console.log('  \u2705 ' + tmpl.label + ': ' + result.panels.length + ' 个面板, ' + result.panels.reduce(function(s, p) { return s + p.recommendedComponents.length; }, 0) + ' 个推荐')
      } catch (e) {
        console.error('  \u274C ' + tmpl.label + ':', e)
      }
    }

    // 并发执行
    const workers = Array.from({ length: concurrency }, () => processNext.call(this))
    await Promise.all(workers)

    console.log('\uD83D\uDCCA 批量分析完成: ' + results.size + '/' + templates.length)
    return results
  }

  /**
   * V3.0 端到端代码生成引擎（全面重构）
   *
   * 架构：Plan(规划) → Generate(面板级流式生成) → Assemble(组装) → Validate(加权评分)
   * 核心改进：
   *   - 流式原生 HTML 输出，废除 JSON 包裹反模式
   *   - System Prompt < 8000 tokens (从 54000 大幅缩减)
   *   - 面板级分段生成，每个面板独立调用 AI
   *   - 加权质量评分 (内容40% + 结构30% + 动画20% + 加分10%)
   *   - 智能风格匹配 + 行业定制面板结构
   *
   * @example
   * const result = await aiService.generateWebsiteE2E({
   *   description: '开发宠物为主题的企业官网，要酷炫，大气',
   *   mode: 'single-html'
   * }, (chunk) => {
   *   if (chunk.type === 'code') previewCode.value = chunk.content
   *   if (chunk.type === 'panel') console.log(`生成面板: ${chunk.panelName}`)
   * })
   */
  async generateWebsiteE2E(
    request: WebsiteE2ERequest,
    onStream?: E2EStreamCallback
  ): Promise<WebsiteE2EResponse> {
    const mode = request.mode || 'single-html'

    // 初始化 E2E 引擎（懒加载知识库）
    if (!this.e2eGenerator) {
      const kb = await this.initKnowledgeBase()
      this.e2eGenerator = new E2EGenerator(
        // 非流式 chat
        async (params) => this.chat({
          messages: params.messages.map(m => ({ role: m.role as MessageRole, content: m.content })),
          temperature: params.temperature,
          maxTokens: params.maxTokens,
          stream: false,
          timeout: params.timeout,
          model: params.model
        }),
        // 流式 stream
        async (params, onChunk) => this.chatStream(
          {
            messages: params.messages.map(m => ({ role: m.role as MessageRole, content: m.content })),
            temperature: params.temperature,
            maxTokens: params.maxTokens,
            timeout: params.timeout,
            model: params.model
          },
          onChunk
        ),
        {
          knowledgeBase: kb,
          e2eModel: this.config?.e2eModel
        }
      )
    } else {
      // 刷新知识库（组件可能有更新）
      const freshKb = await this.initKnowledgeBase()
      this.e2eGenerator.setKnowledgeBase(freshKb)
    }

    // 🆕 加载模板源码（选择模板时自动加载对应 .vue 文件）
    let templateSource: string | undefined
    if (request.templateKey) {
      templateSource = await loadTemplateSource(request.templateKey) || undefined
      if (templateSource) {
        console.log(`📦 已加载模板源码: ${request.templateKey} (${templateSource.length} 字符)`)
      } else {
        const msg = `模板源码加载失败: ${request.templateKey}`
        console.error(`❌ ${msg}`)
        onStream?.({ type: 'error', content: msg })
        throw new Error(msg)
      }
    }

    // === 流式适配：V3.0 回调 → V2.0 回调兼容 ===
    const result = await this.e2eGenerator.generate(
      {
        description: request.description,
        companyInfo: request.companyInfo,
        visualStyle: request.visualStyle,
        colorPreference: request.colorPreference,
        templateKey: request.templateKey,
        templatePanels: request.templatePanels,
        templateSource,
        recommendedComponents: request.recommendedComponents ? {
          scrollPattern: request.recommendedComponents.scrollPattern,
          visualStyle: request.recommendedComponents.visualStyle,
          targetScenes: request.recommendedComponents.targetScenes,
          panels: request.recommendedComponents.panels?.map(p => ({
            panelIndex: p.panelIndex,
            panelName: p.panelName,
            panelPurpose: p.panelPurpose
          }))
        } : undefined,
        framework: request.framework,
        mode
      },
      onStream ? (chunk) => {
        switch (chunk.type) {
          case 'code':
            onStream({ type: 'code', content: chunk.content! })
            break
          case 'components':
            onStream({
              type: 'components',
              data: {
                selectedComponents: [],
                reasoning: `面板规划: ${chunk.data?.panels?.map((p: any) => p.name).join('→') || ''}`
              }
            })
            break
          case 'panel':
            // 推送面板进度
            onStream({ type: 'reasoning', content: `📄 ${chunk.panelName}` })
            break
          case 'telemetry':
            onStream({ type: 'telemetry', data: chunk.data })
            break
          case 'done':
            onStream({ type: 'done' })
            break
          case 'error':
            onStream({ type: 'error', content: chunk.content })
            break
        }
      } : undefined
    )

    if (mode === 'single-html') {
      return {
        mode: 'single-html',
        html: result.html,
        selectedComponents: result.selectedComponents,
        reasoning: result.reasoning,
        qualityReport: {
          score: result.qualityReport.score,
          passed: result.qualityReport.passed,
          issues: result.qualityReport.issues,
          warnings: result.qualityReport.warnings
        }
      }
    } else {
      return {
        mode: 'multi-file',
        files: [{ path: 'index.html', content: result.html, description: '主页面' }],
        selectedComponents: result.selectedComponents,
        reasoning: result.reasoning,
        qualityReport: {
          score: result.qualityReport.score,
          passed: result.qualityReport.passed,
          issues: result.qualityReport.issues,
          warnings: result.qualityReport.warnings
        }
      }
    }
  }

  /**
   * V2.0: AI 对话修改代码（流式）
   * 基于当前代码 + 用户修改指令，生成更新后的完整代码
   *
   * onChunk 回调：
   * - { type: 'text', content } — AI 解释文字（逐 token 实时推送，用于聊天显示）
   * - { type: 'code', content } — 当前提取到的完整代码（实时预览刷新）
   * - { type: 'done' } — 流式完成
   */
  async modifyCode(
    request: {
      /** 当前完整代码 */
      currentCode: string
      /** 用户修改指令 */
      instruction: string
      /** 对话历史 */
      history?: Array<{ role: 'user' | 'assistant'; content: string }>
      /** 生成模式 */
      mode?: 'single-html' | 'multi-file'
    },
    onChunk?: (chunk: { type: 'text' | 'code' | 'done'; content?: string }) => void
  ): Promise<{
    html?: string
    explanation?: string
  }> {
    console.log('\n🔧 ========== AI 修改代码（流式）==========')
    console.log('修改指令:', request.instruction)
    console.log('当前代码长度:', request.currentCode.length, '字符')

    const mode = request.mode || 'single-html'

    // 注入组件知识库和代码模式，让 AI 修改时有足够上下文
    const kb = await this.initKnowledgeBase()
    const componentSummary = kb.map(k =>
      `|${k.name}|${k.category}|${k.complexity}|${k.visualTags}|${k.sceneTags}|${k.summary}|`
    ).join('\n')

    const systemPrompt = `你是顶级全栈前端开发专家 + GSAP 动画大师。用户会给你一份当前网站代码和修改需求，请你修改代码并返回完整的更新后代码。

## GSAP 动画参考（可用组件列表，共${kb.length}个）
|组件名|类别|复杂度|视觉标签|场景标签|简介|
|---|---|---|---|---|---|
${componentSummary}

> 以上组件列表供参考。如果用户要求"换个更炫的组件"或"加个xx效果"，从列表中选匹配度最高的组件效果，用原生 JS + GSAP 实现。

## 修改规则
1. **输出完整的修改后代码**，不要省略或使用占位符（这是最高优先级规则）
2. 保持原代码的整体结构和面板顺序，只修改用户指定的部分
3. **保持 GSAP + Tailwind CDN 引用不变**
4. **保持所有动画类名的唯一后缀不变**（如 -271），新增元素用相同后缀
5. 如果用户要求更换/升级效果，从组件库选更高复杂度的组件实现
6. 如果用户要求调整颜色，修改 CSS 变量 :root 定义即可全局生效
7. 如果用户要求添加面板，插入新的 <section class="panel"> 并配 GSAP 入场动画

## GSAP 代码规范
- 必须 \`gsap.registerPlugin(ScrollTrigger)\`
- 新加的面板动画用 ScrollTrigger + toggleActions: 'play none none reverse'
- 修改现有动画保持原有的触发方式
- 不用 transform CSS 属性，用 gsap 的 x/y/rotateX/Y 等

## 输出格式
首先用简短文字（30字内）说明改了什么，然后输出完整代码（用 \`\`\`html 标记）。`

    const historyMessages = (request.history || []).map(h => ({
      role: h.role,
      content: h.content
    }))

    let fullContent = ''
    let lastCodePushed = ''
    // 用 fromCharCode(96) 避免 esbuild 误解析反引号
    const TB = String.fromCharCode(96) + String.fromCharCode(96) + String.fromCharCode(96)

    // 🌊 流式调用
    const response = await this.chatStream(
      {
        messages: [
          { role: 'system', content: systemPrompt },
          ...historyMessages,
          { role: 'user', content: `## 当前代码\n\n\`\`\`html\n${request.currentCode.substring(0, 60000)}\n\`\`\`\n\n## 修改需求\n\n${request.instruction}\n\n请输出修改后的完整代码。` }
        ],
        temperature: 0.2,
        maxTokens: 24000,
        timeout: 600000
      },
      (chunk) => {
        fullContent += chunk.content

        // 实时推送文本内容（用于聊天对话展示）
        onChunk?.({ type: 'text', content: chunk.content })

        // 尝试提取代码块中的代码（用于实时预览刷新）
        const htmlStartIdx = fullContent.indexOf(TB + 'html')
        if (htmlStartIdx >= 0) {
          const afterStart = fullContent.substring(htmlStartIdx + 7)
          const newlineIdx = afterStart.indexOf('\n')
          const codeTextStart = newlineIdx >= 0 ? htmlStartIdx + 7 + newlineIdx + 1 : htmlStartIdx + 7
          let codePart = fullContent.substring(codeTextStart)
          // 去掉尾部可能的 ``` 结束标记
          const endMarker = codePart.lastIndexOf(TB)
          if (endMarker >= 0) {
            codePart = codePart.substring(0, endMarker)
          }
          codePart = codePart.trim()
          // 代码至少 200 字符才推送到预览（避免推送不完整片段闪屏）
          if (codePart.length > 200 && codePart.length > lastCodePushed.length) {
            lastCodePushed = codePart
            onChunk?.({ type: 'code', content: codePart })
          }
        }
      }
    )

    if (!response.success || !response.data) {
      throw new Error(response.error || '代码修改失败')
    }

    const content = response.data.content

    // 提取解释（代码块之前的内容）
    let explanation = ''
    const codeBlockIdx = content.indexOf(TB + 'html')
    if (codeBlockIdx > 0) {
      explanation = content.substring(0, codeBlockIdx).trim()
    } else {
      const codeBlockIdx2 = content.indexOf(TB)
      if (codeBlockIdx2 > 0) {
        explanation = content.substring(0, codeBlockIdx2).trim()
      }
    }
    if (!explanation) {
      explanation = content.split('\n').filter(l => l.trim() && !l.startsWith(TB)).slice(0, 2).join(' ')
    }

    // 提取代码块
    let code = extractMdBlock(content, 'html')
    if (!code) {
      const fallbackStr = extractMdBlock(content)
      code = fallbackStr || content.trim()
    }

    // 流式完成通知
    onChunk?.({ type: 'done' })

    console.log('✅ 修改完成，代码长度:', code.length, '字符')

    return {
      html: code,
      explanation
    }
  }

  /**
   * 质量校验：检测生成代码是否满足最低标准
   * 返回校验报告，供日志和 UI 展示
   */
  /**
   * V3.0 加权质量校验 (向后兼容，V2.0 调用方无需修改)
   *
   * 评分体系 (100分制):
   *   内容完整性 40分: lines≥600(10) + 中文≥500(10) + sections≥7(10) + images≥6(10)
   *   结构规范 30分: registerPlugin(8) + footer(8) + 闭合(5) + refresh(5) + 响应式(4)
   *   动画质量 20分: canvas+RAF(8) + fromTo(6) + submit(3) + FAQtoggle(3)
   *   额外加分 10分: ScrollToPlugin(4) + 导航链接≥7(3) + 联系信息3项(3)
   *
   * 致命问题 (直接 score=0): 代码为空 / 无 / DOCTYPE / 无GSAP
   */
  validateGeneratedCode(code: string): {
    passed: boolean
    score: number
    issues: string[]
    warnings: string[]
  } {
    const issues: string[] = []
    const warnings: string[] = []

    // 致命检查
    if (!code || code.length < 100) {
      issues.push('代码为空或极短(<100字符)，无法校验')
      return { passed: false, score: 0, issues, warnings }
    }
    if (!/<!DOCTYPE\s+html/i.test(code)) {
      issues.push('缺少 <!DOCTYPE html> 声明')
      return { passed: false, score: 5, issues, warnings }
    }
    if (!code.includes('gsap.min.js')) {
      issues.push('缺少 GSAP CDN 引入 — 无 GSAP 的企业官网等于普通网页')
      return { passed: false, score: 10, issues, warnings }
    }

    const lines = code.split('\n').length
    const sectionCount = (code.match(/<section\b/gi) || []).length
    const chineseChars = (code.match(/[\u4e00-\u9fff]/g) || []).length
    const imgCount = (code.match(/<img\b/gi) || []).length

    // === 内容完整性 (40分) ===
    let contentScore = 0

    if (lines >= 600) contentScore += 10
    else if (lines >= 450) { contentScore += 6; warnings.push(`代码${lines}行(建议>=600行)`) }
    else { issues.push(`代码仅${lines}行 — 一个完整企业官网不可能少于600行`) }

    if (chineseChars >= 500) contentScore += 10
    else if (chineseChars >= 300) { contentScore += 6; warnings.push(`中文${chineseChars}字(建议>=500字)`) }
    else { issues.push(`中文仅${chineseChars}字 — 至少需要500字中文内容`) }

    if (sectionCount >= 7) contentScore += 10
    else if (sectionCount >= 5) { contentScore += 6; warnings.push(`仅${sectionCount}个面板(建议>=7个)`) }
    else if (sectionCount >= 4) { contentScore += 3; warnings.push(`仅${sectionCount}个面板(最少需4个)`) }
    else { issues.push(`仅${sectionCount}个面板 — 最少需要4个`) }

    if (imgCount >= 6) contentScore += 10
    else if (imgCount >= 3) { contentScore += 5; warnings.push(`仅${imgCount}张图片`) }
    else { warnings.push(`仅${imgCount}张图片 — 缺少视觉内容`) }

    // === 结构规范 (30分) ===
    let structureScore = 0

    if (/gsap\.registerPlugin\s*\(\s*ScrollTrigger\s*(?:,\s*ScrollToPlugin\s*)?\s*\)/.test(code)) structureScore += 8
    else issues.push('未调用 gsap.registerPlugin(ScrollTrigger)')

    if (/<footer\b/i.test(code)) structureScore += 8
    else warnings.push('缺少 <footer> 标签 — 企业官网必备')

    if (/\/html>/i.test(code)) structureScore += 5
    else warnings.push('缺少 </html> 闭合标签')

    if (/ScrollTrigger\.refresh\s*\(\)/.test(code)) structureScore += 5
    else warnings.push('缺少 ScrollTrigger.refresh()')

    if (/@media/.test(code)) structureScore += 4
    else warnings.push('缺少响应式 @media — 移动端体验差')

    // === 动画质量 (20分) ===
    let animationScore = 0

    if (/<canvas\b/i.test(code) && /requestAnimationFrame/i.test(code)) animationScore += 8
    else if (/<canvas\b/i.test(code)) { animationScore += 4; warnings.push('Canvas存在但无requestAnimationFrame') }
    else warnings.push('缺少 Canvas 粒子背景')

    if (/gsap\.fromTo/.test(code)) animationScore += 6
    else warnings.push('未使用 gsap.fromTo (推荐用fromTo精确控制动画)')

    if (/addEventListener\s*\(\s*['"]submit['"]/.test(code)) animationScore += 3
    else warnings.push('表单缺少 submit 事件处理')

    if (/classList\.toggle/.test(code) || /toggle\s*\(\s*['"]open['"]/.test(code)) animationScore += 3

    // === 额外加分 (10分) ===
    let bonusScore = 0

    if (/ScrollToPlugin/.test(code)) bonusScore += 4
    else warnings.push('缺少 ScrollToPlugin CDN — 导航跳转不平滑')

    const navCount = (code.match(/nav-link/gi) || []).length
    if (navCount >= 7) bonusScore += 3
    else if (navCount >= 5) bonusScore += 1

    const contactAddr = /地址/.test(code)
    const contactPhone = /电话|热线|400-/.test(code) || /\d{3}-\d{4}/.test(code)
    const contactEmail = /邮箱/.test(code) || /@/.test(code)
    const contactItems = [contactAddr, contactPhone, contactEmail].filter(Boolean).length
    if (contactItems >= 3) bonusScore += 3
    else if (contactItems >= 2) bonusScore += 1

    // 无省略号检查
    if (/\/\/\s*\.{3}|<!--\s*\.{3}/.test(code)) {
      issues.push('存在省略号或占位符 — 代码不完整')
    }

    // Tailwind CDN
    if (!code.includes('tailwindcss')) {
      warnings.push('缺少 Tailwind CSS CDN')
    }

    const totalScore = contentScore + structureScore + animationScore + bonusScore

    return {
      passed: issues.length === 0,
      score: totalScore,
      issues,
      warnings
    }
  }

  /**
   * 获取默认模型
   */
  private getDefaultModel(): string {
    switch (this.config?.provider) {
      case 'qwen':
        return 'qwen-max'
      case 'deepseek':
        return 'deepseek-chat'
      case 'openai':
        return 'gpt-4'
      default:
        return 'gpt-4'
    }
  }

  /**
   * 降级方案（当API失败时使用）
   */
  private getFallbackSolution(request: SolutionGenerationRequest): SolutionGenerationResponse {
    return {
      solutions: [
        {
          name: '方案A - 视觉冲击版',
          icon: '🎨',
          badge: '炫酷',
          description: '最大化视觉效果，使用高级动画组件',
          performanceRating: 4,
          complexity: '高',
          estimatedTime: '2-3个月',
          reasons: [
            '采用高级动画组件，视觉冲击力强',
            '适合追求品牌形象的项目',
            '需要较好的设备性能',
            '加载时间相对较长'
          ],
          modules: this.getFallbackModules(),
          colorScheme: this.getColorScheme(request.visualStyle)
        },
        {
          name: '方案B - 平衡优化版',
          icon: '⚖️',
          badge: '推荐',
          description: '在视觉效果和性能之间取得平衡',
          performanceRating: 4,
          complexity: '中',
          estimatedTime: '1-2个月',
          reasons: [
            '平衡视觉效果和加载性能',
            '适合大多数企业官网',
            '良好的兼容性和用户体验',
            '性价比最高的选择'
          ],
          modules: this.getFallbackModules(),
          colorScheme: this.getColorScheme(request.visualStyle)
        },
        {
          name: '方案C - 快速交付版',
          icon: '⚡',
          badge: '高效',
          description: '使用轻量级组件，快速开发和部署',
          performanceRating: 5,
          complexity: '低',
          estimatedTime: '2-4周',
          reasons: [
            '使用轻量级基础组件',
            '加载速度快，移动端友好',
            '快速开发和部署',
            '适合预算紧张的项目'
          ],
          modules: this.getFallbackModules().slice(0, 3),
          colorScheme: this.getColorScheme(request.visualStyle)
        }
      ],
      analysis: '基于您的需求分析，我们生成了3套不同侧重点的方案',
      recommendations: [
        '建议优先考虑方案B，平衡效果和性能',
        '如果预算充足，可以选择方案A获得更好的视觉体验',
        '如果时间紧迫，方案C可以快速上线'
      ]
    }
  }

  private getFallbackModules(): ModuleSolution[] {
    return [
      {
        icon: '🎯',
        name: '首页英雄区',
        components: [
          { name: 'CardTextCyber', type: '文字特效', purpose: '赛博风格标题' },
          { name: 'CardImgAurora', type: '背景效果', purpose: '极光背景' },
          { name: 'CardImgNebulaBreath', type: '粒子特效', purpose: '星云呼吸' },
          { name: 'CardTextHologram', type: '交互按钮', purpose: '全息CTA按钮' }
        ]
      },
      {
        icon: '👥',
        name: '关于我们',
        components: [
          { name: 'CardTimeBook', type: '时间轴', purpose: '品牌故事' },
          { name: 'CardImgMontage', type: '卡片展示', purpose: '团队介绍' },
          { name: 'CardTextBioluminescent', type: '数据统计', purpose: '成就数据' }
        ]
      },
      {
        icon: '📦',
        name: '产品/服务',
        components: [
          { name: 'Card3DFlipGallery', type: '3D展示', purpose: '产品展示' },
          { name: 'CardImgPrism', type: '棱镜效果', purpose: '特性分解' },
          { name: 'CardTextCorona', type: '文字特效', purpose: '产品标题' }
        ]
      },
      {
        icon: '⚙️',
        name: '技术优势',
        components: [
          { name: 'CardImgPerspective', type: '透视卡片', purpose: '技术架构' },
          { name: 'CardImgBeacon', type: '信标卡片', purpose: '核心技术' },
          { name: 'CardTextDomino', type: '文字动画', purpose: '技术亮点' }
        ]
      },
      {
        icon: '🏆',
        name: '成功案例',
        components: [
          { name: 'CardImgVortex', type: '漩涡效果', purpose: '案例展示' },
          { name: 'CardImgCarousel', type: '轮播展示', purpose: '案例轮播' },
          { name: 'CardTextCinematic', type: '电影文字', purpose: '案例标题' }
        ]
      },
      {
        icon: '📰',
        name: '新闻动态',
        components: [
          { name: 'CardImgCarousel', type: '轮播展示', purpose: '新闻轮播' },
          { name: 'CardImgDepth', type: '景深效果', purpose: '新闻卡片' },
          { name: 'CardTextAurora', type: '极光文字', purpose: '新闻标题' }
        ]
      },
      {
        icon: '🤝',
        name: '合作伙伴',
        components: [
          { name: 'CardImgGalaxy', type: '星系布局', purpose: '伙伴生态' },
          { name: 'CardImgMirror', type: '镜像展示', purpose: '对称布局' },
          { name: 'CardTextFirework', type: '烟花特效', purpose: '合作庆祝' }
        ]
      },
      {
        icon: '📧',
        name: '联系我们',
        components: [
          { name: 'CardTextHologram', type: '交互按钮', purpose: '联系表单' },
          { name: 'CardImgMorningMist', type: '晨雾背景', purpose: '柔和背景' },
          { name: 'CardTextCrystal', type: '水晶按钮', purpose: '提交按钮' }
        ]
      }
    ]
  }

  private getColorScheme(style: string): ColorScheme[] {
    const schemes: Record<string, ColorScheme[]> = {
      tech: [
        { role: '主色', hex: '#00FFFF' },
        { role: '辅色', hex: '#FF00FF' },
        { role: '背景', hex: '#0A0E27' },
        { role: '强调', hex: '#00FF00' }
      ],
      nature: [
        { role: '主色', hex: '#2E8B57' },
        { role: '辅色', hex: '#87CEEB' },
        { role: '背景', hex: '#F5F5DC' },
        { role: '强调', hex: '#FFD700' }
      ],
      luxury: [
        { role: '主色', hex: '#FFD700' },
        { role: '辅色', hex: '#C0C0C0' },
        { role: '背景', hex: '#000000' },
        { role: '强调', hex: '#800080' }
      ],
      minimal: [
        { role: '主色', hex: '#FFFFFF' },
        { role: '辅色', hex: '#333333' },
        { role: '背景', hex: '#F5F5F5' },
        { role: '强调', hex: '#000000' }
      ],
      creative: [
        { role: '主色', hex: '#FF6B6B' },
        { role: '辅色', hex: '#4ECDC4' },
        { role: '背景', hex: '#FFFFFF' },
        { role: '强调', hex: '#FFE66D' }
      ],
      vintage: [
        { role: '主色', hex: '#8B4513' },
        { role: '辅色', hex: '#D2691E' },
        { role: '背景', hex: '#F4A460' },
        { role: '强调', hex: '#CD853F' }
      ]
    }
    return schemes[style] || schemes.minimal
  }

  // 辅助方法：获取名称映射
  private getWebsiteTypeName(type: string): string {
    const map: Record<string, string> = {
      corporate: '企业官网',
      ecommerce: '电商平台',
      portfolio: '作品集/个人网站',
      landing: '营销落地页',
      saas: 'SaaS产品页',
      education: '教育/培训',
      medical: '医疗/健康',
      restaurant: '餐饮/酒店'
    }
    return map[type] || type
  }

  private getIndustryName(industry: string): string {
    const map: Record<string, string> = {
      tech: '科技/互联网/AI',
      finance: '金融/保险',
      design: '设计/创意/艺术',
      manufacturing: '制造/工业',
      retail: '零售/电商',
      education: '教育/培训',
      medical: '医疗/健康',
      realestate: '房地产/建筑',
      food: '餐饮/食品',
      travel: '旅游/酒店',
      legal: '法律/咨询',
      other: '其他'
    }
    return map[industry] || industry
  }

  private getStyleName(style: string): string {
    const map: Record<string, string> = {
      tech: '科技感/未来风',
      nature: '自然/生态风',
      luxury: '高端/奢华风',
      minimal: '简约/现代风',
      creative: '创意/艺术风',
      vintage: '复古/怀旧风'
    }
    return map[style] || style
  }

  private getDeviceName(device: string): string {
    const map: Record<string, string> = {
      mobile: '移动端为主',
      desktop: '桌面端为主',
      both: '两者兼顾'
    }
    return map[device] || device
  }

  private getBudgetName(budget: string): string {
    const map: Record<string, string> = {
      low: '紧张（快速交付，简化动画）',
      medium: '适中（平衡效果与性能）',
      high: '充裕（追求视觉效果）',
      unlimited: '不限（极致体验）'
    }
    return map[budget] || budget
  }

  private getTimelineName(timeline: string): string {
    const map: Record<string, string> = {
      urgent: '紧急（1-2周）',
      normal: '正常（1-2个月）',
      relaxed: '宽松（3个月以上）'
    }
    return map[timeline] || timeline
  }

  private getModuleNames(keys: string[]): string[] {
    const map: Record<string, string> = {
      hero: '首页英雄区',
      about: '关于我们',
      products: '产品/服务',
      technology: '技术优势',
      cases: '成功案例',
      news: '新闻动态',
      partners: '合作伙伴',
      contact: '联系我们'
    }
    return keys.map(key => map[key] || key)
  }

  private getModuleName(key: string): string {
    const map: Record<string, string> = {
      hero: '首页英雄区',
      about: '关于我们',
      products: '产品/服务',
      technology: '技术优势',
      cases: '成功案例',
      news: '新闻动态',
      partners: '合作伙伴',
      contact: '联系我们'
    }
    return map[key] || key
  }

  private getEmotionName(emotion: string): string {
    const map: Record<string, string> = {
      professional: '专业可靠',
      friendly: '友好亲和',
      innovative: '创新前沿',
      elegant: '优雅精致',
      energetic: '活力动感',
      calm: '平静舒缓',
      playful: '活泼有趣',
      serious: '严肃权威',
      warm: '温暖亲切',
      cool: '冷静理性'
    }
    return map[emotion] || ''
  }

  private getPerformancePriorityLabel(priority: number): string {
    const map: Record<number, string> = {
      1: '视觉效果优先 - 使用更多高级动画',
      2: '平衡模式 - 兼顾效果和性能',
      3: '加载速度优先 - 轻量级组件'
    }
    return map[priority] || '平衡模式'
  }
}

// ==================== 辅助函数 ====================

/**
 * 从模板源码中提取关键摘要
 * 只保留核心信息，否则 token 爆炸
 */
function extractTemplateSummary(source: string): string {
  const lines = source.split('\n')

  // 1. 提取顶部的 JSDoc 注释（描述信息）
  const commentBlock: string[] = []
  let inTopComment = false
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('/**')) { inTopComment = true; continue }
    if (inTopComment && trimmed.startsWith('*/')) break
    if (inTopComment) commentBlock.push(line)
  }

  // 2. 提取 import 语句
  const imports = lines.filter(l => l.trim().startsWith('import '))

  // 3. 提取常量/配置
  const constants = lines.filter(l =>
    /^(const|let|var)\s+\w+\s*=/.test(l.trim())
  )

  // 4. 提取面板数据（panelData/slides/pages 等数组）
  const dataArrays: string[] = []
  let inArray = false
  let arrayDepth = 0
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (/^(const|let|var)\s+\w+\s*=\s*\[/.test(line)) {
      inArray = true
      arrayDepth = 1
      dataArrays.push(lines[i])
      continue
    }
    if (inArray) {
      const openCount = (line.match(/\[/g) || []).length
      const closeCount = (line.match(/\]/g) || []).length
      arrayDepth += openCount - closeCount
      dataArrays.push(lines[i])
      if (arrayDepth <= 0) { inArray = false; break }
    }
  }

  // 5. 提取函数名列表（前10个）
  const functionNames = lines
    .filter(l => /^(function|async function)\s+\w+/.test(l.trim()) || /^\s*(const|let|var)\s+\w+\s*=\s*(async\s*)?\(/.test(l.trim()))
    .map(l => l.trim().substring(0, 80))
    .slice(0, 10)

  // 组装摘要
  const parts: string[] = []
  if (commentBlock.length) {
    parts.push('// --- 模板描述 ---')
    parts.push(...commentBlock.slice(0, 8))
  }
  if (imports.length) {
    parts.push('// --- 依赖导入 (前15行) ---')
    parts.push(...imports.slice(0, 15))
  }
  if (constants.length) {
    parts.push('// --- 关键常量 (前10行) ---')
    parts.push(...constants.slice(0, 10))
  }
  if (dataArrays.length) {
    parts.push('// --- 面板数据 ---')
    parts.push(...dataArrays.slice(0, 50))
  }
  if (functionNames.length) {
    parts.push('// --- 核心函数 (前10个) ---')
    parts.push(...functionNames)
  }

  let summary = parts.join('\n')
  // 限制总长度 5000 字符
  if (summary.length > 5000) {
    summary = summary.substring(0, 5000) + '\n// ... (源码截断)'
  }
  return summary || source.substring(0, 5000)
}

/**
 * 从 AI 响应中提取文件列表
 * 解析 markdown 代码块格式: ```filepath\n...content...```
 */
function extractFilesFromResponse(content: string): GeneratedFile[] {
  const files: GeneratedFile[] = []
  var pos = 0
  while (true) {
    var openIdx = content.indexOf(_TB, pos)
    if (openIdx === -1) break
    var headerEnd = content.indexOf('\n', openIdx)
    var header = headerEnd === -1 ? '' : content.substring(openIdx + 3, headerEnd).trim()
    var codeStart = headerEnd === -1 ? openIdx + 3 : headerEnd + 1
    var closeIdx = content.indexOf(_TB, codeStart)
    if (closeIdx === -1) break
    var code = content.substring(codeStart, closeIdx).trim()
    // 解析文件路径：格式如 "tsx // path/file.tsx" 或 "path/file.tsx"
    var filePath = ''
    var pathMatch = header.match(/\/\/\s*(.+?\.\w+)\s*$/)
    if (pathMatch) {
      filePath = pathMatch[1]
    } else {
      var pathMatch2 = header.match(/([^\s]+\.\w+)\s*$/)
      if (pathMatch2) filePath = pathMatch2[1]
    }
    if (!filePath) filePath = 'component_' + (files.length + 1) + '.tsx'
    files.push({
      path: filePath,
      content: code,
      description: ''
    })
    pos = closeIdx + 3
  }

  // 如果没有匹配到代码块，整个内容作为单个文件
  if (files.length === 0) {
    files.push({
      path: 'App.tsx',
      content: content.trim(),
      description: '完整应用代码'
    })
  }

  return files
}

// 导出单例
export const aiService = new AIService()
export default aiService
