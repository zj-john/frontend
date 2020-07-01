import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser, Fragment } from "prosemirror-model";
import { keymap } from "prosemirror-keymap";
import {
  baseKeymap,
  toggleMark,
  setBlockType,
  wrapIn,
} from "prosemirror-commands";
import { undo, redo, history } from "prosemirror-history";
import { addListNodes, wrapInList } from "prosemirror-schema-list";
import { StepMap } from "prosemirror-transform";
import {
  addColumnAfter,
  addColumnBefore,
  deleteColumn,
  addRowAfter,
  addRowBefore,
  deleteRow,
  mergeCells,
  splitCell,
  setCellAttr,
  toggleHeaderRow,
  toggleHeaderColumn,
  toggleHeaderCell,
  goToNextCell,
  deleteTable,
} from "prosemirror-tables";
import {
  tableEditing,
  columnResizing,
  tableNodes,
  fixTables,
} from "prosemirror-tables";

const editorDom = document.querySelector("#myEditor");
const contentDom = document.querySelector("#content");

// :: Object
// [Specs](#model.NodeSpec) for the nodes defined in this schema.
const nodes = {
  // :: NodeSpec The top level document node.
  doc: {
    content: "block+",
  },

  // :: NodeSpec A plain paragraph textblock. Represented in the DOM
  // as a `<p>` element.
  paragraph: {
    content: "inline*",
    group: "block",
    parseDOM: [{ tag: "p" }],
    toDOM() {
      return ["p", 0];
    },
  },

  // :: NodeSpec A blockquote (`<blockquote>`) wrapping one or more blocks.
  blockquote: {
    content: "block+",
    group: "block",
    defining: true,
    parseDOM: [{ tag: "blockquote" }],
    toDOM() {
      return ["blockquote", 0];
    },
  },

  // :: NodeSpec A horizontal rule (`<hr>`).
  horizontal_rule: {
    group: "block",
    parseDOM: [{ tag: "hr" }],
    toDOM() {
      return ["hr"];
    },
  },

  // :: NodeSpec A heading textblock, with a `level` attribute that
  // should hold the number 1 to 6. Parsed and serialized as `<h1>` to
  // `<h6>` elements.
  heading: {
    attrs: { level: { default: 1 } },
    content: "inline*",
    group: "block",
    defining: true,
    parseDOM: [
      { tag: "h1", attrs: { level: 1 } },
      { tag: "h2", attrs: { level: 2 } },
      { tag: "h3", attrs: { level: 3 } },
      { tag: "h4", attrs: { level: 4 } },
      { tag: "h5", attrs: { level: 5 } },
      { tag: "h6", attrs: { level: 6 } },
    ],
    toDOM(node) {
      return ["h" + node.attrs.level, 0];
    },
  },

  // :: NodeSpec A code listing. Disallows marks or non-text inline
  // nodes by default. Represented as a `<pre>` element with a
  // `<code>` element inside of it.
  code_block: {
    content: "text*",
    marks: "",
    group: "block",
    code: true,
    defining: true,
    parseDOM: [{ tag: "pre", preserveWhitespace: "full" }],
    toDOM() {
      return ["pre", ["code", 0]];
    }, // <pre><code>${}</code></pre>
  },

  // :: NodeSpec The text node.
  text: {
    group: "inline",
  },

  // :: NodeSpec An inline image (`<img>`) node. Supports `src`,
  // `alt`, and `href` attributes. The latter two default to the empty
  // string.
  image: {
    inline: true,
    attrs: {
      src: {},
      alt: { default: null },
      title: { default: null },
    },
    group: "inline",
    draggable: true,
    parseDOM: [
      {
        tag: "img[src]",
        getAttrs(dom) {
          return {
            src: dom.getAttribute("src"),
            title: dom.getAttribute("title"),
            alt: dom.getAttribute("alt"),
          };
        },
      },
    ],
    toDOM(node) {
      let { src, alt, title } = node.attrs;
      return ["img", { src, alt, title }];
    },
  },

  // :: NodeSpec A hard line break, represented in the DOM as `<br>`.
  hard_break: {
    inline: true,
    group: "inline",
    selectable: false,
    parseDOM: [{ tag: "br" }],
    toDOM() {
      return ["br"];
    },
  },

  footnote: {
    group: "inline",
    content: "inline*",
    inline: true,
    // This makes the view treat the node as a leaf, even though it
    // technically has content
    atom: true,
    toDOM: () => ["footnote", 0],
    parseDOM: [{ tag: "footnote" }],
  },
};

