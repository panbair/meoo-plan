/**
 * 动态路由生成器
 * @description 根据用户权限动态生成可访问路由
 */

import type { RouteRecordRaw, RouteRecordName } from 'vue-router'
import type { MenuPermission, RouteGeneratorConfig, PermissionResult } from '@/types/permission'
import { useUserStore } from '@/store/modules/user'

/** 默认路由生成配置 */
const defaultConfig: Required<RouteGeneratorConfig> = {
  basePath: '',
  useCache: true,
  cacheKey: 'permission-routes'
}

/** 已生成的路由名称集合 */
const generatedRouteNames = new Set<RouteRecordName>()

/**
 * 缓存动态路由
 */
function cacheRoutes(routes: RouteRecordRaw[], key: string): void {
  try {
    localStorage.setItem(key, JSON.stringify(routes))
  } catch (error) {
    console.warn('路由缓存失败:', error)
  }
}

/**
 * 获取缓存的路由
 */
function getCachedRoutes(key: string): RouteRecordRaw[] | null {
  try {
    const cached = localStorage.getItem(key)
    if (cached) {
      return JSON.parse(cached)
    }
  } catch (error) {
    console.warn('获取路由缓存失败:', error)
  }
  return null
}

/**
 * 清除路由缓存
 */
function clearRouteCache(key: string): void {
  localStorage.removeItem(key)
}

/**
 * 判断用户是否有权限访问路由
 */
export function checkRoutePermission(
  routeRoles?: string[],
  routePermissions?: string[]
): PermissionResult {
  const userStore = useUserStore()

  // 超级管理员拥有所有权限
  if (userStore.isSuperAdmin) {
    return { passed: true }
  }

  // 如果路由没有配置权限要求，则允许访问
  if (!routeRoles?.length && !routePermissions?.length) {
    return { passed: true }
  }

  // 检查角色权限
  if (routeRoles?.length) {
    const hasRole = routeRoles.some((role) => userStore.hasRole(role))
    if (!hasRole) {
      return { passed: false, reason: '无访问该页面的角色权限' }
    }
  }

  // 检查按钮/数据权限
  if (routePermissions?.length) {
    const hasPermission = routePermissions.some((perm) =>
      userStore.hasPermission(perm)
    )
    if (!hasPermission) {
      return { passed: false, reason: '无访问该页面的操作权限' }
    }
  }

  return { passed: true }
}

/**
 * 过滤可访问的菜单
 */
export function filterAccessibleMenus(menus: MenuPermission[]): MenuPermission[] {
  const userStore = useUserStore()

  return menus
    .filter((menu) => {
      // 超级管理员显示所有菜单
      if (userStore.isSuperAdmin) return true

      // 如果没有配置权限要求，默认显示
      if (!menu.roles?.length && !menu.permissions?.length) return true

      // 检查角色权限
      if (menu.roles?.length) {
        return menu.roles.some((role) => userStore.hasRole(role))
      }

      // 检查操作权限
      if (menu.permissions?.length) {
        return menu.permissions.some((perm) => userStore.hasPermission(perm))
      }

      return false
    })
    .map((menu) => {
      // 递归处理子菜单
      if (menu.children?.length) {
        return {
          ...menu,
          children: filterAccessibleMenus(menu.children)
        }
      }
      return menu
    })
}

/**
 * 将菜单权限转换为路由配置
 */
