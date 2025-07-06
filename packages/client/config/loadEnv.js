// client/config/loadEnv.js
const dotenv = require('dotenv');
const path = require('path');

const loadEnv = () => {
  const envPath = `.env.${process.env.NODE_ENV || 'development'}`;
  const envConfig = dotenv.config({
    path: path.resolve(__dirname, `../${envPath}`),
  }).parsed;
  // 定义共有环境变量的默认值
  const defaultEnv = {
    PUBLIC_PATH: '/fullstack',
    APP_TITLE: 'My Fullstack App',
    IS_DEV: process.env.NODE_ENV === 'development',
  };
  // 合并默认值和 .env 文件中的配置
  return {
    ...defaultEnv,
    ...envConfig,
  };
};

module.exports = loadEnv;
