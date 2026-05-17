<template>
  <div class="morphing-cards-section-60">
    <div class="mc-section-header-60">
      <h2 class="mc-title-60">MORPHING CARDS</h2>
      <p class="mc-subtitle-60">变形卡片动画</p>
    </div>

    <div class="mc-morphing-container-60">
      <div class="mc-morphing-card-60" v-for="(card, index) in cards" :key="index" @click="toggleMorph(index)">
        <div class="mc-card-inner-60" :class="{ 'mc-morphed-60': cards[index].morphed }">
          <div class="mc-card-image-60" :style="{ backgroundImage: `url(${card.image})` }"></div>
          <div class="mc-card-content-60">
            <div class="mc-card-number-60">{{ String(index + 1).padStart(2, '0') }}</div>
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mc-morphing-controls-60">
      <button class="mc-control-btn-60" @click="morphAll">全部变形</button>
      <button class="mc-control-btn-60" @click="resetAll">重置</button>
      <button class="mc-control-btn-60" @click="randomMorph">随机变形</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cards = ref([
  { image: new URL('@/assets/image/1.png', import.meta.url).href, title: '圆形', description: 'Circle Shape', morphed: false },
  { image: new URL('@/assets/image/2.png', import.meta.url).href, title: '方形', description: 'Square Shape', morphed: false },
  { image: new URL('@/assets/image/3.png', import.meta.url).href, title: '三角', description: 'Triangle Shape', morphed: false },
  { image: new URL('@/assets/image/4.png', import.meta.url).href, title: '菱形', description: 'Diamond Shape', morphed: false },
  { image: new URL('@/assets/image/5.png', import.meta.url).href, title: '六边', description: 'Hexagon Shape', morphed: false },
  { image: new URL('@/assets/image/6.png', import.meta.url).href, title: '星形', description: 'Star Shape', morphed: false }
])

let ctx: gsap.Context

const toggleMorph = (index: number) => {
  cards.value[index].morphed = !cards.value[index].morphed

  // 变形动画 - 使用gsap.utils.toArray自动清理
  const cardElements = gsap.utils.toArray('.mc-card-inner-60')
  const imageElements = gsap.utils.toArray('.mc-card-image-60')
  const numberElements = gsap.utils.toArray('.mc-card-number-60')

  const cardInner = cardElements[index] as HTMLElement
  const cardImage = imageElements[index] as HTMLElement
  const cardNumber = numberElements[index] as HTMLElement

  if (cards.value[index].morphed) {
    // 变形状态
    gsap.to(cardInner, {
      borderRadius: '50%',
      rotation: 45,
      scale: 1.1,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)'
    })
    gsap.to(cardImage, {
      scale: 1.2,
      rotation: -10,
      duration: 0.5,
      ease: 'power2.out'
    })
    gsap.to(cardNumber, {
      scale: 1.5,
      rotation: 90,
      duration: 0.4,
      ease: 'back.out(1.7)'
    })
  } else {
    // 恢复状态
    gsap.to(cardInner, {
      borderRadius: '24px',
      rotation: 0,
      scale: 1,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)'
    })
    gsap.to(cardImage, {
      scale: 1,
      rotation: 0,
      duration: 0.5,
      ease: 'power2.out'
    })
    gsap.to(cardNumber, {
      scale: 1,
      rotation: 0,
      duration: 0.4,
      ease: 'power2.out'
    })
  }
}

const morphAll = () => {
  cards.value.forEach((card, i) => {
    setTimeout(() => {
      if (!card.morphed) {
        toggleMorph(i)
      }
    }, i * 100)
  })
}

const resetAll = () => {
  cards.value.forEach((card, i) => {
    setTimeout(() => {
      if (card.morphed) {
        toggleMorph(i)
      }
    }, i * 100)
  })
}

const randomMorph = () => {
  cards.value.forEach((card, i) => {
    const shouldMorph = Math.random() > 0.5
    if (card.morphed !== shouldMorph) {
      setTimeout(() => {
        toggleMorph(i)
      }, i * 80)
    }
  })
}

