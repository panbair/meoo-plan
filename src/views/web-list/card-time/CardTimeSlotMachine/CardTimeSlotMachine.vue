<template>
  <section ref="containerRef" class="slot-section">
    <div class="slot-bg">
      <div class="casino-glow"></div>
      <div class="light-marquee">
        <span v-for="i in 30" :key="i" class="marquee-bulb" :style="{ animationDelay: `${i*0.1}s` }"></span>
      </div>
    </div>
    <div class="slot-content">
      <div ref="headerRef" class="slot-header">
        <div ref="badgeRef" class="slot-badge">
          <span class="badge-icon">🎰</span>
          <span>JACKPOT</span>
        </div>
        <h1 ref="titleRef" class="slot-title">SLOT MACHINE</h1>
        <p ref="subtitleRef" class="slot-subtitle">老虎机 · 三列滚动 · 中奖特效</p>
      </div>

      <div ref="machineRef" class="slot-machine">
        <div class="machine-frame">
          <div class="machine-top">
            <span class="jackpot-text">★ JACKPOT ★</span>
          </div>
          <!-- 三列滚轮 -->
          <div class="reels-container">
            <div v-for="(reel, ri) in 3" :key="'reel'+ri" class="reel">
              <div :ref="el => reelRefs[ri] = el as HTMLElement" class="reel-strip">
                <div v-for="(card, ci) in reelCards[ri]" :key="'rc'+ri+ci"
                  class="reel-card" :style="{ '--card-hue': card.hue }">
                  <div class="rc-inner">
                    <span class="rc-icon">{{ card.icon }}</span>
                    <span class="rc-title">{{ card.title }}</span>
                    <span class="rc-desc">{{ card.desc }}</span>
                  </div>
                </div>
              </div>
              <div class="reel-mask top-mask"></div>
              <div class="reel-mask bottom-mask"></div>
            </div>
          </div>
          <!-- 中奖线 -->
          <div ref="winLineRef" class="win-line"></div>
          <!-- 拉杆 -->
          <div class="lever-area">
            <div ref="leverRef" class="lever">
              <div class="lever-shaft"></div>
              <div class="lever-knob"></div>
            </div>
          </div>
        </div>
        <!-- 奖金显示 -->
        <div class="payout-display">
          <span class="payout-label">CREDITS</span>
          <span class="payout-value" ref="creditsRef">1000</span>
        </div>
      </div>

      <!-- 中奖卡片展示 -->
      <div class="win-cards">
        <div v-for="(card, i) in winDisplayCards" :key="'wc'+i"
          :ref="el => winCardRefs[i] = el as HTMLElement"
          class="win-card" :style="{ '--wc-hue': card.hue }">
          <div class="wc-inner">
            <span class="wc-icon">{{ card.icon }}</span>
            <h3 class="wc-title">{{ card.title }}</h3>
            <p class="wc-desc">{{ card.desc }}</p>
            <span class="wc-multi">{{ card.multi }}</span>
          </div>
        </div>
      </div>

      <div ref="footerRef" class="slot-footer">
        <p class="footer-text">SCROLL TO SPIN</p>
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
const machineRef = ref<HTMLElement | null>(null)
const leverRef = ref<HTMLElement | null>(null)
const winLineRef = ref<HTMLElement | null>(null)
const creditsRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const reelRefs = ref<(HTMLElement | null)[]>([])
const winCardRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: (() => void)[] = []

const symbols = [
  { icon: '🍒', title: 'Cherry', desc: '樱桃', hue: 0 },
  { icon: '🔔', title: 'Bell', desc: '铃铛', hue: 45 },
  { icon: '💎', title: 'Diamond', desc: '钻石', hue: 200 },
  { icon: '7️⃣', title: 'Seven', desc: '幸运7', hue: 350 },
  { icon: '⭐', title: 'Star', desc: '星星', hue: 50 },
  { icon: '🍀', title: 'Clover', desc: '四叶草', hue: 130 },
]

const reelCards = [
  [symbols[0], symbols[2], symbols[4], symbols[1], symbols[3]],
  [symbols[1], symbols[3], symbols[4], symbols[0], symbols[5]],
  [symbols[2], symbols[0], symbols[4], symbols[5], symbols[3]],
]

