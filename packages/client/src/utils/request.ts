import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';

// 假设这里有获取和设置 token、refreshToken 的函数
const getToken = () => localStorage.getItem('token');
const setToken = (token: string) => localStorage.setItem('token', token);
const getRefreshToken = () => localStorage.getItem('refreshToken');
const setRefreshToken = (refreshToken: string) => localStorage.setItem('refreshToken', refreshToken);

// 创建 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL, // 根据实际情况修改
  timeout: 10000,
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    const navigate = useNavigate();

    if (error.response) {
      // 401 状态码处理
      if (error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const refreshToken = getRefreshToken();
          if (!refreshToken) {
            navigate('/login');
            return Promise.reject(error);
          }

          // 发送刷新 token 请求
          const { data } = await instance.post('/api/refresh-token', { refreshToken });
          const newToken = data.token;
          const newRefreshToken = data.refreshToken;

          // 更新 token 和 refreshToken
          setToken(newToken);
          setRefreshToken(newRefreshToken);

          // 重试原请求
          originalConfig.headers.Authorization = `Bearer ${newToken}`;
          return instance(originalConfig);
        } catch (refreshError) {
          // 刷新 token 失败，重定向到登录页
          navigate('/login');
          return Promise.reject(refreshError);
        }
      }

      // 403 状态码处理
      if (error.response.status === 403) {
        navigate('/login');
      }
    }

    return Promise.reject(error);
  }
);

// 封装请求方法
const request = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return instance.get(url, config).then((response) => response.data);
  },
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return instance.post(url, data, config).then((response) => response.data);
  },
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return instance.put(url, data, config).then((response) => response.data);
  },
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return instance.delete(url, config).then((response) => response.data);
  },
  // 文件下载
  download: (url: string, config?: AxiosRequestConfig) => {
    return instance.get(url, { ...config, responseType: 'blob' }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'file'); // 根据实际情况修改文件名
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  },
  // 文件上传
  upload: <T>(url: string, data: FormData, config?: AxiosRequestConfig): Promise<T> => {
    return instance.post(url, data, {
      ...config,
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((response) => response.data);
  },
};

export default request;