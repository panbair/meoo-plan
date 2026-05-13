<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue'

// ============================================================
// 模块A: 数据加载层 - 获取所有组件源码和README
// ============================================================

// 动态导入所有组件源码（使用 ?raw 获取原始内容）
const vueModules = import.meta.glob(
  '../web-list/card-{image,img,text,3d,time,list}/*/[^R]*.vue',
  { eager: true, query: '?raw', import: 'default' }
)

// 动态导入所有README
const readmeModules = import.meta.glob(
  '../web-list/card-{image,img,text,3d,time,list}/*/README.md',
  { eager: true, query: '?raw', import: 'default' }
)

// ============================================================
// 模块B: 源码摘要提取
// ============================================================

interface ComponentInfo {
  dirName: string
  name: string
  path: string
  type: string
  sourceCode: string
  readme: string | null
  summary: ComponentSummary
  selected: boolean
  modulePosition: string  // 用于哪个模块: hero/screen2/screen3/feature/product/about/contact/footer
}

// 模块位置配置
interface ModulePosition {
  key: string
  label: string
  icon: string
  desc: string
}

const defaultModulePositions: ModulePosition[] = [
  { key: 'hero', label: '首屏 Hero', icon: '🎯', desc: '全屏首图/视频开场' },
  { key: 'screen2', label: '第二屏', icon: '📱', desc: '核心业务/价值主张' },
  { key: 'screen3', label: '第三屏', icon: '📊', desc: '数据展示/优势介绍' },
  { key: 'feature', label: '特色模块', icon: '⭐', desc: '产品特点/服务优势' },
  { key: 'product', label: '产品/案例', icon: '🎨', desc: '作品展示/产品列表' },
  { key: 'about', label: '关于我们', icon: '👥', desc: '团队/品牌故事' },
  { key: 'contact', label: '联系/CTA', icon: '📧', desc: '表单/联系方式' },
  { key: 'footer', label: '页脚', icon: '📋', desc: '链接/版权信息' },
]

const MODULE_CONFIG_KEY = 'web-ai-module-positions'

