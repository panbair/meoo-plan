<template>
  <div ref="containerRef" class="cube-matrix-container">
    <div class="cube-matrix-title">3D立方体矩阵</div>
    <div class="cube-matrix-wrapper" ref="matrixWrapper">
      <div
        v-for="(cube, index) in cubes"
        :key="index"
        :ref="el => { if (el) cubeRefs[index] = el as HTMLElement }"
        class="cube-container"
        :style="{ 
          left: cube.x + 'px', 
          top: cube.y + 'px',
          transform: `translateZ(${cube.z}px)`
        }"
      >
        <div class="cube" :class="{ active: cube.active }">
          <div class="cube-face front"></div>
          <div class="cube-face back"></div>
          <div class="cube-face right"></div>
          <div class="cube-face left"></div>
          <div class="cube-face top"></div>
          <div class="cube-face bottom"></div>
        </div>
      </div>
    </div>
    <div class="cube-matrix-controls">
      <button @click="explode" class="explode-btn">爆炸</button>
      <button @click="implode" class="implode-btn">内爆</button>
      <button @click="wave" class="wave-btn">波浪</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const containerRef = ref<HTMLElement>()
const matrixWrapper = ref<HTMLElement>()
const cubeRefs = ref<HTMLElement[]>([])

interface Cube {
  x: number
  y: number
  z: number
  active: boolean
}

const cubes = ref<Cube[]>([])
const rows = 6
const cols = 8

const initCubes = () => {
  cubes.value = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      cubes.value.push({
        x: 80 + col * 90,
        y: 80 + row * 90,
        z: 0,
        active: false
      })
    }
  }
}

const initAnimations = () => {
  // 入场动画
  cubeRefs.value.forEach((cube, index) => {
    gsap.fromTo(cube,
      {
        opacity: 0,
        scale: 0,
        rotationX: 180,
        rotationY: 180
      },
      {
        opacity: 1,
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        duration: 0.8,
        delay: index * 0.02,
        ease: 'back.out(1.5)'
      }
    )
  })

  // 持续旋转
  cubeRefs.value.forEach((cube, index) => {
    const row = Math.floor(index / cols)
    const col = index % cols

    gsap.to(cube.querySelector('.cube')!, {
      rotationX: 360,
      rotationY: 360,
      duration: 10 + row * 0.5 + col * 0.3,
      repeat: -1,
      ease: 'none'
    })
  })

  // 悬浮效果 - 使用CSS动画代替GSAP以提升性能
  cubeRefs.value.forEach((cube, index) => {
    const phase = index * 0.1
    gsap.to(cube, {
      y: cubes.value[index].y,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: phase,
      onUpdate: () => {
        const offset = Math.sin(Date.now() * 0.001 + phase) * 10
        cube.style.top = (cubes.value[index].y + offset) + 'px'
      }
    })
  })
}

const explode = () => {
  const centerX = containerRef.value!.clientWidth / 2
  const centerY = containerRef.value!.clientHeight / 2

  cubeRefs.value.forEach((cube, index) => {
    const cubeData = cubes.value[index]
    const dx = cubeData.x - centerX
    const dy = cubeData.y - centerY
    const angle = Math.atan2(dy, dx)
    const distance = 300 + Math.random() * 200

    gsap.to(cube, {
      x: cubeData.x + Math.cos(angle) * distance,
      y: cubeData.y + Math.sin(angle) * distance,
      z: 200 + Math.random() * 100,
      rotationX: Math.random() * 360,
      rotationY: Math.random() * 360,
      duration: 1.5,
      ease: 'expo.out',
      delay: index * 0.01,
      onComplete: () => {
        setTimeout(() => {
          resetCube(index)
        }, 1000 + Math.random() * 1000)
      }
    })

    cubes.value[index].active = true
  })
}

const implode = () => {
  const centerX = containerRef.value!.clientWidth / 2
  const centerY = containerRef.value!.clientHeight / 2

  cubeRefs.value.forEach((cube, index) => {
    gsap.to(cube, {
      x: centerX + (Math.random() - 0.5) * 100,
      y: centerY + (Math.random() - 0.5) * 100,
      z: -300,
      scale: 0,
      opacity: 0,
      rotationX: Math.random() * 720,
      rotationY: Math.random() * 720,
      duration: 1,
      ease: 'power4.in',
      delay: index * 0.01,
      onComplete: () => {
        resetCube(index)
      }
    })

    cubes.value[index].active = true
  })
}

const wave = () => {
  cubeRefs.value.forEach((cube, index) => {
    const row = Math.floor(index / cols)
    const col = index % cols
    const cubeData = cubes.value[index]

    gsap.to(cube, {
      z: 150 * Math.sin(col * 0.5 + row * 0.5),
      rotationX: 45 * Math.sin(col * 0.5),
      rotationY: 45 * Math.cos(row * 0.5),
      duration: 0.5,
      ease: 'power2.inOut',
      delay: (col + row) * 0.05,
      onComplete: () => {
        gsap.to(cube, {
          z: 0,
          rotationX: 0,
          rotationY: 0,
          duration: 1,
          ease: 'elastic.out(1, 0.5)'
        })
      }
    })

    cubes.value[index].active = true
  })
}

