<template>
  <div class="card-img-montage" ref="containerRef">
    <div class="montage-scene" ref="sceneRef">
      <!-- 分镜窗格容器 -->
      <div class="pane-1" ref="pane1Ref">
        <div class="pane-inner" ref="paneInner1Ref">
          <div class="pane-image" ref="paneImg1Ref"></div>
          <div class="pane-glow"></div>
          <div class="pane-edge"></div>
        </div>
      </div>
      
      <div class="pane-2" ref="pane2Ref">
        <div class="pane-inner" ref="paneInner2Ref">
          <div class="pane-image" ref="paneImg2Ref"></div>
          <div class="pane-glow"></div>
          <div class="pane-edge"></div>
        </div>
      </div>
      
      <div class="pane-3" ref="pane3Ref">
        <div class="pane-inner" ref="paneInner3Ref">
          <div class="pane-image" ref="paneImg3Ref"></div>
          <div class="pane-glow"></div>
          <div class="pane-edge"></div>
        </div>
      </div>
      
      <div class="pane-4" ref="pane4Ref">
        <div class="pane-inner" ref="paneInner4Ref">
          <div class="pane-image" ref="paneImg4Ref"></div>
          <div class="pane-glow"></div>
          <div class="pane-edge"></div>
        </div>
      </div>
      
      <div class="pane-5" ref="pane5Ref">
        <div class="pane-inner" ref="paneInner5Ref">
          <div class="pane-image" ref="paneImg5Ref"></div>
          <div class="pane-glow"></div>
          <div class="pane-edge"></div>
        </div>
      </div>
      
      <div class="pane-6" ref="pane6Ref">
        <div class="pane-inner" ref="paneInner6Ref">
          <div class="pane-image" ref="paneImg6Ref"></div>
          <div class="pane-glow"></div>
          <div class="pane-edge"></div>
        </div>
      </div>

      <!-- 电影暗角 -->
      <div class="cinema-vignette" ref="vignetteRef"></div>
      
      <!-- 导播台标记 -->
      <div class="director-markers">
        <span class="marker" v-for="i in 6" :key="i">{{ i }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TweenCleanup {
  kill: () => void
}

interface Props {
  imageUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'
})

// Refs
const containerRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const vignetteRef = ref<HTMLElement | null>(null)

const pane1Ref = ref<HTMLElement | null>(null)
const pane2Ref = ref<HTMLElement | null>(null)
const pane3Ref = ref<HTMLElement | null>(null)
const pane4Ref = ref<HTMLElement | null>(null)
const pane5Ref = ref<HTMLElement | null>(null)
const pane6Ref = ref<HTMLElement | null>(null)

const paneInner1Ref = ref<HTMLElement | null>(null)
const paneInner2Ref = ref<HTMLElement | null>(null)
const paneInner3Ref = ref<HTMLElement | null>(null)
const paneInner4Ref = ref<HTMLElement | null>(null)
const paneInner5Ref = ref<HTMLElement | null>(null)
const paneInner6Ref = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

// 初始化窗格背景图片
const initPaneImages = () => {
  const panes = [
    { el: pane1Ref.value, pos: '0% 0%', size: '120%' },
    { el: pane2Ref.value, pos: '60% 0%', size: '120%' },
    { el: pane3Ref.value, pos: '0% 40%', size: '120%' },
    { el: pane4Ref.value, pos: '50% 50%', size: '120%' },
    { el: pane5Ref.value, pos: '30% 80%', size: '120%' },
    { el: pane6Ref.value, pos: '0% 70%', size: '120%' }
  ]

  panes.forEach(pane => {
    if (pane.el) {
      const img = pane.el.querySelector('.pane-image') as HTMLElement
      if (img) {
        img.style.backgroundImage = `url(${props.imageUrl})`
        img.style.backgroundPosition = pane.pos
        img.style.backgroundSize = pane.size
      }
    }
  })
}

