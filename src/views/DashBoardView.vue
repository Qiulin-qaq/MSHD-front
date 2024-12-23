<template>
  <div class="dashboard-container">
    <!-- 总览卡片 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in overviewData" :key="item.title">
        <el-card shadow="hover" class="overview-card">
          <div class="card-content">
            <div class="title">{{ item.title }}</div>
            <div class="value">{{ item.value }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <!-- 灾情类型分布 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>灾情类型分布</span>
            </div>
          </template>
          <div class="chart-container">
            <v-chart :option="categoryChartOption" autoresize />
          </div>
        </el-card>
      </el-col>

      <!-- 地区分布 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>地区分布</span>
            </div>
          </template>
          <div class="chart-container">
            <v-chart :option="locationChartOption" autoresize />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 趋势图 -->
    <el-row class="chart-row">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>灾情趋势</span>
            </div>
          </template>
          <div class="chart-container">
            <v-chart :option="trendChartOption" autoresize />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, LineChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import { getDisasterStatistics } from '@/api/disaster'

// 注册必需的组件
use([
  CanvasRenderer,
  PieChart,
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// 全局注册 VChart 组件
const app = getCurrentInstance()
if (app) {
  app.appContext.app.component('v-chart', VChart)
}

const overviewData = ref([
  { title: '灾情总数', value: 0 },
  { title: '今日新增', value: 0 },
  { title: '本周新增', value: 0 },
  { title: '本月新增', value: 0 }
])

const categoryChartOption = ref({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '16',
          fontWeight: 'bold'
        }
      },
      data: []
    }
  ]
})

const locationChartOption = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      type: 'bar',
      data: []
    }
  ]
})

const trendChartOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      type: 'line',
      smooth: true,
      data: []
    }
  ]
})

// 获取统计数据
const fetchStatistics = async () => {
  try {
    const res = await getDisasterStatistics()
    if (res.code === 200) {
      const { overview, categoryStats, locationStats, weeklyTrend } = res.data

      // 更新总览数据
      overviewData.value[0].value = overview.total
      overviewData.value[1].value = overview.todayCount
      overviewData.value[2].value = overview.weekCount
      overviewData.value[3].value = overview.monthCount

      // 更新类型分布图表
      categoryChartOption.value.series[0].data = categoryStats.map(item => ({
        name: item.category,
        value: item.count
      }))

      // 更新地区分布图表
      locationChartOption.value.xAxis.data = locationStats.map(item => item.location)
      locationChartOption.value.series[0].data = locationStats.map(item => item.count)

      // 更新趋势图表
      trendChartOption.value.xAxis.data = weeklyTrend.map(item => item.date)
      trendChartOption.value.series[0].data = weeklyTrend.map(item => item.count)
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

onMounted(() => {
  fetchStatistics()
})
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;

  .overview-card {
    .card-content {
      text-align: center;
      .title {
        font-size: 16px;
        color: #666;
      }
      .value {
        font-size: 24px;
        font-weight: bold;
        margin-top: 10px;
      }
    }
  }

  .chart-row {
    margin-top: 20px;
  }

  .chart-container {
    height: 300px;
  }
}
</style> 