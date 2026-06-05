# CardImage3DMask — 3D百叶窗

## 概述
使用`mask-image: linear-gradient()`将每张图片切割为8片水平百叶。每片独立`rotateX`翻转（0°→90°），形成百叶窗效果。滚动驱动逐片翻转，从上到下关闭、从下到上打开。

## 核心动画
```
Frame0: 8片全平(rotateX:0°) → 逐片翻下(0°→90°, top→bottom) →
Frame1: 8片翻开(90°→0°, bottom→top) → 循环
```

## 视觉元素
- mask-image线性渐变切割（每片12.5%）
- transform: rotateX() + transform-origin: top
- backface-visibility: hidden（翻到90°不可见）
- perspective:800px + preserve-3d
- Canvas背景粒子(80个)

## 技术要点
- slatMaskStyle()动态生成mask-image gradient
- GSAP stagger控制逐片延迟（每片约0.087单位）
- 正序(0→7)翻下，反序(7→0)翻上
- 64个slat DOM元素(8帧×8片)
