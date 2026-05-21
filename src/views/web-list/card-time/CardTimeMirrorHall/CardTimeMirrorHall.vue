<template>
  <section ref="containerRef" class="mirror-hall-section">
    <div class="mirror-bg">
      <div class="bg-pattern"></div>
    </div>
    <div ref="headerRef" class="mirror-header">
      <div ref="badgeRef" class="mirror-badge">
        <span class="badge-icon">🪞</span>
        <span class="badge-text">INFINITE REFLECTION</span>
      </div>
      <h1 ref="titleRef" class="mirror-title">MIRROR HALL</h1>
      <p ref="subtitleRef" class="mirror-subtitle">无限镜像 · 递归缩小 · 深渊凝视</p>
    </div>
    <div ref="hallRef" class="mirror-hall" :style="{ perspective: '1200px' }">
      <!-- 镜像层：从外到内递归 -->
      <div v-for="layer in LAYERS" :key="layer"
        :ref="el => layerRefs[layer] = el as HTMLElement"
        class="mirror-layer"
        :style="{
          transform: `translateZ(${-layer * 80}px) scale(${1 - layer * 0.1})`,
          opacity: 1 - layer * 0.1,
          zIndex: LAYERS - layer
        }">
        <!-- 镜框 -->
        <div class="mirror-frame" :style="{ borderColor: `hsla(${40 + layer * 5}, 60%, ${50 - layer * 3}%, ${0.5 - layer * 0.04})` }">
          <!-- 卡片组 -->
          <div class="frame-cards">
            <div v-for="(card, ci) in cards" :key="'c'+ci"
              class="mirror-card"
              :style="{ '--hue': card.hue, transform: layer % 2 === 1 ? 'scaleX(-1)' : '' }">
              <div class="mc-inner">
                <span class="mc-index">{{ String(ci + 1).padStart(2, '0') }}</span>
                <h3 class="mc-title">{{ card.title }}</h3>
                <p class="mc-desc">{{ card.desc }}</p>
              </div>
            </div>
          </div>
          <!-- 镜面反光 -->
          <div class="frame-shine" :style="{ opacity: 0.03 + layer * 0.01 }"></div>
        </div>
      </div>
    </div>
    <div ref="footerRef" class="mirror-footer">
      <div class="depth-indicator">
        <span v-for="i in LAYERS" :key="'d'+i" class="depth-dot"
          :style="{ opacity: 0.3 + (LAYERS - i) * 0.1 }"></span>
      </div>
      <span class="footer-text">SCROLL TO ENTER THE ABYSS</span>
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
const hallRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const layerRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: (() => void)[] = []

const LAYERS = 7

const cards = [
  { title: 'Reflect', desc: '映射', hue: 200 },
  { title: 'Infinite', desc: '无限', hue: 260 },
  { title: 'Depth', desc: '深渊', hue: 320 },
]

