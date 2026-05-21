<template>
  <section ref="containerRef" class="dj-mixer-section">
    <div class="dj-bg">
      <div class="neon-glow left-glow"></div>
      <div class="neon-glow right-glow"></div>
      <div class="grid-floor"></div>
    </div>

    <div class="dj-content">
      <div ref="headerRef" class="dj-header">
        <div ref="badgeRef" class="dj-badge">
          <span class="badge-icon">🎧</span>
          <span>DJ MIXER</span>
        </div>
        <h1 ref="titleRef" class="dj-title">DJ MIXER</h1>
        <p ref="subtitleRef" class="dj-subtitle">双唱片机 · Crossfader · 黑胶律动</p>
      </div>

      <div ref="mixerRef" class="mixer-stage">
        <!-- 左唱片机 -->
        <div class="turntable left-turntable">
          <div class="tt-base">
            <div ref="leftDiscRef" class="vinyl-disc">
              <div class="disc-grooves"></div>
              <div class="disc-label">
                <span class="label-text">DECK A</span>
              </div>
              <div class="disc-shine"></div>
            </div>
            <div class="tt-arm">
              <div class="arm-base"></div>
              <div class="arm-beam"></div>
              <div class="arm-head"></div>
            </div>
          </div>
          <div class="deck-cards">
            <div v-for="(card, i) in leftCards" :key="'l'+i"
              :ref="el => leftCardRefs[i] = el as HTMLElement"
              class="deck-card">
              <div class="card-inner">
                <span class="card-index">{{ String(i + 1).padStart(2, '0') }}</span>
                <h3 class="card-title">{{ card.title }}</h3>
                <p class="card-desc">{{ card.desc }}</p>
                <span class="card-bpm">{{ card.bpm }} BPM</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 中间混音台 -->
        <div class="mixer-center">
          <div class="eq-section">
            <div v-for="ch in ['HI', 'MID', 'LO']" :key="ch" class="eq-knob">
              <div class="knob-ring"></div>
              <span class="knob-label">{{ ch }}</span>
            </div>
          </div>
          <div class="crossfader-section">
            <span class="cf-label">A</span>
            <div class="crossfader-track">
              <div ref="faderRef" class="crossfader-thumb"></div>
            </div>
            <span class="cf-label">B</span>
          </div>
          <div class="vu-meters">
            <div class="vu-meter left-vu">
              <div ref="leftVuRef" class="vu-fill"></div>
            </div>
            <div class="vu-meter right-vu">
              <div ref="rightVuRef" class="vu-fill"></div>
            </div>
          </div>
        </div>

        <!-- 右唱片机 -->
        <div class="turntable right-turntable">
          <div class="tt-base">
            <div ref="rightDiscRef" class="vinyl-disc">
              <div class="disc-grooves"></div>
              <div class="disc-label">
                <span class="label-text">DECK B</span>
              </div>
              <div class="disc-shine"></div>
            </div>
            <div class="tt-arm right-arm">
              <div class="arm-base"></div>
              <div class="arm-beam"></div>
              <div class="arm-head"></div>
            </div>
          </div>
          <div class="deck-cards">
            <div v-for="(card, i) in rightCards" :key="'r'+i"
              :ref="el => rightCardRefs[i] = el as HTMLElement"
              class="deck-card">
              <div class="card-inner">
                <span class="card-index">{{ String(i + 4).padStart(2, '0') }}</span>
                <h3 class="card-title">{{ card.title }}</h3>
                <p class="card-desc">{{ card.desc }}</p>
                <span class="card-bpm">{{ card.bpm }} BPM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref="footerRef" class="dj-footer">
        <div class="now-playing">
          <span class="np-dot"></span>
          <span class="np-text">NOW PLAYING</span>
        </div>
        <p class="footer-text">SCROLL TO CROSSFADE</p>
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
const mixerRef = ref<HTMLElement | null>(null)
const leftDiscRef = ref<HTMLElement | null>(null)
const rightDiscRef = ref<HTMLElement | null>(null)
const faderRef = ref<HTMLElement | null>(null)
const leftVuRef = ref<HTMLElement | null>(null)
const rightVuRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const leftCardRefs = ref<(HTMLElement | null)[]>([])
const rightCardRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: (() => void)[] = []

