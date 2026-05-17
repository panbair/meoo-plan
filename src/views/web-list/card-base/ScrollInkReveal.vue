<template>
  <section class="sik-scroll-ink-reveal-130">
    <div class="sik-container-130">
      <h2 class="sik-section-title-130">水墨晕染揭示</h2>
      <p class="sik-section-subtitle-130">Ink Reveal Animation</p>

      <div class="sik-reveal-container-130">
        <div
          v-for="(item, index) in revealItems"
          :key="index"
          class="sik-reveal-item-130"
          :ref="el => { if (el) itemRefs[index] = el as HTMLElement }"
        >
          <div class="sik-ink-drop-130" :ref="el => { if (el) dropRefs[index] = el as HTMLElement }"></div>
          <div class="sik-content-wrapper-130">
            <div class="sik-content-130">
              <img :src="item.image" :alt="`Ink reveal ${index + 1}`" />
              <div class="sik-overlay-130">
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
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

const itemRefs = ref<HTMLElement[]>([])
const dropRefs = ref<HTMLElement[]>([])

const revealItems = [
  {
    title: '东方美学',
    description: '东方传统水墨艺术与现代动画的完美结合',
    image: new URL('@/assets/image/1.png', import.meta.url).href
  },
  {
    title: '流动之美',
    description: '墨色在纸张上流淌的自然韵律',
    image: new URL('@/assets/image/2.png', import.meta.url).href
  },
  {
    title: '意境深远',
    description: '留白与墨染之间的和谐平衡',
    image: new URL('@/assets/image/3.png', import.meta.url).href
  },
  {
    title: '笔触灵动',
    description: '每一笔都蕴含着深厚的文化底蕴',
    image: new URL('@/assets/image/4.png', import.meta.url).href
  }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题水墨扩散动画
    gsap.from('.sik-section-title-130', {
      scrollTrigger: {
        trigger: '.sik-scroll-ink-reveal-130',
        start: 'top 90%',
        end: 'top 70%',
        scrub: 1
      },
      scale: 0.8,
      opacity: 0,
      filter: 'blur(20px)',
      ease: 'power2.out'
    })

    gsap.from('.sik-section-subtitle-130', {
      scrollTrigger: {
        trigger: '.sik-scroll-ink-reveal-130',
        start: 'top 85%',
        end: 'top 65%',
        scrub: 1
      },
      y: 50,
      opacity: 0,
      filter: 'blur(10px)',
      ease: 'power2.out'
    })

    // 水墨晕染揭示动画
    itemRefs.value.forEach((item, index) => {
      const drop = dropRefs.value[index]
      const content = item.querySelector('.sik-content-130') as HTMLElement
      const overlay = item.querySelector('.sik-overlay-130') as HTMLElement
      const img = item.querySelector('img') as HTMLElement

      // 水墨滴落初始状态 - 改为完全透明
      gsap.set(drop, {
        scale: 0,
        opacity: 0
      })

      // 内容初始状态 - 改为可见但模糊状态
      gsap.set(content, {
        scale: 0.6,
        opacity: 0.5,
        filter: 'blur(20px)'
      })

      // 水墨滴落扩散 - 增大范围和效果
      gsap.to(drop, {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          end: 'top 30%',
          scrub: 2
        },
        scale: [0, 2, 5, 10, 15],
        opacity: [0.8, 0.9, 0.7, 0.4, 0],
        ease: 'power1.inOut'
      })

      // 内容渐显 - 扩大滚动范围
      gsap.to(content, {
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          end: 'top 35%',
          scrub: 2
        },
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power2.out'
      })

      // 图片缩放效果 - 扩大滚动范围
      gsap.fromTo(img,
        { scale: 1.15 },
        {
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 2.5
          },
          scale: 1,
          ease: 'power1.inOut'
        }
      )

      // 覆盖层淡入 - 扩大滚动范围
      gsap.fromTo(overlay,
        { opacity: 0, y: 30 },
        {
          scrollTrigger: {
            trigger: item,
            start: 'top 70%',
            end: 'top 35%',
            scrub: 2
          },
          opacity: 0.8,
          y: 0,
          ease: 'power2.out'
        }
      )

      // 悬停效果
      item.addEventListener('mouseenter', () => {
        gsap.to(content, {
          scale: 1.05,
          filter: 'blur(0px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          duration: 0.6,
          ease: 'power2.out'
        })
        gsap.to(overlay, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        })
      })

      item.addEventListener('mouseleave', () => {
        gsap.to(content, {
          scale: 1,
          filter: 'blur(0px)',
          boxShadow: 'none',
          duration: 0.6,
          ease: 'power2.out'
        })
        gsap.to(overlay, {
          opacity: 0.8,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        })
      })
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.sik-scroll-ink-reveal-130 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 30%, #f0f0f0 60%, #f5f5f5 100%);
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
      radial-gradient(circle at 20% 30%, rgba(0, 0, 0, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(0, 0, 0, 0.03) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.sik-container-130 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.sik-section-title-130 {
  text-align: center;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  color: #1a1a1a;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #1a1a1a, #333, #1a1a1a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);

  opacity: 1 !important;}

.sik-section-subtitle-130 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(0, 0, 0, 0.5);
  margin-bottom: 120px;
  letter-spacing: 0.3em;
  text-transform: uppercase;

  opacity: 1 !important;}

.sik-reveal-container-130 {
  display: flex;
  flex-direction: column;
  gap: 150px;
  perspective: 1500px;
}

.sik-reveal-item-130 {
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  opacity: 1 !important;}

.sik-ink-drop-130 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 30%, rgba(0, 0, 0, 0.1) 60%, transparent 80%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 5;
  mix-blend-mode: multiply;

  opacity: 1 !important;}

.sik-content-wrapper-130 {
  position: relative;
  width: 100%;
  max-width: 900px;
  z-index: 10;

  opacity: 1 !important;}

.sik-content-130 {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  cursor: pointer;

  img {
    width: 100%;
    height: 60vh;
    object-fit: cover;
    display: block;
    filter: grayscale(20%) contrast(110%);
  
  opacity: 1 !important;}
}

.sik-overlay-130 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: #fff;
  opacity: 0.8;
  transition: all 0.3s ease;

  h3 {
    font-size: clamp(1.8rem, 4vw, 2.5rem);
    font-weight: 700;
    margin-bottom: 10px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  p {
    font-size: 1rem;
    line-height: 1.6;
    opacity: 0.9;
    text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
  }
}

@media (max-width: 768px) {
  .sik-content-130 img {
    height: 40vh;
  }

  .sik-overlay-130 {
    padding: 20px;

    h3 {
      font-size: 1.5rem;
    
  opacity: 1 !important;}

    p {
      font-size: 0.9rem;
    }
  }

  .sik-section-title-130 {
    margin-bottom: 80px;
  }

  .sik-section-subtitle-130 {
    margin-bottom: 80px;
    font-size: 0.9rem;
  
  opacity: 1 !important;}
}
</style>
