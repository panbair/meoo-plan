# CardGravity2 引力场2

> 升级版引力场主题，粒子系统驱动的沉浸式卡片体验

## 概述

CardGravity2 是 CardGravity 的升级版本，采用更丰富的粒子系统和动态背景，为卡片提供更沉浸式的宇宙引力场视觉体验。

## 主题风格

| 风格 | 描述 |
|------|------|
| 主色调 | 深邃宇宙黑 (#050510) + 引力紫 |
| 强调色 | 能量青 (#00f5d4)、引力金 (#f9c846)、脉冲红 (#ff6b6b) |
| 视觉风格 | 科技感、宇宙感、沉浸式 |

## 动画效果

### 入场动画

- 背景粒子系统自动生成
- 引力环旋转入场
- 标题组淡入上移
- 卡片依次从不同角度落入 (stagger: 0.15)

### ScrollTrigger 配置

```javascript
ScrollTrigger.create({
  trigger: parent,
  start: 'top 80%',
  end: 'top 20%',
  scrub: 1.5,
  onUpdate: (self) => {
    gsap.set(parent, { y: 100 * self.progress })
  }
})
```

## 核心特效

| 特效 | 描述 |
|------|------|
| 动态星空 | 200颗闪烁星星，尺寸和亮度随机 |
| 引力环 | 三层旋转轨道环 |
| 粒子场 | 60个漂浮粒子 |
| 能量核心 | 中心脉动光源 |
| 扫描线 | 周期性扫过的光效 |

## 技术栈

- Vue 3 Composition API
- TypeScript
- GSAP 动画引擎
- ScrollTrigger
- SCSS

## 使用方式

```vue
<template>
  <CardGravity2 />
</template>
```
