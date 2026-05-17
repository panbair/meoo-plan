<template>
  <section class="mc-scroll-magnetic-cards-137">
    <div class="mc-container-137">
      <h2 class="mc-title-137">磁性卡片</h2>
      <p class="mc-subtitle-137">Magnetic Cards</p>

      <div class="mc-stage-137" ref="stage">
        <div
          v-for="(card, index) in cards"
          :key="index"
          :ref="el => { if (el) cardRefs[index] = el as HTMLElement }"
          :class="`mc-card-${137} mc-card-${index}-137`"
          @mousemove="handleMouseMove(index, $event)"
          @mouseleave="handleMouseLeave(index)"
        >
          <div class="mc-card-content-137">
            <div class="mc-card-icon-137">{{ card.icon }}</div>
            <h3 class="mc-card-title-137">{{ card.title }}</h3>
            <p class="mc-card-desc-137">{{ card.description }}</p>
            <div class="mc-card-glow-137"></div>
          </div>
        </div>
      </div>

      <div class="mc-hint-137">
        <p>移动鼠标体验磁力效果</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stage = ref<HTMLElement>()
const cardRefs = ref<HTMLElement[]>([])
const mousePositions = ref<Record<number, { x: number; y: number }>>({})

const cards = [
  {
    icon: '🎯',
    title: '精准定位',
    description: '精准捕捉每一个细节'
  },
  {
    icon: '⚡',
    title: '极速响应',
    description: '毫秒级的交互反馈'
  },
  {
    icon: '🎨',
    title: '极致设计',
    description: '艺术与技术的完美融合'
  },
  {
    icon: '🔥',
    title: '热烈激情',
    description: '对完美的不懈追求'
  }
]

const handleMouseMove = (index: number, event: MouseEvent) => {
  const card = cardRefs.value[index]
  if (!card) return

  const rect = card.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  const mouseX = event.clientX - centerX
  const mouseY = event.clientY - centerY

  const rotateX = (mouseY / rect.height) * -20
  const rotateY = (mouseX / rect.width) * 20

  gsap.to(card, {
    rotateX,
    rotateY,
    duration: 0.3,
    ease: 'power2.out'
  })

  // 光晕跟随
  const glow = card.querySelector('.mc-card-glow-137') as HTMLElement
  if (glow) {
    const xPercent = (mouseX / rect.width) * 100
    const yPercent = (mouseY / rect.height) * 100

    gsap.to(glow, {
      x: xPercent,
      y: yPercent,
      duration: 0.3,
      ease: 'power2.out'
    })
  }
}

const handleMouseLeave = (index: number) => {
  const card = cardRefs.value[index]
  if (!card) return

  gsap.to(card, {
    rotateX: 0,
    rotateY: 0,
    duration: 0.5,
    ease: 'elastic.out(1, 0.5)'
  })

  const glow = card.querySelector('.mc-card-glow-137') as HTMLElement
  if (glow) {
    gsap.to(glow, {
      x: 50,
      y: 50,
      duration: 0.5,
      ease: 'power2.out'
    })
  }
}

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.mc-title-137', {
      scrollTrigger: {
        trigger: '.mc-scroll-magnetic-cards-137',
        start: 'top 90%',
        end: 'top 70%',
        scrub: 1
      },
      opacity: 0,
      y: -50,
      filter: 'blur(20px)',
      ease: 'power2.out'
    })

    gsap.from('.mc-subtitle-137', {
      scrollTrigger: {
        trigger: '.mc-scroll-magnetic-cards-137',
        start: 'top 85%',
        end: 'top 65%',
        scrub: 1
      },
      opacity: 0,
      y: 30,
      ease: 'power2.out'
    })

    // 卡片入场动画
    cardRefs.value.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 1.5
        },
        y: 150,
        scale: 0.8,
        opacity: 0,
        filter: 'blur(10px)',
        ease: 'power3.out',
        delay: index * 0.1
      })
    })

    // 卡片浮动动画
    cardRefs.value.forEach((card, index) => {
      gsap.to(card, {
        y: Math.sin(index * 0.5) * 20,
        duration: 3 + index * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.2
      })
    })

    // 提示动画
    gsap.from('.mc-hint-137', {
      scrollTrigger: {
        trigger: stage.value,
        start: 'bottom 25%',
        end: 'bottom 15%',
        scrub: 1
      },
      opacity: 0,
      y: 20,
      ease: 'power2.out'
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.mc-scroll-magnetic-cards-137 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 30%, #0f0f2a 60%, #1a1a3a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.mc-container-137 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;

  opacity: 1 !important;}

.mc-title-137 {
  text-align: center;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #a855f7, #3b82f6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 80px rgba(168, 85, 247, 0.5);

  opacity: 1 !important;}

.mc-subtitle-137 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 120px;
  letter-spacing: 0.3em;
  text-transform: uppercase;

  opacity: 1 !important;}

.mc-stage-137 {
  position: relative;
  min-height: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
  perspective: 2000px;

  opacity: 1 !important;}

.mc-card-137 {
  width: 300px;
  height: 400px;
  position: relative;
  transform-style: preserve-3d;
  cursor: pointer;
  will-change: transform;

  opacity: 1 !important;}

.mc-card-content-137 {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(59, 130, 246, 0.1));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transition: box-shadow 0.3s ease;

  opacity: 1 !important;}

.mc-card-content-137:hover {
  box-shadow: 0 30px 60px rgba(168, 85, 247, 0.3);
}

.mc-card-icon-137 {
  font-size: 5rem;
  filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.5));
  transition: transform 0.3s ease;

  opacity: 1 !important;}

.mc-card-137:hover .mc-card-icon-137 {
  transform: scale(1.1) rotate(5deg);
}

.mc-card-title-137 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  text-align: center;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

.mc-card-desc-137 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  line-height: 1.6;

  opacity: 1 !important;}

.mc-card-glow-137 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.5;
  filter: blur(40px);
  transition: transform 0.3s ease;
}

.mc-hint-137 {
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-top: 60px;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .mc-card-137 {
    width: 260px;
    height: 350px;
  
  opacity: 1 !important;}

  .mc-stage-137 {
    gap: 30px;
    min-height: 600px;
  
  opacity: 1 !important;}

  .mc-card-icon-137 {
    font-size: 4rem;
  
  opacity: 1 !important;}

  .mc-card-title-137 {
    font-size: 1.5rem;
  
  opacity: 1 !important;}

  .mc-card-desc-137 {
    font-size: 0.9rem;
  
  opacity: 1 !important;}
}
</style>
