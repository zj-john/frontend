/**
 * 生成一个新文件，存放webpack打包的文件列表
*/
class FileListPlugin {
    constructor({filename}) {
        // console.log(filename);
        this.filename = filename;
    }
    apply(compiler) {
        compiler.hooks.emit.tap('FileListPlugin', (compilation)=>{
            // compilation.assets:所有的资源
            // {
            //     'bundle.js': CachedSource {
            //       _source: ConcatSource { children: [Array] },
            //       _cachedSource: undefined,
            //       _cachedSize: undefined,
            //       _cachedMaps: {},
            //       node: [Function],
            //       listMap: [Function]
            //     },
            //     'index.html': { source: [Function: source], size: [Function: size] }
            //   }
            // console.log(compilation.assets);
            let assets = compilation.assets;
            let content = `## 文件名   资源大小(字节)  \r\n`;
            Object.entries(assets).forEach(([filename, stat])=>{
                content += `- ${filename}   ${stat.size()}  \r\n`
            })
            assets[this.filename] = {
                source(){
                    return content;
                },
                size(){
                    return content.length;
                }
            }
        })
    }
}
module.exports = FileListPlugin;