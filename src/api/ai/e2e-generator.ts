/**
 * E2E 代码生成引擎 V3.0 — 全面重构
 *
 * 架构设计原则（参考 Claude Code / Cursor 底层设计）：
 *   1. 流式原生输出：HTML 直接流式推送，绝不 JSON 包裹
 *   2. 分阶段生成：Plan → Generate → Assemble → Validate
 *   3. 上下文智能裁剪：system prompt < 8000 tokens，按需注入知识
 *   4. 加权质量评分：内容完整性 40% + 结构规范 30% + 动画质量 20% + 额外加分 10%
 *   5. 自适应重试：只重试失败的部分（面板级别），而非全量重试
 *   6. 多模型适配：自动检测模型能力，调整 maxTokens 和 chunk 大小
 *
 * @author E2E Gen V3.0
 */

import type { ComponentKnowledge } from './component-knowledge-builder'

// ====================== 类型定义 ======================

/** 面板规划 */
export interface PanelPlan {
  id: string
  name: string // Hero / About / Products / Team / Stats / Contact / Footer 等
  purpose: string // 一句话描述用途
  layoutMode: 'hero-fullscreen' | 'split-left-right' | 'grid-cards' | 'centered-text' | 'form-dual-column' | 'faq-list' | 'stats-grid' | 'masonry-grid' | 'testimonials-grid'
  componentHints: string[] // 参考组件名（来自知识库，供 AI 参考）
  estimatedLines: number // 预估行数
}

/** 风格选择结果 */
export interface StyleSelection {
  styleId: number // 1-11
  styleName: string
  cssVariables: string // 完整的 :root { ... } CSS 块
  typographyScale: string // 排版说明
  spacingSystem: string // 间距系统
}

/** 生成阶段 */
export type GenerationPhase =
  | 'planning'     // 规划阶段
  | 'generating'   // 生成阶段
  | 'assembling'   // 组装阶段
  | 'validating'   // 校验阶段
  | 'done'         // 完成
  | 'error'        // 错误

/** 流式回调 */
export type E2EStreamCallback = (chunk: {
  type: 'phase' | 'code' | 'panel' | 'components' | 'done' | 'error'
  phase?: GenerationPhase
  content?: string
  panelIndex?: number
  panelName?: string
  data?: any
}) => void

/** 模板推荐结果（精简版，仅保留生成所需字段） */
export interface TemplateRecommendation {
  scrollPattern?: string
  visualStyle?: string
  targetScenes?: string[]
  panels?: Array<{ panelIndex: number; panelName: string; panelPurpose: string }>
}

/** 生成请求参数 */
export interface GenerateRequest {
  description: string
  companyInfo?: { name?: string; industry?: string; description?: string }
  visualStyle?: string
  colorPreference?: string
  templateKey?: string
  templatePanels?: Array<{ index: number; name: string; purpose: string }>
  recommendedComponents?: TemplateRecommendation
  /** 模板 .vue 源码（选择模板后传入，直接作为脚手架生成） */
  templateSource?: string
  framework?: 'react' | 'vue'
  mode?: 'single-html' | 'multi-file'
}

/** 生成结果 */
export interface GenerateResult {
  html: string
  selectedComponents: string[]
  reasoning: string
  panelStructure: string
  qualityReport: QualityReport
}

/** 质量报告 */
export interface QualityReport {
  passed: boolean
  score: number // 0-100
  issues: string[] // 严重问题
  warnings: string[] // 建议改进
  details: {
    contentScore: number // 内容完整性 (40分)
    structureScore: number // 结构规范 (30分)
    animationScore: number // 动画质量 (20分)
    bonusScore: number // 额外加分 (10分)
  }
}

/** AI 调用函数类型 */
export type ChatFunction = (params: {
  messages: Array<{ role: string; content: string }>
  temperature?: number
  maxTokens?: number
  stream?: boolean
  timeout?: number
  model?: string
}) => Promise<{ success: boolean; data?: { content: string }; error?: string; usage?: any }>

export type StreamFunction = (
  params: {
    messages: Array<{ role: string; content: string }>
    temperature?: number
    maxTokens?: number
    timeout?: number
    model?: string
  },
  onChunk: (chunk: { content: string; finishReason?: string }) => void
) => Promise<{ success: boolean; data?: { content: string }; error?: string; usage?: any }>

// ====================== 设计风格库（紧凑版，仅注入匹配的） ======================

