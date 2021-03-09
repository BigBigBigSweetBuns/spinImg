const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ejs = require('ejs');

module.exports = {
    mode: "production",
    entry: {
        index: ['./src/spinnerImg/index.js'],
    },
    output: {
        publicPath: './',
        path: path.resolve("./", 'dist'),
        filename: 'public/js/[name].js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/spinnerImg/index.ejs',
            chunks: ['index']
        })
    ],
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                    options: {

                    }
                }]
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }, {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: './dist',
                        },
                    },
                    {
                        loader: 'css-loader',
                    },
                ],
            }, {  //  处理 SCSS 文件的 loader
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: './dist',
                        },
                    }, {
                        loader: 'css-loader',
                    }, {
                        loader: 'sass-loader',
                    },
                ],
            },
            // 处理图片
            {
                test: /\.(jpg|png|gif|bmp|jpeg)$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 8192,
                        name: 'images/[name].[ext]',
                        publicPath: "./",
                        esModule: false
                    }
                }]
            },
            {
                test: /\.ejs$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'underscore-template-loader',
                }]
            }
        ]
    },
    // splitChunksPlugin
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 20000,
            minRemainingSize: 0,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                },
                commons: {
                    name: 'commons',    //提取出来的文件命名
                    chunks: 'initial',  //initial表示提取入口文件的公共部分
                    minChunks: 2,       //表示提取公共部分最少的文件数
                    minSize: 0          //表示提取公共部分最小的大小
                }
            }
        },
    },
}