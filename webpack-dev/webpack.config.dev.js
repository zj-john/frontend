let { smart } = require('webpack-merge');
let base = require('./webpack.config.base.js');

module.exports = smart(base, {
    mode:'development',
    devServer: {
        progress: true, // 显示打包进度
        contentBase: "./dist", // express的静态目录
        // mode2 前端mock
        // before(app) {
        //   // 这里的app就是webpack-dev-server express的app
        //   app.get("/api/user", (req, res) => {
        //     res.json({
        //       name: "zj_john_2",
        //     });
        //   });
        // },
        // mode1 请求代理到express服务器
        // proxy: {
        // '/api' : 'http://localhost:3000'
        // '/api': {
        //   target: 'http://localhost:3000',
        //   pathRewrite: {"^/api" : ""}
        // }
        // },
      }
})