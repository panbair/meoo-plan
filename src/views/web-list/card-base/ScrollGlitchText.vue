<template>
  <section class="sgt-scroll-glitch-text-134">
    <div class="sgt-container-134">
      <h2 class="sgt-section-title-134">故障文字</h2>
      <p class="sgt-section-subtitle-134">Glitch Text Animation</p>

      <div class="sgt-glitch-stage-134" ref="stage">
        <div
          v-for="(word, index) in words"
          :key="index"
          class="sgt-word-wrapper-134"
          :ref="el => { if (el) wordRefs[index] = el as HTMLElement }"
        >
          <div class="sgt-glitch-text-134" :data-text="word">
            <span class="sgt-text-original-134">{{ word }}</span>
            <span class="sgt-text-1-134" aria-hidden="true">{{ word }}</span>
            <span class="sgt-text-2-134" aria-hidden="true">{{ word }}</span>
          </div>
          <div class="sgt-description-134">
            {{ descriptions[index] }}
          </div>
        </div>
      </div>

      <!-- 故障装饰元素 -->
      <div class="sgt-decorations-134">
        <div
          v-for="n in 8"
          :key="n"
          class="sgt-decoration-134"
          :style="getDecorationStyle(n)"
        ></div>
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
const wordRefs = ref<HTMLElement[]>([])

const words = ['数字', '未来', '科技', '创新']
const descriptions = [
  '数字时代的艺术表现形式',
  '探索未来的无限可能',
  '科技驱动的设计革新',
  '不断突破的创新精神'
]

