# CardImgParallax 多维视差悬浮组件

## 概述

深空拆解·多维零件视差悬浮组件，将图片拆解为多个核心零件，悬浮于深色三维空间中，各组件分布在不同的 Z 轴深度层，缓慢自转并保持微弱的上下呼吸浮动。

## 特性

| 特性 | 描述 |
|------|------|
| 3D 视差 | CSS perspective 构建真实景深空间，多层差异化位移 |
| 鼠标响应 | 鼠标位置映射为整体场景的 rotateX/Y 微幅偏转 |
| 悬浮动画 | 组件缓慢自转 + 呼吸浮动，duration 随机 |
| 点击交互 | 点击组件飞向镜头并展开细节，其余后退虚化 |
| ScrollTrigger | 滚动驱动各层以不同速度系数位移 |

## 技术实现

- Vue 3 Composition API + TypeScript
- GSAP + ScrollTrigger 动画
- CSS 3D Transform + Perspective
- 响应式设计

## 使用方式

```vue
<template>
  <CardImgParallax />
</template>

<script setup lang="ts">
import CardImgParallax from '@/views/web-list/card-img/CardImgParallax/CardImgParallax.vue'
</script>
```
