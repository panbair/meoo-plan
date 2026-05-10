<template>
  <div class="sh-section-113">
    <div class="sh-header-113">
      <h2 class="sh-title-113">全息投影效果</h2>
      <p class="sh-desc-113">未来感的3D全息显示动画</p>
    </div>
    <div class="sh-container-113">
      <div class="sh-hologram-113" v-for="(item, index) in items" :key="index">
        <div class="sh-projector-113"></div>
        <div class="sh-base-113"></div>
        <div class="sh-display-113">
          <div class="sh-content-113">
            <div class="sh-icon-113">{{ item.icon }}</div>
            <h3 class="sh-text-113">{{ item.title }}</h3>
          </div>
          <div class="sh-grid-113">
            <div class="sh-grid-line-113" v-for="n in 8" :key="n"></div>
          </div>
        </div>
        <div class="sh-particles-113">
          <div class="sh-particle-113" v-for="n in 12" :key="n"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

ScrollTrigger.config({
  ignoreMobileResize: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
})

const items = [
  { icon: '🌐', title: '数据可视' },
  { icon: '🔮', title: '智能预测' },
  { icon: '⚡', title: '实时计算' },
  { icon: '🛡️', title: '安全防护' }
]

let ctx: gsap.Context | null = null

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.fromTo('.sh-title-113, .sh-desc-113',
      { y: 120, opacity: 0, scale: 0.7 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.sh-header-113',
          start: 'top 90%'
        }
      }
    )

    gsap.fromTo('.sh-hologram-113',
      {
        y: 300,
        opacity: 0,
        scale: 0.3,
        rotationY: -180
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotationY: 0,
        duration: 1.5,
        ease: 'back.out(2)',
        stagger: 0.25,
        scrollTrigger: {
          trigger: '.sh-container-113',
          start: 'top 85%'
        }
      }
    )

    document.querySelectorAll('.sh-hologram-113').forEach((holo) => {
      gsap.fromTo(holo.querySelector('.sh-base-113'),
        { scaleY: 0, opacity: 0 },
        {
          scaleY: 1,
          opacity: 0.5,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: holo,
            start: 'top 85%'
          }
        }
      )

      gsap.fromTo(holo.querySelector('.sh-projector-113'),
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.6,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: holo,
            start: 'top 85%'
          }
        }
      )

      gsap.fromTo(holo.querySelector('.sh-display-113'),
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'elastic.out(1, 0.5)',
          delay: 0.3,
          scrollTrigger: {
            trigger: holo,
            start: 'top 85%'
          }
        }
      )

      const particles = holo.querySelectorAll('.sh-particle-113')
      gsap.fromTo(particles,
        {
          scale: 0,
          opacity: 0,
          rotation: Math.random() * 360
        },
        {
          scale: 1,
          opacity: 0.8,
          rotation: 0,
          duration: 0.8,
          ease: 'back.out(1.5)',
          stagger: { each: 0.05, from: 'random' },
          scrollTrigger: {
            trigger: holo,
            start: 'top 85%'
          }
        }
      )

      gsap.to(particles, {
        y: (i) => -20 - Math.random() * 30,
        duration: 2 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      const gridLines = holo.querySelectorAll('.sh-grid-line-113')
      gsap.fromTo(gridLines,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.5,
          scrollTrigger: {
            trigger: holo,
            start: 'top 85%'
          }
        }
      )
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
.sh-section-113 {
  padding: 100px 20px;
  background: rgba(0, 0, 0, 0.3);
  perspective: 2000px;
  min-height: 600px;
}

.sh-header-113 {
  text-align: center;
  margin-bottom: 80px;
}

.sh-title-113 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #00f5d4 0%, #00bbf9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sh-desc-113 {
  font-size: 1.2rem;
  color: #a0aec0;
  font-weight: 300;
}

.sh-container-113 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 50px;
  max-width: 1200px;
  margin: 0 auto;
}

.sh-hologram-113 {
  position: relative;
  height: 350px;
  perspective: 1000px;
  transform-style: preserve-3d;
}

.sh-base-113 {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 20px;
  background: linear-gradient(90deg, transparent, rgba(0, 245, 212, 0.5), transparent);
  filter: blur(10px);
  transform-origin: bottom;
}

.sh-projector-113 {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 200px;
  background: linear-gradient(to top, rgba(0, 245, 212, 0.8), transparent);
  transform-origin: bottom;
}

.sh-display-113 {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  height: 200px;
  background: linear-gradient(135deg, rgba(0, 245, 212, 0.1) 0%, rgba(0, 187, 249, 0.1) 100%);
  border: 2px solid rgba(0, 245, 212, 0.4);
  border-radius: 20px;
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 245, 212, 0.3), inset 0 0 30px rgba(0, 245, 212, 0.1);
}

.sh-content-113 {
  text-align: center;
  z-index: 2;
}

.sh-icon-113 {
  font-size: 4rem;
  margin-bottom: 10px;
  filter: drop-shadow(0 0 10px rgba(0, 245, 212, 0.8));
}

.sh-text-113 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #00f5d4;
  text-shadow: 0 0 20px rgba(0, 245, 212, 0.8);
}

.sh-grid-113 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.sh-grid-line-113 {
  position: absolute;
  width: 100%;
  height: 1px;
  background: rgba(0, 245, 212, 0.3);
}

.sh-grid-line-113:nth-child(1) { top: 25%; }
.sh-grid-line-113:nth-child(2) { top: 50%; }
.sh-grid-line-113:nth-child(3) { top: 75%; }
.sh-grid-line-113:nth-child(4) { left: 33%; width: 1px; height: 100%; top: 0; }
.sh-grid-line-113:nth-child(5) { left: 66%; width: 1px; height: 100%; top: 0; }

.sh-particles-113 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.sh-particle-113 {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #00f5d4;
  border-radius: 50%;
  box-shadow: 0 0 10px #00f5d4;
}

@media (max-width: 768px) {
  .sh-container-113 {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }

  .sh-hologram-113 {
    height: 280px;
  }
}
</style>
