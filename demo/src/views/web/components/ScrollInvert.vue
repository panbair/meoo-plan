<template>
  <div class="scroll-invert-wrapper-223">
    <div class="si-container-223">
      <!-- 标题区域 -->
      <div class="si-header-223">
        <h1 class="si-title-223">INVERT COLORS</h1>
        <p class="si-subtitle-223">色彩反转特效动画</p>
      </div>

      <!-- 01. 基础反转 -->
      <div class="si-section-223">
        <div class="si-section-title-223">01. 基础反转</div>
        <div class="si-demo-223" ref="basicInvertRef">
          <div class="si-card-223 si-basic-card-223">
            <div class="si-card-content-223">
              <h3>HOVER ME</h3>
              <p>鼠标悬停反转颜色</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 02. 渐进反转 -->
      <div class="si-section-223">
        <div class="si-section-title-223">02. 渐进反转</div>
        <div class="si-demo-223" ref="progressiveInvertRef">
          <div class="si-card-223 si-progressive-card-223">
            <div class="si-card-content-223">
              <h3>SCROLL</h3>
              <p>滚动控制反转程度</p>
              <div class="si-progress-223">
                <div class="si-progress-bar-223"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 03. 卡片网格 -->
      <div class="si-section-223">
        <div class="si-section-title-223">03. 卡片网格</div>
        <div class="si-grid-223" ref="gridRef">
          <div class="si-grid-card-223">
            <div class="si-grid-icon-223">🎨</div>
            <h4>Card 1</h4>
          </div>
          <div class="si-grid-card-223">
            <div class="si-grid-icon-223">🌟</div>
            <h4>Card 2</h4>
          </div>
          <div class="si-grid-card-223">
            <div class="si-grid-icon-223">🚀</div>
            <h4>Card 3</h4>
          </div>
          <div class="si-grid-card-223">
            <div class="si-grid-icon-223">💡</div>
            <h4>Card 4</h4>
          </div>
          <div class="si-grid-card-223">
            <div class="si-grid-icon-223">🎯</div>
            <h4>Card 5</h4>
          </div>
          <div class="si-grid-card-223">
            <div class="si-grid-icon-223">⚡</div>
            <h4>Card 6</h4>
          </div>
        </div>
      </div>

      <!-- 04. 图像反转 -->
      <div class="si-section-223">
        <div class="si-section-title-223">04. 图像反转</div>
        <div class="si-images-223" ref="imageRef">
          <div class="si-image-223 si-purple-223">
            <div class="si-image-content-223">PURPLE</div>
          </div>
          <div class="si-image-223 si-blue-223">
            <div class="si-image-content-223">BLUE</div>
          </div>
          <div class="si-image-223 si-green-223">
            <div class="si-image-content-223">GREEN</div>
          </div>
        </div>
      </div>

      <!-- 05. 文字反转 -->
      <div class="si-section-223">
        <div class="si-section-title-223">05. 文字反转</div>
        <div class="si-text-223" ref="textRef">
          <div class="si-text-line-223">INVERT TEXT</div>
          <div class="si-text-line-223">COLOR FLIP</div>
          <div class="si-text-line-223">EFFECT</div>
        </div>
      </div>

      <!-- 06. 按钮反转 -->
      <div class="si-section-223">
        <div class="si-section-title-223">06. 按钮反转</div>
        <div class="si-buttons-223" ref="buttonRef">
          <button class="si-button-223 si-primary-223">Primary</button>
          <button class="si-button-223 si-secondary-223">Secondary</button>
          <button class="si-button-223 si-tertiary-223">Tertiary</button>
        </div>
      </div>

      <!-- 07. 交替反转 -->
      <div class="si-section-223">
        <div class="si-section-title-223">07. 交替反转</div>
        <div class="si-alternate-223" ref="alternateRef">
          <div class="si-alternate-item-223">Item 1</div>
          <div class="si-alternate-item-223">Item 2</div>
          <div class="si-alternate-item-223">Item 3</div>
          <div class="si-alternate-item-223">Item 4</div>
          <div class="si-alternate-item-223">Item 5</div>
          <div class="si-alternate-item-223">Item 6</div>
        </div>
      </div>

      <!-- 08. 混合反转 -->
      <div class="si-section-223">
        <div class="si-section-title-223">08. 混合反转</div>
        <div class="si-mix-223" ref="mixRef">
          <div class="si-mix-item-223">
            <div class="si-mix-circle-223 si-color-1-223"></div>
            <span>Invert + Rotate</span>
          </div>
          <div class="si-mix-item-223">
            <div class="si-mix-circle-223 si-color-2-223"></div>
            <span>Invert + Scale</span>
          </div>
          <div class="si-mix-item-223">
            <div class="si-mix-circle-223 si-color-3-223"></div>
            <span>Invert + Blur</span>
          </div>
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
const basicInvertRef = ref<HTMLElement | null>(null)
const progressiveInvertRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)
const buttonRef = ref<HTMLElement | null>(null)
const alternateRef = ref<HTMLElement | null>(null)
const mixRef = ref<HTMLElement | null>(null)