function loadModulePositions(): ModulePosition[] {
  try {
    const saved = localStorage.getItem(MODULE_CONFIG_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load module positions:', e)
  }
  return defaultModulePositions
}

function saveModulePositions(positions: ModulePosition[]) {
  localStorage.setItem(MODULE_CONFIG_KEY, JSON.stringify(positions))
}

// 模块位置配置（响应式）
const modulePositions = ref<ModulePosition[]>(loadModulePositions())

// 配置编辑状态
const showModuleEditor = ref(false)
const editingPositions = ref<ModulePosition[]>([...modulePositions.value])

function openModuleEditor() {
  editingPositions.value = modulePositions.value.map(p => ({ ...p }))
  showModuleEditor.value = true
}

function closeModuleEditor() {
  showModuleEditor.value = false
}

function saveModuleConfig() {
  modulePositions.value = [...editingPositions.value]
  saveModulePositions(modulePositions.value)
  showModuleEditor.value = false
}

function resetModuleConfig() {
  editingPositions.value = [...defaultModulePositions]
}

function addModulePosition() {
  const maxIndex = editingPositions.value.reduce((max, p) => {
    const match = p.key.match(/^custom(\d+)$/)
    return match ? Math.max(max, parseInt(match[1])) : max
  }, 0)
  editingPositions.value.push({
    key: `custom${maxIndex + 1}`,
    label: `自定义模块${maxIndex + 1}`,
    icon: '🔧',
    desc: '自定义描述'
  })
}

function removeModulePosition(index: number) {
  editingPositions.value.splice(index, 1)
}

interface ComponentSummary {
  template: TemplateSummary
  script: ScriptSummary
  style: StyleSummary
}

interface TemplateSummary {
  rootTag: string
  domTree: string
  hasCanvas: boolean
  hasSvg: boolean
  vForCount: number
  imageCount: number
}

interface ScriptSummary {
  props: string[]
  scrollTriggers: ScrollTriggerInfo[]
  gsapMethods: string[]
  canvasAnimation: boolean
  mouseInteraction: boolean
  cleanup: string[]
}

interface ScrollTriggerInfo {
  start: string
  end: string
  scrub: number | null
  animation: string
}

interface StyleSummary {
  bgColor: string
  gradientBg: boolean
  responsive: boolean
  keyframes: string[]
}

/**
 * 提取Vue SFC的template/script/style部分
 */
function extractSFCParts(code: string) {
  const templateMatch = code.match(/<template>([\s\S]*?)<\/template>/)
  const scriptMatch = code.match(/<script[^>]*>([\s\S]*?)<\/script>/)
  const styleMatch = code.match(/<style[^>]*>([\s\S]*?)<\/style>/)

  return {
    template: templateMatch?.[1] || '',
    script: scriptMatch?.[1] || '',
    style: styleMatch?.[1] || ''
  }
}

/**
 * 提取Template摘要
 */
function extractTemplateSummary(template: string): TemplateSummary {
  // 根标签
  const rootMatch = template.match(/^\s*<(\w+)/)
  const rootTag = rootMatch?.[1] || 'div'

  // DOM树结构（简化版）
  const tags = template.match(/<[a-z][a-zA-Z-]*\s/g) || []
  const uniqueTags = [...new Set(tags.map(t => t.slice(1)))]
  const domTree = uniqueTags.slice(0, 15).join(' > ')

  // 检测Canvas/SVG
  const hasCanvas = /<canvas/.test(template)
  const hasSvg = /<svg/.test(template)

  // v-for数量
  const vForMatches = template.match(/v-for="[^"]*"/g) || []
  const vForCount = vForMatches.length

  // 图片数量
  const imgMatches = template.match(/<img|src=|:src=/g) || []
  const imageCount = imgMatches.length / 3

  return {
    rootTag,
    domTree,
    hasCanvas,
    hasSvg,
    vForCount,
    imageCount: Math.floor(imageCount)
  }
}

/**
 * 提取Script摘要
 */
function extractScriptSummary(script: string): ScriptSummary {
  // Props提取 - 增强版
  const props: string[] = []
  // 匹配 interface Props 中的属性定义
  const propsInterfaceMatch = script.match(/interface\s+Props\s*\{([^}]+)\}/s)
  if (propsInterfaceMatch) {
    const propLines = propsInterfaceMatch[1].split('\n')
    propLines.forEach(line => {
      const propMatch = line.match(/^\s*(\w+)\?\?:\s*(string|number|boolean|object|Array<string>|string\[\])/)
      if (propMatch) {
        props.push(`${propMatch[1]}${propMatch[0].includes('?') ? '?' : ''}: ${propMatch[2]}`)
      }
    })
  }
  // 回退：匹配 withDefaults(defineProps<...>)
  if (props.length === 0) {
    const withDefaultsMatch = script.match(/withDefaults\(defineProps<[^>]+>\(\)\s*,\s*\{([^}]+)\}/s)
    if (withDefaultsMatch) {
      const propLines = withDefaultsMatch[1].split('\n')
      propLines.forEach(line => {
        const propMatch = line.match(/^\s*(\w+)\s*:/)
        if (propMatch) {
          props.push(propMatch[1])
        }
      })
    }
  }
  // 回退：匹配 defineProps({...})
  if (props.length === 0) {
    const definePropsMatch = script.match(/defineProps\(\{([\s\S]*?)\}\)/)
    if (definePropsMatch) {
      const propLines = definePropsMatch[1].split('\n')
      propLines.forEach(line => {
        const propMatch = line.match(/^\s*(\w+)\s*:/)
        if (propMatch) {
          props.push(propMatch[1])
        }
      })
    }
  }

  // ScrollTrigger配置提取
  const stMatches = script.match(/ScrollTrigger\s*:\s*\{[^}]+\}/gs) || []
  const scrollTriggers: ScrollTriggerInfo[] = stMatches.map(st => {
    const getParam = (key: string) => {
      const match = st.match(new RegExp(`${key}\\s*[::]\\s*['"]([^'"]+)['"]`)) ||
        st.match(new RegExp(`${key}\\s*[::]\\s*(\\d+)`))
      return match?.[1] || ''
    }
    return {
      start: getParam('start'),
      end: getParam('end'),
      scrub: st.includes('scrub') ? parseFloat(st.match(/scrub\s*[::]\s*(\d+(?:\.\d+)?)/)?.[1] || '0') : null,
      animation: st.includes('animation') ? 'timeline' : 'basic'
    }
  }).filter(st => st.start || st.end)

  // GSAP方法检测
  const gsapMethods: string[] = []
  if (/gsap\.timeline/.test(script)) gsapMethods.push('timeline')
  if (/gsap\.fromTo|\.from\(|\.to\(/.test(script)) gsapMethods.push('tween')
  if (/stagger/.test(script)) gsapMethods.push('stagger')
  if (/yoyo|repeat\s*:/.test(script)) gsapMethods.push('repeat')
  if (/ScrollTrigger\.create/.test(script)) gsapMethods.push('ScrollTrigger.create')

  // Canvas动画检测
  const canvasAnimation = /getContext\s*\(\s*['"]2d['"]/.test(script) || /requestAnimationFrame/.test(script)

  // 鼠标交互检测
  const mouseInteraction = /@click|@mouse|addEventListener\s*\(\s*['"]mous/.test(script)

  // 清理机制
  const cleanup: string[] = []
  if (/onUnmounted|onBeforeUnmount/.test(script)) cleanup.push('lifecycle')
  if (/ScrollTrigger\.getAll\(\)\.forEach/.test(script)) cleanup.push('ScrollTrigger')
  if (/gsap\.killTweensOf|gsap\.kill/.test(script)) cleanup.push('GSAP')

  return {
    props,
    scrollTriggers,
    gsapMethods,
    canvasAnimation,
    mouseInteraction,
    cleanup
  }
}

/**
 * 提取Style摘要
 */
function extractStyleSummary(style: string): StyleSummary {
  // 背景色
  const bgMatch = style.match(/background(?:\s*:\s*[^;]+linear-gradient|[^;]*)[;]/)
  const bgColor = bgMatch?.[0] || ''

  // 渐变检测
  const gradientBg = /linear-gradient|radial-gradient/.test(style)

  // 响应式检测
  const responsive = /@media/.test(style)

  // 关键帧动画
  const keyframes = style.match(/@keyframes\s+(\w+)/g) || []
    .map(k => k.replace('@keyframes ', ''))

  return {
    bgColor: bgColor.slice(0, 100),
    gradientBg,
    responsive,
    keyframes
  }
}

/**
 * 完整摘要提取
 */
function extractComponentSummary(sourceCode: string, readme: string | null): ComponentSummary {
  const { template, script, style } = extractSFCParts(sourceCode)

  return {
    template: extractTemplateSummary(template),
    script: extractScriptSummary(script),
    style: extractStyleSummary(style)
  }
}

/**
 * 从组件源码中提取精简代码片段供 DeepSeek 参考
 * 只提取 Props 定义、GSAP/ScrollTrigger 关键代码、onMounted/onUnmounted 生命周期
 * 控制在每个组件约 800-1200 字符，避免超出 token 限制
 */
function extractComponentCodeForPrompt(sourceCode: string): string {
  const { script } = extractSFCParts(sourceCode)
  const parts: string[] = []

  // 1. 提取 Props 定义（interface Props 或 withDefaults 或 defineProps）
  // 匹配 interface Props { ... }
  const propsInterfaceMatch = script.match(/interface\s+Props\s*\{[\s\S]*?\}/)
  if (propsInterfaceMatch) {
    parts.push(`// Props定义\n${propsInterfaceMatch[0]}`)
  }

  // 匹配 withDefaults(defineProps<...>(), { ... })
  const withDefaultsMatch = script.match(/withDefaults\s*\(\s*defineProps<[^>]*>\s*\(\s*\)\s*,\s*\{[\s\S]*?\}\s*\)/)
  if (withDefaultsMatch && !propsInterfaceMatch) {
    parts.push(`// Props定义(withDefaults)\n${withDefaultsMatch[0]}`)
  }

  // 匹配 defineProps({ ... })
  const definePropsMatch = script.match(/defineProps\s*\(\s*\{[\s\S]*?\}\s*\)/)
  if (definePropsMatch && !propsInterfaceMatch && !withDefaultsMatch) {
    parts.push(`// Props定义(defineProps)\n${definePropsMatch[0]}`)
  }

  // 如果都没有 Props，明确标注
  if (!propsInterfaceMatch && !withDefaultsMatch && !definePropsMatch) {
    parts.push('// 该组件无 Props 定义')
  }

  // 2. 提取 onMounted / onUnmounted / onBeforeUnmount 生命周期块
  const lifecycleMatch = script.match(/(?:onMounted|onUnmounted|onBeforeUnmount)\s*\([\s\S]*?\n\}/g)
  if (lifecycleMatch) {
    // 只取前2个，控制长度
    lifecycleMatch.slice(0, 2).forEach(block => {
      const trimmed = block.trim()
      if (trimmed.length < 600) {
        parts.push(`// 生命周期\n${trimmed}`)
      } else {
        // 截断过长代码
        parts.push(`// 生命周期(精简)\n${trimmed.slice(0, 500)}\n// ...`)
      }
    })
  }

  // 3. 提取 GSAP timeline / ScrollTrigger 配置块
  // 匹配 gsap.timeline({...}) 调用
  const timelineMatches = script.match(/(?:const|let)\s+\w+\s*=\s*gsap\.timeline\s*\([\s\S]*?\)[\s\S]*?;?\s*(?:\.to\(|\.from\(|\.fromTo\()[\s\S]*?(?:;\n|\.then|\n\})/g)
  if (timelineMatches) {
    timelineMatches.slice(0, 2).forEach(block => {
      const trimmed = block.trim()
      if (trimmed.length < 500) {
        parts.push(`// GSAP动画\n${trimmed}`)
      } else {
        parts.push(`// GSAP动画(精简)\n${trimmed.slice(0, 400)}\n// ...`)
      }
    })
  }

  // 4. 提取 ScrollTrigger.create / ScrollTrigger 配置
  const stMatches = script.match(/ScrollTrigger\s*(?:\.create)?\s*[:=]\s*\{[\s\S]*?\}/g)
  if (stMatches) {
    stMatches.slice(0, 2).forEach(block => {
      const trimmed = block.trim()
      if (trimmed.length < 400) {
        parts.push(`// ScrollTrigger配置\n${trimmed}`)
      } else {
        parts.push(`// ScrollTrigger配置(精简)\n${trimmed.slice(0, 300)}\n// ...`)
      }
    })
  }

  // 合并并限制总长度
  const result = parts.join('\n\n')
  return result.length > 1500 ? result.slice(0, 1500) + '\n// ... (代码已精简)' : result
}

/**
 * 格式化摘要为可读文本
 */
function formatSummaryForPrompt(summary: ComponentSummary, readme: string | null): string {
  const parts: string[] = []

  // Template部分
  const t = summary.template
  parts.push(`【模板】根元素:${t.rootTag}`)
  parts.push(`DOM结构:${t.domTree}`)
  if (t.hasCanvas) parts.push('使用Canvas动画')
  if (t.hasSvg) parts.push('包含SVG元素')
  if (t.vForCount > 0) parts.push(`v-for循环:${t.vForCount}处`)
  if (t.imageCount > 0) parts.push(`图片元素:${t.imageCount}个`)

  // Script部分
  const s = summary.script
  if (s.props.length > 0) parts.push(`Props参数: ${s.props.join(', ')}`)
  if (s.scrollTriggers.length > 0) {
    parts.push(`ScrollTrigger配置数:${s.scrollTriggers.length}`)
    s.scrollTriggers.forEach((st, i) => {
      const cfg = []
      if (st.start) cfg.push(`start:${st.start}`)
      if (st.end) cfg.push(`end:${st.end}`)
      if (st.scrub !== null) cfg.push(`scrub:${st.scrub}`)
      parts.push(`  动画${i + 1}: ${cfg.join(', ')}`)
    })
  }
  if (s.gsapMethods.length > 0) parts.push(`GSAP方法:${s.gsapMethods.join(', ')}`)
  if (s.canvasAnimation) parts.push('包含Canvas粒子系统')
  if (s.mouseInteraction) parts.push('支持鼠标交互')
  if (s.cleanup.length > 0) parts.push(`清理机制:${s.cleanup.join(', ')}`)

  // Style部分
  const st = summary.style
  if (st.gradientBg) parts.push('使用渐变背景')
  if (st.responsive) parts.push('包含响应式设计')
  if (st.keyframes.length > 0) parts.push(`CSS动画:${st.keyframes.length}个`)

  // README补充（如果存在）- 增强版效果描述提取
  if (readme) {
    // 1. 提取核心动画/效果描述
    const effectMatch = readme.match(/### 核心动画\n([\s\S]*?)(?=##|$)/) ||
      readme.match(/### 核心效果\n([\s\S]*?)(?=##|$)/) ||
      readme.match(/### 动画效果\n([\s\S]*?)(?=##|$)/)
    if (effectMatch) {
      const effects = effectMatch[1].match(/-\s*\*\*([^*]+)\*\*:\s*([^\n-]+)/g) || []
      if (effects.length > 0) {
        parts.push('【效果描述】')
        effects.slice(0, 5).forEach(e => {
          const match = e.match(/-\s*\*\*([^*]+)\*\*:\s*([^\n-]+)/)
          if (match) parts.push(`  • ${match[1]}: ${match[2].trim().slice(0, 80)}`)
        })
      }
    }

    // 2. 提取组件简介（第一段非标题文字）
    const introMatch = readme.match(/^(?!#)[^\n]{20,}/m)
    if (introMatch && !effectMatch) {
      parts.push(`【简介】${introMatch[0].trim().slice(0, 100)}`)
    }

    // 3. 提取技术实现要点
    const techMatch = readme.match(/\|\s*技术\s*\|[^|]+\|([^|]+)\|/g)
    if (techMatch && techMatch.length > 0) {
      parts.push(`【技术】${techMatch.slice(0, 3).join(' | ')}`)
    }

    // 4. 如果效果描述不够，提取其他关键段落
    if (!effectMatch || effectMatch[1].length < 50) {
      const keyLines = readme.split('\n').filter(l =>
        l.trim().length > 15 &&
        !l.startsWith('#') &&
        !l.startsWith('|') &&
        !l.startsWith('```') &&
        !l.startsWith('---') &&
        !l.startsWith('- **') &&
        !l.startsWith('>')
      ).slice(0, 3)
      if (keyLines.length > 0) {
        parts.push('【补充说明】')
        keyLines.forEach(l => parts.push(`  ${l.trim().slice(0, 80)}`))
      }
    }
  }

  return parts.join('\n')
}

// ============================================================
// 模块C: Prompt构建
// ============================================================

interface EnterpriseInfo {
  name: string
  industry: string
  description: string
  targetAudience: string
  mainColors: string
  websiteType: string
}

function buildPrompt(
  enterpriseInfo: EnterpriseInfo,
  selectedComponents: ComponentInfo[],
  positions: ModulePosition[]
): string {
  // 按模块位置分组组件 - 使用配置的模块
  const moduleLabels: Record<string, string> = {}
  const moduleOrder: string[] = []
  positions.forEach(pos => {
    moduleLabels[pos.key] = pos.label
    moduleOrder.push(pos.key)
  })

  // 按模块位置分组
  const componentsByModule: Record<string, ComponentInfo[]> = {}
  selectedComponents.forEach(comp => {
    if (!componentsByModule[comp.modulePosition]) {
      componentsByModule[comp.modulePosition] = []
    }
    componentsByModule[comp.modulePosition].push(comp)
  })

  // 构建模块-组件对应表（摘要信息 + 源码片段）
  const moduleComponentMap = moduleOrder
    .filter(pos => componentsByModule[pos]?.length > 0)
    .map((pos, index) => {
      const comps = componentsByModule[pos]
      const compsList = comps.map((comp) => {
        const summaryText = formatSummaryForPrompt(comp.summary, comp.readme)
        // 提取组件精简源码片段（Props + GSAP 关键代码）
        const codeSnippet = extractComponentCodeForPrompt(comp.sourceCode)
        return `#### ${comp.dirName} (${comp.type})
${summaryText}

**组件源码片段（Vue3原始代码，转React时参考）**：
\`\`\`typescript
${codeSnippet}
\`\`\``
      }).join('\n\n')
      return `### ${index + 1}. ${moduleLabels[pos] || pos}
**使用组件** (${comps.length}个):
${compsList}`
    }).join('\n\n')

  // 按类型分组汇总
  const componentsByType: Record<string, ComponentInfo[]> = {}
  selectedComponents.forEach(comp => {
    if (!componentsByType[comp.type]) {
      componentsByType[comp.type] = []
    }
    componentsByType[comp.type].push(comp)
  })
  const typeSummary = Object.entries(componentsByType)
    .map(([type, comps]) => `${type}: ${comps.length}个`)
    .join('\n')

  return `# 角色设定
你是一位专业的 React 企业网站开发方案设计师。你必须基于用户已选配的动画组件，输出一份完整、专业、可落地的网站开发方案文档。该方案将用于阿里 meoo（秒悟）AI 平台生成网站，因此技术栈必须是 React。

# 关键约束（必须遵守）
1. **技术栈必须是 React 18 + TypeScript**：所有代码示例必须使用 React 函数组件 + TypeScript + TSX 格式，禁止使用 Vue 语法（v-for、v-if、ref()、onMounted 等均为 Vue 语法，必须转为 React 的 map、条件渲染、useState/useRef、useEffect）
2. **组件已由用户指定**：用户已为每个模块选好了具体组件，你必须使用这些组件，不得更换或重新挑选
3. **组件名称必须准确**：方案中引用的组件名称必须与下方"模块组件规划"中列出的完全一致
4. **代码使用 Tailwind CSS**：样式使用 Tailwind CSS 实用类，结合自定义 CSS 变量
5. **Props 必须严格基于组件源码**：下方每个组件都附带了源码片段，其中包含 Props 的真实定义。你必须：
   - 仔细阅读源码片段中的 Props 定义（interface Props 或 withDefaults 或 defineProps）
   - **只配置源码中实际存在的 Props**，不得臆造源码中没有的参数
   - 如果源码标注"该组件无 Props 定义"，则 Props 配置写"该组件无外部Props，内容在组件内部定义"即可，不要编造任何参数
   - 如果源码中有 Props 如 title?, subtitle?, paragraphs?, autoPlay?, imageUrl?, fluidIntensity? 等，必须全部给出具体值，不可遗漏
6. **组件使用方式要正确**：如果组件内部已有 v-for 循环渲染多个项目，则该组件只需使用1次并传入数组数据，不要重复渲染同一组件多次
7. **ScrollTrigger 模式要严格基于源码，且代码与描述必须一致**：请根据组件源码中的 GSAP 代码正确选择：
   - 如果源码中 ScrollTrigger 配置了 \`scrub: true\` 或 \`scrub: 数字\`，则使用 scrub 模式
   - 如果源码中 ScrollTrigger 配置中没有 scrub 属性，而是使用了 \`toggleActions\`，则使用 toggleActions 模式
   - 如果源码使用了 \`ScrollTrigger.create\`，请检查其内部是否有 \`scrub\` 属性来决定模式
   - **混合模式**：如果组件源码中同时使用了 scrub 和 toggleActions（不同元素使用不同模式），GSAP 动画策略中必须同时列出所有模式，不可只标注一种。例如："header部分使用 toggleActions，卡片部分使用 scrub"
   - **严格基于源码，不可推断**：判断 ScrollTrigger 模式时，必须基于源码片段中的实际代码，不要推断源码中没有的 scrollTrigger 配置。如果源码中 timeline 没有 scrollTrigger 属性，就不能声称该 timeline 使用了 scrub 或 toggleActions 模式。只能描述源码中明确存在的配置
   - **关键**：GSAP 动画策略描述的 scrub/toggleActions 模式，必须与 React 代码示例中的 ScrollTrigger 配置完全一致！如果策略描述写 scrub，代码里也必须写 scrub；如果策略描述写 toggleActions，代码里绝不能写 scrub。自相矛盾是严重错误
8. **Section 层 GSAP 代码要避免与组件内部 ScrollTrigger 冲突**：
   - **核心原则**：动画组件内部已自带完整的 GSAP 动画逻辑和 ScrollTrigger 配置，Section 层不需要重复创建功能重叠的 ScrollTrigger
   - **情况A - 组件源码中已自带 scrollTrigger 配置**：如果源码中已有 \`scrollTrigger: { trigger: ... }\` 或 \`ScrollTrigger.create({ ... })\`，说明组件内部的动画已有自己的滚动控制。此时 Section 层**不需要再创建额外的 ScrollTrigger**，组件内部的 ScrollTrigger 会自动以其自身元素为 trigger 触发。Section 层只需提供容器即可
   - **情况B - 组件源码中无 scrollTrigger 配置**：如果源码中的 timeline/动画没有 scrollTrigger，说明组件内部动画不会自动由滚动触发。此时 Section 层可以通过 ScrollTrigger.create 来控制组件进入视口时的触发时机
   - **避免冲突**：如果 Section 层的 ScrollTrigger 和组件内部的 ScrollTrigger 作用于同一区域但互不关联，会导致动画行为不可预期。务必根据源码判断是否需要在 Section 层添加 ScrollTrigger
   - **paused: true timeline 的特殊处理**：如果组件源码中的 timeline 使用了 \`paused: true\`（暂停状态，需要手动 \`.play()\` 触发），Section 层的 \`ScrollTrigger.create\` 的 toggleActions 无法直接控制组件内部 timeline 的播放。此时应在 GSAP 动画策略中说明："组件内部使用 paused: true + ScrollTrigger 联动机制，需在组件转 React 时将 ScrollTrigger 的 onEnter 回调与 timeline.play() 绑定"。**React 代码示例中不要创建一个空的 gsap.timeline 再调 play()——这是不可能工作的占位代码，因为 Section 层无法访问组件内部的 timeline。正确做法是：Section 层只提供容器 + gsap.context 清理即可，绑定逻辑在组件转 React 时在组件内部实现**
   - 情况A示例（组件自带scrollTrigger，Section层不重复创建）：
   \`\`\`tsx
   // 组件源码已有 scrollTrigger: { trigger: ..., scrub: 1.5 }
   // Section层只需提供容器，不需要额外 ScrollTrigger
   useEffect(() => {
     const ctx = gsap.context(() => {
       // 无需创建 ScrollTrigger，组件内部已自带
     }, sectionRef);
     return () => ctx.revert();
   }, []);
   \`\`\`
   - 情况B示例（组件无scrollTrigger，Section层提供触发控制）：
   \`\`\`tsx
   // 组件源码中 timeline 无 scrollTrigger，是 paused: true 或自动播放
   // Section层提供 ScrollTrigger 控制入场时机
   useEffect(() => {
     const ctx = gsap.context(() => {
       ScrollTrigger.create({
         trigger: sectionRef.current,
         start: 'top 80%',
         toggleActions: 'play none none reverse',
       });
     }, sectionRef);
     return () => ctx.revert();
   }, []);
   \`\`\`
9. **图片必须使用 Unsplash**：所有需要图片的地方，使用 Unsplash 图片地址，格式为 \`https://images.unsplash.com/photo-XXXXXXXX?w=1920&q=80\`。选择与企业行业/品牌调性匹配的高质量图片。不要使用本地路径如 \`/images/xxx.jpg\`
10. **GSAP 插件必须注册**：如果使用 gsap.scrollTo 或 ScrollToPlugin，必须在文件顶部 \`gsap.registerPlugin(ScrollToPlugin)\`；如果使用 ScrollTrigger，必须 \`gsap.registerPlugin(ScrollTrigger)\`。不要使用未注册的 GSAP 插件功能

# 企业信息
- **企业名称**: ${enterpriseInfo.name}
- **所属行业**: ${enterpriseInfo.industry}
- **企业简介**: ${enterpriseInfo.description}
- **目标受众**: ${enterpriseInfo.targetAudience}
- **品牌主色**: ${enterpriseInfo.mainColors}
- **网站类型**: ${enterpriseInfo.websiteType}

# 模块组件规划（用户已指定，不可更改）
${moduleComponentMap || '暂无'}

# 组件类型汇总
${typeSummary}

# 输出格式要求
请严格按照以下结构输出方案文档，每一节都要有实质性内容：

---
# ${enterpriseInfo.name} 网站开发方案文档

## 一、项目概述
- **项目名称**: 为企业取一个贴合行业特色的名称
- **项目类型**: 单页滚动式企业官网
- **技术栈**: React 18 + TypeScript + Vite + Tailwind CSS + GSAP (ScrollTrigger) + Canvas API
- **设计理念**: 结合企业品牌色和所选组件的视觉特效，阐述整体设计风格。设计理念要具体，不要泛泛而谈

## 二、项目架构
### 2.1 技术选型
| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | 核心UI框架（函数组件 + Hooks） |
| TypeScript | 5.x | 类型安全 |
| Vite | 5.x | 构建工具 |
| Tailwind CSS | 3.x | 实用优先CSS框架 |
| GSAP | 3.12+ | 动画引擎（含 ScrollTrigger 插件） |
| Canvas API | - | 粒子/流体等高级视觉效果 |

### 2.2 项目结构
\`\`\`
src/
├── components/
│   ├── [列出用户选配的所有组件，每个一个文件夹]
│   ├── Navbar.tsx
│   └── ScrollToTop.tsx
├── sections/
│   ├── HeroSection.tsx
│   ├── [其他模块Section]
├── hooks/
│   └── useGsapAnimation.ts
├── App.tsx
├── main.tsx
└── index.css
\`\`\`

## 三、模块详细设计（核心部分）
**这是方案最重要的部分！针对每个模块逐一详细说明。**

对每个模块，必须包含以下8项：

### 3.x [模块名称]
- **模块定位**: 在整体页面中的角色和目标
- **使用组件**: 必须填写用户指定的组件名称（不可更改）
- **设计说明**: 结合企业信息和该组件的视觉效果，说明该模块展示什么内容、传递什么信息
- **内容规划**: 写出具体的中文文案，包括：
  - 主标题（要与企业行业/业务紧密相关，不要通用模板如"智能驱动未来"）
  - 副标题
  - 段落描述文字
  - 图片（使用 Unsplash 图片地址，格式 https://images.unsplash.com/photo-XXXXXXXX?w=1920&q=80）
- **Props 配置**: 严格基于组件源码片段中的 Props 定义，列出每个 prop 的具体值。注意：
  - 只配置源码中实际存在的 Props
  - 如果源码显示组件无 Props 定义，写"该组件无外部Props，内容在组件内部定义"
  - 绝对不可臆造源码中没有的参数
- **React 代码示例**: 使用函数组件 + TypeScript 格式，展示如何引入和使用该组件，包含：
  - 完整的 props 传值（只传源码中存在的 Props）
  - 根据组件源码判断是否需要 Section 层 GSAP 代码：
    - 如果组件源码已自带 scrollTrigger 配置，Section 层只需提供容器（useEffect + gsap.context 清理即可，不创建额外 ScrollTrigger）
    - 如果组件源码无 scrollTrigger 配置，Section 层需提供 ScrollTrigger.create 控制入场时机
  - 如果组件源码中 timeline 使用了 paused: true，应在策略中说明"需在组件转React时将ScrollTrigger的onEnter回调与timeline.play()绑定"。React代码示例中不要创建空的gsap.timeline再调play()（这是不可能工作的占位代码），Section层只需容器+gsap.context清理
  - useRef 引用容器元素
  - gsap.context 清理
- **GSAP 动画策略**: 基于组件源码分析其 ScrollTrigger 配置，说明：
  - 组件内部自带的 ScrollTrigger 模式（scrub/toggleActions/mixed）及配置参数
  - Section 层是否需要额外 ScrollTrigger（根据源码是否有 scrollTrigger 判断）
  - 如果组件内部同时存在 scrub 和 toggleActions（混合模式），必须全部列出

## 四、页面组合实现
给出完整的 App.tsx 代码，将所有模块 Section 组件组合为单页滚动页面：
- 导入所有 Section 组件
- 使用全屏 section 布局
- 配置全局 ScrollTrigger
- 导航栏组件实现代码（固定顶部，透明→滚动后毛玻璃效果，包含各模块锚点链接和高亮状态。滚动监听优先使用ScrollTrigger.create而非window.addEventListener('scroll')，以获得更好的性能和与其他ScrollTrigger实例的协调性）
- 平滑滚动到各模块锚点的实现
- Footer 底部区域（版权年份使用 \`{new Date().getFullYear()}\` 动态生成，不要写死年份）

## 五、动画系统
### 5.1 全局 GSAP ScrollTrigger 配置代码（React 格式，useEffect + useLayoutEffect）
### 5.2 各模块动画时序表
| 模块 | 触发位置 | ScrollTrigger模式 | 动画类型 | 持续时间 |
### 5.3 性能优化建议（GPU加速、减少动画偏好适配、Canvas离屏渲染、IntersectionObserver懒加载）

## 六、样式系统
### 6.1 设计令牌（Tailwind CSS 自定义配置 + CSS变量，颜色要与企业品牌主色一致。注意：CSS变量的值不能包含属性名，如 `--x: backdrop-filter: blur(12px)` 是错误的，应写为 `--x: blur(12px)` 然后使用 `backdrop-filter: var(--x)`）
### 6.2 全局样式（与品牌色匹配的渐变、毛玻璃效果等）
### 6.3 响应式断点策略

---

请确保：
1. **技术栈严格使用 React 18**：所有代码示例必须是 React 函数组件 + TSX 格式，使用 useState、useEffect、useRef 等 Hooks
2. **组件名称必须与用户指定的一致**：不得更改、不得遗漏
3. **Props 严格基于源码**：只配置源码中存在的 Props，不得臆造不存在的参数。源码显示无 Props 的组件，不要编造参数
4. **代码GSAP逻辑要避免冲突**：根据组件源码判断Section层是否需要ScrollTrigger。如果组件源码已自带scrollTrigger配置，Section层不要重复创建；如果组件源码无scrollTrigger，Section层才需提供触发控制。组件源码中timeline使用paused:true时，应说明需在组件转React时将ScrollTrigger的onEnter回调与timeline.play()绑定，且Section层代码不要创建空的gsap.timeline再调play()
5. **ScrollTrigger 模式一致性**：GSAP 动画策略描述的 scrub/toggleActions 必须与代码中的 ScrollTrigger 配置一致，不可自相矛盾。组件内部同时存在多种模式时必须全部列出。判断模式必须严格基于源码实际代码，不可推断源码中没有的scrollTrigger配置
6. **图片使用 Unsplash 地址**：不要使用本地路径，使用 https://images.unsplash.com/photo-XXXXXXXX?w=1920&q=80 格式
7. **GSAP 插件必须注册**：使用 ScrollToPlugin 必须注册 gsap.registerPlugin(ScrollToPlugin)，使用 ScrollTrigger 必须注册 gsap.registerPlugin(ScrollTrigger)
8. **文案要贴合企业行业**：标题、副标题、描述文字要与企业的行业、业务紧密相关，避免使用通用模板文案
9. **CSS变量语法正确**：CSS变量的值不能包含属性名，如 `--x: backdrop-filter: blur(12px)` 是错误的，应写为 `--x: blur(12px)`
10. **Navbar滚动监听优先使用ScrollTrigger**：优先使用ScrollTrigger.create而非window.addEventListener('scroll')
11. **Footer版权年份动态化**：版权年份使用 \`{new Date().getFullYear()}\` 动态生成，不要写死年份
12. 整体格式专业、层级清晰`
}

// ============================================================
// DeepSeek API调用（流式）
// ============================================================

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || ''

const isGenerating = ref(false)
const generatedPlan = ref('')
const errorMessage = ref('')

async function generatePlan() {
  if (!API_KEY) {
    errorMessage.value = '请先在 .env 文件中配置 VITE_DEEPSEEK_API_KEY'
    return
  }

  if (selectedComponents.value.length === 0) {
    errorMessage.value = '请至少选择一个组件'
    return
  }

  if (!enterpriseInfo.name) {
    errorMessage.value = '请填写企业名称'
    return
  }

  isGenerating.value = true
  errorMessage.value = ''
  generatedPlan.value = ''
  const prompt = buildPrompt(enterpriseInfo, selectedComponents.value, modulePositions.value)

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位资深的全栈开发工程师，专精于 React 18 + TypeScript + GSAP 动画的企业网站开发。你输出的方案文档必须专业、可落地、代码示例可直接参考使用。关键要求：1)所有代码必须是 React 18 函数组件+TSX格式，禁止Vue语法；2)Props必须严格基于用户提供的组件源码片段，源码中有的Props必须全部配置具体值，源码中没有的Props绝对不可编造；3)Section层GSAP代码要避免与组件内部ScrollTrigger冲突——如果组件源码已自带scrollTrigger配置，Section层不要重复创建ScrollTrigger，只需提供容器和gsap.context清理；如果组件源码无scrollTrigger，Section层才需提供ScrollTrigger.create触发控制；如果组件源码中timeline使用paused:true，应说明需在组件转React时将ScrollTrigger的onEnter回调与timeline.play()绑定，且Section层React代码中不要创建空的gsap.timeline再调play()（这是不可能工作的占位代码），只需容器+gsap.context清理即可；4)图片必须使用Unsplash地址(https://images.unsplash.com/photo-XXX?w=1920&q=80)，禁止本地路径；5)ScrollTrigger模式必须与代码一致，不可自相矛盾；组件内部同时存在scrub和toggleActions时必须全部列出；判断模式必须严格基于源码实际代码，不可推断源码中没有的scrollTrigger配置；6)使用gsap.scrollTo必须注册ScrollToPlugin，使用ScrollTrigger必须注册gsap.registerPlugin(ScrollTrigger)；7)Footer版权年份使用new Date().getFullYear()动态生成，不要写死年份；8)CSS变量值不能包含属性名，如--x: backdrop-filter: blur(12px)是错误的，应写为--x: blur(12px)；9)Navbar滚动监听优先使用ScrollTrigger.create而非window.addEventListener(scroll)。'
          },
          { role: 'user', content: prompt }
        ],
        stream: true,
        temperature: 0.6,
        max_tokens: 16384
      })
    })

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('无法读取响应流')
    }

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue

          try {
            const json = JSON.parse(data)
            const content = json.choices?.[0]?.delta?.content
            if (content) {
              generatedPlan.value += content
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }
  } catch (error: any) {
    errorMessage.value = error.message || '生成方案时出错'
  } finally {
    isGenerating.value = false
  }
}

// ============================================================
// 组件数据处理
// ============================================================

const allComponents = ref<ComponentInfo[]>([])

function initComponents() {
  // 避免重复初始化
  if (allComponents.value.length > 0) return

  const result: ComponentInfo[] = []

  // 处理Vue组件
  for (const [path, code] of Object.entries(vueModules)) {
    const match = path.match(/\/card-(\w+)\/([^/]+)\/[^/]+\.vue$/)
    if (!match) continue

    const type = `card-${match[1]}`
    const dirName = match[2]

    // 检查是否有README
    const readmePath = `../web-list/${type}/${dirName}/README.md`
    const readme = readmeModules[readmePath] as string | null

    // 提取摘要
    const summary = extractComponentSummary(code as string, readme || null)

    // 生成显示名称
    const name = dirName
      .replace(/Card/gi, '')
      .replace(/Img/gi, ' 图片')
      .replace(/Image/gi, ' 图片')
      .replace(/Text/gi, ' 文字')
      .replace(/3d/gi, ' 3D')
      .replace(/Time/gi, ' 时间')
      .replace(/([A-Z])/g, ' $1')
      .trim()

    result.push({
      dirName,
      name,
      path,
      type,
      sourceCode: code as string,
      readme,
      summary,
      selected: false,
      modulePosition: ''
    })
  }

  // 按类型分组排序
  const typeOrder = ['card-image', 'card-img', 'card-text', 'card-3d', 'card-time', 'card-list']
  result.sort((a, b) => {
    const aOrder = typeOrder.indexOf(a.type)
    const bOrder = typeOrder.indexOf(b.type)
    if (aOrder !== bOrder) return aOrder - bOrder
    return a.dirName.localeCompare(b.dirName)
  })

  allComponents.value = result
  console.log(8889, allComponents.value);
}

// 按类型分组的组件
const componentsByType = computed(() => {
  const grouped: Record<string, ComponentInfo[]> = {}
  for (const comp of allComponents.value) {
    if (!grouped[comp.type]) {
      grouped[comp.type] = []
    }
    grouped[comp.type].push(comp)
  }
  return grouped
})

// 已选组件
const selectedComponents = computed(() =>
  allComponents.value.filter(c => c.selected)
)

// 选择状态统计
const selectionStats = computed(() => {
  const stats: Record<string, number> = {}
  for (const comp of selectedComponents.value) {
    stats[comp.type] = (stats[comp.type] || 0) + 1
  }
  return stats
})

// 企业信息
const enterpriseInfo = reactive<EnterpriseInfo>({
  name: '',
  industry: '',
  description: '',
  targetAudience: '',
  mainColors: '',
  websiteType: ''
})

// 搜索
const searchKeyword = ref('')

// 搜索过滤后的组件（按类型分组）
const filteredComponentsByType = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) return componentsByType.value

  const grouped: Record<string, ComponentInfo[]> = {}
  for (const [type, comps] of Object.entries(componentsByType.value)) {
    const filtered = comps.filter(c =>
      c.name.toLowerCase().includes(keyword) ||
      c.dirName.toLowerCase().includes(keyword) ||
      typeLabels[type]?.toLowerCase().includes(keyword) ||
      c.modulePosition.toLowerCase().includes(keyword) ||
      (c.readme && c.readme.toLowerCase().includes(keyword))
    )
    if (filtered.length > 0) {
      grouped[type] = filtered
    }
  }
  return grouped
})

