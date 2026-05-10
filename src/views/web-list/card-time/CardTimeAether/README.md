# CardAether - 以太能量

## 简介

CardAether 是一个模拟以太能量流效果的主题卡片组件。以太被认为是宇宙的本源能量，组件通过能量流、粒子效果、光环动画等视觉效果，营造出神秘、高雅的宇宙能量氛围。

## 效果预览

- **能量流动画** - 三层能量流横向穿梭
- **以太粒子** - 40 个漂浮粒子上下浮动
- **能量核心** - 中心三层光环 + 发光核心脉冲
- **宇宙尘埃** - 背景径向渐变光斑
- **以太卡片** - 4 张卡片，SVG 图标 + 能量条
- **入场动画** - badge 弹性缩放 + 标题缩放 + 卡片弹性登场
- **滚动动画** - 标题/副标题/卡片随滚动产生位移、旋转、模糊效果

## 基础用法

```vue
<template>
  <CardAether />
</template>

<script setup lang="ts">
import CardAether from './CardAether/CardAether.vue'
</script>
```

## 组件参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| 无 | - | - | 组件无需传入参数，使用内置数据 |

## 数据配置

组件内部定义了以下数据结构，可在组件源码中修改：

### 卡片数据 (energyCards)

```typescript
const energyCards = [
  {
    title: '虚空之力',
    desc: '源自宇宙深处的神秘能量',
    energy: '92%',
    path: 'M50 10 L90 50 L50 90 L10 50 Z'
  },
  {
    title: '以太之魂',
    desc: '连接万物本质的精纯能量',
    energy: '85%',
    path: 'M50 5 L95 50 L50 95 L5 50 Z M50 20 L80 50 L50 80 L20 50 Z'
  },
  // ...
]
```

## 技术实现

### 动画类型

| 动画类型 | 实现方式 | 说明 |
|----------|----------|------|
| 能量核心脉冲 | GSAP to | scale + opacity 往复，duration: 2s |
| 光环旋转 | GSAP to | rotation 正反旋转，duration: 8-17s |
| badge 入场 | GSAP fromTo | scale + rotation + opacity |
| 标题入场 | GSAP fromTo | y + scale + filter blur + opacity |
| 卡片入场 | GSAP fromTo + stagger | y + scale + rotation + ease: back.out(1.7) |
| 滚动消失 | ScrollTrigger | y + opacity + blur + scale |
| 卡片翻转 | ScrollTrigger | y + rotateY + rotateZ + brightness |

### DOM 引用管理

使用 Vue3 `ref` + `Map` 管理多个卡片的 DOM 引用：

```typescript
const cardRefs = ref(new Map<number, HTMLElement>())

// 模板中使用
:ref="el => cardRefs.set(i, el as HTMLElement)"
```

### 动态粒子创建

粒子在运行时动态创建，并保存清理函数：

```typescript
const createAetherParticles = () => {
  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div')
    // ... 配置粒子
    container.appendChild(particle)
    cleanupFns.push(() => particle.remove())
  }
}
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
CardAether/
├── CardAether.vue    # 组件源码
└── README.md         # 本文档
```

## 样式变量

可在组件源码的 `<style>` 部分修改以下变量：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| 背景渐变 | `#0a0015 → #1a0a30 → #2d1b4e` | 底部到顶部渐变色 |
| 主色调 | `#8a2be2` / `#b366ff` | 紫色系能量颜色 |
| 卡片背景 | `rgba(10, 0, 21, 0.8)` | 半透明深色 |
| 边框颜色 | `rgba(138, 43, 226, 0.3)` | 紫色边框 |
| 模糊程度 | `20px` | 卡片毛玻璃效果 |

## 浏览器兼容性

- 支持 CSS `backdrop-filter` 的浏览器（需要浏览器前缀）
- 支持 CSS `transform-style: preserve-3d` 的浏览器
- GSAP 3.12+ 支持所有现代浏览器
