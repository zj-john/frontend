let context = {
};
function defineGetter(property, name) {
    // 自定义获取器
    context.__defineGetter__(name, function(){
        return this[property][name]
    })
}
function defineSetter(property, name) {
    // 自定义获取器
    context.__defineSetter__(name, function(value){
        this[property][name] = value;
    })
}
defineGetter('request', 'url')
defineGetter('request', 'path')
defineGetter('response', 'body')
defineSetter('response', 'body')
module.exports = context;