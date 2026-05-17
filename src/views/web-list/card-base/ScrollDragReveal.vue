<template>
  <section class="scroll-drag-reveal-250">
    <div class="scroll-drag-reveal-header-250">
      <h2 class="scroll-drag-reveal-title-250">拖拽滑动揭示</h2>
      <p class="scroll-drag-reveal-subtitle-250">拖动滑块探索更多内容</p>
    </div>

    <!-- 交互说明 -->
    <div class="scroll-drag-reveal-instructions-250">
      <div class="scroll-drag-reveal-instruction-item-250">
        <div class="scroll-drag-reveal-icon-wrapper-250">
          <svg class="scroll-drag-reveal-icon-250" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M7 16l5-5 5 5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7 8l5 5 5-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span>左右拖拽</span>
      </div>
      <div class="scroll-drag-reveal-instruction-item-250">
        <div class="scroll-drag-reveal-icon-wrapper-250">
          <svg class="scroll-drag-reveal-icon-250" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2"/>
            <path d="M12 6v12M6 12h12" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <span>揭示内容</span>
      </div>
      <div class="scroll-drag-reveal-instruction-item-250">
        <div class="scroll-drag-reveal-icon-wrapper-250">
          <svg class="scroll-drag-reveal-icon-250" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 12h18M3 6h18M3 18h18" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <span>流畅动画</span>
      </div>
    </div>

    <!-- 拖拽容器 -->
    <div class="scroll-drag-reveal-container-250">
      <!-- 遮罩层 -->
      <div class="scroll-drag-reveal-mask-250">
        <div class="scroll-drag-reveal-progress-250">
          <div class="scroll-drag-reveal-progress-bar-250" ref="progressBar"></div>
        </div>
        <div class="scroll-drag-reveal-percentage-250" ref="percentageText">0%</div>
        <div class="scroll-drag-reveal-hint-250">← 拖动滑块 →</div>
      </div>

      <!-- 可拖拽内容区域 -->
      <div class="scroll-drag-reveal-content-250" ref="draggableContent">
        <!-- 卡片1 -->
        <div class="scroll-drag-reveal-card-250">
          <div class="scroll-drag-reveal-card-image-250" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <div class="scroll-drag-reveal-card-overlay-250">
              <h3>创意设计</h3>
              <p>探索无限可能</p>
            </div>
          </div>
          <div class="scroll-drag-reveal-card-content-250">
            <h4>创意设计</h4>
            <p>打破常规思维，用独特的设计语言讲述故事，让创意在作品中绽放光彩。</p>
          </div>
        </div>

        <!-- 卡片2 -->
        <div class="scroll-drag-reveal-card-250">
          <div class="scroll-drag-reveal-card-image-250" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
            <div class="scroll-drag-reveal-card-overlay-250">
              <h3>视觉艺术</h3>
              <p>感受视觉冲击</p>
            </div>
          </div>
          <div class="scroll-drag-reveal-card-content-250">
            <h4>视觉艺术</h4>
            <p>通过色彩、形状和构图的巧妙组合，创造出令人难忘的视觉体验。</p>
          </div>
        </div>

        <!-- 卡片3 -->
        <div class="scroll-drag-reveal-card-250">
          <div class="scroll-drag-reveal-card-image-250" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
            <div class="scroll-drag-reveal-card-overlay-250">
              <h3>交互体验</h3>
              <p>沉浸式体验</p>
            </div>
          </div>
          <div class="scroll-drag-reveal-card-content-250">
            <h4>交互体验</h4>
            <p>让用户通过直观的操作与内容互动，获得更加沉浸和有趣的体验。</p>
          </div>
        </div>

        <!-- 卡片4 -->
        <div class="scroll-drag-reveal-card-250">
          <div class="scroll-drag-reveal-card-image-250" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
            <div class="scroll-drag-reveal-card-overlay-250">
              <h3>动画效果</h3>
              <p>流畅动效</p>
            </div>
          </div>
          <div class="scroll-drag-reveal-card-content-250">
            <h4>动画效果</h4>
            <p>精心设计的动画过渡，让界面元素的运动更加自然流畅，提升用户体验。</p>
          </div>
        </div>

        <!-- 卡片5 -->
        <div class="scroll-drag-reveal-card-250">
          <div class="scroll-drag-reveal-card-image-250" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
            <div class="scroll-drag-reveal-card-overlay-250">
              <h3>色彩运用</h3>
              <p>色彩美学</p>
            </div>
          </div>
          <div class="scroll-drag-reveal-card-content-250">
            <h4>色彩运用</h4>
            <p>运用色彩心理学和美学原理，创造出和谐、有感染力的视觉设计。</p>
          </div>
        </div>

        <!-- 卡片6 -->
        <div class="scroll-drag-reveal-card-250">
          <div class="scroll-drag-reveal-card-image-250" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);">
            <div class="scroll-drag-reveal-card-overlay-250">
              <h3>排版布局</h3>
              <p>结构之美</p>
            </div>
          </div>
          <div class="scroll-drag-reveal-card-content-250">
            <h4>排版布局</h4>
            <p>合理的版式设计和布局结构，让信息传达更加清晰有效。</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部提示 -->
    <div class="scroll-drag-reveal-footer-250">
      <p>已探索 <span class="scroll-drag-reveal-footer-percentage-250" ref="footerPercentage">0</span>% 的内容</p>
      <button class="scroll-drag-reveal-reset-btn-250" @click="resetPosition">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3 3v5h5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        重置位置
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const draggableContent = ref(null)
const progressBar = ref(null)
const percentageText = ref(null)
const footerPercentage = ref(null)

