<template>
  <section class="text-justify-section-221">
    <div class="container">
      <div class="title-wrapper-221">
        <h2 class="section-title-221">
          <span class="title-text-221">文字对齐</span>
          <span class="title-subtitle-221">Text Alignment</span>
        </h2>
        <p class="description-221">
          文字从左对齐优雅过渡到居中对齐，再到右对齐
        </p>
      </div>

      <!-- 对齐状态指示器 -->
      <div class="alignment-indicator-221" ref="indicator">
        <div class="indicator-track-221">
          <div class="indicator-pointer-221" ref="pointer"></div>
        </div>
        <div class="alignment-labels-221">
          <span class="align-label-221" :class="{ active: currentAlignment === 'left' }">左对齐</span>
          <span class="align-label-221" :class="{ active: currentAlignment === 'center' }">居中</span>
          <span class="align-label-221" :class="{ active: currentAlignment === 'right' }">右对齐</span>
        </div>
      </div>

      <!-- 对齐演示区域 -->
      <div class="justify-container-221">
        <div 
          v-for="(item, index) in justifyItems" 
          :key="index"
          class="justify-item-221"
          :class="`justify-item-221-${index}`"
        >
          <div class="justify-header-221">
            <h3 class="justify-title-221">{{ item.title }}</h3>
            <div class="justify-icon-221" :class="`justify-icon-221-${index}`">
              {{ item.icon }}
            </div>
          </div>
          
          <div 
            class="justify-content-221"
            :class="`justify-content-221-${index}`"
            ref="justifyContentRef"
          >
            <p class="justify-text-221">{{ item.text }}</p>
            
            <div class="justify-visual-221" :class="`justify-visual-221-${index}`">
              <div 
                v-for="n in 5" 
                :key="n"
                class="visual-line-221"
                :style="{ width: `${60 + n * 10}%` }"
              ></div>
            </div>

            <div class="justify-footer-221">
              <button class="justify-btn-221" :class="`justify-btn-221-${index}`">
                <span class="btn-icon-221">⚡</span>
                <span class="btn-text-221">切换对齐</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 对齐预览卡片 -->
      <div class="alignment-preview-221">
        <div class="preview-label-221">实时预览</div>
        <div class="preview-card-221" ref="previewCard">
          <p class="preview-text-221" ref="previewText">
            文字对齐是排版设计中非常重要的元素，它影响视觉层次和阅读体验。
          </p>
          <div class="preview-visual-221">
            <div class="visual-dot-221"></div>
            <div class="visual-line-preview-221"></div>
            <div class="visual-dot-221"></div>
          </div>
        </div>
      </div>

      <!-- 粒子背景 -->
      <canvas class="justify-particles-221" ref="particlesCanvas"></canvas>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const particlesCanvas = ref(null)
const indicator = ref(null)
const pointer = ref(null)
const previewCard = ref(null)
const previewText = ref(null)
const justifyContentRef = ref([])
let ctx = null
let particles = []
let animationFrame = null

const currentAlignment = ref('left')

const justifyItems = [
  {
    title: '左对齐',
    icon: '◀',
    text: '左对齐是最常见的文本对齐方式，适用于大量文字阅读。它提供了自然的阅读节奏，让读者可以轻松地从左到右扫描文本。左对齐的文本在左侧形成一条垂直的参考线，创造了视觉上的稳定感和连贯性。'
  },
  {
    title: '居中对齐',
    icon: '⬇',
    text: '居中对齐常用于标题、标语和强调性文本。它能够吸引读者的注意力，创造视觉焦点。居中对齐的文本在中心位置平衡分布，适合用于需要突出显示重要信息或创造对称美感的场合。'
  },
  {
    title: '右对齐',
    icon: '▶',
    text: '右对齐适合用于与左对齐元素对比的情况，或者在特定设计风格中使用。它在右侧形成垂直参考线，可以用于创造不对称的视觉平衡。右对齐常用于设计感强烈的布局或特殊的设计需求。'
  }
]

// 创建粒子
function createParticles() {
  particles = []
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: (Math.random() - 0.5) * 0.8,
      opacity: Math.random() * 0.6 + 0.2,
      hue: Math.random() * 60 + 280
    })
  }
}

