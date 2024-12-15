<template>
  <div class="analysis-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="trend-chart">
          <template #header>
            <div class="card-header">
              <span>灾情趋势分析</span>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
                <el-radio-button label="year">年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="trendChartRef" style="height: 400px"></div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="mt-20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>灾害类型分布</span>
            </div>
          </template>
          <div ref="typeChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>地区受灾程度排名</span>
            </div>
          </template>
          <div ref="regionChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

const timeRange = ref('month');
const trendChartRef = ref(null);
const typeChartRef = ref(null);
const regionChartRef = ref(null);

onMounted(() => {
  initTrendChart();
  initTypeChart();
  initRegionChart();
});

const initTrendChart = () => {
  const chart = echarts.init(trendChartRef.value);
  chart.setOption({
    title: { text: '灾情趋势分析' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: { type: 'value' },
    series: [{
      data: [150, 230, 224, 218, 135, 147],
      type: 'line',
      smooth: true
    }]
  });
};

const initTypeChart = () => {
  const chart = echarts.init(typeChartRef.value);
  chart.setOption({
    title: { text: '灾害类型分布' },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      type: 'pie',
      radius: '50%',
      data: [
        { value: 235, name: '地震' },
        { value: 274, name: '洪水' },
        { value: 310, name: '台风' },
        { value: 335, name: '滑坡' },
        { value: 400, name: '其他' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  });
};

const initRegionChart = () => {
  const chart = echarts.init(regionChartRef.value);
  chart.setOption({
    title: { text: '地区受灾程度排名' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'value' },
    yAxis: {
      type: 'category',
      data: ['广东', '四川', '云南', '湖北', '浙江']
    },
    series: [{
      type: 'bar',
      data: [320, 302, 301, 334, 390],
      label: { show: true, position: 'right' }
    }]
  });
};
</script>

<style lang="scss" scoped>
.analysis-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .mt-20 {
    margin-top: 20px;
  }
}
</style> 