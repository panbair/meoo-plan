# CardGalaxy - 星系效果卡片

## 简介

CardGalaxy 是一个具有宇宙星系效果的卡片组件，包含黑洞、行星、彗星、旋转轨道等动画效果，营造出深邃神秘的太空氛围。

## 特性

- **黑洞效果** - 中央黑洞带有脉冲光晕动画
- **行星轨道** - 行星沿椭圆轨道旋转
- **彗星动画** - 彗星沿曲线路径划过
- **动态星空背景** - Canvas 绘制的流动星空
- **星云层** - 多层渐变星云效果
- **3D 透视** - 卡片具有 3D 翻转和悬浮效果

## 技术实现

- Vue 3 Composition API
- TypeScript 类型定义
- GSAP 动画引擎
- ScrollTrigger 滚动控制
- Canvas 绘制星空背景
- SCSS 样式预处理

## 动画说明

| 动画类型 | 描述 |
|---------|------|
| 入场动画 | 卡片 3D 弹出，图标旋转放大 |
| 滚动动画 | 卡片 3D 旋转、缩放、悬浮 |
| 黑洞脉冲 | 阴影和光晕周期性变化 |
| 轨道旋转 | 轨道环持续旋转 |
| 行星自转 | 行星自转加悬浮 |
| 彗星轨迹 | 沿曲线路径往复运动 |
| 光芒旋转 | 背景光芒缓慢旋转 |

## 使用方式

```vue
<template>
  <CardGalaxy />
</template>

<script setup lang="ts">
import CardGalaxy from '@/views/web-list/card-list/CardGalaxy/CardGalaxy.vue'
</script>
```
