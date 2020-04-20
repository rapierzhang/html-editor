const path = require('path');
const DIST_PATH = path.resolve(__dirname, 'dist');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
        path: DIST_PATH,
        publicPath: "",
        chunkFilename: "[name].js",
        filename: "[name].js"
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
            //图片
            {
                test: /\.(png|jpg|gif|svg|ico)$/i, //i不区分大小写
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: './static/img/', //图片输出位置
                        },
                    },
                    'image-webpack-loader', //图片压缩工具
                ],
            },
            //字体图标
            {
                test: /\.(eot|woff|woff2|ttf)$/i,
                // include: path.resolve(__dirname, 'node_modules'),
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 30000,
                        outputPath: './static/font/', //图片输出位置
                    },
                },
            },
            //数据
            {
                test: [/\.json$/i], //i不区分大小写
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: './static/data/', //图片输出位置
                        },
                    },
                ],
            },
            //音乐
            {
                test: [/\.mp3$/i], //i不区分大小写
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: './static/music/', //图片输出位置
                        },
                    },
                ],
            },
            {
                test: /\.(scss|css)$/, //css打包 路径在plugins里
                use: [
                    {loader: "style-loader"},
                    { loader: "css-loader", options: { url: false, sourceMap: true } },
                    { loader: "sass-loader", options: { sourceMap: true } }
                ],
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        // new webpack.HotModuleReplacementPlugin()
        new CleanWebpackPlugin(['dist']),
        new copyWebpackPlugin([
            {
                //复制static到dist
                from: __dirname + '/src/static', //打包的静态资源目录地址
                to: './static', //打包到dist下面的static
            },
        ]),
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
    ],
};
