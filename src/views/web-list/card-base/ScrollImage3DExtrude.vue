<template>
  <section ref="extrudeSection" class="ie-section-228">
    <!-- 动态背景 -->
    <div class="ie-bg-gradient-228"></div>
    <canvas ref="particleCanvas" class="ie-particles-228"></canvas>

    <div class="ie-header-228">
      <h2 class="ie-title-228">3D 极光挤出轮播</h2>
      <p class="ie-subtitle-228">Aurora 3D Extrusion Carousel</p>
    </div>

    <!-- 控制面板 -->
    <div class="ie-control-panel-228">
      <div class="ie-control-group-228">
        <label class="ie-label-228">挤出深度</label>
        <input
          type="range"
          min="50"
          max="150"
          v-model.number="extrudeDepth"
          class="ie-slider-228"
        />
        <span class="ie-value-228">{{ extrudeDepth }}px</span>
      </div>
      <div class="ie-control-group-228">
        <label class="ie-label-228">模糊强度</label>
        <input
          type="range"
          min="0"
          max="30"
          v-model.number="blurIntensity"
          class="ie-slider-228"
        />
        <span class="ie-value-228">{{ blurIntensity }}px</span>
      </div>
      <div class="ie-control-group-228">
        <label class="ie-label-228">极光强度</label>
        <input
          type="range"
          min="0"
          max="100"
          v-model.number="auroraIntensity"
          class="ie-slider-228"
        />
        <span class="ie-value-228">{{ auroraIntensity }}%</span>
      </div>
      <div class="ie-control-group-228">
        <label class="ie-label-228">混合模式</label>
        <button
          v-for="mode in blendModes"
          :key="mode"
          class="ie-mode-btn-228"
          :class="{ 'ie-active-228': currentMode === mode }"
          @click="setMode(mode)"
        >
          {{ mode }}
        </button>
      </div>
    </div>

    <!-- 3D轮播容器 -->
    <div class="ie-extrude-container-228">
      <div ref="carouselWrapper" class="ie-carousel-wrapper-228">
        <!-- 轮播轨道 -->
        <div ref="carouselTrack" class="ie-carousel-track-228">
          <!-- 每个3D挤出卡片 -->
          <div
            v-for="(img, index) in images"
            :key="index"
            ref="carouselItems"
            class="ie-carousel-item-228"
            :class="{ 'ie-active-228': activeIndex === index }"
            :style="getItemStyle(index)"
          >
            <!-- 3D挤出结构 -->
            <div class="ie-card-3d-228">
              <!-- 极光遮罩层 -->
              <div class="ie-aurora-mask-228">
                <div v-for="i in 3" :key="`wave-${i}`" class="ie-aurora-wave-228"></div>
              </div>

              <!-- 模糊层 -->
              <div class="ie-blur-layer-228" :style="{ filter: `blur(${blurIntensity}px)` }"></div>

              <!-- 底层卡片 -->
              <div class="ie-card-layer-228 ie-layer-back-228">
                <div class="ie-layer-content-228">
                  <img :src="img" :alt="`Image ${index + 1}`" />
                </div>
              </div>

              <!-- 中间卡片层 -->
              <div v-for="i in 6" :key="`mid-${index}-${i}`" class="ie-card-layer-228 ie-layer-mid-228" :style="layerStyle(i * 0.15)">
                <div class="ie-layer-content-228">
                  <img :src="img" :alt="`Layer ${i}`" />
                </div>
              </div>

              <!-- 顶层卡片 -->
              <div class="ie-card-layer-228 ie-layer-front-228">
                <div class="ie-layer-content-228">
                  <img :src="img" :alt="`Image ${index + 1}`" />
                  <!-- 极光光效 -->
                  <div class="ie-aurora-glow-228" :style="{ opacity: auroraIntensity / 100, mixBlendMode: currentMode }"></div>
                  <!-- 卡片信息 -->
                  <div class="ie-card-info-228">
                    <h3 class="ie-card-title-228">{{ imageTitles[index] }}</h3>
                    <p class="ie-card-desc-228">{{ imageDescs[index] }}</p>
                    <!-- 模糊指示器 -->
                    <div class="ie-blur-indicator-228">
                      <div class="ie-blur-from-228">{{ blurIntensity }}px</div>
                      <div class="ie-blur-arrow-228">→</div>
                      <div class="ie-blur-to-228">0px</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 侧边3D面 -->
              <div
                v-for="side in ['top', 'right', 'bottom', 'left']"
                :key="`side-${index}-${side}`"
                class="ie-card-side-228"
                :class="`ie-side-${side}-228`"
                :style="sideStyle(side)"
              ></div>
            </div>
          </div>
        </div>

        <!-- 轮播导航 -->
        <div class="ie-carousel-nav-228">
          <button class="ie-nav-btn-228 ie-prev-228" @click="prevSlide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div class="ie-indicators-228">
            <span
              v-for="(img, index) in images"
              :key="`ind-${index}`"
              class="ie-indicator-228"
              :class="{ 'ie-active-228': activeIndex === index }"
              @click="goToSlide(index)"
            ></span>
          </div>
          <button class="ie-nav-btn-228 ie-next-228" @click="nextSlide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 滚动进度条 -->
      <div class="ie-progress-bar-228">
        <div class="ie-progress-fill-228" :style="{ width: scrollProgress + '%' }"></div>
      </div>
    </div>

    <!-- 装饰性光效 -->
    <div class="ie-decorative-lights-228">
      <div v-for="i in 3" :key="`light-${i}`" class="ie-light-228" :class="`ie-light-${i}-228`"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const extrudeSection = ref<HTMLElement>()
