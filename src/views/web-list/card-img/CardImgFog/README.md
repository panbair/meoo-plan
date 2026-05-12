# CardImgFog - 雾海山峦 · 多层雾气视差

多层雾气叠加的动态背景效果，模拟山间云海翻涌的壮观景象。

## 核心特性

- **多层雾气系统**: 远景山峦 + 三层雾气视差
- **SVG 滤镜**: feTurbulence + feColorMatrix 生成动态雾气
- **鼠标交互**: 光标推动雾气流动
- **时间流逝**: 晨雾到暮霭的色调变化

## 层级结构

| 层级 | 内容 | 速度系数 | 混合模式 | z-index |
|------|------|----------|----------|---------|
| 1 | 远景山峦 | 0.04 | - | 1 |
| 2 | 中景薄雾 | 0.1 | soft-light | 2 |
| 3 | 近景浓雾 | 0.15 | screen | 3 |
| 4 | 极近浓雾团 | 0.22 | overlay | 4 |

## 动画说明

### 滚动视差
- 各层以不同速度垂直漂移
- 形成空气透视式深度感
- scrub 平滑系数: 1.5

### 雾气蠕动
- SVG feTurbulence 持续更新
- baseFrequency 低频正弦波动
- 100ms 刷新周期

### 鼠标交互
- 移动鼠标推开附近雾气
- 鼠标离开后弹性回流
- 模拟微风效果

## 使用方式

```vue
<template>
  <CardImgFog />
</template>

<script setup>
import CardImgFog from '@/views/web-list/card-img/CardImgFog/CardImgFog.vue'
</script>
```

## 图片来源

- 山峦: [Unsplash Mountain](https://images.unsplash.com/photo-1506905925346-21bda4d32df4)
