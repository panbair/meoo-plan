# 美加墨世界杯 2026 官网 — 完整设计方案

> **用途**：作为 AI 开发参考文档，可直接用于代码生成或后续迭代
> **技术栈**：Vue 3 + TypeScript + GSAP (ScrollTrigger) + SCSS
> **部署平台**：Meoo (meoo.com)
> **在线地址**：https://q6pksyqd322r.meoo.zone

---

## 一、项目架构

```
src/
├── App.vue                          # 主布局 + scroll-snap + 导航指示器 + CSS 变量
├── main.ts                          # 入口
├── data/
│   ├── output-base64-1~6.js         # 102 张本地 base64 图片
│   └── index.ts                     # 图片查询中心
├── composables/
│   └── useReducedMotion.ts          # 无障碍 reduced-motion 检测
├── styles/
│   └── tailwind.css
└── components/
    ├── hero/CardImage3DCarousel.vue  # 首屏
    ├── audience/CardImage3DConstellationOrbit.vue  # 第2屏
    ├── players/
    │   ├── CardImgAurora.vue        # 第3屏
    │   ├── CardImgCloudTide.vue     # 第4屏
    │   ├── CardImgCurtain.vue       # 第5屏
    │   └── CardImgDepth.vue         # 第6屏
    ├── goals/CardImgDolly.vue       # 第7屏
    ├── matches/CardTimeBlueprint.vue # 第8屏
    ├── fans/
    │   ├── CardImgBokeh.vue         # 第9屏
    │   └── CardImgDiag.vue          # 第10屏
    ├── spirit/
    │   ├── CardImgDust.vue          # 第11屏
    │   └── CardImgFeather.vue       # 第12屏
    ├── cta/CardEclipse.vue          # 第13屏
    └── DouyinFloat.vue              # 浮动组件
```

### 全局布局 (App.vue)

- `html` 上设置 `scroll-snap-type: y mandatory` + `overflow-y: auto; height: 100vh`
- 每个 `<section class="snap-section">` 设置 `height: 100vh; scroll-snap-align: start; scroll-snap-stop: always`
- 有内部滚动的 section 加 `section-inner-scroll` 类，设置 `overflow: visible`
- 右侧固定导航指示器 13 个圆点，`IntersectionObserver` (threshold 0.5) 实时高亮
- CSS 变量配色系统：

```css
:root {
  --color-brand: #00b478;
  --color-brand-light: #00dc96;
  --color-brand-dark: #008c5a;
  --color-bg-dark: #0a1628;
  --color-bg-warm: #fefaf6;
  --font-sans: 'Inter', 'Noto Sans SC', 'PingFang SC', system-ui, sans-serif;
}
```

---

## 二、13 个 Section 详细设计

### Section 1 — 首屏 Hero (`CardImage3DCarousel.vue`)

**功能**：8 张城市图片滚动切换 + 视觉差过渡

**布局结构**：
```
┌──────────────────────────────────┐
│  光晕 glowA (左上 30vw 粉橙色)    │
│  光晕 glowB (右下 26vw 蓝紫色)    │
│  Canvas 粒子 (50 颗上升光点)      │
│  8 张图片堆叠 (absolute inset:0)  │
│  ┌─ 标题 (顶部居中) ──────────┐  │
│  │  Kicker: FIFA WORLD CUP 2026™  │
│  │  标题逐字: "美加墨" + "世界杯" │
│  │  分割线 + 双行副标题          │
│  ├─ 城市指示器 (底部 12vh) ───┤  │
│  │  "03 / 08 · Mexico City"       │
│  ├─ 缩略图导航栏 (底部 5vh) ──┤  │
│  │  8 个 44x44 圆角方块          │
│  └─ 进度条 (底部) ───────────┘  │
└──────────────────────────────────┘
```

**GSAP 动画详解**：

