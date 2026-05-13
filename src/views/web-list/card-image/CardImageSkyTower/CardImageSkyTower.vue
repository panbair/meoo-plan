<template>
  <section ref="parentRef" class="sky-tower">
    <div class="building-scene">
      <!-- 远景层：巨型混凝土柱阵 -->
      <div ref="columnLayerRef" class="layer layer-column">
        <div class="concrete-wall">
          <div class="column-grid">
            <div v-for="i in 8" :key="i" class="column">
              <div class="column-shadow"></div>
            </div>
          </div>
          <div class="wall-texture"></div>
        </div>
        <div ref="pillarLightRef" class="pillar-light"></div>
      </div>

      <!-- 中景层：玻璃幕墙画作 -->
      <div ref="glassLayerRef" class="layer layer-glass">
        <div ref="glassFrameRef" class="glass-frame">
          <div class="glass-border">
            <div class="corner-accent corner-tl"></div>
            <div class="corner-accent corner-tr"></div>
            <div class="corner-accent corner-bl"></div>
            <div class="corner-accent corner-br"></div>
          </div>
          <div ref="glassReflectionRef" class="glass-reflection"></div>
          <img
            ref="glassImageRef"
            class="glass-image"
            src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80"
            alt="City Architecture"
          />
          <div class="glass-overlay"></div>
        </div>
      </div>

      <!-- 近景层：钛金属铭文板 -->
      <div ref="metalLayerRef" class="layer layer-metal">
        <div ref="metalPlateRef" class="metal-plate">
          <div class="plate-etch">
            <span
              v-for="(char, i) in 'ARCHITECT'"
              :key="`a-${i}`"
              class="etch-char"
            >{{ char }}</span>
          </div>
          <div class="plate-etch plate-etch-bottom">
            <span
              v-for="(char, i) in 'GRAVITY'"
              :key="`g-${i}`"
              class="etch-char"
            >{{ char }}</span>
          </div>
          <div ref="metalGlowRef" class="metal-glow"></div>
          <div ref="metalEdgeRef" class="metal-edge"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const columnLayerRef = ref<HTMLElement | null>(null)
