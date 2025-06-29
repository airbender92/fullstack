import React from 'react';
import { Layout } from 'antd';
import { observer } from 'mobx-react';
import {  Outlet } from 'react-router-dom';

import { useStore } from '@/stores/useStore'; // 假设这里有一个自定义的 Mobx 存储钩子

interface MobxLayoutProps {
  children?: React.ReactNode;
}


const { Content } = Layout;

const MobxLayout: React.FC<MobxLayoutProps> = observer(({ children }) => {
  const store = useStore();

  return (
    <Layout>
      <Content> <Outlet /></Content>
    </Layout>
  );
});

export default MobxLayout;