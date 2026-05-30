/**
 * 动态组件知识库构建器 (Dynamic Component Knowledge Base Builder)
 *
 * 功能：自动扫描 web-list 下所有 GSAP 组件，提取结构化知识，
 *       生成可注入 DeepSeek System Prompt 的紧凑知识库。
 *
 * 架构：
 *   - 嵌套组件 (7类): card-image/img/text/3d/time/list/other → ComponentXxx/ComponentXxx.vue + README.md
 *   - 平铺组件 (1类): card-base → ScrollXxx.vue (无 README)
 *
 * 输出：ComponentKnowledge[] → ~50KB 紧凑文本 (~10K tokens)
 */

import type { AIProvider } from './index'

// ==================== 类型定义 ====================

/** 组件知识条目 */
export interface ComponentKnowledge {
  /** 组件名称，例如 "CardImageGlassShatter" */
  name: string
  /** 所属类别，例如 "card-image" */
  category: ComponentCategory
  /** 组件子路径，例如 "card-image/CardImageGlassShatter" */
  subPath: string
  /** 一行概要描述 (READEME 标题/首句) */
  summary: string
  /** 核心特性描述 (压缩到 80 字以内) */
  features: string
  /** 适用场景标签 (逗号分隔) */
  sceneTags: string
  /** 视觉风格标签 (逗号分隔) */
  visualTags: string
  /** 技术栈标签 (逗号分隔) */
  techTags: string
  /** 复杂度评级 */
  complexity: 'low' | 'medium' | 'high'
  /** 是否使用 Canvas */
  hasCanvas: boolean
  /** 是否使用 3D/WebGL */
  has3D: boolean
  /** 是否使用 GSAP ScrollTrigger */
  hasScrollTrigger: boolean
}

/** 组件类别 */
export type ComponentCategory =
  | 'card-base'
  | 'card-image'
  | 'card-img'
  | 'card-text'
  | 'card-3d'
  | 'card-time'
  | 'card-list'
  | 'card-other'

/** 类别元信息 */
interface CategoryMeta {
  key: ComponentCategory
  label: string
  description: string
  scene: string // 典型使用场景
  isFlat: boolean // 是否为平铺结构（card-base）
}

// ==================== 类别定义 ====================

const CATEGORIES: CategoryMeta[] = [
  {
    key: 'card-base',
    label: '基础滚动动画',
    description: 'GSAP ScrollTrigger 基础组件，纯CSS/GSAP 动效',
    scene: 'Hero/特性区/统计/CTA',
    isFlat: true
  },
  {
    key: 'card-image',
    label: '震撼图片特效',
    description: '高强度视觉冲击的图片动画组件',
    scene: 'Hero/产品展示/画廊',
    isFlat: false
  },
  {
    key: 'card-img',
    label: '图片特效',
    description: '图片过渡、变换、滤镜等视觉效果',
    scene: '产品/背景/卡片',
    isFlat: false
  },
  {
    key: 'card-text',
    label: '文字动画特效',
    description: '文字标题、按钮、数据文字动画',
    scene: '标题/CTA/导航/数据',
    isFlat: false
  },
  {
    key: 'card-3d',
    label: '3D 立体效果',
    description: '3D 变换、立体展示、空间感组件',
    scene: '产品3D展示/技术架构',
    isFlat: false
  },
  {
    key: 'card-time',
    label: '时间轴组件',
    description: '发展历程、时间线展示组件',
    scene: '品牌故事/发展历程',
    isFlat: false
  },
  {
    key: 'card-list',
    label: '通用卡片列表',
    description: '多功能通用卡片展示组件',
    scene: '特性/服务/案例/团队',
    isFlat: false
  },
  {
    key: 'card-other',
    label: '工具/创意组件',
    description: '特殊工具、创意交互组件',
    scene: '工具/创意展示',
    isFlat: false
  }
]

// ==================== 视觉风格关键词映射 ====================

