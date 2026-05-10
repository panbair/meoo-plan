<template>
  <div class="accent-color-section-254" ref="componentRoot">
    <div class="ac-container-254">
      <h2 class="ac-title-254">强调色变化</h2>
      <p class="ac-subtitle-254">滚动体验主色调动态变化</p>

      <div class="ac-scroll-indicator-254">
        <div class="ac-indicator-line-254"></div>
        <div class="ac-indicator-text-254">↓ 滚动体验颜色渐变 ↓</div>
        <div class="ac-indicator-line-254"></div>
      </div>

      <div class="ac-color-track-254">
        <div class="ac-progress-track-254">
          <div class="ac-progress-bar-254" ref="progressBar"></div>
        </div>
        <div class="ac-color-labels-254">
          <span class="ac-color-label-254">红色</span>
          <span class="ac-color-label-254">绿色</span>
          <span class="ac-color-label-254">蓝色</span>
          <span class="ac-color-label-254">紫色</span>
        </div>
      </div>

      <div class="ac-content-254">
        <div class="ac-color-display-254" ref="colorDisplay">
          <div class="ac-current-color-254" ref="currentColor"></div>
          <div class="ac-color-code-254" ref="colorCode">#ff0000</div>
        </div>

        <div class="ac-cards-grid-254">
          <div class="ac-card-253" v-for="(card, index) in cards" :key="index" :class="`ac-card-${index}-254`">
            <div class="ac-card-icon-254">{{ card.icon }}</div>
            <h3 class="ac-card-title-254">{{ card.title }}</h3>
            <p class="ac-card-desc-254">{{ card.desc }}</p>
            <div class="ac-card-accent-254"></div>
          </div>
        </div>

        <div class="ac-gradient-preview-254">
          <div class="ac-gradient-title-254">颜色渐变预览</div>
          <div class="ac-gradient-bar-254" ref="gradientBar">
            <div class="ac-gradient-color-254" v-for="(color, index) in gradientColors" :key="index" :style="{ background: color }"></div>
          </div>
        </div>

        <div class="ac-interactive-demo-254">
          <div class="ac-demo-title-254">互动演示</div>
          <button class="ac-demo-button-254" ref="demoButton">
            <span class="ac-button-icon">🎨</span>
            <span class="ac-button-text">改变颜色</span>
          </button>
        </div>
      </div>

      <div class="ac-footer-254">
        <p class="ac-footer-text-254">继续滚动探索更多动画效果</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement | null>(null)
const progressBar = ref<HTMLElement | null>(null)
const colorDisplay = ref<HTMLElement | null>(null)
const currentColor = ref<HTMLElement | null>(null)
const colorCode = ref<HTMLElement | null>(null)
const gradientBar = ref<HTMLElement | null>(null)
const demoButton = ref<HTMLElement | null>(null)

const cards = [
  { icon: '🎨', title: '动态调色', desc: '滚动改变主色调' },
  { icon: '✨', title: '平滑过渡', desc: '流畅颜色渐变' },
  { icon: '🌈', title: '多彩体验', desc: '丰富色彩方案' },
  { icon: '💫', title: '实时预览', desc: '即时颜色反馈' }
]

const gradientColors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3']

