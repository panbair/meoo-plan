<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

// ==================== 场景定义 ====================
interface Scene {
  id: number
  title: string
  subtitle: string
  bgColor: string
  accentColor: string
  icon: string
}

const scenes: Scene[] = [
  { id: 0, title: '智能客服中心', subtitle: 'AI Customer Service', bgColor: '#0a1628', accentColor: '#3b82f6', icon: '💬' },
  { id: 1, title: '数据分析平台', subtitle: 'Data Analytics Platform', bgColor: '#0a1a14', accentColor: '#10b981', icon: '📊' },
  { id: 2, title: '自动化引擎', subtitle: 'Automation Engine', bgColor: '#1a0f0a', accentColor: '#f59e0b', icon: '⚙️' },
  { id: 3, title: '安全监控塔', subtitle: 'Security Monitor', bgColor: '#1a0a14', accentColor: '#ef4444', icon: '🛡️' },
]

// ==================== 状态 ====================
const containerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const currentScene = ref(0)
const isTransitioning = ref(false)
const portalProgress = ref(0) // 0=idle, 1=fully open
const tunnelDepth = ref(0) // 0-1 穿越进度
const flash = ref(0) // white flash

interface Ring {
  z: number
  radius: number
  rotation: number
  alpha: number
}

interface Particle {
  x: number; y: number; z: number
  vx: number; vy: number; vz: number
  size: number; alpha: number; color: string
}

const rings = reactive<Ring[]>([])
const particles = reactive<Particle[]>([])

let ctx: CanvasRenderingContext2D | null = null
let canvasW = 0
let canvasH = 0
let animFrame = 0
let time = 0

// ==================== 初始化环和粒子 ====================
function initRings() {
  rings.length = 0
  for (let i = 0; i < 30; i++) {
    rings.push({
      z: i / 30,
      radius: 50 + i * 12,
      rotation: i * 15,
      alpha: 0.8 - i * 0.02,
    })
  }
}

function spawnParticles(count: number, color: string) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 1 + Math.random() * 3
    particles.push({
      x: canvasW / 2,
      y: canvasH / 2,
      z: Math.random(),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      vz: -0.02 - Math.random() * 0.03,
      size: 1 + Math.random() * 3,
      alpha: 0.5 + Math.random() * 0.5,
      color,
    })
  }
}

// ==================== 渲染 ====================
function render() {
  if (!ctx) return
  time += 0.016

  const scene = scenes[currentScene.value]

  // Background
  ctx.fillStyle = scene.bgColor
  ctx.fillRect(0, 0, canvasW, canvasH)

  // Background grid
  ctx.save()
  ctx.strokeStyle = scene.accentColor + '15'
  ctx.lineWidth = 0.5
  for (let x = 0; x < canvasW; x += 50) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvasH); ctx.stroke()
  }
  for (let y = 0; y < canvasH; y += 50) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvasW, y); ctx.stroke()
  }
  ctx.restore()

  const cx = canvasW / 2
  const cy = canvasH / 2

  // Portal rings (tunnel effect)
  if (portalProgress.value > 0) {
    rings.forEach((ring, i) => {
      const progress = portalProgress.value
      const tunnelZ = (ring.z + tunnelDepth.value) % 1
      const perspective = 1 / (0.3 + tunnelZ)
      const r = ring.radius * perspective * progress
      const rot = ring.rotation + time * 30 + tunnelDepth.value * 500

      ctx!.save()
      ctx!.translate(cx, cy)
      ctx!.rotate((rot * Math.PI) / 180)
      ctx!.globalAlpha = ring.alpha * progress * (1 - tunnelZ * 0.5)

      // Draw ring as polygon
      const sides = 6
      ctx!.beginPath()
      for (let s = 0; s <= sides; s++) {
        const a = (s / sides) * Math.PI * 2
        const px = Math.cos(a) * r
        const py = Math.sin(a) * r * 0.9
        s === 0 ? ctx!.moveTo(px, py) : ctx!.lineTo(px, py)
      }
      ctx!.closePath()
      ctx!.strokeStyle = scene.accentColor
      ctx!.lineWidth = 1.5 + (1 - tunnelZ) * 2
      ctx!.shadowColor = scene.accentColor
      ctx!.shadowBlur = 10 + (1 - tunnelZ) * 15
      ctx!.stroke()
      ctx!.restore()
    })
  }

  // Idle portal glow (breathing)
  if (!isTransitioning.value) {
    const glowR = 80 + Math.sin(time * 2) * 10
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR)
    grad.addColorStop(0, scene.accentColor + '30')
    grad.addColorStop(0.7, scene.accentColor + '10')
    grad.addColorStop(1, 'transparent')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(cx, cy, glowR, 0, Math.PI * 2)
    ctx.fill()

    // Center icon
    ctx.save()
    ctx.font = '48px serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.globalAlpha = 0.6 + Math.sin(time * 2) * 0.2
    ctx.fillText(scene.icon, cx, cy)
    ctx.restore()
  }

  // Particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.x += p.vx
    p.y += p.vy
    p.alpha -= 0.005
    if (p.alpha <= 0) { particles.splice(i, 1); continue }

    ctx!.save()
    ctx!.globalAlpha = p.alpha
    ctx!.beginPath()
    ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx!.fillStyle = p.color
    ctx!.shadowColor = p.color
    ctx!.shadowBlur = 8
    ctx!.fill()
    ctx!.restore()
  }

  // White flash overlay
  if (flash.value > 0) {
    ctx.save()
    ctx.globalAlpha = flash.value
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvasW, canvasH)
    ctx.restore()
  }

  // Scene info text
  ctx.save()
  ctx.globalAlpha = 1 - tunnelDepth.value
  ctx.fillStyle = '#e2e8f0'
  ctx.font = 'bold 28px "Microsoft YaHei", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(scene.title, cx, canvasH - 120)
  ctx.fillStyle = '#64748b'
  ctx.font = '14px "Microsoft YaHei", sans-serif'
  ctx.fillText(scene.subtitle, cx, canvasH - 90)
  ctx.restore()

  animFrame = requestAnimationFrame(render)
}

