<script setup lang="ts">
import {
  computed,
  ref,
  onMounted,
  onUnmounted,
  shallowRef,
  defineAsyncComponent,
  watch,
  nextTick,
  reactive,
} from 'vue'
import { useRouter } from 'vue-router'

// ==================== 源码和README导入（供 AI 方案使用）====================
const vueModules = import.meta.glob('../web-list/card-{image,img,text,3d,time,list}/*/[^R]*.vue', {
  eager: true,
  query: '?raw',
  import: 'default',
})

// 动态导入所有README
const readmeModules = import.meta.glob(
  '../web-list/card-{image,img,text,3d,time,list}/*/README.md',
  { eager: true, query: '?raw', import: 'default' }
)

// 获取 router 实例
const router = useRouter()

// ==================== 预加载数量控制 ====================
const PRELOAD_COUNT = 2 // 视口上方预加载数量
const VISIBLE_BUFFER = 2 // 视口下方预加载数量

// ==================== 懒加载模式 ====================
const LAZY_MODE = true // 设为 false 可关闭懒加载

// ==================== 分类筛选 ====================
// 当前选中的分类（默认全部）
const activeCategory = ref('all')

// ==================== 收藏功能 ====================
// 从 localStorage 加载收藏的组件名列表
const loadFavorites = (): string[] => {
  try {
    const saved = localStorage.getItem('cardFavorites')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// 收藏的组件名列表
const favorites = ref<string[]>(loadFavorites())

// 保存收藏到 localStorage
const saveFavorites = () => {
  localStorage.setItem('cardFavorites', JSON.stringify(favorites.value))
}

// 切换收藏状态
const toggleFavorite = (dirName: string) => {
  const index = favorites.value.indexOf(dirName)
  if (index === -1) {
    favorites.value.push(dirName)
  } else {
    favorites.value.splice(index, 1)
  }
  saveFavorites()
}

// 检查组件是否已收藏
const isFavorite = (dirName: string) => favorites.value.includes(dirName)

// ==================== 组件选择功能（从 web-ai 迁移） ====================
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

// 已选择组件的模块位置
interface ComponentSelectInfo {
  dirName: string
  name: string
  path: string
  type: string
  selected: boolean
  modulePosition: string
  sourceCode?: string  // 组件源码
  readme?: string | null  // README内容
}

const selectedComponents = ref<ComponentSelectInfo[]>([])

// 从 localStorage 加载已选组件
const loadSelectedComponents = (): ComponentSelectInfo[] => {
  try {
    const saved = localStorage.getItem('cardSelectedComponents')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// 保存已选组件到 localStorage
const saveSelectedComponents = () => {
  localStorage.setItem('cardSelectedComponents', JSON.stringify(selectedComponents.value))
}

// 重置已选组件（清空）
const resetSelectedComponents = () => {
  if (selectedComponents.value.length === 0) {
    return
  }
  if (confirm('确定要清空所有已选组件吗？')) {
    selectedComponents.value = []
    saveSelectedComponents()
  }
}

// 检查组件是否已选中
const isSelected = (dirName: string) => {
  return selectedComponents.value.some((c) => c.dirName === dirName)
}

// 检查组件的模块位置
const getComponentModulePosition = (dirName: string) => {
  const comp = selectedComponents.value.find((c) => c.dirName === dirName)
  return comp?.modulePosition || ''
}

// 切换组件选择状态
const toggleSelect = (dirName: string, name: string, path: string, type: string) => {
  const index = selectedComponents.value.findIndex((c) => c.dirName === dirName)
  if (index === -1) {
    // 未选中，添加到列表
    selectedComponents.value.push({
      dirName,
      name,
      path,
      type,
      selected: true,
      modulePosition: '',
    })
  } else {
    // 已选中，从列表移除
    selectedComponents.value.splice(index, 1)
  }
  saveSelectedComponents()
}

// 模块选择器状态
const showModuleSelector = ref(false)
const currentSelectingComp = ref<ComponentSelectInfo | null>(null)

// 打开模块选择器
const openModuleSelector = (comp: ComponentSelectInfo) => {
  currentSelectingComp.value = comp
  showModuleSelector.value = true
}

// 选择模块位置
const selectModulePosition = (position: string) => {
  if (currentSelectingComp.value) {
    const index = selectedComponents.value.findIndex(
      (c) => c.dirName === currentSelectingComp.value!.dirName
    )
    if (index !== -1) {
      selectedComponents.value[index].modulePosition = position
      saveSelectedComponents()
    }
  }
  showModuleSelector.value = false
  currentSelectingComp.value = null
}

// 取消选择模块
const cancelModuleSelection = () => {
  showModuleSelector.value = false
  currentSelectingComp.value = null
  isConfigMode.value = false
}

// ==================== 模块配置功能（从 web-ai 迁移） ====================
// 配置编辑状态
const showModuleEditor = ref(false)
const editingPositions = ref<ModulePosition[]>([...modulePositions.value])
// 标记是否为模块配置模式（而非为组件选择模块）
const isConfigMode = ref(false)

function openModuleEditor() {
  editingPositions.value = modulePositions.value.map((p) => ({ ...p }))
  showModuleEditor.value = true
}

// 打开模块选择器（配置模式）
function openModuleSelectorForConfig() {
  isConfigMode.value = true
  showModuleSelector.value = true
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

// 获取某模块位置下的组件数量
const getComponentsByPosition = (position: string): ComponentSelectInfo[] => {
  return selectedComponents.value.filter((c) => c.modulePosition === position)
}

// 复制方案内容
const copySuccess = ref(false)
const errorMessage = ref('')

// 复制弹层
const showCopyModal = ref(false)
const editablePlanContent = ref('')

// 折叠/展开已选列表
const selectionListCollapsed = ref(false)
function toggleSelectionList() {
  selectionListCollapsed.value = !selectionListCollapsed.value
}

// ============================================================
// 构建复制内容 - 辅助函数
// ============================================================

/** 分隔线生成 */
const sep = (char: string, len: number = 80) => char.repeat(len)

/** 空行 */
const blank = () => ''

/** 企业信息字段配置 */
const enterpriseInfoFields = [
  { key: 'name', label: '企业名称' },
  { key: 'industry', label: '所属行业' },
  { key: 'description', label: '企业简介' },
  { key: 'targetAudience', label: '目标受众' },
  { key: 'mainColors', label: '品牌主色', fallback: '未设置' },
  { key: 'websiteType', label: '网站类型' },
  { key: 'designPhilosophy', label: '设计理念', fallback: '未填写' },
] as const

/** Vue → React 转换规则 */
const vueToReactRules = [
  { vue: 'v-for="item in list"', react: '{list.map(item => (...))}' },
  { vue: 'v-if="condition"', react: '{condition && (...)}' },
  { vue: 'ref="elementRef"', react: 'const elementRef = useRef<HTMLDivElement>(null)' },
  { vue: 'onMounted(() => {...})', react: 'useEffect(() => {...}, [])' },
  { vue: 'onUnmounted(() => {...})', react: 'useEffect(() => { return () => {...} }, [])' },
  {vue: 'defineProps<Props>()',
    react: 'interface Props {...}; const Component: React.FC<Props> = (props) => {...}',
  },
]

/** 技术要求清单 - 带序号 */
const techRequirements = [
  { num: 1, text: '**技术栈**: React 18 + TypeScript + Tailwind CSS + GSAP (ScrollTrigger)' },
  { num: 2, text: '**Vue → React 转换规则**:', indent: true },
  {num: 3,
    text: '**GSAP 插件注册**: 每个使用 ScrollTrigger 的组件文件顶部必须写 `gsap.registerPlugin(ScrollTrigger)`',
  },
  {num: 4,
    text: '**图片地址**: 使用 Unsplash 格式 `https://images.unsplash.com/photo-XXXXXXXX?w=1920&q=80`，每个模块至少1-2张图片，首屏必须有震撼的背景图',
  },
  {num: 5,
    text: '**Canvas API**: 如果组件使用 Canvas，必须在 React 中用 `useRef` + `useEffect` 完整重写',
  },
  {num: 6,
    text: '**ScrollTrigger 模式**: 必须严格基于源码判断 `scrub` 或 `toggleActions`，不可推断',
  },
  {num: 7,
    text: '**Section 层处理**: 如果组件内部已有 scrollTrigger 配置，Section 层不要重复创建',
  },
  {num: 8,
    text: '**首屏动画时机**: 首屏（Hero）模块的 GSAP 动画必须在页面加载时立即执行，使用 `useEffect(() => { gsap.fromTo(...) }, [])` 确保组件挂载后自动播放动画，禁止使用 ScrollTrigger 控制首屏动画。只有非首屏模块才使用 ScrollTrigger 根据滚动触发',
  },
  {num: 9,
    text: '**图片与动画结合**: 图片必须参与 GSAP 动画（如滚动时缩放、平移、淡入），不能只是静态展示。例如：`gsap.from(imageRef.current, { scale: 0.8, opacity: 0, scrollTrigger: { trigger: sectionRef, start: "top 80%" } })`',
  },
  {num: 10,
    text: '**动画时长约束**: 基础动画 0.3-0.6s，复杂入场动画 0.8-1.2s，ScrollTrigger 持续动画根据内容长度计算，禁止使用过长动画（>2s），过度动画影响用户体验',
  },
]

/** 输出文件清单 */
const outputFiles = [
  { file: 'App.tsx', desc: '主应用组件（包含所有 Section 的组合）' },
  { file: 'main.tsx', desc: '入口文件' },
  { file: 'components/Navbar.tsx', desc: '导航栏组件' },
  { file: 'components/Footer.tsx', desc: '页脚组件' },
  { file: 'sections/[模块名].tsx', desc: '各模块的 Section 组件' },
  { file: 'components/[组件名]/index.tsx', desc: '转换后的 React 组件' },
  { file: 'index.css', desc: '全局样式（含 Tailwind 配置、CSS 变量）' },
  { file: 'tailwind.config.js', desc: 'Tailwind 配置文件' },
]

/** 代码要求清单 */
const codeRequirements = [
  '每个文件必须是完整可运行的代码，包含所有 import/export',
  '组件内部的 GSAP 动画逻辑必须完整实现，不能省略',
  'Canvas 渲染逻辑必须用 useRef + useEffect 完整重写',
  '所有 ScrollTrigger 必须在 useEffect 中正确初始化和清理',
  '使用 TypeScript，所有组件必须有明确的类型定义',
  '样式使用 Tailwind CSS + 自定义 CSS 变量',
  '**性能优化**: 确保动画流畅度 ≥60fps，使用 will-change 提示浏览器，避免在滚动事件中执行重计算，Canvas 动画需在页面不可见时暂停（监听 visibilitychange），GSAP 动画需在组件卸载时 kill() 释放资源',
  '**错误处理**: 图片加载失败时显示占位图或纯色背景，GSAP 初始化失败时有降级方案（纯 CSS 动画或静态展示），Canvas 不支持时显示备用内容',
  '**ScrollTrigger 清理模板**: 必须在 useEffect cleanup 中调用清理函数，示例：`return () => { tweens.forEach(t => t.kill()); ScrollTrigger.getAll().forEach(t => t.kill()); }`',
]

/** 品牌主色约束 */
const mainColorConstraints = [
  '可使用 CSS 变量 `--primary-color` 统一管理',
  '按钮、强调色使用品牌主色',
  'Hover 状态可加深/加亮 10-20%',
  '渐变色使用 `tint()` 或 `shade()` 派生辅助色',
]

/** 设计理念约束 */
const designConstraints = [
  '排版间距、圆角大小、阴影强度需统一',
  '动画曲线(ease)选择应匹配设计调性',
  '图片风格、图标粗细保持一致',
]

/**
 * 分析组件源码中的 ScrollTrigger 模式
 */
function analyzeScrollTriggerMode(sourceCode: string): string | null {
  const result: string[] = []

  if (!sourceCode.includes('ScrollTrigger')) {
    return null
  }

  const stBlocks = sourceCode.match(/ScrollTrigger\s*:\s*\{[\s\S]*?\}/g) || []

  stBlocks.forEach((block, idx) => {
    const details: string[] = []

    const startMatch = block.match(/start\s*:\s*['"]([^'"]+)['"]/)
    const endMatch = block.match(/end\s*:\s*['"]([^'"]+)['"]/)
    if (startMatch) {
      details.push(`start: '${startMatch[1]}'`)
    }
    if (endMatch) {
      details.push(`end: '${endMatch[1]}'`)
    }

    const scrubMatch = block.match(/scrub\s*:\s*(true|false|\d+\.?\d*)/)
    if (scrubMatch) {
      const value = scrubMatch[1]
      if (value === 'true') {
        details.push('scrub: true（随滚动实时同步）')
      } else if (value === 'false') {
        details.push('scrub: false（自动播放一次）')
      } else {
        details.push(`scrub: ${value}（延迟${value}秒后同步）`)
      }
    }

    const toggleMatch = block.match(/toggleActions\s*:\s*['"]([^'"]+)['"]/)
    if (toggleMatch) {
      const actions = toggleMatch[1]
        .split(' ')
        .map((a) => {
          const map: Record<string, string> = {
            play: '▶️播放',
            pause: '⏸️暂停',
            resume: '▶️继续',
            reverse: '◀️倒放',
            restart: '🔄重播',
            reset: '🔚重置',
            complete: '✅完成',
            none: '❌无',
          }
          return map[a] || a
        })
        .join(' | ')
      details.push(`toggleActions: '${toggleMatch[1]}'（${actions}）`)
    }

    if (/pin\s*:\s*true/.test(block)) {
      const pinMatch = block.match(/pin\s*:\s*(true|['"][^'"]+['"])/)
      if (pinMatch && pinMatch[1] === 'true') {
        details.push('pin: true（滚动时固定元素）')
      } else {
        details.push(`pin: ${pinMatch[1]}（固定选择器）`)
      }
    }

    if (/markers\s*:\s*true/.test(block)) {
      details.push('⚠️ markers: true（仅调试使用）')
    }

    const idMatch = block.match(/id\s*:\s*['"]([^'"]+)['"]/)
    if (idMatch) {
      details.push(`id: '${idMatch[1]}'`)
    }

    if (/paused\s*:\s*true/.test(block)) {
      details.push('⏸️ paused: true（需手动触发）')
    }

    if (block.includes('animation:') && sourceCode.includes('timeline')) {
      details.push('animation: timeline（时间轴动画）')
    } else if (block.includes('animation:')) {
      details.push('animation: 单个tween')
    }

    if (details.length > 0) {
      const prefix = stBlocks.length > 1 ? `【配置${idx + 1}】` : '【配置】'
      result.push(`${prefix} ${details.join(' | ')}`)
    }
  })

  if (sourceCode.includes('paused: true') && sourceCode.includes('gsap.timeline')) {
    result.push('⏸️ timeline.paused: true（需外部触发 .play()）')
  }

  if (result.length === 0) {
    return null
  }

  return result.join('\n       ')
}

/**
 * 分析 Canvas 组件的特殊处理需求
 */
function analyzeCanvasComponent(sourceCode: string): string | null {
  const result: string[] = []

  const hasCanvas = /<canvas/.test(sourceCode)
  const hasGetContext = /getContext\s*\(\s*['"]2d['"]/.test(sourceCode)
  const hasRequestAnimationFrame = /requestAnimationFrame/.test(sourceCode)

  if (!hasCanvas && !hasGetContext) {
    return null
  }

  if (hasGetContext) {
    result.push('⚠️ 使用 Canvas 2D API')
    result.push('   1. React 中必须使用 useRef<HTMLCanvasElement>() 获取画布引用')
    result.push('   2. Canvas 绑定必须在 useEffect 中执行（DOM 渲染后）')
    result.push('   3. 动画循环需在 useEffect 中设置 requestAnimationFrame')
    result.push('   4. 清理函数中必须取消动画帧 cancelAnimationFrame')
    result.push('   5. 监听 resize 事件，及时更新 canvas 尺寸')

    if (/ctx\.drawImage/.test(sourceCode)) {
      result.push('   • 检测到图片绘制 ctx.drawImage，需准备图片资源')
    }
    if (/ctx\.fillText|ctx\.strokeText/.test(sourceCode)) {
      result.push('   • 检测到文字绘制 ctx.fillText/strokeText')
    }
    if (/ctx\.beginPath|ctx\.arc|ctx\.lineTo/.test(sourceCode)) {
      result.push('   • 检测到路径绘制（圆/线条/矩形）')
    }
    if (/createLinearGradient|createRadialGradient/.test(sourceCode)) {
      result.push('   • 检测到渐变填充')
    }
  }

  if (
    /getContext\s*\(\s*['"]webgl/.test(sourceCode) ||
    /THREE\.WebGLRenderer|new WebGLRenderer/.test(sourceCode)
  ) {
    result.push('⚠️ 使用 WebGL/Three.js 渲染')
    result.push('   1. 必须在 useEffect + useRef 模式下初始化渲染器')
    result.push('   2. 需要处理 WebGL 上下文丢失事件 webglcontextlost')
    result.push('   3. 动画循环中调用 renderer.render(scene, camera)')
    result.push('   4. 组件卸载时调用 renderer.dispose() 释放资源')
    result.push('   5. 考虑使用 @react-three/fiber 简化 Three.js 集成')
  }

  if (hasRequestAnimationFrame && sourceCode.includes('gsap.')) {
    result.push('   • 检测到 GSAP + requestAnimationFrame 混合动画，需确保两者的 RAF 同步')
  }

  if (hasRequestAnimationFrame) {
    result.push('   📌 性能建议：Canvas 动画建议添加 visibilitychange 监听，页面不可见时暂停')
  }

  return result.join('\n       ')
}

/**
 * 提取组件的 Props 定义信息
 */
function extractPropsInfo(sourceCode: string): string | null {
  const interfaceMatch = sourceCode.match(/interface\s+Props\s*\{([^}]+)\}/s)
  if (interfaceMatch) {
    const propsContent = interfaceMatch[1].trim()
    const lines = propsContent.split('\n').filter((l) => l.trim())
    if (lines.length > 0) {
      return lines.map((l) => l.trim()).join('\n')
    }
  }

  const withDefaultsMatch = sourceCode.match(
    /withDefaults\(defineProps<[^>]+>\(\)\s*,\s*\{([^}]+)\}/s,
  )
  if (withDefaultsMatch) {
    const defaultsContent = withDefaultsMatch[1].trim()
    const lines = defaultsContent.split('\n').filter((l) => l.trim())
    if (lines.length > 0) {
      return '默认值:\n' + lines.map((l) => l.trim()).join('\n')
    }
  }

  const definePropsMatch = sourceCode.match(/defineProps<\{([^}]+)\}>\(\)/s)
  if (definePropsMatch) {
    const propsContent = definePropsMatch[1].trim()
    const lines = propsContent.split('\n').filter((l) => l.trim())
    if (lines.length > 0) {
      return lines.map((l) => l.trim()).join('\n')
    }
  }

  return null
}

/**
 * 构建复制内容 - 供 meoo AI 使用的完整信息
 */
const buildCopyContent = (): string => {
  if (selectedComponents.value.length === 0) {
    return ''
  }

  // 模块位置标签映射
  const moduleLabels: Record<string, string> = Object.fromEntries(
    modulePositions.value.map((pos) => [pos.key, pos.label]),
  )

  // 按模块位置分组（过滤掉未分配模块的组件）
  const componentsByModule: Record<string, ComponentSelectInfo[]> = {}
  const unassignedComps: ComponentSelectInfo[] = []

  selectedComponents.value.forEach((comp) => {
    if (!comp.modulePosition) {
      unassignedComps.push(comp)
    } else {
      if (!componentsByModule[comp.modulePosition]) {
        componentsByModule[comp.modulePosition] = []
      }
      componentsByModule[comp.modulePosition].push(comp)
    }
  })

  const moduleOrder = modulePositions.value
    .map((p) => p.key)
    .filter((key) => componentsByModule[key]?.length > 0)

  // 组件类型汇总
  const componentsByType: Record<string, number> = {}
  selectedComponents.value.forEach((comp) => {
    componentsByType[comp.type] = (componentsByType[comp.type] || 0) + 1
  })

  // 辅助函数：获取组件源码
  const getComponentSourceCode = (comp: ComponentSelectInfo): string => {
    return (comp.sourceCode as string) || (vueModules[comp.path] as string) || ''
  }

  // 辅助函数：获取组件 README
  const getComponentReadme = (comp: ComponentSelectInfo): string => {
    const readmePath = comp.path.replace(/\.vue$/, '/README.md')
    return (comp.readme as string) || (readmeModules[readmePath] as string) || ''
  }

  // ============================================================
  // 构建内容
  // ============================================================
  const lines: string[] = []

  // 标题
  lines.push(sep('='), '🎯 企业网站开发需求 - 请在 meoo AI 平台生成 React 代码', sep('='), blank())

  // ===== Token 估算 =====
  const totalChars = selectedComponents.value.reduce((sum, comp) => {
    const sourceCode = getComponentSourceCode(comp)
    const readme = getComponentReadme(comp)
    return sum + sourceCode.length + readme.length
  }, 0)
  const estimatedTokens = Math.ceil(totalChars / 4)

  if (estimatedTokens > 50000) {
    lines.push('⚠️ **Token 警告**', sep('-'))
    lines.push(
      `当前选中的组件源码总量约 ${estimatedTokens.toLocaleString()} tokens，可能超出模型上下文限制。`,
    )
    lines.push('建议：')
    lines.push('1. 减少选中组件数量')
    lines.push('2. 或分批生成（先生成部分模块的代码）')
    lines.push(blank())
  }

  // ===== 角色设定与技术要求 =====
  lines.push(
    '📌 角色设定',
    sep('-'),
    '你是一位资深的 React + GSAP 动画专家。你必须基于用户选配的 Vue 组件，',
    '直接开发完整的、可运行的 React 企业网站代码。',
    blank(),
  )

  lines.push('⚙️ 核心技术要求（必须遵守）', sep('-'))
  lines.push('1. **技术栈**: React 18 + TypeScript + Tailwind CSS + GSAP (ScrollTrigger)')
  lines.push('2. **Vue → React 转换规则**:')
  vueToReactRules.forEach((rule) => lines.push(`   - \`${rule.vue}\` → \`${rule.react}\``))
  const otherTechReqs = techRequirements.filter((t) => t.num > 2)
  otherTechReqs.forEach((req, idx) => lines.push(`${idx + 3}. ${req.text}`))
  lines.push(blank())

  // ===== 企业信息 =====
  lines.push('📋 企业信息', sep('-'))
  enterpriseInfoFields.forEach(({ key, label, fallback }) => {
    const value = (enterpriseInfo[key as keyof EnterpriseInfo] as string)?.trim() || ''
    lines.push(`${label}: ${value || fallback || ''}`)
  })
  lines.push(blank())

  // ===== 品牌主色约束 =====
  lines.push('🎨 品牌主色（设计约束 - 必须遵守）', sep('-'))
  lines.push(`主色配置: ${enterpriseInfo.mainColors || '未设置'}`)
  if (enterpriseInfo.mainColors) {
    const isGradient =
      enterpriseInfo.mainColors.includes('gradient') ||
      enterpriseInfo.mainColors.includes('linear-gradient')
    lines.push(
      `   ⚠️ 约束: ${isGradient ? '使用渐变色，CSS 中必须使用 `background: linear-gradient(...)` 而非单一颜色' : '整体配色以该主色为核心，所有组件的 primary/accent 颜色必须基于此色值'}`,
    )
    mainColorConstraints.forEach((c) => lines.push(`   • ${c}`))
  }
  lines.push(blank())

  // ===== 设计理念约束 =====
  lines.push('💡 设计理念（风格约束 - 必须体现）', sep('-'))
  lines.push(`设计理念: ${enterpriseInfo.designPhilosophy || '未填写（默认使用简洁现代风格）'}`)
  if (enterpriseInfo.designPhilosophy) {
    lines.push('   ⚠️ 约束: 所有组件的设计风格、动画节奏、视觉层次必须契合此理念')
    designConstraints.forEach((c) => lines.push(`   • ${c}`))
  }
  lines.push(blank())

  // ===== 模块组件规划 =====
  lines.push('🧩 模块组件规划（用户已指定，不可更改）', sep('-'))

  moduleOrder.forEach((pos, idx) => {
    const comps = componentsByModule[pos]
    const moduleName = moduleLabels[pos] || pos
    const moduleDesc = modulePositions.value.find((p) => p.key === pos)?.desc || ''

    lines.push(blank(), `${idx + 1}. 【${moduleName}】`)
    if (moduleDesc) {
      lines.push(`   描述：${moduleDesc}`)
    }
    lines.push(`   📦 使用组件 (${comps.length}个)`, blank())

    comps.forEach((comp, compIdx) => {
      lines.push(`   ${compIdx + 1}. ${comp.dirName} (${comp.type})`, '   ' + sep('-', 70))

      // 从 vueModules 动态获取源码
      const sourceCode = (comp.sourceCode as string) || (vueModules[comp.path] as string) || ''
      // 从 readmeModules 动态获取 README
      const readmePath = comp.path.replace(/\.vue$/, '/README.md')
      const readme = (comp.readme as string) || (readmeModules[readmePath] as string) || ''

      // README 效果描述
      if (readme) {
        const effectMatch =
          readme.match(/### 核心效果\n([\s\S]*?)(?=##|$)/) ||
          readme.match(/### 核心动画\n([\s\S]*?)(?=##|$)/)
        if (effectMatch) {
          const effects = effectMatch[1].match(/-\s*\*\*([^*]+)\*\*:\s*([^\n-]+)/g) || []
          if (effects.length > 0) {
            lines.push('   • 核心效果:')
            effects.slice(0, 5).forEach((e) => {
              const match = e.match(/-\s*\*\*([^*]+)\*\*:\s*([^\n-]+)/)
              if (match) {
                lines.push(`     - ${match[1]}: ${match[2].trim()}`)
              }
            })
          }
        }
      }

      // 源码分析（从 vueModules 获取）
      if (sourceCode) {
        const scrollTriggerAnalysis = analyzeScrollTriggerMode(sourceCode)
        if (scrollTriggerAnalysis) {
          lines.push('   • ScrollTrigger 模式:', `     ${scrollTriggerAnalysis}`)
        }

        // Canvas 组件特殊提示
        const canvasAnalysis = analyzeCanvasComponent(sourceCode)
        if (canvasAnalysis) {
          lines.push('   • 🎨 Canvas 特殊处理:', `     ${canvasAnalysis}`)
        }

        // Props 信息
        const propsInfo = extractPropsInfo(sourceCode)
        if (propsInfo) {
          lines.push('   • Props 定义:', ...propsInfo.split('\n').map((line) => `     ${line}`))
        } else {
          lines.push('   • Props 定义: 该组件无外部Props，内容在组件内部定义')
        }

        // 完整源码
        lines.push(
          '   • 完整 Vue 3 组件源码（转 React 时参考）:',
          '     ```vue',
          ...sourceCode.split('\n').map((l) => '     ' + l),
          '     ```',
          blank(),
        )
      } else {
        lines.push('   ⚠️ 源码未找到，请检查组件路径是否正确')
        lines.push(`   • 组件路径: ${comp.path}`)
        lines.push(blank())
      }
    })
  })

  // ===== 组件类型汇总 =====
  lines.push(
    sep('-'),
    '📊 组件类型汇总',
    ...Object.entries(componentsByType).map(([type, count]) => `  ${type}: ${count}个`),
    blank(),
  )

  // ===== 未分配模块的组件 =====
  if (unassignedComps.length > 0) {
    lines.push(blank(), sep('-'), '⚠️ 未分配模块的组件（请先在组件选择器中指定模块位置）', sep('-'))
    unassignedComps.forEach((comp, idx) => lines.push(`${idx + 1}. ${comp.dirName} (${comp.type})`))
    lines.push(blank())
  }

  // ===== 输出格式要求 =====
  lines.push(
    sep('='),
    '📝 输出要求：直接生成完整的 React 网站代码',
    sep('='),
    '请直接生成以下文件的完整代码（不要写方案文档，直接写代码）：',
    blank(),
  )

  lines.push('### 必须生成的文件清单')
  outputFiles.forEach((f, i) => lines.push(`${i + 1}. **${f.file}** - ${f.desc}`))
  lines.push(blank())

  lines.push('### 代码要求')
  codeRequirements.forEach((req) => lines.push(`- ${req}`))
  lines.push(blank())

  // ===== 内容创作指南 =====
  lines.push('### 📝 内容创作指南（重要）')
  lines.push('**核心原则：文案必须与组件的视觉效果相呼应，创造沉浸式的用户体验**')
  lines.push(blank())
  lines.push('#### 1. 根据视觉特效选择文案主题')
  lines.push('| 视觉效果 | 文案主题方向 | 示例关键词 |')
  lines.push('|---------|------------|-----------|')
  lines.push('| 粒子/星空/宇宙 | 探索、无限可能、前沿科技 | "探索未知边界"、"连接无限可能" |')
  lines.push('| 流体/波浪/液态 | 创新、变革、灵活适应 | "引领行业变革"、"灵活应对挑战" |')
  lines.push('| 3D旋转/立体几何 | 专业、稳固、多维视角 | "多维度解决方案"、"稳固可靠" |')
  lines.push('| 光效/霓虹/发光 | 活力、能量、突破 | "释放潜能"、"点亮未来" |')
  lines.push('| 时间轴/流程/进度 | 成长、历程、持续进步 | "见证每一步成长"、"持续进化" |')
  lines.push('| 卡片翻转/视差 | 发现、层次、深度洞察 | "发现新视角"、"深度洞察" |')
  lines.push(blank())
  lines.push('#### 2. 标题撰写规范')
  lines.push('- **主标题**：8-15字，简洁有力，直接传达核心价值')
  lines.push('  - ❌ 错误："智能驱动未来"（太通用）')
  lines.push('  - ✅ 正确："AI赋能制造业数字化转型"（具体、贴合行业）')
  lines.push('- **副标题**：20-30字，补充说明主标题，增强说服力')
  lines.push('  - 示例："为制造企业提供从生产到销售的全链路智能化解决方案，提升效率30%以上"')
  lines.push(blank())
  lines.push('#### 3. 段落描述要求')
  lines.push('- 每段 60-120 字，避免空洞的形容词堆砌')
  lines.push('- 必须包含具体的业务场景、数据支撑或客户价值')
  lines.push('- 语言风格要与企业行业匹配：')
  lines.push('  - 科技行业：专业、前瞻、技术导向')
  lines.push('  - 金融行业：稳健、可信、安全')
  lines.push('  - 教育行业：温暖、启发、成长')
  lines.push('  - 医疗行业：关怀、精准、生命')
  lines.push(blank())
  lines.push('#### 4. 🖼️ 图片使用策略（重点）')
  lines.push('**原则：图片不是装饰，而是内容的视觉化表达。每个模块至少使用1-2张高质量图片。**')
  lines.push(blank())
  lines.push('##### 4.1 图片数量要求')
  lines.push('- **首屏 Hero**：1张全屏背景图或视频封面（必须震撼、有冲击力）')
  lines.push('- **产品展示模块**：3-6张产品/案例图片（展示多样性）')
  lines.push('- **团队介绍模块**：2-4张团队成员照片或办公场景')
  lines.push('- **数据展示模块**：配合图表的背景图或图标插画')
  lines.push('- **联系/CTA模块**：1张引导性图片（如握手、合作场景）')
  lines.push(blank())
  lines.push('##### 4.2 图片与动画的结合方式')
  lines.push(
    '- **粒子效果 + 星空/科技图片**：背景使用深空、星系、电路板等图片，前景叠加粒子动画，营造科技感',
  )
  lines.push('- **流体动画 + 自然/抽象图片**：使用水流、烟雾、渐变抽象图片，与流体动画呼应')
  lines.push('- **3D旋转 + 产品实拍图**：将企业真实产品图片放入3D卡片中旋转展示')
  lines.push('- **视差滚动 + 分层图片**：前景人物/产品、中景场景、远景天空，形成层次感')
  lines.push('- **时间轴 + 历程图片**：每个时间节点配一张对应的历史照片或里程碑图片')
  lines.push(blank())
  lines.push('##### 4.3 Unsplash 图片搜索技巧')
  lines.push('根据企业行业和模块主题，组合以下关键词搜索：')
  lines.push('```')
  lines.push(
    '科技行业：technology + innovation, AI + data, digital + transformation, startup + office',
  )
  lines.push(
    '金融行业：finance + professional, business + meeting, trust + handshake, investment + growth',
  )
  lines.push(
    '教育行业：education + learning, students + classroom, graduation + success, online + course',
  )
  lines.push(
    '医疗行业：healthcare + doctor, medical + technology, patient + care, hospital + modern',
  )
  lines.push(
    '制造业：manufacturing + factory, industrial + automation, production + quality, engineer + work',
  )
  lines.push('```')
  lines.push(blank())
  lines.push('##### 4.4 图片质量要求')
  lines.push('- **分辨率**：至少 1920x1080，优先使用横版构图')
  lines.push('- **色调**：与品牌主色协调，可通过 CSS filter 调整色温/饱和度')
  lines.push('- **主体清晰**：避免过于杂乱或模糊的图片')
  lines.push('- **留白充足**：方便在其上叠加文字或动画元素')
  lines.push('- **格式**：使用 `.jpg` 或 `.webp`，通过 URL 参数控制质量 `?w=1920&q=80`')
  lines.push(blank())
  lines.push('##### 4.5 图片布局建议')
  lines.push(
    '- **Hero 全屏背景**：`background-image: url(...)` + `background-size: cover` + 半透明遮罩层',
  )
  lines.push('- **左右分栏**：左侧文字 + 右侧图片（或反之），适合产品介绍')
  lines.push('- **网格画廊**：3列或4列网格展示多个产品/案例图片')
  lines.push('- **卡片覆盖**：图片作为卡片背景，上方叠加文字和按钮')
  lines.push('- **轮播/滑动**：多张图片横向滑动展示，适合团队或案例')
  lines.push(blank())
  lines.push('##### 4.6 图片加载优化')
  lines.push('- 使用 `loading="lazy"` 懒加载非首屏图片')
  lines.push('- 添加 `alt` 属性提升可访问性')
  lines.push('- 考虑使用 WebP 格式减小文件体积')
  lines.push('- 为图片添加淡入动画：`gsap.from(img, { opacity: 0, duration: 1 })`')
  lines.push(blank())
  lines.push('##### 4.7 响应式图片策略')
  lines.push('- **桌面端（≥1024px）**：使用完整分辨率图片（1920x1080）')
  lines.push('- **平板端（768px-1023px）**：使用中分辨率图片（1280x720）')
  lines.push('- **移动端（<768px）**：使用低分辨率图片（768x432）或裁剪为中心区域')
  lines.push('- 使用 Tailwind 响应式类：`<img className="w-full md:w-1/2 lg:w-1/3" />`')
  lines.push('- Hero 背景图在移动端可切换为更简洁的版本')
  lines.push(blank())
  lines.push('##### 4.8 GSAP 缓动函数选择')
  lines.push('**原则：不同场景使用不同的缓动函数，让动画更自然、更符合用户预期**')
  lines.push(blank())
  lines.push('| 动画类型 | 推荐缓动函数 | 效果描述 |')
  lines.push('|---------|-------------|----------|')
  lines.push('| 入场动画 | `power2.out` | 自然减速，舒适流畅 |')
  lines.push('| 入场弹跳 | `back.out(1.2)` | 先过头再弹回，有活力 |')
  lines.push('| 强调动画 | `elastic.out(1, 0.5)` | 弹性效果，吸引注意 |')
  lines.push('| 滚动绑定 | `none` | 与滚动完全同步 |')
  lines.push('| 退出动画 | `power2.in` | 快速离开 |')
  lines.push('| 加载动画 | `circ.out` | 匀加速旋转 |')
  lines.push('| 视差效果 | `power1.out` | 平滑自然 |')
  lines.push('| **避免使用** | `linear` | 过于机械，无变化感 |')
  lines.push(blank())
  lines.push('**示例代码**：')
  lines.push('```tsx')
  lines.push('// 入场动画 - 自然舒适')
  lines.push(
    'gsap.fromTo(element, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })',
  )
  lines.push(blank())
  lines.push('// 弹跳入场 - 有活力')
  lines.push(
    'gsap.fromTo(element, { scale: 0 }, { scale: 1, duration: 0.8, ease: "back.out(1.7)" })',
  )
  lines.push(blank())
  lines.push('// 滚动同步 - 平滑视差')
  lines.push('gsap.to(element, { y: -100, ease: "none", scrollTrigger: { trigger, scrub: 1 } })')
  lines.push('```')
  lines.push(blank())
  lines.push('#### 5. ♿ 可访问性（Accessibility）要求')
  lines.push('**原则：网站必须对所有用户友好，包括残障人士和使用辅助技术的用户。**')
  lines.push(blank())
  lines.push('##### 5.1 键盘导航')
  lines.push('- 所有交互元素（按钮、链接、卡片）必须可通过 Tab 键访问')
  lines.push('- 焦点状态必须有清晰的视觉反馈（outline 或 box-shadow）')
  lines.push('- 避免使用 `tabindex > 0`，保持自然 tab 顺序')
  lines.push(blank())
  lines.push('##### 5.2 ARIA 标签')
  lines.push('- 图片必须添加 `alt` 属性描述内容')
  lines.push('- 装饰性图片使用 `alt=""` 或 `role="presentation"`')
  lines.push('- 动态内容区域使用 `aria-live="polite"` 通知屏幕阅读器')
  lines.push('- 导航栏使用 `<nav>` + `aria-label="主导航"`')
  lines.push(blank())
  lines.push('##### 5.3 减少动画偏好')
  lines.push('- 检测系统偏好：`window.matchMedia("(prefers-reduced-motion: reduce)")`')
  lines.push('- 如果用户偏好减少动画，则：')
  lines.push('  - 禁用或简化 GSAP 动画（duration 设为 0 或使用 fade-in）')
  lines.push('  - 停止 Canvas 粒子/流体动画')
  lines.push('  - 保留必要的功能动画（如表单验证反馈）')
  lines.push('- 示例代码：')
  lines.push('```tsx')
  lines.push(
    'const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches',
  )
  lines.push('if (!prefersReducedMotion) {')
  lines.push('  gsap.from(element, { opacity: 0, y: 50, duration: 1 })')
  lines.push('} else {')
  lines.push('  element.style.opacity = "1" // 直接显示')
  lines.push('}')
  lines.push('```')
  lines.push(blank())
  lines.push('##### 5.4 颜色对比度')
  lines.push('- 文字与背景对比度至少 4.5:1（WCAG AA 标准）')
  lines.push('- 大文字（≥18px）对比度至少 3:1')
  lines.push('- 避免仅用颜色传达信息（如错误状态同时使用图标+文字）')
  lines.push(blank())
  lines.push('#### 6. 🔍 SEO 优化')
  lines.push('- 每个 Section 使用语义化 HTML 标签（`<section>`, `<article>`, `<header>`）')
  lines.push('- 主标题使用 `<h1>`，模块标题使用 `<h2>`，子标题使用 `<h3>`')
  lines.push('- 图片 `alt` 属性包含关键词（如 "AI制造企业数字化转型解决方案"）')
  lines.push('- 关键内容避免完全依赖 JavaScript 渲染，确保 SSR 友好')
  lines.push('- 添加 meta description 和 Open Graph 标签（在 index.html 中）')
  lines.push(blank())
  lines.push('#### 7. ✅ 生成前检查清单')
  lines.push('生成代码前，请确认：')
  lines.push('- [ ] 所有标题都与企业的实际业务相关，不是通用模板')
  lines.push('- [ ] 文案风格与组件的视觉效果协调一致')
  lines.push('- [ ] 使用了具体的行业术语和业务场景描述')
  lines.push('- [ ] 每个模块至少有1张图片，首屏和产品模块有2-3张')
  lines.push('- [ ] 图片 URL 是 Unsplash 格式且与内容/动画主题匹配')
  lines.push('- [ ] Props 传值中的文本内容（如 title、subtitle、imageUrl）已替换为企业真实信息')
  lines.push('- [ ] 图片与 GSAP 动画有交互（如滚动时图片缩放/移动/淡入）')
  lines.push('- [ ] 动画性能优化：使用 will-change、visibilitychange 监听、GSAP cleanup')
  lines.push('- [ ] 可访问性：键盘导航、ARIA 标签、prefers-reduced-motion 支持')
  lines.push('- [ ] 响应式：桌面/平板/移动端图片适配、布局断点合理')
  lines.push('- [ ] SEO：语义化标签、h1-h6 层级、图片 alt 关键词')
  lines.push('- [ ] 错误处理：图片加载失败降级、GSAP 初始化失败备选方案')
  lines.push('- [ ] 动画缓动：使用合适的 ease 函数，避免 linear')
  lines.push('- [ ] ScrollTrigger 清理：组件卸载时正确 kill 所有动画')
  lines.push(blank())
  lines.push('#### 8. ⚠️ 常见错误警告（必须避免）')
  lines.push('**以下错误会导致动画不工作、性能问题或内存泄漏，请务必避免：**')
  lines.push(blank())
  lines.push('##### 8.1 GSAP/ScrollTrigger 错误')
  lines.push('| 错误写法 | 正确写法 | 说明 |')
  lines.push('|---------|---------|------|')
  lines.push(
    '| `toggleActions: "play none none none"` | `toggleActions: "play none none reverse"` | 否则动画只播放一次，无法重复触发 |',
  )
  lines.push(
    '| 遗漏 `gsap.registerPlugin(ScrollTrigger)` | 组件顶部必须注册 | 否则 ScrollTrigger 不工作 |',
  )
  lines.push('| 在 render 中直接执行 GSAP | 必须在 `useEffect` 中执行 | 否则 DOM 未就绪 |')
  lines.push('| 忘记清理 ScrollTrigger | `return () => t.kill()` | 否则内存泄漏 |')
  lines.push('| `gsap.to(target, {...})` 无 `duration` | 添加 `duration: 0.6` | 否则动画立即完成 |')
  lines.push('| 使用 `linear` 缓动 | 使用 `power2.out` 等 | linear 过于机械 |')
  lines.push('| `scrub: true` | `scrub: 1` 或 `scrub: "content"` | true 不支持平滑滚动 |')
  lines.push(blank())
  lines.push('##### 8.2 React Hooks 错误')
  lines.push('| 错误写法 | 正确写法 | 说明 |')
  lines.push('|---------|---------|------|')
  lines.push(
    '| `useEffect(() => { gsap.to(...) })` | `useEffect(() => { gsap.to(...); return () => kill() }, [])` | 必须有依赖数组和清理函数 |',
  )
  lines.push(
    '| `useEffect(() => { anim = gsap.to(...) })` | 使用 `useRef` 保存：`const animRef = useRef(); animRef.current = gsap.to(...)` | 避免闭包问题 |',
  )
  lines.push(
    '| 在 `useEffect` 外定义 ScrollTrigger | 在 `useEffect` 内创建并清理 | 确保 DOM 就绪 |',
  )
  lines.push(blank())
  lines.push('##### 8.3 Canvas 错误')
  lines.push('| 错误写法 | 正确写法 | 说明 |')
  lines.push('|---------|---------|------|')
  lines.push('| 直接操作 DOM | 使用 `useRef` 获取 canvas | React 中必须用 ref |')
  lines.push(
    '| 在 render 中 `ctx.beginPath()` | 在 `useEffect` 中 `requestAnimationFrame` 循环 | 否则动画不流畅 |',
  )
  lines.push(
    '| 遗漏 `canvas.width = container.offsetWidth` | 监听 resize 事件更新尺寸 | 否则 canvas 尺寸不对 |',
  )
  lines.push('| 页面隐藏时继续动画 | 监听 `visibilitychange` 暂停 | 否则浪费性能 |')
  lines.push(blank())
  lines.push('##### 8.4 常见代码示例（正确写法）')
  lines.push('```tsx')
  lines.push('// ✅ 正确的 ScrollTrigger 使用方式')
  lines.push('useEffect(() => {')
  lines.push('  gsap.registerPlugin(ScrollTrigger)')
  lines.push('  ')
  lines.push('  const ctx = gsap.context(() => {')
  lines.push('    gsap.fromTo(".element",')
  lines.push('      { opacity: 0, y: 50 },')
  lines.push('      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out",')
  lines.push(
    '        scrollTrigger: { trigger: ".element", start: "top 80%", toggleActions: "play none none reverse" }',
  )
  lines.push('      }')
  lines.push('    )')
  lines.push('  })')
  lines.push('  ')
  lines.push('  return () => ctx.revert() // ✅ 清理所有动画')
  lines.push('}, [])')
  lines.push(blank())
  lines.push('// ✅ 正确的 Canvas 使用方式')
  lines.push('useEffect(() => {')
  lines.push('  const canvas = canvasRef.current')
  lines.push('  const ctx = canvas.getContext("2d")')
  lines.push('  let animationId: number')
  lines.push('  ')
  lines.push(
    '  const resize = () => { canvas.width = container.offsetWidth; canvas.height = container.offsetHeight }',
  )
  lines.push('  resize()')
  lines.push('  window.addEventListener("resize", resize)')
  lines.push('  ')
  lines.push('  const draw = () => { /* ... */ ; animationId = requestAnimationFrame(draw) }')
  lines.push('  draw()')
  lines.push('  ')
  lines.push('  document.addEventListener("visibilitychange", () => {')
  lines.push('    if (document.hidden) cancelAnimationFrame(animationId)')
  lines.push('    else draw()')
  lines.push('  })')
  lines.push('  ')
  lines.push(
    '  return () => { cancelAnimationFrame(animationId); window.removeEventListener("resize", resize) }',
  )
  lines.push('}, [])')
  lines.push('```')
  lines.push(blank())
  lines.push('### 输出顺序')
  lines.push('请按以下顺序输出代码文件（每个文件用 ```tsx 或 ```css 包裹）：')
  ;[
    'tailwind.config.js',
    'index.css',
    '各个 React 组件（按依赖顺序）',
    'App.tsx',
    'main.tsx',
  ].forEach((f, i) => lines.push(`${i + 1}. ${f}`))
  lines.push(blank())

  // 提示
  lines.push(
    sep('='),
    '💡 提示：请复制上方完整信息到 meoo AI 平台，我将直接为您生成完整的 React 网站代码',
    sep('='),
  )

  return lines.join('\n')
}

// 打开复制方案弹层
function openCopyModal() {
  // 清除之前的错误消息
  errorMessage.value = ''
  if (selectedComponents.value.length === 0) {
    errorMessage.value = '请至少选择一个组件'
    showCopyErrorModal('⚠️ 提示', '请至少选择一个组件后再复制')
    return
  }
  if (!enterpriseInfo.name) {
    errorMessage.value = '请先填写企业信息'
    showCopyErrorModal('⚠️ 提示', '请先填写企业信息后再复制')
    return
  }
  editablePlanContent.value = buildCopyContent()
  showCopyModal.value = true
}

// 关闭复制弹层
function closeCopyModal() {
  showCopyModal.value = false
  errorMessage.value = ''
}

// 实际复制内容到剪贴板
async function copyContent() {
  try {
    await navigator.clipboard.writeText(editablePlanContent.value)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (err) {
    errorMessage.value = '复制失败，请手动复制'
    showCopyErrorModal('❌ 复制失败', '请手动复制内容')
  }
}

// 错误弹窗
const showErrorModal = ref(false)
const errorModalTitle = ref('')
const errorModalMessage = ref('')

function showCopyErrorModal(title: string, message: string) {
  errorModalTitle.value = title
  errorModalMessage.value = message
  showErrorModal.value = true
  setTimeout(() => {
    showErrorModal.value = false
  }, 2500)
}

// 复制方案到剪贴板（兼容旧调用）
async function copyPlanToClipboard() {
  openCopyModal()
}

// 打开 meoo AI
function OpenMeoo() {
  window.open('https://ai.meoo.com', '_blank')
}

// 初始化已选组件
onMounted(() => {
  selectedComponents.value = loadSelectedComponents()
})

// ==================== 企业信息功能（从 web-ai 迁移） ====================
interface EnterpriseInfo {
  name: string
  industry: string
  description: string
  targetAudience: string
  mainColors: string
  websiteType: string
  designPhilosophy: string
}

// 企业信息
const enterpriseInfo = reactive<EnterpriseInfo>({
  name: '',
  industry: '',
  description: '',
  targetAudience: '',
  mainColors: '',
  websiteType: '',
  designPhilosophy: '',
})

// 加载保存的企业信息
const loadEnterpriseInfo = (): EnterpriseInfo => {
  try {
    const saved = localStorage.getItem('cardEnterpriseInfo')
    return saved ? JSON.parse(saved) : {
      name: '',
      industry: '',
      description: '',
      targetAudience: '',
      mainColors: '',
      websiteType: '',
      designPhilosophy: '',
    }
  } catch {
    return {
      name: '',
      industry: '',
      description: '',
      targetAudience: '',
      mainColors: '',
      websiteType: '',
      designPhilosophy: '',
    }
  }
}

// 保存企业信息到 localStorage
const saveEnterpriseInfo = () => {
  localStorage.setItem('cardEnterpriseInfo', JSON.stringify(enterpriseInfo))
}

// 监听企业信息变化，自动保存
watch(enterpriseInfo, () => {
  saveEnterpriseInfo()
}, { deep: true })

// 颜色选择器相关
const showColorPicker = ref(false)
const colorMode = ref<'solid' | 'gradient'>('solid')
const singleColor = ref('#667eea')
const gradientStart = ref('#667eea')
const gradientEnd = ref('#764ba2')
const gradientAngle = ref(135)

// 预设单色
const solidColorPresets = [
  { name: '科技蓝', value: '#0066FF' },
  { name: '活力橙', value: '#FF6600' },
  { name: '清新绿', value: '#00C851' },
  { name: '浪漫粉', value: '#FF2D55' },
  { name: '贵族紫', value: '#7C3AED' },
  { name: '阳光黄', value: '#FFD700' },
  { name: '深海蓝', value: '#0F172A' },
  { name: '薄荷绿', value: '#00D4AA' },
  { name: '玫瑰金', value: '#E91E63' },
  { name: '雾霾蓝', value: '#607D8B' },
  { name: '珊瑚色', value: '#FF7F50' },
  { name: '电光紫', value: '#9D4EDD' },
]

// 预设渐变
const gradientPresets = [
  { name: '极光渐变', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: '日落渐变', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: '森林渐变', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { name: '海洋渐变', value: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)' },
  { name: '火焰渐变', value: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)' },
  { name: '银河渐变', value: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
]

// 切换颜色选择器
const toggleColorPicker = () => {
  showColorPicker.value = !showColorPicker.value
}

// 选择预设单色
const selectSolidPreset = (color: string) => {
  singleColor.value = color
  enterpriseInfo.mainColors = color
}

// 从颜色选择器更新
const updateColorFromPicker = () => {
  enterpriseInfo.mainColors = singleColor.value
}

// 应用自定义渐变
const applyGradient = () => {
  const gradient = `linear-gradient(${gradientAngle.value}deg, ${gradientStart.value} 0%, ${gradientEnd.value} 100%)`
  enterpriseInfo.mainColors = gradient
  colorMode.value = 'gradient'
}

// 判断是否为渐变色
const isGradientColor = (color: string) => {
  return color.includes('gradient') || color.includes('linear-gradient')
}

// 企业信息弹窗状态
const showEnterpriseModal = ref(false)

// 打开企业信息弹窗
const openEnterpriseModal = () => {
  // 加载保存的企业信息
  const saved = loadEnterpriseInfo()
  Object.assign(enterpriseInfo, saved)
  showEnterpriseModal.value = true
}

// 关闭企业信息弹窗
const closeEnterpriseModal = () => {
  showEnterpriseModal.value = false
}

// 企业信息是否已填写
const hasEnterpriseInfo = computed(() => {
  return enterpriseInfo.name.trim().length > 0
})

// 获取企业信息摘要
const enterpriseInfoSummary = computed(() => {
  const parts: string[] = []
  if (enterpriseInfo.name) parts.push(enterpriseInfo.name)
  if (enterpriseInfo.industry) parts.push(enterpriseInfo.industry)
  if (enterpriseInfo.mainColors) parts.push('已设置品牌色')
  return parts.length > 0 ? parts.join(' · ') : '未填写'
})

// 参考示例展开状态
const showReferenceExample = ref(false)

// 初始化企业信息
onMounted(() => {
  const saved = loadEnterpriseInfo()
  Object.assign(enterpriseInfo, saved)
})

// 添加收藏分类
const categories = [
  { key: 'all', label: '全部' },
  { key: 'card-image', label: '图片' },
  { key: 'card-img', label: '图像' },
  { key: 'card-text', label: '文字' },
  { key: 'card-3d', label: '3D' },
  { key: 'card-time', label: '时间' },
  { key: 'card-list', label: '基础' },
  { key: 'favorite', label: '我的收藏' },
]

// ==================== 响应式数据 ====================
const visibleCards = ref(new Set<number>())
const pageRefs = ref<Map<number, HTMLElement>>(new Map())
const propsMap = ref<Map<number, Record<string, unknown>>>(new Map())
let observer: IntersectionObserver | null = null

// ==================== 动态导入组件 ====================
// card-list 目录组件
const modules = import.meta.glob('./card-list/*/[^/]*.vue', { eager: true })
// card-time 目录组件（精确匹配主文件）
const modulesTime = import.meta.glob('./card-time/*/CardTime*.vue', { eager: true })
// card-3d 目录组件
const modules3d = import.meta.glob('./card-3d/*/[^/]*.vue', { eager: true })
// card-img 目录组件
const modulesImg = import.meta.glob('./card-img/*/[^/]*.vue', { eager: true })
// card-image 目录组件
const modulesImage = import.meta.glob('./card-image/*/[^/]*.vue', { eager: true })
// card-text 目录组件
const modulesText = import.meta.glob('./card-text/*/[^/]*.vue', { eager: true })

/**
 * 自动化构建组件列表
 */
/*const dirNameList = [
  'CardImageCarbonBlade',
  'CardImageCarbonCrystal',
  'CardImageCrossCrack',
  'CardImageCurtainRise',
  'CardImageDeepSeaCoffin',
  'CardImageDepthStorm',
  'CardImageDiagonalGrid',
  'CardImageDiagonalSlice',
  'CardImageGlacierCrevasse',
  'CardImageMirage',
  'CardImageObsidianSplit',
  'CardImagePulsarBurst',
  'CardImageRippleReveal',
  'CardImageRockCrack',
  'CardImageRollingShade',
  'CardImageShatterRebuild',
  'CardImageSkyTower',
  'CardImageStardustCoalescence',
  'CardImgBokeh',
  'CardImgDiag',
  'CardImgDoubleEdge',
  'CardImgFeather',
  'CardImgFocalWindow',
  'CardImgFocusRing',
  'CardImgMontage',
  'CardImgNarrative',
  'CardImgPearl',
  'CardImgSand',
  'CardImgSink',
  'CardImgStarCore',
  'CardImgVapor',
  'CardImgDarkroom',
  'CardImgFrost',
  'CardImgPerspective',
  'CardImgReversal',
  'CardImgStage',
  'CardImgSundial',
  'CardImgVault',
  'CardImgAmber',
  'CardImgDepthLadder',
  'CardImgFlipCard',
  'CardImgMorningMist',
  'CardImgSpinCard',
  'CardImgTidalDream',
  'CardImgWaterfall',
  'CardImgZen',
  'CardImgBeacon',
  'CardImgBook',
  'CardImgCrystal',
  'CardImgFallingLeaf',
  'CardImgFlyingStones',
  'CardImgFoldedFan',
  'CardImgPinhole',
  'CardImgRippleWave',
  'CardImgSplitFocus',
  'CardImgSteel',
  'CardImgTelescope',
  'CardImgTitanium',
  'CardImgTungsten',
  'CardImgVelvet',
  'CardImgVelvetDisplay',
  'CardImgWaxSeal',
  'CardImgCarousel',
  'CardImgCloudTide',
  'CardImgDolly',
  'CardImgDust',
  'CardImgFlip',
  'CardImgFloat',
  'CardImgFlower',
  'CardImgForestMist',
  'CardImgInk',
  'CardImgMaglev',
  'CardImgMistReveal',
  'CardImgNebulaBreath',
  'CardImgPolarize',
  'CardImgPrism',
  'CardImgRain',
  'CardImgRipple',
  'CardImgRiver',
  'CardImgTwinWings',
  'CardImgDeepPulse',
  'CardImgFilm',
  'CardImgGravity',
  'CardImgHydraulic',
  'CardImgStatic',
  'CardImgStripes',
  'CardImgAurora',
  'CardImgCube',
  'CardImgDeepSea',
  'CardImgFog',
  'CardImgGalaxy',
  'CardImgMirror',
  'CardImgThermal',
  'CardImgBloom',
  'CardImgCrosshair',
  'CardImgCurtain',
  'CardImgDepth',
  'CardImgGilded',
  'CardImgMercury',
  'CardImgProjector',
  'CardImgTyndall',
  'CardImgAbyss',
  'CardImgAperture',
  'CardImgDeconstruct',
  'CardImgFocusShift',
  'CardImgParallax',
  'CardImgRift',
  'CardImgStardust',
  'CardImgVortex',
  'CardImgWireless',
  'Card3DFlipGallery',
  'Card3dHologram',
  'Card3dHouse',
  'Card3dTome',
  'CardTextAurora',
  'CardTextBioluminescent',
  'CardTextBlur',
  'CardTextBoiling',
  'CardTextChladni',
  'CardTextCinematic',
  'CardTextCorona',
  'CardTextCrystal',
  'CardTextCyber',
  'CardTextDomino',
  'CardTextFirework',
  'CardTextFluid3D',
  'CardTextGalaxy',
  'CardTextHologram',
  'CardTextHolographic',
  'CardTextInk',
  'CardTextLaser',
  'CardTextMagnetic',
  'CardTextMetal',
  'CardTextMoonlightEmbroider',
  'CardTextMycelium',
  'CardTextNeonCrack',
  'CardTextNeonSign',
  'CardTextOrganic',
  'CardTextOrigami',
  'CardTextParticleStorm',
  'CardTextPrismDispersion',
  'CardTextQuantumCollapse',
  'CardTextSeismograph',
  'CardTextSpikes',
  'CardTextSweep',
  'CardTextSynapse',
  'CardTextTsunami3D',
  'CardTextVoidRebirth',
  'CardTextWaterWave',
  'Card3dCube',
  'Card3dEntanglement',
  'Card3dSpectrum',
  'Card3dWormhole',
  'CardTimeOrbitFlip',

  'CardTimeGravity',
  'CardTimeKaleidoscope',
  'CardTimeMagnet',
  'CardTimeOrbitFlip',
  'CardAbstractGeometry',
  'CardTimeAether',
  'CardTimeBeat',
  'CardTimeBlackHole',
  'CardTimeBlueprint',
  'CardTimeBook',
  'CardTimeCascade',
  'CardTimeCinematic',
  'CardTimeCosmic',
  'CardTimeCosmicRhythm',
  'CardTimeCubeFlip',
  'CardTimeDepthParallax',
  'CardTimeDiagonal',
  'CardTimeDimensionFold',
  'CardTimeDrawer',
  'CardTimeDust',
  'CardTimeElastic',
  'CardTimeEpicenter',
  'CardTimeEqualizer',
  'CardTimeForge',
  'CardTimeGravitonSling',
  'CardTimeHologram',
  'CardTimeLens',
  'CardTimeLuminous',
  'CardTimeLuxeDrop',
  'CardTimeLuxury',
  'CardTimeMagicFlip',
  'CardTimeMaterialAwakening',
  'CardTimeMirage',
  'CardTimeNeon',
  'CardTimePageFlip',
  'CardTimePerspective',
  'CardTimeQuantumLeap',
  'CardTimeRasterize',
  'CardTimeRevelation',
  'CardTimeRipple',
  'CardTimeShatter',
  'CardTimeShimmer',
  'CardTimeSingularity',
  'CardTimeSolarFlare',
  'CardTimeSpacetimeFissure',
  'CardTimeSpatialDepth',
  'CardTimeSpiral',
  'CardTimeStellarOrbit',
  'CardTimeTeam',
  'CardTimeTemporal',
  'CardTimeTheatre',
  'CardTimeTrust',
  'CardTimeTypography',
  'CardTimeVoyage',
  'CardTimeWave',
  /!*'Card3DFlipGallery',
  'CardAbstractGeometry',*!/
  'CardAllInOne',
  'CardAudioWave',
  'CardAurora',
  'CardAuroraWave',
  'CardBioluminescence',
  'CardCatalyst',
  'CardCelestial',
  'CardCircuit',
  'CardCrystal',
  'CardCyberspace',
  'CardDNA',
  'CardDataStream',
  'CardEclipse',
  'CardFadeBlur',
  'CardFadeInOut',
  'CardFireflies',
  'CardFrost',
  'CardFullCombo',
  'CardFusion',
  'CardGalaxy',
  'CardGlacier',
  'CardGlitch',
  'CardGradientWave',
  'CardGravity',
  'CardGravity2',
  'CardHologram',
  'CardHolographic',
  'CardInfinity',
  'CardKaleidoscope',
  'CardLightning',
  'CardLiquid',
  'CardLiquidMetal',
  'CardMagma',
  'CardMatrix',
  'CardMeteor',
  'CardMorph',
  'CardMosaic',
  'CardNebula',
  'CardNeon',
  'CardNeonCircuit',
  'CardNineCombo',
  'CardParticle',
  'CardPhantom',
  'CardPlasma',
  'CardPortal',
  'CardPrism',
  'CardQuantum',
  'CardRipple',
  'CardRotate',
  'CardRotateScaleTranslate',
  'CardScale',
  'CardShatter',
  'CardSixCombo',
  'CardSlideEdge',
  'CardSolarSystem',
  'CardSphere',
  'CardSupernova',
  'CardSwipe',
  'CardTornado',
  'CardTranslate',
  'CardTranslateRotateScale',
  'CardVoid',
  'CardVortex',
  'CardWave'
]*/
const dirNameList = []
const dirNameList1 = []

const cardComponents = computed(() => {
  // 处理 card-list 目录组件
  const listComponents = Object.entries(modules)
    .map(([path, module]) => {
      const match = path.match(/\/card-list\/([^/]+)\/[^/]+\.vue$/)
      const dirName = match?.[1] || ''
      const name = dirName
        .replace(/Card/g, '')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^/, '')
        .trim()

      return {
        dirName,
        name: name || dirName,
        path,
        // 懒加载模式：使用 defineAsyncComponent
        component: LAZY_MODE ?
          defineAsyncComponent(() => import(/* @vite-ignore */ path)) :
          (module as any)?.default || null,
        type: 'card-list'
      }
    })
    .filter((item) => {
      if (!dirNameList.includes(item.dirName) && item.component !== null) {
        dirNameList1.push(item.dirName)
        // console.log(dirNameList1)
      }

      return !dirNameList.includes(item.dirName) && item.component !== null
    })

  // 处理 card-time 目录组件
  const timeComponents = Object.entries(modulesTime)
    .map(([path, module]) => {
      const match = path.match(/\/card-time\/([^/]+)\/[^/]+\.vue$/)
      const dirName = match?.[1] || ''
      const name = dirName
        .replace(/Card/g, '')
        .replace(/Time/g, ' Time')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^/, '')
        .trim()

      return {
        dirName,
        name: name || dirName,
        path,
        // 懒加载模式：使用 defineAsyncComponent
        component: LAZY_MODE ?
          defineAsyncComponent(() => import(/* @vite-ignore */ path)) :
          (module as any)?.default || null,
        type: 'card-time'
      }
    })
    .filter((item) => {
      if (!dirNameList.includes(item.dirName) && item.component !== null) {
        dirNameList1.push(item.dirName)
        // console.log(dirNameList1)
      }
      return !dirNameList.includes(item.dirName) && item.component !== null
    })

  // 处理 card-text 目录组件
  const textComponents = Object.entries(modulesText)
    .map(([path, module]) => {
      const match = path.match(/\/card-text\/([^/]+)\/[^/]+\.vue$/)
      const dirName = match?.[1] || ''
      const name = dirName
        .replace(/CardText/g, '文字')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^/, '')
        .trim()

      return {
        dirName,
        name: name || dirName,
        path,
        // 懒加载模式：使用 defineAsyncComponent
        component: LAZY_MODE ?
          defineAsyncComponent(() => import(/* @vite-ignore */ path)) :
          (module as any)?.default || null,
        type: 'card-text'
      }
    })
    .filter((item) => {
      if (!dirNameList.includes(item.dirName) && item.component !== null) {
        dirNameList1.push(item.dirName)
      }
      return !dirNameList.includes(item.dirName) && item.component !== null
    })

  // 处理 card-3d 目录组件
  const d3dComponents = Object.entries(modules3d)
    .map(([path, module]) => {
      const match = path.match(/\/card-3d\/([^/]+)\/[^/]+\.vue$/)
      const dirName = match?.[1] || ''
      const name = dirName
        .replace(/Card/g, '')
        .replace(/3d/g, ' 3D')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^/, '')
        .trim()

      return {
        dirName,
        name: name || dirName,
        path,
        // 懒加载模式：使用 defineAsyncComponent
        component: LAZY_MODE ?
          defineAsyncComponent(() => import(/* @vite-ignore */ path)) :
          (module as any)?.default || null,
        type: 'card-3d'
      }
    })
    .filter((item) => {
      if (!dirNameList.includes(item.dirName) && item.component !== null) {
        dirNameList1.push(item.dirName)
      }
      return !dirNameList.includes(item.dirName) && item.component !== null
    })

  // 处理 card-img 目录组件
  const imgComponents = Object.entries(modulesImg)
    .map(([path, module]) => {
      const match = path.match(/\/card-img\/([^/]+)\/[^/]+\.vue$/)
      const dirName = match?.[1] || ''
      const name = dirName
        .replace(/Card/g, '')
        .replace(/Img/g, ' Image')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^/, '')
        .trim()

      return {
        dirName,
        name: name || dirName,
        path,
        // 懒加载模式：使用 defineAsyncComponent
        component: LAZY_MODE ?
          defineAsyncComponent(() => import(/* @vite-ignore */ path)) :
          (module as any)?.default || null,
        type: 'card-img'
      }
    })
    .filter((item) => {
      if (!dirNameList.includes(item.dirName) && item.component !== null) {
        dirNameList1.push(item.dirName)
      }
      return !dirNameList.includes(item.dirName) && item.component !== null
    })

  // 处理 card-image 目录组件
  const imageComponents = Object.entries(modulesImage)
    .map(([path, module]) => {
      const match = path.match(/\/card-image\/([^/]+)\/[^/]+\.vue$/)
      const dirName = match?.[1] || ''
      const name = dirName
        .replace(/Card/g, '')
        .replace(/Image/g, ' Image')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^/, '')
        .trim()

      return {
        dirName,
        name: name || dirName,
        path,
        // 懒加载模式：使用 defineAsyncComponent
        component: LAZY_MODE ?
          defineAsyncComponent(() => import(/* @vite-ignore */ path)) :
          (module as any)?.default || null,
        type: 'card-image'
      }
    })
    .filter((item) => {
      if (!dirNameList.includes(item.dirName) && item.component !== null) {
        dirNameList1.push(item.dirName)
      }
      return !dirNameList.includes(item.dirName) && item.component !== null
    })
  console.log([...listComponents].map((item) => item.dirName))
  console.log([...timeComponents].map((item) => item.dirName))
  console.log([...textComponents].map((item) => item.dirName))
  console.log([...d3dComponents].map((item) => item.dirName))

  console.log([...imgComponents].map((item) => item.dirName))
  console.log([...imageComponents].map((item) => item.dirName))
  // 合并数组：card-image 组件在最前，card-img 其次，card-3d 再次，card-time 再次，card-list 最后
  return [
    ...imageComponents,
    ...imgComponents,
    ...textComponents,
    ...d3dComponents,
    ...timeComponents,
    ...listComponents
  ]
})

// ==================== 分类筛选后的组件列表 ====================
const filteredComponents = computed(() => {
  if (activeCategory.value === 'all') {
    return cardComponents.value
  }
  if (activeCategory.value === 'favorite') {
    return cardComponents.value.filter((comp) => isFavorite(comp.dirName))
  }
  return cardComponents.value.filter((comp) => comp.type === activeCategory.value)
})

// ==================== 模板引用 ====================
const setPageRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) {
    pageRefs.value.set(index, element as HTMLElement)
  } else {
    pageRefs.value.delete(index)
  }
}

// ==================== Intersection Observer ====================
const initIntersectionObserver = () => {
  if (!LAZY_MODE) {
    // 非懒加载模式：预加载前 N 个
    filteredComponents.value.forEach((_, index) => {
      if (index < PRELOAD_COUNT) {
        visibleCards.value.add(index)
      }
    })
    return
  }

  // 等待一小段时间确保 DOM 已更新
  setTimeout(() => {
    // 重新从 DOM 中获取所有页面元素
    const pageEls = document.querySelectorAll('.page:not(.page1):not(.page-footer)')
    pageEls.forEach((el, index) => {
      el.setAttribute('data-index', String(index))
      observer?.observe(el)
    })

    // 触发初始可见性检查
    handleScroll()
  }, 50)

  observer = new IntersectionObserver(
    (entries) => {
      if (!visibleCards.value) {
        return
      } // HMR 保护
      entries.forEach((entry) => {
        const index = parseInt((entry.target as HTMLElement).dataset.index || '0')

        if (entry.isIntersecting) {
          // 进入视口：加载组件
          visibleCards.value?.add(index)
          // 预加载下一个
          for (let i = 1; i <= VISIBLE_BUFFER; i++) {
            const nextIndex = index + i
            if (nextIndex < filteredComponents.value.length) {
              visibleCards.value?.add(nextIndex)
            }
          }
        } else {
          // 离开视口较远时卸载（节省内存）
          const viewportHeight = window.innerHeight
          const rect = entry.boundingClientRect
          if (rect.top < -viewportHeight * 2 || rect.top > viewportHeight * 3) {
            visibleCards.value.delete(index)
          }
        }
      })
    },
    { root: null,
      rootMargin: '0px 0px -20% 0px', // 视口下方 20% 开始加载
      threshold: 0
    },
  )
}

// ==================== 滚动监听（备用） ====================
const handleScroll = () => {
  if (!LAZY_MODE) {
    return
  }

  const viewportHeight = window.innerHeight
  const scrollTop = window.scrollY

  // 直接从 DOM 获取所有卡片页面元素
  const pageEls = document.querySelectorAll('.page:not(.page1):not(.page-footer)')
  pageEls.forEach((el, index) => {
    const rect = el.getBoundingClientRect()
    const pageTop = rect.top + scrollTop

    // 在视口范围内或预加载范围内
    const inView = rect.top < viewportHeight && rect.bottom > 0
    const inPreload = pageTop < scrollTop + viewportHeight * (1 + PRELOAD_COUNT * 0.5)

    if (inView || inPreload) {
      visibleCards.value.add(index)
    }
  })
}

// ==================== 生命周期 ====================
onMounted(() => {
  // 确保 visibleCards 初始化
  if (!visibleCards.value) {
    visibleCards.value = new Set<number>()
  }
  if (!pageRefs.value) {
    pageRefs.value = new Map()
  }

  // 初始化可见性
  if (!LAZY_MODE) {
    filteredComponents.value.forEach((_, index) => {
      if (index < PRELOAD_COUNT) {
        visibleCards.value?.add(index)
      }
    })
  } else {
    // 等待 DOM 渲染后初始化 Observer
    setTimeout(initIntersectionObserver, 100)
    window.addEventListener('scroll', handleScroll, { passive: true })
  }
})

onUnmounted(() => {
  observer?.disconnect()
  window.removeEventListener('scroll', handleScroll)
})

// ==================== 分类切换时重置可见性 ====================
watch(activeCategory, () => {
  // 切换分类时清空可见卡片和 pageRefs
  visibleCards.value.clear()
  pageRefs.value.clear()
  // 断开旧的 observer
  observer?.disconnect()
  observer = null

  // 等待 DOM 更新后再重新初始化 Observer
  nextTick(() => {
    if (LAZY_MODE) {
      initIntersectionObserver()
    }
  })
})
</script>

<template>
  <div class="web-list">
    <!-- 顶部悬浮分类选项卡 -->
    <div class="category-tabs">
      <button
        v-for="cat in categories"
        :key="cat.key"
        :class="['tab-btn', { active: activeCategory === cat.key }]"
        @click="activeCategory = cat.key"
      >
        {{ cat.label }}
      </button>
      <button class="tab-btn generate-btn" @click="router.push('/web-ai')">去生成方案</button>
    </div>

    <div class="page page1">
      <h1 class="page-title">Creative Cards Gallery</h1>
      <p class="page-desc">Scroll down to explore interactive card animations</p>
      <div>数量：{{ filteredComponents.length }}</div>
      <div class="scroll-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <div
      v-for="(cardInfo, index) in filteredComponents"
      :key="cardInfo.name"
      :ref="(el) => setPageRef(el, index)"
      :class="['page', `page-card-${index + 1}`]"
    >
      <!-- 懒加载：只在进入视口时渲染组件 -->
      <component :is="cardInfo.component" v-if="visibleCards.has(index)" v-bind="propsMap[index]" />
      <div class="card-info position-absolute top-10px left-100px z-99999">
        <span class="card-name">{{ cardInfo.dirName }}</span>
        <!-- 选择按钮 -->
        <button
          :class="['select-btn', { active: isSelected(cardInfo.dirName) }]"
          @click="toggleSelect(cardInfo.dirName, cardInfo.name, cardInfo.path, cardInfo.type)"
          :title="isSelected(cardInfo.dirName) ? '已选中，点击取消' : '点击选择组件'"
        >
          {{ isSelected(cardInfo.dirName) ? '☑️' : '⬜' }}
        </button>
        <!-- 已选择时显示模块标签 -->
        <span
          v-if="isSelected(cardInfo.dirName) && getComponentModulePosition(cardInfo.dirName)"
          class="module-tag"
        >
          {{ modulePositions.find(m => m.key === getComponentModulePosition(cardInfo.dirName))?.icon }}
          {{ modulePositions.find(m => m.key === getComponentModulePosition(cardInfo.dirName))?.label }}
        </span>
        <!-- 收藏按钮 -->
        <button
          :class="['favorite-btn', { active: isFavorite(cardInfo.dirName) }]"
          @click="toggleFavorite(cardInfo.dirName)"
        >
          {{ isFavorite(cardInfo.dirName) ? '❤️' : '🤍' }}
        </button>
        <!-- 为已选组件选择模块位置 -->
        <button
          v-if="isSelected(cardInfo.dirName)"
          class="module-btn"
          @click="openModuleSelector({
            dirName: cardInfo.dirName,
            name: cardInfo.name,
            path: cardInfo.path,
            type: cardInfo.type,
            selected: true,
            modulePosition: getComponentModulePosition(cardInfo.dirName)
          })"
          title="选择模块位置"
        >
          📦
        </button>
      </div>
    </div>

    <div class="page page-footer">
      <h1 class="page-title">That's All</h1>
      <p class="page-desc">Thanks for watching</p>
    </div>

    <!-- 已选组件预览面板 -->
    <div v-if="selectedComponents.length > 0" class="selection-panel">
      <div class="selection-header">

        <div class="header-actions">
          <!-- 模块设置按钮 -->
          <button class="selection-module-btn" @click="openModuleSelectorForConfig" title="配置模块位置">
            ⚙️ 模块配置
          </button>
          <!-- 企业信息按钮 -->
          <button
            :class="['selection-enterprise-btn', { active: hasEnterpriseInfo }]"
            @click="openEnterpriseModal"
            :title="hasEnterpriseInfo ? '已填写企业信息' : '填写企业信息'"
          >
            {{ hasEnterpriseInfo ? '🏢 已填写' : '🏢 企业信息' }}
          </button>
          <!-- 复制方案按钮 -->
          <button class="selection-copy-btn" @click="copyPlanToClipboard">
            {{ copySuccess ? '✅ 已复制' : '📋 复制方案' }}
          </button>
        </div>
      </div>
      <!-- 已选组件标题 -->
      <div class="selection-title">
        <div class="title-content">
          <span class="title-icon">📋</span>
          <span class="title-text">已选组件</span>
          <span class="title-count">{{ selectedComponents.length }}</span>
        </div>
        <div class="title-actions">
          <button class="title-reset" @click="resetSelectedComponents" title="清空已选组件">
            🔄
          </button>
          <button class="title-collapse" @click="toggleSelectionList" :title="selectionListCollapsed ? '展开' : '收起'">
            {{ selectionListCollapsed ? '▼' : '▲' }}
          </button>
        </div>
      </div>
      <div class="selection-list" :class="{ collapsed: selectionListCollapsed }">
        <div
          v-for="pos in modulePositions.filter(p => getComponentsByPosition(p.key).length > 0)"
          :key="pos.key"
          class="selection-module-group"
        >
          <div class="selection-module-header">
            <span>{{ pos.icon }}</span>
            <span>{{ pos.label }}</span>
            <span class="count">({{ getComponentsByPosition(pos.key).length }})</span>
          </div>
          <div class="selection-module-items">
            <div
              v-for="comp in getComponentsByPosition(pos.key)"
              :key="comp.dirName"
              class="selection-item"
            >
              <span class="item-name">{{ comp.name }}</span>
              <button class="item-remove" @click="toggleSelect(comp.dirName, comp.name, comp.path, comp.type)">×</button>
            </div>
          </div>
        </div>
        <!-- 未分配模块的组件 -->
        <div
          v-if="selectedComponents.filter(c => !c.modulePosition).length > 0"
          class="selection-module-group unassigned"
        >
          <div class="selection-module-header">
            <span>⚠️</span>
            <span>未分配模块</span>
            <span class="count">({{ selectedComponents.filter(c => !c.modulePosition).length }})</span>
          </div>
          <div class="selection-module-items">
            <div
              v-for="comp in selectedComponents.filter(c => !c.modulePosition)"
              :key="comp.dirName"
              class="selection-item"
              @click="openModuleSelector(comp)"
            >
              <span class="item-name">{{ comp.name }}</span>
              <button class="item-add" @click.stop="openModuleSelector(comp)">+</button>
              <button class="item-remove" @click.stop="toggleSelect(comp.dirName, comp.name, comp.path, comp.type)">×</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模块选择器弹窗 -->
    <Teleport to="body">
      <div
        v-if="showModuleSelector"
        class="module-selector-overlay"
        @click.self="cancelModuleSelection"
      >
        <div class="module-selector">
          <div class="module-selector-header">
            <h4>{{ isConfigMode ? '⚙️ 模块配置' : '选择模块位置' }}</h4>
            <p>{{ isConfigMode ? '管理模块位置，点击模块可查看已分配的组件' : '为「' + currentSelectingComp?.name + '」选择放置位置' }}</p>
            <button class="close-btn" @click="cancelModuleSelection">×</button>
          </div>
          <div class="module-position-grid">
            <button
              v-for="pos in modulePositions"
              :key="pos.key"
              :class="['module-pos-btn', { selected: getComponentsByPosition(pos.key).length > 0 }]"
              @click="isConfigMode ? null : selectModulePosition(pos.key)"
            >
              <span class="pos-icon">{{ pos.icon }}</span>
              <span class="pos-label">{{ pos.label }}</span>
              <span class="pos-desc">{{ pos.desc }}</span>
              <span v-if="getComponentsByPosition(pos.key).length > 0" class="pos-used-by">
                {{ getComponentsByPosition(pos.key).length }}个组件
              </span>
              <span v-else class="pos-empty">暂无组件</span>
            </button>
          </div>
          <div class="module-selector-footer">
            <button class="btn btn-ghost" @click="openModuleEditor">⚙️ 完整配置</button>
            <button class="btn btn-primary" @click="cancelModuleSelection">✓ 关闭</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 全屏模块配置编辑器 -->
    <Teleport to="body">
      <div
        v-if="showModuleEditor"
        class="fullscreen-modal-overlay"
        @click.self="closeModuleEditor"
      >
        <div class="fullscreen-modal">
          <div class="modal-header">
            <div class="modal-title">
              <h3>⚙️ 模块配置</h3>
              <p>配置模块位置，可增删改。修改后自动保存到浏览器。</p>
            </div>
            <button class="modal-close" @click="closeModuleEditor">×</button>
          </div>

          <div class="modal-body">
            <div class="module-editor-list">
              <div
                v-for="(pos, index) in editingPositions"
                :key="pos.key + index"
                class="module-editor-row"
              >
                <input v-model="pos.icon" class="edit-input" placeholder="图标" />
                <input v-model="pos.key" class="edit-input" placeholder="key" />
                <input v-model="pos.label" class="edit-input" placeholder="名称" />
                <input v-model="pos.desc" class="edit-input edit-input-wide" placeholder="描述" />
                <button class="remove-btn" @click="removeModulePosition(index)">🗑️</button>
              </div>
            </div>
            <button class="btn btn-ghost mt-4" @click="addModulePosition">+ 添加模块</button>
          </div>

          <div class="modal-footer">
            <button class="btn btn-ghost" @click="resetModuleConfig">恢复默认</button>
            <button class="btn btn-primary" @click="saveModuleConfig">💾 保存配置</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 企业信息弹窗 -->
    <Teleport to="body">
      <div
        v-if="showEnterpriseModal"
        class="enterprise-modal-overlay"
        @click.self="closeEnterpriseModal"
      >
        <div class="enterprise-modal">
          <div class="enterprise-modal-header">
            <div class="modal-title">
              <h3>🏢 企业信息</h3>
              <p>填写企业信息，生成更精准的网站方案</p>
            </div>
            <button class="close-btn" @click="closeEnterpriseModal">×</button>
          </div>
          <div class="enterprise-modal-body">
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
                <div class="color-picker-wrapper">
                  <div class="color-input-row">
                    <input
                      v-model="enterpriseInfo.mainColors"
                      type="text"
                      class="color-text-input"
                      placeholder="输入颜色值或选择预设"
                    />
                    <button
                      class="color-picker-btn"
                      :style="{ background: enterpriseInfo.mainColors || '#667eea' }"
                      @click="toggleColorPicker"
                    >
                      <span class="picker-icon">🎨</span>
                    </button>
                  </div>

                  <!-- 颜色选择器弹出层 -->
                  <div v-if="showColorPicker" class="color-picker-popup">
                    <div class="mode-tabs">
                      <button
                        :class="['mode-tab', { active: colorMode === 'solid' }]"
                        @click="colorMode = 'solid'"
                      >
                        <span class="mode-icon">●</span>
                        单色
                      </button>
                      <button
                        :class="['mode-tab', { active: colorMode === 'gradient' }]"
                        @click="colorMode = 'gradient'"
                      >
                        <span class="mode-icon gradient-icon"></span>
                        渐变
                      </button>
                    </div>

                    <!-- 单色模式 -->
                    <div v-if="colorMode === 'solid'" class="mode-content">
                      <div class="color-preset-grid">
                        <button
                          v-for="preset in solidColorPresets"
                          :key="preset.value"
                          :class="['color-preset-btn', { active: singleColor === preset.value }]"
                          :style="{ background: preset.value }"
                          :title="preset.name"
                          @click="selectSolidPreset(preset.value)"
                        ></button>
                      </div>
                      <div class="custom-color-row">
                        <span class="section-label">自定义</span>
                        <input
                          v-model="singleColor"
                          type="color"
                          class="color-input"
                          @input="updateColorFromPicker"
                        />
                        <input
                          v-model="singleColor"
                          type="text"
                          class="color-text-input-sm"
                          placeholder="#0066FF"
                          @input="updateColorFromPicker"
                        />
                      </div>
                    </div>

                    <!-- 渐变模式 -->
                    <div v-if="colorMode === 'gradient'" class="mode-content">
                      <div class="gradient-presets">
                        <button
                          v-for="preset in gradientPresets"
                          :key="preset.value"
                          :class="[
                            'gradient-preset-btn',
                            { active: enterpriseInfo.mainColors === preset.value }
                          ]"
                          :style="{ background: preset.value }"
                          :title="preset.name"
                          @click="enterpriseInfo.mainColors = preset.value"
                        ></button>
                      </div>
                      <div class="gradient-editor">
                        <div class="gradient-editor-row">
                          <span class="gradient-label">起始色</span>
                          <input
                            v-model="gradientStart"
                            type="color"
                            class="color-input-sm"
                            @input="applyGradient"
                          />
                          <input
                            v-model="gradientStart"
                            type="text"
                            class="color-text-sm"
                            @input="applyGradient"
                          />
                        </div>
                        <div class="gradient-editor-row">
                          <span class="gradient-label">结束色</span>
                          <input
                            v-model="gradientEnd"
                            type="color"
                            class="color-input-sm"
                            @input="applyGradient"
                          />
                          <input
                            v-model="gradientEnd"
                            type="text"
                            class="color-text-sm"
                            @input="applyGradient"
                          />
                        </div>
                        <div class="gradient-editor-row">
                          <span class="gradient-label">角度</span>
                          <input
                            v-model.number="gradientAngle"
                            type="range"
                            min="0"
                            max="360"
                            class="angle-slider"
                            @input="applyGradient"
                          />
                          <span class="angle-value">{{ gradientAngle }}°</span>
                        </div>
                      </div>
                    </div>

                    <button class="close-picker-btn" @click="showColorPicker = false">×</button>
                  </div>
                </div>
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

              <div class="form-group form-group-full">
                <label>网站设计理念</label>
                <textarea
                  v-model="enterpriseInfo.designPhilosophy"
                  rows="3"
                  placeholder="描述网站的设计风格、核心特色、用户体验追求等..."
                ></textarea>
              </div>
            </div>

            <!-- 参考示例 -->
            <div class="form-group form-group-full">
              <div class="reference-header" @click="showReferenceExample = !showReferenceExample">
                <label class="reference-title">
                  <span class="expand-icon" :class="{ expanded: showReferenceExample }">▶</span>
                  参考示例
                </label>
                <span class="expand-hint">{{ showReferenceExample ? '点击收起' : '点击展开' }}</span>
              </div>
              <div v-show="showReferenceExample" class="reference-example">
                <div class="ref-item">
                  <span class="ref-label">企业名称:</span>
                  <span class="ref-value">深圳AI网络有限公司</span>
                </div>
                <div class="ref-item">
                  <span class="ref-label">所属行业:</span>
                  <span class="ref-value">科技/互联网</span>
                </div>
                <div class="ref-item">
                  <span class="ref-label">企业简介:</span>
                  <span class="ref-value"
                    >深圳AI网络有限公司是一家专注于前沿人工智能技术研发与商业应用的高科技企业。公司致力于为全球企业提供高效、智能的数字化转型方案，核心业务涵盖智能客服系统、企业级大数据分析平台及自动化营销工具。</span
                  >
                </div>
                <div class="ref-item">
                  <span class="ref-label">目标受众:</span>
                  <span class="ref-value"
                    >寻求数字化转型的中大型企业管理者（CEO/CTO）、互联网科技公司、电商品牌方</span
                  >
                </div>
                <div class="ref-item">
                  <span class="ref-label">品牌主色:</span>
                  <span class="ref-value">深空蓝（#0F172A）搭配 电光紫（#7C3AED）</span>
                </div>
                <div class="ref-item">
                  <span class="ref-label">网站类型:</span>
                  <span class="ref-value">企业官网</span>
                </div>
                <div class="ref-item">
                  <span class="ref-label">网站设计理念:</span>
                  <span class="ref-value">
                    采用"未来极简主义"风格。在深空蓝的沉浸式背景下，运用电光紫的线性渐变与微发光效果勾勒核心元素，营造高端、神秘的科技氛围。布局上强调"呼吸感"与逻辑层级，大量留白以突出核心数据与业务价值。</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="enterprise-modal-footer">
            <button class="btn btn-ghost" @click="closeEnterpriseModal">取消</button>
            <button class="btn btn-primary" @click="closeEnterpriseModal">💾 保存</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 复制到 meoo AI 弹层 -->
    <Teleport to="body">
      <div
        v-if="showCopyModal"
        class="copy-modal-overlay"
        @click.self="closeCopyModal"
      >
        <div class="copy-modal">
          <div class="copy-modal-header">
            <div class="modal-title">
              <h3>📋 复制到 meoo AI</h3>
              <p>直接编辑内容，然后点击「复制完整信息」粘贴到 meoo AI</p>
            </div>
            <button class="close-btn" @click="closeCopyModal">×</button>
          </div>

          <!-- 摘要信息 -->
          <div class="copy-summary">
            <div class="summary-item">
              <span class="summary-label">已选组件</span>
              <span class="summary-value">{{ selectedComponents.length }}个</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">企业名称</span>
              <span class="summary-value">{{ enterpriseInfo.name || '未填写' }}</span>
            </div>
          </div>

          <!-- 错误提示 -->
          <div v-if="errorMessage" class="copy-error">
            <p>{{ errorMessage }}</p>
          </div>

          <!-- 可编辑内容 -->
          <div class="copy-content-wrapper">
            <h4>📝 可编辑内容（直接修改后再复制）</h4>
            <textarea
              v-model="editablePlanContent"
              class="copy-textarea"
              placeholder="编辑内容..."
              rows="20"
            ></textarea>
          </div>

          <!-- 操作按钮 -->
          <div class="copy-modal-footer">
            <button class="btn btn-ghost" @click="closeCopyModal">取消</button>
            <button class="btn btn-primary copy-btn" @click="copyContent">
              {{ copySuccess ? '✅ 已复制' : '📋 复制完整信息' }}
            </button>
            <button class="btn btn-primary meoo-btn" @click="OpenMeoo">
              去 meoo AI
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 错误提示弹窗 -->
    <Teleport to="body">
      <Transition name="error-fade">
        <div v-if="showErrorModal" class="error-toast">
          <div class="error-toast-content">
            <span class="error-icon">{{ errorModalTitle.includes('❌') ? '❌' : '⚠️' }}</span>
            <div class="error-text">
              <strong>{{ errorModalTitle }}</strong>
              <p>{{ errorModalMessage }}</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
// ==================== 布局样式 ====================
.web-list {
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;

  // ==================== 顶部悬浮分类选项卡 ====================
  .category-tabs {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    padding: 8px 16px;
    background: rgba(15, 23, 42, 0.9);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50px;
    z-index: 9999;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

    .tab-btn {
      padding: 8px 18px;
      background: transparent;
      border: none;
      border-radius: 25px;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;

      &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
      }

      &.active {
        color: #fff;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }

      &.generate-btn {
        color: #fff;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        font-weight: 600;

        &:hover {
          background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
          transform: scale(1.05);
        }
      }
    }
  }

  // ==================== 卡片信息 ====================
  .card-info {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #fff;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);

    .card-name {
      font-size: 0.9rem;
      font-weight: 600;
      background: rgba(0, 0, 0, 0.4);
      padding: 4px 12px;
      border-radius: 20px;
      backdrop-filter: blur(4px);
    }

    .select-btn {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
      cursor: pointer;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

      &:hover {
        transform: scale(1.15);
        background: rgba(255, 255, 255, 0.2);
      }

      &.active {
        background: rgba(102, 126, 234, 0.4);
        box-shadow: 0 0 15px rgba(102, 126, 234, 0.5);
      }
    }

    .module-tag {
      font-size: 0.75rem;
      background: rgba(67, 233, 123, 0.3);
      padding: 4px 10px;
      border-radius: 20px;
      white-space: nowrap;
    }

    .module-btn {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 50%;
      background: rgba(67, 233, 123, 0.3);
      backdrop-filter: blur(4px);
      cursor: pointer;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

      &:hover {
        transform: scale(1.15);
        background: rgba(67, 233, 123, 0.5);
      }
    }

    .favorite-btn {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
      cursor: pointer;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

      &:hover {
        transform: scale(1.15);
        background: rgba(255, 255, 255, 0.2);
      }

      &.active {
        background: rgba(255, 0, 0, 0.3);
        box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
      }
    }
  }

  .page {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
  }

  .page-header {
    text-align: center;
    margin-bottom: 60px;

    .page-index {
      display: inline-block;
      font-size: 0.875rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.5);
      background: rgba(255, 255, 255, 0.1);
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 16px;
    }

    .page-title {
      font-size: 3rem;
      font-weight: 700;
      color: #fff;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      margin: 0 0 12px 0;
    }

    .page-desc {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.7);
      max-width: 500px;
    }
  }
}

