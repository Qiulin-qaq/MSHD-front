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
import { getDisasterStatisticsService} from '@/api/disaster'

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
  { title: '灾情总数', value: 123 },
  { title: '今日新增', value: 11 },
  { title: '本周新增', value: 29 },
  { title: '本月新增', value: 23 }
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
      data: [
        { name: '房屋破坏', value: 0 },
        { name: '人员伤亡', value: 0 },
        { name: '生命线工程破坏', value: 0 },
        { name: '次生灾害', value: 0 }
      ]
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
    data: ['北京市', '上海市', '广州市', '深圳市', '南京市'],
    axisLabel: {
      interval: 0,
      rotate: 30
    }
  },
  yAxis: {
    type: 'value',
    name: '灾情数量'
  },
  series: [
    {
      type: 'bar',
      data: [110, 100, 90, 80, 70],
      itemStyle: {
        color: '#409EFF'
      },
      label: {
        show: true,
        position: 'top'
      }
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
    const res = await getDisasterStatisticsService()
    if (res.code === 200) {
      const { disaster_counts, new_data, type_distribution, location_distribution } = res.data

      // 更新总览数据
      overviewData.value[0].value = disaster_counts       // 总灾害数量
      overviewData.value[1].value = new_data.today        // 今日新增
      overviewData.value[2].value = new_data.week         // 本周新增
      overviewData.value[3].value = new_data.month        // 本月新增

      // 更新灾情类型分布数据
      
      const pieData = type_distribution.map(item => ({
        name: item.category,
        value: item.count
      }))
      categoryChartOption.value.series[0].data = pieData
      

      // 更新地区分布数据
      const cityData = location_distribution.reduce((acc, curr) => {
        const cityName = curr.location.match(/^([^市]+市)/)?.[1] || curr.location
        acc[cityName] = (acc[cityName] || 0) + curr.count
        return acc
      }, {})

      // 转换为图表所需的数据格式
      const cities = Object.keys(cityData)
      const counts = Object.values(cityData)
      
      locationChartOption.value = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: cities,
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        yAxis: {
          type: 'value',
          name: '灾情数量'
        },
        series: [
          {
            type: 'bar',
            data: counts,
            itemStyle: {
              color: '#409EFF'
            },
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }
    }
    else {
      console.error('获取统计数据失败:', res.msg)
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