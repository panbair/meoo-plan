<template>
  <div class="holo-cards-container-198">
    <div class="hc-header-198">
      <h2 class="hc-title-198">全息卡片</h2>
      <p class="hc-hint-198">滚动触发光栅全息效果</p>
    </div>

    <div class="hc-stage-198">
      <div v-for="(card, index) in cards" :key="index" class="hc-card-wrapper-198">
        <div class="hc-card-198" :class="`hc-card-${index}-198`">
          <div class="hc-hologram-198" :class="`hc-hologram-${index}-198`">
            <div class="hc-scan-lines-198"></div>
            <div class="hc-content-198">
              <div class="hc-icon-198">{{ card.icon }}</div>
              <h3 class="hc-card-title-198">{{ card.title }}</h3>
              <p class="hc-card-desc-198">{{ card.desc }}</p>
            </div>
          </div>
          <div class="hc-base-198">
            <div class="hc-base-ring-198"></div>
            <div class="hc-base-glow-198"></div>
          </div>
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

const cards = [
  { icon: '🔷', title: '数据核心', desc: '信息存储中心' },
  { icon: '⚡', title: '能量模块', desc: '动力输出系统' },
  { icon: '🔮', title: '预测引擎', desc: '未来分析系统' },
  { icon: '🌐', title: '网络节点', desc: '互联通信系统' },
  { icon: '🛡️', title: '防御矩阵', desc: '安全防护系统' },
  { icon: '🚀', title: '推进装置', desc: '空间移动系统' }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 扫描线动画
    gsap.utils.toArray('.hc-scan-lines-198').forEach((scan: any) => {
      gsap.to(scan, {
        backgroundPosition: '0 200%',
        duration: 2,
        repeat: -1,
        ease: 'linear'
      })
    })

    // 基底环旋转
    gsap.utils.toArray('.hc-base-ring-198').forEach((ring: any) => {
      gsap.to(ring, {
        rotation: 360,
        duration: 10,
        repeat: -1,
        ease: 'none'
      })
    })

    // 基底发光
    gsap.utils.toArray('.hc-base-glow-198').forEach((glow: any) => {
      gsap.to(glow, {
        opacity: 0.8,
        scale: 1.2,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      })
    })

    // 全息效果动画
    gsap.utils.toArray('[class*="hc-hologram-198"]').forEach((hologram: any) => {
      gsap.fromTo(
        hologram,
        { transform: 'translateZ(0) scale(0.8)', opacity: 0 },
        {
          scrollTrigger: {
            trigger: hologram.closest('.hc-card-wrapper-198'),
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1
          },
          transform: 'translateZ(50px) scale(1)',
          opacity: 1,
          duration: 1
        }
      )
    })

    // 卡片入场动画
    gsap.from('.hc-card-198', {
      scrollTrigger: {
        trigger: '.hc-stage-198',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      },
      y: 120,
      opacity: 0,
      scale: 0.7,
      stagger: 0.15
    })

    // 3D倾斜效果
    gsap.utils.toArray('.hc-card-wrapper-198').forEach((wrapper: any) => {
      const card = wrapper.querySelector('.hc-card-198')
      const hologram = wrapper.querySelector('.hc-hologram-198')

      wrapper.addEventListener('mousemove', (e: any) => {
        const rect = wrapper.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2

        gsap.to(card, {
          rotationY: x * 0.1,
          rotationX: -y * 0.1,
          duration: 0.5,
          ease: 'power2.out'
        })

        gsap.to(hologram, {
          transform: `translateZ(${50 + y * 0.2}px) scale(${1 + x * 0.001})`,
          duration: 0.5,
          ease: 'power2.out'
        })
      })

      wrapper.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.5,
          ease: 'power2.out'
        })

        gsap.to(hologram, {
          transform: 'translateZ(50px) scale(1)',
          duration: 0.5,
          ease: 'power2.out'
        })
      })
    })

    // 标题动画
    gsap.from('.hc-title-198', {
      scrollTrigger: {
        trigger: '.hc-header-198',
        start: 'top 80%'
      },
      y: 50,
      opacity: 0,
      duration: 1
    })
  })
})

onUnmounted(() => {
  ctx.revert()
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.holo-cards-container-198 {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a15 0%, #0a1520 100%);
  padding: 60px 20px;
  position: relative;
  overflow: hidden;
  perspective: 2000px;

  opacity: 1 !important;}

.hc-header-198 {
  text-align: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.hc-title-198 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #00ffff, #00a0ff, #0040ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(0, 160, 255, 0.5);
  margin-bottom: 10px;

  opacity: 1 !important;}

.hc-hint-198 {
  font-size: 18px;
  color: #00a0ff;

  opacity: 1 !important;}

.hc-stage-198 {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 50px;
  padding: 20px;

  opacity: 1 !important;}

.hc-card-wrapper-198 {
  height: 400px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1 !important;}

.hc-card-198 {
  position: relative;
  width: 300px;
  height: 380px;
  transform-style: preserve-3d;
  transition: box-shadow 0.5s ease;

  opacity: 1 !important;}

.hc-card-198:hover {
  box-shadow: 0 0 50px rgba(0, 160, 255, 0.4);
}

.hc-hologram-198 {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(0, 160, 255, 0.2));
  border: 1px solid rgba(0, 255, 255, 0.4);
  border-radius: 15px;
  backdrop-filter: blur(5px);
  transform: translateZ(50px);
  overflow: hidden;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.hc-scan-lines-198 {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 255, 0.03) 2px,
    rgba(0, 255, 255, 0.03) 4px
  );
  background-size: 100% 200%;
  pointer-events: none;
  z-index: 2;

  opacity: 1 !important;}

.hc-hologram-198::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    transparent 40%,
    rgba(0, 255, 255, 0.2) 50%,
    transparent 60%
  );
  animation: hologram-sweep-198 3s infinite;
  pointer-events: none;
  z-index: 3;
}

@keyframes hologram-sweep-198 {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.hc-content-198 {
  position: relative;
  z-index: 1;
  padding: 40px 30px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transform: translateZ(25px);

  opacity: 1 !important;}

.hc-icon-198 {
  font-size: 72px;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.8));

  opacity: 1 !important;}

.hc-card-title-198 {
  font-size: 26px;
  font-weight: 600;
  color: #00ffff;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);

  opacity: 1 !important;}

.hc-card-desc-198 {
  font-size: 14px;
  color: #00a0ff;
  line-height: 1.6;

  opacity: 1 !important;}

.hc-base-198 {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%) translateZ(-50px);
  width: 280px;
  height: 60px;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.hc-base-ring-198 {
  position: absolute;
  inset: 0;
  border: 2px solid rgba(0, 255, 255, 0.3);
  border-radius: 50%;
  animation: base-ring-rotate-198 10s linear infinite;

  opacity: 1 !important;}

@keyframes base-ring-rotate-198 {
  from { transform: rotateX(60deg); }
  to { transform: rotateX(60deg) rotate(360deg); }
}

.hc-base-glow-198 {
  position: absolute;
  inset: 10px;
  background: radial-gradient(ellipse, rgba(0, 255, 255, 0.3), transparent);
  border-radius: 50%;
  opacity: 0.4;
  transform: rotateX(60deg);
}

@media (max-width: 1024px) {
  .hc-stage-198 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .hc-stage-198 {
    grid-template-columns: 1fr;
  }

  .hc-card-198 {
    width: 260px;
    height: 340px;
  
  opacity: 1 !important;}
}
</style>
