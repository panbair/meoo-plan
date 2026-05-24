## CardImagePlanetReveal — 行星遮罩揭示

### 概念

两张完全不同风格的图片（都市夜景 vs 自然星空），第二张图以**圆形遮罩**从小到大展开（像行星从地平线升起）。圆形边缘环绕多层大气散射光晕，滚动时圆形扩张同时伴随光晕律动。

### 六层架构

| 层级 | 内容 | 核心技术 | z-index |
|------|------|----------|---------|
| Layer 1 | 图片A (都市夜景) — 基础层始终显示 | `background: cover` | 1 |
| Layer 2 | 图片B (自然星空) — 圆形遮罩揭示 | `clip-path: circle(r% at 50% 50%)` | 2 |
| Layer 3 | 内圈高亮光晕 (10px, 白→透明) | Canvas `createRadialGradient` 环带 | 3 |
| Layer 4 | 外圈大气散射 (30px, 彩色→透明) | Canvas 两次径向渐变环叠色 | 3 |
| Layer 5 | 大气粒子环 (60 个环绕光点) | Canvas orbit 运算 + lighter 混合 | 3 |
| Layer 6 | 背景径向光晕 | CSS `radial-gradient` 直径跟随扩张 | 1 |
| — | 星空粒子背景 | Canvas 120 颗闪烁星点 + 十字光芒 | 1 |

### 行星升起曲线

```
planetRiseCurve(t):
  t < 0.35  →  (t/0.35)² × 0.25        // 前段慢加速 (0→0.25)
  t ≥ 0.35  →  0.25 + (1-(1-t')³)×0.75 // 后段强力加速 (0.25→1)
```

模拟光学错觉：行星从地平线升起时看起来缓慢，中间段加速，终端稳定。

**半径映射**: `eased × 80%` (最大占舞台 80%，保留行星"悬浮"感而非铺满全屏)

### 图片资源

| 角色 | 图片 | 来源 |
|------|------|------|
| 图层A (基础) | 都市夜景 | Unsplash: city nightscape |
| 图层B (揭示) | 自然星空 | Unsplash: starry landscape |

### 技术实现

| 技术 | 具体实现 |
|------|----------|
| **圆形遮罩** | `clip-path: circle(r% at 50% 50%)` 滚动渐变更新 |
| **光晕环带** | Canvas `createRadialGradient` 环带（96%-114% 半径区域）多层叠加 |
| **粒子环** | 60 个粒子在圆形周长 ±25px 轨道上运动，`lighter` 合成模式叠加 |
| **粒子振动** | `sin(time + vibratePhase) × vibrateAmp` 让粒子不呆板 |
| **背景光晕** | CSS 绝对定位 `radial-gradient` 球体，`scale()` 跟随半径同步扩张 |
| **星空背景** | Canvas 120 颗星点，正弦闪烁 + 亮星十字光芒 |
| **胶片颗粒** | `repeating-radial-gradient` 叠加在 img-b 上增加质感 |
| **中心高亮** | 半径 > 30px 时行星内部浮现低透明度中心光斑 |
