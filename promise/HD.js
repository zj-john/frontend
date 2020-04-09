class HD {
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";
  constructor(executor) {
    this.status = HD.PENDING;
    this.value = null;
    this.callbacks = [];
    try {
      // 因为 resolve或rejected方法在executor中调用，作用域也是executor作用域，这会造成this指向window，现在我们使用的是class定义，this为undefined
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  resolve(value) {
    if (this.status === HD.PENDING) {
      this.status = HD.FULFILLED;
      this.value = value;
      // console.log("resolved inner",value);
      setTimeout(() => {
        this.callbacks.forEach(cb => {
          cb["onFulfilled"].call(this, value);
        });
      });
    }
  }
  reject(reason) {
    if (this.status === HD.PENDING) {
      this.status = HD.REJECTED;
      this.value = reason;
      // console.log("reject inner", reason)
      setTimeout(() => {
        this.callbacks.forEach(cb => {
          cb["onRejected"].call(this, reason);
        });
      });
    }
  }

  then(onFulfilled, onRejected) {
    // console.log(this);
    if (typeof onFulfilled !== "function") {
      onFulfilled = (value) => value;
    }
    if (typeof onRejected !== "function") {
      //   onRejected = () => this.value;
      onRejected = (value) => value;
    }
    let promise = new HD((resolve, reject) => {
      if (this.status === HD.PENDING) {
        this.callbacks.push({
          onFulfilled: value => {
            this.handleStatus(promise, onFulfilled(value), resolve, reject);
          },
          onRejected: value => {
            this.handleStatus(promise, onRejected(value), resolve, reject);
          }
        });
      }
      if (this.status === HD.FULFILLED) {
        setTimeout(() => {
          this.handleStatus(promise, onFulfilled(this.value), resolve, reject);
        });
      }
      if (this.status === HD.REJECTED) {
        setTimeout(() => {
          this.handleStatus(promise, onRejected(this.value), resolve, reject);
        });
      }
    });
    return promise;
  }

  handleStatus(promise, result, resolve, reject) {
    if (promise === result) {
      throw new TypeError("Chaining cycle detected for promise #<Promise>");
    }
    try {
      // let result = onFulfilled(this.value);
      if (result instanceof HD) {
        result.then(resolve, reject);
        // 展开
        // result.then(value => {
        //     resolve(value)
        // }, reason => {
        //     reject(reason)
        // })
      } else {
        resolve(result);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  static resolve(value) {
    return new HD((resolve, reject) => {
      if (value instanceof HD) {
        value.then(resolve, reject);
      } else {
        resolve(value);
      }
    });
  }
  static reject(reason) {
    return new HD((resolve, reject) => {
      if (reason instanceof HD) {
        reason.then(resolve, reject);
      } else {
        reject(reason);
      }
    });
  }

  static all(promises) {
    const resolves = [];
    return new HD((resolve, reject) => {
      promises.forEach(promise => {
        promise.then(
          value => {
            resolves.push(value);
            if (resolves.length === promises.length) {
              resolve(resolves);
            }
          },
          reason => {
            reject(reason);
          }
        );
      });
    });
  }

  static race(promises) {
    return new HD((resolve, reject) => {
      promises.forEach(promise => {
        promise.then(
          value => {
            resolve(value);
          },
          reason => {
            reject(reason);
          }
        );
      });
    });
  }

  catch = function (callback) {
    return this.then(null, callback);
  }
  finally = function(cb) {
    return this.then(
      data=> HD.resolve(cb()).then(() => data),
      err => HD.resolve(cb()).then(() => {throw err})
    );
  }
}
