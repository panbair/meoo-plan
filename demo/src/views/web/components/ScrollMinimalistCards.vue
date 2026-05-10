<template>
  <div class="scroll-minimalist-cards-232">
    <!-- 简约背景 -->
    <div class="minimal-bg-232">
      <div class="bg-gradient-232"></div>
    </div>

    <!-- 几何装饰 -->
    <div class="geometric-deco-232">
      <div v-for="n in 8" :key="n" class="geo-shape-232" :class="`geo-${n}-232`"></div>
    </div>

    <!-- 主标题 -->
    <div class="minimal-title-232">
      <h2 class="title-text-232">
        <span class="title-main-232">MINIMALISM</span>
        <span class="title-sub-232">简约之美</span>
      </h2>
      <div class="title-line-232"></div>
    </div>

    <!-- 卡片容器 -->
    <div class="minimal-container-232">
      <div v-for="(item, index) in items" :key="index" class="minimal-card-232" :class="`card-${index + 1}-232`">
        <!-- 卡片内容 -->
        <div class="card-inner-232">
          <!-- 编号 -->
          <div class="card-number-232">
            <span class="number-text-232">{{ String(index + 1).padStart(2, '0') }}</span>
          </div>

          <!-- 图标 -->
          <div class="card-icon-232">
            <div class="icon-box-232">
              <span class="icon-emoji-232">{{ item.icon }}</span>
            </div>
          </div>

          <!-- 标题 -->
          <h3 class="card-title-232">
            {{ item.title }}
            <span class="title-underline-232"></span>
          </h3>

          <!-- 描述 -->
          <p class="card-desc-232">{{ item.desc }}</p>

          <!-- 标签 -->
          <div class="card-tags-232">
            <span v-for="(tag, i) in item.tags" :key="i" class="tag-232">{{ tag }}</span>
          </div>

          <!-- 数据展示 -->
          <div class="card-metrics-232">
            <div class="metric-232">
              <span class="metric-value-232">{{ item.value }}%</span>
              <span class="metric-label-232">完成度</span>
            </div>
            <div class="metric-progress-232">
              <div class="progress-bar-232">
                <div class="progress-fill-232" :style="{ width: `${item.value}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 悬停效果 -->
        <div class="hover-effect-232"></div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="minimal-footer-232">
      <div class="footer-line-232"></div>
      <span class="footer-text-232">LESS IS MORE</span>
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
  {
    icon: '○',
    title: 'Focus',
    desc: '专注本质，剔除冗余',
    tags: ['简约', '纯粹'],
    value: 95
  },
  {
    icon: '□',
    title: 'Balance',
    desc: '平衡功能与美观',
    tags: ['平衡', '和谐'],
    value: 88
  },
  {
    icon: '△',
    title: 'Clarity',
    desc: '清晰表达，直观呈现',
    tags: ['清晰', '直观'],
    value: 92
  },
  {
    icon: '◇',
    title: 'Elegance',
    desc: '优雅设计，流畅体验',
    tags: ['优雅', '流畅'],
    value: 90
  },
  {
    icon: '⬡',
    title: 'Purpose',
    desc: '目的明确，直击核心',
    tags: ['目的', '核心'],
    value: 87
  },
  {
    icon: '⬢',
    title: 'Simplicity',
    desc: '简单明了，易于理解',
    tags: ['简单', '明了'],
    value: 94
  }
]

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题入场动画 - 使用ScrollTrigger
    gsap.fromTo('.minimal-title-232',
      { y: -60, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.minimal-title-232',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out'
      }
    )

    gsap.fromTo('.title-main-232',
      { y: 30, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.minimal-title-232',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 0,
        opacity: 1,
        duration: 0.6,
        delay: 0.1,
        ease: 'power2.out'
      }
    )

    gsap.fromTo('.title-sub-232',
      { y: 20, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.minimal-title-232',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 0,
        opacity: 1,
        duration: 0.6,
        delay: 0.2,
        ease: 'power2.out'
      }
    )

    gsap.fromTo('.title-line-232',
      { width: 0 },
      {
        scrollTrigger: {
          trigger: '.minimal-title-232',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        width: '60px',
        duration: 0.6,
        delay: 0.25,
        ease: 'power2.out'
      }
    )

    // 几何装饰动画
    gsap.fromTo('.geo-shape-232',
      { scale: 0, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.scroll-minimalist-cards-232',
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        },
        scale: 1,
        opacity: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: 'back.out(1.7)'
      }
    )

    // 卡片入场 - 使用ScrollTrigger
    gsap.fromTo('.minimal-card-232',
      { y: 60, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.minimal-container-232',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out'
      }
    )

    // 卡片内部元素动画
    const cards = gsap.utils.toArray('.minimal-card-232')
    cards.forEach((card, i) => {
      gsap.fromTo(card.querySelector('.card-number-232'),
        { x: -20, opacity: 0 },
        {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          x: 0,
          opacity: 1,
          duration: 0.5,
          delay: i * 0.12,
          ease: 'power2.out'
        }
      )

      gsap.fromTo(card.querySelector('.card-icon-232'),
        { scale: 0, opacity: 0 },
        {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          scale: 1,
          opacity: 1,
          duration: 0.5,
          delay: i * 0.12 + 0.08,
          ease: 'back.out(1.7)'
        }
      )

      gsap.fromTo(card.querySelector('.card-title-232'),
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
          delay: i * 0.12 + 0.12,
          ease: 'power2.out'
        }
      )

      gsap.fromTo(card.querySelector('.card-desc-232'),
        { y: 12, opacity: 0 },
        {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          y: 0,
          opacity: 1,
          duration: 0.5,
          delay: i * 0.12 + 0.16,
          ease: 'power2.out'
        }
      )

      gsap.fromTo(card.querySelectorAll('.tag-232'),
        { y: 8, opacity: 0 },
        {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.04,
          delay: i * 0.12 + 0.2,
          ease: 'power2.out'
        }
      )

      gsap.fromTo(card.querySelector('.progress-fill-232'),
        { width: 0 },
        {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          width: `${items[i].value}%`,
          duration: 0.8,
          delay: i * 0.12 + 0.24,
          ease: 'power3.out'
        }
      )

      gsap.fromTo(card.querySelector('.metric-value-232'),
        { y: 10, opacity: 0 },
        {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          y: 0,
          opacity: 1,
          duration: 0.5,
          delay: i * 0.12 + 0.28,
          ease: 'power2.out'
        }
      )

      // 鼠标交互 - 添加事件监听器用于清理
      const mouseEnterHandler = () => {
        gsap.to(card.querySelector('.icon-box-232'), {
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out'
        })

        gsap.to(card.querySelector('.title-underline-232'), {
          width: '100%',
          duration: 0.5,
          ease: 'power2.out'
        })
      }

      const mouseLeaveHandler = () => {
        gsap.to(card.querySelector('.icon-box-232'), {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        })

        gsap.to(card.querySelector('.title-underline-232'), {
          width: 0,
          duration: 0.5,
          ease: 'power2.out'
        })
      }

      card.addEventListener('mouseenter', mouseEnterHandler)
      card.addEventListener('mouseleave', mouseLeaveHandler)

      eventListeners.push({ element: card, event: 'mouseenter', handler: mouseEnterHandler })
      eventListeners.push({ element: card, event: 'mouseleave', handler: mouseLeaveHandler })
    })

    // 底部装饰
    gsap.fromTo('.minimal-footer-232',
      { y: 20, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.minimal-footer-232',
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
.scroll-minimalist-cards-232 {
  min-height: 100vh;
  background: #fafafa;
  padding: 100px 20px;
  position: relative;
  overflow: hidden;
}

/* 简约背景 */
.minimal-bg-232 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.bg-gradient-232 {
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 10% 20%, rgba(0,0,0,0.02) 0%, transparent 50%),
    radial-gradient(circle at 90% 80%, rgba(0,0,0,0.02) 0%, transparent 50%);
}

/* 几何装饰 */
.geometric-deco-232 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.geo-shape-232 {
  position: absolute;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.geo-1-232 { width: 100px; height: 100px; top: 10%; left: 5%; border-radius: 50%; }
.geo-2-232 { width: 80px; height: 80px; top: 30%; right: 10%; }
.geo-3-232 { width: 60px; height: 60px; top: 50%; left: 8%; border-radius: 50%; }
.geo-4-232 { width: 120px; height: 120px; top: 70%; right: 5%; }
.geo-5-232 { width: 50px; height: 50px; top: 20%; right: 20%; border-radius: 50%; }
.geo-6-232 { width: 90px; height: 90px; top: 60%; left: 3%; }
.geo-7-232 { width: 70px; height: 70px; top: 85%; right: 15%; border-radius: 50%; }
.geo-8-232 { width: 40px; height: 40px; top: 40%; left: 12%; }

/* 主标题 */
.minimal-title-232 {
  text-align: center;
  margin-bottom: 100px;
  position: relative;
  z-index: 10;
}

.title-text-232 {
  display: block;
  margin-bottom: 20px;
}

.title-main-232 {
  display: block;
  font-size: 42px;
  font-weight: 300;
  color: #1a1a1a;
  letter-spacing: 8px;
  margin-bottom: 10px;
}

.title-sub-232 {
  display: block;
  font-size: 14px;
  color: #999;
  letter-spacing: 6px;
}

.title-line-232 {
  width: 60px;
  height: 1px;
  background: #1a1a1a;
  margin: 0 auto;
}

/* 卡片容器 */
.minimal-container-232 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  z-index: 10;
}

/* 卡片样式 */
.minimal-card-232 {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 50px 40px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
}

.minimal-card-232:hover {
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  transform: translateY(-5px);
}

/* 卡片内容 */
.card-inner-232 {
  position: relative;
  z-index: 2;
}

/* 编号 */
.card-number-232 {
  margin-bottom: 30px;
}

.number-text-232 {
  font-size: 48px;
  font-weight: 200;
  color: rgba(0, 0, 0, 0.1);
  letter-spacing: 2px;
}

/* 图标 */
.card-icon-232 {
  margin-bottom: 30px;
}

.icon-box-232 {
  width: 80px;
  height: 80px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.minimal-card-232:hover .icon-box-232 {
  border-color: rgba(0, 0, 0, 0.2);
}

.icon-emoji-232 {
  font-size: 32px;
  color: #1a1a1a;
}

/* 标题 */
.card-title-232 {
  font-size: 24px;
  font-weight: 300;
  color: #1a1a1a;
  margin-bottom: 15px;
  position: relative;
  display: inline-block;
}

.title-underline-232 {
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: #1a1a1a;
  transition: width 0.5s ease;
}

/* 描述 */
.card-desc-232 {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 25px;
  letter-spacing: 0.5px;
}

/* 标签 */
.card-tags-232 {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.tag-232 {
  font-size: 12px;
  color: #999;
  padding: 6px 14px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.minimal-card-232:hover .tag-232 {
  border-color: rgba(0, 0, 0, 0.1);
  color: #666;
}

/* 数据展示 */
.card-metrics-232 {
  padding-top: 25px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.metric-232 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.metric-value-232 {
  font-size: 28px;
  font-weight: 200;
  color: #1a1a1a;
}

.metric-label-232 {
  font-size: 12px;
  color: #999;
  letter-spacing: 1px;
}

/* 进度条 */
.metric-progress-232 {
  width: 100%;
}

.progress-bar-232 {
  width: 100%;
  height: 2px;
  background: rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.progress-fill-232 {
  height: 100%;
  background: #1a1a1a;
  transition: width 0.5s ease;
}

/* 悬停效果 */
.hover-effect-232 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 0, 0, 0.02) 0%, transparent 50%);
  transition: opacity 0.3s ease;
}

.minimal-card-232:hover .hover-effect-232 {
  opacity: 1;
}

/* 底部装饰 */
.minimal-footer-232 {
  text-align: center;
  margin-top: 100px;
  position: relative;
  z-index: 10;
}

.footer-line-232 {
  width: 100px;
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 0 auto 20px;
}

.footer-text-232 {
  font-size: 12px;
  color: #999;
  letter-spacing: 4px;
}

/* 响应式 */
@media (max-width: 768px) {
  .title-main-232 {
    font-size: 32px;
    letter-spacing: 4px;
  }

  .minimal-container-232 {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .card-inner-232 {
    padding: 30px 20px;
  }
}
</style>
