<template>
  <section class="sir-scroll-image-stack-reveal-132">
    <div class="sir-container-132">
      <h2 class="sir-title-132">图片堆叠揭示</h2>
      <p class="sir-subtitle-132">Image Stack Reveal</p>

      <div class="sir-stage-132" ref="stage">
        <div
          v-for="(image, index) in images"
          :key="index"
          :ref="el => { if (el) imageRefs[index] = el as HTMLElement }"
          :class="`sir-image-layer-${132} sir-layer-${index}-132`"
          :style="{ 
            backgroundImage: `url(${image.src})`,
            zIndex: images.length - index
          }"
        >
          <div class="sir-image-caption-132">
            <h3>{{ image.title }}</h3>
            <p>{{ image.description }}</p>
          </div>
        </div>
      </div>

      <div class="sir-indicator-132">
        <span>向下滚动揭示图片</span>
        <div class="sir-arrow-132"></div>
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
const imageRefs = ref<HTMLElement[]>([])

const images = [
  {
    src: '/src/assets/image/1.png',
    title: '探索未知',
    description: 'Exploration'
  },
  {
    src: '/src/assets/image/2.png',
    title: '无限可能',
    description: 'Possibilities'
  },
  {
    src: '/src/assets/image/3.png',
    title: '创意无限',
    description: 'Creativity'
  },
  {
    src: '/src/assets/image/4.png',
    title: '未来已来',
    description: 'Future'
  }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    const layers = imageRefs.value

    // 标题动画
    gsap.from('.sir-title-132', {
      scrollTrigger: {
        trigger: '.sir-scroll-image-stack-reveal-132',
        start: 'top 90%',
        end: 'top 70%',
        scrub: 1
      },
      opacity: 0,
      y: -50,
      filter: 'blur(20px)',
      ease: 'power2.out'
    })

    gsap.from('.sir-subtitle-132', {
      scrollTrigger: {
        trigger: '.sir-scroll-image-stack-reveal-132',
        start: 'top 85%',
        end: 'top 65%',
        scrub: 1
      },
      opacity: 0,
      y: 30,
      ease: 'power2.out'
    })

    // 图片堆叠动画 - 每层依次揭示
    layers.forEach((layer, index) => {
      const delay = index * 0.15

      gsap.from(layer, {
        scrollTrigger: {
          trigger: stage.value,
          start: `top ${85 - index * 10}%`,
          end: `top ${50 - index * 5}%`,
          scrub: 1.5
        },
        y: index * 80 + 50,
        x: (index - layers.length / 2) * 60,
        scale: 0.6,
        opacity: 0,
        rotation: (index - layers.length / 2) * 15,
        filter: 'blur(30px)',
        ease: 'power3.inOut'
      })
    })

    // 图片卡片悬浮效果
    layers.forEach((layer, index) => {
      layer.addEventListener('mouseenter', () => {
        gsap.to(layer, {
          scale: 1.05,
          rotation: 0,
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)',
          duration: 0.5,
          ease: 'power2.out'
        })

        gsap.to(layer.querySelector('.sir-image-caption-132'), {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out'
        })
      })

      layer.addEventListener('mouseleave', () => {
        gsap.to(layer, {
          scale: 1,
          duration: 0.5,
          ease: 'power2.out'
        })
      })
    })

    // 指示器动画
    gsap.from('.sir-indicator-132', {
      scrollTrigger: {
        trigger: stage.value,
        start: 'bottom 20%',
        end: 'bottom 10%',
        scrub: 1
      },
      opacity: 0,
      y: 30,
      ease: 'power2.out'
    })

    // 箭头脉冲
    gsap.to('.sir-arrow-132', {
      y: 10,
      repeat: -1,
      yoyo: true,
      duration: 1,
      ease: 'power1.inOut'
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.sir-scroll-image-stack-reveal-132 {
  min-height: 100vh;
  padding: 80px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 50%, #0f0f2a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.sir-container-132 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;

  opacity: 1 !important;}

.sir-title-132 {
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

.sir-subtitle-132 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 120px;
  letter-spacing: 0.3em;
  text-transform: uppercase;

  opacity: 1 !important;}

.sir-stage-132 {
  position: relative;
  width: 100%;
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 2000px;

  opacity: 1 !important;}

.sir-image-layer-132 {
  position: absolute;
  width: 400px;
  height: 500px;
  background-size: cover;
  background-position: center;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transition: transform 0.5s ease;
  will-change: transform;

  opacity: 1 !important;}

.sir-image-layer-132::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  z-index: 1;
}

.sir-image-caption-132 {
  position: absolute;
  bottom: 30px;
  left: 30px;
  right: 30px;
  z-index: 2;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s ease;
}

.sir-image-caption-132 h3 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.sir-image-caption-132 p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.sir-indicator-132 {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;

  opacity: 1 !important;}

.sir-arrow-132 {
  width: 24px;
  height: 24px;
  border-right: 3px solid rgba(255, 255, 255, 0.5);
  border-bottom: 3px solid rgba(255, 255, 255, 0.5);
  transform: rotate(45deg);

  opacity: 1 !important;}

@media (max-width: 768px) {
  .sir-image-layer-132 {
    width: 280px;
    height: 350px;
  
  opacity: 1 !important;}

  .sir-title-132 {
    margin-bottom: 60px;
  }

  .sir-subtitle-132 {
    margin-bottom: 80px;
    font-size: 0.9rem;
  
  opacity: 1 !important;}

  .sir-stage-132 {
    height: 400px;
  
  opacity: 1 !important;}

  .sir-image-caption-132 h3 {
    font-size: 1.3rem;
  }

  .sir-image-caption-132 p {
    font-size: 0.85rem;
  }
}
</style>
