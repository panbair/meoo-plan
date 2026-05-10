<template>
  <div class="stce-text-cascade-effect-section-183" ref="componentRoot">
    <div class="stce-container-183">
      <h2 class="stce-title-183">文字级联效果</h2>
      <p class="stce-subtitle-183">Text Cascade Effect</p>

      <div class="stce-text-blocks-183">
        <div
          v-for="(block, index) in textBlocks"
          :key="index"
          class="stce-text-block-183"
          :ref="el => { if (el) blockRefs[index] = el as HTMLElement }"
        >
          <div class="stce-block-header-183">
            <span class="stce-block-number-183">{{ String(index + 1).padStart(2, '0') }}</span>
            <div class="stce-block-line-183"></div>
          </div>
          <h3 class="stce-block-title-183">{{ block.title }}</h3>
          <p class="stce-block-text-183">{{ block.text }}</p>
        </div>
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
const blockRefs = ref<HTMLElement[]>([])

interface TextBlock {
  title: string
  text: string
}

const textBlocks: TextBlock[] = [
  {
    title: '优雅的级联',
    text: 'Cascading animations create a sense of flow and rhythm, guiding the viewer through content with graceful transitions.'
  },
  {
    title: '动态的节奏',
    text: 'Dynamic timing transforms static text into an engaging narrative experience, building anticipation with each letter.'
  },
  {
    title: '视觉的流动',
    text: 'Visual flow ensures seamless transitions between elements, creating a cohesive and immersive reading experience.'
  },
  {
    title: '自然的递进',
    text: 'Natural progression from one element to the next maintains interest while delivering information effectively.'
  }
]

let gsapCtx: gsap.Context

onMounted(() => {
  if (!componentRoot.value) return

  gsapCtx = gsap.context(() => {
    const titleEl = gsap.utils.toArray<HTMLElement>('.stce-title-183', componentRoot.value)
    const subtitleEl = gsap.utils.toArray<HTMLElement>('.stce-subtitle-183', componentRoot.value)
    const blocks = gsap.utils.toArray<HTMLElement>('.stce-text-block-183', componentRoot.value)
    const blockNumbers = gsap.utils.toArray<HTMLElement>('.stce-block-number-183', componentRoot.value)
    const blockLines = gsap.utils.toArray<HTMLElement>('.stce-block-line-183', componentRoot.value)

    if (titleEl.length) {
      gsap.from(titleEl, {
        scrollTrigger: {
          trigger: componentRoot.value,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 50,
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
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out'
      })
    }

    blocks.forEach((block, index) => {
      const number = blockNumbers[index] as HTMLElement
      const line = blockLines[index] as HTMLElement

      gsap.from(block, {
        scrollTrigger: {
          trigger: block,
          start: 'top 85%',
          end: 'top 35%',
          scrub: 1.5
        },
        y: 80,
        opacity: 0.4,
        ease: 'power2.out'
      })

      gsap.from(number, {
        scrollTrigger: {
          trigger: block,
          start: 'top 80%',
          end: 'top 45%',
          scrub: 1
        },
        scale: 0,
        rotation: 180,
        opacity: 0,
        ease: 'back.out(2)'
      })

      gsap.from(line, {
        scrollTrigger: {
          trigger: block,
          start: 'top 78%',
          end: 'top 48%',
          scrub: 1.2
        },
        scaleX: 0,
        opacity: 0,
        ease: 'power2.out'
      })
    })
  }, componentRoot.value)
})

onUnmounted(() => {
  gsapCtx?.revert()
})
</script>

<style scoped lang="scss">
.stce-text-cascade-effect-section-183 {
  position: relative;
  min-height: 100vh;
  padding: 120px 20px;
  background: linear-gradient(180deg, #0f0f1f 0%, #1a1a3a 50%, #0f0f1f 100%);
  overflow: hidden;

  opacity: 1 !important;}

.stce-container-183 {
  max-width: 1000px;
  margin: 0 auto;

  opacity: 1 !important;}

.stce-title-183 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.stce-subtitle-183 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 100px;
  letter-spacing: 0.3em;
  text-transform: uppercase;

  opacity: 1 !important;}

.stce-text-blocks-183 {
  display: flex;
  flex-direction: column;
  gap: 100px;
}

.stce-text-block-183 {
  position: relative;
  padding: 50px 60px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 107, 107, 0.3);
  
  opacity: 1 !important;}
}

.stce-block-header-183 {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
}

.stce-block-number-183 {
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ff6b6b, #feca57);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  min-width: 80px;

  opacity: 1 !important;}

.stce-block-line-183 {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, rgba(255, 107, 107, 0.8), transparent);

  opacity: 1 !important;}

.stce-block-title-183 {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 20px;

  opacity: 1 !important;}

.stce-block-text-183 {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .stce-text-blocks-183 {
    gap: 60px;
  }

  .stce-text-block-183 {
    padding: 30px 40px;
  
  opacity: 1 !important;}

  .stce-block-number-183 {
    font-size: 2.5rem;
    min-width: 60px;
  
  opacity: 1 !important;}

  .stce-block-title-183 {
    font-size: 1.5rem;
  
  opacity: 1 !important;}

  .stce-block-text-183 {
    font-size: 1rem;
  
  opacity: 1 !important;}
}
</style>
