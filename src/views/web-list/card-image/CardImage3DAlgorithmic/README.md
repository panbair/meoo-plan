# CardImage3DAlgorithmic — 程序化 3D 算法艺术 (CSS-Doodle 风格)

## 概述

谁说 CSS 只能写死在代码里？126 个 DOM 节点全部由数学算法程序化生成——没有手工编写的布局。利用多层复合波函数 (sin/cos 叠加) 计算每个节点的 `translateZ` 位置，126 个节点在 3D 空间中同步起伏，形成数字海洋般的算法粒子波场。

## 核心：多层复合波函数

### 波函数公式

```
z(x,y,φ) = sin(λ₁·x·8 + φ) · cos(λ₁·y·6 + φ·0.7) · A          ← 主波(对角)
         + sin(λ₂·dist·10 + φ·1.3) · A · 0.5                      ← 次波(径向)
         + cos(λ₃·x·12 + φ·0.5) · sin(λ₃·y·8 + φ·1.1) · A · 0.4  ← 第三波(涟漪)

其中:
  x, y = 归一化坐标 (-1 ~ 1)
  φ   = 波相位 (scroll驱动 0→4π)
  λ₁,₂,₃ = 波频率参数
  A   = 波幅 (75px)
  dist = √(x² + y²)
```

### 波函数可视化

```
主波 (对角传播):
  sin(λ₁x + φ) × cos(λ₁y) — 棋盘格波纹

次波 (径向):
  sin(λ₂ × dist + φ) — 同心圆扩散

第三波 (涟漪):
  cos(λ₃x) × sin(λ₃y) — 细密涟漪

叠加结果:
  复杂的、有机的3D波场 — 如真实海浪
```

### 颜色映射

```
波高 z → HSL:
  hue: 200 + z × 0.6     (青→蓝→紫)
  lightness: 45 + z × 0.3 (暗→亮)

高峰(z>0) → 亮青色
低谷(z<0) → 暗紫色
```

## 程序化生成

```javascript
// 14×9 = 126个节点 — 全部由算法批量生成
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const nx = (c / (COLS-1) - 0.5) * 2  // 归一化坐标
    const ny = (r / (ROWS-1) - 0.5) * 2
    const z0 = computeWaveZ(nx, ny, 0)     // 初始波高
    nodes.push({
      x: c * gapX - totalW / 2,           // XY平面位置
      y: r * gapY - totalH / 2,
      bgX: (c / (COLS-1)) * 100,          // 图像切片
      bgY: (r / (ROWS-1)) * 100,
      hue: 200 + z0 * 0.6,                // 颜色
      lightness: 45 + z0 * 0.3,
    })
  }
}
```

## 波相位移 (scroll驱动)

```
滚动 0% → 相位 0
滚动 50% → 相位 2π (一个完整波周期)
滚动 100% → 相位 4π (两个完整周期)

每帧更新126个节点的 translateZ:
  z = computeWaveZ(nx, ny, phase)
  transform = translateX/Y + translateZ(z) + rotateX/Y(z×0.05)
```

## 3D 节点结构

```
每个节点:
┌─ .al-node__top ───── translateZ(4px) rotateX(-90°) ─┐ 3D厚度
├─ .al-node__face ──── 图片切片 + HSL颜色 ────────────┤
│   · img (overlay混合, 75%透明)                       │
│   · background: hsl(var(--hue), 60%, var(--light))   │
└─ box-shadow ─────────────────────────────────────────┘
```

## 波函数参数 (可实时调节)

| 参数 | 默认值 | 作用 |
|------|--------|------|
| λ₁ (lambda1) | 0.35 | 主波频率 |
| λ₂ (lambda2) | 0.55 | 次波频率 |
| λ₃ (lambda3) | 0.22 | 涟漪频率 |
| A (amplitude) | 75px | Z轴最大波幅 |

## 设计风格

| 要素 | 说明 |
|------|------|
| 色调 | 暗色数字空间 + 算法蓝紫色波场 |
| 氛围 | 数字艺术、数学美学、程序化生成 |
| 面板 | 实时显示波函数参数 |

## 技术要点

- 🔑 126个节点全部由数学算法批量生成 (14×9网格)
- 🔑 3层sin/cos复合波函数叠加 → 复杂有机波场
- 🔑 GSAP onUpdate 每帧更新所有节点 translateZ
- 🔑 CSS变量 `--hue`/`--light` 动态映射波高→颜色
- 🔑 节点带 3D 厚度顶面 (translateZ + rotateX)
- 🔑 图片 overlay 混合 + HSL 背景色随波高渐变
- 波相位 0→4π 两完整周期，scrub: 1.4
- `will-change: transform` 126节点 GPU 加速
