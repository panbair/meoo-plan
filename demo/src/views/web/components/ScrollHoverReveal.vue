<template>
  <div class="scroll-hover-reveal-wrapper-192">
    <div class="scroll-hover-reveal-section-192">
      <h2 class="scroll-hover-reveal-title-192">悬停揭示效果</h2>
      <p class="scroll-hover-reveal-subtitle-192">滚动进入视口 + 悬停交互双重控制</p>

      <!-- 卡片容器 -->
      <div class="scroll-hover-reveal-cards-192">
        <div class="scroll-hover-reveal-card-192" data-card-index="0">
          <div class="scroll-hover-reveal-card-inner-192">
            <div class="scroll-hover-reveal-front-192">
              <div class="card-image">
                <img
                  src="https://images.unsplash.com/photo-1558478551-1a378f63328e?w=400&h=500&fit=crop"
                  alt="艺术"
                />
              </div>
              <div class="card-overlay">
                <h3 class="card-title">创意艺术</h3>
                <p class="card-subtitle">滚动显现 · 悬停揭示</p>
              </div>
            </div>
            <div class="scroll-hover-reveal-back-192">
              <div class="back-content">
                <h4>探索创意世界</h4>
                <p>通过滚动和悬停的交互，展现多层次的信息展示效果。从最初的模糊到清晰，再到详细内容的揭示。</p>
                <button class="reveal-button">了解更多</button>
              </div>
            </div>
          </div>
        </div>

        <div class="scroll-hover-reveal-card-192" data-card-index="1">
          <div class="scroll-hover-reveal-card-inner-192">
            <div class="scroll-hover-reveal-front-192">
              <div class="card-image">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=500&fit=crop"
                  alt="科技"
                />
              </div>
              <div class="card-overlay">
                <h3 class="card-title">未来科技</h3>
                <p class="card-subtitle">滚动显现 · 悬停揭示</p>
              </div>
            </div>
            <div class="scroll-hover-reveal-back-192">
              <div class="back-content">
                <h4>科技前沿</h4>
                <p>探索人工智能、虚拟现实等前沿技术，感受科技带来的无限可能性和创新思维。</p>
                <button class="reveal-button">了解更多</button>
              </div>
            </div>
          </div>
        </div>

        <div class="scroll-hover-reveal-card-192" data-card-index="2">
          <div class="scroll-hover-reveal-card-inner-192">
            <div class="scroll-hover-reveal-front-192">
              <div class="card-image">
                <img
                  src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&h=500&fit=crop"
                  alt="自然"
                />
              </div>
              <div class="card-overlay">
                <h3 class="card-title">自然之美</h3>
                <p class="card-subtitle">滚动显现 · 悬停揭示</p>
              </div>
            </div>
            <div class="scroll-hover-reveal-back-192">
              <div class="back-content">
                <h4>探索自然</h4>
                <p>感受大自然的鬼斧神工，从山川湖海到花鸟虫鱼，发现生活中被忽略的美好瞬间。</p>
                <button class="reveal-button">了解更多</button>
              </div>
            </div>
          </div>
        </div>

        <div class="scroll-hover-reveal-card-192" data-card-index="3">
          <div class="scroll-hover-reveal-card-inner-192">
            <div class="scroll-hover-reveal-front-192">
              <div class="card-image">
                <img
                  src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=500&fit=crop"
                  alt="音乐"
                />
              </div>
              <div class="card-overlay">
                <h3 class="card-title">音乐律动</h3>
                <p class="card-subtitle">滚动显现 · 悬停揭示</p>
              </div>
            </div>
            <div class="scroll-hover-reveal-back-192">
              <div class="back-content">
                <h4>聆听音乐</h4>
                <p>音乐是灵魂的语言，通过旋律和节奏传达情感，体验音乐带来的无限魅力。</p>
                <button class="reveal-button">了解更多</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 交互说明区域 -->
      <div class="scroll-hover-reveal-info-192">
        <div class="info-item">
          <div class="info-icon">🖱️</div>
          <div class="info-text">
            <h4>滚动交互</h4>
            <p>卡片进入视口时自动显现</p>
          </div>
        </div>
        <div class="info-item">
          <div class="info-icon">✨</div>
          <div class="info-text">
            <h4>悬停效果</h4>
            <p>鼠标悬停时翻转揭示详情</p>
          </div>
        </div>
        <div class="info-item">
          <div class="info-icon">🎭</div>
          <div class="info-text">
            <h4>双重控制</h4>
            <p>滚动定位 + 悬停交互</p>
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
  initHoverRevealAnimation()
})

onUnmounted(() => {
  animationInstances.value.forEach((anim) => {
    if (anim.kill) anim.kill()
  })
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
})

