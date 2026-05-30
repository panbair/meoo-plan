/**
 * 组件语义搜索服务 (Component Semantic Search Service)
 *
 * V2.0 方案四：语义组件搜索
 * - 快速模式（本地）：基于知识库标签（visualTags/sceneTags/techTags/名称）的本地搜索
 * - 深度模式（AI）：DeepSeek Chat 理解自然语言描述 → 返回匹配组件排名
 *
 * 架构：
 *   用户输入自然语言 → 检测复杂度
 *     ├─ 简单关键词 → 本地标签搜索（<10ms，零网络）→ Top-20 结果
 *     └─ 复杂描述   → DeepSeek Chat 语义匹配（~3s）→ 返回 JSON + 解释
 */

import '@/api/ai/ai.config' // 确保 AI 服务已配置
import { aiService } from './index'
import type {
  ComponentKnowledge,
  ComponentCategory
} from './component-knowledge-builder'
import {
  buildComponentKnowledgeBase,
  getCategoryGuide
} from './component-knowledge-builder'

// ==================== 类型定义 ====================

/** 搜索结果条目 */
export interface SearchResult {
  /** 组件名称 */
  name: string
  /** 所属类别 */
  category: ComponentCategory
  /** 子路径 */
  subPath: string
  /** 概要描述 */
  summary: string
  /** 核心特性 */
  features: string
  /** 场景标签 */
  sceneTags: string
  /** 视觉风格标签 */
  visualTags: string
  /** 技术标签 */
  techTags: string
  /** 复杂度 */
  complexity: 'low' | 'medium' | 'high'
  /** 匹配分数 (0~100) */
  score: number
  /** 匹配原因（AI搜索时有） */
  matchReason: string
  /** 是否有 Canvas */
  hasCanvas: boolean
  /** 是否有 3D */
  has3D: boolean
  /** 是否有 ScrollTrigger */
  hasScrollTrigger: boolean
}

/** 搜索请求 */
export interface SearchQuery {
  /** 用户输入 */
  query: string
  /** 搜索模式 */
  mode?: 'auto' | 'local' | 'ai'
  /** 最大结果数 */
  limit?: number
  /** 过滤类别 */
  categoryFilter?: ComponentCategory[]
  /** 过滤复杂度 */
  complexityFilter?: ('low' | 'medium' | 'high')[]
}

/** 搜索响应 */
export interface SearchResponse {
  /** 搜索结果 */
  results: SearchResult[]
  /** 搜索模式 */
  mode: 'local' | 'ai'
  /** AI 解释（AI模式时） */
  reasoning?: string
  /** 建议的搜索标签 */
  suggestedTags?: string[]
  /** 总组件数 */
  totalComponents: number
}

/** AI 搜索流式回调 */
export type SearchStreamCallback = (
  chunk: SearchStreamChunk
) => void

export interface SearchStreamChunk {
  type: 'thinking' | 'results' | 'done' | 'error'
  content?: string
  results?: SearchResult[]
}

// ==================== 本地搜索引擎（快速模式）====================

/**
 * 中文关键词 → 标签映射词典
 * 补充组件名称之外的中文自然语言理解
 */
