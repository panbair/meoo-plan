
# 你是世界上最厉害的前端开发工程师，精通vue3全家桶开发，vue3组件开发，gsap动画开发，

# 在这个文件（meoo-plan/src/views/web-list/card-time）里面开发卡片，酷炫的卡片，震撼的卡片

# 开发前，重点检查这个文件（meoo-plan/src/views/web-list/card-time）里面的组件，不要创建重复了，不能覆盖已经有的组件。

## 代码严格符合vue3组件开源规范

# 注意获取元素要用vue3的方式 ref获取dom
# gsap获取元素要用vue3的方式，如果直接用classname,有重复classname可能会造成冲突， 比如：tl.fromTo('.header-badge'）,tl.to('.header-badge'）等，都是不行的


## 组件宽高都是:
height: 100vh;
width: 100vw;

## 内容要根据组件宽高设计

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
card-time/
└── CardTimeXxxx/
    └── CardTimeXxxx.vue          # 组件源码
    └── README.md            # 本文档
```


### 有入场动画、

### 每张卡片滚动控制动画ScrollTrigger一定要用

# 继续为你创作第二套震撼动画方案——**时空漩涡重生组件**，它利用螺旋路径与粒子飞溅，展现物质从黑洞中重生排列的诡异美感。

---

# # 动画效果：星际律动卡片阵列 - 节奏化散开·悬浮·重组·飞行动画
## 效果特点
- **初始状态**：所有卡片紧密堆叠在容器中心，压缩成一个「能量方块」，缩放0、透明度0
- **滚动触发**：向下滚动，卡片**跟随音乐节奏**依次散开，有强律动、强顿挫感
- **核心动画**：
  1. **节奏散开**：按波浪顺序弹射扩散，自带节拍延迟，错落有致不混乱
  2. **悬浮升空**：散开后卡片自动向上悬浮，产生Z轴高度差
  3. **姿态重组**：自动旋转归位、对齐网格，形成规整阵列
  4. **自由飞行**：完全展开后卡片轻微上下漂浮，形成动态呼吸感
- **双向闭环**：向上滚动，卡片按**反向节奏**回收、坠落、堆叠回能量方块
- **视觉冲击**：3D纵深 + 律动节奏 + 悬浮飞行，极具科技感与高级感

## 技术实现
- **GSAP Timeline** 多段动画串联（散开→悬浮→重组→飞行）
- **ScrollTrigger** 滚动绑定全程，scrub平滑跟随，双向完美还原
- **GSAP Stagger** 节奏化序列动画，实现波浪式律动散开
- **GSAP 3D变换** x/y/z三轴位移 + 旋转 + 悬浮，打造立体空间
- **Vue3 + TS** 组合式API，ref精准绑定DOM

## 动画效果核心参考代码
```typescript
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cardContainerRef = ref<HTMLDivElement>()
const cardListRef = ref<HTMLDivElement[]>([])
let animationTl: gsap.Timeline | null = null
let scrollInstance: ScrollTrigger | null = null

onMounted(() => {
  const container = cardContainerRef.value
  const cards = cardListRef.value
  if (!container || !cards.length) return

  // 容器中心点
  const rect = container.getBoundingClientRect()
  const centerX = rect.width / 2
  const centerY = rect.height / 2

  // 开启3D透视
  gsap.set(container, { perspective: 1500, transformStyle: 'preserve-3d' })

  // ========== 初始状态：堆叠中心方块 ==========
  gsap.set(cards, {
    x: centerX,
    y: centerY,
    z: -600,
    scale: 0,
    rotationX: 45,
    rotationY: -45,
    opacity: 0,
    transformOrigin: 'center center',
    force3D: true
  })

  // ========== 节奏动画时间线：散开 → 悬浮 → 重组 → 飞行 ==========
  animationTl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })

  // 1. 节奏散开（波浪律动）
  animationTl.to(cards, {
    x: 0,
    y: 0,
    z: 0,
    scale: 0.9,
    rotationX: 0,
    rotationY: 0,
    opacity: 1,
    stagger: { each: 0.12, from: 'center', grid: [3,3] }, // 节奏核心
    duration: 1.4
  })

  // 2. 悬浮升空
  animationTl.to(cards, {
    y: -30,
    z: 50,
    scale: 1,
    stagger: 0.08,
    duration: 0.8
  }, '-=0.4')

  // 3. 姿态完美重组
  animationTl.to(cards, {
    rotation: 0,
    opacity: 1,
    duration: 0.6
  }, '-=0.2')

  // 4. 自由漂浮飞行（循环呼吸）
  animationTl.to(cards, {
    y: '-=15',
    repeat: -1,
    yoyo: true,
    stagger: { each: 0.1, from: 'edges' },
    duration: 2.2,
    ease: 'sine.inOut'
  })

  // ========== 滚动驱动 ==========
  scrollInstance = ScrollTrigger.create({
    trigger: container,
    start: 'top 75%',
    end: 'top 25%',
    scrub: 1.8,
    animation: animationTl,
    toggleActions: 'play reverse play reverse'
  })
})

