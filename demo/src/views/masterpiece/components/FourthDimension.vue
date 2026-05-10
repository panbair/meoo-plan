<template>
  <div class="fourth-dimension-container" ref="containerRef">
    <canvas class="fourth-dim-canvas" ref="canvasRef"></canvas>
    <div class="hypercube-wrapper" ref="hypercubeRef">
      <div class="hypercube">
        <div class="cube outer">
          <div class="face front"></div>
          <div class="face back"></div>
          <div class="face left"></div>
          <div class="face right"></div>
          <div class="face top"></div>
          <div class="face bottom"></div>
        </div>
        <div class="cube inner">
          <div class="face front"></div>
          <div class="face back"></div>
          <div class="face left"></div>
          <div class="face right"></div>
          <div class="face top"></div>
          <div class="face bottom"></div>
        </div>
        <div class="edges">
          <div v-for="i in 8" :key="i" class="edge" :class="'edge-' + i"></div>
        </div>
      </div>
    </div>
    <div class="dimension-info">
      <h3 class="dimension-title">四维超立方</h3>
      <p class="dimension-subtitle">Tesseract 超体可视化</p>
      <div class="dimension-controls">
        <div class="control-group">
          <span class="control-label">第四维度</span>
          <input
            type="range"
            v-model="wDimension"
            min="0"
            max="100"
            class="control-slider"
          />
          <span class="control-value">{{ wDimension }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Props {
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 400
})

const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const hypercubeRef = ref<HTMLElement>()
const wDimension = ref(50)
let ctx: gsap.Context
let animationId: number
let time = 0

const animateCanvas = () => {
  const canvas = canvasRef.value!
  const context = canvas.getContext('2d')!
  canvas.width = props.size
  canvas.height = props.size

  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const wValue = wDimension.value / 100

  const animate = () => {
    time += 0.01

    // 清除画布
    context.fillStyle = 'rgba(5, 5, 20, 0.1)'
    context.fillRect(0, 0, canvas.width, canvas.height)

    // 绘制四维超立方体投影
    const rotationSpeed = time * 0.5

    // 定义四维超立方体的16个顶点
    const tesseractVertices = []
    for (let i = 0; i < 16; i++) {
      const bits = i.toString(2).padStart(4, '0')
      const x = parseInt(bits[0]) ? 1 : -1
      const y = parseInt(bits[1]) ? 1 : -1
      const z = parseInt(bits[2]) ? 1 : -1
      const w = parseInt(bits[3]) ? 1 : -1

      tesseractVertices.push({ x, y, z, w })
    }

    // 4D旋转矩阵
    const rotate4D = (point: any, angle: number) => {
      const { x, y, z, w } = point

      // XW 平面旋转
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)

      return {
        x: x * cos - w * sin,
        y: y,
        z: z,
        w: x * sin + w * cos
      }
    }

    // 3D投影
    const project3D = (point: any) => {
      const { x, y, z, w } = point
      const distance = 3
      const scale = distance / (distance + z + w * wValue)

      return {
        x: point.x * scale,
        y: point.y * scale,
        scale: scale
      }
    }

    // 2D投影
    const project2D = (point: any) => {
      const { x, y, scale } = point
      const size = 100 * scale
      return {
        x: centerX + point.x * size,
        y: centerY + point.y * size,
        size: size
      }
    }

    // 处理所有顶点
    const projectedVertices = tesseractVertices.map(v => {
      const rotated = rotate4D(v, rotationSpeed)
      const projected3D = project3D(rotated)
      const projected2D = project2D(projected3D)
      return { ...projected2D, alpha: projected3D.scale }
    })

    // 定义超立方体的边 (连接关系)
    const edges = [
      [0, 1], [0, 2], [0, 4], [0, 8],
      [1, 3], [1, 5], [1, 9],
      [2, 3], [2, 6], [2, 10],
      [3, 7], [3, 11],
      [4, 5], [4, 6], [4, 12],
      [5, 7], [5, 13],
      [6, 7], [6, 14],
      [7, 15],
      [8, 9], [8, 10], [8, 12],
      [9, 11], [9, 13],
      [10, 11], [10, 14],
      [11, 15],
      [12, 13], [12, 14],
      [13, 15],
      [14, 15]
    ]

    // 绘制边
    edges.forEach(([start, end]) => {
      const v1 = projectedVertices[start]
      const v2 = projectedVertices[end]
      const avgAlpha = (v1.alpha + v2.alpha) / 2

      const gradient = context.createLinearGradient(v1.x, v1.y, v2.x, v2.y)
      gradient.addColorStop(0, `rgba(139, 92, 246, ${avgAlpha * 0.8})`)
      gradient.addColorStop(1, `rgba(59, 130, 246, ${avgAlpha * 0.8})`)

      context.beginPath()
      context.moveTo(v1.x, v1.y)
      context.lineTo(v2.x, v2.y)
      context.strokeStyle = gradient
      context.lineWidth = 2 * avgAlpha
      context.stroke()
    })

    // 绘制顶点
    projectedVertices.forEach(vertex => {
      const gradient = context.createRadialGradient(
        vertex.x, vertex.y, 0,
        vertex.x, vertex.y, vertex.size * 0.3
      )
      gradient.addColorStop(0, `rgba(255, 255, 255, ${vertex.alpha})`)
      gradient.addColorStop(1, `rgba(139, 92, 246, ${vertex.alpha * 0.5})`)

      context.beginPath()
      context.arc(vertex.x, vertex.y, vertex.size * 0.15, 0, Math.PI * 2)
      context.fillStyle = gradient
      context.fill()

      // 辉光
      context.shadowBlur = 10 * vertex.alpha
      context.shadowColor = '#8b5cf6'
      context.fill()
      context.shadowBlur = 0
    })

    // 绘制中心能量场
    const energyPulse = Math.sin(time * 2) * 0.5 + 0.5
    const energyGradient = context.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, 150
    )
    energyGradient.addColorStop(0, `rgba(139, 92, 246, ${energyPulse * 0.3})`)
    energyGradient.addColorStop(0.5, `rgba(59, 130, 246, ${energyPulse * 0.1})`)
    energyGradient.addColorStop(1, 'transparent')

    context.beginPath()
    context.arc(centerX, centerY, 150, 0, Math.PI * 2)
    context.fillStyle = energyGradient
    context.fill()

    animationId = requestAnimationFrame(animate)
  }

  animate()
}

