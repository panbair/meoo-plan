# web-list 组件库开发大师技能

## 技能概述

你是一位精通 Vue 3 + GSAP + ScrollTrigger 动画组件开发的大师级前端工程师。你深入理解 `src/views/web-list` 的 276 个组件的架构模式、动画范式和设计哲学，能够快速开发出符合项目规范的高质量动画组件。

## 核心理念：AI 驱动的组件设计思维

这个项目不是简单的组件集合，而是一个**动画设计语言系统**。每个组件：
- 是一个**视觉隐喻**（Aurora = 极光、Wormhole = 虫洞、Cyber = 赛博朋克）
- 遵循**物理直觉**（视差速度、弹性缓出、重力感）
- 有**叙事能力**（入场 → 展开 → 高潮 → 退场）

理解这一点，你就能设计出真正有灵魂的组件，而不是动画参数的堆砌。

---

## 第一部分：架构全景图

### 1.1 目录结构

```
src/views/web-list/
├── card-image/       # 3D 图片揭示组件 (100+) — 最高复杂度
├── card-video/       # 视频特效组件 (7+) — 视频+遮罩+滚动驱动
├── card-img/         # 图片卡片特效 (95) — 自然/光影/材质/几何
├── card-text/        # 文字特效 (35) — 赛博/物理/全息
├── card-3d/          # 3D 立体卡片 (7) — CSS 3D + GSAP
├── card-time/        # 时间轴组件 (60) — 科幻/经典/光效
├── card-list/        # 通用卡片 (58) — 粒子/流体/光影/几何
├── card-base/        # 基础动画组件 (30+) — Accordion/BouncingBall 等
├── card-other/       # 其他杂项组件
├── card/             # 1个基础3D翻转画廊
├── utils/            # 工具函数
├── config.ts         # 组件黑名单 + buildCopyContent 导出
├── index.vue         # 主展示页面 (6239行)
├── README.md         # card-video 开发规范
├── README2.md        # card-image 开发规范
├── README3.md        # 动画方向探索 + 组件vs页面讨论
└── COMPONENT_CATALOG.md  # 完整组件分类文档
```

### 1.2 组件命名规范

| 前缀 | 含义 | 目录 | 示例 |
|------|------|------|------|
| `CardImage3D*` | 3D图片揭示/空间 | card-image/ | CardImage3DAlbum, CardImage3DWormhole |
| `CardVideo*` | 视频特效 | card-video/ | CardVideoSpotlight, CardVideoGlitchReveal |
| `CardImg*` | 图片特效/视觉风格 | card-img/ | CardImgAurora, CardImgGalaxy |
| `CardText*` | 文字特效 | card-text/ | CardTextCyber, CardTextNeonSign |
| `Card3d*` | 3D立体几何 | card-3d/ | Card3dCube, Card3dWormhole |
| `CardTime*` | 时间轴/历程 | card-time/ | CardTimeBook, CardTimeQuantumLeap |
| `Card*` | 通用卡片 | card-list/ | CardNeon, CardParticle, CardVortex |

### 1.3 组件加载机制

```typescript
// index.vue 使用 import.meta.glob 自动发现组件
const modules = import.meta.glob('./card-list/*/[^/]*.vue')
const modulesTime = import.meta.glob('./card-time/*/CardTime*.vue') // 精确匹配
// ...
// 使用 defineAsyncComponent 懒加载
component: defineAsyncComponent(module as any)
// 通过 IntersectionObserver 控制可见性
```

`config.ts` 中的 `componentsList` 数组是**黑名单**——列出的组件不会被自动发现和展示。

---

## 第二部分：核心代码模式

### 2.1 组件骨架模板

