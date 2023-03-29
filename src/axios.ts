import axios, { AxiosResponse, AxiosError } from 'axios';
import { toast } from '~/utils/notify';

const service = axios.create({
  timeout: 60000,
});

// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    console.log(error.response?.config?.url);
    const requestUrl = error.response?.config?.url;
    let msg = '请求失败';
    if (requestUrl?.startsWith('https://gitlab.com')) {
      msg = (error.response as any).data.message || msg;
    } else {
      msg = (error.response as any).data.message || msg;
    }
    toast(msg, 'error');
    return Promise.reject(error);
  }
);

export default service;