onMounted(() => {
  ctx = gsap.context(() => {
    animateCanvas()

    // 超立方体CSS动画
    gsap.to(hypercubeRef.value, {
      rotateX: 360,
      duration: 20,
      repeat: -1,
      ease: 'none'
    })

    gsap.to(hypercubeRef.value, {
      rotateY: 360,
      duration: 15,
      repeat: -1,
      ease: 'none'
    })

    // 内外立方体相对旋转
    gsap.to('.inner', {
      rotateX: -360,
      duration: 10,
      repeat: -1,
      ease: 'none'
    })

    gsap.to('.inner', {
      rotateY: -360,
      duration: 8,
      repeat: -1,
      ease: 'none'
    })

    // 鼠标交互
    containerRef.value?.addEventListener('mousemove', (e) => {
      const rect = containerRef.value!.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) / 15
      const y = (e.clientY - rect.top - rect.height / 2) / 15

      gsap.to(canvasRef.value, {
        rotateY: x,
        rotateX: -y,
        duration: 0.3,
        ease: 'power2.out'
      })

      gsap.to(hypercubeRef.value, {
        rotateZ: x * 0.5,
        duration: 0.3,
        ease: 'power2.out'
      })
    })

    containerRef.value?.addEventListener('mouseleave', () => {
      gsap.to(canvasRef.value, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: 'power2.out'
      })

      gsap.to(hypercubeRef.value, {
        rotateZ: 0,
        duration: 0.5,
        ease: 'power2.out'
      })
    })

    // 点击切换维度
    containerRef.value?.addEventListener('click', () => {
      const targetW = wDimension.value > 50 ? 0 : 100
      gsap.to(containerRef.value, {
        onUpdate: () => {
          // 通过GSAP更新wDimension
        },
        duration: 1.5,
        ease: 'elastic.out(1, 0.5)'
      })

      // 手动动画wDimension
      const startW = wDimension.value
      const endW = targetW
      let startTime: number

      const animateW = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min(1, (timestamp - startTime) / 1500)
        const eased = 1 - Math.pow(1 - progress, 3)

        wDimension.value = startW + (endW - startW) * eased

        if (progress < 1) {
          requestAnimationFrame(animateW)
        }
      }

      requestAnimationFrame(animateW)
    })
  }, containerRef.value)
})

onUnmounted(() => {
  ctx?.revert()
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<style scoped lang="scss">
.fourth-dimension-container {
  position: relative;
  width: 400px;
  height: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, #0a0a2a, #000010);
  border-radius: 20px;
  overflow: hidden;
  perspective: 1200px;
  cursor: pointer;
}

.fourth-dim-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 380px;
  z-index: 1;
}

.hypercube-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 380px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform-style: preserve-3d;
  pointer-events: none;
  z-index: 2;
}

.hypercube {
  position: relative;
  width: 150px;
  height: 150px;
  transform-style: preserve-3d;
}

