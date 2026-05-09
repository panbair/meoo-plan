<template>
  <div class="starfield" id="starfield"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import gsap from 'gsap'

interface Props {
  starCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  starCount: 200
})

function createStarfield() {
  const container = document.getElementById('starfield')
  if (!container) return

  container.innerHTML = ''

  for (let i = 0; i < props.starCount; i++) {
    const star = document.createElement('div')
    star.className = 'star'
    star.style.left = Math.random() * 100 + '%'
    star.style.top = Math.random() * 100 + '%'
    star.style.width = Math.random() * 3 + 1 + 'px'
    star.style.height = star.style.width
    star.style.opacity = Math.random() * 0.7 + 0.3
    container.appendChild(star)

    gsap.to(star, {
      opacity: Math.random() * 0.5 + 0.2,
      duration: 2 + Math.random() * 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }
}

onMounted(() => {
  createStarfield()
})
</script>

<style scoped lang="scss">
.starfield {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.star {
  position: absolute;
  border-radius: 50%;
  background: white;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}
</style>
