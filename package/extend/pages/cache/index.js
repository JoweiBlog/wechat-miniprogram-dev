import $cache, * as caches from '../../../../libs/cache.js'

Page({
  data: {
    user: '',
    shareId: '',
    id: '',
  },

  setUserCache () {
    const user = {
      id: Math.random(),
      user: 'Jowei'
    }
    $cache.set(caches.USER_INFO, user)
  },

  getUserCache() {
    this.setData({
      user: $cache.get(caches.USER_INFO)
    })
  },

  setShareCache() {
    $cache.session.set(caches.SHARE_ID, Math.random())
  },

  getShareCache() {
    this.setData({
      shareId: $cache.session.get(caches.SHARE_ID)
    })
  },

  setIdCache() {
    $cache.set('id', Math.random(), 10000) // 10s后过期
  },

  getIdCache() {
    this.setData({
      id: $cache.get('id')
    })
  },

  onLoad() {
    this.getUserCache()
    this.getShareCache()
    this.getIdCache()
  }
})