// ==================== 页面背景 ====================
.page1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .page-title {
    color: #fff;
  }

  .page-desc {
    color: rgba(255, 255, 255, 0.8);
  }
}

.page-card-1 {
  background: linear-gradient(135deg, #77b3e3 0%, #4a90d9 100%);
}

.page-card-2 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.page-card-3 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.page-card-4 {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.page-card-5 {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.page-footer {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);

  .page-title {
    color: #fff;
  }

  .page-desc {
    color: rgba(255, 255, 255, 0.6);
  }
}

// ==================== 滚动指示器 ====================
.scroll-indicator {
  position: absolute;
  bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  span {
    width: 30px;
    height: 30px;
    border-right: 3px solid #fff;
    border-bottom: 3px solid #fff;
    transform: rotate(45deg);
    animation: scrollBounce 1.5s ease-in-out infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
      opacity: 0.7;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
      opacity: 0.4;
    }
  }
}

@keyframes scrollBounce {
  0%,
  100% {
    transform: rotate(45deg) translateY(0);
    opacity: 1;
  }
  50% {
    transform: rotate(45deg) translateY(15px);
    opacity: 0.5;
  }
}

// ==================== 已选组件面板 ====================
.selection-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 380px;
  max-height: 60vh;
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  z-index: 9998;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 40px rgba(102, 126, 234, 0.1);
  overflow: hidden;
}

