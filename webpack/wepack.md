# webpack

# install

- 在本地项目中安装 webpack
- webpack4 需要 webpack 和 webpack-cli

```js
// 安装依赖到 devDependencies
yarn install webpack webpack-cli -D
```

## 为什么需要 wepack-cli

在当前项目根目录下执行 webpack 时，实际执行的是 node_modules/.bin/webpack.cmd

```js
@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\webpack\bin\webpack.js" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\..\webpack\bin\webpack.js" %*
)
```

然后根据判断，进入到 node_modules/webpack/bin/ 下，执行 webpack.js

```js
//webpack.js部分代码
const CLIs = [
  {
    name: "webpack-cli",
    package: "webpack-cli",
    binName: "webpack-cli",
    alias: "cli",
    installed: isInstalled("webpack-cli"),
    recommended: true,
    url: "https://github.com/webpack/webpack-cli",
    description: "The original webpack full-featured CLI.",
  },
  {
    name: "webpack-command",
    package: "webpack-command",
    binName: "webpack-command",
    alias: "command",
    installed: isInstalled("webpack-command"),
    recommended: false,
    url: "https://github.com/webpack-contrib/webpack-command",
    description: "A lightweight, opinionated webpack CLI.",
  },
];

const installedClis = CLIs.filter((cli) => cli.installed);

// 一个没装，提示需要装一个，推荐使用webpack-cli
if (installedClis.length === 0) {
  //...
  let notify =
    "One CLI for webpack must be installed. These are recommended choices, delivered as separate packages:";
  //...
} else if (installedClis.length === 1) {
  //...
} else {
  // 安装了2个，提示只需要一个就可以了，请删除一个
  console.warn(
    `You have installed ${installedClis
      .map((item) => item.name)
      .join(
        " and "
      )} together. To work with the "webpack" command you need only one CLI package, please remove one of them or use them directly via their binary.`
  );
  //...
}
```

# 配置

- 打包（支持 JS 的模块化）
- 默认只能对 js 做处理
- 处理其它类型的文件，需要对应的 loader

## 最简单（0 配置）

webpack 可以进行 0 配置。

当前根目录下直接执行。

```
npx webpack
```

0 配置时，默认会把 src 文件夹下的 index.js 作为入口，打包生成文件到 dist 文件夹下的 main.js

> 0 配置时会给出一条提示，提示未选择模式，默认是用生产模式执行。生产模式会对代码进行压缩之类的优化：
> WARNING in configuration The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
> You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/

### webpack 可以支持多种模块化方式

webpack 支持多种模块间的转化和指定输出的模式方式。

比如按照下面的方式写 index.js，webpack 把 common.js 的模块最终输出为了浏览器可以识别的模块。(sample1)

```js
// 这是一个node中的导出，在浏览器中是不被识别的。但是经过webpack打包之后，打包后的main.js在浏览器中变得可执行了
// a.js
const str = "hello a";
module.exports = str;

// index.js
const a = require("./a.js");
console.log("a：", a);
console.log("Hello");
```

## 手工配置

- 默认配置文件：webpack.config.js / webpackfile.js（用的少）

基础配置：

```js
module.exports = {
  mode: "development", // 模式： production development
  entry: "./src/index.js", //入口
  output: {
    filename: "bundle.js", // 打包后的文件名
    // filename: 'bundle.[hash].js'  // 给每次打包的文件加上hash值，默认20位，[hash:8]指定位数。文件未更改时，hash不变
    path: path.resolve(__dirname, "build"), // 打包后存放的路径，必须是一个绝对路径，所以用resolve来生成
  },
};
```

> 直接 run npx webpack 时会去找这个文件，无需指定

> 在 node_modules/webpack-cli/bin/config/config-yargs.js 中有一条描述, defaultDescription: "webpack.config.js or webpackfile.js", 也就是这 2 个名字的文件都是默认配置文件。具体使用的地方在 webpack-cli 下，utils/convert-argv.js

```js
module.exports = function(yargs) {
	yargs
		.help("help")
		.alias("help", "h")
		.version()
		.alias("version", "v")
		.options({
			config: {
				type: "string",
				describe: "Path to the config file",
				group: CONFIG_GROUP,
				defaultDescription: "webpack.config.js or webpackfile.js",
				requiresArg: true
            },
        //...
```

- webpack 是 node 写出来的，所以配置文件需要用 node 的写法

- 可以通过 webpack --config webpack.config.custom.js 来指定特定的配置文件