let dragAnimation = null
let ctx = null

const initDragReveal = () => {
  if (!draggableContent.value) return

  const content = draggableContent.value
  const scrollWidth = content.scrollWidth - content.clientWidth
  const maxDrag = Math.min(0, -scrollWidth)

  const sectionEl = document.querySelector('.scroll-drag-reveal-250')
  if (!sectionEl) return

  ctx = gsap.context(() => {

    // 标题入场动画
    const titleEl = document.querySelector('.scroll-drag-reveal-title-250')
    if (titleEl) {
      gsap.from(titleEl, {
        y: 200,
        opacity: 0,
        scale: 0.5,
        rotationX: -60,
        duration: 1.8,
        ease: 'elastic.out(1, 0.8)',
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top 90%',
          end: 'top 60%',
          scrub: 1,
          toggleActions: 'play none none reverse'
        }
      })
    }

    // 副标题入场动画
    const subtitleEl = document.querySelector('.scroll-drag-reveal-subtitle-250')
    if (subtitleEl) {
      gsap.from(subtitleEl, {
        y: 150,
        opacity: 0,
        scale: 0.6,
        rotationY: 45,
        duration: 1.5,
        ease: 'elastic.out(1, 0.7)',
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top 88%',
          end: 'top 65%',
          scrub: 1,
          toggleActions: 'play none none reverse'
        }
      })
    }

    // 交互说明入场动画
    const instructionItems = gsap.utils.toArray('.scroll-drag-reveal-instruction-item-250')
    if (instructionItems.length > 0) {
      gsap.from(instructionItems, {
        y: 150,
        opacity: 0,
        scale: 0.6,
        rotation: -30,
        duration: 1.2,
        ease: 'back.out(2)',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.scroll-drag-reveal-instructions-250',
          start: 'top 90%',
          end: 'bottom 80%',
          scrub: 1,
          toggleActions: 'play none none reverse'
        }
      })
    }

    // 容器入场动画
    const containerEl = document.querySelector('.scroll-drag-reveal-container-250')
    if (containerEl) {
      gsap.from(containerEl, {
        y: 300,
        opacity: 0,
        scale: 0.7,
        rotationX: 20,
        duration: 1.5,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: containerEl,
          start: 'top 90%',
          end: 'top 50%',
          scrub: 1.5,
          toggleActions: 'play none none reverse'
        }
      })
    }

    // 卡片入场动画
    const cards = gsap.utils.toArray('.scroll-drag-reveal-card-250')
    if (cards.length > 0) {
      gsap.from(cards, {
        x: 200,
        y: 100,
        opacity: 0,
        scale: 0.5,
        rotationY: 45,
        rotationX: -20,
        duration: 1.2,
        ease: 'elastic.out(1, 0.6)',
        stagger: 0.15,
        scrollTrigger: {
          trigger: containerEl,
          start: 'top 85%',
          end: 'top 30%',
          scrub: 1.2,
          toggleActions: 'play none none reverse'
        }
      })
    }

    // 遮罩层入场动画
    const maskEl = document.querySelector('.scroll-drag-reveal-mask-250')
    if (maskEl) {
      gsap.from(maskEl, {
        x: -200,
        opacity: 0,
        scale: 0.8,
        duration: 1.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerEl,
          start: 'top 80%',
          end: 'top 40%',
          scrub: 1,
          toggleActions: 'play none none reverse'
        }
      })
    }

    // 底部提示入场动画
    const footerEl = document.querySelector('.scroll-drag-reveal-footer-250')
    if (footerEl) {
      gsap.from(footerEl, {
        y: 100,
        opacity: 0,
        scale: 0.8,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: footerEl,
          start: 'top 90%',
          end: 'bottom 70%',
          scrub: 1,
          toggleActions: 'play none none reverse'
        }
      })
    }

    // 拖拽动画核心
    dragAnimation = gsap.to(content, {
      x: maxDrag,
      duration: 1,
      ease: 'power2.out',
      paused: true,
      onUpdate: () => {
        const progress = dragAnimation.progress()
        const percentage = Math.round(progress * 100)
        
        // 更新进度条
        if (progressBar.value) {
          gsap.set(progressBar.value, { width: `${percentage}%` })
        }
        
        // 更新百分比显示
        if (percentageText.value) {
          percentageText.value.textContent = `${percentage}%`
        }
        
        if (footerPercentage.value) {
          footerPercentage.value.textContent = percentage
        }
      }
    })

    // 拖拽事件处理
    let isDragging = false
    let startX = 0
    let currentX = 0

    const handleStart = (x) => {
      isDragging = true
      startX = x - gsap.getProperty(content, 'x')
      gsap.set(content, { cursor: 'grabbing' })
    }

    const handleMove = (x) => {
      if (!isDragging) return
      
      currentX = x - startX
      const clampedX = Math.max(maxDrag, Math.min(0, currentX))
      
      gsap.set(content, { x: clampedX })
      
      // 更新进度
      const progress = Math.abs(clampedX) / Math.abs(maxDrag)
      dragAnimation.progress(progress)
    }

    const handleEnd = () => {
      if (!isDragging) return
      isDragging = false
      gsap.set(content, { cursor: 'grab' })
      
      // 弹性回归
      const currentXVal = gsap.getProperty(content, 'x')
      const progress = Math.abs(currentXVal) / Math.abs(maxDrag)
      dragAnimation.progress(progress)
      dragAnimation.pause()
    }

    // 鼠标事件
    content.addEventListener('mousedown', (e) => handleStart(e.clientX))
    window.addEventListener('mousemove', (e) => handleMove(e.clientX))
    window.addEventListener('mouseup', handleEnd)

    // 触摸事件
    content.addEventListener('touchstart', (e) => handleStart(e.touches[0].clientX), { passive: true })
    window.addEventListener('touchmove', (e) => handleMove(e.touches[0].clientX), { passive: true })
    window.addEventListener('touchend', handleEnd, { passive: true })

    // 卡片悬停效果
    const hoverCards = gsap.utils.toArray('.scroll-drag-reveal-card-250')
    hoverCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.05,
          y: -10,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          duration: 0.4,
          ease: 'power2.out'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          y: 0,
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          duration: 0.4,
          ease: 'power2.out'
        })
      })
    })

    // 重置按钮悬停效果
    const resetBtn = document.querySelector('.scroll-drag-reveal-reset-btn-250')
    if (resetBtn) {
      resetBtn.addEventListener('mouseenter', () => {
        gsap.to(resetBtn, {
          scale: 1.05,
          backgroundColor: '#6366f1',
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      resetBtn.addEventListener('mouseleave', () => {
        gsap.to(resetBtn, {
          scale: 1,
          backgroundColor: '#4f46e5',
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    }

    // 交互说明项悬停效果
    const hoverInstructionItems = gsap.utils.toArray('.scroll-drag-reveal-instruction-item-250')
    hoverInstructionItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, {
          y: -5,
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        })
        gsap.to(item.querySelector('.scroll-drag-reveal-icon-wrapper-250'), {
          scale: 1.2,
          rotation: 360,
          duration: 0.5,
          ease: 'back.out(1.7)'
        })
      })

      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        })
        gsap.to(item.querySelector('.scroll-drag-reveal-icon-wrapper-250'), {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: 'power2.out'
        })
      })
    })

  }, draggableContent.value)
}

