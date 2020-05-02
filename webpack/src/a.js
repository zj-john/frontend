// 会产生混用的问题
// start
// var str = "hello a";

// function * gen(){
//     yield 1;
// }
// console.log(gen().next());

// module.exports = str;
// end

var str = "hello a";

function * gen(){
    yield 1;
}
console.log(gen().next());

export default str;