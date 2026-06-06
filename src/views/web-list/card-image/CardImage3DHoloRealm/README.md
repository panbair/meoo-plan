# CardImage3DHoloRealm — CSS3 3D 全息投影幻境 · 玻璃拟态

## 概述

纯 CSS3 赛博朋克风格全息投影效果。利用 `mix-blend-mode`（混合模式）控制 3D 元素与纯黑背景的颜色交互——`screen` 模式让全息图像发光，`overlay` 增强对比度。配合半透明背景、`backdrop-filter` 玻璃拟态面板、扫描线、色散偏移和浮动动画，完美呈现科幻全息投影效果。

## 核心技术：mix-blend-mode + 半透明

### 全息投影管线

```
纯黑背景 (#020205)
    ↓
┌──────────────────────────────┐
│  全息卡片                      │
│  ┌────────────────────────┐  │
│  │ 色散层 (cyan + magenta) │  │ ← mix-blend-mode: screen
│  │ filter: hue-rotate()    │  │   CSS animation 色相偏移
│  │ opacity: 0.3-0.5        │  │
│  ├────────────────────────┤  │
│  │ 图片层                  │  │ ← mix-blend-mode: screen
│  │ opacity: 0.75           │  │   半透明 + screen = 发光投影
│  │ filter: saturate(1.3)   │  │
│  ├────────────────────────┤  │
│  │ 扫描线层                │  │ ← mix-blend-mode: multiply
│  │ repeating-linear-gradient│  │   模拟CRT扫描线
│  ├────────────────────────┤  │
│  │ 闪烁线                  │  │ ← CSS @keyframes 随机扫过
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │ 全息边框                │  │ ← linear-gradient 青/品红渐变
│  │ filter: blur(2px)       │  │   发光扩散边框
│  └────────────────────────┘  │
└──────────────────────────────┘
    ↓
玻璃拟态面板 (backdrop-filter: blur(16px))
```

### 混合模式应用

| 元素 | 混合模式 | 效果 |
|------|---------|------|
| 全息图片 | `screen` | 黑色部分变透明，亮色部分发光 |
| 色散层(青) | `screen` | 青色光晕叠加，增强科技感 |
| 色散层(品红) | `screen` | 品红色散偏移，模拟色差 |
| 扫描线 | `multiply` | 暗色横线，CRT 屏幕质感 |

### 玻璃拟态 (Glass Morphism)

```
background: rgba(0,30,40,.25)      ← 半透明暗色背景
backdrop-filter: blur(16px)         ← 背景模糊（核心）
border: 1px solid rgba(0,240,255,.15) ← 微光边框
box-shadow: 多层次阴影               ← 深度感
```

## 3D 空间布局

| 图层 | translateZ | rotateX | 角色 |
|------|-----------|---------|------|
| 卡片0 CYBER.GATE | -180 → -60 | 5° | 远景入口 |
| 卡片1 NEON.GRID | -60 → +40 | 3° | 中远景 |
| 卡片2 DATA.VAULT | +40 → +120 | -2° | 中近景 |
| 卡片3 HOLO.CORE | +160 → +240 | -5° | 核心近景 |

## 动画流程

| 滚动阶段 | 场景旋转 | 色彩偏移 | 玻璃面板 | 扫描线 |
|---------|---------|---------|---------|--------|
| Stage 0→1 | -8°, +5° | cyan增强 | — | 持续扫描 |
| Stage 1→2 | -4°, -8° | magenta偏移 | A面板淡入 | 第二遍扫描 |
| Stage 2→3 | +3°, +6° | cyan再增强 | B面板淡入 | 第三遍扫描 |
| Stage 3→4 | 0°, 0° | 全色域激活 | 面板淡出 | 第四遍扫描 |

## 附加特效

| 特效 | 技术 | 说明 |
|------|------|------|
| 网格背景 | `background-image` 双线性渐变 | 60px 等距透视网格，径向遮罩 |
| 扫描线 | GSAP 驱动的横线 | 从上到下持续扫描，带青蓝光晕 |
| 色散偏移 | CSS `@keyframes hue-rotate` | 青/品红双色 4s 循环偏移 |
| 闪烁线 | CSS `@keyframes` | 随机位置闪现，模拟全息不稳定 |
| 边框脉动 | CSS `@keyframes opacity` | 2.5s 呼吸式发光 |
| 光柱 | CSS `@keyframes` | 从卡片底部向上发射，带闪烁 |
| 全息文字 | `text-shadow` 多层发光 | 标题字符带 glitch 动画 |
| 数据流 | 40个随机字符 | 赛博朋克二进制装饰 |

## 设计风格

| 要素 | 说明 |
|------|------|
| 色调 | 纯黑底 + 青蓝(#00f0ff) + 品红(#ff40ff) |
| 氛围 | 赛博朋克、科幻、全息投影、数字幻境 |
| 参考 | Cyberpunk 2077 / Blade Runner 全息广告 |

## 技术要点

- `mix-blend-mode: screen` 是核心——在黑色背景上实现发光投影
- `backdrop-filter: blur(16px)` 实现真正的玻璃拟态（注意 Safari 需 `-webkit-` 前缀）
- 色散偏移使用双色层 + `hue-rotate` 动画模拟全息色差
- 扫描线用 `repeating-linear-gradient` + `mix-blend-mode: multiply`
- 全息文字使用 `text-shadow` 多层发光 + `background-clip: text` 渐变
- CSS `@keyframes` 实现闪烁/脉动/色移等持续性微动画
- GSAP ScrollTrigger scrub 驱动 3D 摄像机和色彩偏移
- `isolation: isolate` 防止混合模式泄漏到外部
