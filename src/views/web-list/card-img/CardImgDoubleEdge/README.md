# CardImgDoubleEdge - 双锋交错 · 对角十字滑入

## 概述

图片被两条对角线十字分割，四块三角形遮罩沿各自对角线方向向外滑出，形成十字交错效果。

## 组件结构

```
card-img/CardImgDoubleEdge/
├── CardImgDoubleEdge.vue          # 组件源码
└── README.md                     # 本文档
```

## 设计规格

### 尺寸
- 宽度: 100vw
- 高度: 100vh

### 图片
- 来源: Unsplash 山景图
- 地址: https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80

## 核心特性

| 元素 | 描述 |
|------|------|
| **四块遮罩** | clip-path polygon 三角形 |
| **对角滑出** | 左上→左上, 右上→右上, 左下→左下, 右下→右下 |
| **刀锋边缘** | 各边不同色渐变描边 + 发光 |
| **十字闪光** | 中心交叉线瞬间闪过 |
| **亮度恢复** | 0.7 → 1.0 |

## 动画流程

```
初始状态 → 四块沿对角线滑出(50%) → 十字闪光(35-45%) → 亮度恢复(40-70%)
         → 标签淡入(50%) → 标题淡入(55%) → 副标题淡入(60%) → 按钮淡入(65%)
         → 进度条填充(30-80%)
```

## 动画参数

| 参数 | 值 |
|------|------|
| 滑出距离 | ±110% |
| 滑出时长 | 0.5s |
| 缓动 | `power3.inOut` |
| 闪光时长 | 0.15s + 0.2s |
| 亮度恢复 | 0.3s |
| Scrub | 1.5 |

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| imageUrl | `string` | Unsplash 山景 | 图片地址 |
| tag | `string` | 'DUAL SLASH' | 标签文字 |
| title | `string` | 'Mountain Peaks' | 标题 |
| subtitle | `string` | 'Where Earth Meets Sky' | 副标题 |
| ctaText | `string` | 'Discover More' | 按钮文字 |

## 使用示例

```vue
<template>
  <CardImgDoubleEdge
    image-url="https://images.unsplash.com/photo-xxxx"
    tag="CUSTOM TAG"
    title="Custom Title"
    subtitle="Custom Subtitle"
    cta-text="Learn More"
  />
</template>

<script setup lang="ts">
import CardImgDoubleEdge from './card-img/CardImgDoubleEdge/CardImgDoubleEdge.vue'
</script>
```

## 技术栈

- Vue 3 Composition API
- TypeScript
- GSAP + ScrollTrigger
- SCSS
