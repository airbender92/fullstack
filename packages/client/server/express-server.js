
const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const { createProxyMiddleware } = require('http-proxy-middleware');
const devConfig = require('../config/webpack.dev.js'); // Adjust the path as necessary
const { PORT, API_BASE_URL } = require('../config/config.js'); // Adjust the path as necessary

const app = express();
const compiler = webpack(devConfig);

// 应用 webpack中间件
app.use(
    webpackDevMiddleware(compiler, {
        publicPath: devConfig.output?.publicPath || '/',
      stats: 'minimal'
    })
);

// 热更新中间件
app.use(webpackHotMiddleware(compiler));

// 代理 API 请求
 app.use(
    '/api',
    createProxyMiddleware({
      target: API_BASE_URL,
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
          logLevel: 'debug', // 添加调试日志
    })
  );

// 静态文件服务
app.use(express.static(path.join(__dirname, '../public')));


// 处理所有其他请求，返回index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});