<template>
  <div class="smoc-magnetic-orbit-cards-section-158" ref="componentRoot">
    <!-- 背景粒子系统 -->
    <div class="smoc-particles-158">
      <div v-for="i in 50" :key="i" class="smoc-particle-158" :style="particleStyle(i)"></div>
    </div>

    <!-- 装饰光晕 -->
    <div class="smoc-glow-1-158"></div>
    <div class="smoc-glow-2-158"></div>
    <div class="smoc-glow-3-158"></div>

    <div class="smoc-container-158">
      <h2 class="smoc-title-158">
        <span class="smoc-title-text-158">磁力轨道卡片</span>
        <span class="smoc-title-glow-158"></span>
      </h2>
      <p class="smoc-subtitle-158">Magnetic Orbit Cards</p>

      <div class="smoc-stage-158">
        <div class="smoc-orbit-center-158" ref="orbitCenter">
          <div class="smoc-center-pulse-1-158"></div>
          <div class="smoc-center-pulse-2-158"></div>
          <div class="smoc-center-content-158">
            <div class="smoc-center-icon-158">⚡</div>
            <div class="smoc-center-text-158">CORE</div>
            <div class="smoc-center-ring-158">
              <svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="55" fill="none" stroke="url(#gradient-158)" stroke-width="2" stroke-dasharray="346" stroke-dashoffset="0" class="smoc-center-circle-158"></circle>
                <defs>
                  <linearGradient id="gradient-158" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#8b5cf6" />
                    <stop offset="100%" stop-color="#d946ef" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <div class="smoc-orbit-rings-158">
            <div class="smoc-ring-158" v-for="i in 4" :key="i" :style="`--size: ${200 + i * 80}px; --duration: ${15 + i * 5}s; --direction: ${i % 2 === 0 ? 'normal' : 'reverse'}`">
              <div class="smoc-ring-dot-158" v-for="j in 6" :key="j" :style="`--angle: ${j * 60}deg`"></div>
            </div>
          </div>
        </div>

        <div class="smoc-cards-158">
          <div
            v-for="(card, index) in cards"
            :key="index"
            class="smoc-orbit-card-158"
            :ref="el => { if (el) cardRefs[index] = el as HTMLElement }"
            :data-index="index"
            :style="{
              '--angle': index * 90,
              '--radius': 220 + index * 20,
              '--color': card.color,
              '--delay': index * 0.15
            }"
          >
            <div class="smoc-card-trail-158"></div>
            <div class="smoc-card-inner-158">
              <div class="smoc-card-glow-158"></div>
              <div class="smoc-card-image-158" :style="{ backgroundImage: `url(${card.image})` }">
                <div class="smoc-image-overlay-158"></div>
              </div>
              <div class="smoc-card-content-158">
                <div class="smoc-card-number-158">
                  <span class="smoc-number-text-158">{{ String(index + 1).padStart(2, '0') }}</span>
                  <svg class="smoc-number-ring-158" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="28" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="176" stroke-dashoffset="44"></circle>
                  </svg>
                </div>
                <h3 class="smoc-card-title-158">{{ card.title }}</h3>
                <p class="smoc-card-desc-158">{{ card.description }}</p>
                <div class="smoc-card-tags-158">
                  <span v-for="(tag, tagIndex) in card.tags" :key="tagIndex" class="smoc-tag-158">{{ tag }}</span>
                </div>
              </div>
            </div>
            <div class="smoc-magnetic-lines-158">
              <div v-for="i in 8" :key="i" class="smoc-line-158" :style="`--rotation: ${i * 45}deg`"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 滚动提示 -->
    <div class="smoc-scroll-hint-158">
      <div class="smoc-scroll-text-158">滚动加速</div>
      <div class="smoc-scroll-arrow-158">
        <div class="smoc-arrow-line-158"></div>
        <div class="smoc-arrow-line-158"></div>
      </div>
      <div class="smoc-progress-bar-158">
        <div class="smoc-progress-fill-158"></div>
      </div>
      <div class="smoc-progress-text-158">
        <span class="smoc-progress-label-158">轨道速度</span>
        <span class="smoc-progress-value-158">0.3x</span>
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
const orbitCenter = ref<HTMLElement>()
const cardRefs = ref<HTMLElement[]>([])

