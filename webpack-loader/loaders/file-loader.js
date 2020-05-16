function loader(source) {
    console.log(source);
    return source;
}
loader.raw = true; // 把2进制数据传过来
module.exports = loader;