# CardImageVerticalInfiniteZoom

一个 100vw x 100vh 的纵向无限滚动图片组件，核心是“镜头推拉”：

- 用户竖向滚动时，当前图片持续放大并逐步退场
- 下一张图片从后景接力入场
- 全程使用 `ScrollTrigger` + `scrub` 驱动，保证滚动和动画同步

## 特性

- Vue 3 + TypeScript + GSAP
- 使用 `ref` 精确绑定 DOM，避免 class 选择器冲突
- 每张卡片都有独立的滚动控制动画
- 入场动画 + 进度条反馈
- 完整清理逻辑（`onUnmounted` 统一销毁）

## 图片来源

全部来自 Unsplash：`https://images.unsplash.com`

