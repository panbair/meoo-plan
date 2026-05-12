<template>
  <div ref="parentRef" class="domino-section-abc">
    <!-- 桌面背景 -->
    <div class="domino-desk-abc" ref="deskRef">
      <div class="desk-surface-abc"></div>
      <div class="desk-reflection-abc" ref="reflectionRef"></div>
    </div>

    <!-- 骨牌容器 -->
    <div class="domino-container-abc" ref="dominoContainerRef">
      <div 
        v-for="(char, charIndex) in charData" 
        :key="'char-'+charIndex"
        class="domino-char-abc"
      >
        <div 
          v-for="(tile, tileIndex) in char.tiles" 
          :key="'tile-'+charIndex+'-'+tileIndex"
          :ref="el => setTileRef(el as HTMLElement, charIndex, tileIndex)"
          class="domino-tile-abc"
          :style="getTileStyle(tile)"
        >
          <!-- 骨牌顶面 -->
          <div class="tile-top-abc">
            <span class="tile-face-abc" :style="{ opacity: 0 }">{{ tile.label }}</span>
          </div>
          <!-- 骨牌正面 -->
          <div class="tile-front-abc" :style="{ transform: `rotateX(0deg) translateZ(${tileDepth / 2}px)` }"></div>
          <!-- 骨牌侧面 -->
          <div class="tile-side-abc" :style="{ width: tileDepth + 'px', transform: `rotateY(90deg) translateZ(${tileWidth - tileDepth}px)` }"></div>
        </div>
      </div>
    </div>

    <!-- 副标题 -->
    <p class="domino-subtitle-abc" ref="subtitleRef">{{ subtitle }}</p>

    <!-- 进度条 -->
    <div class="domino-progress-abc" :style="{ width: progress + '%' }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Props
interface Props {
  title?: string
  subtitle?: string
  tileSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '连锁反应',
  subtitle: '倒下的艺术 · 秩序的崩塌',
  tileSize: 20
})

// Refs
const parentRef = ref<HTMLElement | null>(null)
const dominoContainerRef = ref<HTMLElement | null>(null)
const deskRef = ref<HTMLElement | null>(null)
const reflectionRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)

const tileRefs = ref<Map<string, HTMLElement>>(new Map())

// 状态
const progress = ref(0)

// 骨牌配置常量
const tileWidth = props.tileSize
const tileHeight = props.tileSize * 1.8
const tileDepth = props.tileSize * 0.4
const tileGap = 2

// 字符数据结构
interface Tile {
  x: number
  y: number
  width: number
  height: number
  depth: number
  label: string
}

interface CharInfo {
  char: string
  x: number
  width: number
  tiles: Tile[]
}

// 获取骨牌样式
function getTileStyle(tile: Tile) {
  return {
    width: tileWidth + 'px',
    height: tileHeight + 'px',
    left: tile.x + 'px',
    top: tile.y + 'px',
    '--tile-depth': tileDepth + 'px'
  } as Record<string, string>
}

// 将文字转换为骨牌阵列
const charData = computed<CharInfo[]>(() => {
  const chars = props.title.split('')
  const result: CharInfo[] = []
  let currentX = 0
  
  chars.forEach((char) => {
    const tiles: Tile[] = []
    
    // 为每个字符创建骨牌阵列
    const charPattern = getCharPattern(char)
    
    charPattern.forEach((row, rowIndex) => {
      row.forEach((filled, colIndex) => {
        if (filled) {
          tiles.push({
            x: colIndex * (tileWidth + tileGap),
            y: rowIndex * (tileHeight + tileGap),
            width: tileWidth,
            height: tileHeight,
            depth: tileDepth,
            label: ''
          })
        }
      })
    })
    
    const patternWidth = charPattern[0]?.length || 5
    const charWidth = patternWidth * (tileWidth + tileGap)
    
    result.push({
      char,
      x: currentX,
      width: charWidth,
      tiles
    })
    
    currentX += charWidth + tileGap * 2
  })
  
  return result
})

