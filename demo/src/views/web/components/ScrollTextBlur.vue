<template>
  <div class="stb-section-104">
    <div class="stb-header-104">
      <h2 class="stb-title-104">文字动画效果</h2>
      <p class="stb-desc-104">流畅的文字揭示动画</p>
    </div>
    <div class="stb-content-104">
      <p class="stb-paragraph-104">
        使用 GSAP ScrollTrigger 创建令人惊叹的滚动动画。当元素进入视口时，它们会以优雅的方式呈现给用户，创造出流畅的视觉体验。
      </p>
      <p class="stb-paragraph-104">
        每一个元素都可以有独特的进入方式：从淡入、缩放、旋转到复杂的复合动画。关键是要选择合适的效果，确保动画既美观又不会分散用户的注意力。
      </p>
      <p class="stb-paragraph-104">
        通过精心设计的动画，你可以引导用户的注意力，创造层次感，并让整个页面感觉更加生动和精致。
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

ScrollTrigger.config({
  ignoreMobileResize: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
})

let ctx: gsap.Context | null = null

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.fromTo('.stb-title-104, .stb-desc-104',
      { y: 120, opacity: 0, scale: 0.8 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.stb-header-104',
          start: 'top 90%'
        }
      }
    )

    gsap.utils.toArray('.stb-paragraph-104').forEach((el, index) => {
      gsap.fromTo(el as HTMLElement,
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
          delay: index * 0.2,
          scrollTrigger: {
            trigger: el as HTMLElement,
            start: 'top 85%'
          }
        }
      )
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
.stb-section-104 {
  padding: 100px 20px;
  background: rgba(0, 0, 0, 0.1);
}

.stb-header-104 {
  text-align: center;
  margin-bottom: 60px;
}

.stb-title-104 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stb-desc-104 {
  font-size: 1.2rem;
  color: #a0aec0;
  font-weight: 300;
}

.stb-content-104 {
  max-width: 900px;
  margin: 0 auto;
}

.stb-paragraph-104 {
  font-size: 1.25rem;
  line-height: 2;
  color: #e2e8f0;
  margin-bottom: 32px;
  text-align: justify;
}
</style>
