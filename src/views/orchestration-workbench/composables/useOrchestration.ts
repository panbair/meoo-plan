/**
 * useOrchestration — 核心编排逻辑
 *
 * 整合 store 操作 + 组件/模板加载，为视图层提供统一 API
 */

import { computed, ref } from 'vue'
import { useOrchestrationStore } from '../store/orchestrationStore'
import type { ComponentItem, TemplateItem, TemplateCategory } from '../types/orchestration'
import type { ComponentCategory, ComponentKnowledge } from '@/api/ai/component-knowledge-builder'

// ==================== 类别中文映射 ====================

export const CATEGORY_LABELS: Record<ComponentCategory, string> = {
  'card-base': '基础滚动动画',
  'card-image': '震撼图片特效',
  'card-img': '图片卡片特效',
  'card-text': '文字特效',
  'card-3d': '3D 立体卡片',
  'card-time': '时间轴组件',
  'card-list': '通用多功能卡片',
  'card-other': '其他创意组件'
}

export const CATEGORY_ICONS: Record<ComponentCategory, string> = {
  'card-base': '🎬',
  'card-image': '🖼️',
  'card-img': '🌟',
  'card-text': '📝',
  'card-3d': '🎲',
  'card-time': '⏱️',
  'card-list': '📋',
  'card-other': '🔮'
}

// ==================== 模板类别映射 ====================

export const TEMPLATE_CATEGORY_LABELS: Record<TemplateCategory, string> = {
  'scroll-basic': '滚动基础',
  'scroll-effect': '滚动特效',
  'transition': '过渡动画',
  'creative': '创意视效'
}

/**
 * 从模板 key 推断类别
 */
export function getTemplateCategory(key: string): TemplateCategory {
  if (key.startsWith('scroll-')) return 'scroll-effect'
  if (key.startsWith('transition-')) return 'transition'
  // 基础滚动（非 scroll- 前缀的特殊模板）
  const basics = [
    'infinite-scroll', 'panorama-drift', 'snap-chapters',
    'horizontal-scroll', 'parallax-scroll', 'stagger-reveal',
    'fake-horizontal-scroll', 'glassmorphism-showcase',
    'timeline-scroll', 'split-scroll'
  ]
  if (basics.includes(key)) return 'scroll-basic'
  return 'creative'
}

/**
 * 从模板源码估算面板数量
 */
export function estimatePanelCount(source: string): number {
  // 尝试匹配 totalPanels = N 或 const TOTAL = N
  const patterns = [
    /totalPanels\s*[=:]\s*(\d+)/i,
    /const\s+TOTAL\s*=\s*(\d+)/,
    /TOTAL\s*=\s*(\d+)/,
    /panels\.length\s*[=<>]\s*(\d+)/
  ]
  for (const p of patterns) {
    const match = source.match(p)
    if (match) {
      return parseInt(match[1], 10)
    }
  }
  // 默认：从 section 数量推断
  const sectionCount = (source.match(/<section\s/g) || []).length
  return Math.max(sectionCount || 5, 3)
}

// ==================== Composable ====================

