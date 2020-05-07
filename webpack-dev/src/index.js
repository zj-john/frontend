import 'bootstrap'
import './style'
// import 'bootstrap/dist/css/bootstrap.css'
console.log('index.js');

console.log("ENV",ENV);
console.log("FLAG TYPE",typeof FLAG);
console.log("EXPRESSION", EXPRESSION);

// const a = "str"
// a.has('s')
// console.log("end");


const xhr =  new XMLHttpRequest();

// 发送到localhost:8080，然后转发给server(3000端口)
xhr.open("GET", '/api/user', true)

xhr.send();

xhr.onload = function (data) {
    console.log(data.currentTarget.response);
};