// 绘制粒子
function drawParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  
  particles.forEach(particle => {
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${particle.hue}, 80%, 60%, ${particle.opacity})`
    ctx.fill()
    
    particle.x += particle.speedX
    particle.y += particle.speedY
    
    if (particle.x < 0) particle.x = window.innerWidth
    if (particle.x > window.innerWidth) particle.x = 0
    if (particle.y < 0) particle.y = window.innerHeight
    if (particle.y > window.innerHeight) particle.y = 0
  })
  
  animationFrame = requestAnimationFrame(drawParticles)
}

onMounted(() => {
  // 初始化粒子
  if (particlesCanvas.value) {
    particlesCanvas.value.width = window.innerWidth
    particlesCanvas.value.height = window.innerHeight
    ctx = particlesCanvas.value.getContext('2d')
    createParticles()
    drawParticles()
  }

  // 标题入场
  gsap.fromTo(
    '.title-wrapper-221',
    {
      y: -50,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      scrollTrigger: {
        trigger: '.text-justify-section-221',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    }
  )

  // 指示器入场
  gsap.fromTo(
    indicator.value,
    {
      y: 30,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      scrollTrigger: {
        trigger: indicator.value,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      }
    }
  )

  // 对齐动画
  justifyItems.forEach((item, index) => {
    const content = justifyContentRef.value[index]
    
    // 入场动画
    gsap.fromTo(
      `.justify-item-221-${index}`,
      {
        y: 80,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: index * 0.15,
        scrollTrigger: {
          trigger: `.justify-item-221-${index}`,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // 图标动画
    gsap.fromTo(
      `.justify-icon-221-${index}`,
      {
        scale: 0,
        rotation: -180
      },
      {
        scale: 1,
        rotation: 0,
        duration: 0.6,
        delay: index * 0.15 + 0.3,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: `.justify-item-221-${index}`,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // 视觉线条动画
    gsap.fromTo(
      `.justify-visual-221-${index} .visual-line-221`,
      {
        width: 0,
        opacity: 0
      },
      {
        width: (i) => 60 + (i + 1) * 10 + '%',
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        delay: index * 0.15 + 0.5,
        scrollTrigger: {
          trigger: `.justify-item-221-${index}`,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // 滚动触发对齐变化
    ScrollTrigger.create({
      trigger: content,
      start: 'top 60%',
      end: 'bottom 40%',
      onUpdate: (self) => {
        if (self.progress < 0.33) {
          currentAlignment.value = 'left'
          gsap.to(content, {
            textAlign: 'left',
            duration: 0.3
          })
        } else if (self.progress < 0.66) {
          currentAlignment.value = 'center'
          gsap.to(content, {
            textAlign: 'center',
            duration: 0.3
          })
        } else {
          currentAlignment.value = 'right'
          gsap.to(content, {
            textAlign: 'right',
            duration: 0.3
          })
        }
      }
    })

    // 按钮点击切换对齐
    const btn = content.querySelector('.justify-btn-221')
    if (btn) {
      btn.addEventListener('click', () => {
        const alignments = ['left', 'center', 'right']
        const currentIndex = alignments.indexOf(currentAlignment.value)
        const nextIndex = (currentIndex + 1) % alignments.length
        currentAlignment.value = alignments[nextIndex]
        
        gsap.to(content, {
          textAlign: currentAlignment.value,
          duration: 0.5,
          ease: 'power2.out'
        })
      })
    }
  })

  // 指示器指针动画
  gsap.to(pointer.value, {
    left: ['0%', '50%', '100%'],
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: '.justify-container-221',
      start: 'top 60%',
      end: 'bottom 40%',
      scrub: 1
    }
  })

  // 预览卡片动画
  gsap.fromTo(
    previewCard.value,
    {
      y: 50,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      scrollTrigger: {
        trigger: previewCard.value,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  )

  // 预览文本对齐动画
  ScrollTrigger.create({
    trigger: previewText.value,
    start: 'top 70%',
    end: 'bottom 30%',
    onUpdate: (self) => {
      let alignment
      if (self.progress < 0.33) {
        alignment = 'left'
      } else if (self.progress < 0.66) {
        alignment = 'center'
      } else {
        alignment = 'right'
      }
      
      gsap.to(previewText.value, {
        textAlign: alignment,
        duration: 0.3
      })
    }
  })
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.text-justify-section-221 {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 80px 20px;
  overflow: hidden;

  opacity: 1 !important;}

.container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.title-wrapper-221 {
  text-align: center;
  margin-bottom: 50px;

  opacity: 1 !important;}

.section-title-221 {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;

  opacity: 1 !important;}

.title-text-221 {
  display: block;
}

.title-subtitle-221 {
  font-size: 1.5rem;
  font-weight: 300;
  color: #f093fb;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.3em;
}

.description-221 {
  font-size: 1.2rem;
  color: #fff;
  opacity: 0.7;
  margin-top: 20px;
}

.alignment-indicator-221 {
  margin-bottom: 50px;
  padding: 25px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  opacity: 1 !important;}

.indicator-track-221 {
  position: relative;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 20px;

  opacity: 1 !important;}

.indicator-pointer-221 {
  position: absolute;
  top: 50%;
  left: 0;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 20px rgba(240, 147, 251, 0.5);
  transition: left 0.3s ease;

  opacity: 1 !important;}

.alignment-labels-221 {
  display: flex;
  justify-content: space-between;
}

.align-label-221 {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.align-label-221.active {
  color: #f093fb;
  text-shadow: 0 0 10px rgba(240, 147, 251, 0.5);

  opacity: 1 !important;}

.justify-container-221 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}

.justify-item-221 {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.justify-item-221:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(240, 147, 251, 0.2);
  border-color: rgba(240, 147, 251, 0.3);
}

.justify-header-221 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.justify-title-221 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;

  opacity: 1 !important;}

.justify-icon-221 {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 50%;
  font-size: 1.8rem;
  color: #fff;

  opacity: 1 !important;}

.justify-content-221 {
  min-height: 200px;
  transition: text-align 0.3s ease;

  opacity: 1 !important;}

.justify-text-221 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.8;
  margin-bottom: 20px;

  opacity: 1 !important;}

.justify-visual-221 {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.visual-line-221 {
  height: 8px;
  background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
  border-radius: 4px;
  transition: width 0.3s ease;

  opacity: 1 !important;}

.justify-footer-221 {
  display: flex;
  justify-content: center;
}

.justify-btn-221 {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: rgba(240, 147, 251, 0.1);
  border: 1px solid rgba(240, 147, 251, 0.3);
  border-radius: 25px;
  color: #f093fb;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.justify-btn-221:hover {
  background: rgba(240, 147, 251, 0.2);
  box-shadow: 0 5px 20px rgba(240, 147, 251, 0.3);
  transform: translateY(-2px);
}

.btn-icon-221 {
  font-size: 1.2rem;

  opacity: 1 !important;}

.alignment-preview-221 {
  padding: 30px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  opacity: 1 !important;}

.preview-label-221 {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 20px;

  opacity: 1 !important;}

.preview-card-221 {
  padding: 40px;
  background: rgba(240, 147, 251, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(240, 147, 251, 0.2);

  opacity: 1 !important;}

.preview-text-221 {
  font-size: 1.2rem;
  color: #fff;
  line-height: 2;
  margin-bottom: 20px;
  transition: text-align 0.3s ease;

  opacity: 1 !important;}

.preview-visual-221 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.visual-dot-221 {
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 50%;

  opacity: 1 !important;}

.visual-line-preview-221 {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);

  opacity: 1 !important;}

.justify-particles-221 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .section-title-221 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .title-subtitle-221 {
    font-size: 1rem;
  
  opacity: 1 !important;}

  .justify-container-221 {
    grid-template-columns: 1fr;
  }

  .justify-title-221 {
    font-size: 1.3rem;
  
  opacity: 1 !important;}

  .preview-text-221 {
    font-size: 1rem;
  
  opacity: 1 !important;}
}
</style>
