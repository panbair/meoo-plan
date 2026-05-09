<template>
  <div class="scroll-contrast-wrapper-191">
    <div class="scroll-contrast-section-191">
      <h2 class="scroll-contrast-title-191">对比度变化效果</h2>
      <p class="scroll-contrast-subtitle-191">滚动查看对比度从低到高的变化</p>

      <!-- 对比度卡片组 -->
      <div class="scroll-contrast-cards-191">
        <div class="scroll-contrast-card-191" data-contrast-index="0">
          <div class="scroll-contrast-image-191">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
              alt="山脉"
            />
          </div>
          <div class="scroll-contrast-content-191">
            <h3 class="scroll-contrast-card-title-191">山脉风光</h3>
            <p class="scroll-contrast-card-text-191">
              从低对比度的朦胧感，逐渐展现清晰的高对比度效果
            </p>
            <div class="scroll-contrast-indicator-191">
              <span class="contrast-label">对比度: </span>
              <span class="contrast-value">100%</span>
            </div>
          </div>
        </div>

        <div class="scroll-contrast-card-191" data-contrast-index="1">
          <div class="scroll-contrast-image-191">
            <img
              src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop"
              alt="森林"
            />
          </div>
          <div class="scroll-contrast-content-191">
            <h3 class="scroll-contrast-card-title-191">森林秘境</h3>
            <p class="scroll-contrast-card-text-191">
              随着滚动推进，色彩对比度逐渐增强，细节更加清晰
            </p>
            <div class="scroll-contrast-indicator-191">
              <span class="contrast-label">对比度: </span>
              <span class="contrast-value">100%</span>
            </div>
          </div>
        </div>

        <div class="scroll-contrast-card-191" data-contrast-index="2">
          <div class="scroll-contrast-image-191">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
              alt="海洋"
            />
          </div>
          <div class="scroll-contrast-content-191">
            <h3 class="scroll-contrast-card-title-191">海洋深处</h3>
            <p class="scroll-contrast-card-text-191">
              低对比度营造神秘感，高对比度展现真实色彩
            </p>
            <div class="scroll-contrast-indicator-191">
              <span class="contrast-label">对比度: </span>
              <span class="contrast-value">100%</span>
            </div>
          </div>
        </div>

        <div class="scroll-contrast-card-191" data-contrast-index="3">
          <div class="scroll-contrast-image-191">
            <img
              src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop"
              alt="星空"
            />
          </div>
          <div class="scroll-contrast-content-191">
            <h3 class="scroll-contrast-card-title-191">璀璨星空</h3>
            <p class="scroll-contrast-card-text-191">
              从模糊的星光，到清晰锐利的星空，对比度渐变
            </p>
            <div class="scroll-contrast-indicator-191">
              <span class="contrast-label">对比度: </span>
              <span class="contrast-value">100%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 全局对比度控制区域 -->
      <div class="scroll-contrast-control-191">
        <div class="scroll-contrast-control-inner-191">
          <h3 class="control-title">全局对比度控制</h3>
          <p class="control-description">滚动下方区域，体验整体对比度变化</p>
          <div class="control-cards">
            <div class="control-item">
              <div class="control-circle"></div>
              <span>100%</span>
            </div>
            <div class="control-item">
              <div class="control-circle"></div>
              <span>200%</span>
            </div>
            <div class="control-item">
              <div class="control-circle"></div>
              <span>300%</span>
            </div>
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

const animationInstances = ref<any[]>([])

onMounted(() => {
  initContrastAnimation()
})

onUnmounted(() => {
  animationInstances.value.forEach((anim) => {
    if (anim.kill) anim.kill()
  })
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
})

