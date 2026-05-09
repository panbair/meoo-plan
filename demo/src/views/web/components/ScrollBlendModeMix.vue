<template>
  <section class="sbm-scroll-blend-mode-mix-222">
    <div class="sbm-container-222">
      <div class="sbm-header-222">
        <h2 class="sbm-title-222">混合模式动画</h2>
      </div>

      <div class="sbm-blend-area-222">
        <div class="sbm-layer sbm-background-layer-222">
          <div class="sbm-gradient-1-222"></div>
          <div class="sbm-gradient-2-222"></div>
        </div>

        <div class="sbm-layer sbm-middle-layer-222">
          <div class="sbm-shape-222 sbm-shape-1-222"></div>
          <div class="sbm-shape-222 sbm-shape-2-222"></div>
          <div class="sbm-shape-222 sbm-shape-3-222"></div>
        </div>

        <div class="sbm-layer sbm-foreground-layer-222">
          <div class="sbm-active-blend-222" ref="activeBlend"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const activeBlend = ref(null)
const blendModes = [
  'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
  'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference',
  'exclusion', 'hue', 'saturation', 'color', 'luminosity'
]
let lastModeIndex = -1

const switchMode = (modeId) => {
  if (activeBlend.value) {
    activeBlend.value.style.mixBlendMode = modeId
  }

  const shapes = document.querySelectorAll('.sbm-shape-222')
  shapes.forEach((shape, index) => {
    const modeIndex = (blendModes.indexOf(modeId) + index) % blendModes.length
    shape.style.mixBlendMode = blendModes[modeIndex]
  })
}

onMounted(() => {
  const shapes = document.querySelectorAll('.sbm-shape-222')
  shapes.forEach((shape, index) => {
    shape.style.mixBlendMode = blendModes[index]
  })

  gsap.timeline({
    scrollTrigger: {
      trigger: '.sbm-scroll-blend-mode-mix-222',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 0.5,
      onUpdate: (self) => {
        const modeIndex = Math.min(Math.floor(self.progress * blendModes.length), blendModes.length - 1)
        if (modeIndex !== lastModeIndex) {
          lastModeIndex = modeIndex
          switchMode(blendModes[modeIndex])
        }

        const intensity = 0.3 + (self.progress * 0.7)
        document.querySelector('.sbm-foreground-layer-222').style.opacity = intensity
        document.querySelector('.sbm-middle-layer-222').style.opacity = intensity * 0.8
      }
    }
  })
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.sbm-scroll-blend-mode-mix-222 {
  min-height: 100vh;
  padding: 60px 20px;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.sbm-container-222 {
  width: 100%;
  max-width: 1200px;
  text-align: center;

  opacity: 1 !important;}

.sbm-header-222 {
  margin-bottom: 60px;
}

.sbm-title-222 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #0ea5e9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.sbm-blend-area-222 {
  width: 100%;
  max-width: 800px;
  height: 500px;
  margin: 0 auto;
  border-radius: 30px;
  overflow: hidden;
  position: relative;
  background: #0f172a;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

.sbm-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;

  opacity: 1 !important;}

.sbm-background-layer-222 {
  z-index: 1;
}

.sbm-gradient-1-222 {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #8b5cf6 100%);
  animation: gradientShift 10s ease-in-out infinite alternate;

  opacity: 1 !important;}

.sbm-gradient-2-222 {
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, #ef4444 0%, #f97316 50%, #ec4899 100%);
  mix-blend-mode: overlay;
  opacity: 0.6;
  animation: gradientShift 12s ease-in-out infinite alternate-reverse;
}

.sbm-middle-layer-222 {
  z-index: 2;
  pointer-events: none;
}

.sbm-shape-222 {
  position: absolute;
  width: 250px;
  height: 250px;
  border-radius: 30px;
  mix-blend-mode: multiply;
  transition: mix-blend-mode 0.3s ease;

  opacity: 1 !important;}

.sbm-shape-1-222 {
  top: 5%;
  left: 10%;
  background: linear-gradient(135deg, #ef4444, #f97316);
  transform: rotate(-20deg);

  opacity: 1 !important;}

.sbm-shape-2-222 {
  top: 35%;
  right: 10%;
  background: linear-gradient(135deg, #10b981, #06b6d4);
  transform: rotate(15deg);

  opacity: 1 !important;}

.sbm-shape-3-222 {
  bottom: 10%;
  left: 35%;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  transform: rotate(-10deg);

  opacity: 1 !important;}

.sbm-foreground-layer-222 {
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.3;
}

.sbm-active-blend-222 {
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #ec4899,
    #8b5cf6,
    #0ea5e9,
    #10b981,
    #f59e0b,
    #ef4444,
    #ec4899
  );
  mix-blend-mode: normal;
  transition: mix-blend-mode 0.3s ease;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
  animation: rotate 25s linear infinite;

  opacity: 1 !important;}

@keyframes gradientShift {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(40deg); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .sbm-title-222 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .sbm-blend-area-222 {
    height: 400px;
  
  opacity: 1 !important;}

  .sbm-shape-222 {
    width: 150px;
    height: 150px;
    border-radius: 20px;
  
  opacity: 1 !important;}

  .sbm-active-blend-222 {
    width: 200px;
    height: 200px;
  
  opacity: 1 !important;}
}
</style>