const CN_TO_TAG_MAP: Record<string, { visual?: string; scene?: string; tech?: string }> = {
  // 视觉风格
  '赛博': { visual: 'cyber' },
  '赛博朋克': { visual: 'cyber' },
  '霓虹': { visual: 'neon' },
  '发光': { visual: 'neon' },
  '玻璃': { visual: 'glass' },
  '毛玻璃': { visual: 'glass' },
  '全息': { visual: 'holographic' },
  '液态': { visual: 'liquid' },
  '水流': { visual: 'liquid' },
  '火焰': { visual: 'fire' },
  '水晶': { visual: 'crystal' },
  '钻石': { visual: 'crystal' },
  '宇宙': { visual: 'cosmic' },
  '星空': { visual: 'cosmic' },
  '极光': { visual: 'cosmic' },
  '自然': { visual: 'nature' },
  '生态': { visual: 'nature' },
  '奢华': { visual: 'luxury' },
  '高级': { visual: 'luxury' },
  '简约': { visual: 'minimal' },
  '简洁': { visual: 'minimal' },
  '暗黑': { visual: 'dark' },
  '科技': { visual: 'tech' },
  '3D': { visual: '3d' },
  '立体': { visual: '3d' },
  '电影': { visual: 'cinematic' },
  '复古': { visual: 'retro' },
  '有趣': { visual: 'playful' },
  '弹性': { visual: 'playful' },
  '故障': { visual: 'cyber' },
  '粒子': { tech: 'Particles' },
  '网格': { tech: 'CSS3D' },
  '波浪': { visual: 'liquid' },
  '水面': { visual: 'liquid' },
  '透视': { visual: '3d' },
  '翻转': { visual: '3d' },
  '视差': { tech: 'Parallax' },
  '变形': { tech: 'Morph' },
  '遮罩': { tech: 'Mask' },

  // 场景
  '首屏': { scene: 'hero' },
  '首页': { scene: 'hero' },
  '产品展示': { scene: 'product-showcase' },
  '画廊': { scene: 'gallery' },
  '图片': { scene: 'gallery' },
  '关于我们': { scene: 'about-brand' },
  '团队': { scene: 'team' },
  '时间线': { scene: 'timeline' },
  '历程': { scene: 'timeline' },
  '发展': { scene: 'timeline' },
  '特性': { scene: 'features' },
  '功能': { scene: 'features' },
  '案例': { scene: 'cases' },
  '客户': { scene: 'cases' },
  '统计': { scene: 'stats' },
  '数据': { scene: 'stats' },
  '联系': { scene: 'contact' },
  '合作': { scene: 'partner' },
  '新闻': { scene: 'news' },

  // 效果描述
  '滚动': { tech: 'ScrollTrigger' },
  '滚动触发': { tech: 'ScrollTrigger' },
  '图片': { scene: 'gallery' },
  '文字': { scene: 'features' },
  '卡片': { scene: 'features' },
  '按钮': { scene: 'cta' },
  '背景': { scene: 'background' },
  '导航': { scene: 'navigation' },
  '底部': { scene: 'footer' },
}

/**
 * 本地搜索评分器
 * 计算用户查询与组件知识条目的相关性分数
 */
function scoreComponent(
  query: string,
  comp: ComponentKnowledge
): number {
  const q = query.toLowerCase()
  let score = 0

  // 1. 组件名精确匹配（最高权重）
  if (comp.name.toLowerCase().includes(q)) {
    score += 40
  }
  // 组件名单词匹配
  const nameWords = comp.name
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .split(/\s+/)
  for (const word of nameWords) {
    if (q.includes(word) && word.length > 2) {
      score += 15
    }
  }

  // 2. 概要描述匹配
  if (comp.summary.toLowerCase().includes(q)) {
    score += 30
  }

  // 3. 特性匹配
  const features = comp.features.toLowerCase()
  const qWords = q.split(/[\s,，、]+/).filter(w => w.length > 0)
  for (const w of qWords) {
    if (features.includes(w)) score += 5
  }

  // 4. 标签匹配
  const visualTags = comp.visualTags.toLowerCase().split(',')
  const sceneTags = comp.sceneTags.toLowerCase().split(',')
  const techTags = (comp.techTags || '').toLowerCase().split(',')

  for (const w of qWords) {
    if (visualTags.includes(w)) score += 12
    if (sceneTags.includes(w)) score += 12
    if (techTags.includes(w)) score += 10
  }

  // 5. 中文关键词→标签映射（核心：让自然语言映射到标签系统）
  for (const [cnWord, tags] of Object.entries(CN_TO_TAG_MAP)) {
    if (q.includes(cnWord)) {
      if (tags.visual && visualTags.includes(tags.visual)) score += 15
      if (tags.scene && sceneTags.includes(tags.scene)) score += 15
      if (tags.tech && techTags.includes(tags.tech)) score += 12
    }
  }

  // 6. 复杂度偏好（搜索词含"简单"偏🟢，含"炫酷/震撼"偏🔴）
  if ((q.includes('简单') || q.includes('轻量')) && comp.complexity === 'low') score += 5
  if ((q.includes('炫酷') || q.includes('震撼') || q.includes('高级')) && comp.complexity === 'high') score += 5

  return score
}

/**
 * 本地搜索：基于标签和关键词快速匹配
 */
function localSearch(
  query: string,
  knowledge: ComponentKnowledge[],
  options: { limit?: number; categoryFilter?: ComponentCategory[]; complexityFilter?: string[] } = {}
): SearchResult[] {
  const { limit = 20, categoryFilter, complexityFilter } = options

  const results: SearchResult[] = []

  for (const comp of knowledge) {
    // 过滤
    if (categoryFilter && !categoryFilter.includes(comp.category)) continue
    if (complexityFilter && !complexityFilter.includes(comp.complexity)) continue

    const score = scoreComponent(query, comp)

    if (score > 0) {
      results.push({
        name: comp.name,
        category: comp.category,
        subPath: comp.subPath,
        summary: comp.summary,
        features: comp.features,
        sceneTags: comp.sceneTags,
        visualTags: comp.visualTags,
        techTags: comp.techTags,
        complexity: comp.complexity,
        score,
        matchReason: '',
        hasCanvas: comp.hasCanvas,
        has3D: comp.has3D,
        hasScrollTrigger: comp.hasScrollTrigger
      })
    }
  }

  // 按分数降序排序
  results.sort((a, b) => b.score - a.score)

  return results.slice(0, limit)
}