const carouselWrapper = ref<HTMLElement>()
const carouselTrack = ref<HTMLElement>()
const carouselItems = ref<HTMLElement[]>([])
const particleCanvas = ref<HTMLCanvasElement>()

// 当前激活的索引
const activeIndex = ref(0)
const scrollProgress = ref(0)

// 控制参数
const extrudeDepth = ref(100)
const blurIntensity = ref(15)
const auroraIntensity = ref(50)
const currentMode = ref('overlay')

const blendModes = ['overlay', 'screen', 'color-dodge', 'exclusion', 'lighten', 'hard-light']

// 图片列表
const images = [
  new URL('@/assets/image/1.png', import.meta.url).href,
  new URL('@/assets/image/2.png', import.meta.url).href,
  new URL('@/assets/image/3.png', import.meta.url).href,
  new URL('@/assets/image/4.png', import.meta.url).href,
  new URL('@/assets/image/5.png', import.meta.url).href,
  new URL('@/assets/image/6.png', import.meta.url).href
]

// 图片标题和描述
const imageTitles = ['山川日出', '碧海蓝天', '森林晨曦', '星空璀璨', '都市夜景', '日落黄昏']
const imageDescs = ['Mountain Sunrise', 'Ocean Blue', 'Forest Dawn', 'Starry Night', 'City Lights', 'Sunset Glow']

// 3D轮播半径
const carouselRadius = 450

// 卡片尺寸
const cardSize = ref({
  width: 320,
  height: 240,
  depth: 100
})

// 计算每个轮播项的3D位置样式
const getItemStyle = (index: number) => {
  const offset = (index - activeIndex.value + images.length) % images.length
  const angle = offset * (360 / images.length) * (Math.PI / 180)
  const x = Math.sin(angle) * carouselRadius
  const z = Math.cos(angle) * carouselRadius - carouselRadius
  const scale = 1 + (offset === 0 ? 0.2 : 0)
  const opacity = offset === 0 ? 1 : 0.5
  const zIndex = offset === 0 ? 10 : 1
  const rotateY = offset * (360 / images.length)
  const blur = offset === 0 ? 0 : blurIntensity.value * (1 - offset / images.length)

  return {
    transform: `translateX(${x}px) translateZ(${z}px) scale(${scale}) rotateY(${rotateY}deg)`,
    opacity,
    zIndex,
    filter: `blur(${blur}px)`
  }
}

// 计算层样式
const layerStyle = (progress: number) => {
  const zOffset = progress * extrudeDepth.value
  return {
    transform: `translateZ(${zOffset}px)`,
    opacity: 0.9 + progress * 0.1
  }
}

