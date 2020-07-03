import React from "react";
import "./App.css";
import MenuView from "./components/MenuView";
import Editor from "./modules/Editor";

function voidCommand(){
  console.log("this is a void command");
}

const MenuConfig = [
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
          command: voidCommand,
          disabled: false,
        },
        {
          text: "标题一",
          command: voidCommand,
          disabled: false,
        },
      ],
    },
    {
      type: "base",
      title: "粗体",
      text: "B",
      command: voidCommand,
      disabled: false,
    },
  ],
];

const nodes = {
  doc: {
    content: "block+",
  },
  paragraph: {
    content: "inline*",
    group: "block",
    parseDOM: [{ tag: "div" }],
    toDOM() {
      return ["div", 0];
    },
  },
  text: {
    group: "inline",
  }
};
const marks = {};
const SchemeConfig = {
  nodes: nodes,
  marks: marks,
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.editorRef = React.createRef();
    this.menuConfig = MenuConfig;
    this.scheme = SchemeConfig;
  }
  componentDidMount() {
    this.initEditor();
  }

  initEditor = () => {
    new Editor(this.editorRef.current, this.scheme);
  };

  render() {
    return (
      <div className="App">
        <div className="menu-wrapper">
          <MenuView config={this.menuConfig} />
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
