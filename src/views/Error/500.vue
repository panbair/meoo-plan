<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-code">500</div>
      <div class="error-title">{{ $t('common.serverError') || '服务器错误' }}</div>
      <div class="error-desc">
        {{ desc || ($t('common.serverErrorDesc') || '抱歉，服务器发生错误，请稍后重试或联系管理员') }}
      </div>
      <div class="error-actions">
        <el-button type="primary" @click="goHome">
          {{ $t('common.backHome') || '返回首页' }}
        </el-button>
        <el-button @click="refreshPage">
          {{ $t('common.refresh') || '刷新页面' }}
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

const refreshPage = () => {
  window.location.reload()
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
  color: var(--el-color-danger);
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
