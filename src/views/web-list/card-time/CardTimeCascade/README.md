# CardCascade - 交替瀑布

## 简介

CardCascade 是一个采用左右交替滑入动画效果的主题卡片组件。通过动与静的交替、方向的变换，营造出强烈的视觉律动感，让用户感受到瀑布般的流动之美。

## 效果预览

- **渐变光球** - 三个模糊渐变光球营造氛围
- **交替卡片** - 4 张卡片左右交替排列
- **入场动画** - 偶数卡片从左滑入，奇数卡片从右滑入
- **滚动动画** - 卡片随滚动左右摆动 + 3D 旋转
- **悬停效果** - 卡片上浮 + 图标旋转 + 光效出现

## 基础用法

```vue
<template>
  <CardCascade />
</template>

<script setup lang="ts">
import CardCascade from './CardCascade/CardCascade.vue'
</script>
```

## 组件参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| 无 | - | - | 组件无需传入参数，使用内置数据 |

## 数据配置

### 卡片数据 (cascadeCards)

```typescript
const cascadeCards = [
  {
    title: '初见',
    desc: '一切美好事物的起点',
    progress: '75%',
    icon: '<svg viewBox="0 0 24 24">...</svg>'
  },
  {
    title: '相知',
    desc: '深入了解彼此的过程',
    progress: '60%',
    icon: '<svg viewBox="0 0 24 24">...</svg>'
  },
  // ...
]
```

## 技术实现

### 动画类型

| 动画类型 | 实现方式 | 说明 |
|----------|----------|------|
| badge 入场 | GSAP fromTo | scale + opacity + y |
| 标题入场 | GSAP fromTo | y + filter blur + opacity |
| 卡片交替入场 | GSAP fromTo + stagger | x: ±80, y: 30, x: 0 |
| 滚动消失 | ScrollTrigger | y + opacity + scale |
| 卡片滚动 | ScrollTrigger | x ±50 + rotateY + scale |
| 装饰线动画 | GSAP to | y + opacity 循环 |

### 左右交替滑入核心代码

```typescript
const fromX = i % 2 === 0 ? -80 : 80
gsap.set(card, { opacity: 0, x: fromX, y: 30 })
tl.to(card, {
  opacity: 1,
  x: 0,
  y: 0,
  duration: 0.6,
  ease: 'power2.out'
})
```

### DOM 引用管理

使用 Vue3 `ref` + `Map` 管理多个卡片的 DOM 引用：

```typescript
const cardRefs = ref(new Map<number, HTMLElement>())

// 模板中使用
:ref="el => cardRefs.set(i, el as HTMLElement)"
```

### 动画清理

所有动画通过 `cleanupFns` 数组管理，组件卸载时统一清理：

```typescript
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

cleanupFns.push(() => tl.kill())
cleanupFns.push(() => st.kill())

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
```

## 文件结构

```
CardCascade/
├── CardCascade.vue    # 组件源码
└── README.md          # 本文档
```

## 样式变量

可在组件源码的 `<style>` 部分修改以下变量：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| 背景渐变 | `#0f172a → #1e293b` | 深蓝灰渐变 |
| 主色调 | `#06b6d4` / `#3b82f6` | 青色到蓝色 |
| 卡片背景 | `rgba(15, 23, 42, 0.8)` | 半透明深色 |
| 边框颜色 | `rgba(6, 182, 212, 0.2)` | 青色边框 |
| 模糊程度 | `20px` | 卡片毛玻璃效果 |

## 浏览器兼容性

- 支持 CSS `backdrop-filter` 的浏览器（需要浏览器前缀）
- 支持 CSS `transform-style: preserve-3d` 的浏览器
- GSAP 3.12+ 支持所有现代浏览器
