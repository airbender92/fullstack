// client/src/layout/SecurityLayout.tsx
import React, {useEffect} from 'react';
import { Layout } from 'antd';
import useAuth from '@/hooks/useAuth';
import { useNavigate, useLocation, Outlet  } from 'react-router-dom';

interface SecurityLayoutProps {
  children?: React.ReactNode;
}

const { Content } = Layout;

const SecurityLayout: React.FC<SecurityLayoutProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 只有在认证状态确定且未认证时才重定向
  useEffect(() => {
    if (!isLoading && !isAuthenticated && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  // 加载过程中可以显示一个加载状态
  if (isLoading) {
    return <div>验证身份中...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  console.log('children', children)
  return (
    <Layout>
      <Content>
         {/* 使用 Outlet 渲染子路由 */}
{isAuthenticated ? <Outlet /> : null}
      </Content>
    </Layout>
  );
};

export default SecurityLayout;