.selection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(102, 126, 234, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h3 {
    margin: 0;
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
  }

  .header-actions {
    display: flex;
    gap: 8px;
  }
}

.selection-enterprise-btn {
  padding: 2px 5px;
  background: rgba(67, 233, 123, 0.15);
  border: 1px solid rgba(67, 233, 123, 0.3);
  border-radius: 8px;
  color: #43e97b;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.05);
    background: rgba(67, 233, 123, 0.25);
    border-color: rgba(67, 233, 123, 0.5);
  }

  &.active {
    background: rgba(67, 233, 123, 0.25);
    box-shadow: 0 0 10px rgba(67, 233, 123, 0.3);
  }
}

.selection-module-btn {
  padding: 8px 14px;
  background: rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  color: #667eea;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.05);
    background: rgba(102, 126, 234, 0.25);
    border-color: rgba(102, 126, 234, 0.5);
  }
}

.selection-copy-btn {
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }
}

// 已选组件标题栏
.selection-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.08) 100%);
  border-bottom: 1px solid rgba(102, 126, 234, 0.15);

  .title-content {
    display: flex;
    align-items: center;
    gap: 10px;

    .title-icon {
      font-size: 1.2rem;
      animation: pulse-subtle 2s ease-in-out infinite;
    }

    .title-text {
      color: #e8eaff;
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .title-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 26px;
      height: 26px;
      padding: 0 8px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 13px;
      color: #fff;
      font-size: 0.8rem;
      font-weight: 700;
      box-shadow: 0 2px 10px rgba(102, 126, 234, 0.4);
    }
  }

  .title-actions {
    display: flex;
    gap: 8px;
  }

  .title-reset {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 107, 107, 0.1);
    border: 1px solid rgba(255, 107, 107, 0.2);
    border-radius: 8px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: rgba(255, 107, 107, 0.2);
      border-color: rgba(255, 107, 107, 0.4);
      transform: rotate(180deg);
    }
  }

  .title-collapse {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.7rem;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: rgba(102, 126, 234, 0.2);
      border-color: rgba(102, 126, 234, 0.3);
      color: #667eea;
    }
  }
}

