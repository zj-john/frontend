let loaderUtils = require('loader-utils');
let validate = require('schema-utils');
let fs = require('fs');

function loader(source){
    let options = loaderUtils.getOptions(this);
    // 一般这么写，启用缓存
    this.cacheable && this.cacheable();
    // console.log(this);
    // 禁用缓存
    // this.cacheable(false);
    let cb = this.async(); 
    // 约定格式规范
    let schema = {
        type:'object',
        properties:{
            text: {
                type: 'string'
            },
            filename: {
                type: 'string'
            }
        }
    };
    validate(schema, options, 'banner-loader');
    // console.log("source",source);
    if(options.filename) {
        // 加入watch的范围
        this.addDependency(options.filename);
        fs.readFile(options.filename, 'utf8', function(err, data){
            // source是原始数据
            cb(err, `/**${data}**/${source}`)
        })
    } else {
        cb(null, `/**${options.text}**/${source}`)
    }

    return source;
}
module.exports = loader