// 搜索结果统计
const searchResultCount = computed(() => {
  return Object.values(filteredComponentsByType.value).reduce((sum, comps) => sum + comps.length, 0)
})

// 搜索时自动展开所有匹配的类型
watch(searchKeyword, (val) => {
  if (val.trim()) {
    // 搜索时展开所有有结果的类型
    Object.keys(filteredComponentsByType.value).forEach(type => {
      expandedTypes.add(type)
    })
  }
})

// UI状态
const activeTab = ref('components')
const expandedTypes = reactive<Set<string>>(new Set(['card-image', 'card-img']))

function toggleType(type: string) {
  if (expandedTypes.has(type)) {
    expandedTypes.delete(type)
  } else {
    expandedTypes.add(type)
  }
}

function toggleComponent(comp: ComponentInfo) {
  // 切换选中状态，如果选中则要求选择模块位置
  const index = allComponents.value.findIndex(c => c.dirName === comp.dirName)
  if (index !== -1) {
    if (!comp.selected) {
      // 如果是选中操作，设置为"待选择模块"状态，不直接选中
      // 用户需要在选择器中选择模块位置
      selectedModuleComp.value = comp
    } else {
      // 如果是取消选中，直接取消
      const updated = { ...allComponents.value[index], selected: false, modulePosition: '' }
      allComponents.value = [
        ...allComponents.value.slice(0, index),
        updated,
        ...allComponents.value.slice(index + 1)
      ]
    }
  }
}

