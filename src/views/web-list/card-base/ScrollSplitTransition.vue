<template>
  <div class="sst-split-transition-section-173" ref="componentRoot">
    <div class="sst-container-173">
      <h2 class="sst-title-173">分屏过渡</h2>
      <p class="sst-subtitle-173">Split Transition</p>

      <div class="sst-transition-stage-173">
        <div
          v-for="(item, index) in transitionItems"
          :key="index"
          class="sst-transition-item-173"
          :ref="el => { if (el) itemRefs[index] = el as HTMLElement }"
        >
          <div class="sst-split-left-173">
            <span class="sst-item-number-173">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3 class="sst-item-title-173">{{ item.title }}</h3>
          </div>
          <div class="sst-divider-173"></div>
          <div class="sst-split-right-173">
            <p class="sst-item-desc-173">{{ item.description }}</p>
          </div>
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
const itemRefs = ref<HTMLElement[]>([])

interface TransitionItem {
  title: string
  description: string
}

const transitionItems: TransitionItem[] = [
  {
    title: '视觉分离',
    description: 'Visual separation creates distinct zones while maintaining connection'
  },
  {
    title: '动态流动',
    description: 'Dynamic flow between elements enhances the transition experience'
  },
  {
    title: '节奏变换',
    description: 'Rhythmic changes guide the eye through the content naturally'
  },
  {
    title: '平衡设计',
    description: 'Balanced design ensures harmony between split sections'
  }
]

let gsapCtx: gsap.Context

onMounted(() => {
  if (!componentRoot.value) return

  gsapCtx = gsap.context(() => {
    const titleEl = gsap.utils.toArray<HTMLElement>('.sst-title-173', componentRoot.value)
    const subtitleEl = gsap.utils.toArray<HTMLElement>('.sst-subtitle-173', componentRoot.value)
    const items = gsap.utils.toArray<HTMLElement>('.sst-transition-item-173', componentRoot.value)
    const splitLefts = gsap.utils.toArray<HTMLElement>('.sst-split-left-173', componentRoot.value)
    const splitRights = gsap.utils.toArray<HTMLElement>('.sst-split-right-173', componentRoot.value)
    const dividers = gsap.utils.toArray<HTMLElement>('.sst-divider-173', componentRoot.value)

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

    items.forEach((item, index) => {
      const left = splitLefts[index] as HTMLElement
      const right = splitRights[index] as HTMLElement
      const divider = dividers[index] as HTMLElement

      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 1.5
        },
        y: 60,
        opacity: 0.5,
        ease: 'power2.out'
      })

      gsap.from(left, {
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          end: 'top 45%',
          scrub: 1
        },
        x: -100,
        opacity: 0,
        ease: 'power2.out'
      })

      gsap.from(right, {
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          end: 'top 45%',
          scrub: 1
        },
        x: 100,
        opacity: 0,
        ease: 'power2.out'
      })

      gsap.from(divider, {
        scrollTrigger: {
          trigger: item,
          start: 'top 78%',
          end: 'top 48%',
          scrub: 1.2
        },
        scaleY: 0,
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
.sst-split-transition-section-173 {
  position: relative;
  min-height: 100vh;
  padding: 120px 20px;
  background: linear-gradient(180deg, #0e0e1e 0%, #1e1e3e 50%, #0e0e1e 100%);
  overflow: hidden;

  opacity: 1 !important;}

.sst-container-173 {
  max-width: 1200px;
  margin: 0 auto;

  opacity: 1 !important;}

.sst-title-173 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #a8edea, #fed6e3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.sst-subtitle-173 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 100px;
  letter-spacing: 0.3em;
  text-transform: uppercase;

  opacity: 1 !important;}

.sst-transition-stage-173 {
  display: flex;
  flex-direction: column;
  gap: 80px;
}

.sst-transition-item-173 {
  display: flex;
  align-items: stretch;
  min-height: 180px;
  padding: 50px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);

  opacity: 1 !important;}

.sst-split-left-173 {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-right: 40px;
}

.sst-item-number-173 {
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #a8edea, #fed6e3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 15px;

  opacity: 1 !important;}

.sst-item-title-173 {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;

  opacity: 1 !important;}

.sst-divider-173 {
  width: 2px;
  background: linear-gradient(180deg, transparent, rgba(168, 237, 234, 0.6), transparent);
  margin: 0 40px;

  opacity: 1 !important;}

.sst-split-right-173 {
  flex: 1.5;
  display: flex;
  align-items: center;
  padding-left: 40px;
}

.sst-item-desc-173 {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .sst-transition-stage-173 {
    gap: 50px;
  }

  .sst-transition-item-173 {
    flex-direction: column;
    padding: 30px;
    min-height: auto;
  
  opacity: 1 !important;}

  .sst-split-left-173 {
    padding-right: 0;
    padding-bottom: 30px;
    align-items: center;
    text-align: center;
  
  opacity: 1 !important;}

  .st-divider-173 {
    width: 100%;
    height: 2px;
    margin: 30px 0;
    background: linear-gradient(90deg, transparent, rgba(168, 237, 234, 0.6), transparent);
  
  opacity: 1 !important;}

  .sst-split-right-173 {
    padding-left: 0;
  }

  .sst-item-number-173 {
    font-size: 2.5rem;
  
  opacity: 1 !important;}

  .sst-item-title-173 {
    font-size: 1.5rem;
  
  opacity: 1 !important;}

  .sst-item-desc-173 {
    font-size: 1rem;
  
  opacity: 1 !important;}
}
</style>