class FootnoteView {
  // fn(node: Node, view: EditorView, getPos: fn() → number, decorations: [Decoration]
  constructor(node, view, getPos) {
    // We'll need these later
    this.node = node;
    this.outerView = view;
    this.getPos = getPos;

    // The node's representation in the editor (empty, for now)
    // The outer DOM node that represents the document node. When not given, the default strategy is used to create a DOM node.
    this.dom = document.createElement("footnote");
    // These are used when the footnote is selected
    this.innerView = null;
  }

  //   Can be used to override the way the node's selected status (as a node selection) is displayed.
  selectNode() {
    console.log("select footnode");
    this.dom.classList.add("ProseMirror-selectednode");
    if (!this.innerView) this.open();
  }

  //   When defining a selectNode method, you should also provide a deselectNode method to remove the effect again.
  deselectNode() {
    this.dom.classList.remove("ProseMirror-selectednode");
    if (this.innerView) this.close();
  }

  open() {
    // Append a tooltip to the outer node
    let tooltip = this.dom.appendChild(document.createElement("div"));
    tooltip.className = "footnote-tooltip";
    // And put a sub-ProseMirror into that
    this.innerView = new EditorView(tooltip, {
      // You can use any node as an editor document
      state: EditorState.create({
        doc: this.node,
        plugins: [
          keymap({
            // todo 快捷键会不会重复
            "Mod-z": () => undo(this.outerView.state, this.outerView.dispatch),
            "Mod-y": () => redo(this.outerView.state, this.outerView.dispatch),
          }),
        ],
      }),
      // This is the magic part
      dispatchTransaction: this.dispatchInner.bind(this),
      handleDOMEvents: {
        mousedown: () => {
          // Kludge to prevent issues due to the fact that the whole
          // footnote is node-selected (and thus DOM-selected) when
          // the parent editor is focused.
          if (this.outerView.hasFocus()) this.innerView.focus();
        },
      },
    });
  }

  close() {
    this.innerView.destroy();
    this.innerView = null;
    this.dom.textContent = "";
  }

  dispatchInner(tr) {
    let { state, transactions } = this.innerView.state.applyTransaction(tr);
    this.innerView.updateState(state);

    if (!tr.getMeta("fromOutside")) {
      let outerTr = this.outerView.state.tr,
        offsetMap = StepMap.offset(this.getPos() + 1);
      for (let i = 0; i < transactions.length; i++) {
        let steps = transactions[i].steps;
        for (let j = 0; j < steps.length; j++)
          outerTr.step(steps[j].map(offsetMap));
      }
      if (outerTr.docChanged) this.outerView.dispatch(outerTr);
    }
  }

  //   When given, this will be called when the view is updating itself.
  update(node) {
    if (!node.sameMarkup(this.node)) return false;
    this.node = node;
    if (this.innerView) {
      let state = this.innerView.state;
      let start = node.content.findDiffStart(state.doc.content);
      if (start != null) {
        let { a: endA, b: endB } = node.content.findDiffEnd(state.doc.content);
        let overlap = start - Math.min(endA, endB);
        if (overlap > 0) {
          endA += overlap;
          endB += overlap;
        }
        this.innerView.dispatch(
          state.tr
            .replace(start, endB, node.slice(start, endA))
            .setMeta("fromOutside", true)
        );
      }
    }
    return true;
  }

  //   Called when the node view is removed from the editor or the whole editor is destroyed.
  destroy() {
    if (this.innerView) this.close();
  }
  //   Can be used to prevent the editor view from trying to handle some or
  // all DOM events that bubble up from the node view. Events for which this returns true are not handled by the editor.
  stopEvent(event) {
    return this.innerView && this.innerView.dom.contains(event.target);
  }

  ignoreMutation() {
    return true;
  }
}

class DocView {
  constructor(node, view, getPos) {
    // We'll need these later
    this.node = node;
    this.view = view;
    this.getPos = getPos;
  }
  selectNode() {
    console.log("select", this.node, this.view);
    this.node.attrs.title = "当前被选中";
  }