```js
// npm
"scripts": {
    "build": "webpack --config webpack.config.custom.js",
    "build-param": "webpack"
}

//npm run build
// 等价于
//npm run build-param -- --config webpack.config.custom.js
```

# webpack-dev-server

- 内部用 express 实现的一个 http server
- 打包生成的文件会加载在内容中
- 可以在 webpack.config.js 中指定配置

```js
devServer: {
    port: 3000, // 端口默认8080,
    progress: true, // 显示打包进度
    contentBase: './build', // express的静态目录
    compress: true, // 是否开启压缩,
    open: true  // 完成后，自动在浏览器打开地址，如localhost:3000
}
```

## html

- 默认打包的只有 js，想让 dev-server 跑起来还需要有一个 index.html 文件。
- 这时可以使用 html-webpack-plugin 插件来帮助生成一个 html，并和打包后的 js 文件关联上。

```js
new HtmlWebpackPlugin({
  template: "./src/index.html", // 以这个文件为模板，dev-server时这个文件也在内存中，build时生成
  filename: "index.html", //生成的文件的名字
  // build时参考做法
  // 压缩
  minify: {
    removeAttributeQuotes: true, //去除双引号
    collapseWhitespace: true, // 折叠空行
  },
  hash: true, // bundle.js?4055911eb52261e88c7d
});
```

# 插件

## html-webpack-plugin

动态生成 html

## mini-css-extract-plugin

抽离 css 内容到单独的文件中，替代 style-loader

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

new MiniCssExtractPlugin({
    filename: "main.css",
}),

{
    test: /\.less$/,
    use: [
        // 打包到单独文件中
        MiniCssExtractPlugin.loader,
        "css-loader",
        "less-loader", // less -> css
    ],
}
```

如果要打包到不同的css文件中，可以复制多个
```js
const MiniCssExtractPlugin1 = require("mini-css-extract-plugin");
const MiniCssExtractPlugin2 = require("mini-css-extract-plugin");

new MiniCssExtractPlugin1({
    filename: "main1.css",
}),

new MiniCssExtractPlugin2({
    filename: "main2.css",
}),
```

# loader

- 特点：每个 loader 功能单一
- loader 支持
  - 字符串（1 个 loader 时）
  - [] （多个 loader 时），内容可以是对象、也可以是字符串
- 处理顺序： 默认从右向左执行，从下到上执行

## css

- css-loader：处理css语法，比如 @import 的语法
- style-loader: 把 css 插入到 head 标签中
- less & less-loader: less-> css
- node-sass & sass-loader : 处理 sass
- stylus & stylus-loader: 处理 stylus

> 默认 css 打包在 js 中，不会抽离成单独的 css 文件。如果需要分离，可以使用mini-css-extract-plugin插件

- postcss-loader: 结合autoprefixer 自动添加前缀
> 可以结合package.json中的browserslist一起使用。
```js
"browserslist": [
  "last 10 Chrome versions",
  "last 5 Firefox versions",
  "Safari >= 6",
  "ie > 8"
]
  ```

## JS
- @babel/core & babel-loader: 将高版本ES语法转化为ES5，可以搭配不同的转换器
  - @babel/preset-env : 当前官方es6语法
  - @babel/plugin-proposal-class-properties: class语法
  - @babel/plugin-proposal-decorators: 装饰器
  - @babel/runtime & @babel/plugin-transform-runtime： 运行时转换
  - @babel/polyfill: 一些高级语法的polyfill实现 安装在dependency中,需要的文件中要引入：require('@babel/polyfill')

> 默认babel只会对构建时的语法进行转化，不会对运行时的语法进行转化，比如实例属性，promise、generator这些api。如果用到这些语法，会产生报错：Uncaught ReferenceError: regeneratorRuntime is not defined。此时需要安装@babel/plugin-transform-runtime和@babel/runtime. @babel/plugin-transform-runtime安装在devDependency中，其构建的包，需要在运行时使用@babel/runtime执行，所以对应的，需要安装@babel/runtime到dependency中。

## 图片
1. 在js中创建图片来引入
```js
import animal from './animal.jpg'
console.log(animal); // animal是对图片的一个新的引用，而不是图片本身
let image = new Image();
// image.src = './animal.jpg'; // 不能直接写相对路径，打包后这个文件并不会copy过去，路径将失效
image.src = animal; // import的方式 ,使用file-loader解析，file-loader默认会在内部生成一张图片到build目录下，然后把生成的图片名字返回回来
document.body.appendChild(image);
```

适配loader
- file-loader
- url-loader : 可以处理文件，还可以把img转换为base64代码，减少http请求

2. 在css中引入 background('url')
```
background: url('./animal.jpg'); // 使用css-loader就可以解析 等价于background: url(require('./animal.jpg'));

