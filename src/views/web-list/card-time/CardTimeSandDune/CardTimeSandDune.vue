<template>
  <section ref="containerRef" class="sand-dune-section">
    <div class="dune-bg">
      <div class="desert-gradient"></div>
      <div class="sand-particles">
        <span v-for="i in 35" :key="i" class="sand-grain"
          :style="{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, animationDelay: `${Math.random()*6}s`, animationDuration: `${3+Math.random()*4}s` }"></span>
      </div>
      <div class="heat-haze"></div>
    </div>
    <div ref="headerRef" class="dune-header">
      <div ref="badgeRef" class="dune-badge">
        <span class="badge-icon">🏜️</span>
        <span class="badge-text">AEOLIAN PROCESS</span>
      </div>
      <h1 ref="titleRef" class="dune-title">SAND DUNE</h1>
      <p ref="subtitleRef" class="dune-subtitle">沙丘迁移 · 风力塑形 · 波浪流动</p>
    </div>
    <div ref="duneFieldRef" class="dune-field">
      <div v-for="(card, i) in cards" :key="i"
        :ref="el => cardRefs[i] = el as HTMLElement"
        class="dune-card"
        :style="{ '--dune-hue': card.hue }">
        <div class="card-sand-layer"></div>
        <div class="card-inner">
          <div class="wind-lines">
            <span v-for="w in 3" :key="w" class="wind-line"></span>
          </div>
          <span class="card-index">{{ String(i + 1).padStart(2, '0') }}</span>
          <h3 class="card-title">{{ card.title }}</h3>
          <p class="card-desc">{{ card.desc }}</p>
          <div class="card-footer">
            <span class="card-tag">{{ card.tag }}</span>
            <span class="wind-speed">{{ card.wind }} m/s</span>
          </div>
        </div>
        <div class="dune-shadow"></div>
      </div>
    </div>
    <div ref="footerRef" class="dune-footer">
      <div class="wind-indicator">
        <svg viewBox="0 0 80 20" width="80" height="20">
          <path d="M0,10 Q20,2 40,10 Q60,18 80,10" fill="none" stroke="rgba(220,180,120,0.3)" stroke-width="1.5"/>
          <circle ref="windDotRef" cx="0" cy="10" r="3" fill="rgba(255,200,100,0.6)"/>
        </svg>
      </div>
      <span class="footer-text">WIND DIRECTION →</span>
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
const duneFieldRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const windDotRef = ref<SVGCircleElement | null>(null)
const cardRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: (() => void)[] = []

const cards = [
  { title: 'Barchan', desc: '新月形沙丘', tag: 'CRESCENT', wind: 12, hue: 35 },
  { title: 'Transverse', desc: '横向沙丘', tag: 'LATERAL', wind: 18, hue: 30 },
  { title: 'Star', desc: '星形沙丘', tag: 'RADIAL', wind: 8, hue: 40 },
  { title: 'Linear', desc: '纵向沙丘', tag: 'SEIF', wind: 22, hue: 25 },
  { title: 'Dome', desc: '穹顶沙丘', tag: 'DOME', wind: 15, hue: 38 },
  { title: 'Parabolic', desc: '抛物线沙丘', tag: 'BLOWOUT', wind: 10, hue: 32 },
]

