// 导入request.js请求工具
import request from "@/utils/request.js";

// 提供调用注册接口的函数
export const userRegisterService = (registerData) => {
  const formData = new FormData();
  formData.append('username', registerData.username);
  formData.append('password', registerData.password);
  formData.append('re_password', registerData.re_password);
  
  return request.post("http://localhost:8888/user/signup", formData);
};

// 提供调用登录接口的函数
export const userLoginService = (loginData) => {
  const formData = new FormData();
  formData.append('username', loginData.username);
  formData.append('password', loginData.password);
  
  return request.post("http://localhost:8888/user/login", formData);
};

export const changeUserName = (newUsername, userId) => {
  return request({
    url: 'http://localhost:8888/user/change_name',  
    method: 'post',
    params: { // 通过 URL 参数传递数据
      id: userId,         // 用户 ID
      name: newUsername // 新的用户名
    }
  });
}

export const deleteUser = (userId) => {
  return request({
    url: 'http://localhost:8888/user/delete',  // 假设你的 API 删除路径是 /user/delete
    method: 'DELETE',
    params: {
      id: userId  // 通过 URL 参数传递用户的 id
    }
  });
};

// 获取用户信息
export const getUserInfoService = (username) => {
  return request({
    url: '/info',
    method: 'get',
    params: { username }
  });
};

// 修改用户信息
export const updateUserService = (data) => {
  return request({
    url: '/update',
    method: 'put',
    data
  });
};

export const getAllUser = () => {
  return request({
    url: 'http://localhost:8888/user/all', // 修改为新的请求路径
    method: 'get', // GET 请求
  })
  .then(response => {
    // 如果响应成功，返回数据
    if (response.code === 200) {
      return response.data; // 返回所有用户信息
    } else {
      throw new Error('获取用户信息失败');
    }
  })
  .catch(error => {
    console.error('请求失败:', error);
    throw error; // 重新抛出错误
  });
};