// 计算侧边样式
const sideStyle = (side: string) => {
  const depth = extrudeDepth.value
  const style: Record<string, string> = {
    position: 'absolute'
  }

  switch (side) {
    case 'top':
      return {
        ...style,
        width: `${cardSize.value.width}px`,
        height: `${depth}px`,
        top: `-${depth}px`,
        left: '0',
        transform: `rotateX(-90deg)`,
        background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.2))'
      }
    case 'right':
      return {
        ...style,
        width: `${depth}px`,
        height: `${cardSize.value.height}px`,
        top: '0',
        right: `-${depth}px`,
        transform: `rotateY(90deg)`,
        background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.2))'
      }
    case 'bottom':
      return {
        ...style,
        width: `${cardSize.value.width}px`,
        height: `${depth}px`,
        bottom: `-${depth}px`,
        left: '0',
        transform: `rotateX(90deg)`,
        background: 'linear-gradient(180deg, rgba(236, 72, 153, 0.3), rgba(99, 102, 241, 0.2))'
      }
    case 'left':
      return {
        ...style,
        width: `${depth}px`,
        height: `${cardSize.value.height}px`,
        top: '0',
        left: `-${depth}px`,
        transform: `rotateY(-90deg)`,
        background: 'linear-gradient(90deg, rgba(236, 72, 153, 0.3), rgba(168, 85, 247, 0.2))'
      }
  }
  return style
}

// 设置混合模式
const setMode = (mode: string) => {
  currentMode.value = mode
  updateAuroraEffect()
}

// 更新极光效果
const updateAuroraEffect = () => {
  const auroraGlows = document.querySelectorAll('.ie-aurora-glow-228')
  auroraGlows.forEach(glow => {
    const el = glow as HTMLElement
    el.style.mixBlendMode = currentMode.value
    el.style.opacity = (auroraIntensity.value / 100).toString()
  })
}

// 下一张
const nextSlide = () => {
  gsap.to(
    {},
    {
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        activeIndex.value = (activeIndex.value + 1) % images.length
      }
    }
  )
}

// 上一张
const prevSlide = () => {
  gsap.to(
    {},
    {
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        activeIndex.value = (activeIndex.value - 1 + images.length) % images.length
      }
    }
  )
}

// 跳转到指定张
const goToSlide = (index: number) => {
  gsap.to(
    {},
    {
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        activeIndex.value = index
      }
    }
  )
}

let ctx: gsap.Context
let auroraTimeline: gsap.core.Timeline | null = null

// 初始化3D轮播动画
const initCarouselAnimation = () => {
  if (!extrudeSection.value || !carouselTrack.value) return

  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.ie-title-228', {
      scrollTrigger: {
        trigger: '.ie-header-228',
        start: 'top 90%'
      },
      y: 50,
      opacity: 0,
      rotateY: 30,
      duration: 1,
      ease: 'power3.out'
    })

    // 控制面板动画
    gsap.from('.ie-control-panel-228', {
      scrollTrigger: {
        trigger: '.ie-control-panel-228',
        start: 'top 90%'
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })

    // 轮播入场动画
    gsap.from('.ie-carousel-item-228', {
      scrollTrigger: {
        trigger: '.ie-carousel-wrapper-228',
        start: 'top 80%'
      },
      opacity: 0,
      scale: 0.3,
      rotateY: 180,
      rotateX: 30,
      duration: 1.5,
      ease: 'back.out(1.7)',
      stagger: 0.1
    })

    // 导航按钮动画
    gsap.from('.ie-nav-btn-228', {
      scrollTrigger: {
        trigger: '.ie-carousel-nav-228',
        start: 'top 85%'
      },
      scale: 0,
      rotation: 180,
      duration: 0.6,
      ease: 'back.out(2)',
      stagger: 0.2
    })

    // 指示器动画
    gsap.from('.ie-indicator-228', {
      scrollTrigger: {
        trigger: '.ie-indicators-228',
        start: 'top 85%'
      },
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(1.5)',
      stagger: 0.08
    })

    // 极光波浪动画
    initAuroraAnimation()

    // 滚动时轮播旋转
    gsap.to(
      {},
      {
        scrollTrigger: {
          trigger: '.ie-carousel-wrapper-228',
          start: 'top 90%',
          end: 'bottom 10%',
          scrub: 0.5,
          onUpdate: self => {
            const totalRotation = self.progress * images.length * 2
            activeIndex.value = Math.floor(totalRotation) % images.length
          }
        }
      }
    )

    // 滚动进度
    ScrollTrigger.create({
      trigger: extrudeSection.value,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
      onUpdate: self => {
        scrollProgress.value = self.progress * 100
      }
    })

    // 挤出层动画
    const midLayers = document.querySelectorAll('.ie-layer-mid-228')
    midLayers.forEach((layer, index) => {
      gsap.from(layer, {
        scrollTrigger: {
          trigger: '.ie-carousel-wrapper-228',
          start: 'top 70%',
          end: 'center center',
          scrub: 0.8
        },
        transform: 'translateZ(0px)',
        opacity: 0.6,
        duration: 1,
        delay: index * 0.05
      })
    })

    // 侧边面动画
    const sideFaces = document.querySelectorAll('.ie-card-side-228')
    sideFaces.forEach((side, index) => {
      gsap.from(side, {
        scrollTrigger: {
          trigger: '.ie-carousel-wrapper-228',
          start: 'top 60%',
          end: 'center center',
          scrub: 0.6
        },
        opacity: 0,
        duration: 0.8,
        delay: index * 0.05
      })
    })

    // 模糊揭示动画 - 激活卡片
    const blurLayers = document.querySelectorAll('.ie-blur-layer-228')
    blurLayers.forEach((blurLayer, index) => {
      gsap.fromTo(
        blurLayer,
        { opacity: 0.8 },
        {
          opacity: 0,
          scrollTrigger: {
            trigger: `.ie-carousel-item-228:nth-child(${index + 1})`,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1.5
          },
          ease: 'power2.inOut'
        }
      )
    })

    // 卡片悬停效果
    const items = document.querySelectorAll('.ie-carousel-item-228')
    items.forEach(item => {
      const frontLayer = item.querySelector('.ie-layer-front-228') as HTMLElement
      const auroraGlow = item.querySelector('.ie-aurora-glow-228') as HTMLElement

      item.addEventListener('mouseenter', () => {
        if (frontLayer) {
          gsap.to(frontLayer, {
            scale: 1.03,
            duration: 0.4,
            ease: 'power2.out'
          })
        }
        if (auroraGlow) {
          gsap.to(auroraGlow, {
            opacity: auroraIntensity.value / 100,
            duration: 0.3
          })
        }
      })

      item.addEventListener('mouseleave', () => {
        if (frontLayer) {
          gsap.to(frontLayer, {
            scale: 1,
            duration: 0.4,
            ease: 'power2.out'
          })
        }
        if (auroraGlow) {
          gsap.to(auroraGlow, {
            opacity: 0,
            duration: 0.3
          })
        }
      })
    })
  }, extrudeSection.value)
}

