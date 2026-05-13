<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'

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
  // Props提取
  const propsMatch = script.match(/interface Props\s*\{[^}]+\}/s) ||
    script.match(/withDefaults\(defineProps<[^>]+>\(\)[^)]*\)/s) ||
    script.match(/defineProps\(\{[\s\S]*?\}\)/)
  const propsStr = propsMatch?.[0] || ''
  const props = propsStr.match(/(\w+)\??:\s*(string|number|boolean|object|\[\])/g) || []
    .map(p => p.replace(/[?:]/g, '').trim())

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
  if (s.props.length > 0) parts.push(`Props参数:${s.props.join(', ')}`)
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

  // README补充（如果存在）
  if (readme) {
    // 提取README中的效果描述
    const effectMatch = readme.match(/### 核心动画\n([\s\S]*?)(?=##|$)/)
    const techMatch = readme.match(/\|\s*技术\s*\|[^|]+\|([^|]+)\|/g)
    if (effectMatch) {
      const effects = effectMatch[1].match(/-\s*\*\*([^*]+)\*\*:\s*([^\n-]+)/g) || []
      if (effects.length > 0) {
        parts.push('【效果描述】')
        effects.slice(0, 3).forEach(e => {
          const match = e.match(/-\s*\*\*([^*]+)\*\*:\s*([^\n-]+)/)
          if (match) parts.push(`  • ${match[1]}: ${match[2].trim().slice(0, 50)}`)
        })
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

  // 构建模块-组件对应表
  const moduleComponentMap = moduleOrder
    .filter(pos => componentsByModule[pos]?.length > 0)
    .map((pos, index) => {
      const comps = componentsByModule[pos]
      const compsList = comps.map((comp, i) => {
        const summaryText = formatSummaryForPrompt(comp.summary, comp.readme)
        return `#### ${comp.dirName} (${comp.type})
${summaryText}`
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
你是一位专业的企业网站开发方案设计师。你需要基于用户选配的组件，输出一份完整、专业、可落地的网站开发方案文档。

# 企业信息
- **企业名称**: ${enterpriseInfo.name}
- **所属行业**: ${enterpriseInfo.industry}
- **企业简介**: ${enterpriseInfo.description}
- **目标受众**: ${enterpriseInfo.targetAudience}
- **品牌主色**: ${enterpriseInfo.mainColors}
- **网站类型**: ${enterpriseInfo.websiteType}

# 模块组件规划（用户已指定）
${moduleComponentMap || '暂无'}

# 组件类型汇总
${typeSummary}

# 输出格式要求
请严格按照以下结构输出方案文档，每一节都要有实质性内容：

---
# ${enterpriseInfo.name} 网站开发方案文档

## 一、项目概述
- **项目名称**:
- **项目类型**:
- **技术栈**: 列出推荐的技术栈（框架、CSS方案、动画库等）
- **设计理念**: 整体视觉风格和动效设计理念

## 二、项目架构
### 2.1 技术选型
使用表格列出：
| 技术 | 版本 | 用途 |
|------|------|------|
| React/Vue | 18.x/3.x | 核心框架 |
| ... | ... | ... |

### 2.2 项目结构
使用树形结构展示项目文件组织，例如：
\`\`\`
src/
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   └── ...
├── App.tsx
└── index.tsx
\`\`\`

## 三、模块组件规划（重点）
**这是方案的核心部分！请按顺序为每个页面模块指定具体使用的组件。**

### 3.1 首屏模块 (Screen 1 - Hero)
**使用的组件**: [从用户选配的组件中挑选最合适的1个]
**为什么选这个**: 说明理由

### 3.2 第二模块 (Screen 2)
**使用的组件**: [挑选具体组件]
**为什么选这个**: 说明理由

### 3.3 第三模块 (Screen 3)
**使用的组件**: [挑选具体组件]
**为什么选这个**: 说明理由

[继续规划后续模块，根据用户选配的组件数量来决定模块数量]

## 四、模块详细设计
针对每个模块，详细说明：
- **功能描述**: 模块要实现什么
- **使用组件**: 该模块使用哪个具体组件
- **内容规划**: 该模块展示什么内容（标题、副标题、图片位置等）
- **技术实现**: 核心代码示例（TypeScript）
- **动画策略**: GSAP实现示例（如果涉及动画）

### 4.1 首屏Hero模块
### 4.2 [模块名称]
...

## 五、动画系统
### 5.1 GSAP ScrollTrigger 配置
给出全局配置代码

### 5.2 动画类型清单
使用表格：
| 动画类型 | 应用场景 | 实现方式 |
|---------|---------|---------|

### 5.3 性能优化
- GPU加速
- 减少动画偏好适配
- 其他优化建议

## 六、组件详细设计
针对用户选择的每个组件，给出：
- **功能**: 组件做什么
- **Props/接口**: 参数定义
- **核心逻辑**: 关键代码

## 七、样式系统
### 7.1 设计令牌
\`\`\`javascript
colors: {
  primary: '#xxx',
  secondary: '#xxx',
  ...
}
\`\`\`

### 7.2 字体规范
### 7.3 间距系统

## 八、路由与导航
### 8.1 导航结构
### 8.2 平滑滚动实现
### 8.3 导航栏行为

## 九、图片资源管理
- 图片来源建议
- 图片规格要求
- 优化策略

## 十、开发流程
### 10.1 环境搭建
### 10.2 开发顺序（建议按此顺序开发）
### 10.3 代码规范

## 十一、性能指标
| 指标 | 目标值 |
|------|--------|
| FCP | < 1.5s |
| LCP | < 2.5s |
| TTI | < 3.5s |

## 十二、浏览器兼容性
列出支持的浏览器版本

## 十三、项目文件清单
使用表格：
| 文件 | 行数 | 功能 |
|------|------|------|
| App.tsx | ~50 | ... |

## 十四、总结
对方案进行整体概述

---

请确保：
1. **模块规划要具体**：每个Screen使用哪个具体组件，组件名称要与用户选配的一致
2. 每个章节都要有实质性内容，不能空洞
3. 代码示例要可运行、有参考价值
4. 技术选型要合理、版本号要准确
5. 整体格式要专业、层级要清晰`
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
  debugger
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
        messages: [{ role: 'user', content: prompt }],
        stream: true,
        temperature: 0.7,
        max_tokens: 4096
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

          <div class="component-list">
            <div
              v-for="(comps, type) in componentsByType"
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
// Markdown渲染辅助函数
function renderMarkdown(text: string): string {
  return text
    // 标题
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // 粗体
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // 列表
    .replace(/^\- (.*$)/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>')
    // 换行
    .replace(/\n\n/g, '</p><p>')
    // 包裹
    .replace(/^(?!<[hl])/gm, '<p>')
    .replace(/<p><\/p>/g, '')
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

  :deep(h1) {
    font-size: 1.8rem;
    color: #fff;
    margin: 30px 0 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  :deep(h2) {
    font-size: 1.4rem;
    color: #fff;
    margin: 25px 0 15px;
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
    margin: 8px 0;
    padding-left: 10px;
  }

  :deep(p) {
    margin: 10px 0;
  }
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
