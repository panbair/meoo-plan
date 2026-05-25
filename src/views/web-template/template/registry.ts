/**
 * ==================== 模板自动化注册表 ====================
 *
 * 约定：每个模板位于 template/{folder}/{folder}.vue
 * 新增模板时只需两步：
 *   1. 创建 template/{xxx}/{xxx}.vue
 *   2. 在 LABEL_MAP 中添加 {xxx: '中文名'}
 *
 * 使用方式：
 *   import { templates, firstKey } from './template/registry'
 */

import type { Component } from 'vue'
import { markRaw } from 'vue'

// ═══════════════════════════════════════════
// 标签映射表（folderName → 中文标签）
// 新增模板时只需在这里加一行
// ═══════════════════════════════════════════
const LABEL_MAP: Record<string, string> = {
  'infinite-scroll': '纵向无限滚动',
  'horizontal-scroll': '横向无限滚动',
  'parallax-scroll': '多层视差滚动',
  'stagger-reveal': '交错卡片渐现',
  'fake-horizontal-scroll': '竖滚横移',
  'glassmorphism-showcase': '毛玻璃展示',
  'timeline-scroll': '时间线滚动',
  'split-scroll': '分屏滚动',
  'transition-fade': '淡入淡出',
  'transition-slide-h': '水平滑动',
  'transition-slide-v': '垂直滑动',
  'transition-scale': '缩放弹出',
  'transition-rotate3d': '3D 翻转',
  'transition-elastic': '弹性弹跳',
  'transition-blur': '模糊过渡'
}

// ═══════════════════════════════════════════
// Vite glob 自动发现所有 template/*/name.vue
// ═══════════════════════════════════════════
const modules = import.meta.glob<{ default: Component }>('./*/*.vue', { eager: true })
// 解析结果示例：
//   './infinite-scroll/infinite-scroll.vue' → { default: InfiniteScroll }
//   './transition-fade/transition-fade.vue' → { default: TransitionFade }

// ═══════════════════════════════════════════
// 构建模板列表
// ═══════════════════════════════════════════
interface TemplateItem {
  key: string
  label: string
  com: Component
}

const rawTemplates: TemplateItem[] = []

for (const [path, mod] of Object.entries(modules)) {
  // 从 './{folder}/{file}.vue' 中提取 folder 名
  const match = path.match(/^\.\/([^/]+)\/[^/]+\.vue$/)
  if (!match) {
    continue
  }

  const folder = match[1]
  const com = mod.default
  if (!com) {
    continue
  }

  const label = LABEL_MAP[folder]

  rawTemplates.push({
    key: folder,
    label: label || folder, // 未配置中文名时回退到文件夹名
    com: markRaw(com)
  })
}

// ═══════════════════════════════════════════
// 导出
// ═══════════════════════════════════════════
export const templates: ReadonlyArray<TemplateItem> = rawTemplates

/** 第一个模板的 key（用于默认选中） */
export const firstKey: string = rawTemplates[0]?.key ?? ''
