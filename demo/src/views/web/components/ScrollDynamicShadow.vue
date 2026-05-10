<template>
  <section class="sds-dynamic-shadow-218">
    <div class="sds-container-218">
      <div class="sds-header-218">
        <h2 class="sds-title-218">动态阴影</h2>
        <p class="sds-subtitle-218">Dynamic Shadow Animation</p>
      </div>

      <!-- 光源指示器 -->
      <div class="sds-light-source-218" ref="lightSourceRef">
        <div class="sds-light-core-218"></div>
        <div class="sds-light-rays-218"></div>
        <div class="sds-light-label-218">光源</div>
      </div>

      <!-- 阴影展示区域 -->
      <div class="sds-shadows-stage-218">
        <!-- 卡片1 - 基础阴影 -->
        <div class="sds-card-218" ref="card1Ref">
          <div class="sds-card-front-218">
            <h3>基础阴影</h3>
            <p>Basic Shadow</p>
          </div>
          <div class="sds-shadow-218 sds-shadow-1-218" ref="shadow1Ref"></div>
        </div>

        <!-- 卡片2 - 多层阴影 -->
        <div class="sds-card-218" ref="card2Ref">
          <div class="sds-card-front-218">
            <h3>多层阴影</h3>
            <p>Multi-layer Shadow</p>
          </div>
          <div class="sds-shadow-218 sds-shadow-2-218" ref="shadow2Ref"></div>
          <div class="sds-shadow-218 sds-shadow-2-a-218" ref="shadow2aRef"></div>
          <div class="sds-shadow-218 sds-shadow-2-b-218" ref="shadow2bRef"></div>
        </div>

        <!-- 卡片3 - 柔和阴影 -->
        <div class="sds-card-218" ref="card3Ref">
          <div class="sds-card-front-218">
            <h3>柔和阴影</h3>
            <p>Soft Shadow</p>
          </div>
          <div class="sds-shadow-218 sds-shadow-3-218" ref="shadow3Ref"></div>
        </div>

        <!-- 卡片4 - 彩色阴影 -->
        <div class="sds-card-218" ref="card4Ref">
          <div class="sds-card-front-218">
            <h3>彩色阴影</h3>
            <p>Colored Shadow</p>
          </div>
          <div class="sds-shadow-218 sds-shadow-4-218" ref="shadow4Ref"></div>
        </div>

        <!-- 卡片5 - 动态光源阴影 -->
        <div class="sds-card-218" ref="card5Ref">
          <div class="sds-card-front-218">
            <h3>动态光源</h3>
            <p>Dynamic Light</p>
          </div>
          <div class="sds-shadow-218 sds-shadow-5-218" ref="shadow5Ref"></div>
        </div>

        <!-- 卡片6 - 旋转阴影 -->
        <div class="sds-card-218" ref="card6Ref">
          <div class="sds-card-front-218">
            <h3>旋转阴影</h3>
            <p>Rotating Shadow</p>
          </div>
          <div class="sds-shadow-218 sds-shadow-6-218" ref="shadow6Ref"></div>
        </div>
      </div>

      <!-- 光源控制 -->
      <div class="sds-controls-218">
        <div class="sds-control-group-218">
          <label class="sds-control-label-218">光源角度</label>
          <input
            type="range"
            min="0"
            max="360"
            value="45"
            class="sds-slider-218"
            id="sds-light-angle-218"
          />
          <span class="sds-control-value-218" id="sds-light-angle-value-218">45°</span>
        </div>
        <div class="sds-control-group-218">
          <label class="sds-control-label-218">光源距离</label>
          <input
            type="range"
            min="20"
            max="100"
            value="50"
            class="sds-slider-218"
            id="sds-light-distance-218"
          />
          <span class="sds-control-value-218" id="sds-light-distance-value-218">50px</span>
        </div>
        <div class="sds-control-group-218">
          <label class="sds-control-label-218">阴影模糊</label>
          <input
            type="range"
            min="0"
            max="50"
            value="20"
            class="sds-slider-218"
            id="sds-shadow-blur-218"
          />
          <span class="sds-control-value-218" id="sds-shadow-blur-value-218">20px</span>
        </div>
      </div>

      <!-- 预设按钮 -->
      <div class="sds-presets-218">
        <button class="sds-preset-btn-218" @click="applyPreset('morning')">晨光</button>
        <button class="sds-preset-btn-218" @click="applyPreset('noon')">正午</button>
        <button class="sds-preset-btn-218" @click="applyPreset('evening')">黄昏</button>
        <button class="sds-preset-btn-218" @click="applyPreset('night')">夜晚</button>
      </div>

      <!-- 实时数据 -->
      <div class="sds-data-218">
        <div class="sds-data-item-218">
          <span class="sds-data-label-218">光源位置</span>
          <span class="sds-data-value-218" id="sds-light-pos-218">X: 0 | Y: 0</span>
        </div>
        <div class="sds-data-item-218">
          <span class="sds-data-label-218">阴影角度</span>
          <span class="sds-data-value-218" id="sds-shadow-angle-218">0°</span>
        </div>
        <div class="sds-data-item-218">
          <span class="sds-data-label-218">阴影强度</span>
          <span class="sds-data-value-218" id="sds-shadow-intensity-218">50%</span>
        </div>
      </div>
    </div>

    <!-- 光源轨迹 -->
    <canvas class="sds-light-trail-218" id="sds-light-trail-218"></canvas>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const lightSourceRef = ref<HTMLElement | null>(null)
