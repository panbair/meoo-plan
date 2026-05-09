<template>
  <section class="sst-scroll-storytelling-226">
    <!-- 背景效果 -->
    <div class="sst-background-226">
      <div class="sst-gradient-layer-226 sst-layer-1-226"></div>
      <div class="sst-gradient-layer-226 sst-layer-2-226"></div>
      <div class="sst-gradient-layer-226 sst-layer-3-226"></div>
    </div>

    <div class="sst-container-226">
      <!-- 故事标题 -->
      <div class="sst-story-header-226">
        <h1 class="sst-story-title-226">时空之旅</h1>
        <p class="sst-story-subtitle-226">A Journey Through Time and Space</p>
        <div class="sst-scroll-indicator-226">
          <span class="sst-scroll-text-226">向下滚动开始旅程</span>
          <div class="sst-scroll-arrow-226">↓</div>
        </div>
      </div>

      <!-- 故事章节 -->
      <div class="sst-chapters-226">
        <div
          v-for="(chapter, index) in chapters"
          :key="index"
          class="sst-chapter-226"
          :class="'sst-chapter-' + index"
        >
          <!-- 章节视觉元素 -->
          <div class="sst-visual-226">
            <div class="sst-visual-frame-226">
              <div class="sst-visual-content-226" :style="{ background: chapter.visualGradient }">
                <div class="sst-visual-shape-226" :class="'sst-shape-' + chapter.shape"></div>
                <div class="sst-visual-particles-226">
                  <div
                    v-for="i in 8"
                    :key="i"
                    class="sst-particle-226"
                    :style="{ '--particle-index': i }"
                  ></div>
                </div>
              </div>
              <div class="sst-chapter-number-226">{{ String(index + 1).padStart(2, '0') }}</div>
            </div>
          </div>

          <!-- 章节内容 -->
          <div class="sst-content-226">
            <div class="sst-content-inner-226">
              <h2 class="sst-chapter-title-226">{{ chapter.title }}</h2>
              <div class="sst-chapter-divider-226"></div>
              <p class="sst-chapter-text-226">{{ chapter.text }}</p>
              <div class="sst-chapter-quote-226" v-if="chapter.quote">
                <span class="sst-quote-mark-226">"</span>
                {{ chapter.quote }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 故事结尾 -->
      <div class="sst-story-footer-226">
        <div class="sst-footer-content-226">
          <h2 class="sst-footer-title-226">旅程继续</h2>
          <p class="sst-footer-text-226">每一次滚动，都是新的开始</p>
          <div class="sst-footer-decoration-226">
            <div class="sst-footer-line-226 sst-line-left-226"></div>
            <div class="sst-footer-line-226 sst-line-center-226"></div>
            <div class="sst-footer-line-226 sst-line-right-226"></div>
          </div>
        </div>
      </div>

      <!-- 进度指示器 -->
      <div class="sst-progress-226">
        <div class="sst-progress-bar-226">
          <div class="sst-progress-fill-226" ref="progressFill"></div>
        </div>
        <div class="sst-progress-dots-226">
          <div
            v-for="(chapter, index) in chapters"
            :key="index"
            class="sst-progress-dot-226"
            :class="{ active: activeChapter >= index }"
            @click="scrollToChapter(index)"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const progressFill = ref(null)
const activeChapter = ref(0)

// 故事章节数据
const chapters = [
  {
    title: '启程',
    text: '在时间的长河中，每一次开始都孕育着无限可能。当我们踏上这段旅程，仿佛穿越了无垠的星空，在宇宙的边缘凝望未知的世界。这一刻，所有的束缚都被打破，心灵在自由的维度中翱翔。',
    quote: '所有的旅程，都始于第一步',
    shape: 'circle',
    visualGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    title: '探索',
    text: '深入未知的领域，我们发现世界的奇妙。每一个角落都隐藏着惊喜，每一次探索都带来新的启示。从微观的粒子到宏观的星系，从深邃的海洋到高耸的山峰，探索永无止境。',
    quote: '探索未知，就是探索自己',
    shape: 'star',
    visualGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    title: '发现',
    text: '当我们用心去观察，发现原来美好无处不在。在平凡的日子里，也能找到不平凡的瞬间。一朵花的绽放，一缕阳光的温暖，都是宇宙对我们最温柔的礼物。',
    quote: '最美的风景，就在心间',
    shape: 'hexagon',
    visualGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    title: '挑战',
    text: '生命中总有高山需要攀登，总有困难需要克服。每一次挑战都是成长的契机，每一次克服都让我们更强大。不是所有的路都平坦，但每一步都值得。',
    quote: '困难，是成长的阶梯',
    shape: 'triangle',
    visualGradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    title: '成长',
    text: '经历过风雨，我们变得更加坚韧。曾经的困惑逐渐清晰，曾经的迷茫找到方向。成长不仅仅是年龄的增长，更是心灵的蜕变和智慧的积累。',
    quote: '成长，是岁月最好的馈赠',
    shape: 'diamond',
    visualGradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  },
  {
    title: '领悟',
    text: '当一切沉淀下来，我们终于领悟生命的真谛。重要的不是目的地，而是沿途的风景和内心的成长。每一段经历都是财富，每一次感悟都是升华。',
    quote: '生命的意义，在于过程',
    shape: 'heart',
    visualGradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  }
]

const scrollToChapter = (index) => {
  const chapter = document.querySelector(`.sst-chapter-${index}`)
  if (chapter) {
    chapter.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const initScrollAnimations = () => {
  // 背景渐变层动画
  gsap.to('.sst-layer-1-226', {
    scrollTrigger: {
      trigger: '.sst-scroll-storytelling-226',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1
    },
    y: -200,
    ease: 'none'
  })

  gsap.to('.sst-layer-2-226', {
    scrollTrigger: {
      trigger: '.sst-scroll-storytelling-226',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1
    },
    y: -400,
    ease: 'none'
  })

  gsap.to('.sst-layer-3-226', {
    scrollTrigger: {
      trigger: '.sst-scroll-storytelling-226',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1
    },
    y: -600,
    ease: 'none'
  })

  // 标题入场动画
  gsap.from('.sst-story-title-226', {
    scrollTrigger: {
      trigger: '.sst-story-header-226',
      start: 'top 80%',
      end: 'top 60%',
      scrub: 1
    },
    y: -100,
    opacity: 0,
    scale: 0.8,
    ease: 'power4.out'
  })

  gsap.from('.sst-story-subtitle-226', {
    scrollTrigger: {
      trigger: '.sst-story-header-226',
      start: 'top 75%',
      end: 'top 55%',
      scrub: 1
    },
    y: 50,
    opacity: 0,
    ease: 'power4.out'
  })

  // 滚动指示器淡出
  gsap.to('.sst-scroll-indicator-226', {
    scrollTrigger: {
      trigger: '.sst-story-header-226',
      start: 'top 60%',
      end: 'top 30%',
      scrub: 1
    },
    opacity: 0,
    y: -30,
    ease: 'power2.in'
  })

  // 章节动画
  chapters.forEach((chapter, index) => {
    const chapterEl = `.sst-chapter-${index}`

    // 视觉框入场动画
    gsap.from(`${chapterEl} .sst-visual-frame-226`, {
      scrollTrigger: {
        trigger: chapterEl,
        start: 'top 80%',
        end: 'top 60%',
        scrub: 1
      },
      x: -80,
      opacity: 0,
      scale: 0.8,
      rotateY: -15,
      ease: 'power4.out'
    })

    // 内容入场动画
    gsap.from(`${chapterEl} .sst-content-226`, {
      scrollTrigger: {
        trigger: chapterEl,
        start: 'top 80%',
        end: 'top 60%',
        scrub: 1
      },
      x: 80,
      opacity: 0,
      scale: 0.9,
      ease: 'power4.out'
    })

    // 章节标题动画
    gsap.from(`${chapterEl} .sst-chapter-title-226`, {
      scrollTrigger: {
        trigger: chapterEl,
        start: 'top 70%',
        end: 'top 50%',
        scrub: 1
      },
      y: -40,
      opacity: 0,
      ease: 'power3.out'
    })

    // 分割线动画
    gsap.from(`${chapterEl} .sst-chapter-divider-226`, {
      scrollTrigger: {
        trigger: chapterEl,
        start: 'top 65%',
        end: 'top 45%',
        scrub: 1
      },
      width: 0,
      ease: 'power3.out'
    })

    // 文本逐行显示
    gsap.from(`${chapterEl} .sst-chapter-text-226`, {
      scrollTrigger: {
        trigger: chapterEl,
        start: 'top 60%',
        end: 'top 40%',
        scrub: 1
      },
      y: 30,
      opacity: 0,
      ease: 'power3.out'
    })

    // 引用动画
    gsap.from(`${chapterEl} .sst-chapter-quote-226`, {
      scrollTrigger: {
        trigger: chapterEl,
        start: 'top 55%',
        end: 'top 35%',
        scrub: 1
      },
      y: 20,
      opacity: 0,
      scale: 0.9,
      ease: 'elastic.out(1, 0.6)'
    })

    // 视觉形状旋转动画
    gsap.to(`${chapterEl} .sst-visual-shape-226`, {
      scrollTrigger: {
        trigger: chapterEl,
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: 0.5
      },
      rotation: 360,
      ease: 'none'
    })

    // 粒子动画
    gsap.to(`${chapterEl} .sst-particle-226`, {
      scrollTrigger: {
        trigger: chapterEl,
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: 0.5
      },
      y: (i) => (i + 1) * -30,
      x: (i) => (i % 2 === 0 ? -20 : 20),
      opacity: 0.3,
      ease: 'none',
      stagger: 0.05
    })

    // 更新活动章节
    gsap.to({}, {
      scrollTrigger: {
        trigger: chapterEl,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => {
          activeChapter.value = index
        },
        onEnterBack: () => {
          activeChapter.value = index
        }
      }
    })
  })

  // 章节视差效果
  gsap.to('.sst-visual-226', {
    scrollTrigger: {
      trigger: '.sst-chapters-226',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 0.5
    },
    y: (index) => {
      return index * 50
    },
    ease: 'none'
  })

  // 内容视差效果
  gsap.to('.sst-content-226', {
    scrollTrigger: {
      trigger: '.sst-chapters-226',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 0.5
    },
    y: (index) => {
      return index * -30
    },
    ease: 'none'
  })

  // 进度条动画
  gsap.to('.sst-progress-fill-226', {
    scrollTrigger: {
      trigger: '.sst-scroll-storytelling-226',
      start: 'top 10%',
      end: 'bottom 10%',
      scrub: 0.5,
      onUpdate: (self) => {
        if (progressFill.value) {
          progressFill.value.style.width = `${self.progress * 100}%`
        }
      }
    },
    ease: 'none'
  })

  // 故事结尾动画
  gsap.from('.sst-footer-title-226', {
    scrollTrigger: {
      trigger: '.sst-story-footer-226',
      start: 'top 80%',
      end: 'top 60%',
      scrub: 1
    },
    y: -60,
    opacity: 0,
    scale: 0.8,
    ease: 'power4.out'
  })

  gsap.from('.sst-footer-text-226', {
    scrollTrigger: {
      trigger: '.sst-story-footer-226',
      start: 'top 75%',
      end: 'top 55%',
      scrub: 1
    },
    y: 40,
    opacity: 0,
    ease: 'power4.out'
  })

  gsap.from('.sst-footer-line-226', {
    scrollTrigger: {
      trigger: '.sst-story-footer-226',
      start: 'top 70%',
      end: 'top 50%',
      scrub: 1
    },
    width: 0,
    stagger: 0.2,
    ease: 'power3.out'
  })
}

onMounted(() => {
  initScrollAnimations()
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.sst-scroll-storytelling-226 {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: #0a0a0f;

  opacity: 1 !important;}

/* 背景层 */
.sst-background-226 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  opacity: 1 !important;}

.sst-gradient-layer-226 {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.15;
}

.sst-layer-1-226 {
  background: radial-gradient(circle at 20% 30%, #667eea 0%, transparent 50%);

  opacity: 1 !important;}

.sst-layer-2-226 {
  background: radial-gradient(circle at 80% 70%, #f093fb 0%, transparent 50%);

  opacity: 1 !important;}

.sst-layer-3-226 {
  background: radial-gradient(circle at 50% 50%, #4facfe 0%, transparent 50%);

  opacity: 1 !important;}

.sst-container-226 {
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 20px;
  position: relative;
  z-index: 10;

  opacity: 1 !important;}

/* 故事标题 */
.sst-story-header-226 {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;

  opacity: 1 !important;}

.sst-story-title-226 {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  letter-spacing: 0.1em;
  animation: gradient-shift 8s ease infinite;

  opacity: 1 !important;}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% center; }
  50% { background-position: 200% center; }
}

.sst-story-subtitle-226 {
  font-size: clamp(1.2rem, 3vw, 2rem);
  color: #a0a0b0;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  font-weight: 300;

  opacity: 1 !important;}

.sst-scroll-indicator-226 {
  position: absolute;
  bottom: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.sst-scroll-text-226 {
  color: #666;
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

.sst-scroll-arrow-226 {
  font-size: 2rem;
  color: #667eea;
  animation: scroll-bounce 2s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes scroll-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
}

/* 章节容器 */
.sst-chapters-226 {
  padding: 100px 0;

  opacity: 1 !important;}

.sst-chapter-226 {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 80px;
  margin: 100px 0;
  padding: 60px 40px;

  opacity: 1 !important;}

.sst-chapter-226:nth-child(even) {
  flex-direction: row-reverse;
}

/* 视觉元素 */
.sst-visual-226 {
  flex: 0 0 45%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sst-visual-frame-226 {
  width: 400px;
  height: 400px;
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 30px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  overflow: visible;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);

  opacity: 1 !important;}

.sst-visual-content-226 {
  width: 100%;
  height: 100%;
  border-radius: 28px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.sst-visual-shape-226 {
  width: 200px;
  height: 200px;
  position: relative;

  opacity: 1 !important;}

.sst-shape-circle {
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 60px rgba(255, 255, 255, 0.3);

  opacity: 1 !important;}

.sst-shape-star {
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 60px rgba(255, 255, 255, 0.3);

  opacity: 1 !important;}

.sst-shape-hexagon {
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 60px rgba(255, 255, 255, 0.3);

  opacity: 1 !important;}

.sst-shape-triangle {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 60px rgba(255, 255, 255, 0.3);

  opacity: 1 !important;}

.sst-shape-diamond {
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 60px rgba(255, 255, 255, 0.3);

  opacity: 1 !important;}

.sst-shape-heart {
  clip-path: path('M 100 20 C 100 20, 20 20, 20 70 C 20 130, 100 180, 100 180 C 100 180, 180 130, 180 70 C 180 20, 100 20, 100 20 Z');
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 60px rgba(255, 255, 255, 0.3);

  opacity: 1 !important;}

.sst-visual-particles-226 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.sst-particle-226 {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  top: 50%;
  left: 50%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);

  opacity: 1 !important;}

.sst-chapter-number-226 {
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0.5;
}

/* 章节内容 */
.sst-content-226 {
  flex: 0 0 55%;
}

.sst-content-inner-226 {
  padding: 40px;

  opacity: 1 !important;}

.sst-chapter-title-226 {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  background: linear-gradient(135deg, #fff 0%, #a0a0b0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  letter-spacing: 0.05em;

  opacity: 1 !important;}

.sst-chapter-divider-226 {
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #667eea, #f093fb, transparent);
  margin-bottom: 30px;
  border-radius: 2px;

  opacity: 1 !important;}

.sst-chapter-text-226 {
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  line-height: 2;
  color: #b0b0c0;
  margin-bottom: 30px;
  letter-spacing: 0.02em;

  opacity: 1 !important;}

.sst-chapter-quote-226 {
  font-size: 1.2rem;
  font-style: italic;
  color: #d0d0e0;
  padding: 20px 0;
  border-left: 3px solid #667eea;
  padding-left: 20px;
  position: relative;

  opacity: 1 !important;}

.sst-quote-mark-226 {
  font-size: 3rem;
  position: absolute;
  top: -10px;
  left: -15px;
  color: #667eea;
  opacity: 0.3;
}

/* 故事结尾 */
.sst-story-footer-226 {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 20px;

  opacity: 1 !important;}

.sst-footer-content-226 {
  max-width: 800px;

  opacity: 1 !important;}

.sst-footer-title-226 {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;

  opacity: 1 !important;}

.sst-footer-text-226 {
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  color: #a0a0b0;
  letter-spacing: 0.1em;

  opacity: 1 !important;}

.sst-footer-decoration-226 {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

.sst-footer-line-226 {
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #667eea, transparent);

  opacity: 1 !important;}

/* 进度指示器 */
.sst-progress-226 {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  z-index: 100;
  padding: 20px;

  opacity: 1 !important;}

.sst-progress-bar-226 {
  width: 300px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;

  opacity: 1 !important;}

.sst-progress-fill-226 {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #667eea, #f093fb);
  border-radius: 2px;
  transition: width 0.1s ease;

  opacity: 1 !important;}

.sst-progress-dots-226 {
  display: flex;
  gap: 10px;
}

.sst-progress-dot-226 {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.sst-progress-dot-226:hover {
  background: rgba(102, 126, 234, 0.5);
  transform: scale(1.3);
}

.sst-progress-dot-226.active {
  background: #667eea;
  box-shadow: 0 0 15px rgba(102, 126, 234, 0.5);
  transform: scale(1.3);

  opacity: 1 !important;}

/* 响应式设计 */
@media (max-width: 1024px) {
  .sst-chapter-226 {
    flex-direction: column !important;
    gap: 40px;
  }

  .sst-visual-226,
  .sst-content-226 {
    flex: 0 0 100%;
  }

  .sst-visual-frame-226 {
    width: 300px;
    height: 300px;
  
  opacity: 1 !important;}

  .sst-visual-shape-226 {
    width: 150px;
    height: 150px;
  
  opacity: 1 !important;}
}

@media (max-width: 768px) {
  .sst-container-226 {
    padding: 40px 15px;
  
  opacity: 1 !important;}

  .sst-chapter-226 {
    padding: 40px 20px;
    margin: 60px 0;
  
  opacity: 1 !important;}

  .sst-visual-frame-226 {
    width: 250px;
    height: 250px;
  
  opacity: 1 !important;}

  .sst-visual-shape-226 {
    width: 120px;
    height: 120px;
  
  opacity: 1 !important;}

  .sst-content-inner-226 {
    padding: 20px;
  
  opacity: 1 !important;}

  .sst-progress-bar-226 {
    width: 200px;
  
  opacity: 1 !important;}

  .sst-progress-dot-226 {
    width: 8px;
    height: 8px;
  
  opacity: 1 !important;}

  .sst-footer-title-226 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .sst-footer-text-226 {
    font-size: 1.2rem;
  
  opacity: 1 !important;}
}
</style>
