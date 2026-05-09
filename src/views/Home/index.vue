<template>
  <div class="home">
    <!-- 统计卡片 -->
    <el-row :gutter="16" class="mb-4">
      <el-col v-for="stat in statsData" :key="stat.key" :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <p class="stat-title">{{ stat.title }}</p>
              <p class="stat-value">{{ stat.value.toLocaleString() }}</p>
            </div>
            <div class="stat-icon" :style="{ backgroundColor: stat.bgColor }">
              <el-icon :size="24" :color="stat.color">
                <component :is="stat.icon" />
              </el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="16" class="mb-4">
      <el-col :xs="24" :lg="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>用户增长趋势</span>
              <el-radio-group v-model="chartPeriod" size="small" @change="fetchChartData">
                <el-radio-button value="week">近一周</el-radio-button>
                <el-radio-button value="month">近一月</el-radio-button>
                <el-radio-button value="year">近一年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="chartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8">
        <el-card shadow="hover">
          <template #header>
            <span>用户分布</span>
          </template>
          <div class="pie-chart">
            <el-progress type="dashboard" :percentage="activePercentage" :width="120">
              <template #default>
                <span class="percentage-value">{{ activePercentage }}%</span>
                <span class="percentage-label">活跃用户</span>
              </template>
            </el-progress>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最新动态 -->
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>{{ t('home.recentActivity') }}</span>
          <el-button type="primary" link @click="fetchActivities">
            <el-icon class="mr-1"><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>
      <el-table :data="tableData" stripe v-loading="tableLoading">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="date" :label="t('home.date')" width="180" />
        <el-table-column prop="name" :label="t('home.user')" width="150" />
        <el-table-column prop="action" :label="t('home.action')" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'success' ? 'success' : 'info'" size="small">
              {{ row.status === 'success' ? '成功' : '待处理' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { User, Document, View, Timer, Refresh } from '@element-plus/icons-vue'
import { get } from '@/config/axios'
import * as echarts from 'echarts'

const { t } = useI18n()

// 加载状态
const tableLoading = ref(false)
const loading = ref(false)

// 图表周期
const chartPeriod = ref('week')

// 图表容器
const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 活跃用户百分比
const activePercentage = ref(75)

// 统计数据
const statsData = ref([
  {
    key: 'users',
    title: '总用户数',
    value: 0,
    icon: h(User),
    color: '#409eff',
    bgColor: '#ecf5ff'
  },
  {
    key: 'articles',
    title: '文章总数',
    value: 0,
    icon: h(Document),
    color: '#67c23a',
    bgColor: '#f0f9eb'
  },
  {
    key: 'views',
    title: '总浏览量',
    value: 0,
    icon: h(View),
    color: '#e6a23c',
    bgColor: '#fdf6ec'
  },
  {
    key: 'today',
    title: '今日浏览',
    value: 0,
    icon: h(Timer),
    color: '#f56c6c',
    bgColor: '#fef0f0'
  }
])

// 表格数据
const tableData = ref<any[]>([])

// 图表数据
const chartData = ref<{ date: string; value: number }[]>([])

// 获取统计数据
async function fetchStats() {
  try {
    loading.value = true
    const res: any = await get('/home/stats')
    statsData.value = [
      {
        key: 'users',
        title: '总用户数',
        value: res.totalUsers,
        icon: h(User),
        color: '#409eff',
        bgColor: '#ecf5ff'
      },
      {
        key: 'articles',
        title: '文章总数',
        value: res.totalArticles,
        icon: h(Document),
        color: '#67c23a',
        bgColor: '#f0f9eb'
      },
      {
        key: 'views',
        title: '总浏览量',
        value: res.totalViews,
        icon: h(View),
        color: '#e6a23c',
        bgColor: '#fdf6ec'
      },
      {
        key: 'today',
        title: '今日浏览',
        value: res.todayViews,
        icon: h(Timer),
        color: '#f56c6c',
        bgColor: '#fef0f0'
      }
    ]
    activePercentage.value = Math.round((res.activeUsers / res.totalUsers) * 100)
  } catch (error) {
    console.error('获取统计数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取图表数据
async function fetchChartData() {
  try {
    const res: any = await get('/home/chart', { params: { period: chartPeriod.value } })
    chartData.value = res
    updateChart()
  } catch (error) {
    console.error('获取图表数据失败:', error)
  }
}

// 获取活动列表
async function fetchActivities() {
  try {
    tableLoading.value = true
    const res: any = await get('/home/activities', { params: { pageNo: 1, pageSize: 10 } })
    tableData.value = res.list
  } catch (error) {
    console.error('获取活动列表失败:', error)
  } finally {
    tableLoading.value = false
  }
}

// 更新图表
function updateChart() {
  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.value.map(item => item.date)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '用户数',
        type: 'line',
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.5)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
          ])
        },
        itemStyle: {
          color: '#409eff'
        },
        data: chartData.value.map(item => item.value)
      }
    ]
  }

  chartInstance.setOption(option)
}

// 刷新数据
function handleRefresh() {
  fetchStats()
  fetchChartData()
  fetchActivities()
}

// 初始化
onMounted(() => {
  fetchStats()
  fetchChartData()
  fetchActivities()

  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})
</script>

<style scoped lang="scss">
.home {
  width: 100%;
  height: 100%;
  padding: 16px;
  overflow-y: auto;
  box-sizing: border-box;
  background-color: var(--page-bg-color);
}

.mb-4 {
  margin-bottom: 16px;
}

.mr-1 {
  margin-right: 4px;
}

.stat-card {
  margin-bottom: 16px;

  .stat-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .stat-info {
    flex: 1;
  }

  .stat-title {
    margin: 0;
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }

  .stat-value {
    margin: 8px 0 0;
    font-size: 24px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 300px;
}

.pie-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;

  .percentage-value {
    display: block;
    font-size: 24px;
    font-weight: 600;
  }

  .percentage-label {
    display: block;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}
</style>


