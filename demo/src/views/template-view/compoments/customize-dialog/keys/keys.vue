<!--
 * @ description:
 * @ author: panboren
 * @ created_at: 2024/11/8 22:45
 * @ QQ: 3248874747
-->
<template>
  <el-form-item label="选择属性" label-width="80px">
    <el-select v-model="formData[props.valueKey]"
               multiple
               collapse-tags
               filterable
               placeholder="请选择属性"
    >
      <el-option
          v-for="item in listData"
          :key="item.key"
          :label="item.label"
          :value="item.key"
      />
    </el-select>
<!--    <el-button @click="addKey" type="primary" plain style="margin-left: 5px" >添加</el-button>-->
  </el-form-item>
  <el-scrollbar :max-height="maxHeight">
    <el-row style="padding-right: 10px; box-sizing: border-box">
      <el-col :span="12" v-for="(item,index) in keyList" :key="item.key+'_'+index">
        <el-form-item :label="item.label"  label-width="80px">
          <div class="list-row" v-if="item.tag==='input'">
            <el-input v-model="formData[props.styleKey][item.key]"  clearable placeholder="请输入" style="width: 100px" />
            <el-icon class="list-row-close" @click="remove(item)"><Close /></el-icon>
          </div>
          <div class="list-row" v-if="item.tag==='input-number'">
            <el-input-number
                v-model="formData[props.styleKey][item.key]"
                class="mx-4"
                clearable
                placeholder="请输入"
                controls-position="right"
                v-bind="item.attrs"
            />
            <el-icon class="list-row-close" @click="remove(item)"><Close /></el-icon>
          </div>
          <div class="list-row" v-if="item.tag==='linear-color'">
<!--            <linear-color-picker  v-model="formData.style[item.key]"></linear-color-picker>-->
            <linear-color v-bind="item.attrs" v-model:[item.key]="formData[props.styleKey][item.key]" v-model:[item.subKey]="formData[props.styleKey][item.subKey]"  />
            <el-icon class="list-row-close" @click="remove(item)"><Close /></el-icon>
          </div>

          <div class="list-row" v-if="item.tag==='background-image'">
            <background-image v-bind="item.attrs" v-model:[item.key]="formData[props.styleKey][item.key]"  v-model:[`${item.key}Name`]="formData[props.styleKey][`${item.key}Name`]" />
            <el-icon class="list-row-close" @click="remove(item)"><Close /></el-icon>
          </div>
          <div class="list-row" v-if="item.tag==='color'">
            <el-color-picker v-bind="item.attrs" v-model="formData[props.styleKey][item.key]" show-alpha  />
            <el-icon class="list-row-close" @click="remove(item)"><Close /></el-icon>
          </div>
          <div class="list-row" v-if="item.tag==='select'">
            <el-select v-model="formData[props.styleKey][item.key]" clearable
                       placeholder="请输入" v-bind="item.attrs" style="width: 100px">
              <el-option
                  v-for="it in item?.options ||[]"
                  :key="it.value"
                  :label="it.label"
                  :value="it.value"
              />
            </el-select>
            <el-icon class="list-row-close" @click="remove(item)"><Close /></el-icon>
          </div>
          <div class="list-row" v-if="item.tag==='border-pick'">
            <border-pick v-bind="item.attrs" v-model:[item.key]="formData[props.styleKey][item.key]" v-model:[item.subKey]="formData[props.styleKey][item.subKey]" />
            <el-icon class="list-row-close" @click="remove(item)"><Close /></el-icon>
          </div>
          <div class="list-row" v-if="item.tag==='box-shadow'">
            <box-shadow v-bind="item.attrs" v-model:[item.key]="formData[props.styleKey][item.key]" v-model:[item.subKey]="formData[props.styleKey][item.subKey]" />
            <el-icon class="list-row-close" @click="remove(item)"><Close /></el-icon>
          </div>
          <div class="list-row" v-if="item.tag==='text-shadow'">
            <text-shadow  v-bind="item.attrs" v-model:[item.key]="formData[props.styleKey][item.key]" v-model:[item.subKey]="formData[props.styleKey][item.subKey]" />
            <el-icon class="list-row-close" @click="remove(item)"><Close /></el-icon>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </el-scrollbar>
</template>
<script setup lang="ts">
import {Close} from '@element-plus/icons-vue'
const props = defineProps({
  formData: {
    type: Object,
    default: () => {
      return {}
    }
  },
  list: {
    type: Array,
    default: () => {
      return []
    }
  },
  valueKey:{
    type:String,
    default:'keys'
  },
  styleKey:{
    type:String,
    default:'style'
  },
  maxHeight:{
    type:String,
    default:'300px'
  }
  // isAnimation:{
  //   type:Boolean,
  //   default:false
  // }
})

import TextShadow from '../../text-shadow/text-shadow.vue'
let keyList = ref([])

let listData = computed(()=>{
  return props.list
  // if(props.isAnimation) {
  //   return props.list
  // }
  // return props.list?.filter(item=>{
  //   return  item.attributeType !== 'animation'
  // })
})

let addKey = ()=>{
  let data = listData.value?.filter(item=>{
    return props.formData[props.valueKey].includes(item.key)
  })
  keyList.value = data
}
let stop = watch(()=>[props.formData[props.valueKey],props.formData[props.styleKey]],(val)=>{
  addKey()
},{
  deep:true,
  immediate:true
})
let remove = (item)=>{
  props.formData[props.valueKey].splice(props.formData[props.valueKey].indexOf(item.key),1)
  delete props.formData[props.styleKey][item.key]
  addKey()
}
onUnmounted(()=>{
  stop()
})
</script>
<style scoped lang="scss">
.list-row{
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  .list-row-close{
    display: none;
  }
  &:hover{
    .list-row-close{
      display: block;
    }
  }
}
</style>