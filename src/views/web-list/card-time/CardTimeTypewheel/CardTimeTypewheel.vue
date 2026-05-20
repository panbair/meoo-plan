<template>
  <section ref="containerRef" class="typewheel-section">
    <div class="typewheel-bg">
      <div class="paper-texture"></div>
    </div>
    <div ref="headerRef" class="tw-header">
      <div ref="badgeRef" class="tw-badge"><span>⌨️</span><span>TYPEWRITER</span></div>
      <h1 ref="titleRef" class="tw-title">TYPEWHEEL</h1>
      <p ref="subtitleRef" class="tw-subtitle">打字轮 · 逐字击打 · 机械节奏</p>
    </div>
    <!-- 打字机纸面 -->
    <div ref="paperRef" class="paper-area">
      <div class="paper-sheet">
        <div class="paper-margin"></div>
        <div class="paper-lines">
          <span v-for="l in 12" :key="l" class="paper-line"></span>
        </div>
        <!-- 光标 -->
        <div ref="cursorRef" class="type-cursor"></div>
        <!-- 卡片区域 -->
        <div class="cards-row">
          <div v-for="(card, i) in cards" :key="i"
            :ref="el => cardRefs[i] = el as HTMLElement"
            class="type-card">
            <div class="card-stamp"></div>
            <div class="card-inner">
              <span class="card-char">{{ card.char }}</span>
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-desc">{{ card.desc }}</p>
              <span class="card-tag">{{ card.tag }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 墨带 -->
      <div ref="ribbonRef" class="ink-ribbon">
        <div class="ribbon-spool left-spool"></div>
        <div class="ribbon-band"></div>
        <div class="ribbon-spool right-spool"></div>
      </div>
    </div>
    <div ref="footerRef" class="tw-footer">
      <div class="keystroke-counter">
        <span class="counter-label">KEYSTROKES</span>
        <span class="counter-value" ref="counterRef">0</span>
      </div>
      <span class="footer-text">CLICK CLACK CLICK</span>
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
const paperRef = ref<HTMLElement | null>(null)
const cursorRef = ref<HTMLElement | null>(null)
const ribbonRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const counterRef = ref<HTMLElement | null>(null)
const cardRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: (() => void)[] = []
let keyCount = 0

const cards = [
  { char: 'A', title: 'Alpha', desc: '起始信号', tag: 'KEY' },
  { char: 'B', title: 'Bravo', desc: '确认码', tag: 'KEY' },
  { char: 'C', title: 'Charlie', desc: '通讯频', tag: 'KEY' },
  { char: 'D', title: 'Delta', desc: '变量值', tag: 'KEY' },
  { char: 'E', title: 'Echo', desc: '回声波', tag: 'KEY' },
  { char: 'F', title: 'Foxtrot', desc: '舞步码', tag: 'KEY' },
]

onMounted(() => {
  if (!containerRef.value) return
  const allCards = cardRefs.value.filter(Boolean) as HTMLElement[]

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -30, filter: 'blur(10px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 20 })
  gsap.set(allCards, { opacity: 0, y: -40, scale: 0.7 })
  gsap.set(cursorRef.value, { opacity: 1 })

  // Cursor blink
  const cursorBlink = gsap.to(cursorRef.value, { opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: 'steps(1)' })
  cleanupFns.push(() => cursorBlink.kill())

  const introTl = gsap.timeline({
    scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' }
  })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power3.out'
  }).to(footerRef.value, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
  cleanupFns.push(() => introTl.kill())

  // Typewriter strike animation
  const typeTl = gsap.timeline({
    scrollTrigger: {
      trigger: paperRef.value,
      start: 'top 75%',
      end: 'top 15%',
      scrub: 1.5,
      immediateRender: false
    }
  })

  allCards.forEach((card, i) => {
    // Strike down from above
    typeTl.to(card, {
      opacity: 1, y: 0, scale: 1,
      duration: 0.08,
      ease: 'bounce.out',
      onStart: () => {
        keyCount++
        if (counterRef.value) counterRef.value.textContent = String(keyCount)
      }
    }, i * 0.12)

    // Impact shake on the card
    typeTl.to(card, {
      y: 2, duration: 0.02, ease: 'power4.in'
    }, i * 0.12 + 0.08)
    typeTl.to(card, {
      y: 0, duration: 0.03, ease: 'power2.out'
    }, i * 0.12 + 0.1)

    // Stamp effect
    const stamp = card.querySelector('.card-stamp')
    if (stamp) {
      typeTl.fromTo(stamp,
        { opacity: 0.6, scale: 1.3 },
        { opacity: 0, scale: 0.8, duration: 0.1 },
        i * 0.12
      )
    }

    // Move cursor
    if (cursorRef.value) {
      typeTl.to(cursorRef.value, {
        x: (i + 1) * 145,
        duration: 0.02
      }, i * 0.12 + 0.05)
    }
  })

  // Ribbon movement
  if (ribbonRef.value) {
    typeTl.to(ribbonRef.value.querySelector('.ribbon-band'), {
      x: -30, duration: 0.8
    }, 0)
  }

  cleanupFns.push(() => typeTl.kill())
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.typewheel-section {
  width: 100vw; height: 100vh;
  background: linear-gradient(180deg, #1a1610 0%, #22201a 50%, #1a1610 100%);
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.typewheel-bg {
  position: absolute; inset: 0; pointer-events: none;
  .paper-texture {
    position: absolute; inset: 0;
    background-image: radial-gradient(rgba(180,160,120,0.02) 1px, transparent 1px);
    background-size: 20px 20px;
  }
}
.tw-header {
  position: relative; z-index: 10; text-align: center; margin-bottom: 50px;
  .tw-badge {
    display: inline-flex; align-items: center; gap: 8px; padding: 10px 28px;
    border-radius: 40px; border: 1px solid rgba(180,160,120,0.15);
    background: rgba(180,160,120,0.05); backdrop-filter: blur(10px); margin-bottom: 12px;
    font-size: 11px; letter-spacing: 5px; color: rgba(200,180,140,0.7);
  }
  .tw-title {
    font-size: clamp(48px, 7vw, 80px); font-weight: 800; letter-spacing: 8px;
    font-family: 'Courier New', monospace;
    background: linear-gradient(180deg, #fff 0%, #d0c0a0 50%, #a09070 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 8px; filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.2));
  }
  .tw-subtitle { font-size: 16px; color: rgba(180,160,130,0.5); letter-spacing: 6px; margin: 0; }
}
.paper-area {
  position: relative; z-index: 10; width: 95%; max-width: 950px;
}
.paper-sheet {
  position: relative; padding: 30px 40px; border-radius: 4px;
  background: linear-gradient(180deg, rgba(245,240,230,0.06), rgba(240,235,220,0.04));
  border: 1px solid rgba(180,160,120,0.08);
  min-height: 260px;
  .paper-margin {
    position: absolute; left: 30px; top: 0; bottom: 0; width: 1px;
    background: rgba(200,80,80,0.15);
  }
  .paper-lines {
    position: absolute; inset: 20px 20px; display: flex; flex-direction: column; justify-content: space-between;
    .paper-line {
      width: 100%; height: 1px;
      background: rgba(100,140,200,0.04);
    }
  }
}
.type-cursor {
  position: absolute; top: 50%; left: 40px; transform: translateY(-50%);
  width: 2px; height: 30px;
  background: rgba(200,180,140,0.7);
  z-index: 20;
}
.cards-row {
  position: relative; z-index: 10;
  display: flex; gap: 10px;
}
.type-card {
  position: relative; width: 130px; flex-shrink: 0;
  .card-stamp {
    position: absolute; inset: -5px; border-radius: 24px;
    background: radial-gradient(circle, rgba(60,50,30,0.4), transparent 60%);
    opacity: 0; pointer-events: none;
  }
  .card-inner {
    padding: 24px 20px; border-radius: 24px;
    background: linear-gradient(145deg, rgba(30,26,20,0.95), rgba(25,22,16,0.98));
    border: 1px solid rgba(180,160,120,0.1);
    font-family: 'Courier New', monospace;
    .card-char {
      font-size: 24px; font-weight: 900; color: rgba(200,180,140,0.9);
      display: block; margin-bottom: 4px;
    }
    .card-title { font-size: 20px; font-weight: 700; color: #fff; margin: 2px 0; }
    .card-desc { font-size: 13px; color: rgba(180,160,130,0.5); margin: 0 0 6px; }
    .card-tag {
      font-size: 7px; letter-spacing: 2px; padding: 2px 6px; border-radius: 4px;
      background: rgba(180,160,120,0.08); color: rgba(200,180,140,0.5);
      border: 1px solid rgba(180,160,120,0.08);
    }
  }
  &:hover .card-inner {
    border-color: rgba(180,160,120,0.25);
  }
}
.ink-ribbon {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  margin-top: 50px;
  .ribbon-spool {
    width: 20px; height: 20px; border-radius: 50%;
    border: 2px solid rgba(60,50,30,0.3);
    background: rgba(40,35,25,0.5);
  }
  .ribbon-band {
    flex: 1; height: 6px; max-width: 200px;
    background: linear-gradient(90deg, rgba(20,15,10,0.6), rgba(40,30,20,0.8), rgba(20,15,10,0.6));
    border-radius: 3px;
  }
}
.tw-footer {
  position: relative; z-index: 10; margin-top: 50px; text-align: center;
  .keystroke-counter {
    display: flex; flex-direction: column; align-items: center; gap: 2px; margin-bottom: 8px;
    .counter-label { font-size: 9px; color: rgba(180,160,130,0.4); letter-spacing: 3px; }
    .counter-value { font-size: 22px; font-weight: 700; color: rgba(200,180,140,0.8); font-family: 'Courier New', monospace; }
  }
  .footer-text { font-size: 14px; letter-spacing: 3px; color: rgba(180,160,130,0.3); font-family: 'Courier New', monospace; }
}
</style>

