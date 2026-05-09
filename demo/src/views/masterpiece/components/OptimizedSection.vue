<template>
  <div ref="sectionRef" class="component-section">
    <SectionHeader :title="title" :subtitle="subtitle" />
    <div class="component-wrapper">
      <component :is="component" v-if="isVisible" v-bind="props" ref="compRef" />
      <div v-else class="loading-placeholder">
        <div class="spinner"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import SectionHeader from './SectionHeader.vue'

interface Props {
  title: string
  subtitle: string
  component: any
  props?: any
}

const props = withDefaults(defineProps<Props>(), {
  props: () => ({})
})

const sectionRef = ref<HTMLElement>()
const compRef = ref()
const isVisible = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          // 组件可见后可以取消观察，保持渲染
          if (observer && sectionRef.value) {
            observer.unobserve(sectionRef.value)
          }
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '200px'
    }
  )

  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})

// 暴露暂停/恢复方法给父组件
const pauseAnimation = () => {
  if (compRef.value?.pauseAnimation) {
    compRef.value.pauseAnimation()
  }
}

const resumeAnimation = () => {
  if (compRef.value?.resumeAnimation) {
    compRef.value.resumeAnimation()
  }
}

defineExpose({
  pauseAnimation,
  resumeAnimation
})
</script>

<style scoped>
.component-section {
  transition: all 0.3s;
  min-height: 500px;
}

.component-wrapper {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-placeholder {
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(139, 92, 246, 0.3);
  border-top-color: #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
