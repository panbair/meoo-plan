<template>
  <section class="scroll-pinch-zoom-251" ref="sectionRef">
    <div class="scroll-pinch-zoom-header-251">
      <h2 class="scroll-pinch-zoom-title-251">捏合缩放</h2>
      <p class="scroll-pinch-zoom-subtitle-251">双指捏合或放大缩小图片</p>
    </div>

    <!-- 交互说明 -->
    <div class="scroll-pinch-zoom-instructions-251">
      <div class="scroll-pinch-zoom-instruction-item-251">
        <div class="scroll-pinch-zoom-icon-wrapper-251">
          <svg class="scroll-pinch-zoom-icon-251" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" stroke-width="2"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke-width="2" stroke-linecap="round"/>
            <line x1="8" y1="11" x2="14" y2="11" stroke-width="2" stroke-linecap="round"/>
            <line x1="11" y1="8" x2="11" y2="14" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <span>双指捏合</span>
      </div>
      <div class="scroll-pinch-zoom-instruction-item-251">
        <div class="scroll-pinch-zoom-icon-wrapper-251">
          <svg class="scroll-pinch-zoom-icon-251" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6M7 10h6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span>放大缩小</span>
      </div>
      <div class="scroll-pinch-zoom-instruction-item-251">
        <div class="scroll-pinch-zoom-icon-wrapper-251">
          <svg class="scroll-pinch-zoom-icon-251" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span>拖动平移</span>
      </div>
    </div>

    <!-- 缩放容器 -->
    <div class="scroll-pinch-zoom-container-251">
      <div class="scroll-pinch-zoom-viewport-251" ref="viewport">
        <div class="scroll-pinch-zoom-content-251" ref="zoomContent">
          <!-- 图片网格 -->
          <div class="scroll-pinch-zoom-image-grid-251">
            <div class="scroll-pinch-zoom-image-item-251" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <div class="scroll-pinch-zoom-image-text-251">
                <h3>星空</h3>
                <p>探索宇宙奥秘</p>
              </div>
            </div>
            <div class="scroll-pinch-zoom-image-item-251" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
              <div class="scroll-pinch-zoom-image-text-251">
                <h3>日落</h3>
                <p>感受自然之美</p>
              </div>
            </div>
            <div class="scroll-pinch-zoom-image-item-251" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
              <div class="scroll-pinch-zoom-image-text-251">
                <h3>海洋</h3>
                <p>聆听海浪声</p>
              </div>
            </div>
            <div class="scroll-pinch-zoom-image-item-251" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
              <div class="scroll-pinch-zoom-image-text-251">
                <h3>森林</h3>
                <p>呼吸清新空气</p>
              </div>
            </div>
            <div class="scroll-pinch-zoom-image-item-251" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
              <div class="scroll-pinch-zoom-image-text-251">
                <h3>花卉</h3>
                <p>欣赏色彩斑斓</p>
              </div>
            </div>
            <div class="scroll-pinch-zoom-image-item-251" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);">
              <div class="scroll-pinch-zoom-image-text-251">
                <h3>湖泊</h3>
                <p>感受宁静之美</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 缩放控制面板 -->
      <div class="scroll-pinch-zoom-controls-251">
        <button class="scroll-pinch-zoom-control-btn-251" @click="zoomOut">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" stroke-width="2"/>
            <line x1="8" y1="11" x2="14" y2="11" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <div class="scroll-pinch-zoom-scale-display-251" ref="scaleDisplay">
          <span class="scroll-pinch-zoom-scale-value-251" ref="scaleValue">100%</span>
        </div>
        <button class="scroll-pinch-zoom-control-btn-251" @click="zoomIn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" stroke-width="2"/>
            <line x1="8" y1="11" x2="14" y2="11" stroke-width="2" stroke-linecap="round"/>
            <line x1="11" y1="8" x2="11" y2="14" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 状态信息 -->
    <div class="scroll-pinch-zoom-info-251">
      <div class="scroll-pinch-zoom-info-item-251">
        <span class="scroll-pinch-zoom-info-label-251">缩放比例</span>
        <span class="scroll-pinch-zoom-info-value-251" ref="infoScale">100%</span>
      </div>
      <div class="scroll-pinch-zoom-info-item-251">
        <span class="scroll-pinch-zoom-info-label-251">平移位置</span>
        <span class="scroll-pinch-zoom-info-value-251" ref="infoPosition">X:0 Y:0</span>
      </div>
    </div>

    <!-- 重置按钮 -->
    <div class="scroll-pinch-zoom-footer-251">
      <button class="scroll-pinch-zoom-reset-btn-251" @click="resetZoom">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3 3v5h5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        重置视图
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const viewport = ref(null)
const zoomContent = ref(null)
const scaleDisplay = ref(null)
const scaleValue = ref(null)
const infoScale = ref(null)
const infoPosition = ref(null)
const sectionRef = ref(null)

