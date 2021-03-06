const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  //优化项
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  devServer: {
    port: 3000, // 端口默认8080,
    progress: true, // 显示打包进度
    contentBase: "./build", // express的静态目录
    // compress: true, // 是否开启压缩,
    // open: true, // 完成后，自动在浏览器打开地址，如localhost:3000
  },
  mode: "development", // 模式： production development
  entry: "./src/index.js", //入口
  output: {
    filename: "bundle.[hash:8].js", // 打包后的文件名，加入hash [hash:8]指定8位hash，默认20位
    path: path.resolve(__dirname, "build"), // 打包后存放的路径，必须是一个绝对路径，所以用resolve来生成
    // publicPath: 'http://cdn.xxx.com'  // 自动添加cdn前缀
  },
  // 所有外部插件
  plugins: [
    // 插件没有顺序要求
    new HtmlWebpackPlugin({
      template: "./src/index.html", // 以这个文件为模板，dev-server时这个文件也在内存中，build时生成
      filename: "index.html", //生成的文件的名字
      // build时参考做法
      // 压缩
      //   minify: {
      //     removeAttributeQuotes: true, //去除双引号
      //     collapseWhitespace: true, // 折叠空行
      //   },
      //   hash: true, // bundle.js?4055911eb52261e88c7d
    }),
    new MiniCssExtractPlugin({
      filename: "./css/main.css",
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
    }),
  ],
  externals: {
    // 这里是外部引入的js，不需要打包
    jquery: "$",
  },
  module: {
    // 模块
    rules: [
      // 规则
      {
        test: /\.html$/,
        use: "html-withimg-loader",
      },
      // {
      //   test: require.resolve('jquery'),
      //   use:'expose-loader?$'
      // },
      // {
      //   test: /\.js$/,
      //   use: {
      //     loader: 'eslint-loader',
      //     options: {
      //       enforce: 'pre'  // 改变默认从右到左执行顺序，pre最前 post最后 default值normal
      //     }
      //   },
      //   include: path.resolve(__dirname, 'src'),
      //   exclude: /node_modules/
      // },
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
      {
        test: /\.css$/, // 正则匹配
        // css-loader 处理 @import 的语法
        // style-loader 把css插入到head标签中,
        // 执行顺序是从下向上，从右到左
        use: [
          {
            loader: "style-loader",
            options: {
              // 默认生成的css插入到head的最底部，优先级最高，如果想让自己html中定义的style优先级更高，可以更改插入位置
              insert: function insertAtTop(element) {
                var parent = document.querySelector("head");
                // eslint-disable-next-line no-underscore-dangle
                var lastInsertedElement =
                  window._lastElementInsertedByStyleLoader;

                if (!lastInsertedElement) {
                  parent.insertBefore(element, parent.firstChild);
                } else if (lastInsertedElement.nextSibling) {
                  parent.insertBefore(element, lastInsertedElement.nextSibling);
                } else {
                  parent.appendChild(element);
                }

                // eslint-disable-next-line no-underscore-dangle
                window._lastElementInsertedByStyleLoader = element;
              },
            },
          },
          "css-loader",
        ],
      },
      {
        test: /\.less$/,
        use: [
          // 打包到单独文件中
          MiniCssExtractPlugin.loader,
          // 不再打包到html中
          //   {
          //     loader: "style-loader",
          //   },
          "css-loader",
          // 利用postcss结合autoprefixer 自动添加浏览器前缀，要放在css-loader前
          "postcss-loader",
          "less-loader", // less -> css
        ],
      },
      {
        test: /.(jpg|png|gif)$/,
        use: {
          // loader: "file-loader",
          loader: 'url-loader', // 更常用
          options: {
            limit: 200*1024, //小于200k时，用base64转化
            esModule: false,
            outputPath: '/img',
            // publicPath: 'http://cdn.xxx.com'
          },
        },
      },
    ],
  },
};
