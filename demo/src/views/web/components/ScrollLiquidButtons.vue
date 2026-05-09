<template>
  <div class="liquid-buttons-container-219">
    <div class="liquid-header-219">
      <h2 class="liquid-title-219">💧 液体按钮动画</h2>
      <p class="liquid-subtitle-219">按钮内部液体流动和波纹效果</p>
      <div class="scroll-progress-219" ref="progressIndicator">
        <div class="progress-bar-219" ref="progressBar"></div>
        <span class="progress-text-219" ref="progressText">0%</span>
      </div>
    </div>

    <!-- 基础液体按钮 - 滚动控制 -->
    <div class="liquid-section-219">
      <h3 class="section-title-219">基础液体效果</h3>
      <div class="buttons-row-219">
        <button class="liquid-btn-219 btn-basic-1-219">
          <span class="btn-text-219">液体流动</span>
          <div class="liquid-fill-219"></div>
        </button>
        <button class="liquid-btn-219 btn-basic-2-219">
          <span class="btn-text-219">波纹扩散</span>
          <div class="liquid-fill-219"></div>
        </button>
        <button class="liquid-btn-219 btn-basic-3-219">
          <span class="btn-text-219">液态填充</span>
          <div class="liquid-fill-219"></div>
        </button>
      </div>
    </div>

    <!-- 渐变液体按钮 - 滚动控制 -->
    <div class="liquid-section-219">
      <h3 class="section-title-219">渐变液体效果</h3>
      <div class="buttons-row-219">
        <button class="liquid-btn-219 btn-gradient-1-219">
          <span class="btn-text-219">海洋蓝</span>
          <div class="liquid-gradient-219"></div>
        </button>
        <button class="liquid-btn-219 btn-gradient-2-219">
          <span class="btn-text-219">日落红</span>
          <div class="liquid-gradient-219"></div>
        </button>
        <button class="liquid-btn-219 btn-gradient-3-219">
          <span class="btn-text-219">极光紫</span>
          <div class="liquid-gradient-219"></div>
        </button>
      </div>
    </div>

    <!-- 涟漪按钮 - 滚动控制 -->
    <div class="liquid-section-219">
      <h3 class="section-title-219">涟漪扩散效果</h3>
      <div class="buttons-row-219">
        <button class="ripple-btn-219 btn-ripple-1-219" ref="ripple1">
          <span class="btn-text-219">单击涟漪</span>
          <div class="ripple-effect-219"></div>
        </button>
        <button class="ripple-btn-219 btn-ripple-2-219" ref="ripple2">
          <span class="btn-text-219">多重涟漪</span>
          <div class="ripple-effect-219"></div>
          <div class="ripple-effect-219 ripple-delay-219"></div>
        </button>
        <button class="ripple-btn-219 btn-ripple-3-219" ref="ripple3">
          <span class="btn-text-219">持续涟漪</span>
          <div class="ripple-effect-219"></div>
          <div class="ripple-effect-219 ripple-delay-219"></div>
          <div class="ripple-effect-219 ripple-delay-219 ripple-delay-2-219"></div>
        </button>
      </div>
    </div>

    <!-- 液体形状按钮 - 滚动控制 -->
    <div class="liquid-section-219">
      <h3 class="section-title-219">液体形状变形</h3>
      <div class="buttons-row-219">
        <button class="shape-liquid-btn-219 btn-shape-1-219">
          <span class="btn-text-219">圆形流动</span>
          <div class="shape-liquid-219"></div>
        </button>
        <button class="shape-liquid-btn-219 btn-shape-2-219">
          <span class="btn-text-219">方形波动</span>
          <div class="shape-liquid-219"></div>
        </button>
        <button class="shape-liquid-btn-219 btn-shape-3-219">
          <span class="btn-text-219">多边形</span>
          <div class="shape-liquid-219"></div>
        </button>
      </div>
    </div>

    <!-- 粘性液体按钮 - 滚动控制 -->
    <div class="liquid-section-219">
      <h3 class="section-title-219">粘性液体效果</h3>
      <div class="buttons-row-219">
        <button class="gooey-btn-219 btn-gooey-1-219">
          <span class="btn-text-219">蜂蜜粘性</span>
          <div class="gooey-liquid-219"></div>
        </button>
        <button class="gooey-btn-219 btn-gooey-2-219">
          <span class="btn-text-219">焦糖拉伸</span>
          <div class="gooey-liquid-219"></div>
        </button>
        <button class="gooey-btn-219 btn-gooey-3-219">
          <span class="btn-text-219">巧克力融合</span>
          <div class="gooey-liquid-219"></div>
        </button>
      </div>
    </div>

    <!-- 液体加载按钮 - 滚动控制 -->
    <div class="liquid-section-219">
      <h3 class="section-title-219">液体加载效果</h3>
      <div class="buttons-row-219">
        <button class="load-btn-219 btn-load-1-219" ref="load1">
          <span class="btn-text-219">加载中</span>
          <div class="liquid-progress-219"></div>
          <div class="loading-wave-219"></div>
        </button>
        <button class="load-btn-219 btn-load-2-219" ref="load2">
          <span class="btn-text-219">波浪加载</span>
          <div class="liquid-progress-219"></div>
          <div class="loading-wave-219"></div>
          <div class="loading-wave-219 wave-offset-219"></div>
        </button>
        <button class="load-btn-219 btn-load-3-219" ref="load3">
          <span class="btn-text-219">液滴加载</span>
          <div class="liquid-progress-219"></div>
          <div class="droplet-219"></div>
        </button>
      </div>
    </div>

    <!-- 悬停液体按钮 - 滚动控制 -->
    <div class="liquid-section-219">
      <h3 class="section-title-219">悬停液体效果</h3>
      <div class="buttons-row-219">
        <button class="hover-btn-219 btn-hover-1-219" ref="hover1">
          <span class="btn-text-219">悬停流动</span>
          <div class="hover-liquid-219"></div>
        </button>
        <button class="hover-btn-219 btn-hover-2-219" ref="hover2">
          <span class="btn-text-219">边框液体</span>
          <div class="hover-liquid-219"></div>
        </button>
        <button class="hover-btn-219 btn-hover-3-219" ref="hover3">
          <span class="btn-text-219">填充液体</span>
          <div class="hover-liquid-219"></div>
        </button>
      </div>
    </div>

    <!-- 交互液体按钮 - 滚动控制 -->
    <div class="liquid-interactive-219">
      <div class="interactive-wrapper-219">
        <button class="interactive-liquid-btn-219" ref="interactiveBtn">
          <span class="btn-text-219">移动鼠标体验液体</span>
          <canvas class="liquid-canvas-219" ref="liquidCanvas"></canvas>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const progressIndicator = ref(null)
