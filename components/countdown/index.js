  /**
   * 倒计时
   * 
   * props:
   * @time: 时间（秒）
   * @format: 格式化显示， 默认：dd天hh时mm分ss秒
   * @timeStyle: 时间style样式；默认： '' (::font/color 等可继承父级，一般不用配置)
   * @symbolStyle: 时间symbol样式：默认：'' (::font/color 等可继承父级，一般不用配置)
   * @sign: 同时使用多个 countdown 组件时，需要sign 标注唯一，通知时会回传sign
   * 
   * event:
   * @running: 倒计时进行中,  返回：{ sign, time } // time: 实时计时(s)
   * @end: 倒计时结束后执行，返回: { sign }
   * 
  */

Component({
  properties: {
    sign: {
      type: String,
      value: '',
    },
    time: {
      type: Number,
      value: 0,
      observer: '_init'
    },
    format: {
      type: String,
      // 保留字段：
      // d => 天，h => 时, m => 分, s => 秒
      // dd, hh, mm, ss 为补0数， 1分 =>  01分
      // 提示：不可间隔格式, 例如： 'hh:ss' 仅显示秒
      value: 'dd天hh时mm分ss秒',  // 'hh:mm:ss' || 'd+h+m+s'
    },
    timeStyle: {
      type: String,
      value: '',
    },
    symbolStyle: {
      type: String,
      value: '',
    }
  },

  methods: {
    _init() {
      const { time, format } = this.data
      this.cms = Math.max(time, 0)
      this.endTms = Date.now() + (time * 1000)
      this.format = format

      this._startTimer()
    },

    _startTimer() {
      clearInterval(this.timer)

      let cmpMs = Math.max(this.endTms - Date.now(), 0)
      let timeout = cmpMs % 1000 || 0

      this.timer = setTimeout(() => {
        this._startTimer()
      }, timeout)
      
      this._setTime(cmpMs)
    },

    _setTime(cmpMs = 0) {
      this.cms = parseInt(Math.ceil(cmpMs / 1000))
      this._emitRun(this.cms)

      if (this.cms <= 0) {
        clearInterval(this.timer)
        this._emitEnd()
      }

      let arr = this.format.match(/[a-zA-Z]{1,2}/g) || []
      let symbolArr = this.format.match(/[\u4e00-\u9fa5]+|[^a-zA-Z]/g) || []
      let timeLabel = this._getTimes(this.cms || 0, this.format)

      this.setData({
        times: arr.map((t, i) => {
          return {
            n: timeLabel[t],
            s: symbolArr[i]
          }
        })
      })
    },

    _getTimes(cmpMs, format) {
      let d = cmpMs
      let [s, m, h] = [60, 60, 24].map(u => {
        let num = d % u
        d = Math.floor(d / u)
        return num
      })

      if (cmpMs > 86400 && format.indexOf('d') === -1) {
        h += d * 24
      }
      if (cmpMs > 3600 && format.indexOf('h') === -1) {
        m += h * 60
      }
      if (cmpMs > 60 && format.indexOf('m') === -1) {
        s += m * 60
      }

      return {
        d, h, m, s,
        dd: this._formatTime(d),
        hh: this._formatTime(h),
        mm: this._formatTime(m),
        ss: this._formatTime(s),
      }
    },

    _emitEnd() {
      this.triggerEvent('end', {
        sign: this.data.sign || '',
      })
    },

    _emitRun(second = 0) {
      this.triggerEvent('running', {
        sign: this.data.sign || '',
        time: second // 运行中，当前倒计时时间 (秒)
      })
    },

    _formatTime(val) {
      return val < 10 ? `0${val}` : val;
    },

    onPageShow() {
      if (this.format && this.endTms) {
        // 若存在 format / endTms， 继续执行
        this.cms = parseInt(Math.ceil(this.endTms - Date.now() / 1000));
        this._startTimer()
      }
    },

    onPageHide() {
      clearInterval(this.timer)
    },
  },

  detached() {
    this.onPageHide()
  },

  pageLifetimes: {
    show() {
      this.onPageShow()
    },
    hide() {
      this.onPageHide()
    },
  },
})
