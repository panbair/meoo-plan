<template>
  <section ref="containerRef" class="caustics-section">
    <canvas ref="canvasRef" class="caustics-canvas"></canvas>
    <div class="caustics-overlay"></div>
    <div ref="headerRef" class="caustics-header">
      <div ref="badgeRef" class="caustics-badge">
        <span class="badge-icon">🌊</span>
        <span class="badge-text">WATER REFRACTION</span>
      </div>
      <h1 ref="titleRef" class="caustics-title">CAUSTICS</h1>
      <p ref="subtitleRef" class="caustics-subtitle">焦散光纹 · 水面折射 · 光影流动</p>
    </div>
    <div ref="cardsAreaRef" class="cards-area">
      <div v-for="(card, i) in cards" :key="i"
        :ref="el => cardRefs[i] = el as HTMLElement"
        class="caustic-card">
        <div class="card-water-overlay"></div>
        <div class="card-inner">
          <div class="card-icon">{{ card.icon }}</div>
          <span class="card-index">{{ String(i + 1).padStart(2, '0') }}</span>
          <h3 class="card-title">{{ card.title }}</h3>
          <p class="card-desc">{{ card.desc }}</p>
          <div class="card-depth">
            <span class="depth-label">深度</span>
            <span class="depth-value">{{ card.depth }}m</span>
          </div>
        </div>
        <div class="card-ripple"></div>
      </div>
    </div>
    <div ref="footerRef" class="caustics-footer">
      <div class="water-level">
        <div class="water-fill"></div>
      </div>
      <span class="footer-text">LIGHT THROUGH WATER</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const containerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const cardsAreaRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const cardRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: (() => void)[] = []
let animId = 0

const cards = [
  { icon: '🐠', title: 'Shallow', desc: '浅水区焦散', depth: 2 },
  { icon: '🐙', title: 'Medium', desc: '中层水域', depth: 8 },
  { icon: '🐋', title: 'Deep', desc: '深海区域', depth: 20 },
  { icon: '🪸', title: 'Reef', desc: '珊瑚礁光影', depth: 5 },
  { icon: '⚓', title: 'Abyss', desc: '深渊微光', depth: 50 },
  { icon: '🌊', title: 'Surface', desc: '水面波纹', depth: 0.5 },
]

// Canvas caustics rendering
const renderCaustics = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  let time = 0

  const draw = () => {
    time += 0.008
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const w = canvas.width, h = canvas.height
    const imageData = ctx.createImageData(w, h)
    const data = imageData.data
    const step = 4 // sample every 4px for performance

    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const nx = x / w * 6
        const ny = y / h * 6
        // Multi-layer caustic pattern
        const v1 = Math.sin(nx * 3 + time * 1.3) * Math.cos(ny * 2.5 + time * 0.9)
        const v2 = Math.sin(nx * 1.8 + ny * 2.2 + time * 1.1)
        const v3 = Math.cos(nx * 2.3 - time * 0.7) * Math.sin(ny * 3.1 + time * 1.5)
        const v = (v1 + v2 + v3) / 3
        const brightness = Math.max(0, v) * 0.35

        // Fill the step×step block
        for (let dy = 0; dy < step && y + dy < h; dy++) {
          for (let dx = 0; dx < step && x + dx < w; dx++) {
            const idx = ((y + dy) * w + (x + dx)) * 4
            data[idx] = Math.floor(brightness * 80)      // R
            data[idx + 1] = Math.floor(brightness * 200)  // G
            data[idx + 2] = Math.floor(brightness * 255)  // B
            data[idx + 3] = Math.floor(brightness * 255)  // A
          }
        }
      }
    }
    ctx.putImageData(imageData, 0, 0)
    // Soften with blur
    ctx.filter = 'blur(8px)'
    ctx.globalAlpha = 0.6
    ctx.drawImage(canvas, 0, 0)
    ctx.filter = 'none'
    ctx.globalAlpha = 1
    animId = requestAnimationFrame(draw)
  }
  draw()
}

onMounted(() => {
  if (!containerRef.value) return

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -30, filter: 'blur(10px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 20 })
  const allCards = cardRefs.value.filter(Boolean) as HTMLElement[]
  gsap.set(allCards, { opacity: 0, y: 50, scale: 0.8 })

  const introTl = gsap.timeline({
    scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' }
  })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power3.out'
  })
  .to(allCards, {
    opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.3)'
  }, '-=0.3')
  .to(footerRef.value, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
  cleanupFns.push(() => introTl.kill())

  // Start caustics on scroll
  ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 80%',
    onEnter: renderCaustics,
    once: true
  })

  // Card float
  allCards.forEach((card, i) => {
    const tw = gsap.to(card, {
      y: `+=${5 + i * 2}`, duration: 2.5 + i * 0.3,
      repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.2
    })
    cleanupFns.push(() => tw.kill())
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
  cancelAnimationFrame(animId)
})
</script>

