<template>
  <section ref="containerRef" class="zoetrope-section">
    <div class="zoetrope-bg"><div class="vintage-grain"></div></div>
    <div ref="headerRef" class="zoe-header">
      <div ref="badgeRef" class="zoe-badge"><span>🎠</span><span>PERSISTENCE OF VISION</span></div>
      <h1 ref="titleRef" class="zoe-title">ZOETROPE</h1>
      <p ref="subtitleRef" class="zoe-subtitle">走马灯 · 旋转幻影 · 视觉暂留</p>
    </div>
    <div ref="drumRef" class="zoetrope-drum" :style="{ perspective: '800px' }">
      <!-- 狭缝遮罩 -->
      <div class="slit-mask">
        <div v-for="s in TOTAL" :key="'slit'+s" class="slit"
          :style="{ transform: `rotateY(${(s-1) * (360/TOTAL)}deg) translateZ(220px)` }"></div>
      </div>
      <!-- 3D圆筒内壁卡片 -->
      <div ref="cylinderRef" class="cylinder">
        <div v-for="(card, i) in cards" :key="i"
          :ref="el => cardRefs[i] = el as HTMLElement"
          class="cylinder-panel"
          :style="{ transform: `rotateY(${i * (360/TOTAL)}deg) translateZ(200px)` }">
          <div class="panel-inner">
            <div class="frame-number">{{ String(i + 1).padStart(2, '0') }}</div>
            <div class="panel-icon">{{ card.icon }}</div>
            <h3 class="panel-title">{{ card.title }}</h3>
            <p class="panel-desc">{{ card.desc }}</p>
          </div>
        </div>
      </div>
    </div>
    <div ref="footerRef" class="zoe-footer">
      <div class="speed-dial">
        <svg viewBox="0 0 60 30" width="80" height="40">
          <path d="M5,28 A25,25 0 0,1 55,28" fill="none" stroke="rgba(200,180,140,0.15)" stroke-width="3"/>
          <circle ref="dialRef" cx="30" cy="28" r="3" fill="rgba(255,200,100,0.6)"/>
        </svg>
        <span class="speed-label">RPM</span>
      </div>
      <span class="footer-text">SCROLL TO SPIN</span>
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
const drumRef = ref<HTMLElement | null>(null)
const cylinderRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const dialRef = ref<SVGCircleElement | null>(null)
const cardRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: (() => void)[] = []

const TOTAL = 10

const cards = [
  { icon: '🐎', title: 'Frame 1', desc: '奔腾起步' },
  { icon: '🐎', title: 'Frame 2', desc: '前蹄抬起' },
  { icon: '🐎', title: 'Frame 3', desc: '腾空飞跃' },
  { icon: '🐎', title: 'Frame 4', desc: '悬空滑翔' },
  { icon: '🐎', title: 'Frame 5', desc: '后蹄着地' },
  { icon: '🐎', title: 'Frame 6', desc: '重心前移' },
  { icon: '🐎', title: 'Frame 7', desc: '蓄力冲刺' },
  { icon: '🐎', title: 'Frame 8', desc: '全速奔驰' },
  { icon: '🐎', title: 'Frame 9', desc: '风驰电掣' },
  { icon: '🐎', title: 'Frame 10', desc: '循环开始' },
]

onMounted(() => {
  if (!containerRef.value || !cylinderRef.value) return

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -30, filter: 'blur(10px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 20 })
  gsap.set(cylinderRef.value, { rotateY: 0 })

  const introTl = gsap.timeline({
    scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' }
  })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power3.out'
  }).to(footerRef.value, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
  cleanupFns.push(() => introTl.kill())

  // Zoetrope spin driven by scroll
  const spinTl = gsap.to(cylinderRef.value, {
    rotateY: 720, // 2 full rotations
    ease: 'none',
    scrollTrigger: {
      trigger: drumRef.value,
      start: 'top 75%',
      end: 'top 5%',
      scrub: 0.8,
      onUpdate: (self) => {
        // Move dial indicator
        if (dialRef.value) {
          const angle = -90 + self.progress * 180 // -90 to 90 degrees
          const rad = angle * Math.PI / 180
          const cx = 30 + Math.cos(rad) * 23
          const cy = 28 - Math.sin(rad) * 23
          dialRef.value.setAttribute('cx', String(cx))
          dialRef.value.setAttribute('cy', String(cy))
        }
      }
    }
  })
  cleanupFns.push(() => spinTl.kill())
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.zoetrope-section {
  width: 100vw; height: 100vh;
  background: linear-gradient(180deg, #0e0c08 0%, #1a1610 50%, #0e0c08 100%);
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.zoetrope-bg {
  position: absolute; inset: 0; pointer-events: none;
  .vintage-grain {
    position: absolute; inset: 0; opacity: 0.3;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
  }
}
.zoe-header {
  position: relative; z-index: 10; text-align: center; margin-bottom: 50px;
  .zoe-badge {
    display: inline-flex; align-items: center; gap: 8px; padding: 10px 28px;
    border-radius: 40px; border: 1px solid rgba(200,180,120,0.15);
    background: rgba(200,180,120,0.05); backdrop-filter: blur(10px); margin-bottom: 12px;
    font-size: 11px; letter-spacing: 5px; color: rgba(220,200,140,0.7);
  }
  .zoe-title {
    font-size: clamp(48px, 7vw, 80px); font-weight: 800; letter-spacing: 8px;
    background: linear-gradient(180deg, #fff 0%, #d0c080 50%, #b0a060 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 8px; filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.2));
  }
  .zoe-subtitle { font-size: 16px; color: rgba(200,180,130,0.5); letter-spacing: 6px; margin: 0; }
}
.zoetrope-drum {
  position: relative; z-index: 10; width: 450px; height: 320px;
  display: flex; align-items: center; justify-content: center;
}
.slit-mask {
  position: absolute; inset: 0;
  transform-style: preserve-3d;
  pointer-events: none; z-index: 5;
  .slit {
    position: absolute; top: 0; left: 50%; width: 3px; height: 100%;
    transform-origin: center center;
    background: rgba(200,180,120,0.06);
    margin-left: -1.5px;
  }
}
.cylinder {
  position: relative; width: 100%; height: 100%;
  transform-style: preserve-3d;
  will-change: transform;
}
.cylinder-panel {
  position: absolute; top: 50%; left: 50%;
  width: 120px; height: 160px;
  margin-left: -60px; margin-top: -80px;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  .panel-inner {
    width: 100%; height: 100%; padding: 24px 20px; border-radius: 24px;
    background: linear-gradient(145deg, rgba(30,26,18,0.95), rgba(24,20,14,0.98));
    border: 1px solid rgba(200,180,120,0.1);
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    text-align: center;
    .frame-number {
      font-size: 9px; color: rgba(200,180,120,0.3); letter-spacing: 2px;
      font-family: 'Courier New', monospace;
    }
    .panel-icon { font-size: 30px; margin: 6px 0; }
    .panel-title { font-size: 20px; font-weight: 700; color: #fff; margin: 0; }
    .panel-desc { font-size: 9px; color: rgba(200,180,140,0.5); margin: 0; }
  }
}
.zoe-footer {
  position: relative; z-index: 10; margin-top: 50px; text-align: center;
  .speed-dial {
    display: flex; flex-direction: column; align-items: center; gap: 4px; margin-bottom: 8px;
    .speed-label { font-size: 9px; color: rgba(200,180,130,0.4); letter-spacing: 3px; }
  }
  .footer-text { font-size: 14px; letter-spacing: 3px; color: rgba(200,180,130,0.3); }
}
</style>

