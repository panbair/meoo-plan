# CardTimeNeon

霓虹边框脉冲动画卡片 - 赛博轻奢，呼吸光感

## 效果描述

卡片初始为半透明暗色状态，Timeline 控制依次点亮边框颜色并释放脉冲光晕，最后稳定在低亮度呼吸灯状态。通过 `box-shadow` 和 `border-color` 的循环动画模拟霓虹灯管效果。

## 特性

- 霓虹脉冲呼吸动画 (`boxShadow` 循环)
- 边框渐亮入场动画
- 卡片滚动控制动画 (ScrollTrigger)
- 入场动画 (GSAP Timeline)
- 扫描线动效
- 背景网格效果
- 响应式设计

## 技术栈

- Vue 3 Composition API
- TypeScript
- GSAP + ScrollTrigger
- SCSS