// 极光波浪动画
const initAuroraAnimation = () => {
  if (auroraTimeline) {
    auroraTimeline.kill()
  }

  const waves = document.querySelectorAll('.ie-aurora-wave-228')

  auroraTimeline = gsap.timeline({ repeat: -1, yoyo: true })

  waves.forEach((wave, index) => {
    auroraTimeline!.to(wave, {
      xPercent: -50,
      yPercent: -30,
      rotation: 15,
      duration: 3 + index * 0.5,
      ease: 'sine.inOut',
      opacity: 0.3 + (index * 0.15)
    }, 0)
  })
}

// 粒子系统
const initParticles = () => {
  if (!particleCanvas.value) return

  const canvas = particleCanvas.value
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const particles: Array<{
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    opacity: number
    color: string
  }> = []

  const colors = ['#6366f1', '#a855f7', '#ec4899', '#06b6d4', '#f59e0b']

  const createParticle = () => {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)]
    }
  }

  // 创建粒子
  for (let i = 0; i < 100; i++) {
    particles.push(createParticle())
  }

  const animateParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach(particle => {
      particle.x += particle.speedX
      particle.y += particle.speedY

      // 边界检测
      if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
      if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1

      // 绘制粒子
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = particle.color
      ctx.globalAlpha = particle.opacity
      ctx.fill()
    })

    requestAnimationFrame(animateParticles)
  }

  animateParticles()

  // 窗口大小变化时调整画布
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })
}

// 监听参数变化
watch([extrudeDepth, blurIntensity, auroraIntensity], () => {
  updateAuroraEffect()
})

onMounted(() => {
  setTimeout(() => {
    initParticles()
    setTimeout(() => {
      initCarouselAnimation()
    }, 100)
  }, 200)
})

onUnmounted(() => {
  ctx?.revert()
  if (auroraTimeline) {
    auroraTimeline.kill()
  }
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped lang="scss">
.ie-section-228 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  perspective: 2000px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%);
    pointer-events: none;
    animation: bgPulse 8s ease-in-out infinite;
  
  opacity: 1 !important;
  }
}

@keyframes bgPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.ie-bg-gradient-228 {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 30% 70%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 30%, rgba(240, 147, 251, 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: 1;

  opacity: 1 !important;
  }

.ie-particles-228 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;

  opacity: 1 !important;
  }

.ie-header-228 {
  text-align: center;
  margin-bottom: 60px;
  z-index: 10;
  position: relative;

  opacity: 1 !important;
  }

