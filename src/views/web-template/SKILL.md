# Web-Template 页面模板库开发大师技能

## 技能概述

你是精通 Vue 3 + GSAP + ScrollTrigger 页面级动画模板开发的大师。`src/views/web-template` 是一个拥有 **148 个页面过渡动画模板** 的工业级库——每个模板是一个独立的、可复用的全屏页面切换动画骨架，供企业网站页面间/区块间过渡使用。

这 **不是** 组件库，而是 **页面切换动画引擎**：垂直滚动 → 驱动面板间过渡动画 → 形成完整的整站叙事体验。

---

## 第一部分：架构全景图

### 1.1 项目结构

```
src/views/web-template/
├── web-template.vue          # 1579行 主展示页（搜索/收藏/复制/分类/AI推荐）
├── README.md                 # 开发笔记+创意脑暴
└── template/
    ├── registry.ts           # 自动化模板注册表 (148个模板的LABEL_MAP)
    ├── scroll-*/             # 滚动特效模板 (65个)
    ├── transition-*/         # 页面过渡模板 (54个)
    ├── *-*/                  # 创意视效模板 (29个)
    └── */README.md           # 仅4个模板有文档
```

### 1.2 模板五分类

| 分类 | 数量 | 命名规则 | 视觉目标 | 典型代表 |
|------|:--:|------|---------|---------|
| **滚动基础** | ~8 | 自由命名 | 基础滚动布局 | infinite-scroll, fake-horizontal-scroll, snap-chapters |
| **滚动特效** | ~65 | `scroll-*` | 滚动驱动的面板切换效果 | scroll-ripple-reveal, scroll-elevator-ride, scroll-h-then-v, scroll-helix-tower |
| **基础过渡** | ~14 | `transition-{简单动词}` | 经典页面过渡 | transition-fade, transition-slide-h, transition-scale, transition-rotate3d |
| **创意过渡** | ~40 | `transition-{创意名词}` | 炫酷页面过渡 | transition-glitch, transition-shatter, transition-liquid, transition-fold-explode |
| **创意视效** | ~29 | 创意命名 | 多效果融合的沉浸体验 | neon-city, folding-universe, kaleidoscope-world, liquid-sculpture |

### 1.3 自动化注册机制 (registry.ts)

```typescript
// 三步添加新模板：
// 1. 创建 template/{name}/{name}.vue
// 2. 在 LABEL_MAP 加一行: '{name}': '中文名'
// 3. 完成！import.meta.glob 自动发现，全站可用

const modules = import.meta.glob('./*/*.vue', { eager: true })
const LABEL_MAP: Record<string, string> = {
  'scroll-ripple-reveal': '涟漪揭示',
  'neon-city': '霓虹都市',
  // ... 148条映射
}
```

### 1.4 web-template.vue 展示页架构

```
┌────────────────────────────────────────────┐
│  🔍 搜索框 → 实时过滤模板                    │
│  📂 侧边分类: 滚动基础|滚动特效|过渡|创意视效  │
│  ⭐ 收藏系统 (localStorage 持久化)           │
│  📋 一键复制源码 (execCommand + Clipboard API)│
│  🤖 AI 模板推荐 (useTemplateRecommender)     │
│  🖼️ 中央预览区 (动态组件 <component :is>)    │
└────────────────────────────────────────────┘
```

---

## 第二部分：两大核心动画架构

### 架构 A: ScrollTrigger.onUpdate 驱动 (70% 模板使用)

**原理**: 撑出滚动空间 → 锁定视口 → onUpdate 中手动控制所有面板状态

```typescript
// ═══════ 架构 A 标准骨架 ═══════
function init() {
  scrollArea = document.getElementById('xxxArea')
  scrollArea.style.height = TOTAL * 100 + 'vh'  // 撑出滚动空间

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,  // 0.3-0.8 之间
    onUpdate: (self) => {
      const progress = self.progress * (TOTAL - 1)
      const idx = Math.floor(progress)
      const frac = progress - idx  // 面板内的局部进度 0→1

      // 手动控制每个面板的状态
      panels.forEach((panel, i) => {
        if (i < idx) {
          // 已过去的面板 → 完全隐藏
          panel.style.opacity = '0'
        } else if (i === idx) {
          // 当前面板 → 根据 frac 执行过渡
          panel.style.clipPath = `circle(${frac * 150}% at 50% 50%)`
        }
      })
    }
  })
}
```

**适用场景**: 连续 scrub 效果（涟漪扩散、画中画、扫描揭示）— 用户滚动与动画 1:1 绑定

### 架构 B: gsap.timeline 驱动 (30% 模板使用)

**原理**: 构建 paused timeline → ScrollTrigger 控制播放进度 → 多阶段动画编排

