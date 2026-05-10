<template>
  <section class="snr-neon-rain-section-173" ref="componentRoot">
    <div class="snr-container-173">
      <h2 class="snr-title-173">霓虹雨</h2>
      <p class="snr-subtitle-173">Neon Rain</p>

      <div class="snr-cards-stage-173">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="snr-neon-card-173"
          :ref="el => { if (el) cardRefs[index] = el as HTMLElement }"
          :data-index="index"
          @mouseenter="handleCardEnter(index)"
          @mouseleave="handleCardLeave(index)"
        >
          <div class="snr-card-glow-173"></div>
          <div class="snr-card-border-173"></div>
          <div class="snr-card-content-173">
            <div class="snr-card-number-173">{{ String(index + 1).padStart(2, '0') }}</div>
            <h3 class="snr-card-title-173">{{ card.title }}</h3>
            <p class="snr-card-desc-173">{{ card.description }}</p>
            <div class="snr-card-icon-173">{{ card.icon }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()
const cardRefs = ref<HTMLElement[]>([])

interface Card {
  icon: string
  title: string
  description: string
  color: string
}

const cards: Card[] = [
  {
    icon: '💎',
    title: '钻石',
    description: 'Diamond Rain',
    color: '#00ffff'
  },
  {
    icon: '⚡',
    title: '闪电',
    description: 'Lightning Rain',
    color: '#ffff00'
  },
  {
    icon: '🔮',
    title: '水晶',
    description: 'Crystal Rain',
    color: '#ff00ff'
  },
  {
    icon: '🌟',
    title: '星光',
    description: 'Star Rain',
    color: '#ff6600'
  }
]

let gsapCtx: gsap.Context

const handleCardEnter = (index: number) => {
  const card = cardRefs.value[index]
  if (!card) return

  const cardColor = cards[index].color

  gsap.to(card.querySelector('.snr-card-glow-173'), {
    opacity: 0.5,
    scale: 1.2,
    duration: 0.3,
    ease: 'power2.out'
  })

  gsap.to(card.querySelector('.snr-card-border-173'), {
    borderColor: cardColor,
    boxShadow: `0 0 30px ${cardColor}, 0 0 60px ${cardColor}`,
    duration: 0.3
  })

  gsap.to(card.querySelector('.snr-card-number-173'), {
    scale: 1.1,
    color: cardColor,
    duration: 0.3
  })
}

const handleCardLeave = (index: number) => {
  const card = cardRefs.value[index]
  if (!card) return

  gsap.to(card.querySelector('.snr-card-glow-173'), {
    opacity: 0,
    scale: 1,
    duration: 0.3,
    ease: 'power2.out'
  })

  gsap.to(card.querySelector('.snr-card-border-173'), {
    borderColor: 'rgba(255, 255, 255, 0.2)',
    boxShadow: 'none',
    duration: 0.3
  })

  gsap.to(card.querySelector('.snr-card-number-173'), {
    scale: 1,
    color: 'rgba(255, 255, 255, 0.5)',
    duration: 0.3
  })
}

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return

    gsapCtx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.snr-title-173', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.snr-subtitle-173', componentRoot.value)
      const neonCards = gsap.utils.toArray<HTMLElement>('.snr-neon-card-173', componentRoot.value)

      if (titleEl.length) {
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 100,
          opacity: 0,
          scale: 0.5,
          rotationX: 45,
          duration: 1.5,
          ease: 'power4.out'
        })

        gsap.to(titleEl, {
          textShadow: `
            0 0 10px #00ffff,
            0 0 20px #00ffff,
            0 0 30px #00ffff,
            0 0 40px #00ffff
          `,
          duration: 1,
          delay: 0.5,
          ease: 'power2.inOut'
        })
      }

      if (subtitleEl.length) {
        gsap.from(subtitleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          y: 60,
          opacity: 0,
          scale: 0.8,
          duration: 1.2,
          delay: 0.3,
          ease: 'power3.out'
        })
      }

      if (neonCards.length) {
        gsap.from(neonCards, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1,
          },
          y: 200,
          opacity: 0,
          scale: 0.6,
          rotationY: 180,
          stagger: 0.2,
          duration: 2
        })
      }
    }, componentRoot.value)
  }, 100)
})

onUnmounted(() => {
  gsapCtx?.revert()
})
</script>

<style scoped lang="scss">
.snr-neon-rain-section-173 {
  position: relative;
  min-height: 100vh;
  padding: 120px 20px;
  background: linear-gradient(180deg, #050510 0%, #0a0a20 50%, #050510 100%);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(ellipse at 20% 80%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(255, 0, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.snr-container-173 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 2;

  opacity: 1 !important;}

.snr-title-173 {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 800;
  color: #fff;
  text-align: center;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 50%, #ffff00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;

  opacity: 1 !important;}

.snr-subtitle-173 {
  font-size: clamp(1.2rem, 3vw, 2rem);
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin-bottom: 100px;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);

  opacity: 1 !important;}

.snr-cards-stage-173 {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 50px;
  padding: 60px 40px;
  z-index: 2;
  margin-top: 100px;

  opacity: 1 !important;}

.snr-neon-card-173 {
  position: relative;
  background: rgba(10, 10, 25, 0.9);
  border-radius: 24px;
  padding: 50px;
  overflow: hidden;
  cursor: pointer;
  transform-style: preserve-3d;
  perspective: 1000px;
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(
      from 0deg,
      transparent,
      rgba(0, 255, 255, 0.1),
      transparent,
      rgba(255, 0, 255, 0.1),
      transparent
    );
    animation: neon-rotate 10s linear infinite;
    opacity: 0;
    transition: opacity 0.5s;
    pointer-events: none;
  }

  &:hover::before {
    opacity: 1;
  }
}

@keyframes neon-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.snr-card-glow-173 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s;
}

.snr-card-border-173 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 24px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  pointer-events: none;
  transition: all 0.3s;
  z-index: 1;

  opacity: 1 !important;}

.snr-card-content-173 {
  position: relative;
  z-index: 3;
  text-align: center;

  opacity: 1 !important;}

.snr-card-number-173 {
  font-size: 5rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 20px;
  transition: all 0.3s;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);

  opacity: 1 !important;}

.snr-card-title-173 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);

  opacity: 1 !important;}

.snr-card-desc-173 {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 30px;
  letter-spacing: 0.1em;
  text-transform: uppercase;

  opacity: 1 !important;}

.snr-card-icon-173 {
  font-size: 5rem;
  filter: drop-shadow(0 0 30px currentColor);
  animation: icon-float 3s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes icon-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