// 销毁动画，防止内存泄漏
onUnmounted(() => {
  animationTl?.kill()
  scrollInstance?.kill()
  ScrollTrigger.killAll()
})
```

---

# 动画效果：星轨旋舞·Flip魔法卡片阵列 - 3D螺旋轨迹+滚动旋舞展开+智能归位（Awwwards顶级特效）

## 效果特点
- **初始状态**：6张卡片**完美堆叠**，形成魔法卡牌束，带螺旋旋转错位，视觉极具层次感
- **滚动触发**：向下滚动触发**星轨螺旋Flip动画**，卡片沿3D弧形轨迹旋舞飞出
- **扩散效果**：卡片按**螺旋节奏**旋转、升空、扩散，自带轨迹律动，非生硬直线移动
- **网格归位**：扩散后自动精准对齐3×2网格，姿态自动校正，辉光同步点亮
- **双向动画**：向上滚动，卡片**沿原星轨轨迹旋舞回收**，重新堆叠成卡牌束，丝滑闭环
- **交互增强**：悬停时卡片3D倾斜+辉光爆发，形成立体魔法交互感

## 技术实现
- **GSAP Flip 高级插件**：自动捕捉堆叠/网格双状态，实现无缝变形动画
- **ScrollTrigger**：滚动驱动全程双向旋舞动画，scrub超丝滑跟随
- **3D旋舞轨迹**：Flip+旋转+Z轴升空组合，打造星轨螺旋飞行效果
- **节奏化stagger**：螺旋顺序散开，视觉律动远超随机效果
- **Vue3 Composition API**：响应式DOM + 生命周期安全管理，生产环境可用

## 动画效果核心参考代码
```typescript
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(Flip, ScrollTrigger)

const cardStackRef = ref<HTMLDivElement>()
const flipCardsRef = ref<HTMLDivElement[]>([])
let scrollInstance: ScrollTrigger | null = null

onMounted(() => {
  const container = cardStackRef.value
  const cards = flipCardsRef.value
  if (!container || !cards.length) return

  // 开启3D透视空间，强化旋舞立体效果
  gsap.set(container, { perspective: 2000, transformStyle: 'preserve-3d' })

  // 1. 记录【网格展开】的最终状态（Flip核心）
  const finalState = Flip.getState(cards, { props: 'transform,opacity' })

  // 2. 初始化【魔法堆叠】状态：中心堆叠 + 螺旋错位旋转
  cards.forEach((card, i) => {
    gsap.set(card, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      xPercent: -50,
      yPercent: -50,
      z: -i * 20, // 分层Z轴，形成立体堆叠
      rotation: i * 8, // 螺旋旋转错位
      scale: 0.95,
      opacity: 1
    })
  })

  // 3. Flip旋舞动画：从堆叠 → 星轨轨迹 → 网格展开
  scrollInstance = ScrollTrigger.create({
    trigger: container,
    start: 'top 70%',
    end: 'top 20%',
    scrub: 1.8,
    onEnter: () => animateFlip(),
    onEnterBack: () => animateFlip(),
    onLeaveBack: () => animateFlip(true)
  })

  // Flip动画主函数
  function animateFlip(reverse = false) {
    if (reverse) {
      // 反向：回收 → 重新堆叠
      Flip.from(finalState, {
        duration: 1.4,
        stagger: { each: 0.1, from: 'end' }, // 逆序回收
        ease: 'power3.in',
        absolute: true,
        spin: true,
        scale: true,
        fade: true,
        onStart: () => {
          container.classList.remove('is-expanded')
        }
      })
      return
    }

    // 正向：旋舞展开 → 网格布局
    container.classList.add('is-expanded')
    Flip.from(finalState, {
      duration: 1.5,
      stagger: { each: 0.1, from: 0 }, // 螺旋顺序展开
      ease: 'expo.out',
      absolute: true,
      spin: 2, // 双圈旋舞（视觉爆炸级）
      scale: true,
      fade: true,
      z: 100, // 升空高度
      rotationZ: 0
    })
  }
})

onUnmounted(() => {
  scrollInstance?.kill()
  ScrollTrigger.killAll()
})
```

## 配套核心CSS（堆叠+网格布局）
```scss
.card-stack {
  position: relative;
  width: 100%;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;

  // 初始：魔法堆叠状态
  &:not(.is-expanded) {
    .flip-card {
      position: absolute;
      top: 50%;
      left: 50%;
      transform-origin: center center;
    }
  }

  // 展开：3×2网格布局
  &.is-expanded {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
    place-items: center;

    .flip-card {
      position: relative;
      transform: none !important;
    }
  }

  // 卡片样式
  .flip-card {
    width: 260px;
    height: 300px;
    border-radius: 16px;
    backdrop-filter: blur(12px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    will-change: transform;
  }
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
let cleanupFns: TweenCleanup[] = []

1 保存清理函数

2 组件卸载时清理动画,这个组件所有gsap动画全部清理掉.

3 检查一下组件的 onUnmounted 清理逻辑，看看是否正确清理了 ScrollTrigger 和其他动画。有的就处理。


