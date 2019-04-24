/**
 * 
 * cache
 * 
 * # localstorage 
 * cache.set('n', 1)
 * cache.get('n')   // 1
 * 
 * # localstorage expire
 * cache.set('n', 1, 10000)
 * cache.get('n') // 1 ，10s内访问有效
 * 
 * # localstorage 延续上次缓存时间，若上次没缓存，此次设置也将取消（retrun）
 * cache.set('n', 1, true)
 * cache.get('n') // 1
 * 
 * # sessionstorage 本次启动有效
 * cache.session.set('n', 1)
 * cache.session.get('n') // 1
 * 
 * # remove
 * cache.remove('n')
 * cache.session.remove('')
 * 
*/

const sessionId = +new Date()
const cache = {
  session: {
    set: (key, value) => cache.set(`session_${key}`, value, -1*sessionId),
    get: (key) => cache.get(`session_${key}`),
    remove: (key) => cache.remove(`session_${key}`),
  },
  
  set: (key, value, expire) => {
    let o = {
      expr: 0,
      data: value,
    }

    if (expire === true) {
      const _c = wx.getStorageSync(`_cache_${key}`)
      if (!_c) return
      o.expr = _c.expr || 0
    } else {
      let _expire = expire || 0
      if (_expire > 0) {
        let t = +new Date()
        _expire += t
      }
      o.expr = +_expire
    }

    wx.setStorageSync(`_cache_${key}`, o)
  },

  get: (key) => {
    const k = `_cache_${key}`
    const v = wx.getStorageSync(k)
    if (!v) return null
    // 永久存储
    if (!v.expr) return v.data
    else {
      if (v.expr > 0 && new Date() < v.expr) {
        return v.data
      } else if (v.expr < 0 && (v.expr*-1) === sessionId) {
        return v.data
      } else {
        wx.removeStorage({ key: k })
        return null
      }
    }
  },

  remove: (key) => {
    wx.removeStorageSync(`_cache_${key}`)
  }
}

export default cache

// cache config
export const USER_INFO = 'userInfo'

// export const ..