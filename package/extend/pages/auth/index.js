import WxAuth from '../../../../libs/wxauth.js'

// Mng
const recorderMng = wx.getRecorderManager()

Page({
  data: {
    // 预检查授权相关
    authDisplay: false,
    authScope: '',
  },

  // 检查 record 权限
  checkRecordPerm() {
    this.wxa.checkScope({
      scope: 'scope.record',
      done() {
        console.log('done record auth');
        wx.showToast({
          title: '可以用record',
        })
        // eg: 开始录制
        // recorderMng.start({
        //   duration: 60000,
        //   format: 'mp3'
        // })
      }
    })
  },

  // 检查 userInfo 权限
  checkUserInfoPerm() {
    this.wxa.checkScope({
      scope: 'scope.userInfo',
      done(res) {
        console.log('done userinfo auth,', res)
        // sync serve..
        wx.showToast({
          title: '可以用userinfo~',
        })
      }
    })
  },

  // 监听授权
  _onAuthDone(e) {
    this.wxa.checkScope(e)
  },

  onLoad: function () {
    this.wxa = new WxAuth(this, 'authScope', 'authDisplay')
  },
})
