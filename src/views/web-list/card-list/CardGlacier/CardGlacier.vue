<template>
  <div class="card-glacier">
    <div ref="bgRef" class="glacier-bg">
      <div class="ice-formations">
        <div class="ice-crystal crystal-1"></div>
        <div class="ice-crystal crystal-2"></div>
        <div class="ice-crystal crystal-3"></div>
      </div>
      <div class="aurora-borealis"></div>
      <div class="snow-particles"></div>
      <div class="frost-overlay"></div>
    </div>

    <div class="glacier-content">
      <div ref="titleRef" class="glacier-title">
        <span class="title-en">GLACIER</span>
        <span class="title-cn">冰川纪元</span>
      </div>

      <div ref="cardsWrapRef" class="glacier-cards">
        <div
          v-for="(card, index) in glacierCards"
          :key="index"
          :ref="el => cardRefs[index] = el as HTMLElement"
          class="glacier-item"
        >
          <div class="item-icon">
            <div class="crystal-container">
              <div class="facet facet-1"></div>
              <div class="facet facet-2"></div>
              <div class="facet facet-3"></div>
              <div class="facet-center"></div>
            </div>
          </div>
          <div class="item-num">{{ card.num }}</div>
          <div class="item-title">{{ card.title }}</div>
          <div class="item-desc">{{ card.desc }}</div>
          <div class="item-frost-line"></div>
        </div>
      </div>
    </div>

    <div ref="lightRef1" class="aurora-light light-1"></div>
    <div ref="lightRef2" class="aurora-light light-2"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const bgRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const cardRefs = ref<(HTMLElement | null)[]>([])
const lightRef1 = ref<HTMLElement | null>(null)
const lightRef2 = ref<HTMLElement | null>(null)

const glacierCards = [
  { num: '01', title: '冰晶形成', desc: '水分子在低温下的结晶过程' },
  { num: '02', title: '冰川移动', desc: '冰体沿坡向下的缓慢流动' },
  { num: '03', title: '冰舌延伸', desc: '海洋边缘的冰架扩张' },
  { num: '04', title: '冰裂崩解', desc: '冰山脱离主冰体的瞬间' }
]

