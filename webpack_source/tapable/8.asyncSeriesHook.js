class AsyncSeriesHook {
    constructor(args) {
        this.tasks = [];

    }
    tapAsync(name, task) {
        this.tasks.push(task);
    }
    // call方法用下述方法替代了，为了书写方便
    callAsync(...args) {}
    asyncSeriesHook(...args) {
        let finalCallback = args.pop();
        let index = 0;
        // let next = () => {
        //     if(index == this.tasks.length-1) {
        //         return finalCallback();
        //     }
        //     return this.tasks[++index](...args, next)
        // }        
        // this.tasks[index](...args, next)

        let next = () => {
            if(this.tasks.length == index) return finalCallback();
            let task = this.tasks[index++];
            task(...args,next);
        }
        next();
    }
}

let hook = new AsyncSeriesHook(['name']);
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
console.log('------- AsyncSeriesHook ---------')
hook.asyncSeriesHook('john3', function(){
    console.log('end');
})