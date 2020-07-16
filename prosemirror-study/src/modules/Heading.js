class Heading {
  scheme() {
    return {
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
        }
      },
    };
  }

  mask() {

  }

  menuCommand(level) {
    return setBlockType(scheme.nodes.heading, { level })(
        view.state,
        view.dispatch,
        view
      );
  }

  menu() {
    return {
        text: '标题一',
        command: this.menuCommand(1)
    };
  }

  isMenuActive() {}
}

export default Heading;