const winDisplayCards = [
  { icon: '🍒🍒🍒', title: 'Triple Cherry', desc: '三倍樱桃', multi: '×3', hue: 0 },
  { icon: '💎💎💎', title: 'Diamond Rush', desc: '钻石风暴', multi: '×10', hue: 200 },
  { icon: '7️⃣7️⃣7️⃣', title: 'Lucky Seven', desc: '幸运777', multi: '×50', hue: 350 },
]

onMounted(() => {
  if (!containerRef.value) return

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -40, filter: 'blur(12px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 30 })
  const allWinCards = winCardRefs.value.filter(Boolean) as HTMLElement[]
  gsap.set(allWinCards, { opacity: 0, y: 40, scale: 0.8 })
  gsap.set(winLineRef.value, { opacity: 0, scaleX: 0 })

  const introTl = gsap.timeline({
    scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' }
  })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.12, ease: 'power3.out'
  })
  .to(footerRef.value, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
  cleanupFns.push(() => introTl.kill())

  // Slot spin animation
  const allReels = reelRefs.value.filter(Boolean) as HTMLElement[]
  const spinTl = gsap.timeline({
    scrollTrigger: { trigger: machineRef.value, start: 'top 70%', end: 'top 5%', scrub: 1.5, immediateRender: false }
  })

  // Lever pull
  spinTl.to(leverRef.value, { y: 30, duration: 0.08, ease: 'power2.in' }, 0)
  spinTl.to(leverRef.value, { y: 0, duration: 0.05, ease: 'power4.out' }, 0.08)

  // Reels spin (translateY cycle)
  allReels.forEach((reel, i) => {
    const spinDist = -(reelCards[i].length - 1) * 90
    spinTl.to(reel, {
      y: spinDist,
      duration: 0.4 + i * 0.1,
      ease: i === 0 ? 'power3.out' : i === 1 ? 'power2.out' : 'back.out(1.2)'
    }, 0.1 + i * 0.08)
  })

  // Win line flash
  spinTl.to(winLineRef.value, { opacity: 1, scaleX: 1, duration: 0.1, ease: 'power4.out' }, 0.7)
  spinTl.to(winLineRef.value, { opacity: 0.6, duration: 0.1, yoyo: true, repeat: 3 }, 0.8)

  // Win cards appear
  allWinCards.forEach((card, i) => {
    spinTl.to(card, {
      opacity: 1, y: 0, scale: 1, duration: 0.12, ease: 'back.out(1.5)'
    }, 0.85 + i * 0.05)
  })

  // Credits update
  spinTl.call(() => {
    if (creditsRef.value) creditsRef.value.textContent = '5000'
  }, [], 0.9)

  cleanupFns.push(() => spinTl.kill())
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.slot-section {
  width: 100vw; height: 100vh;
  background:
    radial-gradient(circle at 50% 30%, rgba(234, 179, 8, 0.1) 0%, transparent 40%),
    radial-gradient(circle at 50% 80%, rgba(220, 38, 38, 0.08) 0%, transparent 40%),
    linear-gradient(180deg, #0a0806 0%, #141008 50%, #0a0806 100%);
  position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}

.slot-bg {
  position: absolute; inset: 0; pointer-events: none;
  .casino-glow {
    position: absolute; top: 20%; left: 50%; transform: translateX(-50%);
    width: 400px; height: 300px;
    background: radial-gradient(ellipse, rgba(234, 179, 8, 0.08), transparent 60%);
  }
  .light-marquee {
    position: absolute; top: 10%; left: 10%; right: 10%; height: 4px;
    display: flex; justify-content: space-between;
    .marquee-bulb {
      width: 7px; height: 7px; border-radius: 50%;
      background: rgba(234, 179, 8, 0.5);
      box-shadow: 0 0 8px rgba(234, 179, 8, 0.3);
      animation: bulbFlash 1.5s ease-in-out infinite;
    }
  }
}
@keyframes bulbFlash { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }

.slot-content {
  position: relative; z-index: 10; text-align: center;
  padding: 30px; max-width: 1100px; width: 100%;
}

.slot-header {
  margin-bottom: 30px;
  .slot-badge {
    display: inline-flex; align-items: center; gap: 10px; padding: 12px 32px;
    border-radius: 50px; 
    border: 1px solid rgba(234, 179, 8, 0.35);
    background: linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(214, 159, 8, 0.05));
    backdrop-filter: blur(12px);
    box-shadow: 
      0 4px 20px rgba(234, 179, 8, 0.15),
      inset 0 1px 0 rgba(255,255,255,0.06);
    margin-bottom: 24px; font-size: 11px; letter-spacing: 6px;
    color: rgba(253, 234, 81, 0.95);
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
  .slot-title {
    font-size: clamp(52px, 7.5vw, 88px); 
    font-weight: 900; 
    letter-spacing: 10px;
    background: linear-gradient(180deg, #ffffff 0%, #fde047 30%, #fde047 60%, #eab308 100%);
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 16px; 
    filter: drop-shadow(0 0 60px rgba(234, 179, 8, 0.5));
    animation: slotGlow 3s ease-in-out infinite alternate;
  }
  .slot-subtitle { 
    font-size: 16px; 
    color: rgba(230, 220, 200, 0.6);
    letter-spacing: 8px;
    font-weight: 300;
    margin: 0;
    text-shadow: 0 0 20px rgba(234, 179, 8, 0.2);
  }
}

.slot-machine { max-width: 600px; margin: 0 auto; }

.machine-frame {
  position: relative;
  background: linear-gradient(180deg, rgba(32, 26, 14, 0.92), rgba(22, 18, 10, 0.96));
  border-radius: 28px; 
  border: 2px solid rgba(234, 179, 8, 0.2);
  padding: 18px; overflow: hidden;
  box-shadow: 
    0 8px 40px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);

  .machine-top {
    text-align: center; padding: 12px 0 16px;
    .jackpot-text {
      font-size: 17px; 
      font-weight: 900; 
      letter-spacing: 8px;
      color: rgba(253, 234, 81, 0.95); 
      text-shadow: 
        0 0 20px rgba(234, 179, 8, 0.5),
        0 0 40px rgba(234, 179, 8, 0.3);
    }
  }
}

.reels-container {
  display: flex; gap: 10px; justify-content: center;
  background: rgba(5, 5, 10, 0.85); 
  border-radius: 18px;
  padding: 10px; height: 110px; overflow: hidden;
  box-shadow: inset 0 2px 10px rgba(0,0,0,0.4);
}

.reel {
  flex: 1; position: relative; overflow: hidden; border-radius: 14px;
  background: rgba(10, 10, 18, 0.92); 
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);

  .reel-strip { position: relative; }

  .reel-card {
    height: 90px; display: flex; align-items: center; justify-content: center;
    padding: 5px;
    .rc-inner {
      width: 100%; height: 100%; border-radius: 14px;
      background: linear-gradient(180deg, hsla(var(--card-hue), 45%, 20%, 0.92), hsla(var(--card-hue), 40%, 12%, 0.96));
      border: 1px solid hsla(var(--card-hue), 55%, 45%, 0.18);
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
      box-shadow: 
        0 2px 10px rgba(0,0,0,0.3),
        inset 0 1px 0 rgba(255,255,255,0.05);
      .rc-icon { 
        font-size: 26px;
        filter: drop-shadow(0 0 8px hsla(var(--card-hue), 60%, 50%, 0.3));
      }
      .rc-title { 
        font-size: 12px; 
        font-weight: 800; 
        color: #fff; 
        letter-spacing: 1px;
        text-shadow: 0 1px 5px rgba(0,0,0,0.3);
      }
      .rc-desc { 
        font-size: 10px; 
        color: rgba(230, 220, 200, 0.5);
      }
    }
  }

  .reel-mask {
    position: absolute; left: 0; right: 0; height: 22px; z-index: 5;
    &.top-mask { top: 0; background: linear-gradient(180deg, rgba(5, 5, 10, 0.92), transparent); }
    &.bottom-mask { bottom: 0; background: linear-gradient(0deg, rgba(5, 5, 10, 0.92), transparent); }
  }
}

.win-line {
  position: absolute; left: 18px; right: 18px; top: 50%;
  height: 3px; 
  background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.9), transparent);
  box-shadow: 
    0 0 15px rgba(239, 68, 68, 0.5),
    0 0 30px rgba(239, 68, 68, 0.3);
  z-index: 10; transform-origin: center;
}

