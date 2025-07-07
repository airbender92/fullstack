// client/src/hooks/usePermissions.ts
import { useState, useEffect, useCallback } from 'react';
import { getPermissions } from '@/service/login';
import useAuth from './useAuth';

type PermissionsState = {
  permissions: string[];
  isLoading: boolean;
  error: boolean;
};

// 全局缓存
let cachedPermissions: string[] | null = null;

const usePermission = () => {
  const { isAuthenticated } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true);

  const loadPermissions = useCallback(async () => {
    if(!isAuthenticated) {
      setLoading(false);
      return;
    }
    try{
      const data: any = await getPermissions();
      setPermissions(data || []);
    }catch(error) {

    } finally {
setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  const hasPermission = useCallback(
    (permission: string) => {
      return permissions.includes(permission);
  }, [permissions]);

  return {
    permissions,
    loading,
    hasPermission
  }
};

export default usePermission;