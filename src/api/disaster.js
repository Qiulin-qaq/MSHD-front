import request from '@/utils/request'

// 获取灾情分布数据
export const getDisasterDistribution = () => {
  return request({
    url: '/disaster/distribution',
    method: 'get'
  })
}

// 获取灾情统计数据
export const getDisasterStatistics = () => {
  return request({
    url: '/disaster/statistics',
    method: 'get'
  })
}

// 获取最近灾情事件
export const getRecentDisasters = () => {
  return request({
    url: '/disaster/recent',
    method: 'get'
  })
} 