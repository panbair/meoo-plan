<template>
  <div class="carousel-container" ref="containerRef">
    <div class="carousel-wrapper" ref="wrapperRef">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="carousel-card"
        :class="{ active: currentIndex === index }"
        :style="getCardStyle(index)"
        @click="selectCard(index)"
      >
        <div class="card-content">
          <div class="card-emoji">{{ card.emoji }}</div>
          <div class="card-title">{{ card.title }}</div>
          <div class="card-desc">{{ card.desc }}</div>
        </div>
      </div>
    </div>

    <div class="carousel-controls">
      <button class="control-btn prev" @click="prevCard">
        ←
      </button>
      <div class="carousel-dots">
        <span
          v-for="(_, index) in cards"
          :key="index"
          class="dot"
          :class="{ active: currentIndex === index }"
          @click="selectCard(index)"
        ></span>
      </div>
      <button class="control-btn next" @click="nextCard">
        →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Card {
  emoji: string
  title: string
  desc: string
}

interface Props {
  cards?: Card[]
  autoPlay?: boolean
  autoPlayInterval?: number
}

const props = withDefaults(defineProps<Props>(), {
  cards: () => [
    { emoji: '🎨', title: '设计', desc: '创造无限可能' },
    { emoji: '🎬', title: '动画', desc: '流畅视觉体验' },
    { emoji: '🎯', title: '精准', desc: '细节决定成败' },
    { emoji: '🎪', title: '创意', desc: '突破想象边界' },
    { emoji: '🎭', title: '表演', desc: '生动表达情感' }
  ],
  autoPlay: true,
  autoPlayInterval: 4000
})

const containerRef = ref<HTMLElement>()
const currentIndex = ref(0)
let autoPlayTimer: number | null = null

const getCardStyle = (index: number) => {
  const diff = (index - currentIndex.value + props.cards.length) % props.cards.length
  const maxDiff = Math.floor(props.cards.length / 2)
  const normalizedDiff = diff > maxDiff ? diff - props.cards.length : diff

  const opacity = normalizedDiff === 0 ? 1 : Math.max(0, 1 - Math.abs(normalizedDiff) * 0.3)
  const scale = normalizedDiff === 0 ? 1 : Math.max(0.5, 1 - Math.abs(normalizedDiff) * 0.15)
  const rotateY = normalizedDiff * 30
  const zIndex = props.cards.length - Math.abs(normalizedDiff)

  return {
    opacity,
    transform: `scale(${scale}) rotateY(${rotateY}deg) translateZ(${-Math.abs(normalizedDiff) * 100}px)`,
    zIndex
  }
}

function selectCard(index: number) {
  currentIndex.value = index
  resetAutoPlay()
}

function nextCard() {
  currentIndex.value = (currentIndex.value + 1) % props.cards.length
  resetAutoPlay()
}

function prevCard() {
  currentIndex.value = (currentIndex.value - 1 + props.cards.length) % props.cards.length
  resetAutoPlay()
}

function startAutoPlay() {
  if (props.autoPlay) {
    autoPlayTimer = window.setInterval(() => {
      nextCard()
    }, props.autoPlayInterval)
  }
}

function stopAutoPlay() {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

function resetAutoPlay() {
  stopAutoPlay()
  startAutoPlay()
}

onMounted(() => {
  startAutoPlay()

  // 卡片进入动画
  gsap.from('.carousel-card', {
    y: 100,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out'
  })
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped lang="scss">
.carousel-container {
  width: 100%;
  max-width: 800px;
  min-height: 400px;
  perspective: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.carousel-wrapper {
  width: 100%;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.carousel-card {
  position: absolute;
  width: 280px;
  height: 350px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;

  &.active {
    background: rgba(139, 92, 246, 0.15);
    border-color: rgba(139, 92, 246, 0.3);
    box-shadow: 0 0 40px rgba(139, 92, 246, 0.2);
  }

  &:hover {
    border-color: rgba(139, 92, 246, 0.5);
  }
}

.card-content {
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
}

.card-emoji {
  font-size: 4rem;
  margin-bottom: 20px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 12px;
}

.card-desc {
  font-size: 1rem;
  color: #94a3b8;
  line-height: 1.6;
}

.carousel-controls {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 32px;
}

.control-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s;

  &:hover {
    background: rgba(139, 92, 246, 0.3);
    border-color: rgba(139, 92, 246, 0.5);
    transform: scale(1.1);
  }
}

.carousel-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s;

  &.active {
    background: #8b5cf6;
    transform: scale(1.3);
  }

  &:hover {
    background: rgba(139, 92, 246, 0.6);
  }
}
</style>
