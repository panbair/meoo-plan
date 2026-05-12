# CardImgReversal · 光影逆转 · 滚动渐显与离场联动

## 概述

CardImgReversal 组件实现"光影逆转·滚动渐显与离场联动"效果。图片初始处于微缩、模糊且稍稍偏位的隐藏状态，用户滚动时图片逐渐放大、清晰并归位；反向滚动时动画原路退回，营造由指尖掌控的优雅显隐仪式。

## 动画效果

### 滚动渐显动画（核心）

| 元素 | 初始状态 | 最终状态 | scrub |
|------|----------|----------|-------|
| 主容器 | opacity: 0, scale: 0.85, blur: 12px, y: 30 | 正常显示 | 1.5 |
| 图片 | blur: 12px, brightness: 0.7 | blur: 0, brightness: 1 | 1.5 |
| 光晕 | scale: 0.8, opacity: 0 | 正常显示 | 1.5 |
| 脉冲光晕 | scale: 0.6, opacity: 0 | 正常显示 | 1.5 |
| 光环 | scale: 0.7, opacity: 0 | 正常显示 | 1.5 |
| 标题 | opacity: 0, blur: 8px, y: 25 | 正常显示 | 1.5 |
| 边框角 | scale: 0.5, opacity: 0 | 正常显示 | 1.5 |

### ScrollTrigger 参数

| 参数 | 值 | 说明 |
|------|-----|------|
| trigger | parent | 触发器元素 |
| start | 'top 100%' | 元素顶部到达视口top 100%时开始 |
| end | 'top 20%' | 元素顶部到达视口top 20%时结束 |
| scrub | 1.5 | 平滑系数 |

### 循环呼吸动画（独立于滚动）

| 动画 | 范围 | 周期 | 效果 |
|------|------|------|------|
| 脉冲光晕 | scale + opacity | 3s | 呼吸灯效 |
| 外层光环 | rotation 360° | 60s | 顺时针旋转 |
| 内层光环 | rotation -360° | 45s | 逆时针旋转 |
| 光晕缩放 | scale + opacity | 4s | 柔和脉动 |
| 边缘光闪烁 | opacity | 2s | 光影流转 |
| 暗角呼吸 | opacity | 5s | 氛围变化 |
| 背景光晕 | scale + opacity | 6s | 氛围光效 |

### 粒子系统

| 粒子类型 | 数量 | 动画 | 说明 |
|----------|------|------|------|
| 星光粒子 | 50 | 闪烁脉动 | 深空星光 |

## 视觉层次

1. **背景层**：深色渐变 + 背景光晕 + 星光粒子
2. **光环层**：双层旋转光环
3. **框架层**：外层光晕 + 脉冲光晕
4. **图片层**：光晕叠加 + 边缘光
5. **暗角层**：动态暗角
6. **边框层**：四角发光角框

## 技术实现

### 色彩系统

- 主背景：深蓝黑 `#0a0a1a` ~ `#1a1a3a`
- 光晕色：`rgba(120, 100, 220, 0.25)`
- 光环色：`rgba(150, 130, 220, 0.15)`
- 粒子色：`rgba(200, 180, 255, 0.9)`
- 文字色：浅紫色 `#e8e4f8`

### 动画周期表

| 动画组 | 周期 | 类型 |
|--------|------|------|
| 脉冲光晕 | 3s | 独立循环 |
| 外层光环 | 60s | 独立循环 |
| 内层光环 | 45s | 独立循环 |
| 光晕缩放 | 4s | 独立循环 |
| 边缘光 | 2s | 独立循环 |
| 暗角呼吸 | 5s | 独立循环 |
| 背景光晕 | 6s | 独立循环 |

### 关键代码

```typescript
// 滚动渐显动画
const mainTl = gsap.timeline({
  scrollTrigger: {
    trigger: parentRef.value,
    start: 'top 100%',
    end: 'top 20%',
    scrub: 1.5,
  },
})

mainTl.to(containerRef.value, {
  opacity: 1,
  scale: 1,
  y: 0,
  filter: 'blur(0px)',
  duration: 1,
  ease: 'none',
})
```

## 使用说明

```vue
<template>
  <CardImgReversal />
</template>

<script setup lang="ts">
import CardImgReversal from '@/views/web-list/card-img/CardImgReversal/CardImgReversal.vue'
</script>
```

## 动画清理

组件卸载时自动清理所有动画：

```typescript
onUnmounted(() => {
  cleanupFns.forEach((fn) => fn.revert())
  ScrollTrigger.getAll().forEach((st) => st.kill())
})
```
