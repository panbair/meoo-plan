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
    radial-gradient(circle at 50% 40%, rgba(234, 179, 8, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 50% 80%, rgba(234, 88, 12, 0.06) 0%, transparent 40%),
    radial-gradient(circle at 30% 60%, rgba(253, 224, 71, 0.04) 0%, transparent 50%),
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
    width: 220px; height: 220px; border-radius: 50%;
    background: radial-gradient(circle, rgba(234, 179, 8, 0.15), transparent 70%);
    opacity: 0;
    box-shadow: 0 0 40px rgba(234, 179, 8, 0.2);
  }
}

.metro-content {
  position: relative; z-index: 10; text-align: center;
  padding: 40px; max-width: 1200px; width: 100%;
}

.metro-header {
  margin-bottom: 40px;

  .metro-badge {
    display: inline-flex; align-items: center; gap: 10px; padding: 12px 32px;
    border-radius: 50px; 
    border: 1px solid rgba(234, 179, 8, 0.35);
    background: linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(234, 88, 12, 0.06));
    backdrop-filter: blur(12px);
    box-shadow: 
      0 4px 20px rgba(234, 179, 8, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
    margin-bottom: 24px; font-size: 11px; letter-spacing: 6px;
    color: rgba(253, 224, 71, 0.95);
    transition: all 0.3s ease;
    .badge-icon { 
      font-size: 18px;
      filter: drop-shadow(0 0 10px rgba(234, 179, 8, 0.6));
    }
    &:hover {
      border-color: rgba(253, 224, 71, 0.5);
      box-shadow: 0 6px 30px rgba(234, 179, 8, 0.25);
      transform: translateY(-2px);
    }
  }

  .metro-title {
    font-size: clamp(52px, 7.5vw, 88px); 
    font-weight: 900; 
    letter-spacing: 10px;
    background: linear-gradient(180deg, #ffffff 0%, #fde047 30%, #eab308 60%, #ca8a04 100%);
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 16px; 
    filter: drop-shadow(0 0 50px rgba(234, 179, 8, 0.5));
    animation: metroGlow 3s ease-in-out infinite alternate;
  }

  .metro-subtitle {
    font-size: 16px; 
    color: rgba(253, 224, 71, 0.65); 
    letter-spacing: 8px;
    font-weight: 300;
    margin: 0;
    text-shadow: 0 0 20px rgba(234, 179, 8, 0.25);
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
    background: linear-gradient(180deg, rgba(65, 55, 35, 0.65), rgba(45, 38, 22, 0.85));
    border-radius: 8px; clip-path: polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  }

  .metro-scale {
    position: absolute; top: 30px; width: 120px; height: 120px;
    .scale-mark {
      position: absolute; top: 0; left: 50%; width: 2px; height: 16px;
      background: linear-gradient(180deg, rgba(234, 179, 8, 0.3), rgba(234, 179, 8, 0.1));
      transform-origin: bottom center;
      margin-left: -1px;
      box-shadow: 0 0 6px rgba(234, 179, 8, 0.2);
    }
  }

  .pendulum {
    position: absolute; bottom: 30px; left: 50%;
    transform-origin: bottom center;

    .pendulum-rod {
      width: 3px; height: 120px; margin-left: -1.5px;
      background: linear-gradient(180deg, rgba(234, 179, 8, 0.7), rgba(234, 179, 8, 0.25));
      box-shadow: 0 0 10px rgba(234, 179, 8, 0.3);
    }
    .pendulum-weight {
      width: 18px; height: 12px; margin-left: -9px; margin-top: -30px;
      background: linear-gradient(180deg, rgba(234, 179, 8, 0.9), rgba(200, 150, 0, 0.7));
      border-radius: 4px;
      box-shadow: 0 0 15px rgba(234, 179, 8, 0.4);
    }
    .pendulum-tip {
      width: 8px; height: 8px; margin-left: -4px; margin-top: -2px;
      background: rgba(253, 224, 71, 0.95); border-radius: 50%;
      box-shadow: 0 0 18px rgba(234, 179, 8, 0.6);
    }
  }
}

.bpm-display {
  display: flex; align-items: baseline; gap: 8px;
  padding: 10px 20px;
  background: rgba(234, 179, 8, 0.06);
  border-radius: 12px;
  border: 1px solid rgba(234, 179, 8, 0.12);
  .bpm-value {
    font-size: 40px; font-weight: 900; color: rgba(253, 224, 71, 0.95);
    font-family: 'Courier New', monospace;
    text-shadow: 0 0 25px rgba(234, 179, 8, 0.4);
    letter-spacing: 2px;
  }
  .bpm-label { 
    font-size: 12px; 
    color: rgba(253, 224, 71, 0.5); 
    letter-spacing: 4px;
    font-weight: 600;
  }
}

.beat-cards {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 24px; max-width: 820px; width: 100%;
}

.beat-card {
  position: relative;
  transition: transform 0.3s ease;

  .card-beat-indicator {
    position: absolute; top: -14px; left: 20px; z-index: 5;
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg, rgba(234, 179, 8, 0.35), rgba(234, 88, 12, 0.25));
    border: 1px solid rgba(234, 179, 8, 0.35);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 15px rgba(234, 179, 8, 0.3);

    .beat-num {
      font-size: 12px; font-weight: 800;
      color: rgba(253, 224, 71, 0.95);
      text-shadow: 0 0 10px rgba(234, 179, 8, 0.5);
    }
  }

  .card-inner {
    padding: 26px 22px; padding-top: 22px;
    border-radius: 28px;
    background: linear-gradient(180deg, rgba(22, 20, 12, 0.92) 0%, rgba(16, 14, 10, 0.96) 100%);
    border: 1px solid rgba(234, 179, 8, 0.12);
    backdrop-filter: blur(10px);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.06);
    text-align: left;
    transition: all 0.3s ease;

    &::before {
      content: ''; position: absolute; inset: 0; border-radius: 28px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), transparent 50%);
      pointer-events: none;
    }

    .card-index { 
      font-size: 10px; 
      color: rgba(253, 224, 71, 0.3); 
      letter-spacing: 3px;
      font-weight: 600;
    }
    .card-title { 
      font-size: 21px; 
      font-weight: 800; 
      color: #fff; 
      margin: 10px 0; 
      letter-spacing: 2px;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }
    .card-desc { 
      font-size: 13px; 
      color: rgba(253, 224, 71, 0.55); 
      line-height: 1.6; 
      margin: 0 0 14px;
    }
    .card-footer {
      display: flex; justify-content: space-between; align-items: center;
      .card-tag {
        font-size: 10px; letter-spacing: 3px; padding: 5px 14px; border-radius: 20px;
        background: linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(234, 88, 12, 0.06));
        color: rgba(253, 224, 71, 0.8);
        border: 1px solid rgba(234, 179, 8, 0.15);
        font-weight: 600;
      }
      .card-beat-type {
        font-size: 20px; font-weight: 900; color: rgba(234, 179, 8, 0.5);
        font-family: 'Courier New', monospace;
        text-shadow: 0 0 15px rgba(234, 179, 8, 0.3);
      }
    }
  }

  &:hover {
    transform: translateY(-5px);
    .card-inner {
      border-color: rgba(234, 179, 8, 0.3);
      box-shadow: 
        0 12px 40px rgba(234, 179, 8, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
  }
}

.metro-footer {
  margin-top: 50px;

  .beat-dots {
    display: flex; gap: 14px; justify-content: center; margin-bottom: 18px;
    .beat-dot {
      width: 12px; height: 12px; border-radius: 50%;
      background: rgba(234, 179, 8, 0.2);
      transition: all 0.3s;
      box-shadow: 0 0 8px rgba(234, 179, 8, 0.1);
      &.active {
        background: rgba(253, 224, 71, 0.9);
        box-shadow: 0 0 20px rgba(234, 179, 8, 0.6);
        transform: scale(1.2);
      }
    }
  }

  .footer-text {
    font-size: 14px; 
    letter-spacing: 4px; 
    color: rgba(253, 224, 71, 0.5);
    margin: 0;
    font-weight: 500;
    text-shadow: 0 0 15px rgba(234, 179, 8, 0.2);
  }
}
@keyframes metroGlow {
  0% { filter: drop-shadow(0 0 40px rgba(234, 179, 8, 0.45)); }
  100% { filter: drop-shadow(0 0 60px rgba(234, 179, 8, 0.6)); }
}
</style>

