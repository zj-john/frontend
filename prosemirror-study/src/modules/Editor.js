import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser, Fragment } from "prosemirror-model";

class Editor {
  constructor(dom, schema) {
    this.init(dom, schema);
  }
  getView = ()=>{
    return this.view;
  }
  getScheme = () =>{
      return this.schema;
  }

  init(dom, _schema) {
    const schema = new Schema({
      nodes: _schema.nodes,
      marks: _schema.marks,
    });
    this.schema = schema;
    // 编辑器的数据结构
    let state = EditorState.create({ schema });
    // 绑定内容到dom
    this.view = new EditorView(dom, { state });
  }
}

export default Editor;
