<template>
  <section class="scp-scroll-card-polaroid-129">
    <div class="scp-container-129">
      <h2 class="scp-section-title-129">滚动宝丽来卡片</h2>
      <p class="scp-section-subtitle-129">Scroll Polaroid Card Animation</p>

      <div class="scp-scatter-container-129" ref="scatterContainer">
        <div
          v-for="(card, index) in cardData"
          :key="index"
          class="scp-card-129"
          :data-index="index"
          :ref="el => { if (el) cardRefs[index] = el as HTMLElement }"
        >
          <div class="scp-polaroid-129">
            <div class="scp-photo-129">
              <img :src="card.image" :alt="card.title" />
            </div>
            <div class="scp-caption-129">
              <h3 class="scp-caption-title-129">{{ card.title }}</h3>
              <p class="scp-caption-date-129">{{ card.date }}</p>
              <div class="scp-caption-text-129">{{ card.caption }}</div>
            </div>
            <div class="scp-tape-129"></div>
          </div>
        </div>
      </div>

      <div class="scp-floors-129">
        <div class="scp-floor-129 scp-floor-1"></div>
        <div class="scp-floor-129 scp-floor-2"></div>
        <div class="scp-floor-129 scp-floor-3"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const scatterContainer = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])

const cardData = [
  {
    image: new URL('@/assets/image/1.png', import.meta.url).href,
    title: '晨曦',
    date: '2024.01.15',
    caption: '第一缕阳光照亮了世界'
  },
  {
    image: new URL('@/assets/image/2.png', import.meta.url).href,
    title: '探索',
    date: '2024.02.28',
    caption: '每一步都是新的发现'
  },
  {
    image: new URL('@/assets/image/3.png', import.meta.url).href,
    title: '创意',
    date: '2024.03.10',
    caption: '灵感迸发的瞬间'
  },
  {
    image: new URL('@/assets/image/4.png', import.meta.url).href,
    title: '成长',
    date: '2024.04.22',
    caption: '在挑战中蜕变'
  },
  {
    image: new URL('@/assets/image/5.png', import.meta.url).href,
    title: '梦想',
    date: '2024.05.18',
    caption: '追逐心中的光芒'
  },
  {
    image: new URL('@/assets/image/6.png', import.meta.url).href,
    title: '未来',
    date: '2024.06.30',
    caption: '无限可能的明天'
  }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题散落动画
    gsap.from('.scp-section-title-129', {
      scrollTrigger: {
        trigger: '.scp-scroll-card-polaroid-129',
        start: 'top 85%',
        end: 'top 60%',
        scrub: 1
      },
      y: 150,
      rotateZ: -15,
      opacity: 0,
      ease: 'power3.out'
    })

    // 副标题
    gsap.from('.scp-section-subtitle-129', {
      scrollTrigger: {
        trigger: '.scp-scroll-card-polaroid-129',
        start: 'top 80%'
      },
      x: -100,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: 'power3.out'
    })

    // 卡片散落动画
    cardRefs.value.forEach((card, index) => {
      const polaroid = card.querySelector('.scp-polaroid-129') as HTMLElement
      const photo = card.querySelector('.scp-photo-129') as HTMLElement
      const tape = card.querySelector('.scp-tape-129') as HTMLElement
      const caption = card.querySelector('.scp-caption-129') as HTMLElement

      // 计算随机散落位置 - 减小范围让初始更可见
      const rotate = (Math.random() - 0.5) * 40
      const x = (Math.random() - 0.5) * 300
      const y = -100 - Math.random() * 200
      const scale = 0.7 + Math.random() * 0.2

      // 初始散落状态 - 保持可见性
      gsap.set(card, {
        x,
        y,
        rotateZ: rotate,
        scale,
        opacity: 0.3
      })

      gsap.set(photo, { scale: 1.1, filter: 'brightness(0.7)' })
      gsap.set(tape, { scaleX: 0, opacity: 0 })
      gsap.set(caption, { y: 20, opacity: 0 })

      // 滚动收集动画 - 简化为固定目标值
      const targetX = (index % 3 - 1) * 280
      const targetY = Math.floor(index / 3) * 380
      const targetRotate = (index % 2 === 0 ? 1 : -1) * (5 + Math.random() * 5)

      gsap.to(card, {
        scrollTrigger: {
          trigger: scatterContainer.value,
          start: 'top 85%',
          end: 'top 35%',
          scrub: 2
        },
        x: targetX,
        y: targetY,
        rotateZ: targetRotate,
        scale: 1,
        opacity: 1,
        ease: 'power3.out'
      })

      // 照片效果
      gsap.to(photo, {
        scrollTrigger: {
          trigger: scatterContainer.value,
          start: 'top 80%',
          end: 'top 40%',
          scrub: 1.5
        },
        scale: 1,
        filter: 'brightness(1)',
        ease: 'power2.out'
      })

      // 胶带出现
      gsap.to(tape, {
        scrollTrigger: {
          trigger: scatterContainer.value,
          start: 'top 70%',
          end: 'top 50%',
          scrub: 1
        },
        scaleX: 1,
        opacity: 1,
        ease: 'elastic.out(1, 0.5)'
      })

      // 标题淡入
      gsap.to(caption, {
        scrollTrigger: {
          trigger: scatterContainer.value,
          start: 'top 65%',
          end: 'top 45%',
          scrub: 1
        },
        y: 0,
        opacity: 1,
        ease: 'power2.out'
      })

      // 持续微动 - 降低幅度
      gsap.to(card, {
        rotateZ: targetRotate + (Math.random() - 0.5) * 3,
        duration: 4 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.2
      })

      // 悬停效果
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.1,
          rotateZ: 0,
          zIndex: 100,
          duration: 0.4,
          ease: 'back.out(1.7)'
        })
        gsap.to(polaroid, {
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.5)',
          duration: 0.4
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          rotateZ: targetRotate,
          zIndex: 1,
          duration: 0.4,
          ease: 'power2.out'
        })
        gsap.to(polaroid, {
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          duration: 0.4
        })
      })
    })

    // 地板动画
    gsap.from('.scp-floor-129', {
      scrollTrigger: {
        trigger: scatterContainer.value,
        start: 'top 90%',
        end: 'top 60%',
        scrub: 1
      },
      scaleY: 0,
      opacity: 0,
      ease: 'power3.out',
      stagger: 0.1
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.scp-scroll-card-polaroid-129 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #1e1e3f 50%, #0a0a1a 100%);
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
      radial-gradient(ellipse at 50% 30%, rgba(236, 72, 153, 0.08) 0%, transparent 60%),
      radial-gradient(ellipse at 30% 70%, rgba(59, 130, 246, 0.08) 0%, transparent 60%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.scp-container-129 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.scp-section-title-129 {
  text-align: center;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ec4899, #a855f7, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 60px rgba(236, 72, 153, 0.4);

  opacity: 1 !important;}

.scp-section-subtitle-129 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 150px;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

.scp-scatter-container-129 {
  position: relative;
  min-height: 1000px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 30px;
  perspective: 1500px;

  opacity: 1 !important;}

.scp-card-129 {
  position: absolute;
  width: 300px;
  height: 400px;
  cursor: pointer;
  transition: z-index 0.3s ease;

  opacity: 1 !important;}

.scp-polaroid-129 {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 8px;
  padding: 20px 20px 60px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.3),
    inset 0 0 0 2px rgba(255, 255, 255, 0.1);
  position: relative;
  transform-style: preserve-3d;
  transition: box-shadow 0.4s ease;

  opacity: 1 !important;}

.scp-photo-129 {
  width: 100%;
  height: 280px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  filter: brightness(1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  
  opacity: 1 !important;}
}

.scp-caption-129 {
  padding: 20px 0 0;
  text-align: center;

  opacity: 1 !important;}

.scp-caption-title-129 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 8px;
  font-family: 'Georgia', serif;

  opacity: 1 !important;}

.scp-caption-date-129 {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 10px;
  font-style: italic;

  opacity: 1 !important;}

.scp-caption-text-129 {
  font-size: 0.9rem;
  color: #444;
  line-height: 1.5;
  font-family: 'Georgia', serif;

  opacity: 1 !important;}

.scp-tape-129 {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 30px;
  background: rgba(255, 235, 59, 0.6);
  opacity: 0.8;
  filter: blur(0.5px);
  transform-origin: center;
}

.scp-floors-129 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200px;
  pointer-events: none;

  opacity: 1 !important;}

