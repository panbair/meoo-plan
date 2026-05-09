<template>
  <div class="spl-parallax-section-214" ref="componentRoot">
    <div class="spl-container-214">
      <h2 class="spl-title-214">视差层级</h2>
      <p class="spl-subtitle-214">Parallax Layers Effect</p>

      <div class="spl-parallax-wrapper-214">
        <!-- 背景层 -->
        <div class="spl-layer-214 spl-layer-bg-214" data-speed="0.1">
          <div class="spl-layer-content-214">
            <div class="spl-bg-pattern-214"></div>
          </div>
        </div>

        <!-- 远景层 -->
        <div class="spl-layer-214 spl-layer-far-214" data-speed="0.2">
          <div class="spl-layer-content-214">
            <div class="spl-shape-214 spl-shape-1-214"></div>
            <div class="spl-shape-214 spl-shape-2-214"></div>
          </div>
        </div>

        <!-- 中景层 -->
        <div class="spl-layer-214 spl-layer-mid-214" data-speed="0.4">
          <div class="spl-layer-content-214">
            <div class="spl-shape-214 spl-shape-3-214"></div>
            <div class="spl-shape-214 spl-shape-4-214"></div>
            <div class="spl-shape-214 spl-shape-5-214"></div>
          </div>
        </div>

        <!-- 近景层 -->
        <div class="spl-layer-214 spl-layer-near-214" data-speed="0.6">
          <div class="spl-layer-content-214">
            <div class="spl-card-214" v-for="(card, index) in cards" :key="index">
              <div class="spl-card-inner-214">
                <div class="spl-card-number-214">{{ String(index + 1).padStart(2, '0') }}</div>
                <h3 class="spl-card-title-214">{{ card.title }}</h3>
                <p class="spl-card-desc-214">{{ card.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 前景层 -->
        <div class="spl-layer-214 spl-layer-fore-214" data-speed="0.8">
          <div class="spl-layer-content-214">
            <div class="spl-particle-214" v-for="i in 20" :key="`particle-${i}`" :style="getParticleStyle(i)"></div>
          </div>
        </div>
      </div>

      <!-- 进度指示器 -->
      <div class="spl-progress-bar-214">
        <div class="spl-progress-fill-214" ref="progressFill"></div>
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
const progressFill = ref<HTMLElement>()

interface Card {
  title: string
  desc: string
}

const cards = ref<Card[]>([
  {
    title: '背景层',
    desc: '最远的视差效果'
  },
  {
    title: '远景层',
    desc: '中速移动'
  },
  {
    title: '中景层',
    desc: '正常速度'
  },
  {
    title: '近景层',
    desc: '快速移动'
  }
])

const getParticleStyle = (index: number) => {
  const angle = (index / 20) * 360
  const radius = 30 + Math.random() * 50
  return {
    '--angle': `${angle}deg`,
    '--radius': `${radius}px`,
    '--delay': `${index * 0.1}s`,
    '--size': `${3 + Math.random() * 4}px`
  }
}

let ctx: gsap.Context
let parallaxTimeline: gsap.core.Timeline

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return
    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.spl-title-214', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.spl-subtitle-214', componentRoot.value)
      const layers = gsap.utils.toArray<HTMLElement>('.spl-layer-214', componentRoot.value)
      const cards = gsap.utils.toArray<HTMLElement>('.spl-card-214', componentRoot.value)
      const shapes = gsap.utils.toArray<HTMLElement>('.spl-shape-214', componentRoot.value)
      const particles = gsap.utils.toArray<HTMLElement>('.spl-particle-214', componentRoot.value)

      // 标题动画
      if (titleEl.length) {
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        })
      }

      if (subtitleEl.length) {
        gsap.from(subtitleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          y: 40,
          opacity: 0,
          duration: 1,
          delay: 0.2,
          ease: 'power3.out'
        })
      }

      // 视差层动画
      if (layers.length) {
        layers.forEach((layer) => {
          const speed = parseFloat(layer.dataset.speed || '0.4')

          gsap.fromTo(
            layer,
            {
              y: -100 * speed
            },
            {
              y: 100 * speed,
              scrollTrigger: {
                trigger: componentRoot.value,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
              },
              ease: 'none'
            }
          )
        })
      }

      // 卡片入场动画
      if (cards.length) {
        gsap.from(cards, {
          scrollTrigger: {
            trigger: '.spl-layer-near-214',
            start: 'top 80%'
          },
          y: 80,
          opacity: 0,
          scale: 0.9,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.15
        })
      }

      // 形状动画
      if (shapes.length) {
        shapes.forEach((shape, index) => {
          gsap.from(shape, {
            scrollTrigger: {
              trigger: componentRoot.value,
              start: 'top 85%'
            },
            scale: 0,
            rotation: -180,
            duration: 1.2,
            ease: 'back.out(1.7)',
            delay: index * 0.1
          })

          gsap.to(shape, {
            rotation: 360,
            duration: 20 + index * 5,
            repeat: -1,
            ease: 'none'
          })
        })
      }

      // 粒子动画
      if (particles.length) {
        gsap.from(particles, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 90%'
          },
          scale: 0,
          opacity: 0,
          duration: 0.6,
          ease: 'back.out(1.5)',
          stagger: 0.05
        })

        // 粒子持续浮动
        gsap.to(particles, {
          y: -20,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: {
            each: 0.2,
            from: 'random'
          }
        })
      }

      // 进度条
      if (progressFill.value) {
        gsap.to(progressFill.value, {
          width: '100%',
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          },
          ease: 'none'
        })
      }

      // 创建视差时间轴
      parallaxTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: componentRoot.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      })

      // 为每层添加不同的视差效果
      parallaxTimeline.to('.spl-layer-bg-214', { y: 200 }, 0)
      parallaxTimeline.to('.spl-layer-far-214', { y: 150 }, 0)
      parallaxTimeline.to('.spl-layer-mid-214', { y: 80 }, 0)
      parallaxTimeline.to('.spl-layer-near-214', { y: 40 }, 0)
      parallaxTimeline.to('.spl-layer-fore-214', { y: 100 }, 0)

    }, componentRoot.value)
  }, 100)
})

