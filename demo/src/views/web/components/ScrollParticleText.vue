<template>
  <section class="spart-scroll-particle-text-131">
    <div class="spart-container-131">
      <h2 class="spart-section-title-131">粒子文字</h2>
      <p class="spart-section-subtitle-131">Particle Text Animation</p>

      <div class="spart-particle-stage-131" ref="stage">
        <div class="spart-text-container-131">
          <div
            v-for="(word, index) in words"
            :key="index"
            class="spart-word-131"
            :ref="el => { if (el) wordRefs[index] = el as HTMLElement }"
          >
            <div
              v-for="(letter, lIndex) in word.letters"
              :key="lIndex"
              class="spart-letter-131"
              :data-letter="letter"
              :ref="el => { if (el) letterRefs[`${index}-${lIndex}`] = el as HTMLElement }"
            >
              {{ letter }}
            </div>
          </div>
        </div>

        <!-- 粒子层 -->
        <div class="spart-particles-131">
          <div
            v-for="n in 80"
            :key="n"
            class="spart-particle-131"
            :ref="el => { if (el) particleRefs[n] = el as HTMLElement }"
            :style="getParticleStyle(n)"
          ></div>
        </div>
      </div>

      <!-- 交互提示 -->
      <div class="spart-hint-131">
        <p>滚动体验粒子动画</p>
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
const letterRefs = ref<Record<string, HTMLElement>>({})
const particleRefs = ref<Record<number, HTMLElement>>({})

const words = [
  { letters: ['创', '意', '无', '限'] },
  { letters: ['粒', '子', '飞', '扬'] },
  { letters: ['灵', '动', '美', '感'] }
]

