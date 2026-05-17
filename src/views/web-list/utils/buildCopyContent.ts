/**
 * 构建复制内容 - 供 meoo AI 使用的完整信息生成器
 * 将 Vue 组件转换为 React 代码的提示词构建
 */

// ============================================================
// 类型定义
// ============================================================

/** 模块位置配置 */
export interface ModulePosition {
  key: string
  label: string
  icon: string
  desc: string
}

/** 已选择组件信息 */
export interface ComponentSelectInfo {
  dirName: string
  name: string
  path: string
  type: string
  selected: boolean
  modulePosition: string
  sourceCode?: string
  readme?: string | null
}

/** 企业信息 */
export interface EnterpriseInfo {
  name: string
  industry: string
  description: string
  targetAudience: string
  mainColors: string
  websiteType: string
  designPhilosophy: string
}

/** 卡片组件信息 */
export interface CardComponentInfo {
  dirName: string
  name: string
  path: string
  type: string
}

/** 构建复制内容的配置 */
export interface BuildCopyContentConfig {
  selectedComponents: ComponentSelectInfo[]
  enterpriseInfo: EnterpriseInfo
  modulePositions: ModulePosition[]
  vueModules: Record<string, string>
  readmeModules: Record<string, string>
  propsMap: Map<number, Record<string, unknown>>
  cardComponents: CardComponentInfo[]
}

// ============================================================
// 辅助函数
// ============================================================

/** 分隔线生成 */
const sep = (char: string, len: number = 80) => char.repeat(len)

/** 空行 */
const blank = () => ''

// ============================================================
// 常量定义
// ============================================================

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
  {
    vue: 'defineProps<Props>()',
    react: 'interface Props {...}; const Component: React.FC<Props> = (props) => {...}',
  },
]

