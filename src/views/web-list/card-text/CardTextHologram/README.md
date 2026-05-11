# CardTextHologram - 体全息扫描组件

## 概述

体全息扫描效果组件，模拟激光平面在空间中逐层扫描文字全息影像的震撼视觉效果。

## 效果特点

### 🎯 核心动画
- **分层文字**：文字被分解为 20 层超薄截面，模拟全息深度
- **激光扫描平面**：明亮的扫描线自下而上移动，经过时逐层点亮文字
- **色散效果**：RGB 三色分离拖尾，模拟真实光学色散
- **鼠标视差**：移动鼠标时各层根据深度系数反向平移

### ✨ 视觉元素
- **全息基台**：深色暗室背景配绿色发光效果
- **栅格光栅**：流动的扫描线纹理增强科技感
- **粒子系统**：漂浮的绿色光点营造空间氛围
- **呼吸浮动**：文字持续低频上下浮动

### 🔧 技术实现
- **Vue 3 Composition API** + TypeScript
- **GSAP** + **ScrollTrigger** 驱动动画
- **CSS 3D Transforms** 实现分层效果
- **Canvas** 绘制粒子系统

## 使用方式

```vue
<template>
  <CardTextHologram
    title="HOLOGRAM"
    subtitle="VOLUMETRIC DISPLAY"
    :paragraphs="['段落内容1', '段落内容2']"
    :layer-count="20"
    font-size="clamp(3rem, 12vw, 8rem)"
    font-weight="700"
    scan-color="#00ff88"
    :auto-play="true"
    @animation-start="onStart"
    @animation-complete="onComplete"
    @scroll-progress="onProgress"
  />
</template>

<script setup>
import CardTextHologram from './CardTextHologram/CardTextHologram.vue'
</script>
```

## Props 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | `'HOLOGRAM'` | 主标题文字 |
| `subtitle` | `string` | `''` | 副标题文字 |
| `paragraphs` | `string[]` | `[]` | 段落内容数组 |
| `layer-count` | `number` | `20` | 全息分层数量 |
| `font-size` | `string` | `clamp(3rem, 12vw, 8rem)` | 标题字号 |
| `font-weight` | `number` | `700` | 标题字重 |
| `scan-color` | `string` | `'#00ff88'` | 扫描线颜色 |
| `auto-play` | `boolean` | `true` | 是否自动播放 |

## Emits 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| `animation-start` | - | 动画开始时触发 |
| `animation-complete` | - | 动画完成时触发 |
| `scroll-progress` | `progress: number` | 滚动进度 0-100 |

## 动画流程

1. **扫描平面入场**：激光平面从下方滑入
2. **逐层点亮**：滚动触发扫描线，每层依次显影
3. **标题显形**：文字从模糊到清晰
4. **色散叠加**：RGB 三色分离效果
5. **内容显现**：副标题和段落淡入
6. **呼吸浮动**：完成后文字持续上下浮动

## 交互效果

- **鼠标移动**：产生视差效果，各层文字偏移
- **滚动控制**：滚轮控制扫描进度
- **重播按钮**：点击重新播放动画
