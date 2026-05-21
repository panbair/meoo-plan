<template>
  <section ref="containerRef" class="prism-split-section">
    <div class="prism-bg">
      <div class="bg-dark"></div>
      <div class="rainbow-ambient"></div>
    </div>
    <div ref="headerRef" class="prism-header">
      <div ref="badgeRef" class="prism-badge">
        <span class="badge-icon">🔺</span>
        <span class="badge-text">DISPERSION</span>
      </div>
      <h1 ref="titleRef" class="prism-title">PRISM SPLIT</h1>
      <p ref="subtitleRef" class="prism-subtitle">白光色散 · 一束光化为七色谱</p>
    </div>
    <div ref="stageRef" class="prism-stage">
      <!-- 入射白光 -->
      <div ref="whiteBeamRef" class="white-beam"></div>
      <!-- 棱镜 -->
      <div ref="prismRef" class="prism-body">
        <svg viewBox="0 0 120 140" class="prism-svg">
          <defs>
            <linearGradient id="prismGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="rgba(200,220,255,0.15)"/>
              <stop offset="50%" stop-color="rgba(255,255,255,0.08)"/>
              <stop offset="100%" stop-color="rgba(180,200,240,0.12)"/>
            </linearGradient>
          </defs>
          <polygon points="60,10 110,130 10,130" fill="url(#prismGrad)"
            stroke="rgba(200,220,255,0.4)" stroke-width="1.5"/>
          <polygon points="60,10 110,130 10,130" fill="none"
            stroke="rgba(255,255,255,0.1)" stroke-width="0.5" transform="translate(2,2)"/>
        </svg>
        <div class="prism-shine"></div>
      </div>
      <!-- 色散光束 -->
      <div ref="spectrumRef" class="spectrum-beams">
        <div v-for="(color, i) in spectrumColors" :key="'beam'+i"
          :ref="el => beamRefs[i] = el as HTMLElement"
          class="spectrum-beam"
          :style="{ '--beam-color': color.hex, '--beam-angle': color.angle + 'deg' }">
        </div>
      </div>
      <!-- 光谱卡片 -->
      <div class="spectrum-cards">
        <div v-for="(color, i) in spectrumColors" :key="'card'+i"
          :ref="el => cardRefs[i] = el as HTMLElement"
          class="spectrum-card"
          :style="{ '--card-color': color.hex, '--card-y': color.yOffset + 'px' }">
          <div class="card-glow"></div>
          <div class="card-inner">
            <div class="color-swatch" :style="{ background: color.hex }"></div>
            <span class="card-index">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="card-title">{{ color.name }}</h3>
            <p class="card-wavelength">{{ color.wavelength }}</p>
            <span class="card-tag">{{ color.tag }}</span>
          </div>
        </div>
      </div>
    </div>
    <div ref="footerRef" class="prism-footer">
      <div class="spectrum-bar">
        <span v-for="(c, i) in spectrumColors" :key="'bar'+i"
          class="bar-segment" :style="{ background: c.hex }"></span>
      </div>
      <span class="footer-text">VISIBLE LIGHT SPECTRUM</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const containerRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const whiteBeamRef = ref<HTMLElement | null>(null)
const prismRef = ref<HTMLElement | null>(null)
const spectrumRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const beamRefs = ref<(HTMLElement | null)[]>([])
const cardRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: (() => void)[] = []

const spectrumColors = [
  { name: 'Red', hex: '#ff2020', wavelength: '700nm', tag: 'LONG', angle: -18, yOffset: -150 },
  { name: 'Orange', hex: '#ff8c00', wavelength: '620nm', tag: 'WARM', angle: -12, yOffset: -100 },
  { name: 'Yellow', hex: '#ffd700', wavelength: '580nm', tag: 'BRIGHT', angle: -6, yOffset: -50 },
  { name: 'Green', hex: '#00cc44', wavelength: '530nm', tag: 'NATURE', angle: 0, yOffset: 0 },
  { name: 'Blue', hex: '#0088ff', wavelength: '470nm', tag: 'COOL', angle: 6, yOffset: 50 },
  { name: 'Indigo', hex: '#4400cc', wavelength: '420nm', tag: 'DEEP', angle: 12, yOffset: 100 },
  { name: 'Violet', hex: '#8800ff', wavelength: '380nm', tag: 'SHORT', angle: 18, yOffset: 150 },
]

