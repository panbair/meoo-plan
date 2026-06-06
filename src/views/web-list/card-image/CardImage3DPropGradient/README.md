# CardImage3DPropGradient — CSS @property 渐变驱动 · 3D 进度条

## 概述

传统 CSS `linear-gradient` 的百分比节点无法进行过渡动画——这是 CSS 长期以来的限制。借助 `@property` 规则注册自定义 CSS 变量并指定其 `<percentage>` 语法类型，浏览器就能平滑插值渐变节点，让 3D 进度条表面的渐变色彩像液体一样流动。结合 `preserve-3d` 构建的立体进度条几何体，呈现出极具科技感的视觉效果。

## 核心创新：@property 突破渐变动画限制

### 问题

```css
/* ❌ 传统方式 — 渐变无法动画 */
.bar {
  background: linear-gradient(90deg, cyan 0%, purple 50%, cyan 100%);
  /* 无法让 50% 平滑过渡到 80% */
}
```

### 解决方案

```css
/* ✅ @property 注册自定义变量 */
@property --pg-fill {
  syntax: '<percentage>';   /* 🔑 告诉浏览器: 这是百分比类型 */
  inherits: false;
  initial-value: 0%;
}

/* @keyframes 驱动变量变化 */
@keyframes pg-gradient-flow {
  0%   { --pg-fill: 20%; }
  50%  { --pg-fill: 80%; }
  100% { --pg-fill: 20%; }
}

/* 渐变动画 — 像液体流动! */
.bar {
  background: linear-gradient(90deg,
    cyan 0%,
    cyan var(--pg-fill),            /* ← 动画化节点 */
    purple calc(var(--pg-fill) + 15%),
    cyan calc(var(--pg-fill) + 30%),
    cyan 100%
  );
  animation: pg-gradient-flow 3s infinite;
}
```

### 为什么 @property 能实现？

| 对比 | 传统自定义属性 | @property 注册 |
|------|-------------|---------------|
| 类型信息 | 无 (全是字符串) | 明确指定 `<percentage>` / `<number>` 等 |
| 插值能力 | ❌ 无法插值 | ✅ 浏览器知道如何计算中间值 |
| 渐变动画 | ❌ 突变 (跳变) | ✅ 平滑过渡 |

## 3D 进度条几何体

```
         ┌──────────────────────────┐
  Z:+4   │  .pg-bar-top (顶面)       │ ← rotateX(-90°) 3D厚度
         ├──────────────────────────┤
  Z:+4   │  .pg-bar-front (玻璃面板) │ ← 半透明科技感
         ├──────────────────────────┤
  Z:0    │  .pg-bar-fill (填充)      │ ← 🔑 @property 流动渐变
         │  宽度由 GSAP scroll 驱动   │
         ├──────────────────────────┤
  Z:-8   │  .pg-bar-back (背面)      │ ← 暗色基底
         └──────────────────────────┘
```

### 填充层的 @property 变量

```
--pg-fill: 渐变流动位置 (20% ↔ 80% 循环)
--pg-shift: 色相偏移量 (0 ↔ 2 循环)

linear-gradient(90deg,
  cyan at 0%,
  cyan at var(--pg-fill),         ← 亮色段起点 (流动)
  purple at var(--pg-fill)+15%,   ← 过渡色 (跟随)
  cyan at var(--pg-fill)+30%,     ← 亮色段终点 (跟随)
  dark-cyan at 100%
)
```

## 动画流程

| 滚动 | 进度 | 3D 旋转 | 渐变流动 | 效果 |
|------|------|---------|---------|------|
| 0%→20% | 0→20% | Y:-8° X:+5° | @keyframes 持续 | 进度开始填充 |
| 20%→60% | 20→60% | Y:+12° X:-8° | @keyframes 持续 | 侧面展示立体厚度 |
| 60%→80% | 60→80% | Y:-5° X:0° | @keyframes 持续 | 顶部展示流光 |
| 80%→100% | 80→100% | Y:0° back.out | @keyframes 持续 | 弹性归位·充满 |

## 视觉细节

| 元素 | 技术 | 说明 |
|------|------|------|
| 填充渐变 | @property --pg-fill + @keyframes | 3s 循环流动 |
| 纹理叠加 | `::after` repeating-linear-gradient + mask | 科技感网格纹理 |
| 刻度标记 | 8个定位div + opacity过渡 | 达到进度时高亮 |
| 流动高光点 | 绝对定位 dot + left跟随 | 进度尖端的光点 |
| 百分比数字 | gradient text + drop-shadow | 青紫渐变发光 |
| 顶面厚度 | rotateX(-90°) translateZ | 3D立体厚度感 |
| 玻璃面板 | 半透明 border + inset shadow | 科技玻璃质感 |

## 设计风格

| 要素 | 说明 |
|------|------|
| 色调 | 暗色科技黑 + 青色/紫色双色渐变 |
| 氛围 | 赛博朋克、系统充电、科技进度 |
| 字体 | Inter + Courier New (数字) |

## 技术要点

- 🔑 `@property --pg-fill { syntax: '<percentage>' }` 是突破渐变限制的关键
- 🔑 `@keyframes` 驱动 `--pg-fill` 0%↔100% → 渐变节点平滑流动
- 🔑 `linear-gradient` 使用 `var(--pg-fill)` 作为色标位置
- 🔑 `@property --pg-shift { syntax: '<number>' }` 可用于色相偏移
- GSAP ScrollTrigger scrub 驱动 `width` 百分比 (实际进度)
- CSS animation 独立驱动渐变流动 (与进度无关，持续进行)
- `preserve-3d` 构建 6 面进度条几何体
- 流动高光点 `transition: left .15s` 平滑跟随进度
