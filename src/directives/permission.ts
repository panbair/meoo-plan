/**
 * 权限指令
 * @description v-permission 和 v-role 指令，用于按钮级别权限控制
 */

import type { Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/store/modules/user'

/**
 * 权限指令绑定值类型
 */
type PermissionValue = string | string[] | undefined

/**
 * 权限验证模式
 */
type PermissionMode = 'all' | 'any'

/**
 * 检查是否应该显示元素
 */
function checkPermission(el: HTMLElement, binding: DirectiveBinding<PermissionValue>, vnode: any): boolean {
  const userStore = useUserStore()
  const { value, modifiers } = binding

  // 获取验证模式
  const mode: PermissionMode = modifiers.all ? 'all' : 'any'

  // 如果没有传递权限值，默认隐藏
  if (!value) {
    console.warn('[权限指令] 未传递权限值，元素将被隐藏')
    return false
  }

  // 超级管理员拥有所有权限
  if (userStore.isSuperAdmin) {
    return true
  }

  // 转换为数组
  const permissions = Array.isArray(value) ? value : [value]

  // 根据模式验证
  if (mode === 'all') {
    return userStore.hasAllPermissions(permissions)
  } else {
    return userStore.hasAnyPermission(permissions)
  }
}

/**
 * 权限指令 - 控制元素显示/隐藏
 * 用法：
 * - v-permission="'system:user:add'" - 单一权限
 * - v-permission="['system:user:add', 'system:user:edit']" - 多个权限（任意一个）
 * - v-permission.all="['system:user:add', 'system:user:edit']" - 多个权限（全部）
 */
export const permissionDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<PermissionValue>, _vnode) {
    const hasPermission = checkPermission(el, binding, _vnode)

    if (!hasPermission) {
      // 隐藏元素
      el.style.display = 'none'
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding<PermissionValue>, _vnode) {
    const hasPermission = checkPermission(el, binding, _vnode)

    if (hasPermission) {
      el.style.display = ''
    } else {
      el.style.display = 'none'
    }
  }
}

/**
 * 角色指令绑定值类型
 */
type RoleValue = string | string[] | undefined

/**
 * 检查角色权限
 */
function checkRole(el: HTMLElement, binding: DirectiveBinding<RoleValue>, _vnode: any): boolean {
  const userStore = useUserStore()
  const { value, modifiers } = binding

  const mode: PermissionMode = modifiers.all ? 'all' : 'any'

  if (!value) {
    console.warn('[角色指令] 未传递角色值，元素将被隐藏')
    return false
  }

  // 超级管理员拥有所有角色
  if (userStore.isSuperAdmin) {
    return true
  }

  const roles = Array.isArray(value) ? value : [value]

  if (mode === 'all') {
    return userStore.hasAllRoles(roles)
  } else {
    return userStore.hasAnyRole(roles)
  }
}

/**
 * 角色指令 - 控制元素显示/隐藏
 * 用法：
 * - v-role="'admin'" - 单一角色
 * - v-role="['admin', 'editor']" - 多个角色（任意一个）
 * - v-role.all="['admin', 'editor']" - 多个角色（全部）
 */
export const roleDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<RoleValue>, _vnode) {
    const hasRole = checkRole(el, binding, _vnode)

    if (!hasRole) {
      el.style.display = 'none'
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding<RoleValue>, _vnode) {
    const hasRole = checkRole(el, binding, _vnode)

    if (hasRole) {
      el.style.display = ''
    } else {
      el.style.display = 'none'
    }
  }
}

/**
 * 权限函数式指令（不依赖DOM）
 * 返回一个函数，可用于程序化权限判断
 */
export function usePermission() {
  const userStore = useUserStore()

  /**
   * 检查权限
   */
  const hasPermission = (permission: string): boolean => {
    return userStore.hasPermission(permission)
  }

  /**
   * 检查所有权限
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    return userStore.hasAllPermissions(permissions)
  }

  /**
   * 检查任意权限
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    return userStore.hasAnyPermission(permissions)
  }

  /**
   * 检查角色
   */
  const hasRole = (role: string): boolean => {
    return userStore.hasRole(role)
  }

  /**
   * 检查所有角色
   */
  const hasAllRoles = (roles: string[]): boolean => {
    return userStore.hasAllRoles(roles)
  }

  /**
   * 检查任意角色
   */
  const hasAnyRole = (roles: string[]): boolean => {
    return userStore.hasAnyRole(roles)
  }

  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    hasRole,
    hasAllRoles,
    hasAnyRole,
    isSuperAdmin: userStore.isSuperAdmin,
    isAdmin: userStore.isAdmin,
    permissions: userStore.permissions,
    roles: userStore.roles
  }
}

/**
 * 安装权限指令
 */
export function setupPermissionDirective(app: any) {
  app.directive('permission', permissionDirective)
  app.directive('role', roleDirective)
}

export default {
  install: setupPermissionDirective
}
