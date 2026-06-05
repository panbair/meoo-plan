# CardImage3DGalleryFloor — 3D展厅地板

## 概述
照片如真实相框矗立在3D展厅地板上。每张300×500比例，白色边框，地板有倒影。照片在XY轴上左右散落排列，Z轴深入屏幕。竖滚驱动穿越。

## 核心动画
```
照片散落在XY平面(左右交替错落) →
Z轴整体向前推进 →
每张到达前台时: rotateY归零正对观众、提亮、放大
```

## 视觉元素
- 拍立得比例照片(300×500, clamp响应式)
- 白色相框(box-shadow 4px白边+7px黑边)
- 地板倒影(scaleY(-1)+渐变遮罩)
- 3D透视地板(rotateX 70°渐变平面)
- 聚光灯+暗角

## 技术要点
- 8张照片散落layout(每张独立x/z/rotateY/rotateX)
- scaleY(-1)实现倒影,渐变遮罩融入地板色
- 前台时rotateY减至30%原值(正对观众)
- perspective:1000px + preserve-3d
- pointer-events:none避免阻塞滚动
