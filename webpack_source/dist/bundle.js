(function (modules) { // webpackBootstrap
    // The module cache
    var installedModules = {};
    // The require function
    function __webpack_require__(moduleId) {
      // Check if module is in cache
      if (installedModules[moduleId]) {
        return installedModules[moduleId].exports;
      }
      // Create a new module (and put it into the cache)
      var module = installedModules[moduleId] = {
        i: moduleId,
        l: false,
        exports: {}
      };
      // Execute the module function
      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      // Flag the module as loaded
      module.l = true;
      // Return the exports of the module
      return module.exports; 
    }
    // Load entry module and return exports
    return __webpack_require__(__webpack_require__.s = "src\index.js");
  })
    ({
    
      "src\index.js":
        (function (module, exports, __webpack_require__) {
          eval(`let a = __webpack_require__("./src\\a.js");

__webpack_require__("./src\\index.less");

console.log(a);`);
        }),
        
      "src\a.js":
        (function (module, exports, __webpack_require__) {
          eval(`let b = __webpack_require__("./src\\base\\b.js");

module.exports = 'a' + b;`);
        }),
        
      "src\base\b.js":
        (function (module, exports, __webpack_require__) {
          eval(`module.exports = 'b';`);
        }),
        
      "src\index.less":
        (function (module, exports, __webpack_require__) {
          eval(`let style = document.createElement('style');
style.innerHTML = "body {\n  background-color: red;\n}\nbody div {\n  width: 100px;\n  height: 100px;\n  background-color: yellowgreen;\n}\n";
document.head.appendChild(style);`);
        }),
          
    });