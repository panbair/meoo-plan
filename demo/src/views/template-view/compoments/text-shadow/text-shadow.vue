<template>
  <el-popover placement="bottom" :width="420" title="文字阴影" :visible="visible">
    <template #reference>
<!--      <div @click="visible=true">-->
<!--       <el-input style="width: 100px" v-model="borderValue" readonly />-->
<!--      </div>-->
      <div @click="visible=true">
        <div class="border-line2" :style="{'text-shadow': sty}">
          文字阴影
        </div>
      </div>
    </template>
    <div class="color-change" >
         <div class="color-change-item" v-for="(item,index) in list" :key="index">
           <el-input-number
               v-model="item.hShadow"
               :min="-100"
               :max="100"
               placeholder="x轴"
               controls-position="right"
               style="width: 90px;"
           />
           <el-input-number
               v-model="item.vShadow"
               :min="-100"
               :max="100"
               placeholder="y轴"
               controls-position="right"
               style="width: 90px;"
           />
           <el-input-number
               v-model="item.blurRadius"
               :min="0"
               :max="100"
               placeholder="模糊"
               controls-position="right"
               style="width: 90px;"
           />
           <el-color-picker v-model="item.color" show-alpha/>
           <el-button :disabled="list.length<=1"    @click="remove(item,index)" type="danger" plain  size="small" style="margin-left: 3px">x</el-button>
           <el-button @click="add" type="primary" plain  size="small" style="margin-left: 3px">+</el-button>
         </div>
      <div>
  </div>

    </div>
    <div class="border-main">
       <div class="border-line" :style="{'text-shadow': sty}">预览文字</div>
    </div>
    <div class="footer">
      <el-button @click="save" type="primary" plain  size="small">确定</el-button>
    </div>
  </el-popover>
</template>
<script setup lang="ts">
import _ from 'lodash'
let options = ref([
  {
    label: '实线',
    value: 'solid'
  },
  {
    label: '虚线',
    value: 'dashed'
  }
])
let visible = ref(false)
let textShadow = defineModel('textShadow')
let textShadowList = defineModel('textShadowList')
let list = ref([
  {
    hShadow: 0,
    vShadow: 0,
    blurRadius: 0,
    color: '#333'
  }
])

let stop = watch(() => textShadowList.value, (n) => {
  try {
    if(n) {
      list.value = _.cloneDeep(n)
    }else{
      list.value = [
        {
          hShadow: 0,
          vShadow: 0,
          blurRadius: 0,
          color: '#333'
        }
      ]
    }
  }catch (e) {
    console.log(e)
  }
},{   immediate: true
})

// let stop = watch(() => textShadow.value, (n) => {
//   if(n) {
//     let str = n || ''
//     list.value = []
//     let ary = str?.trim?.()?.split?.(',')
//     ary.forEach((item) => {
//       let ary = item?.trim?.()?.split?.(/\s+/)
//       if (ary.length === 5) {
//         list.value.push({
//           hShadow: parseFloat(ary[0]) || 0,
//           vShadow: parseFloat(ary[1]) || 0,
//           blurRadius: parseFloat(ary[2]) || 0,
//           color: ary[4]
//         })
//       }
//     })
//     if(list.value?.length === 0) {
//       list.value = [
//         {
//           hShadow: 0,
//           vShadow: 0,
//           blurRadius: 0,
//           color: '#333'
//         }
//       ]
//     }
//   }
// },{   immediate: true
// })
onUnmounted(() => {
  stop()
})

let isTrue = (val)=>{
  if(val || val === 0 || val === '0') {
    return true
  }else{
    return false
  }
}

let computedStyle = ()=>{
  let str = ''
  list.value?.forEach((item,index) => {
    let { hShadow, vShadow, blurRadius, color } = item || {}
    if(isTrue( hShadow) && isTrue(vShadow) && isTrue(blurRadius)  && color) {
      str += `${hShadow}px ${vShadow}px ${blurRadius}px ${color}`
      if(index !== list.value?.length - 1) {
        str += ','
      }
    }
  })
  return str
}

let sty = computed(() => {
  return computedStyle()
})

let save = ()=>{
  textShadow.value = computedStyle()
  textShadowList.value = list.value
  visible.value = false
}
let add = () => {
  list.value.push( {
    hShadow: 0,
    vShadow: 0,
    blurRadius: 0,
    color: '#333'
  })
}

let remove = (item,index) => {
  list.value.splice(index,1)
}

</script>
<style scoped lang="scss">
.color-change {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .color-change-item{
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}
.border-main{
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
  .border-line{
    margin-left: 10px;
    height: 30px;
    border-radius: 5px;
    font-size: 30px;
  }
}
.border-line2{
  width: 100px;
  height: 30px;
 line-height: 30px;
  border-radius: 5px;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  text-align: center;
}
.footer{
  margin-top: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: end;
}

</style>