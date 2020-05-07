# webpack 配置

## 多入口文件

### js
```js
//多入口
module.exports = {
    entry: {
        main: './src/index.js',
        other: './src/other.js'
    },
    output:{
        filename: 'bundle.js',
        path: path.resolve(__dirname,'dist')
    }
}
```
直接npx webpack时，输出：
Conflict: Multiple chunks emit assets to the same filename bundle.js

正确：
```js
output:{
    filename: '[name].js', // 多文件输出
    path: path.resolve(__dirname,'dist')
}
```

### html
```js
new HtmlWebpackPlugin({
    template: "./src/index.html",
    filename: "main.html",
    chunks: ['main']  // 放入哪些代码块，不写则2个html中2个js都会被引入
}),
new HtmlWebpackPlugin({
    template: "./src/index.html",
    filename: "other.html",
    chunks: ['other']
})
```

## source-map
```js
devtool: 'source-map'
```
生成map文件
- source-map：生成一个独立的map文件，如果出错了可以定位到行和列（和打包文件有关联）
- eval-source-map: 不会产生单独的map文件，但是可以显示出错的行和列
- cheap-module-source-map:不会产生列，但是是一个单独的map文件
- cheap-module-eval-source-map: 不会产生列，也不会生成一个单独的map文件


## watch
实时打包
```js
watch:true,
watchOptions: { //监控的选项
    poll: 1000, //每秒轮训检测改1000次
    aggregateTimeout: 500, // 防抖 500ms内只打包、更新一次
    ignored: /node_modules/ // 忽略检测的目录
}
```

## plugins

### clean-webpack-plugin
清除文件
```js
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
new CleanWebpackPlugin() // 0配置默认删除webpack output文件夹下的内容
```

### copy-webpack-plugin
复制文件到指定位置
```js
const CopyWebpackPlugin = require("copy-webpack-plugin");
new CopyWebpackPlugin([
    {from:'public', to: 'public'}  // to 的默认位置是webpack output文件夹
])
```
### webpack.bannerPlugin
版权声明
```js
const webpack = require('webpack');
new webpack.BannerPlugin('made by zj_john') // 所有构建的js中首行都会添加这样一行文字的注释

/*! made by zj_john */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
```

## dev-server跨域

### 别人的服务端
请求代理到express服务器
#### 后端接口有一个公共前缀
```js
// server 3000 
app.get('/api/user', (req,res)=>{
    res.json({
        name: 'zj_john'
    })
})
// webpack.config.js dev server启动在8080端口
devServer: {
    proxy: {
        '/api' : 'http://localhost:3000'
    }
}

// index.js
const xhr =  new XMLHttpRequest();
xhr.open("GET", '/api/user', true)
xhr.send();
xhr.onload = function (data) {
    console.log(data.currentTarget.response);
};
```
#### 后端接口没有公共前缀
```js
// server 3000 
app.get('/user', (req,res)=>{
    res.json({
        name: 'zj_john'
    })
})
// webpack.config.js dev server启动在8080端口
devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: {"^/api" : ""}
      }
    }
  }

// index.js
const xhr =  new XMLHttpRequest();
xhr.open("GET", '/api/user', true)
xhr.send();
xhr.onload = function (data) {
    console.log(data.currentTarget.response);
};
```

### webpack mock数据
纯前端mock数据
```js
devServer: {
    // mode2 前端mock
    before(app) {
      // 这里的app就是webpack-dev-server express的app
      app.get("/api/user", (req, res) => {
        res.json({
          name: "zj_john_2",
        });
      });
    }
  }
```

### 自己的服务端
用自己的服务端，把webpack启动起来(同一个端口)，解决跨域问题

```js
// server.js
const express = require('express');
const app = express();
const webpack = require('webpack');
const middle = require('webpack-dev-middleware');

const config = require('./webpack.config.js');
const compiler = webpack(config);
app.use(middle(compiler));

app.get('/api/user', (req,res)=>{
    res.json({
        name: 'zj_john_3'
    })
})

app.listen(3000)
```

> 因为webpack.config.js中使用的是相对路径，比如./src/index.js。所以如果server.js 应该和 webpack.config.js 不在同一目录下，会有资源找不到的问题。


## resolve
对webpack解析的处理
```js
resolve: { // 解析
    // 查找module时，只在当前目录的node_modules查找，不再向上查找
    modules: [path.resolve('node_modules')],
    // 如果引用一个文件未带后缀名，则以下面的方式逐个查找是否有文件存在，存在则引入 例如 import './index': 先看index.js是否存在，再看index.css是否存在
    extensions: ['.js', '.css', '.json'],
    // 引入第三方插件时，优先从package的style字段引入，如果没有再从main字段引入。
    mainFields: ['style', 'main'],
    // 引用第三方插件时，优先的入口文件
    mainFiles: [],
    // 让解析中的包使用别名
    alias: {
        bootstrap: 'bootstarp/dist/css/bootstrap.css'
    }
}
```

样例：
如果需要只引入bootstrap的css文件样式
```js
// bootstrap包的 package.json文件
"style": "dist/css/bootstrap.css",
"sass": "scss/bootstrap.scss",
"main": "dist/js/bootstrap",
```

1. 方式1
```js
import 'bootstrap/dist/css/bootstrap.css'
```

2. 方式2 (推荐)
```js
import 'bootstrap'
// webpack.config.js
resolve: {
    alias: {
      bootstrap: 'bootstrap/dist/css/bootstrap.css'
    }
}
```


3. 方式3
```js
import 'bootstrap'
// webpack.config.js
resolve: {
    alias: {
      mainFields: ['style', 'main']
    }
}
```

## 定义环境常量
webpack中定义一个 js中可以使用的常量，比如ENV
```js
// webpack.config.js
new webpack.DefinePlugin({
    // 会取value中去引号后的值，所以如果不加2层引号的话，就可以使用JSON.stringify包装一下
    ENV: JSON.stringify('production'),  // 等价于 ENV： "'production'"
    FLAG: 'true',   //bool类型的true
    EXPRESSION: '1+1'
})

// index.js
console.log("ENV",ENV);
console.log("FLAG TYPE",typeof FLAG);
console.log("EXPRESSION", EXPRESSION);


// console
ENV production
FLAG TYPE boolean
EXPRESSION 2
```

## 拆分prod和dev
```js
// webpack.config.base.js
module.exports = {  
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
```

```js
//webpack.config.dev.js
let { smart } = require('webpack-merge');
let base = require('./webpack.config.base.js');

module.exports = smart(base, {
    mode:'production',
    optimization: {
        minimize: true
    },
    plugins: []
})
```

```js
//webpack.config.dev.js
let { smart } = require('webpack-merge');
let base = require('./webpack.config.base.js');

module.exports = smart(base, {
    mode:'development',
    devServer: {
        progress: true, // 显示打包进度
        contentBase: "./dist", // express的静态目录
      }
})
```


```json
// package.json scripts
"build-dev": "webpack --config webpack.config.dev.js",
"build-prod": "webpack --config webpack.config.prod.js"
```