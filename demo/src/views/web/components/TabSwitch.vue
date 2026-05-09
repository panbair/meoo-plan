<template>
  <div class="tab-section-66">
    <div class="ts-header-66">
      <h2 class="ts-title-66">Tab 切换</h2>
      <p class="ts-subtitle-66">Tab Switch Animation</p>
    </div>

    <div class="tab-container-66">
      <div class="tab-nav-66">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab-btn-66"
          :class="{ 'ts-active-66': activeTab === index }"
          @click="switchTab(index)"
        >
          <span class="tab-icon-66">{{ tab.icon }}</span>
          <span class="tab-label-66">{{ tab.label }}</span>
        </button>
        <div class="tab-indicator-66" ref="indicator"></div>
      </div>

      <div class="tab-content-wrapper-66">
        <div class="tab-content-66" ref="tabContent">
          <div class="content-image-66" :style="{ backgroundImage: `url(${tabs[activeTab].image})` }"></div>
          <div class="content-text-66">
            <h3 class="content-title-66">{{ tabs[activeTab].title }}</h3>
            <p class="content-desc-66">{{ tabs[activeTab].description }}</p>
            <div class="content-stats-66">
              <div v-for="(stat, i) in tabs[activeTab].stats" :key="i" class="stat-item-66">
                <span class="stat-value-66">{{ stat.value }}</span>
                <span class="stat-label-66">{{ stat.label }}</span>
              </div>
            </div>
            <button class="content-action-66">了解更多</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const activeTab = ref(0)
const indicator = ref<HTMLElement>()
const tabContent = ref<HTMLElement>()

const tabs = [
  {
    icon: '📱',
    label: '移动端',
    title: '移动应用开发',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    description: '打造流畅的移动应用体验，支持iOS和Android平台，提供原生般的性能和用户体验。',
    stats: [
      { value: '98%', label: '用户满意度' },
      { value: '4.9', label: '应用评分' },
      { value: '2M+', label: '下载量' }
    ]
  },
  {
    icon: '💻',
    label: '桌面端',
    title: '桌面应用开发',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80',
    description: '构建功能强大的桌面应用程序，跨平台支持，提供一致的用户体验和高效的工作流程。',
    stats: [
      { value: '95%', label: '用户满意度' },
      { value: '4.8', label: '应用评分' },
      { value: '500K+', label: '下载量' }
    ]
  },
  {
    icon: '🌐',
    label: 'Web端',
    title: 'Web应用开发',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    description: '创建响应式Web应用，兼容各种浏览器和设备，提供无缝的浏览体验和丰富的交互功能。',
    stats: [
      { value: '99%', label: '用户满意度' },
      { value: '5.0', label: '应用评分' },
      { value: '10M+', label: '访问量' }
    ]
  },
  {
    icon: '⚙️',
    label: '后台',
    title: '管理系统开发',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    description: '设计直观的后台管理系统，提供强大的数据管理和分析功能，助力企业高效运营。',
    stats: [
      { value: '96%', label: '用户满意度' },
      { value: '4.7', label: '应用评分' },
      { value: '100K+', label: '企业用户' }
    ]
  }
]

let ctx: gsap.Context

