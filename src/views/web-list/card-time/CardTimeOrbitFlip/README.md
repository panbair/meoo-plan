# CardTimeOrbitFlip - 星轨旋舞·Flip魔法卡片阵列

> Awwwards 级别的 3D 螺旋轨迹 + Flip 魔法卡片动画组件

## 效果特点

### 核心动画
- **初始状态**：6 张卡片完美堆叠形成魔法卡牌束，带螺旋旋转错位
- **星轨散开**：卡片沿 3D 弧形轨迹旋舞飞出，带螺旋旋转效果
- **网格归位**：扩散后自动精准对齐 3×2 网格，姿态自动校正
- **自由漂浮**：展开后卡片轻微上下漂浮，形成动态呼吸感
- **双向闭环**：向上滚动沿原星轨轨迹旋舞回收，丝滑闭环

### 视觉效果
- 60 颗闪烁星星组成的星空背景
- SVG 星轨路径引导线
- 50 个粒子组成的粒子场
- 三层脉冲环动画
- 卡片辉光爆发效果
- 渐变主题色（青色 + 紫色 + 粉色）

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.3 | 核心框架 |
| TypeScript | ^5.0 | 类型系统 |
| GSAP | ^3.12 | 动画引擎 |
| Flip | ^3.12 | 状态变形插件 |
| ScrollTrigger | ^3.12 | 滚动动画插件 |
| SCSS | ^1.6 | 样式预处理 |

## 文件结构

```
CardTimeOrbitFlip/
├── CardTimeOrbitFlip.vue    # 组件源码
└── README.md                # 本文档
```

## 组件参数

### Props
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| cards | Array | 内置6张卡片 | 卡片数据数组 |

### Cards 数据结构
```typescript
interface CardData {
  id: number           // 唯一标识
  title: string        // 卡片标题
  description: string  // 卡片描述
  icon: string         // SVG图标HTML
  gradient: string     // 背景渐变
  color: string        // 主题色
}
```

## 使用示例

```vue
<template>
  <CardTimeOrbitFlip />
</template>

<script setup lang="ts">
import CardTimeOrbitFlip from '@/views/web-list/card-time/CardTimeOrbitFlip/CardTimeOrbitFlip.vue'
</script>
```

## 动画流程

```
┌─────────────────────────────────────────────────────────┐
│                     SCROLL DOWN                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   ┌───┐                                                  │
│   │ 1 │ ───┐                                             │
│   └───┘    │     ┌─────────────────────┐                 │
│   ┌───┐    │     │   星轨螺旋散开      │                 │
│   │ 2 │ ───┼────▶│   Card → 3D Spiral  │                 │
│   └───┘    │     └─────────────────────┘                 │
│   ┌───┐    │                                             │
│   │ 3 │ ───┘                                             │
│   └───┘                                                  │
│                                                          │
│   ┌───┬───┬───┐                                         │
│   │ 1 │ 2 │ 3 │  ← 网格归位 (Elastic动画)               │
│   ├───┼───┼───┤                                         │
│   │ 4 │ 5 │ 6 │                                         │
│   └───┴───┴───┘                                         │
│                                                          │
│   ↓ 漂浮呼吸 (Loop)                                      │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                     SCROLL UP                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   ┌───┬───┬───┐                                         │
│   │ 1 │ 2 │ 3 │                                         │
│   ├───┼───┼───┤                                         │
│   │ 4 │ 5 │ 6 │                                         │
│   └───┴───┴───┘                                         │
│         ↓                                                │
│   逆序星轨回收                                           │
│         ↓                                                │
│   ┌───┐                                                 │
│   │ 6 │ (堆叠)                                          │
│   └───┘                                                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 核心代码解析

### Flip 状态捕获
```typescript
// 记录最终网格状态
const finalState = Flip.getState(cards)

// 初始化为堆叠状态
cards.forEach((card, i) => {
  gsap.set(card, {
    z: -i * 25,
    rotation: i * 12,
    scale: 0.85
  })
})
```

### 星轨散开动画
```typescript
cards.forEach((card, i) => {
  const angle = (i / cards.length) * Math.PI * 3
  const radius = 180

  masterTl!.to(card, {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    z: i * 40 + 100,
    rotation: i * 60,
    scale: 1,
    stagger: i * 0.12,
    ease: 'expo.out'
  })
})
```

### 粒子系统
```typescript
particles.forEach((p) => {
  p.x += p.vx * (1 + progress * 2)
  p.y += p.vy * (1 + progress * 2)
  // 绘制粒子...
})
```

## 清理机制

组件卸载时自动清理：
- ScrollTrigger 实例
- GSAP 时间线
- 粒子动画帧
- 所有补间动画

```typescript
onUnmounted(() => {
  scrollTriggers.forEach(st => st.kill())
  masterTl?.kill()
  killParticleAnimation()
  ScrollTrigger.getAll().forEach(st => st.kill())
  gsap.killTweensOf('*')
})
```

## 浏览器兼容

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 性能优化

- 使用 `will-change` 提示浏览器优化
- 使用 `force3D` 强制 GPU 加速
- 粒子数量限制在 50 个
- 星空动画使用 `transform` 而非 `opacity`
