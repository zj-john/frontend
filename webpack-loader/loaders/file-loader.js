/**
 * 根据图片生一个新的图片发送到dist目录下
*/
let loaderUtils = require("loader-utils");
function loader(source) {
    // ext:资源的扩展, [hash:8].[ext]:8位hash带后缀名的文件名
    let filename = loaderUtils.interpolateName(this, '[hash:8].[ext]', {content: source}); //文件名模板
    console.log(filename);
    this.emitFile(filename, source); // 发射文件：会生成一个文件
    return `module.exports="${filename}"`
}
loader.raw = true; // 以二进制的方式展示source
module.exports = loader;