let tl: gsap.core.Timeline | null = null
let scrollHandler: (() => void) | null = null

onMounted(() => {
  initInvertEffects()
})

onUnmounted(() => {
  if (tl) tl.kill()
  gsap.killTweensOf('*')
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
    scrollHandler = null
  }
})

const initInvertEffects = () => {
  tl = gsap.timeline()

  // 为所有section添加滚动入场动画
  const sections = document.querySelectorAll('.si-section-223')
  sections.forEach((section, index) => {
    gsap.from(section, {
      opacity: 0,
      y: 100,
      filter: 'invert(1)',
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

  initBasicInvert()
  initProgressiveInvert()
  initGridInvert()
  initImageInvert()
  initTextInvert()
  initButtonInvert()
  initAlternateInvert()
  initMixInvert()
}

// 01. 基础反转
const initBasicInvert = () => {
  if (!basicInvertRef.value) return

  const card = basicInvertRef.value.querySelector('.si-basic-card-223')
  if (!card) return

  // 鼠标悬停反转
  card.addEventListener('mouseenter', () => {
    gsap.to(card, {
      filter: 'invert(1)',
      duration: 0.3,
      ease: 'power2.inOut'
    })
  })

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      filter: 'invert(0)',
      duration: 0.3,
      ease: 'power2.inOut'
    })
  })
}

// 02. 渐进反转
const initProgressiveInvert = () => {
  if (!progressiveInvertRef.value) return

  const card = progressiveInvertRef.value.querySelector('.si-progressive-card-223')
  const progressBar = progressiveInvertRef.value.querySelector('.si-progress-bar-223')

  if (!card || !progressBar) return

  // 滚动控制反转
  scrollHandler = () => {
    if (!progressiveInvertRef.value) return

    const rect = progressiveInvertRef.value.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const progress = Math.max(0, Math.min(1, 1 - rect.top / (rect.height + windowHeight)))

    gsap.to(card, {
      filter: `invert(${progress})`,
      duration: 0.1
    })

    gsap.to(progressBar, {
      width: `${progress * 100}%`,
      duration: 0.1
    })
  }

  window.addEventListener('scroll', scrollHandler)
}

// 03. 卡片网格
const initGridInvert = () => {
  if (!gridRef.value) return

  const cards = gridRef.value.querySelectorAll('.si-grid-card-223')

  cards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        filter: 'invert(1)',
        scale: 1.05,
        duration: 0.3,
        ease: 'back.out(1.7)'
      })
    })

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        filter: 'invert(0)',
        scale: 1,
        duration: 0.3,
        ease: 'power2.inOut'
      })
    })
  })
}

// 04. 图像反转
const initImageInvert = () => {
  if (!imageRef.value) return

  const images = imageRef.value.querySelectorAll('.si-image-223')

  images.forEach((image, index) => {
    // 持续反转动画
    gsap.to(image, {
      filter: 'invert(1)',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      delay: index * 0.5
    })

    // 鼠标悬停暂停
    image.addEventListener('mouseenter', () => {
      gsap.to(image, {
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out'
      })
    })

    image.addEventListener('mouseleave', () => {
      gsap.to(image, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.inOut'
      })
    })
  })
}

// 05. 文字反转
const initTextInvert = () => {
  if (!textRef.value) return

  const lines = textRef.value.querySelectorAll('.si-text-line-223')

  // 依次反转动画
  gsap.to(lines, {
    filter: 'invert(1)',
    duration: 1,
    stagger: {
      each: 0.3,
      repeat: -1,
      yoyo: true
    },
    ease: 'power2.inOut'
  })
}

// 06. 按钮反转
const initButtonInvert = () => {
  if (!buttonRef.value) return

  const buttons = buttonRef.value.querySelectorAll('.si-button-223')

  buttons.forEach((button) => {
    button.addEventListener('mouseenter', () => {
      gsap.to(button, {
        filter: 'invert(1)',
        y: -3,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        duration: 0.3,
        ease: 'power2.out'
      })
    })

    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        filter: 'invert(0)',
        y: 0,
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        duration: 0.3,
        ease: 'power2.inOut'
      })
    })
  })
}

// 07. 交替反转
const initAlternateInvert = () => {
  if (!alternateRef.value) return

  const items = alternateRef.value.querySelectorAll('.si-alternate-item-223')

  // 波浪反转效果
  gsap.to(items, {
    filter: (index) => (index % 2 === 0 ? 'invert(1)' : 'invert(0)'),
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut'
  })

  items.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      gsap.to(item, {
        filter: 'invert(1)',
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out'
      })
    })

    item.addEventListener('mouseleave', () => {
      gsap.to(item, {
        filter: 'invert(0)',
        scale: 1,
        duration: 0.3,
        ease: 'power2.inOut'
      })
    })
  })
}