onMounted(() => {
  if (!containerRef.value) return
  const allCards = cardRefs.value.filter(Boolean) as HTMLElement[]

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -30, filter: 'blur(10px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 20 })

  // Cards start off-screen right (blown by wind)
  allCards.forEach((c, i) => {
    gsap.set(c, { x: 300 + i * 50, opacity: 0, y: Math.sin(i * 0.8) * 30 })
  })

  const introTl = gsap.timeline({
    scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' }
  })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power3.out'
  })
  .to(footerRef.value, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
  cleanupFns.push(() => introTl.kill())

  // Sand dune flow: wind blows cards from right to final position
  const duneTl = gsap.timeline({
    scrollTrigger: {
      trigger: duneFieldRef.value,
      start: 'top 75%',
      end: 'top 15%',
      scrub: 1.5,
      immediateRender: false
    }
  })

  // Cards flow in with wave motion
  allCards.forEach((card, i) => {
    const waveY = Math.sin(i * 1.2) * 20
    duneTl.to(card, {
      x: 0, y: waveY, opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    }, i * 0.06)
  })

  // After settling, wave undulation
  allCards.forEach((card, i) => {
    duneTl.to(card, {
      y: Math.sin(i * 1.2 + Math.PI) * 15,
      duration: 0.2,
      ease: 'sine.inOut'
    }, 0.5 + i * 0.02)
  })

  // Wind dot animation on indicator
  if (windDotRef.value) {
    duneTl.to(windDotRef.value, {
      attr: { cx: 80 }, duration: 0.8, ease: 'power1.inOut'
    }, 0)
  }

  cleanupFns.push(() => duneTl.kill())

  // Perpetual wave motion
  allCards.forEach((card, i) => {
    const tw = gsap.to(card, {
      y: `+=${8 + Math.sin(i) * 5}`,
      x: `+=${3}`,
      duration: 3 + i * 0.4,
      repeat: -1, yoyo: true, ease: 'sine.inOut',
      delay: i * 0.3
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
.sand-dune-section {
  width: 100vw; height: 100vh;
  background: 
    radial-gradient(ellipse at 50% 70%, rgba(200,150,60,0.08) 0%, transparent 60%),
    linear-gradient(180deg, #1a1408 0%, #2a1e10 40%, #1a1408 100%);
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.dune-bg {
  position: absolute; inset: 0; pointer-events: none;
  .desert-gradient {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 70%, rgba(200,150,60,0.08), transparent 60%);
  }
  .sand-grain {
    position: absolute; width: 2px; height: 2px; border-radius: 50%;
    background: rgba(230,190,110,0.5);
    animation: sandBlow 5s linear infinite;
    box-shadow: 0 0 4px rgba(230,190,110,0.3);
  }
  .heat-haze {
    position: absolute; bottom: 20%; left: 0; right: 0; height: 30%;
    background: linear-gradient(180deg, transparent, rgba(200,150,60,0.03));
    animation: haze 4s ease-in-out infinite;
  }
}
@keyframes sandBlow {
  0% { transform: translate(0, 0); opacity: 0; }
  10% { opacity: 0.7; }
  90% { opacity: 0.4; }
  100% { transform: translate(-200px, -30px); opacity: 0; }
}
@keyframes haze {
  0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; }
}
.dune-header {
  position: relative; z-index: 10; text-align: center; margin-bottom: 50px;
  .dune-badge {
    display: inline-flex; align-items: center; gap: 8px; padding: 12px 32px;
    border-radius: 50px; 
    border: 1px solid rgba(220,180,100,0.2);
    background: linear-gradient(135deg, rgba(220,180,100,0.08), rgba(200,160,80,0.04));
    backdrop-filter: blur(12px);
    box-shadow: 
      0 4px 20px rgba(220,180,100,0.1),
      inset 0 1px 0 rgba(255,255,255,0.06);
    margin-bottom: 16px;
    font-size: 11px; letter-spacing: 6px; 
    color: rgba(230,200,140,0.8);
    transition: all 0.3s ease;
    .badge-icon { 
      font-size: 16px;
      filter: drop-shadow(0 0 10px rgba(220,180,100,0.5));
    }
    &:hover {
      border-color: rgba(230,190,120,0.35);
      box-shadow: 0 6px 30px rgba(220,180,100,0.18);
      transform: translateY(-2px);
    }
  }
  .dune-title {
    font-size: clamp(52px, 7.5vw, 88px); 
    font-weight: 900; 
    letter-spacing: 10px;
    background: linear-gradient(180deg, #ffffff 0%, #f0d090 30%, #e0c080 60%, #c09040 100%);
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 12px;
    filter: drop-shadow(0 0 60px rgba(220,180,100,0.4));
    animation: duneGlow 3s ease-in-out infinite alternate;
  }
  .dune-subtitle { 
    font-size: 16px; 
    color: rgba(230,190,130,0.6);
    letter-spacing: 8px;
    font-weight: 300;
    margin: 0;
    text-shadow: 0 0 20px rgba(220,180,100,0.2);
  }
}
.dune-field {
  position: relative; z-index: 10;
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 18px; max-width: 750px; width: 90%;
}
.dune-card {
  position: relative; will-change: transform;
  .card-sand-layer {
    position: absolute; bottom: 0; left: 0; right: 0; height: 40%; border-radius: 0 0 14px 14px;
    background: linear-gradient(180deg, transparent, hsla(var(--dune-hue), 55%, 35%, 0.12));
    pointer-events: none;
  }
  .card-inner {
    position: relative; z-index: 2; padding: 26px 22px; border-radius: 28px;
    background: linear-gradient(145deg, rgba(38,30,18,0.96), rgba(30,24,14,0.98));
    border: 1px solid hsla(var(--dune-hue), 45%, 45%, 0.15);
    box-shadow: 
      0 4px 20px rgba(0,0,0,0.3),
      inset 0 1px 0 rgba(255,255,255,0.05);
    transition: all 0.3s ease;
    .wind-lines {
      position: absolute; top: 10px; right: 12px; display: flex; flex-direction: column; gap: 4px;
      .wind-line {
        width: 22px; height: 1px;
        background: linear-gradient(90deg, rgba(230,190,110,0.2), transparent);
        animation: windFlow 2s linear infinite;
        box-shadow: 0 0 4px rgba(230,190,110,0.1);
        &:nth-child(2) { width: 17px; animation-delay: 0.3s; }
        &:nth-child(3) { width: 12px; animation-delay: 0.6s; }
      }
    }
    .card-index { 
      font-size: 9px; 
      color: rgba(230,190,130,0.35); 
      letter-spacing: 2px;
      font-weight: 600;
    }
    .card-title { 
      font-size: 21px; 
      font-weight: 800; 
      color: #fff; 
      margin: 5px 0;
      text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    .card-desc { 
      font-size: 11px; 
      color: rgba(230,190,140,0.6);
      margin: 0 0 10px;
    }
    .card-footer {
      display: flex; justify-content: space-between; align-items: center;
      .card-tag {
        font-size: 8px; letter-spacing: 3px; padding: 3px 10px; border-radius: 10px;
        background: rgba(210,170,90,0.12); color: rgba(230,190,130,0.7);
        border: 1px solid rgba(210,170,90,0.12);
        font-weight: 600;
      }
      .wind-speed { 
        font-size: 10px; 
        color: rgba(230,190,110,0.5); 
        font-family: 'Courier New', monospace;
        font-weight: 600;
      }
    }
  }
  .dune-shadow {
    position: absolute; bottom: -8px; left: 10%; right: 10%; height: 10px;
    background: radial-gradient(ellipse, rgba(0,0,0,0.25), transparent 70%);
    border-radius: 50%;
  }
  &:hover .card-inner {
    border-color: hsla(var(--dune-hue), 50%, 55%, 0.3);
    box-shadow: 
      0 6px 30px rgba(210,170,90,0.12),
      inset 0 1px 0 rgba(255,255,255,0.08);
    transform: translateY(-2px);
  }
}
@keyframes windFlow {
  0% { transform: translateX(0); opacity: 0.3; }
  50% { opacity: 0.7; }
  100% { transform: translateX(-15px); opacity: 0; }
}
.dune-footer {
  position: relative; z-index: 10; margin-top: 50px; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  .wind-indicator {
    filter: drop-shadow(0 0 8px rgba(230,190,110,0.2));
  }
  .footer-text { 
    font-size: 14px; 
    letter-spacing: 4px; 
    color: rgba(230,190,130,0.4);
    font-weight: 500;
    text-shadow: 0 0 15px rgba(220,180,100,0.15);
  }
}
@keyframes duneGlow {
  0% { filter: drop-shadow(0 0 50px rgba(220,180,100,0.35)); }
  100% { filter: drop-shadow(0 0 70px rgba(220,180,100,0.5)); }
}
</style>

