# CardImage3DScrollNative — 原生 CSS 滚动驱动动画

## 概述

告别 JS 的 `scroll` 事件监听。利用全新的 `animation-timeline: scroll()` 将 3D 变换直接与页面滚动进度绑定——零 JavaScript 滚动监听，浏览器原生合成器线程驱动，黄油般顺滑的 60fps。

## 黑科技原理

```css
/* 🔑 以前: 需要JS监听scroll → 更新transform */
window.addEventListener('scroll', () => { ... })  // ❌ 主线程阻塞

/* 🔑 现在: CSS原生接管一切 */
.card {
  animation: rotate3d 1s linear;
  animation-timeline: scroll(root);  /* ← 绑定到根滚动! */
  animation-range: 0% 100%;          /* ← 控制触发区间 */
}
/* ✅ 浏览器合成器线程 → 零主线程开销 → 60fps */
```

## 4种原生滚动动画

| 卡片 | @keyframes | animation-range | 效果 |
|------|-----------|----------------|------|
| 1 | rotateY 0→360° | 0%→100% | 完整旋转 |
| 2 | translateZ -300→+200 + scale + blur | 10%→90% | 远处飞来+模糊 |
| 3 | rotateX -90°→+45° + opacity | 20%→100% | 翻转淡入 |
| 4 | rotateY+translateZ+scale 4阶段 | 0%→100% | 组合3D |

## 对比

| 维度 | JS ScrollTrigger | CSS animation-timeline |
|------|-----------------|----------------------|
| 代码量 | ~50行JS | **0行JS** (纯CSS) |
| 性能 | 主线程 rAF | **合成器线程** |
| 帧率 | 依赖JS执行 | **保证60fps** |
| 内存 | GSAP库 + ST实例 | **0额外内存** |
| 浏览器 | 全兼容 | Chrome 115+ (2023.8) |
| 调试 | JS断点 | **DevTools Animation面板** |

## 进度指示器

顶部/底部进度条也由 `animation-timeline: scroll(root)` 驱动——零JS的纯CSS进度条。

## 浏览器支持

- ✅ Chrome 115+, Edge 115+ (2023年8月)
- 🚧 Firefox: 开发中 (layout.css.scroll-driven-animations.enabled)
- 🚧 Safari: 开发中

## 技术要点

- 🔑 `animation-timeline: scroll(root)` — 零JS滚动绑定
- 🔑 `animation-range: 0% 100%` — 精确控制触发区间
- 🔑 4张卡片各自独立的 @keyframes + animation-range
- 🔑 进度条也由 scroll() timeline 驱动
- 浏览器合成器线程 → 主线程零负担
- 仅入场动画使用 GSAP（滚动动画完全纯CSS）
