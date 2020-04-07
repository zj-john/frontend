const url = require('url')
let request = {
    get url() {
        return this.req.url
    },
    get path() {
        return url.parse(this.req.url).pathname;
    }
};
// console.log(request.url);
module.exports = request;