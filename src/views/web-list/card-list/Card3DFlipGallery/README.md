# Card3DFlipGallery 组件实现方案

## 目录

- [组件概述](#组件概述)
- [技术架构](#技术架构)
- [Vue3 最佳实践](#vue3-最佳实践)
- [核心实现](#核心实现)
- [GSAP 动画系统](#gsap-动画系统)
- [CSS 3D 变换](#css-3d-变换)
- [性能优化](#性能优化)
- [使用说明](#使用说明)

---

## 组件概述

### 功能说明

`Card3DFlipGallery` 是一个支持滚动触发的 3D 卡片翻转画廊组件，具有以下特性：

- **入场动画**：页面加载时卡片从下方飞入，带 3D 透视效果
- **滚动翻转**：随页面滚动，卡片进行 Y 轴 180° 翻转
- **数据展示**：支持正反面不同内容展示（标题、描述、统计数据）

### 效果预览

```
正面（默认）              背面（翻转后）
┌─────────────┐         ┌─────────────┐
│    🚀       │         │             │
│             │         │    创新     │
│    创新     │  翻转   │             │
│             │ ──────► │  创新度: 98 │
│  探索无限可能│         │  影响力: 85 │
│             │         │             │
└─────────────┘         └─────────────┘
```

---

## 技术架构

### 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.3 | 核心框架 |
| TypeScript | ^5.0 | 类型系统 |
| GSAP | ^3.12 | 动画引擎 |
| ScrollTrigger | ^3.12 | 滚动动画插件 |
| SCSS | ^1.6 | 样式预处理 |

### 文件结构

```
card-list/
└── Card3DFlipGallery/
    └── Card3DFlipGallery.vue          # 组件源码
    └── README.md            # 本文档
```

---

## Vue3 最佳实践

### 1. Composition API 结构

采用 `<script setup>` 语法糖，代码结构清晰：

```
├── 依赖导入          (第48-56行)
├── 类型定义          (第58-80行)
├── 常量配置          (第82-136行)
├── 响应式状态        (第138-146行)
├── 模板引用处理      (第148-180行)
├── 动画逻辑          (第182-251行)
└── 生命周期          (第253-265行)
```

### 2. 模板引用 (Template Refs)

使用 `Map` + `index` 模式管理多个元素引用：

```typescript
// 使用 Map 存储，通过 index 精确控制
const itemRefsMap = ref(new Map<number, HTMLElement>())
const innerRefsMap = ref(new Map<number, HTMLElement>())

// 回调函数签名：接收 el 和 index
const setItemRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el) {
    // 兼容 Element 和组件实例
    const element = el instanceof Element ? el : (el as { $el: Element }).$el
    if (element instanceof HTMLElement) {
      itemRefsMap.value.set(index, element)
    }
  } else {
    // 组件卸载时清理
    itemRefsMap.value.delete(index)
  }
}
```

**优势**：
- 通过 index 精确控制每个元素
- 支持元素动态添加/删除
- 避免数组 `push` 导致的重复累积问题

### 3. 类型安全

```typescript
// 使用 instanceof 进行类型检查
if (el instanceof Element) {
  // Element 类型处理
}

// 组件实例需要访问 $el
const element = el instanceof Element 
  ? el 
  : (el as { $el: Element }).$el
```

### 4. 生命周期管理

```typescript
onMounted(() => {
  // requestAnimationFrame 确保 DOM 完全渲染
  requestAnimationFrame(() => {
    initEntryAnimation()
    initScrollFlipAnimation()
  })
})

onUnmounted(() => {
  cleanupAnimations()
})
```

---

## 核心实现

### 数据结构

```typescript
interface CardStat {
  value: number  // 数值
  label: string // 标签
}

interface Card {
  id: string
  icon: string              // 表情图标
  title: string             // 标题
  desc: string              // 正面描述
  descBack: string          // 背面描述
  gradient: string          // 背面渐变背景
  stats: {
    stat1: CardStat         // 统计数据1
    stat2: CardStat         // 统计数据2
  }
}
```

### 模板结构

```vue
<div class="card-3d-item" :ref="(el) => setItemRef(el, index)">
  <!-- 内层负责翻转 -->
  <div class="card-3d-inner" :ref="(el) => setInnerRef(el, index)">
    <!-- 正面 -->
    <div class="card-3d-face card-3d-front">
      <span class="card-3d-icon">{{ card.icon }}</span>
      <h3>{{ card.title }}</h3>
      <p>{{ card.desc }}</p>
    </div>
    <!-- 背面 -->
    <div class="card-3d-face card-3d-back" :style="{ background: card.gradient }">
      <h3>{{ card.title }}</h3>
      <p>{{ card.descBack }}</p>
      <div class="card-3d-stats">
        <!-- 统计数据 -->
      </div>
    </div>
  </div>
</div>
```

### DOM 层级关系

```
.card-3d-section (容器)
└── .card-3d-container (网格)
    └── .card-3d-item (perspective 视角)
        └── .card-3d-inner (transform-style: preserve-3d)
            ├── .card-3d-face.card-3d-front (rotateY: 0deg)
            └── .card-3d-face.card-3d-back (rotateY: 180deg)
```

---

## GSAP 动画系统

### 插件注册

```typescript
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
```

### 入场动画

```typescript
const initEntryAnimation = () => {
  const elements = Array.from(itemRefsMap.value.values())
  
  gsap.fromTo(
    elements,                                    // 目标元素数组
    { y: 80, opacity: 0, rotateX: 40 },         // 起始状态
    {
      y: 0,                                      // 结束位置
      opacity: 1,                                // 完全显示
      rotateX: 0,                                // 归位
      duration: 0.8,                            // 动画时长
      ease: 'back.out(1.7)',                     // 弹性缓动
      stagger: 0.15                             // 错开时间
    }
  )
}
```

### 滚动翻转动画

```typescript
const initScrollFlipAnimation = () => {
  innerRefsMap.value.forEach((inner) => {
    const parent = inner.parentElement
    
    gsap.to(inner, {
      rotateY: 180,                              // 翻转180度
      ease: 'none',                              // 线性（与滚动同步）
      scrollTrigger: {
        trigger: parent,                         // 触发元素
        start: 'top 80%',                        // 开始位置
        end: 'top 20%',                          // 结束位置
        scrub: 1.5                                // 滚动平滑系数
      }
    })
  })
}
```

### ScrollTrigger 参数说明

| 参数 | 值 | 说明 |
|------|-----|------|
| `trigger` | `parent` | 触发器元素 |
| `start` | `'top 80%'` | 元素顶部到达视口80%时开始 |
| `end` | `'top 20%'` | 元素顶部到达视口20%时结束 |
| `scrub` | `1.5` | 平滑系数，值越大动画越平滑 |

### 动画清理

```typescript
let cleanupFns: TweenCleanup[] = []

// 保存清理函数
const tween = gsap.fromTo(...)
cleanupFns.push(() => tween.kill())

// 组件卸载时清理
const cleanupAnimations = () => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  cleanupFns.forEach((fn) => fn())
  cleanupFns = []
}
```

---

## CSS 3D 变换

### 透视效果

```scss
.card-3d-container {
  perspective: 1500px;  // 观察者与 z=0 平面的距离
}

.card-3d-item {
  perspective: 1500px;  // 每个卡片的独立透视
}
```

### 3D 属性

```scss
.card-3d-inner {
  transform-style: preserve-3d;  // 保持3D变换
  transition: transform 0.6s;     // 平滑过渡
}
```

### 背面隐藏

```scss
.card-3d-face {
  backface-visibility: hidden;           // 标准属性
  -webkit-backface-visibility: hidden;  // Safari 兼容
}
```

### 翻转原理

```
初始状态：               翻转180度后：
┌─────────────┐         ┌─────────────┐
│   正面可见   │  翻转    │   背面可见   │
│             │ ──────►  │             │
│   rotateY:  │          │  rotateY:   │
│    0deg     │          │   180deg    │
└─────────────┘          └─────────────┘
```

---

## 性能优化

### 1. 避免 CSS 选择器

```typescript
// ❌ 错误：在 Vue scoped 样式下无效
gsap.killTweensOf('.card-3d-item')

// ✅ 正确：使用元素引用
gsap.fromTo(itemRefs.value, ...)
```

### 2. 使用 requestAnimationFrame

```typescript
// ❌ 不推荐：nextTick 可能不够
await nextTick()

// ✅ 推荐：确保下一帧 DOM 已渲染
requestAnimationFrame(() => { ... })
```

### 3. 组件卸载清理

- 销毁所有 ScrollTrigger 实例
- 停止所有 GSAP 动画
- 清空 ref Map 释放内存

### 4. 使用 Map 管理引用

```typescript
// ❌ 数组方式：可能重复累积
const refs = ref([])
:ref="el => el && refs.value.push(el)"

// ✅ Map方式：精确控制
const refsMap = ref(new Map())
:ref="(el, index) => el && refsMap.value.set(index, el)"
```

---

## 使用说明

### 基本使用

```vue
<template>
  <Card3DFlipGallery />
</template>

<script setup lang="ts">
import Card3DFlipGallery from './card-list/Card3DFlipGallery/Card3DFlipGallery.vue'
</script>
```

### 自定义数据

修改 `CARDS_DATA` 常量：

```typescript
const CARDS_DATA: Card[] = [
  {
    id: 'custom',
    icon: '🎨',
    title: '自定义',
    desc: '描述文本',
    descBack: '背面描述',
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
    stats: {
      stat1: { value: 90, label: '评分' },
      stat2: { value: 85, label: '人气' }
    }
  }
]
```

### 动画配置

修改动画常量：

```typescript
// 入场动画配置
const ENTRY_ANIMATION = {
  from: { y: 100, opacity: 0 },
  to: { y: 0, opacity: 1 },
  duration: 1,
  ease: 'power2.out',
  stagger: 0.2
}

// 滚动翻转配置
const FLIP_ANIMATION = {
  rotateY: 180,
  scrub: 2  // 调整平滑度
}
```

---

## 注意事项

1. **SSR 兼容**：GSAP 需要在客户端执行，确保在 `onMounted` 中初始化
2. **性能监控**：大量卡片时注意控制动画数量
3. **移动端适配**：已在 CSS 中添加响应式样式
4. **浏览器兼容**：需要支持 CSS `transform-style: preserve-3d`

---

## 更新日志

### v1.0.0
- 初始版本实现
- 支持入场动画和滚动翻转
- Vue3 Composition API 重构
- TypeScript 类型完善
