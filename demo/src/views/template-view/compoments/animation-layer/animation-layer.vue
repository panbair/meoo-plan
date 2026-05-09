<template>
  <div class="animation-layer">
    <!--    <test-nav :pageList="pageList" />-->
    <div
      v-for="(item, index) in pageList"
      :key="item.id + '_' + index + item.uuid"
      :uuid="item.uuid"
      :class="[item.horizontal ? 'horizontal' : 'vertical']"
    >
      <div
        class="panels-container"
        :uuid="item.uuid"
        :class="[item.className]"
        :style="{ width: `${(item.children?.length || 1) * 100}vw` }"
      >
        <div
          v-for="(panelItem, panelIndex) in item?.children || []"
          :key="panelItem.id + '_' + panelIndex + panelItem.uuid"
          :class="['panel', panelItem.className, panelItem.linkName]"
          :style="{
            ...panelItem.style,
            background: panelItem?.formData?.animationStyle?.bgUrl
              ? 'url(' + panelItem?.formData?.animationStyle?.bgUrl + ')'
              : panelItem?.formData?.animationStyle?.background ||
                item?.formData?.animationStyle?.background ||
                panelItem?.style?.backgroundImage,
            'background-size': 'cover',
            'background-repeat': 'no-repeat',
            'object-fit': 'cover'
          }"
          :uuid="panelItem.uuid"
          @dblclick.stop="$event => add($event, panelItem)"
        ></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { UseAnimation } from '../hooks'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { onMounted, onBeforeUnmount, watch } from 'vue'
// import TestNav from '~/components/test-nav/test-nav.vue'
let animation = UseAnimation()
// { addAnimation,initHorizontalAnimation}
let props = defineProps({
  pageList: {
    type: Array,
    default() {
      return []
    }
  },
  disable: {
    type: Boolean,
    default() {
      return false
    }
  }
})
// 创建
const add = ($event, data) => {
  if (!props.disable) {
    return
  }
  let item = animation.addAnimation($event)
  item.pid = data.id
  item.horizontal = data.horizontal
  if (data.children && data.children.length > 0) {
    return data.children.push(item)
  }
  data.children = [item]
}

// 当前执行的动画类型
let currentAnimationType = ref(null)
let currentCleanup = null

// 动画配置：区分需要传入pageList和无参数的动画
const ANIMATION_CONFIG = {
  // 需要传入pageList的动画
  withPageList: ['customizeAnimation', 'initHorizontalAnimation'],
  // 所有支持的动画类型（用于验证）
  allSupported: [
    // 基础动画
    'customizeAnimation',
    'initHorizontalAnimation',
    'infinitePanelScrollAnimation',
    'scalePanelScrollAnimation',
    // 新模板 V4-V11
    'threeDCardFlipAnimation',
    'particleWaveAnimation',
    'wormholeAnimation',
    'glassShatterAnimation',
    'liquidFlowAnimation',
    'fractalGrowAnimation',
    'quantumEntanglementAnimation',
    'magneticDistortionAnimation',
    // 专业级模板 V12-V19
    'origamiFoldAnimation',
    'moebiusTransformAnimation',
    'auroraFlowAnimation',
    'particleConvergeAnimation',
    'dnaHelixAnimation',
    'honeycombUnfoldAnimation',
    'hologramScanAnimation',
    'kaleidoscopeMirrorAnimation',
    // 精英级模板 V20-V27
    'liquidSurfaceTensionAnimation',
    'electromagneticWaveAnimation',
    'fragmentReassembleAnimation',
    'parallaxDepthAnimation',
    'matrixRainAnimation',
    'galaxyRotationAnimation',
    'fluidVortexAnimation',
    'panoramaUnfoldAnimation',
    // 传奇级模板 V28-V35
    'interstellarPortalAnimation',
    'quantumTunnelAnimation',
    'cyberspaceAnimation',
    'liquidMetalAnimation',
    'timeFoldAnimation',
    'nebulaBirthAnimation',
    'neonCityAnimation',
    'ultimateParallaxAnimation',
    // 精华级模板 V36-V43
    'smoothHorizontalAnimation',
    'elasticScaleAnimation',
    'infiniteSmoothAnimation',
    'fadeUpAnimation',
    'staggeredHorizontalAnimation',
    'scaleFadeAnimation',
    'infiniteRotateAnimation',
    'smoothComboAnimation',
    // 大师级模板 V44-V51
    'particleExplosionAnimation',
    'liquidMorphAnimation',
    'holographicDataflowAnimation',
    'magneticAttractionAnimation',
    'origamiUnfoldAnimation',
    'auroraRippleAnimation',
    'neonGlitchAnimation',
    'wormholeTravelAnimation'
  ]
}