function selectModulePosition(comp: ComponentInfo, position: string) {
  const index = allComponents.value.findIndex(c => c.dirName === comp.dirName)
  if (index !== -1) {
    const updated = { ...allComponents.value[index], selected: true, modulePosition: position }
    allComponents.value = [
      ...allComponents.value.slice(0, index),
      updated,
      ...allComponents.value.slice(index + 1)
    ]
    selectedModuleComp.value = null
  }
}

function cancelModuleSelection() {
  selectedModuleComp.value = null
}

// 当前正在选择模块位置的组件
const selectedModuleComp = ref<ComponentInfo | null>(null)

// 模块选择器内嵌编辑状态
const editingModuleInSelector = ref(false)
const editingModuleIndex = ref<number | null>(null)
const editingModule = reactive<ModulePosition>({ key: '', label: '', icon: '', desc: '' })

function startEditModule(index: number) {
  editingModuleIndex.value = index
  Object.assign(editingModule, { ...editingPositions.value[index] })
  editingModuleInSelector.value = true
}

function saveEditModule() {
  if (editingModuleIndex.value !== null) {
    editingPositions.value[editingModuleIndex.value] = { ...editingModule }
  }
  cancelEditModule()
}

function cancelEditModule() {
  editingModuleInSelector.value = false
  editingModuleIndex.value = null
}

