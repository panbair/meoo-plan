<template>
  <div class="holographic-display" ref="displayRef">
    <div class="hologram-container">
      <!-- 全息投影框 -->
      <div class="holo-frame">
        <div class="frame-corner corner-tl"></div>
        <div class="frame-corner corner-tr"></div>
        <div class="frame-corner corner-bl"></div>
        <div class="frame-corner corner-br"></div>
        <div class="frame-border border-top"></div>
        <div class="frame-border border-bottom"></div>
        <div class="frame-border border-left"></div>
        <div class="frame-border border-right"></div>
      </div>

      <!-- 全息内容 -->
      <div class="holo-content">
        <!-- 3D模型 -->
        <div class="holo-model" ref="modelRef">
          <div class="model-base">
            <div class="model-pyramid">
              <div class="pyramid-face face-1"></div>
              <div class="pyramid-face face-2"></div>
              <div class="pyramid-face face-3"></div>
              <div class="pyramid-face face-4"></div>
            </div>
          </div>
        </div>

        <!-- 数据浮层 -->
        <div class="holo-data">
          <div class="data-line line-1">
            <span class="data-label">STATUS</span>
            <span class="data-value" :class="statusClass">{{ status }}</span>
          </div>
          <div class="data-line line-2">
            <span class="data-label">ENERGY</span>
            <span class="data-value">{{ energy }}%</span>
          </div>
          <div class="data-line line-3">
            <span class="data-label">COORDINATES</span>
            <span class="data-value">{{ coordinates }}</span>
          </div>
        </div>

        <!-- 扫描线 -->
        <div class="scan-grid" ref="scanGridRef"></div>
      </div>

      <!-- 粒子效果 -->
      <div class="holo-particles">
        <div
          v-for="i in 20"
          :key="i"
          class="holo-particle"
          :style="{ '--index': i }"
        ></div>
      </div>

      <!-- 光束 -->
      <div class="light-beams">
        <div class="beam beam-1"></div>
        <div class="beam beam-2"></div>
      </div>
    </div>

    <!-- 控制面板 -->
    <div class="control-panel">
      <button class="control-btn" @click="changeStatus">STATUS</button>
      <button class="control-btn" @click="boostEnergy">ENERGY</button>
      <button class="control-btn" @click="scanMode">SCAN</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Props {
  size?: number
  colors?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  size: 400,
  colors: () => ['#00ffff', '#ff00ff', '#00ff00', '#ffff00']
})

const displayRef = ref<HTMLElement>()
const modelRef = ref<HTMLElement>()
const scanGridRef = ref<HTMLElement>()

const status = ref('ACTIVE')
const energy = ref(85)
const coordinates = ref('X: 0.00 Y: 0.00 Z: 0.00')

const statusClass = computed(() => ({
  'status-active': status.value === 'ACTIVE',
  'status-warning': status.value === 'WARNING',
  'status-critical': status.value === 'CRITICAL'
}))

let ctx: gsap.Context
let coordInterval: number

const changeStatus = () => {
  const statuses = ['ACTIVE', 'WARNING', 'CRITICAL']
  const currentIndex = statuses.indexOf(status.value)
  status.value = statuses[(currentIndex + 1) % statuses.length]
}

const boostEnergy = () => {
  energy.value = Math.min(100, energy.value + 15)
}

const scanMode = () => {
  gsap.to(scanGridRef.value, {
    opacity: 1,
    duration: 0.3,
    onComplete: () => {
      gsap.to(scanGridRef.value, {
        opacity: 0,
        duration: 0.3,
        delay: 2
      })
    }
  })
}