.lever-area {
  position: absolute; right: -30px; top: 50%; transform: translateY(-50%);
  .lever {
    display: flex; flex-direction: column; align-items: center;
    .lever-shaft { 
      width: 7px; height: 55px; 
      background: linear-gradient(180deg, rgba(200, 200, 200, 0.35), rgba(150, 150, 150, 0.25));
      border-radius: 4px;
      box-shadow: 0 0 8px rgba(200,200,200,0.1);
    }
    .lever-knob { 
      width: 24px; height: 24px; border-radius: 50%; 
      background: radial-gradient(circle, rgba(239, 68, 68, 0.7), rgba(200, 40, 40, 0.5));
      border: 2px solid rgba(255, 255, 255, 0.12);
      margin-top: -2px;
      box-shadow: 
        0 0 10px rgba(239, 68, 68, 0.3),
        inset 0 1px 0 rgba(255,255,255,0.1);
    }
  }
}

.payout-display {
  display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 18px;
  .payout-label { 
    font-size: 11px; 
    letter-spacing: 4px; 
    color: rgba(253, 234, 81, 0.5);
    font-weight: 600;
  }
  .payout-value { 
    font-size: 30px; 
    font-weight: 900; 
    color: rgba(253, 234, 81, 0.95); 
    font-family: 'Courier New', monospace;
    text-shadow: 
      0 0 15px rgba(234, 179, 8, 0.4),
      0 0 30px rgba(234, 179, 8, 0.2);
  }
}

