class AsyncParallelHook {
    constructor(args) {
        this.tasks = [];

    }
    tabPromise(name, task) {
        this.tasks.push(task);
    }
    
    promise(...args) { 
        let taskPromises = this.tasks.map(task=>task(...args));
        return Promise.all(taskPromises);
    }
    
}

let hook = new AsyncParallelHook(['name']);
hook.tabPromise('node', function (name) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('node', name)
            resolve(); // 替换为reject后，则不会出发最后的回调
        }, 2000)
    })
});
hook.tabPromise('react', function (name) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('react', name)
            resolve();
        }, 1000)
    })
});
console.log('------- asyncParallelHook ---------')
hook.promise('john3').then(function () {
    console.log('end');
})