<template>
  <section ref="containerRef" class="metronome-section">
    <div class="metro-bg">
      <div class="beat-pulse" ref="beatPulseRef"></div>
    </div>
    <div class="metro-content">
      <div ref="headerRef" class="metro-header">
        <div ref="badgeRef" class="metro-badge">
          <span class="badge-icon">🎵</span>
          <span>METRONOME</span>
        </div>
        <h1 ref="titleRef" class="metro-title">METRONOME</h1>
        <p ref="subtitleRef" class="metro-subtitle">节拍器 · 左右摆锤 · 律动入场</p>
      </div>

      <div ref="stageRef" class="metro-stage">
        <!-- 节拍器结构 -->
        <div class="metronome-body">
          <div class="metro-base"></div>
          <div class="metro-scale">
            <span v-for="i in 7" :key="i" class="scale-mark" :style="{ transform: `rotate(${(i-4)*12}deg)` }"></span>
          </div>
          <div ref="pendulumRef" class="pendulum">
            <div class="pendulum-rod"></div>
            <div class="pendulum-weight"></div>
            <div class="pendulum-tip"></div>
          </div>
        </div>

        <!-- BPM显示 -->
        <div class="bpm-display">
          <span class="bpm-value" ref="bpmRef">120</span>
          <span class="bpm-label">BPM</span>
        </div>

        <!-- 卡片区域 -->
        <div class="beat-cards">
          <div v-for="(card, i) in cards" :key="i"
            :ref="el => cardRefs[i] = el as HTMLElement"
            class="beat-card" :class="{ 'on-beat': i % 2 === 0 }">
            <div class="card-beat-indicator">
              <span class="beat-num">{{ i + 1 }}</span>
            </div>
            <div class="card-inner">
              <span class="card-index">{{ String(i + 1).padStart(2, '0') }}</span>
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-desc">{{ card.desc }}</p>
              <div class="card-footer">
                <span class="card-tag">{{ card.tag }}</span>
                <span class="card-beat-type">{{ card.beat }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref="footerRef" class="metro-footer">
        <div class="beat-dots">
          <span v-for="i in 4" :key="'bd'+i" class="beat-dot" :class="{ active: i === 1 }"></span>
        </div>
        <p class="footer-text">TICK · TOCK · TICK · TOCK</p>
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
const stageRef = ref<HTMLElement | null>(null)
const pendulumRef = ref<HTMLElement | null>(null)
const beatPulseRef = ref<HTMLElement | null>(null)
const bpmRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const cardRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: (() => void)[] = []

const cards = [
  { title: 'Downbeat', desc: '强拍冲击', tag: 'STRONG', beat: '1' },
  { title: 'Upbeat', desc: '弱拍过渡', tag: 'WEAK', beat: '&' },
  { title: 'Accent', desc: '重音标记', tag: 'ACCENT', beat: '2' },
  { title: 'Ghost', desc: '幽灵音符', tag: 'GHOST', beat: 'e' },
  { title: 'Synco', desc: '切分节奏', tag: 'SYNCO', beat: '3' },
  { title: 'Fill', desc: '过门加花', tag: 'FILL', beat: '4' },
]

onMounted(() => {
  if (!containerRef.value) return
  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -40, filter: 'blur(12px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 30 })
  const allCards = cardRefs.value.filter(Boolean) as HTMLElement[]
  gsap.set(allCards, { opacity: 0, y: 60, scale: 0.7 })

  const introTl = gsap.timeline({
    scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' }
  })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.12, ease: 'power3.out'
  })
  .to(footerRef.value, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
  cleanupFns.push(() => introTl.kill())

  // Pendulum swing
  gsap.set(pendulumRef.value, { rotation: -30, transformOrigin: 'bottom center' })
  const swing = gsap.to(pendulumRef.value, {
    rotation: 30, duration: 0.5, repeat: -1, yoyo: true, ease: 'sine.inOut',
    onRepeat: () => {
      // Beat pulse
      gsap.fromTo(beatPulseRef.value, { scale: 0.8, opacity: 0.3 }, { scale: 1.5, opacity: 0, duration: 0.4 })
    }
  })
  cleanupFns.push(() => swing.kill())

  // Cards enter on scroll, staggered like beats
  const beatTl = gsap.timeline({
    scrollTrigger: { trigger: stageRef.value, start: 'top 70%', end: 'top 15%', scrub: 1.5, immediateRender: false }
  })
  allCards.forEach((card, i) => {
    beatTl.to(card, {
      opacity: 1, y: 0, scale: 1,
      duration: 0.12,
      ease: 'back.out(2)'
    }, i * 0.12)
  })
  cleanupFns.push(() => beatTl.kill())
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.metronome-section {
  width: 100vw;
  height: 100vh;
  background:
    radial-gradient(circle at 50% 40%, rgba(234, 179, 8, 0.06) 0%, transparent 40%),
    radial-gradient(circle at 50% 80%, rgba(234, 88, 12, 0.04) 0%, transparent 40%),
    linear-gradient(180deg, #0c0a06 0%, #141008 50%, #0c0a06 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metro-bg {
  position: absolute; inset: 0; pointer-events: none;
  .beat-pulse {
    position: absolute; top: 35%; left: 50%; transform: translate(-50%, -50%);
    width: 200px; height: 200px; border-radius: 50%;
    background: radial-gradient(circle, rgba(234, 179, 8, 0.1), transparent 70%);
    opacity: 0;
  }
}

.metro-content {
  position: relative; z-index: 10; text-align: center;
  padding: 40px; max-width: 1200px; width: 100%;
}

.metro-header {
  margin-bottom: 40px;

  .metro-badge {
    display: inline-flex; align-items: center; gap: 10px; padding: 10px 28px;
    border-radius: 40px; border: 1px solid rgba(234, 179, 8, 0.3);
    background: rgba(234, 179, 8, 0.08); backdrop-filter: blur(10px);
    margin-bottom: 24px; font-size: 11px; letter-spacing: 5px;
    color: rgba(253, 224, 71, 0.9);
    .badge-icon { font-size: 16px; }
  }

  .metro-title {
    font-size: clamp(48px, 7vw, 80px); font-weight: 800; letter-spacing: 8px;
    background: linear-gradient(180deg, #fff 0%, #fde047 50%, #eab308 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    margin: 0 0 16px; filter: drop-shadow(0 0 40px rgba(234, 179, 8, 0.4));
  }

  .metro-subtitle {
    font-size: 16px; color: rgba(255, 255, 255, 0.5); letter-spacing: 6px; margin: 0;
  }
}

.metro-stage {
  display: flex; flex-direction: column; align-items: center; gap: 30px;
}

.metronome-body {
  position: relative; width: 120px; height: 180px;
  display: flex; flex-direction: column; align-items: center;

  .metro-base {
    position: absolute; bottom: 0; width: 80px; height: 30px;
    background: linear-gradient(180deg, rgba(60, 50, 30, 0.6), rgba(40, 35, 20, 0.8));
    border-radius: 8px; clip-path: polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%);
  }

  .metro-scale {
    position: absolute; top: 30px; width: 120px; height: 120px;
    .scale-mark {
      position: absolute; top: 0; left: 50%; width: 1px; height: 15px;
      background: rgba(234, 179, 8, 0.2); transform-origin: bottom center;
      margin-left: -0.5px;
    }
  }

  .pendulum {
    position: absolute; bottom: 30px; left: 50%;
    transform-origin: bottom center;

    .pendulum-rod {
      width: 2px; height: 120px; margin-left: -1px;
      background: linear-gradient(180deg, rgba(234, 179, 8, 0.6), rgba(234, 179, 8, 0.2));
    }
    .pendulum-weight {
      width: 16px; height: 10px; margin-left: -8px; margin-top: -30px;
      background: linear-gradient(180deg, rgba(234, 179, 8, 0.8), rgba(200, 150, 0, 0.6));
      border-radius: 4px;
    }
    .pendulum-tip {
      width: 6px; height: 6px; margin-left: -3px; margin-top: -2px;
      background: rgba(234, 179, 8, 0.9); border-radius: 50%;
      box-shadow: 0 0 12px rgba(234, 179, 8, 0.5);
    }
  }
}

.bpm-display {
  display: flex; align-items: baseline; gap: 6px;
  .bpm-value {
    font-size: 36px; font-weight: 800; color: rgba(253, 224, 71, 0.9);
    font-family: 'Courier New', monospace;
    text-shadow: 0 0 20px rgba(234, 179, 8, 0.3);
  }
  .bpm-label { font-size: 12px; color: rgba(253, 224, 71, 0.4); letter-spacing: 3px; }
}

.beat-cards {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 20px; max-width: 800px; width: 100%;
}

.beat-card {
  position: relative;

  .card-beat-indicator {
    position: absolute; top: -12px; left: 20px; z-index: 5;
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, rgba(234, 179, 8, 0.3), rgba(234, 88, 12, 0.2));
    border: 1px solid rgba(234, 179, 8, 0.3);
    display: flex; align-items: center; justify-content: center;

    .beat-num {
      font-size: 11px; font-weight: 700;
      color: rgba(253, 224, 71, 0.9);
    }
  }

  .card-inner {
    padding: 24px 20px; padding-top: 20px;
    border-radius: 24px;
    background: linear-gradient(180deg, rgba(20, 18, 10, 0.9) 0%, rgba(14, 12, 8, 0.95) 100%);
    border: 1px solid rgba(234, 179, 8, 0.08);
    backdrop-filter: blur(10px);
    text-align: left;

    &::before {
      content: ''; position: absolute; inset: 0; border-radius: 24px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), transparent 50%);
      pointer-events: none;
    }

    .card-index { font-size: 10px; color: rgba(255, 255, 255, 0.25); letter-spacing: 3px; }
    .card-title { font-size: 20px; font-weight: 700; color: #fff; margin: 8px 0; letter-spacing: 2px; }
    .card-desc { font-size: 13px; color: rgba(255, 255, 255, 0.5); line-height: 1.6; margin: 0 0 12px; }
    .card-footer {
      display: flex; justify-content: space-between; align-items: center;
      .card-tag {
        font-size: 10px; letter-spacing: 3px; padding: 5px 14px; border-radius: 20px;
        background: rgba(234, 179, 8, 0.08); color: rgba(253, 224, 71, 0.7);
        border: 1px solid rgba(234, 179, 8, 0.12);
      }
      .card-beat-type {
        font-size: 18px; font-weight: 800; color: rgba(234, 179, 8, 0.4);
        font-family: 'Courier New', monospace;
      }
    }
  }

  &:hover .card-inner {
    border-color: rgba(234, 179, 8, 0.25);
    box-shadow: 0 0 35px rgba(234, 179, 8, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.02);
  }
}

.metro-footer {
  margin-top: 50px;

  .beat-dots {
    display: flex; gap: 12px; justify-content: center; margin-bottom: 16px;
    .beat-dot {
      width: 10px; height: 10px; border-radius: 50%;
      background: rgba(234, 179, 8, 0.15);
      transition: all 0.3s;
      &.active {
        background: rgba(234, 179, 8, 0.8);
        box-shadow: 0 0 15px rgba(234, 179, 8, 0.5);
      }
    }
  }

  .footer-text {
    font-size: 14px; letter-spacing: 3px; color: rgba(255, 255, 255, 0.4); margin: 0;
  }
}
</style>

