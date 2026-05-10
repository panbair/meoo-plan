<template>
  <div class="prism-glow-container-201">
    <div class="pg-header-201">
      <h2 class="pg-title-201">棱镜光辉</h2>
      <p class="pg-hint-201">滚动触发光谱折射效果</p>
    </div>

    <div class="pg-stage-201">
      <div v-for="(prism, index) in prisms" :key="index" class="pg-prism-wrapper-201">
        <div class="pg-prism-201" :class="`pg-prism-${index}-201`">
          <div class="pg-light-rays-201" :class="`pg-rays-${index}-201`"></div>
          <div class="pg-crystal-201" :class="`pg-crystal-${index}-201`">
            <div class="pg-crystal-face-201"></div>
            <div class="pg-crystal-content-201">
              <div class="pg-icon-201">{{ prism.icon }}</div>
              <h3 class="pg-prism-title-201">{{ prism.title }}</h3>
              <p class="pg-prism-desc-201">{{ prism.desc }}</p>
            </div>
          </div>
          <div class="pg-spectrum-201" :class="`pg-spectrum-${index}-201`"></div>
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

const prisms = [
  { icon: '🔴', title: '红光', desc: '热情与能量' },
  { icon: '🟠', title: '橙光', desc: '温暖与活力' },
  { icon: '🟡', title: '黄光', desc: '明亮与希望' },
  { icon: '🟢', title: '绿光', desc: '生命与成长' },
  { icon: '🔵', title: '蓝光', desc: '平静与智慧' },
  { icon: '🟣', title: '紫光', desc: '神秘与魔法' }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 创建光线
    const rayContainers = gsap.utils.toArray('[class*="pg-rays-201"]')
    rayContainers.forEach((container: any) => {
      for (let i = 0; i < 12; i++) {
        const ray = document.createElement('div')
        ray.className = 'pg-light-ray-201'
        const angle = (i / 12) * Math.PI * 2
        ray.style.cssText = `
          position: absolute;
          width: 150px;
          height: 2px;
          background: linear-gradient(90deg, rgba(255,255,255,0.8), transparent);
          transform-origin: left center;
          transform: rotate(${angle}rad);
          left: 50%;
          top: 50%;
          opacity: 0.1;
          box-shadow: 0 0 10px rgba(255,255,255,0.5);
        `
        container.appendChild(ray)
      }
    })

    // 等待DOM更新后添加光线动画
    setTimeout(() => {
      const lightRays = gsap.utils.toArray('.pg-light-ray-201')
      if (lightRays.length > 0) {
        lightRays.forEach((ray: any, i) => {
          gsap.to(ray, {
            scrollTrigger: {
              trigger: ray.closest('.pg-prism-wrapper-201'),
              start: 'top 70%',
              end: 'bottom 30%',
              scrub: 1
            },
            opacity: 0.8,
            scale: 1.2
          })
        })
      }
    }, 200)

    // 棱镜晶体动画
    gsap.utils.toArray('.pg-crystal-201').forEach((crystal: any, i) => {
      gsap.to(crystal, {
        scrollTrigger: {
          trigger: crystal.closest('.pg-prism-wrapper-201'),
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 1
        },
        rotationY: 180,
        rotationX: 45
      })
    })

    // 光谱扩散
    gsap.utils.toArray('[class*="pg-spectrum-201"]').forEach((spectrum: any, i) => {
      gsap.fromTo(
        spectrum,
        { scale: 0.5, opacity: 0 },
        {
          scrollTrigger: {
            trigger: spectrum.closest('.pg-prism-wrapper-201'),
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1
          },
          scale: 2,
          opacity: 0.6
        }
      )
    })

    // 棱镜入场
    gsap.from('.pg-prism-201', {
      scrollTrigger: {
        trigger: '.pg-stage-201',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      },
      y: 100,
      scale: 0.8,
      stagger: 0.15
    })

    // 悬停效果
    gsap.utils.toArray('.pg-prism-wrapper-201').forEach((wrapper: any) => {
      wrapper.addEventListener('mouseenter', () => {
        gsap.to(wrapper.querySelector('.pg-prism-201'), {
          scale: 1.1,
          rotationY: 360,
          duration: 1,
          ease: 'power2.out'
        })
      })

      wrapper.addEventListener('mouseleave', () => {
        gsap.to(wrapper.querySelector('.pg-prism-201'), {
          scale: 1,
          duration: 0.5
        })
      })
    })

    // 标题动画
    gsap.from('.pg-title-201', {
      scrollTrigger: {
        trigger: '.pg-header-201',
        start: 'top 80%'
      },
      y: 30,
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

.prism-glow-container-201 {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a0a 0%, #0a0a1a 100%);
  padding: 60px 20px;
  position: relative;
  overflow: hidden;
  perspective: 2000px;

  opacity: 1 !important;}

.pg-header-201 {
  text-align: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.pg-title-201 {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(255, 255, 255, 0.3);
  margin-bottom: 10px;

  opacity: 1 !important;}

.pg-hint-201 {
  font-size: 18px;
  color: #ffffff;

  opacity: 1 !important;}

.pg-stage-201 {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 60px;
  padding: 20px;

  opacity: 1 !important;}

.pg-prism-wrapper-201 {
  height: 400px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;

  opacity: 1 !important;}

.pg-prism-201 {
  position: relative;
  width: 260px;
  height: 360px;
  transform-style: preserve-3d;
  transition: all 0.5s ease;

  opacity: 1 !important;}

.pg-light-rays-201 {
  position: absolute;
  inset: -50px;
  pointer-events: none;
  z-index: 2;
}

.pg-crystal-201 {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
}

.pg-crystal-face-201 {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(200, 200, 255, 0.2));
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  transform: translateZ(30px);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    inset 0 0 30px rgba(255, 255, 255, 0.1);

  opacity: 1 !important;}

.pg-crystal-face-201::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    transparent 40%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 60%
  );
  animation: crystal-sweep-201 3s infinite;
}

@keyframes crystal-sweep-201 {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.pg-crystal-content-201 {
  position: relative;
  z-index: 1;
  padding: 40px 30px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transform: translateZ(50px);

  opacity: 1 !important;}

.pg-icon-201 {
  font-size: 72px;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.8));

  opacity: 1 !important;}

.pg-prism-title-201 {
  font-size: 28px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);

  opacity: 1 !important;}

.pg-prism-desc-201 {
  font-size: 14px;
  color: #e0e0e0;
  line-height: 1.6;

  opacity: 1 !important;}

.pg-spectrum-201 {
  position: absolute;
  inset: -30px;
  background: conic-gradient(
    from 0deg,
    rgba(255, 0, 0, 0.3),
    rgba(255, 127, 0, 0.3),
    rgba(255, 255, 0, 0.3),
    rgba(0, 255, 0, 0.3),
    rgba(0, 0, 255, 0.3),
    rgba(75, 0, 130, 0.3),
    rgba(148, 0, 211, 0.3),
    rgba(255, 0, 0, 0.3)
  );
  border-radius: 50%;
  filter: blur(20px);
  opacity: 0.1;
  pointer-events: none;
  z-index: 0;
}

@media (max-width: 1024px) {
  .pg-stage-201 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .pg-stage-201 {
    grid-template-columns: 1fr;
  }

  .pg-prism-201 {
    width: 220px;
    height: 320px;
  
  opacity: 1 !important;}
}
</style>