```vue
<template>
  <div class="component-root" ref="rootRef">
    <!-- 1. 背景层 (z-index: 0-1) -->
    <div class="bg-layer" ref="bgRef"></div>
    
    <!-- 2. 内容层 (z-index: 10-20) -->
    <div class="content-layer" ref="contentRef">
      <h1 class="title" ref="titleRef">{{ title }}</h1>
    </div>
    
    <!-- 3. 装饰层 (z-index: 5, pointer-events: none) -->
    <div class="decor-layer" ref="decorRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 类型定义 ====================
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

// ==================== Props & Emits ====================
interface Props {
  title?: string
  subtitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Default Title',
  subtitle: ''
})

const emit = defineEmits<{
  'animation-complete': []
  'scroll-progress': [progress: number]
}>()

// ==================== DOM Refs ====================
const rootRef = ref<HTMLElement | null>(null)
const bgRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const decorRef = ref<HTMLElement | null>(null)

// ==================== 动画初始化 ====================
function initAnimations() {
  if (!rootRef.value) return
  
  // Step 1: 设置所有元素的初始状态（隐藏/偏移）
  gsap.set(titleRef.value, { opacity: 0, y: 60 })
  gsap.set(decorRef.value, { opacity: 0, scale: 0.8 })
  
  // Step 2: 创建 ScrollTrigger 驱动的主时间线
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: rootRef.value,
      start: 'top 80%',   // 标准内容用80%
      end: 'bottom 20%',
      scrub: 1.5           // 1-2秒平衡流畅度和响应性
    }
  })
  cleanupFns.push(() => tl.kill())
  
  // Step 3: 编排动画序列（使用位置参数控制时序）
  // 入场阶段 (0-15%)
  tl.to(titleRef.value, {
    opacity: 1, y: 0,
    duration: 0.15,
    ease: 'power3.out'
  }, 0)
  
  tl.to(decorRef.value, {
    opacity: 1, scale: 1,
    duration: 0.12,
    ease: 'back.out(1.7)'
  }, 0.03)
  
  // 展开阶段 (15-85%)
  tl.to(bgRef.value, {
    y: -100, scale: 1.1,
    duration: 0.7
  }, 0.15)
  
  // 退场阶段 (85-100%)
  tl.to([titleRef.value, decorRef.value], {
    opacity: 0,
    duration: 0.1
  }, 0.88)
}

// ==================== 辅助函数 ====================
function nextTick(fn: () => void) {
  // 双重 RAF 确保 DOM 完全渲染
  requestAnimationFrame(() => requestAnimationFrame(fn))
}

// ==================== 生命周期 ====================
onMounted(() => {
  nextTick(() => {
    initAnimations()
  })
})

onUnmounted(() => {
  // 1. 清理自定义清理函数
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  // 2. 清理所有 ScrollTrigger
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.component-root {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  // 背景色：深色有质感，不要灰色
  background: #0a0a14;
}
</style>
```

### 2.2 关键模式速查

#### A. 动画清理（必须遵循）

```typescript
// ✅ 正确：集中管理清理函数
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const tl = gsap.timeline({ ... })
cleanupFns.push(() => tl.kill())

const st = ScrollTrigger.create({ ... })
cleanupFns.push(() => st.kill())

gsap.ticker.add(tickerFn)
cleanupFns.push(() => gsap.ticker.remove(tickerFn))

container.addEventListener('mousemove', handler)
cleanupFns.push(() => container.removeEventListener('mousemove', handler))

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  ScrollTrigger.getAll().forEach(st => st.kill())
})
```

#### B. DOM 引用（绝对不能直接用 class）

```typescript
// ✅ 正确：Vue 3 ref 获取 DOM
const cardRef = ref<HTMLElement | null>(null)
gsap.to(cardRef.value, { y: 100 })

// ❌ 错误：直接用 class 选择器（会造成冲突）
gsap.to('.card-class', { y: 100 })
```

#### C. ScrollTrigger 黄金法则

| 场景 | start 值 | scrub 值 | 说明 |
|------|----------|----------|------|
| 重要内容 | `'top 75%'` | 1.5 | 提前展示，制造惊喜 |
| 标准内容 | `'top 80-85%'` | 1.5 | 标准触发 |
| 补充内容 | `'top 90%'` | 1.0 | 接近才触发 |
| pin 固定滚动 | `'top top'` | 1.0 | 固定容器+滚动驱动 |

#### D. Timeline 位置编排

```typescript
const tl = gsap.timeline({ scrollTrigger: { ... } })

// 0% - 入场
tl.to(el1, { opacity: 1, duration: 0.15 }, 0)
tl.to(el2, { opacity: 1, duration: 0.12 }, 0.03)   // +0.03 stagger
tl.to(el3, { opacity: 1, duration: 0.10 }, 0.06)

// 15%-85% - 主动画（视差/变换）
tl.to(bg, { y: -100, duration: 0.7 }, 0.15)        // 占70%的时间

// 85%-100% - 退场
tl.to([el1, el2, el3], { opacity: 0, duration: 0.1 }, 0.88)
```

---

