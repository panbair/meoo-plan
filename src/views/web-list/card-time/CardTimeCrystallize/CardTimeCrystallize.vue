<template>
  <section ref="containerRef" class="crystallize-section">
    <div class="crystal-bg">
      <div class="frost-overlay"></div>
      <span v-for="i in 25" :key="i" class="sparkle" :style="{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, animationDelay: `${Math.random()*5}s` }"></span>
    </div>
    <div ref="headerRef" class="crystal-header">
      <div ref="badgeRef" class="crystal-badge"><span>❄️</span><span>CRYSTAL GROWTH</span></div>
      <h1 ref="titleRef" class="crystal-title">CRYSTALLIZE</h1>
      <p ref="subtitleRef" class="crystal-subtitle">冰晶生长 · 六角对称 · 自然分形</p>
    </div>
    <div ref="crystalFieldRef" class="crystal-field">
      <div :ref="el => cardRefs[0] = el as HTMLElement" class="crystal-card seed-card">
        <div class="card-inner"><div class="crystal-icon">💎</div><h3>Nucleus</h3><p>晶核种子</p></div>
        <div class="crystal-branches"><span v-for="b in 6" :key="b" class="branch-line" :style="{ transform: `rotate(${b*60}deg)` }"></span></div>
      </div>
      <div v-for="(card, i) in hexCards" :key="'h'+i" :ref="el => cardRefs[i+1] = el as HTMLElement" class="crystal-card hex-card">
        <div class="card-inner"><span class="card-index">{{ String(i+2).padStart(2,'0') }}</span><h3>{{ card.title }}</h3><p>{{ card.desc }}</p><span class="card-tag">{{ card.tag }}</span></div>
      </div>
    </div>
    <div ref="footerRef" class="crystal-footer"><span>HEXAGONAL SYMMETRY</span></div>
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
const crystalFieldRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const cardRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: (() => void)[] = []

const hexCards = [
  { title: 'Prism', desc: '棱柱面', tag: 'FACET' },
  { title: 'Dendrite', desc: '枝晶臂', tag: 'BRANCH' },
  { title: 'Lattice', desc: '晶格结构', tag: 'GRID' },
  { title: 'Facet', desc: '晶面生长', tag: 'GROWTH' },
  { title: 'Fractal', desc: '分形延伸', tag: 'SELF' },
  { title: 'Symmetry', desc: '六重对称', tag: 'HEX' },
]
const hexPos = [0, 60, 120, 180, 240, 300].map(a => ({ angle: a, dist: 160 }))

