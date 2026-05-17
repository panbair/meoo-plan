<template>
  <div class="shape-shift-wrapper-211">
    <div class="ss-container-211">
      <div class="ss-header-211">
        <h2 class="ss-title-211">Shape Shift</h2>
        <p class="ss-subtitle-211">正方形 → 圆形 → 三角形 → 星形</p>
      </div>

      <div class="ss-shapes-211">
        <div
          v-for="shape in shapes"
          :key="shape.id"
          class="ss-shape-container-211"
        >
          <div class="ss-shape-211" :class="`ss-shape-${shape.id}-211`" :style="shapeStyle(shape)">
            <div class="ss-shape-content-211">
              <span class="ss-shape-icon-211">{{ shape.icon }}</span>
              <span class="ss-shape-label-211">{{ shape.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="ss-indicators-211">
        <button
          v-for="(shape, index) in shapes"
          :key="index"
          class="ss-indicator-211"
          :class="{ active: currentShape === index }"
          @click="switchShape(index)"
        >
          {{ shape.name }}
        </button>
      </div>

      <div class="ss-info-211">
        <div class="ss-info-item-211">
          <span class="ss-info-value-211">{{ currentShapeLabel }}</span>
          <span class="ss-info-label-211">当前形状</span>
        </div>
        <div class="ss-info-item-211">
          <span class="ss-info-value-211">{{ sidesCount }}</span>
          <span class="ss-info-label-211">边数</span>
        </div>
      </div>

      <div class="ss-progress-211">
        <div class="ss-progress-bar-211" id="ss-progress-bar-211"></div>
      </div>
    </div>

    <div class="ss-particles-211" id="ss-particles-211"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const currentShape = ref(0)

const shapes = [
  {
    id: 1,
    name: '正方形',
    label: 'Square',
    icon: '⬜',
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    borderRadius: '0%',
    rotate: 0
  },
  {
    id: 2,
    name: '圆形',
    label: 'Circle',
    icon: '⚪',
    clipPath: 'circle(50% at 50% 50%)',
    borderRadius: '50%',
    rotate: 0
  },
  {
    id: 3,
    name: '三角形',
    label: 'Triangle',
    icon: '🔺',
    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
    borderRadius: '0%',
    rotate: 0
  },
  {
    id: 4,
    name: '星形',
    label: 'Star',
    icon: '⭐',
    clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
    borderRadius: '0%',
    rotate: 0
  },
  {
    id: 5,
    name: '六边形',
    label: 'Hexagon',
    icon: '⬡',
    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
    borderRadius: '0%',
    rotate: 0
  },
  {
    id: 6,
    name: '菱形',
    label: 'Diamond',
    icon: '🔶',
    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
    borderRadius: '0%',
    rotate: 0
  }
]

const currentShapeLabel = computed(() => shapes[currentShape.value].label)
const sidesCount = computed(() => {
  const map = { 0: 4, 1: '∞', 2: 3, 3: 5, 4: 6, 5: 4 }
  return map[currentShape.value]
})

const shapeStyle = (shape) => ({
  clipPath: shape.clipPath,
  borderRadius: shape.borderRadius
})

const switchShape = (index) => {
  currentShape.value = index
  const shape = shapes[index]

  gsap.utils.toArray('.ss-shape-211').forEach((el) => {
    gsap.to(el, {
      clipPath: shape.clipPath,
      borderRadius: shape.borderRadius,
      rotation: shape.rotate,
      duration: 1.2,
      ease: 'elastic.out(1, 0.5)'
    })

    gsap.fromTo(
      el.querySelector('.ss-shape-icon-211'),
      { scale: 0, rotate: -180 },
      { scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(1.7)' }
    )
  })
}

const createParticles = () => {
  const container = document.getElementById('ss-particles-211')
  if (!container) return

  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div')
    particle.className = 'ss-particle-211'
    particle.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${2 + Math.random() * 4}px;
      height: ${2 + Math.random() * 4}px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, transparent 70%);
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    `
    container.appendChild(particle)

    gsap.to(particle, {
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
      opacity: 0,
      duration: 2 + Math.random() * 2,
      repeat: -1,
      delay: Math.random() * 2
    })

    gsap.to(particle, {
      rotation: 360,
      duration: 1 + Math.random(),
      repeat: -1,
      ease: 'none'
    })
  }
}

const initScrollAnimations = () => {
  gsap.fromTo(
    '.ss-shape-container-211',
    {
      y: 100,
      opacity: 0,
      scale: 0.5
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1,
      stagger: 0.15,
      ease: 'elastic.out(1, 0.5)',
      scrollTrigger: {
        trigger: '.ss-shapes-211',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      }
    }
  )

  gsap.to('#ss-progress-bar-211', {
    width: '100%',
    scrollTrigger: {
      trigger: '.ss-container-211',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 1
    }
  })

  gsap.utils.toArray('.ss-shape-container-211').forEach((container) => {
    container.addEventListener('mouseenter', () => {
      gsap.to(container.querySelector('.ss-shape-211'), {
        scale: 1.1,
        rotate: 15,
        duration: 0.4,
        ease: 'back.out(1.7)'
      })
    })

    container.addEventListener('mouseleave', () => {
      gsap.to(container.querySelector('.ss-shape-211'), {
        scale: 1,
        rotate: shapes[currentShape.value].rotate,
        duration: 0.4,
        ease: 'power2.out'
      })
    })
  })

  gsap.to({}, {
    duration: 3,
    repeat: -1,
    onRepeat: () => {
      const nextShape = (currentShape.value + 1) % shapes.length
      switchShape(nextShape)
    },
    scrollTrigger: {
      trigger: '.ss-shapes-211',
      start: 'top 50%',
      toggleActions: 'play none none reverse'
    }
  })
}

onMounted(() => {
  createParticles()
  initScrollAnimations()
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((t) => t.kill())
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.shape-shift-wrapper-211 {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
  overflow: hidden;
  padding: 60px 20px;

  opacity: 1 !important;}

.ss-container-211 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 10;

  opacity: 1 !important;}

.ss-header-211 {
  text-align: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.ss-title-211 {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;

  opacity: 1 !important;}

.ss-subtitle-211 {
  font-size: 1.2rem;
  color: #94a3b8;

  opacity: 1 !important;}

.ss-shapes-211 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  margin-bottom: 60px;
}

.ss-shape-container-211 {
  display: flex;
  justify-content: center;
  align-items: center;
}

.ss-shape-211 {
  width: 180px;
  height: 180px;
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: clip-path 1.2s ease, border-radius 1.2s ease;
  cursor: pointer;
  box-shadow: 0 0 40px rgba(139, 92, 246, 0.3);

  opacity: 1 !important;}

.ss-shape-content-211 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #fff;
  text-align: center;

  opacity: 1 !important;}

.ss-shape-icon-211 {
  font-size: 3rem;

  opacity: 1 !important;}

.ss-shape-label-211 {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;

  opacity: 1 !important;}

.ss-indicators-211 {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.ss-indicator-211 {
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  color: #94a3b8;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.ss-indicator-211:hover {
  background: rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.5);
}

.ss-indicator-211.active {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  border-color: transparent;
  color: #fff;
  transform: scale(1.05);

  opacity: 1 !important;}

.ss-info-211 {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-bottom: 40px;
}

.ss-info-item-211 {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ss-info-value-211 {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.ss-info-label-211 {
  font-size: 0.9rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;

  opacity: 1 !important;}

.ss-progress-211 {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;

  opacity: 1 !important;}

.ss-progress-bar-211 {
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%);
  border-radius: 2px;

  opacity: 1 !important;}

.ss-particles-211 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;

  opacity: 1 !important;}

.ss-particle-211 {
  position: absolute;
}

@media (max-width: 768px) {
  .ss-title-211 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .ss-shapes-211 {
    grid-template-columns: repeat(2, 1fr);
  }

  .ss-info-211 {
    gap: 30px;
  }
}
</style>
