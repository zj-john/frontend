/**
 * 处理css中url()的情况，把引用转换为require的引用
*/
function loader(source) {
    // ? 懒惰模式 尽可能少的匹配
    let reg = /url\((.+?)\)/g
    let pos = 0;
    let current;
    // 字符串拼接
    let arr = ['let list = []'];
    while(current = reg.exec(source)) {  
        // matchUrl, url : "url('./pic.jpg')"  "'./pic.jpg'", 
        let [matchUrl, url] = current;
        console.log(matchUrl,url);
        let last = reg.lastIndex -  matchUrl.length;
        arr.push(`list.push(${JSON.stringify(source.slice(pos, last))})`)
        pos = reg.lastIndex;
        arr.push(`list.push('url('+ require(${url}) +')')`)
    }
    arr.push(`list.push(${JSON.stringify(source.slice(pos))})`);
    arr.push('module.exports=list.join("")')
    // console.log(arr, arr.join(''));
    return arr.join('\r\n');
}

module.exports = loader;