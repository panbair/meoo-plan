<template>
  <section ref="containerRef" class="elevator-section">
    <div class="elevator-bg">
      <div class="shaft-lines"></div>
    </div>
    <div ref="headerRef" class="elev-header">
      <div ref="badgeRef" class="elev-badge"><span>🛗</span><span>VERTICAL TRANSIT</span></div>
      <h1 ref="titleRef" class="elev-title">ELEVATOR</h1>
      <p ref="subtitleRef" class="elev-subtitle">电梯升降 · 门开门关 · 楼层交错</p>
    </div>
    <div ref="shaftRef" class="elevator-shaft">
      <!-- 楼层指示 -->
      <div class="floor-indicators">
        <div v-for="f in floors" :key="f" class="floor-ind" :class="{ active: currentFloor === f }">
          <span class="floor-num">{{ f }}F</span>
          <span class="floor-dot"></span>
        </div>
      </div>
      <!-- 电梯井道 -->
      <div class="shaft-container">
        <div v-for="(card, i) in cards" :key="i"
          :ref="el => cardRefs[i] = el as HTMLElement"
          class="elevator-car" :data-floor="card.floor">
          <!-- 电梯门 -->
          <div class="door-left" :ref="el => doorLeftRefs[i] = el as HTMLElement"></div>
          <div class="door-right" :ref="el => doorRightRefs[i] = el as HTMLElement"></div>
          <!-- 卡片内容 -->
          <div class="car-content">
            <div class="floor-display">{{ card.floor }}F</div>
            <span class="car-index">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="car-title">{{ card.title }}</h3>
            <p class="car-desc">{{ card.desc }}</p>
            <div class="car-footer">
              <span class="car-tag">{{ card.tag }}</span>
              <span class="car-direction">{{ card.dir }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 缆绳 -->
      <div class="cable-line"></div>
    </div>
    <div ref="footerRef" class="elev-footer">
      <div class="elev-buttons">
        <span class="btn-up">▲</span>
        <span class="btn-down">▼</span>
      </div>
      <span class="footer-text">SCROLL TO OPERATE</span>
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
const shaftRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const cardRefs = ref<(HTMLElement | null)[]>([])
const doorLeftRefs = ref<(HTMLElement | null)[]>([])
const doorRightRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: (() => void)[] = []
const currentFloor = ref(1)
const floors = [5, 4, 3, 2, 1]

const cards = [
  { title: 'Lobby', desc: '大堂入口', tag: 'PUBLIC', floor: 1, dir: '▲' },
  { title: 'Office', desc: '办公区域', tag: 'WORK', floor: 2, dir: '▲' },
  { title: 'Lab', desc: '实验空间', tag: 'TECH', floor: 3, dir: '▲' },
  { title: 'Lounge', desc: '休息楼层', tag: 'REST', floor: 4, dir: '▼' },
  { title: 'Sky', desc: '天台观景', tag: 'VIEW', floor: 5, dir: '—' },
]

onMounted(() => {
  if (!containerRef.value) return
  const allCars = cardRefs.value.filter(Boolean) as HTMLElement[]
  const allDoorL = doorLeftRefs.value.filter(Boolean) as HTMLElement[]
  const allDoorR = doorRightRefs.value.filter(Boolean) as HTMLElement[]

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -30, filter: 'blur(10px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 20 })
  // Cars stacked at bottom, doors closed
  allCars.forEach((car, i) => {
    gsap.set(car, { y: 300 + i * 20, opacity: 0 })
  })
  allDoorL.forEach(d => gsap.set(d, { x: '0%' }))
  allDoorR.forEach(d => gsap.set(d, { x: '0%' }))

  const introTl = gsap.timeline({
    scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' }
  })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power3.out'
  }).to(footerRef.value, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
  cleanupFns.push(() => introTl.kill())

  // Elevator animation
  const elevTl = gsap.timeline({
    scrollTrigger: {
      trigger: shaftRef.value,
      start: 'top 75%',
      end: 'top 10%',
      scrub: 1.5,
      immediateRender: false,
      onUpdate: (self) => {
        currentFloor.value = Math.min(5, Math.max(1, Math.ceil(self.progress * 5)))
      }
    }
  })

  // Each car rises to its floor, doors open
  allCars.forEach((car, i) => {
    const targetY = -i * 70 // spread vertically
    const offset = i * 0.15

    // Rise to floor
    elevTl.to(car, {
      y: targetY, opacity: 1,
      duration: 0.2, ease: 'power2.out'
    }, offset)

    // Doors open
    if (allDoorL[i] && allDoorR[i]) {
      elevTl.to(allDoorL[i], { x: '-100%', duration: 0.1, ease: 'power2.inOut' }, offset + 0.15)
      elevTl.to(allDoorR[i], { x: '100%', duration: 0.1, ease: 'power2.inOut' }, offset + 0.15)
    }
  })

  cleanupFns.push(() => elevTl.kill())
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.elevator-section {
  width: 100vw; height: 100vh;
  background: linear-gradient(180deg, #08080c 0%, #10101a 50%, #08080c 100%);
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.elevator-bg {
  position: absolute; inset: 0; pointer-events: none;
  .shaft-lines {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(100,120,160,0.03) 1px, transparent 1px);
    background-size: 100% 80px;
  }
}
.elev-header {
  position: relative; z-index: 10; text-align: center; margin-bottom: 50px;
  .elev-badge {
    display: inline-flex; align-items: center; gap: 8px; padding: 10px 28px;
    border-radius: 40px; border: 1px solid rgba(120,140,200,0.15);
    background: rgba(120,140,200,0.05); backdrop-filter: blur(10px); margin-bottom: 12px;
    font-size: 11px; letter-spacing: 5px; color: rgba(160,180,220,0.7);
  }
  .elev-title {
    font-size: clamp(48px, 7vw, 80px); font-weight: 800; letter-spacing: 8px;
    background: linear-gradient(180deg, #fff 0%, #b0c0e0 50%, #8090b0 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 8px; filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.2));
  }
  .elev-subtitle { font-size: 16px; color: rgba(160,180,220,0.5); letter-spacing: 6px; margin: 0; }
}
.elevator-shaft {
  position: relative; z-index: 10; width: 90%; max-width: 600px;
  display: flex; gap: 20px;
}
.floor-indicators {
  display: flex; flex-direction: column; gap: 12px; padding: 10px 0;
  .floor-ind {
    display: flex; align-items: center; gap: 6px;
    .floor-num { font-size: 11px; color: rgba(160,180,220,0.3); font-family: 'Courier New', monospace; width: 24px; }
    .floor-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(100,120,160,0.15); transition: all 0.3s; }
    &.active {
      .floor-num { color: rgba(100,200,255,0.8); }
      .floor-dot { background: rgba(100,200,255,0.6); box-shadow: 0 0 8px rgba(100,200,255,0.3); }
    }
  }
}
.shaft-container {
  flex: 1; position: relative; min-height: 400px;
  border: 1px solid rgba(100,120,160,0.08); border-radius: 20px;
  background: rgba(15,15,25,0.5); overflow: hidden;
}
.elevator-car {
  position: absolute; left: 10px; right: 10px; height: 70px;
  bottom: 10px; border-radius: 20px; overflow: hidden;
  .door-left, .door-right {
    position: absolute; top: 0; width: 50%; height: 100%; z-index: 5;
    background: linear-gradient(90deg, rgba(60,65,80,0.95), rgba(70,75,90,0.9));
    border: 1px solid rgba(120,140,180,0.1);
  }
  .door-left { left: 0; border-radius: 8px 0 0 8px; }
  .door-right { right: 0; border-radius: 0 8px 8px 0; }
  .car-content {
    position: relative; z-index: 2; padding: 20px 18px; height: 100%;
    display: flex; align-items: center; gap: 10px;
    background: linear-gradient(145deg, rgba(20,20,35,0.95), rgba(15,15,28,0.98));
    border-radius: 20px;
    .floor-display {
      font-size: 18px; font-weight: 800; color: rgba(100,200,255,0.7);
      font-family: 'Courier New', monospace; min-width: 32px;
    }
    .car-index { font-size: 8px; color: rgba(120,140,180,0.3); }
    .car-title { font-size: 20px; font-weight: 700; color: #fff; margin: 0; }
    .car-desc { font-size: 13px; color: rgba(160,180,220,0.5); margin: 0; }
    .car-footer {
      margin-left: auto; display: flex; flex-direction: column; align-items: flex-end; gap: 4px;
      .car-tag {
        font-size: 7px; letter-spacing: 3px; padding: 2px 6px; border-radius: 4px;
        background: rgba(100,120,200,0.08); color: rgba(160,180,220,0.5);
      }
      .car-direction { font-size: 14px; color: rgba(100,200,255,0.5); }
    }
  }
}
.cable-line {
  position: absolute; top: 0; right: 30px; width: 1px; height: 100%;
  background: linear-gradient(180deg, rgba(120,140,180,0.2), rgba(120,140,180,0.05));
}
.elev-footer {
  position: relative; z-index: 10; margin-top: 50px; text-align: center;
  .elev-buttons {
    display: flex; gap: 8px; justify-content: center; margin-bottom: 8px;
    span {
      width: 28px; height: 28px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; color: rgba(160,180,220,0.5);
      border: 1px solid rgba(120,140,200,0.12); background: rgba(120,140,200,0.04);
    }
  }
  .footer-text { font-size: 14px; letter-spacing: 3px; color: rgba(160,180,220,0.3); }
}
</style>

