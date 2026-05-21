<template>
  <section ref="containerRef" class="newton-cradle-section">
    <div class="cradle-bg">
      <div class="bg-grid"></div>
      <div class="bg-glow"></div>
    </div>
    <div ref="headerRef" class="cradle-header">
      <div ref="badgeRef" class="cradle-badge">
        <span class="badge-icon">⚖️</span>
        <span class="badge-text">MOMENTUM CONSERVATION</span>
      </div>
      <h1 ref="titleRef" class="cradle-title">NEWTON'S CRADLE</h1>
      <p ref="subtitleRef" class="cradle-subtitle">动量守恒 · 能量传递 · 连锁反应</p>
    </div>
    <div ref="cradleRef" class="cradle-device">
      <div class="cradle-frame">
        <div class="frame-top"></div>
        <div class="frame-leg left"></div>
        <div class="frame-leg right"></div>
      </div>
      <div class="pendulums-container">
        <div v-for="(card, index) in cards" :key="index"
          :ref="el => pendulumRefs[index] = el as HTMLElement"
          class="pendulum" :data-index="index">
          <div class="pendulum-string"></div>
          <div class="pendulum-bob">
            <div class="bob-shine"></div>
            <div class="bob-content">
              <span class="bob-index">{{ String(index + 1).padStart(2, '0') }}</span>
              <h3 class="bob-title">{{ card.title }}</h3>
              <p class="bob-desc">{{ card.desc }}</p>
              <span class="bob-tag">{{ card.tag }}</span>
            </div>
            <div class="impact-flash"></div>
          </div>
        </div>
      </div>
    </div>
    <div ref="footerRef" class="cradle-footer">
      <div class="physics-params">
        <div class="param">
          <span class="param-label">动量 p</span>
          <span class="param-value" ref="momentumRef">0.00</span>
          <span class="param-unit">kg·m/s</span>
        </div>
        <div class="param">
          <span class="param-label">动能 Ek</span>
          <span class="param-value" ref="energyRef">0.00</span>
          <span class="param-unit">J</span>
        </div>
        <div class="param">
          <span class="param-label">碰撞次数</span>
          <span class="param-value" ref="collisionRef">0</span>
          <span class="param-unit">次</span>
        </div>
      </div>
      <span class="footer-text">ELASTIC COLLISION</span>
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
const cradleRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const momentumRef = ref<HTMLElement | null>(null)
const energyRef = ref<HTMLElement | null>(null)
const collisionRef = ref<HTMLElement | null>(null)
const pendulumRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: (() => void)[] = []
let collisionCount = 0

const cards = [
  { title: 'Impact', desc: '碰撞起点', tag: 'START' },
  { title: 'Transfer', desc: '动量传递', tag: 'PASS' },
  { title: 'Medium', desc: '能量媒介', tag: 'LINK' },
  { title: 'Conduct', desc: '力的传导', tag: 'WAVE' },
  { title: 'Release', desc: '能量释放', tag: 'END' },
]

const SWING_ANGLE = 35

