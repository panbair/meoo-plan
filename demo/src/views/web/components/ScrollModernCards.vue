<template>
  <div class="modern-container-235">
    <!-- 标题区域 -->
    <div class="modern-header-235">
      <h2 class="modern-title-235">现代美学</h2>
      <p class="modern-subtitle-235">Modern Aesthetics</p>
    </div>

    <!-- 卡片容器 -->
    <div class="modern-wrapper-235">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="modern-card-235"
        :data-index="index"
      >
        <div class="card-top-235">
          <span class="card-index-235">{{ String(index + 1).padStart(2, '0') }}</span>
          <div class="card-dot-235"></div>
        </div>
        
        <div class="card-content-235">
          <div class="card-symbol-235">{{ item.symbol }}</div>
          <h3 class="card-name-235">{{ item.name }}</h3>
          <div class="card-tag-235">{{ item.tag }}</div>
        </div>

        <div class="card-bottom-235">
          <div class="bar-bg-235">
            <div class="bar-fill-235" :style="{ width: item.value + '%' }"></div>
          </div>
          <span class="bar-text-235">{{ item.value }}%</span>
        </div>
      </div>
    </div>

    <!-- 底部标识 -->
    <div class="modern-credit-235">
      <span>DESIGN</span>
      <span class="credit-dot-235">·</span>
      <span>2026</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let ctx = null
const eventListeners = [] // 存储事件监听器用于清理

const items = [
  { symbol: '◯', name: 'Circle', tag: '圆形', value: 92 },
  { symbol: '▢', name: 'Square', tag: '方形', value: 88 },
  { symbol: '△', name: 'Triangle', tag: '三角形', value: 95 },
  { symbol: '◇', name: 'Diamond', tag: '菱形', value: 90 },
  { symbol: '⬡', name: 'Hexagon', tag: '六边形', value: 87 },
  { symbol: '★', name: 'Star', tag: '星形', value: 93 }
]

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.modern-title-235', {
      scrollTrigger: {
        trigger: '.modern-title-235',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })

    gsap.from('.modern-subtitle-235', {
      scrollTrigger: {
        trigger: '.modern-subtitle-235',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: -30,
      opacity: 0,
      duration: 0.6,
      delay: 0.15,
      ease: 'power2.out'
    })

    // 卡片入场
    gsap.fromTo('.modern-card-235',
      { x: 80, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.modern-wrapper-235',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      }
    )

      // 卡片内部动画
      const cards = gsap.utils.toArray('.modern-card-235')
      cards.forEach((card, i) => {
        // 顶部
        gsap.fromTo(card.querySelector('.card-top-235'),
          { y: -15, opacity: 0 },
          {
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            },
            y: 0,
            opacity: 1,
            duration: 0.5,
            delay: i * 0.1,
            ease: 'power2.out'
          }
        )

        // 符号
        gsap.fromTo(card.querySelector('.card-symbol-235'),
          { scale: 0, rotation: -90, opacity: 0 },
          {
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            },
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 0.6,
            delay: i * 0.1 + 0.1,
            ease: 'back.out(1.7)'
          }
        )

        // 名称
        gsap.fromTo(card.querySelector('.card-name-235'),
          { y: 20, opacity: 0 },
          {
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            },
            y: 0,
            opacity: 1,
            duration: 0.5,
            delay: i * 0.1 + 0.2,
            ease: 'power2.out'
          }
        )

        // 标签
        gsap.fromTo(card.querySelector('.card-tag-235'),
          { y: 15, opacity: 0 },
          {
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            },
            y: 0,
            opacity: 1,
            duration: 0.5,
            delay: i * 0.1 + 0.25,
            ease: 'power2.out'
          }
        )

        // 进度条背景
        gsap.fromTo(card.querySelector('.bar-bg-235'),
          { scaleX: 0 },
          {
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            },
            scaleX: 1,
            duration: 0.6,
            delay: i * 0.1 + 0.3,
            ease: 'power2.out',
            transformOrigin: 'left center'
          }
        )

        // 进度条填充
        gsap.fromTo(card.querySelector('.bar-fill-235'),
          { width: '0%' },
          {
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            },
            width: `${items[i].value}%`,
            duration: 0.8,
            delay: i * 0.1 + 0.4,
            ease: 'power3.out'
          }
        )

        // 进度文字
        gsap.fromTo(card.querySelector('.bar-text-235'),
          { x: 15, opacity: 0 },
          {
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            },
            x: 0,
            opacity: 1,
            duration: 0.5,
            delay: i * 0.1 + 0.5,
            ease: 'power2.out'
          }
        )

        // 悬停效果
        const mouseEnterHandler = () => {
          gsap.to(card.querySelector('.card-symbol-235'), {
            scale: 1.15,
            rotation: 15,
            duration: 0.4,
            ease: 'power2.out'
          })

          gsap.to(card.querySelector('.card-dot-235'), {
            scale: 1.5,
            backgroundColor: '#000000',
            duration: 0.3,
            ease: 'power2.out'
          })

          gsap.to(card.querySelector('.bar-fill-235'), {
            width: '100%',
            duration: 0.6,
            ease: 'power2.out'
          })
        }

        const mouseLeaveHandler = () => {
          gsap.to(card.querySelector('.card-symbol-235'), {
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: 'power2.out'
          })

          gsap.to(card.querySelector('.card-dot-235'), {
            scale: 1,
            backgroundColor: '#cccccc',
            duration: 0.3,
            ease: 'power2.out'
          })

          gsap.to(card.querySelector('.bar-fill-235'), {
            width: `${items[i].value}%`,
            duration: 0.6,
            ease: 'power2.out'
          })
        }

        card.addEventListener('mouseenter', mouseEnterHandler)
        card.addEventListener('mouseleave', mouseLeaveHandler)

        eventListeners.push({ element: card, event: 'mouseenter', handler: mouseEnterHandler })
        eventListeners.push({ element: card, event: 'mouseleave', handler: mouseLeaveHandler })
      })

      // 底部标识
      gsap.fromTo('.modern-credit-235',
        { y: 20, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.modern-credit-235',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          },
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out'
        }
      )
    })
  })

