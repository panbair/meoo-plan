<template>
  <div class="sfe-fold-effect-section-153" ref="componentRoot">
    <div class="sfe-container-153">
      <h2 class="sfe-title-153">折叠效果</h2>
      <p class="sfe-subtitle-153">Fold Effect Animation</p>

      <div class="sfe-fold-wrapper-153">
        <div
          v-for="(item, index) in foldItems"
          :key="index"
          class="sfe-fold-item-153"
          :class="`sfe-fold-${index + 1}-153`"
          @mouseenter="handleFoldEnter"
          @mouseleave="handleFoldLeave"
        >
          <div class="sfe-fold-front-153">
            <div class="sfe-front-content-153">
              <div class="sfe-fold-number-153">{{ String(index + 1).padStart(2, '0') }}</div>
              <h3 class="sfe-fold-title-153">{{ item.title }}</h3>
              <p class="sfe-fold-desc-153">{{ item.description }}</p>
            </div>
          </div>
          <div class="sfe-fold-back-153">
            <div class="sfe-back-content-153">
              <div class="sfe-back-icon-153">{{ item.icon }}</div>
              <h4 class="sfe-back-title-153">{{ item.title }}</h4>
              <p class="sfe-back-text-153">{{ item.detail }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="sfe-fold-lines-153">
        <div class="sfe-line-153 sfe-line-1-153"></div>
        <div class="sfe-line-153 sfe-line-2-153"></div>
        <div class="sfe-line-153 sfe-line-3-153"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()

interface FoldItem {
  title: string
  description: string
  icon: string
  detail: string
}

const foldItems = ref<FoldItem[]>([
  {
    title: '折叠',
    description: '优雅的折叠动画',
    icon: '📄',
    detail: '通过精妙的折叠效果，创造出富有层次的视觉体验。'
  },
  {
    title: '展开',
    description: '流畅的展开效果',
    icon: '📂',
    detail: '自然的展开动画，让内容以优雅的方式呈现。'
  },
  {
    title: '翻转',
    description: '动态的翻转效果',
    icon: '🔄',
    detail: '平滑的翻转过渡，带来令人惊艳的交互体验。'
  }
])

let activeFold: HTMLElement | null = null

const handleFoldEnter = (event: MouseEvent) => {
  activeFold = event.currentTarget as HTMLElement

  gsap.to(activeFold, {
    rotateY: 180,
    duration: 0.8,
    ease: 'back.out(1.2)'
  })

  gsap.to(activeFold, {
    scale: 1.05,
    boxShadow: '0 25px 60px rgba(236, 72, 153, 0.25)',
    duration: 0.5,
    ease: 'power2.out'
  })
}

const handleFoldLeave = () => {
  if (!activeFold) return

  gsap.to(activeFold, {
    rotateY: 0,
    duration: 0.8,
    ease: 'back.out(1.2)'
  })

  gsap.to(activeFold, {
    scale: 1,
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
    duration: 0.5,
    ease: 'power2.out'
  })

  activeFold = null
}

let ctx: gsap.Context

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return
    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.sfe-title-153', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.sfe-subtitle-153', componentRoot.value)
      const foldItems = gsap.utils.toArray<HTMLElement>('.sfe-fold-item-153', componentRoot.value)
      const foldWrapper = gsap.utils.toArray<HTMLElement>('.sfe-fold-wrapper-153', componentRoot.value)
      const frontContents = gsap.utils.toArray<HTMLElement>('.sfe-front-content-153', componentRoot.value)
      const foldNumbers = gsap.utils.toArray<HTMLElement>('.sfe-fold-number-153', componentRoot.value)
      const foldTitles = gsap.utils.toArray<HTMLElement>('.sfe-fold-title-153', componentRoot.value)
      const foldDescs = gsap.utils.toArray<HTMLElement>('.sfe-fold-desc-153', componentRoot.value)
      const backContents = gsap.utils.toArray<HTMLElement>('.sfe-back-content-153', componentRoot.value)
      const lines = gsap.utils.toArray<HTMLElement>('.sfe-line-153', componentRoot.value)
      const foldLines = gsap.utils.toArray<HTMLElement>('.sfe-fold-lines-153', componentRoot.value)

      // 标题动画
      if (titleEl.length) {
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        })
      }

      if (subtitleEl.length) {
        gsap.from(subtitleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          y: 40,
          opacity: 0,
          duration: 1,
          delay: 0.2,
          ease: 'power3.out'
        })
      }

      // 折叠项目入场
      if (foldItems.length && foldWrapper.length) {
        gsap.from(foldItems, {
          scrollTrigger: {
            trigger: foldWrapper[0],
            start: 'top 85%'
          },
          y: 150,
          opacity: 0,
          rotateX: -60,
          rotateY: 0,
          duration: 1.2,
          ease: 'back.out(1.5)',
          stagger: 0.2
        })

        // 折叠视差效果
        gsap.to(foldItems, {
          y: (i) => (i % 2 === 0 ? -30 : 30),
          scrollTrigger: {
            trigger: foldWrapper[0],
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        })
      }

      // 前面内容淡入
      if (frontContents.length) {
        gsap.from(frontContents, {
          scrollTrigger: {
            trigger: foldWrapper[0] || componentRoot.value,
            start: 'top 80%'
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.2
        })
      }

      // 数字动画
      if (foldNumbers.length) {
        gsap.from(foldNumbers, {
          scrollTrigger: {
            trigger: foldWrapper[0] || componentRoot.value,
            start: 'top 80%'
          },
          scale: 0,
          rotation: -180,
          duration: 0.8,
          ease: 'back.out(1.7)',
          stagger: 0.2
        })
      }

      // 标题文字淡入
      if (foldTitles.length) {
        gsap.from(foldTitles, {
          scrollTrigger: {
            trigger: foldWrapper[0] || componentRoot.value,
            start: 'top 80%'
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.2
        })
      }

      if (foldDescs.length) {
        gsap.from(foldDescs, {
          scrollTrigger: {
            trigger: foldWrapper[0] || componentRoot.value,
            start: 'top 80%'
          },
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.2,
          delay: 0.1
        })
      }

      // 背面内容初始隐藏
      if (backContents.length) {
        gsap.set(backContents, {
          opacity: 0,
          scale: 0.8
        })
      }

      // 折叠线条动画
      if (lines.length && foldLines.length) {
        gsap.from(lines, {
          scrollTrigger: {
            trigger: foldLines[0],
            start: 'top 90%'
          },
          scaleX: 0,
          opacity: 0,
          duration: 1.5,
          ease: 'power2.out',
          stagger: 0.3
        })

        // 线条持续动画
        gsap.to(lines, {
          scaleX: (i) => (i % 2 === 0 ? 0.5 : 1.5),
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: 0.5
        })
      }
    }, componentRoot.value)
  }, 100)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.sfe-fold-effect-section-153 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%);
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
      radial-gradient(circle at 25% 35%, rgba(236, 72, 153, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 75% 65%, rgba(168, 85, 247, 0.08) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.sfe-container-153 {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.sfe-title-153 {
  text-align: center;
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #f472b6, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.sfe-subtitle-153 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 80px;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

.sfe-fold-wrapper-153 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 40px;
  perspective: 2000px;
}

.sfe-fold-item-153 {
  position: relative;
  height: 450px;
  cursor: pointer;
  perspective: 1500px;
  transform-style: preserve-3d;
  transition: box-shadow 0.5s ease;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);

  opacity: 1 !important;}

.sfe-fold-front-153,
.sfe-fold-back-153 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 40px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.sfe-fold-back-153 {
  transform: rotateY(180deg);
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(168, 85, 247, 0.15));

  opacity: 1 !important;}

.sfe-front-content-153,
.sfe-back-content-153 {
  text-align: center;
  width: 100%;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.sfe-fold-number-153 {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 2.5rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.2);
  font-family: monospace;
  transition: all 0.4s ease;

  opacity: 1 !important;}

.sfe-fold-title-153 {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
  letter-spacing: 0.05em;

  opacity: 1 !important;}

.sfe-fold-desc-153 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;

  opacity: 1 !important;}

.sfe-back-icon-153 {
  font-size: 4rem;
  margin-bottom: 20px;

  opacity: 1 !important;}

.sfe-back-title-153 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;

  opacity: 1 !important;}

.sfe-back-text-153 {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;

  opacity: 1 !important;}

.sfe-fold-lines-153 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.sfe-line-153 {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.3), transparent);
  opacity: 0.3;
}

.sfe-line-1-153 {
  top: 30%;
  left: 10%;
  right: 10%;
  width: 80%;

  opacity: 1 !important;}

.sfe-line-2-153 {
  top: 50%;
  left: 5%;
  right: 5%;
  width: 90%;

  opacity: 1 !important;}

.sfe-line-3-153 {
  top: 70%;
  left: 10%;
  right: 10%;
  width: 80%;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .sfe-fold-wrapper-153 {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .sfe-fold-item-153 {
    height: 400px;
  
  opacity: 1 !important;}

  .sfe-fold-front-153,
  .sfe-fold-back-153 {
    padding: 30px;
  
  opacity: 1 !important;}

  .sfe-fold-title-153 {
    font-size: 1.5rem;
  
  opacity: 1 !important;}

  .sfe-back-icon-153 {
    font-size: 3rem;
  
  opacity: 1 !important;}
}
</style>
