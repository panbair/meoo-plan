<template>
  <div class="scroll-hue-rotate-wrapper-224">
    <div class="shr-container-224">
      <!-- 标题区域 -->
      <div class="shr-header-224">
        <h1 class="shr-title-224">HUE ROTATE</h1>
        <p class="shr-subtitle-224">色相旋转特效动画</p>
      </div>

      <!-- 01. 基础旋转 -->
      <div class="shr-section-224">
        <div class="shr-section-title-224">01. 基础旋转</div>
        <div class="shr-demo-224" ref="basicRotateRef">
          <div class="shr-card-224 shr-basic-card-224">
            <div class="shr-card-content-224">
              <h3>HOVER ME</h3>
              <p>鼠标悬停旋转色相</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 02. 持续旋转 -->
      <div class="shr-section-224">
        <div class="shr-section-title-224">02. 持续旋转</div>
        <div class="shr-demo-224" ref="continuousRotateRef">
          <div class="shr-circle-224"></div>
        </div>
      </div>

      <!-- 03. 渐进旋转 -->
      <div class="shr-section-224">
        <div class="shr-section-title-224">03. 渐进旋转</div>
        <div class="shr-demo-224" ref="progressiveRotateRef">
          <div class="shr-progressive-card-224">
            <div class="shr-card-content-224">
              <h3>SCROLL</h3>
              <p>滚动控制旋转角度</p>
              <div class="shr-angle-display-224">
                <span id="angleValue">0</span>°
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 04. 彩虹卡片 -->
      <div class="shr-section-224">
        <div class="shr-section-title-224">04. 彩虹卡片</div>
        <div class="shr-grid-224" ref="rainbowRef">
          <div class="shr-rainbow-card-223">
            <div class="shr-rainbow-icon-223">🌈</div>
            <h4>Card 1</h4>
          </div>
          <div class="shr-rainbow-card-223">
            <div class="shr-rainbow-icon-223">🎨</div>
            <h4>Card 2</h4>
          </div>
          <div class="shr-rainbow-card-223">
            <div class="shr-rainbow-icon-223">✨</div>
            <h4>Card 3</h4>
          </div>
          <div class="shr-rainbow-card-223">
            <div class="shr-rainbow-icon-223">🎭</div>
            <h4>Card 4</h4>
          </div>
          <div class="shr-rainbow-card-223">
            <div class="shr-rainbow-icon-223">🎪</div>
            <h4>Card 5</h4>
          </div>
          <div class="shr-rainbow-card-223">
            <div class="shr-rainbow-icon-223">🎢</div>
            <h4>Card 6</h4>
          </div>
        </div>
      </div>

      <!-- 05. 图像旋转 -->
      <div class="shr-section-224">
        <div class="shr-section-title-224">05. 图像旋转</div>
        <div class="shr-images-224" ref="imageRotateRef">
          <div class="shr-image-224 shr-purple-224">
            <div class="shr-image-content-224">PURPLE</div>
          </div>
          <div class="shr-image-224 shr-red-224">
            <div class="shr-image-content-224">RED</div>
          </div>
          <div class="shr-image-224 shr-orange-224">
            <div class="shr-image-content-224">ORANGE</div>
          </div>
        </div>
      </div>

      <!-- 06. 文字旋转 -->
      <div class="shr-section-224">
        <div class="shr-section-title-224">06. 文字旋转</div>
        <div class="shr-text-224" ref="textRotateRef">
          <div class="shr-text-line-224">RAINBOW</div>
          <div class="shr-text-line-224">COLORS</div>
          <div class="shr-text-line-224">SPECTRUM</div>
        </div>
      </div>

      <!-- 07. 按钮旋转 -->
      <div class="shr-section-224">
        <div class="shr-section-title-224">07. 按钮旋转</div>
        <div class="shr-buttons-224" ref="buttonRotateRef">
          <button class="shr-button-224 shr-btn-red-224">Red</button>
          <button class="shr-button-224 shr-btn-green-224">Green</button>
          <button class="shr-button-224 shr-btn-blue-224">Blue</button>
        </div>
      </div>

      <!-- 08. 交替旋转 -->
      <div class="shr-section-224">
        <div class="shr-section-title-224">08. 交替旋转</div>
        <div class="shr-alternate-224" ref="alternateRotateRef">
          <div class="shr-alternate-item-224">Item 1</div>
          <div class="shr-alternate-item-224">Item 2</div>
          <div class="shr-alternate-item-224">Item 3</div>
          <div class="shr-alternate-item-224">Item 4</div>
          <div class="shr-alternate-item-224">Item 5</div>
          <div class="shr-alternate-item-224">Item 6</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Refs
const basicRotateRef = ref<HTMLElement | null>(null)
const continuousRotateRef = ref<HTMLElement | null>(null)
const progressiveRotateRef = ref<HTMLElement | null>(null)
const rainbowRef = ref<HTMLElement | null>(null)
const imageRotateRef = ref<HTMLElement | null>(null)
const textRotateRef = ref<HTMLElement | null>(null)
const buttonRotateRef = ref<HTMLElement | null>(null)
const alternateRotateRef = ref<HTMLElement | null>(null)