1. **入场动画**（`setupEntrance`）：
   - 触发：ScrollTrigger `toggleActions: 'play none none reverse'`，滚动到 section 75% 时触发
   - Kicker：`letterSpacing` 从 1em 收紧到 0.26em + y:30→0，duration 0.7s，ease: power2.out
   - 第一行"美加墨"逐字：3D 翻转 `rotationX:-90→0 + y:80→0`，stagger 0.1s，ease: back.out(2.5)
   - 第二行"世界杯"逐字：缩放+旋转 `scale:0.3→1 + rotation:-15→0`，stagger 0.12s，ease: back.out(2.2)
   - 分割线：`scaleX:0→1`，duration 0.6s，ease: power3.inOut
   - 副标题双行：`y:20→0`，stagger 0.12s，ease: power2.out
   - 光晕 A/B：`scale:0.3→1 + opacity:0→1`，duration 1s，ease: power3.out，错开 0.1s
   - 指示器 + 缩略图：`y:20→0`，duration 0.5-0.6s

2. **图片切换动画**（`setupImageSwitcher`）：
   - 架构：单个 Master ScrollTrigger，`scrub:1.2`，`start:'top top'` 至 `end:'bottom bottom'`
   - 轨道高度：`(8-1)*150 + 30 = 1080vh`
   - 每张图占 150vh 滚动距离，前 70% 完全可见，后 30% 过渡
   - **onUpdate 核心逻辑**（每帧计算）：
     ```
     progress = ScrollTrigger.progress
     rawIdx = progress * 7
     idx = floor(rawIdx)
     t = rawIdx - idx  // 0→1 段内进度
     
     当前图 i=idx: opacity = t<0.7 ? 1 : 1-(t-0.7)/0.3
     下一图 i=idx+1: opacity = max(0, (t-0.7)/0.3)
     其他图: opacity = 0
     ```
   - 8 种过渡风格 (`transitions` 数组)：
     | 图 | 风格 | 入场 | 离开 |
     |----|------|------|------|
     | 1 | slideLeft | translateX(120→0) | translateX(0→-60) |
     | 2 | zoomOut | scale(0.7→1) blur(4→0) | scale(1→0.75) blur(0→4) |
     | 3 | slideRight | translateX(-120→0) | translateX(0→60) |
     | 4 | blurIn | blur(12→0) scale(1.08→1) | blur(0→15) |
     | 5 | slideUp | translateY(100→0) | translateY(0→-60) |
     | 6 | rotateIn | rotate(8°→0) scale(0.8→1) | rotate(0→10°) |
     | 7 | slideDown | translateY(-100→0) | translateY(0→60) |
     | 8 | zoomIn | scale(1.35→1) blur(4→0) | scale(1→1.2) blur(0→6) |
   - 实现细节：全部使用原生 `img.style.cssText`（不用 GSAP set，避免 autoAlpha 的 visibility:hidden 副作用）

3. **鼠标视差**（`setupParallax`）：
   - 监听 rootRef 的 mousemove/mouseleave
   - 当前可见图片：`x: -cx*30, y: -cy*20`（反向偏移）
   - 光晕 A：`x: cx*40, y: cy*30`
   - 光晕 B：`x: -cx*30, y: -cy*25`
   - 标题：`x: cx*15, y: cy*10`
   - 离开时所有元素 elastic.out(1, 0.5) 弹回原位

4. **Canvas 粒子**（`initCanvas`）：
   - 50 个粒子，从底部向上浮起
   - 每个粒子有随机 hue(20/35/195/330/45)、size(1-4px)、alpha(0.3-0.8)
   - fade 曲线：前 8% 淡入，中间保持，后 25% 淡出
   - 径向渐变填充，`requestAnimationFrame` 驱动
   - `cancelAnimationFrame` 在 `onUnmounted` 清理

5. **进度条 + 标题视差**：
   - 进度条：`master.to(progressRef, { width:'100%' }, 0)`
   - 标题：前 30% progress 内上移 40px + 淡至 opacity 0.3
   - 指示器 + 缩略图：前 85% progress 内上移并淡出

---

### Section 2 — 全球球迷 (`CardImage3DConstellationOrbit.vue`)

**功能**：12 张球迷图片分布在 3 层 CSS 3D 轨道上，滚动旋转轨道切换可见图

**布局**：
- 深空背景（星云 + 三层星星 `radial-gradient`）
- 中央光核（脉动球体 + 旋转射线）
- 3 层同心 CSS 3D 轨道环（半径 380/620/880px）
- 每层 4 张卡片，用 `rotateY(θ) translateZ(radius)` 分布在圆环上
- `perspective: 1200px; perspective-origin: 50% 42%`
- 内部滚动容器 `overflow-y: auto`，轨道高度 `(12+2)*110 = 1540vh`

