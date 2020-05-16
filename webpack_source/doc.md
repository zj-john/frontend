
# Tapable

- webpack本质上是一种事件流的机制，他的工作流程是将各个插件串联起来，而实现这一切的核心就是Tapable
- Tapable有点类似nodejs中的events库，核心原理依赖于发布订阅模式

```js
// webpack/lib/Compiler.js
const {
	Tapable,
	SyncHook,
	SyncBailHook,
	AsyncParallelHook,
	AsyncSeriesHook
} = require("tapable");
```

# 内容
Tapable
- Sync*
    - SyncHook: 同步钩子，依次执行task
    - SyncBailHook：带保险的同步钩子，当上一个task的返回为undefined时才继续向下执行，可以随时停止
    - SyncWaterfallHook：瀑布同步钩子，上一个task的返回是下一个task的传参
    - SyncLoopHook：循环同步钩子，上一个钩子的返回值不是undefined时，循环执行
- Async* : 异步钩子，分为2种，串行执行和并行执行。
    - AsyncParallel*  ：并行，需要等待所有并发的异步事件执行后在执行回调方法
        - AsyncParallelHook
        - AsyncParallelBailHook
    - AsyncSeries* : 串行，按顺序执行
        - AsyncSeriesHook
        - AsyncSeriesBailHook
        - AsyncSeriesWaterfallHook


添加钩子的方法
- tap： 添加同步钩子
- tabSync: 添加异步钩子，需要回调函数
- tabPromise: promise异步钩子，需要返回一个promise
执行
- call: 同步
- callAsync：异步

# self-pack
自己实现一个包self-pack 模拟webpack的打包功能

```js
//package.json
"bin": {
    "pack": "./bin/self-pack.js"  // 按照了这个包后，就可以用pack这个命令运行，类似于命令行中的webpack
}

// self-pack.js
// 声明这个文件用什么方式运行，比如用node
#! /usr/bin/env node

console.log("pack start");

// link
npm link // 把包链接到全局
```

在需要的项目录下 npm link self-pack 链接上，然后npx pack 就可以得到结果


# loader
loader就是一个函数，输入是对应类型的源码，比如js文件、css文件，然后再导出
```js
function loader(source) {

}

module.exports = loader;
```

## 找到loader的几种方式
1. 绝对路径
```js
{
    test: /\.js$/,
    use: path.resolve(__dirname,'loader', 'loader1.js')
}
```

2. resolveLoader:解析loader时的处理
```js
resolveLoader:{
    // 查找loader的路径范围，如果node_modules没有，则查找当前目录下的loaders目录
    modules: ['node_modules', path.resolve(__dirname,'loaders')],
    alias:{
        'loader1': path.resolve(__dirname, 'loaders', 'loader1')
    }
}

// {
//     test: /\.js$/,
//     use: 'loader1'
// }
```

或者

```js
resolveLoader:{
    // 给loader起别名
    alias:{
        'loader1': path.resolve(__dirname, 'loaders', 'loader1')
    }
}
```

## loader的执行顺序
- 从左到右

```js
{
    test: /\.js$/,
    use: [
        'loader1','loader2','loader3'
    ]
}
```
- 从上到下

```js
{
    test: /\.js$/,
    use: 'loader1'
},
{
    test: /\.js$/,
    use: 'loader2'
},
{
    test: /\.js$/,
    use: 'loader3'
}
```

### 改变顺序
enforce属性
1. pre： 最先执行
2. post：最后执行
3. normal : 默认值
4. inline： 行内loader
5. 整体执行顺序： pre > normal > inline > post

> 每个类别出现多次，则同类别中按照从右到左，从下到上的顺序执行

## inline-loader
```js
// -! 没有pre normal
// ! 没有normal
// !! 什么都没有，只要inlineloader
let a = require('inline-loader!./a.js')
// let a = require('!!inline-loader!./a.js')

// 顺序
// loader1 pre
// loader2 normal
// inline - loader
// loader3 post
```

## loader组成
loader默认由2部分组成，pitch和normal

- pitch loader 无返回值
1. Pitch Loader3 -> Loader2 -> Loader1 
2. resource
3. Normal: Loader1 -> Loader2 -> Loader3

- pitch loader 有返回值
pictch loader2有返回值, 则只执行
1. Pitch Loader3 -> Loader2
2. Normal Loader3

此时资源也不会被打包，起到了中断的作用

## loader的特点
- 最后一个执行的loader要返回js脚本（需要一个String或者Buffer）
- 每个loader只做一件内容，为了使loader在更多场景链式调用
- 每个loader都是一个模块
- 每个loader都是无状态的，确保loader在不同模块转换之间不保存状态

## style-loader
>css文件有空行、空格分隔，可以用JSON.stringify来控制成为一行。

```js
function loader(source) {
    let style=`
        let style = document.createElement('style');
        style.innerHTML = ${JSON.stringify(source)}
        document.head.appendChild(style);
    `
    return style;
}
module.exports = loader;
```

## less-loader
>css中有空行\n，需要replace为\\n
```js
let less = require('less');
function loader(source) {
    let css = '';
    less.render(source,function(err,c){
       css = c.css;
       css = css.replace(/\n/g,'\\n')
    });
    return css;
}

module.exports = loader
```

## babel-loader
```js
let babel = require('@babel/core');
let loaderUtils = require('loader-utils');
function loader(source) {
    // console.log("babel-loader",this);
    console.log(this.resourcePath);
    let options = loaderUtils.getOptions(this); // 获取config中的option值
    // loader的context中自带的方法，用于异步回调
    let cb = this.async();
    babel.transform(source, {
        ...options,
        // config中devtool也需要开启source-map后才能生成
        sourceMap:true,
        // 如果不给sourcemap加名字，默认为unknown
        filename: this.resourcePath.split('/').pop()
    }, function(err,result){
        // console.log(err, result);
        // 错误，转换后的代码，sourceMap
        cb(err, result.code, result.map)
    })
    // console.log(options);
    // return source;
}
module.exports = loader;
```


## file-loader
```js
/**
 * 根据图片生一个新的图片发送到dist目录下
*/
let loaderUtils = require("loader-utils");
function loader(source) {
    // ext:资源的扩展, [hash:8].[ext]:8位hash带后缀名的文件名
    let filename = loaderUtils.interpolateName(this, '[hash:8].[ext]', {content: source}); //文件名模板
    console.log(filename);
    this.emitFile(filename, source); // 发射文件：会生成一个文件
    return `module.exports="${filename}"`
}
loader.raw = true; // 以二进制的方式展示source
module.exports = loader;
```

## url-loader
```js
/**
 * 把符合规则的图片的base64码插入图片
*/
let loaderUtils = require("loader-utils");
let mime = require("mime");
function loader(source) {
    let {limit} = loaderUtils.getOptions(this);
    if(limit && limit > source.length) {
        // 改变为base64
        // data:image/jpg;base64
        return `module.exports = "data:${mime.getType(this.resourcePath)};base64,${source.toString('base64')}"`
    } else {
        return require('./file-loader').call(this, source)
    }
}
loader.raw = true;
module.exports = loader;
```