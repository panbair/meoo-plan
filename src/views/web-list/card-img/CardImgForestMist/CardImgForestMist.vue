<template>
  <div ref="containerRef" class="forest-mist-container">
    <!-- 冷杉林背景 -->
    <div ref="forestBgRef" class="forest-bg">
      <img
        class="forest-img"
        src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80"
        alt="Forest"
      />
    </div>

    <!-- 雾气层 -->
    <div ref="mistLayerRef" class="mist-layer mist-white" />

    <!-- 第二层雾气（稍微偏移） -->
    <div ref="mistLayer2Ref" class="mist-layer mist-blue" />

    <!-- 斜光穿透 -->
    <div ref="lightBeamRef" class="light-beam" />
    <div ref="lightBeam2Ref" class="light-beam light-beam-2" />
    <div ref="lightBeam3Ref" class="light-beam light-beam-3" />

    <!-- 颗粒噪点 -->
    <div ref="noiseRef" class="forest-noise" />

    <!-- 内容区域 -->
    <div ref="contentRef" class="forest-content">
      <div class="content-inner">
        <h2 ref="subtitleRef" class="forest-subtitle">幽林雾息</h2>
        <h1 ref="titleRef" class="forest-title">
          <span class="title-line">雾霭</span>
          <span class="title-line">森林</span>
          <span class="title-line accent">呼吸</span>
        </h1>
        <p ref="descRef" class="forest-desc">
          晨雾弥漫的冷杉林深处<br />
          树影若隐若现<br />
          整个世界在均匀深长的吐纳中
        </p>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div ref="footerRef" class="forest-footer">
      <div class="footer-line" />
      <span class="footer-text">FOREST MIST</span>
    </div>

    <!-- 角落装饰 -->
    <svg ref="cornerRef" class="corner-decoration" viewBox="0 0 100 100">
      <path d="M0 0 L30 0 L30 5 L5 5 L5 30 L0 30 Z" fill="currentColor" />
    </svg>
    <svg class="corner-decoration corner-tr" viewBox="0 0 100 100">
      <path d="M100 0 L70 0 L70 5 L95 5 L95 30 L100 30 Z" fill="currentColor" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TweenCleanup {
  kill: () => void
}

const containerRef = ref<HTMLElement | null>(null)
const forestBgRef = ref<HTMLElement | null>(null)
const mistLayerRef = ref<HTMLElement | null>(null)
const mistLayer2Ref = ref<HTMLElement | null>(null)
const lightBeamRef = ref<HTMLElement | null>(null)
const lightBeam2Ref = ref<HTMLElement | null>(null)
const lightBeam3Ref = ref<HTMLElement | null>(null)
const noiseRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const descRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const cornerRef = ref<SVGElement | null>(null)

const cleanupFns: TweenCleanup[] = []

