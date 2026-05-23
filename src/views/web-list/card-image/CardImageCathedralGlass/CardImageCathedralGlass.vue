<template>
  <section ref="sectionRef" class="cathedral-section">
    <!-- 教堂暗色背景 + 光束 -->
    <div class="church-ambient">
      <div class="church-grad"></div>
      <div class="light-beams"></div>
    </div>

    <!-- 玻璃碎片容器 -->
    <div ref="glassContainerRef" class="glass-container">
      <!-- 鬼影底图（碎片散落时可见，拼合后淡出） -->
      <img ref="ghostImageRef" :src="imageUrl" alt="" class="ghost-image" />
      <!-- 每块玻璃碎片（Voronoi 多边形） -->
      <div
        v-for="(frag, idx) in fragments"
        :key="idx"
        :ref="el => { if (el) fragmentRefs[idx] = el as HTMLElement }"
        class="glass-piece"
        :style="pieceStyle(frag)"
      >
        <!-- 铅框底层（略大一圈，黑色填充，drop-shadow 跟 clip-path） -->
        <div class="lead-frame" :style="leadFrameStyle(frag)">
          <!-- 铅框焊点 -->
          <div
            v-for="(v, vi) in frag.vertices.slice(0, 6)"
            :key="'joint'+vi"
            class="lead-joint"
            :style="jointStyle(frag, vi)"
          />
        </div>
        <!-- 玻璃本体（clip-path 切出多边形，图像背景） -->
        <div class="glass-body" :style="bodyStyle(frag)" />
        <!-- 玻璃表面微光 -->
        <div class="glass-sheen" :style="bodyStyle(frag)" />
      </div>
    </div>

    <!-- 玫瑰花窗圆形边框 -->
    <div ref="roseFrameRef" class="rose-window-frame">
      <svg viewBox="0 0 400 400" class="rose-frame-svg">
        <!-- 外圈石雕 -->
        <circle cx="200" cy="200" r="195" fill="none" stroke="#2a2520" stroke-width="18" opacity="0.85" />
        <circle cx="200" cy="200" r="204" fill="none" stroke="#3a3530" stroke-width="3" opacity="0.5" />
        <!-- 内圈 -->
        <circle cx="200" cy="200" r="188" fill="none" stroke="#1a1816" stroke-width="5" opacity="0.8" />
        <!-- 装饰性哥特拱 -->
        <g opacity="0.25">
          <path
            v-for="p in 12"
            :key="'petal'+p"
            :d="getPetalPath(p)"
            fill="none"
            stroke="#5a5550"
            stroke-width="1.2"
          />
        </g>
      </svg>
    </div>

    <!-- 穿透光线（拼合完成后渐亮） -->
    <div ref="lightRaysRef" class="light-penetrate">
      <div class="ray-core"></div>
      <div class="ray-aura"></div>
      <div class="ray-beams">
        <div v-for="b in 8" :key="'beam'+b" class="ray-beam" :style="beamStyle(b)" />
      </div>
    </div>

    <!-- 浮尘粒子（在光束中飞舞） -->
    <div ref="dustParticlesRef" class="dust-field">
      <div v-for="d in 20" :key="'dust'+d" class="dust-mote" :style="dustStyle(d)" />
    </div>

    <!-- 文字覆盖层 -->
    <div ref="contentRef" class="content-overlay">
      <h2 class="title">Cathedral Glass</h2>
      <p class="subtitle">Stained Glass · Voronoi Mosaic</p>
      <div class="divider"></div>
      <p class="desc">哥特花窗 · 铅框分割 · 光照穿透 · 拼图重组</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const imageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'

// ==================== Refs ====================
const sectionRef = ref<HTMLElement | null>(null)
const glassContainerRef = ref<HTMLElement | null>(null)
const ghostImageRef = ref<HTMLImageElement | null>(null)
const roseFrameRef = ref<HTMLElement | null>(null)
const lightRaysRef = ref<HTMLElement | null>(null)
const dustParticlesRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const fragmentRefs = ref<HTMLElement[]>([])

