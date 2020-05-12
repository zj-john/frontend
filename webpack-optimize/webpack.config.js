const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'production',
    devServer:{
        hot:true,  //启用热更新
        contentBase: './dist'
    },
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
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
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new webpack.NamedModulesPlugin(), //告诉哪个模块更新了
        new webpack.HotModuleReplacementPlugin() //热更新插件
    ]
}