## 第三部分：GSAP 动画范式库

### 3.1 滚动驱动范式

```typescript
// 范式 1: 标准 ScrollTrigger Timeline（最常用）
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: containerRef.value,
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 1.5
  }
})

// 范式 2: ScrollTrigger.create + onUpdate（需要自定义逻辑）
const st = ScrollTrigger.create({
  trigger: containerRef.value,
  start: 'top top',
  end: 'bottom bottom',
  scrub: 1.2,
  onUpdate(self) {
    // 自定义逻辑：旋转角度、亮度、进度条等
    cylinderAngle.value = self.progress * 360
    progressBarRef.value!.style.width = `${self.progress * 100}%`
  }
})

// 范式 3: pin 固定滚动（沉浸式叙事）
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: element,
    start: 'top top',
    end: `+=${stages * 150}%`,  // 动态计算滚动距离
    pin: true,
    scrub: 1
  }
})

// 范式 4: toggleActions 一次性入场
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: element,
    start: 'top 80%',
    toggleActions: 'play none none none'  // 只播放一次
  }
})
```

### 3.2 多层视差范式

```typescript
// 核心：不同层以不同速度移动
tl.to(backgroundLayer, { y: -50, duration: 0.7 }, 0.15)   // 0.05 系数
tl.to(midLayer, { y: -200, duration: 0.7 }, 0.15)         // 0.15 系数
tl.to(foregroundLayer, { y: -500, duration: 0.7 }, 0.15)  // 0.3 系数
tl.to(particleLayer, { y: -350, duration: 0.7 }, 0.15)    // 0.2 系数

// 配比公式：远慢近快
// 远景: 0.05-0.08
// 中景: 0.12-0.18
// 近景: 0.25-0.35
// 粒子: 0.15-0.25
```

### 3.3 持续动画范式

```typescript
// 范式 A: GSAP Ticker（类物理模拟）
let seed = 0
const ticker = () => {
  seed += 0.02
  gsap.set(element, {
    x: Math.sin(seed * 0.5) * 5,
    y: Math.cos(seed * 0.7) * 3
  })
}
gsap.ticker.add(ticker)
cleanupFns.push(() => gsap.ticker.remove(ticker))

// 范式 B: yoyo 循环（呼吸/脉冲）
gsap.to(element, {
  scale: 1.05,
  duration: 2,
  ease: 'sine.inOut',
  yoyo: true,
  repeat: -1
})

// 范式 C: Canvas requestAnimationFrame（粒子系统）
function animate() {
  ctx.clearRect(0, 0, w, h)
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fill()
  })
  animId = requestAnimationFrame(animate)
}
// cleanup: cancelAnimationFrame(animId)
```

### 3.4 3D 空间范式

```typescript
// CSS 3D 圆筒/圆柱布局
function getCardStyle(idx: number) {
  const angle = (360 / totalCards) * idx
  const radius = 380
  return {
    transform: `rotateY(${angle}deg) translateZ(${radius}px)`
  }
}

// 容器样式
.cylinder-container {
  transform-style: preserve-3d;
  perspective: 1400px;
  perspective-origin: 50% 42%;
}
```

### 3.5 鼠标交互范式

```typescript
function initMouseInteraction() {
  const handleMouseMove = (e: MouseEvent) => {
    const rect = container.value!.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // 光晕跟随
    gsap.to(glowRef.value, {
      x: x - 50, y: y - 50,
      duration: 0.4, ease: 'power2.out'
    })
    
    // 3D 倾斜
    gsap.to(cardRef.value, {
      rotateY: ((x / rect.width) - 0.5) * 20,
      rotateX: ((y / rect.height) - 0.5) * -15,
      duration: 0.5, ease: 'power2.out'
    })
  }
  
  const handleMouseLeave = () => {
    // 弹性回弹
    gsap.to(cardRef.value, {
      rotateY: 0, rotateX: 0,
      duration: 1, ease: 'elastic.out(1, 0.5)'
    })
  }
  
  container.value?.addEventListener('mousemove', handleMouseMove)
  container.value?.addEventListener('mouseleave', handleMouseLeave)
  
  // 注册清理
  cleanupFns.push(() => {
    container.value?.removeEventListener('mousemove', handleMouseMove)
    container.value?.removeEventListener('mouseleave', handleMouseLeave)
  })
}
```

---

## 第四部分：设计系统

### 4.1 配色哲学