<style scoped lang="scss">
.caustics-section {
  width: 100vw; height: 100vh;
  background: linear-gradient(180deg, #020810 0%, #051520 40%, #03101a 100%);
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.caustics-canvas {
  position: absolute; inset: 0; width: 100%; height: 100%;
  pointer-events: none; mix-blend-mode: screen; opacity: 0.7;
}
.caustics-overlay {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse at 50% 30%, transparent 40%, rgba(2,8,16,0.6) 100%);
}
.caustics-header {
  position: relative; z-index: 10; text-align: center; margin-bottom: 50px;
  .caustics-badge {
    display: inline-flex; align-items: center; gap: 8px; padding: 10px 28px;
    border-radius: 40px; border: 1px solid rgba(0,180,220,0.2);
    background: rgba(0,180,220,0.05); backdrop-filter: blur(10px); margin-bottom: 12px;
    font-size: 11px; letter-spacing: 5px; color: rgba(100,220,255,0.7);
    .badge-icon { font-size: 14px; }
  }
  .caustics-title {
    font-size: clamp(48px, 7vw, 80px); font-weight: 800; letter-spacing: 8px;
    background: linear-gradient(135deg, #00b8d4, #40e0ff, #0090a0);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 8px; filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.2));
  }
  .caustics-subtitle { font-size: 16px; color: rgba(100,200,220,0.5); letter-spacing: 6px; margin: 0; }
}
.cards-area {
  position: relative; z-index: 10;
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 16px; max-width: 700px; width: 90%;
}
.caustic-card {
  position: relative; border-radius: 24px; overflow: hidden;
  .card-water-overlay {
    position: absolute; inset: 0; z-index: 3; pointer-events: none;
    background: linear-gradient(180deg,
      rgba(0,180,255,0.03) 0%,
      rgba(0,200,255,0.06) 30%,
      rgba(0,180,255,0.03) 60%,
      transparent 100%);
    animation: waterShimmer 4s ease-in-out infinite;
  }
  .card-inner {
    position: relative; z-index: 2; padding: 24px 20px; border-radius: 24px;
    background: linear-gradient(145deg, rgba(5,20,30,0.9), rgba(3,15,25,0.95));
    border: 1px solid rgba(0,180,220,0.1);
    .card-icon { font-size: 24px; margin-bottom: 8px; }
    .card-index { font-size: 8px; color: rgba(100,200,220,0.3); letter-spacing: 2px; }
    .card-title { font-size: 20px; font-weight: 700; color: #fff; margin: 4px 0; }
    .card-desc { font-size: 10px; color: rgba(120,200,220,0.5); margin: 0 0 8px; }
    .card-depth {
      display: flex; gap: 6px; align-items: center;
      .depth-label { font-size: 9px; color: rgba(100,180,200,0.4); }
      .depth-value { font-size: 12px; font-weight: 700; color: rgba(0,200,220,0.7); font-family: 'Courier New', monospace; }
    }
  }
  .card-ripple {
    position: absolute; inset: -10px; border-radius: 20px;
    border: 1px solid rgba(0,200,255,0.05);
    animation: rippleExpand 3s ease-out infinite;
  }
  &:hover .card-inner {
    border-color: rgba(0,200,220,0.25);
    box-shadow: 0 0 25px rgba(0,200,220,0.1);
  }
}
@keyframes waterShimmer {
  0%, 100% { opacity: 0.5; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-3px); }
}
@keyframes rippleExpand {
  0% { transform: scale(0.95); opacity: 0.3; }
  100% { transform: scale(1.05); opacity: 0; }
}
.caustics-footer {
  position: relative; z-index: 10; margin-top: 50px; text-align: center;
  .water-level {
    width: 150px; height: 3px; margin: 0 auto 10px; border-radius: 2px;
    background: rgba(0,180,220,0.1); overflow: hidden;
    .water-fill {
      width: 60%; height: 100%; border-radius: 2px;
      background: linear-gradient(90deg, rgba(0,180,220,0.3), rgba(0,220,255,0.6));
      animation: waterFill 3s ease-in-out infinite alternate;
    }
  }
  .footer-text { font-size: 14px; letter-spacing: 3px; color: rgba(100,200,220,0.3); }
}
@keyframes waterFill {
  0% { width: 40%; } 100% { width: 80%; }
}
</style>