interface Card {
  image: string
  title: string
  description: string
  color: string
  tags: string[]
}

const cards: Card[] = [
  {
    image: new URL('@/assets/image/1.png', import.meta.url).href,
    title: '引力',
    description: 'Gravity Force',
    color: '#8b5cf6',
    tags: ['物理', '力场']
  },
  {
    image: new URL('@/assets/image/2.png', import.meta.url).href,
    title: '轨道',
    description: 'Orbital Path',
    color: '#d946ef',
    tags: ['天体', '运动']
  },
  {
    image: new URL('@/assets/image/3.png', import.meta.url).href,
    title: '磁力',
    description: 'Magnetic Field',
    color: '#f97316',
    tags: ['磁极', '吸引']
  },
  {
    image: new URL('@/assets/image/4.png', import.meta.url).href,
    title: '旋转',
    description: 'Rotation',
    color: '#06b6d4',
    tags: ['动力', '旋转']
  }
]

const particleStyle = (index: number) => {
  const size = Math.random() * 4 + 2
  return {
    '--size': `${size}px`,
    '--x': `${Math.random() * 100}%`,
    '--y': `${Math.random() * 100}%`,
    '--delay': `${Math.random() * 5}s`,
    '--duration': `${Math.random() * 10 + 10}s`
  }
}

