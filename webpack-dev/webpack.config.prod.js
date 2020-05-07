let { smart } = require('webpack-merge');
let base = require('./webpack.config.base.js');

module.exports = smart(base, {
    mode:'production',
    optimization: {
        minimize: true
    },
    plugins: []
})