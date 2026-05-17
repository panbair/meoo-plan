<template>
  <div class="hologram-text-wrapper-188">
    <div class="hgt-stage-188" ref="stageRef">
      <div class="hgt-holo-bg-188">
        <canvas class="hgt-grid-canvas-188" ref="gridCanvasRef"></canvas>
        <div class="hgt-scan-lines-188">
          <div class="hgt-scan-line-188" v-for="i in 20" :key="i"></div>
        </div>
      </div>
      <div class="hgt-projection-base-188">
        <div class="hgt-base-ring-188" v-for="i in 3" :key="i"></div>
      </div>
      <div class="hgt-holo-container-188" ref="containerRef">
        <div class="hgt-projection-cone-188"></div>
        <h2 class="hgt-title-188">HOLOGRAPHIC</h2>
        <div class="hgt-holo-text-188">
          <span class="hgt-char-188" v-for="(char, i) in text.split('')" :key="i">{{ char }}</span>
        </div>
        <div class="hgt-data-particles-188">
          <div class="hgt-particle-188" v-for="i in 50" :key="i"></div>
        </div>
        <div class="hgt-hologram-layer-188"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stageRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()
const gridCanvasRef = ref<HTMLCanvasElement>()
const text = ref('PROJECTED')

let gridCtx: CanvasRenderingContext2D | null = null
let animationId: number | null = null
let gridOffset = 0

const initGridCanvas = () => {
  const canvas = gridCanvasRef.value
  const stage = stageRef.value
  if (!canvas || !stage) return

  canvas.width = stage.offsetWidth
  canvas.height = stage.offsetHeight
  gridCtx = canvas.getContext('2d')
}

const animateGrid = () => {
  const canvas = gridCanvasRef.value
  if (!canvas || !gridCtx) return

  gridCtx.clearRect(0, 0, canvas.width, canvas.height)

  // 绘制网格
  gridCtx.strokeStyle = 'rgba(0, 255, 255, 0.1)'
  gridCtx.lineWidth = 1

  const gridSize = 40
  gridOffset = (gridOffset + 0.5) % gridSize

  // 垂直线
  for (let x = 0; x <= canvas.width; x += gridSize) {
    gridCtx.beginPath()
    gridCtx.moveTo(x, 0)
    gridCtx.lineTo(x, canvas.height)
    gridCtx.stroke()
  }

  // 水平线（移动）
  for (let y = gridOffset; y <= canvas.height; y += gridSize) {
    gridCtx.beginPath()
    gridCtx.moveTo(0, y)
    gridCtx.lineTo(canvas.width, y)
    gridCtx.stroke()
  }

  animationId = requestAnimationFrame(animateGrid)
}

const initAnimations = () => {
  const stage = stageRef.value
  const container = containerRef.value
  if (!stage || !container) return

  const chars = gsap.utils.toArray('.hgt-char-188') as HTMLElement[]
  const title = container.querySelector('.hgt-title-188')
  const particles = gsap.utils.toArray('.hgt-particle-188') as HTMLElement[]
  const rings = gsap.utils.toArray('.hgt-base-ring-188') as HTMLElement[]
  const scanLines = gsap.utils.toArray('.hgt-scan-line-188') as HTMLElement[]
  const cone = container.querySelector('.hgt-projection-cone-188')
  const holoLayer = container.querySelector('.hgt-hologram-layer-188')

  // 初始状态
  gsap.set(chars, {
    opacity: 0,
    scale: 0,
    rotationX: 90,
    z: -100,
    transformPerspective: 1000
  })
  gsap.set(title, { opacity: 0, rotationY: 90 })
  gsap.set(particles, { scale: 0, opacity: 0 })
  gsap.set(rings, { scale: 0, opacity: 0 })
  gsap.set(scanLines, { y: -100, opacity: 0 })
  gsap.set(cone, { scaleY: 0, opacity: 0, transformOrigin: 'bottom center' })
  gsap.set(holoLayer, { opacity: 0, scale: 0.8 })

  // 投射锥出现
  gsap.to(cone, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 80%',
      end: 'top 60%',
      scrub: 1
    },
    scaleY: 1,
    opacity: 0.3
  })

  // 基底环旋转
  gsap.to(rings, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 75%',
      end: 'top 50%',
      scrub: 1
    },
    scale: [0, 1],
    opacity: [0, 0.6],
    rotation: 360,
    stagger: 0.2,
    duration: 2
  })

  // 持续旋转
  gsap.to(rings, {
    rotation: '+=360',
    duration: 10,
    repeat: -1,
    ease: 'none',
    stagger: -0.1
  })

  // 标题3D旋转入场
  gsap.to(title, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 70%',
      end: 'top 40%',
      scrub: 1
    },
    opacity: 1,
    rotationY: 0
  })

  // 3D文字投影
  gsap.to(chars, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 60%',
      end: 'center center',
      scrub: 1
    },
    opacity: 1,
    scale: 1,
    rotationX: 0,
    z: 0,
    stagger: 0.1
  })

  // 数据粒子
  gsap.to(particles, {
    scrollTrigger: {
      trigger: stage,
      start: 'top 50%',
      end: 'top 30%',
      scrub: 0.5
    },
    scale: 1,
    opacity: 0.8,
    stagger: {
      each: 0.02,
      from: 'random'
    }
  })

  // 扫描线效果
  gsap.to(scanLines, {
    scrollTrigger: {
      trigger: stage,
      start: 'top center',
      end: 'bottom center',
      scrub: 0.5
    },
    y: (i) => 200 + i * 30,
    opacity: 0.3,
    stagger: 0.1
  })

  // 全息层
  gsap.to(holoLayer, {
    scrollTrigger: {
      trigger: stage,
      start: 'center center',
      end: 'bottom 40%',
      scrub: 1
    },
    opacity: 0.2,
    scale: 1
  })

  // 字符悬停3D效果
  chars.forEach(char => {
    char.addEventListener('mouseenter', () => {
      gsap.to(char, {
        scale: 1.2,
        textShadow: '0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.6)',
        duration: 0.3
      })
    })

    char.addEventListener('mouseleave', () => {
      gsap.to(char, {
        scale: 1,
        textShadow: 'none',
        duration: 0.3
      })
    })
  })

  // 文字持续3D摆动
  gsap.to(chars, {
    rotationX: 10,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: 0.1
  })
}

