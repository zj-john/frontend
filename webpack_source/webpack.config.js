const path = require('path');
class P {
    constructor() {
        console.log('p')
    }
    apply(compiler) {
        compiler.hooks.emit.tap('emit',function(){
            console.log('emit');
        })
    }
}

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')        
    },
    // resolveLoader:{
    //     modules: ['node_modules', path.resolve(__dirname,'loader')],
    //     alias:{
    //         'loader1': path.resolve(__dirname, 'loader', 'loader1')
    //     }
    // },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    path.resolve(__dirname, 'loader', 'style-loader'),
                    path.resolve(__dirname, 'loader', 'less-loader')
                ]
            }
        ]
    },
    plugins:[
        new P()
    ]
}