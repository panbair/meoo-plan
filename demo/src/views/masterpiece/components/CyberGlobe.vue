<template>
  <div class="cyber-globe" ref="globeRef">
    <div class="globe-container">
      <!-- 3D球体 -->
      <div class="globe-sphere">
        <div class="sphere-rings">
          <div v-for="i in 8" :key="i" class="sphere-ring" :style="{ '--index': i }"></div>
        </div>
        <div class="sphere-grid"></div>
      </div>

      <!-- 数据点 -->
      <div class="data-points">
        <div
          v-for="i in 20"
          :key="i"
          class="data-point"
          :style="{ '--index': i }"
        ></div>
      </div>

      <!-- 轨道线 -->
      <div class="orbit-lines">
        <div class="orbit-line orbit-1"></div>
        <div class="orbit-line orbit-2"></div>
        <div class="orbit-line orbit-3"></div>
      </div>

      <!-- 浮动粒子 -->
      <div class="floating-particles">
        <div
          v-for="i in 30"
          :key="i"
          class="floating-particle"
          :style="{ '--index': i }"
        ></div>
      </div>

      <!-- 外环 -->
      <div class="outer-rings">
        <div class="outer-ring ring-1"></div>
        <div class="outer-ring ring-2"></div>
        <div class="outer-ring ring-3"></div>
      </div>

      <!-- 扫描线 -->
      <div class="scan-line" ref="scanLineRef"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Props {
  size?: number
  colors?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  size: 400,
  colors: () => ['#00ffff', '#ff00ff', '#ffff00', '#00ff00']
})

const globeRef = ref<HTMLElement>()
const scanLineRef = ref<HTMLElement>()
let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 球体环旋转
    gsap.to('.sphere-ring', {
      rotate: 360,
      duration: 20,
      repeat: -1,
      ease: 'none',
      stagger: 1
    })

    // 球体网格动画
    gsap.to('.sphere-grid', {
      backgroundPosition: '100% 100%',
      duration: 10,
      repeat: -1,
      ease: 'none'
    })

    // 数据点脉冲
    gsap.to('.data-point', {
      scale: [1, 1.5, 1],
      opacity: [0.5, 1, 0.5],
      duration: 2,
      repeat: -1,
      stagger: {
        each: 0.1,
        from: 'random'
      }
    })

    // 轨道线旋转
    gsap.to('.orbit-line', {
      rotate: 360,
      duration: 15,
      repeat: -1,
      ease: 'none',
      stagger: 2
    })

    // 浮动粒子
    gsap.to('.floating-particle', {
      y: -50,
      opacity: 0,
      duration: 3,
      repeat: -1,
      stagger: {
        each: 0.2,
        from: 'random'
      }
    })

    // 外环旋转
    gsap.to('.outer-ring', {
      rotate: 360,
      duration: 25,
      repeat: -1,
      ease: 'none',
      stagger: 3,
      rotationOrigin: '50% 50%'
    })

    // 扫描线
    const scanTimeline = gsap.timeline({ repeat: -1 })
    scanTimeline.to(scanLineRef.value, {
      top: '100%',
      duration: 2,
      ease: 'power2.inOut'
    }).to(scanLineRef.value, {
      opacity: 0,
      duration: 0.1
    }).to(scanLineRef.value, {
      top: '0',
      duration: 0.1
    }).to(scanLineRef.value, {
      opacity: 1,
      duration: 0.1
    })

    // 鼠标交互
    globeRef.value?.addEventListener('mousemove', (e) => {
      const rect = globeRef.value!.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) / 15
      const y = (e.clientY - rect.top - rect.height / 2) / 15

      gsap.to('.globe-container', {
        rotateY: x,
        rotateX: -y,
        duration: 0.5,
        ease: 'power2.out'
      })
    })

    globeRef.value?.addEventListener('mouseleave', () => {
      gsap.to('.globe-container', {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: 'power2.out'
      })
    })

    // 点击爆炸效果
    globeRef.value?.addEventListener('click', () => {
      gsap.to('.data-point', {
        scale: 3,
        opacity: 0,
        duration: 0.5,
        stagger: 0.02,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to('.data-point', {
            scale: 1,
            opacity: 0.5,
            duration: 0.5,
            stagger: 0.02,
            ease: 'back.out(1.7)'
          })
        }
      })
    })
  }, globeRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.cyber-globe {
  position: relative;
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
  cursor: pointer;
}

.globe-container {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.globe-sphere {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(0, 255, 255, 0.3), rgba(255, 0, 255, 0.1));
  box-shadow: 0 0 50px rgba(0, 255, 255, 0.3), inset 0 0 50px rgba(0, 255, 255, 0.1);
}

.sphere-rings {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.sphere-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%) rotateX(calc(var(--index) * 22.5deg));
}

.sphere-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-image:
    linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.5;
}

.data-points {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  transform: translate(-50%, -50%);
  transform-style: preserve-3d;
}

.data-point {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #00ffff;
  border-radius: 50%;
  box-shadow: 0 0 10px #00ffff;
  transform-style: preserve-3d;
  animation: orbitPosition 10s linear infinite;
  animation-delay: calc(var(--index) * 0.5s);
}

@keyframes orbitPosition {
  0% {
    transform: rotateX(0deg) rotateY(calc(var(--index) * 18deg)) translateZ(100px);
  }
  100% {
    transform: rotateX(360deg) rotateY(calc(var(--index) * 18deg)) translateZ(100px);
  }
}

.orbit-lines {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  transform: translate(-50%, -50%);
}

.orbit-line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border: 1px dashed rgba(255, 0, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.orbit-1 { transform: translate(-50%, -50%) rotateX(45deg); }
.orbit-2 { transform: translate(-50%, -50%) rotateY(45deg); }
.orbit-3 { transform: translate(-50%, -50%) rotateZ(45deg); }

.floating-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #ffff00;
  border-radius: 50%;
  box-shadow: 0 0 5px #ffff00;
  animation: floatParticle 5s ease-in-out infinite;
  animation-delay: calc(var(--index) * 0.2s);
}

@keyframes floatParticle {
  0%, 100% {
    left: calc(var(--index) * 3.33% + 20%);
    top: 80%;
  }
  50% {
    left: calc(var(--index) * 3.33% + 30%);
    top: 20%;
  }
}

.outer-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 350px;
  height: 350px;
  transform: translate(-50%, -50%);
}

.outer-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 2px solid rgba(0, 255, 0, 0.3);
  border-radius: 50%;
}

.ring-1 {
  width: 100%;
  height: 100%;
}

.ring-2 {
  width: 80%;
  height: 80%;
}

.ring-3 {
  width: 60%;
  height: 60%;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ffff, transparent);
  opacity: 0.5;
}

@media (max-width: 768px) {
  .cyber-globe {
    width: 300px;
    height: 300px;
  }

  .globe-sphere {
    width: 150px;
    height: 150px;
  }

  .sphere-ring {
    width: 150px;
    height: 150px;
  }

  .data-points {
    width: 150px;
    height: 150px;
  }

  .orbit-lines {
    width: 225px;
    height: 225px;
  }

  .outer-rings {
    width: 262.5px;
    height: 262.5px;
  }
}
</style>
