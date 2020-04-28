/**
 * Fiber中多处使用链表
 */

 class Update {
     constructor(payload, nextUpdate) {
         this.payload = payload;
         this.nextUpdate = nextUpdate;
     }
 }

 class UpdateQueue {
     constructor() {
         this.baseState = null; //原状态
         this.firstUpdate = null; // 第一个更新
         this.lastUpdate = null; //最后一个更新
     }
     enqueueUpdate(update) {
         if(this.firstUpdate == null) {
             this.firstUpdate = this.lastUpdate = update;
         } else {
             this.lastUpdate.nextUpdate = update;
             this.lastUpdate = update;
         }
     }

     forceUpdate() {
         let currentState = this.state || {};
         let currentUpdate = this.firstUpdate;
         while(currentState) {
             let nextState = typeof currentUpdate.payload == 'function'?currentUpdate.payload(currentState):currentUpdate.payload;
             currentState = {...currentState, ...nextState};
             currentUpdate = currentUpdate.nextUpdate;
         }
         this.firstUpdate = this.lastUpdate = null;
         this.baseState = currentState;
         return currentState;
     }
 }
// 计数器 {number:0} setState({number:1}) (state) => {number: state.number + 1 })
 let queue = new UpdateQueue();
 queue.enqueueUpdate(new Update({name:"john"}))
 queue.enqueueUpdate(new Update({number:0}))
//  queue.enqueueUpdate(new Update((state) => {number: state.number + 1 }))
//  queue.enqueueUpdate(new Update((state) => {number: state.number + 1 }))
 queue.forceUpdate();
 // 链表可中断