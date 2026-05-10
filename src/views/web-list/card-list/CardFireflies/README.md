# CardFireflies - 萤火虫效果卡片

## 简介

CardFireflies 是一个具有萤火虫效果的卡片组件，包含漂浮光点、光晕脉冲、粒子动画等，营造出梦幻般的森林夜晚氛围。

## 特性

- **萤火虫粒子** - 80个随机漂浮的萤火虫
- **光晕效果** - 脉冲发光的光晕背景
- **浮动光点** - 卡片周围的浮动光球
- **粒子动画** - 8个方向发射的粒子
- **环形旋转** - 图标周围的旋转光环
- **发光边框** - 周期性变化的发光边框

## 技术实现

- Vue 3 Composition API
- TypeScript 类型定义
- GSAP 动画引擎
- ScrollTrigger 滚动控制
- CSS 自定义属性动画
- SCSS 样式预处理

## 动画说明

| 动画类型 | 描述 |
|---------|------|
| 入场动画 | 卡片模糊弹出、光晕放大、图标旋转 |
| 滚动动画 | 卡片浮动、3D旋转、缩放 |
| 萤火虫 | 随机移动路径、闪烁发光 |
| 光晕脉冲 | 缩放和阴影周期性变化 |
| 浮动光点 | 上下浮动、光晕变化 |
| 环形旋转 | 持续旋转的边框 |

## 使用方式

```vue
<template>
  <CardFireflies />
</template>

<script setup lang="ts">
import CardFireflies from '@/views/web-list/card-list/CardFireflies/CardFireflies.vue'
</script>
```
