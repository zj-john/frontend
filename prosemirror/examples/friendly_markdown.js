import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import {
  schema,
  defaultMarkdownParser,
  defaultMarkdownSerializer,
} from "prosemirror-markdown";
import { exampleSetup } from "prosemirror-example-setup";

const name = "friendly_markdown";
const editorDom = document.querySelector(`#demo #${name} .editor`);

class MarkdownView {
  constructor(target, content) {
    this.textarea = target.appendChild(document.createElement("textarea"));
    this.textarea.value = content || '';
    this.textarea.style.setProperty ("width", '500px');
    this.textarea.style.setProperty ("height", '300px');
  }

  get content() {
    return this.textarea.value;
  }
  focus() {
    this.textarea.focus();
  }
  destroy() {
    this.textarea.remove();
  }
}

class ProseMirrorView {
  constructor(target, content) {
    this.view = new EditorView(target, {
      state: EditorState.create({
        doc: defaultMarkdownParser.parse(content),
        plugins: exampleSetup({ schema }),
      }),
    });
  }

  get content() {
    return defaultMarkdownSerializer.serialize(this.view.state.doc);
  }
  focus() {
    this.view.focus();
  }
  destroy() {
    this.view.destroy();
  }
}

let view = new MarkdownView(editorDom);

document.querySelectorAll("input[type=radio]").forEach((button) => {
  button.addEventListener("change", () => {
    if (!button.checked) return;
    let View = button.value == "markdown" ? MarkdownView : ProseMirrorView;
    if (view instanceof View) return; // 处理重复点击
    let content = view.content;
    view.destroy();
    view = new View(editorDom, content);
    view.focus();
  });
});
