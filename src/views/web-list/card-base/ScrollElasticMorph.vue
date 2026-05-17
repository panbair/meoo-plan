<template>
  <div class="elastic-morph-container-217">
    <div class="elastic-header-217">
      <h2 class="elastic-title-217">🍮 弹性变形动画</h2>
      <p class="elastic-subtitle-217">滚动控制弹性变形效果</p>
      <div class="scroll-progress-217" ref="progressIndicator">
        <div class="progress-bar-217" ref="progressBar"></div>
        <span class="progress-text-217" ref="progressText">0%</span>
      </div>
    </div>

    <!-- 弹性卡片展示 - 滚动控制 -->
    <div class="elastic-cards-217">
      <div class="elastic-card-217 elastic-jelly-217">
        <div class="jelly-item-217 jelly-scroll-1-217">
          <span class="jelly-text-217">滚动挤压</span>
        </div>
        <div class="jelly-item-217 jelly-scroll-2-217">
          <span class="jelly-text-217">弹性</span>
        </div>
        <div class="jelly-item-217 jelly-scroll-3-217">
          <span class="jelly-text-217">变形</span>
        </div>
      </div>

      <div class="elastic-card-217 elastic-slime-217">
        <div class="slime-blob-217 slime-scroll-1-217"></div>
        <div class="slime-blob-217 slime-scroll-2-217"></div>
        <div class="slime-blob-217 slime-scroll-3-217"></div>
      </div>

      <div class="elastic-card-217 elastic-gooey-217">
        <div class="gooey-item-217 gooey-scroll-1-217">粘性</div>
        <div class="gooey-item-217 gooey-scroll-2-217">流动</div>
        <div class="gooey-item-217 gooey-scroll-3-217">融合</div>
      </div>
    </div>

    <!-- 弹性形状变形 - 滚动控制 -->
    <div class="elastic-shapes-217">
      <div class="shape-row-217">
        <div class="elastic-shape-217 shape-circle-217 shape-scroll-1-217">
          <span class="shape-label-217">圆形 → 方形</span>
        </div>
        <div class="elastic-shape-217 shape-star-217 shape-scroll-2-217">
          <span class="shape-label-217">星形变形</span>
        </div>
        <div class="elastic-shape-217 shape-morph-217 shape-scroll-3-217">
          <span class="shape-label-217">多边形变换</span>
        </div>
      </div>
    </div>

    <!-- 弹性波浪 - 滚动控制 -->
    <div class="elastic-waves-217">
      <div class="wave-container-217">
        <div class="elastic-wave-217 wave-scroll-1-217"></div>
        <div class="elastic-wave-217 wave-scroll-2-217"></div>
        <div class="elastic-wave-217 wave-scroll-3-217"></div>
      </div>
      <p class="wave-caption-217">滚动控制波浪振幅</p>
    </div>

    <!-- 弹性按钮 - 滚动控制 -->
    <div class="elastic-buttons-217">
      <button class="elastic-btn-217 btn-squish-217 btn-scroll-1-217">
        <span>挤压变形</span>
      </button>
      <button class="elastic-btn-217 btn-stretch-217 btn-scroll-2-217">
        <span>拉伸变形</span>
      </button>
      <button class="elastic-btn-217 btn-wobble-217 btn-scroll-3-217">
        <span>摇摆变形</span>
      </button>
    </div>

    <!-- 弹性卡片交互 - 滚动控制 -->
    <div class="interactive-cards-217">
      <div class="interactive-card-217 ic-scroll-1-217">
        <div class="card-icon-217">🧈</div>
        <h3 class="card-title-217">黄油感</h3>
        <p class="card-desc-217">滚动控制变形</p>
      </div>
      <div class="interactive-card-217 ic-scroll-2-217">
        <div class="card-icon-217">🍯</div>
        <h3 class="card-title-217">蜂蜜流</h3>
        <p class="card-desc-217">滚动控制流动</p>
      </div>
      <div class="interactive-card-217 ic-scroll-3-217">
        <div class="card-icon-217">🫧</div>
        <h3 class="card-title-217">气泡弹</h3>
        <p class="card-desc-217">滚动控制弹性</p>
      </div>
    </div>

    <!-- 弹性加载器 - 滚动控制 -->
    <div class="elastic-loaders-217">
      <div class="loader-section-217">
        <div class="elastic-loader-pulse-217 loader-scroll-1-217">
          <div class="pulse-ring-217"></div>
          <div class="pulse-core-217"></div>
        </div>
        <span class="loader-label-217">滚动脉冲</span>
      </div>
      <div class="loader-section-217">
        <div class="elastic-loader-bounce-217 loader-scroll-2-217">
          <div class="bounce-ball-217"></div>
          <div class="bounce-shadow-217"></div>
        </div>
        <span class="loader-label-217">滚动弹跳</span>
      </div>
      <div class="loader-section-217">
        <div class="elastic-loader-squish-217 loader-scroll-3-217">
          <div class="squish-cube-217"></div>
        </div>
        <span class="loader-label-217">滚动挤压</span>
      </div>
    </div>

    <!-- 滚动控制变形条 -->
    <div class="morph-bar-217" ref="morphBar">
      <div class="morph-section-217 morph-1-217">
        <div class="morph-element-217"></div>
      </div>
      <div class="morph-section-217 morph-2-217">
        <div class="morph-element-217"></div>
      </div>
      <div class="morph-section-217 morph-3-217">
        <div class="morph-element-217"></div>
      </div>
    </div>

    <!-- 鼠标跟随弹性 -->
    <div class="mouse-follow-217" ref="mouseFollowContainer">
      <div class="follow-elastic-217" ref="followElastic">
        <div class="follow-core-217"></div>
        <div class="follow-ripple-217"></div>
      </div>
      <p class="follow-caption-217">移动鼠标体验弹性跟随</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const mouseFollowContainer = ref(null)