const resetCube = (index: number) => {
  const cube = cubeRefs.value[index]
  const cubeData = cubes.value[index]

  gsap.to(cube, {
    x: cubeData.x,
    y: cubeData.y,
    z: 0,
    scale: 1,
    opacity: 1,
    rotationX: 0,
    rotationY: 0,
    duration: 0.8,
    ease: 'back.out(1.5)',
    onComplete: () => {
      cubes.value[index].active = false
    }
  })
}

const onMouseMove = (e: MouseEvent) => {
  if (!matrixWrapper.value) return

  const rect = containerRef.value!.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  const mouseX = e.clientX - centerX
  const mouseY = e.clientY - centerY

  const rotateX = -mouseY / 50
  const rotateY = mouseX / 50

  gsap.to(matrixWrapper.value, {
    rotateX,
    rotateY,
    duration: 0.3,
    ease: 'power2.out'
  })
}

const onMouseEnter = (index: number) => {
  const cube = cubeRefs.value[index]

  gsap.to(cube.querySelector('.cube')!, {
    scale: 1.3,
    rotationX: 45,
    rotationY: 45,
    duration: 0.3,
    ease: 'back.out(1.5)'
  })

  cubes.value[index].active = true
}

const onMouseLeave = (index: number) => {
  const cube = cubeRefs.value[index]

  gsap.to(cube.querySelector('.cube')!, {
    scale: 1,
    rotationX: 0,
    rotationY: 0,
    duration: 0.3,
    ease: 'power2.inOut'
  })

  cubes.value[index].active = false
}

const pauseAnimation = () => {
  gsap.globalTimeline.pause()
}

const resumeAnimation = () => {
  gsap.globalTimeline.resume()
}

onMounted(() => {
  initCubes()
  setTimeout(initAnimations, 100)

  containerRef.value?.addEventListener('mousemove', onMouseMove)

  // 为每个立方体添加鼠标事件
  cubeRefs.value.forEach((cube, index) => {
    cube.addEventListener('mouseenter', () => onMouseEnter(index))
    cube.addEventListener('mouseleave', () => onMouseLeave(index))
  })
})

onUnmounted(() => {
  gsap.killTweensOf(cubeRefs.value)
  containerRef.value?.removeEventListener('mousemove', onMouseMove)
})

defineExpose({
  pauseAnimation,
  resumeAnimation
})
</script>

<style scoped lang="scss">
.cube-matrix-container {
  position: relative;
  width: 100%;
  height: 600px;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(139, 92, 246, 0.3);
  perspective: 1200px;
}

.cube-matrix-title {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(139, 92, 246, 0.5);
  z-index: 10;
  letter-spacing: 4px;
}

.cube-matrix-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}

.cube-container {
  position: absolute;
  width: 70px;
  height: 70px;
  transform-style: preserve-3d;
  cursor: pointer;
}

.cube {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: all 0.3s ease;
}

.cube-face {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(139, 92, 246, 0.5);
  background: rgba(139, 92, 246, 0.1);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  box-shadow: inset 0 0 20px rgba(139, 92, 246, 0.2);

  &.front { transform: translateZ(35px); }
  &.back { transform: rotateY(180deg) translateZ(35px); }
  &.right { transform: rotateY(90deg) translateZ(35px); }
  &.left { transform: rotateY(-90deg) translateZ(35px); }
  &.top { transform: rotateX(90deg) translateZ(35px); }
  &.bottom { transform: rotateX(-90deg) translateZ(35px); }
}

.cube.active {
  .cube-face {
    background: rgba(236, 72, 153, 0.2);
    border-color: rgba(236, 72, 153, 0.8);
    box-shadow: inset 0 0 30px rgba(236, 72, 153, 0.4), 0 0 20px rgba(236, 72, 153, 0.3);
  }
}

.cube-container:hover .cube {
  .cube-face {
    background: rgba(139, 92, 246, 0.3);
    box-shadow: inset 0 0 30px rgba(139, 92, 246, 0.4), 0 0 20px rgba(139, 92, 246, 0.3);
  }
}

.cube-matrix-controls {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  z-index: 10;
}

.explode-btn,
.implode-btn,
.wave-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
  backdrop-filter: blur(10px);
}

.explode-btn {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  color: #fff;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6);
  }
}

.implode-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
}

.wave-btn {
  background: rgba(236, 72, 153, 0.2);
  color: #fff;
  border: 2px solid rgba(236, 72, 153, 0.5);

  &:hover {
    background: rgba(236, 72, 153, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(236, 72, 153, 0.3);
  }
}

// CSS3 动画效果
.cube-matrix-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);
  pointer-events: none;
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.cube-matrix-container::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(from 0deg, transparent, rgba(139, 92, 246, 0.03), transparent, rgba(236, 72, 153, 0.03), transparent);
  animation: rotate 20s linear infinite;
  pointer-events: none;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