```

3. \<img src='./xxx.jpg' \/\>
使用html-withimg-loader来处理html
```js
<img src='./animal.jpg' alt=""/>
{
  test: /\.html$/,
  use: "html-withimg-loader",
}
```

此时如果遇到，图片展示不出来，显示的图片src为{default:'xxxxxxxxxx.jpg'}

原因是：file-loader升级以后，esModule参数默认为true,与html-withimg-loader有冲突，改为false就可以了

```js
{
  test: /.(jpg|png|gif)$/,
  use: {
    loader: "file-loader",
    options: {
      esModule: false,
    },
  },
}
```

4. url-loader 把图片变为base64编码
变为base64会比原图片大1/3，但是减少了http请求，可以自己评估
```js
{
  test: /.(jpg|png|gif)$/,
  use: {
    loader: 'url-loader', // 更常用
    options: {
      limit: 200*1024, //小于200k时，用base64转化，超过则显示为图片。limit：1，1字节，来显示所有图片
      esModule: false,
    },
  },
},
```

# 优化

## css和Js压缩
默认production模式下，js会被压缩优化。但是单独打包的css文件不会被压缩。

如果需要压缩，可以在webpack.config.js中添加optimization属性，来自己定义优化项。
> 注意，optimization会默认覆盖原先的优化选项，比如js压缩。所以，在optimization中同样需呀对js指定压缩选项。

> develpment模式下 不会进行optimization的处理

```js
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

optimization: {
  minimizer: [
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: true
    }),
    new OptimizeCSSAssetsPlugin({})
  ]
}
```

>UglifyJsPlugin 只支持ES5，所以需要babel。
>默认webpack是不对es6语法做处理的，直接原样打包

## eslint检查
- eslint & esint-loader
- 默认配置文件：.eslintrc.json（以.开头） 

## 打包文件文类

### 不同类型的文件放到不同目录中

```js
// 文件
{
  test: /.(jpg|png|gif)$/,
  use: {
    // loader: "file-loader",
    loader: 'url-loader', // 更常用
    options: {
      limit: 200*1024, //小于200k时，用base64转化
      esModule: false,
      outputPath: './img/'
    },
  },
}

new MiniCssExtractPlugin({
  filename: "./css/main.css",
}),
```

### 添加cdn前缀

使用publicPath属性
全局
```js
output: {
  filename: "bundle.[hash:8].js", // 打包后的文件名，加入hash [hash:8]指定8位hash，默认20位
  path: path.resolve(__dirname, "build"), // 打包后存放的路径，必须是一个绝对路径，所以用resolve来生成
  publicPath: 'http://cdn.xxx.com'
}
```

部分
```js
{
  test: /.(jpg|png|gif)$/,
  use: {
    loader: 'url-loader',
    options: {
      limit: 200*1024,
      esModule: false,
      outputPath: '/img',
      publicPath: 'http://cdn.xxx.com'
    },
  },
}
```

# 问题

## commonjs和es6 混用
```js
//a.js
var str = "hello a";

// 为了支持generator，引入了@babel/plugin-transform-runtime 插件
function * gen(){
    yield 1;
}
console.log(gen().next());

module.exports = str;
```
index.js引用了a.js,打包时报错：
```js
a.js:27 Uncaught TypeError: Cannot assign to read only property 'exports' of object '#<Object>'
```

原因如下：
- import和module.exports的混用。混用这两个语法的时候，webpack就会报这个错。（可以使用babel的commonJS模式帮你把import编译成require）
- 使用了@babel/plugin-transform-runtime这个插件。某个commonJS写的文件里使用这个插件时，babel会默认你这个文件是ES6的文件，然后就使用import导入了这个插件，从而产生了上述的混用错误。解决方法是在babel.config.js里配置unambiguous设置，让babel和webpack一样严格区分commonJS文件和ES6文件。

解决：  
引入babel后，可以在整个代码中都使用ES6的语法，保持统一

# 第三方模块

引入的第三方模块，在webpack打包时是放到匿名函数中的，所以原先的window.$就没有注册，变为undefined
```js
import $ from 'jquery';
console.log($); // jquery
console.log(window.$); // undefined
``` 

## 怎么暴露给window
1. expose-loader : 暴露全局的loader（暴露到window上），本身也是一个内联loader（放到js文件中使用的loader）,安装到dependency

```js
import $ from 'expose-loader?$!jquery';
```

2. webpack
```js
import $ from 'jquery';
// webpack.config.js loader
{
  test: require.resolve('jquery'),
  use:'expose-loader?$!jquery'
},
```
3. 在每个模块中注入$
```js
// webpack.config.js plugins
new webpack.ProvidePlugin({
  $:'jquery'
})