export function useOrchestration() {
  const store = useOrchestrationStore()
  const isLoaded = ref(false)
  const loadError = ref<string | null>(null)

  // ==================== 组件加载 ====================

  const componentModules = import.meta.glob('../../web-list/card-*/*/*.vue', {
    query: '?raw',
    import: 'default'
  })

  /** 从组件路径解析类别和名称 */
  function parseComponentPath(path: string): { category: ComponentCategory; dirName: string; name: string } | null {
    // 路径: ../../web-list/card-image/CardImage3DAlbum/CardImage3DAlbum.vue
    const match = path.match(/card-(image|img|text|3d|time|list|base|other)\/([^/]+)\/([^/]+)\.vue$/)
    if (!match) return null
    return {
      category: `card-${match[1]}` as ComponentCategory,
      dirName: match[2],
      name: match[3].replace('.vue', '')
    }
  }

  /** 获取所有可用组件列表 */
  function getAvailableComponents(): ComponentItem[] {
    const components: ComponentItem[] = []
    const seen = new Set<string>()

    for (const [path] of Object.entries(componentModules)) {
      const parsed = parseComponentPath(path)
      if (!parsed || seen.has(parsed.name)) continue
      seen.add(parsed.name)

      components.push({
        name: parsed.name,
        dirName: parsed.dirName,
        category: parsed.category,
        categoryLabel: CATEGORY_LABELS[parsed.category] || parsed.category,
        summary: '',
        visualTags: [],
        sceneTags: [],
        complexity: 'medium',
        hasCanvas: false,
        has3D: parsed.category === 'card-image' || parsed.category === 'card-3d',
        hasScrollTrigger: true,
        sourcePath: path
      })
    }

    return components
  }

  // ==================== 模板加载 ====================

  const templateRawModules = import.meta.glob('../../web-template/template/*/*.vue', {
    query: '?raw',
    import: 'default',
    eager: true
  })

  /** 从模板路径提取 key */
  function parseTemplatePath(path: string): string | null {
    const match = path.match(/template\/([^/]+)\/[^/]+\.vue$/)
    return match ? match[1] : null
  }

  // 模板中文标签映射（从 registry 复用）
  const LABEL_MAP: Record<string, string> = {}

  /** 初始化模板标签映射 */
  async function initTemplateLabels() {
    try {
      const registry = await import('../../web-template/template/registry')
      Object.assign(LABEL_MAP, registry.templates.reduce((acc: any, t: any) => {
        acc[t.key] = t.label
        return acc
      }, {}))
    } catch {
      // fallback: 使用 key 作为 label
    }
  }

  /** 获取所有可用模板列表 */
  function getAvailableTemplates(): TemplateItem[] {
    const templates: TemplateItem[] = []
    const seen = new Set<string>()

    for (const [path, sourceModule] of Object.entries(templateRawModules)) {
      const key = parseTemplatePath(path)
      if (!key || seen.has(key)) continue
      seen.add(key)

      const source = (sourceModule as string) || ''
      const panelCount = estimatePanelCount(source)

      templates.push({
        key,
        label: LABEL_MAP[key] || key,
        category: getTemplateCategory(key),
        categoryLabel: TEMPLATE_CATEGORY_LABELS[getTemplateCategory(key)],
        sourcePath: path,
        panelCount,
        architecture: source.includes('onUpdate') ? 'A' : source.includes('timeline') ? 'B' : 'unknown'
      })
    }

    return templates
  }

  // ==================== 初始化 ====================

  async function init() {
    try {
      await initTemplateLabels()
      isLoaded.value = true
    } catch (e: any) {
      loadError.value = e.message
      // 即使标签加载失败，组件列表仍然可用
      isLoaded.value = true
    }
  }

  // ==================== 便捷方法 ====================

  /** 检查组件是否已选中 */
  function isSelected(compName: string): boolean {
    return store.selectedComponents.some(c => c.name === compName)
  }

  /** 获取格式化的编辑摘要 */
  const summary = computed(() => {
    const parts: string[] = []
    if (store.componentCount > 0) {
      parts.push(`${store.componentCount} 个组件`)
    }
    if (store.selectedTemplate) {
      parts.push(`模板: ${store.selectedTemplate.label}`)
    }
    if (store.generatedPlans.length > 0) {
      parts.push(`${store.generatedPlans.length} 套方案`)
    }
    return parts.join(' | ') || '尚未选择'
  })

  return {
    // 状态
    store,
    isLoaded,
    loadError,
    summary,
    // 分类信息
    categoryLabels: CATEGORY_LABELS,
    categoryIcons: CATEGORY_ICONS,
    // 方法
    init,
    getAvailableComponents,
    getAvailableTemplates,
    parseComponentPath,
    isSelected,
    getTemplateCategory
  }
}
