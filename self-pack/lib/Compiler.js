let path = require('path');
let fs = require('fs');
let babylon = require('babylon');
let traverse = require('@babel/traverse').default;
let t = require('@babel/types');
let generator = require('@babel/generator').default;
let ejs = require('ejs');
let { SyncHook } = require('tapable');

// 需要用到的模块
// babylon 把源码转换为ast
// @babel/traverse 遍历节点
// @babel/types  把节点替换
// @babel/generator  替换好的节点生成

class Compiler{
    constructor(config) {
        // entry output
        this.config = config;
        // 需要保存入口文件路径
        this.entryId;
        // 需要保存所有的模块依赖
        this.modules = {};
        this.entry = config.entry; //入口路径
        this.root = process.cwd(); // 工作路径，运行npx的路径
        // 定义各个周期的hook
        this.hooks = {
            entryOptions: new SyncHook(),
            compiler: new SyncHook(),
            afterCompiler: new SyncHook(),
            afterPlugins: new SyncHook(),
            run: new SyncHook(),
            emit: new SyncHook(),
            done: new SyncHook()
        };
        let plugins = this.config.plugins;
        if(Array.isArray(plugins)) {
            plugins.forEach(plugin => {
                plugin.apply(this);
            })
        }
        this.hooks.afterPlugins.call();
    }
    getSource(modulePath) {
        let content = fs.readFileSync(modulePath,'utf8');
        // 匹配loader
        let rules = this.config.module.rules;
        for(let i=0; i < rules.length; i++) {
            let rule = rules[i];
            let { test, use } = rule;
            let len = use.length - 1;
            // 这里的执行结果最终会别转换为ast，所以最后一定要处理为js代码，否则ast转化时报错
            if(test.test(modulePath)) {
                function normalLoader() {
                    // console.log(len);
                    // 从最后一个loader开始执行，自下向上
                    let loader = require(use[len--]);
                    content = loader(content);
                    if(len>=0) {
                        normalLoader();
                    }
                }
                normalLoader();                
            }
        }
        return content;
    }
    // 解析源码
    parse(source, parentPath) {
        // console.log("source", source);
        // console.log("parentSource", parentPath);
        // astexplorer.net
        let ast = babylon.parse(source);
        // console.log("ast", ast);
        let dependencies = [];
        // require(./a.js) 匹配require 匹配./a.js 然后替换
        traverse(ast, {
            CallExpression(p) {  // 调用表达式 a() require()
                let node = p.node;
                // console.log(node);
                if(node.callee.name === 'require') {
                    node.callee.name = '__webpack_require__';
                    let moduleName = node.arguments[0].value; // 取到引用名字
                    moduleName = moduleName + (path.extname(moduleName)?'':'.js') //a.js
                    // windows下 \ linux下 /
                    moduleName = './' + path.join(parentPath, moduleName); // ./src/a.js
                    // console.log(moduleName);
                    dependencies.push(moduleName);
                    node.arguments = [t.stringLiteral(moduleName)];
                }
            }
        });
        let sourceCode = generator(ast).code;
        // console.log(sourceCode);
        return {sourceCode, dependencies}

    }
    buildModule(modulePath, isEntry) {
        // 拿到模块的内容 
        let source = this.getSource(modulePath);
        // 模块id : modulePath - this.root
        let moduleName = './' + path.relative(this.root,modulePath); // 根据相对路径差获取name
        // console.log("source",source);
        console.log("moduleName", moduleName);
        /**
         * 需要把./a.js 替换为 ./src/a.js;需要把require替换为自己的require函数
         * source let a = require('./a.js')
           console.log(a)
           moduleName src\index.js
         */
        if(isEntry) {
            this.entryId = moduleName;
        }
        // 解析需要把source源码进行改造，返回一个依赖列表
        let {sourceCode, dependencies} = this.parse(source, path.dirname(moduleName));
        // 把相对路径和模块中的内容对应起来
        this.modules[moduleName] = sourceCode;
        // console.log(source, dependencies);
        // console.log(sourceCode);

        dependencies.forEach(dep => { // 附模块的递归加载
            this.buildModule(path.join(this.root, dep), false);
        })
    }
    emitFile() {
        // 用数据渲染出最后的js
        // 获取输出目录
        let main = path.join(this.config.output.path, this.config.output.filename)
        // ejs
        let templateStr = this.getSource(path.join(__dirname, 'main.ejs'));
        // console.log(templateStr);
        let code = ejs.render(templateStr, {entryId:this.entryId, modules: this.modules});
        this.assets = {};
        this.assets[main] = code;
        // console.log(main, code);
        fs.writeFileSync(main,this.assets[main])
    }

    run() {
        this.hooks.run.call();
        this.hooks.compiler.call();
        // 创建模块的依赖关系
        this.buildModule(path.resolve(this.root, this.entry), true);
        // console.log(this.modules, this.entryId);
        this.hooks.afterCompiler.call();        
        // 发射一个文件，打包后的文件
        this.emitFile();
        this.hooks.emit.call();
        this.hooks.done.call();
    }
}

module.exports = Compiler;