const progressBar = ref(null)
const progressText = ref(null)
const ripple1 = ref(null)
const ripple2 = ref(null)
const ripple3 = ref(null)
const load1 = ref(null)
const load2 = ref(null)
const load3 = ref(null)
const hover1 = ref(null)
const hover2 = ref(null)
const hover3 = ref(null)
const interactiveBtn = ref(null)
const liquidCanvas = ref(null)

let ctx = null
let animationFrame = null
let mouseX = 0
let mouseY = 0
let targetX = 0
let targetY = 0

onMounted(() => {
  initScrollAnimations()
  initInteractiveLiquid()
})

onUnmounted(() => {
  gsap.killTweensOf('.liquid-buttons-container-219 *')
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})

function initScrollAnimations() {
  // 全局滚动进度指示器
  gsap.to(progressBar.value, {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.liquid-buttons-container-219',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
      onUpdate: (self) => {
        if (progressText.value) {
          progressText.value.textContent = Math.round(self.progress * 100) + '%'
        }
      }
    }
  })

  // 基础液体按钮 - 滚动控制
  const basicButtons = gsap.utils.toArray('.btn-basic-1-219, .btn-basic-2-219, .btn-basic-3-219')
  basicButtons.forEach((btn, i) => {
    const fill = btn.querySelector('.liquid-fill-219')
    
    gsap.fromTo(btn.querySelector('.btn-text-219'),
      {
        opacity: 0,
        y: 10
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: btn,
          start: 'top 85%',
          end: 'top 70%',
          scrub: 1
        }
      }
    )

    if (fill) {
      gsap.fromTo(fill,
        {
          width: '0%'
        },
        {
          width: '100%',
          duration: 1.5,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: btn,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1
          }
        }
      )

      // 滚动控制液体流动
      gsap.to(fill, {
        x: i * 30 - 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.liquid-buttons-container-219',
          start: 'top 60%',
          end: 'bottom 30%',
          scrub: 1
        }
      })
    }
  })

  // 渐变液体按钮 - 滚动控制
  const gradientButtons = gsap.utils.toArray('.btn-gradient-1-219, .btn-gradient-2-219, .btn-gradient-3-219')
  gradientButtons.forEach((btn, i) => {
    const gradient = btn.querySelector('.liquid-gradient-219')
    
    gsap.fromTo(gradient,
      {
        scale: 0,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: btn,
          start: 'top 80%',
          end: 'top 60%',
          scrub: 1
        }
      }
    )

    if (gradient) {
      // 滚动控制渐变流动
      gsap.to(gradient, {
        backgroundPosition: '200% center',
        ease: 'none',
        scrollTrigger: {
          trigger: '.liquid-buttons-container-219',
          start: 'top 50%',
          end: 'bottom 20%',
          scrub: 1
        }
      })
    }
  })

  // 涟漪按钮 - 滚动控制
  const rippleButtons = gsap.utils.toArray('.btn-ripple-1-219, .btn-ripple-2-219, .btn-ripple-3-219')
  rippleButtons.forEach((btn, i) => {
    const ripples = btn.querySelectorAll('.ripple-effect-219')
    
    gsap.fromTo(btn.querySelector('.btn-text-219'),
      {
        opacity: 0,
        scale: 0.8
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: btn,
          start: 'top 85%',
          end: 'top 70%',
          scrub: 1
        }
      }
    )

    ripples.forEach((ripple, j) => {
      gsap.fromTo(ripple,
        {
          scale: 0,
          opacity: 1
        },
        {
          scale: 2.5,
          opacity: 0,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: btn,
            start: 'top 75%',
            end: 'top 40%',
            scrub: 1
          }
        }
      )
    })
  })

  // 液体形状按钮 - 滚动控制
  const shapeButtons = gsap.utils.toArray('.btn-shape-1-219, .btn-shape-2-219, .btn-shape-3-219')
  shapeButtons.forEach((btn, i) => {
    const shape = btn.querySelector('.shape-liquid-219')
    
    gsap.fromTo(btn.querySelector('.btn-text-219'),
      {
        opacity: 0,
        y: 10
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: btn,
          start: 'top 85%',
          end: 'top 70%',
          scrub: 1
        }
      }
    )

    if (shape) {
      gsap.fromTo(shape,
        {
          scale: 0,
          rotate: i * 90 - 45
        },
        {
          scale: 1,
          rotate: 0,
          duration: 1,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: btn,
            start: 'top 80%',
            end: 'top 60%',
            scrub: 1
          }
        }
      )

      // 滚动控制形状变形
      gsap.to(shape, {
        borderRadius: i === 0 ? '50%' : i === 1 ? '0%' : '30% 70% 70% 30% / 30% 30% 70% 70%',
        rotate: i * 180,
        ease: 'none',
        scrollTrigger: {
          trigger: '.liquid-buttons-container-219',
          start: 'top 50%',
          end: 'bottom 20%',
          scrub: 1
        }
      })
    }
  })

  // 粘性液体按钮 - 滚动控制
  const gooeyButtons = gsap.utils.toArray('.btn-gooey-1-219, .btn-gooey-2-219, .btn-gooey-3-219')
  gooeyButtons.forEach((btn, i) => {
    const gooey = btn.querySelector('.gooey-liquid-219')
    
    gsap.fromTo(btn.querySelector('.btn-text-219'),
      {
        opacity: 0,
        scale: 0.9
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: btn,
          start: 'top 85%',
          end: 'top 70%',
          scrub: 1
        }
      }
    )

    if (gooey) {
      gsap.fromTo(gooey,
        {
          scaleY: 0,
          scaleX: 2
        },
        {
          scaleY: 1,
          scaleX: 1,
          duration: 1.2,
          ease: 'elastic.out(1, 0.6)',
          scrollTrigger: {
            trigger: btn,
            start: 'top 80%',
            end: 'top 60%',
            scrub: 1
          }
        }
      )

      // 滚动控制粘性拉伸
      gsap.to(gooey, {
        scaleY: 0.8,
        scaleX: 1.2,
        ease: 'none',
        scrollTrigger: {
          trigger: '.liquid-buttons-container-219',
          start: 'top 50%',
          end: 'bottom 20%',
          scrub: 1
        }
      })
    }
  })

  // 液体加载按钮 - 滚动控制
  const loadButtons = gsap.utils.toArray('.btn-load-1-219, .btn-load-2-219, .btn-load-3-219')
  loadButtons.forEach((btn, i) => {
    const progress = btn.querySelector('.liquid-progress-219')
    const waves = btn.querySelectorAll('.loading-wave-219')
    const droplet = btn.querySelector('.droplet-219')
    
    if (progress) {
      gsap.fromTo(progress,
        {
          width: '0%'
        },
        {
          width: '100%',
          duration: 2,
          ease: 'none',
          scrollTrigger: {
            trigger: btn,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1
          }
        }
      )
    }

    waves.forEach((wave, j) => {
      gsap.to(wave, {
        x: j * 50,
        ease: 'none',
        scrollTrigger: {
          trigger: btn,
          start: 'top 70%',
          end: 'top 30%',
          scrub: 1
        }
      })
    })

    if (droplet && i === 2) {
      gsap.to(droplet, {
        y: -30,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: btn,
          start: 'top 70%',
          end: 'top 30%',
          scrub: 1
        }
      })
    }
  })

  // 悬停液体按钮 - 滚动控制
  const hoverButtons = gsap.utils.toArray('.btn-hover-1-219, .btn-hover-2-219, .btn-hover-3-219')
  hoverButtons.forEach((btn, i) => {
    const hover = btn.querySelector('.hover-liquid-219')
    
    gsap.fromTo(btn.querySelector('.btn-text-219'),
      {
        opacity: 0,
        y: 10
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: btn,
          start: 'top 85%',
          end: 'top 70%',
          scrub: 1
        }
      }
    )

    if (hover) {
      gsap.fromTo(hover,
        {
          scale: 0,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: btn,
            start: 'top 80%',
            end: 'top 60%',
            scrub: 1
          }
        }
      )
    }
  })
}

