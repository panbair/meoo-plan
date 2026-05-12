# CardImgSink - 沉淀离去 · 优雅沉降退场

## 概述

长页面图文模块随滚动向深处沉降，伴随尺寸收缩、透明度递减与暗角收拢，呈现沉静隆重的谢幕感。反向滚动可优雅恢复。

## 组件结构

```
card-img/CardImgSink/
├── CardImgSink.vue          # 组件源码
└── README.md              # 本文档
```

## 设计规格

### 尺寸
- 宽度: 100vw
- 高度: 100vh

### 图片
- 来源: Unsplash 海洋
- 地址: https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&q=80

## 核心特性

| 元素 | 描述 |
|------|------|
| **沉降位移** | y: 0 → 50px 向深处沉降 |
| **透明度递减** | opacity: 1 → 0 |
| **尺寸收缩** | scale: 1 → 0.94 |
| **暗角收拢** | opacity: 0 → 0.25 |
| **轻微模糊** | blur: 0 → 1.2px |
| **内容同步** | 内容与卡片同步淡出 |

## 动画参数

| 属性 | 初始值 | 终止值 | 说明 |
|------|--------|--------|------|
| y | 0 | 50px | 沉降距离 |
| opacity | 1 | 0 | 透明度 |
| scale | 1 | 0.94 | 尺寸收缩 |
| vignette opacity | 0 | 0.25 | 暗角强度 |
| filter blur | 0 | 1.2px | 光学柔化 |

### ScrollTrigger

| 参数 | 值 |
|------|------|
| start | 'top top' |
| end | 'bottom top' |
| scrub | `true` (完全绑定滚动) |
| 缓动 | `none` (完全线性) |

## 动画流程

### 入场动画
```
徽章 → 标题 → 副标题 → 分隔线 → 描述 → 统计数据 → 按钮 → 底部装饰
```

### 滚动退场动画
```
向下滚动 → 卡片沉降(50px) + 透明(1→0) + 收缩(1→0.94) + 模糊(0→1.2px)
         → 暗角收拢(0→0.25) → 内容同步淡出
```

## 设计特点

- **庄重从容**: 向下沉降，呈现稳重仪式感
- **四维联动**: 位移 + 透明 + 收缩 + 模糊协同
- **暗角效果**: 聚光灯调暗的告别感
- **线性同步**: 完全线性，无缓动加速
- **双向控制**: 向下滚动淡出，向上滚动恢复

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| imageUrl | `string` | Unsplash 海洋图 | 图片地址 |
| badge | `string` | 'PREMIUM' | 徽章文字 |
| title | `string` | 'Deep Blue' | 标题 |
| subtitle | `string` | 'Where Silence Meets Majesty' | 副标题 |
| description | `string` | 描述文字 | 详情描述 |
| ctaText | `string` | 'Dive Deeper' | 按钮文字 |

## 使用示例

```vue
<template>
  <CardImgSink
    image-url="https://images.unsplash.com/photo-xxxx"
    badge="CUSTOM"
    title="Custom Title"
    subtitle="Custom Subtitle"
    description="Your description"
    cta-text="Learn More"
  />
</template>

<script setup lang="ts">
import CardImgSink from './card-img/CardImgSink/CardImgSink.vue'
</script>
```

## 技术栈

- Vue 3 Composition API
- TypeScript
- GSAP + ScrollTrigger
- SCSS
