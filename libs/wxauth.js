/**
 * 微信授权类
 * 
 * scopes: 
 * scope.userInfo	wx.getUserInfo	用户信息
 * scope.userLocation	wx.getLocation, wx.chooseLocation, wx.openLocation	地理位置
 * scope.address	wx.chooseAddress	通讯地址
 * scope.invoiceTitle	wx.chooseInvoiceTitle	发票抬头
 * scope.werun	wx.getWeRunData	微信运动步数
 * scope.record	wx.startRecord	录音功能
 * scope.writePhotosAlbum	wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum	保存到相册
 * scope.camera	<camera />	摄像头
 */

export default class WxAuth {
  /**
   * @ cmScope：关联页面auth组件 scope 参数
   * @ cmDisplay：关联页面auth组件 display 参数
   *
   */
  constructor(that, cmScope, cmDisplay) {
    this.cmScope = cmScope
    this.cmDisplay = cmDisplay
    this.cmDone = () => { }
    this._setData = this._setData.bind(that)
  }

  /**
   * Evt: checkScopeStatus
   * 检查授权状态
   * @param scope : ''
   * @param cb : ([Boolean flag]) => {}
   *
   */
  _checkScopeStatus(scope = '', cb = () => { }) {
    wx.getSetting({
      success: (res) => {
        const flag = res.authSetting[scope]
        if (scope === 'scope.userInfo' || scope === 'scope.userPhone') {
          cb(false)
        } else if (flag === undefined) {
          // 初次授权
          wx.authorize({
            scope,
            success() { cb(true) },
            fail() { cb(false) }
          })
        } else {
          cb(flag)  // 未授权 ||  已授权 
        }
      },
      fail: () => { cb(false) }
    })
  }

  /**
   * setData
   */
  _setData(k, v) {
    const o = Object.assign({}, this.data || {})
    o[k] = v
    this.setData(o)
  }

  /**
   * Evt: checkScope
   * 检查授权状态
   * @param scope : auth scope
   * @param detail : auth success body
   * @param done   : auth success callback
   *
   */
  checkScope({
    scope = '',
    detail = {},
    done = () => { },
  } = {}) {
    this._setData(this.cmScope, detail.scope || scope)
    if (detail.scope) {
      this._setData(this.cmDisplay, false)
      this.cmDone(detail.result)
    } else {
      this.cmDone = done
      this._checkScopeStatus(scope, (flag) => {
        this._setData(this.cmDisplay, !flag)
        flag && done()
      })
    }
  }
}