function initInteractiveLiquid() {
  if (!liquidCanvas.value || !interactiveBtn.value) return
  
  const canvas = liquidCanvas.value
  const btn = interactiveBtn.value
  
  ctx = canvas.getContext('2d')
  
  const resize = () => {
    canvas.width = btn.offsetWidth
    canvas.height = btn.offsetHeight
  }
  
  resize()
  window.addEventListener('resize', resize)
  
  // 鼠标移动事件
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect()
    targetX = e.clientX - rect.left
    targetY = e.clientY - rect.top
  })
  
  btn.addEventListener('mouseleave', () => {
    targetX = canvas.width / 2
    targetY = canvas.height / 2
  })
  
  mouseX = canvas.width / 2
  mouseY = canvas.height / 2
  
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // 平滑跟随
    mouseX += (targetX - mouseX) * 0.1
    mouseY += (targetY - mouseY) * 0.1
    
    // 绘制液体效果
    const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 100)
    gradient.addColorStop(0, 'rgba(79, 172, 254, 0.4)')
    gradient.addColorStop(0.5, 'rgba(0, 242, 254, 0.2)')
    gradient.addColorStop(1, 'rgba(79, 172, 254, 0)')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // 绘制液滴
    ctx.beginPath()
    ctx.arc(mouseX, mouseY, 10, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(79, 172, 254, 0.6)'
    ctx.fill()
    
    // 绘制波纹
    const time = Date.now() / 1000
    for (let i = 0; i < 3; i++) {
      const radius = 15 + i * 15 + Math.sin(time * 2 + i) * 5
      ctx.beginPath()
      ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(79, 172, 254, ${0.3 - i * 0.1})`
      ctx.lineWidth = 2
      ctx.stroke()
    }
    
    animationFrame = requestAnimationFrame(animate)
  }
  
  animate()
}
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.liquid-buttons-container-219 {
  min-height: 100vh;
  background: linear-gradient(180deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%);
  padding: 40px 20px;
  overflow-x: hidden;

  opacity: 1 !important;}

.liquid-header-219 {
  text-align: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.liquid-title-219 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.liquid-subtitle-219 {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 30px;

  opacity: 1 !important;}

.scroll-progress-219 {
  width: 300px;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.progress-bar-219 {
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, #00d2ff, #3a7bd5, #00d2ff);
  border-radius: 4px;

  opacity: 1 !important;}

.progress-text-219 {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.9rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);

  opacity: 1 !important;}

/* 液体区块 */
.liquid-section-219 {
  max-width: 1200px;
  margin: 0 auto 60px;

  opacity: 1 !important;}

.section-title-219 {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 30px;
  text-align: center;

  opacity: 1 !important;}

.buttons-row-219 {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

/* 基础液体按钮 */
.liquid-btn-219 {
  position: relative;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: transform 0.3s, box-shadow 0.3s;

  opacity: 1 !important;}

.liquid-btn-219:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 210, 255, 0.3);
}

.liquid-btn-219 .btn-text-219 {
  position: relative;
  z-index: 2;
}

.liquid-fill-219 {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #00d2ff, #3a7bd5);
  z-index: 1;
  transition: width 0.3s ease;

  opacity: 1 !important;}

.btn-basic-1-219 .liquid-fill-219 {
  background: linear-gradient(90deg, #00d2ff, #3a7bd5);

  opacity: 1 !important;}

.btn-basic-2-219 .liquid-fill-219 {
  background: linear-gradient(90deg, #a8edea, #fed6e3);

  opacity: 1 !important;}

.btn-basic-3-219 .liquid-fill-219 {
  background: linear-gradient(90deg, #667eea, #764ba2);

  opacity: 1 !important;}

/* 渐变液体按钮 */
.btn-gradient-1-219,
.btn-gradient-2-219,
.btn-gradient-3-219 {
  border: 2px solid transparent;
  background-clip: padding-box;

  opacity: 1 !important;}

.liquid-gradient-219 {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(90deg, #00d2ff, #3a7bd5, #00d2ff);
  background-size: 200% 100%;
  z-index: -1;
  border-radius: 52px;

  opacity: 1 !important;}

.btn-gradient-2-219 .liquid-gradient-219 {
  background: linear-gradient(90deg, #ff9a9e, #fecfef, #ff9a9e);
  background-size: 200% 100%;

  opacity: 1 !important;}

.btn-gradient-3-219 .liquid-gradient-219 {
  background: linear-gradient(90deg, #a18cd1, #fbc2eb, #a18cd1);
  background-size: 200% 100%;

  opacity: 1 !important;}

/* 涟漪按钮 */
.ripple-btn-219 {
  position: relative;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.ripple-btn-219 .btn-text-219 {
  position: relative;
  z-index: 2;
}

.ripple-effect-219 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(0, 210, 255, 0.3);
  z-index: 1;

  opacity: 1 !important;}

.ripple-delay-219 {
  animation-delay: 0.3s;
}

.ripple-delay-2-219 {
  animation-delay: 0.6s;
}

/* 液体形状按钮 */
.shape-liquid-btn-219 {
  position: relative;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.shape-liquid-btn-219 .btn-text-219 {
  position: relative;
  z-index: 2;
}

.shape-liquid-219 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  z-index: 1;
  opacity: 0.8;
}

/* 粘性液体按钮 */
.gooey-btn-219 {
  position: relative;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.gooey-btn-219 .btn-text-219 {
  position: relative;
  z-index: 2;
}

.gooey-liquid-219 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  border-radius: 50%;
  z-index: 1;

  opacity: 1 !important;}

.btn-gooey-2-219 .gooey-liquid-219 {
  background: linear-gradient(135deg, #fa709a, #fee140);

  opacity: 1 !important;}

.btn-gooey-3-219 .gooey-liquid-219 {
  background: linear-gradient(135deg, #434343, #000000);

  opacity: 1 !important;}

/* 液体加载按钮 */
.load-btn-219 {
  position: relative;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.load-btn-219 .btn-text-219 {
  position: relative;
  z-index: 2;
}

.liquid-progress-219 {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  width: 0%;
  background: linear-gradient(90deg, #00d2ff, #3a7bd5);
  z-index: 1;

  opacity: 1 !important;}

.loading-wave-219 {
  position: absolute;
  bottom: 0;
  left: -50px;
  width: 100px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  z-index: 1;

  opacity: 1 !important;}

.wave-offset-219 {
  animation-delay: 0.5s;
}

.droplet-219 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: #00d2ff;
  border-radius: 50%;
  z-index: 1;

  opacity: 1 !important;}

/* 悬停液体按钮 */
.hover-btn-219 {
  position: relative;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.hover-btn-219 .btn-text-219 {
  position: relative;
  z-index: 2;
}

.hover-liquid-219 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.hover-btn-219:hover .hover-liquid-219 {
  opacity: 1;
}

.btn-hover-2-219 .hover-liquid-219 {
  background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), #00d2ff, transparent);

  opacity: 1 !important;}

.btn-hover-3-219 .hover-liquid-219 {
  background: linear-gradient(45deg, #00d2ff, #3a7bd5, #00d2ff);
  background-size: 200% 200%;

  opacity: 1 !important;}

/* 交互液体按钮 */
.liquid-interactive-219 {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;

  opacity: 1 !important;}

.interactive-wrapper-219 {
  display: flex;
  justify-content: center;
}

.interactive-liquid-btn-219 {
  position: relative;
  padding: 20px 60px;
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(0, 210, 255, 0.3);

  opacity: 1 !important;}

.interactive-liquid-btn-219 .btn-text-219 {
  position: relative;
  z-index: 2;
}

.liquid-canvas-219 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  border-radius: 48px;

  opacity: 1 !important;}

/* 响应式 */
@media (max-width: 768px) {
  .liquid-title-219 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .buttons-row-219 {
    gap: 15px;
  }

  .liquid-btn-219,
  .ripple-btn-219,
  .shape-liquid-btn-219,
  .gooey-btn-219,
  .load-btn-219,
  .hover-btn-219 {
    padding: 12px 30px;
    font-size: 1rem;
  
  opacity: 1 !important;}

  .interactive-liquid-btn-219 {
    padding: 15px 40px;
    font-size: 1rem;
  
  opacity: 1 !important;}
}
</style>
