const {merge} = require('webpack-merge');
const baseConfig = require('./webpack.base.js'); // Adjust the path as necessary
const TerserPlugin = require('terser-webpack-plugin');
const CssMinizerPlugin = require('css-minimizer-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');


const prodConfig = merge(baseConfig, {
    mode: 'production',
    devtool: 'source-map',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    compress: {
                        drop_console: true,
                    },
                },
            }),
            new CssMinizerPlugin(),
        ],
    },
    plugins: [
        new CompressionPlugin({
            filename: '[path][base].gz',
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8,
        }),
    ],
});

module.exports = prodConfig; // For CommonJS compatibility