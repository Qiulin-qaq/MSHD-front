import request from '@/utils/request'

// 获取灾情列表
export const getDisasterList = (params) => {
  return request({
    url: '/v1/decode/data/list',
    method: 'get',
    params
  })
}

// 获取灾情详情
export const getDisasterById = (id) => {
  return request({
    url: `/v1/decode/data/${id}`,
    method: 'get'
  })
}

// 更新灾情信息
export const updateDisaster = (id, data) => {
  return request({
    url: `/v1/decode/data/${id}`,
    method: 'put',
    data
  })
}

// 删除灾情
export const deleteDisaster = (id) => {
  return request({
    url: `/v1/decode/data/${id}`,
    method: 'delete'
  })
}

// 获取灾情统计数据
export const getDisasterStatistics = () => {
  return request({
    url: '/v1/decode/data/statistics',
    method: 'get'
  })
}



