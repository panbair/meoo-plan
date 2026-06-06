# CardImage3DInfinitum — CSS3 极限透视 · 无限深渊隧道

## 概述

利用透视（Perspective）的极限特性，制造让人产生视觉错觉的无限空间。`perspective: 400px`（极限小值）将 Z 轴深度极度夸张，20 个发光环沿 Z 轴从 -2000px 排列到 +200px，通过 `@keyframes` 不断从屏幕深处向眼前移动并放大，完美模拟"赛博朋克时空隧道"的第一人称穿越体验。

## 核心技术：极限透视 + Z轴动画

### 透视配置

```css
perspective: 400px;          /* 🔑 极限小 → 极度夸张纵深 */
perspective-origin: 50% 50%; /* 正中心消失点 */
```

| perspective | 效果 |
|-------------|------|
| 1200px | 自然3D深度 (普通) |
| 800px | 明显纵深 |
| **400px** | **极限夸张 → 沉浸式隧道感** |
| 200px | 过度扭曲 |

### 20个光环分布

```
Z轴:  -2000px  ···  -800px  ···  -100px  ···  +200px
      深处(不可见)    中段(可见)     近处(掠过)
      
20个光环均匀分布在 -2000→+200 区间
每个光环通过 animation-delay 错开相位
→ 隧道始终被光环均匀填满
```

### @keyframes 时空穿越

```css
@keyframes im-tunnel-rush {
  0%   { translateZ(-2000px); scale(0.15); opacity: 0; }   /* 深处 */
  25%  { translateZ(-800px);  scale(0.4);  opacity: .7; }  /* 中段 */
  55%  { translateZ(-100px);  scale(0.85); opacity: 1; }   /* 接近 */
  80%  { translateZ(150px);   scale(1.8);  opacity: .4; }  /* 掠过 */
  100% { translateZ(250px);   scale(2.5);  opacity: 0; }   /* 消失 */
}
```

### 光环类型

```
矩形隧道框 (rect) — 500×340px, 赛博走廊框架
圆形传送门 (circle) — 380×380px, 时空门

4层颜色 (tier0-3):
  青蓝 #00f0ff  ·  紫红 #c83cf0
  翠绿 #00dcb4  ·  金橙 #f0b428

交替排列 → 丰富多彩的赛博隧道
```

## 速度控制 (Scroll)

```
滚动 0%   → speed: 0.3× (慢速漂浮)
滚动 50%  → speed: 1.65× (巡航速度)
滚动 100% → speed: 3× (极速穿越)

GSAP onUpdate → 实时更新 --tunnel-speed CSS变量
→ 所有光环动画统一变速
```

## 辅助效果

| 元素 | 技术 | 说明 |
|------|------|------|
| 中心消失点 | 20px radial-gradient 发光圆 | 隧道尽头的亮点 |
| 地面网格 | rotateX(80°) + repeating-linear-gradient | 增强空间参照 |
| 网格动画 | background-position 循环 | 地面持续滚动的错觉 |

## 设计风格

| 要素 | 说明 |
|------|------|
| 色调 | 赛博朋克 · 青/紫/绿/金四色光环 |
| 氛围 | 时空隧道、无限深渊、第一人称穿越 |
| 速度面板 | 实时显示穿越速度百分比 |

## 技术要点

- 🔑 `perspective: 400px` 极限小值 → Z轴深度极度夸张
- 🔑 20个光环 `translateZ` 分布 -2000→+200 + `@keyframes` 前移
- 🔑 `scale` 补偿 + `opacity` 渐变模拟远近消失
- 🔑 `animation-delay` 均匀错开 → 隧道始终饱满
- 🔑 `@property --tunnel-speed` 控制全局速度
- 🔑 GSAP scrub 驱动速度 0.3×→3×
- 矩形框+圆形门交替 + 4色分层 → 丰富视觉
- 地面网格 `rotateX(80deg)` 贴地 + 持续滚动