// ==================== Voronoi 计算 ====================
interface Point { x: number; y: number }
interface FragmentData {
  seed: Point
  vertices: Point[]       // 归一化坐标 (0~1)，相对于容器
  scatterX: number        // 飞入起始偏移 X (px)
  scatterY: number        // 飞入起始偏移 Y (px)
  scatterRot: number      // 飞入起始旋转角度
  scatterScale: number    // 飞入起始缩放
}

/** 生成玫瑰花窗风格的种子点（中心密集 + 同心环 + 边缘填充） */
function generateRoseSeeds(count: number): Point[] {
  const seeds: Point[] = []
  const rng = seededRandom(0xCA7ED0)

  // 中心簇（5 个点）
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + rng() * 0.25
    const r = 0.03 + rng() * 0.07
    seeds.push({ x: 0.5 + Math.cos(a) * r, y: 0.5 + Math.sin(a) * r })
  }
  // 内环（6 个点，半径~0.15）
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + rng() * 0.3
    const r = 0.12 + rng() * 0.07
    seeds.push({ x: 0.5 + Math.cos(a) * r, y: 0.5 + Math.sin(a) * r })
  }
  // 中环（7 个点，半径~0.24）
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + rng() * 0.35
    const r = 0.22 + rng() * 0.08
    seeds.push({ x: 0.5 + Math.cos(a) * r, y: 0.5 + Math.sin(a) * r })
  }
  // 外环 + 角落补点
  const remaining = count - seeds.length
  for (let i = 0; i < remaining; i++) {
    if (i < 5) {
      const a = (i / 5) * Math.PI * 2 + rng() * 0.4
      const r = 0.35 + rng() * 0.1
      seeds.push({ x: 0.5 + Math.cos(a) * r, y: 0.5 + Math.sin(a) * r })
    } else {
      seeds.push({ x: 0.02 + rng() * 0.96, y: 0.02 + rng() * 0.96 })
    }
  }
  return seeds
}

function seededRandom(seed: number): () => number {
  let s = seed
  return () => { s = (s * 16807) % 2147483647; return s / 2147483646 }
}

/** Sutherland-Hodgman 多边形裁剪（对一条半平面线） */
function clipPolygon(poly: Point[], mx: number, my: number, dx: number, dy: number, threshold: number): Point[] {
  if (poly.length < 3) return poly
  const result: Point[] = []
  for (let i = 0; i < poly.length; i++) {
    const cur = poly[i]
    const nxt = poly[(i + 1) % poly.length]
    const cVal = dx * cur.x + dy * cur.y
    const nVal = dx * nxt.x + dy * nxt.y
    const cIn = cVal <= threshold
    const nIn = nVal <= threshold
    if (cIn) result.push({ x: cur.x, y: cur.y })
    if (cIn !== nIn) {
      const t = (threshold - cVal) / (nVal - cVal)
      result.push({ x: cur.x + t * (nxt.x - cur.x), y: cur.y + t * (nxt.y - cur.y) })
    }
  }
  return result
}

/** 对单个种子点计算 Voronoi 单元（半平面交） */
function computeCell(center: Point, allSeeds: Point[], width: number, height: number): Point[] {
  // 归一化 bounding box
  let poly: Point[] = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
  ]
  for (const other of allSeeds) {
    if (other === center) continue
    // 垂直平分线：过中点 M，法向量指向 center
    const mx = (center.x + other.x) / 2
    const my = (center.y + other.y) / 2
    const dx = other.x - center.x   // 法向分量
    const dy = other.y - center.y
    // 约束：dx*Px + dy*Py <= dx*mx + dy*my（center 侧）
    const threshold = dx * mx + dy * my
    poly = clipPolygon(poly, mx, my, dx, dy, threshold)
    if (poly.length < 3) break
  }
  // 转换回像素坐标
  return poly.map(p => ({ x: p.x * width, y: p.y * height }))
}

