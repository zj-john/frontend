/**
 * 把符合规则的图片的base64码插入图片
*/
let loaderUtils = require("loader-utils");
let mime = require("mime");
function loader(source) {
    let {limit} = loaderUtils.getOptions(this);
    if(limit && limit > source.length) {
        // 改变为base64
        // data:image/jpg;base64
        return `module.exports = "data:${mime.getType(this.resourcePath)};base64,${source.toString('base64')}"`
    } else {
        return require('./file-loader').call(this, source)
    }
}
loader.raw = true;
module.exports = loader;