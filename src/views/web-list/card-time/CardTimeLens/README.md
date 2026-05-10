# CardTimeLens - 引力透镜 · 鼠标驱动的时空扭曲

## 概述

CardTimeLens 组件实现了"引力透镜"效果 - 当鼠标移入卡片群组时，卡片受到时空曲率的影响而发生扭曲变形，营造出宇宙天体引力的视觉效果。

## 设计理念

当光标移入卡片群组时，一个看不见的"质量点"出现，周围的卡片被时空曲率拉扯：靠近质量的卡片被放大、向光标聚拢，远离的则被轻微推挤。整个网格像柔软的橡胶膜，随着鼠标荡起涟漪。

## 特性

### 核心动画

- **引力透镜效果**: 使用 `gsap.quickTo` 实现丝滑的鼠标追踪
- **3D 空间扭曲**: 卡片同时在 X/Y 轴位移并伴随 3D 旋转
- **requestAnimationFrame**: 60fps 流畅更新

### 交互设计

| 交互 | 效果 |
|------|------|
| 鼠标移入 | 引力场激活，卡片向鼠标聚拢并放大 |
| 鼠标移动 | 实时计算引力强度，距离越近变形越大 |
| 鼠标离开 | 卡片弹性恢复原位 |

### 卡片主题

| 卡片 | 图标 | 描述 |
|------|------|------|
| 黑洞 | 🕳️ | 时空奇点 |
| 中子星 | ⭐ | 致密天体 |
| 超新星 | 💥 | 恒星爆发 |
| 暗物质 | 🌑 | 隐形质量 |
| 引力波 | 🌊 | 时空涟漪 |
| 时空 | ⏱️ | 时空连续 |

## 技术实现

### 引力计算

```typescript
const pullFactor = Math.max(0, 1 - dist / maxDist)
const pullStrength = pullFactor * gravitationalConstant * 1.8

const moveX = dx * pullStrength * 0.4
const moveY = dy * pullStrength * 0.4
const scale = 1 + pullStrength * 0.35
const rotateY = (dx / origin.width) * 8 * pullFactor
const rotateX = -(dy / origin.height) * 8 * pullFactor
```

### QuickTo 优化

```typescript
cardRefs.value.forEach((card) => {
  quickX.push(gsap.quickTo(card, 'x', { duration: 0.5, ease: 'power3.out' }))
  quickY.push(gsap.quickTo(card, 'y', { duration: 0.5, ease: 'power3.out' }))
  quickScale.push(gsap.quickTo(card, 'scale', { duration: 0.5, ease: 'power3.out' }))
  quickRotateY.push(gsap.quickTo(card, 'rotateY', { duration: 0.5, ease: 'power3.out' }))
  quickRotateX.push(gsap.quickTo(card, 'rotateX', { duration: 0.5, ease: 'power3.out' }))
})
```

## 视觉效果

- **背景星云**: 渐变叠加动画
- **粒子星星**: 闪烁的星空背景
- **引力场指示器**: 跟随鼠标的紫色光晕
- **卡片轨道**: 虚线旋转边框
- **能量条动画**: 每张卡片独特的脉动节奏
- **鼠标追踪器**: 紫色脉冲光点

## 动画清理

组件卸载时自动清理：
- `requestAnimationFrame` 循环
- `mousemove` / `mouseleave` 事件监听
- `resize` 事件监听
- GSAP QuickTo 实例
- ScrollTrigger 实例
