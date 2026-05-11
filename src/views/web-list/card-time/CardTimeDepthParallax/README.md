# CardTimeDepthParallax - 深度视差卡片

> 多层空间悬浮效果 · 沉浸式深度视差体验

## 效果特性

### 🎯 核心效果
- **多层深度空间**: 5层视差层级（背景/远景/中景/近景/前景）
- **深度视差动画**: 不同层级卡片以不同速度滚动
- **3D悬浮效果**: 鼠标移动产生3D倾斜跟随
- **弹性交互**: 鼠标离开时卡片弹性恢复

### 📐 层级结构

| 层级 | 深度值 | 模糊度 | 移动速度 | 透明度 |
|------|--------|--------|----------|--------|
| 背景层 | 0.05 | 3px | 极慢 | 30% |
| 远景层 | 0.15 | 2px | 慢 | 50% |
| 中景层 | 0.30 | 0px | 正常 | 100% |
| 近景层 | 0.50 | 0px | 快 | 100% |
| 前景层 | 0.80 | 0px | 极快 | 60% |

### 🎨 设计风格
- **配色**: 深空紫 + 极光蓝 + 樱花粉
- **背景**: 星空 + 星云 + 粒子系统
- **卡片**: 毛玻璃 + 霓虹边框 + 发光效果

## 技术实现

### 动画系统
- **入场动画**: GSAP Timeline 实现从远到近依次入场
- **滚动动画**: ScrollTrigger 驱动深度视差效果
- **鼠标交互**: 实时计算鼠标位置产生3D变换
- **持续动画**: 浮动效果 + 扫描线 + 粒子漂浮

### 关键代码

```typescript
// 深度视差核心
const depthLayers = sectionRef.value.querySelectorAll('.depth-layer')
depthLayers.forEach((layer) => {
  const depthValue = parseFloat((layer as HTMLElement).dataset.depth || '0.3')
  const yMultiplier = (1 - depthValue) * 150

  ScrollTrigger.create({
    trigger: layer,
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1.2,
    onUpdate: (self) => {
      gsap.set(layer, {
        y: yMultiplier * (self.progress - 0.5) * 2,
        scale: 1 - depthValue * 0.2,
        filter: `blur(${depthValue * 8 * Math.abs(self.progress - 0.5) * 2}px)`
      })
    }
  })
})
```

### 3D鼠标跟随
```typescript
card.addEventListener('mousemove', (e: Event) => {
  const mouseEvent = e as MouseEvent
  const rect = card.getBoundingClientRect()
  const x = (mouseEvent.clientX - rect.left) / rect.width - 0.5
  const y = (mouseEvent.clientY - rect.top) / rect.height - 0.5
  const rotateAmount = 8 * (1 - depthValue)

  gsap.to(card, {
    rotateY: x * rotateAmount,
    rotateX: -y * rotateAmount,
    duration: 0.4,
    ease: 'power2.out'
  })
})
```

## 使用方式

```vue
<template>
  <CardTimeDepthParallax />
</template>

<script setup lang="ts">
import CardTimeDepthParallax from './card-time/CardTimeDepthParallax/CardTimeDepthParallax.vue'
</script>
```

## 动画参数

| 参数 | 值 | 说明 |
|------|-----|------|
| `scrub` | 1.2 | 平滑系数 |
| `perspective` | 1200px | 3D透视距离 |
| `depth range` | 0.05-0.8 | 深度值范围 |
| `blur range` | 0-8px | 模糊度范围 |

## 响应式适配

- **桌面端**: 完整5层视差效果
- **平板端**: 简化层级，保留核心效果
- **移动端**: 单列卡片布局，触摸滑动支持
