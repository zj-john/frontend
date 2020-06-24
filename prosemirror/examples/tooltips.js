import { Plugin, EditorState } from "prosemirror-state";
import {EditorView} from "prosemirror-view"
import {schema} from "prosemirror-schema-basic"
import { exampleSetup } from "prosemirror-example-setup";

const name = "tooltips"
const editorDom = document.querySelector(`#demo #${name} .editor`);

let selectionSizePlugin = new Plugin({
  view(editorView) { // todo：默认调用plugin的view方法？，plugin不需要key？
    return new SelectionSizeTooltip(editorView);
  },
});

class SelectionSizeTooltip {
  constructor(view) {
    this.tooltip = document.createElement("div");
    this.tooltip.className = "tooltip";
    view.dom.parentNode.appendChild(this.tooltip);

    this.update(view, null);
  }

  update(view, lastState) { //todo lastState何时赋值
    let state = view.state;
    // Don't do anything if the document/selection didn't change
    if (
      lastState &&
      lastState.doc.eq(state.doc) &&
      lastState.selection.eq(state.selection)
    )
      return;

    // Hide the tooltip if the selection is empty
    if (state.selection.empty) {
      this.tooltip.style.display = "none";
      return;
    }

    // Otherwise, reposition it and update its content
    this.tooltip.style.display = "";
    let { from, to } = state.selection;
    // These are in screen coordinates
    let start = view.coordsAtPos(from),
      end = view.coordsAtPos(to);
    // The box in which the tooltip is positioned, to use as base
    let box = this.tooltip.offsetParent.getBoundingClientRect();
    // Find a center-ish x position from the selection endpoints (when
    // crossing lines, end may be more to the left)
    let left = Math.max((start.left + end.left) / 2, start.left + 3);
    this.tooltip.style.left = left - box.left + "px";
    this.tooltip.style.bottom = box.bottom - start.top + "px";
    this.tooltip.textContent = to - from;
  }

  destroy() {
    this.tooltip.remove();
  }
}

let state = EditorState.create({
    schema,
    plugins: [ // todo: plugins执行顺序，按照index执行，会有异步需求吗？ 在create时执行？
        selectionSizePlugin,
        ...exampleSetup({ schema })
    ]
})
let view = new EditorView(editorDom, {state});

// todo：plugin需要至少3个方法， view， update， destroy，分别在state改变的周期中被调用
// state每次改变，plugin都会被执行
