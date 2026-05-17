<template>
  <section class="spf-scroll-paper-fold-217">
    <div class="spf-container-217">
      <div class="spf-header-217">
        <h2 class="spf-title-217">纸张折叠</h2>
        <p class="spf-subtitle-217">Paper Fold Animation</p>
      </div>

      <div class="spf-paper-wrapper-217">
        <div class="spf-paper-217" ref="paperRef">
          <!-- 纸张表面纹理 -->
          <div class="spf-paper-texture-217"></div>
          
          <!-- 折叠线 -->
          <div class="spf-fold-line-217 spf-fold-horizontal-1-217"></div>
          <div class="spf-fold-line-217 spf-fold-horizontal-2-217"></div>
          <div class="spf-fold-line-217 spf-fold-vertical-1-217"></div>
          <div class="spf-fold-line-217 spf-fold-vertical-2-217"></div>
          
          <!-- 纸张折角 - 四个角 -->
          <div class="spf-corner-217 spf-corner-tl-217" ref="cornerTL">
            <div class="spf-corner-inner-217">
              <div class="spf-corner-front-217"></div>
              <div class="spf-corner-back-217"></div>
            </div>
          </div>
          <div class="spf-corner-217 spf-corner-tr-217" ref="cornerTR">
            <div class="spf-corner-inner-217">
              <div class="spf-corner-front-217"></div>
              <div class="spf-corner-back-217"></div>
            </div>
          </div>
          <div class="spf-corner-217 spf-corner-bl-217" ref="cornerBL">
            <div class="spf-corner-inner-217">
              <div class="spf-corner-front-217"></div>
              <div class="spf-corner-back-217"></div>
            </div>
          </div>
          <div class="spf-corner-217 spf-corner-br-217" ref="cornerBR">
            <div class="spf-corner-inner-217">
              <div class="spf-corner-front-217"></div>
              <div class="spf-corner-back-217"></div>
            </div>
          </div>

          <!-- 纸张内容 -->
          <div class="spf-paper-content-217">
            <div class="spf-content-section-217" ref="section1">
              <h3>折叠艺术</h3>
              <p>Folding Art</p>
            </div>
            <div class="spf-content-section-217" ref="section2">
              <h3>物理质感</h3>
              <p>Physical Texture</p>
            </div>
            <div class="spf-content-section-217" ref="section3">
              <h3>自然流动</h3>
              <p>Natural Flow</p>
            </div>
            <div class="spf-content-section-217" ref="section4">
              <h3>精细动画</h3>
              <p>Fine Animation</p>
            </div>
          </div>

          <!-- 阴影层 -->
          <div class="spf-shadow-layer-217"></div>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="spf-controls-217">
        <button class="spf-btn-217" @click="foldAll">全部折叠</button>
        <button class="spf-btn-217" @click="unfoldAll">全部展开</button>
        <button class="spf-btn-217" @click="foldRandom">随机折叠</button>
      </div>

      <!-- 状态指示器 -->
      <div class="spf-status-217">
        <div class="spf-status-item-217">
          <span class="spf-status-label-217">折叠深度</span>
          <span class="spf-status-value-217" id="spf-fold-depth-217">0%</span>
        </div>
        <div class="spf-status-item-217">
          <span class="spf-status-label-217">纸张张力</span>
          <span class="spf-status-value-217" id="spf-tension-217">0%</span>
        </div>
      </div>
    </div>

    <!-- 背景粒子 -->
    <div class="spf-particles-217" id="spf-particles-217"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const paperRef = ref<HTMLElement | null>(null)
const cornerTL = ref<HTMLElement | null>(null)
const cornerTR = ref<HTMLElement | null>(null)
const cornerBL = ref<HTMLElement | null>(null)
const cornerBR = ref<HTMLElement | null>(null)
const section1 = ref<HTMLElement | null>(null)
const section2 = ref<HTMLElement | null>(null)
const section3 = ref<HTMLElement | null>(null)
const section4 = ref<HTMLElement | null>(null)

let ctx: gsap.Context

