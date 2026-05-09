<template>
  <div class="template-view">
    <Dialog @show-preview="showPreview" />
    <animation-layer
      v-if="pageList && pageList.length > 0"
      :page-list="pageList"
      :disable="false"
    ></animation-layer>
    <empty-template v-else></empty-template>
  </div>
</template>
<script setup lang="ts">
import Dialog from './compoments/dialog/dialog.vue'
import AnimationLayer from './compoments/animation-layer/animation-layer.vue'
import EmptyTemplate from './compoments/empty-template/empty-template.vue'
import { UseAnimation } from './compoments/hooks'
let { killAllAnimation } = UseAnimation()
let pageList = ref([])
let router = useRouter()
provide('pageList', pageList)
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

onMounted(() => {
  console.log('template')
  killAllAnimation()
})
</script>
<style scoped lang="scss">
body {
  overscroll-behavior: none;
  height: 100vh;
}
.template-view {
  overflow: hidden;
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
</style>
