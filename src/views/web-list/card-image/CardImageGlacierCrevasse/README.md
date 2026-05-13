# CardImageGlacierCrevasse 冰渊裂隙 · 极地冰川三维视差

## 概述

图片如一道被冰封于万古冰川深处的深渊裂隙，悬浮于极地冰盖的幽蓝暗空之中。四层独立景深（远景冰穹 / 中远景冰层 / 中近景冰裂隙 / 近景冰晶）以差异化速率运动，配合极光与光柱效果，营造极地冰川的冷峻压迫与无尽深邃感。

## 核心特性

| 特性 | 实现方式 |
|------|----------|
| **四层景深** | 远景冰穹(0.4) / 中远景冰层 / 中近景冰裂隙 / 近景冰晶(0.9) |
| **冰裂隙3D** | translateY ±50px + rotateX ±1deg + rotateY ±0.5deg |
| **冰霜融化** | opacity 0.5→0 + scale 1→1.1 |
| **极光效果** | opacity 0→0.4 + translateX -50→50 |
| **光柱扫描** | 从右上到左下偏转 + opacity 0.1→0.3 |
| **蓝冰纹理** | opacity 0→0.15 显现 |
| **冰晶闪烁** | 60个粒子 + 独立上浮 + 闪烁 |
| **ScrollTrigger** | scrub: 1.5, start: top 100%, end: bottom 20% |

## 动画细节

- **远景冰穹**: translateY -100→50 + opacity 0.4→0.8，地质尺度永恒沉降
- **中远景冰层**: translateY -60→80 + rotateY -2deg→2deg
- **冰裂隙主体**: translateY -40→60 + rotateX -1deg→1deg + rotateY ±0.5deg
- **图片变化**: brightness 1.0→0.85 + contrast 1.0→1.1 + saturate 1.0→0.8
- **冰霜层**: opacity 0.5→0 + scale 1→1.1 融化效果
- **极光**: translateX -50→50 + opacity 0→0.4
- **光柱**: 从右上向左下扫描 300px + opacity 0.1→0.3
- **冰晶**: 60个粒子上浮 300px + 独立闪烁

## 使用方式

```vue
<CardImageGlacierCrevasse
  image-url="https://images.unsplash.com/photo-xxx"
  title="冰渊裂隙"
  subtitle="极地冰川三维视差"
/>
```
