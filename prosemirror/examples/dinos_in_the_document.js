import { Schema, DOMParser, Node } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";

import { MenuItem } from "prosemirror-menu";
import { buildMenuItems } from "prosemirror-example-setup";

import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { exampleSetup } from "prosemirror-example-setup";

const name = "dinos_in_the_document";
const editorDom = document.querySelector(`#demo #${name} .editor`);
const contentDom = document.querySelector(`#demo #${name} .content`);

const dinos = [
  "brontosaurus",
  "stegosaurus",
  "triceratops",
  "tyrannosaurus",
  "pterodactyl",
];

const dinoNodeSpec = {
  attrs: { type: { default: "brontosaurus" } },
  inline: true,
  group: "inline",
  //Determines whether nodes of this type can be dragged without being selected. Defaults to false.
  draggable: true,
  toDOM: (node) => [
    "img",
    { // 属性
      "dino-type": node.attrs.type,
      src: "http://lorempixel.com/50/50",
      title: node.attrs.type,
      class: "dinosaur",
    },
  ],
  // When parsing, such an image, if its type matches one of the known
  // types, is converted to a dino node.
  parseDOM: [
    {
      tag: "img[dino-type]",
      getAttrs: (dom) => {
        let type = dom.getAttribute("dino-type");
        return dinos.indexOf(type) > -1 ? { type } : false;
      },
    },
  ],
};

// create an actual schema that includes this node
const dinoSchema = new Schema({
  // todo：顺序有关系吗
  nodes: schema.spec.nodes.addBefore("image", "dino", dinoNodeSpec), // 在image之前添加节点  addBefore(place, key, value) 
  marks: schema.spec.marks, //? 可否省略
});

// need new menu items in the insert menu
let dinoType = dinoSchema.nodes.dino;

// define a command that handles dinosaur insertion
function insertDino(type) {
  return function (state, dispatch) {
    let { $from } = state.selection,
      index = $from.index();
    // canReplaceWith(from: number, to: number, type: NodeType, marks: ?⁠[Mark]) → bool
    // Test whether replacing the range from to to (by index) with a node of the given type would leave the node's content valid.
    if (!$from.parent.canReplaceWith(index, index, dinoType))
      // Node.canReplaceWith(from, to, type, mark)替换后content是否有效
      return false;
    if (dispatch)
      // replaceSelectionWith(node: Node, inheritMarks: ?⁠bool) → Transaction
      // Replace the selection with the given node. When inheritMarks is true and the content is inline, it inherits the marks from the place where it is inserted.
      dispatch(state.tr.replaceSelectionWith(dinoType.create({ type })));
    return true;
  };
}

// Ask example-setup to build its basic menu
// prosemirror-menu
let menu = buildMenuItems(dinoSchema);
// Add a dino-inserting item for each type of dino
dinos.forEach((name) =>
  menu.insertMenu.content.push(
    new MenuItem({
      title: "Insert " + name,
      label: name.charAt(0).toUpperCase() + name.slice(1),
      enable(state) { // btn active状态，能插入就是true，否则就是false
        return insertDino(name)(state);
      },
      run: insertDino(name),
    })
  )
);

let view = new EditorView(editorDom, {
  state: EditorState.create({
    doc: DOMParser.fromSchema(dinoSchema).parse(contentDom),
    // Pass exampleSetup our schema and the menu we created
    plugins: exampleSetup({ schema: dinoSchema, menuContent: menu.fullMenu }),
  }),
});

console.log("resolve",Node.resolve(0));
