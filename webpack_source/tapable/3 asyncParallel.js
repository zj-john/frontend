let { AsyncParallelHook, SyncBailHook, SyncWaterfallHook, SyncLoopHook } = require('tapable')

class Lesson {
    constructor() {
        this.hooks = {
            arch: new AsyncParallelHook(['name']),
        }
    }
    tap() { //注册监听函数
        this.hooks.arch.tapAsync('node', function(name,cb){
            setTimeout(()=>{
                console.log('node', name);
                cb();
            }, 2000)
            
        })
        this.hooks.arch.tapAsync('react', function(name, cb){
            setTimeout(()=>{
                console.log('react', name);
                cb();
            }, 1000)           
        })
    }
    start() {
        this.hooks.arch.callAsync('john',()=>{
            console.log('end');
        })
    }
}

let l = new Lesson();
l.tap();
l.start(); // 启动钩子