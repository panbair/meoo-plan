# Card3DFlipGallery 组件实现方案

## 一、概述

**组件名称**：3D翻转卡片画廊（Card3DFlipGallery）
**功能描述**：支持入场动画和滚动触发的3D翻转卡片展示组件
**技术栈**：Vue 3 Composition API + GSAP + ScrollTrigger

---

## 二、架构设计

### 2.1 组件结构

```
Card3DFlipGallery
├── Props (输入)
│   ├── cards: CardItem[]          // 卡片数据数组
│   ├── cardWidth: number          // 卡片宽度
│   ├── cardHeight: number         // 卡片高度
│   ├── staggerDelay: number       // 交错动画延迟
│   └── animationDuration: number  // 动画时长
├── Emits (输出)
│   └── cardClick: [card, index]  // 卡片点击事件
└── Refs (引用)
    ├── cardSection: HTMLElement    // 外层容器
    └── cardContainer: HTMLElement  // 卡片容器
```

### 2.2 卡片数据结构

```typescript
interface CardItem {
  icon: string           // 图标/emoji
  title: string          // 标题
  desc: string           // 正面描述
  backDesc: string       // 背面描述
  gradient: string       // 背面渐变色
  stat1: number          // 统计数值1
  stat2: number          // 统计数值2
  label1: string         // 标签1
  label2: string         // 标签2
}
```

---

## 三、核心功能实现

### 3.1 入场动画（Entrance Animation）

**触发时机**：组件挂载后 200ms

**实现逻辑**：
```
1. 获取 cardContainer 的直接子元素（卡片列表）
2. 遍历每个卡片，设置初始状态
   - opacity: 0 (隐藏)
   - y: 80 (向下偏移80px)
   - rotateX: 45deg (沿X轴倾斜45度)
3. 为每个卡片创建入场动画
   - 目标状态：opacity: 1, y: 0, rotateX: 0
   - 动画时长：animationDuration (默认1秒)
   - 缓动函数：back.out(1.7) - 弹性回弹效果
   - 延迟：index * staggerDelay (交错延迟)
4. 将所有tween收集到 allTweens 数组
```

**关键代码**：
```typescript
cards.forEach((card, index) => {
  // 初始状态
  gsap.set(card, { opacity: 0, y: 80, rotateX: 45 })

  // 入场动画
  const tween = gsap.to(card, {
    opacity: 1,
    y: 0,
    rotateX: 0,
    duration: props.animationDuration,
    ease: 'back.out(1.7)',
    delay: index * props.staggerDelay,
  })
  allTweens.push(tween)
})
```

### 3.2 滚动翻转动画（Scroll Flip Animation）

**触发方式**：ScrollTrigger 滚动触发

**实现逻辑**：
```
1. 监听每个卡片的滚动位置
2. 当卡片顶部进入视口65%位置时开始动画
3. 当卡片中心到达视口中心时动画结束
4. scrub: 1.5 表示动画与滚动进度1.5秒同步（平滑效果）
5. 只对 .c3d-card-inner 应用 rotateY: 180deg
```

**关键代码**：
```typescript
const inner = card.querySelector('.c3d-card-inner') as HTMLElement
if (inner) {
  gsap.to(inner, {
    rotateY: 180,
    ease: 'none',
    scrollTrigger: {
      trigger: card,
      start: 'top 65%',      // 卡片顶部在视口65%处开始
      end: 'center center',  // 卡片中心到达视口中心结束
      scrub: 1.5,             // 平滑滚动同步
    },
  })
}
```

### 3.3 3D翻转原理

**CSS 3D 属性**：
```scss
// 外层容器 - 启用3D空间
.c3d-card {
  perspective: 1500px;  // 透视距离
}

// 内部容器 - 保持3D变换
.c3d-card-inner {
  transform-style: preserve-3d;  // 子元素保持3D位置
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

// 正面
.c3d-card-front {
  backface-visibility: hidden;  // 背面不可见
}

// 背面 - 初始已翻转180度
.c3d-card-back {
  transform: rotateY(180deg);
  backface-visibility: hidden;
}
```

