<template>
  <div class="scp-cyber-pulse-section-187" ref="componentRoot">
    <div class="scp-container-187">
      <h2 class="scp-title-187">赛博脉冲</h2>
      <p class="scp-subtitle-187">Cyber Pulse Effect</p>

      <div class="scp-pulse-stage-187">
        <div class="scp-grid-lines-187">
          <div v-for="n in 20" :key="'h' + n" class="scp-line-h-187"></div>
          <div v-for="n in 20" :key="'v' + n" class="scp-line-v-187"></div>
        </div>

        <div class="scp-pulse-center-187" ref="pulseCenter">
          <div class="scp-pulse-core-187"></div>
          <div class="scp-pulse-rings-187">
            <div
              v-for="n in 6"
              :key="n"
              class="scp-pulse-ring-187"
              :ref="el => { if (el) ringRefs[n] = el as HTMLElement }"
            ></div>
          </div>
          <div class="scp-data-stream-187" ref="dataStream">
            <div v-for="n in 40" :key="n" class="scp-data-bit-187"></div>
          </div>
        </div>

        <div class="scp-cyber-cards-187">
          <div
            v-for="(card, index) in cyberCards"
            :key="index"
            class="scp-cyber-card-187"
            :ref="el => { if (el) cardRefs[index] = el as HTMLElement }"
          >
            <div class="scp-card-header-187">
              <span class="scp-card-id-187">{{ card.id }}</span>
              <span class="scp-card-status-187" :class="card.status"></span>
            </div>
            <div class="scp-card-body-187">
              <div class="scp-card-title-187">{{ card.title }}</div>
              <div class="scp-card-value-187">{{ card.value }}</div>
            </div>
            <div class="scp-card-progress-187">
              <div class="scp-progress-bar-187" :style="{ width: card.progress + '%' }"></div>
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

const componentRoot = ref<HTMLElement>()
const pulseCenter = ref<HTMLElement>()
const dataStream = ref<HTMLElement>()
const ringRefs = ref<Record<number, HTMLElement>>({})
const cardRefs = ref<HTMLElement[]>([])

interface CyberCard {
  id: string
  title: string
  value: string
  progress: number
  status: string
}

const cyberCards: CyberCard[] = [
  { id: '01', title: 'NETWORK', value: '98.5%', progress: 98, status: 'active' },
  { id: '02', title: 'SYSTEM', value: '99.2%', progress: 99, status: 'active' },
  { id: '03', title: 'SECURITY', value: '97.8%', progress: 97, status: 'warning' },
  { id: '04', title: 'DATABASE', value: '96.5%', progress: 96, status: 'active' }
]