const leftCards = [
  { title: 'Bass Drop', desc: '低频下潜', bpm: 128 },
  { title: 'Synth Pad', desc: '合成铺底', bpm: 128 },
  { title: 'Hi-Hat', desc: '踩镲律动', bpm: 128 },
]
const rightCards = [
  { title: 'Vocal Chop', desc: '人声切片', bpm: 130 },
  { title: 'Arp Lead', desc: '琶音旋律', bpm: 130 },
  { title: 'FX Riser', desc: '上升音效', bpm: 130 },
]

onMounted(() => {
  if (!containerRef.value) return

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -40, filter: 'blur(12px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 30 })
  const allLeft = leftCardRefs.value.filter(Boolean) as HTMLElement[]
  const allRight = rightCardRefs.value.filter(Boolean) as HTMLElement[]
  gsap.set(allLeft, { opacity: 0, x: -80, scale: 0.8 })
  gsap.set(allRight, { opacity: 0, x: 80, scale: 0.8 })

  // Intro
  const introTl = gsap.timeline({
    scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' }
  })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.12, ease: 'power3.out'
  })
  .to(allLeft, { opacity: 1, x: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(1.3)' }, '-=0.4')
  .to(allRight, { opacity: 1, x: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(1.3)' }, '-=0.5')
  .to(footerRef.value, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
  cleanupFns.push(() => introTl.kill())

  // Vinyl rotation
  const leftSpin = gsap.to(leftDiscRef.value, { rotation: 360, duration: 3, repeat: -1, ease: 'none' })
  const rightSpin = gsap.to(rightDiscRef.value, { rotation: 360, duration: 2.8, repeat: -1, ease: 'none' })
  cleanupFns.push(() => { leftSpin.kill(); rightSpin.kill() })

  // Crossfader scroll
  const cfTl = gsap.timeline({
    scrollTrigger: { trigger: mixerRef.value, start: 'top 70%', end: 'top 10%', scrub: 1.2, immediateRender: false }
  })
  // Fader moves left to right
  cfTl.fromTo(faderRef.value, { x: -40 }, { x: 40, duration: 1 })
  // Left deck fades, right deck grows
  cfTl.to(allLeft, { opacity: 0.3, scale: 0.85, duration: 0.5 }, 0)
  cfTl.to(allRight, { scale: 1.05, duration: 0.5 }, 0)
  // Left disc slows, right disc speeds
  cfTl.to(leftSpin, { timeScale: 0.3, duration: 0.5 }, 0)
  // VU meters
  cfTl.fromTo(leftVuRef.value, { scaleY: 0.8 }, { scaleY: 0.2, duration: 1 }, 0)
  cfTl.fromTo(rightVuRef.value, { scaleY: 0.3 }, { scaleY: 0.9, duration: 1 }, 0)
  cleanupFns.push(() => cfTl.kill())
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.dj-mixer-section {
  width: 100vw;
  height: 100vh;
  background:
    radial-gradient(circle at 25% 50%, rgba(147, 51, 234, 0.12) 0%, transparent 40%),
    radial-gradient(circle at 75% 50%, rgba(236, 72, 153, 0.12) 0%, transparent 40%),
    radial-gradient(circle at 50% 80%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
    linear-gradient(180deg, #08050f 0%, #0f0a1a 50%, #08050f 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dj-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .neon-glow {
    position: absolute;
    width: 350px;
    height: 350px;
    border-radius: 50%;
    filter: blur(100px);
    animation: neonPulse 4s ease-in-out infinite;
    &.left-glow { top: 25%; left: 8%; background: rgba(147, 51, 234, 0.18); }
    &.right-glow { top: 25%; right: 8%; background: rgba(236, 72, 153, 0.18); animation-delay: 2s; }
  }

  .grid-floor {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 45%;
    background:
      linear-gradient(180deg, transparent, rgba(147, 51, 234, 0.04)),
      repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.025) 0px, transparent 1px, transparent 60px),
      repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.025) 0px, transparent 1px, transparent 60px);
    filter: blur(0.5px);
  }
}

@keyframes neonPulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.15); }
}

