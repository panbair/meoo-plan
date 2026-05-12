# CardImgFeather - 轻羽上浮 · 模块淡隐退场

## 概述

长页面图文模块随滚动向上飘升、逐渐透明，呈现静谧高级的阅读终章感。反向滚动可原路恢复。

## 组件结构

```
card-img/CardImgFeather/
├── CardImgFeather.vue          # 组件源码
└── README.md                  # 本文档
```

## 设计规格

### 尺寸
- 宽度: 100vw
- 高度: 100vh

### 图片
- 来源: Unsplash
- 地址: https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1200&q=80

## 核心特性

| 元素 | 描述 |
|------|------|
| **轻羽上浮** | y: 0 → -40px 线性上浮 |
| **透明度渐隐** | opacity: 1 → 0 |
| **微缩效果** | scale: 1 → 0.96 |
| **轻微模糊** | blur: 0 → 1.5px |
| **内容同步** | 内容与卡片同步淡出 |
| **反向恢复** | 向上滚动可恢复 |

## 动画流程

### 入场动画
```
标签 → 标题 → 描述/元数据 → 按钮 → 底部装饰
```

### 滚动退出动画
```
向下滚动 → 卡片上浮(-40px) + 透明(1→0) + 缩放(1→0.96) + 模糊(0→1.5px)
```

## 动画参数

| 属性 | 初始值 | 终止值 | 说明 |
|------|--------|--------|------|
| y | 0 | -40px | 上浮距离 |
| opacity | 1 | 0 | 透明度 |
| scale | 1 | 0.96 | 微缩 |
| filter | blur(0) | blur(1.5px) | 轻度失焦 |

### ScrollTrigger

| 参数 | 值 |
|------|------|
| start | 'top top' |
| end | 'bottom top' |
| scrub | true (完全绑定滚动) |

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| imageUrl | `string` | Unsplash 图片 | 图片地址 |
| tag | `string` | 'SOFT TRANSITION' | 标签文字 |
| title | `string` | 'Gentle Breeze' | 标题 |
| description | `string` | 描述文字 | 副标题描述 |
| ctaText | `string` | 'Experience More' | 按钮文字 |

## 使用示例

```vue
<template>
  <CardImgFeather
    image-url="https://images.unsplash.com/photo-xxxx"
    tag="CUSTOM TAG"
    title="Custom Title"
    description="Your description text"
    cta-text="Learn More"
  />
</template>

<script setup lang="ts">
import CardImgFeather from './card-img/CardImgFeather/CardImgFeather.vue'
</script>
```

## 技术栈

- Vue 3 Composition API
- TypeScript
- GSAP + ScrollTrigger
- SCSS

## 设计特点

- **丝滑匀速**: 无缓动动画，完全线性同步滚动
- **克制设计**: 无粒子、无旋转，仅靠位移透明模糊联动
- **生理感知**: blur 模拟物体远离时的镜头轻微失焦
- **双向控制**: 向下滚动淡出，向上滚动恢复
