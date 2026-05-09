<template>
  <div class="ink-diffusion-container-218">
    <div class="ink-header-218">
      <h2 class="ink-title-218">🖌️ 墨水扩散动画</h2>
      <p class="ink-subtitle-218">滚动控制墨水扩散揭示效果</p>
      <div class="scroll-progress-218" ref="progressIndicator">
        <div class="progress-bar-218" ref="progressBar"></div>
        <span class="progress-text-218" ref="progressText">0%</span>
      </div>
    </div>

    <!-- 墨水滴落 - 滚动控制 -->
    <div class="ink-drops-218">
      <div class="ink-drop-section-218">
        <div class="ink-drop-218 ink-scroll-1-218">
          <div class="drop-ripple-218"></div>
          <div class="drop-ripple-218 ripple-delay-218"></div>
        </div>
        <span class="drop-label-218">墨滴扩散</span>
      </div>
      <div class="ink-drop-section-218">
        <div class="ink-drop-218 ink-scroll-2-218">
          <div class="drop-ripple-218"></div>
          <div class="drop-ripple-218 ripple-delay-218"></div>
        </div>
        <span class="drop-label-218">双重涟漪</span>
      </div>
      <div class="ink-drop-section-218">
        <div class="ink-drop-218 ink-scroll-3-218">
          <div class="drop-ripple-218"></div>
          <div class="drop-ripple-218 ripple-delay-218"></div>
        </div>
        <span class="drop-label-218">多重扩散</span>
      </div>
    </div>

    <!-- 墨水流动 - 滚动控制 -->
    <div class="ink-flows-218">
      <div class="ink-flow-card-218">
        <div class="ink-water-218">
          <div class="ink-liquid-218 ink-flow-1-218"></div>
          <div class="ink-content-218 ink-scroll-4-218">
            <h3 class="flow-title-218">优雅流动</h3>
            <p class="flow-desc-218">墨水在水中自然扩散</p>
          </div>
        </div>
      </div>
      <div class="ink-flow-card-218">
        <div class="ink-water-218">
          <div class="ink-liquid-218 ink-flow-2-218"></div>
          <div class="ink-content-218 ink-scroll-5-218">
            <h3 class="flow-title-218">丝滑展开</h3>
            <p class="flow-desc-218">如丝绸般的扩散效果</p>
          </div>
        </div>
      </div>
      <div class="ink-flow-card-218">
        <div class="ink-water-218">
          <div class="ink-liquid-218 ink-flow-3-218"></div>
          <div class="ink-content-218 ink-scroll-6-218">
            <h3 class="flow-title-218">自然融合</h3>
            <p class="flow-desc-218">完美的墨水融合</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 墨水揭示 - 滚动控制 -->
    <div class="ink-reveals-218">
      <div class="ink-reveal-section-218">
        <div class="ink-reveal-container-218 ink-scroll-7-218">
          <div class="ink-ink-218 ink-ink-1-218"></div>
          <div class="reveal-content-218">
            <div class="reveal-icon-218">🎨</div>
            <h3 class="reveal-title-218">艺术创作</h3>
            <p class="reveal-desc-218">墨水扩散揭示艺术之美</p>
          </div>
        </div>
      </div>
      <div class="ink-reveal-section-218">
        <div class="ink-reveal-container-218 ink-scroll-8-218">
          <div class="ink-ink-218 ink-ink-2-218"></div>
          <div class="reveal-content-218">
            <div class="reveal-icon-218">✨</div>
            <h3 class="reveal-title-218">灵感迸发</h3>
            <p class="reveal-desc-218">创意如墨水般涌现</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 墨水晕染 - 滚动控制 -->
    <div class="ink-washes-218">
      <div class="ink-wash-container-218">
        <div class="ink-wash-218 ink-scroll-9-218">
          <div class="wash-spot-218 wash-spot-1-218"></div>
          <div class="wash-spot-218 wash-spot-2-218"></div>
          <div class="wash-spot-218 wash-spot-3-218"></div>
        </div>
        <p class="wash-caption-218">滚动控制晕染效果</p>
      </div>
    </div>

    <!-- 墨水文字 - 滚动控制 -->
    <div class="ink-texts-218">
      <div class="ink-text-container-218">
        <div class="ink-text-mask-218 ink-scroll-10-218">
          <span class="ink-text-218">墨水艺术</span>
        </div>
      </div>
      <div class="ink-text-container-218">
        <div class="ink-text-mask-218 ink-scroll-11-218">
          <span class="ink-text-218">扩散美学</span>
        </div>
      </div>
      <div class="ink-text-container-218">
        <div class="ink-text-mask-218 ink-scroll-12-218">
          <span class="ink-text-218">流动韵律</span>
        </div>
      </div>
    </div>

    <!-- 墨水粒子 - 滚动控制 -->
    <div class="ink-particles-218">
      <div class="ink-particle-container-218" ref="particleContainer">
        <canvas class="ink-canvas-218" ref="particleCanvas"></canvas>
        <div class="particle-content-218 ink-scroll-13-218">
          <h3 class="particle-title-218">粒子扩散</h3>
          <p class="particle-desc-218">滚动控制粒子流动</p>
        </div>
      </div>
    </div>

    <!-- 墨水变换 - 滚动控制 -->
    <div class="ink-morphs-218">
      <div class="ink-morph-container-218">
        <div class="ink-morph-shape-218 ink-morph-1-218">
          <div class="morph-ink-218"></div>
        </div>
        <div class="ink-morph-shape-218 ink-morph-2-218">
          <div class="morph-ink-218"></div>
        </div>
        <div class="ink-morph-shape-218 ink-morph-3-218">
          <div class="morph-ink-218"></div>
        </div>
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
const particleContainer = ref(null)
const particleCanvas = ref(null)

