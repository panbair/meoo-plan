<template>
  <div class="depth-ladder" ref="parentRef">
    <!-- 背景层 -->
    <div class="depth-bg" ref="bgRef"></div>

    <!-- 三维容器 -->
    <div class="depth-container">
      <!-- 图片网格 -->
      <div
        v-for="(img, index) in images"
        :key="index"
        class="depth-image"
        :ref="el => (imageRefs[index] = el as HTMLElement)"
        :class="[`depth-${img.layer}`, `pos-${index}`]"
        :style="{
          '--initial-z': img.z + 'px',
          '--initial-blur': img.layer === 'far' ? '8px' : img.layer === 'mid' ? '4px' : '0px',
          '--initial-scale': img.layer === 'far' ? '0.85' : img.layer === 'mid' ? '0.92' : '1',
        }"
      >
        <div class="image-inner">
          <img :src="img.url" :alt="`Gallery ${index + 1}`" />
        </div>
        <div class="image-shadow"></div>
      </div>

      <!-- 粒子效果层 -->
      <div class="depth-particles" ref="particlesRef"></div>
    </div>

    <!-- 标题 -->
    <div class="depth-title" ref="titleRef">
      <span class="title-cn">空间纵深阶梯</span>
      <span class="title-en">DEPTH LADDER</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TweenCleanup {
  revert: () => void
}

// 图片数据：按景深层分布 [远景 x3, 中景 x3, 近景 x3]
const images = [
  // 远景层 (far) - 最远，最小，最模糊
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', layer: 'far', z: -60 },
  { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80', layer: 'far', z: -60 },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', layer: 'far', z: -60 },
  // 中景层 (mid) - 中间距离
  { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', layer: 'mid', z: -30 },
  { url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&q=80', layer: 'mid', z: -30 },
  { url: 'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=600&q=80', layer: 'mid', z: -30 },
  // 近景层 (near) - 最近，正常大小，清晰
  { url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80', layer: 'near', z: 0 },
  { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80', layer: 'near', z: 0 },
  { url: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=600&q=80', layer: 'near', z: 0 },
]

const parentRef = ref<HTMLElement | null>(null)
const bgRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)
const imageRefs = ref<(HTMLElement | null)[]>([])

const cleanupFns: TweenCleanup[] = []

// 景深层顺序：远 → 中 → 近
const layerOrder = ['far', 'mid', 'near']

onMounted(() => {
  if (!parentRef.value) return

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1.5,
      },
    })

    // 初始化图片状态（初始位置已在CSS中设置）
    imageRefs.value.forEach((el) => {
      if (!el) return
      gsap.set(el, {
        translateZ: el.style.getPropertyValue('--initial-z') || '0px',
        filter: `blur(${el.style.getPropertyValue('--initial-blur') || '0px'})`,
        scale: el.style.getPropertyValue('--initial-scale') || '1',
        opacity: 0,
        y: 40,
      })
    })

    // 创建景深层粒子
    if (particlesRef.value) {
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div')
        particle.className = 'dp-particle'
        particle.style.cssText = `
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          width: ${1 + Math.random() * 2}px;
          height: ${1 + Math.random() * 2}px;
          opacity: ${0.2 + Math.random() * 0.4};
        `
        particlesRef.value.appendChild(particle)
      }

      gsap.set(particlesRef.value.querySelectorAll('.dp-particle'), {
        scale: 0,
        opacity: 0,
      })
    }

    // 粒子淡入
    tl.to(
      particlesRef.value?.querySelectorAll('.dp-particle') || [],
      {
        scale: 1,
        opacity: (i: number) => 0.2 + Math.random() * 0.3,
        duration: 0.8,
        stagger: 0.02,
        ease: 'power2.out',
      },
      0
    )

    // 按景深层层序动画
    let baseTime = 0.1
    layerOrder.forEach((layer, layerIndex) => {
      const layerImages = imageRefs.value.filter(
        (el, i) => el && images[i].layer === layer
      )

      layerImages.forEach((el, i) => {
        if (!el) return

        const delay = baseTime + i * 0.08

        // 从景深处弹入
        tl.to(
          el,
          {
            translateZ: 0,
            scale: 1,
            filter: 'blur(0px)',
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
          },
          delay
        )

        // 触位微弹
        tl.to(
          el,
          {
            y: -3,
            duration: 0.15,
            ease: 'power2.out',
          },
          delay + 0.4
        )

        tl.to(
          el,
          {
            y: 0,
            duration: 0.25,
            ease: 'back.out(1.2)',
          },
          delay + 0.55
        )

        // 阴影加深
        tl.to(
          el.querySelector('.image-shadow'),
          {
            opacity: 0.3,
            duration: 0.3,
            ease: 'power2.out',
          },
          delay + 0.4
        )
      })

      baseTime += 0.2
    })

    // 全部归位后亮度聚焦
    tl.to(
      imageRefs.value.filter(Boolean),
      {
        filter: 'brightness(1)',
        duration: 0.6,
        ease: 'power2.out',
      },
      0.9
    )

    // 标题淡入
    tl.fromTo(
      titleRef.value,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
      1.2
    )

    // 背景视差
    tl.to(
      bgRef.value,
      {
        y: -50,
        duration: 1,
        ease: 'none',
      },
      0
    )

    cleanupFns.push({
      revert: () => tl.kill(),
    })
  }, parentRef.value)
})