.scp-floor-129 {
  position: absolute;
  width: 100%;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(59, 130, 246, 0.1) 0%, transparent 70%);

  opacity: 1 !important;}

.scp-floor-1 {
  height: 300px;
  bottom: -100px;
  left: 10%;
  width: 80%;

  opacity: 1 !important;}

.scp-floor-2 {
  height: 250px;
  bottom: -80px;
  left: 20%;
  width: 60%;

  opacity: 1 !important;}

.scp-floor-3 {
  height: 200px;
  bottom: -60px;
  left: 30%;
  width: 40%;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .scp-card-129 {
    width: 250px;
    height: 340px;
  
  opacity: 1 !important;}

  .scp-photo-129 {
    height: 230px;
  
  opacity: 1 !important;}

  .scp-caption-title-129 {
    font-size: 1.1rem;
  
  opacity: 1 !important;}

  .scp-caption-text-129 {
    font-size: 0.8rem;
  
  opacity: 1 !important;}

  .scp-scatter-container-129 {
    min-height: 600px;
  
  opacity: 1 !important;}

  .scp-section-title-129 {
    margin-bottom: 80px;
  }

  .scp-section-subtitle-129 {
    margin-bottom: 60px;
    font-size: 0.9rem;
  
  opacity: 1 !important;}

  .scp-container-129 {
    padding: 0 20px;
  
  opacity: 1 !important;}
}
</style>
