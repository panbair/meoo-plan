<template>
  <div class="e2e-chat-bar">
    <div v-if="chatHistory.length > 0" ref="chatHistoryRef" class="e2e-chat-history">
      <div v-for="(msg, idx) in chatHistory" :key="idx" class="e2e-chat-msg" :class="msg.role">
        <span class="chat-role">{{ msg.role === 'user' ? '👤' : '🤖' }}</span>
        <span class="chat-content">{{ msg.content }}</span>
      </div>
    </div>

    <div class="e2e-chat-input-row">
      <input
        :value="chatInput"
        class="e2e-chat-input"
        placeholder="告诉 AI 你想怎么修改... 如：把 Hero 背景改成深蓝色，标题字号加大"
        :disabled="isModifying"
        @input="emit('update:chatInput', ($event.target as HTMLInputElement).value)"
        @keydown.enter="emit('modify')"
      />
      <button
        class="e2e-chat-send-btn"
        :disabled="!chatInput.trim() || isModifying"
        title="发送修改指令"
        @click="emit('modify')"
      >
        {{ isModifying ? '⏳' : '→' }}
      </button>
      <button
        v-if="chatHistory.length > 0 && !isModifying"
        class="e2e-chat-undo-btn"
        title="撤销上次修改"
        @click="emit('undo')"
      >
        ↩
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const props = defineProps<{
  chatInput: string
  chatHistory: ChatMessage[]
  isModifying: boolean
}>()

const emit = defineEmits<{
  (e: 'update:chatInput', value: string): void
  (e: 'modify'): void
  (e: 'undo'): void
}>()

const chatHistoryRef = ref<HTMLElement | null>(null)

watch(
  () => [props.chatHistory.length, props.chatInput, props.isModifying],
  async () => {
    await nextTick()
    if (chatHistoryRef.value) {
      chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight
    }
  }
)

defineExpose({
  scrollToBottom: async () => {
    await nextTick()
    if (chatHistoryRef.value) {
      chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight
    }
  }
})
</script>

