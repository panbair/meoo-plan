<template>
  <section ref="containerRef" class="conveyor-section">
    <div class="conveyor-bg">
      <div class="factory-grid"></div>
    </div>
    <div ref="headerRef" class="conv-header">
      <div ref="badgeRef" class="conv-badge"><span>🏭</span><span>ASSEMBLY LINE</span></div>
      <h1 ref="titleRef" class="conv-title">CONVEYOR BELT</h1>
      <p ref="subtitleRef" class="conv-subtitle">传送带 · 流水线 · 逐站检测</p>
    </div>
    <div ref="beltRef" class="belt-area">
      <!-- 传送带轨道 -->
      <div class="belt-track">
        <div class="track-surface">
          <span v-for="i in 20" :key="i" class="track-segment"></span>
        </div>
        <div class="roller left-roller"><div class="roller-inner"></div></div>
        <div class="roller right-roller"><div class="roller-inner"></div></div>
      </div>
      <!-- 卡片在传送带上 -->
      <div class="belt-items">
        <div v-for="(card, i) in cards" :key="i"
          :ref="el => cardRefs[i] = el as HTMLElement"
          class="belt-card" :style="{ '--item-hue': card.hue }">
          <div class="card-box">
            <div class="box-top"></div>
            <div class="box-inner">
              <span class="card-index">{{ String(i + 1).padStart(2, '0') }}</span>
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-desc">{{ card.desc }}</p>
              <div class="quality-badge" :class="card.quality">{{ card.quality }}</div>
            </div>
          </div>
          <div class="card-shadow-belt"></div>
        </div>
      </div>
      <!-- 检测工位 -->
      <div class="inspection-station">
        <div class="station-arm">
          <div class="arm-beam"></div>
          <div ref="scanLineRef" class="scan-line"></div>
        </div>
        <span class="station-label">INSPECTION</span>
      </div>
    </div>
    <div ref="footerRef" class="conv-footer">
      <div class="production-stats">
        <div class="stat"><span class="stat-label">产出</span><span class="stat-value">{{ cards.length }}</span></div>
        <div class="stat"><span class="stat-label">良率</span><span class="stat-value">98.5%</span></div>
        <div class="stat"><span class="stat-label">速度</span><span class="stat-value">12/min</span></div>
      </div>
      <span class="footer-text">QUALITY CONTROL</span>
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
const beltRef = ref<HTMLElement | null>(null)
const scanLineRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const cardRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: (() => void)[] = []

const cards = [
  { title: 'Module A', desc: '核心组件', quality: 'PASS', hue: 140 },
  { title: 'Module B', desc: '传感单元', quality: 'PASS', hue: 200 },
  { title: 'Module C', desc: '控制芯片', quality: 'PASS', hue: 260 },
  { title: 'Module D', desc: '通信模块', quality: 'PASS', hue: 40 },
  { title: 'Module E', desc: '电源系统', quality: 'PASS', hue: 320 },
]