.ie-title-228 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
    margin: 20px auto 0;
    border-radius: 2px;
  
  opacity: 1 !important;
  }
}

.ie-subtitle-228 {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;
  }

// 控制面板
.ie-control-panel-228 {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 25px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 60px;
  z-index: 10;
  position: relative;

  opacity: 1 !important;
  }

.ie-control-group-228 {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 150px;

  opacity: 1 !important;
  }

.ie-label-228 {
  font-size: 14px;
  color: #94a3b8;
  font-weight: 500;

  opacity: 1 !important;
  }

.ie-slider-228 {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.2);
    
  opacity: 1 !important;
  }
  }
}

.ie-value-228 {
  font-size: 13px;
  color: #667eea;
  font-weight: 600;

  opacity: 1 !important;
  }

.ie-mode-btn-228 {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 12px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  
  opacity: 1 !important;
  }

  &.ie-active-228 {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-color: transparent;
  
  opacity: 1 !important;
  }
}

// 3D轮播容器
.ie-extrude-container-228 {
  position: relative;
  width: 100%;
  max-width: 1400px;
  padding: 0 40px;
  z-index: 10;

  opacity: 1 !important;
  }

.ie-carousel-wrapper-228 {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  opacity: 1 !important;
  }

.ie-carousel-track-228 {
  width: 100%;
  height: 450px;
  position: relative;
  transform-style: preserve-3d;
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1 !important;
  }

.ie-carousel-item-228 {
  position: absolute;
  width: 320px;
  height: 240px;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
  transform-style: preserve-3d;

  &
.ie-active-228 {
    .ie-layer-front-228 {
      box-shadow:
        0 40px 80px rgba(102, 126, 234, 0.4),
        0 0 60px rgba(236, 72, 153, 0.3),
        inset 0 0 60px rgba(236, 72, 153, 0.2);
    
  opacity: 1 !important;
  }
  }

  &:hover {
    .ie-layer-front-228 {
      box-shadow:
        0 50px 100px rgba(102, 126, 234, 0.5),
        0 0 80px rgba(236, 72, 153, 0.4),
        inset 0 0 80px rgba(236, 72, 153, 0.3);
    }
  }

  .ie-card-3d-228 {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
  
  opacity: 1 !important;
  }
}

.ie-card-layer-228 {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  backface-visibility: hidden;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

  opacity: 1 !important;
  }

.ie-layer-back-228 {
  background: rgba(99, 102, 241, 0.1);
  border: 2px solid rgba(99, 102, 241, 0.3);

  opacity: 1 !important;
  }

.ie-layer-mid-228 {
  background: rgba(168, 85, 247, 0.05);
  border: 1px solid rgba(168, 85, 247, 0.2);

  opacity: 1 !important;
  }

.ie-layer-front-228 {
  z-index: 100;
  border: 3px solid rgba(236, 72, 153, 0.4);
  box-shadow:
    0 30px 60px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(236, 72, 153, 0.3),
    inset 0 0 60px rgba(236, 72, 153, 0.1);
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);

  opacity: 1 !important;
  }

.ie-layer-content-228 {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 16px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  
  opacity: 1 !important;
  }
}

.ie-carousel-item-228:hover .ie-layer-content-228 img {
  transform: scale(1.1);
}

// 极光遮罩层
.ie-aurora-mask-228 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 50;
  opacity: 0;
  transition: opacity 0.3s;
}

.ie-carousel-item-228.ie-active-228 .ie-aurora-mask-228 {
  opacity: 0.4;
}

.ie-aurora-wave-228 {
  position: absolute;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    135deg,
    rgba(167, 139, 250, 0.3) 0%,
    rgba(96, 165, 250, 0.2) 50%,
    rgba(244, 114, 182, 0.3) 100%
  );
  border-radius: 50%;
  filter: blur(60px);
  mix-blend-mode: screen;

  opacity: 1 !important;
  }

// 模糊层
.ie-blur-layer-228 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  pointer-events: none;
  z-index: 60;
  border-radius: 16px;

  opacity: 1 !important;
  }

// 极光光效
.ie-aurora-glow-228 {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(167, 139, 250, 0.6) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
  mix-blend-mode: overlay;
  pointer-events: none;
  z-index: 101;
}

.ie-card-side-228 {
  backface-visibility: hidden;
  transition: all 0.4s;
}