const resetPosition = () => {
  if (dragAnimation) {
    gsap.to(draggableContent.value, {
      x: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)'
    })
    dragAnimation.progress(0)
    
    if (progressBar.value) {
      gsap.set(progressBar.value, { width: '0%' })
    }
    if (percentageText.value) {
      percentageText.value.textContent = '0%'
    }
    if (footerPercentage.value) {
      footerPercentage.value.textContent = '0'
    }
  }
}

onMounted(() => {
  setTimeout(initDragReveal, 300)
})

onUnmounted(() => {
  if (ctx) ctx.revert()
  if (dragAnimation) dragAnimation.kill()
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.scroll-drag-reveal-250 {
  min-height: 100vh;
  padding: 80px 40px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  overflow: hidden;
  position: relative;

  opacity: 1 !important;}

.scroll-drag-reveal-250::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

/* 标题区域 */
.scroll-drag-reveal-header-250 {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.scroll-drag-reveal-title-250 {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 900;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #a78bfa, #60a5fa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transform-style: preserve-3d;
  will-change: transform, opacity;

  opacity: 1 !important;}

.scroll-drag-reveal-subtitle-250 {
  font-size: 1.2rem;
  color: #94a3b8;
  transform-style: preserve-3d;
  will-change: transform, opacity;

  opacity: 1 !important;}

/* 交互说明 */
.scroll-drag-reveal-instructions-250 {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-bottom: 60px;
  flex-wrap: wrap;
}

.scroll-drag-reveal-instruction-item-250 {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  color: #e2e8f0;
  font-size: 0.95rem;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.scroll-drag-reveal-icon-wrapper-250 {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;

  opacity: 1 !important;}

.scroll-drag-reveal-icon-250 {
  width: 24px;
  height: 24px;

  opacity: 1 !important;}

/* 拖拽容器 */
.scroll-drag-reveal-container-250 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);

  opacity: 1 !important;}

.scroll-drag-reveal-mask-250 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, rgba(26, 26, 46, 0.95) 0%, rgba(26, 26, 46, 0.8) 30%, transparent 100%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 40px;
  pointer-events: none;

  opacity: 1 !important;}

.scroll-drag-reveal-progress-250 {
  width: 100%;
  max-width: 300px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-bottom: 20px;
  overflow: hidden;

  opacity: 1 !important;}

.scroll-drag-reveal-progress-bar-250 {
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;

  opacity: 1 !important;}

.scroll-drag-reveal-percentage-250 {
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;

  opacity: 1 !important;}

.scroll-drag-reveal-hint-250 {
  font-size: 1rem;
  color: #94a3b8;
  animation: bounce 2s infinite;

  opacity: 1 !important;}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
}