/** 主 Voronoi 计算入口 */
function computeAllFragments(seeds: Point[], width: number, height: number): FragmentData[] {
  const rng = seededRandom(0xBEA0F0)
  const results: FragmentData[] = []
  for (const seed of seeds) {
    const vertices = computeCell(seed, seeds, width, height)
    const angle = rng() * Math.PI * 2
    const dist = 200 + rng() * 350
    // 决定飞入方向：外圈从外向内飞，中心从上方掉下来
    const cx = seed.x - 0.5
    const cy = seed.y - 0.5
    const radial = Math.sqrt(cx * cx + cy * cy)
    if (radial < 0.12) {
      // 中心点：从上方掉落
      results.push({
        seed,
        vertices,
        scatterX: (rng() - 0.5) * 120,
        scatterY: -250 - rng() * 180,
        scatterRot: (rng() - 0.5) * 20,
        scatterScale: 0.2 + rng() * 0.3,
      })
    } else {
      // 外圈：沿径向方向飞出
      const dirX = cx / radial
      const dirY = cy / radial
      results.push({
        seed,
        vertices,
        scatterX: dirX * dist + (rng() - 0.5) * 100,
        scatterY: dirY * dist + (rng() - 0.5) * 100,
        scatterRot: (rng() - 0.5) * 60,
        scatterScale: 0.25 + rng() * 0.35,
      })
    }
  }
  return results
}

// ==================== 初始化 ====================
const seeds = generateRoseSeeds(25)
const fragments = ref<FragmentData[]>([])

// ==================== 样式计算 ====================
function pieceStyle(frag: FragmentData) {
  const pts = frag.vertices.map(v => `${v.x.toFixed(1)}px ${v.y.toFixed(1)}px`).join(', ')
  return { clipPath: `polygon(${pts})` }
}

function leadFrameStyle(frag: FragmentData) {
  // 铅框比玻璃本体略大 3px，产生铅条效果
  const margin = 3
  const pts = frag.vertices
    .map(v => `${(v.x - margin).toFixed(1)}px ${(v.y - margin).toFixed(1)}px`)
    .join(', ')
  return { clipPath: `polygon(${pts})` }
}

function bodyStyle(frag: FragmentData) {
  const pts = frag.vertices.map(v => `${v.x.toFixed(1)}px ${v.y.toFixed(1)}px`).join(', ')
  return { clipPath: `polygon(${pts})` }
}

function jointStyle(frag: FragmentData, idx: number) {
  const v = frag.vertices[idx % frag.vertices.length]
  return { left: `${v.x}px`, top: `${v.y}px` }
}

function beamStyle(idx: number) {
  const deg = (idx / 8) * 360 + 15
  return { transform: `rotate(${deg}deg)` }
}

function dustStyle(idx: number) {
  const rng = seededRandom(0xD057 + idx)
  return {
    left: `${10 + rng() * 80}%`,
    top: `${5 + rng() * 90}%`,
    animationDelay: `${rng() * 6}s`,
    animationDuration: `${4 + rng() * 8}s`,
    width: `${1.5 + rng() * 3}px`,
    height: `${1.5 + rng() * 3}px`,
  }
}

// ==================== SVG 花瓣路径 ====================
function getPetalPath(idx: number): string {
  const cx = 200, cy = 200
  const a0 = (idx / 12) * Math.PI * 2
  const a1 = a0 + Math.PI * 2 / 12
  const r1 = 50, r2 = 185
  const x1 = cx + Math.cos(a0) * r1, y1 = cy + Math.sin(a0) * r1
  const x2 = cx + Math.cos(a1) * r1, y2 = cy + Math.sin(a1) * r1
  const x3 = cx + Math.cos(a1) * r2, y3 = cy + Math.sin(a1) * r2
  const x4 = cx + Math.cos(a0) * r2, y4 = cy + Math.sin(a0) * r2
  // 哥特拱：顶部尖拱形状
  const am = (a0 + a1) / 2
  const xm = cx + Math.cos(am) * r2, ym = cy + Math.sin(am) * r2
  return `M${x1.toFixed(0)} ${y1.toFixed(0)} Q${xm.toFixed(0)} ${(ym - 40).toFixed(0)} ${x4.toFixed(0)} ${y4.toFixed(0)}`
}