const VISUAL_STYLE_PATTERNS: [RegExp, string][] = [
  [/neon|霓虹|glow|发光|光效/, 'neon'],
  [/cyber|赛博|glitch|故障|matrix|digital/, 'cyber'],
  [/glass|玻璃|shatter|碎裂|frost|冰|morph/, 'glass'],
  [/hologram|全息|holo|prism|棱镜|spectrum|rainbow/, 'holographic'],
  [/liquid|液体|fluid|水|wave|ocean|ripple|flow/, 'liquid'],
  [/fire|火焰|firework|烟花|ember|ember|volcano|lava|magma/, 'fire'],
  [/crystal|水晶|diamond|gem/, 'crystal'],
  [/cosmic|宇宙|galaxy|星系|nebula|星云|star|space|quantum/, 'cosmic'],
  [/nature|自然|forest|森林|flower|花|leaf|叶|green|生态/, 'nature'],
  [/luxury|奢华|gold|金|silver|银|velvet|premium/, 'luxury'],
  [/minimal|简约|clean|简洁|minimal|fade|blur|bloom/, 'minimal'],
  [/dark|暗黑|shadow|黑影|noir|dark/, 'dark'],
  [/tech|科技|tech|cube|grid|circuit|data/, 'tech'],
  [/3d|3d|三维|cube|depth|perspective|立体/, '3d'],
  [/cinematic|电影|cinematic|theater|stage|dramatic/, 'cinematic'],
  [/retro|复古|vintage|怀旧|sepia|胶片|old/, 'retro'],
  [/playful|有趣|playful|bounce|bouncing|ball|弹性|spring/, 'playful'],
]

// ==================== 场景标签映射 ====================

const SCENE_PATTERNS: [RegExp, string][] = [
  [/hero|首屏|主页|landing/, 'hero'],
  [/产品|product|展示|showcase/, 'product-showcase'],
  [/画廊|gallery|图片|image|photo/, 'gallery'],
  [/关于|about|故事|story|brand/, 'about-brand'],
  [/团队|team|member|people/, 'team'],
  [/时间线|timeline|历程|历史|history/, 'timeline'],
  [/cta|call.to.action|按钮|button|行动号召/, 'cta'],
  [/特性|feature|功能|capability/, 'features'],
  [/案例|case|客户|client|portfolio/, 'cases'],
  [/统计|stats|数据|data|number|数字/, 'stats'],
  [/联系|contact|form|表单/, 'contact'],
  [/背景|background|bg/, 'background'],
  [/导航|nav|menu|header/, 'navigation'],
  [/footer|页脚|底部/, 'footer'],
  [/新闻|news|更新|update/, 'news'],
  [/合作|partner|合作关系/, 'partner'],
]

// ==================== 技术标签映射 ====================

const TECH_TAG_PATTERNS: [RegExp, string][] = [
  [/canvas/i, 'Canvas'],
  [/webgl|three\.js/i, 'WebGL'],
  [/gsap/i, 'GSAP'],
  [/scrolltrigger|scroll-trigger|scroll trigger/i, 'ScrollTrigger'],
  [/particle|粒子|dust|dot/i, 'Particles'],
  [/svg|svg-path/i, 'SVG'],
  [/clip-path|clip\-path/i, 'ClipPath'],
  [/mix-blend|滤镜|filter|blur/i, 'Filters'],
  [/3d|perspective|rotatex|rotatey|rotatez|translatez/i, 'CSS3D'],
  [/morph|morphing|变形|shape/i, 'Morph'],
  [/mask|遮罩/i, 'Mask'],
  [/stagger/i, 'Stagger'],
  [/parallax|视差/i, 'Parallax'],
]

// ==================== 缓存 ====================

let cachedKnowledge: ComponentKnowledge[] | null = null
let cacheTimestamp: number = 0
const CACHE_TTL = 5 * 60 * 1000 // 5分钟

// ==================== 核心构建器 ====================

/**
 * 构建完整组件知识库
 * 内部包含缓存机制，避免重复扫描
 */
