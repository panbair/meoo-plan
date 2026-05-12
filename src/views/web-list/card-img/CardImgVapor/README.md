# CardImgVapor - 蒸腾散逸 · 日晕升华退场

## 概述

长页面图文模块随滚动向上升华散逸，如清晨薄霜被阳光照射。模块自下而上分层消融，边缘散发金色光晕，呈现物质从固态升华为气态的诗意过程。

## 组件结构

```
card-img/CardImgVapor/
├── CardImgVapor.vue          # 组件源码
└── README.md               # 本文档
```

## 设计规格

### 尺寸
- 宽度: 100vw
- 高度: 100vh

### 图片
- 来源: Unsplash 山景日出
- 地址: https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80

## 核心特性

| 元素 | 描述 |
|------|------|
| **分层升华** | 三层纵向分区，自下而上依次消散 |
| **金色光晕** | box-shadow 暖色弥散，opacity 0→0.4→0 |
| **升华粒子** | 40 颗金色微粒向上飘散 |
| **日出背景** | 底部径向渐变日光 |
| **光束效果** | 12 条日出光束脉冲动画 |

## 动画参数

### 分层升华

| 分区 | y 位移 | opacity | blur | stagger |
|------|--------|---------|------|---------|
| 底部 | -80px | 0 | 3px | 0s |
| 中部 | -60px | 0 | 2px | 0.05s |
| 顶部 | -40px | 0 | 1px | 0.1s |

### ScrollTrigger

| 参数 | 值 |
|------|------|
| start | 'top top' |
| end | 'bottom top' |
| scrub | `true` |

## 动画流程

### 入场动画
```
日出显现 → 光晕出现 → 标签/标题 → 副标题 → 描述 → 按钮
```

### 升华退场
```
滚动 → 底部层先升华 → 中部紧随 → 顶部最后 → 光晕脉冲 → 粒子飘散
```

### 凝聚恢复
```
反向滚动 → 各层归位 → 粒子沉降 → 完整恢复
```

## 设计特点

- **物理模拟**: 模拟固态升华为气态的过程
- **分层效果**: 自下而上分层消融的物理感
- **金色光晕**: 日晕升华时的晨光折射
- **粒子系统**: 40 颗金色微粒随机飘散
- **双向控制**: 升华与凝聚完全可逆

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| imageUrl | `string` | Unsplash 山景 | 图片地址 |
| tag | `string` | 'SUBLIMATION' | 标签文字 |
| title | `string` | 'Morning Light' | 标题 |
| subtitle | `string` | 'Where Dreams Rise...' | 副标题 |
| description | `string` | 描述文字 | 详情描述 |
| ctaText | `string` | 'Ascend Together' | 按钮文字 |

## 使用示例

```vue
<template>
  <CardImgVapor
    image-url="https://images.unsplash.com/photo-xxxx"
    tag="CUSTOM TAG"
    title="Custom Title"
    subtitle="Custom Subtitle"
    description="Your description"
    cta-text="Learn More"
  />
</template>

<script setup lang="ts">
import CardImgVapor from './card-img/CardImgVapor/CardImgVapor.vue'
</script>
```

## 技术栈

- Vue 3 Composition API
- TypeScript
- GSAP + ScrollTrigger
- SCSS
