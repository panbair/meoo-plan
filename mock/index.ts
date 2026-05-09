/**
 * Mock 数据文件
 * @description 模拟后端 API 接口
 */

import type { MockMethod } from 'vite-plugin-mock'
import { generateId, generateDate, generateMobile, generateUsername, generateEmail, successResponse, pageResponse } from './utils'

export default [
  // ==================== 认证相关 ====================
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }: any) => {
      const { username, password } = body || {}
      
      // 模拟登录验证
      if (username === 'admin' && password === 'admin123') {
        return successResponse({
          accessToken: `mock-token-${Date.now()}-${generateId()}`,
          refreshToken: `mock-refresh-token-${Date.now()}`,
          expiresIn: 7200,
          userInfo: {
            id: 1,
            username: 'admin',
            nickname: '管理员',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            email: 'admin@example.com',
            mobile: '13800138000',
            deptId: 1,
            deptName: '技术部',
            postIds: [1],
            postName: '系统管理员',
            status: 1,
            roles: ['admin'],
            permissions: ['*:*:*']
          }
        }, '登录成功')
      }
      
      // 普通用户登录
      if (username && password) {
        return successResponse({
          accessToken: `mock-token-${Date.now()}-${generateId()}`,
          refreshToken: `mock-refresh-token-${Date.now()}`,
          expiresIn: 7200,
          userInfo: {
            id: generateId(),
            username: username,
            nickname: username,
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            email: generateEmail(),
            mobile: generateMobile(),
            deptId: 2,
            deptName: '运营部',
            postIds: [2],
            postName: '普通员工',
            status: 1,
            roles: ['user'],
            permissions: ['system:user:view', 'system:user:edit']
          }
        }, '登录成功')
      }
      
      return {
        code: 401,
        msg: '用户名或密码错误',
        data: null
      }
    }
  },

  {
    url: '/api/auth/refresh',
    method: 'post',
    response: ({ body }: any) => {
      if (body?.refreshToken) {
        return successResponse({
          accessToken: `mock-token-refreshed-${Date.now()}`,
          refreshToken: `mock-refresh-token-${Date.now()}`,
          expiresIn: 7200
        })
      }
      return {
        code: 401,
        msg: '刷新令牌无效',
        data: null
      }
    }
  },

  {
    url: '/api/auth/logout',
    method: 'post',
    response: () => {
      return successResponse(null, '退出登录成功')
    }
  },

  {
    url: '/api/auth/info',
    method: 'get',
    response: () => {
      return successResponse({
        id: 1,
        username: 'admin',
        nickname: '管理员',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        email: 'admin@example.com',
        mobile: '13800138000',
        deptId: 1,
        deptName: '技术部',
        postIds: [1],
        postName: '系统管理员',
        status: 1,
        roles: ['admin'],
        permissions: ['*:*:*']
      })
    }
  },

  {
    url: '/api/auth/menus',
    method: 'get',
    response: () => {
      return successResponse([
        {
          id: 1,
          path: '/system',
          name: 'System',
          component: 'Layout',
          menuType: 0,
          meta: {
            title: '系统管理',
            icon: 'Setting',
            keepAlive: true,
            roles: ['admin']
          },
          children: [
            {
              id: 11,
              path: '/system/user',
              name: 'User',
              component: '/system/user/index',
              menuType: 1,
              meta: {
                title: '用户管理',
                icon: 'User',
                keepAlive: true,
                roles: ['admin'],
                permissions: ['system:user:view', 'system:user:add', 'system:user:edit', 'system:user:delete']
              }
            },
            {
              id: 12,
              path: '/system/role',
              name: 'Role',
              component: '/system/role/index',
              menuType: 1,
              meta: {
                title: '角色管理',
                icon: 'UserFilled',
                keepAlive: true,
                roles: ['admin'],
                permissions: ['system:role:view', 'system:role:add', 'system:role:edit', 'system:role:delete']
              }
            },
            {
              id: 13,
              path: '/system/menu',
              name: 'Menu',
              component: '/system/menu/index',
              menuType: 1,
              meta: {
                title: '菜单管理',
                icon: 'Menu',
                keepAlive: true,
                roles: ['admin'],
                permissions: ['system:menu:view', 'system:menu:add', 'system:menu:edit', 'system:menu:delete']
              }
            }
          ]
        },
        {
          id: 2,
          path: '/content',
          name: 'Content',
          component: 'Layout',
          menuType: 0,
          meta: {
            title: '内容管理',
            icon: 'Document',
            keepAlive: true
          },
          children: [
            {
              id: 21,
              path: '/content/article',
              name: 'Article',
              component: '/content/article/index',
              menuType: 1,
              meta: {
                title: '文章管理',
                icon: 'Document',
                keepAlive: true,
                permissions: ['content:article:view', 'content:article:add', 'content:article:edit', 'content:article:delete']
              }
            },
            {
              id: 22,
              path: '/content/category',
              name: 'Category',
              component: '/content/category/index',
              menuType: 1,
              meta: {
                title: '分类管理',
                icon: 'Folder',
                keepAlive: true,
                permissions: ['content:category:view', 'content:category:add', 'content:category:edit', 'content:category:delete']
              }
            }
          ]
        },
        {
          id: 3,
          path: '/website',
          name: 'Website',
          component: 'Layout',
          menuType: 0,
          meta: {
            title: '网站管理',
            icon: 'Link',
            keepAlive: true
          },
          children: [
            {
              id: 31,
              path: '/website/list',
              name: 'WebList',
              component: '/web-list/index',
              menuType: 1,
              meta: {
                title: '网站列表',
                icon: 'Link',
                keepAlive: true,
                permissions: ['web:list:view', 'web:list:add', 'web:list:edit', 'web:list:delete']
              }
            }
          ]
        }
      ])
    }
  },

  // ==================== 首页统计 ====================
  {
    url: '/api/home/stats',
    method: 'get',
    response: () => {
      return successResponse({
        totalUsers: 1234,
        totalArticles: 567,
        totalViews: 8901,
        todayViews: 234,
        growthRate: 12.5,
        activeUsers: 856,
        pendingTasks: 23,
        completedTasks: 156
      })
    }
  },

  {
    url: '/api/home/chart',
    method: 'get',
    response: ({ query }: any) => {
      const period = query?.period || 'week'
      let data: { date: string; value: number }[] = []
      const now = new Date()

      if (period === 'week') {
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
          data.push({
            date: date.toISOString().slice(0, 10),
            value: Math.floor(Math.random() * 500) + 100
          })
        }
      } else if (period === 'month') {
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
          data.push({
            date: date.toISOString().slice(0, 10),
            value: Math.floor(Math.random() * 500) + 100
          })
        }
      } else {
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
          data.push({
            date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
            value: Math.floor(Math.random() * 2000) + 500
          })
        }
      }

      return successResponse(data)
    }
  },

  {
    url: '/api/home/distribution',
    method: 'get',
    response: () => {
      return successResponse([
        { name: '活跃用户', value: 75 },
        { name: '沉默用户', value: 15 },
        { name: '流失用户', value: 10 }
      ])
    }
  },

  // ==================== 活动记录 ====================
  {
    url: '/api/home/activities',
    method: 'get',
    response: ({ query }: any) => {
      const page = parseInt(query?.pageNo || '1')
      const pageSize = parseInt(query?.pageSize || '10')
      
      const activities = Array.from({ length: 50 }).map((_, i) => ({
        id: generateId() + i,
        date: generateDate(),
        name: generateUsername(),
        action: [
          '登录系统',
          '创建文章',
          '更新用户信息',
          '提交工单',
          '评论文章',
          '下载文件',
          '修改密码',
          '查看报表'
        ][Math.floor(Math.random() * 8)],
        status: Math.random() > 0.2 ? 'success' : 'pending',
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      }))

      return pageResponse(activities.slice(0, pageSize), 50, page, pageSize)
    }
  },

  // ==================== 用户管理 ====================
  {
    url: '/api/user/list',
    method: 'get',
    response: ({ query }: any) => {
      const page = parseInt(query?.pageNo || '1')
      const pageSize = parseInt(query?.pageSize || '10')
      const keyword = query?.keyword || ''

      let users = Array.from({ length: 100 }).map((_, i) => ({
        id: i + 1,
        username: `user${i + 1}`,
        nickname: generateUsername(),
        avatar: `https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png`,
        email: generateEmail(),
        mobile: generateMobile(),
        deptId: Math.floor(Math.random() * 5) + 1,
        deptName: ['技术部', '运营部', '市场部', '财务部', '人事部'][Math.floor(Math.random() * 5)],
        status: Math.random() > 0.1 ? 1 : 0,
        createTime: generateDate(),
        lastLoginTime: generateDate()
      }))

      if (keyword) {
        users = users.filter(u => 
          u.username.includes(keyword) || 
          u.nickname.includes(keyword) ||
          u.email.includes(keyword)
        )
      }

      return pageResponse(users, users.length, page, pageSize)
    }
  },

  {
    url: '/api/user/detail',
    method: 'get',
    response: ({ query }: any) => {
      const id = query?.id
      return successResponse({
        id: id || 1,
        username: 'user' + (id || 1),
        nickname: generateUsername(),
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        email: generateEmail(),
        mobile: generateMobile(),
        deptId: Math.floor(Math.random() * 5) + 1,
        deptName: '技术部',
        status: 1,
        createTime: generateDate()
      })
    }
  },

  {
    url: '/api/user/create',
    method: 'post',
    response: ({ body }: any) => {
      return successResponse({
        id: generateId(),
        ...body
      }, '创建成功')
    }
  },

  {
    url: '/api/user/update',
    method: 'put',
    response: ({ body }: any) => {
      return successResponse(body, '更新成功')
    }
  },

  {
    url: '/api/user/delete',
    method: 'delete',
    response: () => {
      return successResponse(null, '删除成功')
    }
  },

  // ==================== 角色管理 ====================
  {
    url: '/api/role/list',
    method: 'get',
    response: () => {
      return successResponse([
        {
          id: 1,
          name: 'admin',
          label: '超级管理员',
          description: '拥有系统所有权限',
          status: 1,
          createTime: generateDate()
        },
        {
          id: 2,
          name: 'editor',
          label: '编辑',
          description: '负责内容编辑',
          status: 1,
          createTime: generateDate()
        },
        {
          id: 3,
          name: 'user',
          label: '普通用户',
          description: '基础浏览权限',
          status: 1,
          createTime: generateDate()
        }
      ])
    }
  }
] as MockMethod[]
