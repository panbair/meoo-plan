# CardImage3DOrbit — 3D景深穿越

## 概述
图片卡片在3D空间中沿X轴依次穿越视野。每张卡片经历右侧飞入→中央驻留→左侧飞离三段动画，配合rotateY旋转+blur景深+scale缩放，营造3D空间流动感。

## 核心动画
```
卡片从右侧远处(x:1.35W, blur:10px, scale:0.55) →
飞入中央(blur:0, scale:1, rotateY:0) →
驻留(图片scale 1.1→1.12) →
飞离左侧(blur:10px, scale:0.55)
```

## 视觉元素
- CSS perspective:1000px 3D舞台
- 每卡片独立 rotateY + z + scale + filter 四维变换
- Canvas星空粒子(250个, 3D→2D投影)
- 前景暗角+卡片边缘光
- 底部信息栏(序号+标题)

## 技术要点
- GSAP x(translateX)使用window.innerWidth像素值
- gsap.set初始化第0张在中央
- preloadImages() JS预加载所有图片
- loading="eager" + fetchpriority="high"
- 卡片position:absolute + top:50%/left:50%+负margin居中
