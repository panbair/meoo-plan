
# 你是世界上最厉害的前端开发工程师，精通vue3全家桶开发，vue3组件开发，gsap动画开发，

# 在这个文件（meoo-plan/src/views/web-list/card-img）里面开发图片组件，酷炫的图片组件，震撼图片组件

# 开发前，重点检查这个文件（meoo-plan/src/views/web-list/card-img）里面的组件，不要创建重复了，不能覆盖已经有的组件。

## 代码严格符合vue3组件开源规范

# 注意获取元素要用vue3的方式 ref获取dom
# gsap获取元素要用vue3的方式，如果直接用classname,有重复classname可能会造成冲突， 比如：tl.fromTo('.header-badge'）,tl.to('.header-badge'）等，都是不行的


#  图片地址到这里取：https://images.unsplash.com
## 比如：https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80

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
card-img/
└── CardImgXxxx/
    └── CardImgXxxx.vue          # 组件源码
    └── README.md            # 本文档
```


### 有入场动画、

### 每张卡片滚动控制动画ScrollTrigger一定要用

# 继续为你创作第二套震撼动画方案——**时空漩涡重生组件**，它利用螺旋路径与粒子飞溅，展现物质从黑洞中重生排列的诡异美感。

# 动画效果：时空裂隙卡片组件 - 展示时间扭曲与时空异常的震撼视觉效果。

## 效果特点

- **奇点收缩（隐藏态）**  
  进入视口前，所有卡片汇聚于容器中心的“时空奇点”——缩放为 0、旋转 ±45°、完全透明。中心处会浮动一层微弱的脉冲光晕，暗示能量积聚。

- **宇宙爆发（滚动触发）**  
  向下滚动时，卡片如大爆炸般从奇点向四周喷射。每张卡片沿随机径向路径飞出，同时顺时针/逆时针旋转，尺度从 0 弹至 1，并逐渐显露。错位延迟（stagger）模拟粒子扩散的随机性，产生时间扭曲感。

- **时空涟漪（过渡细节）**  
  飞出过程中，卡片周围拖曳出细长的光尾，背景浮现一圈圈逐渐衰减的能量波纹。卡片落地后转换为正常网格排列，但边缘仍残留微弱的扭曲光晕，强调异常仍未完全平息。

- **逆熵回溯（双向动画）**  
  向上滚动时，一切逆转——卡片被奇点重新吸收，旋转方向反向，光尾缩回，最终回归为一个颤抖的光点。整个过程无突兀跳变，始终由滚动位置直接驱动。

## 技术实现

- **GSAP Flip 插件**  
  记录卡片的最终网格布局状态，再重置到奇点（中心缩放为 0），利用 `Flip.from()` 自动计算差异并生成扩散动画，确保归位精确。

- **ScrollTrigger 滚动驱动**  
  使用 `scrub: 1.5` 实现平滑的滚动绑定，动画进度直接映射到滚动进度。配合 `toggleActions` 保留状态，避免重复初始化。

- **Vue 3 Composition API**  
  通过 `ref` 获取网格容器与所有卡片元素，结合 `onMounted` 注册 ScrollTrigger，并利用响应式数据控制光晕、涟漪等辅助特效。

- **辅助视觉层**  
  独立于卡片的 canvas 或 CSS 伪元素层，绘制中心脉冲光环与环形波纹，同样由 ScrollTrigger 驱动其透明度与缩放，增强奇点能量的直观感受。

## 动画效果核心参考代码

```vue
<template>
  <div class="vortex-scene" ref="sceneRef">
    <!-- 能量涟漪层 -->
    <div class="energy-ripples" ref="ripplesRef">
      <span class="pulse-core"></span>
      <span class="ripple-ring" v-for="i in 3" :key="i"></span>
    </div>

    <!-- 卡片网格容器 -->
    <div class="card-grid" ref="gridRef">
      <div
        class="v-card"
        v-for="(card, idx) in cards"
        :key="card.id"
        :ref="el => cardRefs[idx] = el"
      >
        <div class="card-content">
          <div class="card-glow"></div>
          <h3>{{ card.title }}</h3>
          <p>{{ card.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(ScrollTrigger, Flip)

// -- 卡片数据 --
const cards = reactive([
  { id: 1, title: '时间裂隙', desc: '过去与未来的交织点' },
  { id: 2, title: '熵增逆转', desc: '因果律的暂时失效' },
  { id: 3, title: '维度折叠', desc: '三维空间在奇点处的投影' },
  { id: 4, title: '视界蒸发', desc: '信息逃逸的瞬间闪光' },
  { id: 5, title: '虚时隧道', desc: '通向平行现实的入口' },
  { id: 6, title: '量子退相干', desc: '无数可能性的坍缩' },
])

// -- 模板引用 --
const sceneRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const ripplesRef = ref<HTMLElement | null>(null)
const cardRefs: (HTMLElement | null)[] = []

// -- 动画初始化 --
onMounted(async () => {
  await nextTick()

  const grid = gridRef.value!
  const cardElements = cardRefs.filter(Boolean) as HTMLElement[]
  if (!cardElements.length) return

  // 1. 记录最终网格状态（卡片在正常文档流中的位置与样式）
  const finalState = Flip.getState(cardElements)

  // 2. 获取容器中心坐标
  const gridRect = grid.getBoundingClientRect()
  const centerX = gridRect.width / 2
  const centerY = gridRect.height / 2

  // 3. 将所有卡片移动到奇点（中心，缩放为0，随机旋转，透明）
  cardElements.forEach((card, i) => {
    const cardRect = card.getBoundingClientRect()
    // 相对于 grid 的偏移
    const cardCenterX = cardRect.left - gridRect.left + cardRect.width / 2
    const cardCenterY = cardRect.top - gridRect.top + cardRect.height / 2
    gsap.set(card, {
      x: centerX - cardCenterX,       // 移到中心
      y: centerY - cardCenterY,
      scale: 0,
      rotation: i % 2 === 0 ? 45 : -45,
      opacity: 0,
    })
  })

  // 4. 创建 ScrollTrigger 驱动的 Flip 动画
  const flipTween = Flip.from(finalState, {
    duration: 1.2,
    stagger: {
      each: 0.08,
      from: 'random',   // 随机顺序，模拟爆炸
    },
    ease: 'power3.out',
    absolute: true,     // 使用绝对定位避免布局抖动
    spin: true,         // 自动添加旋转（沿行进方向）
    onComplete() {
      // 落地后移除内联样式，让网格自然布局
      cardElements.forEach(card => gsap.set(card, { clearProps: 'all' }))
    },
    scrollTrigger: {
      trigger: sceneRef.value,
      start: 'top bottom',   // 场景顶部触及视口底部时开始
      end: 'top 20%',        // 场景顶部滚动到视口20%处结束
      scrub: 1.5,            // 滚动跟随，1.5秒平滑延迟
      // markers: true,      // 开发时可开启标记
    },
  })

  // 5. 能量涟漪同步动画
  if (ripplesRef.value) {
    const core = ripplesRef.value.querySelector('.pulse-core') as HTMLElement
    const rings = ripplesRef.value.querySelectorAll('.ripple-ring')

    gsap.fromTo(core, 
      { scale: 0, opacity: 1 },
      {
        scale: 1.5,
        opacity: 0,
        scrollTrigger: {
          trigger: sceneRef.value,
          start: 'top bottom',
          end: 'top 20%',
          scrub: 1.5,
        },
      }
    )

    rings.forEach((ring, i) => {
      gsap.fromTo(ring,
        { scale: 0, opacity: 1, borderWidth: 3 },
        {
          scale: 3 + i * 1.5,
          opacity: 0,
          borderWidth: 0,
          scrollTrigger: {
            trigger: sceneRef.value,
            start: 'top bottom',
            end: 'top 20%',
            scrub: 1.5,
          },
        }
      )
    })
  }
})
</script>

<style scoped>
.vortex-scene {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: radial-gradient(ellipse at center, #0a0f1e 0%, #02040a 100%);
}

.energy-ripples {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
}

.pulse-core {
  position: absolute;
  top: -20px;
  left: -20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(100, 200, 255, 0.8);
  box-shadow: 0 0 40px rgba(100, 200, 255, 0.6);
  transform: scale(0);
}

.ripple-ring {
  position: absolute;
  top: -50px;
  left: -50px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid rgba(100, 200, 255, 0.5);
  opacity: 0;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 80%;
  max-width: 1000px;
  margin: 0 auto;
  perspective: 1000px;
}

.v-card {
  position: relative;
  background: rgba(20, 30, 50, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  color: #fff;
  border: 1px solid rgba(100, 200, 255, 0.2);
  box-shadow: 0 0 20px rgba(0, 160, 255, 0.2);
  cursor: default;
  transition: box-shadow 0.3s;
}

.v-card:hover {
  box-shadow: 0 0 35px rgba(0, 200, 255, 0.5);
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 16px;
  background: radial-gradient(circle at 50% 0%, rgba(100, 200, 255, 0.15), transparent 70%);
  pointer-events: none;
}

.card-content h3 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  background: linear-gradient(135deg, #6cf, #3af);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.card-content p {
  margin: 0;
  font-size: 0.95rem;
  color: rgba(200, 220, 255, 0.8);
  line-height: 1.5;
}
</style>
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