const followElastic = ref(null)
const progressIndicator = ref(null)
const progressBar = ref(null)
const progressText = ref(null)
const morphBar = ref(null)

let mouseX = 0
let mouseY = 0
let elasticX = 0
let elasticY = 0

onMounted(() => {
  initScrollAnimations()
  initMouseFollow()
})

onUnmounted(() => {
  gsap.killTweensOf('.elastic-morph-container-217 *')
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})

function initScrollAnimations() {
  // 全局滚动进度指示器
  gsap.to(progressBar.value, {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.elastic-morph-container-217',
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

  // 果冻弹跳 - 滚动控制挤压变形
  const jellyItems = gsap.utils.toArray('.jelly-scroll-1-217, .jelly-scroll-2-217, .jelly-scroll-3-217')
  jellyItems.forEach((item, i) => {
    gsap.fromTo(item,
      {
        scale: 0.5,
        opacity: 0,
        borderRadius: '50%'
      },
      {
        scale: 1,
        opacity: 1,
        borderRadius: '25%',
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: '.elastic-cards-217',
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1
        }
      }
    )

    // 滚动持续挤压效果
    gsap.to(item, {
      scaleY: (i + 1) * 0.7,
      scaleX: (i + 1) * 1.3,
      ease: 'none',
      scrollTrigger: {
        trigger: '.elastic-cards-217',
        start: 'top 60%',
        end: 'bottom 40%',
        scrub: 1
      }
    })
  })

  // 史莱姆 - 滚动控制变形
  const slimeBlobs = gsap.utils.toArray('.slime-scroll-1-217, .slime-scroll-2-217, .slime-scroll-3-217')
  slimeBlobs.forEach((blob, i) => {
    gsap.fromTo(blob,
      {
        scale: 0,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 0.8,
        duration: 1,
        ease: 'elastic.out(1, 0.4)',
        scrollTrigger: {
          trigger: '.elastic-slime-217',
          start: 'top 80%',
          end: 'center 60%',
          scrub: 1
        }
      }
    )

    // 滚动控制圆角变形
    gsap.to(blob, {
      borderRadius: (i + 1) * 15 + '%',
      rotate: i * 120,
      ease: 'none',
      scrollTrigger: {
        trigger: '.elastic-slime-217',
        start: 'top 50%',
        end: 'bottom 20%',
        scrub: 1
      }
    })
  })

  // 粘性项目 - 滚动控制融合效果
  const gooeyItems = gsap.utils.toArray('.gooey-scroll-1-217, .gooey-scroll-2-217, .gooey-scroll-3-217')
  gooeyItems.forEach((item, i) => {
    gsap.fromTo(item,
      {
        scale: 0,
        opacity: 0,
        x: (i - 1) * 50
      },
      {
        scale: 1,
        opacity: 1,
        x: 0,
        duration: 1.2,
        ease: 'elastic.out(1, 0.6)',
        scrollTrigger: {
          trigger: '.elastic-gooey-217',
          start: 'top 80%',
          end: 'center 60%',
          scrub: 1
        }
      }
    )

    // 滚动控制拉伸效果
    gsap.to(item, {
      scale: 1.3,
      y: i * 20 - 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.elastic-gooey-217',
        start: 'top 40%',
        end: 'bottom 10%',
        scrub: 1
      }
    })
  })

  // 弹性形状 - 滚动控制形状变换
  const shapes = gsap.utils.toArray('.shape-scroll-1-217, .shape-scroll-2-217, .shape-scroll-3-217')
  shapes.forEach((shape, i) => {
    gsap.fromTo(shape,
      {
        scale: 0.5,
        rotate: -30,
        opacity: 0
      },
      {
        scale: 1,
        rotate: 0,
        opacity: 1,
        duration: 1.3,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: '.elastic-shapes-217',
          start: 'top 85%',
          end: 'center 70%',
          scrub: 1
        }
      }
    )

    // 滚动控制形状变形
    if (i === 0) {
      gsap.to(shape, {
        borderRadius: '10%',
        rotation: 180,
        ease: 'none',
        scrollTrigger: {
          trigger: '.elastic-shapes-217',
          start: 'center 60%',
          end: 'bottom 30%',
          scrub: 1
        }
      })
    } else if (i === 1) {
      gsap.to(shape, {
        scale: 1.5,
        rotation: 90,
        ease: 'none',
        scrollTrigger: {
          trigger: '.elastic-shapes-217',
          start: 'center 60%',
          end: 'bottom 30%',
          scrub: 1
        }
      })
    } else {
      gsap.to(shape, {
        borderRadius: ['50%', '20%', '40%', '10%', '50%'],
        scale: 1.4,
        ease: 'none',
        scrollTrigger: {
          trigger: '.elastic-shapes-217',
          start: 'center 60%',
          end: 'bottom 30%',
          scrub: 1
        }
      })
    }
  })

  // 弹性波浪 - 滚动控制振幅和相位
  const waves = gsap.utils.toArray('.wave-scroll-1-217, .wave-scroll-2-217, .wave-scroll-3-217')
  waves.forEach((wave, i) => {
    gsap.fromTo(wave,
      {
        scaleX: 0,
        opacity: 0,
        y: 50
      },
      {
        scaleX: 1,
        opacity: 0.7,
        y: 0,
        duration: 1.2,
        ease: 'elastic.out(1, 0.4)',
        scrollTrigger: {
          trigger: '.elastic-waves-217',
          start: 'top 80%',
          end: 'center 60%',
          scrub: 1
        }
      }
    )

    // 滚动控制波浪效果
    gsap.to(wave, {
      y: -50 - i * 30,
      scale: 1 + i * 0.2,
      ease: 'none',
      scrollTrigger: {
        trigger: '.elastic-waves-217',
        start: 'top 50%',
        end: 'bottom 20%',
        scrub: 1
      }
    })
  })

  // 弹性按钮 - 滚动控制变形
  const buttons = gsap.utils.toArray('.btn-scroll-1-217, .btn-scroll-2-217, .btn-scroll-3-217')
  buttons.forEach((btn, i) => {
    gsap.fromTo(btn,
      {
        scale: 0.8,
        opacity: 0,
        y: 30
      },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: '.elastic-buttons-217',
          start: 'top 80%',
          end: 'center 60%',
          scrub: 1
        }
      }
    )

    // 滚动控制按钮变形
    if (i === 0) {
      gsap.to(btn, {
        scaleY: 0.6,
        scaleX: 1.5,
        ease: 'none',
        scrollTrigger: {
          trigger: '.elastic-buttons-217',
          start: 'top 40%',
          end: 'bottom 20%',
          scrub: 1
        }
      })
    } else if (i === 1) {
      gsap.to(btn, {
        scaleY: 1.5,
        scaleX: 0.8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.elastic-buttons-217',
          start: 'top 40%',
          end: 'bottom 20%',
          scrub: 1
        }
      })
    } else {
      gsap.to(btn, {
        rotate: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.elastic-buttons-217',
          start: 'top 40%',
          end: 'bottom 20%',
          scrub: 1
        }
      })
    }
  })

  // 交互卡片 - 滚动控制3D变形
  const cards = gsap.utils.toArray('.ic-scroll-1-217, .ic-scroll-2-217, .ic-scroll-3-217')
  cards.forEach((card, i) => {
    gsap.fromTo(card,
      {
        y: 100,
        scale: 0.7,
        opacity: 0,
        rotateX: 30,
        rotateY: -30
      },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        rotateX: 0,
        rotateY: 0,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: '.interactive-cards-217',
          start: 'top 80%',
          end: 'center 60%',
          scrub: 1
        }
      }
    )

    // 滚动控制卡片变形
    gsap.to(card, {
      scale: 1.2,
      rotateX: i * 15 - 15,
      rotateY: (i - 1) * 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.interactive-cards-217',
        start: 'top 30%',
        end: 'bottom 10%',
        scrub: 1
      }
    })

    // 图标滚动变形
    const icon = card.querySelector('.card-icon-217')
    if (icon) {
      gsap.to(icon, {
        scale: 1.5,
        rotate: i * 45,
        ease: 'none',
        scrollTrigger: {
          trigger: '.interactive-cards-217',
          start: 'top 30%',
          end: 'bottom 10%',
          scrub: 1
        }
      })
    }
  })

  // 加载器 - 滚动控制弹性效果
  const loaders = gsap.utils.toArray('.loader-scroll-1-217, .loader-scroll-2-217, .loader-scroll-3-217')
  loaders.forEach((loader, i) => {
    gsap.fromTo(loader,
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
          trigger: '.elastic-loaders-217',
          start: 'top 80%',
          end: 'center 60%',
          scrub: 1
        }
      }
    )

    // 滚动控制加载器变形
    if (i === 0) {
      // 脉冲效果
      const pulseRing = loader.querySelector('.pulse-ring-217')
      const pulseCore = loader.querySelector('.pulse-core-217')
      
      if (pulseRing) {
        gsap.to(pulseRing, {
          scale: 2.5,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.elastic-loaders-217',
            start: 'top 40%',
            end: 'bottom 20%',
            scrub: 1
          }
        })
      }
      
      if (pulseCore) {
        gsap.to(pulseCore, {
          scale: 1.3,
          ease: 'none',
          scrollTrigger: {
            trigger: '.elastic-loaders-217',
            start: 'top 40%',
            end: 'bottom 20%',
            scrub: 1
          }
        })
      }
    } else if (i === 1) {
      // 弹跳效果
      const bounceBall = loader.querySelector('.bounce-ball-217')
      const bounceShadow = loader.querySelector('.bounce-shadow-217')
      
      if (bounceBall) {
        gsap.to(bounceBall, {
          y: -80,
          scaleY: 1.2,
          ease: 'none',
          scrollTrigger: {
            trigger: '.elastic-loaders-217',
            start: 'top 40%',
            end: 'bottom 20%',
            scrub: 1
          }
        })
      }
      
      if (bounceShadow) {
        gsap.to(bounceShadow, {
          scale: 0.5,
          opacity: 0.3,
          ease: 'none',
          scrollTrigger: {
            trigger: '.elastic-loaders-217',
            start: 'top 40%',
            end: 'bottom 20%',
            scrub: 1
          }
        })
      }
    } else {
      // 挤压效果
      const squishCube = loader.querySelector('.squish-cube-217')
      
      if (squishCube) {
        gsap.to(squishCube, {
          scaleY: 0.4,
          scaleX: 1.6,
          rotate: 45,
          ease: 'none',
          scrollTrigger: {
            trigger: '.elastic-loaders-217',
            start: 'top 40%',
            end: 'bottom 20%',
            scrub: 1
          }
        })
      }
    }
  })

  // 变形条 - 滚动控制弹性变形
  const morphSections = gsap.utils.toArray('.morph-section-217')
  morphSections.forEach((section, i) => {
    const element = section.querySelector('.morph-element-217')
    
    gsap.fromTo(element,
      {
        scale: 0,
        borderRadius: '50%'
      },
      {
        scale: 1,
        borderRadius: '10%',
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: '.morph-bar-217',
          start: 'top 80%',
          end: 'center 60%',
          scrub: 1
        }
      }
    )

    // 滚动控制持续变形
    gsap.to(element, {
      scaleY: 0.5 + i * 0.3,
      scaleX: 1.5 - i * 0.2,
      borderRadius: (i + 1) * 10 + '%',
      rotate: i * 45,
      ease: 'none',
      scrollTrigger: {
        trigger: '.morph-bar-217',
        start: 'top 50%',
        end: 'bottom 20%',
        scrub: 1
      }
    })
  })
}