// 清理所有动画
const cleanupAllAnimations = () => {
  try {
    // 先调用当前动画的cleanup函数
    if (currentCleanup && typeof currentCleanup === 'function') {
      currentCleanup()
      currentCleanup = null
    }

    // 清理所有克隆的节点
    const clonedNodes = document.querySelectorAll('[data-cloned="true"]')
    clonedNodes.forEach(node => {
      if (node.parentNode) {
        node.parentNode.removeChild(node)
      }
    })

    // 再执行全局清理（不刷新ScrollTrigger，避免引用错误）
    animation.killAllAnimation({ keepScrollPosition: true })
    currentAnimationType.value = null
  } catch (error) {
    console.error('清理动画失败:', error)
  }
}

// 执行动画（优化版）
const executeAnimation = async (animationType) => {
  // 如果动画类型相同，无需重新执行
  if (currentAnimationType.value === animationType) {
    return
  }

  // 验证动画类型是否支持
  if (!ANIMATION_CONFIG.allSupported.includes(animationType)) {
    console.warn(`[ExecuteAnimation] 不支持的动画类型: ${animationType}`)
    return
  }

  console.log(`切换动画: ${currentAnimationType.value} → ${animationType}`)

  try {
    // 先清理之前的动画
    cleanupAllAnimations()

    // 等待DOM更新和清理完成
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    // 执行新动画
    let cleanup = null

    // 根据是否需要pageList参数来调用
    if (ANIMATION_CONFIG.withPageList.includes(animationType)) {
      cleanup = animation[animationType](props.pageList)
    } else {
      cleanup = animation[animationType]()
    }

    // 验证返回的cleanup函数
    if (typeof cleanup === 'function') {
      currentCleanup = cleanup
      currentAnimationType.value = animationType
      console.log(`动画 ${animationType} 执行完成`)
    } else {
      console.warn(`[ExecuteAnimation] 动画 ${animationType} 未返回有效的cleanup函数`)
    }
  } catch (error) {
    console.error(`执行动画 ${animationType} 失败:`, error)
    // 发生错误时重置状态
    currentAnimationType.value = null
  }
}

onMounted(async function () {
  let [item = {}] = props.pageList || []

  console.log('pageList', props.pageList)

  if (!item.templateView) {
    return
  }

  await executeAnimation(item.templateView)
})

// 监听 templateView 变化，自动切换动画
watch(
  () => props.pageList?.[0]?.templateView,
  async (newView, oldView) => {
    if (newView && newView !== oldView) {
      await executeAnimation(newView)
    }
  },
  { immediate: false }
)

// 组件卸载时清理动画
onBeforeUnmount(() => {
  cleanupAllAnimations()
})
</script>
<style scoped lang="scss">
/* 隐藏全局横向滚动条 */
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

/* 动画层容器 */
.animation-layer {
  position: relative;
  width: 100vw;
  height: 100%;
  overflow-x: hidden;
}

/* 面板容器 */
.panels-container {
  position: relative;
  height: 100vh;
  display: flex;
  flex-wrap: nowrap;
  padding: 0;
  overflow: hidden;
}

/* 单个面板 */
.panels-container .panel {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: block;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  flex-shrink: 0;
}
</style>