@keyframes pulse-subtle {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.selection-list {
  max-height: calc(60vh - 70px);
  overflow-y: auto;
  padding: 12px;
  transition: all 0.3s ease;

  &.collapsed {
    max-height: 0;
    padding: 0 12px;
    overflow: hidden;
    opacity: 0;
  }
}

.selection-module-group {
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  overflow: hidden;

  &.unassigned {
    border: 1px dashed rgba(255, 200, 100, 0.4);
  }
}

.selection-module-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-bottom: 1px solid rgba(102, 126, 234, 0.2);

  span {
    color: #a8b8ff;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .count {
    margin-left: auto;
    color: rgba(255, 255, 255, 0.5);
    font-weight: normal;
    font-size: 0.8rem;
  }
}

.selection-module-items {
  padding: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selection-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .item-name {
    color: #fff;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .item-add {
    padding: 2px 6px;
    background: rgba(67, 233, 123, 0.2);
    border: none;
    border-radius: 4px;
    color: #43e97b;
    font-size: 0.75rem;
    cursor: pointer;

    &:hover {
      background: rgba(67, 233, 123, 0.4);
    }
  }

  .item-remove {
    padding: 2px 6px;
    background: rgba(255, 100, 100, 0.2);
    border: none;
    border-radius: 4px;
    color: #ff6b6b;
    font-size: 0.75rem;
    cursor: pointer;

    &:hover {
      background: rgba(255, 100, 100, 0.4);
    }
  }
}

