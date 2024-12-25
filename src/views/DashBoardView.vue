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

    <!-- 腾讯地图区域 -->
    <el-row>
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>灾情地图</span>
            </div>
          </template>
          <!-- 显示地图的容器 -->
          <div class="map_container" ref="mapRef"></div>
        </el-card>
      </el-col>
    </el-row>


  </div>
</template>

<script setup>
import { nextTick, ref, onMounted, getCurrentInstance } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, LineChart, BarChart } from 'echarts/charts'
import { ElMessage } from 'element-plus'



import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import { getDisasterStatisticsService, getDisasterListService } from '@/api/disaster'

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


// 初始化地图
const mapRef = ref(null)
const TMap = window.TMap







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



const disasterList = ref([]) // 存储灾情数据

// 获取灾情列表
const fetchDisasterList = async () => {
  try {


    const res = await getDisasterListService()

    if (res.code === 200) {

      disasterList.value = res.data.all_data

      nextTick(() => {
        initMap() // 获取灾情列表后绘制地图
      })


    } else {

      ElMessage.error(res.msg || '获取数据失败')


      disasterList.value = []

    }
  } catch (error) {

    console.error('获取灾情列表失败:', error)
    ElMessage.error('获取灾情列表失败')

    disasterList.value = []


  }


}


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

// 经纬度
const formData = ref({
  lat: 39.98412,
  lng: 116.307484,
})

const styles = {
  // 默认样式
  "myStyle": new TMap.MarkerStyle({
    "width": 25,  // 点标记样式宽度（像素）
    "height": 35, // 点标记样式高度（像素）
    // 默认标记样式，不使用自定义图片
    "anchor": { x: 16, y: 32 }
  })
}








let map = null
// let isMapInitialized = false;


const processRandomDisasters = async () => {
  const randomCoordinates = [
    { lat: 39.92293, lng: 116.41275, title: '北京市市辖区东城区东华门街道多福巷社区居委会' },  
    { lat: 39.919282, lng: 116.406146, title: '北京市市辖区东城区东华门街道银闸社区居委会' },  
    { lat: 39.894722, lng: 116.416716, title: '北京市市辖区东城区崇文门外街道新世界家园社区居委会' },  
    { lat: 39.89821, lng: 116.42622, title: '北京市市辖区东城区崇文门外街道国瑞城东区社区居委会' },  
    { lat: 37.710836, lng: 116.108047, title: '南河北省衡水市景县温城乡大温城村村民委员会京' },
    { lat: 42.756641, lng: 129.177954, title: '吉林省延边朝鲜族自治州和龙市头道镇龙坪村委会' },  
    { lat: 42.781211, lng: 129.263849, title: '吉林省延边朝鲜族自治州和龙市头道镇广新村委会' },  
     
  ];

  const markerLayer = new TMap.MultiMarker({
    map: map,
    styles: styles,
  });

  // 为每个固定点添加标记
  randomCoordinates.forEach(coord => {
    markerLayer.add([{
      id: coord.title,
      styleId: 'myStyle',
      position: new TMap.LatLng(coord.lat, coord.lng),
      properties: {
        title: coord.title,  // 标记的标题
      },
    }]);
  });
};

// 批量处理灾情数据

// const processDisastersInBatches = async (disasters) => {
//   console.log('disasters', disasters);

//   const markerLayer = new TMap.MultiMarker({
//     map: map,
//     styles: styles,  // 使用预定义样式
//   });

//   const batchSize = 5;  // 每次批量处理5个灾情
//   const delayTime = 100;  // 批次处理间隔时间
//   markerLayer.add([
//     {
//       id: "1",  // 标记唯一标识
//       styleId: 'myStyle',  // 使用预定义样式
//       position: new TMap.LatLng(39.9042, 116.4074),  // 标记的经纬度
//       properties: {
//         title: "北京",  // 标记的标题
//       }
//     }
//   ]);

//   for (let i = 0; i < disasters.length; i++) {
//     const disaster = disasters[i];
//     const latLng = await geocoder(disaster.location);  // 获取经纬度
//     if (latLng) {
//       console.log('经纬度:', latLng);  // 确保有返回经纬度
//       console.log('灾情:', disaster);
//       markerLayer.add([{
//         id: disaster.id.toString(),
//         styleId: 'myStyle',
//         position: new TMap.LatLng(latLng.lat, latLng.lng),
//         properties: {
//           title: disaster.location,
//         },
//       }]);
//     }
//     // 延迟处理下一批
//     if (i + batchSize < disasters.length) {
//       console.log(`等待 ${delayTime} 毫秒后继续处理下一批...`);
//       await new Promise(resolve => setTimeout(resolve, delayTime));
//     }
//   }

// };
// 修改初始化地图函数
const initMap = () => {



  // Create map instance
  const mapCenter = new TMap.LatLng(formData.value.lat, formData.value.lng)
  map = new TMap.Map(mapRef.value, {
    center: mapCenter, //设置地图中心点坐标
    zoom: 5, //设置地图缩放级别
    pitch: 0, //设置俯仰角
    rotation: 0, //设置地图旋转角度
    viewMode: '2D'
  })




  // 遍历灾情数据，获取经纬度并绘制标记

  processRandomDisasters()


};


onMounted(() => {


  fetchStatistics()
  fetchDisasterList()






})
</script>

<style lang="scss" scoped>
#map {
  width: 100%;
  height: 400px;
}

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