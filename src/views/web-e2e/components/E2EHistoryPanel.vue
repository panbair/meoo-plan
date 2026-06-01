<template>
  <Teleport to="body">
    <transition name="slide-left">
      <div v-if="show" class="e2e-history-overlay" @click.self="emit('update:show', false)">
        <div class="e2e-history-panel">
          <div class="e2e-history-header">
            <h3>📋 生成历史</h3>
            <button class="e2e-btn-icon" @click="emit('update:show', false)">✕</button>
          </div>
          <div v-if="history.length === 0" class="e2e-history-empty">暂无历史记录</div>
          <div v-else class="e2e-history-list">
            <div v-for="(item, idx) in history" :key="idx" class="e2e-history-item" @click="emit('load', item)">
              <div class="history-desc">{{ item.description.substring(0, 50) }}...</div>
              <div class="history-meta">{{ item.components?.length || 0 }} 组件 · {{ item.time }}</div>
            </div>
            <button class="e2e-clear-btn" @click="emit('clear')">清空历史</button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
interface E2EHistoryItem {
  description: string
  code: string
  components: string[]
  reasoning: string
  time: string
}

defineProps<{
  show: boolean
  history: E2EHistoryItem[]
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'load', item: E2EHistoryItem): void
  (e: 'clear'): void
}>()
</script>

