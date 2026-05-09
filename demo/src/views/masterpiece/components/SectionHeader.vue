<template>
  <div class="section-header" ref="headerRef">
    <span class="section-tag">{{ tag }}</span>
    <h2 class="section-title">{{ title }}</h2>
    <p class="section-desc">{{ desc }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  tag?: string
  title?: string
  desc?: string
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'SECTION',
  title: 'Section Title',
  desc: 'Section description'
})

const headerRef = ref<HTMLElement>()

onMounted(() => {
  ScrollTrigger.create({
    trigger: headerRef.value,
    start: 'top 80%',
    onEnter: () => {
      gsap.from(headerRef.value!, {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      })
    }
  })
})
</script>

<style scoped lang="scss">
.section-header {
  text-align: center;
  margin-bottom: 80px;
}

.section-tag {
  display: inline-block;
  padding: 8px 24px;
  background: rgba(167, 139, 250, 0.15);
  border: 1px solid rgba(167, 139, 250, 0.3);
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #a78bfa;
  letter-spacing: 2px;
  margin-bottom: 20px;
}

.section-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-desc {
  font-size: 1.1rem;
  color: #64748b;
}
</style>