let ctx: gsap.Context
let orbitTimeline: gsap.core.Timeline | null = null
let magneticTimelines: Map<number, gsap.core.Timeline> = new Map()

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return
    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.smoc-title-text-158', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.smoc-subtitle-158', componentRoot.value)
      const orbitCards = gsap.utils.toArray<HTMLElement>('.smoc-orbit-card-158', componentRoot.value)
      const stageEl = gsap.utils.toArray<HTMLElement>('.smoc-stage-158', componentRoot.value)
      const cardImages = gsap.utils.toArray<HTMLElement>('.smoc-card-image-158', componentRoot.value)
      const cardTitles = gsap.utils.toArray<HTMLElement>('.smoc-card-title-158', componentRoot.value)
      const cardDescs = gsap.utils.toArray<HTMLElement>('.smoc-card-desc-158', componentRoot.value)
      const cardNumbers = gsap.utils.toArray<HTMLElement>('.smoc-number-text-158', componentRoot.value)
      const orbitRings = gsap.utils.toArray<HTMLElement>('.smoc-ring-158', componentRoot.value)
      const cardTags = gsap.utils.toArray<HTMLElement>('.smoc-tag-158', componentRoot.value)
      const centerContent = gsap.utils.toArray<HTMLElement>('.smoc-center-content-158', componentRoot.value)
      const scrollHint = gsap.utils.toArray<HTMLElement>('.smoc-scroll-hint-158', componentRoot.value)

      // 粒子入场动画
      gsap.utils.toArray<HTMLElement>('.smoc-particle-158', componentRoot.value).forEach((particle, i) => {
        gsap.from(particle, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top bottom',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 1.5,
          delay: i * 0.02,
          ease: 'elastic.out(1, 0.5)'
        })
      })

      // 标题渐变入场 - 超级弹性效果
      gsap.from(titleEl, {
        scrollTrigger: {
          trigger: componentRoot.value,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 120,
        opacity: 0,
        scale: 0.6,
        rotationX: -45,
        duration: 1.8,
        ease: 'elastic.out(1, 0.7)'
      })

      gsap.from('.smoc-title-glow-158', {
        scrollTrigger: {
          trigger: componentRoot.value,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        },
        scaleX: 0,
        duration: 1.5,
        delay: 0.4,
        ease: 'elastic.out(1, 0.5)'
      })

      if (subtitleEl.length) {
        gsap.from(subtitleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          y: 50,
          opacity: 0,
          duration: 1,
          delay: 0.4,
          ease: 'power3.out'
        })
      }

      // 中心内容弹性入场
      if (centerContent.length) {
        gsap.from(centerContent, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          rotation: -180,
          duration: 1.5,
          ease: 'elastic.out(1, 0.6)'
        })
      }

      // 轨道环弹性展开 - 滚动绑定
      if (orbitRings.length) {
        // 入场动画
        gsap.from(orbitRings, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 68%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          rotation: -180,
          duration: 2,
          stagger: 0.2,
          ease: 'elastic.out(1, 0.5)'
        })

        // 滚动绑定的轨道环动画
        gsap.to(orbitRings, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1
          },
          rotation: (i) => (i % 2 === 0 ? 90 : -90),
          scale: 1.1,
          ease: 'none'
        })

        // 轨道环上的点动画 - 超级弹性
        gsap.utils.toArray<HTMLElement>('.smoc-ring-dot-158', componentRoot.value).forEach((dot, i) => {
          gsap.from(dot, {
            scrollTrigger: {
              trigger: stageEl[0] || componentRoot.value,
              start: 'top 65%',
              toggleActions: 'play none none reverse'
            },
            scale: 0,
            opacity: 0,
            rotation: 360,
            duration: 1,
            delay: 0.6 + i * 0.03,
            ease: 'elastic.out(1, 0.6)'
          })
        })
      }

      // 卡片轨道入场 - 超强3D效果 + 滚动绑定
      if (orbitCards.length) {
        // 入场动画
        gsap.from(orbitCards, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          rotationX: -90,
          rotationY: -90,
          z: -300,
          duration: 1.5,
          stagger: 0.2,
          ease: 'elastic.out(1, 0.6)'
        })

        // 滚动绑定的轨道动画
        gsap.to(orbitCards, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1
          },
          rotation: (i) => `+=180`,
          scale: 1.1,
          ease: 'none'
        })

        // 持续轨道旋转
        orbitTimeline = gsap.timeline({ repeat: -1, ease: 'none' })
        orbitTimeline.to(orbitCards, {
          rotation: (i) => `+=360`,
          duration: 50,
          ease: 'none'
        })
      }

      // 卡片内容渐入动画 - 滚动绑定
      if (cardImages.length) {
        // 入场动画
        gsap.from(cardImages, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          },
          scale: 2,
          opacity: 0,
          rotation: 25,
          duration: 1.2,
          stagger: 0.15,
          delay: 0.6,
          ease: 'elastic.out(1, 0.5)'
        })

        // 滚动绑定的图片动画
        gsap.to(cardImages, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 50%',
            end: 'bottom 30%',
            scrub: 1
          },
          rotation: -25,
          scale: 1.05,
          ease: 'none'
        })
      }

      if (cardNumbers.length) {
        gsap.from(cardNumbers, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          },
          x: -80,
          opacity: 0,
          rotation: -45,
          scale: 0.5,
          duration: 1.1,
          stagger: 0.15,
          delay: 0.8,
          ease: 'elastic.out(1, 0.6)'
        })

        // 序号环旋转动画 - 加速版本
        gsap.utils.toArray<HTMLElement>('.smoc-number-ring-158', componentRoot.value).forEach((ring) => {
          gsap.to(ring, {
            rotation: 360,
            duration: 15,
            repeat: -1,
            ease: 'none'
          })
        })
      }

      if (cardTitles.length) {
        gsap.from(cardTitles, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          },
          y: 40,
          opacity: 0,
          scale: 0.8,
          rotationX: -20,
          duration: 1,
          stagger: 0.15,
          delay: 1,
          ease: 'back.out(1.7)'
        })
      }

      if (cardDescs.length) {
        gsap.from(cardDescs, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          },
          y: 40,
          opacity: 0,
          x: -20,
          duration: 0.9,
          stagger: 0.15,
          delay: 1.2,
          ease: 'power3.out'
        })
      }

      // 标签动画
      if (cardTags.length) {
        gsap.from(cardTags, {
          scrollTrigger: {
            trigger: stageEl[0] || componentRoot.value,
            start: 'top 55%',
            toggleActions: 'play none none reverse'
          },
          y: 20,
          opacity: 0,
          scale: 0.8,
          duration: 0.6,
          stagger: {
            each: 0.08,
            from: 'random'
          },
          delay: 1.4,
          ease: 'back.out(1.5)'
        })
      }

      // 卡片磁力悬停效果
      cardRefs.value.forEach((card, index) => {
        if (!card) return

        card.addEventListener('mouseenter', (e) => {
          const tl = gsap.timeline()
          
          // 卡片放大
          tl.to(card, {
            scale: 1.3,
            zIndex: 100,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)'
          })
          
          // 发光效果
          tl.to(card.querySelector('.smoc-card-glow-158'), {
            opacity: 0.8,
            scale: 1.5,
            duration: 0.4
          }, 0)
          
          // 磁力线动画
          tl.to(card.querySelectorAll('.smoc-line-158'), {
            height: 60,
            opacity: 0.8,
            duration: 0.4,
            stagger: 0.02
          }, 0)
          
          // 轨迹动画
          tl.to(card.querySelector('.smoc-card-trail-158'), {
            width: '200%',
            opacity: 0.6,
            duration: 0.6
          }, 0)
          
          // 图片放大
          tl.to(card.querySelector('.smoc-card-image-158'), {
            scale: 1.15,
            duration: 0.5
          }, 0)

          magneticTimelines.set(index, tl)
        })

        card.addEventListener('mouseleave', () => {
          const tl = magneticTimelines.get(index)
          if (tl) tl.kill()
          
          gsap.to(card, {
            scale: 1,
            zIndex: 1,
            duration: 0.6,
            ease: 'elastic.out(1, 0.5)'
          })
          
          gsap.to(card.querySelector('.smoc-card-glow-158'), {
            opacity: 0,
            scale: 1,
            duration: 0.4
          })
          
          gsap.to(card.querySelectorAll('.smoc-line-158'), {
            height: 20,
            opacity: 0.3,
            duration: 0.3
          })
          
          gsap.to(card.querySelector('.smoc-card-trail-158'), {
            width: 0,
            opacity: 0,
            duration: 0.4
          })
          
          gsap.to(card.querySelector('.smoc-card-image-158'), {
            scale: 1,
            duration: 0.5
          })
        })

        // 磁力跟随效果 - 增强版
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect()
          const x = e.clientX - rect.left - rect.width / 2
          const y = e.clientY - rect.top - rect.height / 2

          gsap.to(card, {
            x: x * 0.15,
            y: y * 0.15,
            rotationX: -y * 0.2,
            rotationY: x * 0.2,
            duration: 0.2,
            ease: 'power2.out'
          })
        })
      })

      // 滚动控制轨道速度 - 超级增强版
      if (stageEl.length) {
        const scrollTrigger = ScrollTrigger.create({
          trigger: stageEl[0],
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: true,
          onUpdate: (self) => {
            const baseSpeed = 0.3
            const speed = baseSpeed + self.progress * 4
            
            // 动态调整轨道速度
            if (orbitTimeline) {
              orbitTimeline.timeScale(speed)
            }
            
            // 更新进度显示
            const progressFill = document.querySelector('.smoc-progress-fill-158')
            const progressValue = document.querySelector('.smoc-progress-value-158')
            if (progressFill) {
              gsap.to(progressFill, {
                width: `${self.progress * 100}%`,
                duration: 0.1
              })
            }
            if (progressValue) {
              progressValue.textContent = `${speed.toFixed(1)}x`
            }
            
            // 滚动时增强发光和脉动
            const glowIntensity = 60 + self.progress * 80
            const opacity = 0.6 + self.progress * 0.4
            
            gsap.to('.smoc-center-content-158', {
              boxShadow: `0 0 ${glowIntensity}px rgba(139, 92, 246, ${opacity}), 0 0 ${glowIntensity * 1.5}px rgba(217, 70, 239, ${opacity * 0.5})`,
              scale: 1 + self.progress * 0.1,
              duration: 0.2
            })
            
            // 轨道环动态缩放和透明度
            gsap.to('.smoc-ring-158', {
              opacity: 0.3 + self.progress * 0.4,
              scale: 1 + self.progress * 0.05,
              duration: 0.2
            })
            
            // 卡片动态效果 - 滚动时轻微放大
            gsap.to('.smoc-card-inner-158', {
              scale: 1 + self.progress * 0.05,
              duration: 0.2
            })
            
            // 磁力线动态增强
            gsap.to('.smoc-line-158', {
              height: 20 + self.progress * 30,
              opacity: 0.3 + self.progress * 0.5,
              duration: 0.2
            })
            
            // 装饰光晕动态增强
            gsap.to('.smoc-glow-1-158, .smoc-glow-2-158, .smoc-glow-3-158', {
              opacity: 0.3 + self.progress * 0.3,
              scale: 1 + self.progress * 0.2,
              duration: 0.3
            })
            
            // 粒子动态增强
            gsap.to('.smoc-particle-158', {
              opacity: 0.3 + self.progress * 0.5,
              duration: 0.3
            })
          }
        })
        
        // 添加滚动时的弹性脉冲动画
        gsap.to('.smoc-center-pulse-1-158, .smoc-center-pulse-2-158', {
          scrollTrigger: {
            trigger: stageEl[0],
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: true
          },
          scale: 1.5,
          duration: 0.3
        })
      }

      // 滚动提示动画
      if (scrollHint.length) {
        gsap.from(scrollHint, {
          scrollTrigger: {
            trigger: stageEl[0],
            start: 'bottom 15%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power2.out'
        })

        gsap.to('.smoc-scroll-arrow-158', {
          y: 10,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
      }
    }, componentRoot.value)
  }, 100)
})