export async function buildComponentKnowledgeBase(
  options: {
    forceRefresh?: boolean
    maxComponents?: number // 限制组件数量（用于测试/控制Token预算）
  } = {}
): Promise<ComponentKnowledge[]> {
  const { forceRefresh = false, maxComponents } = options

  // 检查缓存
  if (
    !forceRefresh &&
    cachedKnowledge &&
    Date.now() - cacheTimestamp < CACHE_TTL
  ) {
    console.log(
      `📚 使用缓存的组件知识库 (${cachedKnowledge.length} 个组件)`
    )
    return maxComponents
      ? cachedKnowledge.slice(0, maxComponents)
      : cachedKnowledge
  }

  console.log('🔍 开始扫描组件目录...')

  const allKnowledge: ComponentKnowledge[] = []

  // 1. 扫描嵌套组件 (card-image/img/text/3d/time/list/other)
  await scanNestedComponents(allKnowledge)

  // 2. 扫描平铺组件 (card-base)
  await scanFlatComponents(allKnowledge)

  // 3. 按类别排序，保持可读性
  allKnowledge.sort((a, b) => {
    const catOrder = CATEGORIES.map(c => c.key)
    const catDiff = catOrder.indexOf(a.category) - catOrder.indexOf(b.category)
    if (catDiff !== 0) return catDiff
    return a.name.localeCompare(b.name)
  })

  // 缓存
  cachedKnowledge = allKnowledge
  cacheTimestamp = Date.now()

  console.log(
    `✅ 组件知识库构建完成: ${allKnowledge.length} 个组件, ` +
      `约 ${estimateTokens(allKnowledge)} tokens`
  )

  return maxComponents ? allKnowledge.slice(0, maxComponents) : allKnowledge
}

/**
 * 估算知识库的 Token 消耗
 */
export function estimateTokens(knowledge: ComponentKnowledge[]): number {
  const formatted = formatKnowledgeForAI(knowledge)
  // 粗略估算: 1 token ≈ 3-4 个英文字符, 1 token ≈ 1.5 个中文字符
  const chineseChars = (formatted.match(/[\u4e00-\u9fff]/g) || []).length
  const otherChars = formatted.length - chineseChars
  return Math.ceil(chineseChars / 1.5 + otherChars / 3.5)
}

// ==================== 嵌套组件扫描 ====================

async function scanNestedComponents(collector: ComponentKnowledge[]) {
  // 使用 import.meta.glob 扫描嵌套结构: card-{image,img,text,3d,time,list,other}/*/{component}.vue
  // 路径相对于当前文件 (src/api/ai/) 到 web-list 目录
  const vueModules = import.meta.glob(
    '../../views/web-list/card-{image,img,text,3d,time,list,other}/*/*.vue',
    { query: '?raw', import: 'default' }
  )

  const readmeModules = import.meta.glob(
    '../../views/web-list/card-{image,img,text,3d,time,list,other}/*/README.md',
    { query: '?raw', import: 'default' }
  )

  // 构建 README 路径映射: "card-image/CardImageGlassShatter/README.md" → content loader
  const readmeMap = new Map<string, () => Promise<string>>()
  for (const [path, loader] of Object.entries(readmeModules)) {
    // 标准化路径: 从相对路径中提取 web-list 之后的部分
    const webListIdx = path.indexOf('web-list/')
    const relative = webListIdx >= 0 ? path.substring(webListIdx + 'web-list/'.length) : path
    readmeMap.set(relative, loader as () => Promise<string>)
  }

  const total = Object.keys(vueModules).length
  let processed = 0

  // 并行加载所有 README + 部分源码
  const batchSize = 20
  const entries = Object.entries(vueModules)

  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map(async ([path, loader]) => {
        // 路径: ../../views/web-list/card-image/CardImageGlassShatter/CardImageGlassShatter.vue
        // 标准化: 提取 web-list/ 之后的部分
        const webListIdx = path.indexOf('web-list/')
        const relative = webListIdx >= 0 ? path.substring(webListIdx + 'web-list/'.length) : path
        const parts = relative.split('/')
        const category = parts[0] as ComponentCategory
        const dirName = parts[1]
        const fileName = parts[2].replace('.vue', '')

        // 匹配 README
        const readmePath = `${category}/${dirName}/README.md`
        const readmeLoader = readmeMap.get(readmePath)
        let readme = ''
        if (readmeLoader) {
          try {
            readme = await readmeLoader()
          } catch {
            // README 可能不存在，忽略
          }
        }

        // 提取源码前 80 行用于快速分析
        let sourcePrefix = ''
        try {
          const source = (await loader()) as string
          // 只取 <script> 部分或前100行
          const scriptMatch = source.match(
            /<script[^>]*>([\s\S]*?)<\/script>/
          )
          if (scriptMatch) {
            sourcePrefix = scriptMatch[1].substring(0, 2000)
          } else {
            sourcePrefix = source.substring(0, 2000)
          }
        } catch {
          // 源码加载失败，使用 README 代替
        }

        return buildKnowledge(category, fileName, relative, readme, sourcePrefix)
      })
    )

    collector.push(...batchResults.filter(Boolean) as ComponentKnowledge[])
    processed += batch.length
    console.log(
      `  📦 嵌套组件扫描进度: ${processed}/${total} (${Math.round((processed / total) * 100)}%)`
    )
  }
}

