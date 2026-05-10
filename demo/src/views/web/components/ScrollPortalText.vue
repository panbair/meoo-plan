<template>
  <div class="spt-portal-text-section-182" ref="componentRoot">
    <div class="spt-container-182">
      <h2 class="spt-title-182">传送门文字</h2>
      <p class="spt-subtitle-182">Portal Text</p>

      <div class="spt-text-stage-182">
        <div class="spt-portal-rings-182">
          <div class="spt-portal-ring-182" style="animation-delay: 0s;"></div>
          <div class="spt-portal-ring-182" style="animation-delay: -2s;"></div>
          <div class="spt-portal-ring-182" style="animation-delay: -4s;"></div>
          <div class="spt-portal-ring-182" style="animation-delay: -6s;"></div>
        </div>

        <div class="spt-text-container-182">
          <div
            v-for="(item, index) in portalTexts"
            :key="index"
            class="spt-text-wrapper-182"
            :ref="el => { if (el) textWrapperRefs[index] = el as HTMLElement }"
          >
            <div class="spt-portal-182" :ref="el => { if (el) portalRefs[index] = el as HTMLElement }">
              <div class="spt-portal-inner-182"></div>
              <div class="spt-portal-outer-182"></div>
              <span class="spt-text-182" :ref="el => { if (el) textRefs[index] = el as HTMLElement }">{{ item.text }}</span>
              <span class="spt-text-dim-182">{{ item.dimText }}</span>
            </div>
          </div>
        </div>

        <div class="spt-energy-stream-182" ref="energyStream">
          <div
            v-for="n in 12"
            :key="n"
            class="spt-energy-line-182"
            :ref="el => { if (el) energyLineRefs[n] = el as HTMLElement }"
          ></div>
        </div>
      </div>

      <div class="spt-starfield-182">
        <div
          v-for="n in 50"
          :key="n"
          class="spt-star-182"
          :ref="el => { if (el) starRefs[n] = el as HTMLElement }"
        ></div>
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
const textWrapperRefs = ref<HTMLElement[]>([])
const portalRefs = ref<HTMLElement[]>({})
const textRefs = ref<HTMLElement[]>({})
const energyStream = ref<HTMLElement>()
const energyLineRefs = ref<Record<number, HTMLElement>>({})
const starRefs = ref<Record<number, HTMLElement>>({})

interface PortalText {
  text: string
  dimText: string
}

const portalTexts: PortalText[] = [
  { text: 'PORTAL', dimText: '门户' },
  { text: 'COSMOS', dimText: '宇宙' },
  { text: 'DIMENSION', dimText: '维度' }
]

let ctx: gsap.Context

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return

    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.spt-title-182', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.spt-subtitle-182', componentRoot.value)
      const energyLines = gsap.utils.toArray<HTMLElement>('.spt-energy-line-182', componentRoot.value)
      const stars = gsap.utils.toArray<HTMLElement>('.spt-star-182', componentRoot.value)

      // 标题动画 - 传送门效果
      if (titleEl.length) {
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          y: 100,
          scale: 0.5,
          opacity: 0,
          filter: 'blur(30px)',
          duration: 1.5,
          ease: 'elastic.out(1, 0.5)'
        })

        gsap.to(titleEl, {
          textShadow: '0 0 40px rgba(168, 85, 247, 1), 0 0 80px rgba(168, 85, 247, 0.5)',
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
      }

      if (subtitleEl.length) {
        gsap.from(subtitleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 40,
          opacity: 0,
          letterSpacing: '2em',
          duration: 1,
          delay: 0.3,
          ease: 'power3.out'
        })
      }

      // 传送门文字动画
      textWrapperRefs.value.forEach((wrapper: HTMLElement, index: number) => {
        const portal = portalRefs.value[index]
        const text = textRefs.value[index]

        if (!portal || !text) return

        // 初始状态 - 从传送门内部出现
        gsap.set(portal, {
          scale: 0,
          opacity: 0,
          rotateX: 90,
          filter: 'blur(20px)'
        })

        gsap.set(text, {
          scale: 2,
          opacity: 0,
          filter: 'blur(10px)'
        })

        // 滚动传送门动画
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 75%',
            end: 'top 25%',
            scrub: 0.6
          }
        })

        // 第一阶段：传送门打开
        tl.to(portal, {
          scale: 1,
          opacity: 1,
          rotateX: 0,
          filter: 'blur(0px)',
          ease: 'elastic.out(1, 0.5)'
        }, 0)

        // 第二阶段：文字从传送门飞出
        tl.to(text, {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'back.out(1.7)'
        }, 0.3)

        // 第三阶段：传送门旋转
        tl.to(portal, {
          rotateY: 360,
          ease: 'none'
        }, 0)

        // 第四阶段：文字悬浮
        tl.to(text, {
          y: -20,
          textShadow: '0 0 20px rgba(168, 85, 247, 1), 0 0 40px rgba(168, 85, 247, 0.5)',
          ease: 'sine.inOut'
        }, 1)

        tl.to(text, {
          y: 0,
          textShadow: 'none',
          ease: 'sine.inOut'
        }, 2)

        // 传送门内部脉冲
        gsap.to(portal.querySelector('.spt-portal-inner-182'), {
          scale: 1.2,
          opacity: 0.8,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })

        // 传送门外环旋转
        gsap.to(portal.querySelector('.spt-portal-outer-182'), {
          rotate: 360,
          duration: 8,
          repeat: -1,
          ease: 'none'
        })
      })

      // 能量流动画
      if (energyLines.length) {
        gsap.from(energyLines, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scaleY: 0,
          opacity: 0,
          duration: 1.5,
          stagger: {
            each: 0.05,
            from: 'random'
          },
          ease: 'elastic.out(1, 0.5)'
        })

        // 能量流持续运动
        energyLines.forEach((line: HTMLElement, index: number) => {
          gsap.to(line, {
            scaleY: 0.5 + Math.random() * 1,
            opacity: 0.3 + Math.random() * 0.5,
            duration: 1 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 2
          })
        })
      }

      // 星空背景动画
      if (stars.length) {
        gsap.from(stars, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 2,
          stagger: {
            each: 0.02,
            from: 'random'
          },
          ease: 'elastic.out(1, 0.5)'
        })

        // 星星持续闪烁和漂浮
        stars.forEach((star: HTMLElement) => {
          gsap.to(star, {
            opacity: 0.3 + Math.random() * 0.7,
            scale: 0.8 + Math.random() * 0.4,
            duration: 0.5 + Math.random() * 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'none'
          })

          gsap.to(star, {
            x: (Math.random() - 0.5) * 50,
            y: (Math.random() - 0.5) * 50,
            duration: 3 + Math.random() * 4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          })
        })
      }
    }, componentRoot.value)
  }, 100)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.spt-portal-text-section-182 {
  min-height: 100vh;
  padding: 100px 20px;
  background: radial-gradient(ellipse at center, #1a0a2e 0%, #0a0a1a 50%, #000000 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.spt-container-182 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;

  opacity: 1 !important;}

.spt-title-182 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #a855f7, #c084fc, #e879f9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.spt-subtitle-182 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(168, 85, 247, 0.6);
  margin-bottom: 120px;
  letter-spacing: 0.5em;
  text-transform: uppercase;

  opacity: 1 !important;}

