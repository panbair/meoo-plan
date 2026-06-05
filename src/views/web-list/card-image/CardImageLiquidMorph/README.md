# CardImageLiquidMorph — 液态变形

## 概述
图片像T-1000液态金属一样融化、流淌、凝聚、重塑。SVG滤镜驱动液体状变形，液态金属粒子环绕。

## 核心动画
```
固态(sc:1, borderRadius:0) → 融化(sc:0.6, borderRadius:50%) →
液滴凝聚(scale 1.08) → 重塑(sc:0.97→1, borderRadius:25%→0)
```

## 视觉元素
- SVG feTurbulence + feDisplacementMap 液态变形滤镜
- 液态金属粒子(50个汞色光点)
- 液滴指示器(水滴形状+高光)
- 金属银/汞配色
- 表面光泽层(gloss)

## 技术要点
- 两个SVG滤镜(#lm-melt, #lm-droplet)在动画中切换
- borderRadius + scale + opacity 四维变换
- elastic.out缓动实现液滴弹跳
- Vue 3 refs + GSAP proxy for SVG attributes