.cube {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.outer {
  animation: outerRotate 10s infinite linear;
}

.inner {
  width: 50%;
  height: 50%;
  left: 25%;
  top: 25%;
  animation: innerRotate 6s infinite linear;
}

@keyframes outerRotate {
  0% {
    transform: rotateX(0deg) rotateY(0deg);
  }
  100% {
    transform: rotateX(360deg) rotateY(360deg);
  }
}

@keyframes innerRotate {
  0% {
    transform: rotateX(0deg) rotateY(0deg);
  }
  100% {
    transform: rotateX(-360deg) rotateY(-360deg);
  }
}

.face {
  position: absolute;
  width: 150px;
  height: 150px;
  border: 2px solid rgba(139, 92, 246, 0.5);
  background: rgba(139, 92, 246, 0.05);
  box-shadow: inset 0 0 20px rgba(139, 92, 246, 0.1);
}

.inner .face {
  width: 75px;
  height: 75px;
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(59, 130, 246, 0.1);
}

.front {
  transform: translateZ(75px);
}

.back {
  transform: rotateY(180deg) translateZ(75px);
}

.left {
  transform: rotateY(-90deg) translateZ(75px);
}

.right {
  transform: rotateY(90deg) translateZ(75px);
}

.top {
  transform: rotateX(90deg) translateZ(75px);
}

.bottom {
  transform: rotateX(-90deg) translateZ(75px);
}

.inner .front {
  transform: translateZ(37.5px);
}

.inner .back {
  transform: rotateY(180deg) translateZ(37.5px);
}

.inner .left {
  transform: rotateY(-90deg) translateZ(37.5px);
}

.inner .right {
  transform: rotateY(90deg) translateZ(37.5px);
}

.inner .top {
  transform: rotateX(90deg) translateZ(37.5px);
}

.inner .bottom {
  transform: rotateX(-90deg) translateZ(37.5px);
}

.edge {
  position: absolute;
  width: 2px;
  height: 75px;
  background: linear-gradient(to bottom, #8b5cf6, #3b82f6);
  transform-origin: bottom center;
  opacity: 0.6;
}

.edge-1 { transform: translateX(-74px) translateY(-74px) rotateX(0deg) rotateY(0deg); }
.edge-2 { transform: translateX(74px) translateY(-74px) rotateX(0deg) rotateY(90deg); }
.edge-3 { transform: translateX(74px) translateY(74px) rotateX(0deg) rotateY(180deg); }
.edge-4 { transform: translateX(-74px) translateY(74px) rotateX(0deg) rotateY(270deg); }
.edge-5 { transform: translateX(-74px) translateY(-74px) rotateY(0deg) rotateX(90deg); }
.edge-6 { transform: translateX(74px) translateY(-74px) rotateY(90deg) rotateX(90deg); }
.edge-7 { transform: translateX(74px) translateY(74px) rotateY(180deg) rotateX(90deg); }
.edge-8 { transform: translateX(-74px) translateY(74px) rotateY(270deg) rotateX(90deg); }

.dimension-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  z-index: 10;
  border-top: 1px solid rgba(139, 92, 246, 0.3);
}

.dimension-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 4px;
}

.dimension-subtitle {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 12px;
}

.dimension-controls {
  margin-top: 10px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-label {
  font-size: 0.75rem;
  color: #64748b;
  min-width: 80px;
}

.control-slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  background: rgba(139, 92, 246, 0.3);
  border-radius: 2px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    background: #8b5cf6;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
  }
}

.control-value {
  font-size: 0.75rem;
  color: #8b5cf6;
  font-family: 'Courier New', monospace;
  min-width: 40px;
  text-align: right;
}

@media (max-width: 768px) {
  .fourth-dimension-container {
    width: 300px;
    height: 380px;
  }

  .face {
    width: 100px;
    height: 100px;
  }

  .inner .face {
    width: 50px;
    height: 50px;
  }

  .front { transform: translateZ(50px); }
  .back { transform: rotateY(180deg) translateZ(50px); }
  .left { transform: rotateY(-90deg) translateZ(50px); }
  .right { transform: rotateY(90deg) translateZ(50px); }
  .top { transform: rotateX(90deg) translateZ(50px); }
  .bottom { transform: rotateX(-90deg) translateZ(50px); }

  .inner .front { transform: translateZ(25px); }
  .inner .back { transform: rotateY(180deg) translateZ(25px); }
  .inner .left { transform: rotateY(-90deg) translateZ(25px); }
  .inner .right { transform: rotateY(90deg) translateZ(25px); }
  .inner .top { transform: rotateX(90deg) translateZ(25px); }
  .inner .bottom { transform: rotateX(-90deg) translateZ(25px); }
}
</style>