let tl: gsap.core.Timeline | null = null

onMounted(() => {
  initHueRotateEffects()
})

onUnmounted(() => {
  if (tl) tl.kill()
  gsap.killTweensOf('*')
  window.removeEventListener('scroll', scrollHandler)
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})

const initHueRotateEffects = () => {
  tl = gsap.timeline()

  // 为所有section添加滚动入场动画
  const sections = document.querySelectorAll('.shr-section-224')
  sections.forEach((section, index) => {
    gsap.from(section, {
      opacity: 0,
      y: 100,
      rotation: -10,
      filter: 'hue-rotate(180deg)',
      duration: 0.8,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse'
      }
    })
  })

  initBasicRotate()
  initContinuousRotate()
  initProgressiveRotate()
  initRainbowRotate()
  initImageRotate()
  initTextRotate()
  initButtonRotate()
  initAlternateRotate()
}

// 01. 基础旋转
const initBasicRotate = () => {
  if (!basicRotateRef.value) return

  const card = basicRotateRef.value.querySelector('.shr-basic-card-224')
  if (!card) return

  card.addEventListener('mouseenter', () => {
    gsap.to(card, {
      filter: 'hue-rotate(360deg)',
      duration: 0.8,
      ease: 'power2.inOut'
    })
  })

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      filter: 'hue-rotate(0deg)',
      duration: 0.8,
      ease: 'power2.inOut'
    })
  })
}

// 02. 持续旋转
const initContinuousRotate = () => {
  if (!continuousRotateRef.value) return

  const circle = continuousRotateRef.value.querySelector('.shr-circle-224')
  if (!circle) return

  gsap.to(circle, {
    filter: 'hue-rotate(360deg)',
    duration: 3,
    repeat: -1,
    ease: 'none'
  })
}

// 03. 渐进旋转
const scrollHandler = () => {
  if (!progressiveRotateRef.value) return

  const card = progressiveRotateRef.value.querySelector('.shr-progressive-card-224')
  const angleValue = document.getElementById('angleValue')

  if (!card || !angleValue) return

  const rect = progressiveRotateRef.value.getBoundingClientRect()
  const windowHeight = window.innerHeight
  const progress = Math.max(0, Math.min(1, 1 - rect.top / (rect.height + windowHeight)))

  const angle = Math.floor(progress * 360)

  gsap.to(card, {
    filter: `hue-rotate(${angle}deg)`,
    duration: 0.1
  })

  angleValue.textContent = angle.toString()
}

const initProgressiveRotate = () => {
  window.addEventListener('scroll', scrollHandler)
}

// 04. 彩虹卡片
const initRainbowRotate = () => {
  if (!rainbowRef.value) return

  const cards = rainbowRef.value.querySelectorAll('.shr-rainbow-card-223')

  cards.forEach((card, index) => {
    // 自动旋转
    gsap.to(card, {
      filter: 'hue-rotate(360deg)',
      duration: 4,
      repeat: -1,
      ease: 'none',
      delay: index * 0.5
    })

    // 悬停暂停并加速
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        filter: 'hue-rotate(360deg)',
        duration: 0.5,
        repeat: -1,
        ease: 'none'
      })
    })

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        filter: 'hue-rotate(360deg)',
        duration: 4,
        repeat: -1,
        ease: 'none'
      })
    })
  })
}

// 05. 图像旋转
const initImageRotate = () => {
  if (!imageRotateRef.value) return

  const images = imageRotateRef.value.querySelectorAll('.shr-image-224')

  images.forEach((image, index) => {
    gsap.to(image, {
      filter: 'hue-rotate(360deg)',
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      delay: index * 0.8
    })

    image.addEventListener('mouseenter', () => {
      gsap.to(image, {
        filter: 'hue-rotate(720deg)',
        duration: 0.5,
        ease: 'power2.inOut'
      })
    })

    image.addEventListener('mouseleave', () => {
      gsap.to(image, {
        filter: 'hue-rotate(360deg)',
        duration: 0.5,
        ease: 'power2.inOut'
      })
    })
  })
}

// 06. 文字旋转
const initTextRotate = () => {
  if (!textRotateRef.value) return

  const lines = textRotateRef.value.querySelectorAll('.shr-text-line-224')

  lines.forEach((line, index) => {
    gsap.to(line, {
      filter: 'hue-rotate(360deg)',
      duration: 3,
      repeat: -1,
      ease: 'none',
      delay: index * 0.3
    })
  })
}

// 07. 按钮旋转
const initButtonRotate = () => {
  if (!buttonRotateRef.value) return

  const buttons = buttonRotateRef.value.querySelectorAll('.shr-button-224')

  buttons.forEach((button, index) => {
    button.addEventListener('mouseenter', () => {
      gsap.to(button, {
        filter: `hue-rotate(${(index + 1) * 60}deg)`,
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out'
      })
    })

    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        filter: 'hue-rotate(0deg)',
        scale: 1,
        duration: 0.3,
        ease: 'power2.inOut'
      })
    })
  })
}

