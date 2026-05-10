# CardTimeSpiral - 光之螺旋 · 环形阶梯上升

6 张卡片悬浮在三维螺旋阶梯上，滚动时整体优雅旋转并上升。

## 效果说明

- **3D 螺旋布局**：6 张卡片围绕 Y 轴排列成圆形
- **滚动驱动旋转**：`ScrollTrigger` 绑定滚动进度，驱动整体旋转
- **垂直上升**：随着旋转，卡片整体向上攀升
- **卡片浮动**：每张卡片有轻微的呼吸浮动动画
- **毛玻璃效果**：`backdrop-filter: blur` 实现高级质感

## 技术实现

### 3D 布局算法

```typescript
const RADIUS = 320
const ANGLE_STEP = 60  // 每张卡片间隔 60°

cards.forEach((card, i) => {
  const angle = i * ANGLE_STEP
  const yOffset = i * VERTICAL_STEP - (totalCards * VERTICAL_STEP) / 2

  gsap.set(card, {
    rotationY: angle,
    x: Math.sin((angle * Math.PI) / 180) * RADIUS,
    y: yOffset,
    z: Math.cos((angle * Math.PI) / 180) * RADIUS + RADIUS,
  })
})
```

### 滚动动画

```typescript
const spiralTL = gsap.timeline({
  scrollTrigger: {
    trigger: sectionRef.value,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.5,  // 平滑系数
  },
})

spiralTL.to(stageRef.value, {
  rotationY: 360,  // 旋转一圈
  y: -300,         // 垂直上升
  ease: 'none',
})
```

## 六张卡片

| 索引 | 标题 | 英文 | 图标 | 色相 | 能量 |
|------|------|------|------|------|------|
| 0 | 起源 | Origin | ✦ | 280° | 92% |
| 1 | 混沌 | Chaos | ◈ | 200° | 78% |
| 2 | 秩序 | Order | ◇ | 160° | 85% |
| 3 | 光芒 | Light | ❖ | 45° | 95% |
| 4 | 生命 | Life | ✧ | 320° | 88% |
| 5 | 意识 | Mind | ✴ | 60° | 91% |

## 视觉效果

- **3D 透视**：`perspective: 1400px` 创建深度感
- **保留 3D**：`transform-style: preserve-3d`
- **毛玻璃卡片**：`backdrop-filter: blur(10px)`
- **轨道装饰**：三层同心圆轨道旋转
- **光晕效果**：每张卡片有动态光晕
- **高光扫过**：悬停时白色高光扫过

## ScrollTrigger 参数

| 参数 | 值 | 说明 |
|------|-----|------|
| `trigger` | `sectionRef` | 触发器为整个容器 |
| `start` | `'top top'` | 容器顶部到达视口顶部 |
| `end` | `'bottom bottom'` | 容器底部离开视口底部 |
| `scrub` | `1.5` | 平滑系数 |

## 使用方式

```vue
<template>
  <CardTimeSpiral />
</template>

<script setup lang="ts">
import CardTimeSpiral from './card-time/CardTimeSpiral/CardTimeSpiral.vue'
</script>
```
