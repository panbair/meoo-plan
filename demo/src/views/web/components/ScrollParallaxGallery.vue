<template>
  <section class="pg-scroll-parallax-gallery-135">
    <div class="pg-container-135">
      <h2 class="pg-title-135">视差画廊</h2>
      <p class="pg-subtitle-135">Parallax Gallery</p>

      <div class="pg-stage-135" ref="stage">
        <div class="pg-gallery-wrapper-135">
          <div
            v-for="(item, index) in galleryItems"
            :key="index"
            :ref="el => { if (el) itemRefs[index] = el as HTMLElement }"
            :class="`pg-gallery-item-${135} pg-item-${index}-135`"
            :style="{ backgroundImage: `url(${item.image})` }"
          >
            <div class="pg-item-content-135">
              <h3 class="pg-item-title-135">{{ item.title }}</h3>
              <p class="pg-item-desc-135">{{ item.description }}</p>
              <div class="pg-item-number-135">{{ String(index + 1).padStart(2, '0') }}</div>
            </div>
          </div>
        </div>

        <div class="pg-scroll-indicator-135">
          <div class="pg-indicator-line-135"></div>
          <div class="pg-indicator-text-135">Scroll</div>
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

const stage = ref<HTMLElement>()
const itemRefs = ref<HTMLElement[]>([])

const galleryItems = [
  {
    image: '/src/assets/image/1.png',
    title: '探索之旅',
    description: 'Exploration Journey'
  },
  {
    image: '/src/assets/image/2.png',
    title: '无限创意',
    description: 'Infinite Creativity'
  },
  {
    image: '/src/assets/image/3.png',
    title: '极致体验',
    description: 'Ultimate Experience'
  },
  {
    image: '/src/assets/image/4.png',
    title: '未来已来',
    description: 'Future Is Here'
  },
  {
    image: '/src/assets/image/5.png',
    title: '突破极限',
    description: 'Break Limits'
  },
  {
    image: '/src/assets/image/6.png',
    title: '追求卓越',
    description: 'Pursue Excellence'
  }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.pg-title-135', {
      scrollTrigger: {
        trigger: '.pg-scroll-parallax-gallery-135',
        start: 'top 90%',
        end: 'top 70%',
        scrub: 1
      },
      opacity: 0,
      y: -50,
      filter: 'blur(20px)',
      ease: 'power2.out'
    })

    gsap.from('.pg-subtitle-135', {
      scrollTrigger: {
        trigger: '.pg-scroll-parallax-gallery-135',
        start: 'top 85%',
        end: 'top 65%',
        scrub: 1
      },
      opacity: 0,
      y: 30,
      ease: 'power2.out'
    })

    // 画廊项目视差动画
    itemRefs.value.forEach((item, index) => {
      const speed = 1 + (index % 3) * 0.3

      gsap.from(item, {
        scrollTrigger: {
          trigger: stage.value,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: speed
        },
        y: (index + 1) * 100,
        scale: 0.8,
        opacity: 0.5,
        filter: 'blur(5px)',
        ease: 'power2.out'
      })

      // 内容延迟出现
      gsap.from(item.querySelector('.pg-item-content-135'), {
        scrollTrigger: {
          trigger: item,
          start: 'top 70%',
          end: 'top 40%',
          scrub: 1.5
        },
        y: 50,
        opacity: 0,
        ease: 'power2.out'
      })
    })

    // 交错入场效果
    itemRefs.value.forEach((item, index) => {
      gsap.to(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 60%',
          end: 'top 30%',
          scrub: 2
        },
        x: (index % 2 === 0 ? -1 : 1) * 30,
        ease: 'sine.inOut'
      })
    })

    // 悬停效果
    itemRefs.value.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, {
          scale: 1.05,
          zIndex: 10,
          duration: 0.5,
          ease: 'power2.out'
        })

        gsap.to(item.querySelector('.pg-item-content-135'), {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out'
        })
      })

      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          scale: 1,
          zIndex: 1,
          duration: 0.5,
          ease: 'power2.out'
        })
      })
    })

    // 滚动指示器动画
    gsap.to('.pg-indicator-line-135', {
      scrollTrigger: {
        trigger: stage.value,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true
      },
      scaleY: 0,
      ease: 'none'
    })

    gsap.to('.pg-indicator-text-135', {
      scrollTrigger: {
        trigger: stage.value,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true
      },
      y: -100,
      opacity: 0,
      ease: 'none'
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.pg-scroll-parallax-gallery-135 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 30%, #0f0f2a 60%, #1a1a3a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.pg-container-135 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;

  opacity: 1 !important;}

.pg-title-135 {
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

.pg-subtitle-135 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 120px;
  letter-spacing: 0.3em;
  text-transform: uppercase;

  opacity: 1 !important;}

.pg-stage-135 {
  position: relative;
  min-height: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 2000px;

  opacity: 1 !important;}

.pg-gallery-wrapper-135 {
  position: relative;
  width: 100%;
  height: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;

  opacity: 1 !important;}

.pg-gallery-item-135 {
  position: relative;
  width: 280px;
  height: 350px;
  background-size: cover;
  background-position: center;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  transition: transform 0.5s ease;
  will-change: transform;

  opacity: 1 !important;}

.pg-gallery-item-135::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 40%,
    rgba(0, 0, 0, 0.9) 100%
  );
  z-index: 1;
}

.pg-item-content-135 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px;
  z-index: 2;
  transform: translateY(20px);
  opacity: 0.9;
  transition: all 0.4s ease;
}

.pg-item-title-135 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

.pg-item-desc-135 {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 15px;

  opacity: 1 !important;}

.pg-item-number-135 {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 2rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.1);
  font-family: monospace;

  opacity: 1 !important;}

.pg-scroll-indicator-135 {
  position: fixed;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  z-index: 100;
}

.pg-indicator-line-135 {
  width: 2px;
  height: 150px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1px;
  transform-origin: top;

  opacity: 1 !important;}

.pg-indicator-text-135 {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .pg-gallery-wrapper-135 {
    gap: 20px;
  }

  .pg-gallery-item-135 {
    width: 240px;
    height: 300px;
  
  opacity: 1 !important;}

  .pg-scroll-indicator-135 {
    display: none;
  }

  .pg-stage-135 {
    min-height: 800px;
  
  opacity: 1 !important;}

  .pg-item-title-135 {
    font-size: 1.2rem;
  
  opacity: 1 !important;}
}
</style>
