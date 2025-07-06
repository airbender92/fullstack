// client/src/stores/Login.store.ts
import { makeObservable, observable, action } from 'mobx';
import { login, getUserInfo } from '@/service/login';

class LoginStore {
  @observable isLoggedIn: boolean = false;
  @observable token: string | null = null;
  @observable refreshToken: string | null = null;
  @observable error: string | null = null;

  constructor() {
    makeObservable(this);
  }

  @action
  login = async (params: { username: string; password: string }) => {
    try {
      const response = await login(params);
      this.isLoggedIn = true;
      this.token = response.token;
      this.refreshToken = response.refreshToken;
      this.error = null;

      // 将 token 和 refreshToken 存储到 localStorage
      localStorage.setItem('token', this.token);
      localStorage.setItem('refreshToken', this.refreshToken);
      return this;
    } catch (error) {
      this.isLoggedIn = false;
      this.token = null;
      this.refreshToken = null;
      this.error = '登录失败，请检查用户名和密码';
      return this;
    }
  };

  @action
  logout = () => {
    this.isLoggedIn = false;
    this.token = null;
    this.refreshToken = null;
    this.error = null;

    // 从 localStorage 中移除 token 和 refreshToken
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };
}

export default LoginStore;
