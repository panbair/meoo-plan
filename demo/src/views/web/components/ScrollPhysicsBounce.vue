<template>
  <section class="spb-scroll-physics-bounce-224">
    <div class="spb-header-224">
      <h2 class="spb-title-224">物理弹跳动画</h2>
      <p class="spb-subtitle-224">真实物理模拟 · 重力与碰撞 · 弹簧效果</p>
    </div>

    <div class="spb-container-224">
      <!-- 物理画布区域 -->
      <div class="spb-physics-area-224">
        <div class="spb-ground-224"></div>
        
        <!-- 弹跳物体 -->
        <div
          v-for="(ball, index) in bouncingBalls"
          :key="index"
          class="spb-ball-224"
          :style="{
            left: ball.x + 'px',
            top: ball.y + 'px',
            width: ball.size + 'px',
            height: ball.size + 'px',
            backgroundColor: ball.color
          }"
          @click="dropBall(index)"
        >
          <span class="spb-ball-icon-224">{{ ball.icon }}</span>
        </div>

        <!-- 弹簧物体 -->
        <div class="spb-spring-container-224">
          <div class="spb-spring-224" ref="spring1">
            <div class="spb-spring-mass-224"></div>
            <svg class="spb-spring-coil-224" viewBox="0 0 100 200">
              <path
                d="M50,0 Q80,10 50,20 Q20,30 50,40 Q80,50 50,60 Q20,70 50,80 Q80,90 50,100 Q20,110 50,120 Q80,130 50,140 Q20,150 50,160 Q80,170 50,180 Q20,190 50,200"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                ref="springCoil"
              />
            </svg>
          </div>
          <div class="spb-spring-224" ref="spring2">
            <div class="spb-spring-mass-224"></div>
            <svg class="spb-spring-coil-224" viewBox="0 0 100 200">
              <path
                d="M50,0 Q80,10 50,20 Q20,30 50,40 Q80,50 50,60 Q20,70 50,80 Q80,90 50,100 Q20,110 50,120 Q80,130 50,140 Q20,150 50,160 Q80,170 50,180 Q20,190 50,200"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                ref="springCoil2"
              />
            </svg>
          </div>
        </div>

        <!-- 碰撞球 -->
        <div class="spb-collision-balls-224">
          <div
            v-for="(ball, index) in collisionBalls"
            :key="index"
            class="spb-collision-ball-224"
            :style="{
              left: ball.x + '%',
              top: ball.y + '%',
              width: ball.size + 'px',
              height: ball.size + 'px',
              backgroundColor: ball.color
            }"
            :ref="el => collisionRefs[index] = el"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const spring1 = ref(null)
const spring2 = ref(null)
const springCoil = ref(null)
const springCoil2 = ref(null)
const collisionRefs = ref([])

const gravityStrength = ref(1)
const bounciness = ref(0.7)
const springStiffness = ref(1.5)

let lastModeIndex = -1

// 弹跳球数据
const bouncingBalls = ref([
  { x: 50, y: 50, size: 60, color: '#ef4444', icon: '🔴' },
  { x: 150, y: 50, size: 50, color: '#f97316', icon: '🟠' },
  { x: 250, y: 50, size: 70, color: '#eab308', icon: '🟡' },
  { x: 350, y: 50, size: 55, color: '#22c55e', icon: '🟢' },
  { x: 450, y: 50, size: 65, color: '#06b6d4', icon: '🔵' },
  { x: 550, y: 50, size: 58, color: '#8b5cf6', icon: '🟣' },
  { x: 650, y: 50, size: 62, color: '#ec4899', icon: '🩷' },
  { x: 750, y: 50, size: 56, color: '#ffffff', icon: '⚪' }
])

// 碰撞球数据
const collisionBalls = ref([
  { x: 20, y: 50, size: 80, color: '#ef4444' },
  { x: 40, y: 50, size: 70, color: '#3b82f6' },
  { x: 60, y: 50, size: 90, color: '#10b981' },
  { x: 80, y: 50, size: 60, color: '#f59e0b' }
])

