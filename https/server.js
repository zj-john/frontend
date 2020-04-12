let http = require('http');

http.createServer((req,res)=>{
    let buffer = Buffer.from("hello");
    console.log(buffer) // 抓包看得到，明文传输
    res.end(buffer);
}).listen(8090, ()=>{
    console.log("Server run at 8090");
})