// ==================== 传送门穿越 ====================
function transitTo(targetIdx: number) {
  if (isTransitioning.value || targetIdx === currentScene.value) return
  isTransitioning.value = true

  const scene = scenes[currentScene.value]
  const nextScene = scenes[targetIdx]

  spawnParticles(40, scene.accentColor)

  const tl = gsap.timeline({
    onComplete: () => {
      currentScene.value = targetIdx
      isTransitioning.value = false
      tunnelDepth.value = 0
      portalProgress.value = 0
      spawnParticles(30, nextScene.accentColor)
    }
  })

  // Open portal
  tl.to(portalProgress, { value: 1, duration: 0.6, ease: 'power2.out' })
  // Travel through
  tl.to(tunnelDepth, { value: 1, duration: 0.8, ease: 'power2.in' }, '-=0.2')
  // Flash
  tl.to(flash, { value: 1, duration: 0.15 }, '-=0.15')
  // Scene switch happens in onComplete
  tl.to(flash, { value: 0, duration: 0.4, ease: 'power2.out' })
  tl.to(portalProgress, { value: 0, duration: 0.3 }, '-=0.2')
}

// ==================== 初始化 ====================
function initScene() {
  if (!canvasRef.value || !containerRef.value) return
  const dpr = window.devicePixelRatio || 1
  canvasW = containerRef.value.clientWidth
  canvasH = containerRef.value.clientHeight
  canvasRef.value.width = canvasW * dpr
  canvasRef.value.height = canvasH * dpr
  canvasRef.value.style.width = canvasW + 'px'
  canvasRef.value.style.height = canvasH + 'px'
  ctx = canvasRef.value.getContext('2d')
  if (ctx) ctx.scale(dpr, dpr)

  initRings()

  // Entrance: open and close portal briefly
  gsap.fromTo(portalProgress, { value: 0 }, { value: 0.6, duration: 1, ease: 'power2.out', yoyo: true, repeat: 0,
    onComplete: () => { gsap.to(portalProgress, { value: 0, duration: 0.5 }) }
  })

  render()
}

function handleResize() {
  cancelAnimationFrame(animFrame)
  initScene()
}

onMounted(() => {
  initScene()
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  cancelAnimationFrame(animFrame)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="portal-transition" ref="containerRef">
    <div class="title-bar">
      <h2>🌀 传送门转场</h2>
      <p>点击场景按钮触发穿越动画</p>
    </div>

    <canvas ref="canvasRef" />

    <!-- Scene nav buttons -->
    <div class="scene-nav">
      <button
        v-for="(s, i) in scenes"
        :key="s.id"
        class="scene-btn"
        :class="{ active: currentScene === i }"
        :style="{ '--accent': s.accentColor } as any"
        :disabled="isTransitioning"
        @click="transitTo(i)"
      >
        <span class="scene-icon">{{ s.icon }}</span>
        <span class="scene-label">{{ s.title }}</span>
      </button>
    </div>

    <!-- Click hint -->
    <div class="hint" v-if="!isTransitioning">
      点击其他场景卡片开启传送门 →
    </div>
  </div>
</template>

<style scoped>
.portal-transition {
  width: 100vw; height: 100vh; background: #0a1628;
  position: relative; overflow: hidden; font-family: 'Microsoft YaHei', sans-serif;
}
canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }

.title-bar {
  position: absolute; top: 24px; left: 50%; transform: translateX(-50%);
  text-align: center; z-index: 10; pointer-events: none;
}
.title-bar h2 { color: #e2e8f0; font-size: 22px; margin: 0; }
.title-bar p { color: #64748b; font-size: 13px; margin: 6px 0 0; }

.scene-nav {
  position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 12px; z-index: 10;
}
.scene-btn {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 12px 20px; background: rgba(10, 20, 40, 0.8);
  border: 1.5px solid #1e293b; border-radius: 10px;
  cursor: pointer; transition: all 0.3s; color: #94a3b8; min-width: 100px;
}
.scene-btn:hover:not(:disabled) { border-color: var(--accent); color: #e2e8f0; transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
.scene-btn.active { border-color: var(--accent); color: #e2e8f0; background: rgba(59,130,246,0.1); }
.scene-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.scene-icon { font-size: 24px; }
.scene-label { font-size: 11px; }

.hint {
  position: absolute; bottom: 110px; left: 50%; transform: translateX(-50%);
  color: #475569; font-size: 12px; z-index: 10;
}
</style>

