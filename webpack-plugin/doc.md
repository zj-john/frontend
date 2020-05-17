# webpack plugin

webpack通过plugins实现各种功能，开发者通过插件引入它们自己的行为到webpack的构建过程中。

# webpack流程


# 加载插件的对象

## Compiler编译对象

部分钩子
- run 开始运行
- compile 开始编译
- compilation 创建编译对象
- make 创建模块对象
- emit 发射文件
- done 完成

## Compilation 资源构建
部分钩子
- buildModule 创建模块
- normalModuleLoader 普通模块加载
- succeedModule 模块加载完成
- finishModules 所依赖的所有模块完成
- seal 封装 整理代码
- optimize 优化
- after-seal 封装后

## ModuleFactory模块处理
部分钩子
- beforeResolver 解析前
- afterResolver 解析后
- parser 解析

## Module模块

## Parser解析 
部分钩子
- program 开始遍历
- statement 语句
- call 调用
- expression 处理表达式

## Template模板
部分钩子
- hash 处理hash
- bootstrap 启动
- localVars 变量
- render 渲染

> 在插件开发中，最重要的2个资源是compiler和compilation对象，compiler对象代表了完整的webpack环境配置。compilation对象代表了一次资源版本的构建。