function convertMenuToRoute(menu: MenuPermission, parentPath: string = ''): RouteRecordRaw | null {
  const route: RouteRecordRaw = {
    path: menu.path,
    name: menu.routeName || menu.name,
    redirect: menu.redirect,
    meta: {
      title: menu.name,
      icon: menu.icon,
      hidden: menu.hidden,
      noCache: menu.noCache,
      alwaysShow: menu.alwaysShow,
      affix: menu.affix,
      noTagsView: menu.noTagsView,
      activeMenu: menu.meta?.activeMenu,
      permissions: menu.permissions,
      roles: menu.roles
    }
  }

  // 处理组件路径
  if (menu.component) {
    // 处理布局组件
    if (menu.component === 'Layout' || menu.component === 'layout') {
      route.component = () => import('@/layout/index.vue')
    } else {
      // 处理视图组件
      route.component = loadComponent(menu.component)
    }
  }

  // 处理子路由
  if (menu.children?.length && menu.children.length > 0) {
    const children: RouteRecordRaw[] = []

    // 处理只有一个子路由的情况
    if (menu.children.length === 1 && !menu.meta?.alwaysShow) {
      const child = menu.children[0]
      route.redirect = `${parentPath}${menu.path}/${child.path}`.replace(/\/+/g, '/')

      const childRoute = convertMenuToRoute(child, `${parentPath}${menu.path}/`)
      if (childRoute) {
        children.push(childRoute)
      }
    } else {
      // 多个子路由或 alwaysShow 为 true
      menu.children.forEach((child) => {
        const childRoute = convertMenuToRoute(child, `${parentPath}${menu.path}/`)
        if (childRoute) {
          children.push(childRoute)
        }
      })
    }

    if (children.length > 0) {
      route.children = children
    }
  }

  return route
}

/**
 * 动态加载组件
 */
const componentCache = new Map<string, () => Promise<any>>()

function loadComponent(componentPath: string): () => Promise<any> {
  // 检查缓存
  if (componentCache.has(componentPath)) {
    return componentCache.get(componentPath)!
  }

  const load = () => {
    // 移除可能的 / 前缀
    const path = componentPath.startsWith('/')
      ? componentPath.slice(1)
      : componentPath

    return import(`@/views/${path}.vue`)
      .then((module) => module.default)
      .catch(() => {
        console.warn(`组件加载失败: ${componentPath}`)
        return import('@/views/Error/500.vue')
      })
  }

  componentCache.set(componentPath, load)
  return load
}

/**
 * 生成完整路由
 */
export function generateRoutes(menus: MenuPermission[]): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = []

  menus.forEach((menu) => {
    const route = convertMenuToRoute(menu)
    if (route) {
      routes.push(route)
      // 记录已生成的路由名称
      if (route.name) {
        generatedRouteNames.add(route.name)
      }
    }
  })

  return routes
}

/**
 * 动态路由生成器类
 */
export class RouteGenerator {
  private config: Required<RouteGeneratorConfig>
  private routesMap = new Map<string, RouteRecordRaw>()

  constructor(config: RouteGeneratorConfig = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  /**
   * 从后端菜单生成路由
   */
  async generateFromMenus(menus: MenuPermission[]): Promise<RouteRecordRaw[]> {
    // 过滤可访问的菜单
    const accessibleMenus = filterAccessibleMenus(menus)

    // 生成路由
    const routes = generateRoutes(accessibleMenus)

    // 缓存路由
    if (this.config.useCache) {
      cacheRoutes(routes, this.config.cacheKey)
    }

    // 构建路由映射
    this.buildRoutesMap(routes)

    return routes
  }

  /**
   * 从缓存恢复路由
   */
  restoreFromCache(): RouteRecordRaw[] | null {
    if (!this.config.useCache) return null

    const cached = getCachedRoutes(this.config.cacheKey)
    if (cached) {
      this.buildRoutesMap(cached)
    }
    return cached
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    clearRouteCache(this.config.cacheKey)
    this.routesMap.clear()
    generatedRouteNames.clear()
    componentCache.clear()
  }

  /**
   * 获取路由映射
   */
  getRoutesMap(): Map<string, RouteRecordRaw> {
    return this.routesMap
  }

  /**
   * 获取已生成的路由名称
   */
  getGeneratedRouteNames(): Set<RouteRecordName> {
    return generatedRouteNames
  }

  /**
   * 构建路由名称映射
   */
  private buildRoutesMap(routes: RouteRecordRaw[], parentPath: string = ''): void {
    routes.forEach((route) => {
      const fullPath = `${parentPath}/${route.path}`.replace(/\/+/g, '/')
      this.routesMap.set(fullPath, route)
      this.routesMap.set(String(route.name), route)

      if (route.children?.length) {
        this.buildRoutesMap(route.children, fullPath)
      }
    })
  }
}

/** 路由生成器单例 */
export const routeGenerator = new RouteGenerator({
  useCache: true,
  cacheKey: 'permission-dynamic-routes'
})

/**
 * 重置路由生成器
 */
export function resetRouteGenerator(): void {
  routeGenerator.clearCache()
}
