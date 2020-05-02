require('@babel/polyfill')
// var a = require('./a.js')
var b = require('./jq.js')
var pic = require('./pic.js')
// console.log("a：",a);
console.log("Hello");

require('./index.css')
require('./b.less')

const fn = () => {
    console.log('arrow function');
}
fn();

@log
class A {
    a = 1;
}
console.log("class",new A()['a'])

function log(target) {
    console.log("decorator:", target);
}

const str = "abc"
// includes语法需要polifill
console.log("includes", str.includes("a"))