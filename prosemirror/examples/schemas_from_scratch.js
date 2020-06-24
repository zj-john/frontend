const { Schema } = require("prosemirror-model");
const name = "schemas_from_scratch";
const editorDom = document.querySelector(`#demo #${name} .editor`);
const contentDom = document.querySelector(`#demo #${name} .content`);
const textSchema = new Schema({
  nodes: {
    text: {},
    doc: { content: "text*" },
  },
});

const noteSchema = new Schema({
  nodes: {
    text: {},
    note: {
      content: "text*",
      toDOM() {
        return ["note", 0];
      },
      parseDOM: [{ tag: "note" }],
    },
    notegroup: {
      content: "note+",
      toDOM() {
        return ["notegroup", 0];
      },
      parseDOM: [{ tag: "notegroup" }],
    },
    doc: {
      content: "(note | notegroup)+",
    },
  },
});

const { findWrapping } = require("prosemirror-transform");

function makeNoteGroup(state, dispatch) { // todo
  // Get a range around the selected blocks
  let range = state.selection.$from.blockRange(state.selection.$to);
  // See if it is possible to wrap that range in a note group
  let wrapping = findWrapping(range, noteSchema.nodes.notegroup);
  // If not, the command doesn't apply
  if (!wrapping) return false;
  // Otherwise, dispatch a transaction, using the `wrap` method to
  // create the step that does the actual wrapping.
  if (dispatch) dispatch(state.tr.wrap(range, wrapping).scrollIntoView());
  return true;
}

let starSchema = new Schema({
  nodes: {
    text: {
      group: "inline",
    },
    star: {
      inline: true,
      group: "inline",
      toDOM() {
        return ["star", "🟊"];
      },
      parseDOM: [{ tag: "star" }],
    },
    paragraph: {
      group: "block",
      content: "inline*",
      toDOM() {
        return ["p", 0];
      },
      parseDOM: [{ tag: "p" }],
    },
    boring_paragraph: {
      group: "block",
      content: "text*",
      marks: "",
      toDOM() {
        return ["p", { class: "boring" }, 0];
      },
      parseDOM: [{ tag: "p.boring", priority: 60 }], // paragraph的优先级是默认的50
    },
    doc: {
      content: "block+",
    },
  },
  marks: {
    shouting: {
      //todo shouting是class吗，为什么用这个key，
      toDOM() {
        return ["shouting"];
      },
      parseDOM: [{ tag: "shouting" }],
    },
    link: {
      attrs: { href: {} },
      toDOM(node) {
        return ["a", { href: node.attrs.href }];
      },
      parseDOM: [
        {
          tag: "a",
          getAttrs(dom) {
            return { href: dom.href };
          },
        },
      ],
      // Whether this mark should be active when the cursor is positioned at its end
      // (or at its start when that is also the start of the parent node). Defaults to true.
      inclusive: false,
    },
  },
});

const { toggleMark } = require("prosemirror-commands");
const { keymap } = require("prosemirror-keymap");

let starKeymap = keymap({
  "Mod-b": toggleMark(starSchema.marks.shouting),
  "Mod-l": toggleLink,
  "Mod-i": insertStar,
});
function toggleLink(state, dispatch) {
  let { doc, selection } = state;
  if (selection.empty) return false;
  let attrs = null;
  // Test whether a given mark or mark type occurs in this document between the two given positions.
  if (!doc.rangeHasMark(selection.from, selection.to, starSchema.marks.link)) {
    attrs = { href: prompt("Link to where?", "") };
    if (!attrs.href) return false;
  }
  return toggleMark(starSchema.marks.link, attrs)(state, dispatch);
}
function insertStar(state, dispatch) {
  let type = starSchema.nodes.star;
  let { $from } = state.selection;
  if (!$from.parent.canReplaceWith($from.index(), $from.index(), type))
    return false;
  dispatch(state.tr.replaceSelectionWith(type.create()));
  return true;
}

const { DOMParser } = require("prosemirror-model");
const { EditorState } = require("prosemirror-state");
const { EditorView } = require("prosemirror-view");
const { baseKeymap } = require("prosemirror-commands");
const { history, undo, redo } = require("prosemirror-history");

let histKeymap = keymap({ "Mod-z": undo, "Mod-y": redo });

function start(place, content, schema, plugins = []) {
  let doc = DOMParser.fromSchema(schema).parse(content);
  return new EditorView(place, {
    state: EditorState.create({
      doc,
      plugins: plugins.concat([histKeymap, keymap(baseKeymap), history()]),
    }),
  });
}

function id(str) {
  return document.getElementById(str);
}
// mount也是EditorView识别的一种方式
start({ mount: id("text-editor") }, id("text-content"), textSchema);
start(id("note-editor"), id("note-content"), noteSchema, [
  keymap({ "Mod-g": makeNoteGroup }),
]);
start(id("star-editor"), id("star-content"), starSchema, [starKeymap]);