.dj-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 40px;
  max-width: 1400px;
  width: 100%;
}

.dj-header {
  margin-bottom: 40px;

  .dj-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 32px;
    border-radius: 50px;
    border: 1px solid rgba(147, 51, 234, 0.35);
    background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.06));
    backdrop-filter: blur(12px);
    box-shadow: 
      0 4px 20px rgba(147, 51, 234, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
    margin-bottom: 24px;
    font-size: 11px;
    letter-spacing: 6px;
    color: rgba(210, 170, 255, 0.9);
    transition: all 0.3s ease;
    .badge-icon { 
      font-size: 18px;
      filter: drop-shadow(0 0 10px rgba(147, 51, 234, 0.6));
    }
    &:hover {
      border-color: rgba(167, 71, 254, 0.5);
      box-shadow: 0 6px 30px rgba(147, 51, 234, 0.25);
      transform: translateY(-2px);
    }
  }

  .dj-title {
    font-size: clamp(52px, 7.5vw, 88px);
    font-weight: 900;
    letter-spacing: 10px;
    background: linear-gradient(180deg, #ffffff 0%, #d0a0ff 30%, #a855f7 60%, #7c3aed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 16px;
    filter: drop-shadow(0 0 50px rgba(147, 51, 234, 0.5));
    animation: djGlow 3s ease-in-out infinite alternate;
  }

  .dj-subtitle {
    font-size: 16px;
    color: rgba(200, 180, 255, 0.65);
    letter-spacing: 8px;
    font-weight: 300;
    margin: 0;
    text-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
  }
}

.mixer-stage {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 30px;
}

.turntable {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  .tt-base {
    position: relative;
    width: 220px;
    height: 220px;
    background: radial-gradient(circle, rgba(20, 15, 30, 0.9), rgba(10, 8, 18, 0.95));
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
  }
}

.vinyl-disc {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, #1a1a2e 35%, #0a0a15 36%, #0d0d1a 100%);
  position: relative;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);

  .disc-grooves {
    position: absolute;
    inset: 15px;
    border-radius: 50%;
    background: repeating-radial-gradient(circle, transparent 0px, transparent 2px, rgba(255, 255, 255, 0.03) 3px, transparent 4px);
  }

  .disc-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(147, 51, 234, 0.4), rgba(236, 72, 153, 0.3));
    display: flex;
    align-items: center;
    justify-content: center;

    .label-text {
      font-size: 7px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.8);
      letter-spacing: 1px;
    }
  }

  .disc-shine {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
  }
}

.tt-arm {
  position: absolute;
  top: 15px;
  right: 20px;
  transform-origin: top right;
  transform: rotate(-15deg);

  &.right-arm {
    right: auto;
    left: 20px;
    transform-origin: top left;
    transform: rotate(15deg);
  }

  .arm-base {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(200, 200, 200, 0.3);
    margin-left: auto;
  }
  .arm-beam {
    width: 2px;
    height: 60px;
    background: linear-gradient(180deg, rgba(200, 200, 200, 0.4), rgba(200, 200, 200, 0.2));
    margin-left: auto;
    margin-right: 5px;
  }
  .arm-head {
    width: 8px;
    height: 8px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    margin-left: auto;
    margin-right: 2px;
  }
}

.deck-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 220px;
}