// 卡片信息
.ie-card-info-228 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, transparent 100%);
  transform: translateY(100%);
  opacity: 0;
  transition: all 0.4s ease;
  z-index: 102;
}

.ie-carousel-item-228:hover .ie-card-info-228 {
  transform: translateY(0);
      opacity: 1;
    }

.ie-card-title-228 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 5px;

  opacity: 1 !important;
  }

.ie-card-desc-228 {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 15px;

  opacity: 1 !important;
  }

.ie-blur-indicator-228 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 0.85rem;
  font-weight: 600;

  opacity: 1 !important;
  }

.ie-blur-from-228 {
  color: #a78bfa;

  opacity: 1 !important;
  }

.ie-blur-arrow-228 {
  color: rgba(255, 255, 255, 0.5);

  opacity: 1 !important;
  }

.ie-blur-to-228 {
  color: #4ade80;

  opacity: 1 !important;
  }

// 轮播导航
.ie-carousel-nav-228 {
  margin-top: 80px;
  display: flex;
  align-items: center;
  gap: 50px;
}

.ie-nav-btn-228 {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
  
  opacity: 1 !important;
  }

  &:hover {
    background: rgba(102, 126, 234, 0.8);
    border-color: #667eea;
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }
}

.ie-indicators-228 {
  display: flex;
  gap: 14px;
}

.ie-indicator-228 {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;

  &.ie-active-228 {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-color: transparent;
    transform: scale(1.4);
    box-shadow: 0 0 15px rgba(102, 126, 234, 0.5);
  
  opacity: 1 !important;
  }

  &:hover {
    transform: scale(1.3);
    border-color: #667eea;
  }
}

// 滚动进度条
.ie-progress-bar-228 {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 40px;

  opacity: 1 !important;
  }

.ie-progress-fill-228 {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
  transition: width 0.3s;

  opacity: 1 !important;
  }

// 装饰性光效
.ie-decorative-lights-228 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

.ie-light-228 {
  position: absolute;
  border-radius: 50%;
  filter: blur(30px);
  animation: lightFloat 6s ease-in-out infinite;
}

.ie-light-1-228 {
  width: 200px;
  height: 200px;
  background: rgba(99, 102, 241, 0.3);
  top: 20%;
  left: 10%;
  animation-delay: 0s;

  opacity: 1 !important;
  }

.ie-light-2-228 {
  width: 250px;
  height: 250px;
  background: rgba(168, 85, 247, 0.3);
  top: 60%;
  right: 15%;
  animation-delay: 2s;

  opacity: 1 !important;
  }

.ie-light-3-228 {
  width: 180px;
  height: 180px;
  background: rgba(236, 72, 153, 0.3);
  bottom: 20%;
  left: 30%;
  animation-delay: 4s;

  opacity: 1 !important;
  }

@keyframes lightFloat {
  0%, 100% {
    transform: translate(0, 0);
  }
  33% {
    transform: translate(20px, -20px);
  }
  66% {
    transform: translate(-15px, 15px);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .ie-title-228 {
    font-size: 2rem;
  
  opacity: 1 !important;
  }

  .ie-subtitle-228 {
    font-size: 0.9rem;
    letter-spacing: 0.1em;
  
  opacity: 1 !important;
  }

  .ie-control-panel-228 {
    padding: 20px;
    gap: 20px;
  
  opacity: 1 !important;
  }

  .ie-control-group-228 {
    min-width: 120px;
  
  opacity: 1 !important;
  }

  .ie-extrude-container-228 {
    padding: 0 20px;
  
  opacity: 1 !important;
  }

  .ie-carousel-track-228 {
    height: 350px;
  
  opacity: 1 !important;
  }

  .ie-carousel-item-228 {
    width: 260px;
    height: 195px;
  
  opacity: 1 !important;
  }

  .ie-carousel-nav-228 {
    gap: 30px;
  }

  .ie-nav-btn-228 {
    width: 46px;
    height: 46px;

    svg {
      width: 20px;
      height: 20px;
    
  opacity: 1 !important;
  }
  }

  .ie-indicator-228 {
    width: 12px;
    height: 12px;
  
  opacity: 1 !important;
  }

  .ie-light-228 {
    width: 120px;
    height: 120px;
  
  opacity: 1 !important;
  }
}

@media (max-width: 480px) {
  .ie-control-panel-228 {
    flex-direction: column;
    align-items: stretch;
  }

  .ie-control-group-228 {
    min-width: auto;
  
  opacity: 1 !important;
  }
}
</style>
