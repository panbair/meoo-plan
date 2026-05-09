<template>
  <div class="scroll-zen-garden-cards-231">
    <!-- 禅意背景 -->
    <div class="zen-bg-231">
      <div class="zen-gradient-231"></div>
      <div class="zen-pattern-231"></div>
    </div>

    <!-- 竹林 -->
    <div class="bamboo-forest-231">
      <div v-for="n in 15" :key="n" class="bamboo-231" :style="{
        left: `${(n - 1) * 7}%`,
        height: `${200 + Math.random() * 300}px`,
        animationDelay: `${-n * 0.5}s`,
        opacity: 0.1 + Math.random() * 0.15
      }"></div>
    </div>

    <!-- 飘落的樱花 -->
    <div class="falling-petals-231">
      <div v-for="n in 30" :key="n" class="petal-231" :style="{
        left: `${Math.random() * 100}%`,
        top: `${-20 - Math.random() * 50}%`,
        animationDelay: `${-Math.random() * 10}s`,
        animationDuration: `${8 + Math.random() * 8}s`,
        transform: `scale(${0.5 + Math.random() * 0.5})`
      }">
        <div class="petal-shape-231"></div>
      </div>
    </div>

    <!-- 水面波纹 -->
    <div class="water-ripples-231">
      <div v-for="n in 8" :key="n" class="ripple-231" :style="{
        left: `${20 + n * 10}%`,
        animationDelay: `${-n * 1.5}s`
      }"></div>
    </div>

    <!-- 主标题 -->
    <div class="zen-title-231">
      <div class="title-circle-231">
        <div class="circle-ring-231" v-for="n in 3" :key="n" :style="{
          animationDelay: `${-n * 0.5}s`
        }"></div>
      </div>
      <h2 class="title-text-231">
        <span class="title-main-231">禅意花园</span>
        <span class="title-sub-231">ZEN GARDEN</span>
      </h2>
      <div class="title-divider-231"></div>
    </div>

    <!-- 卡片容器 -->
    <div class="garden-container-231">
      <div v-for="(element, index) in elements" :key="index" class="zen-card-231" :class="`element-${index + 1}-231`">
        <!-- 卡片背景 -->
        <div class="card-bg-231" :style="{
          background: `radial-gradient(circle at 30% 30%, ${element.color}10 0%, transparent 60%)`
        }"></div>

        <!-- 装饰边框 -->
        <div class="zen-border-231" :style="{ borderColor: `${element.color}40` }">
          <div class="border-corner-231 corner-tl-231"></div>
          <div class="border-corner-231 corner-tr-231"></div>
          <div class="border-corner-231 corner-bl-231"></div>
          <div class="border-corner-231 corner-br-231"></div>
        </div>

        <!-- 卡片内容 -->
        <div class="card-zen-231">
          <!-- 元素图标 -->
          <div class="element-icon-231">
            <div class="icon-circle-231" :style="{
              borderColor: element.color,
              background: `radial-gradient(circle, ${element.color}20, transparent)`
            }"></div>
            <span class="icon-emoji-231">{{ element.icon }}</span>
          </div>

          <!-- 元素名称 -->
          <h3 class="element-name-231" :style="{ color: element.color }">
            {{ element.name }}
            <span class="name-jp-231">{{ element.jpName }}</span>
          </h3>

          <!-- 元素描述 -->
          <p class="element-desc-231">{{ element.desc }}</p>

          <!-- 禅意格言 -->
          <div class="zen-quote-231">
            <span class="quote-icon-231">❝</span>
            <p class="quote-text-231">{{ element.quote }}</p>
          </div>

          <!-- 属性展示 -->
          <div class="element-attributes-231">
            <div class="attr-row-231">
              <span class="attr-label-231">宁静</span>
              <div class="attr-dots-231">
                <div v-for="n in 5" :key="n" class="attr-dot-231" :class="{ active: n <= element.tranquility }"
                     :style="{ 
                       background: n <= element.tranquility ? element.color : 'rgba(255,255,255,0.1)',
                       borderColor: element.color
                     }"></div>
              </div>
            </div>
            <div class="attr-row-231">
              <span class="attr-label-231">和谐</span>
              <div class="attr-dots-231">
                <div v-for="n in 5" :key="n" class="attr-dot-231" :class="{ active: n <= element.harmony }"
                     :style="{ 
                       background: n <= element.harmony ? element.color : 'rgba(255,255,255,0.1)',
                       borderColor: element.color
                     }"></div>
              </div>
            </div>
            <div class="attr-row-231">
              <span class="attr-label-231">平衡</span>
              <div class="attr-dots-231">
                <div v-for="n in 5" :key="n" class="attr-dot-231" :class="{ active: n <= element.balance }"
                     :style="{ 
                       background: n <= element.balance ? element.color : 'rgba(255,255,255,0.1)',
                       borderColor: element.color
                     }"></div>
              </div>
            </div>
          </div>

          <!-- 冥想按钮 -->
          <button class="meditate-btn-231" :style="{
            borderColor: element.color,
            color: element.color
          }">
            <span>静心</span>
            <div class="btn-sakura-231">
              <div v-for="n in 3" :key="n" class="btn-petal-231" :style="{ 
                animationDelay: `${-n * 0.5}s`,
                borderColor: element.color
              }"></div>
            </div>
          </button>
        </div>

        <!-- 悬停光效 -->
        <div class="hover-glow-231" :style="{
          background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${element.color}20 0%, transparent 50%)`
        }"></div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="garden-footer-231">
      <div class="footer-koi-231">
        <div class="koi-fish-231" v-for="n in 3" :key="n" :style="{
          animationDelay: `${-n * 2}s`
        }"></div>
      </div>
      <span class="footer-text-231">心若止水，万物自然</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let ctx = null

const elements = [
  {
    icon: '🌸',
    name: '樱花',
    jpName: '桜',
    desc: '短暂如梦，美丽永恒',
    quote: '花开花落，皆是自然',
    color: '#ffb7c5',
    tranquility: 4,
    harmony: 5,
    balance: 3
  },
  {
    icon: '🎋',
    name: '竹',
    jpName: '竹',
    desc: '坚韧不拔，虚心向上',
    quote: '虚怀若谷，刚柔并济',
    color: '#7dd3c0',
    tranquility: 5,
    harmony: 4,
    balance: 5
  },
  {
    icon: '🍃',
    name: '枫叶',
    jpName: '楓',
    desc: '随风起舞，归于尘土',
    quote: '顺其自然，随遇而安',
    color: '#e74c3c',
    tranquility: 3,
    harmony: 5,
    balance: 4
  },
  {
    icon: '🌊',
    name: '流水',
    jpName: '水',
    desc: '柔中带刚，生生不息',
    quote: '上善若水，利万物而不争',
    color: '#3498db',
    tranquility: 5,
    harmony: 3,
    balance: 5
  },
  {
    icon: '🏔️',
    name: '山石',
    jpName: '石',
    desc: '静如处子，稳重如山',
    quote: '心如止水，不动如山',
    color: '#95a5a6',
    tranquility: 4,
    harmony: 4,
    balance: 5
  },
  {
    icon: '🌙',
    name: '月夜',
    jpName: '月',
    desc: '清辉洒下，静默无言',
    quote: '月有阴晴圆缺，人有悲欢离合',
    color: '#bdc3c7',
    tranquility: 5,
    harmony: 5,
    balance: 4
  }
]

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题入场
    gsap.from('.zen-title-231', {
      scrollTrigger: {
        trigger: '.zen-title-231',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: -80,
      opacity: 0,
      duration: 1.5,
      ease: 'power2.out'
    })

    gsap.from('.circle-ring-231', {
      scrollTrigger: {
        trigger: '.circle-ring-231',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      scale: 0,
      opacity: 0,
      duration: 1.5,
      stagger: 0.3,
      ease: 'power2.out'
    })

    gsap.from('.title-text-231', {
      scrollTrigger: {
        trigger: '.title-text-231',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    })

    gsap.from('.title-divider-231', {
      scrollTrigger: {
        trigger: '.title-divider-231',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      width: 0,
      duration: 1.2,
      ease: 'power2.out'
    })

    // 卡片入场
    gsap.from('.zen-card-231', {
      scrollTrigger: {
        trigger: '.garden-container-231',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      y: 100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power2.out'
    })

    // 卡片内部动画
    const cards = gsap.utils.toArray('.zen-card-231')
    cards.forEach((card, i) => {
      // 背景光晕
      gsap.from(card.querySelector('.card-bg-231'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        scale: 0.5,
        opacity: 0,
        duration: 1,
        delay: i * 0.2,
        ease: 'power2.out'
      })

      // 边框
      gsap.from(card.querySelector('.zen-border-231'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        delay: i * 0.2 + 0.1,
        ease: 'power2.out'
      })

      // 图标
      gsap.from(card.querySelector('.element-icon-231'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        scale: 0,
        rotation: -180,
        opacity: 0,
        duration: 1,
        delay: i * 0.2 + 0.2,
        ease: 'elastic.out(1, 0.5)'
      })

      // 持续脉动
      gsap.to(card.querySelector('.icon-circle-231'), {
        scale: 1.1,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      // 名称
      gsap.from(card.querySelector('.element-name-231'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.2 + 0.3,
        ease: 'power2.out'
      })

      // 描述
      gsap.from(card.querySelector('.element-desc-231'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 15,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.2 + 0.4,
        ease: 'power2.out'
      })

      // 格言
      gsap.from(card.querySelector('.zen-quote-231'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        x: -20,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.2 + 0.5,
        ease: 'power2.out'
      })

      // 属性
      gsap.from(card.querySelectorAll('.attr-row-231'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 15,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        delay: i * 0.2 + 0.6,
        ease: 'power2.out'
      })

      // 按钮
      gsap.from(card.querySelector('.meditate-btn-231'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.2 + 0.8,
        ease: 'power2.out'
      })
    })

    // 持续动画
    const vh = window.innerHeight
    gsap.to('.petal-231', {
      y: vh * 1.5,
      rotation: 360,
      duration: 8 + Math.random() * 8,
      repeat: -1,
      ease: 'none'
    })

    gsap.to('.ripple-231', {
      scale: 2,
      opacity: 0,
      duration: 4,
      repeat: -1,
      ease: 'none'
    })

    gsap.to('.bamboo-231', {
      y: -10,
      duration: 3 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 滚动控制
    gsap.to('.petal-231', {
      scrollTrigger: {
        trigger: '.garden-container-231',
        start: 'top center',
        end: 'bottom center',
        scrub: 1
      },
      y: vh * 2,
      ease: 'none'
    })

    // 鼠标交互
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        card.style.setProperty('--mouse-x', `${x}%`)
        card.style.setProperty('--mouse-y', `${y}%`)

        // 平滑倾斜
        const rotateX = (y - 50) / 20
        const rotateY = (50 - x) / 20
        gsap.to(card.querySelector('.card-zen-231'), {
          rotationX: rotateX,
          rotationY: rotateY,
          duration: 0.5,
          ease: 'power2.out'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card.querySelector('.card-zen-231'), {
          rotationX: 0,
          rotationY: 0,
          duration: 0.8,
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
/* GSAP opacity fix: ensure content is always visible */

.scroll-zen-garden-cards-231 {
  min-height: 600px;
  background: linear-gradient(180deg, #f5f0eb 0%, #e8ded6 50%, #d4c4b5 100%);
  padding: 80px 20px;
  position: relative;
  overflow: visible;
  z-index: 1;

  opacity: 1 !important;}

/* 禅意背景 */
.zen-bg-231 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.zen-gradient-231 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(255, 183, 197, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(125, 211, 192, 0.15) 0%, transparent 50%);

  opacity: 1 !important;}

.zen-pattern-231 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(0,0,0,0.02) 1px, transparent 1px),
    radial-gradient(circle at 75% 75%, rgba(0,0,0,0.02) 1px, transparent 1px);
  background-size: 50px 50px;
}

/* 竹林 */
.bamboo-forest-231 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.bamboo-231 {
  position: absolute;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to top, #5a7a5a, #7dd3c0);
  border-radius: 2px;

  opacity: 1 !important;}

/* 飘落的樱花 */
.falling-petals-231 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.petal-231 {
  position: absolute;
  width: 20px;
  height: 20px;

  opacity: 1 !important;}

.petal-shape-231 {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, #ffb7c5 0%, transparent 70%);
  border-radius: 50% 0 50% 50%;
  animation: petalSway 3s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes petalSway {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(180deg); }
}

/* 水面波纹 */
.water-ripples-231 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 300px;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;

  opacity: 1 !important;}

.ripple-231 {
  position: absolute;
  bottom: 100px;
  width: 100px;
  height: 100px;
  border: 1px solid rgba(52, 152, 219, 0.3);
  border-radius: 50%;
  animation: rippleExpand 4s linear infinite;

  opacity: 1 !important;}

@keyframes rippleExpand {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* 主标题 */
.zen-title-231 {
  text-align: center;
  margin-bottom: 80px;
  position: relative;
  z-index: 10;

  opacity: 1 !important;}

.title-circle-231 {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.circle-ring-231 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(125, 211, 192, 0.3);
  border-radius: 50%;
  animation: circleBreath 4s ease-in-out infinite;

  opacity: 1 !important;}

.circle-ring-231:nth-child(1) { width: 120px; height: 120px; }
.circle-ring-231:nth-child(2) { width: 160px; height: 160px; }
.circle-ring-231:nth-child(3) { width: 200px; height: 200px; }

@keyframes circleBreath {
  0%, 100% { 
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.6;
  }
}

.title-text-231 {
  position: relative;
  z-index: 1;
}

.title-main-231 {
  display: block;
  font-size: 48px;
  font-weight: 300;
  color: #5a5a5a;
  letter-spacing: 15px;
  margin-bottom: 10px;

  opacity: 1 !important;}

.title-sub-231 {
  display: block;
  font-size: 16px;
  color: #999;
  letter-spacing: 8px;

  opacity: 1 !important;}

.title-divider-231 {
  width: 100px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #7dd3c0, transparent);
  margin: 20px auto;

  opacity: 1 !important;}

/* 卡片容器 */
.garden-container-231 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  z-index: 10;

  opacity: 1 !important;}

/* 卡片样式 */
.zen-card-231 {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px 30px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
  transform-style: preserve-3d;
  perspective: 1000px;
  /* 确保内容始终可见 */
  opacity: 1 !important;
}

/* 背景光晕 */
.card-bg-231 {
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  pointer-events: none;
  /* 确保背景光晕始终可见 */
  opacity: 1 !important;
}

/* 装饰边框 */
.zen-border-231 {
  position: absolute;
  top: 15px;
  left: 15px;
  right: 15px;
  bottom: 15px;
  border: 1px solid;
  border-radius: 15px;
  pointer-events: none;
  /* 确保边框始终可见 */
  opacity: 1 !important;
}

.border-corner-231 {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: inherit;
  border-width: 2px;
  opacity: 0.3;
}

.corner-tl-231 {
  top: -10px;
  left: -10px;
  border-top: inherit;
  border-left: inherit;
}

.corner-tr-231 {
  top: -10px;
  right: -10px;
  border-top: inherit;
  border-right: inherit;
}

.corner-bl-231 {
  bottom: -10px;
  left: -10px;
  border-bottom: inherit;
  border-left: inherit;
}

.corner-br-231 {
  bottom: -10px;
  right: -10px;
  border-bottom: inherit;
  border-right: inherit;
}

/* 卡片内容 */
.card-zen-231 {
  position: relative;
  z-index: 2;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
}

/* 元素图标 */
.element-icon-231 {
  width: 100px;
  height: 100px;
  margin: 0 auto 25px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 确保图标始终可见 */
  opacity: 1 !important;
}

.icon-circle-231 {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.icon-emoji-231 {
  position: relative;
  z-index: 1;
  font-size: 48px;

  opacity: 1 !important;}

/* 元素名称 */
.element-name-231 {
  font-size: 28px;
  font-weight: 300;
  text-align: center;
  margin-bottom: 5px;
  position: relative;
  /* 确保名称始终可见 */
  opacity: 1 !important;
}

.name-jp-231 {
  font-size: 20px;
  margin-left: 10px;
  opacity: 0.5;
}

/* 元素描述 */
.element-desc-231 {
  text-align: center;
  color: #888;
  font-size: 14px;
  margin-bottom: 25px;
  letter-spacing: 2px;
  /* 确保描述始终可见 */
  opacity: 1 !important;
}

/* 禅意格言 */
.zen-quote-231 {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 10px;
  /* 确保格言始终可见 */
  opacity: 1 !important;
}

.quote-icon-231 {
  font-size: 32px;
  color: rgba(125, 211, 192, 0.5);
  display: block;
  margin-bottom: 10px;

  opacity: 1 !important;}

.quote-text-231 {
  font-size: 14px;
  color: #666;
  letter-spacing: 1px;
  line-height: 1.8;

  opacity: 1 !important;}

/* 属性展示 */
.element-attributes-231 {
  margin-bottom: 30px;
  /* 确保属性始终可见 */
  opacity: 1 !important;
}

.attr-row-231 {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.attr-label-231 {
  width: 60px;
  font-size: 13px;
  color: #999;
  letter-spacing: 2px;

  opacity: 1 !important;}

.attr-dots-231 {
  flex: 1;
  display: flex;
  gap: 8px;
}

.attr-dot-231 {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid;
  background: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;

  opacity: 1 !important;}

.attr-dot-231.active {
  box-shadow: 0 0 10px currentColor;
}

/* 冥想按钮 */
.meditate-btn-231 {
  width: 100%;
  padding: 15px;
  border: 1px solid;
  border-radius: 10px;
  background: transparent;
  font-size: 14px;
  letter-spacing: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  /* 确保按钮始终可见 */
  opacity: 1 !important;
}

.meditate-btn-231:hover {
  background: currentColor;
  color: white;
}

.btn-sakura-231 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.btn-petal-231 {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid;
  animation: btnPetalFall 3s linear infinite;

  opacity: 1 !important;}

@keyframes btnPetalFall {
  0% { transform: translate(0, -10px); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translate(100px, 100px); opacity: 0; }
}

/* 悬停光效 */
.hover-glow-231 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.zen-card-231:hover .hover-glow-231 {
  opacity: 1;
}

/* 底部装饰 */
.garden-footer-231 {
  text-align: center;
  margin-top: 60px;
  position: relative;
  z-index: 10;

  opacity: 1 !important;}

.footer-koi-231 {
  display: inline-block;
  margin-bottom: 15px;
  position: relative;
}

.koi-fish-231 {
  position: absolute;
  width: 30px;
  height: 20px;
  background: linear-gradient(90deg, #e74c3c, #c0392b);
  border-radius: 50%;
  animation: koiSwim 6s ease-in-out infinite;

  opacity: 1 !important;}

.koi-fish-231:nth-child(1) { left: -60px; top: 0; }
.koi-fish-231:nth-child(2) { left: -30px; top: 15px; animation-delay: -2s; }
.koi-fish-231:nth-child(3) { left: 0; top: 30px; animation-delay: -4s; }

@keyframes koiSwim {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(150px); }
}

.footer-text-231 {
  display: block;
  color: #999;
  font-size: 16px;
  letter-spacing: 3px;

  opacity: 1 !important;}

/* 响应式 */
@media (max-width: 768px) {
  .title-main-231 {
    font-size: 32px;
    letter-spacing: 8px;
  
  opacity: 1 !important;}

  .garden-container-231 {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}
</style>