```typescript
// ═══════ 架构 B 标准骨架 ═══════
function buildTimeline(): gsap.core.Timeline {
  gsap.set(panels, { position: 'absolute', width: '100vw', height: '100vh' })
  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1

  panels.forEach((p, i) => { p.style.zIndex = String(totalPanels - i) })

  for (let i = 0; i < segments; i++) {
    // 阶段1: 当前面板破坏效果 (0~0.5)
    tl.to(panels[i], {
      opacity: 0,
      scale: 1.1,
      filter: 'contrast(3) brightness(2)',
      duration: 0.4,
      ease: 'power3.in'
    }, i)

    // 阶段2: 下一面板入场 (0.5~1.0)
    tl.fromTo(panels[i + 1], {
      clipPath: 'circle(0% at 50% 50%)',
      opacity: 0
    }, {
      clipPath: 'circle(100% at 50% 50%)',
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    }, i + 0.5)
  }

  return tl
}

// ScrollTrigger 绑定 timeline
ScrollTrigger.create({
  trigger: scrollArea,
  animation: tl,  // ← 关键：直接绑 timeline
  start: 'top top',
  end: 'bottom bottom',
  scrub: 0.5
})
```

**适用场景**: 多阶段动画（故障效果→消失→新面板弹入），需要精确控制每个阶段的时序

---

## 第三部分：8 大共享设计模式

每个模板都实现了以下模式（高度一致，像工业生产线）：

### 模式 1: 导航点系统

```typescript
function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button')
    dot.className = 'xxx-nav-dot' + (i === 0 ? ' xxx-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}
```

### 模式 2: 进度条 + 页码指示器

```typescript
function updateUI(index: number) {
  document.querySelectorAll('.xxx-nav-dot')
    .forEach((d, i) => d.classList.toggle('xxx-active', i === index))
  const cur = document.querySelector('.xxx-current')
  if (cur) cur.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index) / (totalPanels - 1) * 100) + '%'
}
```

### 模式 3: 面板跳转（平滑滚动）

```typescript
function goToPanel(index: number) {
  index = Math.max(0, Math.min(index, totalPanels - 1))
  const targetTop = (scrollArea?.offsetTop || 0) + index * vh
  window.scrollTo({ top: targetTop, behavior: 'smooth' })
  // 或用 GSAP ScrollToPlugin:
  // gsap.to(window, { scrollTo: { y: index * vh, autoKill: false }, duration: 0.6 })
}
```

### 模式 4: 键盘导航

```typescript
function onKeydown(e: KeyboardEvent) {
  const keyMap: Record<string, number> = {
    ArrowDown: 1, ArrowRight: 1,
    ArrowUp: -1, ArrowLeft: -1,
    Home: 0, End: totalPanels - 1
  }
  if (keyMap[e.key] !== undefined) {
    e.preventDefault()
    e.key === 'Home' || e.key === 'End'
      ? goToPanel(keyMap[e.key])
      : goToPanel(currentIndex + keyMap[e.key])
  }
}
```

### 模式 5: 触摸滑动

```typescript
let touchStartY = 0
function onTouchStart(e: TouchEvent) { touchStartY = e.touches[0].clientY }
function onTouchEnd(e: TouchEvent) {
  const diff = touchStartY - e.changedTouches[0].clientY
  if (Math.abs(diff) > 50) goToPanel(currentIndex + (diff > 0 ? 1 : -1))
}
```

### 模式 6: 双 style 块

```scss
<!-- 面板布局：用 scoped -->
<style scoped>
.xxx-page { /* 背景、字体、面板样式 */ }
.xxx-panel { /* position:absolute 面板排列 */ }
</style>

<!-- 固定定位 UI：非 scoped（JS 动态创建的元素需要全局样式） -->
<style>
.xxx-nav-dots { position: fixed; bottom: 28px; z-index: 1000; }
.xxx-progress-bar { position: fixed; top: 0; z-index: 1001; }
.xxx-page-indicator { position: fixed; top: 24px; right: 32px; z-index: 1002; }
</style>
```

### 模式 7: id 选择器做 DOM 引用

```typescript
// web-template 使用 getElementById，而非 web-list 的 ref
const scrollArea = document.getElementById('xxxArea')
const progressBar = document.getElementById('xxxProgress')
const navDots = document.getElementById('xxxNav')
// 原因：UI 元素是 JS 动态创建的，非 Vue 模板声明
```

### 模式 8: 生命周期管理

```typescript
function init() { /* 全部初始化逻辑 */ }
function destroy() {
  mainST?.kill(); mainST = null
  mainTL?.kill(); mainTL = null
  document.removeEventListener('keydown', onKeydown)
}
onMounted(() => nextTick(init))
onUnmounted(destroy)
```

---

## 第四部分：模板分类深度学习

