# CardImage3DCube — CSS3 3D立体魔方

## 概述

纯 CSS3 3D 立方体——六个面各贴一张图片，通过 `transform-style: preserve-3d` + `rotateX/Y` + `translateZ` 构建真正的 3D 立方体。用户竖滚时，立方体绕X轴和Y轴旋转，依次展示六个面，如同转动一个真实的魔方。

## CSS3 3D 核心技术

| 属性 | 值 | 作用 |
|------|-----|------|
| `perspective` | 900px | 3D透视距离 |
| `transform-style` | `preserve-3d` | 保持子元素3D空间 |
| `backface-visibility` | `hidden` | 隐藏背面 |
| `translateZ(±half)` | 6个面各不同 | 构建立方体 |
| `rotateY(90deg)` | 左右面 | 侧面对齐 |

### 六面3D定位

```
前面: translateZ(+half) rotateY(0deg)
后面: translateZ(-half) rotateY(180deg)
右面: translateX(+half) rotateY(90deg)
左面: translateX(-half) rotateY(-90deg)
顶面: translateY(-half) rotateX(90deg)
底面: translateY(+half) rotateX(-90deg)
```

## 动画流程

| 滚动进度 | 立方体旋转 | 展示面 |
|---------|-----------|--------|
| 0→1 | rotateY: 20°→-70° | 前面→右面 |
| 1→2 | rotateX: -15°→-75° | 右面→顶面 |
| 2→3 | rotateY: -70°→110° | 顶面→左面 |
| 3→4 | rotateY: 110°→200° | 左面→后面 |
| 4→5 | rotateX: -75°→75° | 后面→底面 |
| 5→6 | rotateY: 200°→380° | 底面→前面 |

## 设计风格

| 要素 | 说明 |
|------|------|
| 色调 | 糖果粉 / 电光蓝 / 薄荷绿 |
| 氛围 | 立体、科技感、好玩 |

## 技术要点

- 纯 CSS3 3D 无任何 3D 库
- GSAP ScrollTrigger 驱动旋转（`scrub: 1.2`）
- 6面图片 + 标签叠加
- 缩放呼吸增强3D感
