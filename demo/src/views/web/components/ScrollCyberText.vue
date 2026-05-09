<template>
  <div class="cyber-text-wrapper-175">
    <div class="ct-stage-175" ref="stageRef">
      <div class="ct-hologram-bg-175">
        <div class="ct-scanline-175"></div>
      </div>
      <div class="ct-cyber-container-175" ref="containerRef">
        <h2 class="ct-title-175">CYBER PUNK</h2>
        <div class="ct-code-block-175">
          <span class="ct-code-char-175">{{ codeText }}</span>
        </div>
        <div class="ct-cyber-text-175">
          <span class="ct-char-175" v-for="(char, i) in text.split('')" :key="i">{{ char }}</span>
        </div>
        <div class="ct-data-streams-175">
          <div class="ct-stream-175" v-for="i in 5" :key="i"></div>
        </div>
      </div>
      <div class="ct-particles-175">
        <div class="ct-particle-175" v-for="i in 30" :key="i"></div>
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
const containerRef = ref<HTMLElement>()
const text = 'CYBER SECURITY'
const codeText = `<INITIALIZE_SYSTEM>
<LOAD_MODULES>
<ACTIVATE_SECURITY>
<SCAN_THREATS>`

let ctx: gsap.Context
let typeInterval: number

onMounted(() => {
  ctx = gsap.context(() => {
    const stage = stageRef.value
    const container = containerRef.value
    if (!stage || !container) return

    const chars = gsap.utils.toArray('.ct-char-175') as HTMLElement[]
    const streams = gsap.utils.toArray('.ct-stream-175') as HTMLElement[]
    const particles = gsap.utils.toArray('.ct-particle-175') as HTMLElement[]
    const title = stage.querySelector('.ct-title-175')
    const codeBlock = stage.querySelector('.ct-code-block-175')
    const scanline = stage.querySelector('.ct-scanline-175')

    // 全息背景扫描线
    if (scanline) {
      gsap.fromTo(scanline,
        { top: '-100%' },
        {
          scrollTrigger: {
            trigger: stage,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          },
          top: '100%'
        }
      )

      gsap.to(scanline, {
        top: '100%',
        duration: 2,
        repeat: -1,
        ease: 'linear'
      })
    }

    // 标题故障效果
    if (title) {
      gsap.fromTo(title,
        { opacity: 0, skewX: 20, filter: 'blur(10px)' },
        {
          scrollTrigger: {
            trigger: stage,
            start: 'top 80%',
            end: 'top 60%',
            scrub: 1
          },
          opacity: 1,
          skewX: 0,
          filter: 'blur(0px)'
        }
      )

      // 持续故障闪烁
      gsap.to(title, {
        filter: 'blur(2px)',
        duration: 0.1,
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 2
      })
    }

    // 代码块打字效果
    if (codeBlock) {
      gsap.fromTo(codeBlock,
        { opacity: 0, x: -50 },
        {
          scrollTrigger: {
            trigger: stage,
            start: 'top 70%',
            end: 'top 50%',
            scrub: 1
          },
          opacity: 1,
          x: 0
        }
      )
    }

    // 赛博文字字符动画
    gsap.fromTo(chars,
      {
        color: '#0ff',
        textShadow: '0 0 10px #0ff',
        opacity: 0,
        x: -20
      },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 60%',
          end: 'center 50%',
          scrub: 1
        },
        color: '#f0f',
        textShadow: '0 0 20px #f0f, 0 0 40px #0ff',
        opacity: 1,
        x: 0,
        stagger: 0.03
      }
    )

    // 字符悬停效果
    chars.forEach((char, i) => {
      gsap.to(char, {
        color: '#ff0',
        textShadow: '0 0 30px #ff0',
        duration: 0.3,
        paused: true,
        overwrite: true
      })

      char.addEventListener('mouseenter', () => {
        gsap.to(char, { color: '#ff0', textShadow: '0 0 30px #ff0', duration: 0.1 })
      })
      char.addEventListener('mouseleave', () => {
        gsap.to(char, { color: '#f0f', textShadow: '0 0 20px #f0f, 0 0 40px #0ff', duration: 0.1 })
      })
    })

    // 数据流效果
    gsap.fromTo(streams,
      { scaleY: 0, opacity: 0 },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 50%',
          end: 'bottom 30%',
          scrub: 1
        },
        scaleY: 1,
        opacity: 1,
        stagger: 0.2
      }
    )

    streams.forEach((stream, i) => {
      gsap.to(stream, {
        scaleY: 0.5 + Math.random() * 0.5,
        duration: 0.3 + Math.random() * 0.5,
        repeat: -1,
        yoyo: true,
        delay: i * 0.1
      })
    })

    // 粒子浮动
    gsap.fromTo(particles,
      { opacity: 0, scale: 0 },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 40%',
          end: 'bottom 20%',
          scrub: 1
        },
        opacity: 0.6,
        scale: 1,
        stagger: {
          each: 0.05,
          from: 'random'
        }
      }
    )

    particles.forEach((particle, i) => {
      const x = (Math.random() - 0.5) * 200
      const y = (Math.random() - 0.5) * 200
      gsap.to(particle, {
        x: x,
        y: y,
        duration: 3 + Math.random() * 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 2
      })
    })

    // 容器边框脉冲
    gsap.to(container, {
      borderColor: '#0ff',
      boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)',
      scrollTrigger: {
        trigger: stage,
        start: 'top 30%',
        end: 'bottom 10%',
        scrub: 1
      }
    })

  }, stageRef.value)
})