// 08. 混合反转
const initMixInvert = () => {
  if (!mixRef.value) return

  const circles = mixRef.value.querySelectorAll('.si-mix-circle-223')

  // Invert + Rotate
  gsap.to(circles[0], {
    filter: 'invert(1)',
    rotation: 360,
    duration: 2,
    repeat: -1,
    ease: 'none'
  })

  // Invert + Scale
  gsap.to(circles[1], {
    filter: 'invert(1)',
    scale: 1.5,
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut'
  })

  // Invert + Blur
  gsap.to(circles[2], {
    filter: 'invert(1) blur(5px)',
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut'
  })
}
</script>

<style scoped>
.scroll-invert-wrapper-223 {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 20px;
  position: relative;
}

.si-container-223 {
  max-width: 1200px;
  margin: 0 auto;
}

/* 标题区域 */
.si-header-223 {
  text-align: center;
  margin-bottom: 80px;
}

.si-title-223 {
  font-size: 64px;
  font-weight: 900;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 8px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.si-subtitle-223 {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 16px;
  letter-spacing: 4px;
}

/* 区域 */
.si-section-223 {
  margin-bottom: 60px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.si-section-title-223 {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 30px;
  position: relative;
  padding-left: 20px;
}

.si-section-title-223::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: linear-gradient(180deg, #fff, rgba(255, 255, 255, 0.3));
  border-radius: 2px;
}

/* 演示容器 */
.si-demo-223 {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

/* 01. 基础反转 */
.si-basic-card-223 {
  width: 300px;
  height: 200px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s;
}

.si-basic-card-223:hover {
  transform: scale(1.05);
}

.si-card-content-223 {
  text-align: center;
  color: #fff;
}

.si-card-content-223 h3 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.si-card-content-223 p {
  font-size: 16px;
  opacity: 0.9;
}

/* 02. 渐进反转 */
.si-progressive-card-223 {
  width: 300px;
  height: 200px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 20px;
}

.si-progress-223 {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  margin-top: 20px;
  overflow: hidden;
}

.si-progress-bar-223 {
  height: 100%;
  width: 0%;
  background: #fff;
  border-radius: 3px;
  transition: width 0.1s;
}

/* 03. 卡片网格 */
.si-grid-223 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.si-grid-card-223 {
  background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s;
}

.si-grid-icon-223 {
  font-size: 48px;
  margin-bottom: 15px;
}

.si-grid-card-223 h4 {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

/* 04. 图像反转 */
.si-images-223 {
  display: flex;
  gap: 30px;
  justify-content: center;
}

.si-image-223 {
  width: 200px;
  height: 150px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s;
}

.si-image-223:hover {
  transform: scale(1.1);
}

.si-purple-223 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.si-blue-223 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.si-green-223 {
  background: linear-gradient(135deg, #38ef7d 0%, #11998e 100%);
}

.si-image-content-223 {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

/* 05. 文字反转 */
.si-text-223 {
  text-align: center;
  padding: 60px;
}

.si-text-line-223 {
  font-size: 48px;
  font-weight: 900;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 10px;
  margin-bottom: 20px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

/* 06. 按钮反转 */
.si-buttons-223 {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.si-button-223 {
  padding: 15px 40px;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.si-button-223:hover {
  transform: translateY(-3px);
}

.si-primary-223 {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: #fff;
}

.si-secondary-223 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: #fff;
}

.si-tertiary-223 {
  background: linear-gradient(135deg, #38ef7d 0%, #11998e 100%);
  color: #fff;
}

/* 07. 交替反转 */
.si-alternate-223 {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.si-alternate-item-223 {
  padding: 20px 40px;
  background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: transform 0.3s;
}

.si-alternate-item-223:hover {
  transform: scale(1.1);
}

/* 08. 混合反转 */
.si-mix-223 {
  display: flex;
  gap: 40px;
  justify-content: center;
  flex-wrap: wrap;
}

.si-mix-item-223 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.si-mix-circle-223 {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.si-color-1-223 {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
}

.si-color-2-223 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.si-color-3-223 {
  background: linear-gradient(135deg, #38ef7d 0%, #11998e 100%);
}

.si-mix-item-223 span {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

/* 响应式 */
@media (max-width: 768px) {
  .si-title-223 {
    font-size: 36px;
    letter-spacing: 4px;
  }

  .si-section-223 {
    padding: 20px;
  }

  .si-grid-223 {
    grid-template-columns: repeat(2, 1fr);
  }

  .si-text-line-223 {
    font-size: 32px;
    letter-spacing: 5px;
  }

  .si-images-223 {
    flex-direction: column;
    align-items: center;
  }

  .si-buttons-223 {
    flex-direction: column;
  }
}
</style>
