class MenuView {
    constructor(menuConfig) {
      this.items = menuConfig;
      this.dom = document.createElement("div");
      this.dom.className = "menubar";
      this.items.forEach(({ dom }) => this.dom.appendChild(dom));
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

  export default MenuView;