let ctx = null
let currentScale = 1
let currentX = 0
let currentY = 0
let initialDistance = 0
let initialScale = 1

const MIN_SCALE = 0.5
const MAX_SCALE = 3

const getDistance = (touch1, touch2) => {
  const dx = touch1.clientX - touch2.clientX
  const dy = touch1.clientY - touch2.clientY
  return Math.sqrt(dx * dx + dy * dy)
}

const updateDisplay = () => {
  const percentage = Math.round(currentScale * 100)
  if (scaleValue.value) scaleValue.value.textContent = `${percentage}%`
  if (infoScale.value) infoScale.value.textContent = `${percentage}%`
  if (infoPosition.value) infoPosition.value.textContent = `X:${Math.round(currentX)} Y:${Math.round(currentY)}`
}

const zoomIn = () => {
  const newScale = Math.min(currentScale * 1.2, MAX_SCALE)
  currentScale = newScale
  gsap.to(zoomContent.value, {
    scale: newScale,
    duration: 0.3,
    ease: 'power2.out',
    onUpdate: updateDisplay
  })
}

const zoomOut = () => {
  const newScale = Math.max(currentScale / 1.2, MIN_SCALE)
  currentScale = newScale
  gsap.to(zoomContent.value, {
    scale: newScale,
    duration: 0.3,
    ease: 'power2.out',
    onUpdate: updateDisplay
  })
}

const resetZoom = () => {
  currentScale = 1
  currentX = 0
  currentY = 0
  gsap.to(zoomContent.value, {
    scale: 1,
    x: 0,
    y: 0,
    duration: 0.5,
    ease: 'elastic.out(1, 0.5)',
    onUpdate: updateDisplay
  })
}

