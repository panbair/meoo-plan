# CardDataStream 数据流形变卡片

> 数据流驱动的动态形变卡片组件

## 特性

- 🌀 **形变入场** - 卡片从任意形状形变展开
- 🌊 **数据流动** - Canvas 动态数据流背景
- ✨ **形变悬停** - 卡片形变 + 发光效果
- 🎯 **滚动形变** - 滚动时卡片连续形变效果

## 主题风格

| 卡片 | 主题 | 颜色 |
|------|------|------|
| Neural Net | 神经网络 | 紫色 #8b5cf6 |
| Data Flow | 数据流处理 | 蓝色 #3b82f6 |
| Cloud Sync | 云端同步 | 青色 #06b6d4 |
| AI Core | AI 核心 | 金色 #f59e0b |

## 技术栈

- Vue 3 Composition API
- TypeScript
- GSAP + ScrollTrigger
- SCSS
- Canvas API

## 动画效果

### 入场动画
- 卡片从圆形/椭圆/矩形等初始形状**形变展开**
- 每个卡片有**不同的初始形变形状**
- 背景数据流淡入

### 滚动动画
- 卡片持续**形变扭曲**效果
- 位移 + 形变 + 旋转组合
- 背景数据流加速流动

### 悬停动画
- 卡片**进一步形变**突出
- 边缘发光形变
- 数据流聚焦效果

## 快速开始

```vue
<template>
  <CardDataStream />
</template>

<script setup lang="ts">
import CardDataStream from '@/views/web-list/card-list/CardDataStream/CardDataStream.vue'
</script>
```
