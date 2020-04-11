let { generateKeyPairSync, privateEncrypt, publicDecrypt} = require('crypto');

// 生成一个公钥、私钥对
let rsa = generateKeyPairSync("rsa",{
    modulusLength: 1024,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem' // base64格式的私钥
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: 'passphrase'
    }
})

let message = "hello";
let encryptedMessage = privateEncrypt({
    // 指定密钥
    key: rsa.privateKey,
    // 指定密码 
    passphrase: "passphrase"
}, Buffer.from(message, 'utf8'));
console.log("encryptedMessage",encryptedMessage);

let decryptedMessage = publicDecrypt(rsa.publicKey, encryptedMessage);
console.log("decryptedMessage",decryptedMessage.toString('utf8'));