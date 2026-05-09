<template>
  <div ref="observerTarget">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  eager?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  eager: false
})

const observerTarget = ref<HTMLElement>()
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    () => {},
    {
      threshold: 0.01
    }
  )

  if (observerTarget.value) {
    observer.observe(observerTarget.value)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>
