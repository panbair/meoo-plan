/**
 * AI API 服务
 * 支持多种AI提供商：通义千问、DeepSeek、OpenAI等
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
}

/** 流式回调 */
export type E2EStreamCallback = (chunk: {
  type: 'reasoning' | 'code' | 'components' | 'done' | 'error'
  content?: string
  data?: any
}) => void

class AIService {
  private client: AxiosInstance
  private config: AIConfig | null = null
  private knowledgeBase: ComponentKnowledge[] | null = null
  private knowledgeBasePromise: Promise<ComponentKnowledge[]> | null = null

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
   * 生成紧凑的 Few-Shot 范例骨架（~2K tokens）
   * 给 AI 看真实可用的高质量网站结构模板
   */
  getFewShotExample(): string {
    return `## Few-Shot 范例：一个完整的高质量 GSAP 多面板网站

以下是参考结构（基于真实可运行的 demo26 星夜幻境模板精简）：

\`\`\`html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>【公司名】- 品牌官网</title>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
  <!-- Tailwind CDN + GSAP CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <style>
    /* ===== CSS变量 + 全局样式 ===== */
    :root {
      --bg: #030308; --accent: #00f5ff; --accent2: #bf00ff;
      --text: #f0f0ff; --text-dim: #8888aa;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Orbitron', system-ui, sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; }
    /* ===== 全屏面板容器 ===== */
    .panel { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
    .panel-inner { max-width: 1200px; width: 100%; margin: 0 auto; padding: 80px 40px; position: relative; z-index: 1; }
    /* ===== 导航栏 ===== */
    .navbar { position: fixed; top: 0; width: 100%; z-index: 100; padding: 20px 60px; transition: all 0.3s; display: flex; justify-content: space-between; align-items: center; }
    .navbar.scrolled { background: rgba(3,3,8,0.9); backdrop-filter: blur(10px); padding: 12px 60px; }
    /* ===== 玻璃卡片 ===== */
    .glass-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; backdrop-filter: blur(10px); }
    /* ===== 渐变文字 ===== */
    .gradient-text { background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    /* ===== 响应式 ===== */
    @media (max-width: 768px) { .navbar { padding: 16px 20px; } .panel-inner { padding: 60px 20px; } }
  </style>
</head>
<body>
  <!-- 加载动画 ⚡ 0.5s进场 可选 -->
  <div class="loader" id="loader">...</div>

  <!-- 导航栏 -->
  <nav class="navbar" id="navbar">
    <div class="text-xl font-bold gradient-text">LOGO</div>
    <div class="flex gap-8"><a class="nav-link" href="#hero">首页</a><a class="nav-link" href="#about">关于</a><a class="nav-link" href="#contact">联系</a></div>
  </nav>

  <!-- Panel 1: Hero 全屏首屏 -->
  <section class="panel" id="hero" style="background: radial-gradient(ellipse at center, #0a0a2e 0%, #030308 70%);">
    <div class="absolute inset-0 pointer-events-none">
      <!-- 背景装饰：星星/粒子/光晕用多个 div -->
    </div>
    <div class="panel-inner text-center">
      <h1 class="hero-title text-6xl md:text-8xl font-black gradient-text mb-6">震撼标题</h1>
      <p class="hero-subtitle text-xl text-gray-400 mb-10 max-w-2xl mx-auto">副标题描述</p>
      <div class="flex gap-4 justify-center">
        <button class="px-8 py-3 rounded-lg font-bold text-white" style="background:linear-gradient(135deg, var(--accent), var(--accent2))">开始体验</button>
        <button class="px-8 py-3 rounded-lg border border-white/20">了解更多</button>
      </div>
    </div>
  </section>

  <!-- Panel 2-N: 各类内容面板（用相同 .panel 容器 + 不同渐变背景区分） -->
  <!-- 每个面板：section.panel > div.panel-inner > h2.section-title + 内容网格 -->
</body>
<script>
  gsap.registerPlugin(ScrollTrigger)

  document.addEventListener('DOMContentLoaded', () => {
    // 加载动画 - 0.5s后消失
    gsap.to('#loader', { opacity: 0, duration: 0.4, delay: 0.5, onComplete: () => { document.getElementById('loader').style.display = 'none' } })

    // Hero 入场（无 ScrollTrigger）
    gsap.fromTo('.hero-title', { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
    gsap.fromTo('.hero-subtitle', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: 'power3.out' })

    // 面板标题从下飞入（通用模式）
    gsap.utils.toArray('.section-title').forEach(title => {
      gsap.fromTo(title, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: title, start: 'top 85%', toggleActions: 'play none none reverse' }
      })
    })

    // 卡片序列入场（每个面板独立处理）
    // ... 参考组件实现模式中的 stagger 写法 ...

    // ScrollTrigger.refresh() 在动画定义后调用，确保计算正确
    ScrollTrigger.refresh()
  })
</script>
</html>
\`\`\`

**关键要点：**
- 每面板一个 \`<section class="panel">\` 保持结构清晰
- CSS 变量驱动配色，便于整体换色
- Hero 用绝对定位的装饰元素做视觉增强
- 导航栏固定定位 + ScrollTrigger 控制背景显隐
- 所有动画类名加唯一后缀避免冲突`
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
    return `## 质量自检清单（输出代码前必须逐项确认）

### 结构完整性
- [ ] 以 \`<!DOCTYPE html>\` 开头
- [ ] \`<head>\` 包含 GSAP 3.12.5 + ScrollTrigger + Tailwind CDN 三个标签
- [ ] 代码总量 >= 500 行（完整多面板网站不能太简短）
- [ ] 无任何 \`// ... 省略 ...\` 或占位符

### GSAP 动画规范
- [ ] 第一行 JS: \`gsap.registerPlugin(ScrollTrigger)\`
- [ ] Hero 入场动画在 \`DOMContentLoaded\` 中立即执行（不用 ScrollTrigger）
- [ ] 后续面板用 ScrollTrigger + \`toggleActions: 'play none none reverse'\`
- [ ] 所有动画用 \`gsap.fromTo\` 精确控制起止状态
- [ ] 最后调用 \`ScrollTrigger.refresh()\`

### 面板规范
- [ ] 5-8 个 \`<section class="panel">\` 全屏面板
- [ ] 每个面板有独立渐变背景区分章节
- [ ] Hero(首屏) → About/Feature(介绍) → Service/Product(内容) → Gallery(案例) → Stats(数据) → Team(团队) → Contact(联系)
- [ ] 每个面板中文标题用 \`<h2>\` 包装，英文用 \`text-sm uppercase tracking-wider\` 作为 subtitle

### 视觉质量
- [ ] CSS 变量定义为配色: \`:root { --bg; --accent; --text; }\`
- [ ] Hero 有背景装饰（粒子/星空/光晕/网格 — 至少1种）
- [ ] 有玻璃拟态卡片: \`background: rgba(255,255,255,0.03); backdrop-filter: blur(10px); border-radius: 16px;\`
- [ ] 至少一处渐变文字标题: \`background: linear-gradient(); -webkit-background-clip: text;\`
- [ ] 导航栏固定定位 + ScrollTrigger 控制 scrolled 状态

### 响应式
- [ ] \`@media (max-width: 768px)\` 适配移动端
- [ ] 移动端面板内边距缩小，字号缩小，网格列数减少`
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
      `📚 知识库就绪: ${this.knowledgeBase.length} 个组件, ` +
      `约 ${estimateTokens(this.knowledgeBase)} tokens`
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
      
      const response = await this.client.post('/chat/completions', {
        model,
        messages: params.messages,
        temperature: params.temperature || 0.7,
        max_tokens: params.maxTokens || 2000,
        stream: params.stream || false
      }, {
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
    console.log(`\n📊 ========== 批量模板分析 (共 ${templates.length} 个) ==========`)

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
        console.log(`  ✅ ${tmpl.label}: ${result.panels.length} 个面板, ${result.panels.reduce((s, p) => s + p.recommendedComponents.length, 0)} 个推荐`)
      } catch (e) {
        console.error(`  ❌ ${tmpl.label}:`, e)
      }
    }

    // 并发执行
    const workers = Array.from({ length: concurrency }, () => processNext.call(this))
    await Promise.all(workers)

    console.log(`📊 批量分析完成: ${results.size}/${templates.length}`)
    return results
  }