onUnmounted(() => {
  cleanupFns.forEach((fn) => fn.revert())
  ScrollTrigger.getAll().forEach((st) => st.kill())
})
</script>

<style lang="scss" scoped>
.depth-ladder {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0a1628 0%, #1a1a2e 50%, #0d1b2a 100%);
}

.depth-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(88, 166, 255, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(138, 92, 246, 0.06) 0%, transparent 50%),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 60px,
      rgba(255, 255, 255, 0.01) 60px,
      rgba(255, 255, 255, 0.01) 61px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 60px,
      rgba(255, 255, 255, 0.01) 60px,
      rgba(255, 255, 255, 0.01) 61px
    );
  will-change: transform;
}

.depth-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) perspective(1200px);
  display: grid;
  grid-template-columns: repeat(3, 200px);
  grid-template-rows: repeat(3, 150px);
  gap: 20px;
}

.depth-image {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  transform-style: preserve-3d;
  will-change: transform, filter, opacity;
}

.image-inner {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.image-shadow {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, transparent 50%);
  border-radius: 8px;
  opacity: 0;
  pointer-events: none;
}

// 景深层视觉差异
.depth-far {
  .image-inner {
    img {
      filter: saturate(0.7) contrast(0.9);
    }
  }
}

.depth-mid {
  .image-inner {
    img {
      filter: saturate(0.85);
    }
  }
}

.depth-near {
  .image-inner {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
}

// 位置微调
.pos-0 { transform: translate(calc(-50% - 110px), calc(-50% - 80px)); }
.pos-1 { transform: translate(-50%, calc(-50% - 80px)); }
.pos-2 { transform: translate(calc(-50% + 110px), calc(-50% - 80px)); }
.pos-3 { transform: translate(calc(-50% - 110px), -50%); }
.pos-4 { transform: translate(-50%, -50%); }
.pos-5 { transform: translate(calc(-50% + 110px), -50%); }
.pos-6 { transform: translate(calc(-50% - 110px), calc(-50% + 80px)); }
.pos-7 { transform: translate(-50%, calc(-50% + 80px)); }
.pos-8 { transform: translate(calc(-50% + 110px), calc(-50% + 80px)); }

.depth-particles {
  position: absolute;
  inset: -100px;
  pointer-events: none;
  transform-style: preserve-3d;
}

.dp-particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.3);
  animation: dpFloat 8s ease-in-out infinite;

  @for $i from 1 through 30 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 0.2}s;
      animation-duration: #{6 + random(4)}s;
    }
  }
}

@keyframes dpFloat {
  0%, 100% {
    transform: translateY(0) translateZ(0);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) translateZ(20px);
    opacity: 0.6;
  }
}

.depth-title {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;

  .title-cn {
    display: block;
    font-size: 28px;
    font-weight: 600;
    color: #fff;
    letter-spacing: 8px;
    text-shadow: 0 0 30px rgba(138, 92, 246, 0.5);
    margin-bottom: 8px;
  }

  .title-en {
    display: block;
    font-size: 12px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 6px;
    text-transform: uppercase;
  }
}
</style>
