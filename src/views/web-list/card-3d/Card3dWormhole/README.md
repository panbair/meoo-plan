# Card3dWormhole - 超维时空隧道3D卡片

> CSS3 4D旋转 + ScrollTrigger 滚动穿透 + 星际轨迹炸裂动画组件

## 效果特点

### 核心动画
- **初始状态**：8张卡片压缩成时空奇点，隐藏在CSS3 3D隧道中心
- **滚动触发**：向下滚动，时空隧道开启，卡片沿4D螺旋轨迹穿透炸裂飞出
- **扩散效果**：CSS3 3D旋转XYZ三轴联动、螺旋升空、轨迹偏移
- **悬浮姿态**：展开后保持3D倾斜悬浮，环绕中心缓慢旋转
- **双向闭环**：向上滚动沿原时空轨迹回收，完美闭环

### 视觉效果
- 12层旋转隧道环
- 80颗闪烁星星
- 3个星云效果
- 8条能量线
- 100个星际粒子场
- 奇点中心动画
- 进度条指示器

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.3 | 核心框架 |
| TypeScript | ^5.0 | 类型系统 |
| GSAP | ^3.12 | 动画引擎 |
| ScrollTrigger | ^3.12 | 滚动动画插件 |
| SCSS | ^1.6 | 样式预处理 |

## 文件结构

```
Card3dWormhole/
├── Card3dWormhole.vue    # 组件源码
└── README.md             # 本文档
```

## 组件参数

### Props
无 props，组件使用内置卡片数据

### 卡片数据
```typescript
interface SpaceCard {
  id: number           // 唯一标识
  title: string       // 卡片标题
  description: string // 卡片描述
  icon: string        // SVG图标HTML
  gradient: string    // 背景渐变
  color: string       // 主题色
  sector: string      // 时空坐标
}
```

## 使用示例

```vue
<template>
  <Card3dWormhole />
</template>

<script setup lang="ts">
import Card3dWormhole from '@/views/web-list/card-3d/Card3dWormhole/Card3dWormhole.vue'
</script>
```

## 动画流程

```
┌─────────────────────────────────────────────────────────┐
│                     SCROLL DOWN                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│                     ╭─────────╮                         │
│                     │  时空    │                         │
│                     │  奇点    │ ← 初始：卡片藏在深处    │
│                     ╰─────────╯                         │
│                         ↓                                │
│                    ╭────────────╮                       │
│                    ╱  穿透隧道   ╲                       │
│                   ╱   Z轴推进    ╲  ← 阶段1：穿透       │
│                   ╲   旋转720°   ╱                      │
│                    ╲           ╱                        │
│                     ╰──────────╯                         │
│                         ↓ 炸裂                          │
│                                                          │
│     ┌───┐  ┌───┐  ┌───┐  ┌───┐                        │
│     │ 1 │  │ 2 │  │ 3 │  │ 4 │  ← 阶段2：螺旋飞出      │
│     └───┘  └───┘  └───┘  └───┘                        │
│     ┌───┐  ┌───┐  ┌───┐  ┌───┐                        │
│     │ 5 │  │ 6 │  │ 7 │  │ 8 │                        │
│     └───┘  └───┘  └───┘  └───┘                        │
│                         ↓ 悬浮                          │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                     SCROLL UP                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   逆序回收 → 螺旋飞回 → 穿透隧道 → 时空奇点             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 核心代码解析

### CSS3 超3D空间配置
```typescript
gsap.set(sectionRef.value, {
  perspective: 1400,
  transformStyle: 'preserve-3d'
})
```

### 时空奇点初始状态
```typescript
cards.forEach((card, i) => {
  gsap.set(card, {
    z: -1200, // 推入隧道深处
    scale: 0,
    rotationX: 720,
    rotationY: 720,
    rotationZ: 720,
    opacity: 0
  })
})
```

### 4D螺旋穿透动画
```typescript
// 阶段1：穿透隧道
timeline.to(cards, {
  z: -200,
  scale: 0.4,
  opacity: 0.4,
  rotationX: 360,
  rotationY: 360,
  rotationZ: 360,
  stagger: { each: 0.08, from: 'center' },
  duration: 1.2,
  ease: 'expo.inOut'
})

// 阶段2：炸裂飞出
timeline.to(cards, {
  z: 0,
  x: (i) => Math.sin(i * 0.8) * 200,
  y: (i) => Math.cos(i * 0.8) * 150,
  rotationZ: gsap.utils.random(-20, 20),
  scale: 1,
  opacity: 1
})
```

## ScrollTrigger 配置

| 参数 | 值 | 说明 |
|------|-----|------|
| `trigger` | section | 触发器元素 |
| `start` | `'top 80%'` | 开始位置 |
| `end` | `'top 5%'` | 结束位置 |
| `scrub` | `2` | 平滑系数 |
| `toggleActions` | `'play reverse play reverse'` | 双向播放 |

## 清理机制

组件卸载时自动清理：
- ScrollTrigger 实例
- GSAP Timeline
- 粒子动画帧
- 所有补间动画
- 元素样式

```typescript
onUnmounted(() => {
  scrollTriggers.forEach(st => st.kill())
  wormholeTimeline?.kill()
  killParticles()
  ScrollTrigger.getAll().forEach(st => st.kill())
  gsap.killTweensOf('*')
  gsap.set(cardRefs.value, { clearProps: 'all' })
})
```

## 浏览器兼容

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 性能优化

- 使用 `transform` 和 `opacity` 动画
- 使用 `will-change` 提示浏览器
- 使用 `force3D` 强制 GPU 加速
- 粒子数量限制在 100 个
- 粒子轨迹绘制条件判断优化
