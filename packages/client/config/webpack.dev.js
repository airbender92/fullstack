const {merge} = require('webpack-merge');
const path = require('path');
const baseConfig = require('./webpack.base.js'); // Adjust the path as necessary
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const {API_BASE_URL} = require('./config.js');



const devConfig = merge(baseConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [new ReactRefreshWebpackPlugin()],
        devServer: {
                static: {
                    // 修改为 client/public 目录
                    directory: path.resolve(__dirname, '../public'), 
                },
                compress: true,
                port: 3000,
                hot: true,
                historyApiFallback: true,
                proxy: [ // 将代理配置改为数组格式
                    {
                        context: ['/api'], // 添加 context 字段
                        target: API_BASE_URL,
                        changeOrigin: true,
                        pathRewrite: { '^/api': '' },
                        logLevel: 'debug',
                    }
                ],
        },
    
   
});


module.exports = devConfig;