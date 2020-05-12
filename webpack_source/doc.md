
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