const glassLayerRef = ref<HTMLElement | null>(null)
const metalLayerRef = ref<HTMLElement | null>(null)
const glassFrameRef = ref<HTMLElement | null>(null)
const glassImageRef = ref<HTMLElement | null>(null)
const glassReflectionRef = ref<HTMLElement | null>(null)
const metalPlateRef = ref<HTMLElement | null>(null)
const metalGlowRef = ref<HTMLElement | null>(null)
const metalEdgeRef = ref<HTMLElement | null>(null)
const pillarLightRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!parentRef.value) return

  const parent = parentRef.value

  // ========== 远景层：混凝土柱阵下坠 ==========
  // 柱阵主动画
  const columnTween = gsap.to(columnLayerRef.value, {
    y: '25vh',
    scale: 1.08,
    scrollTrigger: {
      trigger: parent,
      start: 'top center',
      end: 'bottom top',
      scrub: 1.5,
    },
  })
  cleanupFns.push(() => columnTween.scrollTrigger?.kill())
  cleanupFns.push(() => columnTween.kill())

  // 柱阵阴影加深
  const columnShadows = columnLayerRef.value?.querySelectorAll('.column-shadow')
  if (columnShadows?.length) {
    const shadowTween = gsap.to(columnShadows, {
      opacity: 0.9,
      scrollTrigger: {
        trigger: parent,
        start: 'top center',
        end: 'bottom top',
        scrub: 1.5,
      },
    })
    cleanupFns.push(() => shadowTween.scrollTrigger?.kill())
    cleanupFns.push(() => shadowTween.kill())
  }

  // 柱间光效
  if (pillarLightRef.value) {
    const lightTween = gsap.to(pillarLightRef.value, {
      opacity: 0.5,
      y: '30vh',
      scrollTrigger: {
        trigger: parent,
        start: 'top center',
        end: 'bottom top',
        scrub: 1.5,
      },
    })
    cleanupFns.push(() => lightTween.scrollTrigger?.kill())
    cleanupFns.push(() => lightTween.kill())
  }

  // 墙面亮度衰减
  const concreteWall = columnLayerRef.value?.querySelector('.concrete-wall')
  if (concreteWall) {
    const wallTween = gsap.to(concreteWall, {
      filter: 'brightness(0.6)',
      scrollTrigger: {
        trigger: parent,
        start: 'top center',
        end: 'bottom top',
        scrub: 1.5,
      },
    })
    cleanupFns.push(() => wallTween.scrollTrigger?.kill())
    cleanupFns.push(() => wallTween.kill())
  }

  // ========== 中景层：玻璃画作上浮 ==========
  // 画作主动画
  const glassTween = gsap.to(glassLayerRef.value, {
    y: '-15vh',
    scrollTrigger: {
      trigger: parent,
      start: 'top center',
      end: 'bottom top',
      scrub: 1.5,
    },
  })
  cleanupFns.push(() => glassTween.scrollTrigger?.kill())
  cleanupFns.push(() => glassTween.kill())

  // 画框微仰角
  if (glassFrameRef.value) {
    const frameTween = gsap.to(glassFrameRef.value, {
      rotateX: -3,
      rotateZ: 1,
      scrollTrigger: {
        trigger: parent,
        start: 'top center',
        end: 'bottom top',
        scrub: 1.5,
      },
    })
    cleanupFns.push(() => frameTween.scrollTrigger?.kill())
    cleanupFns.push(() => frameTween.kill())
  }

  // 图片亮度提升
  if (glassImageRef.value) {
    const imgTween = gsap.to(glassImageRef.value, {
      filter: 'brightness(1.1) saturate(1.15)',
      scrollTrigger: {
        trigger: parent,
        start: 'top center',
        end: 'bottom top',
        scrub: 1.5,
      },
    })
    cleanupFns.push(() => imgTween.scrollTrigger?.kill())
    cleanupFns.push(() => imgTween.kill())
  }

  // 玻璃反光增强
  if (glassReflectionRef.value) {
    const reflectTween = gsap.to(glassReflectionRef.value, {
      opacity: 0.4,
      scrollTrigger: {
        trigger: parent,
        start: 'top center',
        end: 'bottom top',
        scrub: 1.5,
      },
    })
    cleanupFns.push(() => reflectTween.scrollTrigger?.kill())
    cleanupFns.push(() => reflectTween.kill())
  }

  // ========== 近景层：金属铭文暴烈上升 ==========
  // 铭文板主动画
  const metalTween = gsap.to(metalLayerRef.value, {
    y: '-40vh',
    scrollTrigger: {
      trigger: parent,
      start: 'top center',
      end: 'bottom top',
      scrub: 1.5,
    },
  })
  cleanupFns.push(() => metalTween.scrollTrigger?.kill())
  cleanupFns.push(() => metalTween.kill())

  // 金属辉光
  if (metalGlowRef.value) {
    const glowTween = gsap.to(metalGlowRef.value, {
      opacity: 0.9,
      scale: 1.3,
      scrollTrigger: {
        trigger: parent,
        start: 'top center',
        end: 'bottom top',
        scrub: 1.5,
      },
    })
    cleanupFns.push(() => glowTween.scrollTrigger?.kill())
    cleanupFns.push(() => glowTween.kill())
  }

  // 金属边缘高光
  if (metalEdgeRef.value) {
    const edgeTween = gsap.to(metalEdgeRef.value, {
      opacity: 1,
      borderColor: 'rgba(147, 197, 253, 0.6)',
      scrollTrigger: {
        trigger: parent,
        start: 'top center',
        end: 'bottom top',
        scrub: 1.5,
      },
    })
    cleanupFns.push(() => edgeTween.scrollTrigger?.kill())
    cleanupFns.push(() => edgeTween.kill())
  }

  // 字母逐字弹射
  const etchChars = metalPlateRef.value?.querySelectorAll('.etch-char')
  if (etchChars?.length) {
    const charTween = gsap.to(etchChars, {
      y: -20,
      filter: 'blur(1px) brightness(1.3)',
      stagger: {
        each: 0.03,
        from: 'start',
      },
      ease: 'power3.out',
      scrollTrigger: {
        trigger: parent,
        start: 'top center',
        end: 'bottom top',
        scrub: 1.5,
      },
    })
    cleanupFns.push(() => charTween.scrollTrigger?.kill())
    cleanupFns.push(() => charTween.kill())
  }

  // ========== 阻尼惯性效果（滚动停止后） ==========
  // 柱阵惯性
  ScrollTrigger.create({
    trigger: parent,
    start: 'top center',
    end: 'bottom top',
    onLeave: () => {
      if (columnLayerRef.value) {
        gsap.to(columnLayerRef.value, {
          y: '+=5px',
          duration: 0.3,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        })
      }
    },
    onEnterBack: () => {
      if (columnLayerRef.value) {
        gsap.to(columnLayerRef.value, {
          y: '-=5px',
          duration: 0.3,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        })
      }
    },
  })

  // 画作惯性
  ScrollTrigger.create({
    trigger: parent,
    start: 'top center',
    end: 'bottom top',
    onLeave: () => {
      if (glassLayerRef.value) {
        gsap.to(glassLayerRef.value, {
          y: '-=2px',
          duration: 0.2,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        })
      }
    },
    onEnterBack: () => {
      if (glassLayerRef.value) {
        gsap.to(glassLayerRef.value, {
          y: '+=2px',
          duration: 0.2,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        })
      }
    },
  })

  // 铭文惯性
  ScrollTrigger.create({
    trigger: parent,
    start: 'top center',
    end: 'bottom top',
    onLeave: () => {
      if (metalLayerRef.value) {
        gsap.to(metalLayerRef.value, {
          y: '-=12px',
          duration: 0.15,
          ease: 'power3.out',
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            if (metalLayerRef.value) {
              gsap.to(metalLayerRef.value, {
                y: '+=12px',
                duration: 0.6,
                ease: 'back.out(2)',
              })
            }
          },
        })
      }
    },
    onEnterBack: () => {
      if (metalLayerRef.value) {
        gsap.to(metalLayerRef.value, {
          y: '+=12px',
          duration: 0.15,
          ease: 'power3.out',
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            if (metalLayerRef.value) {
              gsap.to(metalLayerRef.value, {
                y: '-=12px',
                duration: 0.6,
                ease: 'back.out(2)',
              })
            }
          },
        })
      }
    },
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.sky-tower {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 50%, #0d0d14 100%);
}