// ==================== 模块选择器弹窗 ====================
.module-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  backdrop-filter: blur(8px);
}

.module-selector {
  background: linear-gradient(135deg, #1a1a2e 0%, #302b63 100%);
  border-radius: 20px;
  padding: 28px;
  max-width: 650px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.module-pos-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;

  &:hover {
    border-color: rgba(102, 126, 234, 0.5);
    background: rgba(102, 126, 234, 0.1);
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
  }

  .pos-icon {
    font-size: 2rem;
  }

  .pos-label {
    color: #fff;
    font-weight: 600;
    font-size: 0.95rem;
  }

  .pos-desc {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.8rem;
    line-height: 1.3;
  }

  .pos-used-by {
    margin-top: 6px;
    padding: 4px 8px;
    background: rgba(255, 100, 100, 0.15);
    border-radius: 6px;
    font-size: 0.7rem;
    color: #ff8888;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .pos-empty {
    margin-top: 6px;
    padding: 4px 8px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.4);
  }

  &.selected {
    border-color: rgba(67, 233, 123, 0.5);
    background: rgba(67, 233, 123, 0.08);
  }
}

.module-selector-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

// ==================== 企业信息弹窗 ====================
.enterprise-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  backdrop-filter: blur(8px);
}

.enterprise-modal {
  background: linear-gradient(135deg, #1a1a2e 0%, #302b63 100%);
  border-radius: 20px;
  max-width: 700px;
  width: 90%;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.enterprise-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 28px;
  background: rgba(102, 126, 234, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .modal-title {
    h3 {
      margin: 0 0 8px;
      color: #fff;
      font-size: 1.3rem;
      font-weight: 600;
    }

    p {
      margin: 0;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
    }
  }

  .close-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: #fff;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.enterprise-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
}

.enterprise-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 28px;
  background: rgba(255, 255, 255, 0.03);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

// ==================== 复制到 meoo AI 弹层 ====================
.copy-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  backdrop-filter: blur(12px);
  animation: fadeIn 0.2s ease-out;
}

.copy-modal {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-radius: 24px;
  width: 95%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 30px 100px rgba(0, 0, 0, 0.5),
    0 0 60px rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.copy-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: rgba(102, 126, 234, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .modal-title {
    h3 {
      color: #fff;
      font-size: 1.4rem;
      margin: 0 0 6px;
    }
    p {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.95rem;
      margin: 0;
    }
  }

  .close-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 12px;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    font-size: 1.5rem;
    transition: all 0.3s;

    &:hover {
      background: rgba(255, 100, 100, 0.3);
      color: #ff6b6b;
      transform: rotate(90deg);
    }
  }
}

.copy-summary {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 24px 32px;
  background: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

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

.copy-error {
  padding: 16px 32px;
  background: rgba(255, 100, 100, 0.15);
  border-bottom: 1px solid rgba(255, 100, 100, 0.2);

  p {
    color: #ff6b6b;
    margin: 0;
    font-size: 0.9rem;
  }
}

.copy-content-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;

  h4 {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.95rem;
    font-weight: 500;
    margin: 0 0 16px;
  }
}

.copy-textarea {
  width: 100%;
  min-height: 400px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: #e0e0e0;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.85rem;
  line-height: 1.6;
  resize: vertical;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
}

.copy-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 32px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.05);

  .copy-btn {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    color: #1a1a2e;
    font-weight: 600;

    &:hover {
      box-shadow: 0 5px 20px rgba(67, 233, 123, 0.4);
    }
  }

  .meoo-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin-left: 8px;
  }
}

