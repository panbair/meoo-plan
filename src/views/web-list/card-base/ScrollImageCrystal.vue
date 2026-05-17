<template>
  <div class="sii-section-229" ref="componentRoot">
    <div class="sii-container-229">
      <h2 class="sii-title-229">水晶图片折射</h2>
      <p class="sii-subtitle-229">Crystal Image Refraction</p>

      <!-- 控制面板 -->
      <div class="sii-control-panel-229">
        <div class="sii-control-group-229">
          <label class="sii-label-229">折射角度</label>
          <input
            type="range"
            min="0"
            max="360"
            v-model.number="refractionAngle"
            class="sii-slider-229"
          />
          <span class="sii-value-229">{{ refractionAngle }}°</span>
        </div>
        <div class="sii-control-group-229">
          <label class="sii-label-229">棱镜深度</label>
          <input
            type="range"
            min="10"
            max="100"
            v-model.number="prismDepth"
            class="sii-slider-229"
          />
          <span class="sii-value-229">{{ prismDepth }}%</span>
        </div>
        <div class="sii-control-group-229">
          <label class="sii-label-229">光谱强度</label>
          <input
            type="range"
            min="0"
            max="100"
            v-model.number="spectrumIntensity"
            class="sii-slider-229"
          />
          <span class="sii-value-229">{{ spectrumIntensity }}%</span>
        </div>
      </div>

      <!-- 水晶图片展示区 -->
      <div class="sii-crystal-stage-229">
        <div class="sii-prism-container-229">
          <div
            v-for="(image, index) in images"
            :key="index"
            class="sii-crystal-layer-229"
            :class="`sii-layer-${index + 1}-229`"
            :style="getLayerStyle(index)"
          >
            <div class="sii-crystal-fragment-229">
              <img
                :src="image.src"
                :alt="image.title"
                class="sii-crystal-image-229"
              />
              <div class="sii-reflection-layer-229">
                <div class="sii-reflection-229" v-for="i in 3" :key="i"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 光谱效果 -->
        <div class="sii-spectrum-overlay-229">
          <div class="sii-spectrum-band-229" v-for="i in 7" :key="i"></div>
        </div>
      </div>

      <!-- 图片信息 -->
      <div class="sii-info-panel-229">
        <h3 class="sii-current-title-229">{{ images[currentImageIndex].title }}</h3>
        <p class="sii-current-desc-229">{{ images[currentImageIndex].desc }}</p>
        <div class="sii-indicator-229">
          <span class="sii-dot-229"
            v-for="(_, index) in images"
            :key="index"
            :class="{ 'sii-active-229': index === currentImageIndex }">
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()
const refractionAngle = ref(45)
const prismDepth = ref(50)
const spectrumIntensity = ref(70)
const currentImageIndex = ref(0)

interface CrystalImage {
  src: string
  title: string
  desc: string
}

const images: CrystalImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    title: '山川折射',
    desc: 'Mountain Refraction'
  },
  {
    src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600',
    title: '海洋晶体',
    desc: 'Ocean Crystal'
  },
  {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
    title: '森林棱镜',
    desc: 'Forest Prism'
  },
  {
    src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600',
    title: '星空透镜',
    desc: 'Starry Lens'
  }
]

const getLayerStyle = (index: number) => {
  const offset = index * 15
  return {
    transform: `rotateX(${offset}deg) rotateY(${offset}deg) translateZ(${offset * 2}px)`,
    opacity: 1 - (index * 0.15),
    zIndex: 10 - index
  }
}

let crystalTimeline: gsap.core.Timeline | null = null
let spectrumTimeline: gsap.core.Timeline | null = null

const initAnimations = () => {
  const layers = document.querySelectorAll('.sii-crystal-layer-229')
  const fragments = document.querySelectorAll('.sii-crystal-fragment-229')
  const reflections = document.querySelectorAll('.sii-reflection-229')
  const spectrumBands = document.querySelectorAll('.sii-spectrum-band-229')

  // 水晶折射动画
  crystalTimeline = gsap.timeline({ repeat: -1, yoyo: true })

  layers.forEach((layer, index) => {
    crystalTimeline!.to(layer, {
      rotationX: index * 15 + 30,
      rotationY: index * 15 + 30,
      translateZ: index * 30,
      duration: 2 + index * 0.5,
      ease: 'power2.inOut'
    }, 0)
  })

  // 反射波纹动画
  gsap.to(reflections, {
    scale: 1.5,
    opacity: 0,
    duration: 2,
    stagger: 0.3,
    repeat: -1,
    ease: 'power1.out'
  })

  // 光谱流动动画
  spectrumTimeline = gsap.timeline({ repeat: -1 })

  spectrumBands.forEach((band, index) => {
    spectrumTimeline!.to(band, {
      xPercent: -50,
      opacity: 0.6,
      duration: 2 + index * 0.3,
      ease: 'sine.inOut'
    }, index * 0.2)
  })

  // 滚动触发
  layers.forEach((layer, index) => {
    gsap.fromTo(layer,
      {
        y: 100,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1 - (index * 0.1),
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: layer,
          start: 'top 90%',
          end: 'top 30%',
          scrub: 1,
          toggleActions: 'play none none reverse'
        }
      }
    )
  })

  // 自动切换图片
  gsap.to({}, {
    duration: 0.1,
    repeat: -1,
    onRepeat: () => {
      currentImageIndex.value = (currentImageIndex.value + 1) % images.length
    }
  })

  // 鼠标交互
  const stage = document.querySelector('.sii-crystal-stage-229')
  if (stage) {
    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5

      gsap.to('.sii-crystal-layer-229', {
        rotationY: x * 60,
        rotationX: -y * 60,
        duration: 0.5,
        ease: 'power2.out'
      })
    })

    stage.addEventListener('mouseleave', () => {
      gsap.to('.sii-crystal-layer-229', {
        rotationY: 0,
        rotationX: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.5)'
      })
    })
  }
}

