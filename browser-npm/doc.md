# npm包


# 浏览器存储
```js
navigator.storage.estimate().then(estimate => {
  console.log(estimate.quota);// estimate.quota 是估得的配额
  console.log(estimate.usage)// estimate.usage 是估得的使用量，单位为 byte 比特
});
```

# localhost的可行性