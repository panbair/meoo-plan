/**
 * 应用入口文件
 * @description 初始化 Vue 应用、注册插件、挂载应用
 */

import { createApp, type App as VueApp } from 'vue'
import App from './App.vue'
import router from './router'
import './permission' // 路由守卫必须在 mount 之前导入

// Pinia 状态管理
import pinia from '@/store'

// Element Plus
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

// UnoCSS
import 'virtual:uno.css'

// 全局样式
import './styles/index.scss'

// SVG 图标注册
import 'virtual:svg-icons-register'

// i18n
import i18n from './i18n'

// 插件
import { setupPlugins } from '@/plugins'

// 核心模块
import { globalErrorHandler, performanceMonitor, serviceWorkerManager } from '@/core'

// 权限指令
import { setupPermissionDirective } from '@/directives/permission'

// 组件插件
import componentsPlugin from '@/components'

/**
 * 注册 Element Plus 图标
 */
function registerElementPlusIcons(app: VueApp) {
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}

/**
 * 清理开发环境下的过期数据
 */
function cleanupDevData() {
  if (!import.meta.env.DEV) return

  try {
    const token = localStorage.getItem('ACCESS_TOKEN')
    if (token?.startsWith('mock-token')) {
      const tokenTime = parseInt(token.split('-')[2])
      if (Date.now() - tokenTime > 3600000) {
        localStorage.removeItem('ACCESS_TOKEN')
        localStorage.removeItem('REFRESH_TOKEN')
      }
    }
  } catch {
    // 忽略错误
  }
}

/**
 * 初始化主题
 */
function initTheme() {
  import('@/utils/theme').then(({ useTheme }) => {
    useTheme().initTheme()
  })
}

/**
 * 创建并挂载应用
 */
async function bootstrap() {
  // 清理过期数据
  cleanupDevData()

  // 创建 Vue 应用实例
  const app = createApp(App)

  // 注册 Element Plus 图标
  registerElementPlusIcons(app)

  // 安装插件
  app.use(pinia)
  app.use(router)
  app.use(ElementPlus)
  app.use(i18n)
  app.use(componentsPlugin)

  // 执行额外的插件配置
  setupPlugins(app)

  // 注册权限指令
  setupPermissionDirective(app)

  // 安装全局错误处理器
  globalErrorHandler.install(app)

  // 安装性能监控
  performanceMonitor.install(app)

  // 注册 Service Worker（生产环境）
  if (import.meta.env.PROD) {
    serviceWorkerManager.register()
  }

  // 全局属性
  app.config.globalProperties.$performance = performanceMonitor

  // 挂载应用
  app.mount('#app')

  // 初始化主题（在 mount 之后调用）
  initTheme()

  // 性能标记
  performanceMonitor.mark('app-mounted')

  // 检测首屏渲染
  if (document.visibilityState === 'visible') {
    performanceMonitor.mark('first-contentful-paint')
  }
}

// 启动应用
bootstrap()

