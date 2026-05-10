# CardCatalyst 催化剂

> 触发连锁反应，释放无限能量

## 概述

CardCatalyst 是一个以催化剂反应为主题的卡片组件。通过数据流、能量爆发和粒子场等元素，呈现出化学反应的视觉隐喻。

## 主题风格

| 风格 | 描述 |
|------|------|
| 主色调 | 深黑 (#0a0a0f) + 电光蓝 |
| 强调色 | 能量橙 (#ff6b35)、催化紫 (#a855f7)、裂变青 (#22d3d3) |
| 视觉风格 | 科技感、能量感、动态 |

## 动画效果

### 入场动画 (slide-up)

```javascript
from: { y: '100%', opacity: 0 }
to: { y: 0, opacity: 1, ease: 'expo.out' }
```

### 卡片错落入场

每张卡片从不同角度依次落入：
- stagger: 0.15 (每张延迟150ms)
- y: 100 → 0 (从下方)
- rotation: -5 → 0 (轻微旋转)
- ease: 'back.out(1.3)'

## 核心特效

| 特效 | 描述 |
|------|------|
| 能量网格 | 动态脉冲网格线 |
| 数据流 | 垂直下落的符号 |
| 能量波纹 | 中心扩散的波纹 |
| 粒子场 | 漂浮的能量粒子 |
| 电弧 | 随机闪烁的电弧 |
| 脉冲核心 | 脉动的能量源 |

## 技术栈

- Vue 3 Composition API
- TypeScript
- GSAP 动画引擎
- ScrollTrigger
- SCSS

## 使用方式

```vue
<template>
  <CardCatalyst />
</template>
```
