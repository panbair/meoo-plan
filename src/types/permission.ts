/**
 * 路由权限类型定义
 */

/** 路由角色权限配置 */
export interface RolePermission {
  /** 角色标识 */
  role: string
  /** 角色名称 */
  roleName: string
  /** 权限列表 */
  permissions: string[]
}

/** 菜单权限节点 */
export interface MenuPermission {
  /** 菜单ID */
  id: number | string
  /** 父级ID */
  parentId: number | string
  /** 菜单名称 */
  name: string
  /** 路由路径 */
  path: string
  /** 路由名称 */
  routeName?: string
  /** 组件路径 */
  component?: string
  /** 路由重定向 */
  redirect?: string
  /** 菜单图标 */
  icon?: string
  /** 菜单类型: 0=目录, 1=菜单, 2=按钮 */
  menuType: 0 | 1 | 2
  /** 是否缓存 */
  noCache?: boolean
  /** 是否隐藏菜单 */
  hidden?: boolean
  /** 是否始终显示 */
  alwaysShow?: boolean
  /** 是否固定标签页 */
  affix?: boolean
  /** 是否隐藏标签页 */
  noTagsView?: boolean
  /** 权限标识列表 */
  permissions?: string[]
  /** 角色标识列表 */
  roles?: string[]
  /** 子菜单 */
  children?: MenuPermission[]
  /** 元信息 */
  meta?: RouteMetaExt
}

/** 扩展路由元信息 */
export interface RouteMetaExt {
  /** 页面标题 */
  title?: string
  /** 菜单图标 */
  icon?: string
  /** 是否隐藏 */
  hidden?: boolean
  /** 是否缓存 */
  noCache?: boolean
  /** 是否始终显示父级菜单 */
  alwaysShow?: boolean
  /** 是否固定标签页 */
  affix?: boolean
  /** 是否隐藏标签页 */
  noTagsView?: boolean
  /** 高亮菜单路径 */
  activeMenu?: string
  /** 是否可跳转 */
  canTo?: boolean
  /** 权限标识列表 */
  permissions?: string[]
  /** 角色标识列表 */
  roles?: string[]
  /** 外部链接 */
  externalLink?: string
  /** 是否新窗口打开 */
  newWindow?: boolean
  /** 排序 */
  orderNo?: number
}

/** 权限验证模式 */
export type PermissionMode = 'all' | 'any' | 'union'

/** 权限验证配置 */
export interface PermissionConfig {
  /** 验证模式 */
  mode: PermissionMode
  /** 鉴权策略 */
  strategy?: 'all' | 'any' | 'union'
  /** 角色列表 */
  roles?: string[]
  /** 权限列表 */
  permissions?: string[]
}

/** 路由权限验证结果 */
export interface PermissionResult {
  /** 是否通过验证 */
  passed: boolean
  /** 失败原因 */
  reason?: string
}

/** 动态路由生成配置 */
export interface RouteGeneratorConfig {
  /** 路由基础路径 */
  basePath?: string
  /** 是否使用缓存 */
  useCache?: boolean
  /** 缓存Key */
  cacheKey?: string
}

/** 权限指令绑定值类型 */
export type PermissionValue = string | string[] | undefined

/** 角色指令绑定值类型 */
export type RoleValue = string | string[] | undefined
