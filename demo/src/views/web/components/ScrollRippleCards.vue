<template>
  <div class="src-ripple-cards-section-150" ref="componentRoot">
    <div class="src-container-150">
      <h2 class="src-title-150">波纹卡片</h2>
      <p class="src-subtitle-150">Ripple Cards Effect</p>

      <div class="src-cards-grid-150">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="src-card-150"
          @mouseenter="handleRipple($event, index)"
        >
          <div class="src-ripple-effect-150"></div>
          <div class="src-card-content-150">
            <div class="src-card-image-150" :style="{ backgroundImage: `url(${card.image})` }">
              <div class="src-card-overlay-150"></div>
            </div>
            <h3 class="src-card-title-150">{{ card.title }}</h3>
            <p class="src-card-description-150">{{ card.description }}</p>
          </div>
        </div>
      </div>

      <div class="src-ripple-particles-150">
        <div v-for="i in 30" :key="i" class="src-particle-150" :style="{
          '--delay': `${i * 0.1}s`,
          '--particle-left': `${Math.random() * 100}%`,
          '--particle-top': `${Math.random() * 100}%`
        }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()

interface Card {
  image: string
  title: string
  description: string
}

const cards = ref<Card[]>([
  {
    image: new URL('@/assets/image/1.png', import.meta.url).href,
    title: '自然之美',
    description: '探索大自然的奇妙之处'
  },
  {
    image: new URL('@/assets/image/2.png', import.meta.url).href,
    title: '艺术创作',
    description: '释放内心的艺术灵感'
  },
  {
    image: new URL('@/assets/image/3.png', import.meta.url).href,
    title: '科技创新',
    description: '推动技术的前沿发展'
  },
  {
    image: new URL('@/assets/image/4.png', import.meta.url).href,
    title: '文化传承',
    description: '守护珍贵的历史文化'
  }
])

const handleRipple = (event: MouseEvent, index: number) => {
  const card = event.currentTarget as HTMLElement
  const ripple = card.querySelector('.src-ripple-effect-150') as HTMLElement

  const rect = card.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // 创建波纹效果
  const rippleElement = document.createElement('div')
  rippleElement.className = 'src-ripple-150'
  rippleElement.style.left = `${x}px`
  rippleElement.style.top = `${y}px`

  card.appendChild(rippleElement)

  gsap.fromTo(rippleElement,
    {
      scale: 0,
      opacity: 1
    },
    {
      scale: 4,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      onComplete: () => rippleElement.remove()
    }
  )

  // 卡片放大
  gsap.to(card, {
    scale: 1.02,
    duration: 0.3,
    ease: 'power2.out'
  })

  // 图片放大
  const image = card.querySelector('.src-card-image-150') as HTMLElement
  gsap.to(image, {
    scale: 1.1,
    duration: 0.5,
    ease: 'power2.out'
  })
}

const handleCardLeave = (event: MouseEvent) => {
  const card = event.currentTarget as HTMLElement
  const image = card.querySelector('.src-card-image-150') as HTMLElement

  gsap.to(card, {
    scale: 1,
    duration: 0.3,
    ease: 'power2.out'
  })

  gsap.to(image, {
    scale: 1,
    duration: 0.5,
    ease: 'power2.out'
  })
}

