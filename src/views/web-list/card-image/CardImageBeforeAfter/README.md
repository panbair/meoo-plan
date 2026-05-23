# CardImageBeforeAfter — 前后对比滑动

> **组合**：before/after 双图 × clip-path 滑动揭示 × 放大镜细节

## 概念
左右分屏展示两张图片（冬季→夏季景观），中央有可拖动的分割线，拖动时逐步揭示另一侧图片。鼠标悬停时出现 2x 放大镜，实时对比细节。

## 多层级架构
```
Layer 1: Before 图片 (底层全幅 · 冬季山脉)
Layer 2: After 图片 (clip-path inset 动态裁剪 · 夏季湖泊)
Layer 3: 分割滑动条 (中央 handle + 渐变线)
Layer 4: 放大镜层 (鼠标悬停 2x 分屏对比)
Layer 5: 标签指示器 (Before / After 角标)
```

## 核心技术

| 技术 | 实现 |
|------|------|
| **clip-path 揭示** | `inset(0 ${100-p}% 0 0)` 实时裁剪 after 图 |
| **拖拽交互** | 原生 `mousedown/move/up` + `touchstart/touchmove/touchend` |
| **放大镜同步** | 鼠标位置映射 `translate()` 偏移，分屏显示 before/after 2x 细节 |
| **滚动动画** | GSAP ScrollTrigger scrub=1.2，滚动时自动切换分界线位置 |
| **分界线** | 50→35→75→45→50 四阶段自动滑动演示 |

## 图片资源

| 图片 | 用途 |
|------|------|
| `photo-1464822759023-fed622ff2c3b` | Before — 冬季/远山 |
| `photo-1501785888041-af3ef285b470` | After — 夏季/湖泊 |

## 交互方式
- **拖拽手柄** → 调整分界线位置（5%–95%）
- **鼠标悬停** → 2x 放大镜出现，分屏显示缩放细节
- **滚动驱动** → 自动演示前后对比
