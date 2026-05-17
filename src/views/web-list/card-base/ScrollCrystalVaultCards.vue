<template>
  <div class="crystal-vault-229">
    <!-- 标题 -->
    <div class="vault-header-229">
      <h2 class="vault-title-229">水晶宝库</h2>
      <p class="vault-subtitle-229">Crystal Vault</p>
    </div>

    <!-- 卡片容器 -->
    <div class="vault-grid-229">
      <div
        v-for="(gem, index) in gems"
        :key="index"
        class="gem-card-229"
        :style="{ '--gem-color': gem.color }"
      >
        <div class="gem-number-229">#{{ String(index + 1).padStart(3, '0') }}</div>
        <div class="gem-icon-229">{{ gem.icon }}</div>
        <h3 class="gem-name-229">{{ gem.name }}</h3>
        <p class="gem-desc-229">{{ gem.desc }}</p>
        <div class="gem-stats-229">
          <div class="stat-229">
            <span class="stat-label-229">纯净</span>
            <span class="stat-value-229">{{ gem.purity }}%</span>
          </div>
          <div class="stat-229">
            <span class="stat-label-229">光芒</span>
            <span class="stat-value-229">{{ gem.brilliance }}%</span>
          </div>
          <div class="stat-229">
            <span class="stat-label-229">稀有</span>
            <span class="stat-value-229">{{ gem.rarity }}%</span>
          </div>
        </div>
        <div class="gem-badge-229">{{ gem.badge }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let ctx = null

const gems = [
  { icon: '💎', name: 'Diamond Star', desc: '璀璨星辰', badge: 'LEGENDARY', color: '#00d4ff', purity: 99, brilliance: 98, rarity: 95 },
  { icon: '💜', name: 'Amethyst Dream', desc: '紫色梦境', badge: 'EPIC', color: '#9b59b6', purity: 95, brilliance: 92, rarity: 90 },
  { icon: '💚', name: 'Emerald Glow', desc: '翠绿光辉', badge: 'RARE', color: '#2ecc71', purity: 92, brilliance: 89, rarity: 85 },
  { icon: '💛', name: 'Topaz Light', desc: '金色光芒', badge: 'RARE', color: '#f1c40f', purity: 89, brilliance: 86, rarity: 82 },
  { icon: '❤️', name: 'Ruby Heart', desc: '红宝石心', badge: 'LEGENDARY', color: '#e74c3c', purity: 97, brilliance: 95, rarity: 93 },
  { icon: '💙', name: 'Sapphire Ice', desc: '蓝宝石冰', badge: 'EPIC', color: '#3498db', purity: 94, brilliance: 91, rarity: 88 }
]

onMounted(() => {
  setTimeout(() => {
    ctx = gsap.context(() => {
      // 标题动画
      gsap.from('.vault-title-229', {
        scrollTrigger: {
          trigger: '.vault-title-229',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      })

      gsap.from('.vault-subtitle-229', {
        scrollTrigger: {
          trigger: '.vault-subtitle-229',
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
      gsap.from('.gem-card-229', {
        scrollTrigger: {
          trigger: '.vault-grid-229',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        },
        y: 80,
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      })

      // 卡片内部动画
      const cards = gsap.utils.toArray('.gem-card-229')
      cards.forEach((card, i) => {
        gsap.from(card.querySelector('.gem-number-229'), {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          x: -20,
          opacity: 0,
          duration: 0.5,
          delay: i * 0.15,
          ease: 'power2.out'
        })

        gsap.from(card.querySelector('.gem-icon-229'), {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          rotation: -180,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.15 + 0.1,
          ease: 'back.out(1.7)'
        })

        gsap.from(card.querySelector('.gem-name-229'), {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          y: 20,
          opacity: 0,
          duration: 0.5,
          delay: i * 0.15 + 0.2,
          ease: 'power2.out'
        })

        gsap.from(card.querySelector('.gem-desc-229'), {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          y: 15,
          opacity: 0,
          duration: 0.5,
          delay: i * 0.15 + 0.25,
          ease: 'power2.out'
        })

        gsap.from(card.querySelectorAll('.stat-229'), {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          y: 15,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          delay: i * 0.15 + 0.35,
          ease: 'power2.out'
        })

        gsap.from(card.querySelector('.gem-badge-229'), {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          y: 15,
          opacity: 0,
          duration: 0.5,
          delay: i * 0.15 + 0.5,
          ease: 'power2.out'
        })
      })

      // 悬停效果
      cards.forEach((card, i) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card.querySelector('.gem-icon-229'), {
            scale: 1.2,
            rotation: 10,
            duration: 0.3,
            ease: 'power2.out'
          })

          gsap.to(card.querySelectorAll('.stat-value-229'), {
            scale: 1.1,
            duration: 0.3,
            stagger: 0.05,
            ease: 'power2.out'
          })
        })

        card.addEventListener('mouseleave', () => {
          gsap.to(card.querySelector('.gem-icon-229'), {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: 'power2.out'
          })

          gsap.to(card.querySelectorAll('.stat-value-229'), {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          })
        })
      })
    })
  }, 100)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
.crystal-vault-229 {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 100%);
  padding: 80px 40px;
}

/* 标题 */
.vault-header-229 {
  text-align: center;
  margin-bottom: 60px;
}

.vault-title-229 {
  font-size: 48px;
  font-weight: 300;
  background: linear-gradient(135deg, #00d4ff, #9b59b6, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 8px;
  margin: 0;
}

.vault-subtitle-229 {
  font-size: 14px;
  color: #888;
  letter-spacing: 4px;
  margin-top: 10px;
  text-transform: uppercase;
}

/* 卡片网格 */
.vault-grid-229 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 卡片 */
.gem-card-229 {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px 30px;
  position: relative;
  backdrop-filter: blur(10px);
  transition: all 0.4s ease;
  cursor: pointer;
}

.gem-card-229:hover {
  border-color: var(--gem-color);
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* 编号 */
.gem-number-229 {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 2px;
}

/* 图标 */
.gem-icon-229 {
  font-size: 64px;
  margin-bottom: 20px;
  display: inline-block;
  filter: drop-shadow(0 0 20px var(--gem-color));
}

/* 名称 */
.gem-name-229 {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 10px 0;
  letter-spacing: 2px;
}

/* 描述 */
.gem-desc-229 {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin-bottom: 30px;
  letter-spacing: 1px;
}

/* 统计数据 */
.gem-stats-229 {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.stat-229 {
  text-align: center;
}

.stat-label-229 {
  display: block;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 1px;
  margin-bottom: 5px;
}

.stat-value-229 {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: var(--gem-color);
}

/* 徽章 */
.gem-badge-229 {
  position: absolute;
  bottom: 20px;
  right: 20px;
  padding: 6px 16px;
  background: var(--gem-color);
  color: #000;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  border-radius: 20px;
  opacity: 0.9;
}

/* 响应式 */
@media (max-width: 768px) {
  .vault-title-229 {
    font-size: 32px;
    letter-spacing: 4px;
  }

  .vault-grid-229 {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .gem-card-229 {
    padding: 30px 20px;
  }

  .gem-icon-229 {
    font-size: 48px;
  }

  .gem-stats-229 {
    padding: 15px;
  }

  .stat-value-229 {
    font-size: 16px;
  }
}
</style>
