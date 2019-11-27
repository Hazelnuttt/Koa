const Emitter = require('events')
let context = require('./context')
let response = require('./response')
let request = require('./request')
const Stream = require('stream')
const http = require('http')
module.exports = class Applications extends Emitter {
  constructor() {
    super()
    this.context = Object.create(context)
    this.response = Object.create(response)
    this.request = Object.create(request)
  }
  use(fn) {
    this.fn = fn
  }

  createContext(req, res) {
    let ctx = Object.create(this.context)
    ctx.response = Object.create(this.response)
    ctx.request = Object.create(this.request)
    ctx.req = ctx.request.req = req
    ctx.res = ctx.response.res = res
    return ctx
  }

  //处理请求
  handleRequest(req, res) {
    let ctx = this.createContext(req, res)
    this.statusCode = 404
    this.fn(ctx)
    let body = ctx.body
    if (body instanceof Stream) {
      ctx.set('Content-Type', 'application/x-javascript')
      body.pipe(res)
    } else if (typeof body === 'object') {
      // res.setHeader
      ctx.set('Content-Type', 'application/json')
      res.end(JSON.stringify(body))
    } else if (typeof body === 'string' || Buffer.isBuffer(body)) {
      res.end(body)
    } else {
      res.end('Not Found')
    }
  }

  listen(...args) {
    let server = http.createServer(this.handleRequest.bind(this))
    server.listen(...args)
  }
}
