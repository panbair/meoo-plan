# CardGradientWave 渐变波浪卡片

> 渐变波浪流动的动态卡片组件

## 特性

- 🌊 **波浪动画** - 持续流动的渐变波浪
- 🎨 **渐变消失** - 卡片滚动时渐变淡出
- ✨ **位移旋转缩放渐变** - 完整的滚动动画组合
- 🎯 **多层波浪** - 3层不同速度的波浪叠加

## 主题风格

| 卡片 | 主题 | 渐变 |
|------|------|------|
| Ocean Wave | 海洋波浪 | 蓝色系 |
| Sunset Glow | 日落余晖 | 橙红系 |
| Forest Mist | 森林迷雾 | 绿色系 |
| Aurora Sky | 极光天空 | 紫绿系 |

## 技术栈

- Vue 3 Composition API
- TypeScript
- GSAP + ScrollTrigger
- SCSS

## 动画效果

### 入场动画
- 标题从两侧飞入
- 波浪从底部升起
- 卡片依次淡入

### 滚动动画
- **位移** - 向上移动
- **旋转** - Y轴旋转
- **缩放** - 逐渐缩小
- **渐变** - 透明度消失

### 悬停动画
- 波浪加速
- 卡片上浮

## 快速开始

```vue
<template>
  <CardGradientWave />
</template>

<script setup lang="ts">
import CardGradientWave from '@/views/web-list/card-list/CardGradientWave/CardGradientWave.vue'
</script>
```
