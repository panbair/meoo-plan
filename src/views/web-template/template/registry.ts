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
  'zigzag-scroll': '之字滚动',
  'masonry-gallery': '瀑布流画廊',
  'stack-scroll': '卡片堆叠',
  'glitch-scroll': '故障滚动',
  'split-text-scroll': '逐字滚动',
  'vortex-scroll': '漩涡滚动',
  'counter-scroll': '计数滚动',
  'carousel-scroll': '轮播滚动',
  'expand-scroll': '展开式滚动',
  'transition-fade': '淡入淡出',
  'transition-slide-h': '水平滑动',
  'transition-slide-v': '垂直滑动',
  'transition-scale': '缩放弹出',
  'transition-rotate3d': '3D 翻转',
  'transition-elastic': '弹性弹跳',
  'transition-blur': '模糊过渡',
  'transition-clip': '裁剪过渡',
  'transition-skew': '倾斜扭曲',
  'transition-hue-shift': '色相轮转',
  'transition-fold': '纵向折叠',
  'transition-flyin': '空间飞入',
  'transition-spin': '2D螺旋入场',
  'transition-strips': '条带交错',
  'transition-zoom-blur': '缩放模糊',
  'transition-wipe': '扫光擦拭',
  'transition-mirror': '镜像翻面',
  'transition-swirl': '涡旋卷入',
  'transition-circle': '圆形扩散',
  'transition-cube': '立体旋转',
  'transition-burn': '烧灼消散',
  'transition-shatter': '碎片纷飞',
  'transition-swing': '钟摆荡入',
  'transition-wind': '风卷残云',
  'transition-pixel': '像素融化',
  'transition-glitch': '数字故障',
  'transition-reveal': '幕布揭幕',
  'transition-explode': '爆炸散开',
  'transition-flip-book': '翻书效果',
  'transition-liquid': '液体波纹'
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
