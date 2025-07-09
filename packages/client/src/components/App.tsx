// client/src/components/App.tsx
import React from 'react';
import '@/styles/global.less';
import SecurityLayout from '@/layout/SecurityLayout';
import MobxLayout from '@/layout/MobxLayout';
import BasicLayout from '@/layout/BasicLayout';
import { HashRouter as Router, Routes, Route  } from 'react-router-dom';
import Login from '@/pages/Login';
import LoginGuard from './LoginGuard';
import routes from '@/routes';
import PermissionGuard from './PermissionGuard';

import NavigationListener from '@/utils/NavigationListener';
import MessageNotificationListener from '@/utils/MessageNotificationListener'

const App: React.FC = () => {
  return (
    <Router>
      <NavigationListener />
      <MessageNotificationListener />
      <LoginGuard>
        <Routes>
          {/* 登录路由放在权限验证外面 */}
          <Route path="/login" element={<Login />} />

          {/* 需要权限的路由放在 SecurityLayout 内 */}
          <Route element={<SecurityLayout />}>
            <Route element={<MobxLayout />}>
              <Route element={<BasicLayout />}>
                {routes.map((route: any, index: number) => {
                  if(route.permission) {
                    return (
                      <Route 
                        key={index}
                        path={route.path}
                        element={
                          <PermissionGuard permission={route.permission}>
                            {route.element}
                          </PermissionGuard>
                        }
                      />
                    )
                  } else {
                      return (
                      <Route 
                        key={index}
                       {...route}
                      />
                    )
                  }
                })}
              </Route>
            </Route>
          </Route>
        </Routes>
      </LoginGuard>
    </Router>
  );
};

export default App;