function addModuleInSelector() {
  const maxIndex = editingPositions.value.reduce((max, p) => {
    const match = p.key.match(/^custom(\d+)$/)
    return match ? Math.max(max, parseInt(match[1])) : max
  }, 0)
  editingPositions.value.push({
    key: `custom${maxIndex + 1}`,
    label: `自定义模块${maxIndex + 1}`,
    icon: '🔧',
    desc: '自定义描述'
  })
}

function deleteModuleInSelector(index: number) {
  if (confirm('确定要删除此模块吗？')) {
    editingPositions.value.splice(index, 1)
    modulePositions.value = [...editingPositions.value]
    saveModulePositions(modulePositions.value)
  }
}

function getComponentsByPosition(position: string): ComponentInfo[] {
  return allComponents.value.filter(c => c.selected && c.modulePosition === position)
}

function selectAll(type: string) {
  // 全选时提示用户需要选择模块
  alert('请逐个选择组件并指定模块位置')
}

function deselectAll(type: string) {
  const comps = componentsByType.value[type]
  if (comps) {
    comps.forEach(c => {
      c.selected = false
      c.modulePosition = ''
    })
  }
}

function clearSelection() {
  allComponents.value.forEach(c => {
    c.selected = false
    c.modulePosition = ''
  })
}

// 类型显示名称映射
const typeLabels: Record<string, string> = {
  'card-image': '图片转场',
  'card-img': '图片展示',
  'card-text': '文字动画',
  'card-3d': '3D特效',
  'card-time': '时间轴',
  'card-list': '通用列表'
}

const typeColors: Record<string, string> = {
  'card-image': '#667eea',
  'card-img': '#f093fb',
  'card-text': '#4facfe',
  'card-3d': '#43e97b',
  'card-time': '#fa709a',
  'card-list': '#fee140'
}

// 复制生成的方案
async function copyPlan() {
  if (generatedPlan.value) {
    await navigator.clipboard.writeText(generatedPlan.value)
  }
}

// 初始化
onMounted(() => {
  // 加载组件数据
  initComponents()

  // 默认展开前两个类型
  expandedTypes.add('card-image')
  expandedTypes.add('card-img')
})
</script>