onUnmounted(() => {
  ctx?.revert()
  parallaxTimeline?.kill()
})
</script>

<style scoped lang="scss">
.spl-parallax-section-214 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
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
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.spl-container-214 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 10;

  opacity: 1 !important;}

.spl-title-214 {
  text-align: center;
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.spl-subtitle-214 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 80px;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

.spl-parallax-wrapper-214 {
  position: relative;
  height: 800px;
  perspective: 1000px;

  opacity: 1 !important;}

.spl-layer-214 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.spl-layer-bg-214 {
  z-index: 1;
}

.spl-layer-far-214 {
  z-index: 2;
}

.spl-layer-mid-214 {
  z-index: 3;
}

.spl-layer-near-214 {
  z-index: 4;
  pointer-events: auto;
}

.spl-layer-fore-214 {
  z-index: 5;
}

.spl-layer-content-214 {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.spl-bg-pattern-214 {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle at 25% 25%, rgba(102, 126, 234, 0.1) 2px, transparent 2px),
    radial-gradient(circle at 75% 75%, rgba(240, 147, 251, 0.1) 2px, transparent 2px);
  background-size: 60px 60px;
  animation: splBgPattern-214 20s linear infinite;

  opacity: 1 !important;}

@keyframes splBgPattern-214 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(60px, 60px);
  }
}

.spl-shape-214 {
  position: absolute;
  border-radius: 50%;
  opacity: 0.3;
  filter: blur(40px);
}

.spl-shape-1-214 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  top: 10%;
  left: 10%;

  opacity: 1 !important;}

.spl-shape-2-214 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  bottom: 20%;
  right: 15%;

  opacity: 1 !important;}

.spl-shape-3-214 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  top: 20%;
  right: 20%;

  opacity: 1 !important;}

.spl-shape-4-214 {
  width: 180px;
  height: 180px;
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  bottom: 15%;
  left: 25%;

  opacity: 1 !important;}

.spl-shape-5-214 {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #fa709a, #fee140);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  opacity: 1 !important;}

.spl-card-214 {
  width: 280px;
  height: 350px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 20px;
  cursor: pointer;
  transition: all 0.4s ease;
  pointer-events: auto;

  &:hover {
    transform: translateY(-10px) scale(1.05);
    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
    border-color: rgba(102, 126, 234, 0.3);
  
  opacity: 1 !important;}
}

.spl-card-inner-214 {
  text-align: center;

  opacity: 1 !important;}

.spl-card-number-214 {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 2rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.15);
  font-family: monospace;

  opacity: 1 !important;}

.spl-card-title-214 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
  letter-spacing: 0.05em;

  opacity: 1 !important;}

.spl-card-desc-214 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;

  opacity: 1 !important;}

.spl-particle-214 {
  position: absolute;
  width: var(--size, 4px);
  height: var(--size, 4px);
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: splParticleFloat-214 3s ease-in-out infinite;
  animation-delay: var(--delay, 0s);

  opacity: 1 !important;}

@keyframes splParticleFloat-214 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(calc(sin(var(--angle)) * var(--radius)), calc(cos(var(--angle)) * var(--radius))) scale(1.5);
    opacity: 0.8;
  }
}

.spl-progress-bar-214 {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  z-index: 100;

  opacity: 1 !important;}

.spl-progress-fill-214 {
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
  border-radius: 2px;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .spl-parallax-wrapper-214 {
    height: 1000px;
  
  opacity: 1 !important;}

  .spl-card-214 {
    width: calc(50% - 20px);
    height: 280px;
    margin: 10px;
    padding: 25px;
  
  opacity: 1 !important;}

  .spl-card-title-214 {
    font-size: 1.3rem;
  
  opacity: 1 !important;}

  .spl-shape-214 {
    opacity: 0.15;
  }

  .spl-progress-bar-214 {
    width: 200px;
    bottom: 20px;
  
  opacity: 1 !important;}
}
</style>