onUnmounted(() => {
  ctx?.revert()
  // 清理事件监听器
  eventListeners.forEach(({ element, event, handler }) => {
    element.removeEventListener(event, handler)
  })
  eventListeners.length = 0
})
</script>

<style scoped>
.modern-container-235 {
  min-height: 100vh;
  background: #f8f8f8;
  padding: 80px 40px;
  position: relative;
}

/* 标题区域 */
.modern-header-235 {
  text-align: center;
  margin-bottom: 60px;
}

.modern-title-235 {
  font-size: 42px;
  font-weight: 300;
  color: #1a1a1a;
  letter-spacing: 6px;
  margin: 0;
}

.modern-subtitle-235 {
  font-size: 12px;
  font-weight: 400;
  color: #888888;
  letter-spacing: 8px;
  margin-top: 12px;
  text-transform: uppercase;
}

/* 卡片容器 */
.modern-wrapper-235 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  max-width: 1100px;
  margin: 0 auto;
}

/* 卡片 */
.modern-card-235 {
  background: #ffffff;
  padding: 32px;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.modern-card-235:hover {
  transform: translateX(-8px);
  box-shadow: -8px 8px 24px rgba(0, 0, 0, 0.08);
}

/* 卡片顶部 */
.card-top-235 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.card-index-235 {
  font-size: 11px;
  font-weight: 300;
  color: #999999;
  letter-spacing: 2px;
}

.card-dot-235 {
  width: 6px;
  height: 6px;
  background: #cccccc;
  border-radius: 50%;
  transition: all 0.3s ease;
}

/* 卡片内容 */
.card-content-235 {
  margin-bottom: 32px;
}

.card-symbol-235 {
  font-size: 44px;
  color: #1a1a1a;
  margin-bottom: 16px;
  display: inline-block;
}

.card-name-235 {
  font-size: 20px;
  font-weight: 400;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  letter-spacing: 1px;
}

.card-tag-235 {
  font-size: 12px;
  font-weight: 300;
  color: #888888;
  letter-spacing: 2px;
  text-transform: uppercase;
}

/* 卡片底部 */
.card-bottom-235 {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bar-bg-235 {
  flex: 1;
  height: 2px;
  background: #f0f0f0;
  overflow: hidden;
}

.bar-fill-235 {
  height: 100%;
  background: #1a1a1a;
  transition: width 0.6s ease;
}

.bar-text-235 {
  font-size: 11px;
  font-weight: 400;
  color: #1a1a1a;
  min-width: 32px;
  text-align: right;
  letter-spacing: 0.5px;
}

/* 底部标识 */
.modern-credit-235 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 80px;
  font-size: 11px;
  font-weight: 300;
  color: #999999;
  letter-spacing: 4px;
}

.credit-dot-235 {
  color: #cccccc;
}

/* 响应式 */
@media (max-width: 768px) {
  .modern-title-235 {
    font-size: 28px;
    letter-spacing: 4px;
  }

  .modern-subtitle-235 {
    font-size: 10px;
    letter-spacing: 6px;
  }

  .modern-wrapper-235 {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .modern-card-235 {
    padding: 24px;
  }

  .card-symbol-235 {
    font-size: 36px;
  }

  .card-name-235 {
    font-size: 18px;
  }

  .modern-card-235:hover {
    transform: translateX(-4px);
    box-shadow: -4px 4px 16px rgba(0, 0, 0, 0.06);
  }
}
</style>
