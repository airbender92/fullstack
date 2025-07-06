// client/src/pages/Login/index.tsx
import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useStore } from '@/stores/useStore';

const Login: React.FC = () => {

  const store = useStore();
  const { login, error } = store.LoginStore;

  const onFinish = async (values: { username: string; password: string }) => {
    // 这里可以添加实际的登录逻辑，例如发送请求到后端验证用户名和密码
    console.log('Received values of form: ', values);
    const response = await login({username: values.username, password: values.password});
  
    if (response.isLoggedIn) {
      message.success('登录成功');
      window.location.href = '#/';
    } else {
      message.error(response.error || '登录失败，请检查用户名和密码');
    }
  };
  return (
    <Form
      name="login"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      style={{ maxWidth: 300, margin: '0 auto', paddingTop: '100px' }}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入用户名!' }]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入密码!' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="密码"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;