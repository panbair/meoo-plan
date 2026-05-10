<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store/modules/app'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import { ElConfigProvider } from 'element-plus'

const { locale } = useI18n()
const appStore = useAppStore()

// 添加 ready 状态
const isReady = ref(false)

// Element Plus 语言包映射
const localeMap = {
  'zh-CN': zhCn,
  'en-US': en
}

// 动态设置 Element Plus 的语言
const elLocale = computed(() => {
  if (!appStore || !appStore.locale) return zhCn
  const localeKey = appStore.locale as keyof typeof localeMap
  return localeMap[localeKey] || zhCn
})

onMounted(() => {
  setTimeout(() => {
    isReady.value = true
  }, 100)
})
</script>

<template>
  <ElConfigProvider v-if="isReady" :locale="elLocale">
    <router-view />
  </ElConfigProvider>
  <div v-else>Loading...</div>
</template>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>
