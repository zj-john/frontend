let crypto = require('crypto');
function encrypt(data, key, lv) {
    let cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    cipher.update(data);
    return cipher.final('hex'); // 把结果输出成16进制的字符串
}

function decrypt(data, key, iv) {
    let cipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    cipher.update(data, 'hex'); // 添加hex ,16进制的字符串数据
    return cipher.final('utf8')  // 输出为utf8
}

let key = '1234567890123456';
let iv = '1234567890123456';
let data = 'hello';
let encryptData = encrypt(data, key, iv);
console.log(encryptData);
let decryptData = decrypt(encryptData, key, iv);
console.log(decryptData);