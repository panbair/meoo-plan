<template>
  <section ref="containerRef" class="avalanche-section">
    <div class="avalanche-bg">
      <div class="snow-field"></div>
      <div class="mountain-silhouette"></div>
      <div class="snow-particles">
        <span v-for="i in 30" :key="i" class="snow-flake" :style="getSnowStyle(i)"></span>
      </div>
    </div>
    <div ref="headerRef" class="avalanche-header">
      <div ref="badgeRef" class="avalanche-badge">
        <span class="badge-icon">🏔️</span>
        <span class="badge-text">CHAIN REACTION</span>
      </div>
      <h1 ref="titleRef" class="avalanche-title">AVALANCHE</h1>
      <p ref="subtitleRef" class="avalanche-subtitle">雪崩连锁 · 从崩塌到重建</p>
    </div>
    <div ref="pyramidRef" class="pyramid-container">
      <!-- 金字塔排列：1-2-3 -->
      <div v-for="(row, ri) in pyramidRows" :key="'row'+ri" class="pyramid-row">
        <div v-for="(card, ci) in row" :key="'card'+ri+ci"
          :ref="el => cardRefs[card.idx] = el as HTMLElement"
          class="avalanche-card" :data-row="ri" :data-col="ci">
          <div class="card-crack"></div>
          <div class="card-inner">
            <div class="card-snow-cap"></div>
            <span class="card-index">{{ String(card.idx + 1).padStart(2, '0') }}</span>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.desc }}</p>
            <span class="card-tag">{{ card.tag }}</span>
          </div>
          <div class="debris-particles">
            <span v-for="d in 6" :key="d" class="debris" :style="getDebrisStyle(d)"></span>
          </div>
        </div>
      </div>
    </div>
    <div ref="footerRef" class="avalanche-footer">
      <div class="seismograph">
        <svg class="seismo-wave" viewBox="0 0 200 40">
          <polyline ref="seismoRef" fill="none" stroke="rgba(200,220,255,0.4)" stroke-width="1.5"
            points="0,20 20,20 30,20 40,20 50,20 60,20 70,20 80,20 90,20 100,20 110,20 120,20 130,20 140,20 150,20 160,20 170,20 180,20 190,20 200,20"/>
        </svg>
      </div>
      <span class="footer-text">SCROLL TO TRIGGER</span>
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
const pyramidRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const seismoRef = ref<SVGPolylineElement | null>(null)
const cardRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: (() => void)[] = []

const allCards = [
  { title: 'Peak', desc: '雪峰顶点', tag: 'APEX', idx: 0 },
  { title: 'Ridge', desc: '山脊左翼', tag: 'LEFT', idx: 1 },
  { title: 'Cliff', desc: '山脊右翼', tag: 'RIGHT', idx: 2 },
  { title: 'Base A', desc: '基座左', tag: 'FOUND', idx: 3 },
  { title: 'Base B', desc: '基座中', tag: 'CORE', idx: 4 },
  { title: 'Base C', desc: '基座右', tag: 'FOUND', idx: 5 },
]

const pyramidRows = [
  [allCards[0]],
  [allCards[1], allCards[2]],
  [allCards[3], allCards[4], allCards[5]],
]

