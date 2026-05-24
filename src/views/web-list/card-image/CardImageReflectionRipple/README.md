# CardImageReflectionRipple — 倒影涟漪幻境

## 组件概述

镜面倒影 × 水波纹扭曲 × 倒影独立动画。图片上半为原图，下半为垂直翻转的倒影。滚动时倒影通过 SVG `feDisplacementMap` 产生动态水波纹扭曲效果，水面交界线呈现波浪形态，点击可产生涟漪扩散。

## 七层架构

| 层级 | 内容 | 技术 | z-index |
|------|------|------|---------|
| Layer 1 | 原图（上半） | `inset: 0 0 50% 0` 裁剪 | 1 |
| Layer 2 | 水面交界线 | SVG 动态贝塞尔波浪曲线 ×2 | 10 |
| Layer 3 | 倒影图（下半） | `scaleY(-1)` 翻转 + `feDisplacementMap` 水波扭曲 | 2 |
| Layer 4 | 水面光斑 | Canvas 28 个闪烁光点，`mix-blend-mode: screen` | 3 |
| Layer 5 | 涟漪扩散 | Canvas 同心圆，点击时 2-3 圈向外扩散 | 5 |
| Layer 6 | 水面雾气 | `linear-gradient` + `backdrop-filter: blur()` | 4 |

## 核心技术

- **SVG feDisplacementMap 水波扭曲**：`feTurbulence` 生成分形噪声 → `feDisplacementMap` 位移图像像素，scale 从 0→18，frequency 动态变化
- **scaleY(-1) 倒影翻转**：CSS `transform: scaleY(-1)` 垂直翻转整张图像创建镜面倒影
- **动态波浪交界线**：每帧通过 `onUpdate` 重新计算 SVG path `d` 属性，正弦波叠加 + 二次贝塞尔平滑
- **点击涟漪**：`requestAnimationFrame` 循环渲染 Canvas 同心圆，半径递增 + 透明度递减

## 交互效果

- 初始：倒影微弱可见，水面仅有微弱波动，交界线平缓，雾气浓郁
- 滚动 0→1：水波扭曲强度从 0 增至最大值 18，倒影渐显（opacity 0.15→0.7），波浪振幅增大（2→10px），雾气渐散
- 倒影水平微微晃动：`translateX(sin(p×18) × (1+p×2))`，模拟水面浮荡
- 点击任意位置：产生 2-3 圈同心圆涟漪向外扩散，发光光晕跟随
