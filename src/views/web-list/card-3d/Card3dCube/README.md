# Card3dCube - 超维立方折叠卡片

> CSS3 3D立方体 + ScrollTrigger 折叠展开动画组件

## 效果特点

### 核心动画
- **初始状态**：6张卡片组合成3D立方体，封闭在容器中心
- **滚动触发**：向下滚动触发3D立方体炸裂展开，六面沿XYZ轴立体飞散
- **悬浮律动**：展开后卡片保持3D悬浮姿态，轻微呼吸浮动
- **双向闭环**：向上滚动卡片回收重组成立方体，完美闭环

### 视觉效果
- 40颗闪烁星星组成的星空背景
- 透视网格背景
- 渐变光晕效果
- 80个3D粒子组成的粒子场
- 圆形进度指示器
- 折叠线装饰动画

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
Card3dCube/
├── Card3dCube.vue    # 组件源码
└── README.md         # 本文档
```

## 组件参数

### Props
无 props，组件使用内置卡片数据

### 卡片数据
```typescript
interface CubeFace {
  id: number           // 唯一标识
  name: string         // 面的名称 (front/back/left/right/top/bottom)
  title: string        // 卡片标题
  description: string  // 卡片描述
  icon: string         // SVG图标HTML
  gradient: string      // 背景渐变
  color: string         // 主题色
}
```

## 使用示例

```vue
<template>
  <Card3dCube />
</template>

<script setup lang="ts">
import Card3dCube from '@/views/web-list/card-3d/Card3dCube/Card3dCube.vue'
</script>
```

## 动画流程

```
┌─────────────────────────────────────────────────────────┐
│                     SCROLL DOWN                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│            ┌─────────────────────┐                      │
│            │                     │                      │
│            │     3D CUBE         │                      │
│            │   (6面折叠闭合)      │                      │
│            │                     │                      │
│            └─────────────────────┘                      │
│                      ↓ 炸裂                             │
│                                                          │
│       ┌───┐      ┌───┐      ┌───┐                      │
│       │前 │      │左 │      │上 │                      │
│       └───┘      └───┘      └───┘                      │
│                      ↓ 3D飞散                           │
│                                                          │
│   ┌───┐   ┌───┐   ┌───┐   ┌───┐   ┌───┐   ┌───┐      │
│   │ 1 │   │ 2 │   │ 3 │   │ 4 │   │ 5 │   │ 6 │      │
│   └───┘   └───┘   └───┘   └───┘   └───┘   └───┘      │
│                      ↓ 悬浮呼吸                         │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                     SCROLL UP                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   逆序回收 → 3D飞散 → 折叠闭合 → 立方体                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 核心代码解析

### CSS3 3D空间配置
```typescript
gsap.set(sectionRef.value, {
  perspective: 1600,
  transformStyle: 'preserve-3d'
})

gsap.set(core, {
  transformStyle: 'preserve-3d',
  transformOrigin: 'center center'
})
```

### 立方体面定位
```typescript
cards.forEach((card, i) => {
  const rotateX = i < 2 ? (i === 0 ? 90 : -90) : 0
  const rotateY = i >= 2 && i < 4 ? (i === 2 ? 90 : -90) : 0
  const z = i < 2 ? 140 : 0

  gsap.set(card, {
    position: 'absolute',
    width: '280px',
    height: '280px',
    left: '50%',
    top: '50%',
    marginLeft: '-140px',
    marginTop: '-140px',
    rotateX,
    rotateY,
    z
  })
})
```

### 3D炸裂展开
```typescript
cubeTimeline.to(cards, {
  x: [-180, 180, -180, 180, 0, 0],
  y: [-120, -120, 120, 120, -180, 180],
  z: [0, 0, 0, 0, 200, -200],
  rotateX: 0,
  rotateY: 0,
  scale: 1,
  stagger: { each: 0.1, from: 'center' },
  ease: 'expo.out'
})
```

## ScrollTrigger 配置

| 参数 | 值 | 说明 |
|------|-----|------|
| `trigger` | section | 触发器元素 |
| `start` | `'top 80%'` | 开始位置 |
| `end` | `'top 10%'` | 结束位置 |
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
  cubeTimeline?.kill()
  killParticles()
  ScrollTrigger.getAll().forEach(st => st.kill())
  gsap.killTweensOf('*')
  gsap.set(cubeCardsRef.value, { clearProps: 'all' })
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
- 粒子数量限制在 80 个
- 星空动画使用伪随机定位
