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
    this.middleware = []
  }
  use(fn) {
    this.middleware.push(fn)
  }

  createContext(req, res) {
    let ctx = Object.create(this.context)
    ctx.response = Object.create(this.response)
    ctx.request = Object.create(this.request)
    ctx.req = ctx.request.req = req
    ctx.res = ctx.response.res = res
    return ctx
  }

  compose(middleware, ctx) {
    // let i = -1
    function dispatch(index) {
      // i = index
      // if (i > index) return Promise.reject(new Error(`next() called multiple times`))
      if (index === middleware.length) return Promise.resolve()
      try {
        return Promise.resolve(middleware[index](ctx, () => dispatch(index + 1)))
      } catch (e) {
        console.log(e)
        return Promise.reject(e)
      }
    }
    return dispatch(0)
  }

  //处理请求
  handleRequest(req, res) {
    let ctx = this.createContext(req, res)
    ctx.statusCode(404)
    this.compose(this.middleware, ctx)
      .then(() => {
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
      })
      .catch(e => {
        this.emit('error', e)
        ctx.statusCode(500)
        res.end('server internal error')
      })
  }

  listen(...args) {
    let server = http.createServer(this.handleRequest.bind(this))
    server.listen(...args)
  }
}