function initBreathingAnimation() {
  const ctx = gsap.context(() => {
    // 主呼吸动画 - 9秒周期，吸气6秒呼气3秒
    const breathTl = gsap.timeline({ repeat: -1 })

    // 吸气阶段 6秒 - scale 1.00 -> 1.02
    breathTl
      .to(forestBgRef.value, {
        scale: 1.02,
        duration: 6,
        ease: 'power1.inOut'
      })
      // 雾气反向呼吸 - 吸气时雾变薄
      .to(mistLayerRef.value, {
        opacity: 0.3,
        duration: 6,
        ease: 'power1.inOut'
      }, 0)
      .to(mistLayer2Ref.value, {
        opacity: 0.2,
        duration: 6,
        ease: 'power1.inOut'
      }, 0)
      // 光束随雾变薄而增强
      .to(lightBeamRef.value, {
        opacity: 0.25,
        duration: 6,
        ease: 'power1.inOut'
      }, 0)
      .to(lightBeam2Ref.value, {
        opacity: 0.2,
        duration: 6,
        ease: 'power1.inOut'
      }, 0)
      .to(lightBeam3Ref.value, {
        opacity: 0.15,
        duration: 6,
        ease: 'power1.inOut'
      }, 0)
      // 色温漂移 - 吸气时偏冷
      .to(forestBgRef.value, {
        filter: 'brightness(0.95) saturate(0.9) hue-rotate(-3deg)',
        duration: 6,
        ease: 'power1.inOut'
      }, 0)

    // 呼气阶段 3秒 - scale 1.02 -> 1.00
    breathTl
      .to(forestBgRef.value, {
        scale: 1.00,
        duration: 3,
        ease: 'power1.inOut'
      })
      .to(mistLayerRef.value, {
        opacity: 0.5,
        duration: 3,
        ease: 'power1.inOut'
      }, 0)
      .to(mistLayer2Ref.value, {
        opacity: 0.35,
        duration: 3,
        ease: 'power1.inOut'
      }, 0)
      .to(lightBeamRef.value, {
        opacity: 0.12,
        duration: 3,
        ease: 'power1.inOut'
      }, 0)
      .to(lightBeam2Ref.value, {
        opacity: 0.1,
        duration: 3,
        ease: 'power1.inOut'
      }, 0)
      .to(lightBeam3Ref.value, {
        opacity: 0.06,
        duration: 3,
        ease: 'power1.inOut'
      }, 0)
      .to(forestBgRef.value, {
        filter: 'brightness(0.88) saturate(0.85) hue-rotate(3deg)',
        duration: 3,
        ease: 'power1.inOut'
      }, 0)

    cleanupFns.push({ kill: () => breathTl.kill() })

    // 雾气缓慢漂移
    gsap.to(mistLayerRef.value, {
      x: '5%',
      duration: 12,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    })

    gsap.to(mistLayer2Ref.value, {
      x: '-5%',
      y: '-3%',
      duration: 15,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    })

    // 光束微弱摆动
    gsap.to(lightBeamRef.value, {
      rotation: 2,
      duration: 8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    })

  }, containerRef.value!)

  cleanupFns.push({ kill: () => ctx.revert() })
}

function initScrollAnimation() {
  if (!containerRef.value) return

  // 背景视差
  if (forestBgRef.value) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top 100%',
        end: 'bottom 20%',
        scrub: 1.5
      }
    })
    tl.to(forestBgRef.value, { y: '15%', duration: 1 }, 0)
    cleanupFns.push({ kill: () => tl.kill() })
  }

  // 雾气视差
  if (mistLayerRef.value) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top 100%',
        end: 'bottom 20%',
        scrub: 1.5
      }
    })
    tl.to(mistLayerRef.value, { y: '-20%', duration: 1 }, 0)
    cleanupFns.push({ kill: () => tl.kill() })
  }

  if (mistLayer2Ref.value) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top 100%',
        end: 'bottom 20%',
        scrub: 1.5
      }
    })
    tl.to(mistLayer2Ref.value, { y: '-25%', x: '-10%', duration: 1 }, 0)
    cleanupFns.push({ kill: () => tl.kill() })
  }

  // 光束视差
  if (lightBeamRef.value) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top 100%',
        end: 'bottom 20%',
        scrub: 1.5
      }
    })
    tl.to(lightBeamRef.value, { y: '-30%', duration: 1 }, 0)
    cleanupFns.push({ kill: () => tl.kill() })
  }

  // 内容入场动画
  const entryTl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    }
  })

  entryTl
    .fromTo(subtitleRef.value,
      { opacity: 0, y: 30, letterSpacing: '0.5em' },
      { opacity: 1, y: 0, letterSpacing: '0.3em', duration: 1.2, ease: 'power2.out' }
    )
    .fromTo(titleRef.value,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
      '-=0.6'
    )
    .fromTo(descRef.value,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.4'
    )
    .fromTo(footerRef.value,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.2'
    )

  cleanupFns.push({ kill: () => entryTl.kill() })

  // 内容滚动视差
  if (contentRef.value) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top 100%',
        end: 'bottom 20%',
        scrub: 1.5
      }
    })
    tl.to(contentRef.value, { y: '-10%', duration: 1 }, 0)
    cleanupFns.push({ kill: () => tl.kill() })
  }
}