/**
 * 判断是否需要 AI 深度搜索
 * - 中文长句（>8字）→ AI模式
 * - 多条件组合（含2个以上效果词）→ AI模式
 * - 简单关键词 → 本地模式
 */
function shouldUseAI(query: string): boolean {
  const trimmed = query.trim()

  // 空或过短
  if (trimmed.length <= 2) return false

  // 超过15个字符的长描述
  if (trimmed.length >= 15) return true

  // 统计命中 CN_TO_TAG_MAP 的标签数量
  let tagHitCount = 0
  for (const cnWord of Object.keys(CN_TO_TAG_MAP)) {
    if (trimmed.includes(cnWord)) tagHitCount++
  }
  // 命中3个以上不同标签（复杂需求）
  if (tagHitCount >= 3) return true

  // 包含自然语言问句信号
  if (/什么|怎么|哪个|推荐|适合|帮|像|类似|可以|要|如何/.test(trimmed)) return true

  return false
}

/**
 * 提取建议标签
 */
function extractSuggestedTags(
  query: string,
  knowledge: ComponentKnowledge[]
): string[] {
  const tags = new Set<string>()
  const q = query.toLowerCase()

  for (const comp of knowledge.slice(0, 30)) {
    for (const tag of comp.visualTags.split(',')) {
      if (tag && tag !== 'universal' && (comp.name.toLowerCase().includes(q) || comp.summary.toLowerCase().includes(q))) {
        tags.add(tag.trim())
      }
    }
    for (const tag of comp.sceneTags.split(',')) {
      if (tag && (comp.name.toLowerCase().includes(q) || comp.summary.toLowerCase().includes(q))) {
        tags.add(tag.trim())
      }
    }
  }

  return Array.from(tags).slice(0, 8)
}

// ==================== AI 语义搜索（深度模式）====================

/**
 * DeepSeek 语义组件搜索
 *
 * 将用户的自然语言描述 + 组件知识库发送给 DeepSeek，
 * AI 理解语义后返回最匹配的组件列表及推荐理由。
 */
async function aiSemanticSearch(
  query: string,
  knowledge: ComponentKnowledge[],
  options: { maxResults?: number; stream?: boolean } = {}
): Promise<{ results: SearchResult[]; reasoning: string }> {
  const { maxResults = 10 } = options

  // 构建紧凑的组件摘要（控制 token 消耗）
  const componentList = knowledge
    .map(k =>
      `|${k.name}|${k.category}|${k.complexity}|${k.visualTags}|${k.sceneTags}|${k.summary}|`
    )
    .join('\n')

  const systemPrompt = `你是 GSAP 动画组件搜索专家。用户描述想要的效果，你从组件库中找到最匹配的组件。

## 组件库（共 ${knowledge.length} 个）

|组件名|类别|复杂度|视觉风格|适用场景|简介|
|---|---|---|---|---|---|
${componentList}

## 输出格式

只输出一个严格 JSON（不含任何其他文字）：

{
  "reasoning": "分析用户需求的思考过程（30-60字）",
  "matches": [
    { "name": "组件名", "score": 95, "reason": "匹配原因（10字以内）" },
    ...
  ]
}

## 匹配规则
- score 90-100: 完美匹配（视觉+场景+技术都吻合）
- score 70-89: 高度匹配（2个维度吻合）
- score 50-69: 部分匹配（1个维度吻合）
- score <50: 不返回
- 最多返回 ${maxResults} 个结果
- 优先返回高匹配度组件`

  const userPrompt = `请为以下需求匹配最合适的 GSAP 动画组件：

"${query}"

请严格按 JSON 格式返回结果，不要输出任何其他内容。`

  const response = await aiService.chat({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.1,
    maxTokens: 2000
  })

  if (!response.success || !response.data) {
    throw new Error(response.error || 'AI 搜索失败')
  }

  const content = response.data.content

  // 解析 JSON
  let parsed: any = null
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    try {
      parsed = JSON.parse(jsonMatch[0])
    } catch {
      throw new Error('AI 返回了非JSON格式')
    }
  }

  if (!parsed || !parsed.matches) {
    throw new Error('AI 搜索结果格式错误')
  }

  const reasoning = parsed.reasoning || ''
  const results: SearchResult[] = []

  for (const match of parsed.matches) {
    const comp = knowledge.find(
      k => k.name.toLowerCase() === match.name.toLowerCase()
    )
    if (comp) {
      results.push({
        name: comp.name,
        category: comp.category,
        subPath: comp.subPath,
        summary: comp.summary,
        features: comp.features,
        sceneTags: comp.sceneTags,
        visualTags: comp.visualTags,
        techTags: comp.techTags,
        complexity: comp.complexity,
        score: match.score || 70,
        matchReason: match.reason || '',
        hasCanvas: comp.hasCanvas,
        has3D: comp.has3D,
        hasScrollTrigger: comp.hasScrollTrigger
      })
    }
  }

  return { results, reasoning }
}

