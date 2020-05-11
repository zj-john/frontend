class AsyncParallelHook {
    constructor(args) {
        this.tasks = [];

    }
    tapAsync(name, task) {
        this.tasks.push(task);
    }
    // call方法用下述方法替代了，为了书写方便
    callAsync(...args) {}
    asyncParallelHook(...args) {
        let finalCallback = args.pop(); // 最后一个参数是回调
        let index = 0;
        let done = () => {
            index++
            if(index == this.tasks.length) {
                finalCallback()
            }
        }
        this.tasks.forEach(task => {
            task(...args,done);
        })
    }
}

let hook = new AsyncParallelHook(['name']);
hook.tapAsync('node', function (name,cb) {
    setTimeout(()=>{
        console.log('node', name);
        cb();
    }, 2000)
})
hook.tapAsync('react', function (name,cb) {
    setTimeout(()=>{
        console.log('react', name);
        cb();
    }, 1000)
})
console.log('------- asyncParallelHook ---------')
hook.asyncParallelHook('john3', function(){
    console.log('end');
})