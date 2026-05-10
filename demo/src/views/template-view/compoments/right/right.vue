<template>
  <div class="right">
    <div class="right-header">
      <div class="label">
        <el-input
          v-model="projectName"
          clearable
          placeholder="✨ 请输入项目名称"
          class="project-input"
        >
          <template #prefix>
            <el-icon><Document /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="but">
        <el-button
          class="btn-gradient btn-vertical"
          :disabled="disBut.verticalDisable"
          @click="add(false)"
        >
          <el-icon class="btn-icon"><CirclePlus /></el-icon>
          添加竖屏
        </el-button>
        <el-button
          class="btn-gradient btn-horizontal"
          :disabled="disBut.horizontalDisable"
          @click="add(true)"
        >
          <el-icon class="btn-icon"><Remove /></el-icon>
          添加横屏
        </el-button>
        <el-button class="btn-gradient btn-save" @click="save">
          <el-icon class="btn-icon"><Select /></el-icon>
          保存
        </el-button>
        <el-button class="btn-gradient btn-preview" @click="read">
          <el-icon class="btn-icon"><View /></el-icon>
          查看效果
        </el-button>
        <el-button class="btn-gradient btn-edit" @click="goToList">
          <el-icon class="btn-icon"><Document /></el-icon>
          项目列表
        </el-button>
        <el-button class="btn-gradient btn-edit" @click="goToTemplate">
          <el-icon class="btn-icon"><Document /></el-icon>
          模板选择
        </el-button>
      </div>
    </div>
    <div class="list">
      <el-scrollbar class="custom-scrollbar" max-height="calc(100vh - 230px)">
        <div v-if="pageList && pageList.length > 0" id="SlickListRef" class="main">
          <SlickList :key="pageListKey" v-model:list="pageList" axis="y" append-to="#SlickListRef">
            <template #item="{ item, index }">
              <div class="list-main list-main-pbr" :style="{ width: `${maxWidth}px` }">
                <div
                  v-for="(it, i) in item?.children || []"
                  :key="it.id + '_' + i"
                  class="panel"
                  :style="{
                    ...item.style,
                    background: it?.formData?.animationStyle?.bgUrl
                      ? 'url(' + it?.formData?.animationStyle?.bgUrl + ')'
                      : it?.formData?.animationStyle?.background ||
                        item?.formData?.animationStyle?.background ||
                        it?.style?.backgroundImage,
                    'background-size': '100% 100%',
                    'background-repeat': 'no-repeat'
                  }"
                >
                  <div class="link-name">{{ it.name }}</div>
                  <div class="link-id">编号:{{ it.linkName }}</div>
                  <div class="panel-actions">
                    <el-button
                      class="btn-icon-btn btn-add"
                      :icon="Plus"
                      circle
                      @click.stop="addItem(pageList, item, index, it, i)"
                    />
                    <el-button
                      class="btn-icon-btn btn-delete"
                      :icon="Close"
                      circle
                      @click.stop="removeItem(pageList, item, index, it, i)"
                    />
                    <!--                    <el-button type="primary" :icon="Edit" circle @click.stop="editItem(pageList, item, index,it, i)"/>-->
                  </div>
                </div>
              </div>
            </template>
          </SlickList>
        </div>
        <empty-template v-else></empty-template>
      </el-scrollbar>
    </div>
  </div>
</template>
<script setup lang="ts">
import EmptyTemplate from '../empty-template/empty-template.vue'
// import CustomizeDialog from '../customize-dialog/customize-dialog.vue'

import {
  Plus,
  Remove,
  CirclePlus,
  Close,
  Edit,
  Document,
  Picture,
  Select,
  View
} from '@element-plus/icons-vue'

import { SlickList } from 'vue-slicksort'
import { butOption, getData as getItemData, getItem } from './config'
import _ from 'lodash'
import { keys, keys2 } from './keys.js'
import { ElMessage } from 'element-plus'
import { UseApi } from '../apiHooks.js'
let { router, query, listData, pageList, getData, updateData, addData } = UseApi()

let emits = defineEmits(['showPreview'])
let visibel = ref(false)
let activeItem = ref({})
let activeItItem = ref({})
let disBut = computed(() => {
  let key = query.templateView || 'customizeAnimation'
  return butOption[key]
})

let activeId = ref('')
let projectName = ref('')
let pageListKey = ref(0)