onMounted(() => {
  if (!containerRef.value) return
  const allCards = cardRefs.value.filter(Boolean) as HTMLElement[]
  const allBeams = beamRefs.value.filter(Boolean) as HTMLElement[]

  // Initial states
  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -30, filter: 'blur(10px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 20 })
  gsap.set(whiteBeamRef.value, { scaleX: 0, transformOrigin: 'left center' })
  gsap.set(prismRef.value, { opacity: 0, scale: 0.5, rotation: -30 })
  gsap.set(allBeams, { scaleX: 0, opacity: 0, transformOrigin: 'left center' })
  gsap.set(allCards, { opacity: 0, scale: 0.3, x: -200 })

  // Header entry
  const introTl = gsap.timeline({
    scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' }
  })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power3.out'
  })
  .to(footerRef.value, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
  cleanupFns.push(() => introTl.kill())

  // Main dispersion timeline
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: stageRef.value,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.2,
      immediateRender: false
    }
  })

  // 1. White beam shoots in
  mainTl.to(whiteBeamRef.value, { scaleX: 1, duration: 0.25, ease: 'power2.out' })

  // 2. Prism appears
  mainTl.to(prismRef.value, {
    opacity: 1, scale: 1, rotation: 0, duration: 0.15, ease: 'back.out(1.5)'
  }, 0.15)

  // 3. Spectrum beams shoot out
  allBeams.forEach((beam, i) => {
    mainTl.to(beam, {
      scaleX: 1, opacity: 0.8, duration: 0.15, ease: 'power2.out'
    }, 0.3 + i * 0.02)
  })

  // 4. Cards materialize at beam endpoints
  allCards.forEach((card, i) => {
    mainTl.to(card, {
      opacity: 1, scale: 1, x: 0, duration: 0.15, ease: 'back.out(1.3)'
    }, 0.4 + i * 0.03)
  })

  cleanupFns.push(() => mainTl.kill())

  // Card float animation
  allCards.forEach((card, i) => {
    const tween = gsap.to(card, {
      y: `+=${6 + i * 1.5}`, duration: 2 + i * 0.2,
      repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.15
    })
    cleanupFns.push(() => tween.kill())
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.prism-split-section {
  width: 100vw; height: 100vh;
  background: 
    radial-gradient(circle at 30% 50%, rgba(40,30,60,0.35) 0%, transparent 60%),
    linear-gradient(135deg, #050508 0%, #08060f 50%, #050508 100%);
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.prism-bg {
  position: absolute; inset: 0; pointer-events: none;
  .bg-dark {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 30% 50%, rgba(40,30,60,0.3), transparent 60%);
  }
  .rainbow-ambient {
    position: absolute; top: 40%; right: 10%; width: 400px; height: 400px;
    background: conic-gradient(from 0deg, rgba(255,0,0,0.04), rgba(255,165,0,0.04),
      rgba(255,255,0,0.04), rgba(0,200,0,0.04), rgba(0,100,255,0.04),
      rgba(75,0,130,0.04), rgba(140,0,255,0.04), rgba(255,0,0,0.04));
    border-radius: 50%; filter: blur(60px);
  }
}
.prism-header {
  position: relative; z-index: 10; text-align: center; margin-bottom: 50px;
  .prism-badge {
    display: inline-flex; align-items: center; gap: 8px; padding: 12px 32px;
    border-radius: 50px; 
    border: 1px solid rgba(255,255,255,0.15);
    background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(235,235,255,0.03));
    backdrop-filter: blur(12px);
    box-shadow: 
      0 4px 20px rgba(255,255,255,0.08),
      inset 0 1px 0 rgba(255,255,255,0.08);
    margin-bottom: 16px;
    font-size: 11px; letter-spacing: 6px; 
    color: rgba(255,255,255,0.7);
    transition: all 0.3s ease;
    .badge-icon { 
      font-size: 16px;
      filter: drop-shadow(0 0 10px rgba(255,255,255,0.4));
    }
    &:hover {
      border-color: rgba(255,255,255,0.25);
      box-shadow: 0 6px 30px rgba(255,255,255,0.12);
      transform: translateY(-2px);
    }
  }
  .prism-title {
    font-size: clamp(52px, 7.5vw, 88px); 
    font-weight: 900; 
    letter-spacing: 10px;
    background: linear-gradient(90deg, #ff2020, #ff8c00, #ffd700, #00cc44, #0088ff, #4400cc, #8800ff);
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 12px;
    filter: drop-shadow(0 0 60px rgba(255,255,255,0.3));
    animation: prismGlow 3s ease-in-out infinite alternate;
  }
  .prism-subtitle { 
    font-size: 16px; 
    color: rgba(230,220,240,0.5);
    letter-spacing: 8px;
    font-weight: 300;
    margin: 0;
    text-shadow: 0 0 20px rgba(255,255,255,0.15);
  }
}
.prism-stage {
  position: relative; z-index: 10; width: 95%; max-width: 1100px; height: 420px;
}
.white-beam {
  position: absolute; left: 0; top: 50%; transform: translateY(-50%);
  width: 35%; height: 5px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), rgba(255,255,255,0.95));
  box-shadow: 
    0 0 20px rgba(255,255,255,0.4),
    0 0 40px rgba(255,255,255,0.15),
    0 0 60px rgba(255,255,255,0.08);
  border-radius: 3px;
}
.prism-body {
  position: absolute; left: 33%; top: 50%; transform: translate(-50%, -50%);
  width: 100px; height: 120px;
  .prism-svg { width: 100%; height: 100%; }
  .prism-shine {
    position: absolute; top: 20%; left: 30%; width: 35px; height: 35px;
    background: radial-gradient(circle, rgba(255,255,255,0.2), transparent 70%);
    border-radius: 50%;
    box-shadow: 0 0 15px rgba(255,255,255,0.15);
  }
}
.spectrum-beams {
  position: absolute; left: 38%; top: 50%; width: 25%;
  .spectrum-beam {
    position: absolute; left: 0; height: 4px; width: 100%;
    background: linear-gradient(90deg, var(--beam-color), transparent);
    transform: rotate(var(--beam-angle)); transform-origin: left center;
    box-shadow: 
      0 0 10px var(--beam-color),
      0 0 20px var(--beam-color);
    opacity: 0.7;
  }
}
.spectrum-cards {
  position: absolute; right: 2%; top: 50%; transform: translateY(-50%);
  display: flex; flex-direction: column; gap: 8px; align-items: flex-end;
}
.spectrum-card {
  position: relative; width: 150px;
  .card-glow {
    position: absolute; inset: -8px; border-radius: 26px;
    background: radial-gradient(ellipse, color-mix(in srgb, var(--card-color) 18%, transparent), transparent 70%);
    opacity: 0.6;
  }
  .card-inner {
    position: relative; z-index: 2; padding: 22px 20px; border-radius: 28px;
    background: linear-gradient(145deg, rgba(18,14,28,0.96), rgba(22,18,32,0.92));
    border: 1px solid color-mix(in srgb, var(--card-color) 25%, transparent);
    display: flex; flex-direction: column; gap: 3px;
    box-shadow: 
      0 4px 20px rgba(0,0,0,0.3),
      inset 0 1px 0 rgba(255,255,255,0.06);
    transition: all 0.3s ease;
    .color-swatch {
      width: 100%; height: 4px; border-radius: 2px; margin-bottom: 5px;
      box-shadow: 0 0 10px var(--card-color);
    }
    .card-index { 
      font-size: 9px; 
      color: rgba(255,255,255,0.35); 
      letter-spacing: 2px;
      font-weight: 600;
    }
    .card-title { 
      font-size: 21px; 
      font-weight: 800; 
      color: var(--card-color); 
      margin: 0;
      text-shadow: 0 0 15px color-mix(in srgb, var(--card-color) 40%, transparent);
    }
    .card-wavelength { 
      font-size: 11px; 
      color: rgba(230,220,240,0.5);
      margin: 0; 
      font-family: 'Courier New', monospace;
      font-weight: 500;
    }
    .card-tag {
      font-size: 8px; letter-spacing: 3px; padding: 2px 8px; border-radius: 8px; align-self: flex-start;
      background: color-mix(in srgb, var(--card-color) 12%, transparent);
      color: color-mix(in srgb, var(--card-color) 65%, white);
      border: 1px solid color-mix(in srgb, var(--card-color) 18%, transparent);
      font-weight: 600;
    }
  }
  &:hover .card-inner {
    border-color: color-mix(in srgb, var(--card-color) 45%, transparent);
    box-shadow: 
      0 6px 30px color-mix(in srgb, var(--card-color) 20%, transparent),
      inset 0 1px 0 rgba(255,255,255,0.1);
    transform: scale(1.02);
  }
}
.prism-footer {
  position: relative; z-index: 10; margin-top: 50px; text-align: center;
  .spectrum-bar {
    display: flex; width: 220px; height: 5px; margin: 0 auto 12px; border-radius: 3px; overflow: hidden;
    box-shadow: 0 0 15px rgba(255,255,255,0.1);
    .bar-segment { flex: 1; }
  }
  .footer-text { 
    font-size: 14px; 
    letter-spacing: 4px; 
    color: rgba(230,220,240,0.4);
    font-weight: 500;
    text-shadow: 0 0 15px rgba(255,255,255,0.1);
  }
}
@keyframes prismGlow {
  0% { filter: drop-shadow(0 0 50px rgba(255,255,255,0.25)); }
  100% { filter: drop-shadow(0 0 70px rgba(255,255,255,0.4)); }
}
</style>