onMounted(() => {
  if (!containerRef.value) return
  const layers = layerRefs.value.filter(Boolean) as HTMLElement[]

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -30, filter: 'blur(10px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 20 })
  // Hide deeper layers initially
  layers.forEach((l, i) => {
    if (i > 0) gsap.set(l, { opacity: 0, scale: 0.5 })
  })

  const introTl = gsap.timeline({
    scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' }
  })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power3.out'
  })
  .to(footerRef.value, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
  cleanupFns.push(() => introTl.kill())

  // Scroll reveals deeper mirror layers
  const mirrorTl = gsap.timeline({
    scrollTrigger: {
      trigger: hallRef.value,
      start: 'top 75%',
      end: 'top 15%',
      scrub: 1,
      immediateRender: false
    }
  })

  layers.forEach((l, i) => {
    if (i === 0) return
    mirrorTl.to(l, {
      opacity: 1 - i * 0.1,
      scale: 1,
      duration: 0.15,
      ease: 'power2.out'
    }, i * 0.1)
  })

  // Zoom into the tunnel
  mirrorTl.to(hallRef.value, {
    z: 200,
    duration: 0.5,
    ease: 'power1.in'
  }, 0.3)

  cleanupFns.push(() => mirrorTl.kill())

  // Ambient breathing
  layers.forEach((l, i) => {
    const tw = gsap.to(l, {
      z: `+=${3 + i * 2}`,
      duration: 3 + i * 0.5,
      repeat: -1, yoyo: true, ease: 'sine.inOut'
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
.mirror-hall-section {
  width: 100vw; height: 100vh;
  background: 
    radial-gradient(circle at 50% 50%, rgba(200,180,120,0.06) 0%, transparent 50%),
    linear-gradient(180deg, #0a0810 0%, #0d0a15 50%, #0a0810 100%);
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.mirror-bg {
  position: absolute; inset: 0; pointer-events: none;
  .bg-pattern {
    position: absolute; inset: 0;
    background-image: repeating-linear-gradient(90deg, rgba(180,160,100,0.03) 0px, transparent 1px, transparent 80px);
  }
}
.mirror-header {
  position: relative; z-index: 10; text-align: center; margin-bottom: 50px;
  .mirror-badge {
    display: inline-flex; align-items: center; gap: 8px; padding: 12px 32px;
    border-radius: 50px; 
    border: 1px solid rgba(200,180,120,0.25);
    background: linear-gradient(135deg, rgba(200,180,120,0.08), rgba(180,160,100,0.04));
    backdrop-filter: blur(12px);
    box-shadow: 
      0 4px 20px rgba(200,180,120,0.12),
      inset 0 1px 0 rgba(255,255,255,0.06);
    margin-bottom: 16px;
    font-size: 11px; letter-spacing: 6px; 
    color: rgba(230,210,160,0.9);
    transition: all 0.3s ease;
    .badge-icon { 
      font-size: 16px;
      filter: drop-shadow(0 0 10px rgba(200,180,120,0.5));
    }
    &:hover {
      border-color: rgba(220,200,140,0.4);
      box-shadow: 0 6px 30px rgba(200,180,120,0.2);
      transform: translateY(-2px);
    }
  }
  .mirror-title {
    font-size: clamp(52px, 7.5vw, 88px); 
    font-weight: 900; 
    letter-spacing: 10px;
    background: linear-gradient(180deg, #ffffff 0%, #f0d880 30%, #d0b060 60%, #c0a050 100%);
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 12px;
    filter: drop-shadow(0 0 50px rgba(200,180,120,0.4));
    animation: mirrorGlow 3s ease-in-out infinite alternate;
  }
  .mirror-subtitle { 
    font-size: 16px; 
    color: rgba(210,190,150,0.65); 
    letter-spacing: 8px;
    font-weight: 300;
    margin: 0;
    text-shadow: 0 0 20px rgba(200,180,120,0.2);
  }
}
.mirror-hall {
  position: relative; z-index: 10; width: 80%; max-width: 700px; height: 360px;
  transform-style: preserve-3d;
}
.mirror-layer {
  position: absolute; inset: 0;
  transform-style: preserve-3d;
  .mirror-frame {
    width: 100%; height: 100%;
    border: 3px solid rgba(200,180,120,0.35);
    border-radius: 12px;
    padding: 18px;
    position: relative;
    background: linear-gradient(180deg, rgba(12,10,18,0.65), rgba(10,8,16,0.7));
    box-shadow: 
      0 0 30px rgba(200,180,120,0.1),
      inset 0 0 40px rgba(0,0,0,0.3);
    .frame-shine {
      position: absolute; inset: 0; border-radius: 10px;
      background: linear-gradient(135deg, rgba(255,255,255,0.06), transparent 40%, rgba(255,255,255,0.03));
      pointer-events: none;
    }
  }
}
.frame-cards {
  display: flex; gap: 14px; height: 100%; align-items: center; justify-content: center;
}
.mirror-card {
  flex: 1; max-width: 180px; height: 80%;
  .mc-inner {
    height: 100%; padding: 18px; border-radius: 24px;
    background: linear-gradient(145deg, rgba(22,18,32,0.92), rgba(16,14,24,0.96));
    border: 1px solid hsla(var(--hue), 30%, 40%, 0.2);
    box-shadow: 
      0 4px 16px rgba(0,0,0,0.3),
      inset 0 1px 0 rgba(255,255,255,0.05);
    display: flex; flex-direction: column; gap: 8px;
    transition: all 0.3s ease;
    .mc-index { 
      font-size: 10px; 
      color: rgba(255,255,255,0.3); 
      letter-spacing: 2px;
      font-weight: 600;
    }
    .mc-title { 
      font-size: 17px; 
      font-weight: 800; 
      color: #fff; 
      margin: 0;
      text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    .mc-desc { 
      font-size: 12px; 
      color: rgba(210,190,230,0.5);
      margin: 0;
    }
  }
  &:hover .mc-inner {
    border-color: hsla(var(--hue), 40%, 50%, 0.35);
    box-shadow: 
      0 6px 24px rgba(0,0,0,0.4),
      inset 0 1px 0 rgba(255,255,255,0.08);
  }
}
.mirror-footer {
  position: relative; z-index: 10; margin-top: 50px; text-align: center;
  .depth-indicator {
    display: flex; gap: 8px; justify-content: center; margin-bottom: 12px;
    .depth-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: rgba(200,180,120,0.5);
      box-shadow: 0 0 10px rgba(200,180,120,0.3);
      transition: all 0.3s;
    }
  }
  .footer-text { 
    font-size: 14px; 
    letter-spacing: 4px; 
    color: rgba(210,190,150,0.45);
    font-weight: 500;
    text-shadow: 0 0 15px rgba(200,180,120,0.15);
  }
}
@keyframes mirrorGlow {
  0% { filter: drop-shadow(0 0 40px rgba(200,180,120,0.35)); }
  100% { filter: drop-shadow(0 0 60px rgba(200,180,120,0.5)); }
}
</style>

