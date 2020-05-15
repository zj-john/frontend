// console.log("index");
// -! 没有pre normal
// ! 没有normal
// !! 什么都没有，只要inlineloader
// let a = require('inline-loader!./a.js')

// class Test {
//     constructor() {
//         console.log("test init")
//     }
// }

// let test = new Test();

import pic from './animal.jpg'
let img = document.createElement('img');
img.src = pic;
document.body.appendChild(img);