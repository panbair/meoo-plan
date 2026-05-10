<template>
  <section ref="sectionRef" class="morph-section">
    <!-- 背景 -->
    <div class="bg-gradient"></div>

    <!-- 标题 -->
    <header ref="headerRef" class="section-header">
      <div class="header-badge">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z" stroke="currentColor" stroke-width="2"/>
          <path d="M12 22V12" stroke="currentColor" stroke-width="2"/>
          <path d="M22 8.5L12 12L2 8.5" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
      <h1 class="title">形状形变</h1>
      <p class="subtitle">Morph Shape Animation</p>
    </header>

    <!-- 卡片容器 -->
    <div class="cards-container">
      <div class="morph-card card-ellipse" data-index="0">
        <div class="card-bg"></div>
        <div class="card-content">
          <span class="card-num">01</span>
          <h3 class="card-title">椭圆变形</h3>
          <p class="card-desc">从椭圆形变为圆角矩形</p>
        </div>
      </div>

      <div class="morph-card card-diamond" data-index="1">
        <div class="card-bg"></div>
        <div class="card-content">
          <span class="card-num">02</span>
          <h3 class="card-title">菱形变形</h3>
          <p class="card-desc">从菱形变为正方形</p>
        </div>
      </div>

      <div class="morph-card card-hexagon" data-index="2">
        <div class="card-bg"></div>
        <div class="card-content">
          <span class="card-num">03</span>
          <h3 class="card-title">六边形变形</h3>
          <p class="card-desc">从六边形变为圆形</p>
        </div>
      </div>
    </div>

    <!-- 底部 -->
    <footer ref="footerRef" class="section-footer">
      <span>CardMorph</span>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
let triggers: ScrollTrigger[] = []

const initAnimations = () => {
  const cards = document.querySelectorAll('.morph-card')

  // 入场动画 - 统一 timeline
  const tl = gsap.timeline({ delay: 0.3 })

  // 标题入场
  tl.fromTo('.header-badge',
    { scale: 0, opacity: 0, rotation: -180 },
    { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)' }
  )
  .fromTo('.title',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
    '-=0.3'
  )
  .fromTo('.subtitle',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.4'
  )

  // 三个卡片依次入场
  cards.forEach((card, i) => {
    tl.fromTo(card,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' },
      `=-${0.3 - i * 0.1}`
    )
  })

  // 底部入场
  tl.fromTo(footerRef.value,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.2'
  )

  // 滚动动画 - 每个卡片独立触发
  cards.forEach((card, i) => {
    const st = ScrollTrigger.create({
      trigger: card,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress
        const dir = self.direction

        if (dir > 0) {
          // 向下滚动 - 渐隐
          gsap.set(card, {
            opacity: 1 - progress * 0.8,
            y: progress * -80,
            scale: 1 - progress * 0.15
          })
        } else {
          // 向上滚动 - 恢复
          gsap.set(card, {
            opacity: 1,
            y: 0,
            scale: 1
          })
        }
      }
    })
    triggers.push(st)
  })

  // 标题滚动消失
  if (headerRef.value) {
    const st = ScrollTrigger.create({
      trigger: headerRef.value,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        gsap.set(headerRef.value, {
          opacity: 1 - self.progress,
          y: -self.progress * 60
        })
      }
    })
    triggers.push(st)
  }
}

onMounted(() => initAnimations())

onUnmounted(() => {
  triggers.forEach(st => st.kill())
})
</script>

<style lang="scss" scoped>
.morph-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a14 0%, #1a0a1a 50%, #0a140a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 60%);
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 1;
}

.header-badge {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  
  svg { width: 32px; height: 32px; }
}

.title {
  font-size: 56px;
  font-weight: 900;
  background: linear-gradient(90deg, #a855f7, #ec4899);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 4px;
}

.cards-container {
  display: flex;
  gap: 30px;
  position: relative;
  z-index: 1;
}

.morph-card {
  position: relative;
  width: 280px;
  height: 320px;
  padding: 32px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  cursor: pointer;
  overflow: hidden;
  opacity: 1;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
}

.card-bg {
  position: absolute;
  inset: 0;
  opacity: 0.5;
}

.card-ellipse {
  .card-bg { background: linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(168, 85, 247, 0.1)); }
  .card-num { color: #a855f7; }
}

.card-diamond {
  .card-bg { background: linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(236, 72, 153, 0.1)); }
  .card-num { color: #ec4899; }
}

.card-hexagon {
  .card-bg { background: linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.1)); }
  .card-num { color: #22c55e; }
}

.card-content {
  position: relative;
  z-index: 1;
}

.card-num {
  font-size: 48px;
  font-weight: 900;
  opacity: 0.3;
  line-height: 1;
  display: block;
  margin-bottom: 12px;
}

.card-title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.card-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.section-footer {
  position: absolute;
  bottom: 40px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 3px;
}
</style>