const DESIGN_STYLES: Record<number, {
  name: string
  match: string[] // 匹配关键词
  cssVars: string
}> = {
  1: {
    name: '高端黑金',
    match: ['高端', '奢侈', '金融', '企业', '总裁', '黑金', '奢华'],
    cssVars: `--bg-primary: #0a0a0a; --bg-secondary: #111111; --accent-primary: #d4a853; --accent-secondary: #b8960c; --text-primary: #f5f0e8; --text-secondary: #a89878; --card-bg: rgba(212,168,83,0.04); --card-border: rgba(212,168,83,0.12); --gradient-hero: linear-gradient(135deg, #0a0a0a 0%, #1a1410 50%, #0a0a0a 100%);`
  },
  2: {
    name: '赛博紫电',
    match: ['游戏', '科技', 'web3', '区块链', 'AI', '赛博', '霓虹', '电竞', '黑客'],
    cssVars: `--bg-primary: #050510; --bg-secondary: #0a0a1a; --accent-primary: #a855f7; --accent-secondary: #06b6d4; --text-primary: #e8e0ff; --text-secondary: #9484c8; --card-bg: rgba(168,85,247,0.05); --card-border: rgba(168,85,247,0.15); --gradient-hero: linear-gradient(135deg, #050510 0%, #0d0d2b 50%, #050510 100%);`
  },
  3: {
    name: '清爽科技蓝',
    match: ['SaaS', 'API', '云', '企业服务', 'B2B', '平台', '科技蓝', '数据'],
    cssVars: `--bg-primary: #0f172a; --bg-secondary: #1e293b; --accent-primary: #3b82f6; --accent-secondary: #06b6d4; --text-primary: #f1f5f9; --text-secondary: #94a3b8; --card-bg: rgba(59,130,246,0.06); --card-border: rgba(59,130,246,0.1); --gradient-hero: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);`
  },
  4: {
    name: '自然有机绿',
    match: ['环保', '自然', '健康', '农业', '绿色', '生态', '有机'],
    cssVars: `--bg-primary: #0a1410; --bg-secondary: #0f1f18; --accent-primary: #22c55e; --accent-secondary: #a3e635; --text-primary: #e8f5e9; --text-secondary: #81a889; --card-bg: rgba(34,197,94,0.05); --card-border: rgba(34,197,94,0.1); --gradient-hero: linear-gradient(135deg, #0a1410 0%, #0d1f16 50%, #0a1410 100%);`
  },
  5: {
    name: '极简白灰',
    match: ['设计', '创意', '作品集', '极简', '白色', '留白', '简约'],
    cssVars: `--bg-primary: #ffffff; --bg-secondary: #f8fafc; --accent-primary: #0f172a; --accent-secondary: #6366f1; --text-primary: #1e293b; --text-secondary: #64748b; --card-bg: rgba(15,23,42,0.03); --card-border: rgba(15,23,42,0.06); --gradient-hero: linear-gradient(135deg, #ffffff 0%, #f1f5f9 50%, #ffffff 100%);`
  },
  6: {
    name: '温暖日落橙',
    match: ['电商', '消费', '餐饮', '社媒', '暖色', '橙色', '活力', '美食'],
    cssVars: `--bg-primary: #1c1917; --bg-secondary: #292524; --accent-primary: #f97316; --accent-secondary: #fbbf24; --text-primary: #fef3c7; --text-secondary: #b8a68e; --card-bg: rgba(249,115,22,0.06); --card-border: rgba(249,115,22,0.12); --gradient-hero: linear-gradient(135deg, #1c1917 0%, #2d2010 50%, #1c1917 100%);`
  },
  7: {
    name: '动感渐变多彩',
    match: ['音乐', '娱乐', '节日', '活动', '潮流', '炫彩', '派对'],
    cssVars: `--bg-primary: #0f0f1a; --bg-secondary: #1a1a2e; --accent-primary: #ec4899; --accent-secondary: #8b5cf6; --accent-tertiary: #06b6d4; --text-primary: #f5f3ff; --text-secondary: #b4a8d4; --card-bg: rgba(236,72,153,0.05); --card-border: rgba(236,72,153,0.12); --gradient-hero: linear-gradient(135deg, #0f0f1a 0%, #1a0f2e 30%, #0f1a2e 60%, #0f0f1a 100%);`
  },
  8: {
    name: '纯净白渐变',
    match: ['医疗', '美容', '教育', '金融科技', 'FinTech', '清新', '干净'],
    cssVars: `--bg-primary: #ffffff; --bg-secondary: #f0f4ff; --accent-primary: #6366f1; --accent-secondary: #a78bfa; --text-primary: #1e293b; --text-secondary: #64748b; --card-bg: rgba(99,102,241,0.04); --card-border: rgba(99,102,241,0.08); --gradient-hero: linear-gradient(135deg, #ffffff 0%, #eef2ff 40%, #f5f3ff 100%);`
  },
  9: {
    name: '暖白活力',
    match: ['宠物', '母婴', '生活服务', '家庭', '温馨', '可爱', '猫咪', '狗狗', '动物'],
    cssVars: `--bg-primary: #fef9f0; --bg-secondary: #fff5e6; --accent-primary: #f59e0b; --accent-secondary: #f97316; --text-primary: #1e293b; --text-secondary: #64748b; --card-bg: rgba(255,255,255,0.85); --card-border: rgba(245,158,11,0.15); --gradient-hero: linear-gradient(135deg, #fef9f0 0%, #ffedd5 50%, #fef9f0 100%);`
  },
  10: {
    name: '北欧浅灰',
    match: ['建筑', '家具', '高端设计', '北欧', '性冷淡', '灰调'],
    cssVars: `--bg-primary: #f5f2ed; --bg-secondary: #ede8e0; --accent-primary: #2d2d2d; --accent-secondary: #8b7355; --text-primary: #1a1a1a; --text-secondary: #6b6b6b; --card-bg: rgba(255,255,255,0.6); --card-border: rgba(0,0,0,0.06); --gradient-hero: linear-gradient(135deg, #f5f2ed 0%, #e8e2d8 50%, #f5f2ed 100%);`
  },
  11: {
    name: '渐变活力多彩',
    match: ['运动', '健身', '年轻人', '潮流品牌', '时尚', '运动品牌'],
    cssVars: `--bg-primary: #ffffff; --bg-secondary: #faf5ff; --accent-primary: #ec4899; --accent-secondary: #8b5cf6; --accent-tertiary: #f59e0b; --text-primary: #1e293b; --text-secondary: #64748b; --card-bg: rgba(255,255,255,0.9); --card-border: rgba(236,72,153,0.12); --gradient-hero: linear-gradient(135deg, #ffffff 0%, #fdf2f8 30%, #f5f3ff 60%, #ffffff 100%);`
  }
}

// ====================== GSAP 代码模式（紧凑版） ======================

const GSAP_PATTERNS = `
### GSAP 铁律
- 首行: gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
- Hero在DOMContentLoaded立即执行，不用ScrollTrigger
- 面板用 ScrollTrigger + toggleActions: 'play none none reverse'
- 用 gsap.fromTo 精确控制起止状态
- 卡片序列: gsap.utils.toArray + forEach + stagger

### 核心模式
\`\`\`js
// Hero入场
gsap.fromTo('.hero-title',{y:100,opacity:0},{y:0,opacity:1,duration:1,ease:'power3.out'})

// 卡片stagger
gsap.utils.toArray('.card').forEach((c,i)=>gsap.fromTo(c,{y:120,opacity:0,scale:0.9},{y:0,opacity:1,scale:1,duration:0.7,delay:i*0.12,scrollTrigger:{trigger:c,start:'top 88%',toggleActions:'play none none reverse'}}))

// 数字递增
gsap.utils.toArray('.counter').forEach(el=>{let t=parseInt(el.dataset.target),o={v:0};gsap.to(o,{v:t,duration:2.5,scrollTrigger:{trigger:el,start:'top 75%'},onUpdate:()=>el.textContent=Math.round(o.v).toLocaleString()})})

// 导航ScrollTrigger
ScrollTrigger.create({start:100,onUpdate:s=>navbar.classList.toggle('scrolled',s.scroll()>100)})

// 导航平滑跳转 (需ScrollToPlugin CDN)
gsap.to(window,{duration:1.2,scrollTo:{y:target,offsetY:80},ease:'power3.inOut'})

// Canvas粒子 (DRY函数)
function createParticles(canvasId,count,color){var c=document.getElementById(canvasId),ctx=c.getContext('2d');c.width=window.innerWidth;c.height=window.innerHeight;var p=[];for(var i=0;i<count;i++)p.push({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*3+1,vx:(Math.random()-0.5)*0.5,vy:(Math.random()-0.5)*0.5});(function draw(){ctx.clearRect(0,0,c.width,c.height);for(var j=0;j<p.length;j++){p[j].x+=p[j].vx;p[j].y+=p[j].vy;if(p[j].x<0||p[j].x>c.width)p[j].vx*=-1;if(p[j].y<0||p[j].y>c.height)p[j].vy*=-1;ctx.beginPath();ctx.arc(p[j].x,p[j].y,p[j].r,0,Math.PI*2);ctx.fillStyle='rgba('+color+',0.3)';ctx.fill()}requestAnimationFrame(draw)})()}
\`\`\`

### 交互
- .glass-card:hover { transform:translateY(-6px); box-shadow:0 24px 48px rgba(0,0,0,0.4); }
- FAQ 折叠用 classList.toggle('open') + max-height 动画
- 表单 submit: e.preventDefault() + 显示成功 + 3秒后隐藏 + form.reset()
`

// ====================== 模板模式：源码直接注入 ======================
// 模板 .vue 源文件由外部加载（src/api/ai/index.ts 通过 import.meta.glob 预加载）
// 选择模板后直接把源码喂给 AI → AI 做 Vue→HTML 转换 + 内容替换
// 无需任何文字描述的"行为模式"，真实代码就是最好的文档

// ====================== 核心引擎 ======================

export class E2EGenerator {
  private chatFn: ChatFunction
  private streamFn: StreamFunction
  private knowledgeBase: ComponentKnowledge[] | null = null
  private e2eModel?: string

