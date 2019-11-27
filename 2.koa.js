let Koa = require('./koa')
const fs = require('fs')
let app = new Koa()

const sleep = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('sleep')
      resolve()
    }, 1000)
  })
}

app.use((ctx, next) => {
  console.log(1)
  next()
  next()
  console.log(2)
})

app.use(async (ctx, next) => {
  console.log(3)
  // throw new Error('------------------------www')
  // await sleep()
  await next()
  console.log(4)
})

app.use(async (ctx, next) => {
  console.log(5)
  await next()
  console.log(6)
})

app.listen(3000)
