<template>
  <div class="left">
    <div class="left-header">模版选择</div>
    <div class="list">
      <el-scrollbar max-height="calc(100vh - 150px)">
        <div class="main">
          <div
            v-for="(item, index) in data"
            :key="item.id + '_' + index"
            :class="{ 'is-active': item.templateView === templateView }"
            class="scrollbar-demo-item"
            @click="selectItem(item)"
          >
            {{ item.title }}
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({
  data: {
    type: Array,
    default: () => []
  }
})
let templateView = defineModel()
let emits = defineEmits(['select'])

let selectItem = item => {
  templateView.value = item.templateView
  emits('select', item)
}
</script>
<style scoped lang="scss">
.left {
  position: relative;
  padding: 10px;
  width: 170px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .left-header {
    height: 90px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    font-size: 20px;
    color: #333;
    line-height: 50px;
    text-align: center;
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
    align-items: center;
  }
  .scrollbar-demo-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
    width: 120px;
    margin-bottom: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
    box-sizing: border-box;
    &.is-active {
      border: 2px solid var(--el-color-primary);
    }
  }
}
</style>

<!--
<template>
  <div class="left">
    <div class="left-header">模版选择</div>
    <el-scrollbar height="80vh">
      <div class="main">
        <div @click="selectItem(item)" v-for="(item,index) in data"
             :key="item.id+'_'+index"
             :class="{'is-active':item.templateView===templateView}"
             class="scrollbar-demo-item"
        >{{ item.title }}</div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup lang="ts">
defineProps({
  data: {
    type: Array,
    default: () => []
  }
})
let templateView = defineModel()
let emits = defineEmits(['select'])

let selectItem = (item) => {
  templateView.value = item.templateView
  emits('select',item)
}

</script>
<style scoped lang="scss">
.left{
  margin-left: 50px;
  width: 150px;
  .main{
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .left-header{
    height: 90px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    font-size: 20px;
    color: #333;
    line-height: 50px;
    text-align: center;
  }
  .scrollbar-demo-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
    width: 100px;
    margin-bottom: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(&#45;&#45;el-color-primary-light-9);
    color: var(&#45;&#45;el-color-primary);
  box-sizing: border-box;
    &.is-active{
      border: 2px solid var(&#45;&#45;el-color-primary)
    }
  }
}
</style>
-->