  constructor(
    chatFn: ChatFunction,
    streamFn: StreamFunction,
    options?: { knowledgeBase?: ComponentKnowledge[]; e2eModel?: string }
  ) {
    this.chatFn = chatFn
    this.streamFn = streamFn
    this.knowledgeBase = options?.knowledgeBase || null
    this.e2eModel = options?.e2eModel
  }

  /** 更新知识库 */
  setKnowledgeBase(kb: ComponentKnowledge[]) {
    this.knowledgeBase = kb
  }

  // ==================== 主入口 ====================

  async generate(
    request: GenerateRequest,
    onStream?: E2EStreamCallback
  ): Promise<GenerateResult> {
    console.log('\n🚀 ========== E2E V3.0 代码生成 ==========')
    console.log('需求:', request.description)
    console.log('风格:', request.visualStyle || '自动匹配')

    const ctx = this.buildContext(request)

    // ===== 🆕 模板模式：直接基于模板源码生成 =====
    if (request.templateSource && request.templateSource.length > 300) {
      console.log('📦 模板模式：基于 ' + (ctx.templateKey || 'unknown') + ' 源码生成')
      return this.generateFromTemplate(ctx, request, onStream)
    }

    // ===== Phase 1: Plan =====
    this.emitPhase('planning', onStream)
    const panelPlans = await this.phasePlan(ctx)
    console.log('📋 面板规划:', panelPlans.map(p => p.name).join(' → '))
    onStream?.({ type: 'components', data: { panels: panelPlans.map(p => ({ name: p.name, purpose: p.purpose })) } })

    // ===== Phase 2: Generate =====
    this.emitPhase('generating', onStream)
    const htmlChunks: string[] = []
    let selectedComps: string[] = []

    for (let i = 0; i < panelPlans.length; i++) {
      const panel = panelPlans[i]
      console.log(`📄 生成面板 ${i + 1}/${panelPlans.length}: ${panel.name}`)
      onStream?.({ type: 'panel', panelIndex: i, panelName: panel.name, content: '' })

      // 面板级重试：如果输出过短或空，重试最多2次
      let chunk = await this.phaseGeneratePanel(ctx, i, panelPlans, i === panelPlans.length - 1)
      let retryCount = 0
      while (retryCount < 2 && chunk.html.length < 100) {
        console.warn(`⚠️ 面板 ${panel.name} 输出过短(${chunk.html.length}字符)，重试 ${retryCount + 1}/2...`)
        chunk = await this.phaseGeneratePanel(ctx, i, panelPlans, i === panelPlans.length - 1, retryCount + 1)
        retryCount++
      }
      if (chunk.html.length < 100) {
        console.warn(`❌ 面板 ${panel.name} 重试${retryCount}次仍不足，使用降级面板`)
        chunk = { html: this.generateFallbackPanel(panel, ctx), componentNames: [] }
      }
      htmlChunks.push(chunk.html)
      selectedComps = [...selectedComps, ...chunk.componentNames]

      // 流式推送
      onStream?.({ type: 'code', content: htmlChunks.join('\n') })
    }

    // ===== Phase 3: Assemble =====
    this.emitPhase('assembling', onStream)
    const fullHtml = this.phaseAssemble(ctx, htmlChunks)

    // ===== Phase 4: Validate =====
    this.emitPhase('validating', onStream)
    const quality = this.phaseValidate(fullHtml)

    console.log(`📊 质量评分: ${quality.score}/100 (${quality.passed ? '✅' : '❌'})`)
    if (quality.issues.length) console.warn('⚠️ 问题:', quality.issues)

    onStream?.({ type: 'done' })

    return {
      html: fullHtml,
      selectedComponents: [...new Set(selectedComps)],
      reasoning: `基于"${request.description}"自动选用${panelPlans.length}面板结构: ${panelPlans.map(p => p.name).join('→')}`,
      panelStructure: panelPlans.map(p => `${p.name}(${p.purpose})`).join(' → '),
      qualityReport: quality
    }
  }

  // ==================== 🆕 模板模式：基于源码生成 ====================

  private async generateFromTemplate(
    ctx: ReturnType<typeof this.buildContext>,
    request: GenerateRequest,
    onStream?: E2EStreamCallback
  ): Promise<GenerateResult> {
    this.emitPhase('generating', onStream)
    const templateSource = request.templateSource!

    const templatePrompt = `你是顶级全栈前端开发者。下面的 Vue SFC 模板是一个**已经完整可工作的页面脚手架**，包含滚动引擎、动画逻辑、交互组件。

你的任务：
1. **Vue→原生HTML/JS转换**：将模板转成独立的 HTML 文件
2. **内容业务化**：替换占位内容为真实的品牌内容
3. **引擎完整保留**：所有滚动/动画代码是经过测试的正确代码，逐字保留

## 🔴 Vue → HTML/JS 转换规则
- \`<script setup>\` → \`<script>\` 块
- \`import { onMounted } from 'vue'\` → 删除
- \`onMounted(() => { ... })\` → \`document.addEventListener('DOMContentLoaded', () => { ... })\`
- \`import gsap from 'gsap'\` / \`import { ScrollTrigger } from 'gsap/ScrollTrigger'\` 等 → 删除（CDN 已加载），在 \`<script>\` 首行用 \`gsap.registerPlugin(ScrollTrigger)\`
- Vue \`ref()\` / \`reactive()\` → 普通 JS 变量
- \`v-for\` → for 循环生成字符串或 createElement
- \`:class\` / \`:style\` → 用 JS 直接设置 className / style
- \`@click\` / \`@scroll\` → \`onclick\` / \`addEventListener('click', ...)\`
- \`nextTick\` → \`requestAnimationFrame\` 或 \`setTimeout(fn, 0)\`

## 🔴 引擎代码逐字保留规则（最重要）
- **所有 GSAP/ScrollTrigger 逻辑是经过测试的正确代码，必须逐字保留**
- 只移除 Vue 包装语法（ref、onMounted、import），核心动画逻辑（duration、ease、stagger、scrollTrigger参数、snap、scrub）**一个字符都不改**
- CSS class/id/DOM层级保持原样
- 模板的 \`<template>\` HTML 结构保留（内容替换），\`<script setup>\` 转 \`<script>\`，\`<style>\` 保留

## 🎨 内容替换
- 目标品牌: **${ctx.companyName}** | 行业: **${ctx.industry || '通用'}** | 业务: **${ctx.bizDesc || '待定'}**
- 配色变量: ${ctx.style.styleName}
${ctx.style.cssVariables}
- 占位文本 → 真实品牌内容
- 占位图（emoji/纯色/Unsplash默认） → 贴合行业的 Unsplash 图片或 CSS 渐变

## 📤 输出格式
- 完整的独立 HTML 文件（<!DOCTYPE html> → </html>）
- <head> 保留必要的 meta + GSAP CDN + Google Fonts (Inter)
- 禁止 markdown包裹/JSON包装/解释文字
- 直接输出 HTML 代码

---

## 📦 模板源码（Vue SFC 脚手架）

\`\`\`vue
${templateSource}
\`\`\`

---

基于上面的模板脚手架，生成适配 **${ctx.companyName}** 的独立 HTML 文件。滚动引擎代码全部保留，内容全面替换。`

    try {
      console.log('📦 发送模板转换请求...')
      const resp = await this.chatFn({
        messages: [
          { role: 'system', content: '你是 Vue → HTML 转换专家。基于模板脚手架生成完整网站。直接输出 HTML 代码，不要 markdown/JSON/解释。' },
          { role: 'user', content: templatePrompt }
        ],
        temperature: 0.2,
        maxTokens: 16000
      })

      if (!resp.success) {
        console.warn('⚠️ 模板模式失败，回退到标准生成:', resp.error)
        return this.generateStandardFallback(request, onStream)
      }

      let rawHtml = resp.data?.content || ''
      // 清理可能的外壳
      rawHtml = rawHtml.replace(/^```html?\s*/i, '').replace(/```\s*$/i, '')
      // 如果没有 DOCTYPE，补充
      if (!/<doctype/i.test(rawHtml)) {
        rawHtml = '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n<meta charset="UTF-8">\n' +
          '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
          '</head>\n<body>\n' + rawHtml + '\n</body>\n</html>'
      }

      onStream?.({ type: 'code', content: rawHtml })
      onStream?.({ type: 'done' })

      const quality = this.phaseValidate(rawHtml)
      console.log(`📊 质量评分: ${quality.score}/100 (${quality.passed ? '✅' : '❌'})`)

      return {
        html: rawHtml,
        selectedComponents: [],
        reasoning: `基于模板 ${ctx.templateKey || 'unknown'} 源码转换而成`,
        panelStructure: ctx.templatePanels?.map(p => p.name || p.purpose).join(' → ') || '模板结构',
        qualityReport: quality
      }
    } catch (e: any) {
      console.error('❌ 模板生成失败:', e.message)
      return this.generateStandardFallback(request, onStream)
    }
  }

