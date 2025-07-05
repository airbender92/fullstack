import request from '@/utils/request';

interface LoginRequest {
    username: string;
    password: string;
}

interface LoginResponse {
    token: string;
    refreshToken: string;
    userId: string;
}

interface UserInfo {
    id: string;
    name: string;
    email: string;
    // add other fields as needed
}

// 登录请求
export const login = (data: LoginRequest) =>
    request.post<LoginResponse>('/api/users', data);

export const getUserInfo = () =>
    request.get<UserInfo>('/api/data');

export const uploadFile = (formData: FormData) =>
    request.upload<{ url: string }>('/api/upload', formData);