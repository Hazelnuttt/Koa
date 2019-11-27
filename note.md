# Koa

## context.js

```js
__defineGetter__
__defineSetter__
```

- 代理

## request.js

- get set 方法

## response.js

- get set 方法
- body
  - 处理流(文件)
  - 处理 json

## 中间件

- 这些中间件会，会组合成一个大函数，执行完后，ctx.body 的结果进行返回
- 为啥要这个东西
  - 执行顺序 ==> Promise / generator / co ==> 异步逻辑
  - 代码是同步执行的，异步代码会忽略
  - 异步 ==> await/return next()
- 核心

```js
compose(middleware,ctx){
    function dispatch(index){
        //promise.resolve 封装一下，必须是个promise
        return Promise.resolve(middleware[index](),()=>dispatch(index+1))
    }
    dispatch(0)
}
```
