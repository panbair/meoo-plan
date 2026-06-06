# CardImage3DKaleidoShatter — CSS3 3D 万花筒切片破碎

## 概述

将一张完整图片按 6列×4行 切割为 24 个独立 `<div>` 碎片。利用 `background-position` 精确定位每个碎片显示的图像区域，配合错时（staggered）的 `rotateY`、`translateZ` 3D 变换，模拟物体破碎后在空中悬浮重组的动态质感。

## 核心技术：CSS Sprite 切片 + 错时3D破碎

### 切片原理

每个碎片是一个 `<div>`，通过 CSS background 属性精确显示图像的对应区域：

```
完整图片 (1200×800)
    ↓
background-size: 600% 400%   (6列 × 4行)
    ↓
24个div, 每个 background-position 不同
    ↓
┌──┬──┬──┬──┬──┬──┐
│0%│20%│40%│60%│80%│100%│ ← bgX
├──┼──┼──┼──┼──┼──┤  0%   bgY
├──┼──┼──┼──┼──┼──┤  33%
├──┼──┼──┼──┼──┼──┤  67%
├──┼──┼──┼──┼──┼──┤ 100%
└──┴──┴──┴──┴──┴──┘
```

### 错时破碎算法

```
stagger = centerDist × 0.5

centerDist: 碎片距图像中心的距离 (0~1)
  中心碎片 (距离≈0) → stagger≈0 → 最先破碎
  边缘碎片 (距离≈1) → stagger≈0.5 → 最晚破碎
```

### 破碎方向 (径向爆炸)

每个碎片的破碎方向由其相对于中心的角度决定：

```
shatterAngle = atan2(row - centerY, col - centerX)

translateX = cos(angle) × distance × intensity
translateY = sin(angle) × distance × intensity
translateZ = base + distance × 200
```

## 5阶段破碎动画

| 阶段 | 滚动 | 效果 | 碎片状态 |
|------|------|------|---------|
| 0 | 0% | 完整图像 | 所有碎片 Z:0, rotate:0 |
| 1 | 20% | 开始龟裂 | 中心碎片先动，微translateZ+rotateY |
| 2 | 40% | 碎片飞散 | 所有碎片爆炸分离，最大位移+旋转 |
| 3 | 60% | 万花筒悬浮 | 碎片在空间中旋转交错，rotateZ交替 |
| 4 | 80% | 碎片回流 | 碎片减速回拢，旋转衰减 |
| 5 | 100% | 重组归位 | elastic回弹归零 |

### 每阶段的3D变换

```
Phase 1 (微裂):
  translateZ: 0 → 15px       (中心碎片)
  rotateY: 0 → ±15°         (径向向外)
  
Phase 2 (飞散):
  translateZ: 15 → 280px     (边缘碎片)
  translateX: 0 → ±60px     (径向分量)
  rotateY: 15° → ±45°       (全幅度)
  rotateZ: 0 → ±15°         (交替方向)
  filter: +drop-shadow     (深度阴影)
  
Phase 3 (悬浮):
  万花筒交错 — rotateZ 反向、rotateY 加大
  
Phase 4 (回流):
  所有位移减至10%, 旋转减至±8°
  
Phase 5 (重组):
  back.out(1.2) 弹性归零
```

## 碎片材质

每个碎片由三层构成：

```
┌──────────────────────┐
│  .ks-slice__edge     │ ← 断面边缘光 (inset box-shadow)
│  模拟玻璃断面折射     │
├──────────────────────┤
│  .ks-slice__glass    │ ← 半透明渐变覆盖 (rgba)
│  对角高光 + 边缘暗角  │   展示3D空间中的内部结构
│  box-shadow inset     │
├──────────────────────┤
│  background-image     │ ← 图片的对应切片区域
│  background-position  │   CSS Sprite精确定位
└──────────────────────┘
```

## 设计风格

| 要素 | 说明 |
|------|------|
| 色调 | 暗色空间 + 蓝紫光晕 + 玻璃碎片 |
| 氛围 | 万花筒、艺术感、破碎美学 |
| 状态指示 | 实时显示当前破碎阶段 |

## 技术要点

- 🔑 CSS Sprite切片: `background-size: 600% 400%` + 24个不同 `background-position`
- 🔑 错时(stagger): 中心碎片先碎、边缘后碎 (centerDist × 0.5)
- 🔑 径向爆炸: 每个碎片沿 `shatterAngle` 方向飞散
- 🔑 半透明 `rgba` 渐变覆盖展示碎片内部空间关系
- 🔑 `inset box-shadow` 模拟玻璃断面折射光
- 🔑 5阶段完整破碎→悬浮→重组循环
- 🔑 Phase 5 用 `back.out(1.2)` 弹性归位
- 24个独立GSAP动画 + stagger 错时
- `backface-visibility: hidden` + `will-change: transform`
