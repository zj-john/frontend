/**
 * 多入口文件配置
 */

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js",
    other: "./src/other.js",
  },
  output: {
    filename: "[name].js", // 多文件输出
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "main.html",
      chunks: ['main']  // 放入哪些代码块，不写则2个html中2个js都会被引入
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "other.html",
      chunks: ['other']  // ['other', 'main'] 2个都放入
    }),
  ],
};
