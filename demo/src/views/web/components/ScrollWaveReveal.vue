<template>
  <div ref="componentRoot" class="wave-reveal-177">
    <div class="wr-container-177">
      <h2 class="wr-title-177">🌊 波浪揭示</h2>
      <p class="wr-desc-177">滚动触发波浪揭示效果</p>

      <div class="wr-stage-177">
        <div class="wr-content-177">
          <div v-for="(item, index) in items" :key="index" class="wr-item-177" :data-index="index">
            <div class="wr-image-wrapper-177">
              <div class="wr-wave-177">
                <div class="wr-wave-inner-177"></div>
              </div>
              <div class="wr-image-177">
                <img :src="item.image" :alt="item.title" />
              </div>
            </div>
            <div class="wr-info-177">
              <div class="wr-info-title-177">{{ item.title }}</div>
              <div class="wr-info-desc-177">{{ item.desc }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="wr-hint-177">滚动触发波浪揭示</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()

const items = [
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    title: '山川之美',
    desc: '大自然的鬼斧神工'
  },
  {
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600',
    title: '森林秘境',
    desc: '探索未知的绿色世界'
  },
  {
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
    title: '海洋奇观',
    desc: '深海的神秘与壮丽'
  },
  {
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600',
    title: '星空浩瀚',
    desc: '宇宙的无限魅力'
  }
]

let ctx: any = null

onMounted(() => {
  ctx = gsap.context(() => {
    // 初始状态
    gsap.set('.wr-item-177', {
      y: 100,
      opacity: 0
    })

    gsap.set('.wr-wave-inner-177', {
      x: '-100%'
    })

    // 项目依次出现
    items.forEach((_, index) => {
      const item = `.wr-item-177:nth-child(${index + 1})`
      const wave = `${item} .wr-wave-inner-177`

      gsap.to(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse'
        },
        y: 0,
        opacity: 1,
        duration: 1,
        delay: index * 0.15,
        ease: 'power3.out'
      })

      // 波浪揭示动画
      gsap.to(wave, {
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse'
        },
        x: '100%',
        duration: 1.2,
        delay: index * 0.15 + 0.1,
        ease: 'power2.inOut'
      })

      // 悬停效果
      const itemEl = document.querySelector(item)
      if (itemEl) {
        itemEl.addEventListener('mouseenter', () => {
          gsap.to(itemEl, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
          })
        })

        itemEl.addEventListener('mouseleave', () => {
          gsap.to(itemEl, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          })
        })
      }
    })

    // 标题动画
    gsap.from('.wr-title-177', {
      scrollTrigger: {
        trigger: '.wr-container-177',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })

    // 描述动画
    gsap.from('.wr-desc-177', {
      scrollTrigger: {
        trigger: '.wr-container-177',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power3.out'
    })

    // 提示动画
    gsap.from('.wr-hint-177', {
      scrollTrigger: {
        trigger: '.wr-stage-177',
        start: 'bottom 20%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 20,
      duration: 0.6
    })
  }, componentRoot.value)
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
.wr-container-177 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.wr-title-177 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: #fff;
  margin-bottom: 10px;
  text-align: center;
  background: linear-gradient(90deg, #00d2ff, #3a7bd5, #00d2ff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  to {
    background-position: 200% center;
  }
}

.wr-desc-177 {
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
  text-align: center;
}

.wr-stage-177 {
  width: 100%;
  max-width: 1000px;
}

.wr-content-177 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
  gap: 40px;
  padding: 20px;
}

.wr-item-177 {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  will-change: transform, opacity;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}

.wr-item-177:hover {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.wr-image-wrapper-177 {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.wr-wave-177 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  z-index: 2;
  overflow: hidden;
}

.wr-wave-inner-177 {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  will-change: transform;
}

.wr-image-177 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.wr-image-177 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.wr-item-177:hover .wr-image-177 img {
  transform: scale(1.1);
}

.wr-info-177 {
  padding: 25px;
  position: relative;
  z-index: 3;
  background: rgba(0, 0, 0, 0.3);
}

.wr-info-title-177 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
}

.wr-info-desc-177 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.wr-hint-177 {
  margin-top: 30px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
}

@media (max-width: 768px) {
  .wr-content-177 {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .wr-image-wrapper-177 {
    height: 250px;
  }

  .wr-info-177 {
    padding: 20px;
  }

  .wr-info-title-177 {
    font-size: 1.3rem;
  }

  .wr-info-desc-177 {
    font-size: 0.9rem;
  }
}
</style>