<template>
  <div class="web-ai">
    <div class="ai-container">
      <!-- 头部 -->
      <header class="ai-header">
        <div class="header-left">
          <h1 class="ai-title">
            <span class="title-icon">🤖</span>
            AI 网站方案生成器
          </h1>
          <p class="ai-subtitle">选择组件 → 填写信息 → 生成专属企业网站方案</p>
        </div>
        <button class="config-btn" @click="openModuleEditor" title="配置模块位置">
          ⚙️ 模块配置
        </button>
      </header>

      <!-- Tab导航 -->
      <nav class="ai-tabs">
        <button
          :class="['tab-btn', { active: activeTab === 'components' }]"
          @click="activeTab = 'components'"
        >
          📦 组件选配
          <span v-if="selectedComponents.length" class="tab-badge">
            {{ selectedComponents.length }}
          </span>
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'enterprise' }]"
          @click="activeTab = 'enterprise'"
        >
          🏢 企业信息
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'result' }]"
          @click="activeTab = 'result'"
        >
          📄 生成结果
        </button>
      </nav>

      <!-- Tab内容 -->
      <div class="ai-content">
        <!-- 组件选配 -->
        <div v-if="activeTab === 'components'" class="tab-panel">
          <div class="panel-header">
            <h3>选择组件 <span class="component-count">{{ allComponents.length }}个可用</span></h3>
            <div class="panel-actions">
              <button class="btn btn-sm btn-ghost" @click="clearSelection">清空选择</button>
            </div>
          </div>

          <!-- 当前模块配置提示 -->
          <div class="module-config-tip">
            当前模块: {{ modulePositions.length }}个
            <button class="link-btn" @click="openModuleEditor">编辑配置</button>
          </div>

          <!-- 搜索栏 -->
          <div class="search-bar">
            <span class="search-icon">🔍</span>
            <input
              v-model="searchKeyword"
              type="text"
              class="search-input"
              placeholder="搜索组件名称、类型、关键词..."
              clearable
            />
            <span v-if="searchKeyword" class="search-clear" @click="searchKeyword = ''">×</span>
            <span v-if="searchKeyword" class="search-result-count">
              {{ searchResultCount }} / {{ allComponents.length }} 个组件
            </span>
          </div>

          <div class="component-list">
            <div
              v-for="(comps, type) in filteredComponentsByType"
              :key="type"
              class="type-group"
            >
              <!-- 类型标题 -->
              <div
                class="type-header"
                :class="{ 'has-selected': selectionStats[type] }"
                :style="{ '--type-color': typeColors[type] }"
                @click="toggleType(type)"
              >
                <span class="type-expand">{{ expandedTypes.has(type) ? '▼' : '▶' }}</span>
                <span class="type-name">{{ typeLabels[type] || type }}</span>
                <span class="type-count">{{ comps.length }}个</span>
                <span v-if="selectionStats[type]" class="type-selected">
                  ✓ 已选{{ selectionStats[type] }}个
                </span>
                <div class="type-actions" @click.stop>
                  <button class="btn btn-xs" @click="selectAll(type)">全选</button>
                  <button class="btn btn-xs btn-ghost" @click="deselectAll(type)">取消</button>
                </div>
              </div>

              <!-- 组件卡片 -->
              <div v-if="expandedTypes.has(type)" class="type-components">
                <div
                  v-for="comp in comps"
                  :key="comp.dirName"
                  :class="['component-card', { selected: comp.selected, 'is-selecting': selectedModuleComp?.dirName === comp.dirName }]"
                  @click="toggleComponent(comp)"
                >
                  <div class="card-checkbox">
                    <span v-if="comp.selected" class="check-icon">✓</span>
                  </div>
                  <div class="card-info">
                    <span class="card-name">{{ comp.name }}</span>
                    <span class="card-key">{{ comp.dirName }}</span>
                    <!-- 显示已选模块位置 -->
                    <span v-if="comp.selected && comp.modulePosition" class="module-position-tag">
                      {{ modulePositions.find(m => m.key === comp.modulePosition)?.icon }}
                      {{ modulePositions.find(m => m.key === comp.modulePosition)?.label }}
                    </span>
                  </div>
                  <div class="card-badges">
                    <div v-if="comp.readme" class="card-badge" title="有README说明">📖</div>
                    <div v-if="comp.summary.script.canvasAnimation" class="card-badge" title="Canvas动画">🎨</div>
                    <div v-if="comp.summary.script.scrollTriggers.length" class="card-badge" title="ScrollTrigger">
                      {{ comp.summary.script.scrollTriggers.length }}ST
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 模块位置选择器 -->
          <div v-if="selectedModuleComp" class="module-selector-overlay" @click.self="cancelModuleSelection">
            <div class="module-selector">
              <div class="module-selector-header">
                <h4>选择模块位置</h4>
                <p>您选择了: <strong>{{ selectedModuleComp.name }}</strong></p>
                <button class="close-btn" @click="cancelModuleSelection">×</button>
              </div>

              <!-- 编辑模式 -->
              <div v-if="editingModuleInSelector" class="module-edit-form">
                <h5>{{ editingModuleIndex !== null ? '编辑模块' : '新增模块' }}</h5>
                <div class="edit-row">
                  <input v-model="editingModule.icon" class="edit-icon" placeholder="图标" />
                  <input v-model="editingModule.key" class="edit-key" placeholder="key" />
                </div>
                <div class="edit-row">
                  <input v-model="editingModule.label" class="edit-label" placeholder="名称" />
                  <input v-model="editingModule.desc" class="edit-desc" placeholder="描述" />
                </div>
                <div class="edit-actions">
                  <button class="btn btn-sm btn-primary" @click="saveEditModule">保存</button>
                  <button class="btn btn-sm btn-ghost" @click="cancelEditModule">取消</button>
                </div>
              </div>

              <div class="module-position-grid">
                <div
                  v-for="(pos, index) in editingPositions"
                  :key="pos.key + index"
                  class="module-pos-btn-wrapper"
                >
                  <button
                    class="module-pos-btn"
                    @click="selectModulePosition(selectedModuleComp!, pos.key)"
                  >
                    <span class="pos-icon">{{ pos.icon }}</span>
                    <span class="pos-label">{{ pos.label }}</span>
                    <span class="pos-desc">{{ pos.desc }}</span>
                    <span v-if="getComponentsByPosition(pos.key).length > 0" class="pos-used-by">
                      已选: {{ getComponentsByPosition(pos.key).map(c => c.name).join(', ') }}
                    </span>
                  </button>
                  <div class="pos-actions">
                    <button class="pos-action-btn edit" @click.stop="startEditModule(index)" title="编辑">✏️</button>
                    <button class="pos-action-btn delete" @click.stop="deleteModuleInSelector(index)" title="删除">🗑️</button>
                  </div>
                </div>
                <button class="module-pos-btn add-new" @click="addModuleInSelector">
                  <span class="pos-icon">➕</span>
                  <span class="pos-label">添加新模块</span>
                  <span class="pos-desc">新增一个自定义模块</span>
                </button>
              </div>

              <div class="module-selector-footer">
                <button class="btn btn-sm btn-ghost" @click="openModuleEditor">⚙️ 完整配置</button>
                <button class="btn btn-sm" @click="saveModuleConfig(); cancelModuleSelection()">💾 保存全部修改</button>
              </div>
            </div>
          </div>

          <!-- 已选模块预览 -->
          <div v-if="selectedComponents.length > 0" class="module-preview">
            <h4>📋 模块规划预览</h4>
            <div class="preview-list">
              <div
                v-for="pos in modulePositions.filter(p => getComponentsByPosition(p.key).length > 0)"
                :key="pos.key"
                class="preview-module-group"
              >
                <div class="preview-module-header">
                  <span class="preview-module-icon">{{ pos.icon }}</span>
                  <span class="preview-module-name">{{ pos.label }}</span>
                </div>
                <div class="preview-module-components">
                  <div
                    v-for="comp in getComponentsByPosition(pos.key)"
                    :key="comp.dirName"
                    class="preview-item"
                  >
                    <span class="preview-name">{{ comp.name }}</span>
                    <button class="preview-remove" @click="toggleComponent(comp)">×</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 模块配置编辑器 -->
          <div v-if="showModuleEditor" class="module-editor-overlay" @click.self="closeModuleEditor">
            <div class="module-editor">
              <div class="module-editor-header">
                <h3>⚙️ 模块配置</h3>
                <p class="editor-tip">配置模块位置，可增删改。修改后自动保存到浏览器。</p>
                <button class="close-btn" @click="closeModuleEditor">×</button>
              </div>
              <div class="module-editor-body">
                <div
                  v-for="(pos, index) in editingPositions"
                  :key="pos.key + index"
                  class="module-editor-item"
                >
                  <input v-model="pos.icon" class="edit-icon" placeholder="图标" />
                  <input v-model="pos.key" class="edit-key" placeholder="key" />
                  <input v-model="pos.label" class="edit-label" placeholder="名称" />
                  <input v-model="pos.desc" class="edit-desc" placeholder="描述" />
                  <button class="remove-btn" @click="removeModulePosition(index)">🗑️</button>
                </div>
              </div>
              <div class="module-editor-footer">
                <button class="btn btn-sm" @click="addModulePosition">+ 添加模块</button>
                <button class="btn btn-sm btn-ghost" @click="resetModuleConfig">恢复默认</button>
                <div class="footer-spacer"></div>
                <button class="btn btn-primary" @click="saveModuleConfig">保存配置</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 企业信息 -->
        <div v-if="activeTab === 'enterprise'" class="tab-panel">
          <div class="panel-header">
            <h3>填写企业信息</h3>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>企业名称 *</label>
              <input
                v-model="enterpriseInfo.name"
                type="text"
                placeholder="例如：深圳市科技创新有限公司"
              />
            </div>

            <div class="form-group">
              <label>所属行业</label>
              <select v-model="enterpriseInfo.industry">
                <option value="">请选择</option>
                <option value="科技/互联网">科技/互联网</option>
                <option value="金融/投资">金融/投资</option>
                <option value="教育/培训">教育/培训</option>
                <option value="医疗/健康">医疗/健康</option>
                <option value="零售/电商">零售/电商</option>
                <option value="制造业">制造业</option>
                <option value="房地产/建筑">房地产/建筑</option>
                <option value="文化/娱乐">文化/娱乐</option>
                <option value="其他">其他</option>
              </select>
            </div>

            <div class="form-group form-group-full">
              <label>企业简介</label>
              <textarea
                v-model="enterpriseInfo.description"
                rows="3"
                placeholder="简单描述企业的核心业务、产品或服务..."
              ></textarea>
            </div>

            <div class="form-group">
              <label>目标受众</label>
              <input
                v-model="enterpriseInfo.targetAudience"
                type="text"
                placeholder="例如：25-40岁白领群体、B2B企业客户"
              />
            </div>

            <div class="form-group">
              <label>品牌主色</label>
              <input
                v-model="enterpriseInfo.mainColors"
                type="text"
                placeholder="例如：科技蓝 #0066FF、活力橙 #FF6600"
              />
            </div>

            <div class="form-group form-group-full">
              <label>网站类型</label>
              <select v-model="enterpriseInfo.websiteType">
                <option value="">请选择</option>
                <option value="企业官网">企业官网</option>
                <option value="品牌展示站">品牌展示站</option>
                <option value="产品介绍站">产品介绍站</option>
                <option value="营销落地页">营销落地页</option>
                <option value="个人作品集">个人作品集</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 生成结果 -->
        <div v-if="activeTab === 'result'" class="tab-panel">
          <div class="panel-header">
            <h3>生成结果</h3>
            <div class="panel-actions">
              <button
                v-if="generatedPlan"
                class="btn btn-sm"
                @click="copyPlan"
              >
                📋 复制内容
              </button>
            </div>
          </div>

          <!-- 生成按钮区域 -->
          <div v-if="!generatedPlan && !isGenerating" class="generate-section">
            <div class="generate-summary">
              <div class="summary-item">
                <span class="summary-label">已选组件</span>
                <span class="summary-value">{{ selectedComponents.length }}个</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">企业名称</span>
                <span class="summary-value">{{ enterpriseInfo.name || '未填写' }}</span>
              </div>
            </div>

            <button
              class="btn btn-primary btn-lg"
              :disabled="!enterpriseInfo.name || selectedComponents.length === 0"
              @click="generatePlan"
            >
              🚀 开始生成方案
            </button>

            <p v-if="!enterpriseInfo.name" class="generate-hint">
              请先在「企业信息」标签页填写企业名称
            </p>
            <p v-else-if="selectedComponents.length === 0" class="generate-hint">
              请先在「组件选配」标签页选择组件
            </p>
          </div>

          <!-- 加载状态 -->
          <div v-if="isGenerating" class="loading-section">
            <div class="loading-spinner"></div>
            <p>正在生成方案，请稍候...</p>
          </div>

          <!-- 错误提示 -->
          <div v-if="errorMessage" class="error-section">
            <p>{{ errorMessage }}</p>
          </div>

          <!-- 方案内容 -->
          <div v-if="generatedPlan && !isGenerating" class="plan-content">
            <button class="btn btn-primary regenerate-btn" @click="generatePlan">
              🔄 重新生成
            </button>
            <div class="markdown-body" v-html="renderMarkdown(generatedPlan)"></div>
          </div>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <footer class="ai-footer">
        <div class="footer-stats">
          <span>已选 {{ selectedComponents.length }} 个组件</span>
          <span v-if="Object.keys(selectionStats).length">
            ({{ Object.entries(selectionStats).map(([k, v]) => `${typeLabels[k] || k}: ${v}`).join(', ') }})
          </span>
        </div>
        <button
          class="btn btn-primary"
          :disabled="!enterpriseInfo.name || selectedComponents.length === 0"
          @click="activeTab = 'result'"
        >
          生成方案 →
        </button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
