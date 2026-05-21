<template>
  <section ref="containerRef" class="pinball-section">
    <div class="pinball-bg">
      <div class="neon-ring"></div>
    </div>
    <div class="pinball-content">
      <div ref="headerRef" class="pinball-header">
        <div ref="badgeRef" class="pinball-badge">
          <span class="badge-icon">🕹️</span>
          <span>PINBALL</span>
        </div>
        <h1 ref="titleRef" class="pinball-title">PINBALL</h1>
        <p ref="subtitleRef" class="pinball-subtitle">弹球台 · 碰撞反弹 · 目标入槽</p>
      </div>

      <div ref="tableRef" class="pinball-table">
        <!-- 挡板 -->
        <div class="bumper bumper-1" ref="bumper1Ref">
          <div class="bumper-ring"></div>
          <span class="bumper-score">100</span>
        </div>
        <div class="bumper bumper-2" ref="bumper2Ref">
          <div class="bumper-ring"></div>
          <span class="bumper-score">200</span>
        </div>
        <div class="bumper bumper-3" ref="bumper3Ref">
          <div class="bumper-ring"></div>
          <span class="bumper-score">150</span>
        </div>

        <!-- Flippers -->
        <div class="flipper left-flipper" ref="leftFlipperRef"></div>
        <div class="flipper right-flipper" ref="rightFlipperRef"></div>

        <!-- 弹珠卡片 -->
        <div v-for="(ball, i) in balls" :key="i"
          :ref="el => ballRefs[i] = el as HTMLElement"
          class="pinball-card" :style="{ '--ball-hue': ball.hue }">
          <div class="card-inner">
            <div class="card-icon">{{ ball.icon }}</div>
            <h3 class="card-title">{{ ball.title }}</h3>
            <p class="card-desc">{{ ball.desc }}</p>
            <span class="card-points">{{ ball.points }}pts</span>
          </div>
          <div class="ball-trail"></div>
        </div>

        <!-- 目标槽 -->
        <div class="target-slots">
          <div v-for="i in 3" :key="'ts'+i" class="target-slot">
            <span class="slot-label">SLOT {{ i }}</span>
          </div>
        </div>

        <!-- 弹簧 -->
        <div ref="springRef" class="launcher-spring">
          <div class="spring-coils">
            <span v-for="i in 5" :key="'sc'+i" class="coil"></span>
          </div>
          <div class="spring-plunger"></div>
        </div>
      </div>

      <div class="score-display">
        <span class="total-label">TOTAL SCORE</span>
        <span class="total-score" ref="totalScoreRef">0</span>
      </div>

      <div ref="footerRef" class="pinball-footer">
        <p class="footer-text">SCROLL TO LAUNCH</p>
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
const tableRef = ref<HTMLElement | null>(null)
const springRef = ref<HTMLElement | null>(null)
const bumper1Ref = ref<HTMLElement | null>(null)
const bumper2Ref = ref<HTMLElement | null>(null)
const bumper3Ref = ref<HTMLElement | null>(null)
const leftFlipperRef = ref<HTMLElement | null>(null)
const rightFlipperRef = ref<HTMLElement | null>(null)
const totalScoreRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const ballRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: (() => void)[] = []

const balls = [
  { icon: '⚡', title: 'Lightning', desc: '闪电弹珠', points: 500, hue: 50 },
  { icon: '🔥', title: 'Fireball', desc: '火焰弹珠', points: 300, hue: 15 },
  { icon: '💎', title: 'Diamond', desc: '钻石弹珠', points: 800, hue: 200 },
  { icon: '🌟', title: 'Star', desc: '星光弹珠', points: 400, hue: 280 },
  { icon: '🎯', title: 'Bullseye', desc: '靶心弹珠', points: 1000, hue: 0 },
  { icon: '🚀', title: 'Rocket', desc: '火箭弹珠', points: 600, hue: 160 },
]