  deselectNode() {
    console.log("unselect");
  }
}

class ImageView {
  constructor(node, view, getPos) {
    // We'll need these later
    this.node = node;
    this.outerView = view;
    this.getPos = getPos;
  }
  selectNode() {
    console.log("select", this.outerView);
    let state = this.outerView.state;
    let $head = state.selection.$head;
    for (var d = $head.depth; d > 0; d--) {
      console.log($head.node(d).type.spec);
    }
  }

  deselectNode() {
    console.log("unselect");
  }
}

// :: Object [Specs](#model.MarkSpec) for the marks in the schema.
const marks = {
  // :: MarkSpec A link. Has `href` and `title` attributes. `title`
  // defaults to the empty string. Rendered and parsed as an `<a>`
  // element.
  link: {
    attrs: {
      href: {},
      title: { default: null },
    },
    inclusive: false,
    parseDOM: [
      {
        tag: "a[href]",
        getAttrs(dom) {
          return {
            href: dom.getAttribute("href"),
            title: dom.getAttribute("title"),
          };
        },
      },
    ],
    toDOM(node) {
      let { href, title } = node.attrs;
      return ["a", { href, title }, 0];
    },
  },

  // :: MarkSpec An emphasis mark. Rendered as an `<em>` element.
  // Has parse rules that also match `<i>` and `font-style: italic`.
  em: {
    parseDOM: [{ tag: "i" }, { tag: "em" }, { style: "font-style=italic" }],
    toDOM() {
      return ["em", 0];
    },
  },

  // :: MarkSpec A strong mark. Rendered as `<strong>`, parse rules
  // also match `<b>` and `font-weight: bold`.
  strong: {
    parseDOM: [
      { tag: "strong" },
      // This works around a Google Docs misbehavior where
      // pasted content will be inexplicably wrapped in `<b>`
      // tags with a font-weight normal.
      {
        tag: "b",
        getAttrs: (node) => node.style.fontWeight != "normal" && null,
      },
      {
        style: "font-weight",
        getAttrs: (value) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null,
      },
    ],
    toDOM() {
      return ["strong", 0];
    },
  },

  // :: MarkSpec Code font mark. Represented as a `<code>` element.
  code: {
    parseDOM: [{ tag: "code" }],
    toDOM() {
      return ["code", 0];
    },
  },
  fontsize: {
    attrs: {
      dataSize: { default: 14 },
    },
    parseDOM: [
      {
        tag: "font",
        getAttrs: (dom) => {
          const size = dom.getAttribute("data-size") || 14;
          return {
            dataSize: size,
          };
        },
      },
      {
        style: "font-size",
        getAttrs: (fs) => {
          let dataSize = fs;
          if (dataSize.indexOf("px") >= 0) dataSize = dataSize.split("px")[0];
          if (dataSize.indexOf("em") >= 0 || dataSize.indexOf("rem") >= 0) {
            dataSize = "14";
          }
          return {
            dataSize,
          };
        },
      },
    ],
    toDOM(node) {
      let fontSize = node.attrs.dataSize;
      if (fontSize) fontSize = `${fontSize}px`;

      const style = {
        style: `font-size:${fontSize}`,
        "data-size": node.attrs.dataSize,
      };

      return ["font", style];
    },
  },
};

const basicSchema = new Schema({
  nodes: nodes,
  marks: marks,
});

const mySchema = new Schema({
  // 添加列表类型
  nodes: addListNodes(
    basicSchema.spec.nodes,
    "paragraph block*",
    "block"
  ).append(
    tableNodes({
      tableGroup: "block",
      cellContent: "block+",
      cellAttributes: {
        background: {
          default: null,
          getFromDOM(dom) {
            return dom.style.backgroundColor || null;
          },
          setDOMAttr(value, attrs) {
            if (value)
              attrs.style = (attrs.style || "") + `background-color: ${value};`;
          },
        },
      },
    })
  ),
  marks: basicSchema.spec.marks,
  //   nodes: nodes,
});

