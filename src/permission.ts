/**
 * 路由权限守卫
 * @description 全局路由守卫，处理权限验证、登录验证、动态路由加载等
 */

import router from '@/router'
import { getAccessToken } from '@/utils/auth'
import { useUserStore } from '@/store/modules/user'
import { routeGenerator } from '@/router/generator'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import type { LocationNormalizedLoaded } from 'vue-router'
import type { MenuPermission } from '@/types/permission'

// NProgress 配置
NProgress.configure({
  showSpinner: false,
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
  minimum: 0.3
})

/**
 * 白名单路由（无需登录即可访问）
 */
const whiteList = ['/login', '/register', '/forgot-password', '/404', '/403']

/**
 * 是否已添加动态路由
 */
let isDynamicRouteAdded = false

/**
 * 获取页面标题
 */
function getPageTitle(to: LocationNormalizedLoaded): string {
  const title = to.meta?.title as string | undefined
  const appTitle = import.meta.env.VITE_APP_TITLE || '管理系统'
  return title ? `${title} - ${appTitle}` : appTitle
}

/**
 * 添加动态路由到路由器
 */
async function addDynamicRoutes(menus: MenuPermission[]): Promise<void> {
  if (!menus || menus.length === 0) return

  // 生成路由
  const generatedRoutes = await routeGenerator.generateFromMenus(menus)

  // 遍历添加路由
  generatedRoutes.forEach((route) => {
    // 检查路由是否已存在
    if (!router.hasRoute(route.name)) {
      router.addRoute('Home', route)
    }
  })

  // 添加 404 路由
  if (!router.hasRoute('NotFound')) {
    router.addRoute('Home', {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/Error/404.vue'),
      meta: { title: '404', hidden: true }
    })
  }

  isDynamicRouteAdded = true
}

/**
 * 初始化用户信息和路由
 */
async function initUserData(): Promise<boolean> {
  const userStore = useUserStore()

  try {
    const { menus } = await userStore.getUserInfoAction()

    // 如果有菜单数据，添加动态路由
    if (menus && menus.length > 0) {
      await addDynamicRoutes(menus)
    }

    return true
  } catch (error) {
    console.error('初始化用户数据失败:', error)
    return false
  }
}

/**
 * 重置动态路由状态
 */
function resetDynamicRouteState(): void {
  isDynamicRouteAdded = false
  routeGenerator.clearCache()
}

/**
 * 路由前置守卫
 */
router.beforeEach(async (to, _from, next) => {
  // 开始进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to)

  const hasToken = !!getAccessToken()
  const userStore = useUserStore()

  // 白名单路由，直接通过
  if (whiteList.includes(to.path)) {
    next()
    NProgress.done()
    return
  }

  // 没有 Token，重定向到登录页
  if (!hasToken) {
    const redirect = to.fullPath
    next(`/login?redirect=${encodeURIComponent(redirect)}`)
    NProgress.done()
    return
  }

  // 有 Token，已登录状态
  if (to.path === '/login') {
    next({ path: '/' })
    NProgress.done()
    return
  }

  // 已登录且访问受保护页面
  try {
    // 如果用户信息未设置，先获取用户信息
    if (!userStore.isSetUser) {
      const success = await initUserData()
      if (!success) {
        // 获取失败，清除状态并跳转登录
        userStore.resetState()
        resetDynamicRouteState()
        next('/login')
        NProgress.done()
        return
      }
    }

    // 如果动态路由未添加且有菜单数据，添加动态路由
    if (!isDynamicRouteAdded && userStore.menus.length > 0) {
      await addDynamicRoutes(userStore.menus)
    }

    // 权限验证通过，继续访问
    next()
  } catch (error) {
    console.error('路由守卫错误:', error)
    // 发生错误，清除状态并跳转登录
    userStore.resetState()
    resetDynamicRouteState()
    next('/login')
  }

  NProgress.done()
})

/**
 * 路由后置守卫
 */
router.afterEach((to) => {
  NProgress.done()

  // 滚动到页面顶部
  window.scrollTo(0, 0)

  // 更新页面标题
  document.title = getPageTitle(to)
})

/**
 * 路由错误处理
 */
router.onError((error: Error) => {
  console.error('[路由错误]', error.message)
  NProgress.done()

  // 如果是异步组件加载失败，尝试重载页面
  if (
    error.message.includes('Loading chunk') ||
    error.message.includes('Failed to fetch dynamically imported module')
  ) {
    window.location.reload()
  }
})

/**
 * 重置路由守卫状态（用于退出登录）
 */
export function resetPermissionState(): void {
  resetDynamicRouteState()
}

/**
 * 手动刷新动态路由
 */
export async function refreshDynamicRoutes(): Promise<void> {
  const userStore = useUserStore()
  resetDynamicRouteState()

  if (userStore.menus.length > 0) {
    await addDynamicRoutes(userStore.menus)
  }
}

/**
 * 获取已生成的路由信息
 */
export function getGeneratedRouteInfo(): {
  routeNames: Set<string>
  routeCount: number
} {
  return {
    routeNames: routeGenerator.getGeneratedRouteNames(),
    routeCount: routeGenerator.getGeneratedRouteNames().size
  }
}

export default router
