const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { PUBLIC_PATH, APP_TITLE, IS_DEV } = require('./config.js');

const baseConfig = {
    entry: path.resolve(__dirname, "../src/index.tsx"), // 入口文件
    output: {
        path: path.resolve(__dirname, "../dist"),
        publicPath: PUBLIC_PATH,
        filename: IS_DEV ? '[name].js' : '[name].[contenthash].js',
        chunkFilename: IS_DEV ? '[name].chunk.js' : '[name].[contenthash].chunk.js',
        assetModuleFilename: 'assets/[name].[ext]',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        modules: [path.resolve(__dirname, '../src'), 'node_modules'], // 指定解析模块的搜索路径
        alias: {
            '@': path.resolve(__dirname, '../src'),
        },
    },
    module: {
        rules: [
            // 处理 ts
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            // 处理 less 和css
            {
                test: /\.(css|less)$/,
                use: [
                    IS_DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                auto: true,
                                localIdentName: IS_DEV ? '[name]__[local]--[hash:base64:5]' : '[hash:base64:8]',
                            },
                            importLoaders: 2,
                        },
                    },
                    'postcss-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                javascriptEnabled: true,
                            },
                            sourceMap: IS_DEV,
                        },
                    }
                ]
            },
            // 处理图片和字体
            {
                test: /\.(png|jpe?g|gif|svg|woff2?|ttf|eot)$/,
                type: 'asset/resource',
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*'],
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'),
            title: APP_TITLE,
            filename: 'index.html',
            // favicon: path.resolve(__dirname, '../public/favicon.ico'),
            minify: !IS_DEV,
        }),
        new MiniCssExtractPlugin({
            filename: IS_DEV ? '[name].css' : '[name].[contenthash].css',
            chunkFilename: IS_DEV ? '[id].css' : '[id].[contenthash].css',
        }),
        // public 除了 index.html 外， 不能为空，否则会报错
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../public'),
                    to: path.resolve(__dirname, '../dist'),
                    globOptions: {
                        ignore: ['**/index.html'], // 不复制 index.html
                    },
                },
            ],
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.PUBLIC_PATH': JSON.stringify(PUBLIC_PATH),
        }),
    ],
    optimization: {
        splitChunks: {  
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
                styles: {
                    name: 'styles',
                    test: /\.(css|less)$/,
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
        runtimeChunk: 'single'
    }
}

module.exports = baseConfig;