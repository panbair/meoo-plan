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
  background: 
    radial-gradient(circle at 50% 50%, rgba(100,120,200,0.06) 0%, transparent 50%),
    linear-gradient(180deg, #08080c 0%, #10101a 50%, #08080c 100%);
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.elevator-bg {
  position: absolute; inset: 0; pointer-events: none;
  .shaft-lines {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(100,120,160,0.04) 1px, transparent 1px);
    background-size: 100% 80px;
  }
}
.elev-header {
  position: relative; z-index: 10; text-align: center; margin-bottom: 50px;
  .elev-badge {
    display: inline-flex; align-items: center; gap: 8px; padding: 12px 32px;
    border-radius: 50px; 
    border: 1px solid rgba(120,140,200,0.2);
    background: linear-gradient(135deg, rgba(120,140,200,0.08), rgba(100,120,180,0.04));
    backdrop-filter: blur(12px);
    box-shadow: 
      0 4px 20px rgba(120,140,200,0.12),
      inset 0 1px 0 rgba(255,255,255,0.06);
    margin-bottom: 16px;
    font-size: 11px; letter-spacing: 6px; 
    color: rgba(170,190,230,0.85);
    transition: all 0.3s ease;
    span:first-child { 
      font-size: 18px;
      filter: drop-shadow(0 0 10px rgba(120,140,200,0.5));
    }
    &:hover {
      border-color: rgba(140,160,220,0.35);
      box-shadow: 0 6px 30px rgba(120,140,200,0.18);
      transform: translateY(-2px);
    }
  }
  .elev-title {
    font-size: clamp(52px, 7.5vw, 88px); 
    font-weight: 900; 
    letter-spacing: 10px;
    background: linear-gradient(180deg, #ffffff 0%, #c0d0f0 30%, #a0b0d0 60%, #8090b0 100%);
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 12px;
    filter: drop-shadow(0 0 50px rgba(120,140,200,0.4));
    animation: elevGlow 3s ease-in-out infinite alternate;
  }
  .elev-subtitle { 
    font-size: 16px; 
    color: rgba(170,190,230,0.65); 
    letter-spacing: 8px;
    font-weight: 300;
    margin: 0;
    text-shadow: 0 0 20px rgba(120,140,200,0.2);
  }
}
.elevator-shaft {
  position: relative; z-index: 10; width: 90%; max-width: 620px;
  display: flex; gap: 24px;
}
.floor-indicators {
  display: flex; flex-direction: column; gap: 14px; padding: 10px 0;
  .floor-ind {
    display: flex; align-items: center; gap: 8px;
    .floor-num { 
      font-size: 12px; 
      color: rgba(170,190,230,0.35); 
      font-family: 'Courier New', monospace; 
      width: 28px;
      font-weight: 600;
    }
    .floor-dot { 
      width: 8px; height: 8px; 
      border-radius: 50%; 
      background: rgba(100,120,160,0.2); 
      transition: all 0.3s;
    }
    &.active {
      .floor-num { 
        color: rgba(100,200,255,0.9);
        text-shadow: 0 0 10px rgba(100,200,255,0.4);
      }
      .floor-dot { 
        background: rgba(100,200,255,0.7); 
        box-shadow: 0 0 12px rgba(100,200,255,0.5);
        transform: scale(1.2);
      }
    }
  }
}
.shaft-container {
  flex: 1; position: relative; min-height: 420px;
  border: 1px solid rgba(100,120,160,0.12);
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(18,18,28,0.6), rgba(12,12,22,0.7));
  box-shadow: 
    0 8px 32px rgba(0,0,0,0.4),
    inset 0 1px 0 rgba(255,255,255,0.05);
  overflow: hidden;
}
.elevator-car {
  position: absolute; left: 12px; right: 12px; height: 72px;
  bottom: 12px; border-radius: 20px; overflow: hidden;
  transition: transform 0.3s ease;
  .door-left, .door-right {
    position: absolute; top: 0; width: 50%; height: 100%; z-index: 5;
    background: linear-gradient(90deg, rgba(65,70,85,0.96), rgba(75,80,95,0.92));
    border: 1px solid rgba(120,140,180,0.15);
    box-shadow: inset 0 0 20px rgba(0,0,0,0.3);
  }
  .door-left { left: 0; border-radius: 8px 0 0 8px; }
  .door-right { right: 0; border-radius: 0 8px 8px 0; }
  .car-content {
    position: relative; z-index: 2; padding: 22px 20px; height: 100%;
    display: flex; align-items: center; gap: 12px;
    background: linear-gradient(145deg, rgba(22,22,38,0.96), rgba(16,16,30,0.98));
    border-radius: 20px;
    border: 1px solid rgba(100,120,160,0.1);
    box-shadow: 
      0 4px 16px rgba(0,0,0,0.3),
      inset 0 1px 0 rgba(255,255,255,0.05);
    .floor-display {
      font-size: 20px; font-weight: 900; color: rgba(100,200,255,0.8);
      font-family: 'Courier New', monospace; min-width: 36px;
      text-shadow: 0 0 15px rgba(100,200,255,0.4);
    }
    .car-index { 
      font-size: 9px; 
      color: rgba(130,150,190,0.35);
      font-weight: 600;
    }
    .car-title { 
      font-size: 21px; 
      font-weight: 800; 
      color: #fff; 
      margin: 0;
      text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    .car-desc { 
      font-size: 13px; 
      color: rgba(170,190,230,0.6);
      margin: 0;
    }
    .car-footer {
      margin-left: auto; display: flex; flex-direction: column; align-items: flex-end; gap: 5px;
      .car-tag {
        font-size: 8px; letter-spacing: 3px; padding: 3px 8px; border-radius: 6px;
        background: linear-gradient(135deg, rgba(100,120,200,0.1), rgba(80,100,180,0.06));
        color: rgba(170,190,230,0.65);
        border: 1px solid rgba(100,120,200,0.12);
        font-weight: 600;
      }
      .car-direction { 
        font-size: 16px; 
        color: rgba(100,200,255,0.6);
        text-shadow: 0 0 10px rgba(100,200,255,0.3);
      }
    }
  }
  &:hover {
    transform: scale(1.02);
    .car-content {
      border-color: rgba(120,140,200,0.2);
      box-shadow: 
        0 6px 24px rgba(100,120,200,0.12),
        inset 0 1px 0 rgba(255,255,255,0.08);
    }
  }
}
.cable-line {
  position: absolute; top: 0; right: 30px; width: 2px; height: 100%;
  background: linear-gradient(180deg, rgba(120,140,180,0.25), rgba(120,140,180,0.08));
  box-shadow: 0 0 8px rgba(120,140,180,0.2);
}
.elev-footer {
  position: relative; z-index: 10; margin-top: 50px; text-align: center;
  .elev-buttons {
    display: flex; gap: 10px; justify-content: center; margin-bottom: 10px;
    span {
      width: 32px; height: 32px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 15px; color: rgba(170,190,230,0.6);
      border: 1px solid rgba(120,140,200,0.18);
      background: linear-gradient(135deg, rgba(120,140,200,0.06), rgba(100,120,180,0.04));
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      transition: all 0.2s;
      cursor: pointer;
      &:hover {
        border-color: rgba(140,160,220,0.35);
        background: rgba(120,140,200,0.1);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(120,140,200,0.15);
      }
    }
  }
  .footer-text { 
    font-size: 14px; 
    letter-spacing: 4px; 
    color: rgba(170,190,230,0.45);
    font-weight: 500;
    text-shadow: 0 0 15px rgba(120,140,200,0.15);
  }
}
@keyframes elevGlow {
  0% { filter: drop-shadow(0 0 40px rgba(120,140,200,0.35)); }
  100% { filter: drop-shadow(0 0 60px rgba(120,140,200,0.5)); }
}
</style>

