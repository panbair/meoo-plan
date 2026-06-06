# CardImage3DRoom — CSS3 3D 立体空间剧场

## 概述

纯 CSS3 3D 构建完整的六面房间（四面墙+天顶+地板），相机位于房间中心，用户竖滚驱动房间绕Y轴旋转360°，依次展示每面墙上的大幅图片。房间中央悬浮一个"精选画框"同步展示当前墙壁图片。

## CSS3 3D 核心技术

| 属性 | 值 | 作用 |
|------|-----|------|
| `perspective` | 1000px | 3D透视距离 |
| `transform-style` | `preserve-3d` | 保持子元素3D空间 |
| `backface-visibility` | `hidden` | 隐藏背面 |
| `translateZ(±halfD)` | 前后墙 | Z轴定位 |
| `rotateY(90deg)` | 左右墙 | 侧面旋转对齐 |
| `rotateX(±90deg)` | 天顶/地板 | 垂直面旋转对齐 |
| `rotateY(0→360)` | 房间整体 | scroll驱动绕Y轴旋转 |

### 六面3D定位

```
前墙: translateZ(+halfD)
后墙: translateZ(-halfD) rotateY(180deg)
右墙: translateX(+halfW) rotateY(90deg)
左墙: translateX(-halfW) rotateY(-90deg)
天顶: translateY(-halfH) rotateX(90deg)
地板: translateY(+halfH) rotateX(-90deg)
```

## 动画流程

| 滚动进度 | 房间旋转 | 展示面 |
|---------|---------|--------|
| 0→1 | rotateY: 0°→90° | 前墙→右墙 |
| 1→2 | rotateY: 90°→180° | 右墙→后墙 |
| 2→3 | rotateY: 180°→270° | 后墙→左墙 |
| 3→4 | rotateY: 270°→360° | 左墙→前墙 |

每个面之间有0.4的停留时间，让观众充分欣赏。

## 设计风格

| 要素 | 说明 |
|------|------|
| 色调 | 日出橙 / 天空蓝 / 极光绿 |
| 氛围 | 深邃、剧场感、沉浸式 |
| 背景 | 深色宇宙蓝黑渐变 |

## 特色元素

- **悬浮画框**：在房间中央独立于墙壁旋转，与主房间旋转有微妙不同步
- **墙面编号**：每个墙面上有半透明数字标识（01-04）
- **光晕系统**：三个大型径向光晕随滚动位移
- **指示器**：底部实时显示当前面标签+脉冲圆点

## 技术要点

- 纯 CSS3 3D，不使用任何 3D 库
- GSAP ScrollTrigger 驱动旋转（`scrub: 1.5`）
- 6面各贴一张 Unsplash 高质量图片
- 悬浮画框在 3D 空间中独立定位
- 入场动画：标题逐字从 Z=-300 飞入
