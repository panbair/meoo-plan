# CardSphere - 3D悬浮球卡片

## 概述

鼠标移动时球体产生3D旋转和悬浮效果的卡片组件。

## 效果预览

- 悬浮球带有高光和阴影效果
- 鼠标移动时卡片产生3D透视旋转
- 悬浮球持续上下浮动动画
- 悬停时光晕效果增强

## 技术实现

### 核心原理

1. **3D变换**：使用 `transform-style: preserve-3d` 和 `perspective` 实现3D效果
2. **鼠标跟踪**：通过 `mousemove` 事件计算鼠标位置，计算旋转角度
3. **GSAP动画**：`gsap.to()` 实现平滑的旋转和缩放过渡

### 关键代码

```typescript
// 鼠标移动计算旋转角度
const handleMouseMove = (e: MouseEvent, index: number) => {
  const rotateX = (y - centerY) / 20
  const rotateY = (centerX - x) / 20

  gsap.to(card, {
    rotateX,
    rotateY,
    scale: 1.05,
    duration: 0.3
  })
}
```

## 参数配置

| 属性 | 值 | 说明 |
|------|-----|------|
| 卡片宽度 | 280px | 单个卡片宽度 |
| 卡片高度 | 380px | 单个卡片高度 |
| 球体大小 | 120px | 悬浮球直径 |
| 旋转角度 | ±15° | 最大旋转角度 |

## 使用方式

```vue
<CardSphere />
```

## 数据结构

```typescript
interface SphereCard {
  id: string
  icon: string
  title: string
  desc: string
  gradient: string
  color: string
  stats: Stat[]
}
```
