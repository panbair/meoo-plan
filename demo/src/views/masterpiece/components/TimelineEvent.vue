<template>
  <div ref="eventRef" class="timeline-event">
    <div class="event-marker">
      <div class="marker-dot"></div>
      <div class="marker-ring"></div>
    </div>
    <div class="event-content">
      <div class="event-year">{{ year }}</div>
      <h3 class="event-title">{{ title }}</h3>
      <p class="event-desc">{{ desc }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  year?: string
  title?: string
  desc?: string
  index?: number
}

const props = withDefaults(defineProps<Props>(), {
  year: '2024',
  title: 'Event Title',
  desc: 'Event description',
  index: 0
})

const eventRef = ref<HTMLElement>()

onMounted(() => {
  if (!eventRef.value) return

  ScrollTrigger.create({
    trigger: eventRef.value,
    start: 'top 80%',
    onEnter: () => {
      if (!eventRef.value) return

      gsap.from(eventRef.value, {
        x: props.index % 2 === 0 ? -100 : 100,
        opacity: 0,
        duration: 1,
        delay: 0.1,
        ease: 'power3.out'
      })

      // 标记动画
      const markerDot = eventRef.value.querySelector('.marker-dot')
      const markerRing = eventRef.value.querySelector('.marker-ring')

      if (markerDot) {
        gsap.from(markerDot, {
          scale: 0,
          duration: 0.5,
          ease: 'back.out(1.7)'
        })
      }

      if (markerRing) {
        gsap.from(markerRing, {
          scale: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.5)'
        })
      }
    }
  })
})
</script>

<style scoped lang="scss">
.timeline-event {
  position: relative;
  padding: 40px 0;
  width: 50%;

  &:nth-child(odd) {
    padding-right: 60px;
    text-align: right;
    left: 0;
  }

  &:nth-child(even) {
    padding-left: 60px;
    text-align: left;
    left: 50%;
  }
}

.event-marker {
  position: absolute;
  top: 50%;
  width: 40px;
  height: 40px;

  &:nth-child(odd) {
    right: -20px;
  }
  &:nth-child(even) {
    left: -20px;
  }
}

.marker-dot {
  position: absolute;
  width: 16px;
  height: 16px;
  background: #7c3aed;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.6);
}

.marker-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(167, 139, 250, 0.5);
  border-radius: 50%;
}

.event-year {
  font-size: 0.85rem;
  color: #a78bfa;
  font-weight: 600;
  margin-bottom: 8px;
}

.event-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 12px;
}

.event-desc {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .timeline-event {
    width: 100%;
    padding: 30px 20px 30px 80px !important;
    text-align: left !important;
    left: 0 !important;
  }

  .event-marker {
    left: 40px !important;
    right: auto !important;
  }
}
</style>
