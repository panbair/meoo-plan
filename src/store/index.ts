/**
 * Pinia 状态管理
 * @description 全局状态管理配置
 */

import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

/**
 * 创建 Pinia 实例
 */
const pinia = createPinia()

/**
 * 注册持久化插件
 * @description 用于将 state 持久化到 localStorage/sessionStorage
 */
pinia.use(
  createPersistedState({
    // 持久化 key 前缀
    key: (id) => `meoo-${id}`,
    // 存储方式
    storage: localStorage
  })
)

/**
 * 安装 Pinia
 * @description 在 main.ts 中调用
 */
export function setupPinia(app: ReturnType<typeof import('vue').createApp>) {
  app.use(pinia)
}

export default pinia

// 为了兼容性，导出 pinia 实例
export const store = pinia