.deck-card {
  position: relative;
  .card-inner {
    position: relative;
    padding: 18px 20px;
    border-radius: 24px;
    background: linear-gradient(180deg, rgba(22, 17, 35, 0.92) 0%, rgba(14, 12, 25, 0.96) 100%);
    border: 1px solid rgba(147, 51, 234, 0.15);
    backdrop-filter: blur(10px);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    text-align: left;
    transition: all 0.3s ease;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 24px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
      pointer-events: none;
    }

    .card-index { 
      font-size: 10px; 
      color: rgba(200, 180, 255, 0.3); 
      letter-spacing: 3px;
      font-weight: 600;
    }
    .card-title { 
      font-size: 19px; 
      font-weight: 800; 
      color: #fff; 
      margin: 6px 0; 
      letter-spacing: 2px;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }
    .card-desc { 
      font-size: 13px; 
      color: rgba(200, 180, 255, 0.55); 
      line-height: 1.5; 
      margin: 0 0 8px;
    }
    .card-bpm {
      display: inline-block;
      padding: 3px 8px;
      background: rgba(147, 51, 234, 0.08);
      border-radius: 6px;
      border: 1px solid rgba(147, 51, 234, 0.12);
      font-size: 11px; 
      font-family: 'Courier New', monospace;
      color: rgba(192, 132, 252, 0.8);
      letter-spacing: 2px;
      font-weight: 600;
    }
  }

  &:hover {
    transform: translateY(-3px);
    .card-inner {
      border-color: rgba(147, 51, 234, 0.35);
      box-shadow: 
        0 12px 40px rgba(147, 51, 234, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }
  }
}

.mixer-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 24px 18px;
  background: linear-gradient(180deg, rgba(18, 14, 30, 0.85), rgba(12, 10, 22, 0.92));
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  min-width: 110px;
  backdrop-filter: blur(10px);
}

.eq-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;

  .eq-knob {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;

    .knob-ring {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.15);
      background: rgba(255, 255, 255, 0.03);
      position: relative;

      &::after {
        content: '';
        position: absolute;
        top: 3px;
        left: 50%;
        width: 2px;
        height: 8px;
        background: rgba(255, 255, 255, 0.4);
        transform: translateX(-50%);
        border-radius: 1px;
      }
    }

    .knob-label { font-size: 8px; color: rgba(255, 255, 255, 0.3); letter-spacing: 2px; }
  }
}

.crossfader-section {
  display: flex;
  align-items: center;
  gap: 8px;

  .cf-label { font-size: 10px; color: rgba(255, 255, 255, 0.3); font-weight: 700; }

  .crossfader-track {
    width: 80px;
    height: 6px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 3px;
    position: relative;

    .crossfader-thumb {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 14px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15));
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
  }
}

.vu-meters {
  display: flex;
  gap: 8px;

  .vu-meter {
    width: 8px;
    height: 60px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    align-items: flex-end;

    .vu-fill {
      width: 100%;
      border-radius: 4px;
      transform-origin: bottom;
    }

    &.left-vu .vu-fill { background: linear-gradient(180deg, #ef4444, #eab308, #22c55e); height: 100%; }
    &.right-vu .vu-fill { background: linear-gradient(180deg, #ef4444, #eab308, #22c55e); height: 100%; }
  }
}

.dj-footer {
  margin-top: 40px;

  .now-playing {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    padding: 6px 14px;
    background: rgba(34, 197, 94, 0.06);
    border-radius: 20px;
    border: 1px solid rgba(34, 197, 94, 0.12);

    .np-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 12px rgba(34, 197, 94, 0.6);
      animation: npBlink 1.5s ease-in-out infinite;
    }
    .np-text { 
      font-size: 11px; 
      color: rgba(34, 197, 94, 0.8); 
      letter-spacing: 3px;
      font-weight: 600;
    }
  }

  .footer-text {
    font-size: 14px;
    letter-spacing: 4px;
    color: rgba(200, 180, 255, 0.45);
    margin: 0;
    font-weight: 500;
    text-shadow: 0 0 15px rgba(147, 51, 234, 0.2);
  }
}

@keyframes npBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
@keyframes djGlow {
  0% { filter: drop-shadow(0 0 40px rgba(147, 51, 234, 0.45)); }
  100% { filter: drop-shadow(0 0 60px rgba(147, 51, 234, 0.6)); }
}
</style>


