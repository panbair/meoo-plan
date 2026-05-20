<template>
  <section ref="containerRef" class="soundwave-section">
    <div class="wave-bg">
      <div class="freq-ambient"></div>
    </div>
    <div class="wave-content">
      <div ref="headerRef" class="wave-header">
        <div ref="badgeRef" class="wave-badge">
          <span class="badge-icon">🔊</span>
          <span>FREQUENCY</span>
        </div>
        <h1 ref="titleRef" class="wave-title">SOUND WAVE</h1>
        <p ref="subtitleRef" class="wave-subtitle">声波共振 · 均衡器 · 频率可视化</p>
      </div>

      <div ref="eqRef" class="equalizer-container">
        <!-- 频段标签 -->
        <div class="freq-labels">
          <span v-for="(band, i) in bands" :key="'fl'+i" class="freq-label">{{ band.freq }}</span>
        </div>
        <!-- 频谱柱 -->
        <div class="eq-bars">
          <div v-for="(band, i) in bands" :key="'b'+i"
            :ref="el => barRefs[i] = el as HTMLElement"
            class="eq-bar-wrapper">
            <div class="eq-bar" :style="{ '--bar-hue': band.hue }">
              <div class="bar-fill" :style="{ height: band.initHeight + '%' }"></div>
              <div class="bar-peak"></div>
            </div>
            <div class="bar-card">
              <div class="card-inner">
                <span class="card-index">{{ String(i + 1).padStart(2, '0') }}</span>
                <h3 class="card-title">{{ band.title }}</h3>
                <p class="card-desc">{{ band.desc }}</p>
                <span class="card-tag">{{ band.freq }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- dB刻度 -->
        <div class="db-scale">
          <span v-for="db in ['+12', '+6', '0', '-6', '-12']" :key="db" class="db-mark">{{ db }}dB</span>
        </div>
      </div>

      <div ref="footerRef" class="wave-footer">
        <div class="waveform-mini">
          <svg viewBox="0 0 200 30" width="200" height="30">
            <path d="M0,15 Q10,5 20,15 Q30,25 40,15 Q50,5 60,15 Q70,25 80,15 Q90,5 100,15 Q110,25 120,15 Q130,5 140,15 Q150,25 160,15 Q170,5 180,15 Q190,25 200,15"
              fill="none" stroke="rgba(34,197,94,0.4)" stroke-width="1.5"/>
          </svg>
        </div>
        <p class="footer-text">SCROLL TO RESONATE</p>
      </div>
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
const eqRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const barRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: (() => void)[] = []

const bands = [
  { title: 'Sub Bass', desc: '超低频', freq: '32Hz', hue: 0, initHeight: 20 },
  { title: 'Bass', desc: '低频', freq: '64Hz', hue: 30, initHeight: 25 },
  { title: 'Low Mid', desc: '中低频', freq: '125Hz', hue: 60, initHeight: 30 },
  { title: 'Mid', desc: '中频', freq: '250Hz', hue: 120, initHeight: 40 },
  { title: 'High Mid', desc: '中高频', freq: '500Hz', hue: 180, initHeight: 35 },
  { title: 'Presence', desc: '临场感', freq: '1kHz', hue: 220, initHeight: 45 },
  { title: 'Brilliance', desc: '亮度', freq: '4kHz', hue: 260, initHeight: 30 },
  { title: 'Air', desc: '空气感', freq: '16kHz', hue: 300, initHeight: 15 },
]

onMounted(() => {
  if (!containerRef.value) return
  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -40, filter: 'blur(12px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 30 })
  const allBars = barRefs.value.filter(Boolean) as HTMLElement[]
  gsap.set(allBars, { opacity: 0, scaleY: 0, transformOrigin: 'bottom center' })

  const introTl = gsap.timeline({
    scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' }
  })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.12, ease: 'power3.out'
  })
  .to(allBars, { opacity: 1, scaleY: 1, duration: 0.6, stagger: 0.05, ease: 'elastic.out(1, 0.6)' }, '-=0.4')
  .to(footerRef.value, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
  cleanupFns.push(() => introTl.kill())

  // EQ animation on scroll
  const eqTl = gsap.timeline({
    scrollTrigger: { trigger: eqRef.value, start: 'top 70%', end: 'top 10%', scrub: 1, immediateRender: false }
  })
  allBars.forEach((bar, i) => {
    const fill = bar.querySelector('.bar-fill')
    if (fill) {
      eqTl.to(fill, {
        height: `${40 + Math.sin(i * 0.8) * 30 + 30}%`,
        duration: 0.3,
        ease: 'power2.out'
      }, i * 0.05)
    }
  })
  cleanupFns.push(() => eqTl.kill())

  // Continuous wave animation
  allBars.forEach((bar, i) => {
    const fill = bar.querySelector('.bar-fill')
    if (fill) {
      const tw = gsap.to(fill, {
        height: `+=${10 + Math.random() * 15}%`,
        duration: 0.8 + Math.random() * 0.6,
        repeat: -1, yoyo: true, ease: 'sine.inOut',
        delay: i * 0.1
      })
      cleanupFns.push(() => tw.kill())
    }
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.soundwave-section {
  width: 100vw;
  height: 100vh;
  background:
    radial-gradient(circle at 50% 60%, rgba(34, 197, 94, 0.06) 0%, transparent 40%),
    radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.05) 0%, transparent 40%),
    linear-gradient(180deg, #060a08 0%, #0a100c 50%, #060a08 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wave-bg {
  position: absolute; inset: 0; pointer-events: none;
  .freq-ambient {
    position: absolute; bottom: 0; left: 0; right: 0; height: 50%;
    background: linear-gradient(180deg, transparent, rgba(34, 197, 94, 0.02));
  }
}

.wave-content {
  position: relative; z-index: 10; text-align: center;
  padding: 40px; max-width: 1200px; width: 100%;
}

.wave-header {
  margin-bottom: 40px;

  .wave-badge {
    display: inline-flex; align-items: center; gap: 10px; padding: 10px 28px;
    border-radius: 40px; border: 1px solid rgba(34, 197, 94, 0.3);
    background: rgba(34, 197, 94, 0.08); backdrop-filter: blur(10px);
    margin-bottom: 24px; font-size: 11px; letter-spacing: 5px;
    color: rgba(134, 239, 172, 0.9);
    .badge-icon { font-size: 16px; }
  }

  .wave-title {
    font-size: clamp(48px, 7vw, 80px); font-weight: 800; letter-spacing: 8px;
    background: linear-gradient(180deg, #fff 0%, #86efac 50%, #22c55e 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    margin: 0 0 16px; filter: drop-shadow(0 0 40px rgba(34, 197, 94, 0.4));
  }

  .wave-subtitle {
    font-size: 16px; color: rgba(255, 255, 255, 0.5); letter-spacing: 6px; margin: 0;
  }
}

.equalizer-container {
  position: relative;
  background: rgba(10, 16, 12, 0.7);
  border-radius: 24px;
  border: 1px solid rgba(34, 197, 94, 0.08);
  padding: 30px 20px;
}

.freq-labels {
  display: flex; justify-content: space-around; margin-bottom: 12px;
  .freq-label {
    font-size: 10px; color: rgba(134, 239, 172, 0.4);
    font-family: 'Courier New', monospace; letter-spacing: 1px;
  }
}

.eq-bars {
  display: flex; gap: 12px; justify-content: center;
  align-items: flex-end; height: 280px;
}

.eq-bar-wrapper {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  flex: 1; max-width: 120px;
}

.eq-bar {
  width: 100%; height: 180px; position: relative;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px; overflow: hidden;
  display: flex; align-items: flex-end;

  .bar-fill {
    width: 100%;
    border-radius: 8px 8px 0 0;
    background: linear-gradient(180deg,
      hsla(var(--bar-hue), 70%, 55%, 0.9),
      hsla(var(--bar-hue), 60%, 35%, 0.7));
    box-shadow: 0 0 15px hsla(var(--bar-hue), 60%, 50%, 0.2);
    transition: height 0.1s ease-out;
  }

  .bar-peak {
    position: absolute; top: 10%; left: 0; right: 0; height: 2px;
    background: hsla(var(--bar-hue), 80%, 70%, 0.6);
    box-shadow: 0 0 8px hsla(var(--bar-hue), 80%, 60%, 0.3);
  }
}

.bar-card {
  width: 100%;

  .card-inner {
    padding: 14px 12px;
    border-radius: 16px;
    background: linear-gradient(180deg, rgba(15, 22, 18, 0.9), rgba(10, 16, 12, 0.95));
    border: 1px solid rgba(34, 197, 94, 0.06);
    text-align: center;

    .card-index { font-size: 9px; color: rgba(255, 255, 255, 0.2); letter-spacing: 2px; }
    .card-title { font-size: 14px; font-weight: 700; color: #fff; margin: 4px 0; letter-spacing: 1px; }
    .card-desc { font-size: 11px; color: rgba(255, 255, 255, 0.4); margin: 0 0 6px; }
    .card-tag {
      font-size: 9px; letter-spacing: 2px; padding: 3px 10px; border-radius: 12px;
      background: rgba(34, 197, 94, 0.08); color: rgba(134, 239, 172, 0.6);
      font-family: 'Courier New', monospace;
    }
  }
}

.db-scale {
  position: absolute; right: 10px; top: 60px; bottom: 40px;
  display: flex; flex-direction: column; justify-content: space-between;
  .db-mark {
    font-size: 8px; color: rgba(255, 255, 255, 0.15);
    font-family: 'Courier New', monospace;
  }
}

.wave-footer {
  margin-top: 50px;

  .waveform-mini {
    display: flex; justify-content: center; margin-bottom: 16px;
  }

  .footer-text {
    font-size: 14px; letter-spacing: 3px; color: rgba(255, 255, 255, 0.4); margin: 0;
  }
}
</style>

