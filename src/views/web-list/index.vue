<script setup lang="ts">
import Card3DFlipGallery from './card/Card3DFlipGallery/Card3DFlipGallery.vue'

const handleCardClick = (card: any, index: number) => {
  console.log('Card clicked:', card.title, index)
}
</script>
<template>
  <div class="web-list">
    <div class="page page1"></div>
    <div class="page page2"></div>
    <div class="page page3">
      <Card3DFlipGallery @card-click="handleCardClick" />
    </div>
    <div class="page page4"></div>
  </div>
</template>
<style lang="scss" scoped>
.web-list {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;

  .page {
    width: 100%;
    min-height: 100vh;
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