  /** 模板模式失败时的回退：标准逐面板生成 */
  private async generateStandardFallback(request: GenerateRequest, onStream?: E2EStreamCallback): Promise<GenerateResult> {
    const ctx = this.buildContext(request)
    const panelPlans = await this.phasePlan(ctx)
    const htmlChunks: string[] = []
    let selectedComps: string[] = []

    for (let i = 0; i < panelPlans.length; i++) {
      const panel = panelPlans[i]
      let chunk = await this.phaseGeneratePanel(ctx, i, panelPlans, i === panelPlans.length - 1)
      if (chunk.html.length < 100) {
        chunk = { html: this.generateFallbackPanel(panel, ctx), componentNames: [] }
      }
      htmlChunks.push(chunk.html)
      selectedComps = [...selectedComps, ...chunk.componentNames]
    }

    const fullHtml = this.phaseAssemble(ctx, htmlChunks)
    const quality = this.phaseValidate(fullHtml)
    onStream?.({ type: 'done' })

    return {
      html: fullHtml,
      selectedComponents: [...new Set(selectedComps)],
      reasoning: `回退到标准生成`,
      panelStructure: panelPlans.map(p => p.name).join(' → '),
      qualityReport: quality
    }
  }

  // ==================== 上下文构建 ====================

  private buildContext(request: GenerateRequest) {
    const desc = request.description
    const companyName = request.companyInfo?.name || '品牌'
    const industry = request.companyInfo?.industry || ''
    const bizDesc = request.companyInfo?.description || ''

    // 自动匹配风格
    const style = this.matchDesignStyle(
      request.visualStyle || desc + companyName + industry + bizDesc
    )

    // 组件摘要（紧凑）
    const compSummary = this.buildComponentSummary(desc, 15)

    const templateKey = request.templateKey || ''

    // 模板推荐结果→模板面板
    const recommendedPanels = request.recommendedComponents?.panels
    const templatePanels = (recommendedPanels && recommendedPanels.length > 0)
      ? recommendedPanels.map(p => ({
          index: p.panelIndex,
          name: p.panelName,
          purpose: p.panelPurpose
        }))
      : (request.templatePanels || [])

    return {
      description: desc,
      companyName,
      industry,
      bizDesc,
      style,
      compSummary,
      colorPreference: request.colorPreference || '',
      templateKey,
      templatePanels,
      paneCount: templatePanels.length
    }
  }

  private matchDesignStyle(text: string): StyleSelection {
    const lower = text.toLowerCase()

    // 宠物类专属优化
    if (/宠物|猫咪|狗狗|猫|狗|萌宠|小动物|伴侣动物/.test(lower)) {
      const s = DESIGN_STYLES[9]
      return this.buildStyleSelection(9, s)
    }

    // 关键词匹配
    for (const [id, style] of Object.entries(DESIGN_STYLES)) {
      for (const kw of style.match) {
        if (lower.includes(kw.toLowerCase())) {
          return this.buildStyleSelection(Number(id), style)
        }
      }
    }

    // 默认: 科技蓝
    const s = DESIGN_STYLES[3]
    return this.buildStyleSelection(3, s)
  }

  private buildStyleSelection(id: number, style: typeof DESIGN_STYLES[1]): StyleSelection {
    return {
      styleId: id,
      styleName: style.name,
      cssVariables: `:root {\n  ${style.cssVars}\n}`,
      typographyScale: 'H1:56-88px/fw700-900 | H2:36-52px/fw600 | H3:20-28px/fw600 | Body:16-18px/lh1.7 | Caption:13px/op0.6',
      spacingSystem: '8pt grid: margin{8,16,24,32,48,64,96} padding{16,20,24,32}(卡片) {64,80,120}(面板)'
    }
  }

  private buildComponentSummary(desc: string, maxCount: number): string {
    if (!this.knowledgeBase || this.knowledgeBase.length === 0) return ''

    // 按描述关键词筛选相关组件
    const keywords = desc.toLowerCase().split(/[\s,，、。]+/).filter(k => k.length > 1)
    const scored = this.knowledgeBase.map(k => {
      let score = 0
      const tags = (k.visualTags || '') + ' ' + (k.sceneTags || '')
      const lower = tags.toLowerCase()
      for (const kw of keywords) {
        if (lower.includes(kw)) score += 2
        if (k.summary?.toLowerCase().includes(kw)) score += 1
      }
      return { ...k, _score: score }
    })

    const top = scored.sort((a, b) => b._score - a._score).slice(0, maxCount)

    if (top.length === 0) return ''

    return '### 参考组件 (按场景匹配度排序)\n' +
      top.map(k => `- **${k.name}** [${k.complexity || '?'}] ${k.summary || ''}`).join('\n')
  }

  // ==================== Phase 1: Plan ====================

