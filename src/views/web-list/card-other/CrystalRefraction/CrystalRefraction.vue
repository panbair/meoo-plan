<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

// ==================== 姘存櫠鍑犱綍 ====================
interface Vec2 { x: number; y: number }
interface Ray { origin: Vec2; dir: Vec2 }
interface Edge { a: Vec2; b: Vec2 }

// Crystal shape: hexagonal prism cross-section
function getCrystalVertices(cx: number, cy: number, size: number, rotation: number): Vec2[] {
  const verts: Vec2[] = []
  const sides = 6
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 + rotation
    // Elongate vertically
    const rx = size * 0.8
    const ry = size * 1.2
    verts.push({
      x: cx + Math.cos(angle) * rx,
      y: cy + Math.sin(angle) * ry,
    })
  }
  return verts
}

function getEdges(verts: Vec2[]): Edge[] {
  const edges: Edge[] = []
  for (let i = 0; i < verts.length; i++) {
    edges.push({ a: verts[i], b: verts[(i + 1) % verts.length] })
  }
  return edges
}

// ==================== 鍏夌嚎 - 绾挎鐩镐氦 ====================
function rayEdgeIntersect(ray: Ray, edge: Edge): { t: number; point: Vec2; normal: Vec2 } | null {
  const dx = edge.b.x - edge.a.x
  const dy = edge.b.y - edge.a.y
  const denom = ray.dir.x * dy - ray.dir.y * dx
  if (Math.abs(denom) < 1e-8) return null

  const t = ((edge.a.x - ray.origin.x) * dy - (edge.a.y - ray.origin.y) * dx) / denom
  const u = ((edge.a.x - ray.origin.x) * ray.dir.y - (edge.a.y - ray.origin.y) * ray.dir.x) / denom

  if (t < 0.001 || u < 0 || u > 1) return null

  const point = { x: ray.origin.x + ray.dir.x * t, y: ray.origin.y + ray.dir.y * t }
  // Normal (outward)
  const nx = -dy, ny = dx
  const len = Math.sqrt(nx * nx + ny * ny)
  let normal = { x: nx / len, y: ny / len }
  // Ensure normal points against ray direction
  if (normal.x * ray.dir.x + normal.y * ray.dir.y > 0) {
    normal = { x: -normal.x, y: -normal.y }
  }
  return { t, point, normal }
}

// ==================== 鎶樺皠 (Snell's law) ====================
function refract(dir: Vec2, normal: Vec2, eta: number): Vec2 | null {
  const dot = dir.x * normal.x + dir.y * normal.y
  const k = 1 - eta * eta * (1 - dot * dot)
  if (k < 0) return null // total internal reflection
  const sq = Math.sqrt(k)
  return {
    x: eta * dir.x - (eta * dot + sq) * normal.x,
    y: eta * dir.y - (eta * dot + sq) * normal.y,
  }
}

function reflect(dir: Vec2, normal: Vec2): Vec2 {
  const dot = 2 * (dir.x * normal.x + dir.y * normal.y)
  return { x: dir.x - dot * normal.x, y: dir.y - dot * normal.y }
}

function normalize(v: Vec2): Vec2 {
  const len = Math.sqrt(v.x * v.x + v.y * v.y)
  return len > 0 ? { x: v.x / len, y: v.y / len } : { x: 0, y: 0 }
}

// Fresnel reflectance (Schlick approximation)
function fresnel(cosI: number, eta: number): number {
  let r0 = ((1 - eta) / (1 + eta)) ** 2
  return r0 + (1 - r0) * (1 - Math.abs(cosI)) ** 5
}

// ==================== 鐘舵€?====================
const containerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let canvasW = 0
let canvasH = 0
let animFrame = 0
let time = 0
let lightAngle = -Math.PI / 4

const crystalRotation = ref(0)
const mouseX = ref(0)
const mouseY = ref(0)

// IOR for RGB channels (dispersion)
const IOR_R = 1.45
const IOR_G = 1.47
const IOR_B = 1.50

