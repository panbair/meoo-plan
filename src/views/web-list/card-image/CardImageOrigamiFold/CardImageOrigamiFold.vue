<template>
  <section ref="parentRef" class="origami-container">
    <div class="og-base-layer">
      <img :src="imageUrl" alt="" class="og-base-img" />
    </div>
    <div ref="panelLayerRef" class="og-panel-layer">
      <div
        v-for="(panel, index) in panels"
        :key="index"
        :ref="(el) => setPanelRef(el, index)"
        class="og-panel"
        :style="panel.style"
      >
        <div class="og-panel-front">
          <div class="og-panel-img-wrap" :style="panel.imgStyle">
            <img :src="imageUrl" alt="" />
          </div>
          <div class="og-panel-crease" :style="panel.creaseStyle"></div>
        </div>
        <div class="og-panel-shadow"></div>
      </div>
    </div>
    <div ref="flashRef" class="og-flash"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const panelLayerRef = ref<HTMLElement | null>(null)
const flashRef = ref<HTMLElement | null>(null)
const panelRefs: HTMLElement[] = []
const cleanupFns: TweenCleanup[] = []

const imageUrl = 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=80'

interface Panel {
  style: Record<string, string>
  imgStyle: Record<string, string>
  creaseStyle: Record<string, string>
  foldAngle: number
  foldOrigin: string
  delay: number
}

const panels = reactive<Panel[]>([])

const initPanels = () => {
  panels.length = 0
  const cols = 4
  const rows = 3
  const cellW = 100 / cols
  const cellH = 100 / rows

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isEvenRow = r % 2 === 0
      const isEvenCol = c % 2 === 0
      let foldOrigin = 'top center'
      let foldAngle = -120
      let creasePos = 'top'

      if (isEvenRow && isEvenCol) {
        foldOrigin = 'top center'
        foldAngle = -120
        creasePos = 'top'
      } else if (isEvenRow && !isEvenCol) {
        foldOrigin = 'bottom center'
        foldAngle = 120
        creasePos = 'bottom'
      } else if (!isEvenRow && isEvenCol) {
        foldOrigin = 'center left'
        foldAngle = -100
        creasePos = 'left'
      } else {
        foldOrigin = 'center right'
        foldAngle = 100
        creasePos = 'right'
      }

      const dx = Math.abs(c - (cols - 1) / 2)
      const dy = Math.abs(r - (rows - 1) / 2)
      const dist = Math.sqrt(dx * dx + dy * dy)

      const creaseMap: Record<string, Record<string, string>> = {
        top: { top: '0', left: '0', width: '100%', height: '2px' },
        bottom: { bottom: '0', left: '0', width: '100%', height: '2px' },
        left: { top: '0', left: '0', width: '2px', height: '100%' },
        right: { top: '0', right: '0', width: '2px', height: '100%' },
      }

      panels.push({
        style: {
          left: `${c * cellW}%`,
          top: `${r * cellH}%`,
          width: `${cellW}%`,
          height: `${cellH}%`,
        },
        imgStyle: {
          width: `${cols * 100}%`,
          height: `${rows * 100}%`,
          left: `${-c * 100}%`,
          top: `${-r * 100}%`,
        },
        creaseStyle: creaseMap[creasePos],
        foldAngle,
        foldOrigin,
        delay: dist * 0.1,
      })
    }
  }
}

const setPanelRef = (el: Element | ComponentPublicInstance | null, i: number) => {
  if (el) {
    panelRefs[i] = (el as any).$el || (el as HTMLElement)
  }
}

onMounted(() => {
  if (!parentRef.value) {
    return
  }
  initPanels()
  requestAnimationFrame(() => setup())
})

const setup = () => {
  if (!parentRef.value) {
    return
  }

  gsap.set(flashRef.value, { opacity: 0 })

  panelRefs.forEach((p, i) => {
    if (!p) {
      return
    }
    const d = panels[i]
    if (!d) {
      return
    }
    const isRotateX = d.foldOrigin.includes('top') || d.foldOrigin.includes('bottom')

    gsap.set(p, {
      transformOrigin: d.foldOrigin,
      rotateX: isRotateX ? d.foldAngle : 0,
      rotateY: isRotateX ? 0 : d.foldAngle,
      opacity: 0.4,
      transformPerspective: 1200,
    })

    const shadow = p.querySelector('.og-panel-shadow') as HTMLElement
    if (shadow) {
      gsap.set(shadow, { opacity: 0.5 })
    }
    const crease = p.querySelector('.og-panel-crease') as HTMLElement
    if (crease) {
      gsap.set(crease, { opacity: 0 })
    }
  })

  const unfoldTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 80%',
      end: 'top 10%',
      scrub: 1.8,
    },
  })

  panelRefs.forEach((p, i) => {
    if (!p) {
      return
    }
    const d = panels[i]
    if (!d) {
      return
    }

    unfoldTl.to(p, {
      rotateX: 0,
      rotateY: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
    }, d.delay)

    const shadow = p.querySelector('.og-panel-shadow') as HTMLElement
    if (shadow) {
      unfoldTl.to(shadow, { opacity: 0, duration: 0.4 }, d.delay + 0.1)
    }

    const crease = p.querySelector('.og-panel-crease') as HTMLElement
    if (crease) {
      unfoldTl.to(crease, { opacity: 1, duration: 0.06 }, d.delay + 0.25)
      unfoldTl.to(crease, { opacity: 0, duration: 0.2 }, d.delay + 0.31)
    }
  })

  unfoldTl.to(flashRef.value, { opacity: 0.4, duration: 0.08 }, 0.6)
  unfoldTl.to(flashRef.value, { opacity: 0, duration: 0.3 }, 0.68)

  cleanupFns.push(() => {
    unfoldTl.scrollTrigger?.kill()
    unfoldTl.kill()
  })
}

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn())
})
</script>

<style lang="scss" scoped>
.origami-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0808;
}

.og-base-layer {
  position: absolute;
  inset: 0;
  z-index: 1;

  .og-base-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.og-panel-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
  perspective: 1500px;
}

.og-panel {
  position: absolute;
  will-change: transform, opacity;
  transform-style: preserve-3d;

  .og-panel-front {
    position: absolute;
    inset: 0;
    overflow: hidden;
    backface-visibility: hidden;

    .og-panel-img-wrap {
      position: absolute;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .og-panel-crease {
      position: absolute;
      background: rgba(255, 255, 255, 0.6);
      box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
      pointer-events: none;
      z-index: 2;
    }
  }

  .og-panel-shadow {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    pointer-events: none;
  }
}

.og-flash {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 250, 240, 0.8) 0%,
    rgba(255, 230, 200, 0.3) 30%,
    transparent 70%
  );
  pointer-events: none;
  mix-blend-mode: screen;
}
</style>

