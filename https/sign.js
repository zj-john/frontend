let { generateKeyPairSync, createSign, createVerify } = require("crypto");

let rsa = generateKeyPairSync("rsa", {
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
let file = "file";
// 先创建签名对象
let signObj = createSign("RSA-SHA256");
// 放入文件内容
signObj.update(file);
// 用rsa私钥签名，输出一个16位的字符串
let sign = signObj.sign(
  { key: rsa.privateKey, format: "pem", passphrase: "passphrase" },
  "hex"
);
console.log(sign);

// 创建验证签名对象
let verifyObj = createVerify("RSA-SHA256");
// 放入文件内容
verifyObj.update(file);
// 验证签名是否合法: 先拿到文件file，然后用publicKey计算签名sign，如果和对方的sign匹配，则验证通过
let isVaid = verifyObj.verify(rsa.publicKey, sign, "hex");
console.log(isVaid);
