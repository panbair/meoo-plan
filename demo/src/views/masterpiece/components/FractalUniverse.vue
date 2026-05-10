<template>
  <div class="fractal-container" ref="containerRef">
    <canvas class="fractal-canvas" ref="canvasRef"></canvas>
    <div class="fractal-overlay"></div>
    <div class="fractal-info">
      <h3 class="fractal-title">分形宇宙</h3>
      <p class="fractal-subtitle">无限自相似几何</p>
      <div class="fractal-controls">
        <div class="control-group">
          <span class="control-label">迭代深度</span>
          <input
            type="range"
            v-model="iterations"
            min="1"
            max="6"
            class="control-slider"
          />
          <span class="control-value">{{ iterations }}</span>
        </div>
        <div class="control-group">
          <span class="control-label">复杂度</span>
          <input
            type="range"
            v-model="complexity"
            min="1"
            max="100"
            class="control-slider"
          />
          <span class="control-value">{{ complexity }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import gsap from 'gsap'

interface Props {
  size?: number
  maxIterations?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 500,
  maxIterations: 6
})

const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const iterations = ref(4)
const complexity = ref(50)
let ctx: gsap.Context
let animationId: number
let time = 0
let targetIterations = 4

// 绘制谢尔宾斯基三角形
const drawSierpinski = (
  context: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  depth: number,
  maxDepth: number
) => {
  if (depth === 0) {
    const hue = (time * 20 + depth * 30) % 360
    const saturation = 70 + (complexity.value / 100) * 30
    const lightness = 50 + Math.sin(time + depth) * 10

    context.beginPath()
    context.moveTo(x1, y1)
    context.lineTo(x2, y2)
    context.lineTo(x3, y3)
    context.closePath()

    const gradient = context.createLinearGradient(x1, y1, x2, y2)
    gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`)
    gradient.addColorStop(0.5, `hsla(${hue + 30}, ${saturation}%, ${lightness}%, 0.6)`)
    gradient.addColorStop(1, `hsla(${hue + 60}, ${saturation}%, ${lightness}%, 0.8)`)

    context.fillStyle = gradient
    context.fill()

    // 边框
    context.strokeStyle = `hsla(${hue + 90}, 80%, 70%, 0.5)`
    context.lineWidth = 0.5
    context.stroke()
  } else {
    // 计算中点
    const mx1 = (x1 + x2) / 2
    const my1 = (y1 + y2) / 2
    const mx2 = (x2 + x3) / 2
    const my2 = (y2 + y3) / 2
    const mx3 = (x1 + x3) / 2
    const my3 = (y1 + y3) / 2

    // 递归绘制三个小三角形
    drawSierpinski(context, x1, y1, mx1, my1, mx3, my3, depth - 1, maxDepth)
    drawSierpinski(context, mx1, my1, x2, y2, mx2, my2, depth - 1, maxDepth)
    drawSierpinski(context, mx3, my3, mx2, my2, x3, y3, depth - 1, maxDepth)
  }
}

// 绘制曼德布罗特集合
const drawMandelbrot = (
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  size: number
) => {
  const imageData = context.createImageData(size, size)
  const data = imageData.data
  const maxIter = iterations.value * 10 + 50

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const x0 = (px - size / 2) / (size / 4) + centerX
      const y0 = (py - size / 2) / (size / 4) + centerY

      let x = 0
      let y = 0
      let iteration = 0

      while (x * x + y * y <= 4 && iteration < maxIter) {
        const xtemp = x * x - y * y + x0
        y = 2 * x * y + y0
        x = xtemp
        iteration++
      }

      const index = (py * size + px) * 4
      if (iteration === maxIter) {
        data[index] = 0
        data[index + 1] = 0
        data[index + 2] = 0
        data[index + 3] = 255
      } else {
        const hue = (iteration / maxIter) * 360 + time * 20
        const rgb = hslToRgb(hue, 80, 50)
        data[index] = rgb[0]
        data[index + 1] = rgb[1]
        data[index + 2] = rgb[2]
        data[index + 3] = 255
      }
    }
  }

  context.putImageData(imageData, 0, 0)
}

// HSL 转 RGB
const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  s /= 100
  l /= 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = l - c / 2

  let r = 0, g = 0, b = 0

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x
  }

  return [
    Math.floor((r + m) * 255),
    Math.floor((g + m) * 255),
    Math.floor((b + m) * 255)
  ]
}

const animateFractal = () => {
  const canvas = canvasRef.value!
  canvas.width = props.size
  canvas.height = props.size
  const context = canvas.getContext('2d')!

  const animate = () => {
    time += 0.01

    // 清除画布
    context.fillStyle = 'rgba(0, 0, 10, 0.05)'
    context.fillRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // 绘制动态分形
    const size = Math.min(canvas.width, canvas.height) * 0.8
    const height = size * Math.sqrt(3) / 2

    // 平滑过渡迭代深度
    const currentIterations = Math.floor(iterations.value)
    drawSierpinski(
      context,
      centerX - size / 2,
      centerY + height / 3,
      centerX + size / 2,
      centerY + height / 3,
      centerX,
      centerY - height * 2 / 3,
      currentIterations,
      currentIterations
    )

    // 绘制外层装饰
    const ringCount = 5
    for (let i = 0; i < ringCount; i++) {
      const radius = size * (0.6 + i * 0.1)
      const rotation = time * (0.3 - i * 0.05)
      const segments = 3 + i * 2

      context.save()
      context.translate(centerX, centerY)
      context.rotate(rotation)

      for (let j = 0; j < segments; j++) {
        const angle = (j / segments) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        const hue = (time * 30 + i * 60 + j * 30) % 360

        context.beginPath()
        context.arc(x, y, 3 + Math.sin(time * 2 + j) * 2, 0, Math.PI * 2)
        context.fillStyle = `hsla(${hue}, 80%, 60%, 0.6)`
        context.fill()

        // 连接线
        if (j > 0) {
          const prevAngle = ((j - 1) / segments) * Math.PI * 2
          const prevX = Math.cos(prevAngle) * radius
          const prevY = Math.sin(prevAngle) * radius

          context.beginPath()
          context.moveTo(prevX, prevY)
          context.lineTo(x, y)
          context.strokeStyle = `hsla(${hue}, 80%, 60%, 0.3)`
          context.lineWidth = 1
          context.stroke()
        }
      }

      context.restore()
    }

    animationId = requestAnimationFrame(animate)
  }

  animate()
}

onMounted(() => {
  ctx = gsap.context(() => {
    animateFractal()

    // 鼠标交互
    containerRef.value?.addEventListener('mousemove', (e) => {
      const rect = containerRef.value!.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) / 20
      const y = (e.clientY - rect.top - rect.height / 2) / 20

      gsap.to(canvasRef.value, {
        rotateY: x,
        rotateX: -y,
        duration: 0.3,
        ease: 'power2.out'
      })

      // 影响复杂度
      complexity.value = 50 + (x + y) * 2
      complexity.value = Math.max(1, Math.min(100, complexity.value))
    })

    containerRef.value?.addEventListener('mouseleave', () => {
      gsap.to(canvasRef.value, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: 'power2.out'
      })

      complexity.value = 50
    })

    // 点击触发分形爆发
    containerRef.value?.addEventListener('click', () => {
      const targetIt = iterations.value >= 6 ? 2 : 6

      gsap.to({ value: iterations.value }, {
        value: targetIt,
        duration: 1,
        ease: 'power2.inOut',
        onUpdate: function() {
          iterations.value = Math.round(this.targets()[0].value)
        }
      })
    })
  }, containerRef.value)
})

onUnmounted(() => {
  ctx?.revert()
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<style scoped lang="scss">
.fractal-container {
  position: relative;
  width: 500px;
  height: 550px;
  border-radius: 20px;
  overflow: hidden;
  background: radial-gradient(circle at center, #0a0a2a, #000010);
  perspective: 1000px;
  cursor: pointer;
}

.fractal-canvas {
  width: 100%;
  height: 500px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.fractal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 500px;
  background: radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, 0.3));
  pointer-events: none;
  z-index: 2;
}

.fractal-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(131, 56, 236, 0.3);
  z-index: 10;
}

.fractal-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 4px;
}

.fractal-subtitle {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 12px;
}

.fractal-controls {
  margin-top: 10px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
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
  background: rgba(131, 56, 236, 0.3);
  border-radius: 2px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    background: #8338ec;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(131, 56, 236, 0.5);
  }
}

.control-value {
  font-size: 0.75rem;
  color: #8338ec;
  font-family: 'Courier New', monospace;
  min-width: 40px;
  text-align: right;
}

@media (max-width: 768px) {
  .fractal-container {
    width: 350px;
    height: 400px;
  }

  .fractal-canvas {
    height: 350px;
  }

  .fractal-overlay {
    height: 350px;
  }
}
</style>
