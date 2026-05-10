<template>
  <div class="stagger-cards-45">
    <div class="sc-container-45">
      <h2 class="sc-section-title-45">错开卡片</h2>

      <div class="sc-cards-container-45">
        <div
          class="sc-card-item-45"
          v-for="(card, index) in cards"
          :key="index"
          ref="items"
        >
          <div class="sc-card-bg-45" :style="{ background: card.gradient }"></div>
          <div class="sc-card-content-45">
            <span class="sc-card-number-45">0{{ index + 1 }}</span>
            <h3 class="sc-card-title-45">{{ card.title }}</h3>
            <p class="sc-card-desc-45">{{ card.desc }}</p>
            <div class="sc-card-icon-45">{{ card.icon }}</div>
          </div>
        </div>
      </div>

      <button class="sc-trigger-btn-45" @click="triggerStagger">触发错开动画</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const items = ref<HTMLElement[]>([])

interface Card {
  title: string
  desc: string
  icon: string
  gradient: string
}

const cards: Card[] = [
  { title: '极速', desc: '超快响应', icon: '⚡', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { title: '优雅', desc: '精美设计', icon: '✨', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { title: '流畅', desc: '丝滑动画', icon: '🎯', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { title: '创新', desc: '前沿技术', icon: '🚀', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { title: '智能', desc: 'AI驱动', icon: '🤖', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { title: '安全', desc: '数据保护', icon: '🔒', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }
]

let ctx: gsap.Context
let timeline: gsap.core.Timeline

const triggerStagger = () => {
  gsap.to(items.value, {
    y: -30,
    duration: 0.4,
    stagger: 0.08,
    yoyo: true,
    repeat: 1,
    ease: 'power2.inOut'
  })
}

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.sc-section-title-45', {
      scrollTrigger: {
        trigger: '.sc-section-title-45',
        start: 'top 90%'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    // 创建错开动画时间轴
    timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.sc-cards-container-45',
        start: 'top 80%'
      }
    })

    // 入场错开动画 - 多个属性错开
    timeline.from(items.value, {
      y: 150,
      opacity: 0,
      scale: 0.5,
      rotateX: 45,
      duration: 1,
      stagger: {
        each: 0.15,
        from: 'center'
      },
      ease: 'back.out(1.7)'
    })

    items.value.forEach((item, index) => {
      const content = item.querySelector('.sc-card-content-45') as HTMLElement
      const number = item.querySelector('.sc-card-number-45') as HTMLElement
      const title = item.querySelector('.sc-card-title-45') as HTMLElement
      const desc = item.querySelector('.sc-card-desc-45') as HTMLElement
      const icon = item.querySelector('.sc-card-icon-45') as HTMLElement
      const bg = item.querySelector('.sc-card-bg-45') as HTMLElement

      // 背景错开缩放
      gsap.fromTo(bg,
        { scale: 0, rotate: 180 },
        {
          scale: 1,
          rotate: 0,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'top 35%',
            scrub: true
          },
          ease: 'power2.out'
        }
      )

      // 内容错开淡入
      gsap.fromTo(content,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 75%',
            end: 'top 25%',
            scrub: true
          }
        }
      )

      // 数字错开旋转
      gsap.fromTo(number,
        { rotate: -360, scale: 0 },
        {
          rotate: 0,
          scale: 1,
          scrollTrigger: {
            trigger: '.sc-cards-container-45',
            start: 'top 70%',
            end: 'top 20%',
            scrub: true
          },
          stagger: 0.1
        }
      )

      // 标题错开滑入
      gsap.fromTo(title,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: '.sc-cards-container-45',
            start: 'top 65%',
            end: 'top 15%',
            scrub: true
          },
          stagger: 0.12
        }
      )

      // 描述错开升起
      gsap.fromTo(desc,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: '.sc-cards-container-45',
            start: 'top 60%',
            end: 'top 10%',
            scrub: true
          },
          stagger: 0.15
        }
      )

      // 图标错放跳动
      gsap.fromTo(icon,
        { scale: 0, rotate: -180 },
        {
          scale: 1,
          rotate: 0,
          scrollTrigger: {
            trigger: '.sc-cards-container-45',
            start: 'top 55%',
            end: 'top 5%',
            scrub: true
          },
          stagger: 0.18,
          ease: 'back.out(1.5)'
        }
      )
    })

    // 按钮动画
    gsap.from('.sc-trigger-btn-45', {
      scrollTrigger: {
        trigger: '.sc-trigger-btn-45',
        start: 'top 90%'
      },
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(2)'
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.stagger-cards-45 {
  min-height: 100vh;
  padding: 100px 0;
  background: linear-gradient(180deg, #1a1a2e 0%, #2d1b69 50%, #1a1a2e 100%);
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
      radial-gradient(circle at 30% 30%, rgba(102, 126, 234, 0.1) 0%, transparent 40%),
      radial-gradient(circle at 70% 70%, rgba(240, 147, 251, 0.1) 0%, transparent 40%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.sc-container-45 {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.sc-section-title-45 {
  text-align: center;
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 80px;
  background: linear-gradient(135deg, #667eea 0%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(102, 126, 234, 0.5);

  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #f093fb);
    margin: 20px auto 0;
    border-radius: 2px;
  
  opacity: 1 !important;}
}

.sc-cards-container-45 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  padding: 40px 0;

  opacity: 1 !important;}

.sc-card-item-45 {
  position: relative;
  height: 350px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: transform 0.4s ease;

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.4);
  
  opacity: 1 !important;}
}

.sc-card-bg-45 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.sc-card-content-45 {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 30px;
  color: #fff;

  opacity: 1 !important;}

.sc-card-number-45 {
  font-size: 3.5rem;
  font-weight: 900;
  opacity: 0.9;
  font-family: 'Arial', sans-serif;
}

.sc-card-title-45 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 10px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  opacity: 1 !important;}

.sc-card-desc-45 {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
}

.sc-card-icon-45 {
  font-size: 3rem;
  align-self: flex-end;
  animation: bounce 2s infinite;

  opacity: 1 !important;}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.sc-trigger-btn-45 {
  display: block;
  margin: 60px auto 0;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #f093fb 100%);
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
  
  opacity: 1 !important;}

  &:active {
    transform: translateY(-1px);
  }
}

@media (max-width: 1024px) {
  .sc-cards-container-45 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .sc-cards-container-45 {
    grid-template-columns: 1fr;
  }

  .sc-section-title-45 {
    font-size: 2rem;
  
  opacity: 1 !important;}
}
</style>
