<template>
  <div class="hexagon-grid" ref="gridRef">
    <div
      v-for="(cell, index) in cells"
      :key="index"
      :ref="el => cellRefs[index] = el as HTMLElement"
      class="hexagon"
      :class="{ active: cell.active }"
      @mouseenter="onCellHover(index)"
    >
      <div class="hexagon-inner">
        <div class="hexagon-content">{{ cell.content }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Cell {
  content: string
  active: boolean
}

interface Props {
  gridSize?: number
  colors?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  gridSize: 5,
  colors: () => ['#8b5cf6', '#3b82f6', '#ec4899', '#10b981', '#f59e0b']
})

const cells = ref<Cell[]>([])
const cellRefs = ref<HTMLElement[]>([])
const gridRef = ref<HTMLElement>()
let ctx: gsap.Context

// 初始化蜂窝网格
const initGrid = () => {
  cells.value = []
  for (let i = 0; i < props.gridSize * props.gridSize; i++) {
    cells.value.push({
      content: props.colors[i % props.colors.length],
      active: false
    })
  }
}

const onCellHover = (index: index) => {
  if (!cellRefs.value[index]) return

  const cell = cells.value[index]
  const row = Math.floor(index / props.gridSize)
  const col = index % props.gridSize

  // 激活周围的细胞
  const neighbors = [
    index, // 自身
    index - 1, // 左
    index + 1, // 右
    index - props.gridSize, // 上
    index + props.gridSize, // 下
  ].filter(n => n >= 0 && n < cells.value.length)

  // 重置所有细胞
  cellRefs.value.forEach((cell, i) => {
    gsap.to(cell, {
      scale: 1,
      opacity: 0.3,
      duration: 0.3,
      ease: 'power2.out'
    })
  })

  // 激活邻居细胞
  neighbors.forEach(n => {
    if (cellRefs.value[n]) {
      cells.value[n].active = true
      gsap.to(cellRefs.value[n], {
        scale: 1.2,
        opacity: 1,
        duration: 0.3,
        ease: 'back.out(1.7)',
        backgroundColor: props.colors[n % props.colors.length]
      })
    }
  })
}

onMounted(() => {
  initGrid()

  ctx = gsap.context(() => {
    // 初始入场动画
    cellRefs.value.forEach((cell, index) => {
      gsap.fromTo(cell,
        {
          scale: 0,
          opacity: 0,
          rotate: 180
        },
        {
          scale: 1,
          opacity: 0.3,
          rotate: 0,
          duration: 0.5,
          delay: (index % props.gridSize) * 0.1 + Math.floor(index / props.gridSize) * 0.1,
          ease: 'back.out(1.7)'
        }
      )
    })

    // 自动波浪效果
    let waveIndex = 0
    const waveInterval = setInterval(() => {
      if (gridRef.value && !gridRef.value.matches(':hover')) {
        onCellHover(waveIndex % (props.gridSize * props.gridSize))
      }
      waveIndex++
    }, 2000)

    // 清理定时器
    return () => clearInterval(waveInterval)
  }, gridRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.hexagon-grid {
  display: grid;
  grid-template-columns: repeat(v-bind('props.gridSize'), 1fr);
  gap: 5px;
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
}

.hexagon {
  position: relative;
  width: 60px;
  height: 70px;
  cursor: pointer;
  transform-style: preserve-3d;
}

.hexagon-inner {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.hexagon.active .hexagon-inner {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 20px currentColor;
}

.hexagon-content {
  font-size: 1.5rem;
}

@media (max-width: 768px) {
  .hexagon {
    width: 45px;
    height: 52px;
  }

  .hexagon-content {
    font-size: 1rem;
  }
}
</style>
