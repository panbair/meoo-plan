<template>
  <div class="cube-180" ref="componentRoot">
    <div class="cb-container-180">
      <h2 class="cb-title-180">🎲 3D立方</h2>
      <p class="cb-desc-180">滚动触发3D立方旋转</p>
      
      <div class="cb-stage-180">
        <div class="cb-cube-180">
          <div class="cb-face-180 cb-front-180">
            <div class="cb-face-content-180">前面</div>
          </div>
          <div class="cb-face-180 cb-back-180">
            <div class="cb-face-content-180">后面</div>
          </div>
          <div class="cb-face-180 cb-right-180">
            <div class="cb-face-content-180">右面</div>
          </div>
          <div class="cb-face-180 cb-left-180">
            <div class="cb-face-content-180">左面</div>
          </div>
          <div class="cb-face-180 cb-top-180">
            <div class="cb-face-content-180">顶面</div>
          </div>
          <div class="cb-face-180 cb-bottom-180">
            <div class="cb-face-content-180">底面</div>
          </div>
        </div>
        
        <div class="cb-particles-180">
          <div 
            v-for="(_, index) in 20" 
            :key="index"
            class="cb-particle-180"
          ></div>
        </div>
      </div>
      
      <div class="cb-hint-180">滚动触发3D旋转</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()

let ctx: any = null
let mouseX = 0
let mouseY = 0

const handleMouseMove = (e: MouseEvent) => {
  const stage = document.querySelector('.cb-stage-180') as HTMLElement
  if (!stage) return

  const rect = stage.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  mouseX = (e.clientX - centerX) / 20
  mouseY = (e.clientY - centerY) / 20

  gsap.to('.cb-cube-180', {
    rotateX: -20 - mouseY,
    rotateY: -30 + mouseX,
    duration: 0.5,
    ease: 'power2.out'
  })
}

const handleMouseLeave = () => {
  gsap.to('.cb-cube-180', {
    rotateX: -20,
    rotateY: -30,
    duration: 0.8,
    ease: 'power2.out'
  })
}