### 4.1 滚动特效 scroll-* 的核心技术矩阵

| 模板 | 技术核心 | 动画机制 |
|------|---------|---------|
| scroll-ripple-reveal | clip-path circle + sin波动 | 涟漪波纹从中心扩散揭示新面板 |
| scroll-elevator-ride | 阶段分割 (phase 0→1) | 门开(0~0.2)→展示(0.2~0.7)→门关(0.7~1.0) |
| scroll-h-then-v | 分段进度映射 | 前50%→横移，后50%→纵移，面板4是转折点 |
| scroll-chess-flip | 棋盘格切割+独立翻转 | 面板切成N×M格，每格独立 rotateY 翻转 |
| scroll-helix-tower | 3D螺旋排列 | 面板沿螺旋曲线排列，旋转上升 |
| scroll-magnet-assemble | 碎片分散→吸附 | 面板碎片从四面八方磁力吸附成完整画面 |
| scroll-typewriter | 纸张卷动模拟 | 面板像打字机纸张从底部卷出 |
| scroll-clock-wipe | 扇形旋转遮罩 | 像时钟指针旋转扫过，扫过区域变新面板 |
| scroll-slot-machine | 老虎机滚筒 | 面板像滚筒上下旋转，停在目标面板 |
| scroll-origami-unfold | 3D折叠 | 面板像折纸逐步折叠→展开成全屏 |
| scroll-vortex-whirl | 对数螺旋 | 面板沿螺旋吸入中心，越近旋转越快 |
| scroll-matrix-rain | Canvas + 字符雨 | 面板过渡时有矩阵雨效果覆盖 |

### 4.2 创意过渡 transition-* 的核心技术

| 技术类别 | 代表模板 | 核心技术 |
|---------|---------|---------|
| 几何变换 | transition-fold, transition-cube, transition-fold-explode | 3D perspective + rotateX/Y + 多段切割 |
| 故障美学 | transition-glitch, transition-neon-slice | RGB分离 + clip位移 + keyframes抖动 |
| 流体效果 | transition-liquid, transition-liquid-pixel | SVG feTurbulence + feDisplacementMap |
| 像素效果 | transition-pixel, transition-shatter | Canvas粒子化 + GSAP stagger |
| 光学效果 | transition-blur, transition-hue-shift, transition-zoom-blur | CSS filter 链式动画 |
| 物理模拟 | transition-elastic, transition-swing, transition-wind | 弹性缓动 + 物理衰减 |

### 4.3 创意视效的技术融合

创意视效模板 = 多个 transition 效果融合：

```
neon-city    = neon-slice + glitch + hue-shift + wipe
folding-universe = fold + fold-explode + cube + shutter-wind
liquid-sculpture = liquid + liquid-pixel + blob morph
kaleidoscope-world = mirror + rotate + clip symmetric
```

---

## 第五部分：与 web-list 组件的本质区别

| 维度 | web-list 组件 | web-template 模板 |
|------|-------------|------------------|
| **粒度** | 单屏卡片组件 (100vw×100vh) | 页面级模板 (N×100vh 滚动区) |
| **关注点** | 卡片内部的动画效果 | 面板之间的过渡切换 |
| **DOM 引用** | Vue 3 `ref<T>()` | `document.getElementById()` |
| **动画主体** | 单个元素的位置/透明度/旋转 | 多个面板间的进出场编排 |
| **数据驱动** | Props + Emits | 无 props，纯视觉骨架 |
| **复用方式** | `<ComponentName />` 嵌入页面 | 作为整页滚动框架使用 |
| **数量** | 276个 | 148个 |
| **文档** | 大量 README.md | 仅 4 个 README.md |
| **样式策略** | 单 scoped 块 | 双块 (scoped布局 + 全局fixed导航) |

---

## 第六部分：开发新模板 SOP

### Step 1: 确认分类和命名

```
效果是滚动驱动的面板切换 → scroll-{具象动词/名词}
  e.g. scroll-waterfall-cascade (瀑布级联)

效果是面板间的过渡动画 → transition-{动词/名词}
  e.g. transition-smoke-dissolve (烟雾溶解)

效果是多效果融合的沉浸体验 → {创意名词}
  e.g. crystal-palace (水晶宫殿)
```

### Step 2: 选择架构

```
连续scrub、和滚动1:1绑定     → 架构A (ScrollTrigger.onUpdate)
多阶段动画、需精确控制时序    → 架构B (gsap.timeline)
```

### Step 3: 创建文件

```bash
mkdir -p src/views/web-template/template/{name}
# 创建 {name}.vue（单文件，<script setup> + <template> + <style scoped> + <style>）
```

### Step 4: 实现 8 大模式