// 颜色插值函数 - 从颜色A到颜色B的平滑过渡
const lerpColor = (color1: string, color2: string, t: number): string => {
  const hex = (c: string) => {
    const hex = parseInt(c.replace('#', ''), 16)
    return { r: (hex >> 16) & 255, g: (hex >> 8) & 255, b: hex & 255 }
  }

  const c1 = hex(color1)
  const c2 = hex(color2)

  const r = Math.round(c1.r + (c2.r - c1.r) * t)
  const g = Math.round(c1.g + (c2.g - c1.g) * t)
  const b = Math.round(c1.b + (c2.b - c1.b) * t)

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

// 更新强调色
const updateAccentColor = (progress: number) => {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#9400d3']
  const segment = Math.min(Math.floor(progress * (colors.length - 1)), colors.length - 2)
  const t = (progress * (colors.length - 1)) - segment

  const currentColorValue = lerpColor(colors[segment], colors[segment + 1], t)

  // 更新 CSS 变量
  document.documentElement.style.setProperty('--accent', currentColorValue)

  // 更新显示
  if (colorCode.value) {
    colorCode.value.textContent = currentColorValue.toUpperCase()
  }

  if (currentColor.value) {
    currentColor.value.style.background = currentColorValue
  }
}

// 初始化强调色
const initAccentColor = () => {
  document.documentElement.style.setProperty('--accent', '#ff0000')
}

let ctx: gsap.Context

onMounted(() => {
  initAccentColor()

  ctx = gsap.context(() => {
    const sectionEl = componentRoot.value
    if (!sectionEl) return

    // 标题入场动画
    gsap.from('.ac-title-254', {
      y: 80,
      opacity: 0,
      scale: 0.8,
      duration: 1.2,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: sectionEl,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })

    // 副标题入场
    gsap.from('.ac-subtitle-254', {
      y: 60,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionEl,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    })

    // 滚动指示器动画
    gsap.from('.ac-scroll-indicator-254', {
      y: 50,
      opacity: 0,
      scale: 0.9,
      duration: 1,
      delay: 0.4,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionEl,
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    })

    // 指示线动画
    gsap.from('.ac-indicator-line-254', {
      scaleX: 0,
      duration: 0.8,
      delay: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionEl,
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      }
    })

    // 进度条轨道入场
    gsap.from('.ac-color-track-254', {
      y: 60,
      opacity: 0,
      duration: 1,
      delay: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionEl,
        start: 'top 65%',
        toggleActions: 'play none none reverse'
      }
    })

    // 进度条填充动画 - 滚动控制
    gsap.to('.ac-progress-bar-254', {
      width: '100%',
      duration: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionEl,
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: 1
      }
    })

    // 颜色显示区域入场
    gsap.from('.ac-color-display-254', {
      y: 80,
      opacity: 0,
      scale: 0.8,
      rotationX: 90,
      duration: 1.2,
      delay: 0.8,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.ac-content-254',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })

    // 当前颜色圆圈动画
    gsap.to('.ac-current-color-254', {
      scale: [1, 1.2, 1],
      duration: 2,
      repeat: -1,
      ease: 'power1.inOut'
    })

    // 卡片入场动画
    cards.forEach((_, index) => {
      gsap.from(`.ac-card-${index}-254`, {
        y: 100,
        opacity: 0,
        scale: 0.8,
        rotationX: 30,
        duration: 1,
        delay: 1 + index * 0.15,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.ac-content-254',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      })
    })

    // 渐变预览入场
    gsap.from('.ac-gradient-preview-254', {
      y: 60,
      opacity: 0,
      duration: 1,
      delay: 1.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.ac-content-254',
        start: 'top 65%',
        toggleActions: 'play none none reverse'
      }
    })

    // 渐变色块动画
    gsap.from('.ac-gradient-color-254', {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
      delay: 1.8,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.ac-content-254',
        start: 'top 60%',
        toggleActions: 'play none none reverse'
      }
    })

    // 互动演示区域入场
    gsap.from('.ac-interactive-demo-254', {
      y: 60,
      opacity: 0,
      duration: 1,
      delay: 2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.ac-content-254',
        start: 'top 55%',
        toggleActions: 'play none none reverse'
      }
    })

    // 演示按钮动画
    gsap.from('.ac-demo-button-254', {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      delay: 2.2,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.ac-content-254',
        start: 'top 50%',
        toggleActions: 'play none none reverse'
      }
    })

    // 页脚入场
    gsap.from('.ac-footer-254', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      delay: 2.4,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionEl,
        start: 'bottom 95%',
        toggleActions: 'play none none reverse'
      }
    })

    // 滚动触发强调色变化
    ScrollTrigger.create({
      trigger: sectionEl,
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: true,
      onUpdate: (self) => {
        updateAccentColor(self.progress)
      }
    })

    // 卡片强调色动画 - 跟随强调色变化
    ScrollTrigger.create({
      trigger: sectionEl,
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: true,
      onUpdate: (self) => {
        cards.forEach((_, index) => {
          const accentEl = sectionEl.querySelector(`.ac-card-${index}-254 .ac-card-accent-254`)
          if (accentEl) {
            const hue = (self.progress * 360 + index * 30) % 360
            accentEl.setAttribute('style', `background: hsl(${hue}, 80%, 50%);`)
          }
        })
      }
    })

    // 演示按钮悬停效果
    if (demoButton.value) {
      demoButton.value.addEventListener('mouseenter', () => {
        gsap.to(demoButton.value, {
          scale: 1.1,
          boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
          duration: 0.4,
          ease: 'power2.out'
        })
      })

      demoButton.value.addEventListener('mouseleave', () => {
        gsap.to(demoButton.value, {
          scale: 1,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          duration: 0.4,
          ease: 'power2.out'
        })
      })

      demoButton.value.addEventListener('click', () => {
        gsap.to(demoButton.value, {
          scale: 0.9,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut'
        })
      })
    }

    // 卡片悬停效果
    cards.forEach((_, index) => {
      const card = sectionEl.querySelector(`.ac-card-${index}-254`)
      if (!card) return

      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.05,
          y: -10,
          duration: 0.4,
          ease: 'power2.out'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out'
        })
      })
    })

    // 渐变色块悬停效果
    const colorEls = sectionEl.querySelectorAll('.ac-gradient-color-254')
    colorEls.forEach((colorEl, index) => {
      colorEl.addEventListener('mouseenter', () => {
        gsap.to(colorEl, {
          scale: 1.4,
          y: -10,
          duration: 0.3,
          ease: 'back.out(1.7)'
        })
      })

      colorEl.addEventListener('mouseleave', () => {
        gsap.to(colorEl, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })
  }, componentRoot.value)
})