.spt-text-stage-182 {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 100px;
  perspective: 2000px;

  opacity: 1 !important;}

.spt-portal-rings-182 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;
}

.spt-portal-ring-182 {
  position: absolute;
  border: 2px solid rgba(168, 85, 247, 0.2);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: portalRingPulse-182 8s ease-in-out infinite;

  opacity: 1 !important;}

.spt-portal-ring-182:nth-child(1) { width: 600px; height: 600px; }
.spt-portal-ring-182:nth-child(2) { width: 500px; height: 500px; }
.spt-portal-ring-182:nth-child(3) { width: 400px; height: 400px; }
.spt-portal-ring-182:nth-child(4) { width: 300px; height: 300px; }

@keyframes portalRingPulse-182 {
  0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.05); }
}

.spt-text-container-182 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 120px;
  z-index: 1;
}

.spt-text-wrapper-182 {
  position: relative;
  width: 400px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.spt-portal-182 {
  position: relative;
  width: 300px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.spt-portal-inner-182 {
  position: absolute;
  width: 80%;
  height: 70%;
  background: radial-gradient(ellipse at center, rgba(168, 85, 247, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  filter: blur(20px);

  opacity: 1 !important;}

.spt-portal-outer-182 {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid rgba(168, 85, 247, 0.5);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 
    0 0 20px rgba(168, 85, 247, 0.5),
    inset 0 0 20px rgba(168, 85, 247, 0.3);

  opacity: 1 !important;}

.spt-text-182 {
  position: relative;
  font-size: clamp(3rem, 8vw, 4rem);
  font-weight: 900;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  z-index: 1;

  opacity: 1 !important;}

.spt-text-dim-182 {
  position: absolute;
  font-size: clamp(1rem, 3vw, 1.2rem);
  font-weight: 400;
  color: rgba(168, 85, 247, 0.5);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);

  opacity: 1 !important;}

.spt-energy-stream-182 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;

  opacity: 1 !important;}

.spt-energy-line-182 {
  position: absolute;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, rgba(168, 85, 247, 0.4), rgba(192, 132, 252, 0.4), transparent);
  filter: blur(2px);

  opacity: 1 !important;}

@for $i from 1 through 12 {
  .spt-energy-line-182:nth-child(#{$i}) {
    left: #{($i - 1) * 8 + 4}%;
  }
}

.spt-starfield-182 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  opacity: 1 !important;}

.spt-star-182 {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);

  opacity: 1 !important;}

@for $i from 1 through 50 {
  .spt-star-182:nth-child(#{$i}) {
    top: #{5 + ($i % 20) * 5}%;
    left: #{5 + ($i % 18) * 5}%;
  }
}

@media (max-width: 768px) {
  .spt-text-wrapper-182 {
    width: 300px;
    height: 180px;
  
  opacity: 1 !important;}

  .spt-portal-182 {
    width: 250px;
    height: 100px;
  
  opacity: 1 !important;}

  .spt-text-182 {
    font-size: 2.5rem;
  
  opacity: 1 !important;}

  .spt-portal-ring-182:nth-child(1) { width: 400px; height: 400px; }
  .spt-portal-ring-182:nth-child(2) { width: 350px; height: 350px; }
  .spt-portal-ring-182:nth-child(3) { width: 300px; height: 300px; }
  .spt-portal-ring-182:nth-child(4) { width: 250px; height: 250px; }
}
</style>
