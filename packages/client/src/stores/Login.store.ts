// client/src/stores/Login.store.ts
import { makeObservable, observable, action } from 'mobx';
import { login, getUserInfo, getPermissions } from '@/service/login';

class LoginStore {
  @observable isLoggedIn: boolean = false;
  @observable token: string | null = null;
  @observable refreshToken: string | null = null;
  @observable error: string | null = null;
  @observable permissions: string[] = []; // 新增：用户权限列表
  @observable loading: boolean = false;

  constructor() {
    makeObservable(this);
    this.initFromLocalStorage(); // 初始化时从本地存储加载数据
  }

  @action
  initFromLocalStorage = () => {
    const storedToken = localStorage.getItem('token');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedPermissions = localStorage.getItem('permissions');
    
    if (storedToken && storedRefreshToken) {
      this.token = storedToken;
      this.refreshToken = storedRefreshToken;
      this.isLoggedIn = true;
      
      // 恢复权限数据
      if (storedPermissions) {
        try {
          this.permissions = JSON.parse(storedPermissions);
        } catch (error) {
          console.error('Failed to parse permissions from localStorage', error);
          this.permissions = [];
        }
      }
      
      // 页面刷新时，异步刷新权限数据
      this.refreshPermissions();
    }
  };

  @action
  login = async (params: { username: string; password: string }) => {
    this.loading = true;
    try {
      const response = await login(params);
      this.isLoggedIn = true;
      this.token = response.token;
      this.refreshToken = response.refreshToken;
      this.error = null;

      // 将 token 和 refreshToken 存储到 localStorage
      localStorage.setItem('token', this.token);
      localStorage.setItem('refreshToken', this.refreshToken);
      
      // 登录成功后获取用户权限
      await this.fetchPermissions();
      
      return this;
    } catch (error) {
      this.isLoggedIn = false;
      this.token = null;
      this.refreshToken = null;
      this.error = '登录失败，请检查用户名和密码';
      return this;
    } finally {
      this.loading = false;
    }
  };

  @action
  logout = () => {
    this.isLoggedIn = false;
    this.token = null;
    this.refreshToken = null;
    this.permissions = []; // 清空权限
    this.error = null;

    // 从 localStorage 中移除所有认证数据
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('permissions');
  };

  @action
  fetchPermissions = async () => {
    if (!this.token) return;
    
    try {
      const permissions = await getPermissions();
      if (Array.isArray(permissions) && permissions.every(p => typeof p === 'string')) {
        this.permissions = permissions;
        // 将权限保存到 localStorage，以便页面刷新时恢复
        localStorage.setItem('permissions', JSON.stringify(permissions));
      } else {
        this.permissions = [];
        localStorage.setItem('permissions', JSON.stringify([]));
        console.error('获取到的权限数据格式不正确:', permissions);
      }
    } catch (error) {
      console.error('获取权限失败:', error);
      // 处理权限获取失败的情况，例如登出用户
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as any).response === 'object' &&
        (error as any).response?.status === 401
      ) {
        this.logout();
      }
    }
  };

  @action
  refreshPermissions = async () => {
    // 用于在页面刷新或需要时重新获取权限
    if (this.isLoggedIn && this.token) {
      await this.fetchPermissions();
    }
  };

  // 权限检查方法
  hasPermission = (permission: string) => {
    return this.permissions.includes(permission);
  };

  hasAnyPermissions = (permissions: string[]) => {
    return permissions.some(perm => this.hasPermission(perm));
  };

  hasAllPermissions = (permissions: string[]) => {
    return permissions.every(perm => this.hasPermission(perm));
  };
}


export default LoginStore