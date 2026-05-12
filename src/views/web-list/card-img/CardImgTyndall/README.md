# CardImgTyndall - 丁达尔深光·斜射光束背景视差

## 简介

暗色基底中斜贯画面的一束束丁达尔光束，光线中悬浮亿万微尘颗粒。

## 核心特性

- **三层视差背景**：森林剪影层、光柱层、微尘粒子层
- **斜射光束效果**：使用半透明渐变与 mix-blend-mode: screen
- **微尘粒子系统**：150个发光亮粒子，持续上浮动画
- **鼠标交互**：光柱偏转跟随，粒子受扰动飘散
- **色相呼吸**：青灰与暖金之间渐变

## 视差参数

| 层级 | 元素 | translateY 系数 | 速度 |
|------|------|-----------------|------|
| 远层 | 森林剪影 | 0.02 | 极慢 |
| 中层 | 光柱 | 0.1 | 缓慢 |
| 近层 | 微尘粒子 | 0.25 | 较快 |

## 使用方式

```vue
<template>
  <CardImgTyndall />
</template>

<script setup lang="ts">
import CardImgTyndall from '@/views/web-list/card-img/CardImgTyndall/CardImgTyndall.vue'
</script>
```

## ScrollTrigger 配置

| 参数 | 值 | 说明 |
|------|-----|------|
| trigger | container | 触发器元素 |
| start | 'top 100%' | 元素完全进入视口时开始 |
| end | 'bottom 20%' | 元素离开时结束 |
| scrub | 1.5 | 平滑系数 |