onMounted(() => {
  if (!containerRef.value) return
  const allBalls = ballRefs.value.filter(Boolean) as HTMLElement[]

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -40, filter: 'blur(12px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 30 })
  gsap.set(allBalls, { opacity: 0, y: 300, scale: 0.5 })

  const introTl = gsap.timeline({
    scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' }
  })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.12, ease: 'power3.out'
  })
  .to(footerRef.value, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
  cleanupFns.push(() => introTl.kill())

  // Pinball launch & bounce
  const pinTl = gsap.timeline({
    scrollTrigger: { trigger: tableRef.value, start: 'top 70%', end: 'top 5%', scrub: 1.5, immediateRender: false }
  })

  // Spring compress
  pinTl.to(springRef.value, { scaleY: 0.5, duration: 0.1 }, 0)
  // Spring release
  pinTl.to(springRef.value, { scaleY: 1, duration: 0.05, ease: 'power4.out' }, 0.1)

  let totalScore = 0

  allBalls.forEach((ball, i) => {
    const offset = 0.1 + i * 0.12
    // Launch up
    pinTl.to(ball, { opacity: 1, y: -200 - i * 30, x: gsap.utils.random(-100, 100), scale: 1, rotation: gsap.utils.random(-20, 20), duration: 0.12, ease: 'power3.out' }, offset)
    // Bounce off bumper
    pinTl.to(ball, { y: -100 + i * 20, x: gsap.utils.random(-80, 80), rotation: gsap.utils.random(-15, 15), duration: 0.08, ease: 'bounce.out' }, offset + 0.12)
    // Bumper flash
    const bumperIdx = i % 3
    const bumper = [bumper1Ref.value, bumper2Ref.value, bumper3Ref.value][bumperIdx]
    if (bumper) {
      pinTl.to(bumper, { scale: 1.2, duration: 0.03, ease: 'power4.out' }, offset + 0.12)
      pinTl.to(bumper, { scale: 1, duration: 0.1 }, offset + 0.15)
    }
    // Settle into slot
    pinTl.to(ball, { y: 0, x: 0, rotation: 0, duration: 0.1, ease: 'power2.in', onComplete: () => {
      totalScore += balls[i].points
      if (totalScoreRef.value) totalScoreRef.value.textContent = String(totalScore)
    } }, offset + 0.2)
  })

  // Flipper animation
  pinTl.to(leftFlipperRef.value, { rotation: -40, duration: 0.05, yoyo: true, repeat: 3, ease: 'power4.out' }, 0.3)
  pinTl.to(rightFlipperRef.value, { rotation: 40, duration: 0.05, yoyo: true, repeat: 3, ease: 'power4.out' }, 0.35)

  cleanupFns.push(() => pinTl.kill())
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.pinball-section {
  width: 100vw; height: 100vh;
  background:
    radial-gradient(circle at 50% 30%, rgba(236, 72, 153, 0.1) 0%, transparent 40%),
    radial-gradient(circle at 50% 70%, rgba(59, 130, 246, 0.08) 0%, transparent 40%),
    linear-gradient(180deg, #080510 0%, #0e0a1a 50%, #080510 100%);
  position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}

.pinball-bg {
  position: absolute; inset: 0; pointer-events: none;
  .neon-ring {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 600px; height: 600px; border-radius: 50%;
    border: 1px solid rgba(236, 72, 153, 0.08);
    box-shadow: 
      0 0 80px rgba(236, 72, 153, 0.04),
      inset 0 0 80px rgba(236, 72, 153, 0.02);
  }
}

.pinball-content {
  position: relative; z-index: 10; text-align: center;
  padding: 30px; max-width: 1100px; width: 100%;
}

.pinball-header {
  margin-bottom: 30px;
  .pinball-badge {
    display: inline-flex; align-items: center; gap: 10px; padding: 12px 32px;
    border-radius: 50px; 
    border: 1px solid rgba(236, 72, 153, 0.35);
    background: linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(216, 52, 133, 0.05));
    backdrop-filter: blur(12px);
    box-shadow: 
      0 4px 20px rgba(236, 72, 153, 0.15),
      inset 0 1px 0 rgba(255,255,255,0.06);
    margin-bottom: 24px; font-size: 11px; letter-spacing: 6px;
    color: rgba(251, 156, 210, 0.95);
    transition: all 0.3s ease;
    .badge-icon { 
      font-size: 18px;
      filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.6));
    }
    &:hover {
      border-color: rgba(251, 146, 200, 0.5);
      box-shadow: 0 6px 30px rgba(236, 72, 153, 0.25);
      transform: translateY(-2px);
    }
  }
  .pinball-title {
    font-size: clamp(52px, 7.5vw, 88px); 
    font-weight: 900; 
    letter-spacing: 10px;
    background: linear-gradient(180deg, #ffffff 0%, #fbb8de 30%, #f9a8d4 60%, #ec4899 100%);
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 16px; 
    filter: drop-shadow(0 0 60px rgba(236, 72, 153, 0.5));
    animation: pinballGlow 3s ease-in-out infinite alternate;
  }
  .pinball-subtitle { 
    font-size: 16px; 
    color: rgba(220, 200, 230, 0.6);
    letter-spacing: 8px;
    font-weight: 300;
    margin: 0;
    text-shadow: 0 0 20px rgba(236, 72, 153, 0.2);
  }
}

