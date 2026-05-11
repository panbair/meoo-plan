<template>
  <div ref="houseStage" class="house-stage">
    <!-- 背景装饰层 -->
    <div class="bg-gradient"></div>
    <div class="bg-vignette"></div>
    
    <!-- 标题 -->
    <div ref="titleRef" class="house-title">
      <span class="title-text">时空裂隙</span>
      <span class="title-sub">纸牌屋的脆弱边界</span>
    </div>
    
    <!-- 滚动指示器 -->
    <div ref="scrollHintRef" class="scroll-hint">
      <span class="hint-arrow">↓</span>
      <span class="hint-text">向下滚动崩塌</span>
    </div>
    
    <!-- 纸牌屋容器 -->
    <div ref="houseContainer" class="house-container">
      <!-- 12张卡片 -->
      <div
        v-for="(card, i) in cards"
        :key="card.id"
        :ref="el => setCardRef(el, i)"
        class="house-card"
        :style="{ '--card-index': i }"
      >
        <div class="card-face card-front">
          <span class="card-num">{{ card.id + 1 }}</span>
          <div class="card-symbol">◆</div>
          <div class="card-line"></div>
        </div>
        <div class="card-face card-back"></div>
      </div>
    </div>
    
    <!-- 地面阴影 -->
    <div ref="shadowRef" class="ground-shadow"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(ScrollTrigger, Flip)

// Refs
const houseStage = ref<HTMLElement | null>(null)
const houseContainer = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const scrollHintRef = ref<HTMLElement | null>(null)
const shadowRef = ref<HTMLElement | null>(null)
const cardRefs = ref<(HTMLElement | null)[]>([])
const setCardRef = (el: any, i: number) => {
  if (el) cardRefs.value[i] = el
}

// 数据
const cards = reactive(
  Array.from({ length: 12 }, (_, i) => ({ id: i }))
)

// 卡片尺寸（固定值以便计算）
const CARD_WIDTH = 160
const CARD_HEIGHT = 220
const GRID_COLS = 4
const GRID_ROWS = 3
const GRID_GAP_X = 40
const GRID_GAP_Y = 50

// 纸牌屋12张卡片的精确3D姿态定义
const housePoses = [
  // 中央四棱锥 (4张，指数0-3)
  { rx: -70, ry: 0,   rz: 0,   tx: -50, ty: -40, tz: 150 },
  { rx: -70, ry: 0,   rz: 0,   tx: 50,  ty: -40, tz: 150 },
  { rx: -70, ry: 0,   rz: 0,   tx: -50, ty: -40, tz: -150 },
  { rx: -70, ry: 0,   rz: 0,   tx: 50,  ty: -40, tz: -150 },
  // 外围支撑 (8张，指数4-11) 分别倚靠四棱锥四边
  { rx: -65, ry: 25,  rz: 10,  tx: -180, ty: 0, tz: 0 },
  { rx: -65, ry: -25, rz: -10, tx: 180,  ty: 0, tz: 0 },
  { rx: -65, ry: 10,  rz: -25, tx: 0,    ty: 0, tz: -180 },
  { rx: -65, ry: -10, rz: 25,  tx: 0,    ty: 0, tz: 180 },
  { rx: -68, ry: 18,  rz: 8,   tx: -100, ty: -30, tz: 100 },
  { rx: -68, ry: -18, rz: -8,  tx: 100,  ty: -30, tz: -100 },
  { rx: -68, ry: 8,   rz: -18, tx: -100, ty: -30, tz: -100 },
  { rx: -68, ry: -8,  rz: 18,  tx: 100,  ty: -30, tz: 100 },
]

// 倒塌顺序
const collapseOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

// 动画实例
let tl: gsap.core.Timeline | null = null
let st: ScrollTrigger | null = null
let entryTl: gsap.core.Timeline | null = null
let entryCardsTl: gsap.core.Timeline | null = null
const cleanupFns: Array<() => void> = []

// 初始化入场动画
const initEntryAnimation = () => {
  const stage = houseStage.value
  const title = titleRef.value
  const hint = scrollHintRef.value
  const shadow = shadowRef.value
  if (!stage || !title || !hint || !shadow) return

  entryTl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  // 背景渐入
  entryTl.fromTo(stage, 
    { opacity: 0 },
    { opacity: 1, duration: 0.8 }
  )

  // 标题入场
  entryTl.fromTo(title,
    { y: -60, opacity: 0, rotateX: 30 },
    { y: 0, opacity: 1, rotateX: 0, duration: 1 },
    '-=0.4'
  )

  // 提示滚动文字
  entryTl.fromTo(hint,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8 },
    '-=0.3'
  )

  // 阴影入场
  entryTl.fromTo(shadow,
    { scaleX: 0, opacity: 0 },
    { scaleX: 1, opacity: 0.6, duration: 1 },
    '-=0.8'
  )

  cleanupFns.push(() => entryTl?.kill())
}