/** 技术要求清单 */
const techRequirements = [
  { num: 1, text: '**技术栈**: React 18 + TypeScript + Tailwind CSS + GSAP (ScrollTrigger)' },
  { num: 2, text: '**Vue → React 转换规则**:', indent: true },
  {
    num: 3,
    text: '**GSAP 插件注册**: 每个使用 ScrollTrigger 的组件文件顶部必须写 `gsap.registerPlugin(ScrollTrigger)`',
  },
  {
    num: 4,
    text: '**图片地址**: 使用 Unsplash 格式 `https://images.unsplash.com/photo-XXXXXXXX?w=1920&q=80`，每个模块至少1-2张图片，首屏必须有震撼的背景图',
  },
  {
    num: 5,
    text: '**Canvas API**: 如果组件使用 Canvas，必须在 React 中用 `useRef` + `useEffect` 完整重写',
  },
  {
    num: 6,
    text: '**ScrollTrigger 模式**: 必须严格基于源码判断 `scrub` 或 `toggleActions`，不可推断',
  },
  {
    num: 7,
    text: '**Section 层处理**: 如果组件内部已有 scrollTrigger 配置，Section 层不要重复创建',
  },
  {
    num: 8,
    text: '**首屏动画时机**: 首屏（Hero）模块的 GSAP 动画必须在页面加载时立即执行，使用 `useEffect(() => { gsap.fromTo(...) }, [])` 确保组件挂载后自动播放动画，禁止使用 ScrollTrigger 控制首屏动画。只有非首屏模块才使用 ScrollTrigger 根据滚动触发',
  },
  {
    num: 9,
    text: '**图片与动画结合**: 图片必须参与 GSAP 动画（如滚动时缩放、平移、淡入），不能只是静态展示。例如：`gsap.from(imageRef.current, { scale: 0.8, opacity: 0, scrollTrigger: { trigger: sectionRef, start: "top 80%" } })`',
  },
  {
    num: 10,
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

// ============================================================
// 分析函数
// ============================================================

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

// ============================================================
// 辅助函数：获取组件源码
// ============================================================

function getComponentSourceCode(comp: ComponentSelectInfo, vueModules: Record<string, string>): string {
  return (comp.sourceCode as string) || vueModules[comp.path] || ''
}

function getComponentReadme(comp: ComponentSelectInfo, readmeModules: Record<string, string>): string {
  const readmePath = comp.path.replace(/\.vue$/, '/README.md')
  return (comp.readme as string) || readmeModules[readmePath] || ''
}

// ============================================================
// 主函数
// ============================================================

/**
 * 构建复制内容 - 供 meoo AI 使用的完整信息
 */
export function buildCopyContent(config: BuildCopyContentConfig): string {
  const {
    selectedComponents,
    enterpriseInfo,
    modulePositions,
    vueModules,
    readmeModules,
    propsMap,
    cardComponents,
  } = config

  if (selectedComponents.length === 0) {
    return ''
  }

  // ============================================================
  const lines: string[] = []

  // 标题
  lines.push(sep('='), '🎯 企业网站开发需求 - 请在 meoo AI 平台生成 React 代码', sep('='), blank())

  // ===== 优先级说明 =====
  lines.push('📌 **优先级说明**：')
  lines.push('- 🔴 **必须遵守**：不遵守会导致功能错误或性能问题')
  lines.push('- 🟡 **强烈建议**：最佳实践，显著提升代码质量')
  lines.push('- 🟢 **可选优化**：锦上添花，有时间再实现')
  lines.push(blank())

  // ===== Token 估算（更准确） =====
  const totalChars = selectedComponents.reduce((sum, comp) => {
    const sourceCode = getComponentSourceCode(comp, vueModules)
    const readme = getComponentReadme(comp, readmeModules)
    return sum + sourceCode.length + readme.length
  }, 0)
  // 考虑 Markdown 格式化开销（约增加 35%）
  const markdownOverhead = Math.ceil(totalChars * 0.35)
  const estimatedTokens = Math.ceil((totalChars + markdownOverhead) / 4)

  if (estimatedTokens > 100000) {
    lines.push('🚨 **严重 Token 警告**', sep('-'))
    lines.push(`当前内容约 ${estimatedTokens.toLocaleString()} tokens，远超模型上下文限制！`)
    lines.push('**必须采取以下措施：**')
    lines.push('1. 将组件分为多个批次生成（每批 ≤8 个组件）')
    lines.push('2. 先生成核心模块（Hero + 产品展示），再生成辅助模块')
    lines.push('3. 考虑移除部分组件的完整源码，仅保留关键动画逻辑')
    lines.push(blank())
  } else if (estimatedTokens > 50000) {
    lines.push('⚠️ **Token 警告**', sep('-'))
    lines.push(
      `当前内容约 ${estimatedTokens.toLocaleString()} tokens，可能超出模型上下文限制。`,
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
  lines.push('📋 企业信息（已配置）', sep('-'))
  enterpriseInfoFields.forEach((field) => {
    const value = enterpriseInfo[field.key as keyof EnterpriseInfo] || field.fallback || ''
    lines.push(`${field.label}: ${value}`)
  })
  lines.push(blank())

  // ===== 组件类型汇总 =====
  const componentsByType: Record<string, number> = {}
  selectedComponents.forEach((comp) => {
    componentsByType[comp.type] = (componentsByType[comp.type] || 0) + 1
  })

  lines.push('📦 已选组件统计', sep('-'))
  Object.entries(componentsByType).forEach(([type, count]) => {
    lines.push(`- ${type}: ${count}个`)
  })
  lines.push(blank())

  // ===== 模块组件规划 =====
  lines.push('🗺️ 模块组件规划', sep('-'))
  lines.push(
    '**重要：请为每个模块位置分配一个或多个组件，每个模块内可以有多个组件组合使用。**',
    blank(),
  )

  // 构建模块组件映射
  const moduleCompsMap: Record<string, ComponentSelectInfo[]> = {}
  const unassignedComps: ComponentSelectInfo[] = []

  selectedComponents.forEach((comp) => {
    if (comp.modulePosition) {
      if (!moduleCompsMap[comp.modulePosition]) {
        moduleCompsMap[comp.modulePosition] = []
      }
      moduleCompsMap[comp.modulePosition].push(comp)
    } else {
      unassignedComps.push(comp)
    }
  })

  // 输出模块
  modulePositions.forEach((pos) => {
    const comps = moduleCompsMap[pos.key] || []
    if (comps.length > 0) {
      const moduleName = pos.label
      const moduleDesc = pos.desc
      const idx = modulePositions.indexOf(pos)
      lines.push(blank(), `${idx + 1}. 【${moduleName}】`)
      if (moduleDesc) {
        lines.push(`   描述：${moduleDesc}`)
      }
      lines.push(`   📦 使用组件 (${comps.length}个)`, blank())

      comps.forEach((comp, compIdx) => {
        lines.push(`   ${compIdx + 1}. ${comp.dirName} (${comp.type})`, '   ' + sep('-', 70))

        const sourceCode = getComponentSourceCode(comp, vueModules)
        const readmePath = comp.path.replace(/\.vue$/, '/README.md')
        const readme = getComponentReadme(comp, readmeModules)

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

        // 源码分析
        if (sourceCode) {
          const scrollTriggerAnalysis = analyzeScrollTriggerMode(sourceCode)
          if (scrollTriggerAnalysis) {
            lines.push('   • ScrollTrigger 模式:', `     ${scrollTriggerAnalysis}`)
          }

          const canvasAnalysis = analyzeCanvasComponent(sourceCode)
          if (canvasAnalysis) {
            lines.push('   • 🎨 Canvas 特殊处理:', `     ${canvasAnalysis}`)
          }

          const propsInfo = extractPropsInfo(sourceCode)
          if (propsInfo) {
            lines.push('   • Props 接口:')
            propsInfo.split('\n').forEach((p) => {
              lines.push(`     ${p}`)
            })
          }
        }

        // 组件源码
        lines.push('   • 组件源码:')
        if (sourceCode) {
          lines.push('```vue')
          lines.push(sourceCode)
          lines.push('```')
        } else {
          lines.push('   （未找到源码）')
        }
        lines.push(blank())
      })
    }
  })

  // 未分配的组件
  if (unassignedComps.length > 0) {
    lines.push(blank(), `⚠️ 【未分配模块】(${unassignedComps.length}个)`)
    lines.push('**请在生成时为这些组件分配合适的模块位置：**', blank())
    unassignedComps.forEach((comp, idx) => {
      lines.push(`   ${idx + 1}. ${comp.dirName} (${comp.type})`)
    })
    lines.push(blank())
  }

  // ===== 内容创作指南 =====
  lines.push('### 📝 内容创作指南', sep('-'))

  lines.push('#### 1. 标题创作要求')
  lines.push('- 每页 1 个主标题（H1），2-3 个副标题（H2）')
  lines.push('- 标题必须包含企业/品牌名称或核心业务关键词')
  lines.push('- 长度控制：主标题 10-20 字，副标题 15-30 字')
  lines.push('- 示例：')
  lines.push('  - 错误："创新解决方案"（空洞）')
  lines.push('  - 正确："[品牌名] - 为[行业]提供智能[核心服务]解决方案"')
  lines.push(blank())

  lines.push('#### 2. 副标题/小标题要求')
  lines.push('- 每个模块 1-2 个小标题，突出模块核心价值')
  lines.push('- 使用数字/字母编号，增强条理性')
  lines.push('- 避免使用疑问句作为标题（问句不适合作为展示型页面）')
  lines.push('- 示例：')
  lines.push('  - "为什么选择我们？" → "我们的核心优势"')
  lines.push('  - "我们的产品有哪些？" → "产品矩阵"')
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

  // ===== 文字组件设计规范（自动检测 card-text 类型） =====
  const hasTextComponents = selectedComponents.some(comp => comp.type === 'card-text')
  if (hasTextComponents) {
    lines.push('#### 3.5 🎨 GSAP 文字动画组件设计规范（重要）')
    lines.push('**检测到您选择了 card-text 类型的文字动画组件，请严格遵循以下设计规范：**')
    lines.push(blank())

    lines.push('##### 3.5.1 文字组件参考标准')
    lines.push('所有文字动画必须参考 `src/views/web-list/card-text` 目录下的 Vue3 组件设计，包括：')
    lines.push('- **CardTextBlur**: 模糊揭示动画（blur filter + y 位移 + opacity）')
    lines.push('- **CardTextNeonSign**: 霓虹灯效果（text-shadow 动画 + 发光效果）')
    lines.push('- **CardTextHologram**: 全息投影效果（gradient text + shimmer 动画）')
    lines.push('- **CardTextParticleStorm**: 粒子风暴文字（Canvas 粒子组成文字）')
    lines.push('- **CardTextFluid3D**: 3D 流体文字（3D transform + fluid motion）')
    lines.push('- **CardTextCyber**: 赛博朋克风格（glitch effect + scan lines）')
    lines.push('- **CardTextGalaxy**: 星系文字（旋转星云效果）')
    lines.push('- **CardTextLaser**: 激光扫描效果（linear-gradient mask 动画）')
    lines.push('- 以及其他 20+ 种文字特效组件')
    lines.push(blank())

    lines.push('##### 3.5.2 核心技术要求（必须遵守）')
    lines.push('1. **Vue3 → React 转换规则**：')
    lines.push('   - 使用 `useRef` 替代 `ref()` 获取 DOM 元素')
    lines.push('   - 在 `useEffect` 中初始化 GSAP 动画，确保 DOM 已渲染')
    lines.push('   - 使用 `gsap.context()` 包裹所有动画代码，便于清理')
    lines.push('   - 在 `return () => ctx.revert()` 中清理所有动画')
    lines.push(blank())

    lines.push('2. **ScrollTrigger 配置标准**：')
    lines.push('   ```tsx')
    lines.push('   scrollTrigger: {')
    lines.push('     trigger: sectionRef.current,')
    lines.push('     start: "top 80%",  // 元素顶部到达视口80%时开始')
    lines.push('     end: "top 20%",    // 元素顶部到达视口20%时结束')
    lines.push('     scrub: 1.5,        // 平滑系数，值越大动画越平滑')
    lines.push('     toggleActions: "play none none reverse"')
    lines.push('   }')
    lines.push('   ```')
    lines.push(blank())

    lines.push('3. **文字动画常见模式**：')
    lines.push('   - **模糊揭示**：`{ filter: "blur(20px)", opacity: 0, y: 120 }` → `{ filter: "blur(0px)", opacity: 1, y: 0 }`')
    lines.push('   - **缩放入场**：`{ scale: 0.8, opacity: 0 }` → `{ scale: 1, opacity: 1 }`')
    lines.push('   - **交错延迟**：使用 `stagger: 0.15` 让多个段落依次动画')
    lines.push('   - **3D 旋转**：`{ rotationX: -45, opacity: 0 }` → `{ rotationX: 0, opacity: 1 }`')
    lines.push('   - **渐变遮罩**：使用 `background-clip: text` + animated gradient')
    lines.push(blank())

    lines.push('4. **性能优化要点**：')
    lines.push('   - 使用 `will-change: transform, opacity` 提升动画性能')
    lines.push('   - 避免同时动画大量文字元素（建议 ≤10 个段落）')
    lines.push('   - Canvas 文字动画需监听 `visibilitychange` 暂停')
    lines.push('   - 移动端简化动画（减少 blur 半径、降低粒子数量）')
    lines.push(blank())

    lines.push('5. **响应式设计**：')
    lines.push('   - 桌面端（≥1024px）：完整动画效果，字体大小 18-24px')
    lines.push('   - 平板端（768-1023px）：简化动画，字体大小 16-20px')
    lines.push('   - 移动端（<768px）：仅保留淡入效果，字体大小 14-18px')
    lines.push('   - 超小屏幕（<480px）：禁用复杂动画，确保可读性')
    lines.push(blank())

    lines.push('##### 3.5.3 完整代码示例（React + GSAP）')
    lines.push('```tsx')
    lines.push('import { useRef, useEffect } from "react"')
    lines.push('import gsap from "gsap"')
    lines.push('import { ScrollTrigger } from "gsap/ScrollTrigger"')
    lines.push(blank())
    lines.push('gsap.registerPlugin(ScrollTrigger)')
    lines.push(blank())
    lines.push('const TextSection = () => {')
    lines.push('  const sectionRef = useRef<HTMLElement>(null)')
    lines.push('  const titleRef = useRef<HTMLHeadingElement>(null)')
    lines.push('  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([])')
    lines.push(blank())
    lines.push('  useEffect(() => {')
    lines.push('    const ctx = gsap.context(() => {')
    lines.push('      // 标题动画 - 模糊揭示')
    lines.push('      if (titleRef.current) {')
    lines.push('        gsap.fromTo(titleRef.current,')
    lines.push('          { y: 120, opacity: 0, filter: "blur(20px)" },')
    lines.push('          {')
    lines.push('            y: 0,')
    lines.push('            opacity: 1,')
    lines.push('            filter: "blur(0px)",')
    lines.push('            duration: 1.2,')
    lines.push('            ease: "power3.out",')
    lines.push('            scrollTrigger: {')
    lines.push('              trigger: sectionRef.current,')
    lines.push('              start: "top 80%",')
    lines.push('              end: "top 20%",')
    lines.push('              scrub: 1.5')
    lines.push('            }')
    lines.push('          }')
    lines.push('        )')
    lines.push('      }')
    lines.push(blank())
    lines.push('      // 段落交错动画')
    lines.push('      const validParagraphs = paragraphRefs.current.filter(Boolean)')
    lines.push('      if (validParagraphs.length > 0) {')
    lines.push('        gsap.fromTo(validParagraphs,')
    lines.push('          { y: 150, opacity: 0, filter: "blur(25px)" },')
    lines.push('          {')
    lines.push('            y: 0,')
    lines.push('            opacity: 1,')
    lines.push('            filter: "blur(0px)",')
    lines.push('            duration: 1.2,')
    lines.push('            ease: "power3.out",')
    lines.push('            stagger: 0.15,')
    lines.push('            scrollTrigger: {')
    lines.push('              trigger: sectionRef.current,')
    lines.push('              start: "top 80%",')
    lines.push('              end: "top 20%",')
    lines.push('              scrub: 1.5')
    lines.push('            }')
    lines.push('          }')
    lines.push('        )')
    lines.push('      }')
    lines.push('    }, sectionRef)')
    lines.push(blank())
    lines.push('    return () => ctx.revert() // ✅ 清理所有动画')
    lines.push('  }, [])')
    lines.push(blank())
    lines.push('  return (')
    lines.push('    <section ref={sectionRef} className="text-section">')
    lines.push('      <h2 ref={titleRef}>企业核心价值</h2>')
    lines.push('      <p ref={el => paragraphRefs.current[0] = el}>第一段内容...</p>')
    lines.push('      <p ref={el => paragraphRefs.current[1] = el}>第二段内容...</p>')
    lines.push('      <p ref={el => paragraphRefs.current[2] = el}>第三段内容...</p>')
    lines.push('    </section>')
    lines.push('  )')
    lines.push('}')
    lines.push('```')
    lines.push(blank())

    lines.push('##### 3.5.4 文字内容与动画的匹配原则')
    lines.push('| 文字特效类型 | 适用文案主题 | 动画节奏 |')
    lines.push('|------------|------------|---------|')
    lines.push('| 模糊揭示（Blur） | 渐进式披露、深度洞察 | 缓慢优雅（1.2-1.5s） |')
    lines.push('| 霓虹发光（Neon） | 活力、创新、突破 | 快速闪烁（0.6-0.8s） |')
    lines.push('| 全息投影（Hologram） | 科技感、未来感 | 中等速度（1.0-1.2s） |')
    lines.push('| 粒子风暴（Particle） | 数据、连接、网络 | 动态爆发（0.8-1.0s） |')
    lines.push('| 3D 流体（Fluid3D） | 灵活、变革、适应 | 流畅自然（1.2-1.5s） |')
    lines.push('| 赛博朋克（Cyber） | 数字化、AI、自动化 | 机械节奏（0.5-0.7s） |')
    lines.push('| 激光扫描（Laser） | 精准、聚焦、目标 | 线性匀速（1.0s） |')
    lines.push(blank())

    lines.push('##### 3.5.5 常见错误警告')
    lines.push('❌ **禁止的做法**：')
    lines.push('- 直接在 render 中执行 GSAP 动画（必须在 useEffect 中）')
    lines.push('- 使用 className 选择器（如 `.title`），应使用 ref 引用具体元素')
    lines.push('- 忘记清理 ScrollTrigger（导致内存泄漏）')
    lines.push('- 对所有文字使用相同动画（应根据内容层次差异化）')
    lines.push('- 动画持续时间过长（>2s 会让用户失去耐心）')
    lines.push('- 在移动端使用复杂的 blur/canvas 动画（性能差）')
    lines.push(blank())

    lines.push('✅ **正确的做法**：')
    lines.push('- 使用 `gsap.context()` 包裹动画，便于批量清理')
    lines.push('- 为每个文字元素设置唯一的 ref（避免冲突）')
    lines.push('- ScrollTrigger 配置 `scrub: 1.5` 实现平滑滚动绑定')
    lines.push('- 标题用强动画（blur + scale + y），段落用弱动画（仅 y + opacity）')
    lines.push('- 添加 `prefers-reduced-motion` 检测，为敏感用户禁用动画')
    lines.push('- 使用 `will-change` 提示浏览器优化渲染')
    lines.push(blank())
  }

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
  lines.push('##### 4.4 图片 URL 格式要求')
  lines.push('**必须使用 Unsplash 提供的原始 URL 格式：**')
  lines.push('```')
  lines.push('https://images.unsplash.com/photo-XXXXXXXX?w=1920&q=80')
  lines.push('```')
  lines.push('**参数说明：**')
  lines.push('- `w=1920`：图片宽度，可根据需要调整为 800/1280/1920/2560')
  lines.push('- `q=80`：图片质量，可选 60/80/100')
  lines.push('- `auto=format`：自动选择最佳格式（WebP/AVIF）')
  lines.push('- `fit=crop&crop=entropy`：裁剪到指定尺寸')
  lines.push(blank())
  lines.push('##### 4.5 图片优化策略')
  lines.push('- 首屏背景图必须使用最高质量（w=1920, q=80）')
  lines.push('- 产品图片使用中等质量（w=800-1280）')
  lines.push('- 缩略图/头像使用低质量（w=200-400）')
  lines.push('- 考虑使用 WebP 格式减小文件体积')
  lines.push('- 为图片添加淡入动画：`gsap.from(img, { opacity: 0, duration: 1 })`')
  lines.push(blank())
  lines.push('##### 4.6 响应式图片策略')
  lines.push('- **桌面端（≥1024px）**：使用完整分辨率图片（1920x1080）')
  lines.push('- **平板端（768px-1023px）**：使用中分辨率图片（1280x720）')
  lines.push('- **移动端（<768px）**：使用低分辨率图片（768x432）或裁剪为中心区域')
  lines.push('- 使用 Tailwind 响应式类：`<img className="w-full md:w-1/2 lg:w-1/3" />`')
  lines.push('- Hero 背景图在移动端可切换为更简洁的版本')
  lines.push(blank())

  lines.push('##### 4.7 Tailwind CSS 响应式断点标准')
  lines.push('**🟢 统一使用以下断点进行响应式设计：**')
  lines.push(blank())
  lines.push('| 断点 | 屏幕宽度 | Tailwind 前缀 | 适用场景 |')
  lines.push('|-----|---------|--------------|---------|')
  lines.push('| sm | ≥640px | `sm:` | 手机横屏 |')
  lines.push('| md | ≥768px | `md:` | 平板竖屏 |')
  lines.push('| lg | ≥1024px | `lg:` | 平板横屏/小笔记本 |')
  lines.push('| xl | ≥1280px | `xl:` | 桌面显示器 |')
  lines.push('| 2xl | ≥1536px | `2xl:` | 大显示器 |')
  lines.push(blank())
  lines.push('**🟢 示例代码：**')
  lines.push('```tsx')
  lines.push('// 响应式字体大小')
  lines.push('<h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl">')
  lines.push('  企业标题')
  lines.push('</h2>')
  lines.push(blank())
  lines.push('// 响应式布局')
  lines.push('<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">')
  lines.push('  {/* 卡片内容 */}')
  lines.push('</div>')
  lines.push(blank())
  lines.push('// 响应式间距')
  lines.push('<section className="py-12 md:py-16 lg:py-24 px-4 md:px-8 lg:px-16">')
  lines.push('  {/* 内容 */}')
  lines.push('</section>')
  lines.push('```')
  lines.push(blank())

  lines.push('##### 4.8 TypeScript 类型定义规范')
  lines.push('**🟢 所有组件必须严格遵循 TypeScript 类型定义：**')
  lines.push(blank())
  lines.push('```tsx')
  lines.push('// 1. Props 接口定义')
  lines.push('interface HeroSectionProps {')
  lines.push('  title: string')
  lines.push('  subtitle?: string  // 可选属性')
  lines.push('  imageUrl: string')
  lines.push('  onCtaClick?: () => void  // 回调函数')
  lines.push('}')
  lines.push(blank())
  lines.push('// 2. 组件定义')
  lines.push('const HeroSection: React.FC<HeroSectionProps> = ({')
  lines.push('  title,')
  lines.push('  subtitle,')
  lines.push('  imageUrl,')
  lines.push('  onCtaClick')
  lines.push('}) => {')
  lines.push('  // ... 组件逻辑')
  lines.push('}')
  lines.push(blank())
  lines.push('// 3. Ref 类型')
  lines.push('const sectionRef = useRef<HTMLElement>(null)')
  lines.push('const canvasRef = useRef<HTMLCanvasElement>(null)')
  lines.push('```')
  lines.push(blank())
  lines.push('**🔴 禁止的做法：**')
  lines.push('- ❌ 使用 `any` 类型（除非绝对必要）')
  lines.push('- ❌ Props 不定义类型直接使用')
  lines.push('- ❌ 事件处理函数参数类型为 `any`')
  lines.push(blank())

  lines.push('##### 4.9 GSAP 缓动函数选择')
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
    'gsap.fromTo(element, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.2)" })',
  )
  lines.push(blank())
  lines.push('// 滚动绑定 - 平滑同步')
  lines.push('gsap.fromTo(element, { y: 100 }, {')
  lines.push('  y: 0,')
  lines.push('  ease: "none",')
  lines.push('  scrollTrigger: {')
  lines.push('    trigger: element,')
  lines.push('    start: "top bottom",')
  lines.push('    end: "top top",')
  lines.push('    scrub: 1')
  lines.push('  }')
  lines.push('})')
  lines.push('```')
  lines.push(blank())

  lines.push('##### 4.10 ScrollTrigger 配置对比')
  lines.push('| 场景 | 模式 | 配置示例 | 适用情况 |')
  lines.push('|------|------|---------|----------|')
  lines.push('| 首屏动画 | 立即播放 | `paused: true` + `.play()` | 页面加载时自动播放 |')
  lines.push('| 滚动入场 | scrub | `scrub: 1.5` | 元素进入视口时动画 |')
  lines.push('| 滚动入场 | toggleActions | `toggleActions: "play none none reverse"` | 元素进入时播放，离开时回退 |')
  lines.push('| 滚动固定 | pin | `pin: true` | 滚动时固定元素位置 |')
  lines.push(blank())

  // ===== AI 生成前检查清单 =====
  lines.push('#### 5. 🔍 生成前检查清单（重要）')
  lines.push('**在开始生成代码前，请逐项确认以下内容：**')
  lines.push(blank())
  lines.push('##### 5.1 内容完整性检查')
  lines.push('- [ ] 所有模块都有对应的文案内容（标题、描述）')
  lines.push('- [ ] 首屏 Hero 有震撼的背景图或视频')
  lines.push('- [ ] 每个模块至少配 1-2 张图片')
  lines.push('- [ ] 企业信息（名称、行业、描述）已正确填入')
  lines.push('- [ ] 联系方式/CTA 按钮指向正确的目标')
  lines.push(blank())
  lines.push('##### 5.2 技术可行性检查')
  lines.push('- [ ] 确认每个组件的 ScrollTrigger 模式（scrub 或 toggleActions）')
  lines.push('- [ ] 检查 Canvas 组件的复杂度，评估 React 重写难度')
  lines.push('- [ ] 确认 GSAP 动画时长在合理范围内（≤2s）')
  lines.push('- [ ] 检查是否有性能瓶颈（如大量粒子动画）')
  lines.push(blank())
  lines.push('##### 5.3 常见错误警告')
  lines.push('❌ **避免以下常见问题：**')
  lines.push('- 不要使用 `toggleActions: "play none none none"` 作为默认配置')
  lines.push('- 不要省略 GSAP 插件注册 `gsap.registerPlugin(ScrollTrigger)`')
  lines.push('- 不要在首屏使用 ScrollTrigger 控制动画（应立即播放）')
  lines.push('- 不要省略图片 URL 的尺寸参数（?w=1920&q=80）')
  lines.push('- 不要省略 Canvas 的清理逻辑（cancelAnimationFrame）')
  lines.push('- 不要省略 ScrollTrigger 的清理逻辑（scrollTrigger.kill()）')
  lines.push(blank())
  lines.push('✅ **正确的做法：**')
  lines.push('- 首屏使用 `useEffect(() => { gsap.fromTo(...) }, [])`')
  lines.push('- 非首屏使用 ScrollTrigger：`scrollTrigger: { trigger: el, start: "top 80%" }`')
  lines.push('- 每个组件文件顶部注册插件：`gsap.registerPlugin(ScrollTrigger)`')
  lines.push('- 使用 Unsplash 原始 URL：`https://images.unsplash.com/photo-XXX?w=1920&q=80`')
  lines.push('- Canvas 清理：`return () => cancelAnimationFrame(id)`')
  lines.push('- ScrollTrigger 清理：`ScrollTrigger.getAll().forEach(t => t.kill())`')
  lines.push(blank())

  // ===== 设计规范 =====
  lines.push('#### 6. 🎨 设计规范', sep('-'))

  lines.push('##### 6.1 排版规范')
  lines.push('- 标题字体大小：`text-4xl`（Hero）、`text-3xl`（模块标题）、`text-xl`（子标题）')
  lines.push('- 正文字体大小：`text-base`（桌面）、`text-sm`（移动）')
  lines.push('- 行高：标题 1.2-1.4，正文 1.6-1.8')
  lines.push('- 间距系统：使用 Tailwind 的 spacing（4/8/12/16/24/32/48/64）')
  lines.push('- 统一使用 8px 网格系统')
  lines.push(blank())

  lines.push('##### 6.2 色彩规范')
  lines.push(`- 品牌主色：${enterpriseInfo.mainColors || '使用默认渐变色（#667eea → #764ba2）'}`)
  lines.push('- 文字颜色：主标题 `#1a202c`，副标题 `#4a5568`，正文 `#718096`')
  lines.push('- 背景颜色：主背景 `#ffffff`，次级背景 `#f7fafc`')
  lines.push('- 强调色：使用品牌主色的 10% 透明度版本作为hover状态')
  lines.push(blank())

  lines.push('##### 6.3 组件样式规范')
  lines.push('- 圆角：`rounded-lg`（卡片）、`rounded-xl`（大卡片）、`rounded-full`（按钮）')
  lines.push('- 阴影：`shadow-lg`（卡片）、`shadow-xl`（悬停状态）')
  lines.push('- 边框：`border border-gray-100`')
  lines.push('- 过渡：`transition-all duration-300 ease-in-out`')
  lines.push(blank())

  lines.push('##### 6.4 品牌主色约束')
  mainColorConstraints.forEach((c) => lines.push(`- ${c}`))
  lines.push(blank())

  lines.push('##### 6.5 设计理念约束')
  designConstraints.forEach((c) => lines.push(`- ${c}`))
  lines.push(blank())

  // ===== 可访问性规范 =====
  lines.push('#### 7. ♿ 可访问性规范', sep('-'))
  lines.push('**原则：网站必须对所有用户友好，包括残障人士和使用辅助技术的用户。**')
  lines.push(blank())
  lines.push('##### 7.1 键盘导航')
  lines.push('- 所有交互元素（按钮、链接、卡片）必须可通过 Tab 键访问')
  lines.push('- 焦点状态必须有清晰的视觉反馈（outline 或 box-shadow）')
  lines.push('- 避免使用 `tabindex > 0`，保持自然 tab 顺序')
  lines.push(blank())
  lines.push('##### 7.2 ARIA 标签')
  lines.push('- 图片必须添加 `alt` 属性描述内容')
  lines.push('- 按钮必须有描述性文字或 `aria-label`')
  lines.push('- 表单元素必须关联 `<label>` 标签')
  lines.push('- 装饰性元素使用 `aria-hidden="true"`')
  lines.push(blank())
  lines.push('##### 7.3 动画可访问性')
  lines.push('- 检测 `prefers-reduced-motion`，为敏感用户禁用动画')
  lines.push('- 提供关闭动画的选项')
  lines.push('- 闪烁动画频率不超过 3Hz')
  lines.push(blank())
  lines.push('##### 7.4 颜色对比度')
  lines.push('- 文字与背景的对比度至少 4.5:1（普通文字）或 3:1（大文字）')
  lines.push('- 使用工具检查对比度：[WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)')
  lines.push(blank())

  // ===== SEO 规范 =====
  lines.push('#### 8. 🔍 SEO 规范', sep('-'))
  lines.push('**原则：生成的网站必须对搜索引擎友好，便于收录和排名。**')
  lines.push(blank())
  lines.push('##### 8.1 语义化 HTML')
  lines.push('- 使用 `<header>`、`<main>`、`<footer>`、`<nav>`、`<section>`、`<article>` 等语义标签')
  lines.push('- 标题层级正确：每个页面只有一个 `<h1>`，标题按层级递减')
  lines.push('- 列表使用 `<ul>`、`<ol>`、`<li>`')
  lines.push(blank())
  lines.push('##### 8.2 Meta 标签')
  lines.push('- 每个页面必须有唯一的 `<title>` 和 `<meta name="description">`')
  lines.push('- Open Graph 标签用于社交分享')
  lines.push('- 移动端必须设置 viewport：`width=device-width, initial-scale=1`')
  lines.push(blank())
  lines.push('##### 8.3 图片 SEO')
  lines.push('- 所有图片必须有描述性的 `alt` 属性')
  lines.push('- 使用懒加载 `loading="lazy"` 提高性能')
  lines.push('- 使用 `width` 和 `height` 属性避免布局偏移')
  lines.push(blank())
  lines.push('##### 8.4 性能优化')
  lines.push('- 关键 CSS 内联，首屏内容优先加载')
  lines.push('- 资源使用 `preload` 预加载')
  lines.push('- 使用 `defer` 或 `async` 加载非关键脚本')
  lines.push('- 提供 favicon 和 apple-touch-icon')
  lines.push(blank())

  // ===== 生成后验证清单 =====
  lines.push('#### 9. ✅ 生成后验证清单（重要）')
  lines.push('**生成代码后，请逐项检查以下内容，确保动画设计和内容显示正确：**')
  lines.push(blank())

  lines.push('##### 9.1 ScrollTrigger 设计验证')
  lines.push('- [ ] **触发器配置检查**：')
  lines.push('  - trigger 元素是否正确指向目标 DOM')
  lines.push('  - start/end 位置是否合理（如 "top 80%" 到 "top 10%"）')
  lines.push('  - scrub 值是否设置（推荐 1-2，避免 true）')
  lines.push('  - toggleActions 是否与 scrub 模式匹配（scrub 模式下应为 "none none none none"）')
  lines.push(blank())

  lines.push('- [ ] **动画时间线检查**：')
  lines.push('  - gsap.timeline 是否正确创建并关联到 ScrollTrigger')
  lines.push('  - 动画阶段划分是否清晰（入场、展开、悬浮等）')
  lines.push('  - stagger 延迟是否合理，避免所有元素同时动画')
  lines.push('  - ease 缓动函数是否合适（避免 linear，推荐 power2.out、expo.out 等）')
  lines.push(blank())

  lines.push('- [ ] **清理机制检查**：')
  lines.push('  - useEffect return 中是否正确调用 scrollTrigger.kill()')
  lines.push('  - 是否使用 gsap.context() 包裹动画代码并调用 ctx.revert()')
  lines.push('  - Canvas 动画是否正确取消 requestAnimationFrame')
  lines.push('  - 页面隐藏时是否暂停动画（visibilitychange 监听）')
  lines.push(blank())

  lines.push('- [ ] **性能优化检查**：')
  lines.push('  - 动画元素是否添加 will-change: transform')
  lines.push('  - 是否避免在滚动处理函数中执行昂贵操作')
  lines.push('  - 粒子/Canvas 动画是否在不可见时停止')
  lines.push('  - 是否使用 transform 而非 top/left 进行位移动画')
  lines.push(blank())

  lines.push('##### 9.2 内容显示验证')
  lines.push('- [ ] **3D 变换检查**：')
  lines.push('  - 父容器是否设置 transform-style: preserve-3d')
  lines.push('  - perspective 值是否合理（推荐 800-1600px）')
  lines.push('  - 子元素的 transform-origin 是否正确')
  lines.push('  - backface-visibility 是否按需设置')
  lines.push(blank())

  lines.push('- [ ] **元素可见性检查**：')
  lines.push('  - 初始状态 opacity/scale 是否正确（折叠态 vs 展开态）')
  lines.push('  - z-index 层级是否合理，避免元素被遮挡')
  lines.push('  - overflow: hidden 是否影响内容显示')
  lines.push('  - 响应式断点下内容是否正常显示')
  lines.push(blank())

  lines.push('- [ ] **文本内容检查**：')
  lines.push('  - 标题、描述文案是否与企业信息匹配')
  lines.push('  - 文案长度是否适合容器宽度（避免溢出或过短）')
  lines.push('  - 字体大小在移动端是否可读（≥14px）')
  lines.push('  - 文字颜色与背景对比度是否足够（≥4.5:1）')
  lines.push(blank())

  lines.push('- [ ] **图片加载检查**：')
  lines.push('  - 图片 URL 是否有效（Unsplash 格式）')
  lines.push('  - 是否添加 alt 属性和 loading="lazy"')
  lines.push('  - 图片尺寸是否适配容器（object-fit: cover）')
  lines.push('  - 图片加载失败是否有降级方案')
  lines.push(blank())

  lines.push('##### 9.3 交互体验验证')
  lines.push('- [ ] **滚动行为检查**：')
  lines.push('  - 滚动时动画是否流畅（无卡顿、跳跃）')
  lines.push('  - 反向滚动时动画是否正确回退')
  lines.push('  - 快速滚动时动画是否保持稳定')
  lines.push('  - 滚动到不同区域时进度指示是否正确更新')
  lines.push(blank())

  lines.push('- [ ] **鼠标交互检查**：')
  lines.push('  - hover 效果是否正常工作（如有）')
  lines.push('  - 点击事件是否可触发（如有按钮/链接）')
  lines.push('  - 光标样式是否正确（pointer/default）')
  lines.push('  - 焦点状态是否清晰可见（键盘导航）')
  lines.push(blank())

  lines.push('- [ ] **响应式检查**：')
  lines.push('  - 桌面端（≥1024px）：布局完整，动画流畅')
  lines.push('  - 平板端（768-1023px）：元素不重叠，文字可读')
  lines.push('  - 移动端（<768px）：单列布局，触摸友好')
  lines.push('  - 超小屏幕（<480px）：内容不溢出，按钮可点击')
  lines.push(blank())

  lines.push('##### 9.4 浏览器兼容性验证')
  lines.push('- [ ] **现代浏览器测试**：')
  lines.push('  - Chrome/Edge：GSAP 动画正常，Canvas 渲染流畅')
  lines.push('  - Firefox：3D 变换正确，渐变背景显示正常')
  lines.push('  - Safari：iOS 上触摸滚动流畅，prefers-reduced-motion 生效')
  lines.push('  - 移动端浏览器：触摸事件正常，性能良好')
  lines.push(blank())

  lines.push('- [ ] **降级方案检查**：')
  lines.push('  - JS 禁用时：内容仍可阅读（SEO 友好）')
  lines.push('  - GSAP 加载失败时：有 CSS fallback 动画')
  lines.push('  - prefers-reduced-motion 用户：动画简化或禁用')
  lines.push('  - 低性能设备：减少粒子数量或禁用复杂效果')
  lines.push(blank())

  lines.push('##### 9.5 调试工具使用建议')
  lines.push('**使用以下工具验证动画质量：**')
  lines.push('1. **GSAP DevTools**：安装 Chrome 扩展，实时查看时间线和 ScrollTrigger')
  lines.push('2. **Chrome DevTools Performance**：录制滚动过程，检查 FPS 和强制重排')
  lines.push('3. **Lighthouse**：运行性能审计，确保评分 ≥90')
  lines.push('4. **Responsive Viewer**：同时预览多个断点的显示效果')
  lines.push('5. **Accessibility Insights**：检查可访问性问题')
  lines.push(blank())

  lines.push('##### 9.6 🚀 性能预算（Performance Budget - 必须达标）')
  lines.push('🟡 **生成的代码必须满足以下性能指标：**')
  lines.push(blank())
  lines.push('| 指标 | 目标值 | 测量工具 |')
  lines.push('|-----|-------|---------|')
  lines.push('| 首屏加载时间（FCP） | < 1.8s | Lighthouse |')
  lines.push('| 最大内容绘制（LCP） | < 2.5s | Lighthouse |')
  lines.push('| 累积布局偏移（CLS） | < 0.1 | Lighthouse |')
  lines.push('| 首次输入延迟（FID） | < 100ms | Lighthouse |')
  lines.push('| 动画帧率（FPS） | ≥ 55fps | Chrome DevTools Performance |')
  lines.push('| JS Bundle 大小 | < 300KB（gzip） | Webpack Bundle Analyzer |')
  lines.push('| CSS 文件大小 | < 50KB（gzip） | Webpack Bundle Analyzer |')
  lines.push(blank())
  lines.push('**🟡 性能优化强制措施：**')
  lines.push('- [ ] 所有图片使用 `loading="lazy"` + `decoding="async"`')
  lines.push('- [ ] GSAP 动画使用 `will-change: transform, opacity`')
  lines.push('- [ ] Canvas 动画在不可见时暂停（`visibilitychange` 监听）')
  lines.push('- [ ] 使用 `React.memo()` 包裹纯展示组件')
  lines.push('- [ ] 避免在滚动事件中执行昂贵操作（使用 throttle/debounce）')
  lines.push('- [ ] 使用 `IntersectionObserver` 替代部分 ScrollTrigger 场景')
  lines.push(blank())

  lines.push('##### 9.7 🛡️ 错误边界与降级方案')
  lines.push('🟡 **必须为以下场景提供降级方案：**')
  lines.push(blank())
  lines.push('###### 9.7.1 GSAP 加载失败')
  lines.push('```tsx')
  lines.push('const [gsapLoaded, setGsapLoaded] = useState(false)')
  lines.push(blank())
  lines.push('useEffect(() => {')
  lines.push('  import("gsap").then(() => {')
  lines.push('    setGsapLoaded(true)')
  lines.push('  }).catch(() => {')
  lines.push('    document.documentElement.classList.add("no-gsap")')
  lines.push('  })')
  lines.push('}, [])')
  lines.push('// CSS fallback')
  lines.push('// .no-gsap .animated-element { animation: fadeIn 0.6s ease-out; }')
  lines.push('```')
  lines.push(blank())
  lines.push('###### 9.7.2 图片加载失败')
  lines.push('```tsx')
  lines.push('const [imgError, setImgError] = useState(false)')
  lines.push(blank())
  lines.push('<img')
  lines.push('  src={imageUrl}')
  lines.push('  alt={altText}')
  lines.push('  onError={() => setImgError(true)}')
  lines.push('  className={imgError ? "fallback-bg" : ""}')
  lines.push('/>')
  lines.push('```')
  lines.push(blank())
  lines.push('###### 9.7.3 ScrollTrigger 初始化失败')
  lines.push('```tsx')
  lines.push('useEffect(() => {')
  lines.push('  try {')
  lines.push('    gsap.registerPlugin(ScrollTrigger)')
  lines.push('    // ... 动画代码')
  lines.push('  } catch (error) {')
  lines.push('    console.warn("ScrollTrigger 初始化失败，使用简化动画", error)')
  lines.push('    gsap.from(element, { opacity: 0, duration: 0.6 })')
  lines.push('  })')
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