/* 可拖拽内容 */
.scroll-drag-reveal-content-250 {
  display: flex;
  gap: 24px;
  padding: 40px;
  cursor: grab;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.scroll-drag-reveal-content-250::-webkit-scrollbar {
  display: none;
}

.scroll-drag-reveal-card-250 {
  flex: 0 0 320px;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transition: all 0.4s ease;

  opacity: 1 !important;}

.scroll-drag-reveal-card-image-250 {
  height: 200px;
  display: flex;
  align-items: flex-end;
  padding: 20px;
  position: relative;

  opacity: 1 !important;}

.scroll-drag-reveal-card-overlay-250 h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 4px;
}

.scroll-drag-reveal-card-overlay-250 p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.scroll-drag-reveal-card-content-250 {
  padding: 24px;

  opacity: 1 !important;}

.scroll-drag-reveal-card-content-250 h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 12px;
}

.scroll-drag-reveal-card-content-250 p {
  font-size: 0.95rem;
  color: #94a3b8;
  line-height: 1.6;
}

/* 底部提示 */
.scroll-drag-reveal-footer-250 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-top: 40px;
  color: #94a3b8;
  font-size: 1rem;

  opacity: 1 !important;}

.scroll-drag-reveal-footer-percentage-250 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #a78bfa;

  opacity: 1 !important;}

.scroll-drag-reveal-reset-btn-250 {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.scroll-drag-reveal-reset-btn-250 svg {
  width: 18px;
  height: 18px;
}

.scroll-drag-reveal-reset-btn-250:hover {
  background: #6366f1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .scroll-drag-reveal-250 {
    padding: 40px 20px;
  
  opacity: 1 !important;}

  .scroll-drag-reveal-instructions-250 {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .scroll-drag-reveal-card-250 {
    flex: 0 0 280px;
  }

  .scroll-drag-reveal-footer-250 {
    flex-direction: column;
    gap: 20px;
  }

  .scroll-drag-reveal-mask-250 {
    padding: 20px;
  
  opacity: 1 !important;}

  .scroll-drag-reveal-percentage-250 {
    font-size: 3rem;
  
  opacity: 1 !important;}
}
</style>
