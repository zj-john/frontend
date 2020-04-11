let crypto = require('crypto');

let content = "123456";
// 计算2个content和的hash
let md5Hash = crypto.createHash('md5').update(content).update(content).digest('hex');
console.log('md5Hash', md5Hash, md5Hash.length) // 32位

let salt = '1234';
let sha1Hash = crypto.createHmac('sha256', salt).update(content).update(content).digest('hex');
console.log('sha1Hash', sha1Hash, sha1Hash.length)  // 64位
