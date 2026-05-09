<template>
  <div v-if="!showPreview" class="over-layer"></div>
  <div class="dialog-content" :class="{ 'is-show-preview': showPreview }">
    <RightMain @show-preview="show"></RightMain>
    <el-button
      v-if="showPreview"
      title="打开模板"
      class="toggle-button"
      :class="{ 'is-show': showPreview, 'is-hover': isHover }"
      @click="show"
      @mouseenter="handleEnter"
      @mouseleave="handleLeave"
    >
      <el-icon class="button-icon" :class="{ 'icon-rotate': isHover }">
        <DArrowRight />
      </el-icon>
<!--      <span class="button-text">打开模板</span>-->
    </el-button>
  </div>
</template>
<script setup lang="ts">
import { DArrowRight } from '@element-plus/icons-vue'
import RightMain from '../right/right.vue'

const emits = defineEmits(['showPreview'])
const showPreview = ref(false)
const isHover = ref(false)

const show = (data: any) => {
  showPreview.value = true
  emits('showPreview', showPreview.value, data)
}

const handleEnter = () => {
  isHover.value = true
  showPreview.value = false
}

const handleLeave = () => {
  isHover.value = false
  showPreview.value = true
}
</script>
<style scoped lang="scss">
.over-layer {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 98;
}

.dialog-content {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  max-width: 80vw;
  display: flex;
  flex-direction: row;
  justify-content: center;
  z-index: 99;
  padding: 10px;
  box-sizing: border-box;
  background-image: linear-gradient(90deg, rgb(246, 249, 249) 0%, rgb(239, 252, 251) 100%);
  transition: all 1s ease-in;

  &.is-show-preview {
    transform: translateX(-100%);
  }

  .toggle-button {
    position: absolute;
    right: -40px;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 60px;
    border-radius: 0 15px 15px 0;
    padding: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 4px;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;

    :deep(.el-icon) {
      margin: 0;
      width: auto;
      height: auto;
    }

    &:hover {
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
      width: 50px;
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
      transform: translateY(-50%) translateX(-5px);
    }

    &:active {
      transform: translateY(-50%) translateX(-3px) scale(0.95);
    }

    .button-icon {
      font-size: 24px;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      margin: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon-rotate {
      transform: translateX(23px);
    }

    .button-text {
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.5px;
      opacity: 0;
      transform: translateX(-10px);
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    &:hover .button-text {
      opacity: 1;
      transform: translateX(0);
    }

    // 添加光效动画
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
      );
      transition: left 0.5s ease;
    }

    &:hover::before {
      left: 100%;
    }
  }
}
</style>
