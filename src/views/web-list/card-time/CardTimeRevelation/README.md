# CardTimeRevelation

对角线揭幕动画卡片 - 神秘叙事，层层显露

## 效果描述

卡片初始被 `clip-path` 完全隐藏，滚动触发后，裁剪区域从左上角向右下角推移，同时卡片的阴影和边框渐显，带来"展开画卷"的仪式感。

## 特性

- 对角线揭幕动画 (`clip-path: inset()`)
- 卡片滚动控制动画 (ScrollTrigger)
- 入场动画 (GSAP Timeline)
- 持续浮动动画
- 背景网格动态效果
- 响应式设计

## 技术栈

- Vue 3 Composition API
- TypeScript
- GSAP + ScrollTrigger
- SCSS