// ==================== 平铺组件扫描 (card-base) ====================

async function scanFlatComponents(collector: ComponentKnowledge[]) {
  // card-base 是平铺结构，无子目录，无 README
  const vueModules = import.meta.glob(
    '../../views/web-list/card-base/*.vue',
    { query: '?raw', import: 'default' }
  )

  const total = Object.keys(vueModules).length
  let processed = 0
  const batchSize = 30

  const entries = Object.entries(vueModules)

  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map(async ([path, loader]) => {
        const webListIdx = path.indexOf('web-list/')
        const relative = webListIdx >= 0 ? path.substring(webListIdx + 'web-list/'.length) : path
        const parts = relative.split('/')
        const category = 'card-base' as ComponentCategory
        const fileName = parts[1].replace('.vue', '')

        let source = ''
        try {
          source = (await loader()) as string
        } catch {
          return null
        }

        // card-base 无 README，从源码提取信息
        return buildKnowledgeFromSource(category, fileName, relative, source)
      })
    )

    collector.push(...batchResults.filter(Boolean) as ComponentKnowledge[])
    processed += batch.length
    console.log(
      `  📦 平铺组件扫描进度: ${processed}/${total} (${Math.round((processed / total) * 100)}%)`
    )
  }
}

// ==================== 知识提取 ====================

/**
 * 从 README + 源码前缀 构建组件知识条目
 */
function buildKnowledge(
  category: ComponentCategory,
  name: string,
  relativePath: string,
  readme: string,
  sourcePrefix: string
): ComponentKnowledge | null {
  if (!name || name === 'test' || name === '模板') return null

  const combined = readme + '\n' + sourcePrefix

  // 提取概要
  const summary = extractSummary(readme, name)

  // 提取核心特性
  const features = extractFeatures(readme, sourcePrefix)

  // 分类标签
  const sceneTags = extractTags(combined, SCENE_PATTERNS)
  const visualTags = extractTags(combined, VISUAL_STYLE_PATTERNS)
  const techTags = extractTags(combined, TECH_TAG_PATTERNS)

  // 技术检测
  const hasCanvas = /canvas/i.test(combined)
  const has3D = /3d|perspective|rotatex|rotatey|translatez|webgl|three\.js/i.test(combined)
  const hasScrollTrigger =
    /scrolltrigger|scroll-trigger|scroll trigger/i.test(combined)

  // 复杂度评估
  const complexity = assessComplexity(combined, hasCanvas, has3D)

  return {
    name,
    category,
    subPath: relativePath.replace('/' + name + '.vue', ''),
    summary,
    features,
    sceneTags,
    visualTags,
    techTags,
    complexity,
    hasCanvas,
    has3D,
    hasScrollTrigger
  }
}

/**
 * 从纯源码构建知识条目 (card-base 无 README 场景)
 */
function buildKnowledgeFromSource(
  category: ComponentCategory,
  name: string,
  relativePath: string,
  source: string
): ComponentKnowledge | null {
  if (!name || name === 'test' || name === '模板') return null

  // 从 template 中提取文本内容作为概要
  const templateMatch = source.match(
    /<template>([\s\S]*?)<\/template>/
  )
  let titleText = ''
  if (templateMatch) {
    // 提取 h1/h2/title 等关键文字
    const hMatch = templateMatch[1].match(
      /<(?:h[12]|div[^>]*class="[^"]*title[^"]*")[^>]*>([^<]+)</
    )
    if (hMatch) titleText = hMatch[1].trim()
  }

  // 提取特性的"区段"标题作为 features
  const sectionTitles = extractCardBaseFeatures(source)

  // 分类
  const sceneTags = extractTags(source, SCENE_PATTERNS)
  const visualTags = extractTags(source, VISUAL_STYLE_PATTERNS)
  const techTags = extractTags(source, TECH_TAG_PATTERNS)

  const hasCanvas = /canvas/i.test(source)
  const has3D = /3d|perspective|rotatex|rotatey|translatez|webgl/i.test(source)
  const hasScrollTrigger = /scrolltrigger/i.test(source)
  const complexity = assessComplexity(source, hasCanvas, has3D)

  return {
    name,
    category,
    subPath: relativePath.replace('/' + name + '.vue', ''),
    summary: titleText
      ? `${name}: ${titleText}`
      : `${name}: 滚动动画组件`,
    features: sectionTitles || extractFeatures('', source),
    sceneTags,
    visualTags,
    techTags,
    complexity,
    hasCanvas,
    has3D,
    hasScrollTrigger
  }
}

