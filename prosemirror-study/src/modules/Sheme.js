const basicNodes = {
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
  },
};

const headingNode = {
  heading: {
    attrs: { level: { default: 1 } },
    content: "inline*",
    group: "block",
    // defining: true,
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
};
const nodes = {
  ...basicNodes,
  ...headingNode,
};

const marks = {
  strong: {
    parseDOM: [
      { tag: "strong" },
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
  }
};

export { nodes, marks };
