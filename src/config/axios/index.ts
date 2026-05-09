/**
 * Axios 模块导出
 * @description 提供统一的请求方法封装
 */

import service, { axiosInstance, clearPendingRequests } from './service'
import type { AxiosRequestConfig } from 'axios'
import type { ApiResult, PageResult } from './config'

/**
 * 请求方法
 */
export const request = <T = unknown, R = ApiResult<T>>(config: AxiosRequestConfig): Promise<R> => {
  return service.request(config)
}

/**
 * GET 请求
 */
export const get = <T = unknown, R = ApiResult<T>>(
  url: string,
  config?: AxiosRequestConfig
): Promise<R> => {
  return service.get(url, config)
}

/**
 * POST 请求
 */
export const post = <T = unknown, R = ApiResult<T>>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<R> => {
  return service.post(url, data, config)
}

/**
 * PUT 请求
 */
export const put = <T = unknown, R = ApiResult<T>>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<R> => {
  return service.put(url, data, config)
}

/**
 * DELETE 请求
 */
export const del = <T = unknown, R = ApiResult<T>>(
  url: string,
  config?: AxiosRequestConfig
): Promise<R> => {
  return service.delete(url, config)
}

/**
 * PATCH 请求
 */
export const patch = <T = unknown, R = ApiResult<T>>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<R> => {
  return service.patch(url, data, config)
}

/**
 * 上传文件
 */
export const upload = <T = unknown, R = ApiResult<T>>(
  url: string,
  file: File | FormData,
  config?: AxiosRequestConfig
): Promise<R> => {
  const formData = file instanceof FormData ? file : new FormData()
  if (file instanceof File) {
    formData.append('file', file)
  }
  return service.post(url, formData, {
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...config?.headers
    }
  })
}

/**
 * 下载文件
 */
export function download(
  url: string,
  filename?: string,
  config?: AxiosRequestConfig
): Promise<void> {
  return service
    .get(url, {
      ...config,
      responseType: 'blob'
    })
    .then((response) => {
      const blob = new Blob([response as unknown as BlobPart])
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = filename || 'download'
      link.click()
      URL.revokeObjectURL(link.href)
    })
}

// 导出 axios 实例和方法
export { service, axiosInstance, clearPendingRequests }

// 重新导出类型
export type { ApiResult, PageResult, RequestConfig } from './config'
export { default as axiosConfig } from './config'
export { default as errorCode, getErrorMessage } from './errorCode'

