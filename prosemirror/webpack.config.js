const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  entry: "./src/index.js", //入口
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    port: 3000, // 端口默认8080,
    progress: true, // 显示打包进度
    contentBase: "./build", // express的静态目录
    // compress: true, // 是否开启压缩,
    // open: true, // 完成后，自动在浏览器打开地址，如localhost:3000
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // 以这个文件为模板，dev-server时这个文件也在内存中，build时生成
      filename: "index.html", //生成的文件的名字
    }),
  ],
  module: {
    // 模块
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader", //es6 -> es5
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              ["@babel/plugin-proposal-class-properties", { loose: true }],
              "@babel/plugin-transform-runtime",
            ],
          },
        },
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
      },
    ],
  },
};