.pinball-table {
  position: relative; max-width: 800px; margin: 0 auto;
  min-height: 400px; display: flex; flex-wrap: wrap;
  gap: 16px; justify-content: center; align-items: center;
  padding: 40px 20px;
}

.bumper {
  position: absolute; width: 64px; height: 64px; border-radius: 50%;
  background: rgba(236, 72, 153, 0.12);
  border: 1px solid rgba(236, 72, 153, 0.2);
  display: flex; align-items: center; justify-content: center;
  z-index: 5;
  box-shadow: 
    0 0 20px rgba(236, 72, 153, 0.15),
    inset 0 0 15px rgba(236, 72, 153, 0.1);
  .bumper-ring {
    position: absolute; inset: -6px; border-radius: 50%;
    border: 2px solid rgba(236, 72, 153, 0.35);
    animation: bumperPulse 2s ease-in-out infinite;
  }
  .bumper-score { 
    font-size: 12px; 
    font-weight: 800; 
    color: rgba(251, 156, 210, 0.8); 
    font-family: 'Courier New', monospace;
    text-shadow: 0 0 10px rgba(236, 72, 153, 0.3);
  }
  &.bumper-1 { top: 15%; left: 20%; }
  &.bumper-2 { top: 10%; left: 50%; transform: translateX(-50%); }
  &.bumper-3 { top: 15%; right: 20%; }
}
@keyframes bumperPulse { 
  0%,100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.15); opacity: 1; }
}

.flipper {
  position: absolute; bottom: 15%; width: 85px; height: 14px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.12));
  border-radius: 7px;
  box-shadow: 0 0 12px rgba(255,255,255,0.1);
  &.left-flipper { left: 25%; transform-origin: left center; }
  &.right-flipper { right: 25%; transform-origin: right center; }
}

