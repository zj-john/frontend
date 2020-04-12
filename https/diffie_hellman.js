let  {createDiffieHellman} = require('crypto');
// 客户端
let client = createDiffieHellman(512); // 长度
let clientKeys = client.generateKeys();

// 公共的  p N
let prime = client.getPrime();
let generator = client.getGenerator();

// 服务端
let server = createDiffieHellman(prime,generator)
let serverKeys = server.generateKeys();

let client_secret = client.computeSecret(serverKeys);
let server_secret = server.computeSecret(clientKeys);

// 协商的密钥
console.log(client_secret.toString('hex'));  //128位
console.log(server_secret.toString('hex'));