const initAnimations = () => {
  const tl = gsap.timeline()

  // Ice crystals
  const crystals = bgRef.value?.querySelectorAll('.ice-crystal')
  crystals?.forEach((crystal, i) => {
    tl.fromTo(crystal,
      { scale: 0, opacity: 0, rotation: -90 },
      { scale: 1, opacity: 1, rotation: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)' },
      i * 0.2
    )
    cleanupFns.push(() => gsap.set(crystal, { clearProps: 'all' }))
  })

  // Aurora borealis
  const aurora = bgRef.value?.querySelector('.aurora-borealis')
  if (aurora) {
    tl.fromTo(aurora,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 2, ease: 'power2.out' },
      0.5
    )
    cleanupFns.push(() => gsap.set(aurora, { clearProps: 'all' }))
  }

  // Snow particles
  const snowflakes = bgRef.value?.querySelectorAll('.snowflake')
  snowflakes?.forEach((flake, i) => {
    tl.fromTo(flake,
      { y: -20, opacity: 0 },
      { y: window.innerHeight + 20, opacity: 0.8, duration: 4 + Math.random() * 2, ease: 'power1.out' },
      0.3 + i * 0.1
    )
  })

  // Aurora lights
  ;[lightRef1.value, lightRef2.value].forEach((light, i) => {
    if (!light) return
    tl.fromTo(light,
      { opacity: 0, x: i === 0 ? -100 : 100 },
      { opacity: 1, x: 0, duration: 1.5, ease: 'power2.out' },
      0.6 + i * 0.3
    )
    cleanupFns.push(() => gsap.set(light, { clearProps: 'all' }))
  })

  // Title with zoom-out-right
  if (titleRef.value) {
    tl.fromTo(titleRef.value,
      { x: -200, scale: 1.2, opacity: 0, filter: 'blur(10px)' },
      { x: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'back.out(1.5)' }
    )
    cleanupFns.push(() => gsap.set(titleRef.value, { clearProps: 'all' }))
  }

  // Cards with zoom-out-right
  cardRefs.value.forEach((card, i) => {
    if (!card) return

    tl.fromTo(card,
      { x: -200, scale: 1.2, opacity: 0, filter: 'blur(12px)' },
      { x: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'back.out(1.5)' },
      0.4 + i * 0.15
    )

    // Hover animation
    const handleEnter = () => {
      gsap.to(card, {
        y: -8,
        scale: 1.03,
        boxShadow: '0 25px 70px rgba(100, 200, 255, 0.35)',
        duration: 0.35,
        ease: 'power2.out'
      })
      gsap.to(card.querySelectorAll('.facet'), {
        rotation: '+=30',
        duration: 0.5,
        ease: 'power2.out'
      })
    }

    const handleLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: '0 15px 50px rgba(0, 0, 0, 0.2)',
        duration: 0.35,
        ease: 'power2.out'
      })
      gsap.to(card.querySelectorAll('.facet'), {
        rotation: '-=30',
        duration: 0.5,
        ease: 'power2.out'
      })
    }

    card.addEventListener('mouseenter', handleEnter)
    card.addEventListener('mouseleave', handleLeave)

    cleanupFns.push(() => {
      card.removeEventListener('mouseenter', handleEnter)
      card.removeEventListener('mouseleave', handleLeave)
      gsap.set(card, { clearProps: 'all' })
    })
  })

  // ScrollTrigger for cards
  cardRefs.value.forEach((card) => {
    if (!card) return

    const st = ScrollTrigger.create({
      trigger: card,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(card, {
          x: 200 * self.progress,
          scale: 1 + self.progress * 0.4,
          opacity: Math.max(0, 1 - self.progress * 2.2),
          filter: `blur(${self.progress * 10}px)`
        })
      }
    })
    cleanupFns.push(() => st.kill())
  })

  // ScrollTrigger for title
  if (titleRef.value) {
    const st = ScrollTrigger.create({
      trigger: titleRef.value,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(titleRef.value, {
          x: 150 * self.progress,
          opacity: Math.max(0, 1 - self.progress * 2)
        })
      }
    })
    cleanupFns.push(() => st.kill())
  }
}

onMounted(() => {
  initAnimations()
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style lang="scss" scoped>
.card-glacier {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #0a1525 0%, #0d1f35 50%, #081520 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.glacier-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.ice-formations {
  position: absolute;
  inset: 0;
}

.ice-crystal {
  position: absolute;
  background: linear-gradient(135deg, rgba(200, 240, 255, 0.3), rgba(100, 180, 255, 0.15));
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  filter: blur(1px);

  &.crystal-1 {
    width: 200px;
    height: 200px;
    top: 10%;
    right: 5%;
    animation: crystalFloat 8s ease-in-out infinite;
  }

  &.crystal-2 {
    width: 150px;
    height: 150px;
    bottom: 20%;
    left: 8%;
    animation: crystalFloat 10s ease-in-out infinite reverse;
  }

  &.crystal-3 {
    width: 100px;
    height: 100px;
    top: 30%;
    left: 15%;
    animation: crystalFloat 6s ease-in-out infinite;
    opacity: 0.6;
  }
}

@keyframes crystalFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.aurora-borealis {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    180deg,
    rgba(100, 200, 255, 0.1) 0%,
    rgba(150, 255, 200, 0.08) 30%,
    rgba(200, 150, 255, 0.05) 60%,
    transparent 100%
  );
  filter: blur(60px);
  animation: auroraWave 10s ease-in-out infinite;
}

@keyframes auroraWave {
  0%, 100% { opacity: 0.6; transform: translateX(-5%); }
  50% { opacity: 1; transform: translateX(5%); }
}

.snow-particles {
  position: absolute;
  inset: 0;
}

:global(.snowflake) {
  position: absolute;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(200, 230, 255, 0.5) 50%, transparent 100%);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  animation: snowfall linear infinite;

  $durations: 4s, 5s, 6s, 7s, 5.5s, 6.5s, 4.5s, 7.5s, 5s, 6s,
              6s, 4s, 5.5s, 7s, 6.5s, 5s, 4.5s, 6s, 7.5s, 5.5s,
              7s, 6s, 5s, 4s, 6.5s, 7s, 5.5s, 4.5s, 6s, 5s;

  $delays: -1s, -2s, -3s, -4s, -1.5s, -2.5s, -3.5s, -4.5s, -1s, -2s,
           -3s, -4s, -1.5s, -2.5s, -3.5s, -4.5s, -1s, -2s, -3s, -4s,
           -1.5s, -2.5s, -3.5s, -4.5s, -1s, -2s, -3s, -4s, -1.5s, -2.5s;

  $sizes: 4px, 6px, 8px, 5px, 7px, 9px, 4px, 6px, 8px, 5px,
           7px, 9px, 4px, 6px, 8px, 5px, 7px, 9px, 4px, 6px,
           8px, 5px, 7px, 9px, 4px, 6px, 8px, 5px, 7px, 9px;

  @for $i from 1 through 30 {
    &:nth-child(#{$i}) {
      left: random(100) * 1%;
      animation-duration: nth($durations, $i);
      animation-delay: nth($delays, $i);
      width: nth($sizes, $i);
      height: nth($sizes, $i);
    }
  }
}

