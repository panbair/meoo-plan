# CardImage3DLightFlow — CSS @property 驱动 3D 光影流转

## 概述

普通 CSS 渐变无法做动画，`@property` 打破了这个铁律。注册 `--light-angle` 为 `<angle>` 类型，通过 `@keyframes` 驱动 0deg→360deg 连续旋转，应用到立方体 6 个面的 `conic-gradient` 高光层上。立方体在 3D 空间中旋转时，每个面的金属高光也像真实金属一样平滑流转。

## 核心技术

### @property 注册 + @keyframes 驱动

```css
@property --light-angle {
  syntax: '<angle>';       /* ← 告诉浏览器这是角度 */
  inherits: false;
  initial-value: 0deg;
}

@keyframes lf-light-spin {
  0%   { --light-angle: 0deg; }
  100% { --light-angle: 360deg; }
}
```

### conic-gradient 锥形高光

```css
.lf-face__sheen {
  mix-blend-mode: soft-light;
  background:
    conic-gradient(
      from var(--light-angle) at 50% 50%,  /* ← @property驱动! */
      transparent 0deg,
      transparent 300deg,
      rgba(255,255,255,.12) 320deg,         /* 高光前导 */
      rgba(255,255,255,.3) 340deg,          /* 高光峰值 */
      rgba(255,255,255,.15) 350deg,         /* 高光尾迹 */
      transparent 360deg
    );
  animation: lf-light-spin 4s linear infinite;
}
```

### 各面错相延迟

```
6个面的高光各有不同的 animation-delay:
  前面: 0s      后面: -0.67s   右面: -1.33s
  左面: -2s     顶面: -2.67s   底面: -3.33s

每个面的高光处于不同相位 → 整体光影层次丰富
```

## 效果组合

```
立方体旋转 (GSAP ScrollTrigger)
    +
@property --light-angle 动画 (CSS @keyframes)
    +
conic-gradient 高光 (soft-light 混合)
    +
6面各不同相位延迟
    =
真实的金属光影在3D表面持续流转
```

## 设计风格

| 要素 | 说明 |
|------|------|
| 色调 | 暗色金属空间 · 金铜色高光 |
| 氛围 | 贵金属、精密机械、光影流转 |
| 尺寸 | 260px 立方体 (桌面) / 180px (移动端) |

## 技术要点

- 🔑 `@property --light-angle { syntax: '<angle>' }` 使角度插值成为可能
- 🔑 `conic-gradient(from var(--light-angle))` 锥形高光环绕表面旋转
- 🔑 `mix-blend-mode: soft-light` 高光层与图片自然融合
- 🔑 6面 `animation-delay` 错相 — 高光在不同面处于不同相位
- 🔑 双光源 (`--light-angle2`) 产生交叉光影
- GSAP ScrollTrigger scrub 驱动立方体旋转
- 立方体 6面各贴 Unsplash 图片 + 高光层叠加
