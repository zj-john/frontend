// import "./example";
import "./myEditor";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";

// import {addListNodes} from "prosemirror-schema-list"
// import {exampleSetup} from "prosemirror-example-setup"

import { undo, redo, history } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
// const mySchema = new Schema({
//   nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
//   marks: schema.spec.marks
// })

// window.view = new EditorView(document.querySelector("#editor"), {
//   state: EditorState.create({
//     doc: DOMParser.fromSchema(mySchema).parse(document.querySelector("#content")),
//     plugins: exampleSetup({schema: mySchema})
//   })
// })

// const editorDom = document.querySelector("#myEditor");

// step1: 最简单编辑器，没有对事务的反馈，没有工具栏
// 编辑器的数据结构
// let state = EditorState.create({schema})
// 绑定内容到dom
// let view = new EditorView(editorDom, {state})

// step2: 添加事务
// let state = EditorState.create({schema})
// let view = new EditorView(editorDom, {
//     state,
//     // 类似于redux的方式，利用dispatch分发新的状态，做处理
//     dispatchTransaction(transaction) {
//         console.log("Document size went from", transaction.before.content.size, "to", transaction.doc.content.size);
//         let newState = view.state.apply(transaction)
//         // 更新到view
//         view.updateState(newState);
//     }
// })

// step3: 添加plugins
// import {undo, redo, history} from "prosemirror-history"
// import {keymap} from "prosemirror-keymap"
// let state = EditorState.create({
//     schema,
//     plugins: [ // 添加插件处理，有点类似于webpack config的方式。 ？插件的执行顺序？
//         history(), // ？如何储存？
//         // 关联命令到指定键
//         keymap({"Mod-z":undo, "Mod-y": redo})
//     ]
// })
// let view = new EditorView(editorDom, {state})

// step4: 添加常用命令Commands
// import {baseKeymap} from "prosemirror-commands"
// let state = EditorState.create({
//     schema,
//     plugins: [
//         history(),
//         keymap({"Mod-z":undo, "Mod-y":redo}),
//         // 提供了一些基础的命令，比如回车
//         keymap(baseKeymap)
//     ]
// })
// let view = new EditorView(editorDom, {state});

// step5: 通过内容content生成scheme
// import {DOMParser} from "prosemirror-model"
// 把一个已有内容的dom 作为初始文档，scheme从文档中获取
// let content = document.getElementById("content");
// let state = EditorState.create({
//     doc: DOMParser.fromSchema(schema).parse(content)
// })
// console.log(state);
// let view = new EditorView(editorDom, {state});