const initAnimations = () => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.mc-title-60', {
      scrollTrigger: {
        trigger: '.morphing-cards-section-60',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 60,
      opacity: 0,
      ease: 'power3.out',
      duration: 0.8
    })

    // 副标题动画
    gsap.from('.mc-subtitle-60', {
      scrollTrigger: {
        trigger: '.morphing-cards-section-60',
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
    gsap.from('.mc-morphing-card-60', {
      scrollTrigger: {
        trigger: '.mc-morphing-container-60',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      scale: 0,
      borderRadius: '50%',
      rotation: 180,
      stagger: 0.12,
      ease: 'back.out(1.7)',
      duration: 0.8
    })

    // 图片渐入
    gsap.from('.mc-card-image-60', {
      scrollTrigger: {
        trigger: '.mc-morphing-container-60',
        start: 'top 65%',
        toggleActions: 'play none none reverse'
      },
      scale: 2,
      opacity: 0,
      stagger: 0.12,
      ease: 'power2.out',
      duration: 0.6
    })

    // 数字动画
    gsap.from('.mc-card-number-60', {
      scrollTrigger: {
        trigger: '.mc-morphing-container-60',
        start: 'top 65%',
        toggleActions: 'play none none reverse'
      },
      scale: 0,
      rotation: -360,
      stagger: 0.12,
      ease: 'back.out(1.7)',
      duration: 0.5
    })

    // 内容动画
    gsap.from('.mc-card-content-60 h3, .mc-card-content-60 p', {
      scrollTrigger: {
        trigger: '.mc-morphing-container-60',
        start: 'top 60%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      stagger: 0.05,
      ease: 'power3.out',
      duration: 0.5
    })

    // 滚动视差
    gsap.to('.mc-card-inner-60', {
      scrollTrigger: {
        trigger: '.mc-morphing-container-60',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: (i) => (i % 2 === 0 ? -20 : 20),
      rotation: (i) => Math.sin(i * 0.5) * 5,
      ease: 'none'
    })

    // 按钮动画
    gsap.from('.mc-control-btn-60', {
      scrollTrigger: {
        trigger: '.mc-morphing-controls-60',
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

.mc-morphing-cards-section-60 {
  min-height: 100vh;
  padding: 80px 40px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.mc-section-header-60 {
  text-align: center;
  margin-bottom: 80px;

  opacity: 1 !important;}

.mc-title-60 {
  font-size: 56px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 6px;
  text-transform: uppercase;
  text-shadow: 0 0 30px rgba(15, 52, 96, 0.5);

  opacity: 1 !important;}

.mc-subtitle-60 {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 16px;
  letter-spacing: 3px;
  text-transform: uppercase;

  opacity: 1 !important;}

.mc-morphing-container-60 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 0;

  opacity: 1 !important;}

.mc-morphing-card-60 {
  cursor: pointer;
}

.mc-card-inner-60 {
  height: 380px;
  border-radius: 24px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  transition: box-shadow 0.4s ease;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);

  opacity: 1 !important;}

.mc-card-inner-60:hover {
  box-shadow: 0 20px 60px rgba(15, 52, 96, 0.5);
}

.mc-card-image-60 {
  width: 100%;
  height: 240px;
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;

  opacity: 1 !important;}

.mc-card-content-60 {
  position: relative;
  padding: 24px;

  opacity: 1 !important;}

.mc-card-number-60 {
  position: absolute;
  top: -20px;
  right: 20px;
  width: 48px;
  height: 48px;
  background: rgba(15, 52, 96, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  border: 2px solid rgba(15, 52, 96, 0.5);
  transition: all 0.4s ease;

  opacity: 1 !important;}

.mc-card-content-60 h3 {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.mc-card-content-60 p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

.mc-morphing-controls-60 {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 60px;
  flex-wrap: wrap;
}

.mc-control-btn-60 {
  padding: 16px 40px;
  background: linear-gradient(135deg, #0f3460 0%, #e94560 100%);
  border: none;
  border-radius: 30px;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: 0 10px 30px rgba(15, 52, 96, 0.3);

  opacity: 1 !important;}

.mc-control-btn-60:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(15, 52, 96, 0.4);
}

@media (max-width: 768px) {
  .mc-title-60 {
    font-size: 32px;
    letter-spacing: 3px;
  
  opacity: 1 !important;}

  .mc-subtitle-60 {
    font-size: 14px;
  
  opacity: 1 !important;}

  .mc-card-inner-60 {
    height: 320px;
  
  opacity: 1 !important;}

  .mc-card-image-60 {
    height: 180px;
  
  opacity: 1 !important;}
}
</style>