// ==================== GSAP 动画 ====================
onMounted(() => {
  if (!sectionRef.value || !glassContainerRef.value) return

  const container = glassContainerRef.value
  const cw = container.offsetWidth
  const ch = container.offsetHeight

  // 计算所有碎片
  const frags = computeAllFragments(seeds, cw, ch)
  fragments.value = frags

  // 等到 Vue 渲染完 fragmentRefs
  requestAnimationFrame(() => {
    startAnimations()
  })

  function startAnimations() {
    const fragEls = fragmentRefs.value.filter(Boolean)

    // 初始状态：碎片散落各处
    fragEls.forEach((el, i) => {
      if (!el || i >= frags.length) return
      const f = frags[i]
      gsap.set(el, {
        x: f.scatterX,
        y: f.scatterY,
        rotation: f.scatterRot,
        scale: f.scatterScale,
        filter: 'brightness(0.7) saturate(0.8)',
      })
    })

    // ========== 飞入时间线 ==========
    const assembleTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value!,
        start: 'top 72%',
        end: 'bottom 22%',
        scrub: 1.2,
      },
    })

    fragEls.forEach((el, i) => {
      if (!el || i >= frags.length) return
      const pos = i * 0.04 // stagger 0.04s
      assembleTl.to(
        el,
        {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          filter: 'brightness(1) saturate(1)',
          duration: 0.45,
          ease: 'back.out(1.8)',
        },
        pos,
      )
    })
    cleanupFns.push(() => { assembleTl.scrollTrigger?.kill(); assembleTl.kill() })

    // ========== 鬼影底图淡出（碎片拼合越多，鬼影越淡） ==========
    if (ghostImageRef.value) gsap.set(ghostImageRef.value, { opacity: 1 })
    if (ghostImageRef.value && sectionRef.value) {
      const ghostTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 72%',
          end: 'bottom 32%',
          scrub: 1.2,
        },
      })
      ghostTl.to(ghostImageRef.value, { opacity: 0, duration: 1 })
      cleanupFns.push(() => { ghostTl.scrollTrigger?.kill(); ghostTl.kill() })
    }

    // ========== 铅框渐显 ==========
    if (sectionRef.value) {
      const leadTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 65%',
          end: 'bottom 18%',
          scrub: 1.0,
        },
      })
      leadTl.fromTo(
        '.lead-frame',
        { filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))' },
        {
          filter:
            'drop-shadow(1.5px 0 0 #0d0d0d) drop-shadow(-1.5px 0 0 #0d0d0d) ' +
            'drop-shadow(0 1.5px 0 #0d0d0d) drop-shadow(0 -1.5px 0 #0d0d0d) ' +
            'drop-shadow(0 0 3px rgba(0,0,0,0.7))',
          duration: 1,
        },
        0.5,
      )
      cleanupFns.push(() => { leadTl.scrollTrigger?.kill(); leadTl.kill() })
    }

    // ========== 玫瑰花窗边框渐显 ==========
    if (roseFrameRef.value) gsap.set(roseFrameRef.value, { opacity: 0, scale: 0.92 })
    if (roseFrameRef.value && sectionRef.value) {
      const frameTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 60%',
          end: 'top 30%',
          scrub: 1.0,
        },
      })
      frameTl.to(roseFrameRef.value, { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' })
      cleanupFns.push(() => { frameTl.scrollTrigger?.kill(); frameTl.kill() })
    }

    // ========== 光照穿透（拼合完成后） ==========
    if (lightRaysRef.value) gsap.set(lightRaysRef.value, { opacity: 0 })
    if (lightRaysRef.value && sectionRef.value) {
      const lightTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 48%',
          end: 'top 15%',
          scrub: 1.2,
        },
      })
      lightTl.to(lightRaysRef.value, { opacity: 1, duration: 1, ease: 'power2.in' })
      cleanupFns.push(() => { lightTl.scrollTrigger?.kill(); lightTl.kill() })
    }

    // ========== 玻璃加亮（光照穿透效果） ==========
    if (sectionRef.value) {
      const glassGlowTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 45%',
          end: 'top 12%',
          scrub: 1.2,
        },
      })
      fragEls.forEach((el, i) => {
        if (!el || i >= frags.length) return
        glassGlowTl.to(
          el,
          { filter: 'brightness(1.3) saturate(1.15)', duration: 0.6 },
          i * 0.02,
        )
      })
      cleanupFns.push(() => { glassGlowTl.scrollTrigger?.kill(); glassGlowTl.kill() })
    }

    // ========== 浮尘粒子 ==========
    if (dustParticlesRef.value) gsap.set(dustParticlesRef.value, { opacity: 0 })
    if (dustParticlesRef.value && sectionRef.value) {
      const dustTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 42%',
          end: 'top 10%',
          scrub: 1.0,
        },
      })
      dustTl.to(dustParticlesRef.value, { opacity: 1, duration: 1 })
      cleanupFns.push(() => { dustTl.scrollTrigger?.kill(); dustTl.kill() })
    }

    // ========== 文字渐显 ==========
    if (contentRef.value) gsap.set(contentRef.value, { opacity: 0, y: 30 })
    if (contentRef.value && sectionRef.value) {
      const textTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 55%',
          end: 'top 18%',
          scrub: 1.0,
        },
      })
      textTl.to(contentRef.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
      cleanupFns.push(() => { textTl.scrollTrigger?.kill(); textTl.kill() })
    }
  }
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style lang="scss" scoped>
/* ==================== 容器 ==================== */
.cathedral-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0d0b0a;
}

