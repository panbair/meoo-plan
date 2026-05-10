<template>
  <div class="solar-container" ref="containerRef">
    <div class="solar-system" ref="systemRef">
      <!-- 太阳 -->
      <div class="sun">
        <span class="sun-emoji">{{ sunIcon }}</span>
      </div>

      <!-- 行星轨道 -->
      <div
        v-for="(planet, index) in planets"
        :key="index"
        class="orbit"
        :class="`orbit-${planet.name}`"
      >
        <div class="planet" :class="planet.name">
          <span class="planet-emoji">{{ planet.icon }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Planet {
  name: string
  icon: string
  orbitSpeed: number
  size: number
  orbitRadius: number
}

interface Props {
  sunIcon?: string
}

const props = withDefaults(defineProps<Props>(), {
  sunIcon: '☀️'
})

const containerRef = ref<HTMLElement>()
const systemRef = ref<HTMLElement>()

const planets: Planet[] = [
  { name: 'mercury', icon: '🪨', orbitSpeed: 5, size: 20, orbitRadius: 60 },
  { name: 'venus', icon: '🌍', orbitSpeed: 8, size: 30, orbitRadius: 90 },
  { name: 'earth', icon: '🌎', orbitSpeed: 12, size: 32, orbitRadius: 130 },
  { name: 'mars', icon: '🔴', orbitSpeed: 15, size: 24, orbitRadius: 170 },
  { name: 'jupiter', icon: '🟤', orbitSpeed: 20, size: 50, orbitRadius: 220 },
  { name: 'saturn', icon: '🪐', orbitSpeed: 25, size: 45, orbitRadius: 280 }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 太阳脉动
    gsap.to('.sun', {
      scale: 1.1,
      boxShadow: '0 0 60px rgba(251, 191, 36, 0.8)',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 行星轨道旋转
    planets.forEach((planet) => {
      gsap.to(`.orbit-${planet.name}`, {
        rotate: 360,
        duration: planet.orbitSpeed,
        repeat: -1,
        ease: 'none'
      })
    })

    // 行星自转
    gsap.to('.planet', {
      rotate: 360,
      duration: 5,
      repeat: -1,
      ease: 'none'
    })
  }, containerRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.solar-container {
  width: 100%;
  max-width: 600px;
  height: 600px;
  perspective: 1000px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.solar-system {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transform: rotateX(60deg);
}

.sun {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) rotateX(-60deg);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, #fbbf24, #f59e0b);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 40px rgba(251, 191, 36, 0.6);
  z-index: 10;
}

.sun-emoji {
  font-size: 3rem;
}

.orbit {
  position: absolute;
  left: 50%;
  top: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.orbit-mercury { width: 120px; height: 120px; }
.orbit-venus { width: 180px; height: 180px; }
.orbit-earth { width: 260px; height: 260px; }
.orbit-mars { width: 340px; height: 340px; }
.orbit-jupiter { width: 440px; height: 440px; }
.orbit-saturn { width: 560px; height: 560px; }

.planet {
  position: absolute;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 50%;
  transform: translateY(-50%) rotateX(-60deg);
  backdrop-filter: blur(5px);
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-50%) rotateX(-60deg) scale(1.3);
  }
}

.mercury {
  right: -10px;
  width: 20px;
  height: 20px;
  background: rgba(156, 163, 175, 0.6);
}

.venus {
  right: -15px;
  width: 30px;
  height: 30px;
  background: rgba(251, 191, 36, 0.6);
}

.earth {
  right: -16px;
  width: 32px;
  height: 32px;
  background: rgba(59, 130, 246, 0.6);
}

.mars {
  right: -12px;
  width: 24px;
  height: 24px;
  background: rgba(239, 68, 68, 0.6);
}

.jupiter {
  right: -25px;
  width: 50px;
  height: 50px;
  background: rgba(168, 85, 247, 0.6);
}

.saturn {
  right: -22px;
  width: 45px;
  height: 45px;
  background: rgba(217, 119, 6, 0.6);
}

.planet-emoji {
  font-size: 1.5rem;
}
</style>
