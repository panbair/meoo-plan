<template>
  <div class="web-wrapper">
    <!-- 懒加载画廊 -->
    <LazyLoadGallery />
  </div>
</template>

<script setup lang="ts">
import LazyLoadGallery from './LazyLoadGallery.vue'
</script>

<style scoped lang="scss">
.web-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a2a 100%);
  overflow-x: hidden;
  position: relative;
}
</style>
