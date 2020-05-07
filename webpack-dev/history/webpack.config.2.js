const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  devServer: {
    port: 3000, // 端口默认8080,
    progress: true, // 显示打包进度
    contentBase: "./dist", // express的静态目录
  },
  entry: {
    main: "./src/index.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  // watch: true,
  // watchOptions: {
  //   //监控的选项
  //   poll: 1000, //每秒轮训检测改1000次
  //   aggregateTimeout: 500, // 防抖 500ms内只打包、更新一次
  //   ignored: /node_modules/, // 忽略检测的目录
  // },
  devtool: "cheap-module-source-map", // 生成map文件，便于调试
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "main.html",
      chunks: ["main"], // 放入哪些代码块，不写则2个html中2个js都会被引入
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {from:'public', to: 'public'}
    ]),
    new webpack.BannerPlugin('made by zj_john')
  ],
};
