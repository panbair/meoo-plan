# CardPerspective - 3D 透视空间

## 简介

CardPerspective 是一个采用 3D 透视翻转动画效果的主题卡片组件。通过 `rotateX` 配合底部为转换原点，让卡片像翻牌一样从底部立起，营造出强烈的前后空间感和沉浸式体验。

## 效果预览

- **网格背景** - 透视网格营造 3D 空间感
- **渐变光晕** - 两个模糊光晕动态漂浮
- **翻转卡片** - 4 张卡片支持悬停 3D 翻转
- **入场动画** - 卡片从底部立起，rotateX: 40 → 0
- **滚动动画** - 卡片随滚动 3D 旋转 + 缩放

## 基础用法

```vue
<template>
  <CardPerspective />
</template>

<script setup lang="ts">
import CardPerspective from './CardPerspective/CardPerspective.vue'
</script>
```

## 组件参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| 无 | - | - | 组件无需传入参数，使用内置数据 |

## 数据配置

### 卡片数据 (perspectiveCards)

```typescript
const perspectiveCards = [
  {
    title: '维度突破',
    desc: '突破空间限制，开启无限可能',
    stat1: '∞',
    stat2: '360°',
    label1: '维度',
    label2: '视角',
    icon: '<svg viewBox="0 0 24 24">...</svg>'
  },
  // ...
]
```

## 技术实现

### 3D 翻转卡片核心代码

```typescript
// 设置初始状态 - 从底部立起
gsap.set(card, {
  opacity: 0,
  rotateX: 40,           // X轴旋转40度
  y: 60,                 // 向下偏移
  scale: 0.85,           // 缩小
  transformPerspective: 800,
  transformOrigin: 'center bottom'  // 以底部为转换原点
})

// 动画到最终状态
tl.to(card, {
  opacity: 1,
  rotateX: 0,            // 回到正面
  y: 0,
  scale: 1,
  duration: 0.7,
  ease: 'power3.out'
})
```

### CSS 3D 翻转

```scss
.perspective-card {
  transform-style: preserve-3d;
  transform-origin: center bottom;
}

.card-inner {
  backface-visibility: hidden;
}

.card-back {
  transform: rotateY(180deg);
}

.perspective-card:hover .card-inner {
  transform: rotateY(180deg);
}
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
CardPerspective/
├── CardPerspective.vue    # 组件源码
└── README.md              # 本文档
```

## 样式变量

可在组件源码的 `<style>` 部分修改以下变量：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| 背景渐变 | `#0c0c1d → #1a1a3e` | 深紫渐变 |
| 主色调 | `#8b5cf6 / #a78bfa` | 紫色系 |
| 卡片尺寸 | 260px × 340px | 宽 × 高 |
| perspective | 800px | 透视深度 |
| 翻转角度 | 40° / 180° | 入场 / 悬停 |

## 浏览器兼容性

- 支持 CSS `backface-visibility` 的浏览器
- 支持 CSS `transform-style: preserve-3d` 的浏览器
- GSAP 3.12+ 支持所有现代浏览器
