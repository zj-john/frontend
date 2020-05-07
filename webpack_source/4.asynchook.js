class AsyncParallelHook {
    constructor(args) {
        this.tasks = [];

    }
    tapAsync(name, task) {
        this.tasks.push(task);
    }
    asyncParallelHook(...args) {
        this.tasks.forEach(task => {
            // task.call(null,...args);
            task(...args);
        })
    }
    syncBailHook(...args) {
        let index = 0;
        let ret;
        do {
            ret = this.tasks[index++](...args);
        } while (ret === undefined && index < this.tasks.length)

    }
    syncWaterfallHook(...args) {
        let [first,...others] = this.tasks;
        let ret = first(...args);
        others.reduce((a,b)=>{
            return b(a)
        },ret)
        // this.tasks.reduce((a, b) => {
        //     return b(a);
        // }, ...args)
    }
    syncLoopHook(...args) {
        this.tasks.forEach((task)=>{
            let ret;
            do {
                ret = task(...args);
            } while(ret !== undefined)
        })
    }
}

let hook = new SyncHook(['name']);
let i = 0;
hook.tap('node', function (name) {
    console.log('node', name);
    // return i++ == 3?undefined:i    
    return undefined
})
hook.tap('react', function (name) {
    console.log('react', name);
    return 'react is ok'
})
hook.tap('vue', function (name) {
    console.log('vue', name);
})
console.log('------- syncHook ---------')
hook.syncHook('john2')
// console.log('------- syncBailHook ---------')
// hook.syncBailHook('john2')
// console.log('------- syncWaterfallHook ---------')
// hook.syncWaterfallHook('john2')
// console.log('------- syncLoopHook ---------')
// hook.syncLoopHook('john2')