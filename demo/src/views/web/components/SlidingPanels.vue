<template>
  <div class="sp-sliding-panels-section-59">
    <div class="sp-section-header-59">
      <h2 class="sp-title-59">SLIDING PANELS</h2>
      <p class="sp-subtitle-59">滑动面板动画</p>
    </div>

    <div class="sp-panels-container-59">
      <div class="sp-panel-59" v-for="(panel, index) in panels" :key="index" :class="{ 'sp-active-59': activePanel === index }" @click="activatePanel(index)">
        <div class="sp-panel-content-59">
          <div class="sp-panel-image-59" :style="{ backgroundImage: `url(${panel.image})` }"></div>
          <div class="sp-panel-overlay-59">
            <div class="sp-panel-number-59">{{ String(index + 1).padStart(2, '0') }}</div>
            <h3>{{ panel.title }}</h3>
            <p>{{ panel.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="sp-panel-indicators-59">
      <div class="sp-indicator-59" v-for="(panel, index) in panels" :key="index" :class="{ 'sp-active-59': activePanel === index }" @click="activatePanel(index)"></div>
    </div>

    <div class="sp-panel-controls-59">
      <button class="sp-nav-btn-59 sp-prev-59" @click="prevPanel">←</button>
      <button class="sp-play-btn-59" @click="autoPlay">自动播放</button>
      <button class="sp-nav-btn-59 sp-next-59" @click="nextPanel">→</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const panels = ref([
  { image: new URL('@/assets/image/1.png', import.meta.url).href, title: '滑块一', description: '滑动面板效果' },
  { image: new URL('@/assets/image/2.png', import.meta.url).href, title: '滑块二', description: '流畅的过渡动画' },
  { image: new URL('@/assets/image/3.png', import.meta.url).href, title: '滑块三', description: '优雅的交互体验' },
  { image: new URL('@/assets/image/4.png', import.meta.url).href, title: '滑块四', description: '动态的视觉呈现' },
  { image: new URL('@/assets/image/5.png', import.meta.url).href, title: '滑块五', description: '丰富的动画效果' },
  { image: new URL('@/assets/image/6.png', import.meta.url).href, title: '滑块六', description: '完美的视觉享受' }
])

const activePanel = ref(0)
let autoPlayInterval: number | null = null
let ctx: gsap.Context

const activatePanel = (index: number) => {
  activePanel.value = index

  // 激活动画
  gsap.to('.sp-panel-59', {
    flex: (i) => i === index ? 3 : 1,
    duration: 0.6,
    ease: 'power2.out'
  })

  gsap.to('.sp-panel-overlay-59', {
    opacity: (i) => i === index ? 1 : 0.5,
    duration: 0.6,
    ease: 'power2.out'
  })

  gsap.to('.sp-panel-number-59', {
    scale: (i) => i === index ? 1.2 : 1,
    rotation: (i) => i === index ? 15 : 0,
    duration: 0.4,
    ease: 'power2.out'
  })
}

const prevPanel = () => {
  activePanel.value = (activePanel.value - 1 + panels.value.length) % panels.value.length
  activatePanel(activePanel.value)
}

const nextPanel = () => {
  activePanel.value = (activePanel.value + 1) % panels.value.length
  activatePanel(activePanel.value)
}

const autoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  } else {
    autoPlayInterval = window.setInterval(() => {
      nextPanel()
    }, 2000)
  }
}