let ctx: gsap.Context

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return
    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.src-title-150', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.src-subtitle-150', componentRoot.value)
      const cardsEl = gsap.utils.toArray<HTMLElement>('.src-card-150', componentRoot.value)
      const cardsGrid = gsap.utils.toArray<HTMLElement>('.src-cards-grid-150', componentRoot.value)
      const cardImages = gsap.utils.toArray<HTMLElement>('.src-card-image-150', componentRoot.value)
      const cardTitles = gsap.utils.toArray<HTMLElement>('.src-card-title-150', componentRoot.value)
      const cardDescs = gsap.utils.toArray<HTMLElement>('.src-card-description-150', componentRoot.value)
      const particles = gsap.utils.toArray<HTMLElement>('.src-particle-150', componentRoot.value)
      const particlesContainer = gsap.utils.toArray<HTMLElement>('.src-ripple-particles-150', componentRoot.value)

      // 标题动画
      if (titleEl.length) {
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        })
      }

      if (subtitleEl.length) {
        gsap.from(subtitleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          y: 40,
          opacity: 0,
          duration: 1,
          delay: 0.2,
          ease: 'power3.out'
        })
      }

      // 卡片入场动画
      if (cardsEl.length && cardsGrid.length) {
        gsap.from(cardsEl, {
          scrollTrigger: {
            trigger: cardsGrid[0],
            start: 'top 85%'
          },
          y: 100,
          opacity: 0,
          scale: 0.9,
          duration: 1,
          ease: 'back.out(1.5)',
          stagger: 0.15
        })

        // 卡片视差
        gsap.to(cardsEl, {
          y: (i) => (i % 2 === 0 ? -50 : 50),
          scrollTrigger: {
            trigger: cardsGrid[0],
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        })
      }

      // 图片缩放动画
      if (cardImages.length) {
        gsap.from(cardImages, {
          scrollTrigger: {
            trigger: cardsGrid[0] || componentRoot.value,
            start: 'top 80%'
          },
          scale: 1.2,
          duration: 1.5,
          ease: 'power2.out',
          stagger: 0.1
        })
      }

      // 文字渐入
      if (cardTitles.length) {
        gsap.from(cardTitles, {
          scrollTrigger: {
            trigger: cardsGrid[0] || componentRoot.value,
            start: 'top 80%'
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1
        })
      }

      if (cardDescs.length) {
        gsap.from(cardDescs, {
          scrollTrigger: {
            trigger: cardsGrid[0] || componentRoot.value,
            start: 'top 80%'
          },
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          delay: 0.2
        })
      }

      // 粒子动画
      if (particles.length && particlesContainer.length) {
        gsap.from(particles, {
          scrollTrigger: {
            trigger: particlesContainer[0],
            start: 'top 90%'
          },
          scale: 0,
          opacity: 0,
          duration: 1,
          ease: 'back.out(1.7)',
          stagger: 0.05
        })

        // 粒子持续动画
        gsap.to(particles, {
          y: 'random(-80, 80)',
          x: 'random(-40, 40)',
          scale: 'random(0.5, 1.5)',
          duration: 'random(2, 4)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: {
            each: 0.1,
            from: 'random'
          }
        })
      }

    // 为所有卡片添加鼠标移出事件
    document.querySelectorAll('.src-card-150').forEach((card) => {
      card.addEventListener('mouseleave', handleCardLeave)
    })
  }, componentRoot.value)
  })
})

onUnmounted(() => {
  document.querySelectorAll('.src-card-150').forEach((card) => {
    card.removeEventListener('mouseleave', handleCardLeave)
  })
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.src-ripple-cards-section-150 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 25% 25%, rgba(236, 72, 153, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.08) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.src-container-150 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.src-title-150 {
  text-align: center;
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #f472b6, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.src-subtitle-150 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 80px;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

.src-cards-grid-150 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 40px;
  margin-bottom: 60px;
}

.src-card-150 {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 20px 60px rgba(236, 72, 153, 0.2);
  
  opacity: 1 !important;}
}

.src-ripple-effect-150 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.src-ripple-150 {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.3), transparent);
  transform: translate(-50%, -50%);
  pointer-events: none;

  opacity: 1 !important;}

.src-card-content-150 {
  padding: 30px;

  opacity: 1 !important;}

.src-card-image-150 {
  width: 100%;
  height: 250px;
  border-radius: 16px;
  background-size: cover;
  background-position: center;
  margin-bottom: 24px;
  overflow: hidden;
  position: relative;
  transition: transform 0.5s ease;

  opacity: 1 !important;}

.src-card-overlay-150 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%);

  opacity: 1 !important;}

.src-card-title-150 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
  letter-spacing: 0.05em;

  opacity: 1 !important;}

.src-card-description-150 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;

  opacity: 1 !important;}

.src-ripple-particles-150 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.src-particle-150 {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.6), transparent);
  border-radius: 50%;
  left: var(--particle-left);
  top: var(--particle-top);
  animation: float var(--delay) ease-in-out infinite;

  opacity: 1 !important;}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-40px);
  }
}

@media (max-width: 768px) {
  .src-cards-grid-150 {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .src-card-image-150 {
    height: 200px;
  
  opacity: 1 !important;}

  .src-card-title-150 {
    font-size: 1.5rem;
  
  opacity: 1 !important;}
}
</style>
