/**
 * 路由配置
 * @description 静态路由配置，包含基础布局路由和登录相关路由
 */

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'

// 静态路由 - 不需要权限验证的路由
const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue'),
    meta: { title: '登录', hidden: true, noCache: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Login/register.vue'),
    meta: { title: '注册', hidden: true, noCache: true },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/Login/forgot-password.vue'),
    meta: { title: '忘记密码', hidden: true, noCache: true },
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/Error/403.vue'),
    meta: { title: '无权限', hidden: true, noCache: true },
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/Error/404.vue'),
    meta: { title: '页面不存在', hidden: true, noCache: true },
  },
  {
    path: '/500',
    name: 'ServerError',
    component: () => import('@/views/Error/500.vue'),
    meta: { title: '服务器错误', hidden: true, noCache: true },
  },
  {
    path: '/web-list',
    name: 'WebList',
    component: () => import('@/views/web-list/index.vue'),
    meta: { title: '网站列表', icon: 'Document', noCache: false },
  },
  {
    path: '/web-ai',
    name: 'WebAI',
    component: () => import('@/views/web-ai/index.vue'),
    meta: { title: '网站AI方案', icon: 'Document', noCache: false }
  },
  {
    path: '/solution-generator',
    name: 'SolutionGenerator',
    component: () => import('@/views/solution-generator/index.vue'),
    meta: { title: '智能方案生成器', icon: 'MagicStick', noCache: false }
  }
]

// 根布局路由 - 动态路由将挂载在此路由下
const rootRoute: RouteRecordRaw = {
  path: '/',
  name: 'Home',
  component: () => import('@/layout/index.vue'),
  redirect: '/index',
  meta: { title: '首页', icon: 'HomeFilled' },
  children: [
    {
      path: '/index',
      name: 'Index',
      component: () => import('@/views/Home/index.vue'),
      meta: {
        title: '首页',
        icon: 'HomeFilled',
        affix: true,
        noCache: false
      }
    }
  ],
}

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PATH),
  strict: true,
  routes: [...staticRoutes, rootRoute],
  scrollBehavior: (_to, _from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

/**
 * 重置路由配置
 */
function resetRouterConfig(): void {
  // 移除所有动态路由
  router.getRoutes().forEach((route) => {
    const name = route.name
    if (
      name &&
      ![
        'Login',
        'Register',
        'ForgotPassword',
        'Forbidden',
        'NotFound',
        'ServerError',
        'Home',
        'Index',
      ].includes(String(name))
    ) {
      router.removeRoute(name)
    }
  })
}

/**
 * 重置路由（用于退出登录）
 */
export const resetRouter = () => {
  resetRouterConfig()
}

/**
 * 安装路由（用于动态注册）
 */
export function setupRouter(app: App) {
  app.use(router)
}

export default router