function handleMouseMove(e: MouseEvent) {
  const x = e.clientX / window.innerWidth
  const y = e.clientY / window.innerHeight

  // 背景跟随鼠标
  if (forestBgRef.value) {
    gsap.to(forestBgRef.value, {
      x: (x - 0.5) * 15,
      y: (y - 0.5) * 10,
      duration: 2.5,
      ease: 'power2.out'
    })
  }

  // 雾气跟随鼠标（反向）
  if (mistLayerRef.value) {
    gsap.to(mistLayerRef.value, {
      x: (0.5 - x) * 25,
      y: (0.5 - y) * 20,
      duration: 3,
      ease: 'power2.out'
    })
  }

  if (mistLayer2Ref.value) {
    gsap.to(mistLayer2Ref.value, {
      x: (0.5 - x) * 35,
      y: (0.5 - y) * 25,
      duration: 2.5,
      ease: 'power2.out'
    })
  }

  // 光束跟随
  if (lightBeamRef.value) {
    gsap.to(lightBeamRef.value, {
      x: (x - 0.5) * 20,
      duration: 2,
      ease: 'power2.out'
    })
  }

  // 内容层轻微跟随
  if (contentRef.value) {
    gsap.to(contentRef.value, {
      x: (x - 0.5) * -8,
      y: (y - 0.5) * -5,
      duration: 2,
      ease: 'power2.out'
    })
  }
}

function handleMouseLeave() {
  // 回弹效果
  if (forestBgRef.value) {
    gsap.to(forestBgRef.value, {
      x: 0,
      y: 0,
      duration: 2.5,
      ease: 'elastic.out(1, 0.5)'
    })
  }

  if (mistLayerRef.value) {
    gsap.to(mistLayerRef.value, {
      x: 0,
      y: 0,
      duration: 3,
      ease: 'elastic.out(1, 0.5)'
    })
  }

  if (mistLayer2Ref.value) {
    gsap.to(mistLayer2Ref.value, {
      x: 0,
      y: 0,
      duration: 2.5,
      ease: 'elastic.out(1, 0.5)'
    })
  }

  if (lightBeamRef.value) {
    gsap.to(lightBeamRef.value, {
      x: 0,
      duration: 2,
      ease: 'elastic.out(1, 0.5)'
    })
  }

  if (contentRef.value) {
    gsap.to(contentRef.value, {
      x: 0,
      y: 0,
      duration: 2,
      ease: 'elastic.out(1, 0.5)'
    })
  }
}

onMounted(() => {
  initBreathingAnimation()
  initScrollAnimation()

  if (containerRef.value) {
    containerRef.value.addEventListener('mousemove', handleMouseMove)
    containerRef.value.addEventListener('mouseleave', handleMouseLeave)
  }
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.kill())

  if (containerRef.value) {
    containerRef.value.removeEventListener('mousemove', handleMouseMove)
    containerRef.value.removeEventListener('mouseleave', handleMouseLeave)
  }

  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === containerRef.value) {
      st.kill()
    }
  })
})
</script>

<style scoped lang="scss">
.forest-mist-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #c8d8c5 0%,
    #a8b8a0 25%,
    #8fa888 50%,
    #7a9870 75%,
    #6a8860 100%
  );
  cursor: crosshair;
}

// 冷杉林背景
.forest-bg {
  position: absolute;
  inset: -10%;
  z-index: 1;

  .forest-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.88) saturate(0.85) hue-rotate(0deg);
  }
}

// 雾气层基础
.mist-layer {
  position: absolute;
  inset: -20%;
  z-index: 2;
  pointer-events: none;
}