let particles = []
let animationFrame = null

onMounted(() => {
  initScrollAnimations()
  initParticleAnimation()
})

onUnmounted(() => {
  gsap.killTweensOf('.ink-diffusion-container-218 *')
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
      trigger: '.ink-diffusion-container-218',
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

  // 墨滴扩散 - 滚动控制
  const inkDrops = gsap.utils.toArray('.ink-scroll-1-218, .ink-scroll-2-218, .ink-scroll-3-218')
  inkDrops.forEach((drop, i) => {
    const ripples = drop.querySelectorAll('.drop-ripple-218')
    
    gsap.fromTo(drop,
      {
        scale: 0.8,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.ink-drops-218',
          start: 'top 80%',
          end: 'center 60%',
          scrub: 1
        }
      }
    )

    ripples.forEach((ripple, j) => {
      gsap.to(ripple, {
        scale: 2 + i * 0.5 + j * 0.3,
        opacity: 0.3 - j * 0.1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.ink-drops-218',
          start: 'top 60%',
          end: 'bottom 30%',
          scrub: 1
        }
      })
    })
  })

  // 墨水流动 - 滚动控制
  const inkFlows = gsap.utils.toArray('.ink-scroll-4-218, .ink-scroll-5-218, .ink-scroll-6-218')
  const inkLiquids = gsap.utils.toArray('.ink-flow-1-218, .ink-flow-2-218, .ink-flow-3-218')
  
  inkFlows.forEach((content, i) => {
    gsap.fromTo(content,
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.ink-flows-218',
          start: 'top 80%',
          end: 'center 60%',
          scrub: 1
        }
      }
    )
  })

  inkLiquids.forEach((liquid, i) => {
    gsap.fromTo(liquid,
      {
        scale: 0,
        borderRadius: '50%'
      },
      {
        scale: 1,
        borderRadius: '0%',
        duration: 1.5,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: '.ink-flows-218',
          start: 'top 80%',
          end: 'center 50%',
          scrub: 1
        }
      }
    )
  })

  // 墨水揭示 - 滚动控制
  const inkReveals = gsap.utils.toArray('.ink-scroll-7-218, .ink-scroll-8-218')
  const inkInks = gsap.utils.toArray('.ink-ink-1-218, .ink-ink-2-218')
  
  inkReveals.forEach((reveal, i) => {
    gsap.fromTo(reveal.querySelector('.reveal-content-218'),
      {
        opacity: 0,
        scale: 0.9
      },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.ink-reveals-218',
          start: 'top 80%',
          end: 'center 60%',
          scrub: 1
        }
      }
    )
  })

  inkInks.forEach((ink, i) => {
    gsap.fromTo(ink,
      {
        scale: 3,
        opacity: 0
      },
      {
        scale: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: '.ink-reveals-218',
          start: 'top 70%',
          end: 'center 40%',
          scrub: 1
        }
      }
    )
  })

  // 墨水晕染 - 滚动控制
  const inkWash = document.querySelector('.ink-scroll-9-218')
  if (inkWash) {
    const spots = inkWash.querySelectorAll('.wash-spot-218')
    
    spots.forEach((spot, i) => {
      gsap.fromTo(spot,
        {
          scale: 0,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 0.6,
          duration: 1,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: '.ink-washes-218',
            start: 'top 80%',
            end: 'center 60%',
            scrub: 1
          }
        }
      )

      gsap.to(spot, {
        scale: 1.5 + i * 0.3,
        x: i * 30 - 30,
        y: i * 20 - 20,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: '.ink-washes-218',
          start: 'top 50%',
          end: 'bottom 20%',
          scrub: 1
        }
      })
    })
  }

  // 墨水文字 - 滚动控制
  const inkTexts = gsap.utils.toArray('.ink-scroll-10-218, .ink-scroll-11-218, .ink-scroll-12-218')
  inkTexts.forEach((text, i) => {
    gsap.fromTo(text,
      {
        clipPath: 'inset(0 100% 0 0)'
      },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.5,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: '.ink-texts-218',
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 1
        }
      }
    )
  })

  // 墨水粒子 - 滚动控制
  const particleContent = document.querySelector('.ink-scroll-13-218')
  if (particleContent) {
    gsap.fromTo(particleContent,
      {
        opacity: 0,
        y: 50
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.ink-particles-218',
          start: 'top 80%',
          end: 'center 60%',
          scrub: 1
        }
      }
    )
  }

  // 墨水变换 - 滚动控制
  const inkMorphs = gsap.utils.toArray('.ink-morph-1-218, .ink-morph-2-218, .ink-morph-3-218')
  inkMorphs.forEach((morph, i) => {
    gsap.fromTo(morph,
      {
        scale: 0,
        rotate: i * 120 - 60
      },
      {
        scale: 1,
        rotate: 0,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: '.ink-morphs-218',
          start: 'top 80%',
          end: 'center 60%',
          scrub: 1
        }
      }
    )

    const morphInk = morph.querySelector('.morph-ink-218')
    if (morphInk) {
      gsap.to(morphInk, {
        scale: 1.5,
        rotate: i * 180,
        borderRadius: ['50%', '30%', '50%', '10%', '50%'],
        ease: 'none',
        scrollTrigger: {
          trigger: '.ink-morphs-218',
          start: 'top 50%',
          end: 'bottom 20%',
          scrub: 1
        }
      })
    }
  })
}