onUnmounted(() => {
  // 清理 CSS 变量
  document.documentElement.style.removeProperty('--accent')
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.accent-color-section-254 {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, var(--accent, #ff0000) 0%, #1a1a2e 100%);
  transition: background 0.1s linear;

  opacity: 1 !important;}

.ac-container-254 {
  text-align: center;
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;

  opacity: 1 !important;}

.ac-title-254 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  margin-bottom: 16px;
  color: white;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  opacity: 1 !important;}

.ac-subtitle-254 {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 60px;

  opacity: 1 !important;}

.ac-scroll-indicator-254 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-bottom: 60px;
  padding: 30px 40px;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.ac-indicator-line-254 {
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, transparent, white, transparent);

  opacity: 1 !important;}

.ac-indicator-text-254 {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  letter-spacing: 2px;

  opacity: 1 !important;}

.ac-color-track-254 {
  margin-bottom: 60px;
  padding: 0 40px;

  opacity: 1 !important;}

.ac-progress-track-254 {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 20px;

  opacity: 1 !important;}

.ac-progress-bar-254 {
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, #ff0000, #00ff00, #0000ff, #9400d3);
  border-radius: 4px;
  transition: width 0.1s linear;

  opacity: 1 !important;}

.ac-color-labels-254 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;

  opacity: 1 !important;}

.ac-color-label-254 {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;

  opacity: 1 !important;}

.ac-content-254 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
  width: 100%;

  opacity: 1 !important;}

.ac-color-display-254 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px 60px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);

  opacity: 1 !important;}

.ac-current-color-254 {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--accent, #ff0000);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 4px solid white;

  opacity: 1 !important;}

.ac-color-code-254 {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  font-family: 'Courier New', monospace;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  opacity: 1 !important;}

.ac-cards-grid-254 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  width: 100%;
  max-width: 1000px;

  opacity: 1 !important;}

.ac-card-253 {
  padding: 40px 30px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.95);
  cursor: pointer;
  transition: all 0.4s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.ac-card-accent-254 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--accent, #ff0000);
  transition: background 0.1s linear;

  opacity: 1 !important;}

.ac-card-icon-254 {
  font-size: 3rem;
  margin-bottom: 20px;

  opacity: 1 !important;}

.ac-card-title-254 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;

  opacity: 1 !important;}

.ac-card-desc-254 {
  font-size: 0.95rem;
  color: #666;

  opacity: 1 !important;}

.ac-gradient-preview-254 {
  text-align: center;
  padding: 40px 60px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);

  opacity: 1 !important;}

.ac-gradient-title-254 {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 30px;

  opacity: 1 !important;}

.ac-gradient-bar-254 {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.ac-gradient-color-254 {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  opacity: 1 !important;}

.ac-interactive-demo-254 {
  text-align: center;
  padding: 40px 60px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);

  opacity: 1 !important;}

.ac-demo-title-254 {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 30px;

  opacity: 1 !important;}

.ac-demo-button-254 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 32px;
  border: none;
  border-radius: 12px;
  background: white;
  color: var(--accent, #ff0000);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.4s ease;

  opacity: 1 !important;}

.ac-button-icon {
  font-size: 1.3rem;

  opacity: 1 !important;}

.ac-footer-254 {
  margin-top: 60px;
  padding: 20px 40px;

  opacity: 1 !important;}

.ac-footer-text-254 {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 1px;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .ac-scroll-indicator-254 {
    flex-direction: column;
    gap: 20px;
    padding: 25px 30px;
  
  opacity: 1 !important;}

  .ac-indicator-line-254 {
    width: 60px;
    height: 2px;
    transform: rotate(90deg);
  
  opacity: 1 !important;}

  .ac-indicator-text-254 {
    font-size: 1rem;
  
  opacity: 1 !important;}

  .ac-cards-grid-254 {
    grid-template-columns: 1fr;
  }

  .ac-color-display-254 {
    padding: 30px 40px;
  
  opacity: 1 !important;}

  .ac-current-color-254 {
    width: 80px;
    height: 80px;
  
  opacity: 1 !important;}

  .ac-gradient-bar-254 {
    gap: 8px;
  }

  .ac-gradient-color-254 {
    width: 40px;
    height: 40px;
  
  opacity: 1 !important;}
}
</style>
