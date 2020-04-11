// 公共的
let N = 23;
let p = 5;

//A
let secret_a = 6;
let A = Math.pow(p, secret_a) % N;
console.log("p:", p, "N", N, "A", A);

// B
let secret_b = 12;
let B = Math.pow(p, secret_b) % N;
console.log("p:", p, "N", N, "B", B);

// 协商密钥, 通过协商密钥进行后续通信
// A
console.log(Math.pow(B, secret_a) % N); // 8
// B
console.log(Math.pow(A, secret_b) % N);
