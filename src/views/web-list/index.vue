<script setup lang="ts"></script>
<template>
  <div class="web-list">
    <div class="page page1"></div>
    <div class="page page2"></div>
    <div class="page page3"></div>
    <div class="page page4"></div>
  </div>
</template>
<style lang="scss" scoped>
.web-list {
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;

  .page {
    width: 100vw;
    height: 100vh;
  }
  .page1 {
    background: #d7c17a;
  }
  .page2 {
    background: #77b3e3;
  }
  .page3 {
    background: #51c49b;
  }
  .page4 {
    background: #c47a7a;
  }
}
</style>
