import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser, Fragment } from "prosemirror-model";

class Editor {
  constructor(dom, schema) {
    this.init(dom, schema);
  }
  init(dom, _schema) {
    const schema = new Schema({
      nodes: _schema.nodes,
      marks: _schema.marks,
    });
    // 编辑器的数据结构
    let state = EditorState.create({ schema });
    // 绑定内容到dom
    let view = new EditorView(dom, { state });
  }
}

export default Editor;
