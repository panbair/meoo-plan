# CardTimeTypography

文字分批浮刻动画卡片 - 极简奢侈，细节质感

## 效果描述

卡片内部的文字不是整体淡入，而是每个字符以细微时间差螺旋上升，同时字间距微微收紧，最后稳定。每个字符独立动画控制。

## 特性

- 字符级逐字动画 (每个 `.char` 独立 GSAP 控制)
- 字符旋转上升 (`rotateX: -45`, `y: 20`)
- 卡片滚动控制动画 (ScrollTrigger)
- 入场动画 (GSAP Timeline)
- 持续浮动动画
- 渐变文字效果
- 响应式设计

## 技术栈

- Vue 3 Composition API
- TypeScript
- GSAP + ScrollTrigger
- SCSS
