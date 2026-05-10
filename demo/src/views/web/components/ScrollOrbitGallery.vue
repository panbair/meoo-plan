<template>
  <div class="orbit-gallery-181" ref="componentRoot">
    <div class="og-container-181">
      <h2 class="og-title-181">🪐 轨道画廊</h2>
      <p class="og-desc-181">滚动触发轨道旋转画廊</p>
      
      <div class="og-stage-181" ref="stageRef">
        <div class="og-orbit-181">
          <div 
            v-for="(item, index) in items" 
            :key="index"
            class="og-orbit-item-181"
            :style="{ 
              '--angle': (index * (360 / items.length)) + 'deg',
              '--orbit-color': item.color 
            }"
          >
            <div class="og-orbit-card-181">
              <div class="og-card-image-181">
                <img :src="item.image" :alt="item.title" />
              </div>
              <div class="og-card-info-181">
                <div class="og-card-title-181">{{ item.title }}</div>
                <div class="og-card-desc-181">{{ item.desc }}</div>
              </div>
            </div>
            <div class="og-orbit-line-181"></div>
          </div>
        </div>
        
        <div class="og-center-181">
          <div class="og-center-core-181"></div>
          <div class="og-center-ring-181"></div>
        </div>
      </div>
      
      <div class="og-hint-181">滚动触发轨道旋转</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()
const stageRef = ref<HTMLElement>()

const items = [
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    title: '山脉',
    desc: '雄伟壮观',
    color: '#ff6b6b'
  },
  {
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
    title: '森林',
    desc: '绿意盎然',
    color: '#feca57'
  },
  {
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    title: '海洋',
    desc: '深邃辽阔',
    color: '#48dbfb'
  },
  {
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400',
    title: '星空',
    desc: '璀璨无限',
    color: '#ff9ff3'
  },
  {
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400',
    title: '极光',
    desc: '绚丽多彩',
    color: '#54a0ff'
  },
  {
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400',
    title: '湖泊',
    desc: '宁静致远',
    color: '#5f27cd'
  }
]

let ctx: any = null

onMounted(() => {
  ctx = gsap.context(() => {
    // 初始状态
    gsap.set('.og-orbit-item-181', {
      scale: 0,
      opacity: 0
    })

    gsap.set('.og-center-core-181', {
      scale: 0,
      opacity: 0
    })

    // 轨道旋转动画
    gsap.to('.og-orbit-181', {
      scrollTrigger: {
        trigger: '.og-stage-181',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      rotate: 360,
      ease: 'none'
    })

    // 轨道项目依次出现
    items.forEach((_, index) => {
      const item = `.og-orbit-item-181:nth-child(${ index + 1})`

      gsap.to(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse'
        },
        scale: 1,
        opacity: 1,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'elastic.out(1, 0.6)'
      })

      // 悬停效果
      const itemEl = document.querySelector(item)
      if (itemEl) {
        itemEl.addEventListener('mouseenter', () => {
          gsap.to(itemEl, {
            scale: 1.2,
            duration: 0.3,
            ease: 'power2.out'
          })
        })

        itemEl.addEventListener('mouseleave', () => {
          gsap.to(itemEl, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          })
        })
      }
    })

    // 中心核心动画
    gsap.to('.og-center-core-181', {
      scrollTrigger: {
        trigger: '.og-stage-181',
        start: 'top center',
        end: 'bottom center',
        scrub: 1
      },
      scale: 1,
      opacity: 1,
      rotation: 360,
      ease: 'power2.inOut'
    })

    gsap.to('.og-center-ring-181', {
      scrollTrigger: {
        trigger: '.og-stage-181',
        start: 'top center',
        end: 'bottom center',
        scrub: 1
      },
      rotate: -360,
      scale: 1.2,
      ease: 'power2.inOut'
    })

    // 标题动画
    gsap.from('.og-title-181', {
      scrollTrigger: {
        trigger: '.og-container-181',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })

    // 描述动画
    gsap.from('.og-desc-181', {
      scrollTrigger: {
        trigger: '.og-container-181',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power3.out'
    })

    // 提示动画
    gsap.from('.og-hint-181', {
      scrollTrigger: {
        trigger: '.og-stage-181',
        start: 'bottom 20%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 20,
      duration: 0.6
    })
  }, componentRoot.value)
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.og-container-181 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a2a 100%);
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  opacity: 1 !important;}

.og-title-181 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: #fff;
  margin-bottom: 10px;
  text-align: center;
  background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
  background-size: 300% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;

  opacity: 1 !important;}

@keyframes shimmer {
  to { background-position: 300% center; }
}

.og-desc-181 {
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
  text-align: center;

  opacity: 1 !important;}

.og-stage-181 {
  width: 100%;
  max-width: 800px;
  height: 700px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1 !important;}

.og-orbit-181 {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  will-change: transform;

  opacity: 1 !important;}

.og-orbit-item-181 { position: absolute;
  width: 120px;
  height: 120px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-250px) rotate(calc(var(--angle) * -1));
  cursor: pointer;
  will-change: transform, opacity;
      opacity: 1;
    }

.og-orbit-card-181 { width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: box-shadow 0.3s ease;
      opacity: 1;
    }

.og-orbit-card-181:hover { box-shadow: 0 10px 30px var(--orbit-color);
      opacity: 1;
    }

.og-card-image-181 {
  width: 100%;
  height: 80px;
  overflow: hidden;

  opacity: 1 !important;}

.og-card-image-181 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.og-card-info-181 {
  padding: 8px;
  text-align: center;

  opacity: 1 !important;}

.og-card-title-181 {
  font-size: 0.9rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 4px;

  opacity: 1 !important;}

.og-card-desc-181 {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);

  opacity: 1 !important;}

.og-orbit-line-181 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 50px;
  background: linear-gradient(to bottom, var(--orbit-color), transparent);
  transform-origin: top;
  transform: translateY(-100%);

  opacity: 1 !important;}

.og-center-181 {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}

.og-center-core-181 { width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, #00d2ff, #3a7bd5);
  box-shadow: 
    0 0 40px rgba(0, 210, 255, 0.6),
    0 0 80px rgba(0, 210, 255, 0.3);
  will-change: transform, opacity;
      opacity: 1;
    }

.og-center-ring-181 {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid rgba(0, 210, 255, 0.5);
  box-shadow: 0 0 20px rgba(0, 210, 255, 0.3);
  will-change: transform;

  opacity: 1 !important;}

.og-hint-181 {
  margin-top: 30px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .og-stage-181 {
    height: 500px;
  
  opacity: 1 !important;}
  
  .og-orbit-181 {
    width: 350px;
    height: 350px;
  
  opacity: 1 !important;}
  
  .og-orbit-item-181 { width: 90px;
    height: 90px;
    transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-175px) rotate(calc(var(--angle) * -1));
      opacity: 1;
    }
  
  .og-card-image-181 {
    height: 60px;
  
  opacity: 1 !important;}
  
  .og-center-core-181 { width: 60px;
    height: 60px;
      opacity: 1;
    }
  
  .og-center-ring-181 {
    width: 90px;
    height: 90px;
  
  opacity: 1 !important;}
}
</style>
