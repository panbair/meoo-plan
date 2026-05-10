<template>
  <div class="sft-fluid-text-section-148" ref="componentRoot">
    <div class="sft-container-148">
      <h2 class="sft-title-148">流体文字效果</h2>
      <p class="sft-subtitle-148">Fluid Text Effect</p>

      <div class="sft-text-display-148">
        <div class="sft-text-wrapper-148" ref="textWrapper">
          <h3 class="sft-fluid-text-148" ref="fluidText">CREATIVE</h3>
        </div>
        <div class="sft-text-wrapper-148" ref="textWrapper2">
          <h3 class="sft-fluid-text-148" ref="fluidText2">DESIGN</h3>
        </div>
        <div class="sft-text-wrapper-148" ref="textWrapper3">
          <h3 class="sft-fluid-text-148" ref="fluidText3">INNOVATION</h3>
        </div>
      </div>

      <div class="sft-particles-148">
        <div class="sft-particle-148" v-for="i in 20" :key="i" :style="{
          '--delay': `${i * 0.1}s`,
          '--particle-left': `${Math.random() * 100}%`,
          '--particle-top': `${Math.random() * 100}%`
        }"></div>
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
const textWrapper = ref<HTMLElement>()
const textWrapper2 = ref<HTMLElement>()
const textWrapper3 = ref<HTMLElement>()
const fluidText = ref<HTMLElement>()
const fluidText2 = ref<HTMLElement>()
const fluidText3 = ref<HTMLElement>()

let ctx: gsap.Context

onMounted(() => {
  // 使用 nextTick 确保 DOM 完全渲染
  setTimeout(() => {
    if (!componentRoot.value) return
    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.sft-title-148', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.sft-subtitle-148', componentRoot.value)
      const particleEl = gsap.utils.toArray<HTMLElement>('.sft-particle-148', componentRoot.value)
      const textWrapperEl = gsap.utils.toArray<HTMLElement>('.sft-text-wrapper-148', componentRoot.value)
      const particlesContainer = gsap.utils.toArray<HTMLElement>('.sft-particles-148', componentRoot.value)
      const textDisplay = gsap.utils.toArray<HTMLElement>('.sft-text-display-148', componentRoot.value)

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

      // 副标题动画
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

    // 流体文字效果 - 每个字符独立动画
    const texts = [fluidText.value, fluidText2.value, fluidText3.value]

    texts.forEach((text, textIndex) => {
      if (!text) return

      const chars = text.textContent?.split('').map(char => {
        const span = document.createElement('span')
        span.textContent = char
        span.className = 'sft-char-148'
        span.style.display = 'inline-block'
        return span
      })

      if (chars) {
        text.innerHTML = ''
        chars.forEach(char => text.appendChild(char))

        // 初始状态
        gsap.set(chars, {
          y: 100,
          opacity: 0,
          scale: 0.5,
          rotation: gsap.utils.random(-30, 30)
        })

        // 滚动触发的流体动画
        gsap.to(chars, {
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1.5,
          ease: 'elastic.out(1, 0.5)',
          stagger: {
            each: 0.05,
            from: 'random'
          },
          scrollTrigger: {
            trigger: `.sft-text-wrapper-148:nth-child(${textIndex + 1})`,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        })

        // 滚动时的波浪效果
        gsap.to(chars, {
          y: (i) => Math.sin((i / chars.length) * Math.PI * 2 + textIndex) * 30,
          duration: 2,
          ease: 'sine.inOut',
          scrollTrigger: {
            trigger: `.sft-text-wrapper-148:nth-child(${textIndex + 1})`,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1
          }
        })

        // 悬停效果 - 扭曲变形
        text.addEventListener('mouseenter', () => {
          gsap.to(chars, {
            scale: (i) => 1 + Math.sin((i / chars.length) * Math.PI * 4) * 0.3,
            rotation: (i) => Math.sin((i / chars.length) * Math.PI * 2) * 15,
            duration: 0.5,
            ease: 'power2.out'
          })
        })

        text.addEventListener('mouseleave', () => {
          gsap.to(chars, {
            scale: 1,
            rotation: 0,
            duration: 0.5,
            ease: 'power2.out'
          })
        })
      }
    })

      // 粒子动画
      if (particleEl.length && particlesContainer.length) {
        gsap.from(particleEl, {
          scrollTrigger: {
            trigger: particlesContainer[0],
            start: 'top 90%'
          },
          scale: 0,
          opacity: 0,
          duration: 1,
          ease: 'back.out(1.7)',
          stagger: {
            each: 0.1,
            from: 'random'
          }
        })

        // 粒子漂浮
        gsap.to(particleEl, {
          y: 'random(-100, 100)',
          x: 'random(-50, 50)',
          duration: 'random(3, 6)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: {
            each: 0.2,
            from: 'random'
          }
        })
      }

      // 文字容器视差
      if (textWrapperEl.length && textDisplay.length) {
        gsap.to(textWrapperEl, {
          y: (i) => (i % 2 === 0 ? -80 : 80),
          scrollTrigger: {
            trigger: textDisplay[0],
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
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
.sft-fluid-text-section-148 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a2a 100%);
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
      radial-gradient(circle at 20% 30%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.sft-container-148 {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.sft-title-148 {
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

.sft-subtitle-148 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 80px;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

.sft-text-display-148 {
  display: flex;
  flex-direction: column;
  gap: 60px;
  perspective: 2000px;
}

.sft-text-wrapper-148 {
  text-align: center;
  perspective: 1000px;

  opacity: 1 !important;}

.sft-fluid-text-148 {
  font-size: clamp(3rem, 8vw, 8rem);
  font-weight: 900;
  color: #fff;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  position: relative;
  cursor: pointer;
  display: inline-block;

  text-shadow:
    0 0 20px rgba(236, 72, 153, 0.5),
    0 0 40px rgba(168, 85, 247, 0.3),
    0 0 60px rgba(96, 165, 250, 0.2);

  .sft-char-148 {
    transition: text-shadow 0.3s ease;
    will-change: transform;

    &:hover {
      text-shadow:
        0 0 30px rgba(236, 72, 153, 0.8),
        0 0 60px rgba(168, 85, 247, 0.6),
        0 0 90px rgba(96, 165, 250, 0.4);
    
  opacity: 1 !important;}
  }
}

.sft-particles-148 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.sft-particle-148 {
  position: absolute;
  width: 6px;
  height: 6px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.8), transparent);
  border-radius: 50%;
  left: var(--particle-left);
  top: var(--particle-top);
  animation: float var(--delay) ease-in-out infinite;

  opacity: 1 !important;}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-30px) scale(1.5);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .sft-fluid-text-148 {
    font-size: clamp(2rem, 7vw, 4rem);
  
  opacity: 1 !important;}

  .sft-text-display-148 {
    gap: 40px;
  }

  .sft-container-148 {
    padding: 0 20px;
  
  opacity: 1 !important;}
}
</style>
