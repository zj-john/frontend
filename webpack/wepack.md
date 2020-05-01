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
- less-loader: less-> css
- node-sass & sass-loader : 处理 sass
- stylus-loader: 处理 stylus

> 默认 css 打包在 js 中，不会抽离成单独的 css 文件。

- postcss-loader: 结合autoprefixer 自动添加前缀

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