onUnmounted(() => {
  ctx?.revert()
  if (orbitTimeline) {
    orbitTimeline.kill()
  }
  magneticTimelines.forEach(tl => tl.kill())
})
</script>

<style scoped lang="scss">
.smoc-magnetic-orbit-cards-section-158 {
  min-height: 100vh;
  padding: 120px 20px 100px;
  background: 
    radial-gradient(ellipse at 30% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(217, 70, 239, 0.15) 0%, transparent 50%),
    linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 50%, #0a1a2a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

// 粒子背景
.smoc-particles-158 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.smoc-particle-158 {
  position: absolute;
  width: var(--size);
  height: var(--size);
  left: var(--x);
  top: var(--y);
  background: radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  animation: particleFloat var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);

  opacity: 1 !important;}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-100px) scale(1.5);
    opacity: 0.8;
  }
}

// 装饰光晕
.smoc-glow-1-158,
.smoc-glow-2-158,
.smoc-glow-3-158 {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  animation: glowPulse 8s ease-in-out infinite;
  pointer-events: none;
}

.smoc-glow-1-158 {
  width: 600px;
  height: 600px;
  top: -200px;
  left: -200px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, transparent 70%);
  animation-delay: 0s;

  opacity: 1 !important;}

.smoc-glow-2-158 {
  width: 500px;
  height: 500px;
  bottom: -150px;
  right: -150px;
  background: radial-gradient(circle, rgba(217, 70, 239, 0.5) 0%, transparent 70%);
  animation-delay: 2s;

  opacity: 1 !important;}

