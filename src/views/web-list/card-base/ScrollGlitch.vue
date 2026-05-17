<template>
  <div class="scroll-glitch-wrapper-222">
    <div class="sg-container-222">
      <!-- 标题区域 -->
      <div class="sg-header-222">
        <h1 class="sg-title-222">GLITCH ART</h1>
        <p class="sg-subtitle-222">故障艺术风格动画效果</p>
      </div>

      <!-- 01. 文字故障 -->
      <div class="sg-section-222">
        <div class="sg-section-title-222">01. 文字故障</div>
        <div class="sg-glitch-text-wrapper-222" ref="glitchTextRef">
          <span class="sg-glitch-text-222" data-text="GLITCH">GLITCH</span>
        </div>
      </div>

      <!-- 02. 图片故障 -->
      <div class="sg-section-222">
        <div class="sg-section-title-222">02. 图片故障</div>
        <div class="sg-glitch-image-wrapper-222" ref="glitchImageRef">
          <div class="sg-glitch-image-222"></div>
          <div class="sg-glitch-image-222 sg-red-layer-222"></div>
          <div class="sg-glitch-image-222 sg-blue-layer-222"></div>
        </div>
      </div>

      <!-- 03. 扫描线效果 -->
      <div class="sg-section-222">
        <div class="sg-section-title-222">03. 扫描线效果</div>
        <div class="sg-scan-wrapper-222" ref="scanRef">
          <div class="sg-scan-content-222">
            <h3 class="sg-scan-title-222">SCAN LINES</h3>
            <p class="sg-scan-text-222">扫描线故障效果</p>
          </div>
          <div class="sg-scan-line-222"></div>
        </div>
      </div>

      <!-- 04. RGB分离 -->
      <div class="sg-section-222">
        <div class="sg-section-title-222">04. RGB分离</div>
        <div class="sg-rgb-wrapper-222" ref="rgbRef">
          <div class="sg-rgb-content-222">
            <span class="sg-rgb-text-222 sg-red-222">RGB</span>
            <span class="sg-rgb-text-222 sg-green-222">RGB</span>
            <span class="sg-rgb-text-222 sg-blue-222">RGB</span>
          </div>
        </div>
      </div>

      <!-- 05. 残影效果 -->
      <div class="sg-section-222">
        <div class="sg-section-title-222">05. 残影效果</div>
        <div class="sg-ghost-wrapper-222" ref="ghostRef">
          <div class="sg-ghost-item-222">GHOST</div>
        </div>
      </div>

      <!-- 06. 数据故障 -->
      <div class="sg-section-222">
        <div class="sg-section-title-222">06. 数据故障</div>
        <div class="sg-data-wrapper-222" ref="dataRef">
          <div class="sg-data-text-222" id="dataText">
            SYSTEM ERROR
          </div>
        </div>
      </div>

      <!-- 07. 块状故障 -->
      <div class="sg-section-222">
        <div class="sg-section-title-222">07. 块状故障</div>
        <div class="sg-block-wrapper-222" ref="blockRef">
          <div class="sg-block-content-222">BLOCK</div>
        </div>
      </div>

      <!-- 08. 信号干扰 -->
      <div class="sg-section-222">
        <div class="sg-section-title-222">08. 信号干扰</div>
        <div class="sg-signal-wrapper-222" ref="signalRef">
          <div class="sg-signal-content-222">SIGNAL</div>
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
const glitchTextRef = ref<HTMLElement | null>(null)
const glitchImageRef = ref<HTMLElement | null>(null)
const scanRef = ref<HTMLElement | null>(null)
const rgbRef = ref<HTMLElement | null>(null)
const ghostRef = ref<HTMLElement | null>(null)
const dataRef = ref<HTMLElement | null>(null)
const blockRef = ref<HTMLElement | null>(null)
const signalRef = ref<HTMLElement | null>(null)

let tl: gsap.core.Timeline | null = null
let dataInterval: number | null = null

onMounted(() => {
  initGlitchEffects()
})

onUnmounted(() => {
  if (tl) tl.kill()
  if (dataInterval) clearInterval(dataInterval)
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})

