let ctx = {}
//代理
//进一步封装

function defineGetter(property, key) {
  ctx.__defineGetter__(key, function() {
    return this[property][key]
  })
}

function defineSetter(property, key) {
  ctx.__defineSetter__(key, function(newVal) {
    this[property][key] = newVal
  })
}
module.exports = ctx

defineGetter('request', 'method') //request.method   ctx.method Getter 拿到这些方法
defineGetter('request', 'path') //request.path       ctx.path
defineGetter('response', 'body') //response.body     ctx.body
defineGetter('response', 'set') //response.set       ctx.set
defineGetter('response', 'statusCode')

defineSetter('response', 'body') // ctx.body("xxx")