// 初始化纸牌屋动画
const initHouseAnimation = async () => {
  await nextTick()
  
  const container = houseContainer.value
  const cardEls = cardRefs.value.filter(Boolean) as HTMLElement[]
  
  if (!container || cardEls.length === 0) {
    console.warn('Card3dHouse: 容器或卡片元素不存在')
    return
  }

  const containerW = container.offsetWidth
  const containerH = container.offsetHeight

  // 计算网格布局的最终位置
  const gridTotalW = GRID_COLS * CARD_WIDTH + (GRID_COLS - 1) * GRID_GAP_X
  const gridTotalH = GRID_ROWS * CARD_HEIGHT + (GRID_ROWS - 1) * GRID_GAP_Y
  const gridStartX = (containerW - gridTotalW) / 2
  const gridStartY = (containerH - gridTotalH) / 2

  // 设置卡片到网格位置（最终状态）
  cardEls.forEach((card, i) => {
    const col = i % GRID_COLS
    const row = Math.floor(i / GRID_COLS)
    gsap.set(card, {
      x: gridStartX + col * (CARD_WIDTH + GRID_GAP_X),
      y: gridStartY + row * (CARD_HEIGHT + GRID_GAP_Y),
      z: 0,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scale: 1,
      filter: 'none',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
      opacity: 1,
    })
  })

  // 1. 记录最终平面网格状态
  const finalState = Flip.getState(cardEls, { 
    props: 'x,y,z,rotationX,rotationY,rotationZ,scale,filter,boxShadow,opacity' 
  })

  // 2. 设置纸牌屋初始姿态
  cardEls.forEach((card, i) => {
    const pose = housePoses[i]
    gsap.set(card, {
      x: containerW / 2 - CARD_WIDTH / 2 + pose.tx,
      y: containerH / 2 - CARD_HEIGHT / 2 + pose.ty,
      z: pose.tz,
      rotateX: pose.rx,
      rotateY: pose.ry,
      rotateZ: pose.rz,
      scale: 0.9,
      filter: 'sepia(0.25) brightness(0.9)',
      boxShadow: '10px 25px 50px rgba(0,0,0,0.7), 0 0 40px rgba(255,200,100,0.2) inset',
      opacity: 0.95,
    })
  })

  // 卡片入场动画（弹性飞入到纸牌屋位置）
  entryCardsTl = gsap.timeline({ delay: 0.3 })
  
  cardEls.forEach((card, i) => {
    entryCardsTl.fromTo(card,
      {
        opacity: 0,
        scale: 0.2,
        y: containerH / 2 + 200,
        z: 400,
        rotateY: 90,
        rotateX: 30,
      },
      {
        opacity: 0.95,
        scale: 0.9,
        y: containerH / 2 - CARD_HEIGHT / 2 + housePoses[i].ty,
        z: housePoses[i].tz,
        rotateY: housePoses[i].ry,
        rotateX: housePoses[i].rx,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
      },
      i * 0.06
    )
  })
  cleanupFns.push(() => entryCardsTl?.kill())

  // 3. 主Timeline + ScrollTrigger（滚动驱动的坍塌）
  tl = gsap.timeline({
    scrollTrigger: {
      trigger: houseStage.value,
      start: 'top 60%',
      end: 'center 20%',
      scrub: 2.5,
      // markers: true,
      onEnter: () => {
        gsap.to(scrollHintRef.value, { opacity: 0, duration: 0.3 })
      },
      onLeaveBack: () => {
        gsap.to(scrollHintRef.value, { opacity: 1, duration: 0.3 })
      }
    }
  })

  // 阶段A：顶部卡片晃动（营造不稳定感）
  for (let i = 0; i < 4; i++) {
    tl.to(cardEls[i], {
      rotationZ: i % 2 === 0 ? 6 : -6,
      duration: 0.3,
      ease: 'power1.inOut'
    }, i * 0.1)
    tl.to(cardEls[i], {
      rotationZ: 0,
      duration: 0.3,
      ease: 'power1.inOut'
    }, i * 0.1 + 0.3)
  }

  // 阶段B：依次倒塌到网格
  tl.add(Flip.from(finalState, {
    duration: 2,
    stagger: (index) => {
      const order = collapseOrder.indexOf(index)
      return order * 0.1
    },
    ease: 'power3.inOut',
    absolute: true,
    force3D: true,
    props: 'filter,boxShadow,opacity'
  }), 0.5)

  // 阴影变化
  tl.to(shadowRef.value, {
    scaleX: 2,
    opacity: 0.3,
    duration: 1.5,
    ease: 'power2.out'
  }, 0.5)

  // 标题消失
  tl.to(titleRef.value, {
    y: -80,
    opacity: 0,
    rotateX: -20,
    duration: 1,
    ease: 'power2.in'
  }, 0.5)

  st = tl.scrollTrigger
  cleanupFns.push(() => {
    if (st) st.kill()
    if (tl) tl.kill()
  })
}

// 响应式处理
const handleResize = () => {
  if (st) st.kill()
  if (tl) tl.kill()
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  nextTick(() => {
    initEntryAnimation()
    initHouseAnimation()
  })
}