```
□ createNavDots()  → 动态生成导航点
□ updateUI()       → 更新进度条+页码+激活态
□ goToPanel()      → 点击/键盘跳转面板
□ onKeydown()      → 键盘导航 (↑↓←→ Home End)
□ onTouchStart/End → 移动端触摸滑动
□ 双 style 块       → scoped(面板) + 全局(nav/progress/indicator)
□ init() + destroy()  → 生命周期管理
□ ScrollTrigger    → 核心滚动动画
```

### Step 5: 注册到 registry.ts

```typescript
// 在 LABEL_MAP 中添加一行：
'{name}': '{中文标签}',
```

### Step 6: 验证

- 在 web-template.vue 展示页中确认可见
- 测试：滚轮、键盘、点击导航点、手机触摸
- 检查：面板数量改变时自适应

---

## 第七部分：关键设计决策

### 为什么用 getElementById 而不是 Vue ref？

模板中的 **导航点、进度条、页码指示器** 是 JS 动态创建的（`createNavDots()` 用 `document.createElement`），不存在于 Vue 模板中。因此必须用原生 DOM API。这是有意为之——保持模板的自包含性，用户可以整体复制粘贴使用。

### 为什么需要两个 style 块？

- `<style scoped>` — 面板布局、背景色、面板伪元素。受 Vue scoped 保护，`data-v-xxx` 属性选择器
- `<style>` — 导航点、进度条、页码指示器。这些元素由 JS 动态创建并 `fixed` 定位，不能有 scoped 属性限制

### 为什么面板数是硬编码常量？

```typescript
const totalPanels = 7  // 不是 props！
```

模板是 **纯动画骨架**——不填充业务内容。面板数固定使得动画时序可精确计算。用户复制后自行修改 `totalPanels` 即可适配。

### 为什么没有 Props？

与 web-list 组件不同，模板不做配置化。模板 = **可执行的动画参考实现**，用户复制后直接在代码中修改，不通过 props 传递配置。

---

## 第八部分：快速参考卡

```typescript
// ═════ 新模板骨架 (架构A: onUpdate) ═════
<script setup lang="ts">
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 7
let vh = 0, currentIndex = 0
let scrollArea, progressBar, navDots, mainST

function createNavDots() { /* 模式1 */ }
function updateUI(i: number) { /* 模式2 */ }
function goTo(i: number) { /* 模式3 */ }
function onKeydown(e: KeyboardEvent) { /* 模式4 */ }
function onTS(e: TouchEvent) { /* 模式5 */ }
function onTE(e: TouchEvent) { /* 模式5 */ }

function init() {
  vh = innerHeight
  scrollArea = document.getElementById('xxxArea')
  scrollArea!.style.height = TOTAL * 100 + 'vh'

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top', end: 'bottom bottom',
    scrub: 0.5,
    onUpdate: (self) => {
      const progress = self.progress * (TOTAL - 1)
      const idx = Math.floor(progress)
      const frac = progress - idx
      // ... 面板控制逻辑
      if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) }
    }
  })
  document.addEventListener('keydown', onKeydown)
  createNavDots(); updateUI(0)
}

function destroy() { mainST?.kill(); document.removeEventListener('keydown', onKeydown) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>
```

```scss
// ═════ 新模板样式骨架 ═════
<style scoped>
.xxx-page { width: 100vw; height: 100vh; overflow: hidden; position: relative; }
.xxx-scroll-area { position: relative; }
.xxx-panel {
  position: absolute; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center;
}
</style>

<style>
.xxx-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 12px; z-index: 1000; }
.xxx-nav-dot { width: 12px; height: 12px; border-radius: 50%;
  background: rgba(255,255,255,0.2); border: none; cursor: pointer; transition: all 0.3s; }
.xxx-nav-dot.xxx-active { background: #fff; box-shadow: 0 0 12px rgba(255,255,255,0.5); transform: scale(1.3); }
.xxx-progress-bar { position: fixed; top: 0; left: 0; height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2); z-index: 1001; transition: width 0.3s; }
.xxx-page-indicator { position: fixed; top: 24px; right: 32px;
  font-family: monospace; font-size: 14px; color: rgba(255,255,255,0.5); z-index: 1002; }
</style>
```

---

## 总结

`web-template` 是一个 **页面过渡动画引擎**——148 个模板实现了 148 种"面板之间如何切换"的方案。

核心心法：
- **架构二选一**: onUpdate (连续scrub) vs timeline (分阶段编排)
- **八大模式必装**: dots/progress/indicator/keyboard/touch/双style/lifecycle/scrub
- **自包含原则**: 一个 .vue 文件 = 完整可运行的动画骨架
- **纯动画骨架**: 不填充业务内容，只保留动画机制
- **复制即用**: 用户复制后改 `totalPanels` + 面板内容即可
