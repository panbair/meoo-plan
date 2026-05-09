<template>
  <div class="empty-template-wrapper">
    <el-empty>
      <template #description>
        <span class="empty-description">去搞点数据吧！</span>
      </template>
      <el-button class="btn-create" @click="goToTemplate">
        <el-icon class="btn-icon"><Plus /></el-icon>
        去创建
      </el-button>
    </el-empty>
  </div>
</template>
<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'

let router = useRouter()
// 去创建模板
let goToTemplate = () => {
  router.push({
    path: '/template'
  })
}
</script>
<style scoped lang="scss">
.empty-template-wrapper {
  padding: 60px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;

  :deep(.el-empty) {
    padding: 40px;
  }

  .empty-description {
    color: #626262;
    font-size: 16px;
    margin-bottom: 20px;
    display: block;
    animation: fadeInUp 0.6s ease-out;
  }

  // 创建按钮美化
  .btn-create {
    position: relative;
    overflow: hidden;
    font-size: 16px;
    font-weight: 600;
    padding: 14px 32px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
      );
      transition: left 0.6s ease;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 12px;
      padding: 2px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), transparent);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover {
      transform: translateY(-3px) scale(1.02);
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
      box-shadow: 0 8px 30px rgba(102, 126, 234, 0.5);

      &::before {
        left: 100%;
      }

      &::after {
        opacity: 1;
      }

      .btn-icon {
        transform: rotate(90deg) scale(1.2);
      }
    }

    &:active {
      transform: translateY(-1px) scale(0.98);
    }

    .btn-icon {
      font-size: 18px;
      transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
  }
}

// 入场动画
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
