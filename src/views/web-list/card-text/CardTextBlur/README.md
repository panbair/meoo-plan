# CardTextBlur 组件开发详细方案

## 1. 组件概述

### 组件名称
CardTextBlur - 文字模糊揭示动画组件

### 组件后缀
`104`

### 功能描述
通过 GSAP ScrollTrigger 实现文字的模糊揭示动画效果，当用户滚动页面时，文字元素从模糊状态逐渐变得清晰，同时伴随位移和缩放动画。

### 视觉特效
- **模糊揭示**: `blur(25px)` → `blur(0px)`
- **位移动画**: Y轴 +150px，X轴 -100px
- **缩放动画**: `scale(0.9)` → `scale(1)`
- **透明度动画**: `opacity(0)` → `opacity(1)`

---

## 2. 技术实现

### 技术栈
- Vue 3 (Composition API + `<script setup>`)
- GSAP (GreenSock Animation Platform)
- GSAP ScrollTrigger 插件
- TypeScript

### 核心特性
| 特性 | 说明 |
|------|------|
| ref 获取 DOM | 使用 `ref` 获取元素，避免 className 冲突 |
| gsap.context | 作用域隔离，便于清理 |
| ScrollTrigger | 滚动触发动画 |
| cleanup 函数 | 完善的组件卸载清理机制 |

---

## 3. 动画配置

### ScrollTrigger 参数

```typescript
scrollTrigger: {
  trigger: element,      // 触发元素
  start: 'top 80%',      // 元素顶部到达视口80%时开始
  end: 'top 20%',        // 元素顶部到达视口20%时结束
  scrub: 1.5            // 平滑系数
}
```

### 动画时序

| 元素 | 初始状态 | 结束状态 | 时长 | 延迟 |
|------|----------|----------|------|------|
| 标题 | y:120, opacity:0, scale:0.8, blur:20px | y:0, opacity:1, scale:1, blur:0 | 1.2s | 0 |
| 描述 | y:80, opacity:0, scale:0.9, blur:15px | y:0, opacity:1, scale:1, blur:0 | 1s | 0 |
| 段落 | y:150, opacity:0, scale:0.9, blur:25px | y:0, opacity:1, scale:1, blur:0 | 1.2s | 0.15s stagger |
| 滑入 | x:-100, opacity:0 | x:0, opacity:1 | 0.8s | 0.15s stagger |

---

## 4. 代码结构

### 模板结构

```vue
<template>
  <div class="stb-section-104" ref="sectionRef">
    <div class="stb-header-104" ref="headerRef">
      <h2 class="stb-title-104" ref="titleRef">标题</h2>
      <p class="stb-desc-104" ref="descRef">描述</p>
    </div>
    <div class="stb-content-104" ref="contentRef">
      <p v-for="(text, index) in paragraphs" 
         :key="index" 
         class="stb-paragraph-104"
         :ref="el => setParagraphRef(el, index)">
        {{ text }}
      </p>
    </div>
  </div>
</template>
```

### Vue3 ref 获取元素

```typescript
// 单元素 ref
const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const descRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

// 多元素 ref (v-for)
const paragraphRefs = ref<(HTMLElement | null)[]>([])
const paragraphSet = new Set<HTMLElement>()

const setParagraphRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    paragraphRefs.value[index] = el
    paragraphSet.add(el)
  }
}
```

---

## 5. 动画实现

### GSAP Context 隔离

```typescript
let ctx: gsap.Context | null = null

onMounted(() => {
  const rootEl = sectionRef.value
  if (!rootEl) return

  ctx = gsap.context(() => {
    // 所有动画在这里定义
  }, rootEl)  // 作用域限制在 rootEl
})
```

### 标题模糊揭示动画

```typescript
const titleTl = gsap.fromTo(titleRef.value,
  { y: 120, opacity: 0, scale: 0.8, filter: 'blur(20px)' },
  {
    y: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: headerRef.value || rootEl,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5
    }
  }
)
cleanupFns.push(() => titleTl.kill())
```

### 段落交错滑入动画

