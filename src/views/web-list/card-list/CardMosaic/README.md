# CardMosaic - 马赛克效果卡片

## 简介

CardMosaic 是一个具有马赛克/碎片效果的卡片组件，包含碎片重组、裂纹动画、网格背景等，营造出像素艺术和拼图美学的氛围。

## 特性

- **碎片动画** - 12个随机漂浮的菱形碎片
- **裂纹效果** - SVG绘制的动态裂纹
- **马赛克网格** - 4x4 的马赛克瓦片阵列
- **边框动画** - 四角边框脉冲发光
- **碎片背景** - Canvas绘制的漂浮碎片
- **网格覆盖层** - 科技感网格背景

## 技术实现

- Vue 3 Composition API
- TypeScript 类型定义
- GSAP 动画引擎
- ScrollTrigger 滚动控制
- Canvas 碎片背景
- SVG 裂纹绘制
- SCSS 样式预处理

## 动画说明

| 动画类型 | 描述 |
|---------|------|
| 入场动画 | 卡片弹性弹出、马赛克瓦片逐个放大 |
| 滚动动画 | 卡片 3D 旋转、浮动、斜切 |
| 碎片漂浮 | 12个碎片随机漂浮移动 |
| 裂纹动画 | SVG路径绘制动画 |
| 瓦片脉冲 | 马赛克瓦片边框发光 |
| 边框脉冲 | 四角边框宽度变化 |

## 使用方式

```vue
<template>
  <CardMosaic />
</template>

<script setup lang="ts">
import CardMosaic from '@/views/web-list/card-list/CardMosaic/CardMosaic.vue'
</script>
```
