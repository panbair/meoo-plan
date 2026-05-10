<template>
  <div class="scroll-elegant-cards-233">
    <!-- 优雅背景 -->
    <div class="elegant-bg-233">
      <div class="bg-cream-233"></div>
    </div>

    <!-- 装饰线条 -->
    <div class="deco-lines-233">
      <div class="line-233 line-h-233-1"></div>
      <div class="line-233 line-h-233-2"></div>
      <div class="line-233 line-v-233-1"></div>
      <div class="line-233 line-v-233-2"></div>
    </div>

    <!-- 主标题 -->
    <div class="elegant-title-233">
      <div class="title-decoration-233">
        <div class="deco-left-233"></div>
        <div class="deco-center-233"></div>
        <div class="deco-right-233"></div>
      </div>
      <h2 class="title-text-233">
        <span class="title-en-233">ELEGANCE</span>
        <span class="title-cn-233">优雅致远</span>
      </h2>
    </div>

    <!-- 卡片容器 -->
    <div class="elegant-container-233">
      <div v-for="(card, index) in cards" :key="index" class="elegant-card-233" :class="`card-${index + 1}-233`">
        <!-- 卡片边框 -->
        <div class="card-frame-233">
          <div class="frame-corner-233 corner-tl-233"></div>
          <div class="frame-corner-233 corner-tr-233"></div>
          <div class="frame-corner-233 corner-bl-233"></div>
          <div class="frame-corner-233 corner-br-233"></div>
        </div>

        <!-- 卡片内容 -->
        <div class="card-content-233">
          <!-- 序号 -->
          <div class="card-sequence-233">
            <span class="seq-number-233">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="seq-separator-233">/</span>
            <span class="seq-total-233">06</span>
          </div>

          <!-- 图标 -->
          <div class="card-symbol-233">
            <div class="symbol-ring-233"></div>
            <span class="symbol-text-233">{{ card.symbol }}</span>
          </div>

          <!-- 标题 -->
          <h3 class="card-heading-233">
            {{ card.heading }}
            <span class="heading-ornament-233">❧</span>
          </h3>

          <!-- 描述 -->
          <p class="card-paragraph-233">{{ card.paragraph }}</p>

          <!-- 属性 -->
          <div class="card-attributes-233">
            <div v-for="(attr, i) in card.attributes" :key="i" class="attribute-item-233">
              <span class="attr-label-233">{{ attr.label }}</span>
              <span class="attr-separator-233">·</span>
              <span class="attr-value-233">{{ attr.value }}</span>
            </div>
          </div>
        </div>

        <!-- 悬停光效 -->
        <div class="card-glow-233"></div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="elegant-footer-233">
      <div class="footer-ornament-233">
        <div class="ornament-line-233"></div>
        <span class="ornament-symbol-233">✦</span>
        <div class="ornament-line-233"></div>
      </div>
      <span class="footer-quote-233">优雅是一种生活态度</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let ctx = null

