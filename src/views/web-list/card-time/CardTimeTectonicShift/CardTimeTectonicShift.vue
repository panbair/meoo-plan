<template>
  <section ref="containerRef" class="tectonic-section">
    <div class="tectonic-bg">
      <div class="lava-glow"></div>
      <div class="tectonic-grid"></div>
    </div>
    <div ref="headerRef" class="tectonic-header">
      <div ref="badgeRef" class="tectonic-badge">
        <span class="badge-icon">🌍</span>
        <span class="badge-text">CONTINENTAL DRIFT</span>
      </div>
      <h1 ref="titleRef" class="tectonic-title">TECTONIC SHIFT</h1>
      <p ref="subtitleRef" class="tectonic-subtitle">盘古大陆 · 板块分裂 · 大陆漂移</p>
    </div>
    <!-- 裂缝SVG层 -->
    <svg ref="crackSvgRef" class="crack-layer" viewBox="0 0 800 400">
      <line v-for="(crack, i) in cracks" :key="'cr'+i"
        :ref="el => crackLineRefs[i] = el as SVGLineElement"
        :x1="crack.x1" :y1="crack.y1" :x2="crack.x2" :y2="crack.y2"
        stroke="rgba(255,100,30,0.4)" stroke-width="2" stroke-dasharray="200" stroke-dashoffset="200"/>
    </svg>
    <div ref="continentRef" class="continent-container">
      <div v-for="(plate, i) in plates" :key="i"
        :ref="el => plateRefs[i] = el as HTMLElement"
        class="tectonic-plate"
        :style="{ '--plate-hue': plate.hue }">
        <div class="plate-edge"></div>
        <div class="plate-inner">
          <div class="plate-terrain" :style="{ background: plate.terrain }"></div>
          <span class="plate-index">{{ String(i + 1).padStart(2, '0') }}</span>
          <h3 class="plate-title">{{ plate.title }}</h3>
          <p class="plate-desc">{{ plate.desc }}</p>
          <div class="plate-footer">
            <span class="plate-tag">{{ plate.tag }}</span>
            <span class="plate-speed">{{ plate.speed }} cm/yr</span>
          </div>
        </div>
        <div class="plate-magma"></div>
      </div>
    </div>
    <div ref="footerRef" class="tectonic-footer">
      <div class="era-timeline">
        <span class="era" v-for="era in eras" :key="era">{{ era }}</span>
      </div>
      <span class="footer-text">PANGAEA → PRESENT</span>
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
const continentRef = ref<HTMLElement | null>(null)
const crackSvgRef = ref<SVGElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const plateRefs = ref<(HTMLElement | null)[]>([])
const crackLineRefs = ref<(SVGLineElement | null)[]>([])
const cleanupFns: (() => void)[] = []

const eras = ['盘古大陆', '劳亚大陆', '冈瓦纳', '现代']

const plates = [
  { title: 'Eurasia', desc: '欧亚板块', tag: 'MAJOR', speed: 2.1, hue: 200, terrain: 'linear-gradient(135deg, rgba(40,80,60,0.3), rgba(60,100,80,0.2))', driftX: -120, driftY: -60 },
  { title: 'Africa', desc: '非洲板块', tag: 'MAJOR', speed: 2.15, hue: 30, terrain: 'linear-gradient(135deg, rgba(120,80,40,0.3), rgba(140,100,50,0.2))', driftX: -40, driftY: 80 },
  { title: 'Americas', desc: '美洲板块', tag: 'MAJOR', speed: 2.5, hue: 120, terrain: 'linear-gradient(135deg, rgba(40,100,40,0.3), rgba(60,120,50,0.2))', driftX: -180, driftY: 10 },
  { title: 'Pacific', desc: '太平洋板块', tag: 'OCEANIC', speed: 7.0, hue: 220, terrain: 'linear-gradient(135deg, rgba(20,60,120,0.3), rgba(30,80,140,0.2))', driftX: 160, driftY: -30 },
  { title: 'Antarctic', desc: '南极板块', tag: 'POLAR', speed: 1.0, hue: 190, terrain: 'linear-gradient(135deg, rgba(200,220,240,0.2), rgba(180,200,230,0.15))', driftX: 0, driftY: 120 },
  { title: 'India', desc: '印度板块', tag: 'MINOR', speed: 5.0, hue: 40, terrain: 'linear-gradient(135deg, rgba(140,100,60,0.3), rgba(160,120,70,0.2))', driftX: 80, driftY: -80 },
]

// Cracks between plates
const cracks = [
  { x1: 350, y1: 100, x2: 450, y2: 300 },
  { x1: 200, y1: 200, x2: 400, y2: 200 },
  { x1: 400, y1: 150, x2: 600, y2: 250 },
  { x1: 300, y1: 50, x2: 350, y2: 350 },
  { x1: 450, y1: 80, x2: 550, y2: 320 },
]

