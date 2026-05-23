# CardImageOilSlick — 彩虹油膜·表面张力破裂

> **图片动画组件 · Canvas 实时渲染 · 薄膜干涉破裂**

---

## 核心概念

Canvas 实时渲染一层流动的彩虹油膜覆盖图片。随滚动进度，油膜经历 **张力积聚→临界破裂→剧烈撕裂** 三个阶段。3 个破裂中心从不同位置同时扩张，裂口边缘呈现彩色干涉辉光，油膜碎片收缩为彩虹油珠飞出画面。

---

## 技术实现

| 特性 | 实现 |
|------|------|
| **彩虹油膜渲染** | Canvas 6 层 `radialGradient` 不同色调光斑叠加，色调随时间 `sin(membraneTime)` 漂移 |
| **波浪扭曲纹理** | `globalCompositeOperation='overlay'` + 正弦波位移扫描线 (y: 步长3px, x: 步长6px) |
| **高光反射** | 径向高光斑跟随鼠标位置漂移 `(mouseXRatio × 0.08, mouseYRatio × 0.06)` |
| **破裂蒙版** | `globalCompositeOperation='destination-out'` + 3 个径向梯度圆擦除油膜 |
| **临界破裂曲线** | `ruptureProgress(raw)`: 0→0.35 仅 2%/0.35→0.6 加速到 15%/0.6→1 爆发到 100% |
| **彩虹边缘光** | 裂口边缘 `radialGradient` 环带 (青→金→品→绿)，色调随 `membraneTime` 漂移 |
| **图片渐亮** | `brightness(0.3) → brightness(1.05)`，跟随破裂进度 |
| **油珠滚落** | 24 颗 CSS `radial-gradient` 多彩油珠，各自沿随机方向 `(dx,dy)` 飞离 |
| **鼠标交互** | 油膜光斑位置 + 波浪扭曲方向跟随鼠标微动 (lerp 0.04) |

---

## Canvas 渲染管线 (每帧)

```
1. clearRect
2. 6层 radialGradient 油膜底色
   (cx/cy 跟随鼠标微偏移 + 色调 = L.h + sin(membraneTime×0.4)×30)
3. overlay 波浪扫描线纹理 (sin/cos 位移, hsla 半透明蓝)
4. 高光反射斑 (跟随鼠标)
5. destination-out 破裂蒙版
   (3个破裂点: radialGradient 0→0.55→0.78→0.92→1 透明度阶梯)
6. 裂口边缘彩虹辉光 (alpha × ruptureProgress)
   (radialGradient 环: 青→金→品→绿, 边缘厚度 16+rup×8)
7. 顶层半透明覆膜 (0.06 + (1-rup)×0.08 alpha)
```

## 渲染层次 (z-index)

| z | 层 | 说明 |
|:--|-----|------|
| 1 | `abyss-bg` | 深黑径向渐变底色 |
| 2 | `image-layer` | 图片 (brightness 0.3→1.05) |
| 3 | `oil-canvas` | Canvas 油膜渲染 |
| 4 | `edge-glow-layer` | 破裂点 CSS 光斑 (逐点闪现) |
| 8 | `beads-layer` | 油珠 CSS 粒子 (24颗) |
| 10 | `content-overlay` | 文字信息 |

## GSAP 时间线

```
ScrollTrigger scrub:
  st     scrape 1.0 | 0%→100%  targetProgress → scrollProgress (lerp 0.08)
  glowTl scrape 1.2 | 光斑依次闪现 (stagger 0.12)
  beadTl scrape 1.1 | 油珠依次弹出 (stagger 0.045)
  imgTl  scrape 1.0 | brightness 0.3→1.05
  textTl scrape 1.0 | opacity 0→1, y 40→0

破裂进度曲线:
  0.00  ── 2% ─────────────── 0.35 (张力积聚)
  0.35  ── 加速 ───────────── 0.60 (临界点)
  0.60  ── 爆发 ───────────── 1.00 (剧烈撕裂)
        ↑ 0.15                  ↑ 1.0
```

## 色系

| 元素 | 颜色 |
|------|------|
| 底色 | `#06060a → #0c0e16` |
| 油膜光斑 (6层) | hsl(200,80,65) / hsl(270,75,60) / hsl(140,85,55) / hsl(320,70,62) / hsl(40,90,58) / hsl(180,82,60) |
| 波浪纹理 | hsla(210~270, 70, 65, 0.06) |
| 破裂边缘光 | hsla(200~250,100,65) 青 → hsl(40~80,100,55) 金 → hsl(310~340,100,60) 品 → hsl(150~195,100,50) 绿 |
| 油珠 | 白(#fffff0) → 金 → 青 → 紫 → 深黑 |
| 标题 | rgba(255,252,245,0.95) + 蓝/紫/橙 三层 glow |
