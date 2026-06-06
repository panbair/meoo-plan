# CardImage3DReliefGallery — CSS 2.5D 浮雕雕刻 · 景深画廊

## 概述

演示两种无需真实 3D 模型即可在 2D 平面上"雕刻"立体感的纯 CSS 技法：

1. **25层 text-shadow 浮雕** — 逐层偏移 + 透明度渐变模拟光照浮雕
2. **translateZ 嵌套画廊** — 5层 figure 景深堆叠 + opacity 渐变构建悬浮式深度画廊

## 技法一：25层 text-shadow 光照浮雕

### 原理

```
光源 (左上)  → 文字表面
                ↓
  亮面高光 (左上)     暗面阴影 (右下)
  -1,-1 rgba(255,255,255,.2)     +1,+1 rgba(0,0,0,.55)
  -2,-2 rgba(255,255,255,.18)    +2,+2 rgba(0,0,0,.48)
  ...                             ...
  -10,-10 rgba(255,255,255,.02)   +25,+25 rgba(0,0,0,.02)

  25层暗面 + 12层亮面 = 37层text-shadow
  = 2D平面上"雕刻"出立体文字
```

### 逐层参数

```
暗面 (右下偏移, 黑色, 25层):
  Layer 1:  1.2px 1.2px rgba(0,0,0,.55)    ← 最暗、最近
  Layer 10: 12px  12px  rgba(0,0,0,.33)    ← 中等深度
  Layer 20: 24px  24px  rgba(0,0,0,.11)    ← 渐远渐淡
  Layer 25: 30px  30px  rgba(0,0,0,.02)    ← 最远、最淡

亮面 (左上偏移, 白色, 12层):
  Layer 1:  -0.8px -0.8px rgba(255,255,255,.18)
  Layer 6:  -4.8px -4.8px rgba(255,255,255,.07)
  Layer 12: -9.6px -9.6px rgba(255,255,255,.01)
```

### 视觉效果

```
        光源
         ☀
    ╔══════════╗
    ║  浮雕文字  ║  ← 亮面(左上) 文字像被光照凸起
    ╚══════════╝
              ░░░  ← 暗面(右下) 阴影延伸
```

## 技法二：translateZ 5层嵌套画廊

### 景深堆叠

```
  Z:-240  DEEP.BG       scale:0.65  opacity:0.5   blur:2.4px   ← 远景
  Z:-140  MID.FAR       scale:0.75  opacity:0.65  blur:1.2px
  Z:0     CENTER.FOCUS  scale:0.88  opacity:0.85  blur:0       ← 焦点
  Z:+100  MID.NEAR      scale:0.95  opacity:0.9   blur:0
  Z:+180  FRONT.CLOSE   scale:1.0   opacity:1.0   blur:0       ← 近景
```

### 摄像机推进 (scroll驱动)

```
滚动 0%:
  远景清晰可辨 → 摄像机在远处

滚动 50%:
  近景放大清晰 → 摄像机穿过中景

滚动 100%:
  近景占据视野 → 摄像机紧贴最近层
  远景极度模糊退后
```

### 画框内衬 Matte

每层 figure 带有 12px 宽的内衬边框 (`.rg-frame__matte`)：
- `linear-gradient` 多层渐变模拟装裱卡纸的光影
- `inset box-shadow` 模拟内框阴影
- 营造出真正的"画廊装裱"质感

## 设计风格

| 要素 | 说明 |
|------|------|
| 色调 | 暖色画廊空间 · 米白/奶油底色 |
| 氛围 | 古典画廊、艺术展、浮雕工艺 |
| 文字 | 25层text-shadow 雕刻感标题 |

## 技术要点

- 🔑 JS `generateEmbossShadow()` 函数动态生成 25+12 层 text-shadow
- 🔑 暗面 `rgba(0,0,0, α递减)` + 亮面 `rgba(255,255,255, α递减)`
- 🔑 5层 figure 通过 `translateZ` 分布在不同深度
- 🔑 远景层额外 `filter: blur()` 模拟景深
- 🔑 `scale` 补偿 + opacity 渐变 → 增强远近感
- 🔑 画框 matte 内衬用 `linear-gradient` + `inset shadow` 模拟装裱
- GSAP ScrollTrigger scrub 驱动摄像机推入
- 景深层指示器实时显示当前焦层
