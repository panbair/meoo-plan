<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-code">404</div>
      <div class="error-title">{{ $t('common.notFound') || '页面不存在' }}</div>
      <div class="error-desc">
        {{ desc || ($t('common.pageNotFound') || '抱歉，您访问的页面不存在或已被删除') }}
      </div>
      <div class="error-actions">
        <el-button type="primary" @click="goHome">
          {{ $t('common.backHome') || '返回首页' }}
        </el-button>
        <el-button @click="goBack">
          {{ $t('common.goBack') || '返回上一页' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  desc?: string
}

defineProps<Props>()

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg-color);
}

.error-content {
  text-align: center;
  padding: 40px;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  color: var(--el-color-warning);
  line-height: 1;
  margin-bottom: 20px;
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.1);
}

.error-title {
  font-size: 32px;
  font-weight: 500;
  color: var(--text-color-primary);
  margin-bottom: 16px;
}

.error-desc {
  font-size: 16px;
  color: var(--text-color-secondary);
  margin-bottom: 32px;
  max-width: 400px;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}
</style>
