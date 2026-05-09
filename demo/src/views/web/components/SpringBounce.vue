<template>
  <section class="sb-section-102">
    <div class="sb-container-102">
      <h2 class="sb-title-102">弹跳动力学</h2>
      <p class="sb-subtitle-102">胡克定律与阻尼振荡</p>

      <div ref="bounceArea" class="sb-bounce-area-102">
        <!-- 基准线 -->
        <div class="sb-baseline-102"></div>

        <!-- 弹簧系统 -->
        <div class="sb-spring-systems-102">
          <div
            v-for="(system, index) in springSystems"
            :key="`system-${index}`"
            class="sb-spring-system-102"
            :class="`sb-system-${index}`"
          >
            <!-- 弹簧 -->
            <div class="sb-spring-102" ref="springs">
              <div
                v-for="n in 20"
                :key="`coil-${n}`"
                class="sb-spring-coil-102"
                :style="{ transform: `translateY(${n * 3}px)` }"
              ></div>
            </div>

            <!-- 质量块 -->
            <div
              class="sb-mass-102"
              :style="getMassStyle(system)"
              :data-mass="system.mass"
            >
              <div class="sb-mass-inner-102"></div>
              <div class="sb-mass-label-102">{{ system.mass }}kg</div>
            </div>

            <!-- 能量指示器 -->
            <div class="sb-energy-indicator-102">
              <div class="sb-kinetic-102" ref="kineticBars"></div>
              <div class="sb-potential-102" ref="potentialBars"></div>
            </div>
          </div>
        </div>

        <!-- 重力指示器 -->
        <div class="sb-gravity-indicator-102">
          <div class="sb-gravity-arrow-102">↓</div>
          <span class="sb-gravity-label-102">g = 9.8 m/s²</span>
        </div>
      </div>

      <!-- 物理公式展示 -->
      <div class="sb-formulas-102">
        <div class="sb-formula-102">
          <span class="sb-formula-label-102">胡克定律</span>
          <span class="sb-formula-equation-102">F = -kx</span>
        </div>
        <div class="sb-formula-102">
          <span class="sb-formula-label-102">阻尼振动</span>
          <span class="sb-formula-equation-102">x(t) = Ae^(-γt)cos(ωt)</span>
        </div>
        <div class="sb-formula-102">
          <span class="sb-formula-label-102">固有频率</span>
          <span class="sb-formula-equation-102">ω₀ = √(k/m)</span>
        </div>
      </div>

      <!-- 控制面板 -->
      <div class="sb-controls-102">
        <div class="sb-control-102">
          <label class="sb-control-label-102">弹簧常数 k</label>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            v-model="springConstant"
            class="sb-control-slider-102"
          />
          <span class="sb-control-value-102">{{ springConstant }}</span>
        </div>
        <div class="sb-control-102">
          <label class="sb-control-label-102">阻尼系数 γ</label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            v-model="dampingCoefficient"
            class="sb-control-slider-102"
          />
          <span class="sb-control-value-102">{{ dampingCoefficient }}</span>
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

const bounceArea = ref<HTMLElement | null>(null)
const springs = ref<HTMLElement[]>([])
const kineticBars = ref<HTMLElement[]>([])
const potentialBars = ref<HTMLElement[]>([])

const springConstant = ref(5)
const dampingCoefficient = ref(0.5)

interface SpringSystem {
  mass: number
  color: string
  initialAmplitude: number
}

const springSystems = ref<SpringSystem[]>([
  { mass: 1, color: '#ff6b6b', initialAmplitude: 120 },
  { mass: 2, color: '#4ecdc4', initialAmplitude: 100 },
  { mass: 3, color: '#ffe66d', initialAmplitude: 80 }
])

const getMassStyle = (system: SpringSystem) => ({
  width: `${40 + system.mass * 10}px`,
  height: `${40 + system.mass * 10}px`,
  background: `radial-gradient(circle at 30% 30%, ${system.color}, ${system.color}99)`
})

