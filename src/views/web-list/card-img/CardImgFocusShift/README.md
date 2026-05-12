# CardImgFocusShift - 微观景深·微距移轴图片视差

## 效果描述

宏观摄影风格的图片陈列，每张图初始处于极浅景深状态，如同微距镜头下的微观世界。Timeline 驱动镜头焦点在深度空间中游走，不同图层的图片交替进入焦平面，清晰与模糊交替上演。

## 核心特性

### 1. 三维空间分层
- **前景层 (Front)**: `translateZ: 80px`, `scale: 1.26`, 暖琥珀色标识
- **主体层 (Main)**: `translateZ: 0px`, `scale: 1`, 青蓝色标识
- **背景层 (Back)**: `translateZ: -80px`, `scale: 0.79`, 紫罗兰色标识

### 2. 景深模糊动画
- 焦点层清晰: `blur(0px)`, `brightness(1)`, `saturate(1.1)`
- 非焦点层模糊: `blur(8-15px)`, `brightness(0.7)`, `saturate(0.8)`
- GSAP Timeline 循环驱动焦点切换

### 3. 鼠标视差
- `quickTo` 计算光标偏移量
- 整体容器 `rotateX/Y` 微角偏转
- 各层因深度不同产生差异化视差位移

### 4. 镜头光学效果
- 镜头光晕呼吸动画
- 色温变化 (暖琥珀 ↔ 冷青蓝)
- 暗角与镜头畸变晕影
- 散景粒子装饰

### 5. ScrollTrigger 滚动控制
| 参数 | 值 | 说明 |
|------|-----|------|
| `trigger` | `container` | 触发器元素 |
| `start` | `'top 80%'` | 元素顶部到达视口80%时开始 |
| `end` | `'top 20%'` | 元素顶部到达视口20%时结束 |
| `scrub` | `1.5` | 平滑系数 |

## 技术实现

### Vue3 组件架构
- `<script setup>` 语法
- `ref` / `reactive` 响应式状态
- 函数式 `setRef` 收集 DOM 引用

### GSAP 动画系统
- `gsap.timeline()` 主时间线
- `quickTo()` 快速鼠标追踪
- `ScrollTrigger` 滚动驱动
- `repeat: -1` 无限循环焦点切换

### 性能优化
- `will-change` CSS 属性
- `backface-visibility: hidden`
- `transformStyle: preserve-3d`
- 适当的 blur 值控制

## 使用方式

```vue
<template>
  <CardImgFocusShift />
</template>

<script setup lang="ts">
import CardImgFocusShift from './card-img/CardImgFocusShift/CardImgFocusShift.vue'
</script>
```

## 图片配置

```typescript
const focusImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85',
    title: '极光幻境',
    description: '穿越时空的巍峨巅峰'
  },
  // ...
]
```

## 参数说明

| 参数 | 类型 | 说明 |
|------|------|------|
| `focusImages` | `FocusImage[]` | 图片数据数组 |
| `currentDepth` | `ref<string>` | 当前景深距离 |
| `currentBlur` | `ref<string>` | 当前模糊值 |
| `currentPlane` | `ref<string>` | 当前焦点平面 |

## 动画清理

组件 `onUnmounted` 时自动清理：
1. 所有 GSAP Timeline
2. ScrollTrigger 实例
3. quickTo 函数
4. DOM 属性

## 响应式断点

| 宽度 | 图片尺寸 | 字号 |
|------|---------|------|
| `> 1200px` | 550×380px | 32px |
| `900-1200px` | 450×310px | 26px |
| `600-900px` | 360×250px | 20px |
| `< 600px` | 280×195px | 16px |
