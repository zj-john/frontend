class AsyncSerieslHook {
    constructor(args) {
        this.tasks = [];

    }
    tabPromise(name, task) {
        this.tasks.push(task);
    }

    promise(...args) {
        let [first, ...others] = this.tasks;
        return others.reduce((c, n) => { // redux源码
            return c.then(() => n(...args));
        }, first(...args))
    }

}

let hook = new AsyncSerieslHook(['name']);
hook.tabPromise('node', function (name) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('node', name)
            resolve();
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
console.log('------- AsyncSerieslHook ---------')
hook.promise('john3').then(function () {
    console.log('end');
})