let ctx: gsap.Context
let dataStreamInterval: number | null = null

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return

    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.scp-title-187', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.scp-subtitle-187', componentRoot.value)
      const pulseRings = gsap.utils.toArray<HTMLElement>('.scp-pulse-ring-187', componentRoot.value)
      const dataBits = gsap.utils.toArray<HTMLElement>('.scp-data-bit-187', componentRoot.value)
      const cyberCards = gsap.utils.toArray<HTMLElement>('.scp-cyber-card-187', componentRoot.value)
      const cardProgressBars = gsap.utils.toArray<HTMLElement>('.scp-progress-bar-187', componentRoot.value)
      const gridLinesH = gsap.utils.toArray<HTMLElement>('.scp-line-h-187', componentRoot.value)
      const gridLinesV = gsap.utils.toArray<HTMLElement>('.scp-line-v-187', componentRoot.value)

      // 标题故障动画
      if (titleEl.length) {
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 80,
          opacity: 0,
          filter: 'blur(20px)',
          duration: 1.2,
          ease: 'power3.out'
        })

        // 标题持续故障效果
        const createGlitch = () => {
          const skewX = (Math.random() - 0.5) * 8
          const x = (Math.random() - 0.5) * 3

          gsap.to(titleEl, {
            skewX,
            x,
            duration: 0.05,
            ease: 'none'
          }).then(() => {
            gsap.to(titleEl, {
              skewX: 0,
              x: 0,
              duration: 0.1,
              ease: 'power2.out'
            })
          })
        }

        dataStreamInterval = window.setInterval(createGlitch, 3000 + Math.random() * 2000)
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

      // 网格线动画
      if (gridLinesH.length) {
        gsap.from(gridLinesH, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scaleX: 0,
          opacity: 0,
          duration: 1,
          stagger: {
            each: 0.05,
            from: 'random'
          },
          ease: 'power2.inOut'
        })
      }

      if (gridLinesV.length) {
        gsap.from(gridLinesV, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scaleY: 0,
          opacity: 0,
          duration: 1,
          stagger: {
            each: 0.05,
            from: 'random'
          },
          ease: 'power2.inOut'
        })
      }

      // 脉冲环动画
      if (pulseRings.length) {
        gsap.from(pulseRings, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          strokeWidth: 10,
          duration: 1,
          stagger: 0.15,
          ease: 'back.out(1.7)'
        })

        // 滚动控制脉冲 - 使用scrub
        const pulseTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 0.5
          }
        })

        pulseRings.forEach((ring: HTMLElement, index: number) => {
          pulseTimeline.to(ring, {
            scale: 1 + index * 0.2,
            opacity: 0.8,
            rotation: 360,
            ease: 'none'
          }, 0)
        })

        // 持续脉冲效果
        pulseRings.forEach((ring: HTMLElement, index: number) => {
          gsap.to(ring, {
            scale: (1 + index * 0.2) * 0.9,
            opacity: 0.4,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.2
          })
        })
      }

      // 数据流动画
      if (dataBits.length) {
        gsap.from(dataBits, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          scale: 0,
          duration: 0.8,
          stagger: {
            each: 0.03,
            from: 'random'
          },
          ease: 'back.out(1.5)'
        })

        // 数据流持续动画
        dataBits.forEach((bit: HTMLElement, index: number) => {
          gsap.to(bit, {
            opacity: 0.3 + Math.random() * 0.7,
            scale: 0.5 + Math.random() * 1,
            duration: 0.5 + Math.random() * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            delay: index * 0.02
          })
        })
      }

      // 赛博卡片动画
      if (cyberCards.length) {
        gsap.from(cyberCards, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          y: 80,
          opacity: 0,
          scale: 0.9,
          duration: 0.8,
          stagger: 0.15,
          delay: 0.6,
          ease: 'back.out(1.7)'
        })

        // 卡片进度条动画
        if (cardProgressBars.length) {
          cardProgressBars.forEach((bar: HTMLElement, index: number) => {
            gsap.from(bar, {
              scrollTrigger: {
                trigger: cyberCards[index] || componentRoot.value,
                start: 'top 60%',
                toggleActions: 'play none none reverse'
              },
              width: '0%',
              duration: 1.5,
              delay: 1 + index * 0.2,
              ease: 'power2.out'
            })
          })
        }

        // 卡片悬停效果
        cyberCards.forEach((card: HTMLElement) => {
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              scale: 1.05,
              borderColor: '#06b6d4',
              boxShadow: '0 20px 60px rgba(6, 182, 212, 0.3)',
              duration: 0.3,
              ease: 'power2.out'
            })

            gsap.to(card.querySelector('.scp-card-title-187'), {
              color: '#06b6d4',
              duration: 0.3
            })
          })

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              scale: 1,
              borderColor: 'rgba(6, 182, 212, 0.3)',
              boxShadow: '0 10px 30px rgba(6, 182, 212, 0.2)',
              duration: 0.3,
              ease: 'power2.out'
            })

            gsap.to(card.querySelector('.scp-card-title-187'), {
              color: '#fff',
              duration: 0.3
            })
          })
        })
      }
    }, componentRoot.value)
  }, 100)
})

onUnmounted(() => {
  ctx?.revert()
  if (dataStreamInterval) {
    clearInterval(dataStreamInterval)
  }
})
</script>

<style scoped lang="scss">
.scp-cyber-pulse-section-187 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(135deg, #0a0a0a 0%, #0a1a1a 50%, #0a0a0a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.scp-container-187 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;

  opacity: 1 !important;}

.scp-title-187 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #06b6d4, #10b981, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 80px rgba(6, 182, 212, 0.5);

  opacity: 1 !important;}

.scp-subtitle-187 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(6, 182, 212, 0.6);
  margin-bottom: 100px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  font-family: 'Courier New', monospace;

  opacity: 1 !important;}

.scp-pulse-stage-187 {
  position: relative;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 80px;

  opacity: 1 !important;}

.scp-grid-lines-187 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;

  opacity: 1 !important;}

.scp-line-h-187 {
  position: absolute;
  width: 100%;
  height: 1px;
  background: rgba(6, 182, 212, 0.1);
  left: 0;

  opacity: 1 !important;}

.scp-line-h-187:nth-child(n) { top: 5%; }
.scp-line-h-187:nth-child(n+2) { top: 10%; }
.scp-line-h-187:nth-child(n+3) { top: 15%; }
.scp-line-h-187:nth-child(n+4) { top: 20%; }
.scp-line-h-187:nth-child(n+5) { top: 25%; }
.scp-line-h-187:nth-child(n+6) { top: 30%; }
.scp-line-h-187:nth-child(n+7) { top: 35%; }
.scp-line-h-187:nth-child(n+8) { top: 40%; }
.scp-line-h-187:nth-child(n+9) { top: 45%; }
.scp-line-h-187:nth-child(n+10) { top: 50%; }
.scp-line-h-187:nth-child(n+11) { top: 55%; }
.scp-line-h-187:nth-child(n+12) { top: 60%; }
.scp-line-h-187:nth-child(n+13) { top: 65%; }
.scp-line-h-187:nth-child(n+14) { top: 70%; }
.scp-line-h-187:nth-child(n+15) { top: 75%; }
.scp-line-h-187:nth-child(n+16) { top: 80%; }
.scp-line-h-187:nth-child(n+17) { top: 85%; }
.scp-line-h-187:nth-child(n+18) { top: 90%; }
.scp-line-h-187:nth-child(n+19) { top: 95%; }