// 基于物理参数计算振荡周期
const calculatePeriod = (mass: number, k: number): number => {
  return 2 * Math.PI * Math.sqrt(mass / k)
}

// 计算阻尼比
const calculateDampingRatio = (gamma: number, mass: number, k: number): number => {
  return gamma / (2 * Math.sqrt(mass * k))
}

let ctx: gsap.Context
let bounceTimelines: gsap.core.Timeline[] = []

const createSpringAnimation = (
  massElement: HTMLElement,
  springElement: HTMLElement,
  kineticBar: HTMLElement,
  potentialBar: HTMLElement,
  system: SpringSystem,
  index: number
) => {
  const timeline = gsap.timeline({ repeat: -1, yoyo: true })
  const k = springConstant.value
  const gamma = dampingCoefficient.value
  const period = calculatePeriod(system.mass, k)
  const amplitude = system.initialAmplitude

  // 质量块简谐运动 - 考虑阻尼
  timeline.to(massElement, {
    y: amplitude,
    duration: period / 2,
    ease: 'sine.inOut'
  })

  // 弹簧拉伸 - 质量块移动时同步拉伸
  timeline.to(
    springElement,
    {
      scaleY: 1 + amplitude / 100,
      duration: period / 2,
      ease: 'sine.inOut'
    },
    0
  )

  // 动能展示 (最大速度在平衡位置)
  timeline.to(
    kineticBar,
    {
      scaleY: 1,
      duration: period / 4,
      ease: 'power2.in'
    },
    0
  )
  timeline.to(
    kineticBar,
    {
      scaleY: 0,
      duration: period / 4,
      ease: 'power2.out'
    },
    period / 4
  )

  // 势能展示 (最大势能在极端位置)
  timeline.to(
    potentialBar,
    {
      scaleY: 1,
      duration: period / 4,
      ease: 'power2.out'
    },
    0
  )
  timeline.to(
    potentialBar,
    {
      scaleY: 0,
      duration: period / 4,
      ease: 'power2.in'
    },
    period / 4
  )

  // 应用阻尼 - 振幅衰减
  const dampingSteps = 10
  for (let i = 1; i <= dampingSteps; i++) {
    const decayFactor = Math.exp(-gamma * i)
    gsap.to(massElement, {
      y: amplitude * decayFactor,
      duration: period,
      ease: 'none',
      delay: period * i
    })
  }

  return timeline
}

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.sb-title-102', {
      scrollTrigger: {
        trigger: '.sb-section-102',
        start: 'top 90%'
      },
      y: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    gsap.from('.sb-subtitle-102', {
      scrollTrigger: {
        trigger: '.sb-section-102',
        start: 'top 85%'
      },
      y: -25,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power3.out'
    })

    // 基准线
    gsap.from('.sb-baseline-102', {
      scrollTrigger: {
        trigger: '.sb-bounce-area-102',
        start: 'top 80%'
      },
      scaleX: 0,
      duration: 1,
      ease: 'power3.out'
    })

    // 弹簧系统入场 - 基于质量延迟
    gsap.from('.sb-spring-system-102', {
      scrollTrigger: {
        trigger: '.sb-bounce-area-102',
        start: 'top 75%'
      },
      y: -100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.3,
      ease: 'back.out(1.2)'
    })

    // 创建弹簧动画
    springSystems.value.forEach((system, index) => {
      const massElement = document.querySelector(`.sb-system-${index} .sb-mass-102`)
      const springElement = document.querySelector(`.sb-system-${index} .sb-spring-102`)
      const kineticBar = kineticBars.value[index]
      const potentialBar = potentialBars.value[index]

      if (massElement && springElement) {
        const timeline = createSpringAnimation(
          massElement as HTMLElement,
          springElement as HTMLElement,
          kineticBar as HTMLElement,
          potentialBar as HTMLElement,
          system,
          index
        )
        bounceTimelines.push(timeline)

        // 滚动时暂停动画以便观察
        gsap.to(timeline, {
          scrollTrigger: {
            trigger: '.sb-bounce-area-102',
            start: 'top 60%',
            end: 'bottom 20%',
            onEnter: () => timeline.play(),
            onLeave: () => timeline.pause(),
            onEnterBack: () => timeline.play(),
            onLeaveBack: () => timeline.pause()
          }
        })
      }
    })

    // 重力指示器
    gsap.from('.sb-gravity-indicator-102', {
      scrollTrigger: {
        trigger: '.sb-bounce-area-102',
        start: 'top 70%'
      },
      opacity: 0,
      y: -20,
      duration: 0.8,
      delay: 1,
      ease: 'power2.out'
    })

    // 公式卡片
    gsap.from('.sb-formula-102', {
      scrollTrigger: {
        trigger: '.sb-formulas-102',
        start: 'top 85%'
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
    })

    // 控制面板
    gsap.from('.sb-control-102', {
      scrollTrigger: {
        trigger: '.sb-controls-102',
        start: 'top 85%'
      },
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out'
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.sb-section-102 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
}

.sb-container-102 {
  max-width: 900px;
  margin: 0 auto;
}

.sb-title-102 {
  text-align: center;
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 15px;
  color: #fff;
}

.sb-subtitle-102 {
  text-align: center;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 80px;
  letter-spacing: 6px;
  text-transform: uppercase;
}

.sb-bounce-area-102 {
  position: relative;
  height: 500px;
  margin-bottom: 60px;
  padding: 40px;
}

.sb-baseline-102 {
  position: absolute;
  bottom: 100px;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
}

.sb-spring-systems-102 {
  position: relative;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
}

.sb-spring-system-102 {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.sb-spring-102 {
  width: 20px;
  height: 150px;
  position: relative;
  transform-origin: top center;
}

.sb-spring-coil-102 {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.sb-mass-102 {
  position: relative;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
}

.sb-mass-inner-102 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  height: 60%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.sb-mass-label-102 {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
}

.sb-energy-indicator-102 {
  position: absolute;
  right: -30px;
  top: 0;
  height: 100%;
  display: flex;
  gap: 4px;
}

.sb-kinetic-102,
.sb-potential-102 {
  width: 8px;
  height: 100%;
  border-radius: 4px;
  transform-origin: bottom center;
  transform: scaleY(0);
}

.sb-kinetic-102 {
  background: #ff6b6b;
}

.sb-potential-102 {
  background: #4ecdc4;
}

.sb-gravity-indicator-102 {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.sb-gravity-arrow-102 {
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.3);
  animation: gravityPulse 2s ease-in-out infinite;
}

.sb-gravity-label-102 {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  font-family: monospace;
}

.sb-formulas-102 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.sb-formula-102 {
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sb-formula-label-102 {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.sb-formula-equation-102 {
  font-size: 1.1rem;
  color: #fff;
  font-family: 'Courier New', monospace;
  font-weight: 600;
}

.sb-controls-102 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.sb-control-102 {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sb-control-label-102 {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 1px;
}

.sb-control-slider-102 {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: #667eea;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.2);
    }
  }
}

.sb-control-value-102 {
  font-size: 1rem;
  color: #667eea;
  font-weight: 600;
  font-family: monospace;
}

@keyframes gravityPulse {
  0%, 100% {
    opacity: 0.3;
    transform: translateY(0);
  }
  50% {
    opacity: 0.6;
    transform: translateY(5px);
  }
}

@media (max-width: 768px) {
  .sb-title-102 {
    font-size: 2rem;
  }

  .sb-bounce-area-102 {
    height: 400px;
    padding: 20px;
  }

  .sb-spring-systems-102 {
    flex-direction: column;
    gap: 40px;
  }

  .sb-formulas-102 {
    grid-template-columns: 1fr;
  }

  .sb-controls-102 {
    grid-template-columns: 1fr;
  }
}
</style>