// 物理模式
const physicsModes = [
  { id: 'gravity', name: '重力', icon: '⬇️' },
  { id: 'spring', name: '弹簧', icon: '🌀' },
  { id: 'collision', name: '碰撞', icon: '💥' },
  { id: 'momentum', name: '动量', icon: '🚀' }
]

// 单个球弹跳
const dropBall = (index) => {
  const ball = bouncingBalls.value[index]
  const groundY = 400
  
  gsap.to(ball, {
    y: groundY,
    duration: 1.5 / Number(gravityStrength.value),
    ease: `bounce.out(${Number(bounciness.value)})`
  })
  
  gsap.delayedCall(3, () => {
    gsap.to(ball, {
      y: 50,
      duration: 0.5,
      ease: 'power2.in'
    })
  })
}

// 释放所有球
const dropAllBalls = () => {
  bouncingBalls.value.forEach((ball, index) => {
    gsap.delayedCall(index * 0.15, () => {
      dropBall(index)
    })
  })
}

// 弹簧动画
const animateSpring = () => {
  const stiffness = Number(springStiffness.value)
  
  if (spring1.value) {
    gsap.to(spring1.value, {
      y: 150,
      duration: 0.8 / stiffness,
      ease: 'elastic.out(1, 0.5)',
      yoyo: true,
      repeat: 1
    })
  }
  
  if (springCoil.value) {
    gsap.to(springCoil.value, {
      attr: { strokeDashoffset: 50 },
      duration: 0.8 / stiffness,
      ease: 'elastic.out(1, 0.5)',
      yoyo: true,
      repeat: 1
    })
  }
  
  gsap.delayedCall(0.2, () => {
    if (spring2.value) {
      gsap.to(spring2.value, {
        y: 120,
        duration: 0.7 / stiffness,
        ease: 'elastic.out(1, 0.4)',
        yoyo: true,
        repeat: 1
      })
    }
    
    if (springCoil2.value) {
      gsap.to(springCoil2.value, {
        attr: { strokeDashoffset: 40 },
        duration: 0.7 / stiffness,
        ease: 'elastic.out(1, 0.4)',
        yoyo: true,
        repeat: 1
      })
    }
  })
}

// 碰撞动画
const animateCollision = () => {
  const balls = collisionRefs.value.filter(el => el)
  if (balls.length < 2) return
  
  gsap.to(balls[0], {
    left: '35%',
    duration: 1,
    ease: 'power2.inOut',
    onComplete: () => {
      gsap.to(balls[0], {
        left: '20%',
        duration: 0.6,
        ease: 'power2.out'
      })
    }
  })
  
  gsap.to(balls[1], {
    left: '45%',
    duration: 1,
    ease: 'power2.inOut',
    delay: 0.1,
    onComplete: () => {
      gsap.to(balls[1], {
        left: '40%',
        duration: 0.6,
        ease: 'power2.out'
      })
    }
  })
  
  balls.slice(2).forEach((ball, index) => {
    gsap.to(ball, {
      scale: 0.8,
      rotation: 360,
      duration: 0.5,
      delay: 0.8 + index * 0.1,
      ease: 'elastic.out(1, 0.3)',
      yoyo: true,
      repeat: 1
    })
  })
}

// 动量守恒动画
const animateMomentum = () => {
  const balls = bouncingBalls.value
  
  balls.forEach((ball, index) => {
    gsap.fromTo(ball, 
      { x: ball.x },
      {
        x: ball.x + 100 + index * 50,
        duration: 2,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(ball, {
            x: ball.x,
            duration: 1,
            ease: 'elastic.out(1, 0.3)'
          })
        }
      }
    )
  })
}

