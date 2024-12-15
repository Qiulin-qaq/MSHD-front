<script setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';

// 地图相关数据
const map = ref(null);
const disasterData = ref([
  { 
    position: { lat: 39.9042, lng: 116.4074 },
    title: '北京市海淀区',
    type: '地震',
    level: '3级',
    time: '2024-01-15 14:30'
  },
  { 
    position: { lat: 30.5728, lng: 104.0668 },
    title: '四川省成都市',
    type: '洪水',
    level: '严重',
    time: '2024-01-14 09:15'
  }
  // 更多灾情数据...
]);

const initMap = () => {
  // 确保 TMap 已加载
  if (window.TMap) {
    // 初始化地图
    map.value = new window.TMap.Map(document.getElementById('map-container'), {
      center: new window.TMap.LatLng(35.8617, 104.1954), // 中国中心点
      zoom: 5,
      viewMode: '2D'
    });

    // 创建标记图层
    const markerLayer = new window.TMap.MultiMarker({
      map: map.value,
      styles: {
        // 定义标记样式
        earthquake: new window.TMap.MarkerStyle({
          width: 25,
          height: 25,
          anchor: { x: 12.5, y: 12.5 },
          src: 'earthquake-icon.png' // 地震图标
        }),
        flood: new window.TMap.MarkerStyle({
          width: 25,
          height: 25,
          anchor: { x: 12.5, y: 12.5 },
          src: 'flood-icon.png' // 洪水图标
        })
      },
      geometries: disasterData.value.map(item => ({
        id: item.title,
        styleId: item.type === '地震' ? 'earthquake' : 'flood',
        position: new window.TMap.LatLng(item.position.lat, item.position.lng),
        properties: {
          title: item.title,
          type: item.type,
          level: item.level,
          time: item.time
        }
      }))
    });

    // 添加点击事件
    markerLayer.on('click', (evt) => {
      const { type, title, level, time } = evt.geometry.properties;
      // 显示信息窗口
      new window.TMap.InfoWindow({
        map: map.value,
        position: evt.geometry.position,
        content: `
          <div class="info-window">
            <h4>${title}</h4>
            <p>类型：${type}</p>
            <p>等级：${level}</p>
            <p>时间：${time}</p>
          </div>
        `,
        offset: { x: 0, y: -32 }
      }).open();
    });
  } else {
    console.error('腾讯地图 JS API 未加载');
  }
};

// 其他图表初始化代码保持不变
const initCharts = () => {
  // 柱状图
  const barChart = echarts.init(document.getElementById('barChart'));
  barChart.setOption({
    title: { text: '灾情月度统计' },
    tooltip: {},
    xAxis: { data: ['1月', '2月', '3月', '4月'] },
    yAxis: {},
    series: [
      { name: '数量', type: 'bar', data: [5, 20, 36, 10] }
    ]
  });

  // ... 其他图表代码 ...
};

onMounted(() => {
  initMap();
  initCharts();
});
</script>

<template>
  <div class="dashboard">
    <!-- 数据概览卡片 -->
    <el-row :gutter="20" class="data-overview">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="data-item">
            <div class="data-title">总事件数</div>
            <div class="data-number">1,500</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="data-item">
            <div class="data-title">本月新增</div>
            <div class="data-number">258</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="data-item">
            <div class="data-title">待处理</div>
            <div class="data-number">45</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="data-item">
            <div class="data-title">已处理</div>
            <div class="data-number">1,455</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 地图区域 -->
    <el-row class="map-container">
      <el-col :span="24">
        <el-card>
          <div id="map-container" style="height: 600px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-container">
      <el-col :span="12">
        <el-card>
          <div id="barChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div id="lineChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-container">
      <el-col :span="12">
        <el-card>
          <div id="pieChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div class="recent-events">
            <h3>最近事件</h3>
            <el-table :data="[]" style="width: 100%">
              <el-table-column prop="date" label="日期" width="180" />
              <el-table-column prop="type" label="类型" width="180" />
              <el-table-column prop="location" label="地点" />
              <el-table-column prop="status" label="状态" />
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
  .data-overview {
    margin-bottom: 20px;
    
    .data-item {
      text-align: center;
      
      .data-title {
        font-size: 14px;
        color: #666;
      }
      
      .data-number {
        font-size: 24px;
        font-weight: bold;
        margin-top: 10px;
      }
    }
  }

  .map-container {
    margin-bottom: 20px;
    
    .el-card {
      margin-bottom: 20px;
    }
  }

  .charts-container {
    margin-bottom: 20px;
    
    .el-card {
      margin-bottom: 20px;
    }
  }
}

// 信息窗口样式
:deep(.info-window) {
  padding: 10px;
  
  h4 {
    margin: 0 0 10px 0;
    color: #303133;
  }
  
  p {
    margin: 5px 0;
    color: #606266;
  }
}
</style> 