const card1Ref = ref<HTMLElement | null>(null)
const card2Ref = ref<HTMLElement | null>(null)
const card3Ref = ref<HTMLElement | null>(null)
const card4Ref = ref<HTMLElement | null>(null)
const card5Ref = ref<HTMLElement | null>(null)
const card6Ref = ref<HTMLElement | null>(null)
const shadow1Ref = ref<HTMLElement | null>(null)
const shadow2Ref = ref<HTMLElement | null>(null)
const shadow2aRef = ref<HTMLElement | null>(null)
const shadow2bRef = ref<HTMLElement | null>(null)
const shadow3Ref = ref<HTMLElement | null>(null)
const shadow4Ref = ref<HTMLElement | null>(null)
const shadow5Ref = ref<HTMLElement | null>(null)
const shadow6Ref = ref<HTMLElement | null>(null)

let ctx: gsap.Context
let mouseX = 0
let mouseY = 0
let lightAngle = 45
let lightDistance = 50
let shadowBlur = 20

// 根据鼠标位置更新阴影
const updateShadows = (x: number, y: number) => {
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2

  const offsetX = (x - centerX) / centerX
  const offsetY = (y - centerY) / centerY

  // 计算阴影偏移
  const shadowX = -offsetX * lightDistance
  const shadowY = -offsetY * lightDistance

  // 更新基础阴影
  if (shadow1Ref.value) {
    gsap.to(shadow1Ref.value, {
      x: shadowX,
      y: shadowY,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  // 更新多层阴影
  if (shadow2Ref.value) {
    gsap.to(shadow2Ref.value, {
      x: shadowX * 0.5,
      y: shadowY * 0.5,
      opacity: 0.3,
      duration: 0.3,
      ease: 'power2.out'
    })
  }
  if (shadow2aRef.value) {
    gsap.to(shadow2aRef.value, {
      x: shadowX * 0.7,
      y: shadowY * 0.7,
      opacity: 0.2,
      duration: 0.3,
      ease: 'power2.out'
    })
  }
  if (shadow2bRef.value) {
    gsap.to(shadow2bRef.value, {
      x: shadowX,
      y: shadowY,
      opacity: 0.4,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  // 更新柔和阴影
  if (shadow3Ref.value) {
    gsap.to(shadow3Ref.value, {
      x: shadowX * 1.2,
      y: shadowY * 1.2,
      filter: `blur(${shadowBlur * 1.5}px)`,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  // 更新彩色阴影
  if (shadow4Ref.value) {
    const hue = (x / window.innerWidth) * 360
    gsap.to(shadow4Ref.value, {
      x: shadowX,
      y: shadowY,
      backgroundColor: `hsla(${hue}, 70%, 50%, 0.4)`,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  // 更新动态光源阴影
  if (shadow5Ref.value) {
    const intensity = 1 - Math.abs(offsetY)
    gsap.to(shadow5Ref.value, {
      x: shadowX * 2,
      y: shadowY * 2,
      opacity: intensity * 0.6,
      filter: `blur(${shadowBlur * intensity}px)`,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  // 更新旋转阴影
  if (shadow6Ref.value) {
    const angle = Math.atan2(offsetY, offsetX) * (180 / Math.PI)
    const scale = 0.8 + Math.abs(offsetX + offsetY) * 0.4
    gsap.to(shadow6Ref.value, {
      x: shadowX,
      y: shadowY,
      rotation: angle,
      scale: scale,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  // 更新光源位置
  if (lightSourceRef.value) {
    gsap.to(lightSourceRef.value, {
      x: offsetX * 100,
      y: offsetY * 100,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  // 更新数据
  const posEl = document.getElementById('sds-light-pos-218')
  if (posEl) posEl.textContent = `X: ${Math.round(x)} | Y: ${Math.round(y)}`

  const angleEl = document.getElementById('sds-shadow-angle-218')
  const angleDeg = Math.atan2(offsetY, offsetX) * (180 / Math.PI)
  if (angleEl) angleEl.textContent = `${Math.round(angleDeg)}°`

  const intensityEl = document.getElementById('sds-shadow-intensity-218')
  const intensity = (1 - (Math.abs(offsetX) + Math.abs(offsetY)) / 2) * 100
  if (intensityEl) intensityEl.textContent = `${Math.round(intensity)}%`
}

// 初始化阴影动画
const initShadowAnimations = () => {
  const cards = gsap.utils.toArray('.sds-card-218')

  // 卡片入场动画
  cards.forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        end: 'top 65%',
        scrub: 1
      },
      y: 100,
      opacity: 0,
      scale: 0.8,
      rotateX: 20,
      duration: 1,
      ease: 'power3.out',
      delay: index * 0.1
    })
  })

  // 阴影初始动画
  const shadows = gsap.utils.toArray('.sds-shadow-218')
  shadows.forEach((shadow, index) => {
    gsap.from(shadow, {
      scrollTrigger: {
        trigger: '.sds-shadows-stage-218',
        start: 'top 80%',
        end: 'top 60%',
        scrub: 1
      },
      x: (index % 2 === 0 ? -50 : 50),
      y: 30,
      opacity: 0,
      scale: 0.5,
      duration: 1,
      ease: 'power2.out',
      delay: index * 0.05
    })
  })

  // 光源入场动画
  gsap.from(lightSourceRef.value, {
    scrollTrigger: {
      trigger: lightSourceRef.value,
      start: 'top 90%',
      toggleActions: 'play none none reverse'
    },
    scale: 0,
    opacity: 0,
    rotation: 180,
    duration: 1.2,
    ease: 'back.out(1.7)'
  })

  // 光源旋转动画
  gsap.to('.sds-light-rays-218', {
    rotation: 360,
    duration: 20,
    repeat: -1,
    ease: 'none'
  })

  // 光源脉冲动画
  gsap.to('.sds-light-core-218', {
    scale: 1.2,
    opacity: 0.8,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })

  // 卡片悬浮效果
  cards.forEach((card: any) => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -15,
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      })
    })

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
    })
  })
}

// 标题动画
const initTitleAnimation = () => {
  gsap.from('.sds-title-218', {
    scrollTrigger: {
      trigger: '.sds-header-218',
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    },
    y: -60,
    opacity: 0,
    rotateX: 20,
    duration: 1.2,
    ease: 'back.out(1.7)'
  })

  gsap.from('.sds-subtitle-218', {
    scrollTrigger: {
      trigger: '.sds-header-218',
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    },
    y: -30,
    opacity: 0,
    duration: 1,
    delay: 0.2,
    ease: 'power3.out'
  })
}

// 控制面板动画
const initControlsAnimation = () => {
  gsap.from('.sds-control-group-218', {
    scrollTrigger: {
      trigger: '.sds-controls-218',
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'back.out(1.7)'
  })
}

// 预设按钮动画
const initPresetsAnimation = () => {
  gsap.from('.sds-preset-btn-218', {
    scrollTrigger: {
      trigger: '.sds-presets-218',
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    },
    y: 40,
    opacity: 0,
    scale: 0.8,
    duration: 0.6,
    stagger: 0.1,
    ease: 'back.out(1.7)'
  })
}

// 应用预设
const applyPreset = (preset: string) => {
  const presets: any = {
    morning: { angle: 30, distance: 60, blur: 25, lightColor: '#FFA07A' },
    noon: { angle: 90, distance: 20, blur: 10, lightColor: '#FFFACD' },
    evening: { angle: 200, distance: 80, blur: 30, lightColor: '#FF6347' },
    night: { angle: 300, distance: 100, blur: 40, lightColor: '#4169E1' }
  }

  const p = presets[preset]
  if (!p) return

  // 更新滑块
  const angleSlider = document.getElementById('sds-light-angle-218') as HTMLInputElement
  const distanceSlider = document.getElementById('sds-light-distance-218') as HTMLInputElement
  const blurSlider = document.getElementById('sds-shadow-blur-218') as HTMLInputElement

  if (angleSlider) angleSlider.value = p.angle
  if (distanceSlider) distanceSlider.value = p.distance
  if (blurSlider) blurSlider.value = p.blur

  // 更新显示值
  const angleValue = document.getElementById('sds-light-angle-value-218')
  const distanceValue = document.getElementById('sds-light-distance-value-218')
  const blurValue = document.getElementById('sds-shadow-blur-value-218')

  if (angleValue) angleValue.textContent = `${p.angle}°`
  if (distanceValue) distanceValue.textContent = `${p.distance}px`
  if (blurValue) blurValue.textContent = `${p.blur}px`

  // 更新变量
  lightAngle = p.angle
  lightDistance = p.distance
  shadowBlur = p.blur

  // 更新光源颜色
  gsap.to('.sds-light-core-218', {
    backgroundColor: p.lightColor,
    boxShadow: `0 0 30px ${p.lightColor}`,
    duration: 0.5
  })

  // 触发阴影更新
  updateShadows(mouseX, mouseY)
}

// 初始化滑块事件
const initSliderEvents = () => {
  const angleSlider = document.getElementById('sds-light-angle-218')
  const distanceSlider = document.getElementById('sds-light-distance-218')
  const blurSlider = document.getElementById('sds-shadow-blur-218')

  if (angleSlider) {
    angleSlider.addEventListener('input', (e) => {
      lightAngle = parseInt((e.target as HTMLInputElement).value)
      const valueEl = document.getElementById('sds-light-angle-value-218')
      if (valueEl) valueEl.textContent = `${lightAngle}°`
      updateShadows(mouseX, mouseY)
    })
  }

  if (distanceSlider) {
    distanceSlider.addEventListener('input', (e) => {
      lightDistance = parseInt((e.target as HTMLInputElement).value)
      const valueEl = document.getElementById('sds-light-distance-value-218')
      if (valueEl) valueEl.textContent = `${lightDistance}px`
      updateShadows(mouseX, mouseY)
    })
  }

  if (blurSlider) {
    blurSlider.addEventListener('input', (e) => {
      shadowBlur = parseInt((e.target as HTMLInputElement).value)
      const valueEl = document.getElementById('sds-shadow-blur-value-218')
      if (valueEl) valueEl.textContent = `${shadowBlur}px`
      updateShadows(mouseX, mouseY)
    })
  }
}

// 鼠标移动事件
const handleMouseMove = (e: MouseEvent) => {
  mouseX = e.clientX
  mouseY = e.clientY
  updateShadows(mouseX, mouseY)
}

// 初始化光源轨迹Canvas
const initLightTrail = () => {
  const canvas = document.getElementById('sds-light-trail-218') as HTMLCanvasElement
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const trail: { x: number; y: number; alpha: number }[] = []

  const animateTrail = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 添加新点
    trail.push({ x: mouseX, y: mouseY, alpha: 1 })

    // 绘制轨迹
    for (let i = 0; i < trail.length; i++) {
      const point = trail[i]
      point.alpha -= 0.02

      if (point.alpha <= 0) {
        trail.splice(i, 1)
        i--
        continue
      }

      ctx.beginPath()
      ctx.arc(point.x, point.y, 3 + (trail.length - i) * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 215, 0, ${point.alpha * 0.3})`
      ctx.fill()
    }

    requestAnimationFrame(animateTrail)
  }

  animateTrail()

  // 响应窗口大小
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })
}

onMounted(() => {
  ctx = gsap.context(() => {
    initTitleAnimation()
    initShadowAnimations()
    initControlsAnimation()
    initPresetsAnimation()
    initSliderEvents()
    initLightTrail()

    // 初始化鼠标位置到中心
    mouseX = window.innerWidth / 2
    mouseY = window.innerHeight / 2

    // 添加鼠标移动监听
    document.addEventListener('mousemove', handleMouseMove)
  })
})

onUnmounted(() => {
  ctx?.revert()
  document.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped lang="scss">
.sds-dynamic-shadow-218 {
  min-height: 100vh;
  padding: 80px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 30%, #0f0f2a 60%, #1e1e3e 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.05) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.sds-container-218 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 10;

  opacity: 1 !important;}

.sds-header-218 {
  text-align: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.sds-title-218 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ffd700, #ff8c00, #ff6347);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 60px rgba(255, 215, 0, 0.4);
  transform-style: preserve-3d;

  opacity: 1 !important;}

.sds-subtitle-218 {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.3em;
  text-transform: uppercase;

  opacity: 1 !important;}

.sds-light-source-218 {
  position: fixed;
  top: 10%;
  right: 10%;
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
  pointer-events: none;

  opacity: 1 !important;}

.sds-light-core-218 {
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, #fff 0%, #ffd700 50%, transparent 70%);
  border-radius: 50%;
  box-shadow: 0 0 30px #ffd700;
  transition: background-color 0.5s ease, box-shadow 0.5s ease;

  opacity: 1 !important;}

.sds-light-rays-218 {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px dashed rgba(255, 215, 0, 0.3);
  border-radius: 50%;
  animation: rotate 20s linear infinite;

  opacity: 1 !important;}

.sds-light-label-218 {
  margin-top: 10px;
  font-size: 0.8rem;
  color: rgba(255, 215, 0, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.1em;

  opacity: 1 !important;}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}

.sds-shadows-stage-218 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 60px;
  margin: 80px 0;
  perspective: 1000px;

  opacity: 1 !important;}

.sds-card-218 {
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;

  opacity: 1 !important;}

.sds-card-front-218 {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  border-radius: 16px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 2;
  position: relative;

  opacity: 1 !important;}

.sds-card-front-218 h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.sds-card-front-218 p {
  font-size: 0.9rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.sds-shadow-218 {
  position: absolute;
  top: 10px;
  left: 10px;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  border-radius: 16px;
  z-index: 1;
  pointer-events: none;
  transition: filter 0.3s ease;

  opacity: 1 !important;}

.sds-shadow-1-218 {
  background: rgba(0, 0, 0, 0.2);
  filter: blur(15px);

  opacity: 1 !important;}

.sds-shadow-2-218 {
  background: rgba(0, 0, 0, 0.15);
  filter: blur(10px);

  opacity: 1 !important;}

.sds-shadow-2-a-218 {
  background: rgba(0, 0, 0, 0.1);
  filter: blur(15px);

  opacity: 1 !important;}

.sds-shadow-2-b-218 {
  background: rgba(0, 0, 0, 0.2);
  filter: blur(5px);

  opacity: 1 !important;}

.sds-shadow-3-218 {
  background: rgba(0, 0, 0, 0.1);
  filter: blur(30px);

  opacity: 1 !important;}

.sds-shadow-4-218 {
  background: rgba(255, 0, 0, 0.3);
  filter: blur(15px);
  transition: background-color 0.3s ease;

  opacity: 1 !important;}

.sds-shadow-5-218 {
  background: rgba(255, 215, 0, 0.4);
  filter: blur(20px);

  opacity: 1 !important;}

.sds-shadow-6-218 {
  background: rgba(0, 0, 0, 0.2);
  filter: blur(15px);

  opacity: 1 !important;}

.sds-controls-218 {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 60px 0;
  flex-wrap: wrap;

  opacity: 1 !important;}

.sds-control-group-218 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  min-width: 200px;

  opacity: 1 !important;}

.sds-control-label-218 {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.1em;

  opacity: 1 !important;}

.sds-slider-218 {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, #ffd700, #ff8c00);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(255, 215, 0, 0.5);
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.2);
    
  opacity: 1 !important;}
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, #ffd700, #ff8c00);
    border-radius: 50%;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 10px rgba(255, 215, 0, 0.5);
  }
}

.sds-control-value-218 {
  font-size: 1rem;
  font-weight: 600;
  color: #ffd700;

  opacity: 1 !important;}

.sds-presets-218 {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 40px 0;
  flex-wrap: wrap;

  opacity: 1 !important;}

.sds-preset-btn-218 {
  padding: 12px 28px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 140, 0, 0.2));
  border: 2px solid rgba(255, 215, 0, 0.4);
  border-radius: 30px;
  color: #ffd700;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.sds-preset-btn-218:hover {
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  border-color: transparent;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(255, 215, 0, 0.4);
}

.sds-preset-btn-218:active {
  transform: translateY(0);
}

.sds-data-218 {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-top: 40px;
  flex-wrap: wrap;
}

.sds-data-item-218 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.sds-data-label-218 {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.1em;

  opacity: 1 !important;}

.sds-data-value-218 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffd700;
  font-family: 'Courier New', monospace;

  opacity: 1 !important;}

.sds-light-trail-218 {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 5;
}

@media (max-width: 768px) {
  .sds-shadows-stage-218 {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .sds-controls-218 {
    flex-direction: column;
    gap: 30px;
  }

  .sds-control-group-218 {
    min-width: 100%;
  
  opacity: 1 !important;}

  .sds-data-218 {
    gap: 30px;
  }

  .sds-light-source-218 {
    width: 60px;
    height: 60px;
  
  opacity: 1 !important;}

  .sds-light-core-218 {
    width: 25px;
    height: 25px;
  
  opacity: 1 !important;}

  .sds-light-label-218 {
    font-size: 0.6rem;
  
  opacity: 1 !important;}
}
</style>