onMounted(() => {
  if (!containerRef.value) return
  const allCards = cardRefs.value.filter(Boolean) as HTMLElement[]

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -30, filter: 'blur(10px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 20 })
  // Cards start off-screen right
  allCards.forEach((c, i) => gsap.set(c, { x: 600 + i * 160, opacity: 0, scale: 0.8 }))

  const introTl = gsap.timeline({
    scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' }
  })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power3.out'
  }).to(footerRef.value, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
  cleanupFns.push(() => introTl.kill())

  // Conveyor belt animation
  const beltTl = gsap.timeline({
    scrollTrigger: {
      trigger: beltRef.value,
      start: 'top 75%',
      end: 'top 10%',
      scrub: 1.5,
      immediateRender: false
    }
  })

  allCards.forEach((card, i) => {
    // Move onto belt
    beltTl.to(card, {
      x: 0, opacity: 1, scale: 1,
      duration: 0.2, ease: 'power2.out'
    }, i * 0.15)

    // Pop up at inspection station
    beltTl.to(card, {
      y: -15, scale: 1.05,
      duration: 0.08, ease: 'back.out(1.5)'
    }, i * 0.15 + 0.15)

    // Settle back
    beltTl.to(card, {
      y: 0, scale: 1,
      duration: 0.06, ease: 'power2.in'
    }, i * 0.15 + 0.22)
  })

  // Scan line pulse
  if (scanLineRef.value) {
    const scanTw = gsap.to(scanLineRef.value, {
      height: '100%', opacity: 0.8,
      duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut'
    })
    cleanupFns.push(() => scanTw.kill())
  }

  // Belt segment animation (CSS handles this, but add roller rotation)
  const rollers = containerRef.value.querySelectorAll('.roller-inner')
  rollers.forEach(r => {
    const tw = gsap.to(r, { rotation: 360, duration: 2, repeat: -1, ease: 'none' })
    cleanupFns.push(() => tw.kill())
  })

  cleanupFns.push(() => beltTl.kill())
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.conveyor-section {
  width: 100vw; height: 100vh;
  background: 
    radial-gradient(circle at 50% 30%, rgba(200,160,40,0.06) 0%, transparent 50%),
    radial-gradient(circle at 20% 80%, rgba(180,140,30,0.04) 0%, transparent 40%),
    linear-gradient(180deg, #0c0a08 0%, #161410 50%, #0c0a08 100%);
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.conveyor-bg {
  position: absolute; inset: 0; pointer-events: none;
  .factory-grid {
    position: absolute; inset: 0;
    background-image: 
      linear-gradient(rgba(200,160,40,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(200,160,40,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    filter: blur(0.5px);
  }
}
.conv-header {
  position: relative; z-index: 10; text-align: center; margin-bottom: 50px;
  .conv-badge {
    display: inline-flex; align-items: center; gap: 8px; padding: 12px 32px;
    border-radius: 50px; 
    border: 1px solid rgba(220,180,40,0.2);
    background: linear-gradient(135deg, rgba(220,180,40,0.08), rgba(200,160,30,0.04));
    backdrop-filter: blur(12px);
    box-shadow: 
      0 4px 20px rgba(200,160,40,0.12),
      inset 0 1px 0 rgba(255,255,255,0.06);
    margin-bottom: 16px;
    font-size: 11px; letter-spacing: 6px; 
    color: rgba(230,210,120,0.85);
    transition: all 0.3s ease;
    span:first-child { 
      font-size: 16px;
      filter: drop-shadow(0 0 8px rgba(220,180,40,0.5));
    }
    &:hover {
      border-color: rgba(230,190,50,0.35);
      box-shadow: 0 6px 30px rgba(200,160,40,0.18);
      transform: translateY(-2px);
    }
  }
  .conv-title {
    font-size: clamp(52px, 7.5vw, 88px); 
    font-weight: 900; 
    letter-spacing: 10px;
    background: linear-gradient(135deg, #d4b030 0%, #f0d850 30%, #c8a828 60%, #a08820 100%);
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 12px;
    filter: drop-shadow(0 0 40px rgba(200,160,40,0.35));
    animation: metalGlow 3s ease-in-out infinite alternate;
  }
  .conv-subtitle { 
    font-size: 16px; 
    color: rgba(220,200,130,0.65); 
    letter-spacing: 8px;
    font-weight: 300;
    margin: 0;
    text-shadow: 0 0 20px rgba(200,160,40,0.25);
  }
}
.belt-area {
  position: relative; z-index: 10; width: 95%; max-width: 900px;
}
.belt-track {
  position: relative; height: 20px; margin-top: 10px;
  .track-surface {
    display: flex; gap: 2px; height: 100%;
    .track-segment {
      flex: 1; height: 100%; border-radius: 2px;
      background: linear-gradient(180deg, rgba(80,70,50,0.5), rgba(60,55,40,0.4));
      animation: beltMove 2s linear infinite;
    }
  }
  .roller {
    position: absolute; top: -4px; width: 28px; height: 28px; border-radius: 50%;
    background: rgba(100,90,70,0.6); border: 2px solid rgba(140,130,100,0.3);
    display: flex; align-items: center; justify-content: center;
    &.left-roller { left: -14px; }
    &.right-roller { right: -14px; }
    .roller-inner {
      width: 12px; height: 12px; border-radius: 50%;
      border: 2px solid rgba(180,170,140,0.3);
    }
  }
}
@keyframes beltMove {
  0% { transform: translateX(0); }
  100% { transform: translateX(-10px); }
}
.belt-items {
  display: flex; gap: 14px; margin-top: 50px; justify-content: center;
}
.belt-card {
  width: 155px; will-change: transform;
  transition: transform 0.3s ease;
  .card-box {
    border-radius: 28px; overflow: hidden;
    border: 1px solid hsla(var(--item-hue), 35%, 35%, 0.18);
    box-shadow: 
      0 8px 32px rgba(0,0,0,0.3),
      inset 0 1px 0 rgba(255,255,255,0.05);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    .box-top {
      height: 5px;
      background: linear-gradient(90deg, 
        hsla(var(--item-hue), 55%, 45%, 0.35) 0%, 
        hsla(var(--item-hue), 55%, 55%, 0.55) 50%, 
        hsla(var(--item-hue), 55%, 45%, 0.35) 100%);
      box-shadow: 0 0 10px hsla(var(--item-hue), 50%, 50%, 0.3);
    }
    .box-inner {
      padding: 26px 22px;
      background: 
        linear-gradient(145deg, rgba(28,25,20,0.95), rgba(22,20,16,0.98));
      .card-index { 
        font-size: 9px; 
        color: rgba(210,190,130,0.35); 
        letter-spacing: 3px;
        font-weight: 600;
      }
      .card-title { 
        font-size: 21px; 
        font-weight: 800; 
        color: #ffffff;
        margin: 6px 0;
        text-shadow: 0 2px 10px rgba(0,0,0,0.3);
      }
      .card-desc { 
        font-size: 11px; 
        color: rgba(210,190,150,0.6);
        margin: 0 0 10px;
        line-height: 1.4;
      }
      .quality-badge {
        display: inline-block; 
        font-size: 8px; 
        letter-spacing: 3px; 
        padding: 3px 10px; 
        border-radius: 6px;
        font-weight: 700;
        &.PASS { 
          background: linear-gradient(135deg, rgba(40,190,90,0.15), rgba(30,170,80,0.1));
          color: rgba(90,230,130,0.8);
          border: 1px solid rgba(40,190,90,0.18);
          box-shadow: 0 2px 8px rgba(40,190,90,0.15);
        }
      }
    }
  }
  .card-shadow-belt {
    height: 8px; margin: 0 8%;
    background: radial-gradient(ellipse, rgba(0,0,0,0.25), transparent 70%);
    border-radius: 50%;
  }
  &:hover {
    transform: translateY(-5px);
    .card-box {
      border-color: hsla(var(--item-hue), 45%, 45%, 0.35);
      box-shadow: 
        0 12px 40px hsla(var(--item-hue), 40%, 40%, 0.15),
        inset 0 1px 0 rgba(255,255,255,0.08);
    }
  }
}
.inspection-station {
  position: absolute; top: -30px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center;
  .station-arm {
    position: relative; width: 4px; height: 25px;
    .arm-beam { width: 100%; height: 100%; background: rgba(200,40,40,0.4); border-radius: 2px; }
    .scan-line {
      position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
      width: 60px; height: 0; opacity: 0;
      background: linear-gradient(180deg, rgba(255,60,60,0.15), transparent);
      pointer-events: none;
    }
  }
  .station-label {
    font-size: 7px; letter-spacing: 2px; color: rgba(255,80,80,0.4); margin-top: 4px;
  }
}
.conv-footer {
  position: relative; z-index: 10; margin-top: 50px; text-align: center;
  .production-stats {
    display: flex; gap: 28px; justify-content: center; margin-bottom: 12px;
    .stat {
      display: flex; flex-direction: column; align-items: center; gap: 3px;
      padding: 8px 16px;
      background: rgba(200,180,120,0.04);
      border-radius: 8px;
      border: 1px solid rgba(200,180,120,0.08);
      .stat-label { 
        font-size: 9px; 
        color: rgba(210,190,130,0.5);
        font-weight: 500;
        letter-spacing: 1px;
      }
      .stat-value { 
        font-size: 18px; 
        font-weight: 800; 
        color: rgba(230,210,130,0.9);
        font-family: 'Courier New', monospace;
        text-shadow: 0 0 10px rgba(200,160,40,0.3);
      }
    }
  }
  .footer-text { 
    font-size: 14px; 
    letter-spacing: 4px; 
    color: rgba(220,200,130,0.45);
    font-weight: 500;
    text-shadow: 0 0 15px rgba(200,160,40,0.2);
  }
}
@keyframes metalGlow {
  0% { filter: drop-shadow(0 0 30px rgba(200,160,40,0.3)); }
  100% { filter: drop-shadow(0 0 50px rgba(200,160,40,0.45)); }
}
</style>

