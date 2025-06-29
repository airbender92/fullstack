import React from 'react';
import { Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import '@/styles/global.less';

const App: React.FC = () => {
  const [count, setCount] = React.useState(0);

  const increment = () => {
    setCount(prev => prev + 1);
  };

  return (
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
  );
};

export default App;