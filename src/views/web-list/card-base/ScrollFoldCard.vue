<template>
  <section class="sfc-scroll-fold-card-132">
    <div class="sfc-container-132">
      <h2 class="sfc-section-title-132">折叠卡片</h2>
      <p class="sfc-section-subtitle-132">Fold Card Animation</p>

      <div class="sfc-cards-container-132">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="sfc-card-wrapper-132"
          :ref="el => { if (el) cardRefs[index] = el as HTMLElement }"
        >
          <div class="sfc-card-132">
            <div class="sfc-card-inner-132">
              <div class="sfc-card-front-132">
                <img :src="card.image" :alt="`Card ${index + 1}`" />
                <div class="sfc-front-overlay-132">
                  <h3>{{ card.title }}</h3>
                </div>
              </div>
              <div class="sfc-card-back-132">
                <div class="sfc-back-content-132">
                  <h3>{{ card.title }}</h3>
                  <p>{{ card.description }}</p>
                  <button class="sfc-card-btn-132">了解更多</button>
                </div>
              </div>
            </div>
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

const cardRefs = ref<HTMLElement[]>([])

const cards = [
  {
    title: '创新设计',
    description: '采用前沿的设计理念，融合科技与艺术',
    image: new URL('@/assets/image/1.png', import.meta.url).href
  },
  {
    title: '流畅体验',
    description: '精心打磨的每一个交互细节，带来极致体验',
    image: new URL('@/assets/image/2.png', import.meta.url).href
  },
  {
    title: '视觉盛宴',
    description: '精美的视觉效果，让人眼前一亮',
    image: new URL('@/assets/image/3.png', import.meta.url).href
  },
  {
    title: '性能卓越',
    description: '优化的性能表现，流畅不卡顿',
    image: new URL('@/assets/image/4.png', import.meta.url).href
  },
  {
    title: '响应式布局',
    description: '适配各种设备，随时随地完美呈现',
    image: new URL('@/assets/image/5.png', import.meta.url).href
  },
  {
    title: '易用性',
    description: '简单直观的操作，轻松上手',
    image: new URL('@/assets/image/6.png', import.meta.url).href
  }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题折叠进入
    gsap.from('.sfc-section-title-132', {
      scrollTrigger: {
        trigger: '.sfc-scroll-fold-card-132',
        start: 'top 90%',
        end: 'top 70%',
        scrub: 1
      },
      scale: 0.8,
      opacity: 0,
      rotateX: 30,
      ease: 'power3.out'
    })

    gsap.from('.sfc-section-subtitle-132', {
      scrollTrigger: {
        trigger: '.sfc-scroll-fold-card-132',
        start: 'top 85%',
        end: 'top 65%',
        scrub: 1
      },
      y: 40,
      opacity: 0,
      ease: 'power3.out'
    })

    // 卡片折叠动画
    cardRefs.value.forEach((wrapper, index) => {
      const card = wrapper.querySelector('.sfc-card-132') as HTMLElement
      const cardInner = wrapper.querySelector('.sfc-card-inner-132') as HTMLElement
      const front = wrapper.querySelector('.sfc-card-front-132') as HTMLElement
      const back = wrapper.querySelector('.sfc-card-back-132') as HTMLElement

      // 初始折叠状态 - 减小角度并增加透明度
      gsap.set(wrapper, {
        rotateX: 45,
        rotateY: (index - 2.5) * 10,
        scale: 0.6,
        opacity: 0.6,
        filter: 'blur(2px)'
      })

      gsap.set(cardInner, {
        rotateY: 0
      })

      // 滚动展开 - 扩大滚动范围
      gsap.to(wrapper, {
        scrollTrigger: {
          trigger: wrapper,
          start: 'top 85%',
          end: 'top 30%',
          scrub: 2.5
        },
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power3.out'
      })

      // 持续微动
      gsap.to(wrapper, {
        rotateY: (index - 2.5) * 3,
        duration: 4 + index,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      // 悬停翻转效果
      card.addEventListener('mouseenter', () => {
        gsap.to(cardInner, {
          rotateY: 180,
          duration: 0.8,
          ease: 'back.out(1.2)'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(cardInner, {
          rotateY: 0,
          duration: 0.8,
          ease: 'power2.out'
        })
      })

      // 前面图片缩放 - 增强效果并扩大滚动范围
      gsap.fromTo(front.querySelector('img'),
        { scale: 1.2 },
        {
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 85%',
            end: 'bottom 10%',
            scrub: 2.5
          },
          scale: 1,
          ease: 'power1.inOut'
        }
      )
    })

    // 滚动视差效果 - 增强效果
    gsap.to('.sfc-cards-container-132', {
      y: -100,
      scrollTrigger: {
        trigger: '.sfc-cards-container-132',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      },
      ease: 'none'
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.sfc-scroll-fold-card-132 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #1e1e3f 30%, #0f0f2a 60%, #1e1e3f 100%);
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
      radial-gradient(circle at 20% 30%, rgba(236, 72, 153, 0.12) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.12) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 60%);
    pointer-events: none;
    animation: bg-pulse 10s ease-in-out infinite;
  
  opacity: 1 !important;}
}

@keyframes bg-pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.sfc-container-132 {
  max-width: 1600px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.sfc-section-title-132 {
  text-align: center;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ec4899, #a855f7, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 80px rgba(168, 85, 247, 0.5);

  opacity: 1 !important;}

.sfc-section-subtitle-132 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 120px;
  letter-spacing: 0.3em;
  text-transform: uppercase;

  opacity: 1 !important;}

.sfc-cards-container-132 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 50px;
  perspective: 2000px;
  padding: 80px 0;

  opacity: 1 !important;}

.sfc-card-wrapper-132 {
  position: relative;
  height: 420px;
  transform-style: preserve-3d;
  cursor: pointer;

  opacity: 1 !important;}

.sfc-card-132 {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.sfc-card-inner-132 {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);

  opacity: 1 !important;}

.sfc-card-front-132,
.sfc-card-back-132 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);

  opacity: 1 !important;}

.sfc-card-front-132 {
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.9) contrast(110%);
    transition: filter 0.3s ease;
  
  opacity: 1 !important;}

  &:hover img {
    filter: brightness(1) contrast(120%);
  }
}

.sfc-front-overlay-132 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: #fff;

  h3 {
    font-size: 1.8rem;
    font-weight: 700;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  
  opacity: 1 !important;}
}

.sfc-card-back-132 {
  transform: rotateY(180deg);
  background: linear-gradient(135deg, #1a1a3a 0%, #2d2d5a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 30% 30%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.sfc-back-content-132 {
  text-align: center;
  color: #fff;
  z-index: 1;

  h3 {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 15px;
    background: linear-gradient(135deg, #ec4899, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  
  opacity: 1 !important;}

  p {
    font-size: 1rem;
    line-height: 1.6;
    opacity: 0.9;
    margin-bottom: 25px;
  }
}

.sfc-card-btn-132 {
  padding: 12px 30px;
  background: linear-gradient(135deg, #ec4899, #a855f7);
  color: #fff;
  border: none;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(236, 72, 153, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(236, 72, 153, 0.5);
  
  opacity: 1 !important;}
}

@media (max-width: 768px) {
  .sfc-cards-container-132 {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
  }

  .sfc-card-wrapper-132 {
    height: 350px;
  
  opacity: 1 !important;}

  .sfc-section-title-132 {
    margin-bottom: 80px;
  }

  .sfc-section-subtitle-132 {
    margin-bottom: 80px;
    font-size: 0.9rem;
  
  opacity: 1 !important;}
}
</style>
