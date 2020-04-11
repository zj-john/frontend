// 移位加密
let sercret = 3;
function encrypt(message) {
  let buffer = Buffer.from(message);
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = buffer[i] + sercret;
  }
  return buffer.toString();
}

function decrypt(message) {
  let buffer = Buffer.from(message);
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = buffer[i] - sercret;
  }
  return buffer.toString();
}

let message = "abc";
let encryptMessage = encrypt(message);
console.log("encryptMessage", encryptMessage);
let decryptMessage = decrypt(encryptMessage);
console.log("decryptMessage", decryptMessage);
