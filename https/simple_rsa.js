
/* 
RSA非对称加密算法
加密用的密钥和解密用的密钥不一样
它们有关系，但是不能通过公钥算出密钥
2个质数相乘一个结果，正向乘很容易，但是倒推出质数很难（当这个数特别大） 
*/

let p = 3, q =11;
let N = p * q; //33
let fN = (p-1) * (q-1);  // 欧拉函数
let e = 7;  //随意挑一个质数e

//{e, N} 就成为公钥，可以发给任何人,公开的
// 公钥和私钥是一对，公钥加密的数据要私钥解密 私钥加密的数据要公钥解密
// 我们可以从公钥去推算私钥，但是前提是你得知道fN
// e * d % fN == 1 说明是我们要找的密钥

for(var d=1; e*d%fN !==1; d++) {}

let publicKey = {e, N};
let privateKey = {d, N}
console.log(d);

let data = 5;
let c = Math.pow(data, e) % N;  // 加密
console.log('c', c);
let original = Math.pow(c,d)%N;  // 知道d就可以解密，知道fN就可以知道d
console.log(original);
