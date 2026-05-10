<template>
  <div class="home-container">
    <!-- Tab 切换栏 -->
    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-btn"
        :class="{ active: activeTab === tab.key }"
        @click="changeTab(tab.key)"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <!-- Tab 内容区 -->
    <div class="tab-content">
      <transition :name="transitionName" mode="out-in">
        <KeepAlive>
          <component :is="activeTab === 'css' ? CssAnimation : GsapAnimation" :key="activeTab" />
        </KeepAlive>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CssAnimation from '@/views/animation/index.vue'
import GsapAnimation from '@/views/page2/index.vue'
let router = useRouter()

const tabs = [
  { key: 'css', icon: '🎨', label: 'CSS 动画 (184+ 特效)' },
  { key: 'gsap', icon: '⚡', label: 'JS 动画 (168+ 特效)' },
  { key: 'preview', icon: '⚡', label: 'demo动画' }
]

const activeTab = ref<'css' | 'gsap'>('css')
const transitionName = computed(() => activeTab.value === 'css' ? 'slide-left' : 'slide-right')

let changeTab = (key: 'css' | 'gsap') => {
  if('preview' === key){
    router.push('/preview')
    return
  }
  activeTab.value = key
}
</script>

<style lang="scss" scoped>
.home-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #050510 0%, #0a0a1f 25%, #0f0f2d 50%, #0a0a1f 75%, #050510 100%);
  overflow: hidden;
  position: relative;

  // 背景网格效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: gridMove 20s linear infinite;
    pointer-events: none;
    z-index: 0;
  }

  // 蓝紫色科技感光晕
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(ellipse at 15% 15%, rgba(99, 102, 241, 0.15) 0%, transparent 45%),
      radial-gradient(ellipse at 85% 25%, rgba(139, 92, 246, 0.12) 0%, transparent 40%),
      radial-gradient(ellipse at 25% 85%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
      radial-gradient(ellipse at 75% 75%, rgba(124, 58, 237, 0.08) 0%, transparent 45%),
      radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.04) 0%, transparent 60%);
    pointer-events: none;
    z-index: 1;
  }
}

@keyframes gridMove {
  0% {
    transform: translateY(0) translateX(0);
  }
  100% {
    transform: translateY(50px) translateX(50px);
  }
}

.tab-bar {
  position: relative;
  z-index: 10;
  display: flex;
  gap: 6px;
  padding: 16px 24px 0;
  background: linear-gradient(180deg,
    rgba(10, 10, 31, 0.95) 0%,
    rgba(10, 10, 31, 0.88) 100%
  );
  border-bottom: 1px solid rgba(99, 102, 241, 0.2);
  flex-shrink: 0;
  backdrop-filter: blur(20px);
  position: sticky;
  top: 0;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 60px rgba(99, 102, 241, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  animation: floatIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes floatIn {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.tab-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 12px 12px 0 0;
  background: transparent;
  color: rgba(148, 163, 184, 0.8);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg,
      rgba(99, 102, 241, 0.12) 0%,
      rgba(139, 92, 246, 0.06) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: inherit;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%);
    transform: scaleX(0);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 0 0 0 0;
  }

  &:hover {
    background: rgba(99, 102, 241, 0.08);
    color: rgba(226, 232, 240, 0.95);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
    border-color: rgba(99, 102, 241, 0.3);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &.active {
    background: linear-gradient(180deg,
      rgba(20, 20, 45, 0.92) 0%,
      rgba(15, 15, 35, 0.96) 100%
    );
    color: #a5b4fc;
    border-color: rgba(99, 102, 241, 0.4);
    box-shadow:
      0 4px 20px rgba(99, 102, 241, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);

    &::after {
      transform: scaleX(1);
    }

    .tab-icon {
      animation: iconPulse 2s ease-in-out infinite;
    }
  }
}

.tab-icon {
  font-size: 20px;
  line-height: 1;
  filter: drop-shadow(0 0 6px rgba(99, 102, 241, 0.5));
  transition: filter 0.3s ease;
}

.tab-label {
  white-space: nowrap;
  position: relative;
  z-index: 1;
}

@keyframes iconPulse {
  0%, 100% {
    filter: drop-shadow(0 0 8px rgba(165, 180, 252, 0.5));
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 16px rgba(165, 180, 252, 0.9));
    transform: scale(1.1);
  }
}

.tab-content {
  position: relative;
  z-index: 5;
  flex: 1;
  overflow: hidden;
  background: linear-gradient(180deg,
    rgba(10, 10, 31, 0.4) 0%,
    rgba(5, 5, 16, 0.6) 100%
  );

  // 让子组件撑满
  :deep(.home-container) {
    width: 100%;
    height: 100%;
  }
}

// Tab 切换动画
.slide-left-enter-active,
.slide-right-enter-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-leave-active,
.slide-right-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(60px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-60px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-60px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(60px);
}
</style>