// ==================== 文本分析辅助函数 ====================

/**
 * 从 README 提取概要描述
 */
function extractSummary(readme: string, fallbackName: string): string {
  if (!readme) return `${fallbackName}: GSAP 滚动动画组件`

  // 尝试提取标题行 "# ComponentName - 描述"
  const titleMatch = readme.match(/^#\s+\S+\s*[-–—]\s*(.+)$/m)
  if (titleMatch) return titleMatch[1].trim()

  // 提取 "## 概述" 下的第一行
  const overviewMatch = readme.match(/##\s*概述\s*\n+([^\n#]+)/i)
  if (overviewMatch) return overviewMatch[1].trim().substring(0, 100)

  // 提取第一段非空行
  const firstPara = readme
    .split('\n')
    .find(line => line.trim().length > 10 && !line.startsWith('#'))
  if (firstPara) return firstPara.trim().substring(0, 100)

  return `${fallbackName}: GSAP 滚动动画组件`
}

/**
 * 提取核心特性 (压缩到 80 字符)
 */
function extractFeatures(readme: string, source: string): string {
  const features: string[] = []

  // 从 README 特性表格中提取
  if (readme) {
    const featureSection = readme.match(
      /(?:核心特性|特性|##\s*[^#]*特性)[\s\S]*?(?=##\s|\n#|$)/
    )
    if (featureSection) {
      // 从表格行提取
      const rows = featureSection[0].matchAll(
        /\|\s*\*{0,2}([^*|]+?)\*{0,2}\s*\|/g
      )
      for (const row of rows) {
        const key = row[1].trim()
        if (
          key.length > 2 &&
          !key.match(/特性|实现方式|Feature|Implementation/)
        ) {
          features.push(compressFeature(key))
        }
      }
    }

    // 提取 使用场景
    const sceneSection = readme.match(
      /使用场景[\s\S]*?(✅[^\n]+)/g
    )
    if (sceneSection) {
      for (const s of sceneSection) {
        const scene = s.replace(/✅\s*/, '').trim()
        if (scene) features.push(compressFeature(scene))
      }
    }
  }

  // 降级：从源码提取
  if (features.length === 0) {
    const keywords = extractSourceKeywords(source)
    features.push(...keywords)
  }

  // 限制总长度
  let result = features.slice(0, 6).join(' ')
  if (result.length > 120) result = result.substring(0, 117) + '...'
  return result || 'GSAP动画组件'
}

/**
 * 压缩特性文本
 */
function compressFeature(text: string): string {
  return text
    .replace(/[【】\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[，,。.]/g, ' ')
    .trim()
    .substring(0, 40)
}

/**
 * 从源码提取关键词
 */
function extractSourceKeywords(source: string): string[] {
  const keywords: string[] = []
  if (/gsap\.fromTo|gsap\.to|gsap\.from/i.test(source)) keywords.push('fromTo动画')
  if (/scrub/i.test(source)) keywords.push('scrub滚动绑定')
  if (/stagger/i.test(source)) keywords.push('stagger错开')
  if (/particle|粒子/i.test(source)) keywords.push('粒子系统')
  if (/canvas/i.test(source)) keywords.push('Canvas渲染')
  if (/glitch|故障/i.test(source)) keywords.push('故障效果')
  if (/neon|霓虹/i.test(source)) keywords.push('霓虹发光')
  if (/glass|玻璃/i.test(source)) keywords.push('玻璃材质')
  if (/hologram|全息/i.test(source)) keywords.push('全息效果')
  if (/morph|变形/i.test(source)) keywords.push('变形动画')
  if (/liquid|fluid|液体/i.test(source)) keywords.push('液体效果')
  return keywords.slice(0, 5)
}

/**
 * 提取 card-base 组件的区段标题
 */
function extractCardBaseFeatures(source: string): string {
  const templateMatch = source.match(/<template>([\s\S]*?)<\/template>/)
  if (!templateMatch) return ''
  const template = templateMatch[1]

  // 提取 section-title 或类似标题
  const titles: string[] = []
  const titleRegex =
    /<div[^>]*class="[^"]*(?:section-title|sg-section-title|ss-section-title)[^"]*"[^>]*>([^<]+)</g
  let match
  while ((match = titleRegex.exec(template)) !== null) {
    titles.push(match[1].trim())
  }

  return titles.slice(0, 4).join(' ')
}

/**
 * 根据正则模式匹配提取标签
 */
function extractTags(text: string, patterns: [RegExp, string][]): string {
  const found = new Set<string>()
  const lower = text.toLowerCase()

  for (const [pattern, tag] of patterns) {
    if (pattern.test(lower)) {
      found.add(tag)
    }
  }

  // 如果完全没有匹配，给一个默认标签
  if (found.size === 0) return 'universal'
  return Array.from(found).join(',')
}

/**
 * 评估组件复杂度
 */
function assessComplexity(
  text: string,
  hasCanvas: boolean,
  has3D: boolean
): 'low' | 'medium' | 'high' {
  const lower = text.toLowerCase()

  let score = 0

  if (hasCanvas) score += 3
  if (has3D) score += 2
  if (/webgl|three\.js/i.test(lower)) score += 3
  if (/particle|粒子/i.test(lower)) score += 1
  if (/scrolltrigger|scroll-trigger/i.test(lower)) score += 1
  if (/morph|morphing/i.test(lower)) score += 1
  if (/shader|glsl/i.test(lower)) score += 2
  if (/raf|requestanimationframe/i.test(lower)) score += 1

  if (score <= 1) return 'low'
  if (score <= 3) return 'medium'
  return 'high'
}

// ==================== AI Prompt 格式化 ====================

/**
 * 将知识库格式化为 AI System Prompt 可用的紧凑文本
 */
export function formatKnowledgeForAI(
  knowledge: ComponentKnowledge[]
): string {
  const lines: string[] = []
  let currentCategory = ''

  const catMeta = new Map(
    CATEGORIES.map(c => [c.key, c])
  )

  for (const k of knowledge) {
    if (k.category !== currentCategory) {
      currentCategory = k.category
      const meta = catMeta.get(k.category)
      if (meta) {
        lines.push(
          `\n## ${meta.label} (${meta.key}) - ${meta.description} → 适用于: ${meta.scene}`
        )
      }
    }

    const complexityIcon =
      k.complexity === 'high'
        ? '🔴'
        : k.complexity === 'medium'
          ? '🟡'
          : '🟢'

    lines.push(
      `- **${k.name}** ${complexityIcon} | ${k.summary} | 风格:${k.visualTags} | 场景:${k.sceneTags} | 技术:${k.techTags || 'GSAP'}`
    )
  }

  return lines.join('\n')
}

/**
 * 获取类别元信息描述（用于 AI 选择组件时参考）
 */
export function getCategoryGuide(): string {
  return CATEGORIES.map(
    c =>
      `- **${c.label}** (${c.key}): ${c.description}，典型场景: ${c.scene}`
  ).join('\n')
}

/**
 * 获取类别统计
 */
export function getCategoryStats(
  knowledge: ComponentKnowledge[]
): Record<string, number> {
  const stats: Record<string, number> = {}
  for (const k of knowledge) {
    stats[k.category] = (stats[k.category] || 0) + 1
  }
  return stats
}

/**
 * 获取所有类别
 */
export function getCategories(): CategoryMeta[] {
  return CATEGORIES
}

/**
 * 清除缓存
 */
export function clearKnowledgeCache(): void {
  cachedKnowledge = null
  cacheTimestamp = 0
  console.log('🗑️ 组件知识库缓存已清除')
}
