let babel = require('@babel/core');
let loaderUtils = require('loader-utils');
function loader(source) {
    // console.log("babel-loader",this);
    console.log(this.resourcePath);
    let options = loaderUtils.getOptions(this); // 获取config中的option值
    // loader的context中自带的方法，用于异步回调
    let cb = this.async();
    babel.transform(source, {
        ...options,
        // config中devtool也需要开启source-map后才能生成
        sourceMap:true,
        // 如果不给sourcemap加名字，默认为unknown
        filename: this.resourcePath.split('/').pop()
    }, function(err,result){
        // console.log(err, result);
        // 错误，转换后的代码，sourceMap
        cb(err, result.code, result.map)
    })
    // console.log(options);
    // return source;
}
module.exports = loader;