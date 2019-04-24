// components/poster/index.js
const Panel = require('panel.js')
let panel

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * @param {Boolean} autoMake:  自动生成海报；（不用点击）
     * 默认为false: 需要slot 点击触发；
     * 
     * @param {Object} config
     * '注释中带 “*” 为必要参数'
     * 
     * {
     *    width: 0,                        // * 画布宽度
     *    height: 0,                       // * 画布高度
     *    bgColor: 'transparent', //    画布背景
     *    block: [...{@Block}],   //    块元素配置
     *    image: [...{@Image}], //    图片元素配置
     *    text: [...{@Text}],       //    文字元素配置
     * }
     * 
     * @Block
     * {
     *    width: 0,                                // * 块宽度
     *    height: 0,                               // * 块高度
     *    x: 0,                                        //    块左上角位置x
     *    y: 0,                                        //    块左上角位置y
     *    bgColor: 'transparent',        //     背景色
     *    borderRadius: 0,                  //     边框圆弧度
     *    borderWidth: 0,                   //     边框宽度
     *    borderColor: 'transparent', //    边框颜色
     *    opacity: 1,                             //    块透明度 0~1
     * }
     * 
     * @Image
     * {
     *    url: '',                                      // * 图片资源链接，非本地图片
     *    width: 0,                                // * 图片宽度
     *    height: 0,                               // * 图片高度
     *    x: 0,                                         //    图片左上角位置x
     *    y: 0,                                         //    图片左上角位置y
     *    borderRadius: 0,                   //    图片边框圆弧度
     *    borderWidth: 0,                    //    图片边框宽度
     *    borderColor: 'transparent', //     图片边框颜色
     * }
     * 
     * @Text
     * {
     *    text: '',                              // * 文本内容
     *    x: 0,                                  //     文本原点位置x
     *    y: 0,                                  //     文本原点位置y
     *    color: '#000',                  //     文本颜色
     *    fontSize: 24,                   //     文本字号大小
     *    fontUrl: '',                       //     文字字体文件链接 'https..ttf', 须配合fontFamily使用  
     *    fontFamily: 'Arial',         //     文本字体，也可以是 fontUrl 字体名称；
     *    fontWeight: 'normal',    //     字重： 'normal' || 'bold'
     *    textAlign: 'left',              //     文本相对原点对齐方式  'center' || 'left' || 'right'
     *    lineHeight: 36,               //     文本行高
     *    lineLimit: 0,                    //     文本行数限制：0 标识不限制行数； 0~999
     *    maxWidth: panelWidth,//     文本最大宽度，超出最大宽度会换行处理，默认为画布宽度
     *    opacity: 1,                       //     文本透明度 0~1
     * }
     * 
     * 
     * @tip： 涉及到Color（bgColor/color/borderColor...）：分纯色类型，渐变类型: 具体查看
     * 纯色=> eg:   bgColor: 'red',  color: '#eee' ...
     * 渐变=> eg:
     *    bgColor: {
     *      type: 'linear', // 'linear' 线性渐变
     *      x1: 0,
     *      y1: 0,
     *      x2: 0,
     *      y2: 958,
     *      colorStep: [
     *        [0, '#3E5151'],
     *        [0.5, '#11998e'],
     *        [1, '#DECBA4']
     *      ]
     *    },
     *    color: {
     *      type: 'circular', // 圆形渐变
     *      ox: 0,
     *      oy: 0,
     *      radius: 10,
     *      colorStep: [
     *        [0, '#3E5151'],
     *        [0.5, '#11998e'],
     *        [1, '#DECBA4']
     *      ]
     *    }
     * 
    */
    config: {
      type: Object,
      value: {},
    },
    autoMake: {
      type: Boolean,
      value: false,
      observer(nv, ov, cp) {
        if (!!nv && !this.data.loading) {
          this.onCreate()
        }
      }
    }
  },

  data: {
    loading: false,
  },

  ready() {
    panel = new Panel('poster', this)
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 初始化config & 画板绘制
    */
    onCreate() {
      try {
        const wv = this
        if (wv.data.loading) return
        wv.setData({ 'loading': true })

        let box = []
        const config = JSON.parse(JSON.stringify(wv.data.config || {}))
        const { width, height, bgColor, block, image, text } = config

        // download async resource
        const fontResPro = [...(text || []).filter(t => t.fontUrl).map(i => this._downloadFontResource(i))]
        const imgResPro = [...(image || []).map(i => wv._downloadImgResource(i.url))]

        // download font resource
        wv._downloadAllResource(fontResPro).then(() => {
          // download image resource
          wv._downloadAllResource(imgResPro).then(ire => {
            image.forEach((m, j) => { m.url = ire[j].tempFilePath })

            // init box
            box = [
              ...(block || []).map(i => ({ _type: 'block', _con: Object.assign({}, i, { zIndex: i.zIndex || 0 }) })),
              ...(image || []).map(i => ({ _type: 'image', _con: Object.assign({}, i, { zIndex: i.zIndex || 0 }) })),
              ...(text || []).map(i => ({ _type: 'text', _con: Object.assign({}, i, { zIndex: i.zIndex || 0, maxWidth: i.maxWidth || width }) })),
            ]
            box.sort((i, j) => i._con.zIndex - j._con.zIndex)

            // init panel
            panel.init({ box, width, height, bgColor }).then(poster => {
              wv.setData({ 'loading': false })
              wv.triggerEvent('success', poster)
            })
          })
        })
       
      } catch (e) {
        this.setData({ 'loading': false })
        this.triggerEvent('fail', e)
      }
    },

    /**
     * 下载图片等资源
     * @param {String} url
     * @return promise
    */
    _downloadImgResource(url = '') {
      return new Promise((resolve, reject) => {
        if (!url) reject('请补全图片参数url') 
        wx.downloadFile({
          url,
          success: res => resolve(res),
          fail: err => reject(err)
        })
      })
    },

    /**
     * 下载文字等资源
     * @param {String} fontFamily
     * @param {String} fontUrl
    */
    _downloadFontResource({
      fontFamily = '',
      fontUrl = ''
    } = {}) {
      return new Promise((resolve, reject) => {
        if (!fontFamily || !fontUrl) reject('请补全字体参数fontFamily, fontUrl') 
        wx.loadFontFace({
          family: fontFamily,
          source: `url("${fontUrl}")`,
          success: res => resolve(res),
          fail: err => reject(err)
        })
      })
    },

    /**
     * 统一资源下载
     * @param p promises []
     * @return promise
    */
    _downloadAllResource(promises = []) {
      return new Promise((resolve, reject) => {
        Promise.all(promises)
          .then(rs => resolve(rs), err => reject(err))
          .catch(e => reject(e))
      })
    },
  }
})