// 创建背景粒子
const createParticles = () => {
  const container = document.getElementById('spf-particles-217')
  if (!container) return

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div')
    particle.className = 'spf-particle-217'
    particle.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${2 + Math.random() * 3}px;
      height: ${2 + Math.random() * 3}px;
      background: rgba(255, 255, 255, ${0.1 + Math.random() * 0.2});
      border-radius: 50%;
    `
    container.appendChild(particle)

    gsap.to(particle, {
      y: -100 - Math.random() * 100,
      x: (Math.random() - 0.5) * 50,
      opacity: 0,
      duration: 3 + Math.random() * 2,
      repeat: -1,
      delay: Math.random() * 2
    })
  }
}

// 初始化折叠动画
const initFoldAnimations = () => {
  const corners = [cornerTL.value, cornerTR.value, cornerBL.value, cornerBR.value]
  const sections = [section1.value, section2.value, section3.value, section4.value]

  corners.forEach((corner, index) => {
    if (!corner) return

    const inner = corner.querySelector('.spf-corner-inner-217') as HTMLElement
    const front = corner.querySelector('.spf-corner-front-217') as HTMLElement
    const back = corner.querySelector('.spf-corner-back-217') as HTMLElement

    // 初始状态 - 角略微上翘
    gsap.set(inner, { rotateX: 0, rotateY: 0 })
    gsap.set(back, { opacity: 0 })

    // 滚动折叠动画 - 每个角依次折叠
    gsap.to(inner, {
      scrollTrigger: {
        trigger: paperRef.value,
        start: 'top 70%',
        end: 'bottom 20%',
        scrub: 2
      },
      rotateX: index < 2 ? -45 : 45,
      rotateY: index % 2 === 0 ? 45 : -45,
      scale: 0.9,
      ease: 'power2.inOut'
    })

    // 背面淡入
    gsap.to(back, {
      scrollTrigger: {
        trigger: paperRef.value,
        start: 'top 60%',
        end: 'bottom 30%',
        scrub: 2
      },
      opacity: 0.8,
      ease: 'power2.inOut'
    })

    // 悬停效果
    corner.addEventListener('mouseenter', () => {
      gsap.to(inner, {
        rotateX: -60,
        rotateY: 60,
        scale: 0.85,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      })
      gsap.to(back, {
        opacity: 1,
        duration: 0.3
      })
    })

    corner.addEventListener('mouseleave', () => {
      gsap.to(inner, {
        rotateX: index < 2 ? -45 : 45,
        rotateY: index % 2 === 0 ? 45 : -45,
        scale: 0.9,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      })
    })
  })

  // 内容区域动画
  sections.forEach((section, index) => {
    if (!section) return

    gsap.fromTo(section,
      {
        y: 50,
        opacity: 0,
        rotateX: 20
      },
      {
        scrollTrigger: {
          trigger: paperRef.value,
          start: `top ${70 - index * 10}%`,
          end: `bottom ${40 - index * 5}%`,
          scrub: 1.5
        },
        y: 0,
        opacity: 1,
        rotateX: 0,
        ease: 'power3.out'
      }
    )
  })

  // 折叠线动画
  gsap.fromTo('.spf-fold-line-217',
    { opacity: 0, scale: 0 },
    {
      scrollTrigger: {
        trigger: paperRef.value,
        start: 'top 65%',
        end: 'top 35%',
        scrub: 1
      },
      opacity: 1,
      scale: 1,
      stagger: 0.2,
      ease: 'power2.out'
    }
  )

  // 纸张整体变形
  gsap.fromTo(paperRef.value,
    {
      scale: 0.8,
      rotateX: 10,
      rotateY: -10,
      filter: 'blur(10px)'
    },
    {
      scrollTrigger: {
        trigger: paperRef.value,
        start: 'top 80%',
        end: 'top 40%',
        scrub: 1.5
      },
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      filter: 'blur(0px)',
      ease: 'power3.out'
    }
  )

  // 纸张浮动效果
  gsap.to(paperRef.value, {
    y: -20,
    rotateX: 5,
    rotateY: 5,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })

  // 更新状态指示器
  gsap.to('#spf-fold-depth-217', {
    scrollTrigger: {
      trigger: paperRef.value,
      start: 'top 70%',
      end: 'bottom 20%',
      scrub: 0.5,
      onUpdate: (self) => {
        const depth = Math.round(self.progress * 100)
        const el = document.getElementById('spf-fold-depth-217')
        if (el) el.textContent = `${depth}%`
      }
    }
  })

  gsap.to('#spf-tension-217', {
    scrollTrigger: {
      trigger: paperRef.value,
      start: 'top 70%',
      end: 'bottom 20%',
      scrub: 0.5,
      onUpdate: (self) => {
        const tension = Math.round(Math.sin(self.progress * Math.PI) * 100)
        const el = document.getElementById('spf-tension-217')
        if (el) el.textContent = `${Math.abs(tension)}%`
      }
    }
  })
}

// 全部折叠
const foldAll = () => {
  const corners = gsap.utils.toArray('.spf-corner-inner-217')
  gsap.to(corners, {
    rotateX: -90,
    rotateY: 90,
    scale: 0.7,
    duration: 1,
    stagger: 0.1,
    ease: 'elastic.out(1, 0.6)'
  })

  const backs = gsap.utils.toArray('.spf-corner-back-217')
  gsap.to(backs, {
    opacity: 1,
    duration: 0.5
  })
}

// 全部展开
const unfoldAll = () => {
  const corners = gsap.utils.toArray('.spf-corner-inner-217')
  gsap.to(corners, {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    duration: 1,
    stagger: 0.1,
    ease: 'elastic.out(1, 0.6)'
  })

  const backs = gsap.utils.toArray('.spf-corner-back-217')
  gsap.to(backs, {
    opacity: 0,
    duration: 0.5
  })
}

// 随机折叠
const foldRandom = () => {
  const corners = gsap.utils.toArray('.spf-corner-inner-217')
  corners.forEach((corner: any) => {
    const randomX = (Math.random() - 0.5) * 180
    const randomY = (Math.random() - 0.5) * 180
    const randomScale = 0.7 + Math.random() * 0.3
    gsap.to(corner, {
      rotateX: randomX,
      rotateY: randomY,
      scale: randomScale,
      duration: 1.2,
      ease: 'elastic.out(1, 0.5)'
    })
  })
}

// 标题入场动画
const initTitleAnimation = () => {
  gsap.from('.spf-title-217', {
    scrollTrigger: {
      trigger: '.spf-header-217',
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    },
    y: -80,
    opacity: 0,
    rotateX: 30,
    duration: 1.2,
    ease: 'back.out(1.7)'
  })

  gsap.from('.spf-subtitle-217', {
    scrollTrigger: {
      trigger: '.spf-header-217',
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    },
    y: -40,
    opacity: 0,
    duration: 1,
    delay: 0.2,
    ease: 'power3.out'
  })
}

// 按钮入场动画
const initControlsAnimation = () => {
  gsap.from('.spf-btn-217', {
    scrollTrigger: {
      trigger: '.spf-controls-217',
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    scale: 0.8,
    duration: 0.8,
    stagger: 0.1,
    ease: 'back.out(1.7)'
  })
}

onMounted(() => {
  ctx = gsap.context(() => {
    createParticles()
    initTitleAnimation()
    initFoldAnimations()
    initControlsAnimation()
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.spf-scroll-paper-fold-217 {
  min-height: 100vh;
  padding: 80px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 30%, #0f0f2a 60%, #1e1e3e 100%);
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
      radial-gradient(circle at 30% 20%, rgba(251, 191, 36, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, rgba(251, 146, 60, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.05) 0%, transparent 60%);
    pointer-events: none;
    animation: bg-pulse 8s ease-in-out infinite;
  
  opacity: 1 !important;}
}

@keyframes bg-pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

.spf-container-217 {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.spf-header-217 {
  text-align: center;
  margin-bottom: 80px;

  opacity: 1 !important;}

.spf-title-217 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #fbbf24, #fb923c, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 60px rgba(251, 191, 36, 0.4);
  transform-style: preserve-3d;

  opacity: 1 !important;}

.spf-subtitle-217 {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.3em;
  text-transform: uppercase;

  opacity: 1 !important;}

.spf-paper-wrapper-217 {
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 2000px;
  margin: 100px 0;
  position: relative;

  opacity: 1 !important;}

.spf-paper-217 {
  width: 100%;
  max-width: 600px;
  height: 600px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fef9c3 100%);
  border-radius: 8px;
  position: relative;
  transform-style: preserve-3d;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(251, 191, 36, 0.2),
    inset 0 0 100px rgba(251, 191, 36, 0.1);

  opacity: 1 !important;}

.spf-paper-texture-217 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(251, 191, 36, 0.03) 2px,
      rgba(251, 191, 36, 0.03) 4px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(251, 191, 36, 0.03) 2px,
      rgba(251, 191, 36, 0.03) 4px
    );
  pointer-events: none;
  opacity: 0.5;
}

.spf-fold-line-217 {
  position: absolute;
  background: rgba(0, 0, 0, 0.1);
  transform-style: preserve-3d;

  opacity: 1 !important;}

.spf-fold-horizontal-1-217 {
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  transform-origin: center;

  opacity: 1 !important;}

.spf-fold-horizontal-2-217 {
  top: 25%;
  left: 0;
  right: 0;
  height: 2px;
  transform-origin: center;

  opacity: 1 !important;}

.spf-fold-vertical-1-217 {
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  transform-origin: center;

  opacity: 1 !important;}

.spf-fold-vertical-2-217 {
  left: 25%;
  top: 0;
  bottom: 0;
  width: 2px;
  transform-origin: center;

  opacity: 1 !important;}

.spf-corner-217 {
  position: absolute;
  width: 120px;
  height: 120px;
  transform-style: preserve-3d;
  cursor: pointer;

  opacity: 1 !important;}

.spf-corner-tl-217 {
  top: 0;
  left: 0;
  transform-origin: right bottom;
}

.spf-corner-tr-217 {
  top: 0;
  right: 0;
  transform-origin: left bottom;
}

.spf-corner-bl-217 {
  bottom: 0;
  left: 0;
  transform-origin: right top;
}

.spf-corner-br-217 {
  bottom: 0;
  right: 0;
  transform-origin: left top;
}

.spf-corner-inner-217 {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  opacity: 1 !important;}

.spf-corner-front-217,
.spf-corner-back-217 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 8px 0 0 0;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  backface-visibility: hidden;

  opacity: 1 !important;}

.spf-corner-back-217 {
  background: linear-gradient(135deg, #fde68a 0%, #fef3c7 100%);
  border-radius: 0 8px 0 0;
  transform: rotateY(180deg);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.spf-corner-bl .spf-corner-front-217,
.spf-corner-bl .spf-corner-back-217 {
  border-radius: 0 0 0 8px;
}

.spf-corner-bl .spf-corner-back-217 {
  border-radius: 0 0 8px 0;
}

.spf-corner-tr .spf-corner-front-217,
.spf-corner-tr .spf-corner-back-217 {
  border-radius: 0 8px 0 0;
}

.spf-corner-tr .spf-corner-back-217 {
  border-radius: 8px 0 0 0;
}

.spf-corner-br .spf-corner-front-217,
.spf-corner-br .spf-corner-back-217 {
  border-radius: 0 0 8px 0;
}

.spf-corner-br .spf-corner-back-217 {
  border-radius: 0 0 0 8px;
}

.spf-paper-content-217 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  padding: 40px;
  transform-style: preserve-3d;
  z-index: 2;

  opacity: 1 !important;}

.spf-content-section-217 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #92400e;

  opacity: 1 !important;}

.spf-content-section-217 h3 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.spf-content-section-217 p {
  font-size: 1rem;
  opacity: 0.7;
  letter-spacing: 0.1em;
}

.spf-shadow-layer-217 {
  position: absolute;
  bottom: -30px;
  left: 10%;
  right: 10%;
  height: 20px;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.3) 0%, transparent 70%);
  filter: blur(10px);
  transform: scale(0.8);

  opacity: 1 !important;}

.spf-controls-217 {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 60px 0;
  flex-wrap: wrap;

  opacity: 1 !important;}

.spf-btn-217 {
  padding: 14px 32px;
  background: linear-gradient(135deg, #fbbf24, #fb923c);
  color: #fff;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow:
    0 5px 20px rgba(251, 191, 36, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  text-transform: uppercase;
  letter-spacing: 0.1em;

  opacity: 1 !important;}

.spf-btn-217:hover {
  transform: translateY(-3px);
  box-shadow:
    0 8px 30px rgba(251, 191, 36, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.spf-btn-217:active {
  transform: translateY(0);
}

.spf-status-217 {
  display: flex;
  justify-content: center;
  gap: 80px;
  margin-top: 40px;
}

.spf-status-item-217 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.spf-status-label-217 {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.1em;

  opacity: 1 !important;}

.spf-status-value-217 {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #fbbf24, #fb923c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.spf-particles-217 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  opacity: 1 !important;}

.spf-particle-217 {
  position: absolute;
}

@media (max-width: 768px) {
  .spf-paper-217 {
    width: 90vw;
    height: 90vw;
    max-width: 400px;
    max-height: 400px;
  
  opacity: 1 !important;}

  .spf-corner-217 {
    width: 80px;
    height: 80px;
  
  opacity: 1 !important;}

  .spf-content-section-217 h3 {
    font-size: 1.2rem;
  }

  .spf-content-section-217 p {
    font-size: 0.8rem;
  }

  .spf-controls-217 {
    flex-direction: column;
    align-items: center;
  }

  .spf-status-217 {
    gap: 40px;
  }

  .spf-status-value-217 {
    font-size: 1.5rem;
  
  opacity: 1 !important;}

  .spf-title-217 {
    margin-bottom: 40px;
  }
}
</style>