onMounted(() => {
  const allP = pendulumRefs.value.filter(Boolean) as HTMLElement[]
  if (!allP.length || !containerRef.value) return
  const first = allP[0], last = allP[allP.length - 1]
  const middle = allP.slice(1, -1)

  allP.forEach(p => gsap.set(p, { transformOrigin: 'center top', rotation: 0 }))
  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -40, filter: 'blur(12px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 30 })

  const introTl = gsap.timeline({
    scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' }
  })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.12, ease: 'power3.out'
  }).to(footerRef.value, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
  cleanupFns.push(() => introTl.kill())

  allP.forEach(p => gsap.set(p, { opacity: 0, y: -100 }))
  const entryTl = gsap.timeline({
    scrollTrigger: { trigger: cradleRef.value, start: 'top 80%', toggleActions: 'play none none none' }
  })
  allP.forEach((p, i) => {
    entryTl.to(p, { opacity: 1, y: 0, duration: 0.5, ease: 'bounce.out' }, i * 0.1)
  })
  cleanupFns.push(() => entryTl.kill())

  const doImpact = (el: HTMLElement) => {
    collisionCount++
    if (collisionRef.value) collisionRef.value.textContent = String(collisionCount)
    if (momentumRef.value) momentumRef.value.textContent = '2.45'
    if (energyRef.value) energyRef.value.textContent = '3.00'
    middle.forEach((p, i) => {
      gsap.to(p, { rotation: -1.5, duration: 0.03, delay: i * 0.02, yoyo: true, repeat: 1, ease: 'power1.inOut' })
    })
    const flash = el.querySelector('.impact-flash')
    if (flash) gsap.fromTo(flash, { opacity: 0.8, scale: 1.5 }, { opacity: 0, scale: 0.5, duration: 0.3 })
  }

  const resetParams = () => {
    if (momentumRef.value) momentumRef.value.textContent = '0.00'
    if (energyRef.value) energyRef.value.textContent = '0.00'
  }

  setTimeout(() => {
    const cTl = gsap.timeline({
      repeat: -1,
      scrollTrigger: { trigger: cradleRef.value, start: 'top 70%', toggleActions: 'play pause resume pause' }
    })
    cTl.to(first, { rotation: -SWING_ANGLE, duration: 0.5, ease: 'power2.out' })
    cTl.to(first, { rotation: 0, duration: 0.35, ease: 'power3.in', onComplete: () => doImpact(first) })
    cTl.to(last, { rotation: SWING_ANGLE, duration: 0.5, ease: 'power2.out' }, '-=0.05')
    cTl.call(resetParams, [], '+=0.1')
    cTl.to(last, { rotation: 0, duration: 0.35, ease: 'power3.in', onComplete: () => doImpact(last) })
    cTl.to(first, { rotation: -SWING_ANGLE, duration: 0.5, ease: 'power2.out' }, '-=0.05')
    cTl.call(resetParams, [], '+=0.1')
    cTl.to(first, { rotation: 0, duration: 0.35, ease: 'power3.in' })
    cleanupFns.push(() => cTl.kill())
  }, 600)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.newton-cradle-section {
  width: 100vw; height: 100vh;
  background: 
    radial-gradient(circle at 50% 50%, rgba(140,100,255,0.08) 0%, transparent 50%),
    linear-gradient(180deg, #08060e 0%, #0e0a1a 50%, #08060e 100%);
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.cradle-bg {
  position: absolute; inset: 0; pointer-events: none;
  .bg-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(100,80,160,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(100,80,160,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .bg-glow {
    position: absolute; top: 50%; left: 50%; width: 600px; height: 600px;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(140,100,255,0.08), transparent 70%);
  }
}
.cradle-header {
  position: relative; z-index: 10; text-align: center; margin-bottom: 50px;
  .cradle-badge {
    display: inline-flex; align-items: center; gap: 8px; padding: 12px 32px;
    border-radius: 50px; 
    border: 1px solid rgba(180,160,220,0.25);
    background: linear-gradient(135deg, rgba(140,100,255,0.08), rgba(120,80,235,0.04));
    backdrop-filter: blur(12px);
    box-shadow: 
      0 4px 20px rgba(140,100,255,0.12),
      inset 0 1px 0 rgba(255,255,255,0.06);
    margin-bottom: 16px;
    font-size: 11px; letter-spacing: 6px; 
    color: rgba(210,190,250,0.9);
    transition: all 0.3s ease;
    .badge-icon { 
      font-size: 16px;
      filter: drop-shadow(0 0 10px rgba(140,100,255,0.5));
    }
    &:hover {
      border-color: rgba(200,180,240,0.4);
      box-shadow: 0 6px 30px rgba(140,100,255,0.2);
      transform: translateY(-2px);
    }
  }
  .cradle-title {
    font-size: clamp(52px, 7.5vw, 88px); 
    font-weight: 900; 
    letter-spacing: 10px;
    background: linear-gradient(180deg, #ffffff 0%, #d0d0d0 30%, #a0a0a0 60%, #808080 100%);
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 12px;
    filter: drop-shadow(0 0 50px rgba(200,200,200,0.4));
    animation: cradleGlow 3s ease-in-out infinite alternate;
  }
  .cradle-subtitle { 
    font-size: 14px; 
    color: rgba(190,170,230,0.65); 
    letter-spacing: 8px;
    font-weight: 300;
    margin: 0;
    text-shadow: 0 0 20px rgba(140,100,255,0.2);
  }
}
.cradle-device { position: relative; z-index: 10; width: 90%; max-width: 800px; height: 340px; }
.cradle-frame {
  position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 560px;
  .frame-top {
    width: 100%; height: 8px; 
    background: linear-gradient(90deg, #555, #999, #555);
    border-radius: 4px; 
    box-shadow: 0 2px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2);
  }
  .frame-leg {
    position: absolute; top: 0; width: 5px; height: 32px;
    background: linear-gradient(180deg, #999, #555);
    box-shadow: 0 0 8px rgba(0,0,0,0.3);
    &.left { left: 20px; } &.right { right: 20px; }
  }
}
.pendulums-container {
  position: absolute; top: 8px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 0; align-items: flex-start;
}
.pendulum {
  width: 100px; display: flex; flex-direction: column; align-items: center;
  transform-origin: center top; will-change: transform;
  .pendulum-string {
    width: 2px; height: 90px;
    background: linear-gradient(180deg, rgba(220,220,220,0.7), rgba(200,200,200,0.25));
    box-shadow: 0 0 6px rgba(200,200,200,0.2);
  }
  .pendulum-bob {
    width: 90px; border-radius: 26px;
    background: linear-gradient(145deg, rgba(32,27,52,0.96), rgba(22,17,37,0.98));
    border: 1px solid rgba(160,140,220,0.2);
    padding: 26px 22px;
    position: relative; overflow: hidden; 
    box-shadow: 
      0 8px 32px rgba(0,0,0,0.4),
      inset 0 1px 0 rgba(255,255,255,0.06);
    transition: all 0.3s ease;
    .bob-shine {
      position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
      background: radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.05), transparent 50%);
    }
    .bob-content {
      position: relative; z-index: 2; text-align: center;
      .bob-index { 
        font-size: 10px; 
        color: rgba(150,130,210,0.45); 
        letter-spacing: 2px;
        font-weight: 600;
      }
      .bob-title { 
        font-size: 21px; 
        font-weight: 800; 
        color: #fff; 
        margin: 5px 0;
        text-shadow: 0 2px 10px rgba(0,0,0,0.3);
      }
      .bob-desc { 
        font-size: 11px; 
        color: rgba(190,170,230,0.6);
        margin: 0 0 8px;
      }
      .bob-tag {
        font-size: 9px; letter-spacing: 3px; padding: 3px 10px; border-radius: 10px;
        background: linear-gradient(135deg, rgba(140,100,255,0.12), rgba(120,80,235,0.06));
        color: rgba(190,170,255,0.7);
        border: 1px solid rgba(140,100,255,0.15);
        font-weight: 600;
      }
    }
    .impact-flash {
      position: absolute; inset: -5px; border-radius: 20px;
      background: radial-gradient(circle, rgba(255,220,100,0.5), transparent 70%);
      opacity: 0; pointer-events: none;
      box-shadow: 0 0 20px rgba(255,220,100,0.3);
    }
  }
  &:hover .pendulum-bob {
    border-color: rgba(180,160,240,0.35);
    box-shadow: 
      0 10px 40px rgba(140,100,255,0.15),
      inset 0 1px 0 rgba(255,255,255,0.1);
  }
}
.cradle-footer {
  position: relative; z-index: 10; margin-top: 50px; text-align: center;
  .physics-params {
    display: flex; gap: 35px; justify-content: center; margin-bottom: 18px;
    .param {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      padding: 10px 16px;
      background: rgba(140,100,255,0.04);
      border-radius: 10px;
      border: 1px solid rgba(140,100,255,0.08);
      transition: all 0.2s;
      &:hover {
        border-color: rgba(140,100,255,0.2);
        background: rgba(140,100,255,0.08);
      }
      .param-label { 
        font-size: 14px; 
        color: rgba(190,170,230,0.6); 
        letter-spacing: 2px;
        font-weight: 500;
      }
      .param-value { 
        font-size: 22px; 
        font-weight: 800; 
        color: #fff; 
        font-family: 'Courier New', monospace;
        text-shadow: 0 0 15px rgba(140,100,255,0.3);
      }
      .param-unit { 
        font-size: 10px; 
        color: rgba(150,130,210,0.5);
        font-weight: 500;
      }
    }
  }
  .footer-text { 
    font-size: 12px; 
    letter-spacing: 4px; 
    color: rgba(190,170,230,0.5);
    font-weight: 500;
    text-shadow: 0 0 15px rgba(140,100,255,0.15);
  }
}
@keyframes cradleGlow {
  0% { filter: drop-shadow(0 0 40px rgba(200,200,200,0.35)); }
  100% { filter: drop-shadow(0 0 60px rgba(200,200,200,0.5)); }
}
</style>