.building-scene {
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 2000px;
}

.layer {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform, filter;
}

/* ==================== 远景层：混凝土柱阵 ==================== */
.layer-column {
  z-index: 1;

  .concrete-wall {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      #1f1f2a 0%,
      #15151f 40%,
      #0d0d14 100%
    );
  }

  .column-grid {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 0;
    padding: 0 5%;
  }

  .column {
    position: relative;
    background: linear-gradient(
      90deg,
      rgba(50, 50, 65, 0.5) 0%,
      rgba(35, 35, 48, 0.7) 30%,
      rgba(25, 25, 38, 0.8) 50%,
      rgba(35, 35, 48, 0.7) 70%,
      rgba(50, 50, 65, 0.5) 100%
    );

    .column-shadow {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.5) 0%,
        rgba(0, 0, 0, 0.3) 50%,
        rgba(0, 0, 0, 0.6) 100%
      );
      opacity: 0.6;
    }

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        180deg,
        transparent 0px,
        rgba(255, 255, 255, 0.015) 1px,
        transparent 2px,
        transparent 25px
      );
    }
  }

  .wall-texture {
    position: absolute;
    inset: 0;
    background:
      repeating-linear-gradient(
        90deg,
        transparent 0px,
        rgba(255, 255, 255, 0.008) 1px,
        transparent 2px,
        transparent 80px
      );
    pointer-events: none;
  }

  .pillar-light {
    position: absolute;
    bottom: -10%;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 80%;
    background: radial-gradient(
      ellipse 60% 40% at 50% 100%,
      rgba(99, 102, 241, 0.25) 0%,
      transparent 65%
    );
    opacity: 0.2;
    pointer-events: none;
  }
}