// ==================== 错误提示弹窗 ====================
.error-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999999;
  background: linear-gradient(135deg, rgba(255, 80, 80, 0.95) 0%, rgba(220, 50, 50, 0.95) 100%);
  border-radius: 16px;
  padding: 16px 24px;
  box-shadow:
    0 10px 40px rgba(255, 80, 80, 0.4),
    0 0 20px rgba(255, 80, 80, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 400px;
  animation: toast-shake 0.5s ease-in-out;
}

.error-toast-content {
  display: flex;
  align-items: center;
  gap: 12px;

  .error-icon {
    font-size: 1.8rem;
    animation: shake 0.5s ease-in-out;
  }

  .error-text {
    color: #fff;

    strong {
      display: block;
      font-size: 1rem;
      margin-bottom: 4px;
    }

    p {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.9;
    }
  }
}

@keyframes toast-shake {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  20% { transform: translateX(-50%) translateY(-10px); }
  40% { transform: translateX(-50%) translateY(10px); }
  60% { transform: translateX(-50%) translateY(-5px); }
  80% { transform: translateX(-50%) translateY(5px); }
}

@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(-15deg); }
  40% { transform: rotate(15deg); }
  60% { transform: rotate(-10deg); }
  80% { transform: rotate(10deg); }
}

.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.3s ease;
}

