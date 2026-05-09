<template>
  <div class="template-view">
    <div class="header-container">
      <el-button class="back-button" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回模板列表
      </el-button>
    </div>
    <animation-layer
      v-if="pageList && pageList.length > 0"
      :page-list="pageList"
      :disable="false"
    ></animation-layer>
    <empty-template v-else></empty-template>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import AnimationLayer from '../template-view/compoments/animation-layer/animation-layer.vue'
import EmptyTemplate from '../template-view/compoments/empty-template/empty-template.vue'
import { UseAnimation } from '../template-view/compoments/hooks'
let { killAllAnimation } = UseAnimation()
import { configData } from './config'
let pageList = ref([])
let { query } = useRoute()
let router = useRouter()
provide('pageList', pageList)

// 返回上一页
let goBack = () => {
  router.back()
}

let showPreview = (isShow, data) => {
  if (isShow) {
    pageList.value = []
    nextTick(() => {
      let timer = setTimeout(() => {
        clearTimeout(timer)
        let list = data ? JSON.parse(data) : []
        console.log('showPreview', list)
        pageList.value = list || []
      }, 100)
    })
  }
}

let getData = () => {
  let templateView = query.templateView
  if (templateView) {
    configData.forEach(item => {
      if (item.templateView == templateView) {
        showPreview(true, item.list)
      }
    })
  }
}
onMounted(() => {
  console.log('template')
  killAllAnimation()
  getData()
})
</script>
<style scoped lang="scss">
body {
  overscroll-behavior: none;
  height: 100vh;
}
.template-view {
  overflow: hidden;
  position: relative;

  .header-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    padding: 15px 30px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);

    .back-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 24px;
      border: none;
      border-radius: 25px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
      }

      &:active {
        transform: translateY(0);
        box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
      }

      :deep(.el-icon) {
        font-size: 16px;
      }
    }
  }
}

.container-horizontal {
  overscroll-behavior: none;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-wrap: nowrap;
}

.panel {
  position: relative;
  width: 100vw;
  height: 100vh;
}

// 响应式设计
@media (max-width: 768px) {
  .template-view {
    .header-container {
      padding: 12px 20px;

      .back-button {
        padding: 8px 18px;
        font-size: 12px;

        :deep(.el-icon) {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
