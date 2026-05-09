<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-header">
        <h1 class="register-title">{{ title }}</h1>
        <p class="register-subtitle">创建您的账号</p>
      </div>

      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        class="register-form"
        @keyup.enter="handleRegister"
      >
        <el-form-item prop="username">
          <el-input
            v-model="registerForm.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
            size="large"
            clearable
          />
        </el-form-item>

        <el-form-item prop="email">
          <el-input
            v-model="registerForm.email"
            :prefix-icon="Message"
            placeholder="请输入邮箱"
            size="large"
            clearable
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            :prefix-icon="Lock"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码"
            size="large"
            clearable
          >
            <template #suffix>
              <el-icon @click="showPassword = !showPassword" style="cursor: pointer">
                <component :is="showPassword ? 'View' : 'Hide'" />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            :prefix-icon="Lock"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请确认密码"
            size="large"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="register-button"
            @click="handleRegister"
          >
            {{ loading ? '注册中...' : '注册' }}
          </el-button>
        </el-form-item>

        <div class="register-footer">
          <span class="tip-text">已有账号？</span>
          <router-link to="/login" class="link">立即登录</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Message, View, Hide } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()

const title = import.meta.env.VITE_APP_TITLE || '管理系统'

const registerFormRef = ref<FormInstance>()
const loading = ref(false)
const showPassword = ref(false)

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 自定义验证：确认密码
const validateConfirmPassword = (_rule: any, value: string, callback: any) => {
  if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const registerRules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为 3-20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为 6-20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
})

async function handleRegister() {
  if (!registerFormRef.value) return

  try {
    await registerFormRef.value.validate()
  } catch {
    return
  }

  loading.value = true

  try {
    // 模拟注册 API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    ElMessage.success('注册成功，请登录')
    router.push('/login')
  } catch (error: any) {
    ElMessage.error(error?.message || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.register-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.register-box {
  width: 420px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-title {
  margin: 0 0 12px;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.register-subtitle {
  margin: 0;
  font-size: 14px;
  color: #999;
}

.register-form {
  :deep(.el-form-item) {
    margin-bottom: 24px;
  }

  :deep(.el-input__wrapper) {
    padding: 12px 16px;
    border-radius: 8px;
  }
}

.register-button {
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

.register-footer {
  text-align: center;
  margin-top: 16px;
}

.tip-text {
  font-size: 14px;
  color: #999;
}

.link {
  color: #667eea;
  text-decoration: none;
  margin-left: 4px;

  &:hover {
    text-decoration: underline;
  }
}
</style>
