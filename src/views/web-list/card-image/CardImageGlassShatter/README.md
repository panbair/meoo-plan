# CardImageGlassShatter 玻璃碎裂重组

## 概述

画面如钢化玻璃般碎裂为 42 枚不规则碎片，每枚碎片在 3D 空间中旋转悬浮漂移。滚动触发后，碎片从四面八方飞回原位重新聚合，冰蓝/紫色玻璃高光随滚动进度不断增强，呈现震撼的"破镜重圆"视觉效果。

## 核心特性

| 特性 | 实现方式 |
|------|----------|
| **不规则碎裂** | 7×6 网格 + 顶点随机偏移（2.5%），clip-path: polygon() 模拟 Voronoi 碎裂纹理 |
| **3D 空间漂浮** | translateX/Y/Z + rotateX/Y/Z 六维度随机散落，距离中心越远散落越远 |
| **玻璃材质** | 渐变覆层（冰蓝→紫）+ 边缘高光线 + CSS mix-blend-mode: overlay |
| **微尘粒子** | 35 枚发光尘埃，与碎片同步回聚，带独立浮动动画 |
| **中心光晕** | 径向渐变光晕随重组进度从透明到 40% 显现 |
| **内容入场** | 标题/分割线/副标题分三层错时淡入，附带模糊消除效果 |
| **ScrollTrigger** | scrub: 1.5, start: top 85%, end: bottom 30% |

## 动画细节

- **碎片重组**：42 枚碎片从 6 自由度散落状态（x/y/z/rotateX/rotateY/rotateZ + scale + opacity + blur）→ 完整聚合状态
  - stagger: 0.028s，from: 'random'，营造自然无序的重组节奏
  - ease: expo.out，先快后慢贴合玻璃撞击弹回的物理质感
- **微尘回归**：发光粒子从随机散落位置（CSS 变量 --dx/--dy）飞回中心，stagger 0.02s
- **中心光晕**：opacity 0→0.4 + scale 0.5→1，scurb 1.5
- **标题层**：y 60→0 + opacity 0→1 + blur 10px→0，scrub 1
- **分割线**：scaleX 0→1 + opacity 0→1
- **副标题**：y 20→0 + opacity 0→1

## 色系方案

- 背景：深海暗蓝径向渐变（#010310 → #0a1030）
- 玻璃覆层：冰蓝色半透明渐变（135deg，overlay 混合模式）
- 边缘高光：冰蓝到紫色的随机色彩（8 色调色板）
- 微尘粒子：青蓝/紫色随机，带 box-shadow 发光
- 文字光晕：多层 text-shadow 叠加（蓝+紫+蓝三层）

## 使用方式

```vue
<CardImageGlassShatter
  image-url="https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80"
  title="玻璃碎裂重组"
  subtitle="Glass Shatter & Rebuild"
/>
```

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.3 | 核心框架 |
| GSAP | ^3.12 | 碎片重组动画引擎 |
| ScrollTrigger | ^3.12 | 滚动驱动动画 |
| SCSS | ^1.6 | 样式预处理 |
