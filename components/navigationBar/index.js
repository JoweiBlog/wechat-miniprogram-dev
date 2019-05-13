Component({
  properties: {
    background: {
      type: String,
      value: '#fff',
      observer(nv) {
        this.setStyle('wrapper', Object.assign({}, this.data.wrapper, {
          background: nv
        }))
      },
    }
  },

  data: {
    wrapper: {},
    wrapperStyle: '',
    box: {},
    boxStyle: '',
    title: {},
    titleStyle: '',
    tool: {},
    toolStyle: '',
    dot: {},
    dotStyle: '',
  },

  lifetimes: {
    attached() {
      this.getSysInfo()
      this.getMenuBtnOps()
    },
  },

  methods: {
    // get device
    getSysInfo () {
      this.sysInfo = wx.getSystemInfoSync() || {}
    },

    // get menu btn
    getMenuBtnOps () {
      const { 
        width : mw = 0,
        height : mh = 0, 
        top : mt = 0, 
        bottom: mb = 0,
        right : mr = 0,
      } = wx.getMenuButtonBoundingClientRect()

      const bottomDis = '24rpx'
      const titleWid = `calc(100% - (2 * ${mw}px + 16px))`
      const dis = (this.sysInfo.windowWidth || 0) - mr

      this.setStyle('wrapper', {
        height: mb,
        paddingBottom: bottomDis,
        background: this.data.background,
      })

      this.setStyle('box', {
        top: mt,
        bottom: bottomDis,
        // fix: mock devtool dis
        left: dis > 100 ? 16 : dis,
        right: dis > 100 ? 16 : dis,
        height: mh,
      })

      this.setStyle('title', {
        width: titleWid,
        lineHeight: mh,
        color: '#000',
      })

      this.setStyle('tool', {
        width: mw,
      })

      this.setStyle('dot', {
        width: mh,
        height: mh,
      })

    },

    // setStyle 
    setStyle (o = '', style = {}) {
      this.setData({
        // cache
        [o]: style,
      }, () => {
        this.setData({
          [`${o}Style`]: this.toStyleStr(style)
        })
      })
    },

    // back
    back () {
      wx.navigateBack()
    },

    // home 
    home () {
      wx.redirectTo({
        url: '/pages/home/index',
      })
    },

    // to style
    toStyleStr (o = {}) {
      if (Object.keys(o).length <= 0) return '';

      // num + suit => str
      const toPxStr = (v) => typeof v === 'number' ? `${v}px` : v 

      // paddingTop => padding-top
      const toLower = (k = '') => 
        k.replace(/([A-Z])([a-z]+)/g, (full, first, more) => `-${first.toLowerCase()}${more}`)
      
      return Object
        .entries(o)
        .map(([k, v]) => `${toLower(k)}: ${toPxStr(v)}`)
        .join(';')
    },
  }
})