// ==================== 鍏夌嚎杩借釜 ====================
function traceRay(ray: Ray, edges: Edge[], ior: number, maxBounces: number, inside: boolean): Vec2[][] {
  const paths: Vec2[][] = [[{ ...ray.origin }]]
  let currentRay = { ...ray, dir: { ...ray.dir } }
  let isInside = inside

  for (let bounce = 0; bounce < maxBounces; bounce++) {
    let nearest: { t: number; point: Vec2; normal: Vec2 } | null = null

    for (const edge of edges) {
      const hit = rayEdgeIntersect(currentRay, edge)
      if (hit && (!nearest || hit.t < nearest.t)) {
        nearest = hit
      }
    }

    if (!nearest) {
      // Extend ray to edge of screen
      const ext = {
        x: currentRay.origin.x + currentRay.dir.x * 1000,
        y: currentRay.origin.y + currentRay.dir.y * 1000,
      }
      paths[paths.length - 1].push(ext)
      break
    }

    paths[paths.length - 1].push(nearest.point)

    const eta = isInside ? ior : 1 / ior
    const cosI = currentRay.dir.x * nearest.normal.x + currentRay.dir.y * nearest.normal.y
    const refl = fresnel(cosI, eta)

    const refracted = refract(currentRay.dir, nearest.normal, eta)

    if (refracted && Math.random() > refl * 0.5) {
      // Refract
      currentRay = { origin: nearest.point, dir: normalize(refracted) }
      isInside = !isInside
      paths.push([{ ...nearest.point }])
    } else {
      // Reflect
      const reflected = reflect(currentRay.dir, nearest.normal)
      currentRay = { origin: nearest.point, dir: normalize(reflected) }
      paths.push([{ ...nearest.point }])
    }
  }

  return paths
}

// ==================== 娓叉煋 ====================
function render() {
  if (!ctx) return
  time += 0.008
  crystalRotation.value = time * 0.3

  ctx.fillStyle = '#060810'
  ctx.fillRect(0, 0, canvasW, canvasH)

  const cx = canvasW / 2
  const cy = canvasH / 2
  const crystalSize = Math.min(canvasW, canvasH) * 0.18

  const verts = getCrystalVertices(cx, cy, crystalSize, crystalRotation.value)
  const edges = getEdges(verts)

  // Calculate light direction from mouse
  lightAngle = Math.atan2(mouseY.value - cy, mouseX.value - cx) + Math.PI

  // Draw background caustics (accumulated light)
  // Trace many rays
  const rayCount = 25
  const colors = [
    { ior: IOR_R, color: 'rgba(255, 60, 60, 0.12)', glow: '#ff3c3c' },
    { ior: IOR_G, color: 'rgba(60, 255, 60, 0.10)', glow: '#3cff3c' },
    { ior: IOR_B, color: 'rgba(60, 100, 255, 0.12)', glow: '#3c64ff' },
  ]

  const lightDist = Math.max(canvasW, canvasH) * 0.6
  const lightX = cx + Math.cos(lightAngle) * lightDist
  const lightY = cy + Math.sin(lightAngle) * lightDist
  const spread = 0.3

  colors.forEach(({ ior, color, glow }) => {
    for (let i = 0; i < rayCount; i++) {
      const angleOffset = (i - rayCount / 2) * (spread / rayCount)
      const dirAngle = lightAngle + Math.PI + angleOffset
      const dir = normalize({ x: Math.cos(dirAngle), y: Math.sin(dirAngle) })
      const origin = {
        x: lightX + (i - rayCount / 2) * Math.cos(lightAngle + Math.PI / 2) * 2,
        y: lightY + (i - rayCount / 2) * Math.sin(lightAngle + Math.PI / 2) * 2,
      }
      const ray: Ray = { origin, dir }
      const paths = traceRay(ray, edges, ior, 4, false)

      ctx!.save()
      ctx!.strokeStyle = color
      ctx!.lineWidth = 1.5
      ctx!.shadowColor = glow
      ctx!.shadowBlur = 6
      paths.forEach(segment => {
        if (segment.length < 2) return
        ctx!.beginPath()
        ctx!.moveTo(segment[0].x, segment[0].y)
        for (let j = 1; j < segment.length; j++) {
          ctx!.lineTo(segment[j].x, segment[j].y)
        }
        ctx!.stroke()
      })
      ctx!.restore()
    }
  })

  // Draw crystal body
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(verts[0].x, verts[0].y)
  for (let i = 1; i < verts.length; i++) ctx.lineTo(verts[i].x, verts[i].y)
  ctx.closePath()

  // Crystal fill - semi-transparent with gradient
  const grad = ctx.createLinearGradient(cx - crystalSize, cy - crystalSize, cx + crystalSize, cy + crystalSize)
  grad.addColorStop(0, 'rgba(180, 200, 255, 0.08)')
  grad.addColorStop(0.5, 'rgba(220, 230, 255, 0.12)')
  grad.addColorStop(1, 'rgba(180, 200, 255, 0.06)')
  ctx.fillStyle = grad
  ctx.fill()

  // Crystal edge glow
  ctx.strokeStyle = 'rgba(200, 220, 255, 0.5)'
  ctx.lineWidth = 1.5
  ctx.shadowColor = '#a0c0ff'
  ctx.shadowBlur = 15
  ctx.stroke()
  ctx.shadowBlur = 0

  // Fresnel highlights on edges facing light
  edges.forEach(edge => {
    const mx = (edge.a.x + edge.b.x) / 2
    const my = (edge.a.y + edge.b.y) / 2
    const nx = -(edge.b.y - edge.a.y)
    const ny = edge.b.x - edge.a.x
    const nLen = Math.sqrt(nx * nx + ny * ny)
    const ndx = nx / nLen, ndy = ny / nLen
    const ldx = Math.cos(lightAngle + Math.PI), ldy = Math.sin(lightAngle + Math.PI)
    const dot = ndx * ldx + ndy * ldy
    if (dot > 0.3) {
      ctx!.save()
      ctx!.globalAlpha = dot * 0.6
      ctx!.strokeStyle = '#ffffff'
      ctx!.lineWidth = 2 + dot * 3
      ctx!.shadowColor = '#ffffff'
      ctx!.shadowBlur = 12
      ctx!.beginPath()
      ctx!.moveTo(edge.a.x, edge.a.y)
      ctx!.lineTo(edge.b.x, edge.b.y)
      ctx!.stroke()
      ctx!.restore()
    }
  })
  ctx.restore()

  // Light source indicator
  ctx.save()
  ctx.beginPath()
  ctx.arc(lightX, lightY, 6, 0, Math.PI * 2)
  ctx.fillStyle = '#ffd700'
  ctx.shadowColor = '#ffd700'
  ctx.shadowBlur = 20
  ctx.fill()
  ctx.restore()

  animFrame = requestAnimationFrame(render)
}