  private async phasePlan(ctx: ReturnType<typeof this.buildContext>): Promise<PanelPlan[]> {
    // 🔧 如果有模板推荐的面板结构(≥3个面板)，直接采用，不再让AI自主规划
    if (ctx.templatePanels && ctx.templatePanels.length >= 3) {
      console.log('📋 使用模板面板结构:', ctx.templatePanels.map(p => p.name).join(' → '))
      return ctx.templatePanels.map((p, i) => ({
        id: `panel-${i}`,
        name: p.name || `Panel${i + 1}`,
        purpose: p.purpose || '',
        layoutMode: this.inferLayoutMode(p.name),
        componentHints: [],
        estimatedLines: 70
      }))
    }

    const planPrompt = `你是企业官网架构师。分析以下需求，输出JSON格式的面板规划。

### 任务
分析需求并规划 7-10 个面板的完整企业官网结构。

### 需求
- 描述: "${ctx.description}"
- 公司: ${ctx.companyName}
- 行业: ${ctx.industry || '通用'}
- 业务: ${ctx.bizDesc || '待定'}
- 风格: ${ctx.style.styleName}

### 面板类型参考
Hero / About(Story) / Products(Services) / Features / Team / Testimonials / FAQ / Stats / Contact / Footer

### 要求
- Footer 是必选
- 至少 1 个差异化面板 (Team/Testimonials/FAQ，选2个更好)
- 面板有逻辑叙事线
- 每个面板给 layoutMode、purpose

### 输出格式 (纯JSON，无markdown)
{
  "panels": [
    {"name":"Hero","purpose":"品牌标语+主视觉+2个CTA","layoutMode":"hero-fullscreen","estimatedLines":80},
    {"name":"Story","purpose":"品牌故事左右分栏","layoutMode":"split-left-right","estimatedLines":60},
    ...
  ],
  "totalEstimatedLines": 650
}`

    try {
      const resp = await this.chatFn({
        messages: [
          { role: 'system', content: '你是企业官网架构师。只输出JSON，不要解释。' },
          { role: 'user', content: planPrompt }
        ],
        temperature: 0.3,
        maxTokens: 2000,
        model: this.e2eModel
      })

      if (resp.success && resp.data?.content) {
        const parsed = this.safeParseJson(resp.data.content)
        if (parsed?.panels && parsed.panels.length >= 4) {
          return parsed.panels.map((p: any, i: number) => ({
            id: `panel-${i}`,
            name: p.name || `Panel${i + 1}`,
            purpose: p.purpose || '',
            layoutMode: p.layoutMode || 'grid-cards',
            componentHints: [],
            estimatedLines: p.estimatedLines || 60
          }))
        }
      }
    } catch (e) {
      console.warn('Plan阶段失败，使用默认规划:', e)
    }

    // 默认面板规划
    return this.getDefaultPanels(ctx)
  }

  private getDefaultPanels(ctx: ReturnType<typeof this.buildContext>): PanelPlan[] {
    const isPet = /宠物|猫|狗|萌宠|动物/.test(ctx.description)
    if (isPet) {
      return [
        { id: 'panel-0', name: 'Hero', purpose: '品牌标语+萌宠主视觉+Canvas粒子+2个CTA按钮+滚动指示器', layoutMode: 'hero-fullscreen', componentHints: [], estimatedLines: 100 },
        { id: 'panel-1', name: 'Story', purpose: '品牌故事左右分栏：左侧大图+右侧文字+3个小特性卡片', layoutMode: 'split-left-right', componentHints: [], estimatedLines: 70 },
        { id: 'panel-2', name: 'Services', purpose: '4个宠物服务卡片网格：医疗/美容/寄养/训练，各有图标+描述+了解详情', layoutMode: 'grid-cards', componentHints: [], estimatedLines: 80 },
        { id: 'panel-3', name: 'Team', purpose: '4人兽医/美容师团队展示：头像+姓名+职位+简介+社交链接', layoutMode: 'testimonials-grid', componentHints: [], estimatedLines: 70 },
        { id: 'panel-4', name: 'Testimonials', purpose: '3条宠物主人真实评价：星级+评价文字+头像+姓名', layoutMode: 'testimonials-grid', componentHints: [], estimatedLines: 60 },
        { id: 'panel-5', name: 'Stats', purpose: '4个数据指标：服务宠物数/客户满意度/覆盖城市/经营年限，数字递增动画', layoutMode: 'stats-grid', componentHints: [], estimatedLines: 50 },
        { id: 'panel-6', name: 'FAQ', purpose: '5个常见问题折叠面板：领养/护理/价格/预约/售后', layoutMode: 'faq-list', componentHints: [], estimatedLines: 60 },
        { id: 'panel-7', name: 'Contact', purpose: '双栏：左侧5字段表单+右侧4项联系信息(地址/电话/邮箱/时间)', layoutMode: 'form-dual-column', componentHints: [], estimatedLines: 80 },
        { id: 'panel-8', name: 'Footer', purpose: '4列站点地图+版权+ICP备案+隐私/条款链接', layoutMode: 'grid-cards', componentHints: [], estimatedLines: 60 },
      ]
    }

    return [
      { id: 'panel-0', name: 'Hero', purpose: '品牌标语+主视觉+Canvas粒子+2CTA按钮+滚动指示器', layoutMode: 'hero-fullscreen', componentHints: [], estimatedLines: 100 },
      { id: 'panel-1', name: 'Story', purpose: '品牌故事左右分栏+左侧大图+右侧3个小特性卡片', layoutMode: 'split-left-right', componentHints: [], estimatedLines: 70 },
      { id: 'panel-2', name: 'Services', purpose: '4个服务卡片+图标+描述+详情', layoutMode: 'grid-cards', componentHints: [], estimatedLines: 80 },
      { id: 'panel-3', name: 'Team', purpose: '4人团队+头像+姓名+职位+社交链接', layoutMode: 'testimonials-grid', componentHints: [], estimatedLines: 70 },
      { id: 'panel-4', name: 'Testimonials', purpose: '3条客户评价+星级+评价文字+头像+姓名', layoutMode: 'testimonials-grid', componentHints: [], estimatedLines: 60 },
      { id: 'panel-5', name: 'FAQ', purpose: '5个常见问题折叠面板', layoutMode: 'faq-list', componentHints: [], estimatedLines: 60 },
      { id: 'panel-6', name: 'Stats', purpose: '4个数据指标+数字递增动画', layoutMode: 'stats-grid', componentHints: [], estimatedLines: 50 },
      { id: 'panel-7', name: 'Contact', purpose: '双栏表单+4项联系信息', layoutMode: 'form-dual-column', componentHints: [], estimatedLines: 80 },
      { id: 'panel-8', name: 'Footer', purpose: '4列站点地图+版权+ICP备案+隐私/条款', layoutMode: 'grid-cards', componentHints: [], estimatedLines: 60 },
    ]
  }

  /** 根据面板名推断布局模式 */
  private inferLayoutMode(name: string): PanelPlan['layoutMode'] {
    const modeMap: Record<string, PanelPlan['layoutMode']> = {
      hero: 'hero-fullscreen',
      about: 'split-left-right', story: 'split-left-right',
      products: 'grid-cards', services: 'grid-cards', features: 'grid-cards',
      team: 'testimonials-grid',
      testimonials: 'testimonials-grid',
      faq: 'faq-list',
      stats: 'stats-grid',
      contact: 'form-dual-column',
      footer: 'grid-cards'
    }
    return modeMap[name.toLowerCase()] || 'grid-cards'
  }

  // ==================== Phase 2: Generate Panel ====================

