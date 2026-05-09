<template>
  <section ref="cubeSection" class="section-6 cube-section-6">
    <h2 class="section-title-6">3D立方体</h2>
    <div ref="cubeContainer" class="cube-container-6">
      <div class="cube-scene-6">
        <div ref="cube" class="cube-6">
          <div class="cube-face-6 front-6">前</div>
          <div class="cube-face-6 back-6">后</div>
          <div class="cube-face-6 right-6">右</div>
          <div class="cube-face-6 left-6">左</div>
          <div class="cube-face-6 top-6">上</div>
          <div class="cube-face-6 bottom-6">下</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cubeSection = ref<HTMLElement>()
const cubeContainer = ref<HTMLElement>()
const cube = ref<HTMLElement>()

onMounted(() => {
  setTimeout(() => {
    initAnimations()
  }, 100)
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  gsap.killTweensOf('*')
})

const initAnimations = () => {
  if (!cube.value) return

  // 先设置初始可见状态
  gsap.set(cube.value, {
    opacity: 1
  })

  // 标题入场动画 - 增强效果
  gsap.from('.section-title-6', {
    y: 150,
    opacity: 0,
    scale: 0.6,
    rotationX: -30,
    duration: 1.5,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: cubeSection.value,
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  })

  // 面也设置为可见
  const faces = cube.value.querySelectorAll('.cube-face-6')
  gsap.set(faces, {
    opacity: 1
  })

  // 立方体入场动画 - 从更大的角度开始，添加透明度变化
  gsap.from(cube.value, {
    rotateX: -180,
    rotateY: -180,
    scale: 0.3,
    opacity: 0,
    duration: 2,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: cubeSection.value,
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  })

  // 滚动时的旋转动画 - 从初始角度旋转
  gsap.to(cube.value, {
    rotateX: 360,
    rotateY: 360,
    duration: 5,
    ease: 'none',
    scrollTrigger: {
      trigger: cubeSection.value,
      start: 'top 60%',
      end: 'bottom 40%',
      scrub: 2
    }
  })

  // 缩放效果 - 增强范围
  gsap.fromTo(
    cube.value,
    {
      scale: 0.6
    },
    {
      scale: 1.4,
      duration: 2.5,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: cubeSection.value,
        start: 'top 50%',
        end: 'bottom 50%',
        scrub: 1.5
      }
    }
  )

  // 面的依次入场动画 - 增强效果，添加透明度和旋转
  gsap.from(faces, {
    scale: 0.2,
    opacity: 0,
    rotateX: -90,
    rotateY: -90,
    stagger: 0.12,
    duration: 1,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: cubeSection.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  })
}
</script>

<style scoped lang="scss">
.section-6 {
  min-height: 100vh;
  padding: 100px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.section-title-6 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;

  opacity: 1 !important;}

.cube-section-6 {
  background: linear-gradient(180deg, transparent, rgba(67, 233, 123, 0.15), transparent);

  opacity: 1 !important;}

.cube-container-6 {
  perspective: 1500px;
  width: 250px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  opacity: 1 !important;}

.cube-container-6::before {
  content: '';
  position: absolute;
  width: 350px;
  height: 350px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(67, 233, 123, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

.cube-scene-6 {
  width: 200px;
  height: 200px;
  position: relative;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.cube-6 {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transform: rotateX(-20deg) rotateY(-30deg);

  opacity: 1 !important;}

.cube-face-6 {
  position: absolute;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  box-shadow:
    0 0 40px rgba(255, 255, 255, 0.3),
    inset 0 0 20px rgba(255, 255, 255, 0.1);
  transition: all 0.4s ease;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  cursor: pointer;

  opacity: 1 !important;}

.cube-face-6:hover {
  box-shadow:
    0 0 60px rgba(255, 255, 255, 0.5),
    inset 0 0 30px rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.cube-6:hover .cube-face-6 {
  border-color: rgba(255, 255, 255, 0.8);

  opacity: 1 !important;}

.cube-face-6.front-6 {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.95), rgba(102, 126, 234, 0.7));
  transform: translateZ(60px);

  opacity: 1 !important;}

.cube-face-6.front-6:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 1), rgba(102, 126, 234, 0.85));
}

.cube-face-6.back-6 {
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.95), rgba(240, 147, 251, 0.7));
  transform: rotateY(180deg) translateZ(60px);

  opacity: 1 !important;}

.cube-face-6.back-6:hover {
  background: linear-gradient(135deg, rgba(240, 147, 251, 1), rgba(240, 147, 251, 0.85));
}

.cube-face-6.right-6 {
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.95), rgba(79, 172, 254, 0.7));
  transform: rotateY(90deg) translateZ(60px);

  opacity: 1 !important;}

.cube-face-6.right-6:hover {
  background: linear-gradient(135deg, rgba(79, 172, 254, 1), rgba(79, 172, 254, 0.85));
}

.cube-face-6.left-6 {
  background: linear-gradient(135deg, rgba(67, 233, 123, 0.95), rgba(67, 233, 123, 0.7));
  transform: rotateY(-90deg) translateZ(60px);

  opacity: 1 !important;}

.cube-face-6.left-6:hover {
  background: linear-gradient(135deg, rgba(67, 233, 123, 1), rgba(67, 233, 123, 0.85));
}

.cube-face-6.top-6 {
  background: linear-gradient(135deg, rgba(245, 87, 108, 0.95), rgba(245, 87, 108, 0.7));
  transform: rotateX(90deg) translateZ(60px);

  opacity: 1 !important;}

.cube-face-6.top-6:hover {
  background: linear-gradient(135deg, rgba(245, 87, 108, 1), rgba(245, 87, 108, 0.85));
}

.cube-face-6.bottom-6 {
  background: linear-gradient(135deg, rgba(253, 186, 116, 0.95), rgba(253, 186, 116, 0.7));
  transform: rotateX(-90deg) translateZ(60px);

  opacity: 1 !important;}

.cube-face-6.bottom-6:hover {
  background: linear-gradient(135deg, rgba(253, 186, 116, 1), rgba(253, 186, 116, 0.85));
}

@media (max-width: 768px) {
  .cube-container-6 {
    width: 180px;
    height: 180px;
  
  opacity: 1 !important;}

  .cube-scene-6 {
    width: 150px;
    height: 150px;
  
  opacity: 1 !important;}

  .cube-face-6 {
    width: 150px;
    height: 150px;
    font-size: 2rem;
  
  opacity: 1 !important;}

  .cube-face-6.front-6 {
    transform: translateZ(45px);
  }

  .cube-face-6.back-6 {
    transform: rotateY(180deg) translateZ(45px);
  }

  .cube-face-6.right-6 {
    transform: rotateY(90deg) translateZ(45px);
  }

  .cube-face-6.left-6 {
    transform: rotateY(-90deg) translateZ(45px);
  }

  .cube-face-6.top-6 {
    transform: rotateX(90deg) translateZ(45px);
  }

  .cube-face-6.bottom-6 {
    transform: rotateX(-90deg) translateZ(45px);
  }
}
</style>
