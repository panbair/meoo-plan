# CardImage3DDepthStack — 2.5D 悬浮式景深画廊

## 概述

不依赖真正的 3D 模型，5层 `<figure>` 元素通过 `translateZ` 分布在 -250→+180 的深度空间。鼠标移动时前景快/背景慢的视差逻辑 + 滚动时摄像机推进 + blur/opacity 动态调节 = 单反相机般的"浅景深"微距 3D 质感。

## 核心技术：多层 Z 轴错位 + 视差 + 景深模拟

### 5层深度分布

```
Z:+180  BLOOM (前景·花卉)     parallax:1.0×  blur:0   ← 最快、最清晰
Z:+90   GARDEN (中近景·花园)   parallax:0.7×  blur:0
Z:0     MEADOW (中景·草原)     parallax:0.5×  blur:0   ← 焦点
Z:-130  FOREST (中远景·森林)   parallax:0.3×  blur:2px ← 渐模糊
Z:-250  FJORD (远景·峡湾)      parallax:0.15× blur:4px ← 最慢、最模糊
```

### 鼠标视差 (rAF + lerp)

```
光标移动 → 每层独立偏移量 = cursorDelta × 30px × parallaxSpeed
  前景 BLOOM (1.0×) → 偏移 30px   ← 快速响应
  中景 MEADOW (0.5×) → 偏移 15px
  远景 FJORD (0.15×) → 偏移 4.5px ← 几乎不动
```

### 滚动景深推进

```
滚动 0% → 摄像机在远处 → 5层全部可见, 景深深
滚动 50% → 摄像机推进 → 前后层模糊加深
滚动 100% → 摄像机贴近前景 → 焦外极度模糊

模拟光圈: f/2.8 → f/0.4 (景深越来越浅)
动态blur: baseBlur + |当前层-焦层| × 3 × (1+progress)
```

## 设计风格

| 要素 | 说明 |
|------|------|
| 色调 | 暖色画廊 · 自然风光 |
| 氛围 | DSLR浅景深、微距摄影、电影感 |
| 交互 | 鼠标视差 + 滚动推进 |

## 技术要点

- 🔑 5层 `translateZ` 分布 + 各自的 `parallaxSpeed`
- 🔑 rAF + lerp 平滑鼠标视差
- 🔑 `perspective-origin` 跟随鼠标微调
- 🔑 焦外动态模糊 = 层间距离 × 滚动进度
- 🔑 `transition: filter .3s, opacity .3s` 平滑景深过渡
- GSAP ScrollTrigger scrub 摄像机推入
