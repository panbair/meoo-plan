# CardTimePageFlip

3D 翻页波浪动画卡片 - 品牌叙事，高级翻书感

## 效果描述

卡片像书页一样连续从左向右翻转，利用 `rotationY` 和 `transformOrigin` 控制旋转轴，配合 `backface-visibility` 隐藏背面。Timeline 按顺序错开，形成波浪般的翻页效果，极适合展示系列产品。

## 特性

- 3D 翻页动画 (`rotationY: -180deg`)
- 卡片正反面设计 (front/back)
- 卡片滚动控制动画 (ScrollTrigger)
- 入场动画 (GSAP Timeline)
- 持续翻页波浪动画
- Hover 翻页交互
- 响应式设计

## 技术栈

- Vue 3 Composition API
- TypeScript
- GSAP + ScrollTrigger
- SCSS
