<template>
  <div class="clean-container-234">
    <!-- 标题区域 -->
    <div class="clean-header-234">
      <h2 class="clean-title-234">纯净设计</h2>
      <p class="clean-subtitle-234">Pure Design</p>
    </div>

    <!-- 卡片网格 -->
    <div class="clean-grid-234">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="clean-card-234"
        :style="{ '--delay': index * 0.1 }"
      >
        <div class="card-number-234">{{ String(index + 1).padStart(2, '0') }}</div>
        <div class="card-icon-234">{{ item.icon }}</div>
        <h3 class="card-title-234">{{ item.title }}</h3>
        <div class="card-divider-234"></div>
        <p class="card-desc-234">{{ item.desc }}</p>
        <div class="card-value-234">{{ item.value }}%</div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="clean-footer-234">
      <div class="footer-line-234"></div>
      <div class="footer-dot-234"></div>
      <div class="footer-line-234"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let ctx = null

const items = [
  { icon: '◆', title: '简约', desc: 'Simple', value: 98 },
  { icon: '●', title: '纯粹', desc: 'Pure', value: 95 },
  { icon: '▲', title: '清晰', desc: 'Clear', value: 92 },
  { icon: '■', title: '简洁', desc: 'Clean', value: 96 },
  { icon: '★', title: '优雅', desc: 'Elegant', value: 90 },
  { icon: '✦', title: '精致', desc: 'Refined', value: 93 }
]

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.clean-title-234', {
      scrollTrigger: {
        trigger: '.clean-title-234',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: -40,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    })

    gsap.from('.clean-subtitle-234', {
      scrollTrigger: {
        trigger: '.clean-subtitle-234',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: -20,
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      ease: 'power2.out'
    })

    // 卡片入场 - 改为立即执行动画
    gsap.fromTo('.clean-card-234',
      { y: 60, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.clean-grid-234',
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

    // 卡片内部动画
    const cards = gsap.utils.toArray('.clean-card-234')
    cards.forEach((card, i) => {
      // 编号
      gsap.fromTo(card.querySelector('.card-number-234'),
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

      // 图标
      gsap.fromTo(card.querySelector('.card-icon-234'),
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
          delay: i * 0.12 + 0.1,
          ease: 'back.out(1.7)'
        }
      )

      // 标题
      gsap.fromTo(card.querySelector('.card-title-234'),
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
          delay: i * 0.12 + 0.15,
          ease: 'power2.out'
        }
      )

      // 分割线
      gsap.fromTo(card.querySelector('.card-divider-234'),
        { width: 0 },
        {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          width: 40,
          duration: 0.6,
          delay: i * 0.12 + 0.2,
          ease: 'power2.out'
        }
      )

      // 描述
      gsap.fromTo(card.querySelector('.card-desc-234'),
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
          delay: i * 0.12 + 0.25,
          ease: 'power2.out'
        }
      )

      // 数值
      gsap.fromTo(card.querySelector('.card-value-234'),
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
          delay: i * 0.12 + 0.3,
          ease: 'power2.out'
        }
      )

      // 悬停效果
      card.addEventListener('mouseenter', () => {
        gsap.to(card.querySelector('.card-icon-234'), {
          scale: 1.2,
          rotation: 10,
          duration: 0.3,
          ease: 'power2.out'
        })

        gsap.to(card.querySelector('.card-value-234'), {
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out'
        })

        gsap.to(card.querySelector('.card-divider-234'), {
          width: '100%',
          duration: 0.5,
          ease: 'power2.out'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card.querySelector('.card-icon-234'), {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: 'power2.out'
        })

        gsap.to(card.querySelector('.card-value-234'), {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        })

        gsap.to(card.querySelector('.card-divider-234'), {
          width: '40px',
          duration: 0.5,
          ease: 'power2.out'
        })
      })
    })

    // 底部装饰动画
    gsap.fromTo('.footer-line-234',
      { width: 0 },
      {
        scrollTrigger: {
          trigger: '.clean-footer-234',
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        },
        width: 100,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
      }
    )

    gsap.fromTo('.footer-dot-234',
      { scale: 0 },
      {
        scrollTrigger: {
          trigger: '.clean-footer-234',
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        },
        scale: 1,
        duration: 0.6,
        delay: 0.4,
        ease: 'back.out(1.7)'
      }
    )
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
.clean-container-234 {
  min-height: 100vh;
  background: #ffffff;
  padding: 80px 40px;
  position: relative;
  overflow: hidden;
}

/* 标题区域 */
.clean-header-234 {
  text-align: center;
  margin-bottom: 60px;
}

.clean-title-234 {
  font-size: 48px;
  font-weight: 200;
  color: #000000;
  letter-spacing: 8px;
  margin: 0;
}

.clean-subtitle-234 {
  font-size: 14px;
  font-weight: 300;
  color: #999999;
  letter-spacing: 4px;
  margin-top: 10px;
  text-transform: uppercase;
}

/* 卡片网格 */
.clean-grid-234 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 卡片 */
.clean-card-234 {
  background: #ffffff;
  border: 1px solid #e8e8e8;
  padding: 40px;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.clean-card-234:hover {
  border-color: #000000;
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

/* 编号 */
.card-number-234 {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 12px;
  font-weight: 200;
  color: #cccccc;
  letter-spacing: 2px;
}

/* 图标 */
.card-icon-234 {
  font-size: 48px;
  color: #000000;
  margin-bottom: 20px;
  display: inline-block;
}

/* 标题 */
.card-title-234 {
  font-size: 24px;
  font-weight: 300;
  color: #000000;
  margin: 0 0 15px 0;
  letter-spacing: 2px;
}

/* 分割线 */
.card-divider-234 {
  width: 40px;
  height: 1px;
  background: #000000;
  margin-bottom: 15px;
  transition: width 0.4s ease;
}

/* 描述 */
.card-desc-234 {
  font-size: 13px;
  font-weight: 200;
  color: #666666;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 20px;
}

/* 数值 */
.card-value-234 {
  font-size: 36px;
  font-weight: 200;
  color: #000000;
  letter-spacing: 1px;
}

/* 底部装饰 */
.clean-footer-234 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 80px;
}

.footer-line-234 {
  width: 100px;
  height: 1px;
  background: #e8e8e8;
}

.footer-dot-234 {
  width: 8px;
  height: 8px;
  background: #000000;
  border-radius: 50%;
}

/* 响应式 */
@media (max-width: 768px) {
  .clean-title-234 {
    font-size: 32px;
    letter-spacing: 4px;
  }

  .clean-subtitle-234 {
    font-size: 12px;
    letter-spacing: 3px;
  }

  .clean-grid-234 {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .clean-card-234 {
    padding: 30px;
  }

  .card-icon-234 {
    font-size: 40px;
  }

  .card-title-234 {
    font-size: 20px;
  }

  .card-value-234 {
    font-size: 28px;
  }
}
</style>
