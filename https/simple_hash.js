/*
1. 不同输入不同输出
2. 不能从hash反推
3. 长度固定 
 */

function hash(num) {
    return (num%1024+"").padStart(4, '0');
}

console.log(hash(1));
console.log(hash(123));
console.log(hash(1025));