const cards = [
  {
    symbol: '◆',
    heading: 'Timeless',
    paragraph: '超越时间的经典，历久弥新的永恒之美',
    attributes: [
      { label: '永恒', value: '∞' },
      { label: '经典', value: '100%' }
    ]
  },
  {
    symbol: '●',
    heading: 'Refined',
    paragraph: '精雕细琢的细节，完美呈现的质感',
    attributes: [
      { label: '精致', value: '98%' },
      { label: '完美', value: '99%' }
    ]
  },
  {
    symbol: '▲',
    heading: 'Balance',
    paragraph: '和谐统一的平衡，恰到好处的分寸',
    attributes: [
      { label: '和谐', value: '95%' },
      { label: '平衡', value: '97%' }
    ]
  },
  {
    symbol: '★',
    heading: 'Graceful',
    paragraph: '优雅从容的姿态，自然而然的流露',
    attributes: [
      { label: '优雅', value: '96%' },
      { label: '自然', value: '94%' }
    ]
  },
  {
    symbol: '◇',
    heading: 'Subtle',
    paragraph: '含蓄内敛的表达，不张扬的自信',
    attributes: [
      { label: '含蓄', value: '93%' },
      { label: '内敛', value: '95%' }
    ]
  },
  {
    symbol: '❖',
    heading: 'Sophisticated',
    paragraph: '成熟稳重的气质，深厚底蕴的内涵',
    attributes: [
      { label: '成熟', value: '97%' },
      { label: '内涵', value: '96%' }
    ]
  }
]

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题入场
    gsap.from('.elegant-title-233', {
      scrollTrigger: {
        trigger: '.elegant-title-233',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: -80,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    })

    gsap.from('.title-decoration-233 > div', {
      scrollTrigger: {
        trigger: '.title-decoration-233',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      width: 0,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out'
    })

    gsap.from('.title-text-233 > span', {
      scrollTrigger: {
        trigger: '.title-text-233',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out'
    })

    // 装饰线动画
    gsap.from('.line-233', {
      scrollTrigger: {
        trigger: '.deco-lines-233',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      scale: 0,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power2.out'
    })

    // 卡片入场
    gsap.from('.elegant-card-233', {
      scrollTrigger: {
        trigger: '.elegant-container-233',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out'
    })

    // 卡片内部动画
    const cardElements = gsap.utils.toArray('.elegant-card-233')
    cardElements.forEach((card, i) => {
      // 边框
      gsap.from(card.querySelector('.card-frame-233'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        scale: 0.95,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.15,
        ease: 'power2.out'
      })

      // 序号
      gsap.from(card.querySelector('.card-sequence-233'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        x: -20,
        opacity: 0,
        duration: 0.6,
        delay: i * 0.15 + 0.1,
        ease: 'power2.out'
      })

      // 符号环
      gsap.from(card.querySelector('.symbol-ring-233'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        scale: 0,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.15 + 0.15,
        ease: 'back.out(1.7)'
      })

      // 符号
      gsap.from(card.querySelector('.symbol-text-233'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        scale: 0,
        opacity: 0,
        duration: 0.6,
        delay: i * 0.15 + 0.2,
        ease: 'back.out(1.7)'
      })

      // 标题
      gsap.from(card.querySelector('.card-heading-233'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: i * 0.15 + 0.25,
        ease: 'power2.out'
      })

      // 装饰符号
      gsap.from(card.querySelector('.heading-ornament-233'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        scale: 0,
        rotation: -180,
        duration: 0.8,
        delay: i * 0.15 + 0.3,
        ease: 'back.out(1.7)'
      })

      // 段落
      gsap.from(card.querySelector('.card-paragraph-233'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 15,
        opacity: 0,
        duration: 0.6,
        delay: i * 0.15 + 0.35,
        ease: 'power2.out'
      })

      // 属性
      gsap.from(card.querySelectorAll('.attribute-item-233'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 15,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: i * 0.15 + 0.4,
        ease: 'power2.out'
      })
    })

    // 持续动画
    gsap.to('.symbol-ring-233', {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: 'none'
    })

    gsap.to('.heading-ornament-233', {
      rotation: 360,
      duration: 10,
      repeat: -1,
      ease: 'none'
    })

    // 鼠标交互
    cardElements.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card.querySelector('.card-frame-233'), {
          scale: 1.02,
          duration: 0.4,
          ease: 'power2.out'
        })

        gsap.to(card.querySelector('.symbol-ring-233'), {
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out'
        })

        gsap.to(card.querySelector('.card-glow-233'), {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card.querySelector('.card-frame-233'), {
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        })

        gsap.to(card.querySelector('.symbol-ring-233'), {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        })

        gsap.to(card.querySelector('.card-glow-233'), {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
.scroll-elegant-cards-233 {
  min-height: 100vh;
  background: #f5f5f0;
  padding: 100px 20px;
  position: relative;
  overflow: hidden;
}

/* 优雅背景 */
.elegant-bg-233 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.bg-cream-233 {
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 15% 25%, rgba(0,0,0,0.015) 0%, transparent 50%),
    radial-gradient(circle at 85% 75%, rgba(0,0,0,0.015) 0%, transparent 50%);
}

/* 装饰线条 */
.deco-lines-233 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.line-233 {
  position: absolute;
  background: rgba(0, 0, 0, 0.03);
}

.line-h-233-1 { width: 100%; height: 1px; top: 20%; }
.line-h-233-2 { width: 100%; height: 1px; top: 80%; }
.line-v-233-1 { width: 1px; height: 100%; left: 10%; }
.line-v-233-2 { width: 1px; height: 100%; right: 10%; }

/* 主标题 */
.elegant-title-233 {
  text-align: center;
  margin-bottom: 100px;
  position: relative;
  z-index: 10;
}

.title-decoration-233 {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
}

.deco-left-233,
.deco-right-233 {
  width: 80px;
  height: 1px;
  background: rgba(0, 0, 0, 0.2);
}

.deco-center-233 {
  width: 8px;
  height: 8px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  transform: rotate(45deg);
  margin: 0 20px;
}

.title-text-233 {
  display: block;
  margin-bottom: 20px;
}

.title-en-233 {
  display: block;
  font-size: 36px;
  font-weight: 200;
  color: #2a2a2a;
  letter-spacing: 12px;
  margin-bottom: 10px;
}

.title-cn-233 {
  display: block;
  font-size: 14px;
  color: #999;
  letter-spacing: 8px;
}

/* 卡片容器 */
.elegant-container-233 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 50px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  z-index: 10;
}

/* 卡片样式 */
.elegant-card-233 {
  background: white;
  padding: 50px 40px;
  position: relative;
  transition: all 0.5s ease;
}

.elegant-card-233:hover {
  transform: translateY(-8px);
}

/* 卡片边框 */
.card-frame-233 {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  pointer-events: none;
}

.frame-corner-233 {
  position: absolute;
  width: 15px;
  height: 15px;
  border-color: rgba(0, 0, 0, 0.08);
  border-width: 1px;
  transition: all 0.3s ease;
}

.elegant-card-233:hover .frame-corner-233 {
  border-color: rgba(0, 0, 0, 0.15);
}

.corner-tl-233 {
  top: 0;
  left: 0;
  border-top: inherit;
  border-left: inherit;
}

.corner-tr-233 {
  top: 0;
  right: 0;
  border-top: inherit;
  border-right: inherit;
}

.corner-bl-233 {
  bottom: 0;
  left: 0;
  border-bottom: inherit;
  border-left: inherit;
}

.corner-br-233 {
  bottom: 0;
  right: 0;
  border-bottom: inherit;
  border-right: inherit;
}

/* 卡片内容 */
.card-content-233 {
  position: relative;
  z-index: 2;
}

/* 序号 */
.card-sequence-233 {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 30px;
  font-family: 'Georgia', serif;
}

.seq-number-233 {
  font-size: 42px;
  font-weight: 200;
  color: rgba(0, 0, 0, 0.15);
}

.seq-separator-233,
.seq-total-233 {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.2);
}

/* 符号 */
.card-symbol-233 {
  width: 80px;
  height: 80px;
  margin: 0 auto 30px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.symbol-ring-233 {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.elegant-card-233:hover .symbol-ring-233 {
  border-color: rgba(0, 0, 0, 0.15);
}

.symbol-text-233 {
  position: relative;
  z-index: 1;
  font-size: 36px;
  color: #2a2a2a;
}

/* 标题 */
.card-heading-233 {
  font-size: 26px;
  font-weight: 200;
  color: #2a2a2a;
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  letter-spacing: 4px;
}

.heading-ornament-233 {
  display: block;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.1);
  margin-top: 10px;
}

/* 段落 */
.card-paragraph-233 {
  text-align: center;
  font-size: 14px;
  color: #666;
  line-height: 2;
  margin-bottom: 30px;
  letter-spacing: 1px;
}

/* 属性 */
.card-attributes-233 {
  display: flex;
  justify-content: center;
  gap: 30px;
  padding-top: 25px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.attribute-item-233 {
  font-size: 13px;
  color: #999;
  letter-spacing: 1px;
}

.attr-label-233,
.attr-separator-233 {
  color: rgba(0, 0, 0, 0.3);
}

.attr-value-233 {
  color: #2a2a2a;
  font-weight: 300;
}

/* 悬停光效 */
.card-glow-233 {
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

/* 底部装饰 */
.elegant-footer-233 {
  text-align: center;
  margin-top: 100px;
  position: relative;
  z-index: 10;
}

.footer-ornament-233 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.ornament-line-233 {
  width: 60px;
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
}

.ornament-symbol-233 {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.15);
}

.footer-quote-233 {
  font-size: 14px;
  color: #999;
  letter-spacing: 3px;
}

/* 响应式 */
@media (max-width: 768px) {
  .title-en-233 {
    font-size: 28px;
    letter-spacing: 6px;
  }

  .elegant-container-233 {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .card-content-233 {
    padding: 40px 30px;
  }
}
</style>
