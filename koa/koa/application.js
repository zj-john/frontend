let http = require('http');
let context = require('./context');
let request = require('./request');
let response = require('./response');

class Koa {
    constructor() {
        this.callbackFn;
        this.middlewares = [];
        this.context = context;
        this.request = request;
        this.response= response;
    };
    use(cb) {
        this.middlewares.push(cb);
    }
    createContext(req, res) {
        let ctx = Object.create(this.context);
        ctx.request  = Object.create(this.request);
        ctx.req = ctx.request.req = req;
        ctx.response  = Object.create(this.response);
        ctx.res = ctx.response.res = res;
        return ctx;
    }

    compose(ctx, middlewares) {
        function dispatch(index) {
            if(index === middlewares.length) return Promise.resolve();
            let middleware = middlewares[index];
            // 递归创建，套起来的promise
            return Promise.resolve(middleware(ctx, ()=>dispatch(index+1)));
        }
        return dispatch(0)
    }
    handleRequest(req, res) {
        res.statusCode = 404;
        let ctx = this.createContext(req, res);
        // this.callbackFn(ctx);
        let composeMiddleware = this.compose(ctx, this.middlewares)
        composeMiddleware.then(()=>{
            let body = ctx.body;
            if(typeof body == undefined) {
                res.end('Not Found')
            } else if (typeof body === 'string'){
                res.end(body)
            }
        })
        
    }
    listen() {
        let server = http.createServer(this.handleRequest.bind(this));
        server.listen(...arguments)
    };
}
module.exports = Koa;