function initParticleAnimation() {
  if (!particleCanvas.value) return
  
  const canvas = particleCanvas.value
  const ctx = canvas.getContext('2d')
  
  const resize = () => {
    const container = particleContainer.value
    if (container) {
      canvas.width = container.offsetWidth
      canvas.height = container.offsetHeight
    }
  }
  
  resize()
  window.addEventListener('resize', resize)
  
  // 创建粒子
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: Math.random() * 3 + 1,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.5 + 0.3,
      color: `rgba(30, 30, 40, ${Math.random() * 0.5 + 0.3})`
    })
  }
  
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // 使用 window.scrollY 替代 ScrollTrigger.getScroll()
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const scrollProgress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0
    const speedMultiplier = 1 + scrollProgress * 2
    
    particles.forEach(particle => {
      particle.x += particle.vx * speedMultiplier
      particle.y += particle.vy * speedMultiplier
      
      // 边界检测
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
      
      // 绘制粒子
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.radius * (1 + scrollProgress), 0, Math.PI * 2)
      ctx.fillStyle = particle.color
      ctx.fill()
      
      // 绘制粒子之间的连线
      particles.forEach(other => {
        const dx = particle.x - other.x
        const dy = particle.y - other.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 80 * (1 + scrollProgress)) {
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(other.x, other.y)
          ctx.strokeStyle = `rgba(30, 30, 40, ${(1 - distance / 80) * 0.2})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      })
    })
    
    animationFrame = requestAnimationFrame(animate)
  }
  
  animate()
}
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.ink-diffusion-container-218 {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%);
  padding: 40px 20px;
  overflow-x: hidden;

  opacity: 1 !important;}

.ink-header-218 {
  text-align: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.ink-title-218 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.ink-subtitle-218 {
  font-size: 1.2rem;
  color: #6c757d;
  margin-bottom: 30px;

  opacity: 1 !important;}

.scroll-progress-218 {
  width: 300px;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.progress-bar-218 {
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, #1a1a2e, #0f3460, #1a1a2e);
  border-radius: 4px;

  opacity: 1 !important;}

.progress-text-218 {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.9rem;
  font-weight: 700;
  color: #495057;

  opacity: 1 !important;}

/* 墨滴扩散 */
.ink-drops-218 {
  display: flex;
  justify-content: center;
  gap: 80px;
  flex-wrap: wrap;
  margin-bottom: 80px;
}

.ink-drop-section-218 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.ink-drop-218 {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  opacity: 1 !important;}

.drop-ripple-218 {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 3px solid rgba(26, 26, 46, 0.4);
  border-radius: 50%;

  opacity: 1 !important;}

.ripple-delay-218 {
  animation-delay: 0.3s;
}

.drop-label-218 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #495057;

  opacity: 1 !important;}

/* 墨水流动 */
.ink-flows-218 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto 80px;

  opacity: 1 !important;}

.ink-flow-card-218 {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  opacity: 1 !important;}

.ink-water-218 {
  position: relative;
  height: 200px;
  border-radius: 15px;
  overflow: hidden;
  background: linear-gradient(180deg, #f8f9fa, #e9ecef);

  opacity: 1 !important;}

.ink-liquid-218 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(26, 26, 46, 0.6), rgba(26, 26, 46, 0.8));

  opacity: 1 !important;}

.ink-flow-1-218 {
  background: radial-gradient(circle, rgba(26, 26, 46, 0.5), rgba(15, 52, 96, 0.7));

  opacity: 1 !important;}

.ink-flow-2-218 {
  background: radial-gradient(circle, rgba(26, 26, 46, 0.6), rgba(22, 33, 62, 0.8));

  opacity: 1 !important;}

.ink-flow-3-218 {
  background: radial-gradient(circle, rgba(26, 26, 46, 0.4), rgba(15, 52, 96, 0.6));

  opacity: 1 !important;}

.ink-content-218 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 2;
  color: white;

  opacity: 1 !important;}

.flow-title-218 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 8px;

  opacity: 1 !important;}

.flow-desc-218 {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 墨水揭示 */
.ink-reveals-218 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 40px;
  max-width: 1000px;
  margin: 0 auto 80px;

  opacity: 1 !important;}

.ink-reveal-section-218 {
  background: white;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);

  opacity: 1 !important;}

.ink-reveal-container-218 {
  position: relative;
  height: 300px;
  overflow: hidden;

  opacity: 1 !important;}

.ink-ink-218 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(26, 26, 46, 0.9), rgba(26, 26, 46, 1));

  opacity: 1 !important;}

.ink-ink-1-218 {
  background: radial-gradient(circle, rgba(26, 26, 46, 0.85), rgba(15, 52, 96, 0.95));

  opacity: 1 !important;}

.ink-ink-2-218 {
  background: radial-gradient(circle, rgba(26, 26, 46, 0.8), rgba(22, 33, 62, 0.9));

  opacity: 1 !important;}

.reveal-content-218 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 2;
  color: white;

  opacity: 1 !important;}

.reveal-icon-218 {
  font-size: 4rem;
  margin-bottom: 15px;

  opacity: 1 !important;}

.reveal-title-218 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 10px;

  opacity: 1 !important;}

.reveal-desc-218 {
  font-size: 1rem;
  opacity: 0.9;
}

/* 墨水晕染 */
.ink-washes-218 {
  max-width: 800px;
  margin: 0 auto 80px;

  opacity: 1 !important;}

.ink-wash-container-218 {
  background: white;
  border-radius: 25px;
  padding: 60px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  opacity: 1 !important;}

.ink-wash-218 {
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.wash-spot-218 {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(26, 26, 46, 0.4), rgba(26, 26, 46, 0.1));
  filter: blur(20px);

  opacity: 1 !important;}

.wash-caption-218 {
  color: #6c757d;
  font-size: 1rem;
  margin-top: 30px;

  opacity: 1 !important;}

/* 墨水文字 */
.ink-texts-218 {
  display: flex;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;
  margin-bottom: 80px;
}

.ink-text-container-218 {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 50px;
  padding: 20px 50px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  opacity: 1 !important;}

.ink-text-mask-218 {
  overflow: hidden;
}

.ink-text-218 {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  white-space: nowrap;

  opacity: 1 !important;}

/* 墨水粒子 */
.ink-particles-218 {
  max-width: 1000px;
  margin: 0 auto 80px;

  opacity: 1 !important;}

.ink-particle-container-218 {
  position: relative;
  height: 350px;
  background: white;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  opacity: 1 !important;}

.ink-canvas-218 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  opacity: 1 !important;}

.particle-content-218 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 2;

  opacity: 1 !important;}

.particle-title-218 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 10px;

  opacity: 1 !important;}

.particle-desc-218 {
  font-size: 1rem;
  color: #6c757d;

  opacity: 1 !important;}

/* 墨水变换 */
.ink-morphs-218 {
  display: flex;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;
}

.ink-morph-container-218 {
  display: flex;
  gap: 60px;
}

.ink-morph-shape-218 {
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.morph-ink-218 {
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(26, 26, 46, 0.7), rgba(26, 26, 46, 0.9));
  border-radius: 50%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  opacity: 1 !important;}

/* 响应式 */
@media (max-width: 768px) {
  .ink-title-218 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .ink-drops-218 {
    gap: 40px;
  }

  .ink-reveals-218 {
    grid-template-columns: 1fr;
  }

  .ink-texts-218 {
    gap: 30px;
  }

  .ink-text-container-218 {
    padding: 15px 30px;
  
  opacity: 1 !important;}

  .ink-text-218 {
    font-size: 1.5rem;
  
  opacity: 1 !important;}

  .ink-morphs-218 {
    gap: 30px;
  }

  .ink-morph-shape-218 {
    width: 100px;
    height: 100px;
  
  opacity: 1 !important;}

  .morph-ink-218 {
    width: 80px;
    height: 80px;
  
  opacity: 1 !important;}
}
</style>
