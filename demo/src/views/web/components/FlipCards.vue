<template>
  <div class="flip-cards-section-58">
    <div class="section-header-58">
      <h2 class="title-58">FLIP CARDS</h2>
      <p class="subtitle-58">翻转卡片动画</p>
    </div>

    <div class="flip-container-58">
      <div class="flip-card-58" v-for="(card, index) in cards" :key="index" @click="toggleFlip(index)">
        <div class="flip-card-inner-58" :class="{ 'flip-flipped-58': cards[index].flipped }">
          <div class="flip-card-front-58">
            <div class="card-image-58" :style="{ backgroundImage: `url(${card.image})` }"></div>
            <div class="card-badge-58">{{ index + 1 }}</div>
            <div class="card-front-content-58">
              <h3>{{ card.title }}</h3>
              <p>点击翻转</p>
            </div>
          </div>
          <div class="flip-card-back-58">
            <div class="back-content-58">
              <h3>{{ card.title }}</h3>
              <p>{{ card.description }}</p>
              <button class="back-btn-58">了解更多</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flip-controls-58">
      <button class="control-btn-58" @click="flipAll">全部翻转</button>
      <button class="control-btn-58" @click="resetAll">重置</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cards = ref([
  { image: new URL('@/assets/image/1.png', import.meta.url).href, title: '探索', description: '发现未知的世界', flipped: false },
  { image: new URL('@/assets/image/2.png', import.meta.url).href, title: '创造', description: '构建美好的未来', flipped: false },
  { image: new URL('@/assets/image/3.png', import.meta.url).href, title: '创新', description: '突破传统的边界', flipped: false },
  { image: new URL('@/assets/image/4.png', import.meta.url).href, title: '灵感', description: '捕捉瞬间的创意', flipped: false },
  { image: new URL('@/assets/image/5.png', import.meta.url).href, title: '梦想', description: '追逐心中的星辰', flipped: false },
  { image: new URL('@/assets/image/6.png', import.meta.url).href, title: '奇迹', description: '见证不可思议', flipped: false }
])

let ctx: gsap.Context

const toggleFlip = (index: number) => {
  cards.value[index].flipped = !cards.value[index].flipped
}

const flipAll = () => {
  cards.value.forEach((card, i) => {
    setTimeout(() => {
      card.flipped = true
    }, i * 100)
  })
}

const resetAll = () => {
  cards.value.forEach((card, i) => {
    setTimeout(() => {
      card.flipped = false
    }, i * 100)
  })
}

