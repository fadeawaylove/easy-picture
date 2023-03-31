import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { toast } from '~/utils/notify';

const service = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: { 'X-Custom-Header': 'foobar' },
});

// 添加请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 在发送请求之前做些什么
    return config;
  },
  (error: AxiosError) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data;
  },
  (error: AxiosError) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    console.log(error.response?.config?.url);
    const requestUrl = error.response?.config?.url;
    let msg = '请求失败';
    if (requestUrl?.startsWith('https://gitlab.com')) {
      msg = error.response?.data?.message || msg;
    } else {
      msg = error.response?.data?.message || msg;
    }
    toast(msg, 'error');
    return Promise.reject(error);
  }
);

export default service;