.pinball-card {
  width: 200px; position: relative;
  .card-inner {
    padding: 22px 20px; border-radius: 28px;
    background: linear-gradient(180deg, rgba(22, 14, 26, 0.92), rgba(16, 10, 20, 0.96));
    border: 1px solid hsla(var(--ball-hue), 65%, 55%, 0.18);
    backdrop-filter: blur(12px); text-align: center;
    box-shadow: 
      0 4px 20px rgba(0,0,0,0.3),
      inset 0 1px 0 rgba(255,255,255,0.05);
    &::before {
      content: ''; position: absolute; inset: 0; border-radius: 28px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), transparent 50%);
      pointer-events: none;
    }
    .card-icon { 
      font-size: 36px; 
      margin-bottom: 10px;
      filter: drop-shadow(0 0 15px hsla(var(--ball-hue), 60%, 50%, 0.4));
    }
    .card-title { 
      font-size: 19px; 
      font-weight: 800; 
      color: #fff; 
      margin: 5px 0; 
      letter-spacing: 2px;
      text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    .card-desc { 
      font-size: 13px; 
      color: rgba(220, 200, 230, 0.55); 
      margin: 0 0 10px; 
      line-height: 1.5;
    }
    .card-points {
      font-size: 15px; 
      font-weight: 800; 
      color: hsla(var(--ball-hue), 75%, 65%, 0.95);
      font-family: 'Courier New', monospace; 
      letter-spacing: 2px;
      text-shadow: 0 0 12px hsla(var(--ball-hue), 60%, 50%, 0.3);
    }
  }
  .ball-trail {
    position: absolute; bottom: -10px; left: 25%; right: 25%; height: 4px;
    background: linear-gradient(90deg, transparent, hsla(var(--ball-hue), 60%, 50%, 0.35), transparent);
    border-radius: 2px;
    box-shadow: 0 0 10px hsla(var(--ball-hue), 60%, 50%, 0.2);
  }
  &:hover .card-inner {
    border-color: hsla(var(--ball-hue), 75%, 65%, 0.4);
    box-shadow: 
      0 6px 30px hsla(var(--ball-hue), 60%, 50%, 0.2),
      inset 0 1px 0 rgba(255,255,255,0.08);
    transform: translateY(-2px);
  }
}

.target-slots {
  position: absolute; bottom: 5%; left: 50%; transform: translateX(-50%);
  display: flex; gap: 14px;
  .target-slot {
    width: 75px; height: 28px; border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.03);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 10px rgba(255,255,255,0.05);
    transition: all 0.2s;
    .slot-label { 
      font-size: 9px; 
      color: rgba(255, 255, 255, 0.25); 
      letter-spacing: 2px;
      font-weight: 600;
    }
    &:hover {
      border-color: rgba(236, 72, 153, 0.3);
      background: rgba(236, 72, 153, 0.05);
    }
  }
}

.launcher-spring {
  position: absolute; right: 5%; bottom: 10%; transform-origin: bottom center;
  .spring-coils {
    display: flex; flex-direction: column; gap: 2px;
    .coil { 
      width: 18px; height: 4px; border-radius: 2px; 
      background: rgba(200, 200, 200, 0.25);
      box-shadow: 0 0 6px rgba(200,200,200,0.1);
    }
  }
  .spring-plunger {
    width: 22px; height: 12px; margin-top: 4px; margin-left: -2px;
    background: linear-gradient(180deg, rgba(200, 200, 200, 0.35), rgba(200, 200, 200, 0.18));
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(200,200,200,0.15);
  }
}

.score-display {
  margin-top: 24px; display: flex; flex-direction: column; align-items: center; gap: 6px;
  .total-label { 
    font-size: 11px; 
    letter-spacing: 5px; 
    color: rgba(251, 156, 210, 0.5);
    font-weight: 600;
  }
  .total-score { 
    font-size: 36px; 
    font-weight: 900; 
    color: rgba(251, 156, 210, 0.95); 
    font-family: 'Courier New', monospace;
    text-shadow: 
      0 0 20px rgba(236, 72, 153, 0.4),
      0 0 40px rgba(236, 72, 153, 0.2);
  }
}

.pinball-footer {
  margin-top: 24px;
  .footer-text { 
    font-size: 14px; 
    letter-spacing: 4px; 
    color: rgba(220, 200, 230, 0.5);
    font-weight: 500;
    margin: 0;
    text-shadow: 0 0 15px rgba(236, 72, 153, 0.15);
  }
}

@keyframes pinballGlow {
  0% { filter: drop-shadow(0 0 50px rgba(236, 72, 153, 0.45)); }
  100% { filter: drop-shadow(0 0 70px rgba(236, 72, 153, 0.6)); }
}
</style>

