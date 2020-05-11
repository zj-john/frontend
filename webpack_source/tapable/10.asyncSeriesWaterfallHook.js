class AsyncSeriesHook {
    constructor(args) {
        this.tasks = [];

    }
    tapAsync(name, task) {
        this.tasks.push(task);
    }
    // call方法用下述方法替代了，为了书写方便
    callAsync(...args) { }
    asyncSeriesWaterfallHook(...args) {
        let finalCallback = args.pop();
        let index = 0;
        let next = (err, data) => {
            let task = this.tasks[index];
            if (!task) return finalCallback();
            if (index == 0) {
                task(...args, next)
            } else {
                task(data, next)
            }
            index++;
        }
        next();
    }
}

let hook = new AsyncSeriesHook(['name']);
hook.tapAsync('node', function (name, cb) {
    setTimeout(() => {
        console.log('node', name);
        cb('error', 'next');  // 官方包中，如果第一个参数为null，才继续向下执行，否则直接跳到最后一个callback
    }, 2000)
})
hook.tapAsync('react', function (name, cb) {
    setTimeout(() => {
        console.log('react', name);
        cb();
    }, 1000)
})
console.log('------- AsyncSeriesHook ---------')
hook.asyncSeriesWaterfallHook('john3', function () {
    console.log('end');
})