**GSAP 动画**：

1. **入场**（`setupEntrance`）：
   - ScrollTrigger `start:'top 75%'`, `toggleActions:'play none none reverse'`
   - Kicker: letterSpacing 收紧 + y:24→0
   - 标题"同一个世界"：`rotationX:-60→0 + y:60→0`，ease: back.out(2.2)
   - 标题"同一种热爱"：`x:60→0 + scale:0.3→1`，ease: back.out(2)
   - 场景淡入、光核 `scale:0→1` 弹性弹入
   - 12 张卡片交错入场：`autoAlpha:0 + scale:0.3 + rotateX:-30 → 1+1+0`，`back.out(1.5)`

2. **轨道旋转**（`setupOrbitAnimation`）：
   - Master Timeline + ScrollTrigger 绑定内部滚动容器
   - `scrub:1.5`, `start:'top top'` 至 `end:'bottom bottom'`
   - 每层轨道独立旋转：`ringEl.rotateY = ring.rotationSpeed * 360`
     - 近景轨道 speed=1.0（最快）
     - 中景轨道 speed=0.55
     - 远景轨道 speed=0.28（最慢）
   - onUpdate 中计算 `currentRing`, `currentImgInRing`, `currentImage`
   - 光核脉动：`scale:1↔1.15` 呼吸
   - 场景微缩放：`scale:0.95↔1.0` 制造深度感
   - 进度条 0→100%

---

### Section 3 — 足球巨星 (`CardImgAurora.vue`)

**功能**：极光帷幕 + 背景图 + 鼠标光晕交互

**GSAP 动画**：

1. **入场**（`initAnimations`）：
   - ScrollTrigger `scrub:1.5`, `start:'top 100%'` 至 `end:'bottom 20%'`
   - 徽章 `y:-40→0` back.out(1.7)
   - 内容 `y:60→0` power3.out
   - 底部信息 `y:30→0`
   - 光标光晕 `scale:0→1` back.out(2)
   - 图片缩放 `scale:1.1→1.2`
   - 远景/中景/近景极光帷幕分层上移（-150/-350/-700px），速度递增
   - 星光粒子层上移 -500px
   - 色相漂移：`hue-rotate(-40° → +30°)` 翠绿与紫罗兰之间

2. **帷幕摆动**（`initCurtainWobble`）：
   - `gsap.ticker.add` 持续运行（⚠️ 性能注意：即使不可见也运行）
   - sin/cos 驱动水平摆动：远景 ±5px、中景 ±8px、近景 ±10px

3. **鼠标交互**（`initMouseInteraction`）：
   - 光晕跟随鼠标（x-50, y-50），duration 0.4s
   - 近景帷幕 `x: mouseOffset*0.03`
   - 图片 `x: mouseOffset*0.01, y: mouseOffset*0.01`
   - 离开时 elastic.out(1, 0.5) 弹回

---

### Section 4 — 绿茵史诗 (`CardImgCloudTide.vue`)

**功能**：云层光束 + 全屏呼吸 + 鼠标视差

**GSAP 动画**：

1. **呼吸动画**（`initBreathingAnimation`）：
   - `gsap.timeline({ repeat:-1, yoyo:true })` 7s 周期
   - 背景缩放 `1.00↔1.03`，power1.inOut
   - 4 束丁达尔光 opacity 0.35↔0.55 错相
   - 色温偏移 `brightness 0.95↔1.1 + saturate 0.95↔1.1 + hue-rotate -5°↔5°`
   - 暗角 opacity 0.5↔0.7
   - 四角柔光 opacity 波动

2. **入场**（`initEntranceAnimation`）：
   - ScrollTrigger `start:'top 80%'`, `once:true`
   - 背景 `opacity:0→1`，duration 2s
   - 标题行 stagger 0.2s，`y:50→0 + blur:8px→0`，power3.out

3. **视差**（`initParallaxAnimation`）：
   - ScrollTrigger `scrub:2`, `start:'top bottom'` 至 `end:'bottom top'`
   - 背景 `y:0→100`
   - 光束 `y:0→-60`
   - 内容 `y:0→-80`