// 创建蒙太奇分镜动画
const createMontageAnimation = () => {
  if (!containerRef.value) return

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top 100%',
      end: 'bottom 20%',
      scrub: 1.5
    }
  })

  cleanupFns.push({
    kill: () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === containerRef.value) {
          st.kill()
        }
      })
    }
  })

  const panes = [
    { inner: paneInner1Ref.value, glow: pane1Ref.value?.querySelector('.pane-glow') as HTMLElement },
    { inner: paneInner2Ref.value, glow: pane2Ref.value?.querySelector('.pane-glow') as HTMLElement },
    { inner: paneInner3Ref.value, glow: pane3Ref.value?.querySelector('.pane-glow') as HTMLElement },
    { inner: paneInner4Ref.value, glow: pane4Ref.value?.querySelector('.pane-glow') as HTMLElement },
    { inner: paneInner5Ref.value, glow: pane5Ref.value?.querySelector('.pane-glow') as HTMLElement },
    { inner: paneInner6Ref.value, glow: pane6Ref.value?.querySelector('.pane-glow') as HTMLElement }
  ].filter(p => p.inner)

  // 阶段1: 依次激活窗格
  // 定义时序跳跃点（第3和第4个窗格同时启动，模拟导播手动切换的不完美感）
  const syncPoints = [2] // 0-indexed: 第3和第4个窗格

  panes.forEach((pane, index) => {
    if (!pane.inner || !pane.glow) return

    // 计算启动时间
    let startTime: string
    if (syncPoints.includes(index)) {
      // 同步点：与上一个同时
      const prevIndex = index - 1
      const baseTime = prevIndex <= 1 ? prevIndex * 0.12 : Math.floor(prevIndex / 2) * 0.12
      startTime = `>-${0.5 - 0.12}`
    } else if (index > 0 && syncPoints.includes(index - 1)) {
      // 同步组的第二个
      startTime = '<'
    } else {
      const baseTime = index <= 1 ? index * 0.12 : Math.floor(index / 2) * 0.12
      startTime = String(baseTime)
    }

    // 对焦动画
    tl.fromTo(
      pane.inner,
      {
        filter: 'blur(12px) brightness(0.4)',
        opacity: 0.6
      },
      {
        filter: 'blur(0px) brightness(1)',
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out'
      },
      startTime
    )

    // 边缘光晕闪现
    tl.fromTo(
      pane.glow,
      {
        opacity: 0,
        boxShadow: 'inset 0 0 0 0 rgba(255, 248, 240, 0)'
      },
      {
        opacity: 0.7,
        boxShadow: 'inset 0 0 12px 1px rgba(255, 248, 240, 0.5)',
        duration: 0.2
      },
      `>-0.15`
    )

    tl.to(
      pane.glow,
      {
        opacity: 0,
        boxShadow: 'inset 0 0 0 0 rgba(255, 248, 240, 0)',
        duration: 0.5
      },
      `>-0.1`
    )
  })

  // 阶段2: 全局锐化过冲
  const allInners = panes.map(p => p.inner)
  
  tl.to(allInners, {
    filter: 'blur(-0.5px)',
    duration: 0.15,
    ease: 'power2.out'
  }, '>-0.1')

  tl.to(allInners, {
    filter: 'blur(0px)',
    duration: 0.25,
    ease: 'elastic.out(1, 0.5)'
  })

  // 阶段3: 电影暗角显现
  if (vignetteRef.value) {
    tl.fromTo(
      vignetteRef.value,
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      '<0.2'
    )
  }
}

onMounted(() => {
  initPaneImages()
  requestAnimationFrame(() => {
    createMontageAnimation()
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.kill())
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === containerRef.value) {
      st.kill()
    }
  })
})
</script>

<style lang="scss" scoped>
.card-img-montage {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #0d0d12;
}

.montage-scene {
  width: 100%;
  height: 100%;
  position: relative;
}

// 窗格基础样式
.pane-1, .pane-2, .pane-3, .pane-4, .pane-5, .pane-6 {
  position: absolute;
  overflow: hidden;
}

.pane-inner {
  width: 100%;
  height: 100%;
  position: relative;
  filter: blur(12px) brightness(0.4);
  opacity: 0.6;
}

.pane-image {
  position: absolute;
  inset: 0;
  background-repeat: no-repeat;
}

.pane-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
}

.pane-edge {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

// 蒙太奇布局 - 不规则但均衡的分镜画面
.pane-1 {
  left: 2%;
  top: 3%;
  width: 48%;
  height: 55%;
}

.pane-2 {
  left: 52%;
  top: 2%;
  width: 46%;
  height: 42%;
}

.pane-3 {
  left: 3%;
  top: 60%;
  width: 35%;
  height: 38%;
}

.pane-4 {
  left: 40%;
  top: 46%;
  width: 40%;
  height: 50%;
}

.pane-5 {
  left: 82%;
  top: 5%;
  width: 16%;
  height: 40%;
}

.pane-6 {
  left: 76%;
  top: 47%;
  width: 22%;
  height: 50%;
}

// 电影暗角
.cinema-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  background: 
    radial-gradient(
      ellipse at center,
      transparent 35%,
      rgba(0, 0, 0, 0.3) 70%,
      rgba(0, 0, 0, 0.85) 100%
    );
  opacity: 0;
}

// 导播台编号标记
.director-markers {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 60;
  
  .marker {
    position: absolute;
    font-family: 'Courier New', monospace;
    font-size: 10px;
    color: rgba(255, 248, 240, 0.25);
    font-weight: bold;
    letter-spacing: 1px;
  }
  
  .marker:nth-child(1) { left: 24%; top: 30%; }
  .marker:nth-child(2) { left: 74%; top: 22%; }
  .marker:nth-child(3) { left: 20%; top: 78%; }
  .marker:nth-child(4) { left: 59%; top: 70%; }
  .marker:nth-child(5) { left: 89%; top: 22%; }
  .marker:nth-child(6) { left: 86%; top: 71%; }
}
</style>
