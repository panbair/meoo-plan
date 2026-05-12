# CardImgMirror - 镜湖倒影 · 涟漪视差映像

## 概述

全屏镜湖倒影效果组件，通过上下分层视差、SVG 水纹滤镜、点击涟漪交互等效果，营造出平静湖面倒影的沉浸式视觉体验。

## 层级结构

```
┌─────────────────────────────────────┐
│  mirror-content (内容层)            │ z-20
├─────────────────────────────────────┤
│  ripple-container (涟漪层)          │ z-10
├─────────────────────────────────────┤
│  horizon-line (水平分割线)           │ z-4
├─────────────────────────────────────┤
│  mirror-reflection (倒影层)         │ z-3
│  └─ SVG water-displacement 滤镜    │
├─────────────────────────────────────┤
│  mirror-real (真实景物层)           │ z-2
├─────────────────────────────────────┤
│  bg-sky (天空背景)                   │ z-1
└─────────────────────────────────────┘
```

## 核心特性

### 1. 上下视差滚动
- 真实层：速度系数 0.04（极缓慢下移）
- 倒影层：速度系数 -0.1（向上浮升）
- 中线处产生微妙错位

### 2. 水纹波动
- SVG `feTurbulence` + `feDisplacementMap` 滤镜
- `scale` 低频正弦波动（2 ~ 3.5）
- `baseFrequency` 随滚动微调

### 3. 涟漪交互
- 点击水面区域激起涟漪
- 水面悬停自动产生小涟漪
- 涟漪扩散动画：scale 0→3，opacity 0.6→0
- 局部亮度增强效果

### 4. 色调过渡
- 滚动驱动 `hue-rotate()` 变化
- 晨曦金粉 → 午后清蓝
- 时间进度条实时更新

### 5. 倒影效果
- 图片垂直翻转
- 压暗叠加层
- 绿色水波色调

## 技术实现

### SVG 水纹滤镜
```xml
<feTurbulence type="fractalNoise" baseFrequency="0.015 0.02" />
<feDisplacementMap scale="3" />
```

### 涟漪动画
```typescript
gsap.fromTo(ripple, {
  scale: 0,
  opacity: 0.6,
  borderWidth: 4
}, {
  scale: 3,
  opacity: 0,
  duration: 1.5,
  ease: 'power2.out'
})
```

### 视差配置
```typescript
// 真实层
gsap.to(realLayerRef, { yPercent: 4, scrub: 1.5 })

// 倒影层
gsap.to(reflectionLayerRef, { yPercent: -10, scrub: 1.5 })
```

## 交互说明

| 交互 | 位置 | 效果 |
|------|------|------|
| 点击 | 下半屏 | 激起圆形涟漪 |
| 悬停 | 下半屏 | 800ms 后自动产生小涟漪 |
| 滚动 | 全屏 | 视差 + 色调变化 |

## 使用说明

```vue
<template>
  <CardImgMirror />
</template>

<script setup>
import CardImgMirror from '@/views/web-list/card-img/CardImgMirror/CardImgMirror.vue'
</script>
```

## 兼容性

- 需要 SVG 滤镜支持
- 需要 CSS backdrop-filter 支持
- 建议在现代浏览器中使用