.error-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.error-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

// 表单样式
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
    margin-bottom: 10px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    font-weight: 500;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: #fff;
    font-size: 0.95rem;
    transition: all 0.3s;

    &::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }

    &:focus {
      outline: none;
      border-color: rgba(102, 126, 234, 0.6);
      background: rgba(102, 126, 234, 0.06);
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    option {
      background: #1a1a2e;
      color: #fff;
    }
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }

  select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' fill-opacity='0.5' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    padding-right: 40px;
  }
}

// 颜色选择器
.color-picker-wrapper {
  position: relative;
}

.color-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.color-text-input {
  flex: 1;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
}

.color-picker-btn {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;

  .picker-icon {
    font-size: 1.1rem;
    filter: grayscale(1) brightness(2);
  }

  &:hover {
    transform: scale(1.05);
    border-color: rgba(255, 255, 255, 0.4);
  }
}

.color-picker-popup {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  padding: 16px;
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  z-index: 100;

  .close-picker-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 28px;
    height: 28px;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
    }
  }
}

.mode-tabs {
  display: flex;
  gap: 8px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  margin-bottom: 12px;
}

.mode-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;

  .mode-icon {
    font-size: 0.9rem;

    &.gradient-icon {
      display: inline-block;
      width: 14px;
      height: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 3px;
    }
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.8);
  }

  &.active {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
    color: #fff;
  }
}

