# CardImgThermal - 热力对流 · 红外视差漫游

## 概述

热成像风格的全屏图片展示组件，通过三层温度分层、动态等温线、鼠标热源追踪等效果，营造出热成像仪的视觉体验。

## 层级结构

```
┌─────────────────────────────────────┐
│  thermal-content (内容层)           │ z-20
├─────────────────────────────────────┤
│  heat-spot / heat-glow (热源追踪)   │ z-10
├─────────────────────────────────────┤
│  thermal-contour (等温线 SVG)       │ z-5
├─────────────────────────────────────┤
│  thermal-noise (噪点层)              │ z-4
├─────────────────────────────────────┤
│  thermal-hot (暖色表层)             │ z-3
├─────────────────────────────────────┤
│  thermal-mid (中温过渡层)           │ z-2
├─────────────────────────────────────┤
│  thermal-cold (冷色底层)            │ z-1
└─────────────────────────────────────┘
```

## 三层温度系统

| 层级 | 速度系数 | 混合模式 | 色温效果 |
|------|---------|---------|---------|
| 暖色表层 | 0.32 | luminosity | hue-rotate(-20deg) 暖橙色 |
| 中温过渡层 | 0.18 | overlay | hue-rotate(100deg) 黄绿色 |
| 冷色底层 | 0.06 | screen | hue-rotate(200deg) 深蓝色 |

## 核心特性

### 1. 三层视差滚动
- `ScrollTrigger` 驱动各层 `translateY`
- 速度差异化：暖层最快、冷层最缓
- 营造温度分层深度感

### 2. 动态等温线
- SVG `feTurbulence` + `feDisplacementMap` 滤镜
- `baseFrequency` 以极低频正弦波变化
- 等温线蠕动效果

### 3. 鼠标热源追踪
- 热源光斑跟随鼠标移动
- 局部亮度/色温响应
- 热惯性衰减回基线

### 4. 噪点呼吸
- 极细噪点层 `opacity` 周期性变化
- 强化热成像仪器质感

### 5. 实时温度数据
- 根据滚动进度动态更新温度数值
- 正弦波动模拟温度变化

## 技术实现

### CSS 混合模式
```scss
.thermal-cold { mix-blend-mode: screen; }
.thermal-mid  { mix-blend-mode: overlay; }
.thermal-hot  { mix-blend-mode: luminosity; }
```

### SVG 等温线滤镜
```xml
<feTurbulence type="turbulence" baseFrequency="0.01 0.02" />
<feDisplacementMap scale="3" />
```

### 热源追踪
```typescript
const quickX = gsap.quickTo(heatSpotRef.value, 'x', { duration: 0.3 })
quickX(mouseX.value - 100)
```

## 动画参数

| 动画 | 持续时间 | 缓动 | 说明 |
|------|---------|------|------|
| 入场动画 | 1s | power2.out | 淡入+上移 |
| 视差滚动 | 全程 | none | scrub 1.5 |
| 噪点呼吸 | 3s | sine.inOut | 循环 |
| 热源追踪 | 0.3s | power2.out | 跟随鼠标 |
| 热衰减 | 1.5s | power2.out | 鼠标离开 |

## 使用说明

```vue
<template>
  <CardImgThermal />
</template>

<script setup>
import CardImgThermal from '@/views/web-list/card-img/CardImgThermal/CardImgThermal.vue'
</script>
```

## 兼容性

- 需要 CSS `mix-blend-mode` 支持
- 需要 SVG 滤镜支持
- 建议在现代浏览器中使用
