import React from "react";
import "./App.css";
import "./Editor.css";
import MenuView from "./components/MenuView";
import Editor from "./modules/Editor";
import { nodes, marks } from "./modules/Sheme";
import {
  baseKeymap,
  toggleMark,
  setBlockType,
  wrapIn,
} from "prosemirror-commands";

function voidCommand() {
  console.log("this is a void command");
}

const MenuConfig = (view, scheme) => [
  [
    {
      type: "base",
      title: "撤销",
      text: "↶",
      command: voidCommand,
      disabled: false,
    },
    {
      type: "base",
      title: "重做",
      text: "↷",
      command: voidCommand,
      disabled: false,
    },
  ],
  [
    {
      type: "select",
      title: "段落格式",
      options: [
        {
          text: "正文",
          command: () => {
            setBlockType(scheme.nodes.paragraph, { level: 1 })(
              view.state,
              view.dispatch,
              view
            );
          },
          disabled: false,
        },
        {
          text: "标题一",
          command: () => {
            setBlockType(scheme.nodes.heading, { level: 1 })(
              view.state,
              view.dispatch,
              view
            );
          },
          disabled: false,
        },
        {
          text: "标题二",
          command: () => {
            setBlockType(scheme.nodes.heading, { level: 2 })(
              view.state,
              view.dispatch,
              view
            );
          },
          disabled: false,
        },
        {
          text: "标题三",
          command: () => {
            setBlockType(scheme.nodes.heading, { level: 3 })(
              view.state,
              view.dispatch,
              view
            );
          },
          disabled: false,
        },
        {
          text: "标题四",
          command: () => {
            setBlockType(scheme.nodes.heading, { level: 4 })(
              view.state,
              view.dispatch,
              view
            );
          },
          disabled: false,
        },
      ],
    },
    {
      type: "base",
      title: "粗体",
      text: "B",
      command: ()=>{
        toggleMark(scheme.marks.strong)(
          view.state,
          view.dispatch,
          view
        );
      },
      disabled: false,
    },
  ],
];

const SchemeConfig = {
  nodes: nodes,
  marks: marks,
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.editorRef = React.createRef();
    this.menuConfig = null;
    this.scheme = SchemeConfig;
  }
  componentDidMount() {
    this.initEditor();
  }

  initEditor = () => {
    this.editorObject = new Editor(this.editorRef.current, this.scheme);
    this.editorScheme = this.editorObject.getScheme();
    this.editorView = this.editorObject.getView();
    this.menuConfig = MenuConfig(this.editorView, this.editorScheme);
    this.forceUpdate();
  };

  submit = () => {
    console.log(this.editorObject.getView());
  };
  render() {
    return (
      <div className="App">
        <div className="submit">
          <button onClick={this.submit}>提交</button>
        </div>
        <div className="menu-wrapper">
          {this.menuConfig && <MenuView config={this.menuConfig} />}
        </div>
        <div className="editor-wrapper">
          <div className="editor" ref={this.editorRef}></div>
          <div className="content"></div>
        </div>
      </div>
    );
  }
}

export default App;
