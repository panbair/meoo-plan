<template>
  <section ref="containerRef" class="shadow-theater-section"
    @mousemove="onMouseMove" @touchmove.prevent="onTouchMove">
    <div class="theater-bg">
      <div class="curtain left-curtain"></div>
      <div class="curtain right-curtain"></div>
      <div class="stage-floor"></div>
    </div>
    <!-- 聚光灯 -->
    <div ref="spotlightRef" class="spotlight"
      :style="{ left: lightX + 'px', top: lightY + 'px' }">
      <div class="spot-cone"></div>
      <div class="spot-core"></div>
    </div>
    <div ref="headerRef" class="theater-header">
      <div ref="badgeRef" class="theater-badge">
        <span class="badge-icon">🎭</span>
        <span class="badge-text">SHADOW THEATER</span>
      </div>
      <h1 ref="titleRef" class="theater-title">SHADOW THEATER</h1>
      <p ref="subtitleRef" class="theater-subtitle">光影剧场 · 剪影叙事 · 实时投影</p>
    </div>
    <div ref="stageRef" class="stage-area">
      <div v-for="(card, i) in cards" :key="i"
        :ref="el => cardRefs[i] = el as HTMLElement"
        class="shadow-card"
        :style="{
          '--shadow-x': shadowOffsets[i]?.x + 'px',
          '--shadow-y': shadowOffsets[i]?.y + 'px',
          '--shadow-blur': shadowOffsets[i]?.blur + 'px',
          '--shadow-opacity': shadowOffsets[i]?.opacity,
          '--lit': cardLit[i] ? 1 : 0
        }">
        <div class="card-silhouette">
          <div class="silhouette-icon">{{ card.icon }}</div>
          <div class="silhouette-body">
            <span class="s-index">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="s-title">{{ card.title }}</h3>
            <p class="s-desc">{{ card.desc }}</p>
          </div>
        </div>
        <div class="card-shadow-cast"></div>
        <div class="card-lit-reveal">
          <div class="lit-icon">{{ card.icon }}</div>
          <div class="lit-body">
            <span class="l-index">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="l-title">{{ card.title }}</h3>
            <p class="l-desc">{{ card.desc }}</p>
            <span class="l-tag">{{ card.tag }}</span>
          </div>
        </div>
      </div>
    </div>
    <div ref="footerRef" class="theater-footer">
      <span class="footer-text">MOVE CURSOR TO CAST LIGHT</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const containerRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const spotlightRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const cardRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: (() => void)[] = []

const lightX = ref(0)
const lightY = ref(0)
const cardLit = reactive<boolean[]>([false, false, false, false, false])

const cards = [
  { icon: '🏰', title: 'Castle', desc: '古堡剪影', tag: 'SCENE' },
  { icon: '🐉', title: 'Dragon', desc: '巨龙身影', tag: 'BEAST' },
  { icon: '⚔️', title: 'Knight', desc: '骑士轮廓', tag: 'HERO' },
  { icon: '🌙', title: 'Moon', desc: '月夜背景', tag: 'NIGHT' },
  { icon: '🔥', title: 'Flame', desc: '火焰光源', tag: 'LIGHT' },
]

const shadowOffsets = computed(() => {
  return cards.map((_, i) => {
    const el = cardRefs.value[i]
    if (!el || !containerRef.value) return { x: 10, y: 15, blur: 20, opacity: 0.4 }
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = cx - lightX.value
    const dy = cy - lightY.value
    const dist = Math.sqrt(dx * dx + dy * dy) || 1
    const maxOffset = 30
    const factor = Math.min(1, dist / 400)
    return {
      x: (dx / dist) * maxOffset * factor,
      y: (dy / dist) * maxOffset * factor,
      blur: 10 + factor * 25,
      opacity: 0.2 + factor * 0.4
    }
  })
})

const onMouseMove = (e: MouseEvent) => {
  lightX.value = e.clientX
  lightY.value = e.clientY
  checkLit()
}

const onTouchMove = (e: TouchEvent) => {
  const t = e.touches[0]
  lightX.value = t.clientX
  lightY.value = t.clientY
  checkLit()
}