  private async phaseGeneratePanel(
    ctx: ReturnType<typeof this.buildContext>,
    index: number,
    allPanels: PanelPlan[],
    isLast: boolean,
    retryIndex: number = 0
  ): Promise<{ html: string; componentNames: string[] }> {
    const panel = allPanels[index]
    const isFirstPanel = index === 0
    const prevPanels = allPanels.slice(0, index)
    const nextPanels = allPanels.slice(index + 1)
    const totalPanels = allPanels.length

    // 紧凑 System Prompt (核心约束)
    const systemPrompt = `你是顶级GSAP动画全栈开发者。直接输出面板HTML/CSS/JS片段，**严格只输出body内的面板内容**。

## 🔴 禁止输出
- 禁止 <!DOCTYPE html>
- 禁止 <html> / </html>
- 禁止 <head>...</head>
- 禁止 <body> / </body>
- 禁止 <meta> / <title> / <link>
- 禁止 CDN script引用 (GSAP已在外部加载)
- 禁止 markdown包裹或JSON包装
- 禁止任何解释文字

## 规则
- 输出HTML片段 (<section id="panel-X"> 或 <div id="panel-X"> + <style> + <script>)
- 用 gsap.fromTo 精确控制动画
- 每面板独立渐变背景
- 有Canvas粒子用DRY函数
- ScrollTrigger + toggleActions: 'play none none reverse'
- 卡片stagger: gsap.utils.toArray + forEach + delay
- 禁止使用Tailwind类名，用内联style或<style>块
- 导航/布局用flex/grid + 内联style
${GSAP_PATTERNS}

${ctx.compSummary ? ctx.compSummary + '\n\n> 以上组件供参考效果，用原生JS+GSAP实现。' : ''}

## 输出格式
直接输出面板HTML，不要markdown，不要JSON，不要DOCTYPE。`

    // 构建上下文信息
    const contextParts: string[] = []

    if (isFirstPanel) {
      // 第一个面板需要：导航栏 + Hero + 全局样式
      contextParts.push(`## 项目信息
- 公司名: ${ctx.companyName}
- 行业: ${ctx.industry || '通用'}
- 配色: ${ctx.style.styleName}
${ctx.style.cssVariables}

### 需要输出的内容

**1. 全局样式 <style> (仅第一次):**
\`\`\`css
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Inter',system-ui,sans-serif; background:var(--bg-primary); color:var(--text-primary); overflow-x:hidden; }
.panel { min-height:100vh; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; }
.panel-inner { max-width:1200px; width:100%; margin:0 auto; padding:80px 40px; position:relative; z-index:1; }
.navbar { position:fixed; top:0; width:100%; z-index:100; padding:20px 60px; transition:all 0.35s; display:flex; justify-content:space-between; align-items:center; }
.navbar.scrolled { background: var(--bg-primary); opacity:0.92; backdrop-filter:blur(12px); padding:12px 60px; box-shadow:0 2px 24px rgba(0,0,0,0.3); }
.glass-card { background:var(--card-bg); border:1px solid var(--card-border); border-radius:16px; backdrop-filter:blur(10px); transition:all 0.35s; }
.glass-card:hover { transform:translateY(-6px); box-shadow:0 24px 48px rgba(0,0,0,0.4); border-color:var(--accent-primary); }
.gradient-text { background:linear-gradient(135deg,var(--accent-primary),var(--accent-secondary)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.btn-primary { background:linear-gradient(135deg,var(--accent-primary),var(--accent-secondary)); color:white; padding:14px 36px; border-radius:50px; font-weight:700; border:none; cursor:pointer; transition:0.3s; box-shadow:0 4px 16px rgba(var(--accent-primary),0.3); }
.btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(var(--accent-primary),0.45); }
.btn-outline { background:transparent; color:var(--accent-primary); padding:13px 34px; border-radius:50px; font-weight:700; border:2px solid var(--accent-primary); cursor:pointer; transition:0.3s; }
.btn-outline:hover { background:var(--accent-primary); color:white; }
.scroll-indicator { position:absolute; bottom:32px; left:50%; transform:translateX(-50%); animation:bounce 2s infinite; cursor:pointer; z-index:2; }
@keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0);} 50%{transform:translateX(-50%) translateY(12px);} }
.section-title { font-size:2.5rem; font-weight:700; margin-bottom:1rem; }
.section-subtitle { font-size:1.1rem; color:var(--text-secondary); max-width:600px; }
.form-input { width:100%; padding:14px 18px; border-radius:12px; border:1.5px solid rgba(255,255,255,0.1); background:var(--bg-secondary); color:var(--text-primary); font-size:1rem; transition:0.3s; outline:none; font-family:inherit; }
.form-input:focus { border-color:var(--accent-primary); box-shadow:0 0 0 3px rgba(var(--accent-primary),0.1); }
.canvas-bg { position:absolute; inset:0; pointer-events:none; z-index:0; }
.faq-item { border-bottom:1px solid rgba(255,255,255,0.06); overflow:hidden; }
.faq-question { padding:20px 0; cursor:pointer; display:flex; justify-content:space-between; align-items:center; font-weight:600; transition:color 0.3s; }
.faq-question:hover { color:var(--accent-primary); }
.faq-answer { max-height:0; overflow:hidden; transition:max-height 0.4s, padding 0.4s; color:var(--text-secondary); }
.faq-answer.open { max-height:300px; padding-bottom:20px; }
.faq-icon { transition:transform 0.3s; font-size:1.2rem; }
.faq-icon.open { transform:rotate(45deg); }
.footer { background:var(--bg-secondary); border-top:1px solid rgba(255,255,255,0.06); padding:64px 40px 32px; }
.footer a { color:var(--text-secondary); transition:color 0.3s; text-decoration:none; }
.footer a:hover { color:var(--accent-primary); }
@media (max-width:768px) { .navbar { padding:16px 20px; } .panel-inner { padding:60px 20px; } .section-title { font-size:2rem; } .footer { padding:40px 20px 24px; } }
\`\`\`

**2. 导航栏 (<nav id="navbar" class="navbar">):**
- 左侧品牌名/Logo (<span class="gradient-text">)
- 右侧链接: ${allPanels.map(p => `<a class="nav-link" href="#${p.id}">${p.name === 'Hero' ? '首页' : p.name}</a>`).join(' | ')}
- 至少7个链接

**3. Hero面板 (<section id="panel-0" class="panel">):**
- 类型: ${panel.name}
- 用途: ${panel.purpose}
- Canvas粒子背景 (id="heroCanvas", 50个粒子)
- 徽章标签 (例: "🏆 ${ctx.companyName}")
- H1标题 (<h1 class="gradient-text">)
- 描述: 2-3句
- 2个CTA按钮: btn-primary "探索服务" + btn-outline "立即咨询"
- 滚动指示器 (向下箭头+点击跳转到#${nextPanels[0]?.id || 'footer'})`)
    } else {
      // 后续面板
      const prevName = prevPanels[prevPanels.length - 1]?.name || '上一个面板'
      const nextName = nextPanels[0]?.name || (isLast ? 'Footer' : '下一个面板')

      contextParts.push(`## 面板上下文
- 当前位置: ${index + 1}/${totalPanels} — **${panel.name}**
- 上一个: ${prevName}
- 下一个: ${nextName}
- 这是${isLast ? '最后一个面板' : '中间面板'}`)

      contextParts.push(`### 面板需求: ${panel.name} (#${panel.id})
用途: ${panel.purpose}
布局: ${panel.layoutMode}
${isLast ? '\n**注意**: 这是最后一个内容面板，之后是Footer。输出完整的内容面板HTML。' : ''}`)
    }

    // 如果是 Footer
    if (panel.name === 'Footer') {
      contextParts.push(`### Footer 面板要求:
- 标签: 用 <footer id="${panel.id}" class="panel"> 包裹 (不是section, 是footer)
- 背景: var(--bg-secondary)
- 4列链接布局 (display:flex或grid, 响应式mobile堆叠)
- 第1列: Logo(gradient-text) + 公司简介1句话
- 第2列: 服务链接列表
- 第3列: 关于链接列表
- 第4列: 联系方式 (地址/电话/邮箱) + 社交图标行
- 底部版权栏: © ${new Date().getFullYear()} ${ctx.companyName} | ICP备案 | 隐私政策 | 服务条款`)
    } else {
      contextParts.push(`标签: 用 <section id="${panel.id}" class="panel"> 包裹`)
    }

    // 如果是 Contact
    if (panel.name === 'Contact') {
      contextParts.push(`### Contact 表单要求:
- 双栏布局 (左侧form宽/右侧info窄, mobile堆叠)
- 左侧col-span-3: glass-card表单
  - 姓名 + 手机 (双列)
  - 邮箱
  - 咨询方向 (select: 产品咨询/预约演示/商务合作/其他)
  - 需求描述 textarea rows="4"
  - 提交按钮 btn-primary full-width
- 右侧col-span-2: 4个联系信息卡片
  - 📍地址: 深圳市南山区科技园
  - 📞电话: 400-888-9999
  - 📧邮箱: hello@company.com
  - 🕐时间: 周一至周五 09:00-18:00`)
    }

    // 如果是 Stats
    if (panel.name === 'Stats') {
      contextParts.push(`### Stats 数据面板:
- 4列卡片布局 (mobile 2列)
- 每个卡片: 大数字 (gradient-text, data-target属性) + 说明文字
- 数字: 500+/99%/30+/10+ (根据行业调整)
- 所有数字用 data-target 属性标记，JS会统一做递增动画`)
    }

    // FAQ
    if (panel.name === 'FAQ') {
      contextParts.push(`### FAQ 折叠面板:
- 5个问答
- faq-item > faq-question(span+faq-icon) + faq-answer
- 点击toggle open类
- Q1: 服务流程 Q2: 价格 Q3: 支持 Q4: 周期 Q5: 如何开始`)
    }

    // Team
    if (panel.name === 'Team') {
      contextParts.push(`### Team 团队面板:
- 4列人物卡片 (mobile 2列)
- 4张人物卡片: 头像圆形+姓名+职位+简介+社交链接
- Unsplash头像: photo-1507003211169, photo-1494790108377, photo-1472099645785, photo-1438761681033`)
    }

    // Testimonials
    if (panel.name === 'Testimonials') {
      contextParts.push(`### Testimonials 证言面板:
- 3列评价卡片 (mobile 1列)
- 3条评价: 星级(★★★★★)+评价文字+头像+姓名+职位
- 文案真实感: 体现客户受益的具体描述`)
    }

    // 最后如果是最后一个内容面板且后面没有Footer，强制添加
    if (isLast && allPanels.every(p => p.name !== 'Footer')) {
      contextParts.push(`\n**额外要求**: 当前面板之后，直接输出Footer面板。`)
    }

    contextParts.push(`\n### 输出格式
直接输出HTML面板片段 (section/div+style+script)，不要DOCTYPE/head/body/CDN。${isFirstPanel ? '包含<style>全局CSS+<nav>+<section id="panel-0" class="panel">' : ''}`)

    const userPrompt = contextParts.join('\n\n')

    try {
      // 使用流式
      let fullContent = ''
      // 🔧 maxTokens 足够大：第一面板6000，后续面板4000 (~24000字符/16000字符)
      const estimatedTokens = Math.max(panel.estimatedLines * 18, isFirstPanel ? 6000 : 4000)

      const resp = await this.streamFn(
        {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.4 + retryIndex * 0.2,
          maxTokens: estimatedTokens,
          timeout: 300000,
          model: this.e2eModel
        },
        (chunk) => {
          fullContent += chunk.content
        }
      )

      if (resp.success) {
        fullContent = resp.data?.content || fullContent
      }

      // 清理输出
      const cleaned = this.cleanHtmlChunk(fullContent, isFirstPanel)

      return {
        html: cleaned,
        componentNames: []
      }
    } catch (e: any) {
      console.error(`面板 ${panel.name} 生成失败:`, e.message)
      // 返回占位面板
      return {
        html: this.generateFallbackPanel(panel, ctx),
        componentNames: []
      }
    }
  }

