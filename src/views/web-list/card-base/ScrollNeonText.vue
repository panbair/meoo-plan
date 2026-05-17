<template>
  <div class="neon-text-wrapper-174">
    <div class="nt-stage-174" ref="stageRef">
      <div class="nt-neon-container-174" ref="neonContainerRef">
        <h2 class="nt-title-174">NEON GLOW</h2>
        <p class="nt-subtitle-174">霓虹发光效果</p>
        <div class="nt-neon-text-174">
          <span class="nt-letter-174" v-for="(char, i) in text.split('')" :key="i">{{ char }}</span>
        </div>
        <div class="nt-glow-lines-174">
          <div class="nt-glow-line-174"></div>
          <div class="nt-glow-line-174"></div>
          <div class="nt-glow-line-174"></div>
        </div>
      </div>
      <div class="nt-cyber-grid-174">
        <div class="nt-grid-line-174" v-for="i in 10" :key="i"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stageRef = ref<HTMLElement>()
const neonContainerRef = ref<HTMLElement>()
const text = 'NEON FLUX'

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    const stage = stageRef.value
    const container = neonContainerRef.value
    if (!stage || !container) return

    const letters = gsap.utils.toArray('.nt-letter-174') as HTMLElement[]
    const glowLines = gsap.utils.toArray('.nt-glow-line-174') as HTMLElement[]
    const title = stage.querySelector('.nt-title-174')
    const subtitle = stage.querySelector('.nt-subtitle-174')

    // 霓虹文字发光动画
    gsap.fromTo(letters,
      {
        textShadow: '0 0 0px #0ff, 0 0 0px #f0f, 0 0 0px #ff0',
        color: '#111',
        opacity: 0.3
      },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1
        },
        textShadow: '0 0 20px #0ff, 0 0 40px #f0f, 0 0 60px #ff0',
        color: '#fff',
        opacity: 1,
        stagger: 0.05
      }
    )

    // 标题霓虹效果
    if (title) {
      gsap.fromTo(title,
        { textShadow: 'none', scale: 0.8 },
        {
          scrollTrigger: {
            trigger: stage,
            start: 'top 80%',
            end: 'center 50%',
            scrub: 1
          },
          textShadow: '0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff',
          scale: 1
        }
      )
    }

    // 副标题延迟出现
    if (subtitle) {
      gsap.fromTo(subtitle,
        { opacity: 0, y: 20 },
        {
          scrollTrigger: {
            trigger: stage,
            start: 'top 70%',
            end: 'top 50%',
            scrub: 1
          },
          opacity: 1,
          y: 0
        }
      )
    }

    // 霓虹光线条闪烁
    gsap.fromTo(glowLines,
      { scaleX: 0, opacity: 0 },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: 1
        },
        scaleX: 1,
        opacity: 1,
        stagger: 0.2
      }
    )

    // 持续闪烁效果
    glowLines.forEach((line, i) => {
      gsap.to(line, {
        opacity: 0.3 + Math.random() * 0.7,
        duration: 0.5 + Math.random() * 0.5,
        repeat: -1,
        yoyo: true,
        delay: i * 0.2
      })
    })

    // 霓虹容器边框发光
    gsap.to(container, {
      scrollTrigger: {
        trigger: stage,
        start: 'top 50%',
        end: 'bottom 30%',
        scrub: 1
      },
      boxShadow: '0 0 50px rgba(0, 255, 255, 0.5), 0 0 100px rgba(255, 0, 255, 0.3), inset 0 0 50px rgba(0, 255, 255, 0.1)'
    })

  }, stageRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.neon-text-wrapper-174 {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a2a 100%);
  overflow: hidden;

  opacity: 1 !important;}

.nt-stage-174 {
  position: relative;
  width: 100%;
  max-width: 1200px;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;

  opacity: 1 !important;}

.nt-neon-container-174 {
  position: relative;
  text-align: center;
  padding: 80px 60px;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid transparent;
  border-radius: 20px;
  overflow: hidden;

  opacity: 1 !important;}

.nt-neon-container-174::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #0ff, #f0f, #ff0, #0ff);
  border-radius: 20px;
  z-index: -1;
  animation: borderRotate 4s linear infinite;
}

.nt-title-174 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  color: #0ff;
  text-transform: uppercase;
  letter-spacing: 8px;
  margin-bottom: 20px;

  opacity: 1 !important;}

.nt-subtitle-174 {
  font-size: 1.2rem;
  color: #f0f;
  margin-bottom: 40px;
  letter-spacing: 4px;

  opacity: 1 !important;}

.nt-neon-text-174 {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px;
  margin: 40px 0;

  opacity: 1 !important;}

.nt-letter-174 {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  text-transform: uppercase;
  position: relative;
  display: inline-block;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.nt-letter-174:hover {
  transform: scale(1.2);
  text-shadow: '0 0 30px #0ff, 0 0 60px #f0f, 0 0 90px #ff0' !important;
}

.nt-glow-lines-174 {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

.nt-glow-line-174 {
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, transparent, #0ff, transparent);
  border-radius: 2px;
  transform-origin: center;

  opacity: 1 !important;}

.nt-cyber-grid-174 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.nt-grid-line-174 {
  position: absolute;
  width: 1px;
  height: 100%;
  background: linear-gradient(180deg, transparent, rgba(0, 255, 255, 0.2), transparent);

  opacity: 1 !important;}

@for $i from 1 through 10 {
  .nt-grid-line-174:nth-child(#{$i}) {
    left: ($i - 1) * 10%;
  }
}

@keyframes borderRotate {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}
</style>