**翻转流程**：
```
初始状态                    翻转后 (rotateY: 180deg)
┌─────────────┐            ┌─────────────┐
│   正面      │  ──────►   │   背面      │
│ (rotateY:0) │            │(rotateY:180)|
└─────────────┘            └─────────────┘
```

---

## 四、动画生命周期管理

### 4.1 动画收集机制

```typescript
const allTweens: gsap.core.Tween[] = []

// 每次创建动画时收集
const tween = gsap.to(card, { ... })
allTweens.push(tween)
```

### 4.2 清理机制

```typescript
const cleanupAnimations = () => {
  // 1. 终止所有收集的tween
  allTweens.forEach((tween) => tween.kill())
  allTweens.length = 0

  // 2. 终止所有ScrollTrigger
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())

  // 3. 终止所有GSAP动画
  gsap.killTweensOf('*')
}
```

### 4.3 生命周期钩子

```typescript
onMounted(() => {
  nextTick(() => {
    setTimeout(initAnimations, 200)  // 等待DOM渲染后初始化
  })
})

onUnmounted(() => {
  cleanupAnimations()  // 组件销毁时清理
})
```

---

## 五、交互设计

### 5.1 鼠标悬停效果

```scss
.c3d-card {
  cursor: pointer;

  &:hover .c3d-card-inner {
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
  }
}
```

### 5.2 点击事件

```typescript
const handleCardClick = (card: CardItem, index: number) => {
  emit('cardClick', card, index)
}
```

---

## 六、响应式设计

### 6.1 移动端适配

```scss
@media (max-width: 768px) {
  .c3d-card-container {
    gap: 20px;  // 减小卡片间距
  }

  .c3d-card {
    width: 240px !important;  // 减小卡片尺寸
    height: 320px !important;
  }
}
```

---

## 七、性能优化

### 7.1 DOM查询优化

**优化前**：
```typescript
const cards = cardContainer.value?.querySelectorAll('.c3d-card3d-1')
```

**优化后**：
```typescript
const cardElements = cardContainer.value?.children
```

**优势**：
- 直接使用 `children` 获取子元素，避免 CSS 选择器查询
- 不依赖特定类名，类名变更不会导致功能失效
- 减少 DOM 查询开销

### 7.2 动画优化

- 使用 `back.out(1.7)` 缓动函数，性能优于自定义贝塞尔曲线
- ScrollTrigger 的 `scrub` 参数平滑动画，减少帧率压力
- 统一收集 tween 到数组，便于批量清理

---

## 八、使用示例

### 8.1 基础用法

```vue
<template>
  <Card3DFlipGallery />
</template>

<script setup>
import Card3DFlipGallery from './Card3DFlipGallery.vue'
</script>
```

### 8.2 自定义卡片数据

```vue
<template>
  <Card3DFlipGallery :cards="myCards" :cardWidth="300" :cardHeight="400" />
</template>

<script setup>
const myCards = [
  {
    icon: '🎨',
    title: '设计',
    desc: '创意无限',
    backDesc: '专注用户体验',
    gradient: 'linear-gradient(135deg, #ff6b6b, #feca57)',
    stat1: 95,
    stat2: 88,
    label1: '美观度',
    label2: '可用性'
  }
]
</script>
```

### 8.3 监听点击事件

```vue
<template>
  <Card3DFlipGallery @cardClick="handleCardClick" />
</template>

<script setup>
const handleCardClick = (card, index) => {
  console.log('点击卡片:', card.title, '索引:', index)
}
</script>
```

---

## 九、文件结构

```
src/views/web-list/card/Card3DFlipGallery/
├── Card3DFlipGallery.vue    # 主组件文件
└── IMPLEMENTATION.md         # 本文档
```

---

## 十、技术要点总结

| 要点 | 说明 |
|------|------|
| **Vue 3 Composition API** | 使用 `ref`, `onMounted`, `onUnmounted` |
| **GSAP 动画库** | 入场动画 + ScrollTrigger 滚动动画 |
| **CSS 3D Transform** | `perspective`, `rotateY`, `backface-visibility` |
| **响应式设计** | 媒体查询适配移动端 |
| **生命周期管理** | 统一收集 tween，组件销毁时清理 |
| **性能优化** | `children` 替代 `querySelectorAll` |