@keyframes snowfall {
  0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
  10% { opacity: 0.8; }
  90% { opacity: 0.8; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
}

.frost-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 100%, rgba(150, 220, 255, 0.1) 0%, transparent 60%);
  pointer-events: none;
}

.glacier-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 60px;
}

.glacier-title {
  margin-bottom: 80px;

  .title-en {
    display: block;
    font-family: 'Orbitron', sans-serif;
    font-size: 72px;
    font-weight: 900;
    letter-spacing: 25px;
    background: linear-gradient(180deg, #ffffff 0%, #a8e0ff 40%, #60c0ff 70%, #4080ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 60px rgba(150, 200, 255, 0.6);
    filter: drop-shadow(0 0 30px rgba(100, 200, 255, 0.5));
  }

  .title-cn {
    display: block;
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 28px;
    font-weight: 300;
    letter-spacing: 18px;
    color: rgba(150, 220, 255, 0.8);
    margin-top: 15px;
  }
}

.glacier-cards {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
}

.glacier-item {
  position: relative;
  width: 240px;
  padding: 35px 25px;
  background: rgba(15, 30, 50, 0.75);
  border: 1px solid rgba(150, 220, 255, 0.2);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(150, 220, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(200, 240, 255, 0.5), transparent);
  }
}

.item-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 20px;
}

.crystal-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.facet {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid rgba(150, 220, 255, 0.4);
  transform-origin: center;

  &.facet-1 {
    width: 70px;
    height: 70px;
    transform: translate(-50%, -50%) rotate(0deg);
    border-radius: 4px;
  }

  &.facet-2 {
    width: 50px;
    height: 50px;
    transform: translate(-50%, -50%) rotate(45deg);
    border-radius: 3px;
  }

  &.facet-3 {
    width: 30px;
    height: 30px;
    transform: translate(-50%, -50%) rotate(22.5deg);
    border-radius: 2px;
  }
}

.facet-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: radial-gradient(circle, #a8e0ff 0%, #60c0ff 100%);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(150, 220, 255, 0.8);
}

.item-num {
  font-family: 'Orbitron', sans-serif;
  font-size: 42px;
  font-weight: 700;
  color: rgba(150, 220, 255, 0.1);
  margin-bottom: 8px;
}

.item-title {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10px;
  text-shadow: 0 0 15px rgba(150, 220, 255, 0.4);
}

.item-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
}

.item-frost-line {
  position: absolute;
  bottom: 15px;
  left: 20%;
  right: 20%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(150, 220, 255, 0.4), transparent);
}

.aurora-light {
  position: absolute;
  width: 40%;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(150, 255, 200, 0.4), transparent);
  border-radius: 2px;
  filter: blur(3px);

  &.light-1 {
    top: 25%;
    right: 5%;
    transform: rotate(-20deg);
    animation: lightFlicker 4s ease-in-out infinite;
  }

  &.light-2 {
    bottom: 30%;
    left: 10%;
    transform: rotate(15deg);
    animation: lightFlicker 5s ease-in-out infinite reverse;
  }
}

@keyframes lightFlicker {
  0%, 100% { opacity: 0.4; width: 35%; }
  50% { opacity: 0.7; width: 45%; }
}
</style>
