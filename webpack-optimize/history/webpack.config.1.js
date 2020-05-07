const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HappyPack = require('happypack');

module.exports = {
    mode: 'development',
    devServer:{
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
                use: 'Happypack/loader?id=js',
                // loader: 'babel-loader',
                // options:{
                //     presets:[
                //         '@babel/preset-env',
                //         '@babel/preset-react'
                //     ]
                // }
            }
        ]
    },
    plugins: [
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, 'dist', 'manifest.json') // 查找dll引用的文件
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new webpack.IgnorePlugin(/\.\/locale/, /moment/),
        new HappyPack({
            id:'js',
            use: [
                {
                    loader: 'babel-loader',
                    options:{
                        presets:[
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ]
                    }
                }
            ]
        })     
    ]
}