// 初始化滚动动画
const initScrollAnimations = () => {
  // 标题动画
  gsap.from('.spb-title-224', {
    scrollTrigger: {
      trigger: '.spb-scroll-physics-bounce-224',
      start: 'top 85%',
      end: 'top 70%',
      scrub: 1
    },
    y: -80,
    opacity: 0,
    ease: 'power3.out'
  })

  gsap.from('.spb-subtitle-224', {
    scrollTrigger: {
      trigger: '.spb-scroll-physics-bounce-224',
      start: 'top 80%',
      end: 'top 65%',
      scrub: 1
    },
    y: 50,
    opacity: 0,
    ease: 'power3.out'
  })

  // 弹跳球入场动画
  gsap.from('.spb-ball-224', {
    scrollTrigger: {
      trigger: '.spb-physics-area-224',
      start: 'top 80%',
      end: 'top 60%',
      scrub: 1
    },
    y: -200,
    opacity: 0,
    stagger: 0.1,
    ease: 'back.out(1.7)'
  })

  // 弹簧入场动画
  gsap.from('.spb-spring-224', {
    scrollTrigger: {
      trigger: '.spb-physics-area-224',
      start: 'top 75%',
      end: 'top 55%',
      scrub: 1
    },
    y: -100,
    opacity: 0,
    stagger: 0.15,
    ease: 'elastic.out(1, 0.6)'
  })

  // 碰撞球入场动画
  gsap.from('.spb-collision-ball-224', {
    scrollTrigger: {
      trigger: '.spb-physics-area-224',
      start: 'top 70%',
      end: 'top 50%',
      scrub: 1
    },
    y: 100,
    opacity: 0,
    scale: 0,
    stagger: 0.1,
    ease: 'elastic.out(1, 0.5)'
  })

  // 滚动控制物理模式切换 - 第一阶段：重力模式（0-25%）
  gsap.to({}, {
    scrollTrigger: {
      trigger: '.spb-scroll-physics-bounce-224',
      start: 'top 70%',
      end: 'center center',
      scrub: 0.3,
      onUpdate: (self) => {
        const modeIndex = Math.floor(self.progress * 2)
        if (modeIndex === 0 && lastModeIndex !== 0) {
          lastModeIndex = 0
          dropAllBalls()
        }
        
        // 动态调整重力强度
        gravityStrength.value = Number((0.5 + self.progress * 0.5).toFixed(1))
        bounciness.value = Number((0.6 + self.progress * 0.2).toFixed(1))
      }
    }
  })

  // 滚动控制物理模式切换 - 第二阶段：弹簧模式（25-50%）
  gsap.to({}, {
    scrollTrigger: {
      trigger: '.spb-scroll-physics-bounce-224',
      start: 'center center',
      end: 'center 30%',
      scrub: 0.3,
      onUpdate: (self) => {
        const modeIndex = Math.floor(2 + self.progress * 2)
        if (modeIndex === 2 && lastModeIndex !== 2) {
          lastModeIndex = 2
          animateSpring()
        }
        
        // 动态调整弹簧刚度
        springStiffness.value = Number((1 + self.progress * 1.5).toFixed(1))
      }
    }
  })

  // 滚动控制物理模式切换 - 第三阶段：碰撞模式（50-75%）
  gsap.to({}, {
    scrollTrigger: {
      trigger: '.spb-scroll-physics-bounce-224',
      start: 'center 30%',
      end: 'bottom 40%',
      scrub: 0.3,
      onUpdate: (self) => {
        const modeIndex = Math.floor(4 + self.progress * 2)
        if (modeIndex === 4 && lastModeIndex !== 4) {
          lastModeIndex = 4
          animateCollision()
        }
      }
    }
  })

  // 滚动控制物理模式切换 - 第四阶段：动量模式（75-100%）
  gsap.to({}, {
    scrollTrigger: {
      trigger: '.spb-scroll-physics-bounce-224',
      start: 'bottom 40%',
      end: 'bottom 20%',
      scrub: 0.3,
      onUpdate: (self) => {
        const modeIndex = Math.floor(6 + self.progress * 2)
        if (modeIndex === 6 && lastModeIndex !== 6) {
          lastModeIndex = 6
          animateMomentum()
        }
      }
    }
  })

  // 物理区域视差效果
  gsap.to('.spb-physics-area-224', {
    scrollTrigger: {
      trigger: '.spb-scroll-physics-bounce-224',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.5
    },
    y: -100,
    ease: 'none'
  })

  // 弹跳球跟随滚动
  gsap.to('.spb-ball-224', {
    scrollTrigger: {
      trigger: '.spb-scroll-physics-bounce-224',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 0.5
    },
    y: (index) => {
      return (index % 2 === 0 ? 30 : -30) * (Math.random() * 0.5 + 0.5)
    },
    ease: 'none',
    stagger: {
      each: 0.05,
      from: 'center'
    }
  })

  // 弹簧线圈旋转动画
  gsap.to('.spb-spring-coil-224', {
    scrollTrigger: {
      trigger: '.spb-scroll-physics-bounce-224',
      start: 'top 60%',
      end: 'bottom 40%',
      scrub: 0.5
    },
    rotation: 360,
    ease: 'none'
  })

  // 地面发光效果
  gsap.to('.spb-ground-224', {
    scrollTrigger: {
      trigger: '.spb-scroll-physics-bounce-224',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 0.5
    },
    boxShadow: '0 20px 60px rgba(236, 72, 153, 0.8)',
    ease: 'none'
  })
}

