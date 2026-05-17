<template>
  <div class="vortex-ring-container-200">
    <div class="vr-header-200">
      <h2 class="vr-title-200">涡旋环</h2>
      <p class="vr-hint-200">滚动触发涡旋旋转加速</p>
    </div>

    <div class="vr-stage-200">
      <div v-for="(ring, index) in rings" :key="index" class="vr-ring-wrapper-200">
        <div class="vr-ring-200" :class="`vr-ring-${index}-200`">
          <div class="vr-particles-200" :class="`vr-particles-${index}-200`"></div>
          <div class="vr-core-200"></div>
          <div class="vr-content-200">
            <div class="vr-icon-200">{{ ring.icon }}</div>
            <h3 class="vr-ring-title-200">{{ ring.title }}</h3>
            <p class="vr-ring-desc-200">{{ ring.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="vr-center-200">
      <div class="vr-vortex-200" ref="vortex">
        <div v-for="i in 20" :key="i" class="vr-vortex-line-200" :class="`vr-vortex-line-${i}-200`"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const rings = [
  { icon: '🌀', title: '外环', desc: '最外层涡旋' },
  { icon: '🔵', title: '内环', desc: '中间层涡旋' },
  { icon: '🔴', title: '核心', desc: '中心层涡旋' },
  { icon: '⭐', title: '奇点', desc: '中心点' }
]

const vortex = ref<HTMLElement | null>(null)

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 创建涡旋粒子
    const particleContainers = gsap.utils.toArray('[class*="vr-particles-200"]')
    particleContainers.forEach((container: any, containerIndex: number) => {
      for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div')
        particle.className = 'vr-particle-200'
        const angle = (i / 40) * Math.PI * 2
        const distance = 80 + Math.random() * 60
        particle.style.cssText = `
          position: absolute;
          width: ${Math.random() * 4 + 2}px;
          height: ${Math.random() * 4 + 2}px;
          background: ${getParticleColor(containerIndex)};
          border-radius: 50%;
          opacity: 0;
          left: 50%;
          top: 50%;
          box-shadow: 0 0 10px ${getParticleColor(containerIndex)};
        `
        gsap.set(particle, {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance
        })
        container.appendChild(particle)
      }
    })

    // 等待DOM更新后添加粒子旋转动画
    setTimeout(() => {
      const particles = gsap.utils.toArray('.vr-particle-200')
      if (particles.length > 0) {
        particles.forEach((particle: any, i) => {
          gsap.to(particle, {
            scrollTrigger: {
              trigger: particle.closest('.vr-ring-wrapper-200'),
              start: 'top 80%',
              end: 'bottom 20%',
              scrub: 1
            },
            rotation: 360 * 3,
            opacity: 0.8
          })
        })
      }
    }, 150)

    // 涡旋环入场
    gsap.from('.vr-ring-200', {
      scrollTrigger: {
        trigger: '.vr-stage-200',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      },
      scale: 0.8,
      y: 50,
      stagger: 0.2
    })

    // 涡旋旋转
    gsap.utils.toArray('.vr-ring-200').forEach((ring: any, i) => {
      gsap.to(ring, {
        scrollTrigger: {
          trigger: '.vr-stage-200',
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1
        },
        rotation: (4 - i) * 360,
        ease: 'none'
      })
    })

    // 中心涡旋 - 等待 DOM 更新
    setTimeout(() => {
      if (vortex.value) {
        const vortexLines = gsap.utils.toArray('.vr-vortex-line-200')
        if (vortexLines.length > 0) {
          vortexLines.forEach((line: any, i) => {
            gsap.to(line, {
              scrollTrigger: {
                trigger: '.vr-center-200',
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: 1
              },
              rotation: (i + 1) * 360,
              opacity: 0.8
            })
          })
        }

        gsap.from(vortex.value, {
          scrollTrigger: {
            trigger: '.vr-center-200',
            start: 'top 70%',
            end: 'top 60%',
            scrub: 1
          },
          scale: 0,
          rotation: -360
        })
      }
    }, 200)

    // 悬停效果
    gsap.utils.toArray('.vr-ring-wrapper-200').forEach((wrapper: any) => {
      wrapper.addEventListener('mouseenter', () => {
        gsap.to(wrapper.querySelector('.vr-ring-200'), {
          scale: 1.1,
          duration: 0.5,
          ease: 'back.out(1.7)'
        })
      })

      wrapper.addEventListener('mouseleave', () => {
        gsap.to(wrapper.querySelector('.vr-ring-200'), {
          scale: 1,
          duration: 0.3
        })
      })
    })

    // 标题动画
    gsap.from('.vr-title-200', {
      scrollTrigger: {
        trigger: '.vr-header-200',
        start: 'top 80%'
      },
      y: 50,
      opacity: 0,
      duration: 1
    })
  })
})

function getParticleColor(index: number): string {
  const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00']
  return colors[index % colors.length]
}

onUnmounted(() => {
  ctx.revert()
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.vortex-ring-container-200 {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a0a 0%, #1a0a1a 100%);
  padding: 60px 20px;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.vr-header-200 {
  text-align: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.vr-title-200 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #00ffff, #ff00ff, #ffff00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(255, 0, 255, 0.5);
  margin-bottom: 10px;

  opacity: 1 !important;}

.vr-hint-200 {
  font-size: 18px;
  color: #ff00ff;

  opacity: 1 !important;}

.vr-stage-200 {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  padding: 20px;
  margin-bottom: 100px;

  opacity: 1 !important;}

.vr-ring-wrapper-200 {
  height: 380px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1 !important;}

.vr-ring-200 {
  position: relative;
  width: 260px;
  height: 360px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 0, 255, 0.1), rgba(0, 255, 255, 0.2));
  border: 2px solid rgba(255, 0, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
  overflow: visible;

  opacity: 1 !important;}

.vr-particles-200 {
  position: absolute;
  inset: -30px;
  pointer-events: none;
}

.vr-core-200 {
  position: absolute;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent);
  border-radius: 50%;
  animation: core-pulse-200 2s infinite;

  opacity: 1 !important;}

@keyframes core-pulse-200 {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

.vr-content-200 {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 20px;

  opacity: 1 !important;}

.vr-icon-200 {
  font-size: 56px;
  margin-bottom: 15px;
  filter: drop-shadow(0 0 15px rgba(255, 0, 255, 0.8));

  opacity: 1 !important;}

.vr-ring-title-200 {
  font-size: 24px;
  font-weight: 600;
  color: #ff00ff;
  margin-bottom: 8px;
  text-shadow: 0 0 10px rgba(255, 0, 255, 0.5);

  opacity: 1 !important;}

.vr-ring-desc-200 {
  font-size: 14px;
  color: #00ffff;
  line-height: 1.5;

  opacity: 1 !important;}

.vr-center-200 {
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  opacity: 1 !important;}

.vr-vortex-200 {
  position: relative;
  width: 400px;
  height: 400px;

  opacity: 1 !important;}

.vr-vortex-line-200 {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 2px;
  height: 200px;
  background: linear-gradient(to top, transparent, rgba(255, 0, 255, 0.5), transparent);
  transform-origin: bottom center;
  opacity: 0.3;
  transition: opacity 0.3s ease;
}

@media (max-width: 1024px) {
  .vr-stage-200 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .vr-stage-200 {
    grid-template-columns: 1fr;
  }

  .vr-vortex-200 {
    width: 300px;
    height: 300px;
  
  opacity: 1 !important;}
}
</style>
