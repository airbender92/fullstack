// client/src/hooks/useAuth.ts
import { useState, useEffect } from 'react';

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
};

const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true, // 添加加载状态
  });

  useEffect(() => {
    // 模拟验证逻辑，这里可以替换为实际的 API 请求
    const token = localStorage.getItem('token');

    // 简单验证：如果存在 token 就认为已认证
    // 实际应用中应该验证 token 的有效性（例如，检查过期时间）
    const isValidToken = token !== null;

    setAuthState({
      isAuthenticated: isValidToken,
      isLoading: false,
    });
  }, []);

  return authState;
};

export default useAuth;