.win-cards {
  display: flex; gap: 18px; justify-content: center; margin-top: 28px;
}

.win-card {
  width: 200px;
  .wc-inner {
    padding: 22px 18px; border-radius: 28px;
    background: linear-gradient(180deg, rgba(22, 18, 10, 0.92), rgba(16, 14, 8, 0.96));
    border: 1px solid hsla(var(--wc-hue), 55%, 45%, 0.15);
    backdrop-filter: blur(12px); text-align: center;
    box-shadow: 
      0 4px 20px rgba(0,0,0,0.3),
      inset 0 1px 0 rgba(255,255,255,0.05);
    &::before { 
      content: ''; 
      position: absolute; inset: 0; border-radius: 28px; 
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), transparent 50%); 
      pointer-events: none;
    }
    .wc-icon { 
      font-size: 26px; 
      display: block; margin-bottom: 10px;
      filter: drop-shadow(0 0 10px hsla(var(--wc-hue), 60%, 50%, 0.3));
    }
    .wc-title { 
      font-size: 17px; 
      font-weight: 800; 
      color: #fff; 
      margin: 5px 0; 
      letter-spacing: 1px;
      text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    .wc-desc { 
      font-size: 12px; 
      color: rgba(230, 220, 200, 0.55);
      margin: 0 0 10px;
    }
    .wc-multi { 
      font-size: 22px; 
      font-weight: 900; 
      color: hsla(var(--wc-hue), 75%, 65%, 0.95); 
      text-shadow: 0 0 15px hsla(var(--wc-hue), 60%, 50%, 0.4);
    }
  }
  &:hover .wc-inner {
    border-color: hsla(var(--wc-hue), 65%, 55%, 0.35);
    box-shadow: 
      0 6px 30px hsla(var(--wc-hue), 50%, 40%, 0.18),
      inset 0 1px 0 rgba(255,255,255,0.08);
    transform: translateY(-2px);
  }
}

.slot-footer {
  margin-top: 30px;
  .footer-text { 
    font-size: 14px; 
    letter-spacing: 4px; 
    color: rgba(230, 220, 200, 0.5);
    font-weight: 500;
    margin: 0;
    text-shadow: 0 0 15px rgba(234, 179, 8, 0.15);
  }
}

@keyframes slotGlow {
  0% { filter: drop-shadow(0 0 50px rgba(234, 179, 8, 0.45)); }
  100% { filter: drop-shadow(0 0 70px rgba(234, 179, 8, 0.6)); }
}
</style>