onMounted(() => {
  nextTick(() => {
    initEntryAnimation()
    // 延迟初始化卡片动画，确保DOM完全渲染
    setTimeout(initHouseAnimation, 100)
  })
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  // 清理所有动画
  cleanupFns.forEach(fn => fn())
  if (st) st.kill()
  if (tl) tl.kill()
  if (entryTl) entryTl.kill()
  if (entryCardsTl) entryCardsTl.kill()
  // 清理所有GSAP实例
  gsap.killTweensOf('*')
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.house-stage {
  width: 100vw;
  height: 200vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #1a1510 0%,
    #2a2218 30%,
    #1f1912 60%,
    #151210 100%
  );
  perspective: 1400px;
  transform-style: preserve-3d;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse 80% 50% at 50% 30%, rgba(60, 40, 20, 0.4) 0%, transparent 70%),
    radial-gradient(circle at 30% 70%, rgba(80, 50, 30, 0.2) 0%, transparent 50%);
  pointer-events: none;
}

.bg-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.6) 100%);
  pointer-events: none;
}

.house-title {
  position: fixed;
  top: 8vh;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 100;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  
  .title-text {
    display: block;
    font-family: 'Cinzel', 'Georgia', serif;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    color: #f4e8d0;
    text-shadow: 
      0 0 20px rgba(255, 200, 100, 0.5),
      0 0 40px rgba(255, 150, 50, 0.3),
      0 4px 8px rgba(0, 0, 0, 0.8);
    letter-spacing: 0.3em;
  }
  
  .title-sub {
    display: block;
    font-family: 'Georgia', serif;
    font-size: clamp(0.8rem, 1.5vw, 1.1rem);
    color: rgba(200, 180, 150, 0.7);
    margin-top: 0.5rem;
    letter-spacing: 0.5em;
    text-transform: uppercase;
  }
}

.scroll-hint {
  position: fixed;
  bottom: 8vh;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 100;
  
  .hint-arrow {
    display: block;
    font-size: 2rem;
    color: rgba(255, 200, 100, 0.8);
    animation: bounceArrow 2s ease-in-out infinite;
  }
  
  .hint-text {
    display: block;
    font-family: 'Georgia', serif;
    font-size: 0.9rem;
    color: rgba(200, 180, 150, 0.6);
    margin-top: 0.5rem;
    letter-spacing: 0.2em;
  }
}

@keyframes bounceArrow {
  0%, 100% { transform: translateY(0); opacity: 0.8; }
  50% { transform: translateY(10px); opacity: 1; }
}

.house-container {
  position: sticky;
  top: 50vh;
  transform: translateY(-50%);
  width: 100%;
  height: 80vh;
  transform-style: preserve-3d;
}

.house-card {
  position: absolute;
  width: 160px;
  height: 220px;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform, filter, box-shadow, opacity;
  cursor: pointer;
  
  &:hover .card-front {
    box-shadow: 
      0 4px 15px rgba(0,0,0,0.4),
      0 0 25px rgba(255, 200, 100, 0.3);
  }
}

.card-face {
  position: absolute;
  inset: 0;
  border-radius: 6px;
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

.card-front {
  background: linear-gradient(
    145deg,
    #faf5e8 0%,
    #ede0c8 40%,
    #e5d4b0 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 2px 8px rgba(0,0,0,0.2),
    0 0 15px rgba(255,255,240,0.3) inset;
  transition: box-shadow 0.3s ease;
  
  .card-num {
    font-family: 'Georgia', serif;
    font-size: 3rem;
    font-weight: bold;
    color: #3a3020;
    text-shadow: 1px 1px 2px rgba(255,255,255,0.5);
    opacity: 0.6;
  }
  
  .card-symbol {
    font-size: 1.2rem;
    color: #8a7a5a;
    margin-top: 0.5rem;
    opacity: 0.4;
  }
  
  .card-line {
    width: 60%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #8a7a5a, transparent);
    margin-top: 1rem;
    opacity: 0.3;
  }
}

.card-back {
  background: linear-gradient(
    135deg,
    #3a3226 0%,
    #2a2218 100%
  );
  transform: rotateY(180deg);
  box-shadow: 
    0 2px 8px rgba(0,0,0,0.3),
    0 0 10px rgba(0,0,0,0.5) inset;
  
  &::before {
    content: '';
    position: absolute;
    inset: 8px;
    border: 1px solid rgba(255,200,100,0.2);
    border-radius: 2px;
  }
  
  &::after {
    content: '◇';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    color: rgba(255,200,100,0.15);
  }
}

.ground-shadow {
  position: fixed;
  bottom: 15vh;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 20px;
  background: radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 70%);
  border-radius: 50%;
  transform-style: preserve-3d;
  z-index: 1;
}

// 响应式
@media (max-width: 768px) {
  .house-card {
    width: 100px;
    height: 140px;
  }
  
  .card-front {
    .card-num {
      font-size: 2rem;
    }
    
    .card-symbol {
      font-size: 0.9rem;
    }
  }
  
  .title-sub {
    letter-spacing: 0.2em;
  }
}
</style>
