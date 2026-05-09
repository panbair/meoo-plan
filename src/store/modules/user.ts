/**
 * 用户状态管理
 * @description 用户登录、认证、权限相关信息
 */

import { defineStore } from 'pinia'
import { loginApi, getUserInfoApi, getMenuListApi, logoutApi } from '@/api/login'
import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken
} from '@/utils/auth'
import { resetRouteGenerator } from '@/router/generator'
import type { UserInfo, LoginInfo } from '@/types'
import type { MenuPermission } from '@/types/permission'

/**
 * 用户状态接口
 */
interface UserState {
  /** 用户信息 */
  user: UserInfo | null
  /** 用户角色列表 */
  roles: string[]
  /** 用户权限列表（使用数组便于持久化） */
  permissions: string[]
  /** 动态路由菜单 */
  menus: MenuPermission[]
  /** 是否已设置用户信息 */
  isSetUser: boolean
  /** 路由是否已生成 */
  isRouteGenerated: boolean
}

/**
 * 角色权限映射表
 */
const ROLE_PERMISSION_MAP: Record<string, string[]> = {
  admin: ['*:*:*'],
  editor: ['system:user:view', 'system:role:view', 'system:menu:view'],
  viewer: ['system:user:view']
}

/**
 * 用户状态管理 Store
 */
export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    roles: [],
    permissions: [],
    menus: [],
    isSetUser: false,
    isRouteGenerated: false
  }),

  getters: {
    /** 获取用户信息 */
    getUser: (state) => state.user,
    /** 获取角色列表 */
    getRoles: (state) => state.roles,
    /** 获取权限列表 */
    getPermissions: (state) => state.permissions,
    /** 获取动态菜单 */
    getMenus: (state) => state.menus,
    /** 是否已设置用户 */
    getIsSetUser: (state) => state.isSetUser,
    /** 是否是超级管理员 */
    isSuperAdmin: (state) => state.roles.includes('admin') || state.roles.includes('superadmin'),
    /** 是否是管理员 */
    isAdmin: (state) => state.roles.includes('admin'),
    /** 获取用户 ID */
    userId: (state) => state.user?.id ?? 0,
    /** 获取用户名 */
    username: (state) => state.user?.username ?? '',
    /** 获取用户昵称 */
    nickname: (state) => state.user?.nickname ?? '',
    /** 获取用户头像 */
    avatar: (state) => state.user?.avatar ?? '',
    /** 权限列表数组 */
    permissionsList: (state) => state.permissions
  },

  actions: {
    /**
     * 用户登录
     * @param loginInfo - 登录信息
     */
    async loginAction(loginInfo: LoginInfo) {
      try {
        const res: any = await loginApi(loginInfo)
        setAccessToken(res.accessToken)
        if (res.refreshToken) {
          setRefreshToken(res.refreshToken)
        }
        return res
      } catch (error) {
        console.warn('登录 API 失败:', error)
        throw error
      }
    },

    /**
     * 获取用户信息
     */
    async getUserInfoAction() {
      try {
        const userInfoRes: any = await getUserInfoApi()
        const menusRes = await getMenuListApi()

        this.setUser(userInfoRes)
        this.setMenus(menusRes || [])

        return { user: userInfoRes, menus: menusRes }
      } catch (error) {
        console.warn('API 获取用户信息失败:', error)
        throw error
      }
    },

    /**
     * 设置用户信息
     */
    setUser(userInfo: UserInfo) {
      this.user = userInfo
      this.roles = userInfo.roles || this.generateDefaultRoles(userInfo)
      this.permissions = userInfo.permissions || this.generateDefaultPermissions()
      this.isSetUser = true
    },

    /**
     * 设置动态菜单
     */
    setMenus(menus: MenuPermission[]) {
      this.menus = menus
    },

    /**
     * 标记路由已生成
     */
    setRouteGenerated(value: boolean = true) {
      this.isRouteGenerated = value
    },

    /**
     * 根据角色生成默认权限
     */
    generateDefaultPermissions(): string[] {
      const permissions: string[] = []
      this.roles.forEach((role) => {
        const rolePerms = ROLE_PERMISSION_MAP[role]
        if (rolePerms) {
          permissions.push(...rolePerms)
        }
      })
      // 去重
      return [...new Set(permissions)]
    },

    /**
     * 根据用户信息生成默认角色
     */
    generateDefaultRoles(userInfo: UserInfo): string[] {
      // 如果用户信息中有角色，直接使用
      if (userInfo.roles?.length) {
        return userInfo.roles
      }
      // 否则根据用户ID判断（仅演示用，生产环境应从后端获取）
      return ['admin']
    },

    /**
     * 用户登出
     */
    async logoutAction() {
      try {
        await logoutApi()
      } catch (error) {
        console.error('登出失败:', error)
      } finally {
        this.resetState()
      }
    },

    /**
     * 刷新访问令牌
     */
    async refreshAccessToken() {
      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      try {
        throw new Error('Refresh token API not implemented')
      } catch {
        throw new Error('Failed to refresh access token')
      }
    },

    /**
     * 获取用户信息（内部使用）
     */
    async fetchUserInfo() {
      const userInfoRes = await getUserInfoApi()
      const menusRes = await getMenuListApi()

      return {
        token: getAccessToken(),
        refreshToken: getRefreshToken(),
        user: userInfoRes,
        menus: menusRes
      }
    },

    /**
     * 重置状态
     */
    resetState() {
      this.user = null
      this.roles = []
      this.permissions = []
      this.menus = []
      this.isSetUser = false
      this.isRouteGenerated = false
      removeAccessToken()
      removeRefreshToken()
      // 清除动态路由
      resetRouteGenerator()
    },

    /**
     * 检查是否有指定权限
     * @param permission - 权限标识
     */
    hasPermission(permission: string): boolean {
      // 超级管理员拥有所有权限
      if (this.isSuperAdmin) return true
      // 检查权限标识
      return this.permissions.includes('*:*:*') || this.permissions.includes(permission)
    },

    /**
     * 检查是否有所有指定权限
     * @param permissions - 权限标识列表
     */
    hasAllPermissions(permissions: string[]): boolean {
      if (this.isSuperAdmin) return true
      return permissions.every((p) => this.hasPermission(p))
    },

    /**
     * 检查是否有任意指定权限
     * @param permissions - 权限标识列表
     */
    hasAnyPermission(permissions: string[]): boolean {
      if (this.isSuperAdmin) return true
      return permissions.some((p) => this.hasPermission(p))
    },

    /**
     * 检查是否有指定角色
     * @param role - 角色标识
     */
    hasRole(role: string): boolean {
      // 超级管理员拥有所有角色权限
      if (this.isSuperAdmin) return true
      return this.roles.includes(role)
    },

    /**
     * 检查是否有所有指定角色
     * @param roles - 角色标识列表
     */
    hasAllRoles(roles: string[]): boolean {
      if (this.isSuperAdmin) return true
      return roles.every((r) => this.hasRole(r))
    },

    /**
     * 检查是否有任意指定角色
     * @param roles - 角色标识列表
     */
    hasAnyRole(roles: string[]): boolean {
      if (this.isSuperAdmin) return true
      return roles.some((r) => this.hasRole(r))
    },

    /**
     * 清除权限缓存（用于权限变更后重新计算）
     */
    clearPermissionCache() {
      this.permissions = []
    }
  }
})
