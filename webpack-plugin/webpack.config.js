let path = require('path');
let DonePlugin = require('./plugins/DonePlugin');
let AsyncPlugin = require('./plugins/AsyncPlugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let FileListPlugin = require('./plugins/FileListplugin');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let InlineSourcePlugin = require('./plugins/InlineSourcePlugin')
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module:{
        rules:[
            {
                test: /\.css$/,
                use:[
                    MiniCssExtractPlugin.loader, 'css-loader'
                ]
            }
        ]
    },
    plugins:[
        new MiniCssExtractPlugin({
            filename: 'main.css'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new FileListPlugin({
            filename: 'list.md'
        }),
        new InlineSourcePlugin({
            match: /\.(js|css)$/
        })
        // new DonePlugin(),
        // new AsyncPlugin()
    ]
}