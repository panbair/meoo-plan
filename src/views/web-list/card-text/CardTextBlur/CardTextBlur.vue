<template>
  <div class="stb-section-104" ref="sectionRef">
    <div class="stb-header-104" ref="headerRef">
      <h2 class="stb-title-104" ref="titleRef">文字模糊揭示动画</h2>
      <p class="stb-desc-104" ref="descRef">流畅的文字模糊揭示效果</p>
    </div>
    <div class="stb-content-104" ref="contentRef">
      <p 
        v-for="(text, index) in paragraphs" 
        :key="index" 
        class="stb-paragraph-104"
        :ref="el => setParagraphRef(el, index)"
      >
        {{ text }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

ScrollTrigger.config({
  ignoreMobileResize: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
})

// 唯一后缀: 104

// ref 获取 DOM
const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const descRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const paragraphRefs = ref<(HTMLElement | null)[]>([])
const paragraphSet = new Set<HTMLElement>()

// 段落内容
const paragraphs = [
  '使用 GSAP ScrollTrigger 创建令人惊叹的滚动动画。当元素进入视口时，它们会以优雅的方式呈现给用户，创造出流畅的视觉体验。',
  '每一个元素都可以有独特的进入方式：从淡入、缩放、旋转到复杂的复合动画。关键是要选择合适的效果，确保动画既美观又不会分散用户的注意力。',
  '通过精心设计的动画，你可以引导用户的注意力，创造层次感，并让整个页面感觉更加生动和精致。'
]

// 设置段落 ref
const setParagraphRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    paragraphRefs.value[index] = el
    paragraphSet.add(el)
  }
}

// 清理函数类型
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

let ctx: gsap.Context | null = null

onMounted(() => {
  const rootEl = sectionRef.value
  if (!rootEl) return

  ctx = gsap.context(() => {
    // 标题动画 - 模糊揭示
    if (titleRef.value) {
      const titleTl = gsap.fromTo(titleRef.value,
        { y: 120, opacity: 0, scale: 0.8, filter: 'blur(20px)' },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.value || rootEl,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1.5
          }
        }
      )
      cleanupFns.push(() => titleTl.kill())
    }

    // 描述动画 - 模糊揭示
    if (descRef.value) {
      const descTl = gsap.fromTo(descRef.value,
        { y: 80, opacity: 0, scale: 0.9, filter: 'blur(15px)' },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.value || rootEl,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1.5
          }
        }
      )
      cleanupFns.push(() => descTl.kill())
    }

    // 段落模糊揭示动画
    const validParagraphs = paragraphRefs.value.filter(Boolean)
    validParagraphs.forEach((el) => {
      if (!el) return
      
      const paragraphTl = gsap.fromTo(el,
        {
          y: 150,
          opacity: 0,
          filter: 'blur(25px)',
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1.5
          }
        }
      )
      cleanupFns.push(() => paragraphTl.kill())
    })

    // 段落交错滑入效果
    if (contentRef.value && validParagraphs.length > 0) {
      const contentTl = gsap.fromTo(validParagraphs,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: contentRef.value,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1.5
          }
        }
      )
      cleanupFns.push(() => contentTl.kill())
    }
  }, rootEl)
})

onUnmounted(() => {
  // 清理所有保存的 tween
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  
  // 清理 gsap.context
  ctx?.revert()
  ctx = null
  
  // 清理属于当前组件的 ScrollTrigger
  ScrollTrigger.getAll().forEach(st => {
    const trigger = st.vars.trigger
    if (trigger && typeof trigger === 'object' && paragraphSet.has(trigger as HTMLElement)) {
      st.kill()
    }
  })
  
  // 清理 ref
  paragraphRefs.value = []
  paragraphSet.clear()
})
</script>

<style scoped>
.stb-section-104 {
  padding: 100px 20px;
  background: linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(25, 25, 65, 0.9) 100%);
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.stb-section-104::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(120, 80, 200, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(80, 150, 220, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.stb-header-104 {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 1;
}

.stb-title-104 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(240, 147, 251, 0.3);
}

.stb-desc-104 {
  font-size: 1.2rem;
  color: #a0aec0;
  font-weight: 300;
  letter-spacing: 0.05em;
}

.stb-content-104 {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.stb-paragraph-104 {
  font-size: 1.25rem;
  line-height: 2;
  color: #e2e8f0;
  margin-bottom: 32px;
  text-align: justify;
  padding: 24px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.stb-paragraph-104:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateX(8px);
}
</style>