onMounted(() => {
  initGridCanvas()
  animateGrid()
  initAnimations()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.hologram-text-wrapper-188 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a1a 0%, #050510 50%, #020208 100%);
  overflow: hidden;

  opacity: 1 !important;}

.hgt-stage-188 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  perspective: 1500px;

  opacity: 1 !important;}

.hgt-holo-bg-188 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.hgt-grid-canvas-188 {
  width: 100%;
  height: 100%;

  opacity: 1 !important;}

.hgt-scan-lines-188 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.hgt-scan-line-188 {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.5), transparent);

  opacity: 1 !important;}

.hgt-projection-base-188 {
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 100px;
  pointer-events: none;

  opacity: 1 !important;}

.hgt-base-ring-188 {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  border: 2px solid rgba(0, 255, 255, 0.6);
  border-radius: 50%;

  opacity: 1 !important;}

.hgt-base-ring-188:nth-child(1) {
  width: 200px;
  height: 200px;
}

.hgt-base-ring-188:nth-child(2) {
  width: 150px;
  height: 150px;
}

.hgt-base-ring-188:nth-child(3) {
  width: 100px;
  height: 100px;
}

.hgt-holo-container-188 {
  position: relative;
  text-align: center;
  z-index: 10;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.hgt-projection-cone-188 {
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 300px;
  border-left: 150px solid transparent;
  border-right: 150px solid transparent;
  border-bottom: 300px solid rgba(0, 255, 255, 0.1);
  filter: blur(5px);
  pointer-events: none;

  opacity: 1 !important;}

.hgt-title-188 {
  font-size: 3rem;
  font-weight: 700;
  color: #00ffff;
  margin-bottom: 40px;
  text-shadow: 0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.4);
  letter-spacing: 8px;
  text-transform: uppercase;

  opacity: 1 !important;}

.hgt-holo-text-188 {
  display: inline-block;
  position: relative;
  z-index: 5;
  padding: 40px 60px;
  background: rgba(0, 20, 40, 0.3);
  border-radius: 10px;
  backdrop-filter: blur(5px);
  border: 2px solid rgba(0, 255, 255, 0.3);
  transform-style: preserve-3d;

  opacity: 1 !important;}

.hgt-char-188 {
  display: inline-block;
  font-size: 4.5rem;
  font-weight: 900;
  color: #00ffff;
  text-transform: uppercase;
  letter-spacing: 10px;
  transition: all 0.3s ease;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.hgt-data-particles-188 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.hgt-particle-188 {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #00ffff;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.8);

  opacity: 1 !important;}

.hgt-hologram-layer-188 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 255, 0.03) 2px,
    rgba(0, 255, 255, 0.03) 4px
  );
  pointer-events: none;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .hgt-title-188 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .hgt-char-188 {
    font-size: 2.8rem;
    letter-spacing: 5px;
  
  opacity: 1 !important;}

  .hgt-holo-text-188 {
    padding: 30px 40px;
  
  opacity: 1 !important;}
}
</style>
