<template>
  <div class="dp-diagonal-parallax-35">
    <div class="dp-container-35">
      <h2 class="dp-section-title-35">对角视差</h2>

      <div class="dp-parallax-grid-35">
        <div
          class="dp-parallax-card-35"
          v-for="(img, index) in images"
          :key="index"
          :class="`dp-card-${index}`"
          ref="items"
        >
          <div class="dp-card-wrapper-35">
            <img :src="img" :alt="`Image ${index + 1}`" />
            <div class="dp-card-overlay-35">
              <span class="dp-card-index-35">{{ index + 1 }}</span>
              <h3 class="dp-card-heading-35">Card {{ index + 1 }}</h3>
              <p class="dp-card-text-35">对角滚动视差效果</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const items = ref<HTMLElement[]>([])
const images = [
  new URL('@/assets/image/1.png', import.meta.url).href,
  new URL('@/assets/image/2.png', import.meta.url).href,
  new URL('@/assets/image/3.png', import.meta.url).href,
  new URL('@/assets/image/4.png', import.meta.url).href,
  new URL('@/assets/image/5.png', import.meta.url).href,
  new URL('@/assets/image/6.png', import.meta.url).href
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.dp-section-title-35', {
      scrollTrigger: {
        trigger: '.dp-section-title-35',
        start: 'top 90%'
      },
      y: 60,
      opacity: 0,
      rotateX: 15,
      duration: 1,
      ease: 'power3.out'
    })

    items.value.forEach((item, index) => {
      const img = item.querySelector('img') as HTMLElement
      const overlay = item.querySelector('.dp-card-overlay-35') as HTMLElement
      const cardIndex = item.querySelector('.dp-card-index-35') as HTMLElement
      const heading = item.querySelector('.dp-card-heading-35') as HTMLElement
      const text = item.querySelector('.dp-card-text-35') as HTMLElement

      // 对角入场动画
      const xOffset = index % 2 === 0 ? -100 : 100
      gsap.fromTo(item,
        {
          x: xOffset,
          y: 100,
          opacity: 0,
          rotate: index % 2 === 0 ? -10 : 10,
          scale: 0.8
        },
        {
          x: 0,
          y: 0,
          opacity: 1,
          rotate: 0,
          scale: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'top 35%',
            toggleActions: 'play none none reverse'
          },
          duration: 1.2,
          ease: 'power3.out',
          delay: index * 0.1
        }
      )

      // 图片对角视差移动
      const xDirection = index % 2 === 0 ? -1 : 1
      gsap.fromTo(img,
        { x: xDirection * -40, y: -40 },
        {
          x: xDirection * 40,
          y: 40,
          scrollTrigger: {
            trigger: item,
            start: 'top 100%',
            end: 'bottom 0%',
            scrub: 1
          },
          ease: 'none'
        }
      )

      // 图片缩放
      gsap.fromTo(img,
        { scale: 1.3 },
        {
          scale: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            end: 'top 20%',
            scrub: true
          },
          ease: 'power2.out'
        }
      )

      // 覆盖层渐入
      gsap.fromTo(overlay,
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 65%',
            end: 'top 25%',
            scrub: true
          }
        }
      )

      // 数字旋转
      gsap.fromTo(cardIndex,
        { rotate: -180, scale: 0, opacity: 0 },
        {
          rotate: 0,
          scale: 1,
          opacity: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 70%',
            end: 'top 30%',
            scrub: true
          }
        }
      )

      // 标题滑入
      gsap.fromTo(heading,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 60%',
            end: 'top 20%',
            scrub: true
          }
        }
      )

      // 文字升起
      gsap.fromTo(text,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 55%',
            end: 'top 15%',
            scrub: true
          }
        }
      )
    })

    // 整体网格轻微旋转
    gsap.fromTo('.dp-parallax-grid-35',
      { rotateX: 0 },
      {
        rotateX: 3,
        scrollTrigger: {
          trigger: '.dp-parallax-grid-35',
          start: 'top 100%',
          end: 'bottom 0%',
          scrub: 1
        },
        ease: 'none'
      }
    )
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.dp-diagonal-parallax-35 {
  min-height: 100vh;
  padding: 100px 0;
  background: linear-gradient(180deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
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
      radial-gradient(circle at 20% 30%, rgba(72, 219, 251, 0.1) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(253, 203, 110, 0.1) 0%, transparent 40%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.dp-container-35 {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.dp-section-title-35 {
  text-align: center;
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 80px;
  background: linear-gradient(135deg, #48dbfb 0%, #0abde3 50%, #fdcb6e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(72, 219, 251, 0.5);

  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #48dbfb, #0abde3, #fdcb6e);
    margin: 20px auto 0;
    border-radius: 2px;
  
  opacity: 1 !important;}
}

.dp-parallax-grid-35 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  padding: 60px 0;
  perspective: 1000px;

  opacity: 1 !important;}

.dp-parallax-card-35 {
  position: relative;
  height: 380px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  background: #fff;
  transition: transform 0.4s ease;

  &:hover {
    transform: translateY(-15px) scale(1.02);
    z-index: 10;
  
  opacity: 1 !important;}
}

.dp-card-wrapper-35 { width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
      opacity: 1;
    }

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.3s ease;
}

.dp-parallax-card-35:hover img {
  filter: brightness(1.1);
}

.dp-card-overlay-35 { position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.5) 50%, transparent 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 30px;
  pointer-events: none;
      opacity: 1;
    }

.dp-card-index-35 {
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #48dbfb 0%, #0abde3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: -20px;
  font-family: 'Arial', sans-serif;
  opacity: 0.9;
}

.dp-card-heading-35 { font-size: 1.6rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 10px;
      opacity: 1;
    }

.dp-card-text-35 { font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
      opacity: 1;
    }

@media (max-width: 1024px) {
  .dp-parallax-grid-35 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .dp-parallax-grid-35 {
    grid-template-columns: 1fr;
  }

  .dp-section-title-35 {
    font-size: 2rem;
  
  opacity: 1 !important;}
}
</style>
