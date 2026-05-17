<template>
  <div class="stw-section-116">
    <div class="stw-header-116">
      <h2 class="stw-title-116">时间扭曲效果</h2>
      <p class="stw-desc-116">穿越时空的视觉体验</p>
    </div>
    <div class="stw-container-116">
      <div class="stw-portal-116">
        <div class="stw-ring-116" v-for="n in 6" :key="n"></div>
        <div class="stw-core-116">
          <div class="stw-particles-116">
            <div class="stw-particle-116" v-for="n in 24" :key="n"></div>
          </div>
          <div class="stw-content-116">
            <div class="stw-icon-116">🌀</div>
            <h3 class="stw-text-116">时间门户</h3>
          </div>
        </div>
      </div>
      <div class="stw-info-116">
        <div class="stw-info-item-116" v-for="(item, index) in infoItems" :key="index">
          <div class="stw-dot-116"></div>
          <div class="stw-info-content-116">
            <h4 class="stw-info-title-116">{{ item.title }}</h4>
            <p class="stw-info-desc-116">{{ item.desc }}</p>
          </div>
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

const infoItems = [
  { title: '维度穿越', desc: '打破空间限制' },
  { title: '时空折叠', desc: '压缩时间距离' },
  { title: '量子纠缠', desc: '瞬间信息传递' }
]

let ctx: gsap.Context | null = null

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.fromTo('.stw-title-116, .stw-desc-116',
      { y: 120, opacity: 0, scale: 0.7 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.stw-header-116',
          start: 'top 90%'
        }
      }
    )

    gsap.fromTo('.stw-portal-116',
      { y: 400, opacity: 0, scale: 0.3 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: '.stw-container-116',
          start: 'top 85%'
        }
      }
    )

    document.querySelectorAll('.stw-ring-116').forEach((ring, index) => {
      gsap.fromTo(ring,
        {
          scale: 0,
          opacity: 0,
          rotation: -180
        },
        {
          scale: 1,
          opacity: 0.8,
          rotation: 0,
          duration: 1,
          ease: 'back.out(1.5)',
          stagger: 0.15,
          scrollTrigger: {
            trigger: '.stw-container-116',
            start: 'top 85%'
          }
        }
      )

      gsap.to(ring, {
        rotation: 360,
        duration: 10 + index * 2,
        repeat: -1,
        ease: 'none'
      })
    })

    gsap.fromTo('.stw-core-116',
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
        delay: 0.6,
        scrollTrigger: {
          trigger: '.stw-container-116',
          start: 'top 85%'
        }
      }
    )

    const particles = document.querySelectorAll('.stw-particle-116')
    gsap.fromTo(particles,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: { each: 0.03, from: 'random' },
        delay: 0.8,
        scrollTrigger: {
          trigger: '.stw-container-116',
          start: 'top 85%'
        }
      }
    )

    particles.forEach((particle, index) => {
      const angle = (index / 24) * Math.PI * 2
      const radius = 80 + Math.random() * 20

      gsap.to(particle, {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        duration: 3 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    })

    gsap.fromTo('.stw-info-116 .stw-info-item-116',
      {
        x: -100,
        opacity: 0,
        skewX: -15
      },
      {
        x: 0,
        opacity: 1,
        skewX: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.stw-container-116',
          start: 'top 75%'
        }
      }
    )

    document.querySelectorAll('.stw-dot-116').forEach((dot, index) => {
      gsap.fromTo(dot,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.6,
          ease: 'back.out(2)',
          delay: 0.3 + index * 0.2,
          scrollTrigger: {
            trigger: '.stw-container-116',
            start: 'top 75%'
          }
        }
      )

      gsap.to(dot, {
        scale: 1.3,
        opacity: 0.5,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
.stw-section-116 {
  padding: 100px 20px;
  background: rgba(0, 0, 0, 0.35);
  min-height: 700px;
}

.stw-header-116 {
  text-align: center;
  margin-bottom: 80px;
}

.stw-title-116 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #9333ea 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stw-desc-116 {
  font-size: 1.2rem;
  color: #a0aec0;
  font-weight: 300;
}

.stw-container-116 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 80px;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
}

.stw-portal-116 {
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stw-ring-116 {
  position: absolute;
  border: 2px solid;
  border-radius: 50%;
  border-color: rgba(147, 51, 234, 0.6);
  filter: blur(1px);
}

.stw-ring-116:nth-child(1) { width: 100px; height: 100px; }
.stw-ring-116:nth-child(2) { width: 140px; height: 140px; border-color: rgba(6, 182, 212, 0.5); }
.stw-ring-116:nth-child(3) { width: 180px; height: 180px; border-color: rgba(147, 51, 234, 0.4); }
.stw-ring-116:nth-child(4) { width: 220px; height: 220px; border-color: rgba(6, 182, 212, 0.3); }
.stw-ring-116:nth-child(5) { width: 260px; height: 260px; border-color: rgba(147, 51, 234, 0.2); }
.stw-ring-116:nth-child(6) { width: 300px; height: 300px; border-color: rgba(6, 182, 212, 0.1); }

.stw-core-116 {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  overflow: visible;
}

.stw-particles-116 {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.stw-particle-116 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  background: #9333ea;
  border-radius: 50%;
  box-shadow: 0 0 10px #9333ea;
  transform: translate(-50%, -50%);
}

.stw-content-116 {
  text-align: center;
  z-index: 2;
}

.stw-icon-116 {
  font-size: 3rem;
  margin-bottom: 8px;
  filter: drop-shadow(0 0 20px rgba(147, 51, 234, 0.8));
}

.stw-text-116 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #9333ea;
  text-shadow: 0 0 10px rgba(147, 51, 234, 0.5);
}

.stw-info-116 {
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 350px;
}

.stw-info-item-116 {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.stw-dot-116 {
  width: 12px;
  height: 12px;
  background: #06b6d4;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
  box-shadow: 0 0 15px #06b6d4;
}

.stw-info-content-116 {
  flex: 1;
}

.stw-info-title-116 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 4px;
}

.stw-info-desc-116 {
  font-size: 1rem;
  color: #a0aec0;
}

@media (max-width: 768px) {
  .stw-container-116 {
    flex-direction: column;
    gap: 50px;
  }

  .stw-portal-116 {
    width: 250px;
    height: 250px;
  }

  .stw-ring-116:nth-child(1) { width: 80px; height: 80px; }
  .stw-ring-116:nth-child(2) { width: 120px; height: 120px; }
  .stw-ring-116:nth-child(3) { width: 160px; height: 160px; }
  .stw-ring-116:nth-child(4) { width: 200px; height: 200px; }
  .stw-ring-116:nth-child(5) { width: 240px; height: 240px; }
  .stw-ring-116:nth-child(6) { width: 280px; height: 280px; }
}
</style>