const checkLit = () => {
  cardRefs.value.forEach((el, i) => {
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dist = Math.sqrt((cx - lightX.value) ** 2 + (cy - lightY.value) ** 2)
    cardLit[i] = dist < 150
  })
}

onMounted(() => {
  if (!containerRef.value) return
  // Initialize light position to center
  const rect = containerRef.value.getBoundingClientRect()
  lightX.value = rect.left + rect.width / 2
  lightY.value = rect.top + rect.height / 2

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -30, filter: 'blur(10px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 20 })

  const allCards = cardRefs.value.filter(Boolean) as HTMLElement[]
  gsap.set(allCards, { opacity: 0, y: 60 })

  const introTl = gsap.timeline({
    scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' }
  })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power3.out'
  })
  .to(allCards, {
    opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(1.3)'
  }, '-=0.3')
  .to(footerRef.value, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
  cleanupFns.push(() => introTl.kill())
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.shadow-theater-section {
  width: 100vw; height: 100vh;
  background: 
    radial-gradient(circle at 50% 50%, rgba(200,160,80,0.06) 0%, transparent 50%),
    linear-gradient(180deg, #0a0806 0%, #12100a 50%, #0a0806 100%);
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  cursor: none;
}
.theater-bg {
  position: absolute; inset: 0; pointer-events: none;
  .curtain {
    position: absolute; top: 0; width: 15%; height: 100%;
    &.left-curtain { 
      left: 0; 
      background: linear-gradient(90deg, rgba(100,20,20,0.18), transparent);
      box-shadow: 5px 0 20px rgba(100,20,20,0.1);
    }
    &.right-curtain { 
      right: 0; 
      background: linear-gradient(-90deg, rgba(100,20,20,0.18), transparent);
      box-shadow: -5px 0 20px rgba(100,20,20,0.1);
    }
  }
  .stage-floor {
    position: absolute; bottom: 0; left: 0; right: 0; height: 30%;
    background: linear-gradient(180deg, transparent, rgba(40,30,20,0.25));
  }
}
.spotlight {
  position: fixed; z-index: 100; pointer-events: none;
  transform: translate(-50%, -50%);
  .spot-cone {
    width: 320px; height: 320px;
    background: radial-gradient(circle, rgba(255,240,200,0.1), rgba(255,240,200,0.03) 40%, transparent 70%);
    border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    box-shadow: 0 0 40px rgba(255,240,200,0.08);
  }
  .spot-core {
    width: 14px; height: 14px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,240,200,0.7), rgba(255,200,100,0.4));
    box-shadow: 
      0 0 20px rgba(255,240,200,0.5),
      0 0 40px rgba(255,200,100,0.3);
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  }
}
.theater-header {
  position: relative; z-index: 10; text-align: center; margin-bottom: 50px;
  .theater-badge {
    display: inline-flex; align-items: center; gap: 8px; padding: 12px 32px;
    border-radius: 50px; 
    border: 1px solid rgba(200,160,80,0.25);
    background: linear-gradient(135deg, rgba(200,160,80,0.08), rgba(180,140,60,0.04));
    backdrop-filter: blur(12px);
    box-shadow: 
      0 4px 20px rgba(200,160,80,0.12),
      inset 0 1px 0 rgba(255,255,255,0.06);
    margin-bottom: 16px;
    font-size: 11px; letter-spacing: 6px; 
    color: rgba(230,200,130,0.8);
    transition: all 0.3s ease;
    .badge-icon { 
      font-size: 16px;
      filter: drop-shadow(0 0 10px rgba(200,160,80,0.5));
    }
    &:hover {
      border-color: rgba(220,180,100,0.4);
      box-shadow: 0 6px 30px rgba(200,160,80,0.2);
      transform: translateY(-2px);
    }
  }
  .theater-title {
    font-size: clamp(52px, 7.5vw, 88px); 
    font-weight: 900; 
    letter-spacing: 10px;
    background: linear-gradient(180deg, #ffffff 0%, #e0c070 30%, #d0b060 60%, #a08040 100%);
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 12px;
    filter: drop-shadow(0 0 60px rgba(200,160,80,0.4));
    animation: theaterGlow 3s ease-in-out infinite alternate;
  }
  .theater-subtitle { 
    font-size: 16px; 
    color: rgba(210,190,150,0.6);
    letter-spacing: 8px;
    font-weight: 300;
    margin: 0;
    text-shadow: 0 0 20px rgba(200,160,80,0.2);
  }
}
.stage-area {
  position: relative; z-index: 10;
  display: flex; gap: 22px; flex-wrap: wrap; justify-content: center;
  max-width: 900px; width: 90%;
}
.shadow-card {
  position: relative; width: 150px;
  .card-silhouette {
    position: relative; z-index: 2; padding: 26px 22px; border-radius: 28px;
    background: rgba(10,8,6,0.96);
    border: 1px solid rgba(200,160,80,0.1);
    filter: drop-shadow(var(--shadow-x) var(--shadow-y) var(--shadow-blur) rgba(0,0,0,var(--shadow-opacity)));
    transition: all 0.1s ease-out;
    opacity: calc(1 - var(--lit) * 0.8);
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    .silhouette-icon { 
      font-size: 32px; 
      margin-bottom: 10px; 
      filter: brightness(0.3);
    }
    .silhouette-body {
      .s-index { 
        font-size: 9px; 
        color: rgba(255,255,255,0.18); 
        letter-spacing: 2px;
        font-weight: 600;
      }
      .s-title { 
        font-size: 15px; 
        font-weight: 700; 
        color: rgba(255,255,255,0.25); 
        margin: 5px 0;
      }
      .s-desc { 
        font-size: 11px; 
        color: rgba(255,255,255,0.15); 
        margin: 0;
      }
    }
  }
  .card-shadow-cast {
    position: absolute; bottom: -10px; left: 10%; right: 10%; height: 12px;
    background: radial-gradient(ellipse, rgba(0,0,0,0.35), transparent 70%);
    border-radius: 50%;
  }
  .card-lit-reveal {
    position: absolute; inset: 0; z-index: 3; padding: 26px 22px; border-radius: 28px;
    background: linear-gradient(145deg, rgba(32,27,17,0.96), rgba(22,18,12,0.98));
    border: 1px solid rgba(200,160,80,0.25);
    opacity: var(--lit);
    transition: opacity 0.3s ease;
    box-shadow: 
      0 0 30px rgba(255,200,100,0.15),
      inset 0 1px 0 rgba(255,255,255,0.06);
    .lit-icon { 
      font-size: 32px; 
      margin-bottom: 10px;
      filter: drop-shadow(0 0 10px rgba(255,200,100,0.3));
    }
    .lit-body {
      .l-index { 
        font-size: 9px; 
        color: rgba(230,200,130,0.5); 
        letter-spacing: 2px;
        font-weight: 600;
      }
      .l-title { 
        font-size: 15px; 
        font-weight: 800; 
        color: rgba(255,245,210,0.98); 
        margin: 5px 0;
        text-shadow: 0 0 10px rgba(255,200,100,0.2);
      }
      .l-desc { 
        font-size: 11px; 
        color: rgba(230,210,170,0.6);
        margin: 0 0 8px;
      }
      .l-tag {
        font-size: 8px; letter-spacing: 3px; padding: 3px 10px; border-radius: 10px;
        background: rgba(210,170,90,0.12); color: rgba(230,200,130,0.7);
        border: 1px solid rgba(210,170,90,0.15);
        font-weight: 600;
      }
    }
  }
  &:hover .card-silhouette {
    border-color: rgba(200,160,80,0.2);
  }
}
.theater-footer {
  position: relative; z-index: 10; margin-top: 30px; text-align: center;
  .footer-text { 
    font-size: 14px; 
    letter-spacing: 4px; 
    color: rgba(210,190,150,0.4);
    font-weight: 500;
    text-shadow: 0 0 15px rgba(200,160,80,0.15);
  }
}
@keyframes theaterGlow {
  0% { filter: drop-shadow(0 0 50px rgba(200,160,80,0.35)); }
  100% { filter: drop-shadow(0 0 70px rgba(200,160,80,0.5)); }
}
</style>