function initHoverRevealAnimation() {
  // 获取所有卡片
  const cards = gsap.utils.toArray('.scroll-hover-reveal-card-192')

  // 为每个卡片设置滚动揭示动画
  cards.forEach((card, index) => {
    const cardInner = card.querySelector('.scroll-hover-reveal-card-inner-192')
    const cardFront = card.querySelector('.scroll-hover-reveal-front-192')
    const cardBack = card.querySelector('.scroll-hover-reveal-back-192')
    const overlay = card.querySelector('.card-overlay')

    if (!cardInner || !cardFront || !cardBack || !overlay) return

    // 滚动时卡片入场动画 - 增强版
    const entryAnim = gsap.from(card, {
      y: 250,
      opacity: 0,
      scale: 0.6,
      rotationX: 45,
      rotationY: -20,
      duration: 1.5,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })

    // 前面内容的淡入动画
    const frontAnim = gsap.from(cardFront, {
      opacity: 0.3,
      filter: 'blur(10px)',
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 75%',
        end: 'top 25%',
        scrub: 1
      }
    })

    // 遮罩层动画
    const overlayAnim = gsap.from(overlay, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      }
    })

    // 悬停效果 - 使用 GSAP 实现翻转
    let isHovered = false

    card.addEventListener('mouseenter', () => {
      if (!isHovered) {
        isHovered = true
        gsap.to(cardInner, {
          rotationY: 180,
          duration: 0.6,
          ease: 'power2.out'
        })
      }
    })

    card.addEventListener('mouseleave', () => {
      if (isHovered) {
        isHovered = false
        gsap.to(cardInner, {
          rotationY: 0,
          duration: 0.6,
          ease: 'power2.out'
        })
      }
    })

    animationInstances.value.push(entryAnim, frontAnim, overlayAnim)
  })

  // 页面标题入场动画 - 增强版
  const title = document.querySelector('.scroll-hover-reveal-title-192')
  const subtitle = document.querySelector('.scroll-hover-reveal-subtitle-192')

  if (title) {
    gsap.from(title, {
      y: 150,
      opacity: 0,
      scale: 0.8,
      rotationX: -45,
      duration: 1.5,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.scroll-hover-reveal-section-192',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })
  }

  if (subtitle) {
    gsap.from(subtitle, {
      y: 100,
      opacity: 0,
      scale: 0.7,
      rotationY: 30,
      duration: 1.2,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.scroll-hover-reveal-section-192',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      delay: 0.2
    })
  }

  // 交互说明区域动画
  const infoSection = document.querySelector('.scroll-hover-reveal-info-192')
  const infoItems = gsap.utils.toArray('.info-item')

  if (infoSection && infoItems.length > 0) {
    // 区域入场
    gsap.from(infoSection, {
      y: 200,
      opacity: 0,
      scale: 0.9,
      duration: 1.2,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: infoSection,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })

    // 信息项交错动画
    infoItems.forEach((item, index) => {
      gsap.from(item, {
        y: 100,
        opacity: 0,
        scale: 0.8,
        rotation: -15,
        duration: 1,
        ease: 'back.out(1.7)',
        stagger: 0.2,
        scrollTrigger: {
          trigger: infoSection,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      })
    })
  }
}
</script>

<style scoped lang="scss">
.scroll-hover-reveal-wrapper-192 {
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

.scroll-hover-reveal-section-192 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.scroll-hover-reveal-title-192 {
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

.scroll-hover-reveal-subtitle-192 {
  font-size: 1.1rem;
  color: #94a3b8;
  text-align: center;
  margin-bottom: 80px;
  transform-style: preserve-3d;
  will-change: transform, opacity;

  opacity: 1 !important;}

.scroll-hover-reveal-cards-192 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 100px;
  transform-style: preserve-3d;
  perspective: 1500px;
}

.scroll-hover-reveal-card-192 {
  height: 400px;
  cursor: pointer;
  transform-style: preserve-3d;
  will-change: transform, opacity;

  opacity: 1 !important;}

.scroll-hover-reveal-card-inner-192 {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);

  opacity: 1 !important;}

.scroll-hover-reveal-front-192,
.scroll-hover-reveal-back-192 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  backface-visibility: hidden;

  opacity: 1 !important;}

.scroll-hover-reveal-front-192 {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 2;

  opacity: 1 !important;}

.card-image {
  width: 100%;
  height: 100%;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  
  opacity: 1 !important;}

  .scroll-hover-reveal-card-192:hover & img {
    transform: scale(1.1);
  }
}

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  z-index: 3;

  opacity: 1 !important;}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  will-change: transform, opacity;

  opacity: 1 !important;}

.card-subtitle {
  font-size: 0.85rem;
  color: #a78bfa;
  font-weight: 500;
  will-change: transform, opacity;

  opacity: 1 !important;}

.scroll-hover-reveal-back-192 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: rotateY(180deg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;

  opacity: 1 !important;}

.back-content {
  text-align: center;
  color: #fff;

  h4 {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 16px;
  
  opacity: 1 !important;}

  p {
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 24px;
    opacity: 0.95;
  }
}

.reveal-button {
  padding: 12px 32px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  
  opacity: 1 !important;}
}

.scroll-hover-reveal-info-192 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
  padding: 60px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.info-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 30px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  will-change: transform, opacity;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(167, 139, 250, 0.3);
  
  opacity: 1 !important;}
}

.info-icon {
  font-size: 2rem;
  flex-shrink: 0;

  opacity: 1 !important;}

.info-text {
  h4 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 4px;
  
  opacity: 1 !important;}

  p {
    font-size: 0.85rem;
    color: #94a3b8;
  }
}

@media (max-width: 768px) {
  .scroll-hover-reveal-cards-192 {
    grid-template-columns: 1fr;
  }

  .scroll-hover-reveal-info-192 {
    flex-direction: column;
    gap: 20px;
    padding: 30px;
  
  opacity: 1 !important;}

  .info-item {
    width: 100%;
  
  opacity: 1 !important;}
}
</style>
