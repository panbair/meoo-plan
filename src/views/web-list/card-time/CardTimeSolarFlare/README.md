# CardSolarFlare

太阳耀斑卡片组件 - 展示恒星能量喷发的震撼视觉效果。

## 效果特点

- **太阳核心脉冲**: 动态光晕和脉冲效果模拟真实太阳
- **耀斑粒子**: 从中心向外喷发的光粒子效果
- **能量波纹**: 同心圆向外扩散的能量环动画
- **卡片入场**: 底部淡入 + 依次上浮的入场动画
- **滚动交互**: ScrollTrigger 控制的卡片旋转和发光效果

## 技术实现

- Vue 3 Composition API
- GSAP + ScrollTrigger 动画
- SCSS 动画和渐变
- 响应式设计

## 使用方式

```vue
<template>
  <CardSolarFlare />
</template>

<script setup>
import CardSolarFlare from './CardSolarFlare/CardSolarFlare.vue'
</script>
```
