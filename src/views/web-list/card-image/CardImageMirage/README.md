# CardImageMirage 蜃景消融 · 热浪扭曲溶解入场

## 概述

图片初始如透过升腾的热空气观测到的海市蜃楼，表面被热浪波纹扭曲覆盖，最终从失真中缓慢定型。

## 动画特效

| 阶段 | 效果 |
|------|------|
| **扭曲消退** | feDisplacementMap scale: 12 → 0 |
| **波纹平息** | feTurbulence baseFrequency: 0.04 → 0.005 |
| **透明度** | opacity: 0.5 → 1.0 |
| **热晕余韵** | 边缘暖色光晕闪现 |

## 技术实现

- Vue 3 Composition API
- SVG feDisplacementMap + feTurbulence 滤镜
- GSAP ScrollTrigger + scrub
- SCSS 样式