const switchTab = (index: number) => {
  if (activeTab.value === index) return

  activeTab.value = index

  if (indicator.value) {
    const btns = document.querySelectorAll('.tab-btn-66')
    const targetBtn = btns[index] as HTMLElement
    gsap.to(indicator.value, {
      left: targetBtn.offsetLeft,
      width: targetBtn.offsetWidth,
      duration: 0.4,
      ease: 'power3.out'
    })
  }

  if (tabContent.value) {
    gsap.to(tabContent.value, {
      opacity: 0,
      y: 20,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        gsap.fromTo(tabContent.value,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
        )

        gsap.from('.content-title-66', {
          x: -30,
          opacity: 0,
          duration: 0.4,
          delay: 0.1,
          ease: 'power3.out'
        })

        gsap.from('.content-desc-66', {
          x: -30,
          opacity: 0,
          duration: 0.4,
          delay: 0.2,
          ease: 'power3.out'
        })

        gsap.from('.stat-item-66', {
          y: 20,
          opacity: 0,
          stagger: 0.08,
          duration: 0.4,
          delay: 0.3,
          ease: 'power3.out'
        })

        gsap.from('.content-action-66', {
          y: 20,
          opacity: 0,
          duration: 0.4,
          delay: 0.5,
          ease: 'power3.out'
        })
      }
    })
  }
}

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from('.ts-title-66', {
      scrollTrigger: { trigger: '.tab-section-66', start: 'top 80%' },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })

    gsap.from('.ts-subtitle-66', {
      scrollTrigger: { trigger: '.tab-section-66', start: 'top 75%' },
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power3.out'
    })

    gsap.from('.tab-btn-66', {
      scrollTrigger: { trigger: '.tab-nav-66', start: 'top 70%' },
      // y: 30,
      opacity: 0,
      stagger: 0.08,
      duration: 0.5,
      ease: 'power3.out'
    })

    gsap.from('.tab-content-66', {
      scrollTrigger: { trigger: '.tab-content-wrapper-66', start: 'top 60%' },
      scale: 0.95,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    })

    setTimeout(() => {
      const btns = document.querySelectorAll('.tab-btn-66')
      const firstBtn = btns[0] as HTMLElement
      if (indicator.value) {
        indicator.value.style.left = firstBtn.offsetLeft + 'px'
        indicator.value.style.width = firstBtn.offsetWidth + 'px'
      }
    }, 100)
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.tab-section-66 {
  min-height: 100vh;
  padding: 80px 40px;
  background: linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
}

.ts-header-66 {
  text-align: center;
  margin-bottom: 60px;
}

.ts-title-66 {
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ts-subtitle-66 {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 4px;
  text-transform: uppercase;
}

.tab-container-66 {
  max-width: 1000px;
  margin: 0 auto;
}

.tab-nav-66 {
  position: relative;
  display: flex !important;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.08);
  padding: 8px;
  border-radius: 16px;
  margin-bottom: 40px;
  overflow-x: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 1 !important;
}

.tab-btn-66 {
  position: relative;
  flex: 0 0 auto !important;
  min-width: 180px;
  padding: 16px 24px;
  background: transparent;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex !important;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  z-index: 1;
  color: rgba(255, 255, 255, 0.9) !important;
  opacity: 1 !important;

  &:hover {
    background: rgba(102, 126, 234, 0.15);
    color: rgba(255, 255, 255, 1) !important;
    transform: translateY(-2px);
  }

  &.ts-active-66 {
    color: #fff !important;
    background: rgba(102, 126, 234, 0.2);
  }
}

.tab-icon-66 {
  font-size: 2rem;
  display: block !important;
  line-height: 1;
  opacity: 1 !important;
}

.tab-label-66 {
  font-size: 0.9rem;
  font-weight: 600;
  color: inherit !important;
  display: block !important;
  white-space: nowrap;
  opacity: 1 !important;
}

.ts-active-66 .tab-label-66 {
  color: #fff !important;
}

.tab-indicator-66 {
  position: absolute;
  top: 8px;
  bottom: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  transition: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  opacity: 1 !important;
  display: block !important;
  z-index: 0;
}

.tab-content-wrapper-66 {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.tab-content-66 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 450px;
}

.content-image-66 {
  width: 100%;
  height: 100%;
  min-height: 300px;
  background-size: cover;
  background-position: center;
}

.content-text-66 {
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.content-title-66 {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.content-desc-66 {
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.8;
  margin-bottom: 32px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.content-stats-66 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.stat-item-66 {
  text-align: center;
  padding: 16px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.stat-value-66 {
  display: block;
  font-size: 1.8rem;
  font-weight: 800;
  color: #667eea;
  margin-bottom: 4px;
}

.stat-label-66 {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.content-action-66 {
  align-self: flex-start;
  padding: 14px 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 30px;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
  }
}

@media (min-width: 769px) {
  .tab-btn-66 {
    flex: 0 0 auto !important;
  }
}

@media (max-width: 768px) {
  .ts-title-66 {
    font-size: 2.2rem;
  }

  .tab-nav-66 {
    flex-wrap: wrap;
  }

  .tab-btn-66 {
    flex: 1 1 45%;
    padding: 12px 16px;
  }

  .tab-content-66 {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .content-image-66 {
    height: 250px;
  }

  .content-text-66 {
    padding: 32px 24px;
  }

  .content-stats-66 {
    grid-template-columns: 1fr;
  }

  .content-action-66 {
    width: 100%;
  }
}
</style>