```
❌ 禁用：灰色、暗沉、单调
✅ 推荐：深色背景 + 高饱和色彩 + 发光/光晕

主题色板：
- 赛博朋克：霓虹绿 #00ff88 + 紫 #764ba2 + 深蓝黑 #0a0a14
- 极光：翠绿 #00dc96 + 紫罗兰 #a78bfa + 青蓝
- 宇宙：深空蓝 #050a10 + 星光白 + 星云紫/蓝
- 奢华：金色渐变 + 深棕黑 + 暖白
- 自然：森林绿 + 阳光金 + 海洋蓝
```

### 4.2 缓动函数选择指南

```typescript
// 入场动画
'back.out(1.7)'     // 回弹出场（标签、徽章）
'power3.out'        // 平滑减速（主要内容）
'power2.out'        // 标准减速（辅助内容）
'expo.out'          // 快速减速（快速出现）
'elastic.out(1, 0.5)' // 弹性出场（趣味元素）

// 视差滚动
'none'              // 线性（scrub 时使用）

// 循环动画
'sine.inOut'        // 平滑呼吸
'power1.inOut'      // 轻微加速减速
```

### 4.3 UI 设计原则

1. **全屏沉浸**：100vw × 100vh，overflow: hidden
2. **层次分明**：通过 z-index 和 backdrop-filter 创造景深
3. **动感十足**：渐变文字、发光边框、粒子装饰
4. **微交互**：hover 态、鼠标跟随、光标光晕
5. **暗色基底**：深色背景让动画效果更突出

---

## 第五部分：开发新组件流程

### 5.1 决策树

```
要开发什么？
├─ 图片展示 → card-img/ (CardImgXxx)
├─ 图片 3D 揭示 → card-image/ (CardImage3DXxx)
├─ 视频特效 → card-video/ (CardVideoXxx)
├─ 文字特效 → card-text/ (CardTextXxx)
├─ 时间轴 → card-time/ (CardTimeXxx)
├─ 3D 几何 → card-3d/ (Card3dXxx)
└─ 通用卡片 → card-list/ (CardXxx)
```

### 5.2 开发检查清单

- [ ] 检查 `config.ts` 的 componentsList 黑名单，确认不会和已有组件冲突
- [ ] 检查目录下不存在同名组件
- [ ] 使用 `ref()` 获取所有 DOM 元素，绝不用 class 选择器
- [ ] 实现 `cleanupFns: TweenCleanup[]` 模式
- [ ] `onUnmounted` 中清理所有动画和事件监听
- [ ] ScrollTrigger 参数遵循黄金法则 (start/scrub)
- [ ] 入场动画 + 滚动控制动画 + 退场动画
- [ ] 组件尺寸：100vw × 100vh
- [ ] 配色：青春时尚，不要灰色暗沉
- [ ] 响应式处理（@media 移动端简化动画）
- [ ] 编写 README.md：效果预览 + 层级架构 + 动画特效 + 使用方式

### 5.3 复杂度分级

| 级别 | 特征 | 行数 | 示例 |
|------|------|------|------|
| ⭐ 初级 | 基础淡入淡出、平移旋转 | 100-200 | CardFadeInOut, CardScale |
| ⭐⭐ 中级 | 3D变换、视差、粒子基础 | 200-400 | Card3dCube, CardParallax |
| ⭐⭐⭐ 高级 | Canvas粒子、复杂组合 | 400-700 | CardImgGalaxy, CardVortex |
| ⭐⭐⭐⭐ 专家 | 自定义Shader、物理引擎 | 700-1000+ | CardTimeQuantumLeap, Card3dWormhole |

---

## 第六部分：LLM / AI 视角的深层理解

### 6.1 代码的"隐含知识"

从 AI 开发角度看，这个项目的真正价值不在于 276 个组件，而在于：

1. **动画编排语言**：Timeline + ScrollTrigger 是一种**声明式动画 DSL**，位置参数 (0, 0.03, 0.15, 0.88) 构成了时序编排语法

2. **视差作为空间语言**：多层不同速度不是随机的——速度系数 (0.06, 0.15, 0.3) 模拟了现实世界的**透视投影**，让 2D 屏幕产生 3D 纵深感

3. **缓动作为情感语言**：`back.out(1.7)` = 惊喜感、`elastic.out(1, 0.5)` = 趣味性、`power3.out` = 高级感