const initAnimations = () => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.flip-cards-section-58 .title-58', {
      scrollTrigger: {
        trigger: '.flip-cards-section-58',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 60,
      opacity: 0,
      ease: 'power3.out',
      duration: 0.8
    })

    // 副标题动画
    gsap.from('.flip-cards-section-58 .subtitle-58', {
      scrollTrigger: {
        trigger: '.flip-cards-section-58',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      y: 40,
      opacity: 0,
      ease: 'power3.out',
      duration: 0.8,
      delay: 0.2
    })

    // 卡片入场
    gsap.from('.flip-card-58', {
      scrollTrigger: {
        trigger: '.flip-container-58',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      y: 150,
      opacity: 0,
      scale: 0.8,
      rotationX: -45,
      stagger: 0.15,
      ease: 'back.out(1.5)',
      duration: 0.8
    })

    // 图片渐入
    gsap.from('.card-image-58', {
      scrollTrigger: {
        trigger: '.flip-container-58',
        start: 'top 65%',
        toggleActions: 'play none none reverse'
      },
      scale: 1.5,
      opacity: 0,
      stagger: 0.15,
      ease: 'power2.out',
      duration: 0.6
    })

    // 徽章动画
    gsap.from('.card-badge-58', {
      scrollTrigger: {
        trigger: '.flip-container-58',
        start: 'top 65%',
        toggleActions: 'play none none reverse'
      },
      scale: 0,
      rotation: -180,
      stagger: 0.15,
      ease: 'back.out(1.7)',
      duration: 0.5
    })

    // 前面内容动画
    gsap.from('.card-front-content-58', {
      scrollTrigger: {
        trigger: '.flip-container-58',
        start: 'top 60%',
        toggleActions: 'play none none reverse'
      },
      y: 40,
      opacity: 0,
      stagger: 0.15,
      ease: 'power3.out',
      duration: 0.6
    })

    // 滚动视差
    gsap.to('.flip-card-58', {
      scrollTrigger: {
        trigger: '.flip-container-58',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: (i) => (i % 2 === 0 ? -30 : 30),
      ease: 'none'
    })

    // 图片滚动缩放
    gsap.to('.card-image-58', {
      scrollTrigger: {
        trigger: '.flip-container-58',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      },
      scale: 1.1,
      ease: 'none'
    })

    // 按钮动画
    gsap.from('.control-btn-58', {
      scrollTrigger: {
        trigger: '.flip-controls-58',
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      stagger: 0.1,
      ease: 'power3.out',
      duration: 0.6
    })
  })
}

onMounted(() => {
  initAnimations()
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.flip-cards-section-58 { min-height: 100vh;
  padding: 80px 40px;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b69 100%);
  position: relative;
  overflow: hidden;
      opacity: 1;
    }

.section-header-58 {
  text-align: center;
  margin-bottom: 80px;

  opacity: 1 !important;}

.title-58 {
  font-size: 56px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 6px;
  text-transform: uppercase;
  text-shadow: 0 0 30px rgba(45, 27, 105, 0.5);

  opacity: 1 !important;}

.subtitle-58 {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 16px;
  letter-spacing: 3px;
  text-transform: uppercase;

  opacity: 1 !important;}

.flip-container-58 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 0;

  opacity: 1 !important;}

.flip-card-58 { height: 400px;
  perspective: 1000px;
  cursor: pointer;
      opacity: 1;
    }

.flip-card-inner-58 { position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
      opacity: 1;
    }

.flip-card-inner-58.flip-flipped-58 { transform: rotateY(180deg);
      opacity: 1;
    }

.flip-card-front-58,
.flip-card-back-58 { position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      opacity: 1;
    }

.flip-card-front-58 { background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
      opacity: 1;
    }

.flip-card-back-58 { background: linear-gradient(135deg, #2d1b69 0%, #5c3d7a 100%);
  transform: rotateY(180deg);
  display: flex;
  align-items: center;
  justify-content: center;
      opacity: 1;
    }

.card-image-58 {
  width: 100%;
  height: 280px;
  background-size: cover;
  background-position: center;

  opacity: 1 !important;}

.card-badge-58 {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background: rgba(45, 27, 105, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  border: 2px solid rgba(45, 27, 105, 0.5);

  opacity: 1 !important;}

.card-front-content-58 {
  padding: 20px;

  opacity: 1 !important;}

.card-front-content-58 h3 {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.card-front-content-58 p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.back-content-58 {
  padding: 40px;
  text-align: center;

  opacity: 1 !important;}

.back-content-58 h3 {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
}

.back-content-58 p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 24px;
}

.back-btn-58 {
  padding: 12px 32px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;

  opacity: 1 !important;}

.back-btn-58:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.flip-controls-58 {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 60px;
}

.control-btn-58 {
  padding: 16px 40px;
  background: linear-gradient(135deg, #2d1b69 0%, #5c3d7a 100%);
  border: none;
  border-radius: 30px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: 0 10px 30px rgba(45, 27, 105, 0.3);

  opacity: 1 !important;}

.control-btn-58:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(45, 27, 105, 0.4);
}

@media (max-width: 768px) {
  .title-58 {
    font-size: 32px;
    letter-spacing: 3px;
  
  opacity: 1 !important;}

  .subtitle-58 {
    font-size: 14px;
  
  opacity: 1 !important;}

  .flip-container-58 {
    gap: 24px;
  }

  .flip-card-58 { height: 350px;
      opacity: 1;
    }
}
</style>
