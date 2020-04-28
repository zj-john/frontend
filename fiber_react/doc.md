# 屏幕刷新率
- 绝大多数屏幕刷新率：60次/s
- 浏览器渲染动画或页面的每一帧的速率需要和设备屏幕的刷新率保持一致
- 页面是一帧一帧绘制出来的，当每秒绘制的帧数（FPS）达到60时，页面时流畅的。小于这个值时，用户会感觉卡顿。
- 每一帧的预算时间是 16.66ms（1/60）
- 所以我们书写代码时，力求不让一帧的工作量超过16ms

# 帧
* 每个帧的开头包括样式计算、布局和绘制
* 执行JS的引擎和页面渲染引擎在同一个渲染线程。GUI渲染和JS执行两者是互斥的
* 如果某个任务执行时间过长，浏览器会推迟渲染

## 16.6ms 包含的内容
1. input event（输入事件）
- Blocking input events（阻塞输入事件）
touch、wheel
- Non-blocking input events(非阻塞输入事件)：
click、keypress

2. Javascript
Timer（定时器）

3. Begin Frame（开始帧）
Per-frame events(每一帧事件)
- window resize
- scroll
- media query change

4. requestAnimationFrame
requestAnimationFrame Frame Callbacks

5. Layout（布局）
- Recalculate Style（计算样式）
- Update Layout（更新布局）

6. Paint（绘制）
- Compositing update
- Paint invalidation
- Record

7. idle peroid（空闲阶段）
idle cb1
idle cb2 

## rAF

requestAnimationFrame回调函数会在绘制之前执行
一帧执行一次

## requestIdleCallback
- 快速响应用户，让用户觉得够快，不能阻塞用户的交互
- requestIdleCallback 使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响关键事件，如动画和输入响应，渲染、布局、绘制、资源加载
- 正常帧任务完成后没超过16ms，说明时间有富余，此时会执行 requestIdleCallback中注册的任务

## MessageChannel
- 目前只有Chrome支持requestIdleCallback
- React利用Message Channel模拟了 requestIdleCallback,将回调延迟到绘制操作之后执行
- MessageChannel API允许我们创建一个新的消息通道，开通它的两个MessagePort属性发送数据
- MessageChannel创建了一个通信的管道，这个管道有2个端口，每个端口都可以通过postMessage发送数据，而一个端口只要绑定了onmessage,接收另一端口传过来的数据
- MessageChannel是一个宏任务

# 单链表
- 链式存储数据结构
- 链表可中断
- generator 性能较差，而且低版本浏览器的pollyfill代码比较冗余 

# fiber历史
## Fiber之前
- React 会递归对比VirtualDom树，找出要变动的节点，然后同步更新他们。这个过程React成为Reconciliation（协调）
- 在 Reconciliation期间，React会一直占用浏览器资源 一会导致用户触发的事件得不到响应，二是会导致掉帧，用户可能会觉得卡顿

## Fiber是什么
- 我们可以通过某些调度策略合理分配CPU资源，从而提高用户的响应速度
- 通过Fiber架构，让自己的Reconciliation过程变成可中断的。适时让出CPU执行权，让浏览器可以及时的响应用户的交互

### Fiber是一个执行单元
- Fiber是一个执行单元，每次执行一个执行单元，React就会检查现在还剩多少时间，如果没有时间了就把控制权让出去。

### Fiber是一种数据结构
- React目前的做法是使用链表，每个VirtualDom节点内部表示为一个Fiber

# Fiber执行阶段
- 每次渲染有2个阶段：Reconciliation render阶段和Commit提交阶段
- 协调阶段：可以认为是Diff阶段，这个阶段可以被中断，这个阶段会找出所有节点变更（添加、删除、属性变更），这些变更React之前称为副作用（Effect）
- 提交阶段：将上一个阶段计算出的需要处理的副作用一次性执行，这个阶段必须同步执行，不能被中断

## render阶段
- 会构建fiber树


> vue不需要fiber，是因为vue是组件级更新，diff足够小。react的diff都是从root节点开始比较，但是可以把大任务分割为小任务，可以中断和恢复，不阻塞主进程。