class MenuView {
  constructor(menuConfig, editorView) {
    this.items = menuConfig;
    this.editorView = editorView;
    this.dom = document.createElement("div");
    this.dom.className = "menubar";
    this.items.forEach(({ dom }) => this.dom.appendChild(dom));
    // this.update();

    this.dom.addEventListener("mousedown", (e) => {
      e.preventDefault();
      editorView.focus();
      this.items.forEach(({ command, dom }) => {
        if (dom.contains(e.target))
          command(this.editorView.state, this.editorView.dispatch, editorView);
      });
    });
  }

  update() {
    // this.items.forEach(({ command, dom }) => {
    //   let active = command(this.editorView.state, null, this.editorView);
    //   active ? dom.classList.remove("disabled") : dom.classList.add("disabled");
    // });
  }

  destroy() {
    this.dom.remove();
  }
}
function menuPlugin(menuConfig) {
  return new Plugin({
    // The function will be called when the plugin's state is associated with an editor view.
    // return 一个object需要包含update和destroy2个function
    view(editorView) {
      let menuView = new MenuView(menuConfig, editorView);
      editorView.dom.parentNode.insertBefore(menuView.dom, editorView.dom);
      return menuView;
    },
  });
}

class SelectionSize {
  constructor(view) {
    this.view = view;
    this.tooltipDom = document.createElement("div");
    this.tooltipDom.className = "tooltip";
    this.view.dom.parentNode.appendChild(this.tooltipDom);
    this.update(this.view, null);
  }
  update(view, prevState) {
    let state = view.state;
    if (
      prevState &&
      prevState.doc.eq(state.doc) &&
      prevState.selection.eq(state.selection)
    ) {
      return;
    }
    if (state.selection.empty) {
      this.tooltipDom.style.display = "none";
      return;
    }
    this.tooltipDom.style.display = "";
    const { from, to } = state.selection;
    let start = view.coordsAtPos(from),
      end = view.coordsAtPos(to);
    let box = this.tooltipDom.offsetParent.getBoundingClientRect();

    let left = Math.max((start.left + end.left) / 2, start.left + 3);
    this.tooltipDom.style.left = left - box.left + "px";
    this.tooltipDom.style.top = box.bottom - start.top + "px";
    this.tooltipDom.textContent = to - from;
  }
  destroy() {
    this.tooltipDom.remove();
  }
}

const tooltipPlugin = new Plugin({
  view(editorView) {
    return new SelectionSize(editorView);
  },
});

class DomAction {
  createMenuItem(text, name) {
    let span = document.createElement("span");
    span.className = "menuicon " + name;
    span.title = name;
    span.textContent = text;
    return span;
  }
}
const domAction = new DomAction();

function uploadImg(view, cb) {
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.onchange = (e) => {
    cb(view, e.target.files[0]);
    input.remove();
  };
  input.click();
  return true;
}

function startImageUpload(view, file) {
  let tr = view.state.tr;
  if (!tr.selection.empty) tr.deleteSelection();

  uploadFile(file).then(
    (url) => {
      let pos = tr.selection.from;
      if (pos == null) return;

      view.dispatch(
        view.state.tr.replaceWith(
          pos,
          pos,
          mySchema.nodes.image.create({
            src: url,
            alt: "img",
            title: file.name,
          })
        )
      );
    },
    () => {}
  );
}

function uploadFile(file) {
  let reader = new FileReader();
  return new Promise((accept, fail) => {
    reader.onload = () => accept(reader.result);
    reader.onerror = () => fail(reader.error);
    // Some extra delay to make the asynchronicity visible
    setTimeout(() => reader.readAsDataURL(file), 500);
  });
}

const uploadCommand = () => (state, dispatch, view) => {
  uploadImg(view, startImageUpload);
  return true;
};

const insertCommand = (type) => (state, dispatch) => {
  dispatch &&
    dispatch(state.tr.replaceSelectionWith(type.create()).scrollIntoView());
  return true;
};

const footnoteCommand = () => (state, dispatch, view) => {
  debugger;
  let { empty, $from, $to } = state.selection,
    content = Fragment.empty;
  if (!empty && $from.sameParent($to) && $from.parent.inlineContent)
    content = $from.parent.content.cut($from.parentOffset, $to.parentOffset);
  dispatch(
    state.tr.replaceSelectionWith(mySchema.nodes.footnote.create(null, content))
  );
};