const getParticleStyle = (index: number) => {
  const size = 2 + Math.random() * 4
  const hue = Math.random() * 60 + 220 // 蓝紫色系
  return {
    width: `${size}px`,
    height: `${size}px`,
    background: `hsl(${hue}, 70%, 60%)`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${2 + Math.random() * 3}s`
  }
}

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题粒子入场
    gsap.from('.spart-section-title-131', {
      scrollTrigger: {
        trigger: '.spart-scroll-particle-text-131',
        start: 'top 90%',
        end: 'top 70%',
        scrub: 1
      },
      opacity: 0,
      filter: 'blur(15px)',
      scale: 0.9,
      ease: 'power2.out'
    })

    gsap.from('.spart-section-subtitle-131', {
      scrollTrigger: {
        trigger: '.spart-scroll-particle-text-131',
        start: 'top 85%',
        end: 'top 65%',
        scrub: 1
      },
      opacity: 0,
      y: 30,
      ease: 'power2.out'
    })

    // 文字粒子动画
    wordRefs.value.forEach((word, wordIndex) => {
      const letters = Array.from(word.querySelectorAll('.spart-letter-131'))

      // 初始状态 - 改为半可见状态
      gsap.set(letters, {
        opacity: 0.3,
        scale: 0.4,
        rotation: Math.random() * 90 - 45,
        filter: 'blur(5px)'
      })

      // 粒子散开入场 - 扩大滚动范围
      gsap.to(letters, {
        scrollTrigger: {
          trigger: word,
          start: 'top 85%',
          end: 'top 35%',
          scrub: 2
        },
        opacity: 1,
        scale: 1,
        rotation: 0,
        filter: 'blur(0px)',
        stagger: {
          each: 0.05,
          from: 'center'
        },
        ease: 'back.out(1.7)'
      })

      // 持续微动
      gsap.to(letters, {
        y: (index) => {
          return Math.sin(index * 0.5) * 10
        },
        duration: 2 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: wordIndex * 0.3
      })

      // 悬停粒子爆炸效果
      word.addEventListener('mouseenter', () => {
        gsap.to(letters, {
          x: () => (Math.random() - 0.5) * 100,
          y: () => (Math.random() - 0.5) * 100,
          scale: () => 0.5 + Math.random() * 1,
          rotation: () => (Math.random() - 0.5) * 180,
          opacity: () => 0.5 + Math.random() * 0.5,
          duration: 0.8,
          ease: 'power2.out',
          stagger: {
            each: 0.02,
            from: 'center'
          }
        })
      })

      word.addEventListener('mouseleave', () => {
        gsap.to(letters, {
          x: 0,
          y: () => Math.sin(Number(Object.keys(letterRefs.value).indexOf(letters[0].dataset.index || '0')) * 0.5) * 10,
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          stagger: {
            each: 0.02,
            from: 'center'
          }
        })
      })
    })

    // 背景粒子动画
    Object.values(particleRefs.value).forEach((particle, index) => {
      gsap.set(particle, {
        scale: 0.5,
        opacity: 0.3
      })

      // 粒子随机出现 - 扩大滚动范围
      gsap.to(particle, {
        scrollTrigger: {
          trigger: stage.value,
          start: 'top 90%',
          end: 'bottom 10%',
          scrub: 1.5
        },
        scale: (progress) => {
          return 0.5 + Math.sin(progress * Math.PI * 2) * 1
        },
        opacity: (progress) => {
          return 0.3 + Math.sin(progress * Math.PI) * 0.5
        },
        ease: 'none'
      })

      // 粒子持续浮动
      gsap.to(particle, {
        y: -50 - Math.random() * 50,
        x: (Math.random() - 0.5) * 100,
        duration: 3 + Math.random() * 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 2
      })

      // 粒子旋转
      gsap.to(particle, {
        rotation: 360,
        duration: 8 + Math.random() * 8,
        repeat: -1,
        ease: 'none',
        delay: Math.random() * 4
      })
    })

    // 提示文字淡入
    gsap.from('.spart-hint-131', {
      scrollTrigger: {
        trigger: '.spart-particle-stage-131',
        start: 'bottom 20%',
        end: 'bottom 10%',
        scrub: 1
      },
      opacity: 0,
      y: 20,
      ease: 'power2.out'
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.spart-scroll-particle-text-131 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 30%, #0f0f2a 60%, #1a1a3a 100%);
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
      radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 60%);
    pointer-events: none;
    animation: glow 8s ease-in-out infinite;
  
  opacity: 1 !important;}
}

@keyframes glow {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.spart-container-131 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.spart-section-title-131 {
  text-align: center;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #a855f7, #3b82f6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 80px rgba(168, 85, 247, 0.5);

  opacity: 1 !important;}

.spart-section-subtitle-131 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 150px;
  letter-spacing: 0.3em;
  text-transform: uppercase;

  opacity: 1 !important;}

.spart-particle-stage-131 {
  position: relative;
  min-height: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1500px;

  opacity: 1 !important;}

.spart-text-container-131 {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 100px;
}

.spart-word-131 {
  position: relative;
  display: flex;
  gap: 0.1em;
  z-index: 10;
  cursor: pointer;
}

.spart-letter-131 {
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 900;
  color: #fff;
  text-transform: uppercase;
  display: inline-block;
  position: relative;
  background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.95) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(168, 85, 247, 0.4);
  transition: all 0.3s ease;

  opacity: 1 !important;}

.spart-particles-131 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  opacity: 1 !important;}

.spart-particle-131 {
  position: absolute;
  border-radius: 50%;
  opacity: 0.3;
  will-change: transform;
}

.spart-hint-131 {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  animation: hint-pulse 2s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes hint-pulse {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
}

@media (max-width: 768px) {
  .spart-letter-131 {
    font-size: clamp(2.5rem, 8vw, 4rem);
  
  opacity: 1 !important;}

  .spart-word-131 {
    gap: 0.05em;
  }

  .spart-section-title-131 {
    margin-bottom: 80px;
  }

  .spart-section-subtitle-131 {
    margin-bottom: 100px;
    font-size: 0.9rem;
  
  opacity: 1 !important;}

  .spart-particle-stage-131 {
    min-height: 400px;
  
  opacity: 1 !important;}
}
</style>
