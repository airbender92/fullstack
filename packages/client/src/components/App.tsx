// client/src/components/App.tsx
import React from 'react';
import { Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import '@/styles/global.less';
import SecurityLayout from '@/layout/SecurityLayout';
import MobxLayout from '@/layout/MobxLayout';
import BasicLayout from '@/layout/BasicLayout';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '@/pages/Login';
import LotteryChart from '@/pages/Lottery';
import LoginGuard from './LoginGuard';

const App: React.FC = () => {
  const [count, setCount] = React.useState(0);

  const increment = () => {
    setCount(prev => prev + 1);
  };

  return (
    <Router>
        <LoginGuard>
        <Routes>
          {/* 登录路由放在权限验证外面 */}
          <Route path="/login" element={<Login />} />

          {/* 需要权限的路由放在 SecurityLayout 内 */}
          <Route element={<SecurityLayout />}>
            <Route element={<MobxLayout />}>
              <Route element={<BasicLayout />}>
                <Route
                  path="/"
                  element={
                    <div className="app-container">
                      <h1 className="app-title">React + TypeScript + Ant Design</h1>
                      <div className="card">
                        <UserOutlined className="icon" />
                        <p>点击按钮计数：{count}</p>
                        <Button type="primary" onClick={increment}>
                          增加
                        </Button>
                      </div>
                    </div>
                  }
                />
                <Route
                  path="/lottery-chart"
                  element={<LotteryChart />}
                />
              </Route>
            </Route>
          </Route>
        </Routes>
        </LoginGuard>
    </Router>
  );
};

export default App;