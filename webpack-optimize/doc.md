# webpack 优化

## noParse

webpack 打包时会去找相关包的依赖，然后依次打包。如果知道某个包是没有对外有依赖的，比如 jquery，可以在 noParse 中设置不去解析依赖关系，减少打包时间

```js
module: {
    noParse: /jquery/, //不去解析jquery中的依赖关系
    rules: [
        {
            test: /\.js$/,
            loader: 'babel-loader',
            options:{
                presets:[
                    '@babel/preset-env',
                    '@babel/preset-react'
                ]
            }
        }
    ]
}
```

## exclude include

指定范围

```js
{
    test: /\.js$/,
    loader: 'babel-loader',
    exclude: /node_modules/,
    include: path.resolve('src'),
    options:{
        presets:[
            '@babel/preset-env',
            '@babel/preset-react'
        ]
    }
}
```

## webpack.IgnorePlugin

忽略某些打包项，比如某个库的语言包，减少打包后的体积

```js
// webpack.config.js
new webpack.IgnorePlugin(/\.\/locale/, /moment/)  //忽略打包moment时./local/这个目录下的解析和打包
// 配置前
 bundle.js   1.27 MiB    main  [emitted]  main
// 配置后
 bundle.js    828 KiB    main  [emitted]  main
```

## 动态链接库 DLL

- 思想：把第三方库，比如 react react-dom 打包为单独的库文件，通过动态链接（manifest.json）的方式引用，不参与主项目的打包。
- 减少了主文件的打包大小，增加了打包速度

```js
// webpack.react.js: 负责把react react-dom 打包为单独的dll库文件
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: {
    react: ["react", "react-dom"], // 打包的范围
  },
  output: {
    filename: "_dll_[name].js", // 产生的文件名
    path: path.resolve(__dirname, "dist"),
    library: "_dll_[name]", // 打包后的库的库名，后面manifest会用这个名字作为key
    libraryTarget: "var", // umd commonjs this...  以什么样的方式打包
  },
  plugins: [
    new webpack.DllPlugin({
      name: "_dll_[name]", // 需要和上面library库同名
      path: path.resolve(__dirname, "dist", "manifest.json"), // 生成manifest任务清单
    }),
  ],
};

// package.json
// dll: webpack --config webpack.react.js
```

libraryTarget:

- var
  var \_dll_react = ...

- this
  this["_dll_react"] = ...

- commonjs
  exports["_dll_react"] = ...

- umd

```js
if (typeof exports === "object" && typeof module === "object")
  module.exports = factory();
else if (typeof define === "function" && define.amd) define([], factory);
else if (typeof exports === "object") exports["_dll_react"] = factory();
else root["_dll_react"] = factory();
```

```js
// 主config webpack.config.js
new webpack.DllReferencePlugin({
  manifest: path.resolve(__dirname, "dist", "manifest.json"), // 告诉webpack，先找manifest中的资源，有则使用，无才打包
});
```

```js
// index.html中
<script src="./dll_react.js"></script>
```

> 由于引入了\_dll_react.js 文件，所以 npm run dev 时，需要配置 devServer 的 contentBase 为./dist，否则找不到该文件。

## 多线程打包

happypack 实现多线程打包

```js
// before
// module
{
    test: /\.js$/,
    exclude: /node_modules/,
    include: path.resolve('src'),
    loader: 'babel-loader',
    options:{
        presets:[
            '@babel/preset-env',
            '@babel/preset-react'
        ]
    }
}

// after
const HappyPack = require('happypack'); // 默认3个线程
// module
{
    test: /\.js$/,
    exclude: /node_modules/,
    include: path.resolve('src'),
    use: 'Happypack/loader?id=js',
}

//plugins
new HappyPack({
    id:'js',
    use: [ // 需要为数组
        {
            loader: 'babel-loader',
            options:{
                presets:[
                    '@babel/preset-env',
                    '@babel/preset-react'
                ]
            }
        }
    ]
})
```

> 如果文件不大，使用 happypack 有可能更慢，是因为分配线程和管理线程也需要耗费时间。

## webpack 自带优化

### import

- import 在生产环境下，会自动去除掉没用的代码
- 这种方式被称为 tree-sharking（把没用的叶子抖掉）
- 如果使用 require 的引入方式，则不会有这种效果
- import calc from './utils' calc.sum(1,2) 等价于 let calc = require('./utils') console.log(calc.default.sum(1,2));

```js
// utils
const sum = (a, b) => {
  return a + b + "sum";
};

const minus = (a, b) => {
  return a - b + "minus";
};

export default {
  sum,
  minus,
};

//index.js
import calc from "./utils.js";
console.log(calc.sum(1, 2));

// 打包时，production模式下，只会把sum函数打包进去，minus会忽略。development模式下都会打包进去
```

### 作用域提升

- scope hosting
- webpack 会自动把一些没用的代码省略，直接变为结果

```js
// index.js
let a = 1;
let b = 2;
let c = a + b;
console.log(c, "------");

//bundle.js
console.log(3, "------");
```

## 抽离公共代码

webpack4 之前的版本，用的是 commonChunkPlugins 来实现的。

```js
optimization: {
    splitChunks: {  //分割代码块
        cacheGroups: { //缓存组
            common: { //公共模块
                chunks: 'initial', // 从入口处查找
                minSize:0, // 大于0个字节
                minChunks: 2, //引用的次数大于2
            }
        },
        vendor: {
            priority:1,  //优先级。默认执行顺序是从上到下，如果不设置优先级，则第三方插件也会打包进common中
            test: /node_modules/,  //匹配到node_modules中的文件
            chunks: 'initial', // 从入口处查找
            minSize:0, // 大于0个字节
            minChunks: 2, //引用的次数大于2
        }
    }
}
```

打包结果：

```s
                Asset       Size  Chunks             Chunk Names
common~index~other.js  156 bytes       0  [emitted]  common~index~other
           index.html  387 bytes          [emitted]
             index.js   1.63 KiB       2  [emitted]  index
             other.js   1.56 KiB       3  [emitted]  other
vendor~index~other.js     88 KiB       1  [emitted]  vendor~index~other
```

## 懒加载

```js
const btn = document.createElement("button");
btn.innerHTML = "click";
document.body.appendChild(btn);
btn.addEventListener("click", function () {
  // es6 草案中的语法，通过jsonp实现动态加载文件 原理同vue react懒加载
  // 打包的时候会吧c.js打包为一个单独的文件。
  import("./c.js").then((data) => {
    console.log(data);
  });
});
```

> 如果不支持，可能需要安装@babel/plugin-syntax-dynamic-import 插件，然后在 module 中配置一下

```js
{
    test: /\.js$/,
    exclude: /node_modules/,
    include: path.resolve('src'),
    loader: 'babel-loader',
    options:{
        presets:[
            '@babel/preset-env',
            '@babel/preset-react'
        ],
        plugins: [
            '@babel/plugin-syntax-dynamic-import'
        ]
    }
}
```

## 热更新

不是页面刷新，而是局部更新。

```js
// webpack.config.js
devServer:{
    hot:true,  //启用热更新
    contentBase: './dist'
}
plugins: [
    //...
    new webpack.NamedModulesPlugin(), //输出哪个模块更新了
    new webpack.HotModuleReplacementPlugin() //热更新插件
]
```

```js
// index.js
import c from './c.js';
console.log(c);
// 更新处理
if(module.hot) { //是否启用热更新
    module.hot.accept('./c.js', ()=>{
        console.log("更新了");
        let c = require('./c.js')
        console.log(c);
        
    })
}
```
