/**
 * 
 * PageModal
 * 页面栈，自行添加需要通信的页面Page
 * 
 * # page a
 * onLoad: app.pages.add(this)
 * onUnload：app.pages.delete(this) 
 * 
 * # page c
 * app.pages.get('/pages/a/index').doSomething()
 * 
*/

export default class PageModal {
  constructor () {
    this.cache = {}
  }

  add (page) {
    let path = this._getPath(page)
    this.cache[path] = page
  }

  get (path) {
    return this.cache[path] || null
  }

  delete (page) {
    try {
      delete this.cache[this._getPath(page)]
    } catch(e) {}
  }

  _getPath (page) {
    return page.__route__
  }
}