/* ==================== 教堂背景 ==================== */
.church-ambient {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.church-grad {
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse 60% 70% at 50% 30%, #1a1612 0%, #0f0d0b 50%, #070605 100%);
}

.light-beams {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 55% at 50% 35%, rgba(180, 160, 120, 0.06) 0%, transparent 65%),
    radial-gradient(ellipse 35% 40% at 50% 38%, rgba(220, 200, 140, 0.04) 0%, transparent 60%);
}

/* ==================== 玻璃碎片容器 ==================== */
.glass-container {
  position: absolute;
  // 居中于画布，留空间给飞入动画
  top: 50%;
  left: 50%;
  width: min(68vmin, 640px);
  height: min(68vmin, 640px);
  transform: translate(-50%, -50%);
  z-index: 3;
}

/* 鬼影底图：碎片散落时的参考图像 */
.ghost-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.22;
  filter: brightness(0.6) sepia(0.3) blur(1.5px);
  z-index: 0;
  pointer-events: none;
  will-change: opacity;
}

/* ==================== 每块玻璃碎片 ==================== */
.glass-piece {
  position: absolute;
  inset: 0;
  will-change: transform, filter, clip-path;
}

/* 铅框层（黑色底，略大一圈，drop-shadow 跟 clip-path 形状走） */
.lead-frame {
  position: absolute;
  inset: -3px; // 比玻璃大 3px，形成铅条包边
  background: #0e0e0e;
  // 初始无阴影（动画会添加）
  z-index: 2;
}

/* 铅框焊点（模拟铅条交叉处的圆形焊接点） */
.lead-joint {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #1a1a1a;
  transform: translate(-50%, -50%);
  z-index: 3;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}

/* 玻璃本体（clip-path 切割，图像背景） */
.glass-body {
  position: absolute;
  inset: 0;
  background-image: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80');
  background-size: cover;
  background-position: center;
  z-index: 1;
}

/* 玻璃表面微光（模拟玻璃反光） */
.glass-sheen {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 25%),
    linear-gradient(225deg, transparent 60%, rgba(255,250,235,0.06) 100%);
  z-index: 4;
  pointer-events: none;
}