const initGlitchEffects = () => {
  tl = gsap.timeline()

  // 为所有section添加滚动入场动画
  const sections = document.querySelectorAll('.sg-section-222')
  sections.forEach((section, index) => {
    gsap.from(section, {
      opacity: 0,
      y: 100,
      scale: 0.8,
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

  // 01. 文字故障
  initTextGlitch()

  // 02. 图片故障
  initImageGlitch()

  // 03. 扫描线效果
  initScanEffect()

  // 04. RGB分离
  initRgbEffect()

  // 05. 残影效果
  initGhostEffect()

  // 06. 数据故障
  initDataEffect()

  // 07. 块状故障
  initBlockEffect()

  // 08. 信号干扰
  initSignalEffect()
}

// 01. 文字故障
const initTextGlitch = () => {
  if (!glitchTextRef.value) return

  const glitchText = glitchTextRef.value.querySelector('.sg-glitch-text-222')

  if (!glitchText) return

  // 持续故障动画
  gsap.to(glitchText, {
    duration: 0.1,
    x: -5,
    repeat: 1,
    yoyo: true,
    ease: 'steps(1)'
  })

  // 随机故障效果
  const randomGlitch = () => {
    gsap.to(glitchText, {
      x: () => gsap.utils.random(-10, 10),
      y: () => gsap.utils.random(-5, 5),
      skewX: () => gsap.utils.random(-10, 10),
      duration: 0.05,
      ease: 'steps(1)',
      onComplete: () => {
        gsap.to(glitchText, {
          x: 0,
          y: 0,
          skewX: 0,
          duration: 0.05,
          ease: 'steps(1)'
        })
      }
    })
  }

  setInterval(randomGlitch, 2000)
}

// 02. 图片故障
const initImageGlitch = () => {
  if (!glitchImageRef.value) return

  const images = glitchImageRef.value.querySelectorAll('.sg-glitch-image-222')

  if (images.length < 3) return

  const [baseImage, redLayer, blueLayer] = images

  // 红色层故障
  gsap.to(redLayer, {
    x: () => gsap.utils.random(-20, -10),
    duration: 0.1,
    repeat: -1,
    yoyo: true,
    ease: 'steps(1)'
  })

  // 蓝色层故障
  gsap.to(blueLayer, {
    x: () => gsap.utils.random(10, 20),
    duration: 0.08,
    repeat: -1,
    yoyo: true,
    ease: 'steps(1)'
  })

  // 随机切片效果
  const sliceGlitch = () => {
    gsap.to([redLayer, blueLayer], {
      clipPath: () => `inset(${gsap.utils.random(0, 100)}% 0 ${gsap.utils.random(0, 100)}% 0)`,
      duration: 0.05,
      ease: 'steps(1)',
      onComplete: () => {
        gsap.to([redLayer, blueLayer], {
          clipPath: 'inset(0 0 0 0)',
          duration: 0.05,
          ease: 'steps(1)'
        })
      }
    })
  }

  setInterval(sliceGlitch, 1500)
}

// 03. 扫描线效果
const initScanEffect = () => {
  if (!scanRef.value) return

  const scanLine = scanRef.value.querySelector('.sg-scan-line-222')
  const content = scanRef.value.querySelector('.sg-scan-content-222')

  if (!scanLine || !content) return

  // 扫描线移动
  gsap.to(scanLine, {
    y: '100%',
    duration: 2,
    repeat: -1,
    ease: 'none'
  })

  // 内容故障效果
  gsap.to(content, {
    opacity: 0.5,
    duration: 0.1,
    repeat: -1,
    yoyo: true,
    ease: 'steps(1)'
  })
}

// 04. RGB分离
const initRgbEffect = () => {
  if (!rgbRef.value) return

  const rgbTexts = rgbRef.value.querySelectorAll('.sg-rgb-text-222')

  if (rgbTexts.length < 3) return

  const [red, green, blue] = rgbTexts

  // RGB层分离动画
  gsap.to(red, {
    x: -10,
    y: -5,
    duration: 0.2,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  })

  gsap.to(green, {
    x: 0,
    y: 0,
    duration: 0.15,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  })

  gsap.to(blue, {
    x: 10,
    y: 5,
    duration: 0.2,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  })

  // 混合模式
  red.style.mixBlendMode = 'screen'
  green.style.mixBlendMode = 'screen'
  blue.style.mixBlendMode = 'screen'
}

// 05. 残影效果
const initGhostEffect = () => {
  if (!ghostRef.value) return

  const ghostItem = ghostRef.value.querySelector('.sg-ghost-item-222')

  if (!ghostItem) return

  // 创建残影
  for (let i = 0; i < 5; i++) {
    const ghost = ghostItem.cloneNode(true) as HTMLElement
    ghost.className = 'sg-ghost-item-222 sg-ghost-clone-222'
    ghost.style.opacity = (0.6 - i * 0.1).toString()
    ghostRef.value.appendChild(ghost)
  }

  const allGhosts = ghostRef.value.querySelectorAll('.sg-ghost-item-222')

  // 残影移动
  gsap.to(allGhosts, {
    x: (index) => index * 20,
    opacity: (index) => 0.6 - index * 0.1,
    duration: 0.5,
    stagger: 0.05,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  })
}

// 06. 数据故障
const initDataEffect = () => {
  if (!dataRef.value) return

  const dataText = dataRef.value.querySelector('.sg-data-text-222')

  if (!dataText) return

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'

  const glitchData = () => {
    let text = ''
    for (let i = 0; i < 12; i++) {
      text += chars[Math.floor(Math.random() * chars.length)]
    }
    dataText.textContent = text
  }

  dataInterval = window.setInterval(glitchData, 100)

  // 偶尔显示原始文本
  setInterval(() => {
    dataText.textContent = 'SYSTEM ERROR'
    setTimeout(glitchData, 500)
  }, 3000)
}

// 07. 块状故障
const initBlockEffect = () => {
  if (!blockRef.value) return

  const content = blockRef.value.querySelector('.sg-block-content-222')

  if (!content) return

  // 创建块状元素
  for (let i = 0; i < 8; i++) {
    const block = document.createElement('div')
    block.className = 'sg-block-222'
    block.style.left = `${gsap.utils.random(0, 80)}%`
    block.style.top = `${gsap.utils.random(0, 80)}%`
    block.style.width = `${gsap.utils.random(10, 30)}%`
    block.style.height = `${gsap.utils.random(10, 30)}%`
    blockRef.value.appendChild(block)
  }

  const blocks = blockRef.value.querySelectorAll('.sg-block-222')

  // 块状故障动画
  gsap.to(blocks, {
    opacity: () => gsap.utils.random(0.5, 1),
    x: () => gsap.utils.random(-50, 50),
    y: () => gsap.utils.random(-50, 50),
    duration: 0.1,
    repeat: -1,
    yoyo: true,
    ease: 'steps(1)',
    stagger: 0.02
  })
}

// 08. 信号干扰
const initSignalEffect = () => {
  if (!signalRef.value) return

  const content = signalRef.value.querySelector('.sg-signal-content-222')

  if (!content) return

  // 信号干扰动画
  const signalGlitch = () => {
    gsap.to(content, {
      filter: 'blur(2px) brightness(1.5) contrast(200%)',
      duration: 0.05,
      ease: 'steps(1)',
      onComplete: () => {
        gsap.to(content, {
          filter: 'none',
          duration: 0.05,
          ease: 'steps(1)'
        })
      }
    })
  }

  setInterval(signalGlitch, 800)

  // 水平抖动
  gsap.to(content, {
    x: () => gsap.utils.random(-20, 20),
    duration: 0.05,
    repeat: -1,
    yoyo: true,
    ease: 'steps(1)'
  })
}
</script>

<style scoped>
.scroll-glitch-wrapper-222 {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  padding: 60px 20px;
  overflow-x: hidden;
  position: relative;
}

.sg-container-222 {
  max-width: 1200px;
  margin: 0 auto;
}

/* 标题区域 */
.sg-header-222 {
  text-align: center;
  margin-bottom: 80px;
}

.sg-title-222 {
  font-size: 64px;
  font-weight: 900;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 8px;
  position: relative;
  animation: sgTitleGlitch 3s infinite;
}

@keyframes sgTitleGlitch {
  0%, 90%, 100% {
    text-shadow: none;
  }
  91% {
    text-shadow: -4px 0 #ff0000, 4px 0 #0000ff;
  }
  92% {
    text-shadow: 4px 0 #ff0000, -4px 0 #0000ff;
  }
  93% {
    text-shadow: -2px 0 #ff0000, 2px 0 #0000ff;
  }
}

.sg-subtitle-222 {
  font-size: 18px;
  color: #888;
  margin-top: 16px;
  letter-spacing: 4px;
}

/* 区域 */
.sg-section-222 {
  margin-bottom: 60px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.sg-section-222::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff0000, #00ff00, #0000ff, transparent);
  animation: sgBorderMove 3s linear infinite;
}

@keyframes sgBorderMove {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.sg-section-title-222 {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 30px;
  position: relative;
  padding-left: 20px;
}

.sg-section-title-222::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: linear-gradient(180deg, #ff0000, #00ff00, #0000ff);
}

/* 01. 文字故障 */
.sg-glitch-text-wrapper-222 {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

.sg-glitch-text-222 {
  font-size: 80px;
  font-weight: 900;
  color: #fff;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 10px;
}

.sg-glitch-text-222::before,
.sg-glitch-text-222::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.sg-glitch-text-222::before {
  color: #ff0000;
  animation: sgGlitch1 0.3s infinite;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
}

.sg-glitch-text-222::after {
  color: #0000ff;
  animation: sgGlitch2 0.3s infinite;
  clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
}

@keyframes sgGlitch1 {
  0%, 90%, 100% {
    transform: translate(0);
  }
  92% {
    transform: translate(-5px, 2px);
  }
  94% {
    transform: translate(5px, -2px);
  }
}

@keyframes sgGlitch2 {
  0%, 90%, 100% {
    transform: translate(0);
  }
  91% {
    transform: translate(5px, 2px);
  }
  93% {
    transform: translate(-5px, -2px);
  }
}

/* 02. 图片故障 */
.sg-glitch-image-wrapper-222 {
  position: relative;
  width: 100%;
  height: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.sg-glitch-image-222 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sg-glitch-image-222::before {
  content: 'IMAGE';
  font-size: 48px;
  font-weight: 900;
  color: #fff;
}

.sg-red-layer-222 {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  mix-blend-mode: screen;
  opacity: 0.7;
}

.sg-blue-layer-222 {
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  mix-blend-mode: screen;
  opacity: 0.7;
}

/* 03. 扫描线效果 */
.sg-scan-wrapper-222 {
  position: relative;
  height: 250px;
  background: #000;
  overflow: hidden;
}

.sg-scan-content-222 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.sg-scan-title-222 {
  font-size: 48px;
  font-weight: 900;
  color: #00ff00;
  margin-bottom: 10px;
  text-shadow: 0 0 20px #00ff00;
}

.sg-scan-text-222 {
  font-size: 18px;
  color: #00ff00;
  opacity: 0.7;
}

.sg-scan-line-222 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #00ff00, transparent);
  box-shadow: 0 0 20px #00ff00;
}

/* 04. RGB分离 */
.sg-rgb-wrapper-222 {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  position: relative;
}

.sg-rgb-content-222 {
  position: relative;
  width: 300px;
  height: 100px;
}

.sg-rgb-text-222 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 64px;
  font-weight: 900;
}

.sg-red-222 {
  color: #ff0000;
}

.sg-green-222 {
  color: #00ff00;
}

.sg-blue-222 {
  color: #0000ff;
}

/* 05. 残影效果 */
.sg-ghost-wrapper-222 {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  position: relative;
  overflow: hidden;
}

.sg-ghost-item-222 {
  position: absolute;
  font-size: 64px;
  font-weight: 900;
  color: #fff;
  white-space: nowrap;
}

.sg-ghost-clone-222 {
  color: #00ffff;
  text-shadow: 0 0 20px #00ffff;
}

/* 06. 数据故障 */
.sg-data-wrapper-222 {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  font-family: 'Courier New', monospace;
}

.sg-data-text-222 {
  font-size: 32px;
  font-weight: 700;
  color: #00ff00;
  text-shadow: 0 0 10px #00ff00;
  letter-spacing: 5px;
}

/* 07. 块状故障 */
.sg-block-wrapper-222 {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  position: relative;
}

.sg-block-content-222 {
  font-size: 64px;
  font-weight: 900;
  color: #fff;
  z-index: 10;
}

.sg-block-222 {
  position: absolute;
  background: linear-gradient(135deg, #ff0000 0%, #00ff00 50%, #0000ff 100%);
  mix-blend-mode: screen;
  z-index: 5;
}

/* 08. 信号干扰 */
.sg-signal-wrapper-222 {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

.sg-signal-content-222 {
  font-size: 64px;
  font-weight: 900;
  color: #fff;
  position: relative;
}

.sg-signal-content-222::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255, 255, 255, 0.1) 2px,
    rgba(255, 255, 255, 0.1) 4px
  );
  pointer-events: none;
}

/* 响应式 */
@media (max-width: 768px) {
  .sg-title-222 {
    font-size: 36px;
    letter-spacing: 4px;
  }

  .sg-glitch-text-222 {
    font-size: 48px;
    letter-spacing: 5px;
  }

  .sg-section-222 {
    padding: 20px;
  }
}
</style>