4. **鼠标视差**：
   - 图片 `x: x*40`（仅 x，不与 ScrollTrigger 的 y 冲突）
   - 光束 `x: x*20`
   - 光斑 `x: x*100`

---

### Section 5 — 决战时刻 (`CardImgCurtain.vue`)

**功能**：上下光幕分离 + 中央图片揭示

**GSAP 动画**：

- ScrollTrigger `scrub:1.5`, `start:'top 80%'` 至 `end:'bottom 20%'`
- 中央柔晕：`scale:0.8→1.2`，repeat:1, yoyo:true
- 金色引导线：上线下滑 `y:'-100%'`，下线上升 `y:'100%'`，然后 `opacity:0`
- 上光幕：`y:'-100%'` + `opacity:0`，power3.inOut
- 下光幕：`y:'100%'` + `opacity:0`，power3.inOut
- 微粒消散：`opacity:0`
- 中央柔晕消失：`opacity:0 + scale:2`
- 图片亮度恢复：`brightness:0.6→1 + saturate:0.9→1`
- 冷光镶边显现：`opacity:0→1`
- 标题淡入：`opacity:0→1 + y:30→0`
- 镶边呼吸：`opacity:1↔0.6`，duration 4s，yoyo, repeat:-1

---

### Section 6 — 战术纵深 (`CardImgDepth.vue`)

**功能**：3 层视差图片 + 鼠标深度交互

**GSAP 动画**：

1. **ScrollTrigger 入场**（`initAnimations`）：
   - `scrub:1.5`, `start:'top 100%'` 至 `end:'bottom -100%'`
   - 远景层（最慢）：`y:0→-80 + scale:1.1→1.15 + rotation:0→0.3° + blur:2→3px`
   - 中景层（中等）：`y:0→-200 + scale:1.05→1.1 + rotation:0→-0.2°`
   - 前景层（最快）：`y:0→-350 + scale:1.02→1.08 + rotation:0→0.1°`
   - 呼吸：三层同 `scale +=0.02` 然后 `-=0.02`
   - 粒子流动：`y:0→-600 + opacity:0.6→0`
   - 回卷（85%-100%）：各层回到初始位置

2. **鼠标视差**：
   - 前景 `x:(mouseX-0.5)*30`，duration 0.8s
   - 中景 `x:(mouseX-0.5)*20`，duration 1s
   - 远景 `x:(mouseX-0.5)*10`，duration 1.2s
   - 仅 x 方向，不与 ScrollTrigger 的 y 冲突

---

### Section 7 — 高光时刻 (`CardImgDolly.vue`)

**功能**：希区柯克推轨变焦效果（前景快/远景慢）

**GSAP 动画**：

- ScrollTrigger `scrub:1.5`, `start:'top 80%'` 至 `end:'bottom 20%'`
- 远景层：`y:0→80 + scale:1→0.97 + brightness:1→0.9`
- 前景层：`y:0→80 + scale:1→1.03 + brightness:1→1.1`（更快+放大）
- 进度条：`scaleX:0→1`
- 进度数值：`textContent: '0%' → '100%'`，snap 步进
- 标签/标题/描述/进度条 依次 opacity+y 淡入
- 边框线条 stagger 0.1s scale 展开
- 角落标记 stagger 0.1s scale:0→1 back.out(2)
- 中心十字 opacity:0→0.3

---

### Section 8 — 王者之路 (`CardTimeBlueprint.vue`)

**功能**：SVG 路径绘制 + 5 步流程卡片

**GSAP 动画**：

1. **标题入场**：
   - 标签 `y:20→0 + scale:0.9→1` back.out(1.7)
   - 主标题 `y:30→0` power3.out
   - 副标题 `y:20→0`

2. **SVG 路径绘制**：
   - `.bp-path-main`：`strokeDashoffset:1200→0`，duration 1.5s，power2.inOut
   - 5 个节点圆点：`scale:0→1 + opacity:0→1`，stagger 0.15s，back.out(2)
   - 进度指示器 `width:0%→100%`

