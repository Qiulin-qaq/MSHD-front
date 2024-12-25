import request from '@/utils/request'

// 获取灾情列表
export const getDisasterListService = () => {
  return request.get("http://localhost:8888/v1/data_list");
}




// 删除灾情
export const deleteDisasterService = (ids) => {
  return request({
    url: "http://localhost:8888/v1/data/delete",

    method: 'delete',
    data: {ids},
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

// 获取灾情统计数据
export const getDisasterStatisticsService = () => {

  return request.get("http://localhost:8888/disaster_data/counts");
}


//新增灾情记录
export const addDisasterService = (data) => {
  
  return request({
    url: "http://localhost:8888/v1/decode/text",
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data',  // 明确指定使用 form-data
    }
  })
}


//导入灾情文件
export const addFileService = (data) => {
  return request({
    url: "http://localhost:8888/v1/decode/media",
    method: 'post',
    data: data

  })
}

export const getSearchService = (data) => {
  return request({
    url: "http://localhost:8888/v1/query",
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data',  // 明确指定使用 form-data
    }

  })
}