// import $ from 'jquery'; //不需要引入了
console.log(window.$);  // undefined
```

4. 如果jquery是在html中script中通过cdn地址引入的

推荐使用这种方式。这种情况下，不需要打包到bundle.js中，可以大大减小包的体积。

不能再使用import $ from 'jquery';的引入，如果有的文件引入了，可以使用以下方式进行全局忽略
```js
// webpack.config.js
externals: { // 这里是外部引入的js，不需要打包
  'jquery':'$'
},
```


# webpack 打包后的文件解析

这里解析的都是 development 模式下的文件.

## sample1

原始文件

```js
(function (modules) {
  // webpackBootstrap
  // The module cache
  var installedModules = {};
  // The require function
  function __webpack_require__(moduleId) {
    // Check if module is in cache
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // Create a new module (and put it into the cache)
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
    });
    // Execute the module function
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );
    // Flag the module as loaded
    module.l = true;
    // Return the exports of the module
    return module.exports;
  }

  // expose the modules object (__webpack_modules__)
  __webpack_require__.m = modules;
  // expose the module cache
  __webpack_require__.c = installedModules;
  // define getter function for harmony exports
  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };
  // define __esModule on exports
  __webpack_require__.r = function (exports) {
    if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
  };

  // create a fake namespace object
  // mode & 1: value is a module id, require it
  // mode & 2: merge all properties of value into the ns
  // mode & 4: return value when already ns object
  // mode & 8|1: behave like require
  __webpack_require__.t = function (value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if (mode & 4 && typeof value === "object" && value && value.__esModule)
      return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, "default", { enumerable: true, value: value });
    if (mode & 2 && typeof value != "string")
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function (key) {
            return value[key];
          }.bind(null, key)
        );
    return ns;
  };

  // getDefaultExport function for compatibility with non-harmony modules
  __webpack_require__.n = function (module) {
    var getter =
      module && module.__esModule
        ? function getDefault() {
            return module["default"];
          }
        : function getModuleExports() {
            return module;
          };
    __webpack_require__.d(getter, "a", getter);
    return getter;
  };
  // Object.prototype.hasOwnProperty.call
  __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };

  // __webpack_public_path__
  __webpack_require__.p = "";
  // Load entry module and return exports
  return __webpack_require__((__webpack_require__.s = "./src/index.js"));
})({
  "./src/a.js": function (module, exports) {
    eval(
      'const str = "hello a";\r\nmodule.exports = str;\n\n//# sourceURL=webpack:///./src/a.js?'
    );
  },
  "./src/index.js": function (module, exports, __webpack_require__) {
    eval(
      'const a = __webpack_require__("./src/a.js")\r\nconsole.log("a：",a);\r\nconsole.log("Hello");\n\n//# sourceURL=webpack:///./src/index.js?'
    );
  },
});
```

简化版

```js
// 整体是一个自执行function
// 传入的参数modules是一个object，key是module的引用地址 ，value是eval包裹的module的执行内容。object中是所有模块的键值对
(function (modules) {
  // The module cache
  var installedModules = {};
  // The require function
  function __webpack_require__(moduleId) {
    // Check if module is in cache
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // Create a new module (and put it into the cache)
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
    });
    // Execute the module function
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );
    // Flag the module as loaded
    module.l = true;
    // Return the exports of the module
    return module.exports;
  }
  // 给__webpack_require__添加很多属性和方法
  // expose the modules object (__webpack_modules__)
  __webpack_require__.m = modules;
  // expose the module cache
  __webpack_require__.c = installedModules;
  __webpack_require__.d = function () {};
  //...
  // 执行__webpack_require__，并把入口文件传入
  return __webpack_require__((__webpack_require__.s = "./src/index.js"));
})({
  "./src/a.js": function (module, exports) {
    //...
  },
  "./src/index.js": function (module, exports, __webpack_require__) {
    //...
  },
});
```
