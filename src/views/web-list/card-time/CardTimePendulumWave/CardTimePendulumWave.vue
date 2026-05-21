<template>
  <section ref="containerRef" class="pendulum-wave-section">
    <div class="wave-bg">
      <div class="bg-grid"></div>
      <div class="bg-radial"></div>
    </div>
    <div ref="headerRef" class="wave-header">
      <div ref="badgeRef" class="wave-badge">
        <span class="badge-icon">🕐</span>
        <span class="badge-text">HARMONIC MOTION</span>
      </div>
      <h1 ref="titleRef" class="wave-title">PENDULUM WAVE</h1>
      <p ref="subtitleRef" class="wave-subtitle">相位差创造视觉波 · 从有序到混沌再归有序</p>
    </div>
    <div ref="deviceRef" class="wave-device">
      <div class="device-frame">
        <div class="frame-bar"></div>
      </div>
      <div class="pendulums-row">
        <div v-for="(card, index) in cards" :key="index"
          :ref="el => pendulumRefs[index] = el as HTMLElement"
          class="wave-pendulum" :data-index="index">
          <div class="p-string" :style="{ height: stringLengths[index] + 'px' }"></div>
          <div class="p-bob" :style="{ '--hue': 200 + index * 10 }">
            <div class="bob-glow"></div>
            <div class="bob-inner">
              <span class="bob-num">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="bob-label">{{ card.title }}</span>
            </div>
            <div class="bob-trail"></div>
          </div>
        </div>
      </div>
      <div class="shadow-row">
        <div v-for="(_, index) in cards" :key="'s'+index"
          :ref="el => shadowRefs[index] = el as HTMLElement"
          class="p-shadow"></div>
      </div>
    </div>
    <div ref="footerRef" class="wave-footer">
      <div class="wave-info">
        <div class="info-item">
          <span class="info-label">钟摆数</span>
          <span class="info-value">{{ cards.length }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">基频</span>
          <span class="info-value">0.5 Hz</span>
        </div>
        <div class="info-item">
          <span class="info-label">同步周期</span>
          <span class="info-value">60s</span>
        </div>
      </div>
      <span class="footer-text">WAVE INTERFERENCE PATTERN</span>
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
const deviceRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const pendulumRefs = ref<(HTMLElement | null)[]>([])
const shadowRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: (() => void)[] = []

const TOTAL = 15
const MAX_ANGLE = 30
const BASE_DURATION = 1.6 // shortest pendulum
const DELTA = 0.06 // duration increment per pendulum

const cards = Array.from({ length: TOTAL }, (_, i) => ({
  title: `P${String(i + 1).padStart(2, '0')}`,
}))

// String lengths proportional to period (longer string = longer period)
const stringLengths = cards.map((_, i) => 60 + i * 6)

onMounted(() => {
  const allP = pendulumRefs.value.filter(Boolean) as HTMLElement[]
  const allS = shadowRefs.value.filter(Boolean) as HTMLElement[]
  if (!allP.length || !containerRef.value) return

  // Set transform origin at top
  allP.forEach(p => gsap.set(p, { transformOrigin: 'center top', rotation: 0 }))

  // Header entry
  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -30, filter: 'blur(10px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 20 })
  gsap.set(allP, { opacity: 0 })

  const introTl = gsap.timeline({
    scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' }
  })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power3.out'
  })
  .to(allP, { opacity: 1, duration: 0.4, stagger: 0.03, ease: 'power2.out' }, '-=0.3')
  .to(footerRef.value, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.2')
  cleanupFns.push(() => introTl.kill())

  // Start pendulum wave animation on scroll
  const startWave = () => {
    allP.forEach((p, i) => {
      const duration = BASE_DURATION + i * DELTA
      const tween = gsap.to(p, {
        rotation: MAX_ANGLE,
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      // Start from the left position
      gsap.set(p, { rotation: -MAX_ANGLE })
      cleanupFns.push(() => tween.kill())

      // Shadow follows
      if (allS[i]) {
        const sTween = gsap.to(allS[i], {
          x: 25,
          scaleX: 1.3,
          duration: duration,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
        gsap.set(allS[i], { x: -25, scaleX: 0.7 })
        cleanupFns.push(() => sTween.kill())
      }
    })
  }

  ScrollTrigger.create({
    trigger: deviceRef.value,
    start: 'top 75%',
    onEnter: startWave,
    once: true
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.pendulum-wave-section {
  width: 100vw; height: 100vh;
  background: 
    radial-gradient(circle at 50% 40%, rgba(100,140,255,0.08) 0%, transparent 50%),
    linear-gradient(180deg, #060610 0%, #0c0a18 50%, #060610 100%);
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.wave-bg {
  position: absolute; inset: 0; pointer-events: none;
  .bg-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(80,100,180,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(80,100,180,0.04) 1px, transparent 1px);
    background-size: 50px 50px;
  }
  .bg-radial {
    position: absolute; top: 30%; left: 50%; width: 800px; height: 400px;
    transform: translate(-50%, -50%);
    background: radial-gradient(ellipse, rgba(100,140,255,0.06), transparent 70%);
  }
}
.wave-header {
  position: relative; z-index: 10; text-align: center; margin-bottom: 50px;
  .wave-badge {
    display: inline-flex; align-items: center; gap: 8px; padding: 12px 32px;
    border-radius: 50px; 
    border: 1px solid rgba(100,140,255,0.25);
    background: linear-gradient(135deg, rgba(100,140,255,0.08), rgba(80,120,235,0.04));
    backdrop-filter: blur(12px);
    box-shadow: 
      0 4px 20px rgba(100,140,255,0.12),
      inset 0 1px 0 rgba(255,255,255,0.06);
    margin-bottom: 16px;
    font-size: 11px; letter-spacing: 6px; 
    color: rgba(170,200,255,0.9);
    transition: all 0.3s ease;
    .badge-icon { 
      font-size: 16px;
      filter: drop-shadow(0 0 10px rgba(100,140,255,0.5));
    }
    &:hover {
      border-color: rgba(120,160,255,0.4);
      box-shadow: 0 6px 30px rgba(100,140,255,0.2);
      transform: translateY(-2px);
    }
  }
  .wave-title {
    font-size: clamp(52px, 7.5vw, 88px); 
    font-weight: 900; 
    letter-spacing: 10px;
    background: linear-gradient(180deg, #ffffff 0%, #b090ff 30%, #80b0ff 60%, #60a0ff 100%);
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 12px;
    filter: drop-shadow(0 0 50px rgba(100,140,255,0.4));
    animation: waveGlow 3s ease-in-out infinite alternate;
  }
  .wave-subtitle { 
    font-size: 16px; 
    color: rgba(170,190,230,0.65); 
    letter-spacing: 8px;
    font-weight: 300;
    margin: 0;
    text-shadow: 0 0 20px rgba(100,140,255,0.2);
  }
}
.wave-device {
  position: relative; z-index: 10; width: 95%; max-width: 900px; height: 300px;
}
.device-frame {
  position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 95%;
  .frame-bar {
    width: 100%; height: 6px;
    background: linear-gradient(90deg, rgba(80,80,120,0.4), rgba(120,120,180,0.6), rgba(80,80,120,0.4));
    border-radius: 3px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
  }
}
.pendulums-row {
  position: absolute; top: 6px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 2px; align-items: flex-start;
}
.wave-pendulum {
  width: 52px; display: flex; flex-direction: column; align-items: center;
  transform-origin: center top; will-change: transform;
  .p-string {
    width: 2px;
    background: linear-gradient(180deg, rgba(160,180,255,0.5), rgba(160,180,255,0.15));
    box-shadow: 0 0 6px rgba(160,180,255,0.2);
  }
  .p-bob {
    width: 46px; height: 46px; border-radius: 50%; position: relative;
    background: radial-gradient(circle at 35% 35%,
      hsla(var(--hue), 65%, 55%, 0.95),
      hsla(var(--hue), 55%, 28%, 0.98));
    box-shadow: 
      0 4px 18px hsla(var(--hue), 50%, 40%, 0.35),
      inset 0 1px 0 rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.3s ease;
    .bob-glow {
      position: absolute; inset: -10px; border-radius: 50%;
      background: radial-gradient(circle, hsla(var(--hue), 60%, 50%, 0.2), transparent 70%);
    }
    .bob-inner {
      text-align: center; z-index: 2; position: relative;
      .bob-num { 
        display: block; 
        font-size: 11px; 
        font-weight: 800; 
        color: rgba(255,255,255,0.95);
        text-shadow: 0 0 10px rgba(255,255,255,0.3);
      }
      .bob-label { 
        display: block; 
        font-size: 8px; 
        color: rgba(255,255,255,0.6);
        letter-spacing: 1px;
        font-weight: 600;
      }
    }
    .bob-trail {
      position: absolute; inset: 0; border-radius: 50%;
      box-shadow: -4px 0 10px hsla(var(--hue), 50%, 50%, 0.2),
        4px 0 10px hsla(var(--hue), 50%, 50%, 0.2);
      opacity: 0.6;
    }
  }
  &:hover .p-bob {
    box-shadow: 
      0 6px 24px hsla(var(--hue), 60%, 50%, 0.45),
      inset 0 1px 0 rgba(255,255,255,0.15);
    transform: scale(1.05);
  }
}
.shadow-row {
  position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 2px;
  .p-shadow {
    width: 52px; height: 8px;
    background: radial-gradient(ellipse, rgba(100,140,255,0.15), transparent 70%);
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(100,140,255,0.1);
  }
}
.wave-footer {
  position: relative; z-index: 10; margin-top: 50px; text-align: center;
  .wave-info {
    display: flex; gap: 35px; justify-content: center; margin-bottom: 16px;
    .info-item {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      padding: 10px 18px;
      background: rgba(100,140,255,0.04);
      border-radius: 10px;
      border: 1px solid rgba(100,140,255,0.08);
      transition: all 0.2s;
      &:hover {
        border-color: rgba(100,140,255,0.2);
        background: rgba(100,140,255,0.08);
      }
      .info-label { 
        font-size: 14px; 
        color: rgba(170,190,230,0.5);
        letter-spacing: 2px;
        font-weight: 500;
      }
      .info-value { 
        font-size: 20px; 
        font-weight: 800; 
        color: rgba(170,210,255,0.95);
        font-family: 'Courier New', monospace;
        text-shadow: 0 0 15px rgba(100,140,255,0.3);
      }
    }
  }
  .footer-text { 
    font-size: 14px; 
    letter-spacing: 4px; 
    color: rgba(170,190,230,0.45);
    font-weight: 500;
    text-shadow: 0 0 15px rgba(100,140,255,0.15);
  }
}
@keyframes waveGlow {
  0% { filter: drop-shadow(0 0 40px rgba(100,140,255,0.35)); }
  100% { filter: drop-shadow(0 0 60px rgba(100,140,255,0.5)); }
}
</style>