.mode-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.color-preset-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.color-preset-btn {
  aspect-ratio: 1;
  border-radius: 6px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  &.active {
    border-color: #fff;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.5);
    transform: scale(1.1);
  }
}

.custom-color-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 8px;

  .section-label {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
    white-space: nowrap;
  }

  .color-text-input-sm {
    width: 80px;
    padding: 6px 10px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    color: #fff;
    font-size: 0.85rem;

    &:focus {
      outline: none;
      border-color: #667eea;
    }
  }
}

.color-input {
  width: 36px;
  height: 32px;
  padding: 2px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: transparent;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 4px;
  }
}

.gradient-presets {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.gradient-preset-btn {
  aspect-ratio: 1;
  border-radius: 6px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  &.active {
    border-color: #fff;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.5);
    transform: scale(1.1);
  }
}

.gradient-editor {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}

.gradient-editor-row {
  display: flex;
  align-items: center;
  gap: 10px;

  .gradient-label {
    width: 50px;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
  }

  .color-input-sm {
    width: 32px;
    height: 28px;
    padding: 2px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: transparent;

    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    &::-webkit-color-swatch {
      border: none;
      border-radius: 3px;
    }
  }

  .color-text-sm {
    width: 80px;
    padding: 4px 8px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    color: #fff;
    font-size: 0.8rem;

    &:focus {
      outline: none;
      border-color: #667eea;
    }
  }

  .angle-slider {
    flex: 1;
    height: 4px;
    -webkit-appearance: none;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      background: #667eea;
      border-radius: 50%;
      cursor: pointer;
    }
  }

  .angle-value {
    width: 40px;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.8);
  }
}

// 参考示例
.reference-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(102, 126, 234, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(102, 126, 234, 0.12);
  }

  .reference-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    color: #667eea;
    font-weight: 500;
  }

  .expand-icon {
    font-size: 0.75rem;
    color: #667eea;
    transition: transform 0.3s;

    &.expanded {
      transform: rotate(90deg);
    }
  }

  .expand-hint {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.4);
  }
}

.reference-example {
  margin-top: 12px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .ref-item {
    display: flex;
    gap: 12px;

    .ref-label {
      flex-shrink: 0;
      width: 100px;
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.85rem;
    }

    .ref-value {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.85rem;
      line-height: 1.5;
    }
  }
}

// 按钮样式
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;

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

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
    }
  }
}

// ==================== 全屏弹窗 ====================
.fullscreen-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  backdrop-filter: blur(12px);
  animation: fadeIn 0.2s ease-out;
}

.fullscreen-modal {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-radius: 24px;
  width: 95%;
  max-width: 950px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 30px 100px rgba(0, 0, 0, 0.5),
    0 0 60px rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: rgba(102, 126, 234, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .modal-title {
    h3 {
      color: #fff;
      font-size: 1.4rem;
      margin: 0 0 6px;
    }
    p {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.95rem;
      margin: 0;
    }
  }

  .modal-close {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 12px;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    font-size: 1.5rem;
    transition: all 0.3s;

    &:hover {
      background: rgba(255, 100, 100, 0.3);
      color: #ff6b6b;
      transform: rotate(90deg);
    }
  }
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 28px 32px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 32px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

// 编辑输入框样式
.edit-input {
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: #fff;
  font-size: 0.9rem;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.5);
    background: rgba(102, 126, 234, 0.1);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.35);
  }

  &.edit-input-full {
    flex: 1;
  }

  &.edit-input-wide {
    flex: 2;
    min-width: 200px;
  }
}

.mt-4 {
  margin-top: 16px;
}

// 模块编辑器列表
.module-editor-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.module-editor-row {
  display: flex;
  gap: 10px;
  align-items: center;

  .edit-input {
    flex: 1;
  }

  .remove-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 100, 100, 0.15);
    border: 1px solid rgba(255, 100, 100, 0.3);
    border-radius: 8px;
    color: #ff6b6b;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s;

    &:hover {
      background: rgba(255, 100, 100, 0.3);
      transform: scale(1.1);
    }
  }
}
</style>