onMounted(() => {
  const stage = document.querySelector('.cb-stage-180')
  if (stage) {
    stage.addEventListener('mousemove', handleMouseMove)
    stage.addEventListener('mouseleave', handleMouseLeave)
  }

  ctx = gsap.context(() => {
    // 初始状态 - 保持CSS的默认transform
    gsap.set('.cb-cube-180', {
      scale: 0.6,
      opacity: 0
    })

    gsap.set('.cb-particle-180', {
      scale: 0,
      opacity: 0
    })

    // 立方体旋转动画
    gsap.to('.cb-cube-180', {
      scrollTrigger: {
        trigger: '.cb-stage-180',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      rotateX: -30,
      rotateY: 360,
      scale: 1,
      opacity: 1,
      ease: 'none'
    })

    // 添加自动持续旋转
    gsap.to('.cb-cube-180', {
      rotateY: '+=360',
      rotateX: '+=30',
      duration: 20,
      repeat: -1,
      ease: 'none'
    })

    // 粒子动画
    gsap.utils.toArray<HTMLElement>('.cb-particle-180').forEach((particle, index) => {
      const randomX = (Math.random() - 0.5) * 400
      const randomY = (Math.random() - 0.5) * 400
      const randomZ = (Math.random() - 0.5) * 400
      const delay = index * 0.05

      gsap.to(particle, {
        scrollTrigger: {
          trigger: '.cb-stage-180',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        scale: 1,
        opacity: 0.8,
        x: randomX,
        y: randomY,
        z: randomZ,
        rotation: Math.random() * 360,
        ease: 'none'
      })

      // 持续浮动
      gsap.to(particle, {
        y: '+=20',
        duration: 2 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay + 2
      })
    })

    // 标题动画
    gsap.from('.cb-title-180', {
      scrollTrigger: {
        trigger: '.cb-container-180',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })

    // 描述动画
    gsap.from('.cb-desc-180', {
      scrollTrigger: {
        trigger: '.cb-container-180',
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
    gsap.from('.cb-hint-180', {
      scrollTrigger: {
        trigger: '.cb-stage-180',
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
  const stage = document.querySelector('.cb-stage-180')
  if (stage) {
    stage.removeEventListener('mousemove', handleMouseMove)
    stage.removeEventListener('mouseleave', handleMouseLeave)
  }
  if (ctx) ctx.revert()
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.cb-container-180 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  opacity: 1 !important;}

.cb-title-180 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: #fff;
  margin-bottom: 10px;
  text-align: center;
  background: linear-gradient(90deg, #00d2ff, #3a7bd5, #00d2ff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;

  opacity: 1 !important;}

@keyframes shimmer {
  to { background-position: 200% center; }
}

.cb-desc-180 {
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
  text-align: center;

  opacity: 1 !important;}

.cb-stage-180 {
  width: 100%;
  max-width: 600px;
  height: 600px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 2000px;

  opacity: 1 !important;}

.cb-cube-180 {
  position: relative;
  width: 200px;
  height: 200px;
  transform-style: preserve-3d;
  will-change: transform, opacity;
  transform: rotateX(-20deg) rotateY(-30deg);
  transition: transform 0.3s ease;

  opacity: 1 !important;}

.cb-stage-180:hover .cb-cube-180 {
  transform: rotateX(-20deg) rotateY(-30deg) scale(1.1);
}

.cb-face-180 {
  position: absolute;
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  font-size: 1.5rem;
  color: #fff;
  box-shadow:
    inset 0 0 30px rgba(255, 255, 255, 0.15),
    0 0 20px rgba(0, 210, 255, 0.3),
    0 0 40px rgba(0, 210, 255, 0.1);
  backface-visibility: visible;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.cb-face-180:hover {
  background: rgba(255, 255, 255, 0.25);
  box-shadow:
    inset 0 0 50px rgba(255, 255, 255, 0.2),
    0 0 30px rgba(0, 210, 255, 0.5),
    0 0 60px rgba(0, 210, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.9);
}

.cb-front-180 {
  transform: translateZ(100px);
  background: linear-gradient(135deg, rgba(0, 210, 255, 0.3), rgba(58, 123, 213, 0.3));

  opacity: 1 !important;}

.cb-back-180 {
  transform: rotateY(180deg) translateZ(100px);
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.3), rgba(231, 76, 60, 0.3));

  opacity: 1 !important;}

.cb-right-180 {
  transform: rotateY(90deg) translateZ(100px);
  background: linear-gradient(135deg, rgba(0, 255, 136, 0.3), rgba(0, 200, 83, 0.3));

  opacity: 1 !important;}

.cb-left-180 {
  transform: rotateY(-90deg) translateZ(100px);
  background: linear-gradient(135deg, rgba(254, 202, 87, 0.3), rgba(255, 152, 0, 0.3));

  opacity: 1 !important;}

.cb-top-180 {
  transform: rotateX(90deg) translateZ(100px);
  background: linear-gradient(135deg, rgba(156, 39, 176, 0.3), rgba(123, 31, 162, 0.3));

  opacity: 1 !important;}

.cb-bottom-180 {
  transform: rotateX(-90deg) translateZ(100px);
  background: linear-gradient(135deg, rgba(255, 64, 129, 0.3), rgba(236, 64, 122, 0.3));

  opacity: 1 !important;}

.cb-face-content-180 {
  font-size: 2rem;
  font-weight: bold;
  text-shadow:
    0 2px 10px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(0, 210, 255, 0.5);
  letter-spacing: 2px;
  user-select: none;

  opacity: 1 !important;}

.cb-particles-180 {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;

  opacity: 1 !important;}

.cb-particle-180 {
  position: absolute;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, #00d2ff, transparent);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  will-change: transform, opacity;

  opacity: 1 !important;}

.cb-hint-180 {
  margin-top: 30px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .cb-stage-180 {
    height: 500px;
  
  opacity: 1 !important;}
  
  .cb-cube-180 {
    width: 150px;
    height: 150px;
  
  opacity: 1 !important;}
  
  .cb-face-180 {
    width: 150px;
    height: 150px;
  
  opacity: 1 !important;}
  
  .cb-front-180 {
    transform: translateZ(75px);
  }
  
  .cb-back-180 {
    transform: rotateY(180deg) translateZ(75px);
  }
  
  .cb-right-180 {
    transform: rotateY(90deg) translateZ(75px);
  }
  
  .cb-left-180 {
    transform: rotateY(-90deg) translateZ(75px);
  }
  
  .cb-top-180 {
    transform: rotateX(90deg) translateZ(75px);
  }
  
  .cb-bottom-180 {
    transform: rotateX(-90deg) translateZ(75px);
  }
  
  .cb-face-content-180 {
    font-size: 1.5rem;
  
  opacity: 1 !important;}
}
</style>
