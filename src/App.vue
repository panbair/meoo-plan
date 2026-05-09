<script setup lang="ts">
import { computed, watch } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useI18n } from 'vue-i18n'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

const appStore = useAppStore()
const { locale } = useI18n()

// 同步 appStore.locale 到 i18n
watch(
  () => appStore.locale,
  (newLocale) => {
    locale.value = newLocale
  },
  { immediate: true }
)

/**
 * 根据 i18n locale 动态设置 Element Plus 语言
 */
const elementPlusLocale = computed(() => {
  const locales: Record<string, typeof zhCn> = {
    'zh-CN': zhCn,
    'en-US': en
  }
  return locales[locale.value] || zhCn
})
</script>

<template>
  <el-config-provider :locale="elementPlusLocale">
    <router-view />
  </el-config-provider>
</template>

<style>
#app {
  width: 100%;
  height: 100%;
  font-family: -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    'Noto Sans',
    sans-serif,
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    'Noto Color Emoji';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 全屏高度 */
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* 文本选中颜色 */
::selection {
  background-color: var(--el-color-primary-light-5);
  color: var(--el-text-color-primary);
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--el-border-color-darker);
  border-radius: 3px;

  &:hover {
    background: var(--el-border-color);
  }
}

/* Focus 样式 */
:focus-visible {
  outline: 2px solid var(--el-color-primary);
  outline-offset: 2px;
}
</style>

