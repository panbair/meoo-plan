/**
 * Axios 服务封装
 * @description 企业级 axios 封装，支持请求取消、重试、Token 刷新
 */

import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError
} from 'axios'
import defaultConfig, { type RequestConfig, type ApiResult } from './config'
import { getErrorMessage } from './errorCode'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAccessToken, setAccessToken, removeToken, getRefreshToken } from '@/utils/auth'
import NProgress from 'nprogress'

/**
 * 正在刷新的标记
 */
let isRefreshing = false

/**
 * Token 刷新后的回调队列
 */
const refreshSubscribers: ((token: string) => void)[] = []

/**
 * 请求缓存（用于取消重复请求）
 */
const pendingMap = new Map<string, AbortController>()

/**
 * 生成请求唯一标识
 */
function generateRequestKey(config: InternalAxiosRequestConfig): string {
  const { method, url, params, data } = config
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
}

/**
 * 添加到 pending 队列
 */
function addPendingRequest(config: InternalAxiosRequestConfig): void {
  const key = generateRequestKey(config)
  if (!pendingMap.has(key)) {
    const controller = new AbortController()
    config.signal = controller.signal
    pendingMap.set(key, controller)
  }
}

/**
 * 移除 pending 队列
 */
function removePendingRequest(config: InternalAxiosRequestConfig): void {
  const key = generateRequestKey(config)
  if (pendingMap.has(key)) {
    pendingMap.delete(key)
  }
}

/**
 * 清空所有 pending 请求
 */
export function clearPendingRequests(): void {
  pendingMap.forEach((controller) => {
    controller.abort('请求已取消')
  })
  pendingMap.clear()
}

/**
 * 订阅 Token 刷新
 */
function subscribeTokenRefresh(callback: (token: string) => void): void {
  refreshSubscribers.push(callback)
}

/**
 * Token 刷新后通知所有等待的请求
 */
function onTokenRefreshed(token: string): void {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers.length = 0
}

/**
 * 创建 axios 实例
 */
const service: AxiosInstance = axios.create({
  baseURL: defaultConfig.baseURL,
  timeout: defaultConfig.timeout,
  withCredentials: defaultConfig.withCredentials,
  responseType: defaultConfig.responseType
})

/**
 * 请求拦截器
 */
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const requestConfig = config as InternalAxiosRequestConfig & RequestConfig

    // 显示进度条
    if (defaultConfig.withNProgress) {
      NProgress.start()
    }

    // 移除重复请求
    removePendingRequest(requestConfig)

    // 添加到 pending 队列（如果配置允许）
    if (requestConfig.cancelRequest !== false) {
      addPendingRequest(requestConfig)
    }

    // 添加 Token
    const token = getAccessToken()
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`
    }

    // 添加时间戳防止缓存
    if (['get', 'delete'].includes(requestConfig.method?.toLowerCase() || '')) {
      requestConfig.params = {
        ...requestConfig.params,
        _t: Date.now()
      }
    }

    return requestConfig
  },
  (error: AxiosError) => {
    NProgress.done()
    console.error('请求配置错误:', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 */
service.interceptors.response.use(
  async (response: AxiosResponse<ApiResult>) => {
    NProgress.done()
    const config = response.config as InternalAxiosRequestConfig & RequestConfig

    // 移除 pending
    removePendingRequest(config)

    // 返回原生响应
    if (config.isReturnNativeResponse) {
      return response
    }

    // 二进制数据直接返回
    if (config.responseType === 'blob' || config.responseType === 'arraybuffer') {
      return response.data
    }

    const { data } = response

    // code 为 0 或 undefined 表示成功
    if (data.code === 0 || data.code === undefined) {
      if (config.showSuccessMessage && data.msg) {
        ElMessage.success(data.msg)
      }
      return data.data ?? data
    }

    // 处理业务错误
    const errorMsg = getErrorMessage(data.code, data.msg)
    if (config.showErrorMessage !== false) {
      ElMessage.error(errorMsg)
    }

    // Token 过期处理
    if (data.code === 401) {
      await handleUnauthorized(config)
    }

    return Promise.reject(new Error(errorMsg))
  },
  async (error: AxiosError<ApiResult>) => {
    NProgress.done()
    const config = error.config as InternalAxiosRequestConfig & RequestConfig & { _retryCount?: number }

    // 移除 pending
    if (config) {
      removePendingRequest(config)
    }

    // 请求被取消
    if (axios.isCancel(error) || error.name === 'CanceledError') {
      return Promise.reject({ message: '请求已取消', canceled: true })
    }

    // 网络错误处理
    if (!error.response) {
      const message = error.message.includes('timeout')
        ? '请求超时，请稍后重试'
        : error.message.includes('Network Error')
          ? '网络连接失败，请检查网络'
          : '网络错误，请稍后重试'
      ElMessage.error(message)
      return Promise.reject(error)
    }

    const { status, data } = error.response
    const errorMsg = getErrorMessage(status, data?.msg || error.message)

    // 根据状态码处理
    switch (status) {
      case 400:
        ElMessage.error(errorMsg)
        break
      case 401:
        await handleUnauthorized(config)
        break
      case 403:
        ElMessage.error('没有权限访问该资源')
        break
      case 404:
        ElMessage.error('请求的资源不存在')
        break
      case 408:
        ElMessage.error('请求超时')
        break
      case 500:
      case 502:
      case 503:
      case 504:
        // 可重试的错误
        if (config && !config._retryCount) {
          config._retryCount = 0
        }
        if (config && config._retryCount !== undefined && config._retryCount < 3) {
          config._retryCount++
          const delay = 1000 * Math.pow(2, config._retryCount)
          await new Promise((resolve) => setTimeout(resolve, delay))
          return service(config)
        }
        ElMessage.error(errorMsg)
        break
      default:
        if (config?.showErrorMessage !== false) {
          ElMessage.error(errorMsg)
        }
    }

    return Promise.reject(error)
  }
)

/**
 * 处理 401 未授权
 */
async function handleUnauthorized(config?: InternalAxiosRequestConfig & RequestConfig): Promise<void> {
  // 防止重复弹窗
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token: string) => {
        if (config) {
          config.headers.Authorization = `Bearer ${token}`
          resolve(service(config))
        }
      })
    })
  }

  isRefreshing = true

  try {
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      // 尝试刷新 Token
      const { data } = await axios.post(`${defaultConfig.baseURL}/auth/refresh`, {
        refreshToken
      })

      const newToken = data.token || data.data?.token
      if (newToken) {
        setAccessToken(newToken)
        onTokenRefreshed(newToken)

        if (config) {
          config.headers.Authorization = `Bearer ${newToken}`
          return service(config)
        }
      }
    }

    throw new Error('Refresh token failed')
  } catch {
    // 刷新失败，提示用户重新登录
    await ElMessageBox.confirm('登录状态已过期，请重新登录', '系统提示', {
      confirmButtonText: '重新登录',
      cancelButtonText: '留在本页',
      type: 'warning'
    })

    removeToken()
    window.location.href = '/login'
  } finally {
    isRefreshing = false
  }
}

export default service
export { service as axiosInstance }
