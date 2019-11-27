let Koa = require('./koa')
const fs = require('fs')
let app = new Koa()

app.use(ctx => {
  ctx.body = 'hello' //这个body方法是没有的，需要我们加上去
  ctx.body = 'world'
  ctx.body = 'www'
  ctx.response.body = '~hello'
  ctx.body = { name: 'wly' }
  ctx.body = fs.ReadStream('./test.js')
})

app.listen(3000)