const getSnowStyle = (i: number) => ({
  left: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 8}s`,
  animationDuration: `${6 + Math.random() * 6}s`,
  width: `${2 + Math.random() * 3}px`,
  height: `${2 + Math.random() * 3}px`,
  opacity: 0.3 + Math.random() * 0.4,
})

const getDebrisStyle = (d: number) => ({
  width: `${3 + Math.random() * 5}px`,
  height: `${3 + Math.random() * 5}px`,
  left: `${20 + Math.random() * 60}%`,
  top: `${20 + Math.random() * 60}%`,
})

onMounted(() => {
  if (!containerRef.value) return
  const cards = cardRefs.value.filter(Boolean) as HTMLElement[]
  if (!cards.length) return

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -30, filter: 'blur(10px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 20 })
  gsap.set(cards, { opacity: 0, y: -60, scale: 0.7 })

  // Intro
  const introTl = gsap.timeline({
    scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' }
  })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power3.out'
  })
  .to(cards, { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.06, ease: 'back.out(1.3)' }, '-=0.3')
  .to(footerRef.value, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
  cleanupFns.push(() => introTl.kill())

  // Avalanche: collapse then rebuild
  const avTl = gsap.timeline({
    scrollTrigger: {
      trigger: pyramidRef.value,
      start: 'top 70%',
      end: 'top 10%',
      scrub: 1.5,
      immediateRender: false
    }
  })

  // Phase 1: Top card falls & shakes
  avTl.to(cards[0], {
    y: 80, rotation: gsap.utils.random(-25, 25), scale: 0.85,
    duration: 0.15, ease: 'power3.in'
  })

  // Phase 2: Second row collapses
  avTl.to([cards[1], cards[2]], {
    y: 60, rotation: (i: number) => i === 0 ? -20 : 20,
    x: (i: number) => i === 0 ? -30 : 30,
    scale: 0.85, duration: 0.15, ease: 'power2.in'
  }, 0.12)

  // Phase 3: Base row collapses
  avTl.to([cards[3], cards[4], cards[5]], {
    y: 40, rotation: () => gsap.utils.random(-15, 15),
    x: () => gsap.utils.random(-20, 20),
    scale: 0.9, duration: 0.12, ease: 'power2.in'
  }, 0.22)

  // Debris burst on all cards
  const allDebris = cards.map(c => c.querySelectorAll('.debris'))
  allDebris.forEach((debris, i) => {
    avTl.to(debris, {
      x: () => gsap.utils.random(-40, 40),
      y: () => gsap.utils.random(-40, 40),
      opacity: 0.8,
      scale: 1.5,
      duration: 0.1,
      stagger: 0.01
    }, 0.15 + i * 0.03)
  })

  // Seismograph shake
  avTl.call(() => {
    if (seismoRef.value) {
      const pts = Array.from({ length: 20 }, (_, i) => {
        const x = i * 10
        const y = 20 + (Math.random() - 0.5) * 30
        return `${x},${y}`
      }).join(' ')
      seismoRef.value.setAttribute('points', pts)
    }
  }, [], 0.2)

  // Phase 4: REBUILD — everything snaps back
  avTl.to(cards, {
    y: 0, x: 0, rotation: 0, scale: 1,
    duration: 0.3, stagger: { each: 0.04, from: 'end' },
    ease: 'elastic.out(1.2, 0.6)'
  }, 0.5)

  // Debris fade
  allDebris.forEach(debris => {
    avTl.to(debris, { opacity: 0, scale: 0, duration: 0.15 }, 0.5)
  })

  // Reset seismograph
  avTl.call(() => {
    if (seismoRef.value) {
      const pts = Array.from({ length: 20 }, (_, i) => `${i * 10},20`).join(' ')
      seismoRef.value.setAttribute('points', pts)
    }
  }, [], 0.7)

  cleanupFns.push(() => avTl.kill())
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.avalanche-section {
  width: 100vw; height: 100vh;
  background: linear-gradient(180deg, #0a0e18 0%, #151c2a 40%, #1a2235 100%);
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.avalanche-bg {
  position: absolute; inset: 0; pointer-events: none;
  .snow-field {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 80%, rgba(200,220,255,0.03), transparent 60%);
  }
  .mountain-silhouette {
    position: absolute; bottom: 0; left: 0; right: 0; height: 40%;
    background: linear-gradient(180deg, transparent, rgba(20,30,50,0.3));
    clip-path: polygon(0% 100%, 15% 40%, 30% 70%, 50% 20%, 70% 60%, 85% 35%, 100% 100%);
  }
  .snow-flake {
    position: absolute; border-radius: 50%; background: rgba(200,220,255,0.5);
    animation: snowFall 8s linear infinite;
  }
}
@keyframes snowFall {
  0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 0.5; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
}
.avalanche-header {
  position: relative; z-index: 10; text-align: center; margin-bottom: 50px;
  .avalanche-badge {
    display: inline-flex; align-items: center; gap: 8px; padding: 10px 28px;
    border-radius: 40px; border: 1px solid rgba(180,200,240,0.15);
    background: rgba(180,200,240,0.05); backdrop-filter: blur(10px); margin-bottom: 12px;
    font-size: 11px; letter-spacing: 5px; color: rgba(180,200,240,0.7);
    .badge-icon { font-size: 14px; }
  }
  .avalanche-title {
    font-size: clamp(48px, 7vw, 80px); font-weight: 800; letter-spacing: 8px;
    background: linear-gradient(180deg, #fff 0%, #b0c4de 50%, #87ceeb 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 8px; filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.2));
  }
  .avalanche-subtitle { font-size: 16px; color: rgba(180,200,230,0.5); letter-spacing: 6px; margin: 0; }
}
.pyramid-container {
  position: relative; z-index: 10;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.pyramid-row {
  display: flex; gap: 14px; justify-content: center;
}
.avalanche-card {
  position: relative; width: 160px; will-change: transform;
  .card-crack {
    position: absolute; inset: 0; border-radius: 24px; pointer-events: none; z-index: 3;
    background: linear-gradient(135deg, transparent 48%, rgba(200,220,255,0.08) 49%, rgba(200,220,255,0.08) 51%, transparent 52%);
  }
  .card-inner {
    position: relative; z-index: 2; padding: 24px 20px; border-radius: 24px;
    background: linear-gradient(145deg, rgba(20,28,45,0.95), rgba(15,22,38,0.98));
    border: 1px solid rgba(180,200,240,0.1);
    .card-snow-cap {
      position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 12px 12px 0 0;
      background: linear-gradient(90deg, rgba(200,220,255,0.2), rgba(255,255,255,0.3), rgba(200,220,255,0.2));
    }
    .card-index { font-size: 8px; color: rgba(180,200,240,0.3); letter-spacing: 2px; }
    .card-title { font-size: 20px; font-weight: 700; color: #fff; margin: 4px 0; }
    .card-desc { font-size: 10px; color: rgba(180,200,230,0.5); margin: 0 0 8px; }
    .card-tag {
      font-size: 7px; letter-spacing: 2px; padding: 2px 8px; border-radius: 8px;
      background: rgba(100,140,200,0.1); color: rgba(160,190,240,0.6);
      border: 1px solid rgba(100,140,200,0.1);
    }
  }
  .debris-particles {
    position: absolute; inset: 0; pointer-events: none; z-index: 4;
    .debris {
      position: absolute; border-radius: 2px; opacity: 0;
      background: rgba(200,220,255,0.5);
    }
  }
  &:hover .card-inner {
    border-color: rgba(180,200,240,0.25);
    box-shadow: 0 0 20px rgba(180,200,240,0.08);
  }
}
.avalanche-footer {
  position: relative; z-index: 10; margin-top: 50px; text-align: center;
  .seismograph {
    width: 200px; height: 40px; margin: 0 auto 10px;
    border: 1px solid rgba(180,200,240,0.08); border-radius: 6px;
    background: rgba(10,15,25,0.5);
    .seismo-wave { width: 100%; height: 100%; }
  }
  .footer-text { font-size: 14px; letter-spacing: 3px; color: rgba(180,200,230,0.3); }
}
</style>

