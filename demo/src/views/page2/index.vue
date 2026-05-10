<template>
  <div class="home-container">
    <div class="animation-demo">
      <h1>🎨 JS 炫酷动画库 (168+ 特效)</h1>
      <div class="animation-main">
        <div class="sidebar">
          <div class="sidebar-header">
            <h3>🎬 动画控制台</h3>
          </div>
          <div class="control-group">
            <label class="control-label">动画速度</label>
            <div class="speed-controls">
              <button
                  v-for="speed in speeds"
                  :key="speed.value"
                  :class="['speed-btn', { active: currentSpeed === speed.value }]"
                  @click="setSpeed(speed.value)"
              >
                {{ speed.label }}
              </button>
            </div>
          </div>
          <button class="play-btn" @click="triggerAnimation">
            <span class="play-icon">▶</span>
            <span class="play-text">播放动画</span>
          </button>
          <button class="reset-btn" @click="resetAnimation">
            <span class="reset-icon">↻</span>
            <span class="reset-text">重置</span>
          </button>
          <div class="control-group">
            <label class="control-label">选择动画</label>
            <div class="dropdown-wrapper" ref="dropdownRef">
              <div class="dropdown-trigger" @click="toggleDropdown">
                <span class="dropdown-value">{{ getCurrentAnimationLabel() || '-- 选择动画 --' }}</span>
                <span class="dropdown-arrow" :class="{ open: isDropdownOpen }">▼</span>
              </div>
              <div class="dropdown-menu" v-show="isDropdownOpen">
                <div
                  v-for="group in animationOptions"
                  :key="group.label"
                  class="dropdown-group"
                >
                  <div class="dropdown-group-label">{{ group.label }}</div>
                  <div
                    v-for="option in group.options"
                    :key="option.value"
                    class="dropdown-item"
                    :class="{ active: selectedAnimation === option.value }"
                    @click="selectAnimation(option.value)"
                  >
                    {{ option.label }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="preview-area">
          <div class="preview-header">
            <span class="preview-title">动画预览区域</span>
            <span v-if="selectedAnimation" class="current-animation">
              当前: {{ getCurrentAnimationLabel() }}
            </span>
          </div>
          <div class="preview-canvas">
            <div ref="animatedElement" class="animated-box">
              <div class="box-content">
                <div class="box-icon">✨</div>
                <div class="box-text">{{currentAnimationName}}</div>
              </div>
            </div>
          </div>
          <div class="preview-info">
            <div class="info-item">
              <span class="info-label">动画类型:</span>
              <span class="info-value">{{ getAnimationType() }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">播放速度:</span>
              <span class="info-value">{{ currentSpeed }}x</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted, computed} from 'vue'
import gsap from "gsap";
import { config } from './animation/config'
import { animationOptions } from './animationOptions'
import type { AnimationConfig, AnimationOptionGroup } from './animation/config'

const selectedAnimation = ref('')
const animatedElement = ref<HTMLElement>()
const currentSpeed = ref(1)
const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement>()

const speeds = [
  { label: '0.5x', value: 0.5 },
  { label: '1x', value: 1 },
  { label: '1.5x', value: 1.5 },
  { label: '2x', value: 2 }
]

const setSpeed = (speed: number) => {
  currentSpeed.value = speed
}
const currentAnimationName = computed(() => {
  return getCurrentAnimationLabel() || '请选择一个动画'
})
const getCurrentAnimationLabel = () => {
  if (!selectedAnimation.value) return ''
  for (const group of animationOptions) {
    const option = group.options.find((opt: any) => opt.value === selectedAnimation.value)
    if (option) return option.label
  }
  return ''
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectAnimation = (value: string) => {
  selectedAnimation.value = value
  // isDropdownOpen.value = false
  triggerAnimation()
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const getAnimationType = () => {
  if (!selectedAnimation.value) return '-'
  const item = config[selectedAnimation.value]
  if (!item) return '-'
  return item.type
}

const resetAnimation = () => {
  if (!animatedElement.value) return
  gsap.set(animatedElement.value, {
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
    scale: 1,
    opacity: 1,
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
    x: 0,
    y: 0,
    skewX: 0,
    skewY: 0,
    z: 0,
    filter: 'blur(0px) brightness(1) contrast(1) saturate(1) hue-rotate(0deg)',
    clearProps: 'filter'
  })
}

const triggerAnimation = async () => {
  if (!selectedAnimation.value || !animatedElement.value) return

  const el = animatedElement.value

  // 先重置元素状态
  gsap.set(el, {
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
    scale: 1,
    opacity: 1,
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
    x: 0,
    y: 0,
    skewX: 0,
    skewY: 0,
    z: 0,
    filter: 'blur(0px) brightness(1) contrast(1) saturate(1) hue-rotate(0deg)',
    clearProps: 'filter'
  })

  let item = config[selectedAnimation.value]
  if (!item) {
    return
  }

  // 设置全局动画速度
  gsap.globalTimeline.timeScale(currentSpeed.value)

  // 处理不同类型的动画
  if (item.type === 'timeline') {
    const tl = gsap.timeline()
    item.animations.forEach((anim: gsap.TweenVars) => {
      tl.to(el, anim)
    })
  } else if (item.type === 'fromTo') {
    gsap.fromTo(el, item.animations[0] as gsap.TweenVars, item.animations[1] as gsap.TweenVars)
  } else if (item.type === 'to') {
    gsap.to(el, item.animations[0] as gsap.TweenVars)
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
}

.animation-demo {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 1100px;
  width: 100%;
  text-align: center;
  backdrop-filter: blur(10px);
}

.animation-main {
  display: flex;
  flex-direction: row;
  gap: 32px;
  min-height: 500px;
}

h1 {
  color: #333;
  margin-bottom: 24px;
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 侧边栏样式 */
.sidebar {
  width: 320px;
  background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.06);
}

.sidebar-header {
  text-align: left;
  border-bottom: 2px solid rgba(102, 126, 234, 0.2);
  padding-bottom: 16px;

  h3 {
    color: #333;
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
  }
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #555;
  text-align: left;
}

.dropdown-wrapper {
  position: relative;
}

.dropdown-trigger {
  padding: 14px 16px;
  font-size: 14px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  background: white;
  color: #333;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }

  &:active {
    transform: scale(0.99);
  }
}

.dropdown-value {
  flex: 1;
}

.dropdown-arrow {
  color: #999;
  transition: transform 0.3s ease;

  &.open {
    transform: rotate(180deg);
  }
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  max-height: 230px;
  overflow-y: auto;
  z-index: 100;
  border: 1px solid #e9ecef;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #667eea;
    border-radius: 3px;
  }
}

.dropdown-group {
  &:not(:last-child) {
    border-bottom: 1px solid #e9ecef;
  }
}

.dropdown-group-label {
  padding: 12px 16px 8px;
  font-size: 12px;
  font-weight: 700;
  color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dropdown-item {
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: rgba(102, 126, 234, 0.08);
    color: #667eea;
  }

  &.active {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
    color: #667eea;
    font-weight: 600;
  }
}

.speed-controls {
  display: flex;
  gap: 8px;
}

.speed-btn {
  flex: 1;
  padding: 10px 8px;
  font-size: 13px;
  font-weight: 600;
  color: #666;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    border-color: #667eea;
    color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }

  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-color: transparent;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
}

.play-btn, .reset-btn {
  width: 100%;
  padding: 14px 24px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.play-btn {
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  }

  &:active {
    transform: translateY(0);
  }
}

.reset-btn {
  color: #666;
  background: white;
  border: 2px solid #e9ecef;

  &:hover {
    border-color: #764ba2;
    color: #764ba2;
    background: rgba(118, 75, 162, 0.05);
  }
}

.play-icon, .reset-icon {
  font-size: 1.1em;
}

/* 预览区域样式 */
.preview-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.preview-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #555;
}

.current-animation {
  font-size: 0.85rem;
  color: #667eea;
  font-weight: 600;
  background: rgba(102, 126, 234, 0.1);
  padding: 6px 12px;
  border-radius: 6px;
}

.preview-canvas {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #f0f2f5 0%, #e4e6eb 100%);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  min-height: 350px;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-image:
      radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
}

.animated-box {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 20px 50px rgba(102, 126, 234, 0.4);
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.box-content {
  text-align: center;
  padding: 20px;
}

.box-icon {
  font-size: 2.5rem;
  margin-bottom: 8px;
  animation: pulse 2s ease-in-out infinite;
}

.box-text {
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 2px;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.preview-info {
  display: flex;
  gap: 16px;
  padding: 16px 20px;
  background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.info-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 1rem;
  font-weight: 700;
  color: #333;
}

/* 响应式设计 */
@media (max-width: 900px) {
  .animation-main {
    flex-direction: column;
    min-height: auto;
  }

  .sidebar {
    width: 100%;
  }

  .animated-box {
    width: 160px;
    height: 160px;
  }

  .box-icon {
    font-size: 2rem;
  }

  .box-text {
    font-size: 1.2rem;
  }
}
</style>