function initMouseFollow() {
  if (!mouseFollowContainer.value || !followElastic.value) return

  mouseFollowContainer.value.addEventListener('mousemove', (e) => {
    const rect = mouseFollowContainer.value.getBoundingClientRect()
    mouseX = e.clientX - rect.left - rect.width / 2
    mouseY = e.clientY - rect.top - rect.height / 2
  })

  // 弹性跟随动画
  gsap.ticker.add(() => {
    const dx = mouseX - elasticX
    const dy = mouseY - elasticY
    const easing = 0.08

    elasticX += dx * easing
    elasticY += dy * easing

    if (followElastic.value) {
      gsap.set(followElastic.value, {
        x: elasticX,
        y: elasticY
      })
    }
  })
}
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.elastic-morph-container-217 {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: 40px 20px;
  overflow-x: hidden;

  opacity: 1 !important;}

.elastic-header-217 {
  text-align: center;
  margin-bottom: 60px;
  color: white;

  opacity: 1 !important;}

.elastic-title-217 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 15px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

  opacity: 1 !important;}

.elastic-subtitle-217 {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 30px;
}

.scroll-progress-217 {
  width: 300px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.progress-bar-217 {
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, #fff, #a78bfa, #fff);
  border-radius: 4px;

  opacity: 1 !important;}

.progress-text-217 {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.9rem;
  font-weight: 700;
  opacity: 0.9;
}

/* 弹性卡片 */
.elastic-cards-217 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto 60px;

  opacity: 1 !important;}

