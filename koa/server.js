let Koa = require('./koa/application.js');
let app = new Koa();

// app.user((ctx)=>{
//     // req.path koa封转的属性，可以看出区分
//     console.log(ctx.req.url);  // ctx.req == 原生req
//     console.log(ctx.request.url);  // ctx.request 是koa封转的属性
//     console.log(ctx.request.req.url); // ctx.request.req == 原生req
//     console.log(ctx.url);  // 用ctx代理一下ctx.request属性
// })
let log = () => {
    return new Promise((resolve)=>{
        setTimeout(()=>{
            console.log("ok");
            resolve();
        }, 1000)
    })
}

app.use(async (ctx, next) =>{
    console.log('url',ctx.req.url);
    console.log('path',ctx.request.path);
    console.log(1);    
    await next();
    console.log(2)
    // console.log(ctx.response.body);
    // ctx.body = 'hello';
});

app.use(async (ctx, next)=>{
    console.log(3);
    await log();
    await next();
    console.log(4);
})

app.use(async (ctx, next)=>{
    console.log(5);
    await next();
    ctx.body = 'hello';
    console.log(6);
})

app.listen(3002);