/**
 * 权限状态管理
 * @description 路由权限、菜单权限管理
 */

import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'

/**
 * 权限状态接口
 */
interface PermissionState {
  /** 完整路由列表 */
  routers: RouteRecordRaw[]
  /** 动态添加的路由 */
  addRouters: RouteRecordRaw[]
  /** 是否已生成路由 */
  isGenerate: boolean
}

/**
 * 权限状态管理 Store
 */
export const usePermissionStore = defineStore('permission', {
  // 开启持久化
  persist: true,

  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    isGenerate: false
  }),

  getters: {
    /** 获取路由列表 */
    getRouters: (state) => state.routers,
    /** 获取动态路由 */
    getAddRouters: (state) => state.addRouters,
    /** 是否已生成路由 */
    getIsGenerate: (state) => state.isGenerate
  },

  actions: {
    /**
     * 生成路由
     * @param routes - 路由配置
     */
    async generateRoutes(routes: RouteRecordRaw[] = []) {
      return new Promise<void>((resolve) => {
        this.addRouters = routes
        this.routers = routes
        this.isGenerate = true
        resolve()
      })
    },

    /**
     * 设置静态路由
     * @param routes - 路由配置
     */
    setRouters(routes: RouteRecordRaw[]) {
      this.routers = routes
    },

    /**
     * 重置状态
     */
    resetState() {
      this.routers = []
      this.addRouters = []
      this.isGenerate = false
    }
  }
})