.elastic-card-217 {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  opacity: 1 !important;}

.elastic-jelly-217 {
  flex-direction: row;
}

.jelly-item-217 {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  border-radius: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 10px 30px rgba(0, 210, 255, 0.4),
    inset 0 -5px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.jelly-item-217::before {
  content: '';
  position: absolute;
  top: 10%;
  left: 20%;
  width: 30%;
  height: 20%;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  filter: blur(8px);
}

.jelly-text-217 {
  color: white;
  font-weight: 700;
  font-size: 1rem;
  text-align: center;
  z-index: 1;

  opacity: 1 !important;}

.elastic-slime-217 {
  background: rgba(255, 255, 255, 0.1);

  opacity: 1 !important;}

.slime-blob-217 {
  width: 80px;
  height: 80px;
  border-radius: 60% 40% 30% 70%;
  background: linear-gradient(135deg, #a8edea, #fed6e3);
  position: relative;
  box-shadow: 
    0 15px 35px rgba(168, 237, 234, 0.5),
    inset 0 -5px 15px rgba(0, 0, 0, 0.1);

  opacity: 1 !important;}

.slime-scroll-1-217 {
  background: linear-gradient(135deg, #ff9a9e, #fecfef);

  opacity: 1 !important;}

.slime-scroll-2-217 {
  background: linear-gradient(135deg, #a18cd1, #fbc2eb);

  opacity: 1 !important;}

.slime-scroll-3-217 {
  background: linear-gradient(135deg, #84fab0, #8fd3f4);

  opacity: 1 !important;}

.elastic-gooey-217 {
  background: rgba(255, 255, 255, 0.1);

  opacity: 1 !important;}

.gooey-item-217 {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 10px 30px rgba(240, 147, 251, 0.5);

  opacity: 1 !important;}

/* 弹性形状 */
.elastic-shapes-217 {
  max-width: 1200px;
  margin: 0 auto 60px;

  opacity: 1 !important;}

.shape-row-217 {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.elastic-shape-217 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #ffecd2, #fcb69f);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 40px rgba(252, 182, 159, 0.5);
  cursor: pointer;
  transition: box-shadow 0.3s;

  opacity: 1 !important;}

.elastic-shape-217:hover {
  box-shadow: 0 15px 50px rgba(252, 182, 159, 0.6);
}

.shape-circle-217 {
  border-radius: 50%;
}

.shape-star-217 {
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}

.shape-morph-217 {
  border-radius: 50%;
  background: linear-gradient(135deg, #a8edea, #fed6e3);

  opacity: 1 !important;}

.shape-label-217 {
  color: #333;
  font-weight: 700;
  font-size: 0.9rem;
  text-align: center;

  opacity: 1 !important;}

/* 弹性波浪 */
.elastic-waves-217 {
  max-width: 1200px;
  margin: 0 auto 60px;
  text-align: center;

  opacity: 1 !important;}

.wave-container-217 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  height: 150px;
  margin-bottom: 20px;

  opacity: 1 !important;}

.elastic-wave-217 {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.5);

  opacity: 1 !important;}

.wave-caption-217 {
  color: white;
  font-size: 1.1rem;
  opacity: 0.9;
}

/* 弹性按钮 */
.elastic-buttons-217 {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  margin-bottom: 60px;
}

.elastic-btn-217 {
  padding: 15px 40px;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  color: white;
  transform-style: preserve-3d;
  transition: box-shadow 0.3s;

  opacity: 1 !important;}

.elastic-btn-217 span {
  display: inline-block;
}

.btn-squish-217 {
  background: linear-gradient(135deg, #667eea, #764ba2);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.5);

  opacity: 1 !important;}

.btn-stretch-217 {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  box-shadow: 0 10px 30px rgba(240, 147, 251, 0.5);

  opacity: 1 !important;}

.btn-wobble-217 {
  background: linear-gradient(135deg, #a8edea, #84fab0);
  box-shadow: 0 10px 30px rgba(168, 237, 234, 0.5);

  opacity: 1 !important;}

.elastic-btn-217:hover {
  transform: translateY(-3px);
}

/* 交互卡片 */
.interactive-cards-217 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1000px;
  margin: 0 auto 60px;

  opacity: 1 !important;}

.interactive-card-217 {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: box-shadow 0.3s;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transform-style: preserve-3d;

  opacity: 1 !important;}

.interactive-card-217:hover {
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}

.card-icon-217 {
  font-size: 4rem;
  margin-bottom: 15px;
  display: inline-block;

  opacity: 1 !important;}

.card-title-217 {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 10px;

  opacity: 1 !important;}

.card-desc-217 {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;

  opacity: 1 !important;}

/* 加载器 */
.elastic-loaders-217 {
  display: flex;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;
  margin-bottom: 60px;
}

.loader-section-217 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

/* 脉冲加载器 */
.elastic-loader-pulse-217 {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  opacity: 1 !important;}

.pulse-core-217 {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.5);
  position: relative;
  z-index: 2;

  opacity: 1 !important;}

.pulse-ring-217 {
  position: absolute;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  opacity: 0.5;
  z-index: 1;
}

/* 弹跳加载器 */
.elastic-loader-bounce-217 {
  width: 80px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;

  opacity: 1 !important;}

.bounce-ball-217 {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  border-radius: 50%;
  box-shadow: 
    0 5px 15px rgba(240, 147, 251, 0.4),
    inset 0 -5px 10px rgba(0, 0, 0, 0.2);
  position: relative;

  opacity: 1 !important;}

.bounce-shadow-217 {
  width: 40px;
  height: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  margin-top: 10px;

  opacity: 1 !important;}

/* 挤压加载器 */
.elastic-loader-squish-217 {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.squish-cube-217 {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #a8edea, #84fab0);
  border-radius: 12px;
  box-shadow: 
    0 8px 25px rgba(168, 237, 234, 0.4),
    inset 0 -3px 10px rgba(0, 0, 0, 0.15);

  opacity: 1 !important;}

.elastic-loader-217 {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #fff, #f0f0f0);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  opacity: 1 !important;}

.loader-label-217 {
  color: white;
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 变形条 */
.morph-bar-217 {
  display: flex;
  justify-content: center;
  gap: 40px;
  max-width: 800px;
  margin: 0 auto 60px;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;

  opacity: 1 !important;}

.morph-section-217 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.morph-element-217 {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.5);

  opacity: 1 !important;}

/* 鼠标跟随 */
.mouse-follow-217 {
  height: 300px;
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  cursor: crosshair;

  opacity: 1 !important;}

.follow-elastic-217 {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent);
  pointer-events: none;

  opacity: 1 !important;}

.follow-core-217 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #fff, #f0f0f0);
  border-radius: 50%;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);

  opacity: 1 !important;}

.follow-ripple-217 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border: 3px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: ripple-217 2s ease-out infinite;

  opacity: 1 !important;}

@keyframes ripple-217 {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
}

.follow-caption-217 {
  color: white;
  font-size: 1.1rem;
  opacity: 0.9;
  z-index: 10;
  pointer-events: none;
}

/* 响应式 */
@media (max-width: 768px) {
  .elastic-title-217 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .elastic-cards-217,
  .shape-row-217,
  .elastic-buttons-217,
  .elastic-loaders-217,
  .morph-bar-217 {
    gap: 15px;
  }

  .elastic-card-217 {
    padding: 20px;
  
  opacity: 1 !important;}

  .jelly-item-217,
  .slime-blob-217,
  .gooey-item-217 {
    width: 70px;
    height: 70px;
  
  opacity: 1 !important;}

  .elastic-shape-217 {
    width: 100px;
    height: 100px;
  
  opacity: 1 !important;}

  .interactive-cards-217 {
    grid-template-columns: 1fr;
  }

  .morph-element-217 {
    width: 60px;
    height: 60px;
  
  opacity: 1 !important;}

  .scroll-progress-217 {
    width: 200px;
  
  opacity: 1 !important;}
}
</style>
