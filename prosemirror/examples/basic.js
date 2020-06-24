import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { exampleSetup } from "prosemirror-example-setup";

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const name = "basic";
const editorDom = document.querySelector(`#demo #${name} .editor`);
const contentDom = document.querySelector(`#demo #${name} .content`);

const nodes = {
  doc: { content: "block+" },
  paragraph: { group: "block", content: "text*", marks: "_" },
  text: {
    group: "block",  //todo: 固定的block inline 还是随意
    inline: true,
    mark: "",
    toDOM(node) {
      return ["p", { class: "p_tag" }, 0];
    },
    parseDOM: [
      { tag: "em" }, // Match <em> nodes
      { tag: "i" }, // and <i> nodes
      { style: "font-style=italic" }, // and inline 'font-style: italic'
    ],
  },
  heading: { content: "text*", attrs: { level: { default: 1 } } },
};

const marks = {
  strong: {},
  em: {},
};

const mySchema = new Schema({
  // 添加列表类型
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  // nodes: nodes,
  // todo：可否省略
  marks: schema.spec.marks,
});

console.log(schema);
console.log(mySchema);

const doc = schema.node("doc", null, [
  schema.node("paragraph", null, [schema.text("abc")]),
  schema.node("horizontal_rule"),
  schema.node("paragraph", null, [schema.text("title")]),
]);

let view = new EditorView(editorDom, {
  state: EditorState.create({
    doc: DOMParser.fromSchema(mySchema).parse(contentDom),
    // doc,
    plugins: exampleSetup({ schema: mySchema }),
  }),
  // todo：Applying a mismatched transaction
  // dispatchTransaction(transaction) {
  //   console.log(transaction);
  //   let newState = window.view.state.apply(transaction);
  //   // 更新到view
  //   window.view.updateState(newState);
  // }
});

console.log("DOMParser", DOMParser.fromSchema(mySchema));
console.log("doc", DOMParser.fromSchema(mySchema).parse(contentDom).toString());
console.log("view",  view);

// exampleSetup 包含的内容
// - Input rules, which are input macros that fire when certain patterns are typed. In this case, it is set up to provide things like smart quotes and some Markdown-like behavior, such as starting a blockquote when you type “> ”.
// - Keymaps with the base bindings and custom bindings for common mark and node types, such as mod-i to enable emphasis and ctrl-shift-1 to make the current textblock a heading.
// - The drop cursor and gap cursor plugins.
// - The undo history.
// - A menu bar (which is another module that is meant more for demos than for production), with menu items for common tasks and schema elements.