let add = isTrue => {
  let data = getItemData(isTrue, query.templateView)
  data.formData = {
    animationKeys: query.templateView === 'customizeAnimation' ? [...keys] : [...keys2], // 动画设置
    animationStyle: {
      xPercent: 100
    } // 滚动动画样式
  }
  pageList.value.push(data)
  console.log(pageList.value)
}
let maxWidth = computed(() => {
  let w = 0
  pageList.value.forEach(item => {
    w = Math.max(w, (item?.children || []).length)
  })
  return w * 150
})
// 清理数组中的 undefined 元素
const cleanPageList = () => {
  if (pageList.value && Array.isArray(pageList.value)) {
    pageList.value = pageList.value.filter(item => item !== undefined && item !== null)
    pageList.value.forEach(item => {
      if (item?.children && Array.isArray(item.children)) {
        item.children = item.children.filter(child => child !== undefined && child !== null)
      }
    })
  }
}

let addItem = (data, item, index, it, i) => {
  // 清理数组后再添加
  cleanPageList()
  let horizontal = item.horizontal
  let panel = getItem(horizontal, query.templateView)
  panel.pid = item.id
  panel.parentClassName = item.className
  if (horizontal) {
    console.log('horizontal', panel)
    return item.children.splice(i, 0, panel)
  }
  let verticalData = getItemData(horizontal, query.templateView)

  console.log('verticalData', verticalData)
  pageList.value.splice(index, 0, verticalData)
}

let removeItem = (data, item, index, it, i) => {
  let horizontal = item.horizontal
  if (horizontal) {
    if (item.children.length <= 2) {
      return pageList.value.splice(index, 1)
    }
    return item.children.splice(i, 1)
  }
  pageList.value.splice(index, 1)
  // 删除后清理数组
  cleanPageList()
}
// let editItem = (data, item, index, it, i) => {
//   activeItem.value = item
//   activeItItem.value = it
//   visibel.value = true
//   console.log(data, item, index, it, i)
// }
let read = () => {
  let param = JSON.stringify(pageList.value)
  emits('showPreview', param)
}
let goToList = async () => {
  router.push({
    path: '/template-list'
  })
}
let goToTemplate = async () => {
  router.push({
    path: '/template'
  })
}

let submit = (data = {}) => {
  activeItItem.value.formData = data
  console.log(126, pageList)
}

let save = async () => {
  if (!projectName.value) {
    console.log('请输入项目名称') // 调试用
    ElMessage({
      message: '请输入项目名称',
      type: 'error',
      duration: 3000,
      showClose: true,
      offset: 100,
      zIndex: 9999
    })
    return
  }

  try {
    if (query.state === 'edit' || activeId.value) {
      console.log(pageList.value)

      await updateData(pageList.value, {
        id: activeId.value,
        name: '首页',
        templateView: query.templateView,
        projectName: projectName.value
      }).then(data => {
        activeId.value = data?.id || data
      })
    } else {
      await addData(pageList.value, {
        name: '首页',
        templateView: query.templateView,
        projectName: projectName.value
      }).then(data => {
        activeId.value = data?.id || data
      })
    }
    ElMessage({
      message: '保存成功',
      type: 'success',
      duration: 2000,
      offset: 100
    })
  } catch (err) {
    console.error('保存失败:', err)
    ElMessage({
      message: '保存失败',
      type: 'error',
      duration: 3000,
      showClose: true,
      offset: 100
    })
  }
}

let getCurrent = () => {
  getData().then(data => {
    console.log(159, data)
    activeId.value = data?.id || ''
    projectName.value = data?.projectName || ''
    query.templateView = listData.value.templateView || query.templateView
  })
}

onMounted(() => {
  // 初始化时清理数组
  cleanPageList()
  if (query.state === 'edit') {
    setTimeout(() => {
      getCurrent()
    }, 1000)
  }
})

