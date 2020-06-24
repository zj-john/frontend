const { Plugin } = require("prosemirror-state");
const { Decoration, DecorationSet } = require("prosemirror-view");
const { DOMParser } = require("prosemirror-model");
const { EditorState } = require("prosemirror-state");
const { EditorView } = require("prosemirror-view");
const { schema } = require("prosemirror-schema-basic");
const { exampleSetup } = require("prosemirror-example-setup");

const name = "upload_handling";
const editorDom = document.querySelector(`#demo #${name} .editor`);
const contentDom = document.querySelector(`#demo #${name} .content`);

let placeholderPlugin = new Plugin({
  state: {
    init() {
      return DecorationSet.empty;
    },
    apply(tr, set) {
      // t(tr: Transaction, value: T, oldState: EditorState, newState: EditorState) → T
      // Adjust decoration positions to changes made by the transaction
      set = set.map(tr.mapping, tr.doc);
      // See if the transaction adds or removes any placeholders
      let action = tr.getMeta(this);
      if (action && action.add) {
        let widget = document.createElement("placeholder");
        let deco = Decoration.widget(action.add.pos, widget, {
          // 挂件装饰器 Widget decorations - 在指定位置插入一个 DOM 节点，该节点不是实际文档的一部分
          id: action.add.id,
        });
        set = set.add(tr.doc, [deco]);
      } else if (action && action.remove) {
        set = set.remove(
          set.find(null, null, (spec) => spec.id == action.remove.id)
        );
      }
      return set;
    },
  },
  props: {
    decorations(state) {
      return this.getState(state);
    },
  },
});

function findPlaceholder(state, id) {
  let decos = placeholderPlugin.getState(state);
  let found = decos.find(null, null, (spec) => spec.id == id);
  return found.length ? found[0].from : null;
}

document.querySelector("#image-upload").addEventListener("change", (e) => {
  // inlineContent希望节点为内联元素
  if (view.state.selection.$from.parent.inlineContent && e.target.files.length)
    startImageUpload(view, e.target.files[0]);
  view.focus();
});

function startImageUpload(view, file) {
  // A fresh object to act as the ID for this upload
  let id = {};

  // Replace the selection with a placeholder
  let tr = view.state.tr; //todo tr是啥 Transaction
  if (!tr.selection.empty) tr.deleteSelection();
  // setMeta(key: string | Plugin | PluginKey, value: any) → Transaction
  // Store a metadata property in this transaction, keyed either by name or by plugin.
  tr.setMeta(placeholderPlugin, { add: { id, pos: tr.selection.from } });
  view.dispatch(tr); // todo: dispatch transaction的过程中，会执行plugin state中的apply？

  uploadFile(file).then(
    (url) => {
      let pos = findPlaceholder(view.state, id);
      // If the content around the placeholder has been deleted, drop
      // the image
      if (pos == null) return;
      // Otherwise, insert it at the placeholder's position, and remove
      // the placeholder
      view.dispatch(
        view.state.tr
          .replaceWith(pos, pos, schema.nodes.image.create({ src: url }))
          .setMeta(placeholderPlugin, { remove: { id } })
      );
    },
    () => {
      // On failure, just clean up the placeholder
      view.dispatch(tr.setMeta(placeholderPlugin, { remove: { id } }));
    }
  );
}

// This is just a dummy that loads the file and creates a data URL.
// You could swap it out with a function that does an actual upload
// and returns a regular URL for the uploaded file.
function uploadFile(file) {
  let reader = new FileReader();
  return new Promise((accept, fail) => {
    reader.onload = () => accept(reader.result);
    reader.onerror = () => fail(reader.error);
    // Some extra delay to make the asynchronicity visible
    setTimeout(() => reader.readAsDataURL(file), 1500);
  });
}

let view = (window.view = new EditorView(editorDom, {
  state: EditorState.create({
    doc: DOMParser.fromSchema(schema).parse(contentDom),
    plugins: exampleSetup({ schema }).concat(placeholderPlugin),
  }),
}));
