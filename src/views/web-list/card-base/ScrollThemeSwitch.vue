<template>
  <div class="theme-switch-section-253" ref="componentRoot">
    <div class="ts-container-253">
      <h2 class="ts-title-253">主题切换</h2>
      <p class="ts-subtitle-253">滚动切换深色/浅色主题</p>

      <div class="ts-theme-trigger-253" ref="triggerZone">
        <div class="ts-trigger-line-253"></div>
        <div class="ts-trigger-text-253">↓ 滚动切换主题 ↓</div>
        <div class="ts-trigger-line-253"></div>
      </div>

      <div class="ts-content-253">
        <div class="ts-theme-indicator-253" ref="themeIndicator">
          <div class="ts-indicator-icon-253">{{ currentTheme === 'light' ? '☀️' : '🌙' }}</div>
          <div class="ts-indicator-text-253">{{ currentTheme === 'light' ? '浅色模式' : '深色模式' }}</div>
        </div>

        <div class="ts-card-grid-253">
          <div class="ts-card-253" v-for="(card, index) in cards" :key="index" :class="`ts-card-${index}-253`">
            <div class="ts-card-icon-253">{{ card.icon }}</div>
            <h3 class="ts-card-title-253">{{ card.title }}</h3>
            <p class="ts-card-desc-253">{{ card.desc }}</p>
          </div>
        </div>

        <div class="ts-color-palette-253">
          <div class="ts-palette-title-253">主题色彩预览</div>
          <div class="ts-colors-253">
            <div class="ts-color-253" v-for="(color, index) in colors" :key="index" :style="{ background: color }"></div>
          </div>
        </div>
      </div>

      <div class="ts-footer-253">
        <p class="ts-footer-text-253">继续滚动体验更多动画效果</p>
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
const triggerZone = ref<HTMLElement | null>(null)
const themeIndicator = ref<HTMLElement | null>(null)

const currentTheme = ref<'light' | 'dark'>('light')

const cards = [
  { icon: '🎨', title: '色彩系统', desc: '动态主题切换' },
  { icon: '✨', title: '视觉体验', desc: '平滑过渡动画' },
  { icon: '🌈', title: '个性化', desc: '多种主题选择' },
  { icon: '💫', title: '沉浸式', desc: '自适应界面' }
]

const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']

let ctx: gsap.Context

// 切换主题
const switchTheme = (theme: 'light' | 'dark') => {
  currentTheme.value = theme
  document.body.style.setProperty('--theme-bg', theme === 'light' ? '#fff' : '#0a0a14')
  document.body.style.setProperty('--theme-text', theme === 'light' ? '#333' : '#e2e8f0')
  document.body.style.setProperty('--theme-card-bg', theme === 'light' ? '#f8f9fa' : '#1a1a2e')
  document.body.style.setProperty('--theme-border', theme === 'light' ? '#e9ecef' : '#2d2d44')
}

// 初始化主题
const initTheme = () => {
  document.body.style.setProperty('--theme-bg', '#fff')
  document.body.style.setProperty('--theme-text', '#333')
  document.body.style.setProperty('--theme-card-bg', '#f8f9fa')
  document.body.style.setProperty('--theme-border', '#e9ecef')
}