/* ==================== 中景层：玻璃画作 ==================== */
.layer-glass {
  z-index: 2;

  .glass-frame {
    position: relative;
    width: min(75vw, 900px);
    height: min(55vh, 500px);
    transform-style: preserve-3d;
    perspective: 1000px;

    .glass-border {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        145deg,
        rgba(70, 70, 90, 0.5) 0%,
        rgba(25, 25, 40, 0.7) 100%
      );
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 4px;
      box-shadow:
        0 40px 80px rgba(0, 0, 0, 0.6),
        inset 0 1px 0 rgba(255, 255, 255, 0.18),
        inset 0 -1px 0 rgba(0, 0, 0, 0.4);

      .corner-accent {
        position: absolute;
        width: 30px;
        height: 30px;
        border: 2px solid rgba(255, 255, 255, 0.35);
        border-radius: 2px;

        &.corner-tl {
          top: 10px;
          left: 10px;
          border-right: none;
          border-bottom: none;
        }

        &.corner-tr {
          top: 10px;
          right: 10px;
          border-left: none;
          border-bottom: none;
        }

        &.corner-bl {
          bottom: 10px;
          left: 10px;
          border-right: none;
          border-top: none;
        }

        &.corner-br {
          bottom: 10px;
          right: 10px;
          border-left: none;
          border-top: none;
        }
      }
    }

    .glass-reflection {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        125deg,
        rgba(255, 255, 255, 0.12) 0%,
        transparent 35%,
        transparent 65%,
        rgba(255, 255, 255, 0.06) 100%
      );
      pointer-events: none;
      opacity: 0.2;
    }

    .glass-image {
      position: absolute;
      inset: 15px;
      width: calc(100% - 30px);
      height: calc(100% - 30px);
      object-fit: cover;
      filter: brightness(0.92) contrast(1.02);
      border-radius: 2px;
    }

    .glass-overlay {
      position: absolute;
      inset: 15px;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 12%),
        linear-gradient(0deg, rgba(0, 0, 0, 0.12) 0%, transparent 18%);
      pointer-events: none;
      border-radius: 2px;
    }
  }
}

/* ==================== 近景层：钛金属铭文 ==================== */
.layer-metal {
  z-index: 3;

  .metal-plate {
    position: relative;
    padding: 50px 80px;
    background: linear-gradient(
      180deg,
      rgba(45, 45, 60, 0.95) 0%,
      rgba(30, 30, 42, 0.98) 100%
    );
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    box-shadow:
      0 30px 70px rgba(0, 0, 0, 0.7),
      inset 0 1px 0 rgba(255, 255, 255, 0.12);

    .plate-etch {
      display: flex;
      justify-content: center;
      gap: 0.12em;
      margin-bottom: 12px;

      &.plate-etch-bottom {
        margin-bottom: 0;
        margin-top: 12px;
      }
    }

    .etch-char {
      font-family: 'Cinzel', 'Times New Roman', serif;
      font-size: clamp(42px, 9vw, 88px);
      font-weight: 700;
      letter-spacing: 0.18em;
      color: #e8e8f0;
      background: linear-gradient(
        180deg,
        #ffffff 0%,
        #d0d0d8 25%,
        #a0a0a8 55%,
        #707078 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
    }

    .metal-glow {
      position: absolute;
      inset: -50px;
      background: radial-gradient(
        ellipse 80% 60% at 50% 50%,
        rgba(147, 197, 253, 0.3) 0%,
        rgba(99, 153, 255, 0.15) 40%,
        transparent 70%
      );
      opacity: 0.4;
      pointer-events: none;
    }

    .metal-edge {
      position: absolute;
      inset: 0;
      border: 2px solid rgba(147, 197, 253, 0.3);
      border-radius: 8px;
      opacity: 0;
      pointer-events: none;
    }
  }
}
</style>
