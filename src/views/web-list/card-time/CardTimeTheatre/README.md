# CardTimeTheatre - 光影剧场卡片

## 设计理念

聚光灯下的叙事诗篇 — 受建筑投影艺术启发，用户滚动页面时，一束虚拟的聚光灯扫过卡片群组。只有被光照到的卡片才会呈现彩色立体形态，其余卡片则退为深沉的黑白剪影，仿佛隐藏于黑暗之中。

## 核心特性

- **双层卡片结构**: 灰度基底 + 彩色光束层
- **聚光灯效果**: CSS clip-path 动态裁剪彩色层
- **梯形光束**: 模仿锥形聚光灯效果
- **滚动驱动**: ScrollTrigger 控制光束从左到右移动
- **时间线叙事**: 适合展示品牌历史、产品进化等

## 技术实现

| 技术 | 用途 |
|------|------|
| Vue 3 | 组件框架 |
| TypeScript | 类型安全 |
| GSAP | 动画引擎 |
| ScrollTrigger | 滚动动画控制 |
| SCSS | 样式预处理 |

## 动画机制

### 聚光灯算法
```javascript
const center = progress
const startClip = Math.max(0, center - BEAM_WIDTH / 2)
const endClip = Math.min(1, center + BEAM_WIDTH / 2)

// 梯形 clip-path
clipPath = `polygon(
  ${left - 5}% 0%, 
  ${right + 5}% 0%, 
  ${right + 10}% 100%, 
  ${left - 10}% 100%
)`
```

### 关键参数
- BEAM_WIDTH: 0.5 (光束宽度占50%)
- scrub: 0.8 (滚动平滑度)

## 文件结构

```
CardTimeTheatre/
├── CardTimeTheatre.vue    # 组件源码
└── README.md             # 本文档
```

## 使用方式

```vue
<template>
  <CardTimeTheatre />
</template>
```

## 视觉效果

滚动时可见效果：
1. 灰度卡片作为基底
2. 彩色卡片层被 clip-path 裁剪
3. 光束从左向右扫过
4. 被照亮的卡片变为鲜艳彩色
5. 光束外的卡片保持灰度剪影

## 组件尺寸

- 宽度: 100vw
- 高度: min-height 100vh