// 白色雾气层
.mist-white {
  background: radial-gradient(
    ellipse 120% 80% at 50% 60%,
    rgba(235, 245, 240, 0.5) 0%,
    rgba(220, 235, 228, 0.35) 40%,
    rgba(200, 220, 210, 0.15) 70%,
    transparent 100%
  );
  opacity: 0.5;
}

// 蓝色雾气层
.mist-blue {
  background: radial-gradient(
    ellipse 100% 60% at 30% 70%,
    rgba(180, 200, 195, 0.4) 0%,
    rgba(170, 190, 185, 0.25) 50%,
    transparent 100%
  );
  opacity: 0.35;
}

// 斜光穿透
.light-beam {
  position: absolute;
  top: -10%;
  left: 20%;
  width: 35%;
  height: 130%;
  background: linear-gradient(
    165deg,
    rgba(255, 255, 250, 0.18) 0%,
    rgba(245, 250, 240, 0.12) 30%,
    rgba(230, 245, 230, 0.06) 60%,
    transparent 100%
  );
  transform: rotate(12deg);
  transform-origin: top center;
  z-index: 3;
  pointer-events: none;
  opacity: 0.15;
  filter: blur(30px);
}

.light-beam-2 {
  top: -5%;
  left: 45%;
  width: 25%;
  height: 120%;
  background: linear-gradient(
    170deg,
    rgba(250, 255, 245, 0.15) 0%,
    rgba(240, 250, 235, 0.08) 50%,
    transparent 100%
  );
  transform: rotate(8deg);
  opacity: 0.1;
  filter: blur(40px);
}

.light-beam-3 {
  top: -8%;
  left: 65%;
  width: 20%;
  height: 125%;
  background: linear-gradient(
    175deg,
    rgba(255, 255, 250, 0.12) 0%,
    rgba(245, 252, 240, 0.06) 60%,
    transparent 100%
  );
  transform: rotate(5deg);
  opacity: 0.06;
  filter: blur(35px);
}

// 颗粒噪点
.forest-noise {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  animation: noiseShift 0.8s steps(4) infinite;
}

@keyframes noiseShift {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-1%, -1%); }
  50% { transform: translate(1%, 1%); }
  75% { transform: translate(-1%, 2%); }
  100% { transform: translate(1%, -1%); }
}

// 内容区域
.forest-content {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.content-inner {
  text-align: center;
  padding: 2rem;
}

.forest-subtitle {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(0.75rem, 1.5vw, 1rem);
  font-weight: 400;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(60, 90, 65, 0.8);
  margin: 0 0 1.5rem 0;
}

.forest-title {
  font-family: 'Noto Serif SC', 'STSong', Georgia, serif;
  font-size: clamp(3rem, 10vw, 8rem);
  font-weight: 200;
  line-height: 1.1;
  color: rgba(45, 70, 50, 0.95);
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2em;

  .title-line {
    display: block;
    text-shadow:
      0 2px 20px rgba(255, 255, 255, 0.5),
      0 0 40px rgba(200, 220, 200, 0.3);
  }

  .accent {
    color: rgba(70, 100, 75, 0.9);
    font-weight: 300;
  }
}

.forest-desc {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(0.9rem, 1.8vw, 1.2rem);
  font-weight: 400;
  line-height: 2;
  color: rgba(55, 85, 60, 0.75);
  margin: 2rem 0 0 0;
  letter-spacing: 0.05em;
}

// 底部装饰
.forest-footer {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;

  .footer-line {
    width: 60px;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(60, 90, 65, 0.4),
      transparent
    );
  }

  .footer-text {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 0.65rem;
    letter-spacing: 0.4em;
    color: rgba(60, 90, 65, 0.5);
    text-transform: uppercase;
  }
}

// 角落装饰
.corner-decoration {
  position: absolute;
  width: 60px;
  height: 60px;
  color: rgba(60, 90, 65, 0.25);
  z-index: 20;

  &.corner-tr {
    top: 30px;
    right: 30px;
    transform: rotate(90deg);
  }
}
</style>