.smoc-glow-3-158 {
  width: 400px;
  height: 400px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, transparent 70%);
  animation-delay: 4s;

  opacity: 1 !important;}

@keyframes glowPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.5;
  }
}

.smoc-container-158 {
  position: relative;
  max-width: 1600px;
  margin: 0 auto;
  z-index: 1;

  opacity: 1 !important;}

.smoc-title-158 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 20px;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);

  opacity: 1 !important;}

.smoc-title-text-158 {
  display: block;
  background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 25%, #f97316 50%, #d946ef 75%, #8b5cf6 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 5s ease infinite;
  filter: drop-shadow(0 0 30px rgba(139, 92, 246, 0.6));

  opacity: 1 !important;}

.smoc-title-glow-158 {
  position: absolute;
  bottom: -5px;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent, #8b5cf6, #d946ef, #f97316, transparent);
  transform: scaleX(0);
  transform-origin: center;

  opacity: 1 !important;}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.smoc-subtitle-158 {
  text-align: center;
  font-size: 1.1rem;
  color: rgba(139, 92, 246, 0.7);
  margin-bottom: 100px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  font-weight: 500;

  opacity: 1 !important;}

.smoc-stage-158 {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.smoc-orbit-center-158 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.smoc-center-pulse-1-158,
.smoc-center-pulse-2-158 {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid rgba(139, 92, 246, 0.4);
  animation: pulseRing 3s ease-out infinite;

  opacity: 1 !important;}

.smoc-center-pulse-2-158 {
  animation-delay: 1.5s;
}

@keyframes pulseRing {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

.smoc-center-content-158 {
  position: relative;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(217, 70, 239, 0.9));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 0 60px rgba(139, 92, 246, 0.6),
    0 0 120px rgba(217, 70, 239, 0.3),
    inset 0 0 40px rgba(255, 255, 255, 0.1);
  z-index: 2;
  backdrop-filter: blur(20px);

  opacity: 1 !important;}

.smoc-center-icon-158 {
  font-size: 3rem;
  animation: iconFloat 2s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes iconFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.smoc-center-text-158 {
  font-size: 0.75rem;
  color: #fff;
  font-weight: 700;
  margin-top: 5px;
  letter-spacing: 0.2em;

  opacity: 1 !important;}

.smoc-center-ring-158 {
  position: absolute;
  inset: -15px;
  animation: rotateRing 20s linear infinite;
}

@keyframes rotateRing {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.smoc-center-circle-158 {
  transform-origin: center;
}

.smoc-orbit-rings-158 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.smoc-ring-158 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: var(--size);
  height: var(--size);
  border: 1px dashed rgba(139, 92, 246, 0.3);
  border-radius: 50%;
  animation: rotateRing var(--duration) linear infinite;
  animation-direction: var(--direction);

  opacity: 1 !important;}

.smoc-ring-dot-158 {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%) rotate(var(--angle));
  width: 6px;
  height: 6px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.9), rgba(217, 70, 239, 0.9));
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.6);

  opacity: 1 !important;}