/* ==================== 玫瑰花窗边框 ==================== */
.rose-window-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(72vmin, 680px);
  height: min(72vmin, 680px);
  transform: translate(-50%, -50%);
  z-index: 2;
  pointer-events: none;
  will-change: opacity, transform;

  .rose-frame-svg {
    width: 100%;
    height: 100%;
  }
}

/* ==================== 穿透光线 ==================== */
.light-penetrate {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(72vmin, 680px);
  height: min(72vmin, 680px);
  transform: translate(-50%, -50%);
  z-index: 4;
  pointer-events: none;

  .ray-core {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 50% 50% at 50% 45%, rgba(255, 215, 130, 0.18) 0%, transparent 60%),
      radial-gradient(circle 30% at 50% 50%, rgba(255, 235, 170, 0.12) 0%, transparent 50%);
  }

  .ray-aura {
    position: absolute;
    inset: -10%;
    background:
      radial-gradient(ellipse 55% 55% at 50% 48%, rgba(255, 200, 100, 0.08) 0%, transparent 55%);
  }

  .ray-beams {
    position: absolute;
    inset: 0;
    .ray-beam {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 2px;
      height: 50%;
      background: linear-gradient(
        to bottom,
        rgba(255, 215, 130, 0.3) 0%,
        rgba(255, 200, 100, 0.1) 40%,
        transparent 100%
      );
      transform-origin: top center;
      border-radius: 1px;
      filter: blur(1.5px);
    }
  }
}

/* ==================== 浮尘粒子 ==================== */
.dust-field {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(75vmin, 700px);
  height: min(75vmin, 700px);
  transform: translate(-50%, -50%);
  z-index: 5;
  pointer-events: none;

  .dust-mote {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 220, 160, 0.7);
    filter: blur(0.5px);
    animation: dustFloat linear infinite;
  }
}

@keyframes dustFloat {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 0;
  }
  15% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.5;
    transform: translate(-4px, -20px) scale(1.3);
  }
  85% {
    opacity: 0.15;
  }
  100% {
    transform: translate(6px, -35px) scale(0.7);
    opacity: 0;
  }
}

/* ==================== 文字覆盖层 ==================== */
.content-overlay {
  position: absolute;
  z-index: 20;
  bottom: 10%;
  right: 8%;
  text-align: right;
  pointer-events: none;
  will-change: opacity, transform;

  .title {
    margin: 0;
    font-family: 'Georgia', 'SimSun', 'Noto Serif SC', serif;
    font-size: clamp(28px, 4.2vmin, 50px);
    color: #d4ccbc;
    letter-spacing: 0.08em;
    text-shadow:
      0 0 8px rgba(200, 175, 110, 0.4),
      0 0 25px rgba(180, 150, 80, 0.2);
    line-height: 1.1;
  }

  .subtitle {
    margin: 6px 0 0;
    font-family: 'Georgia', 'SimSun', 'Noto Serif SC', serif;
    font-size: clamp(13px, 1.7vmin, 17px);
    color: #8a8278;
    letter-spacing: 0.12em;
    font-style: italic;
  }

  .divider {
    width: 50px;
    height: 1px;
    margin: 12px 0 12px auto;
    background: linear-gradient(270deg, rgba(180, 160, 120, 0.5), transparent 80%);
  }

  .desc {
    margin: 0;
    font-size: clamp(11px, 1.3vmin, 14px);
    color: #5a5550;
    letter-spacing: 0.08em;
  }
}

/* ==================== 响应式 ==================== */
@media (max-width: 768px) {
  .glass-container {
    width: 84vmin;
    height: 84vmin;
  }
  .rose-window-frame {
    width: 88vmin;
    height: 88vmin;
  }
  .light-penetrate {
    width: 88vmin;
    height: 88vmin;
  }
  .content-overlay {
    bottom: 8%;
    right: 5%;
  }
}

@media (max-width: 480px) {
  .content-overlay {
    bottom: 6%;
    right: 4%;
    text-align: center;
    .divider { margin: 10px auto; }
  }
}
</style>
