<template>
  <div class="hc-container-182">
    <h2 class="hc-title-182">全息卡片滚动动画</h2>
    <div class="hc-stage-182">
      <div class="hc-card-182" data-tilt>
        <div class="hc-hologram-182">
          <div class="hc-lines-182"></div>
          <div class="hc-glow-182"></div>
        </div>
        <div class="hc-content-182">
          <h3>全息科技</h3>
          <p>未来科技全息投影效果</p>
        </div>
      </div>
      <div class="hc-card-182" data-tilt>
        <div class="hc-hologram-182">
          <div class="hc-lines-182"></div>
          <div class="hc-glow-182"></div>
        </div>
        <div class="hc-content-182">
          <h3>数字未来</h3>
          <p>数字化时代的全息体验</p>
        </div>
      </div>
      <div class="hc-card-182" data-tilt>
        <div class="hc-hologram-182">
          <div class="hc-lines-182"></div>
          <div class="hc-glow-182"></div>
        </div>
        <div class="hc-content-182">
          <h3>虚拟现实</h3>
          <p>沉浸式虚拟世界探索</p>
        </div>
      </div>
      <div class="hc-card-182" data-tilt>
        <div class="hc-hologram-182">
          <div class="hc-lines-182"></div>
          <div class="hc-glow-182"></div>
        </div>
        <div class="hc-content-182">
          <h3>量子计算</h3>
          <p>量子时代的科技突破</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 全息扫描线动画
    gsap.utils.toArray<HTMLElement>('.hc-card-182').forEach((card, index) => {
      const lines = card.querySelector('.hc-lines-182') as HTMLElement
      const glow = card.querySelector('.hc-glow-182') as HTMLElement

      // 扫描线动画
      gsap.to(lines, {
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        backgroundPosition: '0% 200%',
        ease: 'none'
      })

      // 全息发光脉冲
      gsap.to(glow, {
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        opacity: 0.6,
        scale: 1.3,
        ease: 'none'
      })

      // 3D倾斜效果（鼠标交互）
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        const rotateX = (y / rect.height) * -20
        const rotateY = (x / rect.width) * 20

        gsap.to(card, {
          rotateX,
          rotateY,
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        })
      })

      // 卡片入场动画
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        rotateX: 45,
        duration: 1,
        ease: 'power3.out',
        delay: index * 0.15
      })

      // 悬停发光增强
      card.addEventListener('mouseenter', () => {
        gsap.to(glow, {
          opacity: 0.9,
          scale: 1.5,
          duration: 0.3
        })
        gsap.to(card.querySelector('.hc-hologram-182'), {
          borderColor: 'rgba(0, 255, 255, 0.8)',
          duration: 0.3
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(glow, {
          opacity: 0.4,
          scale: 1.2,
          duration: 0.3
        })
        gsap.to(card.querySelector('.hc-hologram-182'), {
          borderColor: 'rgba(0, 255, 255, 0.5)',
          duration: 0.3
        })
      })
    })

    // 标题动画
    gsap.from('.hc-title-182', {
      scrollTrigger: {
        trigger: '.hc-title-182',
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })
  })
})

onUnmounted(() => {
  ctx.revert()
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.hc-container-182 {
  min-height: 100vh;
  padding: 80px 20px;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.hc-container-182::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(255, 0, 255, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.hc-title-182 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 60px;
  background: linear-gradient(90deg, #00ffff, #ff00ff, #00ffff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: hc-glow-182 3s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes hc-glow-182 {
  0%, 100% { background-position: 0% center; }
  50% { background-position: 200% center; }
}

.hc-stage-182 {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 40px;
  perspective: 1000px;

  opacity: 1 !important;}

.hc-card-182 {
  position: relative;
  height: 280px;
  border-radius: 20px;
  transform-style: preserve-3d;
  will-change: transform;
  cursor: pointer;
  overflow: hidden;

  opacity: 1 !important;}

.hc-hologram-182 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid rgba(0, 255, 255, 0.5);
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(135deg, 
    rgba(0, 255, 255, 0.05) 0%, 
    rgba(255, 0, 255, 0.05) 50%,
    rgba(0, 255, 255, 0.05) 100%);
  backdrop-filter: blur(10px);
  transition: border-color 0.3s ease;

  opacity: 1 !important;}

.hc-lines-182 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200%;
  background: repeating-linear-gradient(
    0deg,
    transparent 0%,
    transparent 49%,
    rgba(0, 255, 255, 0.1) 50%,
    transparent 51%,
    transparent 100%
  );
  background-size: 100% 20px;
  background-position: 0% 0%;
  animation: hc-scan-182 2s linear infinite;

  opacity: 1 !important;}

@keyframes hc-scan-182 {
  0% { background-position: 0% 0%; }
  100% { background-position: 0% 200%; }
}

.hc-glow-182 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150%;
  height: 150%;
  background: radial-gradient(circle, rgba(0, 255, 255, 0.4) 0%, transparent 70%);
  opacity: 0.4;
  pointer-events: none;
}

.hc-content-182 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  text-align: center;
  z-index: 1;

  opacity: 1 !important;}

.hc-content-182 h3 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 15px;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  transform: translateZ(20px);
}

.hc-content-182 p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  transform: translateZ(10px);
}

@media (max-width: 768px) {
  .hc-title-182 {
    font-size: 1.8rem;
  
  opacity: 1 !important;}
  
  .hc-stage-182 {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .hc-card-182 {
    height: 240px;
  
  opacity: 1 !important;}
}
</style>
