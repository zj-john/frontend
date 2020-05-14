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
    module: {
        rules: [
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
            {
                test: /\.js$/,
                use: 'loader1',
                enforce: 'pre'
            },
            {
                test: /\.js$/,
                use: 'loader2'
            },
            {
                test: /\.js$/,
                use: 'loader3',
                enforce: 'post'
            }
        ]
    }
}