// Markdown渲染 - 使用 marked 库进行高质量渲染
import { marked, Renderer } from 'marked'
import hljs from 'highlight.js'

// 配置 marked - v18 使用 renderer 方式
const renderer = new Renderer()
renderer.code = function({ text, lang }: { text: string; lang?: string }) {
  const language = lang && hljs.getLanguage(lang) ? lang : ''
  const highlighted = language
    ? hljs.highlight(text, { language }).value
    : hljs.highlightAuto(text).value
  return `<pre><code class="hljs${language ? ` language-${language}` : ''}">${highlighted}</code></pre>`
}

marked.setOptions({
  gfm: true,
  breaks: true,
  renderer
})

function renderMarkdown(text: string): string {
  try {
    return marked.parse(text) as string
  } catch {
    // 降级：简单渲染
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>')
  }
}
</script>

<style lang="scss" scoped>
.web-ai {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 20px;
}

.ai-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 40px);
}

// 头部
.ai-header {
  text-align: center;
  padding: 30px 0;
}

.ai-title {
  font-size: 2rem;
  color: #fff;
  margin: 0 0 10px;

  .title-icon {
    margin-right: 10px;
  }
}

.ai-subtitle {
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

// Tabs
.ai-tabs {
  display: flex;
  gap: 10px;
  padding: 0 20px;
  margin-bottom: 20px;
}

.tab-btn {
  flex: 1;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  &.active {
    background: rgba(102, 126, 234, 0.3);
    border-color: #667eea;
    color: #fff;
  }

  .tab-badge {
    display: inline-block;
    margin-left: 8px;
    padding: 2px 8px;
    background: #667eea;
    border-radius: 10px;
    font-size: 0.8rem;
  }
}

// 配置按钮
.config-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }
}

.header-left {
  flex: 1;
}

// 内容区
.ai-content {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  overflow: auto;
}

.tab-panel {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h3 {
    margin: 0;
    color: #fff;
    font-size: 1.2rem;
  }

  .component-count {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.9rem;
    font-weight: normal;
    margin-left: 10px;
  }
}

.panel-actions {
  display: flex;
  gap: 10px;
}

// 组件列表
.component-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.type-group {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  overflow: hidden;
}

.type-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: background 0.3s;
  --type-color: #667eea;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &.has-selected {
    background: rgba(102, 126, 234, 0.15);
    border-left: 3px solid var(--type-color);
  }

  .type-expand {
    width: 20px;
    color: var(--type-color);
    font-size: 0.8rem;
  }

  .type-name {
    color: #fff;
    font-weight: 600;
  }

  .type-count {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.85rem;
  }

  .type-selected {
    color: var(--type-color);
    font-size: 0.85rem;
    font-weight: 600;
    background: rgba(102, 126, 234, 0.2);
    padding: 3px 10px;
    border-radius: 12px;
  }

  .type-actions {
    margin-left: auto;
    display: flex;
    gap: 8px;
  }
}

.type-components {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  padding: 15px;
}

.component-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(3px);
  }

  &.selected {
    background: rgba(102, 126, 234, 0.25);
    border-color: #667eea;
    box-shadow: 0 0 15px rgba(102, 126, 234, 0.3);
  }

  .card-checkbox {
    width: 22px;
    height: 22px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    color: transparent;
    transition: all 0.3s;
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.05);

    .selected & {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: #667eea;
      box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
    }

    .check-icon {
      color: #fff;
      font-weight: bold;
      animation: checkPop 0.3s ease;
    }
  }

  @keyframes checkPop {
    0% { transform: scale(0); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }

  .card-info {
    flex: 1;
    min-width: 0;
  }

  .card-name {
    display: block;
    color: #fff;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-key {
    display: block;
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.75rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-badge {
    padding: 2px 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.7);
    flex-shrink: 0;
  }

  .card-badges {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
  }

  .module-position-tag {
    display: inline-block;
    margin-top: 4px;
    padding: 2px 8px;
    background: rgba(102, 126, 234, 0.3);
    border-radius: 4px;
    font-size: 0.7rem;
    color: #667eea;
  }

  .is-selecting {
    box-shadow: 0 0 0 2px #667eea;
    animation: pulse 1s infinite;
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.5); }
    50% { box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.3); }
  }
}

// 搜索栏
.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  margin-bottom: 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  transition: all 0.3s;

  &:focus-within {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.08);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  }

  .search-icon {
    font-size: 1rem;
    flex-shrink: 0;
  }

  .search-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #fff;
    font-size: 0.95rem;
    padding: 4px 0;

    &::placeholder {
      color: rgba(255, 255, 255, 0.35);
    }
  }

  .search-clear {
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s;
    flex-shrink: 0;

    &:hover {
      background: rgba(255, 255, 255, 0.25);
      color: #fff;
    }
  }

  .search-result-count {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.5);
    white-space: nowrap;
    flex-shrink: 0;
    padding: 2px 10px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 10px;
  }
}

// 模块配置提示
.module-config-tip {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
  background: rgba(102, 126, 234, 0.1);
  border: 1px dashed rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.link-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;

  &:hover {
    color: #8b9df7;
  }
}

// 模块选择器
.module-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.module-selector {
  background: #1a1a2e;
  border-radius: 16px;
  padding: 24px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.module-selector-header {
  margin-bottom: 20px;
  position: relative;

  h4 {
    color: #fff;
    font-size: 1.2rem;
    margin-bottom: 8px;
  }

  p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;

    strong {
      color: #667eea;
    }
  }

  .close-btn {
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: #fff;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.module-position-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.module-pos-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;

  &:hover {
    background: rgba(102, 126, 234, 0.2);
    border-color: #667eea;
    transform: translateY(-2px);
  }

  &.used {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      transform: none;
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
    }
  }

  .pos-icon {
    font-size: 1.5rem;
  }

  .pos-label {
    color: #fff;
    font-weight: 600;
    font-size: 0.95rem;
  }

  .pos-desc {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.75rem;
  }

  .pos-used-by {
    margin-top: 4px;
    padding: 2px 8px;
    background: rgba(255, 100, 100, 0.2);
    border-radius: 4px;
    font-size: 0.7rem;
    color: #ff6464;
  }

  &.add-new {
    border: 2px dashed rgba(102, 126, 234, 0.4);
    background: rgba(102, 126, 234, 0.05);

    &:hover {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.2);
    }

    .pos-icon {
      font-size: 1.5rem;
    }
  }
}