.smoc-cards-158 {
  position: absolute;
  width: 100%;
  height: 100%;

  opacity: 1 !important;}

.smoc-orbit-card-158 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: rotate(var(--angle)deg) translateX(var(--radius)) rotate(calc(var(--angle) * -1));
  will-change: transform;
  transition: z-index 0s;
}

.smoc-card-inner-158 {
  position: relative;
  width: 240px;
  background: rgba(20, 15, 30, 0.95);
  backdrop-filter: blur(30px);
  border-radius: 24px;
  overflow: hidden;
  border: 2px solid rgba(139, 92, 246, 0.3);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(139, 92, 246, 0.1),
    inset 0 0 40px rgba(139, 92, 246, 0.05);
  cursor: pointer;

  opacity: 1 !important;}

.smoc-card-glow-158 {
  position: absolute;
  inset: -10px;
  background: radial-gradient(ellipse at center, var(--color) 0%, transparent 70%);
  opacity: 0;
  filter: blur(20px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  z-index: -1;
}

.smoc-card-trail-158 {
  position: absolute;
  inset: 0;
  width: 0;
  background: linear-gradient(90deg, transparent, var(--color), transparent);
  opacity: 0;
  filter: blur(15px);
  pointer-events: none;
  overflow: hidden;
}

.smoc-card-image-158 {
  width: 100%;
  height: 160px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);

  opacity: 1 !important;}

.smoc-image-overlay-158 {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(20, 15, 30, 0.5) 100%);

  opacity: 1 !important;}

.smoc-card-content-158 {
  position: relative;
  padding: 24px;

  opacity: 1 !important;}

.smoc-card-number-158 {
  position: absolute;
  top: -35px;
  left: 20px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.smoc-number-text-158 {
  position: relative;
  z-index: 2;
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--color), #d946ef);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.3));

  opacity: 1 !important;}