const getDecorationStyle = (index: number) => {
  const hue = Math.random() * 360
  const size = 2 + Math.random() * 6
  return {
    width: `${size}px`,
    height: `${size}px`,
    background: `hsl(${hue}, 80%, 60%)`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`
  }
}

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题故障效果
    gsap.from('.sgt-section-title-134', {
      scrollTrigger: {
        trigger: '.sgt-scroll-glitch-text-134',
        start: 'top 90%',
        end: 'top 70%',
        scrub: 1
      },
      opacity: 0,
      x: () => (Math.random() - 0.5) * 50,
      y: () => (Math.random() - 0.5) * 50,
      scale: 0.9,
      filter: 'blur(10px)',
      ease: 'power2.out'
    })

    gsap.from('.sgt-section-subtitle-134', {
      scrollTrigger: {
        trigger: '.sgt-scroll-glitch-text-134',
        start: 'top 85%',
        end: 'top 65%',
        scrub: 1
      },
      opacity: 0,
      x: () => (Math.random() - 0.5) * 30,
      filter: 'blur(5px)',
      ease: 'power2.out'
    })

    // 故障文字动画
    wordRefs.value.forEach((wrapper, index) => {
      const glitchText = wrapper.querySelector('.sgt-glitch-text-134') as HTMLElement
      const original = wrapper.querySelector('.sgt-text-original-134') as HTMLElement
      const text1 = wrapper.querySelector('.sgt-text-1-134') as HTMLElement
      const text2 = wrapper.querySelector('.sgt-text-2-134') as HTMLElement
      const description = wrapper.querySelector('.sgt-description-134') as HTMLElement

      // 初始状态 - 改为半可见状态
      gsap.set(wrapper, {
        opacity: 0.4,
        scale: 0.7,
        filter: 'blur(3px)'
      })

      gsap.set(description, {
        opacity: 0.3,
        x: -30
      })

      // 主文字入场 - 扩大滚动范围
      gsap.to(wrapper, {
        scrollTrigger: {
          trigger: wrapper,
          start: 'top 85%',
          end: 'top 35%',
          scrub: 2.5
        },
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        ease: 'power3.out'
      })

      // 描述文字滑入 - 扩大滚动范围
      gsap.to(description, {
        scrollTrigger: {
          trigger: wrapper,
          start: 'top 80%',
          end: 'top 40%',
          scrub: 2
        },
        opacity: 0.8,
        x: 0,
        ease: 'power2.out'
      })

      // 故障效果 - 持续
      const glitchTimeline = gsap.timeline({
        repeat: -1,
        repeatDelay: 2 + Math.random() * 3
      })

      glitchTimeline
        .to(text1, {
          x: -3,
          opacity: 1,
          duration: 0.05
        })
        .to(text2, {
          x: 3,
          opacity: 1,
          duration: 0.05
        })
        .to(text1, {
          x: -5,
          duration: 0.05
        })
        .to(text2, {
          x: 5,
          duration: 0.05
        })
        .to(text1, {
          x: 0,
          opacity: 0,
          duration: 0.05
        })
        .to(text2, {
          x: 0,
          opacity: 0,
          duration: 0.05
        })

      glitchTimeline.delay(index * 0.5)

      // 滚动触发故障 - 扩大触发范围并增强效果
      gsap.fromTo([text1, text2],
        { opacity: 0 },
        {
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 85%',
            end: 'top 30%',
            scrub: 0.3,
            onUpdate: (self) => {
              if (self.progress > 0.2 && self.progress < 0.8) {
                const offset = (Math.random() - 0.5) * 15
                gsap.set(text1, { x: offset, opacity: Math.random() * 0.8 })
                gsap.set(text2, { x: -offset, opacity: Math.random() * 0.8 })
              } else {
                gsap.set([text1, text2], { opacity: 0, x: 0 })
              }
            }
          }
        }
      )

      // 悬停增强故障
      wrapper.addEventListener('mouseenter', () => {
        gsap.to(wrapper, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        })

        // 快速故障效果
        gsap.to(text1, {
          x: -5,
          opacity: 1,
          duration: 0.02,
          repeat: 5,
          yoyo: true,
          ease: 'none'
        })
        gsap.to(text2, {
          x: 5,
          opacity: 1,
          duration: 0.02,
          repeat: 5,
          yoyo: true,
          ease: 'none'
        })
      })

      wrapper.addEventListener('mouseleave', () => {
        gsap.to(wrapper, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        })

        gsap.to([text1, text2], {
          x: 0,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.out'
        })
      })
    })

    // 装饰元素动画 - 扩大滚动范围并增强效果
    gsap.to('.sgt-decoration-134', {
      scrollTrigger: {
        trigger: stage.value,
        start: 'top 90%',
        end: 'bottom 10%',
        scrub: 1.5
      },
      opacity: (progress) => {
        return 0.2 + Math.sin(progress * Math.PI) * 0.6
      },
      y: (progress) => {
        return -150 * progress
      },
      ease: 'none'
    })

    // 装饰元素持续闪烁
    gsap.to('.sgt-decoration-134', {
      opacity: (index) => 0.1 + Math.random() * 0.3,
      duration: 0.08,
      repeat: -1,
      yoyo: true,
      ease: 'none',
      stagger: {
        each: 0.05,
        from: 'random'
      }
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.sgt-scroll-glitch-text-134 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #000 0%, #0d0d0d 30%, #1a1a1a 60%, #0d0d0d 100%);
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
      linear-gradient(45deg, rgba(0, 255, 255, 0.03) 25%, transparent 25%),
      linear-gradient(-45deg, rgba(255, 0, 255, 0.03) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, rgba(0, 255, 255, 0.03) 75%),
      linear-gradient(-45deg, transparent 75%, rgba(255, 0, 255, 0.03) 75%);
    background-size: 20px 20px;
    animation: grid-move 20s linear infinite;
    pointer-events: none;
  
  opacity: 1 !important;}
}

@keyframes grid-move {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 20px 20px;
  }
}

.sgt-container-134 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.sgt-section-title-134 {
  text-align: center;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 20px;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);

  &::before,
  &::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  
  opacity: 1 !important;}

  &::before {
    color: #0ff;
    animation: glitch-1 0.5s infinite linear alternate-reverse;
    clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
  }

  &::after {
    color: #f0f;
    animation: glitch-2 0.5s infinite linear alternate-reverse;
    clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
  }
}

@keyframes glitch-1 {
  0%, 100% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
}

@keyframes glitch-2 {
  0%, 100% {
    transform: translate(0);
  }
  20% {
    transform: translate(2px, -2px);
  }
  40% {
    transform: translate(2px, 2px);
  }
  60% {
    transform: translate(-2px, -2px);
  }
  80% {
    transform: translate(-2px, 2px);
  }
}

.sgt-section-subtitle-134 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 120px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);

  opacity: 1 !important;}

.sgt-glitch-stage-134 {
  position: relative;
  min-height: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 180px;
  perspective: 1500px;

  opacity: 1 !important;}

.sgt-word-wrapper-134 {
  text-align: center;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;

  opacity: 1 !important;}

.sgt-glitch-text-134 {
  position: relative;
  font-size: clamp(6rem, 15vw, 12rem);
  font-weight: 900;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow: 0 0 40px rgba(0, 255, 255, 0.5);

  opacity: 1 !important;}

.sgt-text-original-134,
.sgt-text-1-134,
.sgt-text-2-134 {
  position: relative;
  display: inline-block;
}

.sgt-text-1-134 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #0ff;
  opacity: 0;
  text-shadow: 2px 0 #f0f;
  pointer-events: none;
}

.sgt-text-2-134 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #f0f;
  opacity: 0;
  text-shadow: -2px 0 #0ff;
  pointer-events: none;
}

.sgt-description-134 {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 20px;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

.sgt-decorations-134 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  opacity: 1 !important;}

.sgt-decoration-134 {
  position: absolute;
  opacity: 0.2;
  animation: decoration-flicker 0.08s infinite;
}

@keyframes decoration-flicker {
  0%, 100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.6;
  }
}

@media (max-width: 768px) {
  .sgt-glitch-text-134 {
    font-size: clamp(3rem, 12vw, 5rem);
  
  opacity: 1 !important;}

  .sgt-word-wrapper-134 {
    gap: 100px;
  }

  .sgt-section-title-134 {
    margin-bottom: 80px;
  }

  .sgt-section-subtitle-134 {
    margin-bottom: 80px;
    font-size: 0.9rem;
  
  opacity: 1 !important;}

  .sgt-description-134 {
    font-size: 1rem;
  
  opacity: 1 !important;}
}
</style>