// ==================== 主搜索入口 ====================

let _knowledgeCache: ComponentKnowledge[] | null = null

/**
 * 初始化搜索知识库（加载一次，缓存）
 */
async function ensureKnowledge(): Promise<ComponentKnowledge[]> {
  if (_knowledgeCache) return _knowledgeCache
  _knowledgeCache = await buildComponentKnowledgeBase()
  return _knowledgeCache
}

/**
 * 主搜索方法
 *
 * @example
 * // 快速本地搜索
 * const result = await searchComponents({ query: '霓虹文字' })
 *
 * // AI 深度搜索
 * const result = await searchComponents({ query: '想要一个粒子像水流一样飘动的Hero背景', mode: 'ai' })
 */
export async function searchComponents(
  query: SearchQuery
): Promise<SearchResponse> {
  const { query: q, mode = 'auto', limit = 20, categoryFilter, complexityFilter } = query

  if (!q.trim()) {
    return {
      results: [],
      mode: 'local',
      totalComponents: 0
    }
  }

  const knowledge = await ensureKnowledge()

  // 自动检测模式
  const useAI = mode === 'ai' || (mode === 'auto' && shouldUseAI(q))

  if (useAI) {
    try {
      const { results, reasoning } = await aiSemanticSearch(q, knowledge, {
        maxResults: limit
      })
      return {
        results,
        mode: 'ai',
        reasoning,
        totalComponents: knowledge.length
      }
    } catch (err) {
      console.warn('AI 搜索失败，回退到本地搜索:', err)
      // 回退到本地搜索
    }
  }

  // 本地搜索
  const results = localSearch(q, knowledge, { limit, categoryFilter, complexityFilter: complexityFilter as string[] | undefined })
  const suggestedTags = extractSuggestedTags(q, knowledge)

  return {
    results,
    mode: 'local',
    suggestedTags,
    totalComponents: knowledge.length
  }
}

/**
 * 获取所有可用的搜索标签（用于标签推荐/自动补全）
 */
export function getSearchSuggestions(): {
  visual: string[]
  scene: string[]
  tech: string[]
  categories: { key: string; label: string }[]
} {
  const VISUAL_TAGS = [
    'neon', 'cyber', 'glass', 'holographic', 'liquid', 'fire',
    'crystal', 'cosmic', 'nature', 'luxury', 'minimal',
    'dark', 'tech', '3d', 'cinematic', 'retro', 'playful'
  ]

  const SCENE_TAGS = [
    'hero', 'product-showcase', 'gallery', 'about-brand',
    'team', 'timeline', 'cta', 'features', 'cases',
    'stats', 'contact', 'background', 'navigation',
    'footer', 'news', 'partner'
  ]

  const TECH_TAGS = [
    'Canvas', 'WebGL', 'GSAP', 'ScrollTrigger', 'Particles',
    'SVG', 'ClipPath', 'Filters', 'CSS3D', 'Morph', 'Mask',
    'Stagger', 'Parallax'
  ]

  const CATEGORIES = [
    { key: 'card-image', label: '震撼图片' },
    { key: 'card-img', label: '图片卡片' },
    { key: 'card-text', label: '文字特效' },
    { key: 'card-3d', label: '3D立体' },
    { key: 'card-time', label: '时间轴' },
    { key: 'card-list', label: '通用卡片' },
    { key: 'card-base', label: '基础滚动' },
    { key: 'card-other', label: '创意工具' }
  ]

  return {
    visual: VISUAL_TAGS,
    scene: SCENE_TAGS,
    tech: TECH_TAGS,
    categories: CATEGORIES
  }
}

/**
 * 清除知识库缓存（开发调试用）
 */
export function clearSearchCache(): void {
  _knowledgeCache = null
  console.log('🗑️ 搜索知识库缓存已清除')
}