onUnmounted(() => {
  ctx?.revert()
  if (typeInterval) clearInterval(typeInterval)
})
</script>

<style scoped lang="scss">
.cyber-text-wrapper-175 {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #0a0a1a 0%, #0f0f2f 50%, #0a0a1a 100%);
  overflow: hidden;

  opacity: 1 !important;}

.ct-stage-175 {
  position: relative;
  width: 100%;
  max-width: 1200px;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;

  opacity: 1 !important;}

.ct-hologram-bg-175 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.ct-scanline-175 {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #0ff, transparent);
  opacity: 0.5;
}

.ct-cyber-container-175 {
  position: relative;
  text-align: center;
  padding: 80px 60px;
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid #0ff;
  border-radius: 10px;
  overflow: hidden;
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.ct-cyber-container-175::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 255, 0.03) 2px,
    rgba(0, 255, 255, 0.03) 4px
  );
  pointer-events: none;
}

.ct-title-175 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  color: #0ff;
  text-transform: uppercase;
  letter-spacing: 6px;
  margin-bottom: 30px;
  text-shadow: 0 0 10px #0ff;

  opacity: 1 !important;}

.ct-code-block-175 {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #0f0;
  text-align: left;
  padding: 20px;
  background: rgba(0, 20, 0, 0.8);
  border-left: 3px solid #0f0;
  margin-bottom: 40px;
  max-width: 400px;
  white-space: pre;

  opacity: 1 !important;}

.ct-cyber-text-175 {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2px;
  margin: 40px 0;

  opacity: 1 !important;}

.ct-char-175 {
  font-size: clamp(2.5rem, 7vw, 5rem);
  font-weight: 900;
  text-transform: uppercase;
  position: relative;
  display: inline-block;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.ct-char-175:hover {
  transform: scale(1.3);
}

.ct-data-streams-175 {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 50px;
}

.ct-stream-175 {
  width: 3px;
  height: 100px;
  background: linear-gradient(180deg, transparent, #0ff, transparent);
  transform-origin: center;
  border-radius: 2px;

  opacity: 1 !important;}

.ct-particles-175 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.ct-particle-175 {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #0ff;
  border-radius: 50%;
  box-shadow: 0 0 10px #0ff;

  opacity: 1 !important;}
</style>