const cleanup = () => {
  if (crystalTimeline) {
    crystalTimeline.kill()
    crystalTimeline = null
  }
  if (spectrumTimeline) {
    spectrumTimeline.kill()
    spectrumTimeline = null
  }
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
}

onMounted(() => {
  initAnimations()
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped lang="scss">
.sii-section-229 {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 50%, #0a1a2a 100%);
  padding: 60px 20px;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.sii-section-229::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 30% 70%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 30%, rgba(255, 119, 198, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.sii-container-229 {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.sii-title-229 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #c084fc, #f472b6, #fb923c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;

  opacity: 1 !important;}

.sii-subtitle-229 {
  font-size: 1.2rem;
  color: #94a3b8;
  text-align: center;
  margin-bottom: 40px;

  opacity: 1 !important;}

.sii-control-panel-229 {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 25px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 40px;

  opacity: 1 !important;}

.sii-control-group-229 {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 200px;

  opacity: 1 !important;}

.sii-label-229 {
  font-size: 14px;
  color: #94a3b8;
  font-weight: 500;

  opacity: 1 !important;}

.sii-slider-229 {
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
    background: linear-gradient(135deg, #c084fc, #f472b6);
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.2);
    
  opacity: 1 !important;}
  }
}

.sii-value-229 {
  font-size: 13px;
  color: #c084fc;
  font-weight: 600;

  opacity: 1 !important;}

.sii-crystal-stage-229 {
  perspective: 2000px;
  height: 500px;
  position: relative;
  margin-bottom: 30px;

  opacity: 1 !important;}

.sii-prism-container-229 {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.sii-crystal-layer-229 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 300px;
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.5s;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

.sii-crystal-fragment-229 {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  opacity: 1 !important;}

.sii-crystal-image-229 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(1.1) contrast(1.1);

  opacity: 1 !important;}

.sii-reflection-layer-229 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.sii-reflection-229 {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(192, 132, 252, 0.3) 0%,
    rgba(244, 114, 182, 0.2) 50%,
    rgba(251, 146, 60, 0.3) 100%
  );
  border-radius: 50%;
  filter: blur(40px);
  mix-blend-mode: screen;

  opacity: 1 !important;}

.sii-spectrum-overlay-229 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.sii-spectrum-band-229 {
  position: absolute;
  width: 200%;
  height: 20px;
  border-radius: 10px;
  filter: blur(8px);
  mix-blend-mode: screen;

  &:nth-child(1) { background: rgba(255, 0, 0, 0.4); top: 10%; 
  opacity: 1 !important;}
  &:nth-child(2) { background: rgba(255, 165, 0, 0.4); top: 25%; }
  &:nth-child(3) { background: rgba(255, 255, 0, 0.4); top: 40%; }
  &:nth-child(4) { background: rgba(0, 255, 0, 0.4); top: 55%; }
  &:nth-child(5) { background: rgba(0, 0, 255, 0.4); top: 70%; }
  &:nth-child(6) { background: rgba(75, 0, 130, 0.4); top: 85%; }
  &:nth-child(7) { background: rgba(238, 130, 238, 0.4); top: 100%; }
}

.sii-info-panel-229 {
  text-align: center;
  padding: 30px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  opacity: 1 !important;}

.sii-current-title-229 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 10px;

  opacity: 1 !important;}

.sii-current-desc-229 {
  font-size: 1.1rem;
  color: #94a3b8;
  margin-bottom: 20px;

  opacity: 1 !important;}

.sii-indicator-229 {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.sii-dot-229 {
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;

  &.sii-active-229 {
    background: linear-gradient(135deg, #c084fc, #f472b6);
    transform: scale(1.2);
    box-shadow: 0 0 20px rgba(192, 132, 252, 0.6);
  
  opacity: 1 !important;}

  &:hover {
    transform: scale(1.1);
  }
}
</style>
