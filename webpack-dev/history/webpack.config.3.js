const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "development",
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
  },
  entry: {
    main: "./src/index.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
    new webpack.DefinePlugin({
      ENV: JSON.stringify('production'),
      FLAG: 'true',
      EXPRESSION: '1+1'
    })
  ],
  resolve: { // 解析
    modules: [path.resolve('node_modules')],
    extensions: ['.js', '.css', '.json'],
    // mainFields: ['style', 'main'],
    // mainFiles: [],
    alias: {
      bootstrap: 'bootstrap/dist/css/bootstrap.css'
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader','css-loader']
      }
    ]
  }
};