  private cleanHtmlChunk(content: string, isFirst: boolean): string {
    let cleaned = content.trim()

    // 移除markdown代码块标记
    cleaned = cleaned.replace(/^```html?\s*/i, '').replace(/```\s*$/i, '')
    // 移除JSON包装
    cleaned = cleaned.replace(/^\s*\{\s*"html"\s*:\s*"/, '').replace(/"\s*\}\s*$/, '')
    // 移除可能的解释文字
    if (cleaned.startsWith('这里') || cleaned.startsWith('以下')) {
      const idx = cleaned.indexOf('<')
      if (idx > 0) cleaned = cleaned.substring(idx)
    }

    // 🔧 核心修复: 剥离完整HTML文档外壳 (DOJCYPE/html/head/body)
    const hasDoc = /<!DOCTYPE\s+html/i.test(cleaned)
    if (hasDoc) {
      cleaned = cleaned.replace(/<!DOCTYPE\s+html[^>]*>/gi, '')
      cleaned = cleaned.replace(/<html[^>]*>/gi, '').replace(/<\/html>/gi, '')
      cleaned = cleaned.replace(/<\/body>/gi, '').replace(/<body[^>]*>/gi, '')
      // 移除<head>...</head>整个区块
      cleaned = cleaned.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
      // 移除重复的CDN script (GSAP/Tailwind)
      cleaned = cleaned.replace(/<script[^>]*cdnjs\.cloudflare\.com[^>]*><\/script>/gi, '')
      cleaned = cleaned.replace(/<script[^>]*cdn\.tailwindcss\.com[^>]*><\/script>/gi, '')
      // 移除重复的meta/title/link标签
      cleaned = cleaned.replace(/<meta[^>]*>/gi, '')
      cleaned = cleaned.replace(/<title>[^<]*<\/title>/gi, '')
      cleaned = cleaned.replace(/<link[^>]*fonts\.googleapis\.com[^>]*>/gi, '')
    }

    // 确保第一个面板有 <style> 标签包裹CSS
    if (isFirst && !cleaned.includes('<style>') && /^\s*\*?\s*\{.*margin/.test(cleaned)) {
      const cssMatch = cleaned.match(/((?:\*\s*\{[\s\S]*?(?=<section|<nav|<div)))/i)
      if (cssMatch) {
        cleaned = cleaned.replace(cssMatch[0], '<style>\n' + cssMatch[0].trim() + '\n</style>')
      }
    }

    return cleaned.trim()
  }

  private generateFallbackPanel(panel: PanelPlan, ctx: ReturnType<typeof this.buildContext>): string {
    return `<!-- Fallback: ${panel.name} -->
<section class="panel" id="${panel.id}" style="background:var(--bg-secondary);">
  <div class="panel-inner text-center">
    <span style="color:var(--accent-primary);font-size:0.875rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">${panel.name}</span>
    <h2 class="section-title mt-2">${panel.purpose}</h2>
  </div>
</section>`
  }

  // ==================== Phase 3: Assemble ====================

  private phaseAssemble(ctx: ReturnType<typeof this.buildContext>, chunks: string[]): string {
    // 预清理: 剥离每个chunk中的 DOCTYPE/html/head/body/CDN 垃圾
    const cleanedChunks = chunks.map(c => {
      let cleaned = c
      cleaned = cleaned.replace(/<!DOCTYPE\s+html[^>]*>/gi, '')
      cleaned = cleaned.replace(/<html[^>]*>/gi, '').replace(/<\/html>/gi, '')
      cleaned = cleaned.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
      cleaned = cleaned.replace(/<\/body>/gi, '').replace(/<body[^>]*>/gi, '')
      cleaned = cleaned.replace(/<script[^>]*cdnjs\.cloudflare\.com[^>]*><\/script>/gi, '')
      cleaned = cleaned.replace(/<script[^>]*cdn\.tailwindcss\.com[^>]*><\/script>/gi, '')
      cleaned = cleaned.replace(/<meta[^>]*>/gi, '')
      cleaned = cleaned.replace(/<title>[^<]*<\/title>/gi, '')
      cleaned = cleaned.replace(/<link[^>]*fonts\.googleapis\.com[^>]*>/gi, '')
      return cleaned.trim()
    }).filter(c => c.length > 0)

    const bodyContent = cleanedChunks.join('\n\n')

    const fullHtml = [
      '<!DOCTYPE html>',
      '<html lang="zh-CN">',
      '<head>',
      '  <meta charset="UTF-8">',
      '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
      `  <meta name="description" content="${ctx.companyName} - ${(ctx.bizDesc || ctx.description).substring(0, 80)}">`,
      `  <title>${ctx.companyName} - 官方网站</title>`,
      '  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">',
      '  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>',
      '  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>',
      '  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js"></script>',
      '</head>',
      '<body>',
      bodyContent,
      '',
      '<!-- E2E Auto-Generated -->',
      '<script>',
      '  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);',
      '  window.addEventListener("load", () => ScrollTrigger.refresh());',
      '</script>',
      '</body>',
      '</html>'
    ].join('\n')

    return fullHtml
  }

  // ==================== Phase 4: Validate ====================

  private phaseValidate(html: string): QualityReport {
    const issues: string[] = []
    const warnings: string[] = []

    // === 内容完整性 (40分) ===
    let contentScore = 0
    const lines = html.split('\n').length
    const chineseChars = (html.match(/[\u4e00-\u9fff]/g) || []).length
    // 用 id="panel-数字" 计数面板 (兼容 section/div 等各种标签)
    const panelIdMatches = html.match(/id\s*=\s*["']panel-\d+["']/gi) || []
    const sectionCount = panelIdMatches.length
    const imgCount = (html.match(/<img\b/gi) || []).length

    if (lines >= 600) contentScore += 10
    else if (lines >= 400) { contentScore += 6; warnings.push(`代码${lines}行，建议>=600行`) }
    else issues.push(`代码仅${lines}行(需>=600行)`)

    if (chineseChars >= 500) contentScore += 10
    else if (chineseChars >= 300) { contentScore += 6; warnings.push(`中文${chineseChars}字，建议>=500字`) }
    else issues.push(`中文仅${chineseChars}字(需>=500字)`)

    if (sectionCount >= 7) contentScore += 10
    else if (sectionCount >= 5) { contentScore += 6; warnings.push(`仅${sectionCount}个面板，建议>=7个`) }
    else issues.push(`仅${sectionCount}个面板(需>=5个)`)

    if (imgCount >= 6) contentScore += 10
    else if (imgCount >= 3) { contentScore += 5; warnings.push(`仅${imgCount}张图片`) }
    else warnings.push(`仅${imgCount}张图片，缺少视觉内容`)

    // === 结构规范 (30分) ===
    let structureScore = 0

    if (/gsap\.registerPlugin\s*\(\s*ScrollTrigger\s*(?:,\s*ScrollToPlugin\s*)?\s*\)/.test(html)) structureScore += 8
    else issues.push('缺少 gsap.registerPlugin(ScrollTrigger)')

    if (/<footer\b/i.test(html)) structureScore += 8
    else warnings.push('缺少<footer>标签')

    if (/\/html>/i.test(html)) structureScore += 5

    if (/ScrollTrigger\.refresh\s*\(\)/.test(html)) structureScore += 5
    else warnings.push('缺少ScrollTrigger.refresh()')

    if (/@media/.test(html)) structureScore += 4
    else warnings.push('缺少响应式@media')

    // === 动画质量 (20分) ===
    let animationScore = 0

    if (/<canvas\b/i.test(html) && /requestAnimationFrame/i.test(html)) animationScore += 8
    else if (/<canvas\b/i.test(html)) { animationScore += 4; warnings.push('Canvas存在但无requestAnimationFrame') }
    else warnings.push('缺少Canvas粒子背景')

    if (/gsap\.fromTo/.test(html)) animationScore += 6
    else warnings.push('未使用gsap.fromTo')

    if (/addEventListener\s*\(\s*['"]submit['"]/.test(html)) animationScore += 3

    if (/classList\.toggle/.test(html) || /toggle\s*\(\s*['"]open['"]/.test(html)) animationScore += 3

    // === 额外加分 (10分) ===
    let bonusScore = 0

    if (/ScrollToPlugin/.test(html)) bonusScore += 4
    else warnings.push('缺少ScrollToPlugin，导航跳转不流畅')

    const navCount = (html.match(/nav-link/gi) || []).length
    if (navCount >= 7) bonusScore += 3
    else if (navCount >= 5) bonusScore += 1

    // 联系信息完整性
    const contactItems = [/地址/.test(html), /电话|热线|400-/.test(html), /邮箱/.test(html)].filter(Boolean).length
    if (contactItems >= 3) bonusScore += 3
    else if (contactItems >= 2) bonusScore += 1

    const totalScore = contentScore + structureScore + animationScore + bonusScore

    return {
      passed: issues.length === 0,
      score: totalScore,
      issues,
      warnings,
      details: { contentScore, structureScore, animationScore, bonusScore }
    }
  }

  // ==================== 工具函数 ====================

  private safeParseJson(text: string): any {
    // 清理
    let cleaned = text.trim()
    // 移除markdown代码块
    cleaned = cleaned.replace(/^```json?\s*/i, '').replace(/```\s*$/, '')
    // 找JSON边界
    const firstBrace = cleaned.indexOf('{')
    const lastBrace = cleaned.lastIndexOf('}')
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1)
    }
    try {
      return JSON.parse(cleaned)
    } catch {
      return null
    }
  }

  private emitPhase(phase: GenerationPhase, onStream?: E2EStreamCallback) {
    console.log(`📌 Phase: ${phase}`)
    onStream?.({ type: 'phase', phase })
  }
}

/**
 * 工厂函数：创建 E2E 生成器实例
 */
export function createE2EGenerator(options: {
  chatFn: ChatFunction
  streamFn: StreamFunction
  knowledgeBase?: ComponentKnowledge[]
  e2eModel?: string
}): E2EGenerator {
  return new E2EGenerator(options.chatFn, options.streamFn, {
    knowledgeBase: options.knowledgeBase,
    e2eModel: options.e2eModel
  })
}