// ==================== 浜や簰 ====================
function handleMouseMove(e: MouseEvent) {
  if (!containerRef.value) return
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

// ==================== 鍒濆鍖?====================
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

  mouseX.value = canvasW * 0.2
  mouseY.value = canvasH * 0.3

  render()
}

function handleResize() {
  cancelAnimationFrame(animFrame)
  initScene()
}

onMounted(() => {
  initScene()
  window.addEventListener('resize', handleResize)
  window.addEventListener('mousemove', handleMouseMove)
})
onUnmounted(() => {
  cancelAnimationFrame(animFrame)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <div class="crystal-refraction" ref="containerRef">
    <div class="title-bar">
      <h2>馃拵 姘存櫠鎶樺皠妫遍暅</h2>
      <p>绉诲姩榧犳爣鏀瑰彉鍏夋簮鏂瑰悜 路 RGB 鑹叉暎 路 Snell 瀹氬緥鎶樺皠</p>
    </div>

    <canvas ref="canvasRef" />

    <div class="info">
      <div class="info-item"><span class="dot" style="background:#ff3c3c"></span>R (IOR {{ IOR_R }})</div>
      <div class="info-item"><span class="dot" style="background:#3cff3c"></span>G (IOR {{ IOR_G }})</div>
      <div class="info-item"><span class="dot" style="background:#3c64ff"></span>B (IOR {{ IOR_B }})</div>
    </div>
  </div>
</template>

<style scoped>
.crystal-refraction {
  width: 100vw; height: 100vh; background: #060810;
  position: relative; overflow: hidden; font-family: 'Microsoft YaHei', sans-serif;
}
canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }

.title-bar {
  position: absolute; top: 24px; left: 50%; transform: translateX(-50%);
  text-align: center; z-index: 10; pointer-events: none;
}
.title-bar h2 { color: #e2e8f0; font-size: 22px; margin: 0; }
.title-bar p { color: #64748b; font-size: 13px; margin: 6px 0 0; }

.info {
  position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 20px; z-index: 10;
}
.info-item {
  display: flex; align-items: center; gap: 6px;
  color: #94a3b8; font-size: 12px;
}
.dot { width: 10px; height: 10px; border-radius: 50%; }
</style>