const initAnimations = () => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.sp-title-59', {
      scrollTrigger: {
        trigger: '.sp-sliding-panels-section-59',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 60,
      opacity: 0,
      ease: 'power3.out',
      duration: 0.8
    })

    // 副标题动画
    gsap.from('.sp-subtitle-59', {
      scrollTrigger: {
        trigger: '.sp-sliding-panels-section-59',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      y: 40,
      opacity: 0,
      ease: 'power3.out',
      duration: 0.8,
      delay: 0.2
    })

    // 面板入场
    gsap.from('.sp-panel-59', {
      scrollTrigger: {
        trigger: '.sp-panels-container-59',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      flex: 0,
      opacity: 0,
      stagger: 0.1,
      ease: 'back.out(1.5)',
      duration: 0.8
    })

    // 图片渐入
    gsap.from('.sp-panel-image-59', {
      scrollTrigger: {
        trigger: '.sp-panels-container-59',
        start: 'top 65%',
        toggleActions: 'play none none reverse'
      },
      scale: 1.5,
      opacity: 0,
      stagger: 0.1,
      ease: 'power2.out',
      duration: 0.6
    })

    // 数字动画
    gsap.from('.sp-panel-number-59', {
      scrollTrigger: {
        trigger: '.sp-panels-container-59',
        start: 'top 65%',
        toggleActions: 'play none none reverse'
      },
      scale: 0,
      rotation: -180,
      stagger: 0.1,
      ease: 'back.out(1.7)',
      duration: 0.5
    })

    // 文字动画
    gsap.from('.sp-panel-overlay-59 h3, .sp-panel-overlay-59 p', {
      scrollTrigger: {
        trigger: '.sp-panels-container-59',
        start: 'top 60%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      stagger: 0.05,
      ease: 'power3.out',
      duration: 0.5
    })

    // 指示器动画
    gsap.from('.sp-indicator-59', {
      scrollTrigger: {
        trigger: '.sp-panel-indicators-59',
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      scale: 0,
      stagger: 0.08,
      ease: 'back.out(1.7)',
      duration: 0.5
    })

    // 按钮动画
    gsap.from('.sp-nav-btn-59, .sp-play-btn-59', {
      scrollTrigger: {
        trigger: '.sp-panel-controls-59',
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      stagger: 0.1,
      ease: 'power3.out',
      duration: 0.6
    })
  })
}

onMounted(() => {
  initAnimations()
})

onUnmounted(() => {
  ctx?.revert()
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
})
</script>

<style scoped>
.sp-sliding-panels-section-59 {
  min-height: 100vh;
  padding: 80px 40px;
  background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%);
  position: relative;
  overflow: hidden;
}

.sp-section-header-59 {
  text-align: center;
  margin-bottom: 80px;
}

.sp-title-59 {
  font-size: 56px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 6px;
  text-transform: uppercase;
  text-shadow: 0 0 30px rgba(65, 90, 119, 0.5);
}

.sp-subtitle-59 {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 16px;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.sp-panels-container-59 {
  display: flex;
  gap: 16px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 0;
  height: 500px;
}

.sp-panel-59 {
  flex: 1;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.4s ease;
  position: relative;
}

.sp-panel-59:hover {
  box-shadow: 0 20px 60px rgba(65, 90, 119, 0.5);
}

.sp-panel.active-59 {
  box-shadow: 0 25px 70px rgba(65, 90, 119, 0.6);
}

.sp-panel-content-59 {
  position: relative;
  width: 100%;
  height: 100%;
}

.sp-panel-image-59 {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.6s ease;
}

.sp-panel-overlay-59 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent 50%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 32px;
  opacity: 0.5;
  transition: opacity 0.4s ease;
}

.sp-panel.active-59 .sp-panel-overlay-59 {
  opacity: 1;
}

.sp-panel-number-59 {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 56px;
  height: 56px;
  background: rgba(65, 90, 119, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  border: 2px solid rgba(65, 90, 119, 0.5);
  transition: all 0.4s ease;
}

.sp-panel-overlay-59 h3 {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.sp-panel-overlay-59 p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

.sp-panel-indicators-59 {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 40px;
}

.sp-indicator-59 {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.sp-indicator.active-59 {
  background: #fff;
  transform: scale(1.3);
}

.sp-indicator-59:hover {
  background: rgba(255, 255, 255, 0.6);
}

.sp-panel-controls-59 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  margin-top: 40px;
}

.sp-nav-btn-59 {
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sp-nav-btn-59:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.sp-play-btn-59 {
  padding: 14px 32px;
  background: linear-gradient(135deg, #415a77 0%, #778da9 100%);
  border: none;
  border-radius: 30px;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: 0 10px 30px rgba(65, 90, 119, 0.3);
}

.sp-play-btn-59:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(65, 90, 119, 0.4);
}

@media (max-width: 768px) {
  .sp-title-59 {
    font-size: 32px;
    letter-spacing: 3px;
  }

  .sp-subtitle-59 {
    font-size: 14px;
  }

  .sp-panels-container-59 {
    height: 400px;
  }

  .sp-panel-overlay-59 h3 {
    font-size: 18px;
  }

  .sp-panel-overlay-59 p {
    font-size: 12px;
  }
}
</style>
