/**
 * Axios 配置
 * @description 全局 axios 配置项
 */

import type { AxiosRequestConfig } from 'axios'

/**
 * 默认配置
 */
const defaultConfig = {
  /** API 基础路径 */
  baseURL: import.meta.env.DEV
    ? '/api'
    : (import.meta.env.VITE_API_URL || '/api'),

  /** 请求超时时间（毫秒） */
  timeout: 10000,

  /** 是否允许携带跨域 Cookie */
  withCredentials: false,

  /** 响应数据类型 */
  responseType: 'json' as const,

  /** 是否展示请求进度条 */
  withNProgress: true,

  /** 参数序列化配置 */
  paramsSerializer: {
    indexes: null
  }
}

export default defaultConfig

/**
 * 扩展的请求配置
 */
export interface RequestConfig extends AxiosRequestConfig {
  /** 是否转换响应数据 */
  isTransformResponse?: boolean
  /** 是否显示错误消息 */
  showErrorMessage?: boolean
  /** 是否显示成功消息 */
  showSuccessMessage?: boolean
  /** 是否返回原生响应 */
  isReturnNativeResponse?: boolean
  /** 是否忽略取消令牌 */
  ignoreCancelToken?: boolean
  /** 是否可取消请求 */
  cancelRequest?: boolean
  /** 是否为 FormData */
  isFormData?: boolean
  /** 是否加密请求 */
  isEncrypt?: boolean
  /** 重试次数 */
  retryCount?: number
  /** 是否显示加载中 */
  loading?: boolean
  /** 忽略重复请求 */
  ignoreDuplicateRequest?: boolean
}

/**
 * API 响应结果
 */
export interface ApiResult<T = unknown> {
  code: number
  msg: string
  data: T
}

/**
 * 分页结果
 */
export interface PageResult<T = unknown> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}

