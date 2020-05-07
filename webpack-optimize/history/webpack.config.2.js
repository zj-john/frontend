const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'production',
    devServer:{
        contentBase: './dist'
    },
    optimization: {
        splitChunks: {  //分割代码块
            cacheGroups: { //缓存组
                common: { //公共模块
                    chunks: 'initial', // 从入口处查找
                    minSize:0, // 大于0个字节
                    minChunks: 2, //引用的次数大于2
                },
                vendor: {
                    priority:1,  //优先级
                    test: /node_modules/,  //匹配到node_modules中的文件
                    chunks: 'initial', // 从入口处查找
                    minSize:0, // 大于0个字节
                    minChunks: 2, //引用的次数大于2
                }
            }
        }
    },
    entry: {
        index: './src/index.js',
        other: './src/other.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        noParse: /jquery/, //不去解析jquery中的依赖关系
        rules: [
            {
                test: /\.js$/,                
                exclude: /node_modules/,
                include: path.resolve('src'),
                loader: 'babel-loader',
                options:{
                    presets:[
                        '@babel/preset-env',
                        '@babel/preset-react'
                    ]
                }
            }
        ]
    },
    plugins: [
        // new webpack.DllReferencePlugin({
        //     manifest: path.resolve(__dirname, 'dist', 'manifest.json') // 查找dll引用的文件
        // }),
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        // new webpack.IgnorePlugin(/\.\/locale/, /moment/)
    ]
}