3. **卡片入场**：
   - 5 张卡片 `y:60→0 + opacity:0→1 + scale:0.9→1`，stagger 0.12s，back.out(1.4)
   - 编号 `opacity:0→1 + x:-20→0`
   - 图标 `scale:0→1 + rotation:-45→0`，back.out(1.7)

4. **卡片 Hover**：
   - JS addEventListener mouseenter：`y:-8 + scale:1.02`，duration 0.3s
   - mouseleave：`y:0 + scale:1`，elastic.out(1, 0.5)

5. **底部呼吸**：
   - 每张卡片 `y:0↔-5`，duration 2+i*0.3s，repeat:-1, yoyo:true, sine.inOut

6. **底部footer入场**：
   - `opacity:0→1 + y:30→0`，ScrollTrigger `start:'top 90%'`

7. **背景图鼠标视差**：
   - 监听 section 的 mousemove
   - 全屏半透明背景图 `x: -cx*60, y: -cy*45, scale:1.08`
   - 离开时 elastic.out(1, 0.5) 归位

---

### Section 9 — 球迷图腾 (`CardImgBokeh.vue`)

**功能**：散景光斑 + 图片去模糊揭示

**GSAP 动画**：

1. **散景光斑**（`createBokehAnimation`）：
   - 25 个光斑每个独立 ScrollTrigger `scrub:2`
   - Y轴移动 `y:0→-150`
   - 缩放呼吸 `scale:1↔1.04`，repeat:-1, yoyo:true
   - 透明度起伏 `opacity:0.6↔0.8`
   - 色相变化 `--spot-hue` 动态偏移 ±40

2. **中景图片**：
   - ScrollTrigger `scrub:1.5`, `start:'top 100%'` 至 `end:'bottom 20%'`
   - Y轴 `y:0→-80`
   - 透明度 `opacity:0.75→1`
   - 模糊 `filter:blur(2px)→blur(0px)`
   - 遮罩 `opacity→0`

3. **前景文案**：
   - 整体 `y:0→-120`
   - 标题 `opacity:0→1 + x:-30→0`
   - 副标题 `opacity:0→1 + x:-20→0`
   - 分割线 `scaleX:0→1`
   - 描述 `opacity:0→1 + y:20→0`
   - CTA `opacity:0→1 + scale:0.9→1` back.out(1.7)

4. **粒子**：40 个 DOM 粒子 `y:0→-200 + opacity:0.3→0.8 + scale:0.5→1.5`

---

### Section 10 — 足球文化 (`CardImgDiag.vue`)

**功能**：几何光斑 + 图片去模糊揭示（参考 Bokeh 三层架构）

**布局**：z-index 1→4 = 远景光斑 → 中景图片(左侧 42vw) → 前景文案(右侧) → 粒子

**GSAP 动画**：

1. **中景图片**：
   - ScrollTrigger `scrub:1.5`, `start:'top 100%'` 至 `end:'bottom 20%'`
   - Y轴 `y:0→-50`
   - 透明度 `opacity:0.7→1`
   - 模糊+缩放 `filter:blur(3px) + scale:1.08 → blur(0px) + scale:1`
   - 遮罩 `opacity→0`

2. **远景光斑**：`y:0→-30 + opacity:0.4→0.7`

3. **前景文案**：
   - 整体 `y:20→0 + opacity:0.3→1`
   - 标题 `opacity:0→1 + x:-20→0`
   - 副标题 `opacity:0→1 + x:-15→0`
   - 分割线 `scaleX:0→1`
   - 描述 `opacity:0→1 + y:10→0`
   - CTA `opacity:0→1 + scale:0.9→1` back.out(1.7)

4. **粒子**：35 个 DOM 粒子 `y:0→-120 + opacity:0.25→0.7 + scale:0.5→1.3`

---

### Section 11 — 体育精神 (`CardImgDust.vue`)

**功能**：怀旧相纸 + 晨风拂尘

**GSAP 动画**：

