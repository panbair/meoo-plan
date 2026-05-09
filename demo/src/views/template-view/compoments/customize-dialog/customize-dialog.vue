<template>
  <el-dialog
    top="10vh"
    :close-on-click-modal="false"
    :modal="false"
    :append-to-body="true"
    :draggable="true"
    :model-value="visibel"
    title="编辑"
    width="410"
    @update:model-value="input"
    @close="onclose"
  >
    <div class="link-name">编号：{{ itemData.linkName }}</div>
    <!--  属性设置  -->
    <keys
      :form-data="formData"
      :list="list"
      max-height="300px"
      value-key="animationKeys"
      style-key="animationStyle"
    ></keys>
    <template #footer>
      <div class="dialog-footer">
        <el-button plain @click="onclose">取消</el-button>
        <el-button type="primary" plain @click="saveData">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import _ from 'lodash'
import keys from './keys/keys.vue'
import { keyData, keyData2 } from './config'
const props = defineProps({
  templateView: {
    type: String,
    default: ''
  },
  visibel: {
    type: Boolean,
    default: false
  },
  itemData: {
    type: Object,
    default: () => {
      return {}
    }
  },
  data: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

let list = computed(() => {
  if (props.templateView === 'customizeAnimation') {
    return [...keyData]
  }
  return [...keyData2]
})

let emit = defineEmits(['update:visibel', 'update:data', 'submit'])

let formDataOld = ref(_.cloneDeep(props.data))
let formData = ref(props.data)

const input = value => {
  onclose()
}
// 关闭弹窗
const onclose = () => {
  emit('update:data', formDataOld.value)
  emit('update:visibel', false)
}

const saveData = () => {
  console.log(formData.value)
  emit('update:data', formData.value)
  emit('update:visibel', false)
  emit('submit', formData.value)
}
</script>
<style scoped lang="scss">
.form-img-main {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  .form-img {
    width: 100px;
    height: 100px;
    display: block;
  }
  .form-img-close {
    position: absolute;
    right: 5px;
    top: 5px;
  }
}
.link-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
</style>
