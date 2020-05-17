/**
 * 异步插件
*/
class AsyncPlugin {
    apply(compiler) {
        console.log(2)
        // 利用hook把不同的处理函数放入，通过流处理的方式执行
        compiler.hooks.emit.tapAsync('AsyncPlugin', (compilation, cb)=>{
            setTimeout(()=>{
                console.log('wait 1s');
                cb();
            }, 1000)
        })

        compiler.hooks.emit.tapPromise('AsyncPlugin', (compilation)=>{
            return new Promise((resolve, reject)=>{
                setTimeout(()=>{
                    console.log('wait promise 1s');
                    resolve();
                }, 1000)
            })
        })
    }
}
module.exports = AsyncPlugin;