// 模块选择器内嵌编辑
.module-edit-form {
  background: rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;

  h5 {
    color: #fff;
    margin: 0 0 12px;
    font-size: 1rem;
  }

  .edit-row {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }

  input {
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    color: #fff;
    font-size: 0.9rem;

    &:focus {
      outline: none;
      border-color: #667eea;
    }
  }

  .edit-icon {
    width: 50px;
    text-align: center;
    font-size: 1.2rem;
  }

  .edit-key {
    flex: 1;
  }

  .edit-label {
    flex: 1;
  }

  .edit-desc {
    flex: 2;
  }

  .edit-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
}

.module-pos-btn-wrapper {
  position: relative;

  .pos-actions {
    display: flex;
    gap: 4px;
    position: absolute;
    top: 8px;
    right: 8px;
  }

  .module-pos-btn {
    width: 100%;
    min-height: 100px;
    padding: 16px;
  }
}

.pos-action-btn {
  background: rgba(0, 0, 0, 0.6);
  border: none;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
  opacity: 0.8;

  &:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.8);
  }

  &.delete:hover {
    background: rgba(255, 100, 100, 0.6);
  }
}

.module-selector-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
  gap: 12px;
}

// 模块编辑器弹窗
.module-editor-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  backdrop-filter: blur(4px);
}

.module-editor {
  background: #1a1a2e;
  border-radius: 16px;
  padding: 24px;
  max-width: 700px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.module-editor-header {
  margin-bottom: 20px;
  position: relative;

  h3 {
    color: #fff;
    font-size: 1.3rem;
    margin-bottom: 8px;
  }

  .editor-tip {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.85rem;
  }

  .close-btn {
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: #fff;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.module-editor-body {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
}

.module-editor-item {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  margin-bottom: 8px;

  input {
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    color: #fff;
    font-size: 0.9rem;

    &:focus {
      outline: none;
      border-color: #667eea;
    }
  }

  .edit-icon {
    width: 50px;
    text-align: center;
    font-size: 1.2rem;
  }

  .edit-key {
    width: 100px;
  }

  .edit-label {
    width: 120px;
  }

  .edit-desc {
    flex: 1;
  }

  .remove-btn {
    background: rgba(255, 100, 100, 0.2);
    border: none;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s;

    &:hover {
      background: rgba(255, 100, 100, 0.4);
    }
  }
}

.module-editor-footer {
  display: flex;
  gap: 12px;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  .footer-spacer {
    flex: 1;
  }
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: #fff;
  padding: 10px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
  }
}

// 模块预览
.module-preview {
  margin-top: 24px;
  padding: 20px;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 12px;

  h4 {
    color: #fff;
    font-size: 1rem;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.preview-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview-module-group {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  overflow: hidden;
}

.preview-module-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(102, 126, 234, 0.15);
  border-bottom: 1px solid rgba(102, 126, 234, 0.2);

  .preview-module-icon {
    font-size: 1rem;
  }

  .preview-module-name {
    color: #667eea;
    font-weight: 600;
    font-size: 0.9rem;
  }
}

.preview-module-components {
  padding: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  font-size: 0.85rem;

  .preview-name {
    color: #fff;
  }

  .preview-remove {
    background: rgba(255, 100, 100, 0.2);
    border: none;
    color: #ff6464;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    transition: all 0.3s;

    &:hover {
      background: rgba(255, 100, 100, 0.4);
    }
  }
}

// 表单
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  &-full {
    grid-column: span 2;
  }

  label {
    display: block;
    margin-bottom: 8px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
  }

  input, select, textarea {
    width: 100%;
    padding: 12px 40px 12px 15px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #fff;
    font-size: 1rem;
    transition: all 0.3s;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' fill-opacity='0.5' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 15px center;
    cursor: pointer;

    &::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }

    &:focus {
      outline: none;
      border-color: #667eea;
      background-color: rgba(255, 255, 255, 0.08);
    }

    option {
      background: #1a1a2e;
      color: #fff;
      padding: 10px;
    }
  }

  textarea {
    resize: vertical;
    min-height: 80px;
    background-image: none;
    padding-right: 15px;
  }
}

// 生成区域
.generate-section {
  text-align: center;
  padding: 40px 20px;
}

.generate-summary {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 30px;

  .summary-item {
    text-align: center;

    .summary-label {
      display: block;
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.9rem;
      margin-bottom: 5px;
    }

    .summary-value {
      color: #fff;
      font-size: 1.5rem;
      font-weight: 600;
    }
  }
}

.generate-hint {
  color: rgba(255, 255, 255, 0.5);
  margin-top: 15px;
}

// 加载
.loading-section {
  text-align: center;
  padding: 60px 20px;

  p {
    color: rgba(255, 255, 255, 0.7);
    margin-top: 20px;
  }
}

.loading-spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

// 错误
.error-section {
  padding: 20px;
  background: rgba(255, 100, 100, 0.2);
  border: 1px solid rgba(255, 100, 100, 0.3);
  border-radius: 10px;
  margin: 20px 0;
  text-align: center;

  p {
    color: #ff6b6b;
    margin: 0;
  }
}

// 方案内容
.plan-content {
  .regenerate-btn {
    margin-bottom: 20px;
  }
}

.markdown-body {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.8;
  font-size: 0.95rem;

  :deep(h1) {
    font-size: 1.8rem;
    color: #fff;
    margin: 30px 0 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid rgba(102, 126, 234, 0.3);
  }

  :deep(h2) {
    font-size: 1.4rem;
    color: #fff;
    margin: 25px 0 15px;
    padding-left: 12px;
    border-left: 3px solid #667eea;
  }

  :deep(h3) {
    font-size: 1.1rem;
    color: #667eea;
    margin: 20px 0 10px;
  }

  :deep(strong) {
    color: #4facfe;
  }

  :deep(li) {
    margin: 6px 0;
    padding-left: 6px;
  }

  :deep(p) {
    margin: 10px 0;
  }

  // 代码块高亮
  :deep(pre) {
    background: rgba(0, 0, 0, 0.4) !important;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 16px 20px;
    margin: 16px 0;
    overflow-x: auto;
    font-size: 0.85rem;
    line-height: 1.6;

    code {
      background: transparent !important;
      color: #e6e6e6;
      font-family: 'Fira Code', 'Consolas', monospace;
    }
  }

  // 行内代码
  :deep(code) {
    background: rgba(102, 126, 234, 0.15);
    color: #a8b8ff;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.88em;
    font-family: 'Fira Code', 'Consolas', monospace;
  }

  // 表格
  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    font-size: 0.9rem;

    th {
      background: rgba(102, 126, 234, 0.2);
      color: #fff;
      padding: 10px 14px;
      text-align: left;
      border: 1px solid rgba(255, 255, 255, 0.1);
      font-weight: 600;
    }

    td {
      padding: 8px 14px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.85);
    }

    tr:nth-child(even) td {
      background: rgba(255, 255, 255, 0.03);
    }

    tr:hover td {
      background: rgba(102, 126, 234, 0.08);
    }
  }

  // 引用块
  :deep(blockquote) {
    border-left: 3px solid #667eea;
    margin: 16px 0;
    padding: 10px 16px;
    background: rgba(102, 126, 234, 0.08);
    color: rgba(255, 255, 255, 0.8);
    border-radius: 0 6px 6px 0;
  }

  // 水平线
  :deep(hr) {
    border: none;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.4), transparent);
    margin: 24px 0;
  }

  // 有序/无序列表
  :deep(ul), :deep(ol) {
    padding-left: 24px;
    margin: 8px 0;
  }

  :deep(ul) {
    list-style-type: disc;
  }

  :deep(ol) {
    list-style-type: decimal;
  }

  // 代码高亮 - highlight.js 主题覆盖
  :deep(.hljs-keyword) { color: #c792ea; }
  :deep(.hljs-string) { color: #c3e88d; }
  :deep(.hljs-number) { color: #f78c6c; }
  :deep(.hljs-function) { color: #82aaff; }
  :deep(.hljs-comment) { color: #546e7a; font-style: italic; }
  :deep(.hljs-type) { color: #ffcb6b; }
  :deep(.hljs-built_in) { color: #89ddff; }
  :deep(.hljs-attr) { color: #f07178; }
  :deep(.hljs-variable) { color: #eeffff; }
  :deep(.hljs-title) { color: #82aaff; }
  :deep(.hljs-params) { color: #f78c6c; }
}

// 按钮
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;

  &-sm {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  &-xs {
    padding: 4px 8px;
    font-size: 0.75rem;
  }

  &-ghost {
    background: transparent;
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.2);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
  }

  &-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &-lg {
    padding: 15px 40px;
    font-size: 1.1rem;
  }
}

// 底部
.ai-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  margin-top: 20px;

  .footer-stats {
    color: rgba(255, 255, 255, 0.7);

    span {
      margin-right: 5px;
    }
  }
}

// 响应式
@media (max-width: 768px) {
  .ai-tabs {
    flex-direction: column;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group-full {
    grid-column: span 1;
  }

  .type-components {
    grid-template-columns: 1fr;
  }

  .generate-summary {
    flex-direction: column;
    gap: 20px;
  }

  .ai-footer {
    flex-direction: column;
    gap: 15px;

    .footer-stats {
      text-align: center;
    }
  }
}
</style>
