/**
 * 
 * 微信强授权组件
 * 
 * prop:
 * @display: 显示/隐藏
 * @bg：背景色
 * @scope：微信权限值
 * 有以下参考值：
 * scope.userInfo	用户信息
 * scope.userLocation	地理位置
 * scope.address	通讯地址
 * scope.invoiceTitle	发票抬头
 * scope.werun 微信运动步数
 * scope.record	录音功能
 * scope.writePhotosAlbum	保存到相册
 * scope.camera	摄像头
 * scope.userPhone  用户手机  // 自定义scope
 * 
 * event:
 * @bind:success：授权成功，返回：
 * 
 * scope === 'scope.userInfo'
 * { 
 *  scope: 'scope.userInfo',
 *  result: {
 *    detail: {}  //  userinfo detail  
 *  }
 * }
 * 
 * scope === scope.userPhone
 * {
 *  scope: 'scope.userPhone',
 *  result: {
 *    detail: {}  //  userinfo detail
 *    code: code || ''  // login code || '' (session 过期才会重新获取)
 *  }
 * }
 * 
 * === scope.*   // 'userLocation' || 'address' || ...
 * {
 *  scope: 'scope.*'
 * }
*/

const scopes = {
  'scope.userInfo': { tip: '获取你的公开信息(昵称、头像等)', open: 'getUserInfo' },
  'scope.userLocation': { tip: '获取你的地理位置', open: 'openSetting' },
  'scope.address': { tip: '获取你的通讯地址信息', open: 'openSetting' },
  'scope.invoiceTitle': { tip: '获取你的发票抬头信息', open: 'openSetting' },
  'scope.werun': { tip: '获取你的微信运动步数信息', open: 'openSetting' },
  'scope.record': { tip: '使用录音功能', open: 'openSetting' },
  'scope.writePhotosAlbum': { tip: '获取读写相册权限', open: 'openSetting' },
  'scope.camera': { tip: '获取使用摄像头权限', open: 'openSetting' },
  'scope.userPhone': { tip: '获取你的微信关联手机号', open: 'getPhoneNumber' },
  '': { tip: '', open: 'openSetting' },
}

Component({
  properties: {
    display: {
      type: Boolean,
      value: false,
      observer(nv, ov, cp) { 
        if (nv) {
          wx.vibrateShort()
        }
      }
    },
    bg: {
      type: String,
      value: 'rgba(0,0,0,.5)',
    },
    scope: {
      type: String,
      value: '',
      observer(nv, ov, cp) {
        const { tip, open } = scopes[nv || '']
        this.setData({
          'scopeDesc': tip,
          'openType': open
        })
      }
    }
  },

  data: {
    scopeDesc: '',
    openType: '',
  },

  methods: {
    checkSession(cb) {
      wx.checkSession({
        success() { cb && cb('') },
        fail() {
          // session_key 已经失效，需要重新执行登录
          wx.login({
            success(res) {
              cb && cb(res.code || '')
            }
          })
        }
      })
    },
    onGetUserInfo(e) {
      const cv = this
      if (!e.detail.iv) return
      this.triggerEvent('success', {
        scope: cv.data.scope,
        result: {
          detail: e.detail || {}
        }
      })
    },
    onGetUserPhone(e) {
      const cv = this
      if (!e.detail.iv) return
      this.checkSession((code) => {
        this.triggerEvent('success', {
          scope: cv.data.scope,
          result: {
            detail: e.detail || {},
            code,
          }
        })
      })
    },
    onOpenSetting(e) {
      const cv = this
      if (e.detail.authSetting[cv.data.scope]) {
        this.triggerEvent('success', {
          scope: cv.data.scope,
        })
      }
    },
  }
})
