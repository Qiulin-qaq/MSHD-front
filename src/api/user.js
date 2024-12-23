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
  
  return request.post("/user/login", formData);
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
