const path = require("path");
const uglify = require("uglifyjs-webpack-plugin");
const htmlPlugin = require("html-webpack-plugin");
const extractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');
//资源加载大小可视化插件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var website = {
    publicPath: "http://localhost:8881/"
}
module.exports = {
    mode: 'development',
    //入口
    entry: {
        main: './src/main.js',
        main2: './src/main2.js'
    },
    //出口
    output: {
        // 打包的路径
        path: path.resolve(__dirname, './dist'),
        // 打包的文件名
        filename: '[name].js',
        publicPath: website.publicPath
    },
    // 模块：例如如何解读css，图片如何转换，压缩
    module: {
        rules: [
            {
                test: /\.css$/,
                use: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: "css-loader"
                    },
                    {
                        loader: "postcss-loader"
                    }]
                }),
                // use:[
                //     {loader:"style-loader"},
                //     {loader:"css-loader"}
                // ]
            },
            {
                test: /\.less$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader"
                    }],
                    fallback: "style-loader"
                    // use:[
                    //     {loader:"style-loader"},
                    //     {loader:"css-loader"},
                    //     {loader:"less-loader"}
                    // ]
                })
            },
            {
                test: /\.(png|jpg|gif|jpeg)/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 500
                        }
                    }
                ]
            },
            {
                test: /\.(jsx|js)$/,
                use: {
                    loader: 'babel-loader',
                },
                exclude: /node_modules/
            }
        ]
    },
    // 插件：用于生产模版和各项功能
    plugins: [
        // 压缩
        new uglify(),
        // html模版
        new htmlPlugin({
            minify: {//对html文件压缩
                removeAttributeQuotes: true//去掉属性的双引号
            },
            hash: true,//默认为false。如果为 true, 将添加一个唯一的 webpack 编译 hash 到所有包含的脚本和 CSS 文件，对于解除 cache 很有用。
            template: './src/index.html'//要打包的html模版路径和文件名称
        }),
        // 样式分离
        new extractTextPlugin({
            filename: 'css/[name].css',
            // 是否全部都打到一个里
            allChunks: false,
        }),
        // 热更新
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        //资源加载大小可视化
        new BundleAnalyzerPlugin()
    ],
    devServer: {
        // 设置基本目录结构，用于找到程序打包地址
        contentBase: path.resolve(__dirname, '../dist'),
        // 服务器的ip地址，可以使用ip也可以使用localhost
        host: 'localhost',
        // 服务端压缩是否开启
        compress: true,
        // 端口
        port: 8881,
        // 热更新
        hot: true
    }
}