// 08. 交替旋转
const initAlternateRotate = () => {
  if (!alternateRotateRef.value) return

  const items = alternateRotateRef.value.querySelectorAll('.shr-alternate-item-224')

  items.forEach((item, index) => {
    gsap.to(item, {
      filter: 'hue-rotate(360deg)',
      duration: 2,
      repeat: -1,
      ease: 'none',
      delay: index * 0.2
    })

    // 反向旋转
    if (index % 2 === 1) {
      gsap.to(item, {
        filter: 'hue-rotate(-360deg)',
        duration: 2,
        repeat: -1,
        ease: 'none'
      })
    }

    item.addEventListener('mouseenter', () => {
      gsap.to(item, {
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out'
      })
    })

    item.addEventListener('mouseleave', () => {
      gsap.to(item, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.inOut'
      })
    })
  })
}
</script>

<style scoped>
.scroll-hue-rotate-wrapper-224 {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 60px 20px;
  position: relative;
}

.shr-container-224 {
  max-width: 1200px;
  margin: 0 auto;
}

/* 标题区域 */
.shr-header-224 {
  text-align: center;
  margin-bottom: 80px;
}

.shr-title-224 {
  font-size: 64px;
  font-weight: 900;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ff6b6b);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-transform: uppercase;
  letter-spacing: 8px;
  animation: shrTitleAnim 3s linear infinite;
}

@keyframes shrTitleAnim {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}

.shr-subtitle-224 {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 16px;
  letter-spacing: 4px;
}

/* 区域 */
.shr-section-224 {
  margin-bottom: 60px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.shr-section-title-224 {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 30px;
  position: relative;
  padding-left: 20px;
}

.shr-section-title-224::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: linear-gradient(180deg, #ff6b6b, #4ecdc4);
  border-radius: 2px;
}

/* 演示容器 */
.shr-demo-224 {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

/* 01. 基础旋转 */
.shr-basic-card-224 {
  width: 300px;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s;
}

.shr-basic-card-224:hover {
  transform: scale(1.05);
}

.shr-card-content-224 {
  text-align: center;
  color: #fff;
}

.shr-card-content-224 h3 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.shr-card-content-224 p {
  font-size: 16px;
  opacity: 0.9;
}

/* 02. 持续旋转 */
.shr-circle-224 {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #ff6b6b,
    #4ecdc4,
    #45b7d1,
    #96ceb4,
    #ff6b6b
  );
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

/* 03. 渐进旋转 */
.shr-progressive-card-224 {
  width: 300px;
  height: 200px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 20px;
}

.shr-angle-display-224 {
  font-size: 48px;
  font-weight: 900;
  color: #fff;
  margin-top: 10px;
}

.shr-angle-display-224 span {
  font-size: 64px;
  font-weight: 900;
  background: linear-gradient(90deg, #fff, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 04. 彩虹卡片 */
.shr-grid-224 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.shr-rainbow-card-223 {
  background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%);
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s;
}

.shr-rainbow-card-223:hover {
  transform: scale(1.05);
}

.shr-rainbow-icon-223 {
  font-size: 48px;
  margin-bottom: 15px;
}

.shr-rainbow-card-223 h4 {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

/* 05. 图像旋转 */
.shr-images-224 {
  display: flex;
  gap: 30px;
  justify-content: center;
}

.shr-image-224 {
  width: 200px;
  height: 150px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s;
}

.shr-image-224:hover {
  transform: scale(1.1);
}

.shr-purple-224 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.shr-red-224 {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
}

.shr-orange-224 {
  background: linear-gradient(135deg, #f0932b 0%, #ffbe76 100%);
}

.shr-image-content-224 {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

/* 06. 文字旋转 */
.shr-text-224 {
  text-align: center;
  padding: 60px;
}

.shr-text-line-224 {
  font-size: 64px;
  font-weight: 900;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-transform: uppercase;
  letter-spacing: 10px;
  margin-bottom: 20px;
}

/* 07. 按钮旋转 */
.shr-buttons-224 {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.shr-button-224 {
  padding: 15px 40px;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  color: #fff;
  transition: transform 0.3s;
}

.shr-button-224:hover {
  transform: scale(1.1);
}

.shr-btn-red-224 {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
}

.shr-btn-green-224 {
  background: linear-gradient(135deg, #4ecdc4 0%, #44bd32 100%);
}

.shr-btn-blue-224 {
  background: linear-gradient(135deg, #45b7d1 0%, #2d98da 100%);
}

/* 08. 交替旋转 */
.shr-alternate-224 {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.shr-alternate-item-224 {
  padding: 20px 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: transform 0.3s;
}

.shr-alternate-item-224:hover {
  transform: scale(1.1);
}

/* 响应式 */
@media (max-width: 768px) {
  .shr-title-224 {
    font-size: 36px;
    letter-spacing: 4px;
  }

  .shr-section-224 {
    padding: 20px;
  }

  .shr-grid-224 {
    grid-template-columns: repeat(2, 1fr);
  }

  .shr-text-line-224 {
    font-size: 36px;
    letter-spacing: 5px;
  }

  .shr-images-224 {
    flex-direction: column;
    align-items: center;
  }

  .shr-buttons-224 {
    flex-direction: column;
  }
}
</style>