const initPinchZoom = () => {
  if (!viewport.value || !zoomContent.value || !sectionRef.value) return

  ctx = gsap.context(() => {
    // 标题入场动画
    const titleEl = document.querySelector('.scroll-pinch-zoom-title-251')
    if (titleEl) {
      gsap.from(titleEl, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      })
    }

    // 副标题入场动画
    const subtitleEl = document.querySelector('.scroll-pinch-zoom-subtitle-251')
    if (subtitleEl) {
      gsap.from(subtitleEl, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.2
      })
    }

    // 交互说明入场动画
    const instructionItems = gsap.utils.toArray('.scroll-pinch-zoom-instruction-item-251')
    if (instructionItems.length > 0) {
      gsap.from(instructionItems, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.4
      })
    }

    // 容器入场动画
    const containerEl = document.querySelector('.scroll-pinch-zoom-container-251')
    if (containerEl) {
      gsap.from(containerEl, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.6
      })
    }

    // 图片项入场动画
    const imageItems = gsap.utils.toArray('.scroll-pinch-zoom-image-item-251')
    if (imageItems.length > 0) {
      gsap.fromTo(imageItems, {
        y: 50,
        opacity: 0,
        scale: 0.9
      }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 1
      })
    }

    // 控制面板入场动画
    const controlsEl = document.querySelector('.scroll-pinch-zoom-controls-251')
    if (controlsEl) {
      gsap.from(controlsEl, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: 1.5
      })
    }

    // 状态信息入场动画
    const infoEl = document.querySelector('.scroll-pinch-zoom-info-251')
    if (infoEl) {
      gsap.from(infoEl, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: 1.8
      })
    }

    // 底部重置按钮入场动画
    const footerEl = document.querySelector('.scroll-pinch-zoom-footer-251')
    if (footerEl) {
      gsap.from(footerEl, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: 2.1
      })
    }

    // 捏合缩放逻辑
    let isPinching = false
    let lastTouchDistance = 0

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        isPinching = true
        initialDistance = getDistance(e.touches[0], e.touches[1])
        lastTouchDistance = initialDistance
        initialScale = currentScale
        viewport.value.style.cursor = 'grabbing'
      }
    }

    const handleTouchMove = (e) => {
      if (isPinching && e.touches.length === 2) {
        e.preventDefault()
        const currentDistance = getDistance(e.touches[0], e.touches[1])
        const scaleRatio = currentDistance / initialDistance
        const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, initialScale * scaleRatio))

        currentScale = newScale
        gsap.set(zoomContent.value, {
          scale: newScale
        })
        updateDisplay()
      }
    }

    const handleTouchEnd = () => {
      if (isPinching) {
        isPinching = false
        viewport.value.style.cursor = 'grab'

        // 添加弹性效果
        gsap.to(zoomContent.value, {
          scale: currentScale,
          duration: 0.3,
          ease: 'power2.out'
        })
      }
    }

    // 拖动平移逻辑
    let isDragging = false
    let startX = 0
    let startY = 0
    let startPanX = 0
    let startPanY = 0

    const handleMouseDown = (e) => {
      if (e.touches && e.touches.length === 2) return
      isDragging = true
      startX = e.clientX || (e.touches && e.touches[0].clientX)
      startY = e.clientY || (e.touches && e.touches[0].clientY)
      startPanX = currentX
      startPanY = currentY
      viewport.value.style.cursor = 'grabbing'
    }

    const handleMouseMove = (e) => {
      if (!isDragging) return

      const clientX = e.clientX || (e.touches && e.touches[0].clientX)
      const clientY = e.clientY || (e.touches && e.touches[0].clientY)

      const deltaX = clientX - startX
      const deltaY = clientY - startY

      currentX = startPanX + deltaX
      currentY = startPanY + deltaY

      gsap.set(zoomContent.value, {
        x: currentX,
        y: currentY
      })
      updateDisplay()
    }

    const handleMouseUp = () => {
      if (isDragging) {
        isDragging = false
        viewport.value.style.cursor = 'grab'

        gsap.to(zoomContent.value, {
          x: currentX,
          y: currentY,
          duration: 0.3,
          ease: 'power2.out'
        })
      }
    }

    // 触摸事件
    viewport.value.addEventListener('touchstart', handleTouchStart, { passive: true })
    viewport.value.addEventListener('touchmove', handleTouchMove, { passive: false })
    viewport.value.addEventListener('touchend', handleTouchEnd, { passive: true })

    // 鼠标事件
    viewport.value.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    // 鼠标滚轮缩放
    viewport.value.addEventListener('wheel', (e) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, currentScale * delta))

      currentScale = newScale
      gsap.to(zoomContent.value, {
        scale: newScale,
        duration: 0.3,
        ease: 'power2.out',
        onUpdate: updateDisplay
      })
    }, { passive: false })

    // 图片项悬停效果
    const hoverImageItems = gsap.utils.toArray('.scroll-pinch-zoom-image-item-251')
    hoverImageItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, {
          scale: 1.05,
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          duration: 0.4,
          ease: 'power2.out'
        })
      })

      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          scale: 1,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          duration: 0.4,
          ease: 'power2.out'
        })
      })
    })

    // 控制按钮悬停效果
    const controlBtns = gsap.utils.toArray('.scroll-pinch-zoom-control-btn-251')
    controlBtns.forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
          scale: 1.1,
          backgroundColor: '#6366f1',
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          scale: 1,
          backgroundColor: '#4f46e5',
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })

    // 重置按钮悬停效果
    const resetBtn = document.querySelector('.scroll-pinch-zoom-reset-btn-251')
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
    const hoverInstructionItems = gsap.utils.toArray('.scroll-pinch-zoom-instruction-item-251')
    hoverInstructionItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, {
          y: -5,
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        })
        gsap.to(item.querySelector('.scroll-pinch-zoom-icon-wrapper-251'), {
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
        gsap.to(item.querySelector('.scroll-pinch-zoom-icon-wrapper-251'), {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: 'power2.out'
        })
      })
    })

  }, sectionRef.value)
}