onMounted(() => {
  ctx = gsap.context(() => {
    // 模型旋转
    gsap.to('.model-pyramid', {
      rotateY: 360,
      duration: 10,
      repeat: -1,
      ease: 'none'
    })

    gsap.to('.model-base', {
      rotateX: 20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 全息粒子
    gsap.to('.holo-particle', {
      y: -100,
      opacity: 0,
      duration: 3,
      repeat: -1,
      stagger: {
        each: 0.2,
        from: 'random'
      }
    })

    // 光束
    gsap.to('.beam', {
      height: [0, 200, 0],
      opacity: [0, 0.5, 0],
      duration: 2,
      repeat: -1,
      stagger: 1
    })

    // 框架闪烁
    gsap.to('.frame-border', {
      opacity: [0.3, 1, 0.3],
      duration: 2,
      repeat: -1,
      stagger: 0.5
    })

    // 数据更新动画
    coordInterval = window.setInterval(() => {
      const x = (Math.random() - 0.5) * 100
      const y = (Math.random() - 0.5) * 100
      const z = (Math.random() - 0.5) * 100
      coordinates.value = `X: ${x.toFixed(2)} Y: ${y.toFixed(2)} Z: ${z.toFixed(2)}`
    }, 500)

    // 能量变化
    gsap.to({}, {
      energy: 100,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      onUpdate: function() {
        energy.value = Math.round(50 + Math.sin(this.time() * 0.5) * 30)
      }
    })

    // 鼠标交互
    displayRef.value?.addEventListener('mousemove', (e) => {
      const rect = displayRef.value!.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) / 10
      const y = (e.clientY - rect.top - rect.height / 2) / 10

      gsap.to('.holo-model', {
        rotateY: x,
        rotateX: -y,
        duration: 0.3,
        ease: 'power2.out'
      })
    })

    displayRef.value?.addEventListener('mouseleave', () => {
      gsap.to('.holo-model', {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: 'power2.out'
      })
    })
  }, displayRef.value)
})

onUnmounted(() => {
  ctx?.revert()
  if (coordInterval) clearInterval(coordInterval)
})
</script>

<style scoped lang="scss">
.holographic-display {
  position: relative;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.hologram-container {
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
}

.holo-frame {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(0, 255, 255, 0.3);
  border-radius: 20px;
  overflow: hidden;
}

.frame-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid #00ffff;
}

.corner-tl { top: 0; left: 0; border-right: none; border-bottom: none; }
.corner-tr { top: 0; right: 0; border-left: none; border-bottom: none; }
.corner-bl { bottom: 0; left: 0; border-right: none; border-top: none; }
.corner-br { bottom: 0; right: 0; border-left: none; border-top: none; }

.frame-border {
  position: absolute;
  background: rgba(0, 255, 255, 0.2);
}

.border-top { top: 0; left: 20px; right: 20px; height: 2px; }
.border-bottom { bottom: 0; left: 20px; right: 20px; height: 2px; }
.border-left { left: 0; top: 20px; bottom: 20px; width: 2px; }
.border-right { right: 0; top: 20px; bottom: 20px; width: 2px; }

.holo-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.holo-model {
  position: relative;
  transform-style: preserve-3d;
}

.model-base {
  width: 100px;
  height: 100px;
  transform-style: preserve-3d;
}

.model-pyramid {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}

.pyramid-face {
  position: absolute;
  width: 100px;
  height: 86.6px;
  background: linear-gradient(135deg, rgba(0, 255, 255, 0.3), rgba(255, 0, 255, 0.3));
  border: 1px solid rgba(0, 255, 255, 0.5);
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
  transform-origin: bottom center;
}

.face-1 { transform: rotateY(0deg) rotateX(30deg) translateZ(28.9px); }
.face-2 { transform: rotateY(90deg) rotateX(30deg) translateZ(28.9px); }
.face-3 { transform: rotateY(180deg) rotateX(30deg) translateZ(28.9px); }
.face-4 { transform: rotateY(270deg) rotateX(30deg) translateZ(28.9px); }

.holo-data {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
}

.data-line {
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 5px;
}

.data-label {
  color: #00ffff;
  font-weight: bold;
}

.data-value {
  color: #e2e8f0;
}

.status-active { color: #00ff00; }
.status-warning { color: #ffff00; }
.status-critical { color: #ff0000; }

.scan-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0;
  pointer-events: none;
}

.holo-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.holo-particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #00ffff;
  border-radius: 50%;
  box-shadow: 0 0 5px #00ffff;
  animation: particleFloat 5s ease-in-out infinite;
  animation-delay: calc(var(--index) * 0.3s);
}

@keyframes particleFloat {
  0%, 100% {
    left: calc(var(--index) * 5%);
    top: 90%;
    opacity: 0;
  }
  50% {
    left: calc(var(--index) * 5% + 10%);
    top: 10%;
    opacity: 1;
  }
}

.light-beams {
  position: absolute;
  bottom: -200px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 200px;
  pointer-events: none;
}

.beam {
  position: absolute;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to top, transparent, rgba(0, 255, 255, 0.5));
  transform-origin: bottom center;
}

.beam-1 {
  left: 30%;
  transform: rotateX(15deg);
}

.beam-2 {
  left: 70%;
  transform: rotateX(-15deg);
}

.control-panel {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.control-btn {
  padding: 10px 20px;
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 255, 0.3);
  color: #00ffff;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(0, 255, 255, 0.3);
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }
}

@media (max-width: 768px) {
  .holographic-display {
    width: 300px;
  }

  .holo-frame {
    width: 250px;
    height: 250px;
  }
}
</style>
