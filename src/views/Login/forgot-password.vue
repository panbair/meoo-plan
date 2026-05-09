<template>
  <div class="forgot-password-container">
    <div class="forgot-password-box">
      <div class="forgot-password-header">
        <h1 class="forgot-password-title">{{ title }}</h1>
        <p class="forgot-password-subtitle">输入您的邮箱地址，我们将发送密码重置链接</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="forgot-password-form"
        @keyup.enter="handleSubmit"
      >
        <el-form-item prop="email">
          <el-input
            v-model="form.email"
            :prefix-icon="Message"
            placeholder="请输入注册邮箱"
            size="large"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="submit-button"
            @click="handleSubmit"
          >
            {{ loading ? '发送中...' : '发送重置链接' }}
          </el-button>
        </el-form-item>

        <div class="forgot-password-footer">
          <router-link to="/login" class="link">
            <el-icon><ArrowLeft /></el-icon>
            返回登录
          </router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Message, ArrowLeft } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()

const title = import.meta.env.VITE_APP_TITLE || '管理系统'

const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  email: ''
})

const rules = reactive<FormRules>({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
})

async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch {
    return
  }

  loading.value = true

  try {
    // 模拟发送重置邮件
    await new Promise((resolve) => setTimeout(resolve, 1000))

    ElMessage.success('重置链接已发送到您的邮箱，请查收')
    router.push('/login')
  } catch (error: any) {
    ElMessage.error(error?.message || '发送失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.forgot-password-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.forgot-password-box {
  width: 420px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.forgot-password-header {
  text-align: center;
  margin-bottom: 32px;
}

.forgot-password-title {
  margin: 0 0 12px;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.forgot-password-subtitle {
  margin: 0;
  font-size: 14px;
  color: #999;
  line-height: 1.6;
}

.forgot-password-form {
  :deep(.el-form-item) {
    margin-bottom: 24px;
  }

  :deep(.el-input__wrapper) {
    padding: 12px 16px;
    border-radius: 8px;
  }
}

.submit-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;

  &:hover {
    opacity: 0.9;
  }
}

.forgot-password-footer {
  text-align: center;
  margin-top: 16px;
}

.link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #667eea;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
}
</style>
