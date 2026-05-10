<template>
  <div class="home-container">
    <div class="animation-demo">
      <h1>🎨 CSS 动画演示 (184+ 特效)</h1>
      <div class="animation-main">
        <div class="sidebar">
          <div class="sidebar-header">
            <h3>🎬 动画控制台</h3>
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
            <div ref="animatedElement" :class="animationClass" class="animated-box">
              <div class="box-content">
                <div class="box-icon">✨</div>
                <div class="box-text">{{ currentAnimationName }}</div>
              </div>
            </div>
          </div>
          <div class="preview-info">
            <div class="info-item">
              <span class="info-label">使用方法:</span>
              <span class="info-value">{{ usageExample }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">动画类:</span>
              <span class="info-value">{{ animationClass || '无动画' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'

const animationOptions = [
  {
    label: 'V1 基础动画',
    options: [
      { value: 'ua-v1-fadeIn', label: '🌫 淡入' },
      { value: 'ua-v1-fadeOut', label: '🌫 淡出' },
      { value: 'ua-v1-fadeInDown', label: '⬇️ 从上淡入' },
      { value: 'ua-v1-fadeOutDown', label: '⬇️ 向下淡出' },
      { value: 'ua-v1-fadeInUp', label: '⬆️ 从下淡入' },
      { value: 'ua-v1-fadeOutUp', label: '⬆️ 向上淡出' },
      { value: 'ua-v1-fadeInLeft', label: '⬅️ 从左淡入' },
      { value: 'ua-v1-fadeOutLeft', label: '⬅️ 向左淡出' },
      { value: 'ua-v1-fadeInRight', label: '➡️ 从右淡入' },
      { value: 'ua-v1-fadeOutRight', label: '➡️ 向右淡出' },
      { value: 'ua-v1-zoomIn', label: '🔍 缩放进入' },
      { value: 'ua-v1-zoomOut', label: '🔍 缩放退出' },
      { value: 'ua-v1-rotateIn', label: '🔄 旋转进入' },
      { value: 'ua-v1-rotateOut', label: '🔄 旋转退出' },
      { value: 'ua-v1-bounceIn', label: '⬆️ 弹跳进入' },
      { value: 'ua-v1-bounceOut', label: '⬇️ 弹跳退出' },
      { value: 'ua-v1-flash', label: '✨ 闪烁' },
      { value: 'ua-v1-shake', label: '↔️ 摇晃' },
      { value: 'ua-v1-pulse', label: '💓 脉冲' }
    ]
  },
  {
    label: 'V2 超级动画',
    options: [
      { value: 'ua-v2-hologram', label: '🔮 全息投影' },
      { value: 'ua-v2-vortexIn', label: '🌀 涡流吸入' },
      { value: 'ua-v2-sineWave', label: '🌊 正弦波浪' },
      { value: 'ua-v2-origami', label: '🎭 折纸效果' },
      { value: 'ua-v2-orbitIn', label: '💫 星轨旋转' },
      { value: 'ua-v2-kaleidoscope', label: '🔮 万花筒' },
      { value: 'ua-v2-nebulaExplosion', label: '🌌 星云爆发' },
      { value: 'ua-v2-transformer', label: '🤖 变形金刚' },
      { value: 'ua-v2-tidalWave', label: '🌊 潮汐效果' },
      { value: 'ua-v2-magicTransform', label: '🔮 魔术变换' },
      { value: 'ua-v2-dnaHelix', label: '🧬 DNA双螺旋' },
      { value: 'ua-v2-quantumLeap', label: '⚡ 量子跃迁' },
      { value: 'ua-v2-flameBurst', label: '🔥 火焰喷射' },
      { value: 'ua-v2-aurora', label: '🌌 极光效果' },
      { value: 'ua-v2-blackHole', label: '🕳️ 黑洞吸入' }
    ]
  },
  {
    label: 'V3 超现实动画',
    options: [
      { value: 'ua-v3-wormhole', label: '🌀 虫洞穿越' },
      { value: 'ua-v3-hologramPro', label: '🔮 专业全息' },
      { value: 'ua-v3-quantumEntanglement', label: '⚛️ 量子纠缠' },
      { value: 'ua-v3-neuralNetwork', label: '🧠 神经网络' },
      { value: 'ua-v3-metaverse', label: '🌐 元宇宙' },
      { value: 'ua-v3-vrImmersive', label: '🥽 VR沉浸' },
      { value: 'ua-v3-warpDrive', label: '🚀 曲速引擎' },
      { value: 'ua-v3-cyberpunk', label: '🤖 赛博朋克' },
      { value: 'ua-v3-galaxyVortex', label: '🌌 银河漩涡' },
      { value: 'ua-v3-nftReveal', label: '🎨 NFT揭示' },
      { value: 'ua-v3-astralProjection', label: '👻 灵魂出窍' },
      { value: 'ua-v3-timeTravel', label: '⏰ 时间回溯' },
      { value: 'ua-v3-crystalBall', label: '🔮 水晶球' },
      { value: 'ua-v3-bigBang', label: '💥 宇宙大爆炸' }
    ]
  },
  {
    label: 'V4 创意互动动画',
    options: [
      { value: 'ua-v4-magnetPull', label: '🎯 磁吸进入' },
      { value: 'ua-v4-floatIn', label: '💫 悬浮进入' },
      { value: 'ua-v4-waveIn', label: '🌊 波浪进入' },
      { value: 'ua-v4-elasticPop', label: '🎪 弹性弹出' },
      { value: 'ua-v4-focusIn', label: '🔍 聚焦进入' },
      { value: 'ua-v4-drawIn', label: '🎨 绘制进入' },
      { value: 'ua-v4-rotateIn', label: '🌀 旋转进入' },
      { value: 'ua-v4-prismIn', label: '💎 棱镜折射' },
      { value: 'ua-v4-scalePulse', label: '🎯 缩放脉冲' },
      { value: 'ua-v4-gradientFadeIn', label: '🌅 渐变显隐' },
      { value: 'ua-v4-linkIn', label: '🔗 链接进入' },
      { value: 'ua-v4-flipIn', label: '🎪 翻转进入' },
      { value: 'ua-v4-driftOut', label: '💫 飘散退出' },
      { value: 'ua-v4-shrinkOut', label: '🎨 收缩退出' },
      { value: 'ua-v4-spiralOut', label: '🌀 旋出退出' },
      { value: 'ua-v4-explodeOut', label: '💥 爆炸退出' },
      { value: 'ua-v4-disintegrateOut', label: '📦 解体退出' }
    ]
  },
  {
    label: 'V5 极限突破动画',
    options: [
      { value: 'ua-v5-extremeVortex', label: '🌀 极限漩涡' },
      { value: 'ua-v5-morphingKaleidoscope', label: '🌈 变形万花筒' },
      { value: 'ua-v5-auroraPhantom', label: '🌌 极光幻影' },
      { value: 'ua-v5-glassShatter', label: '💎 玻璃破碎' },
      { value: 'ua-v5-dimensionTransit', label: '🌀 维度穿越' },
      { value: 'ua-v5-liquidMorph', label: '💧 液态变形' },
      { value: 'ua-v5-particleReassemble', label: '✨ 粒子重组' },
      { value: 'ua-v5-spiralTime', label: '🌀 时间螺旋' },
      { value: 'ua-v5-pixelCollapse', label: '👾 像素坍塌' },
      { value: 'ua-v5-interstellar', label: '🌌 星际穿越' }
    ]
  },
  {
    label: 'V6 传奇动画',
    options: [
      { value: 'ua-v6-lightShadow', label: '🌟 光影穿梭' },
      { value: 'ua-v6-spaceFold', label: '🎭 空间折叠' },
      { value: 'ua-v6-crystalFission', label: '💎 晶体裂变' },
      { value: 'ua-v6-electromagneticStorm', label: '⚡ 电磁风暴' },
      { value: 'ua-v6-quantumRipples', label: '🌊 量子涟漪' },
      { value: 'ua-v6-dimensionGate', label: '🔮 维度之门' },
      { value: 'ua-v6-auroraSpectrum', label: '🌈 极光光谱' },
      { value: 'ua-v6-stardustAssembly', label: '💫 星尘聚合' },
      { value: 'ua-v6-rainbowFission', label: '🌈 彩虹裂变' },
      { value: 'ua-v6-lightningPulse', label: '⚡ 闪电脉冲' },
      { value: 'ua-v6-singularityExplosion', label: '🔮 奇点爆炸' },
      { value: 'ua-v6-deepSpace', label: '🌌 深空穿梭' }
    ]
  },
  {
    label: 'V7 终极动画',
    options: [
      { value: 'ua-v7-liquidIn', label: '🌊 液态进入' },
      { value: 'ua-v7-liquidOut', label: '🌊 液态流出' },
      { value: 'ua-v7-crystalIn', label: '💎 晶体进入' },
      { value: 'ua-v7-crystalOut', label: '💎 晶体消散' },
      { value: 'ua-v7-vortexIn', label: '🌀 涡流进入' },
      { value: 'ua-v7-vortexOut', label: '🌀 涡流喷发' },
      { value: 'ua-v7-rayIn', label: '🌟 光芒进入' },
      { value: 'ua-v7-rayOut', label: '🌟 光芒收束' },
      { value: 'ua-v7-fractalIn', label: '🎭 分形进入' },
      { value: 'ua-v7-fractalOut', label: '🎭 分形收敛' },
      { value: 'ua-v7-rainbowIn', label: '🌈 彩虹绽放' },
      { value: 'ua-v7-rainbowOut', label: '🌈 彩虹消散' },
      { value: 'ua-v7-bounceIn', label: '🎭 弹性弹跳' },
      { value: 'ua-v7-bounceOut', label: '🎭 弹跳离场' },
      { value: 'ua-v7-rippleIn', label: '🌊 波纹扩散' },
      { value: 'ua-v7-rippleOut', label: '🌊 波纹收缩' }
    ]
  },
  {
    label: 'V8 量子维度',
    options: [
      { value: 'ua-v8-quantumMaterialize', label: '⚛️ 量子实体化' },
      { value: 'ua-v8-dimensionalPhase', label: '🌀 维度相位' },
      { value: 'ua-v8-neuroPulse', label: '🧠 神经脉冲' },
      { value: 'ua-v8-hologramMaterial', label: '🔮 全息材质' },
      { value: 'ua-v8-temporalFlux', label: '⏰ 时间通量' },
      { value: 'ua-v8-energyCascade', label: '⚡ 能量级联' },
      { value: 'ua-v8-morphEssence', label: '✨ 形态本质' },
      { value: 'ua-v8-resonanceField', label: '🌊 共振场域' },
      { value: 'ua-v8-quantumEntangle', label: '⚛️ 量子纠缠' },
      { value: 'ua-v8-dimensionShift', label: '🌀 维度跃迁' },
      { value: 'ua-v8-plasmaCore', label: '☢️ 等离子核心' },
      { value: 'ua-v8-gravityWave', label: '🌊 引力波' },
      { value: 'ua-v8-stardustForm', label: '💫 星尘构成' },
      { value: 'ua-v8-neonFlux', label: '💡 霓虹通量' },
      { value: 'ua-v8-crystalMatrix', label: '💎 晶体矩阵' },
      { value: 'ua-v8-voidPortal', label: '🕳️ 虚空传送门' },
      { value: 'ua-v8-laserConstruct', label: '🔦 激光构建' },
      { value: 'ua-v8-aeroDynamic', label: '💨 空气动力学' },
      { value: 'ua-v8-liquidChrome', label: '🔮 液态铬' },
      { value: 'ua-v8-prismSpectrum', label: '🌈 棱镜光谱' }
    ]
  },
  {
    label: 'V9 时空幻境',
    options: [
      { value: 'ua-v9-timeDilation', label: '⏳ 时间膨胀' },
      { value: 'ua-v9-spatialFold', label: '🌀 空间折叠' },
      { value: 'ua-v9-quantumSuperposition', label: '⚛️ 量子叠加' },
      { value: 'ua-v9-temporalEcho', label: '🔁 时间回响' },
      { value: 'ua-v9-dimensionalFracture', label: '💔 维度破碎' },
      { value: 'ua-v9-voidConstruct', label: '🕳️ 虚空构建' },
      { value: 'ua-v9-aetherManifest', label: '✨ 以太显化' },
      { value: 'ua-v9-chaosTheory', label: '🎲 混沌理论' },
      { value: 'ua-v9-entropicDecay', label: '📉 熵增衰变' },
      { value: 'ua-v9-stringTheory', label: '🎵 弦理论' },
      { value: 'ua-v9-multiverse', label: '🌐 多元宇宙' },
      { value: 'ua-v9-parallelWorld', label: '🌈 平行世界' },
      { value: 'ua-v9-timelineSplit', label: '⚡ 时间线分叉' },
      { value: 'ua-v9-realityWarp', label: '🌀 现实扭曲' },
      { value: 'ua-v9-illusionBreak', label: '🔓 幻象破除' },
      { value: 'ua-v9-dreamscape', label: '🌙 梦境投影' },
      { value: 'ua-v9-consciousness', label: '🧠 意识上传' },
      { value: 'ua-v9-memoryTrace', label: '💾 记忆痕迹' },
      { value: 'ua-v9-soulFragment', label: '✨ 灵魂碎片' },
      { value: 'ua-v9-transcendence', label: '🌟 超越' }
    ]
  },
  {
    label: 'V11 爆炸破坏特效',
    options: [
      { value: 'ua-v11-nuclearExplosion', label: '💥 核爆震撼' },
      { value: 'ua-v11-glassShatter', label: '🔮 玻璃碎裂' },
      { value: 'ua-v11-crystalExplosion', label: '💎 晶体爆炸' },
      { value: 'ua-v11-pixelBurst', label: '👾 像素爆裂' },
      { value: 'ua-v11-fragmentShred', label: '✂️ 碎片撕裂' },
      { value: 'ua-v11-plasmaDetonation', label: '⚡ 等离子爆炸' },
      { value: 'ua-v11-energyShockwave', label: '🌊 能量冲击波' },
      { value: 'ua-v11-matterCollapse', label: '🌀 物质坍塌' },
      { value: 'ua-v11-stellarSupernova', label: '💫 超新星爆发' },
      { value: 'ua-v11-disintegration', label: '💥 原子解体' },
      { value: 'ua-v11-chainReaction', label: '🔗 连锁反应' },
      { value: 'ua-v11-shockwaveImpact', label: '💫 冲击撞击' },
      { value: 'ua-v11-debrisScatter', label: '🔩 碎片飞溅' },
      { value: 'ua-v11-plasmaBlast', label: '☢️ 等离子爆破' },
      { value: 'ua-v11-quantumExplosion', label: '⚛️ 量子爆炸' },
      { value: 'ua-v11-antiMatterBlast', label: '🌀 反物质爆裂' }
    ]
  }
]

const selectedAnimation = ref('')
const animatedElement = ref<HTMLElement>()
const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement>()

const animationClass = computed(() => {
  if (!selectedAnimation.value) return ''
  const version = selectedAnimation.value.match(/ua-v(\d+)/)?.[1]
  if (version && version <= '6') {
    return `ua-v${version}-animated ${selectedAnimation.value}`.trim()
  } else if (version === '7') {
    return selectedAnimation.value
  }
  return selectedAnimation.value
})

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

const usageExample = computed(() => {
  if (!selectedAnimation.value) return 'class="ua-animated [动画名]"'
  return `class="${animationClass.value}"`
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectAnimation = (value: string) => {
  selectedAnimation.value = value
  triggerAnimation()
}

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

const resetAnimation = () => {
  selectedAnimation.value = ''
}

const triggerAnimation = async () => {
  if (!selectedAnimation.value) return

  const el = animatedElement.value
  if (el) {
    // 移除所有动画类
    const classes = animationClass.value.split(' ').filter(c => c)
    el.classList.remove(...classes)

    // 强制重绘
    await nextTick()
    el.offsetWidth

    // 重新添加动画类
    el.classList.add(...classes)
  }
}
</script>

<style lang="scss">
@import './animation.css';
</style>

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
  max-height: 300px;
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
  font-size: 18px;
  font-weight: 600;
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
  font-size: 0.9rem;
  font-weight: 700;
  color: #333;
  word-break: break-all;
}

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
