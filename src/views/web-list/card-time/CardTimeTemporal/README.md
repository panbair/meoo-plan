# CardTemporal

时空裂隙卡片组件 - 展示时间扭曲与时空异常的震撼视觉效果。

## 效果特点

- **时空裂缝**: 多层环形裂缝动态缩放效果
- **时间粒子**: 向上漂浮的时间粒子动画
- **时钟指针**: 卡片中的动态时钟指针旋转
- **卡片入场**: 缩放 + 旋转 + 弹性登场
- **滚动交互**: ScrollTrigger 控制的卡片缩放和扭曲效果
- **标题/底部**: 滚动消失动画

## 技术实现

- Vue 3 Composition API
- GSAP + ScrollTrigger 动画
- SCSS 动画和渐变
- 响应式设计
- 动态 DOM 创建管理

## 使用方式

```vue
<template>
  <CardTemporal />
</template>

<script setup>
import CardTemporal from './CardTemporal/CardTemporal.vue'
</script>
```
