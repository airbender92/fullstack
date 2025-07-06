const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const { createProxyMiddleware } = require('http-proxy-middleware');
const devConfig = require('../config/webpack.dev.js'); // Adjust the path as necessary
const loadEnv = require('../config/loadEnv');

const envConfig = loadEnv();
const { PORT, API_BASE_URL } = envConfig;

const app = express();
const compiler = webpack(devConfig);

// 应用 webpack中间件
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: devConfig.output?.publicPath || '/',
    stats: 'minimal',
  }),
);

// 热更新中间件
app.use(
  webpackHotMiddleware(compiler, {
    publicPath: '/fullstack', // 直接指定与 publicPath 一致的值
    stats: 'minimal',
  }),
);

// 静态文件服务（添加路径前缀）
app.use('/fullstack', express.static(path.join(__dirname, '../public')));

// 代理 API 请求

// 从 webpack 配置中提取代理设置（如果存在）
const proxyConfig = devConfig.devServer?.proxy || [
  {
    context: ['/api'],
    target: API_BASE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
    logLevel: 'debug',
  },
];

// 设置代理并添加错误处理
if (Array.isArray(proxyConfig)) {
  proxyConfig.forEach((config) => {
    const proxy = createProxyMiddleware({
      target: config.target,
      changeOrigin: config.changeOrigin,
      pathRewrite: config.pathRewrite,
      on: {
        proxyReq: (proxyReq, req, res) => {
          console.debug(
            `Proxying ${req.method} ${req.url} to ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`,
          );
        },
        error: (err, req, res) => {
          console.error(`Proxy error: ${err.message}`);
          res.status(500).send('Proxy server error');
        },
      },
    });

    app.use(config.context[0], proxy);
  });
} else {
  const proxy = createProxyMiddleware({
    target: proxyConfig.target,
    changeOrigin: proxyConfig.changeOrigin,
    pathRewrite: proxyConfig.pathRewrite,
    on: {
      proxyReq: (proxyReq, req, res) => {
        console.debug(
          `Proxying ${req.method} ${req.url} to ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`,
        );
      },
      error: (err, req, res) => {
        console.error(`Proxy error: ${err.message}`);
        res.status(500).send('Proxy server error');
      },
    },
  });
  app.use(proxy);
}

// 处理所有其他请求，返回index.html
app.get('*name', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
