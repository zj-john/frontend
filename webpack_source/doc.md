
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
    - SyncBailHook：保险同步钩子，当上一个task的返回为undefined时才继续向下执行，可以随时停止
    - SyncWaterfallHook：瀑布同步钩子，上一个task的返回是下一个task的传参
    - SyncLoopHook：循环同步钩子，上一个钩子的返回值不是undefined时，循环执行
- Async* : 异步钩子，分为2种，串行执行和并行执行
    - AsyncParallel*
        - AsyncParallelHook
        - AsyncParallelBailHook
    - AsyncSeries*
        - AsyncSeriesHook
        - AsyncSeriesBailHook
        - AsyncSeriesWaterfallHook


添加钩子的方法
- tap： 添加同步钩子
- tabSync: 添加异步钩子

执行
- call: 同步
- callAsync：异步