function initContrastAnimation() {
  // 获取所有卡片
  const cards = gsap.utils.toArray('.scroll-contrast-card-191')

  // 为每个卡片设置独立的对比度动画
  cards.forEach((card, index) => {
    const image = card.querySelector('.scroll-contrast-image-191')
    const content = card.querySelector('.scroll-contrast-content-191')
    const valueDisplay = card.querySelector('.contrast-value')

    if (!image || !content || !valueDisplay) return

    // 对比度动画：从 100% 到 200%
    const contrastAnim = gsap.to(image, {
      filter: 'contrast(200%)',
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        end: 'bottom 15%',
        scrub: 1.5,
        onUpdate: (self) => {
          // 更新对比度数值显示
          const progress = self.progress
          const contrastValue = 100 + progress * 100
          valueDisplay.textContent = Math.round(contrastValue) + '%'
        }
      }
    })

    // 卡片入场动画
    const entryAnim = gsap.from(card, {
      y: 200,
      opacity: 0,
      scale: 0.8,
      rotation: -10,
      duration: 1.5,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })

    // 内容淡入动画（延迟）
    const contentAnim = gsap.from(
      [content.querySelector('h3'), content.querySelector('p')],
      {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    animationInstances.value.push(contrastAnim, entryAnim, contentAnim)
  })

  // 全局对比度控制区域动画
  const controlSection = document.querySelector('.scroll-contrast-control-191')
  const controlInner = document.querySelector('.scroll-contrast-control-inner-191')
  const controlItems = gsap.utils.toArray('.control-item')

  if (controlSection && controlInner && controlItems.length > 0) {
    // 控制区域入场
    gsap.from(controlInner, {
      y: 150,
      opacity: 0,
      scale: 0.9,
      rotationX: 30,
      duration: 1.5,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: controlSection,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })

    // 控制项渐变动画
    controlItems.forEach((item, index) => {
      const circle = item.querySelector('.control-circle')

      if (circle) {
        gsap.to(circle, {
          filter: `contrast(${100 + index * 100}%)`,
          scale: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: controlSection,
            start: 'top 70%',
            end: 'bottom 20%',
            scrub: 2
          }
        })

        gsap.from(item, {
          x: -100,
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: controlSection,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        })
      }
    })

    // 标题和描述文字动画
    gsap.from(
      [
        controlInner.querySelector('.control-title'),
        controlInner.querySelector('.control-description')
      ],
      {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: controlSection,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  }

  // 页面标题入场动画
  const title = document.querySelector('.scroll-contrast-title-191')
  const subtitle = document.querySelector('.scroll-contrast-subtitle-191')

  if (title) {
    gsap.from(title, {
      y: 100,
      opacity: 0,
      scale: 0.8,
      rotationX: -30,
      duration: 1.5,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.scroll-contrast-section-191',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })
  }

  if (subtitle) {
    gsap.from(subtitle, {
      y: 80,
      opacity: 0,
      scale: 0.7,
      rotationY: 20,
      duration: 1.2,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.scroll-contrast-section-191',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      delay: 0.15
    })
  }
}
</script>

<style scoped lang="scss">
.scroll-contrast-wrapper-191 {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a2a 100%);
  padding: 80px 20px 120px;
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
      radial-gradient(circle at 20% 30%, rgba(167, 139, 250, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(96, 165, 250, 0.1) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.scroll-contrast-section-191 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.scroll-contrast-title-191 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  text-align: center;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #a78bfa, #60a5fa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transform-style: preserve-3d;
  will-change: transform, opacity;

  opacity: 1 !important;}

.scroll-contrast-subtitle-191 {
  font-size: 1.1rem;
  color: #94a3b8;
  text-align: center;
  margin-bottom: 80px;
  transform-style: preserve-3d;
  will-change: transform, opacity;

  opacity: 1 !important;}

.scroll-contrast-cards-191 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 100px;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.scroll-contrast-card-191 {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  transform-style: preserve-3d;
  will-change: transform, opacity;

  &:hover {
    transform: translateY(-10px) rotateX(5deg);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    border-color: rgba(167, 139, 250, 0.3);
  
  opacity: 1 !important;}
}

.scroll-contrast-image-191 {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
    filter: contrast(100%);
    will-change: filter;
  
  opacity: 1 !important;}

  .scroll-contrast-card-191:hover & img {
    transform: scale(1.1);
  }
}

.scroll-contrast-content-191 {
  padding: 24px;

  opacity: 1 !important;}

.scroll-contrast-card-title-191 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
  will-change: transform, opacity;

  opacity: 1 !important;}

.scroll-contrast-card-text-191 {
  font-size: 0.95rem;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 20px;
  will-change: transform, opacity;

  opacity: 1 !important;}

.scroll-contrast-indicator-191 {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(167, 139, 250, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(167, 139, 250, 0.2);

  .contrast-label {
    font-size: 0.85rem;
    color: #a78bfa;
    font-weight: 500;
  
  opacity: 1 !important;}

  .contrast-value {
    font-size: 1rem;
    color: #fff;
    font-weight: 700;
    font-family: 'Courier New', monospace;
  
  opacity: 1 !important;}
}

.scroll-contrast-control-191 {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 60px 40px;
  margin-top: 80px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(from 0deg, rgba(167, 139, 250, 0.1), rgba(96, 165, 250, 0.1), rgba(244, 114, 182, 0.1), rgba(167, 139, 250, 0.1));
    animation: rotate 20s linear infinite;
    pointer-events: none;
  
  opacity: 1 !important;}

  &::after {
    content: '';
    position: absolute;
    inset: 2px;
    background: rgba(10, 10, 26, 0.9);
    border-radius: 22px;
    z-index: 0;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.scroll-contrast-control-inner-191 {
  position: relative;
  z-index: 1;
  text-align: center;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.control-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 12px;
  will-change: transform, opacity;

  opacity: 1 !important;}

.control-description {
  font-size: 1rem;
  color: #94a3b8;
  margin-bottom: 40px;
  will-change: transform, opacity;

  opacity: 1 !important;}

.control-cards {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
}

.control-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  span {
    font-size: 0.9rem;
    color: #a78bfa;
    font-weight: 600;
  
  opacity: 1 !important;}
}

.control-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a78bfa, #60a5fa);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(167, 139, 250, 0.3);
  transition: transform 0.3s ease;
  will-change: filter, transform;

  &::before {
    content: '';
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
  
  opacity: 1 !important;}
}

@media (max-width: 768px) {
  .scroll-contrast-cards-191 {
    grid-template-columns: 1fr;
  }

  .control-cards {
    gap: 30px;
  }

  .control-circle {
    width: 60px;
    height: 60px;

    &::before {
      width: 30px;
      height: 30px;
    
  opacity: 1 !important;}
  }
}
</style>