onMounted(() => {
  setTimeout(initPinchZoom, 300)
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
.scroll-pinch-zoom-251 {
  min-height: 100vh;
  padding: 80px 40px;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  overflow: hidden;
  position: relative;
}

.scroll-pinch-zoom-251::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 40%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
  radial-gradient(circle at 70% 60%, rgba(168, 85, 247, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

/* 标题区域 */
.scroll-pinch-zoom-header-251 {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
}

.scroll-pinch-zoom-title-251 {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 900;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #a78bfa, #60a5fa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transform-style: preserve-3d;
  will-change: transform, opacity;
}

.scroll-pinch-zoom-subtitle-251 {
  font-size: 1.2rem;
  color: #94a3b8;
  transform-style: preserve-3d;
  will-change: transform, opacity;
}

/* 交互说明 */
.scroll-pinch-zoom-instructions-251 {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-bottom: 60px;
  flex-wrap: wrap;
}

.scroll-pinch-zoom-instruction-item-251 {
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
}

.scroll-pinch-zoom-icon-wrapper-251 {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
}

.scroll-pinch-zoom-icon-251 {
  width: 24px;
  height: 24px;
}

/* 缩放容器 */
.scroll-pinch-zoom-container-251 {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.scroll-pinch-zoom-viewport-251 {
  width: 100%;
  height: 600px;
  overflow: hidden;
  cursor: grab;
  position: relative;
}

.scroll-pinch-zoom-viewport-251:active {
  cursor: grabbing;
}

.scroll-pinch-zoom-content-251 {
  width: 100%;
  height: 100%;
  transform-origin: center center;
  will-change: transform;
}

.scroll-pinch-zoom-image-grid-251 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
  width: 100%;
  min-height: 100%;
  grid-auto-rows: 1fr;
}

.scroll-pinch-zoom-image-item-251 {
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  padding: 20px;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.4s ease;
  min-height: 200px;
}

.scroll-pinch-zoom-image-text-251 h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 4px;
}

.scroll-pinch-zoom-image-text-251 p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

/* 缩放控制面板 */
.scroll-pinch-zoom-controls-251 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.scroll-pinch-zoom-control-btn-251 {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.scroll-pinch-zoom-control-btn-251 svg {
  width: 24px;
  height: 24px;
}

.scroll-pinch-zoom-scale-display-251 {
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  min-width: 100px;
  text-align: center;
}

.scroll-pinch-zoom-scale-value-251 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #a78bfa;
}

/* 状态信息 */
.scroll-pinch-zoom-info-251 {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
  padding: 20px;
}

.scroll-pinch-zoom-info-item-251 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.scroll-pinch-zoom-info-label-251 {
  font-size: 0.85rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.scroll-pinch-zoom-info-value-251 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #e2e8f0;
}

/* 底部重置按钮 */
.scroll-pinch-zoom-footer-251 {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.scroll-pinch-zoom-reset-btn-251 {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.scroll-pinch-zoom-reset-btn-251 svg {
  width: 18px;
  height: 18px;
}

.scroll-pinch-zoom-reset-btn-251:hover {
  background: #6366f1;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .scroll-pinch-zoom-image-grid-251 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .scroll-pinch-zoom-251 {
    padding: 40px 20px;
  }

  .scroll-pinch-zoom-instructions-251 {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .scroll-pinch-zoom-viewport-251 {
    height: 500px;
  }

  .scroll-pinch-zoom-image-grid-251 {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }

  .scroll-pinch-zoom-info-251 {
    flex-direction: column;
    gap: 20px;
  }

  .scroll-pinch-zoom-image-item-251 {
    min-height: 150px;
  }
}
</style>
