class Compiler {
  constructor(el, vm) {
    this.vm = vm;
    this.el = this.isElementNode(el) ? el : document.querySelector(el);
    // 当前元素节点 获取后放入内存中
    let fragment = this.node2fragment(this.el);
    // 节点中的内容进行替换
    //  编译模板
    this.compile(fragment);
    this.el.appendChild(fragment);
  }

  isElementNode(node) {
    return node.nodeType == 1;
  }

  node2fragment(node) {
    let fragment = document.createDocumentFragment();
    let firstChild;
    while ((firstChild = node.firstChild)) {
      // appendChild具有移动性
      fragment.append(firstChild);
    }
    // console.log(fragment);
    return fragment;
  }

  compileElement(node) {
    const attributes = node.attributes;
    // console.log(attributes);
    [...attributes].forEach((attr) => {
      const { name, value } = attr;
      if (this.isDirective(name)) {
        // console.log(name, 'element');
        let [, direct] = name.split("-"); // v-modal v-on:click
        let [directName, action] = direct.split(":");
        CompileUtils[directName](node, value, this.vm, action);
      }
    });
  }

  isDirective(attrName) {
    return attrName.startsWith("v-");
  }

  compileText(node, vm) {
    let content = node.textContent;
    const regx = /\{\{(.+?)\}\}/;
    if (regx.test(content)) {
      CompileUtils.text(node, content, this.vm);
    }
  }

  compile(node) {
    let childNodes = node.childNodes;
    [...childNodes].forEach((child) => {
      // console.log(node);
      if (this.isElementNode(child)) {
        this.compileElement(child);
        this.compile(child);
      } else {
        this.compileText(child);
      }
    });
  }
}

CompileUtils = {
  getVal(expr, vm) {
    // console.log(expr, "expr", vm.$data);
    return expr.split(".").reduce((data, current) => {
      return data[current];
    }, vm.$data);
  },
  setVal(vm, expr, newVal) {
    expr.split(".").reduce((data, current, index, arr) => {
      if (index == arr.length - 1) {
        return (data[current] = newVal);
      }
      return data[current];
    }, vm.$data);
  },
  modal(node, expr, vm) {
    // node:节点 expr:表达式 vm:当前实例
    // console.log(node, expr, vm);
    let fn = this.updater["modalUpdater"];
    new Watcher(vm, expr, (newVal) => {
      //给输入框添加观察者
      fn(node, newVal);
    });
    node.addEventListener("input", (e) => {
      let value = e.target.value;
      this.setVal(vm, expr, value);
    });
    const value = this.getVal(expr, vm);
    fn(node, value);
  },
  html(node, expr, vm) {
    // node:节点 expr:表达式 vm:当前实例
    // console.log(node, expr, vm);
    let fn = this.updater["htmlUpdater"];
    new Watcher(vm, expr, (newVal) => {
      //给输入框添加观察者
      fn(node, newVal);
    });
    const value = this.getVal(expr, vm);
    fn(node, value);
  },
  on(node, value, vm, action) {
    node.addEventListener(action, (e) => {
      vm[value].call(vm, e);
    });
  },
  getContentValue(vm, expr) {
    //遍历表达式，将内容 重新替换成完整容器
    return expr.replace(/\{\{\s*(.+?)\s*\}\}/g, (...args) => {
      return this.getVal(args[1], vm);
    });
  },
  text(node, expr, vm) {
    // console.log(node, expr, vm);
    let fn = this.updater["textUpdater"];
    let content = expr.replace(/\{\{\s*(.+?)\s*\}\}/g, (...args) => {
      //   console.log(args[1]);
      //给每一个表达式{{}}添加观察者
      new Watcher(vm, args[1], () => {
        fn(node, this.getContentValue(vm, expr));
      });
      return this.getVal(args[1], vm);
    });
    fn(node, content);
  },
  updater: {
    modalUpdater(node, value) {
      node.value = value;
    },
    textUpdater(node, value) {
      node.textContent = value;
    },
    htmlUpdater(node, value) {
      node.innerHTML = value;
    },
  },
};

// 订阅模式
class Dep {
  constructor() {
    this.subs = []; // 存放所有watcher
  }

  addSub(watcher) {
    this.subs.push(watcher);
  }

  notify() {
    this.subs.forEach((watcher) => watcher.update());
  }
}

// vm.$watch(vm, 'school.name', ()=>{});
class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr; //school.name
    this.cb = cb;
    // 默认值
    this.oldVal = this.get();
  }

  get() {
    Dep.target = this; //js是单线程的，所以this只有一个,此方法可用
    // getVal 会调用 vm.$data.school.name 即get方法
    let value = CompileUtils.getVal(this.expr, this.vm);
    Dep.target = null;
    return value;
  }

  update() {
    let newVal = CompileUtils.getVal(this.expr, this.vm);
    if (newVal !== this.oldVal) {
      this.cb(newVal);
      this.oldVal = newVal;
    }
  }
}

class Observer {
  constructor(data) {
    this.observer(data);
  }

  observer(data) {
    // console.log(data instanceof Object);
    // console.log(typeof data === "object");
    if (data && data instanceof Object) {
      for (let key in data) {
        this.defineReactive(data, key, data[key]);
      }
    }
  }

  defineReactive(data, key, value) {
    this.observer(value);
    let dep = new Dep(); // 给每个属性添加发布订阅功能，每一个属性有自己的dep，可单独更新，[watcher, watcher]
    Object.defineProperty(data, key, {
      get() {
        // Dep.target 就是一个watcher
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      set: (newVal) => {
        if (newVal !== value) {
          this.observer(newVal);
          value = newVal;
          dep.notify();
        }
      },
    });
  }
}

class Vue {
  constructor(options) {
    console.log("vue");
    this.$el = options.el;
    this.$data = options.data;
    let computed = options.computed;
    let methods = options.methods;
    if (this.$el) {
      // 响应时布局
      new Observer(this.$data);
      // 把 $data 前置，把vm上的取值操作代理到$data上面
      this.proxyVm(this.$data);
      //   computed
      for (let key in computed) {
        Object.defineProperty(this.$data, key, {
          get: () => {
            const fn = computed[key];
            return fn.call(this);
          },
        });
      }
      //   method
      for (let key in methods) {
        Object.defineProperty(this, key, {
          get: () => {
            return methods[key];
          },
        });
      }
      //   console.log(this.$data)
      new Compiler(this.$el, this);
    }
  }

  proxyVm(data) {
    for (let key in data) {
      Object.defineProperty(this, key, {
        get() {
          return data[key];
        },
        set: (newVal) => {
          data[key] = newVal;
        },
      });
    }
  }
}
