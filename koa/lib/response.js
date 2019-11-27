let response = {
  get method() {
    //方法
    this.res.method
  },

  _body: undefined,
  get body() {
    return this._body
  },

  set body(newVal) {
    this.statusCode(200)
    this._body = newVal
  },

  set(key, value) {
    this.res.setHeader(key, value)
  },

  statusCode(value) {
    this.res.statusCode = value
  }
}
module.exports = response