onMounted(() => {
  initScrollAnimations()
  gsap.delayedCall(0.5, () => {
    dropAllBalls()
  })
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  gsap.killTweensOf('*')
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.spb-scroll-physics-bounce-224 {
  min-height: 100vh;
  padding: 60px 40px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  color: #fff;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.spb-header-224 {
  text-align: center;
  margin-bottom: 40px;

  opacity: 1 !important;}

.spb-title-224 {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ec4899, #8b5cf6, #0ea5e9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;

  opacity: 1 !important;}

.spb-subtitle-224 {
  font-size: 1.2rem;
  color: #94a3b8;

  opacity: 1 !important;}

.spb-container-224 {
  max-width: 1200px;
  margin: 0 auto;

  opacity: 1 !important;}

.spb-physics-area-224 {
  position: relative;
  height: 500px;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.1);
  margin-bottom: 30px;
  overflow: hidden;

  opacity: 1 !important;}

.spb-ground-224 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 10px;
  background: linear-gradient(90deg, #ec4899, #8b5cf6, #0ea5e9);
  border-radius: 5px;

  opacity: 1 !important;}

.spb-ball-224 {
  position: absolute;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.spb-ball-224:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
  transform: scale(1.1);
}

.spb-ball-icon-224 {
  font-size: 1.5rem;

  opacity: 1 !important;}

.spb-spring-container-224 {
  position: absolute;
  top: 50px;
  right: 50px;
  display: flex;
  gap: 30px;
}

.spb-spring-224 {
  position: relative;
  width: 100px;
  height: 250px;

  opacity: 1 !important;}

.spb-spring-mass-224 {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-radius: 50%;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.5);

  opacity: 1 !important;}

.spb-spring-coil-224 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #f59e0b;

  opacity: 1 !important;}

.spb-collision-balls-224 {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  height: 150px;

  opacity: 1 !important;}

.spb-collision-ball-224 {
  position: absolute;
  border-radius: 50%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .spb-title-224 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .spb-subtitle-224 {
    font-size: 1rem;
  
  opacity: 1 !important;}

  .spb-physics-area-224 {
    height: 400px;
  
  opacity: 1 !important;}

  .spb-spring-container-224 {
    right: 10px;
    gap: 15px;
  }
}
</style>
