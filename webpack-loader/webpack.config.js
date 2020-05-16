const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')        
    },
    resolveLoader:{
        modules: ['node_modules', path.resolve(__dirname,'loaders')],
        // alias:{
        //     'loader1': path.resolve(__dirname, 'loaders', 'loader1')
        // }
    },
    devtool: 'source-map',
    // watch:true,
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.jpg$/,
                // use: {
                //     loader:'file-loader'
                // }
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 20 * 1024 // 20k
                    }
                }
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets:[
                            '@babel/preset-env'
                        ]
                    }                    
                }
            },
            {
                test: /\.js$/,
                use: {
                    // 添加注释 /*xxx*/
                    loader: 'banner-loader',
                    options: {
                        // 文本
                        text: "这里是注释",
                        filename: path.resolve(__dirname,'banner.js')                        
                    }                    
                }
            }
            // {
            //     test: /\.js$/,
            //     // use: path.resolve(__dirname, 'loaders', 'loader1')
            //     use: 'loader1'
            // },
            // {
            //     test: /\.js$/,
            //     use: [
            //         // 从右向左执行
            //         'loader1','loader2','loader3'
            //     ]
            // },
            // 从下向上执行
            // {
            //     test: /\.js$/,
            //     use: 'loader1',
            //     enforce: 'pre'
            // },
            // {
            //     test: /\.js$/,
            //     use: 'loader2'
            // },
            // {
            //     test: /\.js$/,
            //     use: 'loader3',
            //     enforce: 'post'
            // }
        ]
    }
}