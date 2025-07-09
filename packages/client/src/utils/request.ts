import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { emit } from './event-bus';


// 缓存请求
const pendingRequests = new Map();

// 假设这里有获取和设置 token、refreshToken 的函数
const getToken = () => localStorage.getItem('token');
const setToken = (token: string) => localStorage.setItem('token', token);
const getRefreshToken = () => localStorage.getItem('refreshToken');
const setRefreshToken = (refreshToken: string) =>
  localStorage.setItem('refreshToken', refreshToken);

// 创建 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL, // 根据实际情况修改
  timeout: 10000,
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 生成请求标识
    const requestKey = `${config.method}:${config.url}`;
    // 如果有相同请求正在进行，取消当前请求
    if (pendingRequests.has(requestKey)) {
      const source = pendingRequests.get(requestKey);
      source.cancel('请求被取消，原因：重复请求');
      pendingRequests.delete(requestKey);
    }
    // 创建新的取消令牌
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    config.cancelToken = source.token;
    pendingRequests.set(requestKey, source);
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 请求完成后，从缓存中移除
    const requestKey = `${response.config.method}:${response.config.url}`;
    pendingRequests.delete(requestKey);
    if (response.data && response.data.success) {
      return response.data.data
    }
    return response;
  },
  async (error) => {
    // 请求失败，从缓存中移除
    if (error.config) {
      const requestKey = `${error.config.method}:${error.config.url}`;
      pendingRequests.delete(requestKey);
    }
    if (axios.isCancel(error)) {
      console.log('请求被取消：', error.message)
    }
    const originalConfig = error.config;
    if (error.response) {
      const errorData = error.response.data?.error;
      // 401 状态码处理
      if (error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const refreshToken = getRefreshToken();
          if (!refreshToken) {
            emit('antdNotification', {
              type: 'error', options: {
                message: 'Server Error',
                description: errorData.message || 'An internal server error occurred'
              }
            });
            // 发布导航事件
            emit('navigate', { path: '/login' });
            return Promise.reject(error);
          }

          // 发送刷新 token 请求
          const response: { token: string, refreshToken: string } = await instance.post('/api/auth/refresh-token', {
            refreshToken,
          });
          const { token: newToken, refreshToken: newRefreshToken } = response;

          // 更新 token 和 refreshToken
          setToken(newToken);
          setRefreshToken(newRefreshToken);

          // 重试原请求
          originalConfig.headers.Authorization = `Bearer ${newToken}`;
          return instance(originalConfig);
        } catch (refreshError) {
          emit('antdNotification', {
            type: 'error', options: {
              message: 'Server Error',
              description: errorData.message || 'An internal server error occurred'
            }
          });
          // 刷新 token 失败，发布导航事件
          emit('navigate', { path: '/login' });
          return Promise.reject(refreshError);
        }
      }

      // 403 状态码处理
      if (error.response.status === 403) {
        emit('antdNotification', {
          type: 'error', options: {
            message: 'Server Error',
            description: errorData.message || 'An internal server error occurred'
          }
        });
        emit('navigate', { path: '/login' });
      }
      // 500 状态码处理（服务器内部错误）
      if (error.response.status === 500) {
        emit('antdNotification', {
          type: 'error', options: {
            message: 'Server Error',
            description: errorData.message || 'An internal server error occurred'
          }
        });
      }
      return Promise.reject(errorData);
    } else if (error.request) {
      // 请求已发送，但没有收到响应
      console.error('No response received:', error.request);
      return Promise.reject({
        code: 0,
        message: 'Network error: No response received'
      });
    } else {
      // 发送请求时出错
      console.error('Error setting up the request:', error.message);
      return Promise.reject({
        code: -1,
        message: 'Request setup error: ' + error.message
      });
    }
  },
);

// 封装请求方法
const request = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return instance.get(url, config).then((response) => response as T);
  },
  post: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    return instance.post(url, data, config).then((response) => response as T);
  },
  put: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    return instance.put(url, data, config).then((response) => response as T);
  },
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return instance.delete(url, config).then((response) => response as T);
  },
  // 文件下载
  download: (url: string, config?: AxiosRequestConfig) => {
    return instance
      .get(url, { ...config, responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(response as any);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file'); // 根据实际情况修改文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  },
  // 文件上传
  upload: <T>(
    url: string,
    data: FormData,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    return instance
      .post(url, data, {
        ...config,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => response as T);
  },
};

export default request;