onMounted(() => {
  // 初始化主题样式
  initTheme()

  ctx = gsap.context(() => {
    const sectionEl = componentRoot.value
    if (!sectionEl) return

    // 标题入场动画
    gsap.from('.ts-title-253', {
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
    gsap.from('.ts-subtitle-253', {
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

    // 触发区域动画
    gsap.from('.ts-theme-trigger-253', {
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

    // 触发线动画
    gsap.from('.ts-trigger-line-253', {
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

    // 主题指示器动画
    gsap.from('.ts-theme-indicator-253', {
      y: 80,
      opacity: 0,
      scale: 0.7,
      rotationX: 90,
      duration: 1.2,
      delay: 0.5,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.ts-content-253',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })

    // 图标脉冲动画
    gsap.to('.ts-indicator-icon-253', {
      scale: 1.2,
      duration: 0.6,
      yoyo: true,
      repeat: -1,
      ease: 'power1.inOut'
    })

    // 卡片入场动画
    cards.forEach((_, index) => {
      gsap.from(`.ts-card-${index}-253`, {
        y: 100,
        opacity: 0,
        scale: 0.8,
        rotationX: 30,
        duration: 1,
        delay: 0.8 + index * 0.15,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.ts-content-253',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      })
    })

    // 色彩预览动画
    gsap.from('.ts-color-palette-253', {
      y: 60,
      opacity: 0,
      duration: 1,
      delay: 1.4,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.ts-content-253',
        start: 'top 65%',
        toggleActions: 'play none none reverse'
      }
    })

    gsap.from('.ts-color-253', {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      delay: 1.6,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.ts-content-253',
        start: 'top 60%',
        toggleActions: 'play none none reverse'
      }
    })

    // 页脚入场
    gsap.from('.ts-footer-253', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      delay: 1.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionEl,
        start: 'bottom 95%',
        toggleActions: 'play none none reverse'
      }
    })

    // 主题切换滚动触发
    ScrollTrigger.create({
      trigger: sectionEl,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => {
        // 滚动到中心区域时切换到深色主题
        switchTheme('dark')
        gsap.to('.ts-theme-indicator-253', {
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out'
        })
      },
      onEnterBack: () => {
        // 从底部返回时切换到浅色主题
        switchTheme('light')
        gsap.to('.ts-theme-indicator-253', {
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out'
        })
      },
      onLeave: () => {
        // 离开时切换到浅色主题
        switchTheme('light')
      },
      onLeaveBack: () => {
        // 从顶部返回时保持深色
        switchTheme('dark')
      }
    })

    // 卡片悬停效果
    cards.forEach((_, index) => {
      const card = sectionEl.querySelector(`.ts-card-${index}-253`)
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

    // 颜色块悬停效果
    const colorEls = sectionEl.querySelectorAll('.ts-color-253')
    colorEls.forEach(colorEl => {
      colorEl.addEventListener('mouseenter', () => {
        gsap.to(colorEl, {
          scale: 1.3,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          duration: 0.3,
          ease: 'back.out(1.7)'
        })
      })

      colorEl.addEventListener('mouseleave', () => {
        gsap.to(colorEl, {
          scale: 1,
          boxShadow: 'none',
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })
  }, componentRoot.value)
})

onUnmounted(() => {
  // 清理主题样式
  document.body.style.removeProperty('--theme-bg')
  document.body.style.removeProperty('--theme-text')
  document.body.style.removeProperty('--theme-card-bg')
  document.body.style.removeProperty('--theme-border')
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.theme-switch-section-253 {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  position: relative;
  overflow: hidden;
  background: var(--theme-bg, #fff);
  transition: background 0.6s ease;
}

.ts-container-253 {
  text-align: center;
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
}

.ts-title-253 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ts-subtitle-253 {
  font-size: 1.1rem;
  color: var(--theme-text, #333);
  opacity: 0.7;
  margin-bottom: 60px;
  transition: color 0.6s ease;
}

.ts-theme-trigger-253 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-bottom: 80px;
  padding: 30px 40px;
  border: 2px dashed var(--theme-border, #e9ecef);
  border-radius: 16px;
  background: var(--theme-card-bg, #f8f9fa);
  transition: all 0.6s ease;
}

.ts-trigger-line-253 {
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #667eea, transparent);
}

.ts-trigger-text-253 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--theme-text, #333);
  letter-spacing: 2px;
  transition: color 0.6s ease;
}

.ts-content-253 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
  width: 100%;
}

.ts-theme-indicator-253 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 60px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border: 2px solid rgba(102, 126, 234, 0.3);
}

.ts-indicator-icon-253 {
  font-size: 4rem;
}

.ts-indicator-text-253 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--theme-text, #333);
  transition: color 0.6s ease;
}

.ts-card-grid-253 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  width: 100%;
  max-width: 1000px;
}

.ts-card-253 {
  padding: 40px 30px;
  border-radius: 20px;
  background: var(--theme-card-bg, #f8f9fa);
  border: 2px solid var(--theme-border, #e9ecef);
  cursor: pointer;
  transition: all 0.6s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.ts-card-icon-253 {
  font-size: 3rem;
  margin-bottom: 20px;
}

.ts-card-title-253 {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--theme-text, #333);
  margin-bottom: 12px;
  transition: color 0.6s ease;
}

.ts-card-desc-253 {
  font-size: 0.95rem;
  color: var(--theme-text, #333);
  opacity: 0.7;
  transition: color 0.6s ease;
}

.ts-color-palette-253 {
  text-align: center;
  padding: 40px 60px;
  border-radius: 20px;
  background: var(--theme-card-bg, #f8f9fa);
  border: 2px solid var(--theme-border, #e9ecef);
  transition: all 0.6s ease;
}

.ts-palette-title-253 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--theme-text, #333);
  margin-bottom: 30px;
  transition: color 0.6s ease;
}

.ts-colors-253 {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.ts-color-253 {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.ts-footer-253 {
  margin-top: 60px;
  padding: 20px 40px;
}

.ts-footer-text-253 {
  font-size: 0.9rem;
  color: var(--theme-text, #333);
  opacity: 0.6;
  letter-spacing: 1px;
  transition: color 0.6s ease;
}

@media (max-width: 768px) {
  .ts-theme-trigger-253 {
    flex-direction: column;
    gap: 20px;
    padding: 25px 30px;
  }

  .ts-trigger-line-253 {
    width: 60px;
    height: 2px;
  }

  .ts-trigger-text-253 {
    font-size: 1rem;
  }

  .ts-card-grid-253 {
    grid-template-columns: 1fr;
  }

  .ts-theme-indicator-253 {
    padding: 30px 40px;
  }
}
</style>
