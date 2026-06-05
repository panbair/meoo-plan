# CardImagePolaroidScatter — 拍立得散落

## 概述
照片像真实的拍立得相纸散落在3D桌面上。每张姿态各异(rotateZ:±18°)，有白色相纸边框+底部手写区+桌面阴影。竖滚横扫散落的照片群。

## 核心动画
```
8张拍立得在XY平面上随机散落(各具独立旋转姿态) →
Z轴整体推进 →
到达前台: rotateZ归零摆正、提亮、放大 → 离开恢复原姿态
```

## 视觉元素
- 拍立得相纸(f8f5f0暖白, 10px照片padding, 40px手写区)
- 桌面阴影(radial-gradient + blur)
- 暖木色调桌面渐变背景
- 手写体标题(Georgia/KaiTi serif)
- 金色进度条

## 技术要点
- scatter数组定义每张姿态[x,y,rotateZ,z,rotateX,rotateY]
- rotateZ摆正动画(前台时降至20%原值)
- aspect-ratio:4/5维持拍立得比例
- 相纸8px白边+内嵌阴影
- 暖色调木质氛围
