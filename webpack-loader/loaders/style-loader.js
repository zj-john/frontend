let loaderUtils = require("loader-utils");
function loader(source) {
  let style = `
        let style = document.createElement('style');
        style.innerHTML = ${JSON.stringify(source)}
        document.head.appendChild(style);
    `;
  return style;
}
// style-loader处理剩下的请求
// style-loader less-loader!css-loader/./index.less
// !! 内联loader用法 不再使用其它webpack.config中的loader，否则死循环了
// require路径， 返回的就是css-loader处理好的结果 require('!!css-loader!less-loader!index.less')
loader.pitch = function (remainingRequest) {
  //remainingRequest: I:\github\frontend\webpack-loader\loaders\css-loader.js!I:\github\frontend\webpack-loader\loaders\less-loader.js!I:\github\frontend\webpack-loader\src\index.less
  // console.log(remainingRequest);

  // loaderUtils.stringifyRequest把绝对路径处理为相对路径:"!!../loaders/css-loader.js!../loaders/less-loader.js!./index.less"
  // console.log(loaderUtils.stringifyRequest(this, "!!" + remainingRequest));

  // require处理了css-loader中export的内容
  let style = `
    let style = document.createElement('style');
    style.innerHTML = require(${loaderUtils.stringifyRequest(
      this,
      "!!" + remainingRequest
    )});
    document.head.appendChild(style);
`;
  return style;
};
module.exports = loader;
