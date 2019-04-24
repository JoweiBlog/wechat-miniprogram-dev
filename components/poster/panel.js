/**
 * 画板
 * @class Panel
 *
*/
class Panel {
  /**
   * @constructor 
   * @param {String} canvasid
  */
  constructor(canvasid, cmp) {
    this.cid = canvasid
    this.cmp = cmp
    this.ctx = wx.createCanvasContext(canvasid, cmp)
  }

  /**
   * 初始化
   * @param {Number} width
   * @param {Number} height
   * @param {String|Object} bgColor
   * @param {Array} box
  */
  init({
    width = 1,
    height = 1,
    bgColor = 'transparent',
    box = []
  } = {}) {

    // 绘制背景
    this._drawBlock({ width, height, bgColor})

    // 依层级绘制模块
    box.forEach((bi) => {
      if (bi._type === 'block') {
        this._drawBlock(bi._con)
      } else if (bi._type === 'image') {
        this._drawImage(bi._con)
      } else if (bi._type === 'text' ) {
        this._drawText(bi._con)
      }
    })

    return new Promise((resolve, reject) => {  
      // 渲染海报
      this.ctx.draw(false, () => {
        this._canvasToImg()
          .then(res => resolve(res), errMsg => reject(errMsg))
          .catch(err => reject(err))
      })
    })
  }

  /**
   * 绘制块
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   * @param {String|Object} bgColor
   * @param {Number} borderRadius
   * @param {Number} borderWidth
   * @param {String} borderColor
   * @param {Number} opacity
  */
  _drawBlock({
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    borderRadius = 0,
    borderWidth = 0,
    borderColor = 'transparent',
    bgColor = 'transparent',
    opacity = 1, // 0~1
  } = {}) {
    this.ctx.save()

    this.ctx.globalAlpha = opacity
    // 设置背景色
    this.ctx.fillStyle = this._formatColor(bgColor)
    // 设置边框
    this.ctx.strokeStyle = this._formatColor(borderColor)
    this.ctx.lineWidth = borderWidth
    // 绘制矩形
    this.ctx.beginPath()
    this.ctx.moveTo(x + borderRadius, y)
    this.ctx.lineTo(x + width - borderRadius, y)
    this.ctx.arcTo(x + width, y, x + width, y + borderRadius, borderRadius)
    this.ctx.lineTo(x + width, y + height - borderRadius)
    this.ctx.arcTo(x + width, y + height, x + width - borderRadius, y + height, borderRadius)
    this.ctx.lineTo(x + borderRadius, y + height)
    this.ctx.arcTo(x, y + height, x, y + height - borderRadius, borderRadius)
    this.ctx.lineTo(x, y + borderRadius)
    this.ctx.arcTo(x, y, x + borderRadius, y, borderRadius)
    this.ctx.closePath()
    // 填充
    this.ctx.fill()
    // 描边
    this.ctx.stroke()

    this.ctx.restore()
  }

  /**
   * 绘制图片
   * @param {String} url
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   * @param {Number} borderWidth
   * @param {String|Object} borderColor
   * @param {Number} borderRadius
  */
  _drawImage({
    url = '',
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    borderWidth = 0,
    borderColor = 'transparent',
    borderRadius = 0,
  } = {}) {
    if (!url) return
    this.ctx.save()
    this._drawBlock({ x, y, width, height, borderRadius, borderColor, borderWidth })
    this.ctx.clip()
    this.ctx.drawImage(url, x, y, width, height)
    this.ctx.restore()
  }

  /**
 * 绘制文本
 * @param {Number} x
 * @param {Number} y
 * @param {String} text
 * @param {String|Object} color
 * @param {Number} fontSize
 * @param {String} fontWeight
 * @param {String} fontFamily
 * @param {String} textAlign
 * @param {Number} maxWidth
 * @param {Number} lineHeight
 * @param {Number} opacity
*/
  _drawText({
    x = 0,
    y = 0,
    text = '',
    color = '#000',
    fontSize = 24,
    fontWeight = 'normal', // 'normal' || 'bold'
    fontFamily = 'Arial',
    textAlign = 'left', // 'center' || 'left' || 'right'
    lineHeight = 36,
    lineLimit = 0, // 0 ~ 999;  0 标识不限制
    maxWidth = 0,
    opacity = 1, // 0~1
  } = {}) {
    if (!text) return
    this.ctx.save()
    let [ lineWidth, lastStrIndex, tx, ty ] = [ 0, 0, x, y ]
    this.ctx.globalAlpha = opacity
    this.ctx.font = `normal ${fontWeight} ${fontSize}px ${fontFamily}`
    this.ctx.fillStyle = this._formatColor(color)
    this.ctx.setTextAlign(textAlign)
    this.ctx.setTextBaseline('middle')
    for ( let i = 0, l = text.length; i < l; i++ ) {
      lineWidth += this.ctx.measureText(text[i]).width
      if (lineWidth > maxWidth) {
        // line limit
        if ((lineLimit > 0 && Math.ceil((ty - y + lineHeight) / lineHeight) <= lineLimit) || lineLimit === 0) {
          let isLimitLastLine = Math.ceil((ty - y + lineHeight) / lineHeight) === lineLimit
          if (isLimitLastLine) {
            this.ctx.fillText(text.slice(lastStrIndex, i - 2) + '...', tx, ty)
            break;
          }
          this.ctx.fillText(text.slice(lastStrIndex, i), tx, ty)
          lineWidth = 0
          ty += lineHeight
          lastStrIndex = i
        }
      } else if (i === l - 1) {
        this.ctx.fillText(text.slice(lastStrIndex, text.length), tx, ty)
      }
    }
    // last line
    // if (this.ctx.measureText(text.slice(lastStrIndex, text.length)).width > maxWidth) {
    //   this.ctx.fillText(text.slice(lastStrIndex, lastStrIndex + maxWidth / 2) + '...', tx, ty)
    // } else {
      // this.ctx.fillText(text.slice(lastStrIndex, text.length), tx, ty)
    // }
    this.ctx.restore()
  }

  /**
   * 格式化颜色
   * @param {String|Object} color
  */
  _formatColor(color = '') {
    if (typeof color === 'string') return color

    let grd
    const { 
      type = 'linear',
      x1 = 0,  // [x1 ,y1, x2, y2]  : linear 参数
      y1 = 0,
      x2 = 0,
      y2 = 0,
      ox = 0,  //  [ox, oy, radius] : circular 参数
      oy = 0,
      radius = 0,
      colorStep = [], // [[0, 'red'], ...[], [1, 'white']] // 0~1
    } = color || {}

    if (type === 'linear') {
      grd = this.ctx.createLinearGradient(x1, y1, x2, y2)
    } else if (type === 'circular') {
      grd = this.ctx.createCircularGradient(ox, oy, radius)
    }
    colorStep.forEach(c => {
      grd.addColorStop((c[0] || 0) * 1, c[1] || '')
    })

    return grd
  }

  /**
   * canvas => 海报图片
  */
  _canvasToImg() {
    return new Promise((resolve, reject) => {
      wx.canvasToTempFilePath({
        canvasId: this.cid,
        success: res => resolve(res.tempFilePath),
        fail: err => reject(err)
      }, this.cmp)
    })
  }

}

module.exports = Panel