- ScrollTrigger `scrub:1.5`, `start:'top 80%'` 至 `end:'bottom 20%'`
- 相纸核心：`y:50→0 + opacity:0→1 + scale:0.88→1 + blur:12→0 + brightness:0.7→1`
- 纸角微卷：先 `rotate:±3° + scale:1.05`，再 elastic.out 弹回
- 柔白光泽：`opacity:0→0.4`
- 光束：`opacity:0→0.15 + x:-100→0`
- 文字入场：标签 `x:-40→0`、标题 `y:50→0` back.out(1.4)、副标题 `y:20→0`、描述 `y:15→0`
- 晨风路径：8 条 SVG path `strokeDashoffset→0`，stagger 0.15s
- 尘埃粒子：30 个粒子随机起始位置，`x/y` 偏移 + `opacity 0→0.7` + `scale` 缩小

---

### Section 12 — 足球之魂 (`CardImgFeather.vue`)

**功能**：毛玻璃卡片 + 图片缩放归位 + 鼠标视差

**GSAP 动画**：

1. **入场**（`initAnimations`）：
   - ScrollTrigger `scrub:1.2`, `start:'top 70%'` 至 `end:'bottom 30%'`
   - 图片：`scale:1.25→1 + opacity:0.6→1`，power2.out
   - 卡片整体：`y:30→0 + opacity:0.5→1`
   - 标签/标题 `opacity:0→1 + y:24→0`
   - 描述/元数据 stagger 0.1s
   - CTA `opacity:0→1` back.out(1.4)
   - 底部线 `scaleY:0→1`
   - 进度条 `scaleX:0→1`

2. **鼠标视差**：
   - 图片 `x: -cx*20, y: -cy*15`，duration 0.8s
   - 卡片 `x: cx*6, y: cy*5`，duration 1s
   - 离开时 elastic.out(1, 0.5)

---

### Section 13 — 终极召唤 (`CardEclipse.vue`)

**功能**：日食效果 + 4 张 CTA 卡片

**GSAP 动画**（`initAnimations`）：

- 太阳：`scale:0→1`，elastic.out(1, 0.5)，duration 1.2s
- 日冕 3 层：`scale:0.5→1 + opacity:0→1`，stagger 0.15s
- 标题：`scale:1.2→1 + opacity:0→1 + blur:10→0`，back.out(1.5)
- 4 张卡片：`scale:1.2→1 + opacity:0→1 + blur:12→0`，stagger 0.15s
- 光线 3 条：`scaleX:0→1 + opacity:0→1`，stagger 0.2s
- Hover：JS addEventListener mouseenter scale:1.05 + 绿光 boxShadow
- ScrollTrigger 退出：卡片 `scale:1→1.5 + opacity:1→0 + blur:0→12`，scrub:1.5

---

### 浮动组件 (`DouyinFloat.vue`)

**功能**：右下角固定抖音二维码，hover 放大 + 脉冲 + 滚动旋转

**GSAP 动画**：

1. **入场**：延迟 1.5s，`scale:0→1 + rotation:-30→0`，back.out(2)，duration 0.6s
2. **滚动旋转**：ScrollTrigger `scrub:1` 绑定 body，图片 `rotation:0→360`
3. **Hover 放大副本**：`autoAlpha:0 + scale:0.5 → 1 + scale:1 + x:-140 + y:-140`，back.out(1.7)，duration 0.35s
4. **脉冲光环**：CSS `@keyframes douyinPulse`，`scale:1→1.25→1 + opacity:0.6→0→0.6`，2s 循环

---

## 三、性能优化建议

1. **图片加载**：当前 102 张 base64 嵌入 JS（19.7MB），建议改为 CDN 外部加载 + `loading="lazy"`
2. **粒子系统**：Aurora 的 `gsap.ticker` 持续运行 60fps，即使不可见，建议加 `visibilitychange` 暂停
3. **ScrollTrigger 清理**：所有组件在 `onUnmounted` 中正确清理：`tl.scrollTrigger?.kill(); tl.kill()`
4. **will-change**：建议只对当前可见的动画元素设置，结束后移除

## 四、响应式设计

- 所有组件均有 `@media (max-width: 768px)` 断点
- 卡片宽度/字体使用 `clamp()` 函数自适应
- 移动端隐藏右侧导航指示器

## 五、无障碍

- `prefers-reduced-motion: reduce` 检测（`useReducedMotion` composable）
- 全局 `:focus-visible` 焦点环样式（`2px solid --color-brand-light`）
- `@media (prefers-reduced-motion: reduce)` 时禁用 scroll-snap 和 CSS 动画
