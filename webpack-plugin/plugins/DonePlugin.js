/**
 * 同步插件
*/
class DonePlugin {
    apply(compiler) {
        console.log(1)
        compiler.hooks.done.tap('DonePlugin', (stats)=>{
            console.log('compiler done');
        })
    }
}
module.exports = DonePlugin;