// 获取字符的骨牌图案
function getCharPattern(char: string): boolean[][] {
  const patterns: Record<string, boolean[][]> = {
    '连': [[0,1,1,0,0],[1,0,0,1,0],[0,0,1,0,1],[0,1,0,1,0],[1,1,1,0,0]],
    '锁': [[1,1,1,0,0],[1,0,0,1,0],[1,1,1,0,0],[1,0,0,1,0],[1,1,1,0,0]],
    '反': [[0,0,1,0,0],[0,1,1,0,0],[1,0,1,0,0],[0,1,1,0,0],[0,0,1,1,1]],
    '应': [[1,1,1,0,0],[1,0,0,0,0],[1,1,1,0,0],[1,0,0,1,0],[1,1,1,0,0]],
    '默': [[0,1,0,0,0],[1,1,1,0,0],[0,1,0,0,0],[0,1,1,1,0],[0,1,0,0,0]],
    '认': [[1,1,1,0,0],[1,0,0,0,0],[1,1,1,0,0],[0,0,1,0,0],[1,1,1,0,0]],
    '数': [[1,1,1,0,0],[1,0,0,1,0],[1,1,1,0,0],[1,0,1,0,0],[1,1,1,0,0]],
    '据': [[0,1,0,0,0],[1,1,0,0,0],[0,1,0,0,0],[0,1,0,0,0],[1,1,1,0,0]]
  }
  
  // 默认模式 - 5x5 方块
  return patterns[char] || [
    [1,1,1,0,0],
    [1,0,1,0,0],
    [1,1,1,0,0],
    [1,0,1,0,0],
    [1,1,1,0,0]
  ]
}

// 清理函数
type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let scrollTriggerInstance: ScrollTrigger | null = null

// 设置 tile ref
function setTileRef(el: HTMLElement | null, charIndex: number, tileIndex: number) {
  if (el) {
    const key = `${charIndex}-${tileIndex}`
    tileRefs.value.set(key, el)
  }
}

// 入场动画
function playEntryAnimation() {
  const allTiles = Array.from(tileRefs.value.entries())
  
  // 初始状态 - 全部直立
  allTiles.forEach(([, tile]) => {
    gsap.set(tile, {
      transformPerspective: 800,
      rotateX: -85,
      rotateY: 0,
      rotateZ: 0,
      scaleY: 1,
      y: 0,
      x: 0
    })
  })
  
  if (subtitleRef.value) {
    gsap.set(subtitleRef.value, {
      opacity: 0,
      y: 20
    })
  }
  
  // 创建连锁Timeline
  const tl = gsap.timeline()
  
  // 逐个字符触发骨牌倒下
  charData.value.forEach((char, charIndex) => {
    char.tiles.forEach((tile, tileIndex) => {
      const key = `${charIndex}-${tileIndex}`
      const tileEl = tileRefs.value.get(key)
      if (!tileEl) return
      
      const isLastTile = charIndex === charData.value.length - 1 && 
                         tileIndex === char.tiles.length - 1
      
      tl.to(tileEl, {
        rotateX: 0,
        duration: 0.4,
        ease: 'power1.in',
        onComplete: () => {
          // 触底弹跳
          gsap.to(tileEl, {
            scaleY: 0.85,
            y: 3,
            duration: 0.08,
            ease: 'power2.out',
            onComplete: () => {
              gsap.to(tileEl, {
                scaleY: 1,
                y: 0,
                duration: 0.15,
                ease: 'elastic.out(1, 0.3)'
              })
            }
          })
          
          // 轻微滑移
          gsap.to(tileEl, {
            x: (Math.random() - 0.5) * 4,
            duration: 0.3,
            ease: 'power1.out'
          })
        }
      }, isLastTile ? '>-0.02' : charIndex * 0.8 + tileIndex * 0.05)
    })
  })
  
  // 显示文字
  allTiles.forEach(([, tile]) => {
    const face = tile.querySelector('.tile-face-abc') as HTMLElement
    if (face) {
      tl.to(face, {
        opacity: 1,
        duration: 0.2
      }, '>-0.3')
    }
  })
  
  // 副标题
  tl.to(subtitleRef.value, {
    opacity: 0.7,
    y: 0,
    duration: 0.8,
    ease: 'power2.out'
  }, '>-0.5')
}

// 鼠标hover效果 - 重新立起
function setupHoverEffect() {
  const allTiles = Array.from(tileRefs.value.entries())
  
  allTiles.forEach(([key, tile]) => {
    tile.addEventListener('mouseenter', () => {
      const [charIndex] = key.split('-').map(Number)
      
      charData.value[charIndex]?.tiles.forEach((_, tileIndex) => {
        const neighborKey = `${charIndex}-${tileIndex}`
        const neighborTile = tileRefs.value.get(neighborKey)
        if (neighborTile) {
          gsap.to(neighborTile, {
            rotateX: -70,
            duration: 0.3,
            ease: 'power2.out'
          })
        }
      })
    })
    
    tile.addEventListener('mouseleave', () => {
      const [charIndex] = key.split('-').map(Number)
      
      charData.value[charIndex]?.tiles.forEach((_, tileIndex) => {
        const neighborKey = `${charIndex}-${tileIndex}`
        const neighborTile = tileRefs.value.get(neighborKey)
        if (neighborTile) {
          gsap.to(neighborTile, {
            rotateX: 0,
            duration: 0.4,
            ease: 'power1.in'
          })
        }
      })
    })
  })
}

