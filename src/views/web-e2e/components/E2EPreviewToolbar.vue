<template>
  <div class="e2e-preview-toolbar">
    <div class="toolbar-left">
      <button :class="{ active: activeTab === 'preview' }" @click="emit('update:activeTab', 'preview')">
        👁️ 预览
      </button>
      <button :class="{ active: activeTab === 'code' }" @click="emit('update:activeTab', 'code')">
        💻 代码
      </button>
      <button :class="{ active: activeTab === 'split' }" @click="emit('update:activeTab', 'split')">
        📐 分屏
      </button>
    </div>
    <div class="toolbar-right">
      <select
        class="e2e-select-sm"
        :value="previewScale"
        @change="emit('update:previewScale', Number(($event.target as HTMLSelectElement).value))"
      >
        <option :value="0.25">25%</option>
        <option :value="0.5">50%</option>
        <option :value="0.75">75%</option>
        <option :value="1">100%</option>
      </select>
      <button class="e2e-toolbar-btn" :class="{ active: previewDarkMode }" title="切换预览背景" @click="emit('toggleDarkMode')">
        🌓
      </button>
      <button class="e2e-toolbar-btn" :disabled="!hasCode" title="下载代码" @click="emit('download')">⬇️</button>
      <button class="e2e-toolbar-btn" :disabled="!hasCode" title="复制代码" @click="emit('copy')">📋</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  activeTab: 'preview' | 'code' | 'split'
  previewScale: number
  previewDarkMode: boolean
  hasCode: boolean
}>()

const emit = defineEmits<{
  (e: 'update:activeTab', value: 'preview' | 'code' | 'split'): void
  (e: 'update:previewScale', value: number): void
  (e: 'toggleDarkMode'): void
  (e: 'download'): void
  (e: 'copy'): void
}>()
</script>

