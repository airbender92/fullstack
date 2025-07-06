// client/src/hooks/usePermissions.ts
import { useState, useEffect } from 'react';
import { getPermissions } from '@/service/login';

type PermissionsState = {
  permissions: string[];
  isLoading: boolean;
  error: boolean;
};

// 全局缓存
let cachedPermissions: string[] | null = null;

const usePermission = () => {
  const [state, setState] = useState<PermissionsState>({
    permissions: [],
    isLoading: true,
    error: false,
  });

  useEffect(() => {
    // 如果已有缓存权限，直接使用
    if (cachedPermissions) {
      setState({
        permissions: cachedPermissions,
        isLoading: false,
        error: false,
      });
      return;
    }
    // 获取权限列表
    getPermissions()
      .then((permissions) => {
        cachedPermissions = Array.isArray(permissions) ? permissions : [];
        setState({
          permissions: cachedPermissions,
          isLoading: false,
          error: false,
        });
      })
      .catch(() => {
        setState({
          permissions: [],
          isLoading: false,
          error: true,
        });
      });
  }, []);

  return state;
};

export default usePermission;