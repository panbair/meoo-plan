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
.crystallize-section { 
  width: 100vw; height: 100vh; 
  background: 
    radial-gradient(circle at 50% 50%, rgba(100,180,255,0.08) 0%, transparent 50%),
    radial-gradient(circle at 30% 70%, rgba(150,200,255,0.05) 0%, transparent 40%),
    linear-gradient(180deg, #040810 0%, #081018 50%, #040810 100%);
  position: relative; overflow: hidden; 
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.crystal-bg { 
  position: absolute; inset: 0; pointer-events: none;
  .frost-overlay { 
    position: absolute; inset: 0; 
    background: 
      radial-gradient(ellipse at 50% 50%, rgba(100,180,255,0.05), transparent 60%),
      radial-gradient(ellipse at 20% 30%, rgba(150,200,255,0.03), transparent 50%);
  }
  .sparkle { 
    position: absolute; 
    width: 4px; height: 4px; 
    border-radius: 50%; 
    background: radial-gradient(circle, rgba(200,230,255,0.9), rgba(180,220,255,0.4));
    box-shadow: 0 0 8px rgba(180,220,255,0.6);
    animation: sparkleFlash 3s ease-in-out infinite; 
  }
}
@keyframes sparkleFlash { 
  0%, 100% { opacity: 0; transform: scale(0.5); } 
  50% { opacity: 1; transform: scale(1.3); } 
}
.crystal-header { 
  position: relative; z-index: 10; text-align: center; margin-bottom: 50px;
  .crystal-badge { 
    display: inline-flex; align-items: center; gap: 8px; padding: 12px 32px;
    border-radius: 50px; 
    border: 1px solid rgba(100,180,255,0.2);
    background: linear-gradient(135deg, rgba(100,180,255,0.08), rgba(80,160,240,0.04));
    backdrop-filter: blur(12px);
    box-shadow: 
      0 4px 20px rgba(100,180,255,0.12),
      inset 0 1px 0 rgba(255,255,255,0.08);
    margin-bottom: 16px;
    font-size: 11px; letter-spacing: 6px; 
    color: rgba(160,210,255,0.85);
    transition: all 0.3s ease;
    span:first-child { 
      font-size: 16px;
      filter: drop-shadow(0 0 10px rgba(100,180,255,0.6));
    }
    &:hover {
      border-color: rgba(120,200,255,0.35);
      box-shadow: 0 6px 30px rgba(100,180,255,0.18);
      transform: translateY(-2px);
    }
  }
  .crystal-title {
    font-size: clamp(52px, 7.5vw, 88px); 
    font-weight: 900; 
    letter-spacing: 10px;
    background: linear-gradient(180deg, #ffffff 0%, #a0d0ff 30%, #60b0ff 60%, #4090e0 100%);
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 12px;
    filter: drop-shadow(0 0 40px rgba(100,180,255,0.35));
    animation: crystalGlow 3s ease-in-out infinite alternate;
  }
  .crystal-subtitle { 
    font-size: 16px; 
    color: rgba(160,210,255,0.65); 
    letter-spacing: 8px;
    font-weight: 300;
    margin: 0;
    text-shadow: 0 0 20px rgba(100,180,255,0.25);
  }
}
.crystal-field { 
  position: relative; z-index: 10; width: 500px; height: 400px; 
  display: flex; align-items: center; justify-content: center; 
}
.crystal-card { 
  position: absolute; width: 125px;
  transition: transform 0.3s ease;
  &.seed-card { z-index: 5; width: 135px; }
  .card-inner { 
    position: relative; z-index: 2; padding: 26px 22px; border-radius: 28px; 
    background: 
      linear-gradient(145deg, rgba(10,18,32,0.92), rgba(14,22,38,0.96));
    border: 1px solid rgba(100,180,255,0.15);
    box-shadow: 
      0 8px 32px rgba(0,0,0,0.3),
      inset 0 1px 0 rgba(255,255,255,0.06);
    backdrop-filter: blur(10px);
    text-align: center;
    transition: all 0.3s ease;
    .crystal-icon { 
      font-size: 26px; 
      margin-bottom: 6px;
      filter: drop-shadow(0 0 10px rgba(100,180,255,0.5));
    }
    .card-index { 
      font-size: 9px; 
      color: rgba(160,210,255,0.35); 
      letter-spacing: 3px;
      font-weight: 600;
    }
    h3 { 
      font-size: 15px; 
      font-weight: 800; 
      color: #ffffff;
      margin: 4px 0;
      text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    p { 
      font-size: 10px; 
      color: rgba(160,210,255,0.6);
      margin: 0 0 6px;
      line-height: 1.3;
    }
    .card-tag {
      font-size: 8px; 
      letter-spacing: 3px; 
      padding: 3px 9px; 
      border-radius: 8px;
      background: linear-gradient(135deg, rgba(100,180,255,0.1), rgba(80,160,240,0.06));
      color: rgba(160,210,255,0.7);
      border: 1px solid rgba(100,180,255,0.12);
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(100,180,255,0.1);
    }
  }
  .crystal-branches { 
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
    width: 200px; height: 200px; pointer-events: none; z-index: 1;
    .branch-line { 
      position: absolute; top: 50%; left: 50%; 
      width: 100%; height: 2px; 
      background: linear-gradient(90deg, 
        transparent 35%, 
        rgba(100,180,255,0.25) 50%, 
        transparent 65%);
      transform-origin: center center;
      box-shadow: 0 0 6px rgba(100,180,255,0.3);
    }
  }
  &:hover {
    transform: translateY(-5px) scale(1.02);
    .card-inner { 
      border-color: rgba(120,200,255,0.3);
      box-shadow: 
        0 12px 40px rgba(100,180,255,0.15),
        inset 0 1px 0 rgba(255,255,255,0.1);
    }
  }
}
.crystal-footer { 
  position: relative; z-index: 10; margin-top: 50px; text-align: center;
  font-size: 14px; 
  letter-spacing: 4px; 
  color: rgba(160,210,255,0.45);
  font-weight: 500;
  text-shadow: 0 0 15px rgba(100,180,255,0.2);
}
@keyframes crystalGlow {
  0% { filter: drop-shadow(0 0 30px rgba(100,180,255,0.3)); }
  100% { filter: drop-shadow(0 0 50px rgba(100,180,255,0.45)); }
}
</style>
