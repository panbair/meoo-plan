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
  'panorama-drift': '竖滚横移·变体',
  'snap-chapters': '吸附章节·变体',
  'horizontal-scroll': '横向无限滚动',
  'parallax-scroll': '多层视差滚动',
  'stagger-reveal': '交错卡片渐现',
  'fake-horizontal-scroll': '竖滚横移',
  'glassmorphism-showcase': '毛玻璃展示',
  'timeline-scroll': '时间线滚动',
  'split-scroll': '分屏滚动',
  'contrast-split': '对比分屏',
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
  'transition-liquid': '液体波纹',
  'transition-fold-explode': '折叠爆炸',
  'transition-liquid-pixel': '液体像素',
  'transition-neon-slice': '霓虹切片',
  'transition-shutter-wind': '百叶风吹',
  'transition-vortex-unveil': '漩涡揭开',
  'neon-city': '霓虹都市',
  'folding-universe': '折叠宇宙',
  'memory-fragments': '记忆碎片',
  'light-theater': '光影剧场',
  'elemental-portals': '元素之门',
  'liquid-sculpture': '液体雕塑',
  'kaleidoscope-world': '万花筒',
  'chrono-gallery': '时空画廊',
  'storm-eye': '风暴之眼',
  'digital-deconstruction': '数字解体',
  'mirror-world': '镜中世界',
  'calligraphy-flow': '书法流韵',
  metamorphosis: '蜕变',
  'pixel-evolution': '像素进化',
  'gravity-shift': '重力偏移',
  'theater-curtain': '剧场帷幕',
  'dimension-blur': '维度模糊',
  'z-tunnel': 'Z轴隧道',
  'gallery-wander': '画廊漫游',
  'mobius-strip': '莫比乌斯环',
  'fractal-recursion': '分形递归',
  'parallel-universe': '平行宇宙',
  'speed-corridor': '变速走廊',
  'cross-hatch': '十字网格',
  'spiral-descent': '螺旋下降',
  'elevator-lobby': '电梯大堂',
  'snake-path': '贪吃蛇路径',
  'cube-navigator': '魔方导航',
  'double-helix': '双螺旋',
  'two-d-gallery': '二维画廊',
  'scroll-drift-grid': '滚动漂移网格',
  'perspective-tilt': '3D透视倾斜',
  'scroll-lens-focus': '滚动聚焦透镜',
  'scroll-wave-grid': '滚动行波网格',
  'scroll-orbit-grid': '滚动轨道旋转',
  'scroll-scan-reveal': '滚动扫描揭示',
  'scroll-pendulum-grid': '滚动钟摆网格',
  'scroll-spread-gather': '滚动呼吸收放',
  'scroll-magnet-pull': '滚动磁力拉扯',
  'scroll-gravity-depression': '滚动重力凹陷',
  'scroll-echo-grid': '滚动回音网格',
  'scroll-prism-refract': '滚动棱镜折射',
  'scroll-strobe-freeze': '滚动频闪定格',

  // ══════ scroll-* 滚动特效补充 ══════
  'scroll-alternate-slide': '交替滑动',
  'scroll-blinds-reveal': '百叶窗揭示',
  'scroll-book-flip': '翻书翻转',
  'scroll-bullet-screen': '弹幕滚动',
  'scroll-card-fan': '卡片扇形',
  'scroll-carousel-ring': '环形轮播',
  'scroll-chess-flip': '棋盘翻转',
  'scroll-clock-wipe': '时钟擦除',
  'scroll-conveyor-belt': '传送带滚动',
  'scroll-crossfade-stack': '交叉叠化',
  'scroll-curtain-peel': '帷幕剥离',
  'scroll-depth-dive': '纵深潜入',
  'scroll-diagonal-slide': '对角线滑动',
  'scroll-diamond-path': '钻石路径',
  'scroll-door-open': '开门效果',
  'scroll-elevator-ride': '电梯升降',
  'scroll-film-reel': '胶片卷动',
  'scroll-flat-to-3d': '平面转3D',
  'scroll-h-then-v': '先横后纵',
  'scroll-helix-tower': '螺旋塔',
  'scroll-infinite-horizontal': '无限横向滚动',
  'scroll-iris-open': '虹膜开合',
  'scroll-loop-conveyor': '循环传送带',
  'scroll-magnet-assemble': '磁力组合',
  'scroll-matrix-rain': '矩阵雨',
  'scroll-multi-direction': '多向滚动',
  'scroll-orbit-wheel': '轨道转盘',
  'scroll-origami-unfold': '折纸展开',
  'scroll-parallax-depth': '深度视差',
  'scroll-parallax-layers': '多层视差',
  'scroll-parallax-split': '分裂视差',
  'scroll-pendulum-swing': '钟摆摇荡',
  'scroll-picture-in-picture': '画中画',
  'scroll-quad-corner': '四角展收',
  'scroll-radar-scan': '雷达扫描',
  'scroll-ripple-reveal': '涟漪揭示',
  'scroll-rotate-reveal': '旋转揭示',
  'scroll-rubber-stretch': '橡皮拉伸',
  'scroll-sand-hourglass': '沙漏翻转',
  'scroll-shutter-split': '快门分割',
  'scroll-slot-machine': '老虎机',
  'scroll-snake-path': '蛇形路径',
  'scroll-spiral-in': '螺旋卷入',
  'scroll-split-merge': '分裂合并',
  'scroll-telescope-zoom': '望远镜变焦',
  'scroll-typewriter': '打字机效果',
  'scroll-u-turn': 'U型转弯',
  'scroll-v-h-v': '纵横纵',
  'scroll-v-then-h': '先纵后横',
  'scroll-zigzag-drift': '之字漂移',
  'scroll-zoom-lane': '变焦车道'
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