.scp-line-v-187 {
  position: absolute;
  width: 1px;
  height: 100%;
  background: rgba(6, 182, 212, 0.1);
  top: 0;

  opacity: 1 !important;}

.scp-line-v-187:nth-child(20n+1) { left: 5%; }
.scp-line-v-187:nth-child(20n+2) { left: 10%; }
.scp-line-v-187:nth-child(20n+3) { left: 15%; }
.scp-line-v-187:nth-child(20n+4) { left: 20%; }
.scp-line-v-187:nth-child(20n+5) { left: 25%; }
.scp-line-v-187:nth-child(20n+6) { left: 30%; }
.scp-line-v-187:nth-child(20n+7) { left: 35%; }
.scp-line-v-187:nth-child(20n+8) { left: 40%; }
.scp-line-v-187:nth-child(20n+9) { left: 45%; }
.scp-line-v-187:nth-child(20n+10) { left: 50%; }
.scp-line-v-187:nth-child(20n+11) { left: 55%; }
.scp-line-v-187:nth-child(20n+12) { left: 60%; }
.scp-line-v-187:nth-child(20n+13) { left: 65%; }
.scp-line-v-187:nth-child(20n+14) { left: 70%; }
.scp-line-v-187:nth-child(20n+15) { left: 75%; }
.scp-line-v-187:nth-child(20n+16) { left: 80%; }
.scp-line-v-187:nth-child(20n+17) { left: 85%; }
.scp-line-v-187:nth-child(20n+18) { left: 90%; }
.scp-line-v-187:nth-child(20n+19) { left: 95%; }

.scp-pulse-center-187 {
  position: relative;
  width: 400px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.scp-pulse-core-187 {
  position: absolute;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, #06b6d4 0%, #10b981 100%);
  border-radius: 50%;
  box-shadow:
    0 0 60px rgba(6, 182, 212, 0.8),
    0 0 120px rgba(16, 185, 129, 0.5);
  z-index: 10;
  animation: core-pulse 2s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes core-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.scp-pulse-rings-187 {
  position: absolute;
  width: 100%;
  height: 100%;

  opacity: 1 !important;}

.scp-pulse-ring-187 {
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(6, 182, 212, 0.5);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
  transform: translate(-50%, -50%);

  opacity: 1 !important;}

.scp-pulse-ring-187:nth-child(1) { width: 120px; height: 120px; }
.scp-pulse-ring-187:nth-child(2) { width: 180px; height: 180px; }
.scp-pulse-ring-187:nth-child(3) { width: 240px; height: 240px; }
.scp-pulse-ring-187:nth-child(4) { width: 300px; height: 300px; }
.scp-pulse-ring-187:nth-child(5) { width: 360px; height: 360px; }
.scp-pulse-ring-187:nth-child(6) { width: 400px; height: 400px; }

.scp-data-stream-187 {
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 5px;
  pointer-events: none;
  z-index: 5;

  opacity: 1 !important;}

.scp-data-bit-187 {
  width: 4px;
  height: 4px;
  background: #06b6d4;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);

  opacity: 1 !important;}

.scp-cyber-cards-187 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  width: 100%;
  max-width: 1200px;
  z-index: 10;

  opacity: 1 !important;}

.scp-cyber-card-187 {
  background: rgba(6, 182, 212, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 15px;
  padding: 25px;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.scp-card-header-187 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.scp-card-id-187 {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: rgba(6, 182, 212, 0.7);
  text-transform: uppercase;

  opacity: 1 !important;}

.scp-card-status-187 {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 10px #10b981;

  opacity: 1 !important;}

.scp-card-status-187.warning {
  background: #f59e0b;
  box-shadow: 0 0 10px #f59e0b;

  opacity: 1 !important;}

.scp-card-body-187 {
  margin-bottom: 20px;
}

.scp-card-title-187 {
  font-size: 0.9rem;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 10px;
  transition: color 0.3s ease;

  opacity: 1 !important;}

.scp-card-value-187 {
  font-size: 2rem;
  font-weight: 900;
  color: #06b6d4;
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 20px rgba(6, 182, 212, 0.5);

  opacity: 1 !important;}

.scp-card-progress-187 {
  width: 100%;
  height: 4px;
  background: rgba(6, 182, 212, 0.2);
  border-radius: 2px;
  overflow: hidden;

  opacity: 1 !important;}

.scp-progress-bar-187 {
  height: 100%;
  background: linear-gradient(90deg, #06b6d4, #10b981);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
  transition: width 0.3s ease;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .scp-pulse-center-187 {
    width: 300px;
    height: 300px;
  
  opacity: 1 !important;}

  .scp-pulse-core-187 {
    width: 60px;
    height: 60px;
  
  opacity: 1 !important;}

  .scp-cyber-cards-187 {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .scp-card-value-187 {
    font-size: 1.5rem;
  
  opacity: 1 !important;}
}
</style>
