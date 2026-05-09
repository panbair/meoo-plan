/**
 * 首页 API
 */

import { get } from '@/config/axios'
import type { PageResult } from '@/config/axios'

/**
 * 首页统计数据
 */
export interface HomeStats {
  totalUsers: number
  totalArticles: number
  totalViews: number
  todayViews: number
  growthRate: number
  activeUsers: number
  pendingTasks: number
  completedTasks: number
}

/**
 * 图表数据项
 */
export interface ChartData {
  date: string
  value: number
}

/**
 * 用户分布数据
 */
export interface DistributionData {
  name: string
  value: number
}

/**
 * 活动记录
 */
export interface Activity {
  id: number
  date: string
  name: string
  action: string
  status: 'success' | 'pending'
  ip?: string
}

/**
 * 获取首页统计数据
 */
export const getHomeStatsApi = () => {
  return get<HomeStats>('/home/stats')
}

/**
 * 获取图表数据
 */
export const getChartDataApi = (period: 'week' | 'month' | 'year') => {
  return get<ChartData[]>('/home/chart', { params: { period } })
}

/**
 * 获取用户分布数据
 */
export const getDistributionApi = () => {
  return get<DistributionData[]>('/home/distribution')
}

/**
 * 获取活动记录列表
 */
export const getActivitiesApi = (pageNo = 1, pageSize = 10) => {
  return get<PageResult<Activity>>('/home/activities', { params: { pageNo, pageSize } })
}
