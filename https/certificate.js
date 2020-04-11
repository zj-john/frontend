let { generateKeyPairSync, createHash, createVerify, createSign } = require("crypto");

let serverRsa = generateKeyPairSync("rsa", {
  modulusLength: 1024,
  publicKeyEncoding: {
    type: "spki",
    format: "pem", // base64格式的私钥
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
    cipher: "aes-256-cbc",
    passphrase: "passphrase", // 私钥密码 更安全
  },
});

let caRsa = generateKeyPairSync("rsa", {
    modulusLength: 1024,
    publicKeyEncoding: {
      type: "spki",
      format: "pem", // base64格式的私钥
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: "passphrase", // 私钥密码 更安全
    },
  });

const info = {
    domain: 'http://mysite.com',
    publicKey: serverRsa.publicKey
}
// 把上面的申请信息发送给CA机构请求颁发证书
// 实现的时候签名的并不是info，而是它的hash
let hash = createHash('sha256').update(JSON.stringify(info)).digest('hex');

let sign = getSign(hash, caRsa.privateKey, "passphrase")
let cert = {
    info, sign // CA的签名
}  // 这就是证书，验证证书后，取出公钥

let valid = verifySign(hash, sign, caRsa.publicKey)
console.log("验证CA签名：",valid);

function getSign(content, privateKey, passphrase) {
    let signObj = createSign("RSA-SHA256");
    // 放入文件内容
    signObj.update(content);
    // 用rsa私钥签名，输出一个16位的字符串
    return signObj.sign(
      { key: privateKey, format: "pem", passphrase},
      "hex"
    );
}

function verifySign(content, sign, publicKey) {
    var verifyObj = createVerify("RSA-SHA256");
    verifyObj.update(content);
    return verifyObj.verify(publicKey, sign, 'hex')
}