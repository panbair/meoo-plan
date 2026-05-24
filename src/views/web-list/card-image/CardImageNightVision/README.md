# CardImageNightVision — 三重视觉模式切换

> **从未有过的组合**：正常视觉 → 夜视仪 → 热成像 × 扫描线 × 界面 HUD

## 修复说明 (v2)

- **v1 问题**：`feColorMatrix` 仅使用 R 通道映射导致图像全黑
- **v2 修复**：改用可靠 CSS `filter: grayscale(1) brightness(1.5) contrast(1.15)` + 绿色 `mix-blend-mode: screen` 叠加层

## 架构

| 层级 | 内容 | 核心实现 | z-index |
|------|------|----------|---------|
| 1 | 基础图 | 始终显示，夜视模式下降饱和/变暗 | 1 |
| 2 | 夜视覆盖 | `grayscale` + `brightness` CSS 滤镜 + 绿色 `screen` 混合 | 2 |
| 3 | 热成像 | Canvas 像素色阶映射 (蓝紫→红→橙→黄→白)，opacity 替换 | 3 |
| 4 | 扫描线 | `repeating-linear-gradient` 固定线 + 移动高亮横条 | 4 |
| 5 | HUD | CSS 变量 `--hud` 颜色切换，四角+准星+标签+数据 | 10 |
| 6 | 温度标记 | 3 个脉冲热点，CSS `@keyframes` | 8 |
| 7 | 噪点 | SVG `feTurbulence` 绿色噪点，`mix-blend-mode: screen` | 6 |
| 8 | 暗角 | `radial-gradient` 鱼眼边缘暗角 | 9 |

## 三阶段过渡 (p: 0→1)

```
p 0.0-0.25  正常：基础图全彩，HUD 淡白
p 0.25-0.55 夜视：基础图褪色，绿色 screen 叠加层渐显，
            扫描线+噪点峰值，HUD 变绿，准星放大
p 0.55-1.0  热成像：夜视消退，Canvas 热成像浮现，
            HUD 变橙，热点脉冲，数据面板 IR/μW 飙升
```