```typescript
const contentTl = gsap.fromTo(validParagraphs,
  { x: -100, opacity: 0 },
  {
    x: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out',
    stagger: 0.15,
    scrollTrigger: {
      trigger: contentRef.value,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5
    }
  }
)
cleanupFns.push(() => contentTl.kill())
```

---

## 6. 清理机制

### 清理函数注册

```typescript
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

// 每个动画注册清理函数
cleanupFns.push(() => titleTl.kill())
cleanupFns.push(() => descTl.kill())
cleanupFns.push(() => paragraphTl.kill())
cleanupFns.push(() => contentTl.kill())
```

### onUnmounted 清理

```typescript
onUnmounted(() => {
  // 1. 清理所有保存的 tween
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0

  // 2. 清理 gsap.context
  ctx?.revert()
  ctx = null

  // 3. 清理 ScrollTrigger 实例
  ScrollTrigger.getAll().forEach(st => {
    const trigger = st.vars.trigger
    if (trigger && typeof trigger === 'object' && paragraphSet.has(trigger as HTMLElement)) {
      st.kill()
    }
  })

  // 4. 清理 ref
  paragraphRefs.value = []
  paragraphSet.clear()
})
```

---

## 7. 样式设计

### 背景样式

```css
.stb-section-104 {
  background: linear-gradient(135deg, 
    rgba(15, 15, 35, 0.95) 0%, 
    rgba(25, 25, 65, 0.9) 100%);
}
```

### 渐变光晕

```css
.stb-section-104::before {
  background: 
    radial-gradient(circle at 20% 30%, rgba(120, 80, 200, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(80, 150, 220, 0.1) 0%, transparent 50%);
}
```

### 标题渐变文字

```css
.stb-title-104 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### 卡片样式

```css
.stb-paragraph-104 {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stb-paragraph-104:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateX(8px);
}
```

---

## 8. 类名规范

### 唯一后缀
所有类名使用唯一后缀 `104`，避免样式冲突。

### 类名列表

| 类名 | 用途 | 元素 |
|------|------|------|
| `.stb-section-104` | 容器 | 根容器 |
| `.stb-header-104` | 头部 | 标题区域 |
| `.stb-title-104` | 标题 | h2 标题 |
| `.stb-desc-104` | 描述 | p 描述文字 |
| `.stb-content-104` | 内容 | 段落容器 |
| `.stb-paragraph-104` | 段落 | p 段落文字 |

---

## 9. 使用示例

### 基本用法

```vue
<template>
  <CardTextBlur />
</template>

<script setup lang="ts">
import CardTextBlur from './CardTextBlur/CardTextBlur.vue'
</script>
```

### 自定义内容

```vue
<template>
  <CardTextBlur 
    :title="'自定义标题'"
    :description="'自定义描述'"
    :paragraphs="customParagraphs"
  />
</template>
```

---

## 10. 性能优化

### 优化策略

1. **gsap.context 隔离**: 避免全局污染
2. **cleanup 函数**: 及时清理无用动画
3. **ref 获取元素**: 避免选择器查询
4. **scrub 平滑**: 提升滚动动画流畅度
5. **will-change**: 可选添加 CSS 属性优化

### 注意事项

- 确保在 `onMounted` 后访问 ref
- 清理所有 ScrollTrigger 实例
- 避免在动画中创建大量对象
- 使用 `filter: blur()` 需注意性能

---

## 11. 浏览器兼容

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

### 兼容性说明

- `backdrop-filter` 需要 Safari 9+
- `CSS mix-blend-mode` 支持现代浏览器
- GSAP ScrollTrigger 全平台支持

---

## 12. 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| 1.0.0 | 2026-05-11 | 初始版本，支持模糊揭示动画 |
| 1.1.0 | 2026-05-11 | 优化 ref 获取，添加交错动画 |

---

## 13. API 参考

### Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| title | string | '文字模糊揭示动画' | 标题文本 |
| description | string | '流畅的文字模糊揭示效果' | 描述文本 |
| paragraphs | string[] | [...] | 段落内容数组 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| animation-start | - | 动画开始时触发 |
| animation-end | - | 动画结束时触发 |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 自定义内容插槽 |
