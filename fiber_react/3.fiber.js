/**
 * 1. 从顶点开始遍历
 * 2. 先儿子，后弟弟，再叔叔
 */
let rootFiber = require("./element.js");
let nextUnitOfWork = null;
function workLoop() {
  while (nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  if (!nextUnitOfWork) {
    console.log("render complete");
  }
}

function performUnitOfWork(fiber) {
  beginWork(fiber);
  if (fiber.child) {
    return fiber.child;
  }
  // 没有儿子，说明此fiber完成
  while (fiber) {
    completeUnitOfWork(fiber);
    if (fiber.sibling) {
      return fiber.sibling;
    }
    fiber = fiber.return;
  }
}

function completeUnitOfWork(fiber) {
  console.log("结束：", fiber.key);
}
function beginWork(fiber) {
  console.log("开始：", fiber.key);
}

nextUnitOfWork = rootFiber;
workLoop();
