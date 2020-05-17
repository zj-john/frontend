/**
 * 内联插件：把引入的css、js文件变为style、script的内容，放入各自的标签中。统一放到html中
 * 外链变内联
 */
const HtmlWebpackPlugin = require("html-webpack-plugin");
class InlineSourcePlugin {
  constructor({ match }) {
    this.reg = match;
  }

  processTag(tag, compilation) {
    console.log(tag);
    let newTag, url;
    if (tag.tagName == "link" && this.reg.test(tag.attributes.href)) {
      newTag = {
        tagName: "style",
        attributes: {
            type: 'text/css'
        }
      };
      url = tag.attributes.href;
    }
    if (tag.tagName == "script" && this.reg.test(tag.attributes.src)) {
      newTag = {
        tagName: "script",
        attributes: {
            type: 'application/javascript'
        }
      };
      url = tag.attributes.src;
    }
    if (url) {
      newTag.innerHTML = compilation.assets[url].source(); // 获取内容，塞到标签中
      delete compilation.assets[url]; // 删除掉原先要生成的文件
      return newTag;
    }
    return tag;
  }
  processTags(data, compilation) {
    let headTags = [];
    let bodyTags = [];
    data.headTags.forEach((headTag) => {
      headTags.push(this.processTag(headTag, compilation));
    });
    data.bodyTags.forEach((bodyTag) => {
      bodyTags.push(this.processTag(bodyTag, compilation));
    });
    return {
      ...data,
      headTags,
      bodyTags,
    };
  }

  apply(compiler) {
    compiler.hooks.compilation.tap("InlineSourcePlugin", (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
        "AlertPlugin", // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          // console.log(data);
          data = this.processTags(data, compilation); // compilation.assets
          cb(null, data);
        }
      );
    });
  }
}
module.exports = InlineSourcePlugin;
