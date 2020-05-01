(function (modules) {
    // The module cache
  var installedModules = {};
  // The require function
  function __webpack_require__(moduleId) {}
  // 给__webpack_require__添加很多属性和方法
  // expose the modules object (__webpack_modules__)
  __webpack_require__.m = modules;
  // expose the module cache
  __webpack_require__.c = installedModules;
  __webpack_require__.d = function(){}
  //...
  // 执行__webpack_require__，并把入口文件传入
  return __webpack_require__((__webpack_require__.s = "./src/index.js"));
} (
    {
        "./src/a.js": function (module, exports) {
            //...
        },
        "./src/index.js": function (module, exports, __webpack_require__) {
            //...
        }
    }
))