onMounted(() => {
  if (!containerRef.value) return
  const all = cardRefs.value.filter(Boolean) as HTMLElement[]
  const seed = all[0], hCards = all.slice(1)

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -30, filter: 'blur(10px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 20 })
  gsap.set(seed, { scale: 0, opacity: 0 })
  hCards.forEach(c => gsap.set(c, { x: 0, y: 0, scale: 0, opacity: 0 }))
  const branches = seed?.querySelectorAll('.branch-line')
  if (branches) gsap.set(branches, { scaleX: 0, transformOrigin: 'center center' })

  const introTl = gsap.timeline({ scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' } })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power3.out' })
    .to(footerRef.value, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
  cleanupFns.push(() => introTl.kill())

  const growTl = gsap.timeline({ scrollTrigger: { trigger: crystalFieldRef.value, start: 'top 75%', end: 'top 15%', scrub: 1.5, immediateRender: false } })
  growTl.to(seed, { scale: 1, opacity: 1, duration: 0.2, ease: 'elastic.out(1,0.5)' })
  if (branches) growTl.to(branches, { scaleX: 1, duration: 0.15, stagger: 0.02, ease: 'power2.out' }, 0.15)
  hCards.forEach((card, i) => {
    const rad = hexPos[i].angle * Math.PI / 180
    growTl.to(card, { x: Math.cos(rad) * hexPos[i].dist, y: Math.sin(rad) * hexPos[i].dist, scale: 1, opacity: 1, duration: 0.2, ease: 'back.out(1.2)' }, 0.25 + i * 0.03)
  })
  cleanupFns.push(() => growTl.kill())

  all.forEach((c, i) => { const tw = gsap.to(c, { y: `+=${3+i}`, duration: 2.5+i*0.3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i*0.2 }); cleanupFns.push(() => tw.kill()) })
})

onUnmounted(() => { cleanupFns.forEach(fn => fn()); ScrollTrigger.getAll().forEach(st => st.kill()) })
</script>

<style scoped lang="scss">
.crystallize-section { width: 100vw; height: 100vh; background: linear-gradient(180deg, #040810 0%, #081018 50%, #040810 100%); position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.crystal-bg { position: absolute; inset: 0; pointer-events: none;
  .frost-overlay { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 50%, rgba(100,180,255,0.03), transparent 60%); }
  .sparkle { position: absolute; width: 3px; height: 3px; border-radius: 50%; background: rgba(180,220,255,0.6); animation: sparkleFlash 3s ease-in-out infinite; }
}
@keyframes sparkleFlash { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1.2); } }
.crystal-header { position: relative; z-index: 10; text-align: center; margin-bottom: 50px;
  .crystal-badge { display: inline-flex; align-items: center; gap: 8px; padding: 10px 28px; border-radius: 40px; border: 1px solid rgba(100,180,255,0.15); background: rgba(100,180,255,0.04); backdrop-filter: blur(10px); margin-bottom: 12px; font-size: 11px; letter-spacing: 5px; color: rgba(140,200,255,0.7); }
  .crystal-title { font-size: clamp(48px, 7vw, 80px); font-weight: 800; letter-spacing: 8px; background: linear-gradient(180deg, #fff 0%, #80c0ff 50%, #40a0ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 8px; filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.2)); }
  .crystal-subtitle { font-size: 16px; color: rgba(140,200,255,0.5); letter-spacing: 6px; margin: 0; }
}
.crystal-field { position: relative; z-index: 10; width: 500px; height: 400px; display: flex; align-items: center; justify-content: center; }
.crystal-card { position: absolute; width: 120px;
  &.seed-card { z-index: 5; width: 130px; }
  .card-inner { position: relative; z-index: 2; padding: 24px 20px; border-radius: 24px; background: linear-gradient(145deg, rgba(8,16,28,0.95), rgba(12,20,35,0.98)); border: 1px solid rgba(100,180,255,0.12); text-align: center;
    .crystal-icon { font-size: 22px; margin-bottom: 4px; }
    .card-index { font-size: 8px; color: rgba(140,200,255,0.3); letter-spacing: 2px; }
    h3 { font-size: 13px; font-weight: 700; color: #fff; margin: 3px 0; }
    p { font-size: 9px; color: rgba(140,200,255,0.5); margin: 0 0 4px; }
    .card-tag { font-size: 7px; letter-spacing: 2px; padding: 2px 7px; border-radius: 6px; background: rgba(100,180,255,0.08); color: rgba(140,200,255,0.5); border: 1px solid rgba(100,180,255,0.08); }
  }
  .crystal-branches { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 200px; height: 200px; pointer-events: none; z-index: 1;
    .branch-line { position: absolute; top: 50%; left: 50%; width: 100%; height: 1px; background: linear-gradient(90deg, transparent 40%, rgba(100,180,255,0.2), transparent 60%); transform-origin: center center; }
  }
  &:hover .card-inner { border-color: rgba(100,180,255,0.3); box-shadow: 0 0 20px rgba(100,180,255,0.08); }
}
.crystal-footer { position: relative; z-index: 10; margin-top: 50px; text-align: center; font-size: 14px; letter-spacing: 3px; color: rgba(140,200,255,0.3); }
</style>
