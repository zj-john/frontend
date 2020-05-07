// import calc from "./utils.js";
// import './a.js';
// import './b.js';
// import $ from 'jquery'
// console.log(calc.sum(1, 2));
// console.log($);
// let a = 1;
// let b = 2;
// let c = a + b;
// console.log(c, "------");

// const btn = document.createElement('button');
// btn.innerHTML = "click"
// document.body.appendChild(btn);
// btn.addEventListener('click', function(){
//     import('./c.js').then(data=>{
//         console.log(data);
//     })
//     console.log("click");
// })


import c from './c.js';
console.log(c);
if(module.hot) {
    module.hot.accept('./c.js', ()=>{
        console.log("更新了");
        let c = require('./c.js')
        console.log(c);
        
    })
}