onMounted(() => {
  if (!containerRef.value) return
  const allPlates = plateRefs.value.filter(Boolean) as HTMLElement[]
  const allCracks = crackLineRefs.value.filter(Boolean) as SVGLineElement[]

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -30, filter: 'blur(10px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 20 })
  // Start as pangaea: all plates clustered
  gsap.set(allPlates, { x: 0, y: 0, opacity: 0, scale: 0.85 })

  const introTl = gsap.timeline({
    scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' }
  })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power3.out'
  })
  .to(allPlates, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out' }, '-=0.3')
  .to(footerRef.value, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
  cleanupFns.push(() => introTl.kill())

  // Tectonic drift timeline
  const driftTl = gsap.timeline({
    scrollTrigger: {
      trigger: continentRef.value,
      start: 'top 75%',
      end: 'top 10%',
      scrub: 2,
      immediateRender: false
    }
  })

  // Phase 1: Cracks appear
  allCracks.forEach((line, i) => {
    driftTl.to(line, {
      strokeDashoffset: 0, duration: 0.15, ease: 'power2.out'
    }, i * 0.03)
  })

  // Phase 2: Plates drift apart
  allPlates.forEach((plate, i) => {
    const p = plates[i]
    driftTl.to(plate, {
      x: p.driftX,
      y: p.driftY,
      rotation: gsap.utils.random(-8, 8),
      duration: 0.5,
      ease: 'power1.out'
    }, 0.15 + i * 0.02)
  })

  // Phase 3: Cracks fade as plates separate
  driftTl.to(allCracks, {
    opacity: 0, duration: 0.15
  }, 0.5)

  // Magma glow on edges during separation
  const magmas = allPlates.map(p => p.querySelector('.plate-magma'))
  driftTl.to(magmas, {
    opacity: 0.6, duration: 0.2, stagger: 0.02
  }, 0.2)
  driftTl.to(magmas, {
    opacity: 0, duration: 0.3
  }, 0.6)

  cleanupFns.push(() => driftTl.kill())

  // Ambient float
  allPlates.forEach((plate, i) => {
    const tw = gsap.to(plate, {
      y: `+=${4 + i * 1.5}`, duration: 3 + i * 0.4,
      repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.3
    })
    cleanupFns.push(() => tw.kill())
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.tectonic-section {
  width: 100vw; height: 100vh;
  background: linear-gradient(180deg, #0a0806 0%, #15100a 50%, #0a0806 100%);
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.tectonic-bg {
  position: absolute; inset: 0; pointer-events: none;
  .lava-glow {
    position: absolute; top: 50%; left: 50%; width: 600px; height: 600px;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(255,80,20,0.04), transparent 60%);
  }
  .tectonic-grid {
    position: absolute; inset: 0;
    background-image: radial-gradient(rgba(255,100,30,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }
}
.tectonic-header {
  position: relative; z-index: 10; text-align: center; margin-bottom: 50px;
  .tectonic-badge {
    display: inline-flex; align-items: center; gap: 8px; padding: 10px 28px;
    border-radius: 40px; border: 1px solid rgba(200,120,60,0.2);
    background: rgba(200,120,60,0.05); backdrop-filter: blur(10px); margin-bottom: 12px;
    font-size: 11px; letter-spacing: 5px; color: rgba(220,160,100,0.7);
    .badge-icon { font-size: 14px; }
  }
  .tectonic-title {
    font-size: clamp(48px, 7vw, 80px); font-weight: 800; letter-spacing: 8px;
    background: linear-gradient(180deg, #fff 0%, #e0a060 50%, #c07030 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 8px; filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.2));
  }
  .tectonic-subtitle { font-size: 16px; color: rgba(200,160,120,0.5); letter-spacing: 6px; margin: 0; }
}
.crack-layer {
  position: absolute; z-index: 5; width: 80%; max-width: 800px; height: 400px;
  top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none;
}
.continent-container {
  position: relative; z-index: 10;
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 10px; max-width: 750px; width: 90%;
}
.tectonic-plate {
  position: relative; will-change: transform;
  .plate-edge {
    position: absolute; inset: -2px; border-radius: 24px;
    border: 1px dashed rgba(255,100,30,0.1);
  }
  .plate-inner {
    position: relative; z-index: 2; padding: 24px 20px; border-radius: 24px;
    background: linear-gradient(145deg, rgba(25,18,12,0.95), rgba(18,14,10,0.98));
    border: 1px solid hsla(var(--plate-hue), 30%, 30%, 0.15);
    .plate-terrain {
      position: absolute; inset: 0; border-radius: 24px; pointer-events: none;
    }
    .plate-index { font-size: 8px; color: rgba(200,160,120,0.3); letter-spacing: 2px; position: relative; z-index: 2; }
    .plate-title { font-size: 20px; font-weight: 700; color: #fff; margin: 4px 0; position: relative; z-index: 2; }
    .plate-desc { font-size: 10px; color: rgba(200,170,140,0.5); margin: 0 0 8px; position: relative; z-index: 2; }
    .plate-footer {
      display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 2;
      .plate-tag {
        font-size: 7px; letter-spacing: 3px; padding: 2px 8px; border-radius: 8px;
        background: rgba(200,120,60,0.1); color: rgba(220,160,100,0.6);
        border: 1px solid rgba(200,120,60,0.1);
      }
      .plate-speed {
        font-size: 9px; color: rgba(255,120,40,0.5); font-family: 'Courier New', monospace;
      }
    }
  }
  .plate-magma {
    position: absolute; inset: -4px; border-radius: 16px; opacity: 0;
    background: radial-gradient(ellipse, rgba(255,80,20,0.15), transparent 70%);
    pointer-events: none;
  }
  &:hover .plate-inner {
    border-color: hsla(var(--plate-hue), 40%, 40%, 0.3);
    box-shadow: 0 0 20px rgba(255,100,30,0.08);
  }
}
.tectonic-footer {
  position: relative; z-index: 10; margin-top: 50px; text-align: center;
  .era-timeline {
    display: flex; gap: 20px; justify-content: center; margin-bottom: 10px;
    .era {
      font-size: 9px; color: rgba(200,160,120,0.4); letter-spacing: 1px;
      padding: 3px 10px; border: 1px solid rgba(200,120,60,0.08); border-radius: 24px;
    }
  }
  .footer-text { font-size: 14px; letter-spacing: 3px; color: rgba(200,160,120,0.3); }
}
</style>

