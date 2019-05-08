import PageModal from 'libs/page.js'
import 'libs/pageDecorator.js'

App({
  // 系统信息
  sysInfo: null,
  // 页面栈, 注意使用：仅需要通信的页面加入栈中
  pages: new PageModal(),

  onLaunch(opt) {
    // 检查新版本
    checkVersion()

    // 获取设备信息
    this.sysInfo = wx.getSystemInfoSync()
  },

  // 404 redirect
  onPageNotFound(res) {
    wx.switchTab({
      url: '/pages/home/index',
    })
  },
})

/**
 * checkVersionn
 */
function checkVersion() {
  if (wx.canIUse('getUpdateManager')) {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) { })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，重启体验新功能？',
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
  }
}