// 监听 pageList 变化，清理 undefined 元素
watch(
  pageList,
  newVal => {
    if (newVal && Array.isArray(newVal)) {
      let hasUndefined =
        newVal.some(item => item === undefined || item === null) ||
        newVal.some(item => item?.children?.some(child => child === undefined || child === null))
      if (hasUndefined) {
        cleanPageList()
        pageListKey.value++ // 触发 SlickList 重新渲染
      }
    }
  },
  { deep: true }
)
</script>
<style scoped lang="scss">
.right {
  //margin-left: 30px;
  flex: 1;
  color: #fff;
  display: flex;
  flex-direction: column;
  //padding: 20px;
  box-sizing: border-box;
  max-width: 80%;
  padding: 5px;
  border-radius: 12px;
  border: 1px solid rgba(33, 165, 185, 0.1);

  .right-header {
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 15px 0;
    background: linear-gradient(90deg, rgb(246, 249, 249) 0%, rgb(212 247 245) 100%);
    border-radius: 12px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .list {
    width: 100%;
    flex: 1;
    margin-top: 20px;
  }

  .main {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 16px;
    padding: 10px 0;
  }

  .label {
    width: 100%;
    max-width: 600px;

    // 项目输入框美化
    .project-input {
      :deep(.el-input__wrapper) {
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid rgba(102, 126, 234, 0.3);
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;

        &:hover {
          background: rgba(0, 0, 0, 0.6);
          border-color: rgba(102, 126, 234, 0.5);
        }

        &.is-focus {
          background: rgba(0, 0, 0, 0.7);
          border-color: #667eea;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
        }
      }

      :deep(.el-input__inner) {
        color: #fff !important;
        font-size: 16px;
        font-weight: 500;

        &::placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
        }
      }

      :deep(.el-input__prefix) {
        color: #667eea;
        font-size: 18px;
      }

      :deep(.el-input__suffix) {
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }

  .link-name {
    white-space: wrap;
    word-break: break-all;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    text-align: center;
    padding: 0 8px;
  }

  .link-id {
    white-space: nowrap;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 8px;
    text-align: center;
    padding: 0 8px;
  }

  .but {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    padding: 10px 20px;
    flex-wrap: wrap;

    // 美化按钮基础样式
    .el-button {
      position: relative;
      overflow: hidden;
      font-size: 14px;
      font-weight: 600;
      padding: 12px 20px;
      border-radius: 10px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: none;
      display: flex;
      align-items: center;
      gap: 6px;
      backdrop-filter: blur(10px);

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s ease;
      }

      &:hover::before {
        left: 100%;
      }

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      }

      &:active {
        transform: translateY(-1px);
      }

      .btn-icon {
        font-size: 16px;
        transition: transform 0.3s ease;
      }

      &:hover .btn-icon {
        transform: scale(1.1);
      }

      &.is-disabled {
        opacity: 0.5;
        cursor: not-allowed;
        filter: grayscale(0.8);

        &:hover {
          transform: none;
          box-shadow: none;
        }
      }
    }

    // 渐变按钮变体
    .btn-gradient {
      &.btn-vertical {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;

        &:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.5);
        }
      }

      &.btn-horizontal {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: #fff;

        &:hover {
          background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
          box-shadow: 0 10px 30px rgba(240, 147, 251, 0.5);
        }
      }

      &.btn-edit {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: #fff;

        &:hover {
          background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
          box-shadow: 0 10px 30px rgba(79, 172, 254, 0.5);
        }
      }

      &.btn-save {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        color: #fff;

        &:hover {
          background: linear-gradient(135deg, #38f9d7 0%, #43e97b 100%);
          box-shadow: 0 10px 30px rgba(67, 233, 123, 0.5);
        }
      }

      &.btn-preview {
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        color: #fff;

        &:hover {
          background: linear-gradient(135deg, #fee140 0%, #fa709a 100%);
          box-shadow: 0 10px 30px rgba(250, 112, 154, 0.5);
        }
      }
    }
  }

  .list-main {
    width: 150px;
    height: 150px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;

    .panel {
      padding: 12px;
      box-sizing: border-box;
      width: 150px;
      height: 150px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      border-radius: 12px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.2) 0%,
          rgba(255, 255, 255, 0) 100%
        );
        pointer-events: none;
      }

      &:hover {
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
      }

      .panel-actions {
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: center;
        margin-top: 8px;
      }
    }
  }
}

// 自定义滚动条样式
.custom-scrollbar {
  :deep(.el-scrollbar__wrap) {
    padding-right: 8px;
  }

  :deep(.el-scrollbar__thumb) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 6px;

    &:hover {
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    }
  }

  :deep(.el-scrollbar__bar) {
    &.is-horizontal {
      height: 8px !important;
    }

    &.is-vertical {
      width: 8px !important;
    }
  }
}
</style>
<style lang="scss">
.list-main-pbr {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 12px;
  padding: 10px;
}

.list-main-pbr .panel {
  width: 150px;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-8px) scale(1.03);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25);
    border-color: rgba(255, 255, 255, 0.2);
  }
}

// 圆形按钮美化
.btn-icon-btn {
  width: 38px !important;
  height: 38px !important;
  border: none;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  &.btn-add {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    color: #fff;

    &:hover {
      transform: scale(1.2) rotate(90deg);
      box-shadow: 0 8px 25px rgba(67, 233, 123, 0.6);
    }

    &:active {
      transform: scale(0.95) rotate(90deg);
    }
  }

  &.btn-delete {
    background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
    color: #fff;

    &:hover {
      transform: scale(1.2) rotate(-90deg);
      box-shadow: 0 8px 25px rgba(245, 87, 108, 0.6);
    }

    &:active {
      transform: scale(0.95) rotate(-90deg);
    }
  }

  .el-icon {
    font-size: 18px;
  }
}
</style>