  /**
   * V2.0 方案一：端到端代码生成引擎
   *
   * 输入自然语言描述 → AI 自动选组件 → 生成完整网站代码 → 可预览的 HTML
   *
   * 两种模式：
   * - 'single-html': 生成包含 CDN 依赖的单文件 HTML，可直接在 iframe 预览
   * - 'multi-file': 生成 React/Vue 项目多文件代码
   *
   * @example
   * const result = await aiService.generateWebsiteE2E({
   *   description: '做一个赛博朋克风格的游戏公司官网',
   *   visualStyle: 'cyber',
   *   mode: 'single-html'
   * })
   * // result.html 可直接放入 iframe srcdoc
   */
  async generateWebsiteE2E(
    request: WebsiteE2ERequest,
    onStream?: E2EStreamCallback
  ): Promise<WebsiteE2EResponse> {
    console.log('\n🚀 ========== 端到端代码生成 (V2.0 方案一) ==========')
    console.log('需求描述:', request.description)
    console.log('模式:', request.mode || 'single-html')

    const kb = await this.initKnowledgeBase()
    const componentCatalog = formatKnowledgeForAI(kb)
    const framework = request.framework || 'react'
    const mode = request.mode || 'single-html'

    // 构建组件知识库摘要（紧凑格式）
    const componentSummary = kb.map(k =>
      `|${k.name}|${k.category}|${k.complexity}|${k.visualTags}|${k.sceneTags}|${k.summary}|`
    ).join('\n')

    // === 模板结构信息 ===
    let templateContext = ''
    if (request.recommendedComponents?.panels?.length) {
      const compMap = request.recommendedComponents
      templateContext = `
## 模板结构（${compMap.templateLabel}）
- 滚动模式: ${compMap.scrollPattern}
- 视觉风格: ${compMap.visualStyle}
- 适用场景: ${compMap.targetScenes.join('、')}

### 面板与推荐组件：
${compMap.panels.map(p =>
  `**面板${p.panelIndex + 1} - ${p.panelName}** (${p.panelPurpose})
  推荐: ${p.recommendedComponents.map(c => `${c.name}(匹配度${Math.round(c.confidence * 100)}%)`).join('、')}
  备选: ${p.recommendedComponents.flatMap(c => c.alternatives).join('、')}`
).join('\n\n')}`
    }

    // === System Prompt（强化版 V2：Few-Shot×2 + 代码模式 + 真实组件 JS + 质量自检清单）===
    const componentCodePatterns = this.getComponentCodePatterns()
    const fewShotExample = this.getFewShotExample()
    const fewShotExample2 = this.getFewShotExample2()
    const componentJSPatterns = this.getComponentJSPatterns()
    const qualityChecklist = this.getQualityChecklist()

    const systemPrompt = `你是顶级全栈前端开发专家 + GSAP 动画大师。你的任务是：根据用户需求，生成一个完整的、视觉震撼、可直接运行的网站。

---

${fewShotExample}

---

${fewShotExample2}

---

${componentCodePatterns}

---

${componentJSPatterns}

---

## 组件知识库（全部${kb.length}个GSAP动画组件参考）

|组件名|类别|复杂度|视觉标签|场景标签|简介|
|---|---|---|---|---|---|
${componentSummary}

> 上面组件库供你参考组件名和场景。实际生成时，你需要用原生 JS + GSAP 手写实现这些动画效果。

---

${templateContext}

---

## 核心生成要求

### 技术栈（single-html 模式）
- 单文件 HTML，开头 \`<!DOCTYPE html>\`
- CDN: \`<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>\`
- CDN: \`<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>\`
- CDN: \`<script src="https://cdn.tailwindcss.com"></script>\`
- 所有 CSS/JS 内联，不使用 React/Vue

### GSAP 铁律
- 第一行必须 \`gsap.registerPlugin(ScrollTrigger)\`
- Hero 动画在 DOMContentLoaded 中立即执行，**不用 ScrollTrigger**
- 后续面板用 ScrollTrigger + toggleActions: 'play none none reverse'
- 动画用 gsap.fromTo 而非 from/to（精确控制起止状态）
- 大规模卡片用 gsap.utils.toArray + stagger delay

### 结构规范
- 每面板一个 \`<section class="panel"\` 容器，min-height: 100vh
- 面板内用 flex/grid 居中内容
- CSS 变量定义配色: \`:root { --bg; --accent; --text; }\`
- 所有动画元素类名加唯一后缀（如 -271）
- 5-7 个面板：Hero → Feature/About/Service → Gallery/Cases → Stats → Team → Contact/Footer

### 视觉震撼要点
- Hero 背景加粒子/星空/光晕装饰（绝对定位 + CSS animation）
- 每面板不同渐变背景区分章节
- 玻璃拟态卡片: \`background: rgba(255,255,255,0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.08);\`
- 渐变文字标题: \`background: linear-gradient(); -webkit-background-clip: text;\`
- 导航栏固定定位 + ScrollTrigger 控制背景透明度

### 图片资源
- 使用 Unsplash: https://images.unsplash.com/photo-XXXX?w=1920&q=80
- 随机 ID 用 realistic 的（如 photo-1517245386807-bb43f82c33c4）

### 代码完整性
- **绝不**使用 \`// ... 省略 ...\` 或占位符
- HTML 结构必须完整可渲染
- JS 动画逻辑必须完整可执行
- 输出代码总量至少 500 行（结构性完整网站不能太简短）

---

${qualityChecklist}

---

## 输出格式

首先输出组件选择 JSON（用 \`\`\`json 标记）：
{
  "selectedComponents": ["组件名1", "组件名2"],
  "reasoning": "为什么选这些组件（30-60字）",
  "panelStructure": "面板规划：Hero→About→Service→Stats→Contact"
}

然后输出完整代码（用 \`\`\`html 标记）。

**重要：在输出代码前，逐项检查上述质量自检清单，确保全部通过后再输出。不要输出任何额外解释文字（除了 JSON 块），直接输出可运行代码。**`

    // === User Prompt ===
    const userPrompt = `请根据以下需求生成完整网站代码：

## 项目信息
- 需求描述: ${request.description}
- 公司名称: ${request.companyInfo?.name || '未指定'}
- 行业: ${request.companyInfo?.industry || '未指定'}
- 业务描述: ${request.companyInfo?.description || '未指定'}
- 视觉风格: ${request.visualStyle || '由AI根据描述自行判断'}
- 配色偏好: ${request.colorPreference || '由AI自行设计'}

## 生成指令
1. 先输出组件选择 JSON
2. 再输出${mode === 'single-html' ? '完整单文件HTML代码' : `${framework}项目代码`}\`
3. ${request.templateKey ? `参考模板结构"${request.templateKey}"的面板布局` : '自行规划面板结构（4-8个全屏面板）'}
4. 确保代码完整可直接运行，不使用占位符`

    // === 调用 AI（使用 E2E 推理模型，质量更高）===
    const e2eModel = this.config?.e2eModel || undefined
    if (e2eModel) {
      console.log('🤖 E2E 专用模型:', e2eModel)
    }
    const response = await this.chat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      maxTokens: mode === 'single-html' ? 24000 : 32000,
      stream: request.stream || false,
      timeout: 600000, // E2E生成耗时较长，10分钟超时
      model: e2eModel // 使用 E2E 推理模型（如 deepseek-reasoner）
    })

    if (!response.success || !response.data) {
      throw new Error(response.error || '代码生成失败')
    }

    const content = response.data.content

    // === 解析响应 ===
    // 1. 提取组件选择 JSON
    let selectedComponents: string[] = []
    let reasoning = ''

    const jsonMatch = content.match(/```json\s*\n?([\s\S]*?)```/)
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1])
        selectedComponents = parsed.selectedComponents || []
        reasoning = parsed.reasoning || ''
      } catch { /* ignore */ }
    }

    // 2. 提取代码（从 JSON 块之后的内容中提取）
    let code = ''
    const afterJson = content.replace(/```json[\s\S]*?```/, '').trim()

    // 优先匹配带语言标签的代码块
    const codeMatch = afterJson.match(/```(?:html|tsx|jsx|vue|javascript|js|css|scss)\s*\n?([\s\S]*?)```/)
    if (codeMatch) {
      code = codeMatch[1].trim()
    } else {
      // 兜底：匹配第一个无标签代码块
      const fallbackMatch = afterJson.match(/```\s*\n?([\s\S]*?)```/)
      if (fallbackMatch) {
        code = fallbackMatch[1].trim()
      } else {
        code = afterJson
      }
    }

    console.log('✅ 组件选择:', selectedComponents.length, '个')
    console.log('代码长度:', code.length, '字符')

    // === 质量校验 ===
    const validation = this.validateGeneratedCode(code)
    if (validation.issues.length > 0) {
      console.warn('⚠️ 代码质量校验未通过:', validation.issues)
    }
    if (validation.warnings.length > 0) {
      console.warn('⚡ 代码质量建议:', validation.warnings)
    }
    console.log(`📊 质量评分: ${validation.score}/100 (${validation.passed ? '✅ 通过' : '❌ 不通过'})`)

    if (mode === 'single-html') {
      return {
        mode: 'single-html',
        html: code,
        selectedComponents,
        reasoning
      }
    } else {
      const files = extractFilesFromResponse(content)
      return {
        mode: 'multi-file',
        files,
        selectedComponents,
        reasoning
      }
    }
  }

  /**
   * V2.0: AI 对话修改代码
   * 基于当前代码 + 用户修改指令，生成更新后的完整代码
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
    }
  ): Promise<{
    html?: string
    explanation?: string
  }> {
    console.log('\n🔧 ========== AI 修改代码 ==========')
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

    const response = await this.chat({
      messages: [
        { role: 'system', content: systemPrompt },
        ...historyMessages,
        { role: 'user', content: `## 当前代码\n\n\`\`\`html\n${request.currentCode.substring(0, 60000)}\n\`\`\`\n\n## 修改需求\n\n${request.instruction}\n\n请输出修改后的完整代码。` }
      ],
      temperature: 0.2,
      maxTokens: 24000,
      stream: false,
      timeout: 600000
    })

    if (!response.success || !response.data) {
      throw new Error(response.error || '代码修改失败')
    }

    const content = response.data.content

    // 提取解释（代码块之前的内容）
    let explanation = ''
    const codeBlockIdx = content.indexOf('```html')
    if (codeBlockIdx > 0) {
      explanation = content.substring(0, codeBlockIdx).trim()
    } else {
      const codeBlockIdx2 = content.indexOf('```')
      if (codeBlockIdx2 > 0) {
        explanation = content.substring(0, codeBlockIdx2).trim()
      }
    }
    if (!explanation) {
      explanation = content.split('\n').filter(l => l.trim() && !l.startsWith('```')).slice(0, 2).join(' ')
    }

    // 提取代码块
    const codeMatch = content.match(/```html\s*\n?([\s\S]*?)```/)
    let code = ''
    if (codeMatch) {
      code = codeMatch[1].trim()
    } else {
      const fallbackMatch = content.match(/```\s*\n?([\s\S]*?)```/)
      code = fallbackMatch ? fallbackMatch[1].trim() : content.trim()
    }

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
  validateGeneratedCode(code: string): {
    passed: boolean
    score: number // 0-100
    issues: string[]
    warnings: string[]
  } {
    const issues: string[] = []
    const warnings: string[] = []
    let checks = 0
    let passed = 0

    // 1. DOCTYPE
    checks++; if (/<!DOCTYPE\s+html/i.test(code)) passed++
    else issues.push('缺少 <!DOCTYPE html> 声明')

    // 2. GSAP CDN 三件套
    checks++; if (code.includes('gsap.min.js')) passed++
    else issues.push('缺少 GSAP CDN 引入')

    // 3. ScrollTrigger
    checks++; if (code.includes('ScrollTrigger.min.js')) passed++
    else issues.push('缺少 ScrollTrigger CDN 引入')

    // 4. Tailwind CDN
    checks++; if (code.includes('tailwindcss')) passed++
    else issues.push('缺少 Tailwind CSS CDN 引入')

    // 5. registerPlugin ScrollTrigger
    checks++; if (/gsap\.registerPlugin\s*\(\s*ScrollTrigger\s*\)/.test(code)) passed++
    else issues.push('未调用 gsap.registerPlugin(ScrollTrigger)')

    // 6. 代码量 >= 500 行
    const lines = code.split('\n').length
    checks++
    if (lines >= 500) passed++
    else if (lines >= 300) { passed++; warnings.push(`代码仅 ${lines} 行，建议 >= 500 行以包含完整多面板内容`) }
    else { issues.push(`代码仅 ${lines} 行，远低于 500 行最低标准`) }

    // 7. 至少 5 个全屏面板
    const sectionCount = (code.match(/<section\b/gi) || []).length
    checks++
    if (sectionCount >= 5) passed++
    else if (sectionCount >= 3) { passed++; warnings.push(`仅 ${sectionCount} 个 <section> 面板，建议 >= 5 个`) }
    else { issues.push(`仅 ${sectionCount} 个 <section> 面板，最少需要 5 个`) }

    // 8. ScrollTrigger.refresh()
    checks++; if (/ScrollTrigger\.refresh\s*\(\)/.test(code)) passed++
    else warnings.push('未调用 ScrollTrigger.refresh()，可能在动态内容后需要刷新')

    // 9. 无省略号/占位符
    checks++; if (!/\/\/\s*\.{3}/.test(code) && !/<!--\s*\.{3}/.test(code)) passed++
    else issues.push('存在省略号或占位符 (...)，代码不完整')

    // 10. HTML 闭合检查
    const openHtml = (code.match(/<html/gi) || []).length
    const closeHtml = (code.match(/<\/html>/gi) || []).length
    checks++; if (closeHtml > 0) passed++
    else warnings.push('缺少 </html> 闭合标签')

    const score = Math.round((passed / checks) * 100)

    return {
      passed: issues.length === 0,
      score,
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
  const regex = /```(?:tsx|jsx|typescript|javascript|ts|js|css|scss|html)?\s*(?:\/\/\s*)?(.+?\.\w+)?\n([\s\S]*?)```/g
  let match

  while ((match = regex.exec(content)) !== null) {
    const path = match[1]?.trim() || `component_${files.length + 1}.tsx`
    const code = match[2].trim()
    files.push({
      path,
      content: code,
      description: ''
    })
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