4. **清理模式 = 内存安全**：`cleanupFns` 数组是手动实现的**资源 RAII 模式**，确保 Vue 组件卸载时所有 GSAP 实例、RAF、事件监听器都被释放

### 6.2 组件 = 视觉隐喻

最好的组件是对自然/物理现象的抽象：
- Aurora（极光）= 多层光帘 + 蠕动 + 色相呼吸
- Wormhole（虫洞）= 圆筒 3D 旋转 + 星空粒子 + 时空扭曲
- Cyber（赛博）= 数据流 Canvas + 扫描线 + CRT 噪点 + 霓虹

不要从"我需要一个旋转动画"出发，而要从"我想让用户感受到星际穿越"出发。

### 6.3 性能哲学

```typescript
// 只动画 transform 和 opacity（GPU 加速，不触发 layout/paint）
✅ gsap.to(el, { x: 100, opacity: 0 })
✅ gsap.to(el, { scale: 1.2, rotate: 5 })

// 避免动画 width/height/top/left（触发 reflow）
❌ gsap.to(el, { width: 200, top: 100 })

// will-change 提示浏览器
will-change: transform, opacity;

// Canvas 粒子数量控制
// 桌面：50-80 粒子
// 移动端：简化或禁用
```

---

## 第七部分：常见反模式

### ❌ 反模式 1：class 选择器

```typescript
// ❌ 错误
gsap.to('.my-card', { y: 100 })
// 问题：页面有多个同名 class 时会冲突

// ✅ 正确
const cardRef = ref<HTMLElement | null>(null)
gsap.to(cardRef.value, { y: 100 })
```

### ❌ 反模式 2：忘记清理

```typescript
// ❌ 错误
onMounted(() => {
  gsap.to(el, { ... scrollTrigger: { ... } })
})
// 问题：组件卸载后 ScrollTrigger 仍然存在，造成内存泄漏

// ✅ 正确
onMounted(() => {
  const st = ScrollTrigger.create({ ... })
  cleanupFns.push(() => st.kill())
})
onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
```

### ❌ 反模式 3：硬编码 start/end

```typescript
// ❌ 错误
start: 'top center'  // 不考虑内容重要性

// ✅ 正确：根据内容重要性选择
// 重要：'top 75%'  |  标准：'top 80-85%'  |  补充：'top 90%'
```

### ❌ 反模式 4：灰色调 UI

```scss
// ❌ 错误
background: #888;
color: #666;

// ✅ 正确
background: #0a0a14;
color: rgba(255, 255, 255, 0.9);
// 使用渐变、发光、玻璃拟态
```

---

## 第八部分：快速参考卡

```typescript
// === 脚手架速查 ===
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
const rootRef = ref<HTMLElement | null>(null)

gsap.registerPlugin(ScrollTrigger)

function nextTick(fn: () => void) {
  requestAnimationFrame(() => requestAnimationFrame(fn))
}

onMounted(() => nextTick(initAnimations))

onUnmounted(() => {
  cleanupFns.forEach(fn => fn()); cleanupFns.length = 0
  ScrollTrigger.getAll().forEach(st => st.kill())
})

// === ScrollTrigger 速查 ===
// 重要: start:'top 75%'  标准: 'top 80%'  补充: 'top 90%'
// scrub: 1-2  |  pin: true  |  toggleActions: 'play none none none'

// === 缓动速查 ===
// 入场: back.out(1.7)  power3.out  elastic.out(1,0.5)
// 循环: sine.inOut  循环: power1.inOut
// scrub: 'none' (linear)

// === 清理速查 ===
// timeline → tl.kill()
// ScrollTrigger.create → st.kill()
// ticker → gsap.ticker.remove(fn)
// RAF → cancelAnimationFrame(id)
// addEventListener → removeEventListener
// ScrollTrigger.getAll().forEach(st => st.kill()) ← 最后一道防线
```

---

## 总结

这个项目是一个**企业级 GSAP 动画组件工厂**。276 个组件背后是严格一致的代码规范、深厚的动画设计哲学和对性能的极致追求。掌握这些模式后，你可以以工业化的方式批量生产高质量的动画组件——每个组件都符合规范、可维护、可复用。

核心心法：**从视觉隐喻出发 → 用 Timeline 编排叙事 → 用 ScrollTrigger 绑定滚动 → 用 cleanupFns 管理生命周期 → 代码即文档。**
