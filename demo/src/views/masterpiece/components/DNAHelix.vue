<template>
  <div class="dna-container" ref="containerRef">
    <div class="dna-helix" ref="helixRef">
      <div
        v-for="(nucleotide, index) in nucleotides"
        :key="index"
        class="dna-strand"
        :class="nucleotide.type"
        :style="{ transform: `rotateY(${index * 45}deg)` }"
      >
        <div class="nucleotide">{{ nucleotide.icon }}</div>
        <div class="connection"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Nucleotide {
  type: string
  icon: string
}

interface Props {
  strandCount?: number
  rotateSpeed?: number
  pulseSpeed?: number
}

const props = withDefaults(defineProps<Props>(), {
  strandCount: 8,
  rotateSpeed: 10,
  pulseSpeed: 2
})

const containerRef = ref<HTMLElement>()
const helixRef = ref<HTMLElement>()
let ctx: gsap.Context

const nucleotides = computed(() => {
  const types = ['A', 'T', 'C', 'G']
  const icons = ['🔵', '🟡', '🟢', '🔴']
  const result: Nucleotide[] = []

  for (let i = 0; i < props.strandCount; i++) {
    const typeIndex = i % types.length
    result.push({
      type: types[typeIndex].toLowerCase(),
      icon: icons[typeIndex]
    })
  }
  return result
})

onMounted(() => {
  ctx = gsap.context(() => {
    // DNA旋转动画
    gsap.to(helixRef.value, {
      rotateY: 360,
      duration: props.rotateSpeed,
      repeat: -1,
      ease: 'none'
    })

    // 核苷酸脉冲动画
    gsap.to('.nucleotide', {
      scale: 1.2,
      boxShadow: '0 0 20px currentColor',
      duration: props.pulseSpeed,
      repeat: -1,
      yoyo: true,
      stagger: 0.15,
      ease: 'sine.inOut'
    })

    // 连接线呼吸效果
    gsap.to('.connection', {
      opacity: 0.3,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }, containerRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.dna-container {
  width: 300px;
  height: 400px;
  perspective: 1000px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dna-helix {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}

.dna-strand {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 10px;
  height: 200px;
  transform-origin: center center;
  transform-style: preserve-3d;
}

.nucleotide {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: absolute;
  left: -20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  backdrop-filter: blur(5px);
  transition: all 0.3s;
}

.a {
  .nucleotide {
    background: rgba(59, 130, 246, 0.6);
    border: 2px solid rgba(59, 130, 246, 0.8);
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
  }
}

.t {
  .nucleotide {
    background: rgba(234, 179, 8, 0.6);
    border: 2px solid rgba(234, 179, 8, 0.8);
    box-shadow: 0 0 15px rgba(234, 179, 8, 0.5);
  }
}

.c {
  .nucleotide {
    background: rgba(34, 197, 94, 0.6);
    border: 2px solid rgba(34, 197, 94, 0.8);
    box-shadow: 0 0 15px rgba(34, 197, 94, 0.5);
  }
}

.g {
  .nucleotide {
    background: rgba(239, 68, 68, 0.6);
    border: 2px solid rgba(239, 68, 68, 0.8);
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
  }
}

.connection {
  position: absolute;
  left: 50%;
  top: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(to bottom,
    rgba(147, 51, 234, 0.6),
    rgba(59, 130, 246, 0.6),
    rgba(34, 197, 94, 0.6)
  );
  transform: translateX(-50%);
}
</style>