.smoc-number-ring-158 {
  position: absolute;
  inset: 0;
  color: var(--color);
  opacity: 0.5;
}

.smoc-card-title-158 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

.smoc-card-desc-158 {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 16px;

  opacity: 1 !important;}

.smoc-card-tags-158 {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.smoc-tag-158 {
  padding: 4px 12px;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 20px;
  font-size: 0.75rem;
  color: #d946ef;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  opacity: 1 !important;}

.smoc-magnetic-lines-158 {
  position: absolute;
  inset: -30px;
  pointer-events: none;
}

.smoc-line-158 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 20px;
  background: linear-gradient(to top, var(--color), transparent);
  transform-origin: bottom center;
  transform: translate(-50%, -50%) rotate(var(--rotation));
  opacity: 0.3;
  border-radius: 2px;
  transition: height 0.4s ease, opacity 0.4s ease;
}

// 滚动提示
.smoc-scroll-hint-158 {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 10;
}

.smoc-scroll-text-158 {
  font-size: 0.8rem;
  color: rgba(139, 92, 246, 0.7);
  letter-spacing: 0.3em;
  text-transform: uppercase;

  opacity: 1 !important;}

.smoc-scroll-arrow-158 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.smoc-arrow-line-158 {
  width: 2px;
  height: 15px;
  background: linear-gradient(to bottom, transparent, rgba(139, 92, 246, 0.8));
  border-radius: 2px;

  opacity: 1 !important;}

.smoc-progress-bar-158 {
  width: 200px;
  height: 4px;
  background: rgba(139, 92, 246, 0.2);
  border-radius: 2px;
  overflow: hidden;

  opacity: 1 !important;}

.smoc-progress-fill-158 {
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6, #d946ef, #f97316);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.6);

  opacity: 1 !important;}

.smoc-progress-text-158 {
  display: flex;
  gap: 16px;
  align-items: center;
}

.smoc-progress-label-158 {
  font-size: 0.75rem;
  color: rgba(139, 92, 246, 0.6);
  letter-spacing: 0.1em;
  text-transform: uppercase;

  opacity: 1 !important;}

.smoc-progress-value-158 {
  font-size: 0.9rem;
  font-weight: 700;
  color: #d946ef;
  min-width: 50px;
  text-align: center;
  background: rgba(139, 92, 246, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid rgba(139, 92, 246, 0.3);

  opacity: 1 !important;}

@media (max-width: 768px) {
  .smoc-magnetic-orbit-cards-section-158 {
    padding: 80px 20px 120px;
  
  opacity: 1 !important;}

  .smoc-orbit-card-158 {
    transform: rotate(var(--angle)deg) translateX(calc(var(--radius) * 0.6)) rotate(calc(var(--angle) * -1));
  }

  .smoc-card-inner-158 {
    width: 180px;
  
  opacity: 1 !important;}

  .smoc-card-image-158 {
    height: 120px;
  
  opacity: 1 !important;}

  .smoc-card-number-158 {
    top: -25px;
    width: 50px;
    height: 50px;
  
  opacity: 1 !important;}

  .smoc-number-text-158 {
    font-size: 1.8rem;
  
  opacity: 1 !important;}

  .smoc-card-title-158 {
    font-size: 1.2rem;
  
  opacity: 1 !important;}

  .smoc-card-desc-158 {
    font-size: 0.7rem;
  
  opacity: 1 !important;}

  .smoc-tag-158 {
    padding: 3px 10px;
    font-size: 0.65rem;
  
  opacity: 1 !important;}

  .smoc-center-content-158 {
    width: 100px;
    height: 100px;
  
  opacity: 1 !important;}

  .smoc-center-icon-158 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .smoc-center-text-158 {
    font-size: 0.65rem;
  
  opacity: 1 !important;}

  .smoc-scroll-hint-158 {
    bottom: 50px;
  }

  .smoc-progress-bar-158 {
    width: 150px;
  
  opacity: 1 !important;}
}
</style>
