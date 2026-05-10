<template>
  <div ref="containerRef" class="virtual-list-container">
    <div ref="spacerRef" class="virtual-list-spacer" :style="{ height: totalHeight + 'px' }">
      <div
        v-for="item in visibleItems"
        :key="item.index"
        :ref="el => { if (el) itemRefs[item.index] = el as HTMLElement }"
        class="virtual-list-item"
        :style="{ transform: `translateY(${item.offset}px)` }"
      >
        <OptimizedSection
          :ref="el => { if (el) sectionRefs[item.index] = el }"
          :title="items[item.index].title"
          :subtitle="items[item.index].subtitle"
          :component="items[item.index].component"
          :props="items[item.index].props"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import OptimizedSection from './OptimizedSection.vue'

interface Item {
  title: string
  subtitle: string
  component: any
  props?: any
}

interface Props {
  items: Item[]
  itemHeight?: number
  buffer?: number
}

const props = withDefaults(defineProps<Props>(), {
  itemHeight: 700,
  buffer: 3
})

const containerRef = ref<HTMLElement>()
const spacerRef = ref<HTMLElement>()
const itemRefs = ref<Record<number, HTMLElement>>({})
const sectionRefs = ref<Record<number, any>>({})
const scrollTop = ref(0)
const viewportHeight = ref(800)

const totalHeight = computed(() => props.items.length * props.itemHeight)

const startIndex = computed(() => {
  return Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.buffer)
})

const endIndex = computed(() => {
  return Math.min(
    props.items.length - 1,
    Math.floor((scrollTop.value + viewportHeight.value) / props.itemHeight) + props.buffer
  )
})

const visibleItems = computed(() => {
  const items: Array<{ index: number, offset: number }> = []
  for (let i = startIndex.value; i <= endIndex.value; i++) {
    items.push({
      index: i,
      offset: i * props.itemHeight
    })
  }
  return items
})

const onScroll = () => {
  if (containerRef.value) {
    scrollTop.value = containerRef.value.scrollTop

    // 暂停不可见组件的动画
    Object.entries(sectionRefs.value).forEach(([index, section]) => {
      const idx = parseInt(index)
      if (idx < startIndex.value || idx > endIndex.value) {
        section?.pauseAnimation()
      }
    })
  }
}

const updateViewport = () => {
  if (containerRef.value) {
    viewportHeight.value = containerRef.value.clientHeight
  }
}

onMounted(() => {
  if (containerRef.value) {
    viewportHeight.value = containerRef.value.clientHeight
    containerRef.value.addEventListener('scroll', onScroll, { passive: true })
  }
  window.addEventListener('resize', updateViewport)
})

onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('scroll', onScroll)
  }
  window.removeEventListener('resize', updateViewport)
})
</script>

<style scoped>
.virtual-list-container {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.virtual-list-spacer {
  position: relative;
  width: 100%;
}

.virtual-list-item {
  position: absolute;
  width: 100%;
  left: 0;
}
</style>