// 初始化
onMounted(() => {
  if (!parentRef.value) return
  
  setTimeout(() => {
    ctx = gsap.context(() => {
      // 入场动画
      playEntryAnimation()
      
      // Hover效果
      setupHoverEffect()
      
      // ScrollTrigger
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1.5,
        onUpdate: (self) => {
          progress.value = self.progress * 100
          
          // 反射阴影偏移
          if (reflectionRef.value) {
            gsap.set(reflectionRef.value, {
              x: self.progress * 20
            })
          }
        },
        onEnter: () => {
          playEntryAnimation()
        },
        onLeaveBack: () => {
          const allTiles = Array.from(tileRefs.value.values())
          
          allTiles.forEach((tile) => {
            gsap.set(tile, {
              rotateX: -85,
              scaleY: 1,
              y: 0,
              x: 0
            })
          })
          
          allTiles.forEach((tile) => {
            const face = tile.querySelector('.tile-face-abc') as HTMLElement
            if (face) {
              gsap.set(face, { opacity: 0 })
            }
          })
          
          if (subtitleRef.value) {
            gsap.set(subtitleRef.value, { opacity: 0, y: 20 })
          }
        }
      })
      
      cleanupFns.push(() => scrollTriggerInstance?.kill())
    }, parentRef.value)
  }, 100)
})

// 清理
onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  
  ctx?.revert()
  ctx = null
  
  scrollTriggerInstance?.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())
  
  tileRefs.value.clear()
})
</script>

<style scoped>
.domino-section-abc {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #2c2c3a 0%,
    #1a1a24 50%,
    #0d0d12 100%
  );
  font-family: 'Noto Serif SC', 'SimSun', serif;
}

/* 桌面 */
.domino-desk-abc {
  position: absolute;
  inset: 0;
  perspective: 1200px;
}

.desk-surface-abc {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 60%;
  transform: translateY(-30%) rotateX(45deg);
  background: linear-gradient(
    180deg,
    #3a3a4a 0%,
    #2a2a3a 50%,
    #1a1a2a 100%
  );
  transform-origin: center top;
}

.desk-surface-abc::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 100px,
    rgba(255, 255, 255, 0.02) 100px,
    rgba(255, 255, 255, 0.02) 101px
  );
}

.desk-reflection-abc {
  position: absolute;
  top: 55%;
  left: 10%;
  right: 10%;
  height: 200px;
  background: linear-gradient(
    180deg,
    rgba(60, 60, 80, 0.3) 0%,
    transparent 100%
  );
  filter: blur(20px);
}

/* 骨牌容器 */
.domino-container-abc {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 8px;
  transform-style: preserve-3d;
  z-index: 10;
}

.domino-char-abc {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 150px;
  max-width: 200px;
  height: 150px;
  transform-style: preserve-3d;
}

/* 骨牌 */
.domino-tile-abc {
  position: absolute;
  transform-style: preserve-3d;
  cursor: pointer;
}

.tile-top-abc {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    #4a4a5a 0%,
    #3a3a4a 50%,
    #2a2a3a 100%
  );
  transform: translateZ(var(--tile-depth, 8px));
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tile-front-abc {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    #1a1a24 0%,
    #0d0d12 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.tile-side-abc {
  position: absolute;
  height: 100%;
  right: 0;
  background: linear-gradient(
    90deg,
    #2a2a3a 0%,
    #1a1a24 100%
  );
}

.tile-face-abc {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: bold;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
}

/* 副标题 */
.domino-subtitle-abc {
  position: absolute;
  top: calc(50% + 80px);
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(0.7rem, 1.2vw, 0.9rem);
  color: rgba(200, 200, 220, 0.7);
  letter-spacing: 0.4em;
  white-space: nowrap;
  z-index: 10;
}

/* 进度条 */
.domino-progress-abc {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    rgba(80, 80, 100, 0.5), 
    rgba(200, 200, 220, 0.8),
    rgba(80, 80, 100, 0.6));
  z-index: 100;
  transition: width 0.1s ease;
  box-shadow: 0 0 10px rgba(200, 200, 220, 0.5);
}

/* 响应式 */
@media (max-width: 768px) {
  .domino-container-abc {
    transform: translate(-50%, -50%) scale(0.7);
  }

  .domino-char-abc {
    max-width: 150px;
  }

  .domino-subtitle-abc {
    letter-spacing: 0.15em;
    font-size: 0.6rem;
  }
}
</style>
