let { AsyncParallelHook, SyncBailHook, SyncWaterfallHook, SyncLoopHook } = require('tapable')

class Lesson {
    constructor() {
        this.hooks = {
            arch: new AsyncParallelHook(['name']),
        }
    }
    tap() { //注册监听函数
        this.hooks.arch.tapPromise('node', function(name,cb){
            return new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    console.log('node', name)
                    resolve();
                }, 2000)
            })
        })
        this.hooks.arch.tapPromise('react', function(name){
            return new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    console.log('react', name)
                    resolve();
                }, 2000)
            })      
        })
    }
    start() {
        this.hooks.arch.promise('john').then(()=>{
            console.log('end');
        })
    }
}

let l = new Lesson();
l.tap();
l.start(); // 启动钩子