const menuConfig = [
  {
    command: undo,
    dom: domAction.createMenuItem("←", "back"),
  },
  {
    command: redo,
    dom: domAction.createMenuItem("→", "forward"),
  },
  {
    command: toggleMark(mySchema.marks.strong),
    dom: domAction.createMenuItem("B", "strong"),
  },
  {
    command: toggleMark(mySchema.marks.em),
    dom: domAction.createMenuItem("i", "em"),
  },
  {
    command: insertCommand(mySchema.nodes.horizontal_rule),
    dom: domAction.createMenuItem("hr", "hr"),
  },
  {
    command: toggleMark(mySchema.marks.code),
    dom: domAction.createMenuItem("code", "code"),
  },
  {
    command: setBlockType(mySchema.nodes.code_block),
    dom: domAction.createMenuItem("code1", "code1"),
  },
  {
    command: wrapInList(mySchema.nodes.ordered_list),
    dom: domAction.createMenuItem("OL", "ol"),
  },
  {
    command: wrapInList(mySchema.nodes.bullet_list),
    dom: domAction.createMenuItem("UL", "ul"),
  },
  {
    command: setBlockType(mySchema.nodes.paragraph),
    dom: domAction.createMenuItem("p", "paragraph"),
  },
  {
    command: setBlockType(mySchema.nodes.heading, { level: 1 }),
    dom: domAction.createMenuItem("H1", "heading"),
  },
  {
    command: setBlockType(mySchema.nodes.heading, { level: 2 }),
    dom: domAction.createMenuItem("H2", "heading"),
  },
  {
    command: setBlockType(mySchema.nodes.heading, { level: 3 }),
    dom: domAction.createMenuItem("H3", "heading"),
  },
  {
    command: wrapIn(mySchema.nodes.blockquote),
    dom: domAction.createMenuItem(">", "blockquote"),
  },
  {
    command: insertCommand(mySchema.nodes.hard_break),
    dom: domAction.createMenuItem("br", "br"),
  },
  {
    command: uploadCommand(),
    dom: domAction.createMenuItem("IMG", "image"),
  },
  {
    command: footnoteCommand(),
    dom: domAction.createMenuItem("Footnote", "footnote"),
  },
  {
    command: addColumnBefore,
    dom: domAction.createMenuItem(
      "Insert column before",
      "Insert column before"
    ),
  },
  {
    command: deleteRow,
    dom: domAction.createMenuItem(
      "Delete row",
      "Delete row"
    ),
  },
  {
    command: deleteColumn,
    dom: domAction.createMenuItem(
      "Delete column",
      "Delete column"
    ),
  },
  // item("Insert column before", addColumnBefore),
  // item("Insert column after", addColumnAfter),
  // item("Insert row before", addRowBefore),
  // item("Insert row after", addRowAfter),
  // item("Delete table", deleteTable),
  // item("Merge cells", mergeCells),
  // item("Split cell", splitCell),
  // item("Toggle header column", toggleHeaderColumn),
  // item("Toggle header row", toggleHeaderRow),
  // item("Toggle header cells", toggleHeaderCell),
  // item("Make cell green", setCellAttr("background", "#dfd")),
  // item("Make cell not-green", setCellAttr("background", null))
];

console.log("mySchema", mySchema);

let state = EditorState.create({
  //   schema: mySchema,
  doc: DOMParser.fromSchema(mySchema).parse(contentDom),
  plugins: [
    history(),
    keymap(baseKeymap),
    keymap({
      "Mod-z": undo,
      "Mod-y": redo,
      "Mod-b": toggleMark(mySchema.marks.strong),
      Tab: goToNextCell(1),
      "Shift-Tab": goToNextCell(-1),
    }),
    menuPlugin(menuConfig),
    tooltipPlugin,
    columnResizing(),
    tableEditing(),
  ],
});
let view = new EditorView(editorDom, {
  state,
  nodeViews: {
    footnote(node, view, getPos) {
      return new FootnoteView(node, view, getPos);
    },
    code_block(node, view, getPos) {
      return new DocView(node, view, getPos);
    },
    image(node, view, getPos) {
      return new ImageView(node, view, getPos);
    },
  },
});
