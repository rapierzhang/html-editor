const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const DIST_PATH = path.resolve(__dirname, 'dist');

module.exports = {
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
        path: DIST_PATH,
        publicPath: '',
        chunkFilename: '[name].js',
        filename: '[name].js',
    },
    externals: {}, //引入三方包
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        runtimeChunk: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|mjs)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.(scss|css)$/, //css打包 路径在plugins里
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader', options: { sourceMap: true } },
                    { loader: 'sass-loader', options: { sourceMap: true } },
                ],
                exclude: /node_modules/,
            },
            {
                //antd样式处理
                test: /\.css$/,
                exclude: /src/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif|svg|ico)$/i, //i不区分大小写
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: './assert/', //图片输出位置
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        // new webpack.HotModuleReplacementPlugin()
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html'), //模板
            filename: 'index.html',
            inject: false, //允许插件修改哪些内容，包括head与body
            hash: true, //是否添加hash值
            minify: {
                //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true, //删除空白符与换行符
            },
            chunksSortMode: 'none', //如果使用webpack4将该配置项设置为'none'
        }),
        // 设置环境变量信息
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            },
        }),
    ],
};
