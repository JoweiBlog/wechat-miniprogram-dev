// util

const formatNumber = n => {
  const s = n.toString()
  return s[1] ? s : `0${s}`
}

export default {
  /**
   * 解析二维码场景参数 (同服务端协定 scene 以及 params))
   * scene: ''
   * keys: []  // 参数名，按顺序填写
   * 
   * eg: 
   * scene: 'activity',
   * keys: ['actId', 'userId, 'userName']
   * path: /pages/activity?scene=21;43;lilei
   * 
   * return: { actId: '21', userId: '43', userName: 'lilei' }
   */
  resolveSceneParams(scene = '', keys = []) {
    if (keys.length <= 0) return null
    let params = {}
    const hashes = decodeURIComponent(scene + '').split(';')
    hashes.map((val, index) => {
      params[keys[index]] = decodeURIComponent(val)
    })
    return params
  },

  /**
   * @description deepClone 深拷贝（简易）
   * @param {Object|Array} obj
   * @parsm .obj
   * */
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj))
  },

  /**
   * @description typeof 类型判断扩展
   * @param {Any} o
   * @return {String} 类型
   * */
  typeOf(o) {
    const { toString } = Object.prototype
    const map = {
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object RegExp]': 'regExp',
      '[object Undefined]': 'undefined',
      '[object Null]': 'null',
      '[object Object]': 'object',
      '[object Symbol]': 'symbol'
    }

    return map[toString.call(o)]
  },

  /**
   * @description throttle
   * @param {Function} fn
   * @param {Number} interval
   * 节流
   * */
  throttle(fn, interval = 200) {
    let last
    let timer = null
    const time = interval
    return function _throttle(...args) {
      const that = this
      const now = +new Date()
      if (last && last - now < time) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          last = now
          fn.apply(that, args)
        }, time)
      } else {
        last = now
        fn.apply(that, args)
      }
    }
  },

  /**
   * @description 格式化日期
   * @param {Date|Number|String} date
   * @return {String} 'yyyy-MM-dd hh:mm:ss'
   * */
  formatDate(date = new Date()) {
    let _date = null

    if (/^\d+$/.test(date)) {
      _date = parseInt(date, 10)
    }

    if (['string', 'number'].includes(typeof _date)) {
      _date = new Date(_date)
    }

    if (!(_date.getFullYear && _date.getFullYear())) {
      throw new Error('日期格式错误')
    } else {
      const [Y, M, D, h, m, s] = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      ]
      const dt = `${[Y, M, D].map(formatNumber).join('-')}`
      const time = `${[h, m, s].map(formatNumber).join('-')}`
      return `${dt} ${time}`
    }
  },

  /**
   * @description 浮点数计算； 规避浮点数的精度丢失；
   * @example eg: 32.80*100 // 3279.9999999999995;
   * @operate abb | sub | mul | div
   * @param {Number} a
   * @param {Number} b
   * @return {Number} result
   * */
  numberCal: {
    add(a, b) {
      let c
      let d
      try {
        c = a.toString().split('.')[1].length
      } catch (f) {
        c = 0
      }
      try {
        d = b.toString().split('.')[1].length
      } catch (f) {
        d = 0
      }
      const e = 10 ** Math.max(c, d)
      return (this.mul(a, e) + this.mul(b, e)) / e
    },
    sub(a, b) {
      let c
      let d
      try {
        c = a.toString().split('.')[1].length
      } catch (f) {
        c = 0
      }
      try {
        d = b.toString().split('.')[1].length
      } catch (f) {
        d = 0
      }
      const e = 10 ** Math.max(c, d)
      return (this.mul(a, e) - this.mul(b, e)) / e
    },
    mul(a, b) {
      let c = 0
      const d = a.toString()
      const e = b.toString()
      try {
        c += d.split('.')[1].length
      } catch (f) { }
      try {
        c += e.split('.')[1].length
      } catch (f) { }
      return (Number(d.replace('.', '')) * Number(e.replace('.', ''))) / 10 ** c
    },
    div(a, b) {
      let e = 0
      let f = 0
      try {
        e = a.toString().split('.')[1].length
      } catch (c) { }
      try {
        f = b.toString().split('.')[1].length
      } catch (c) { }
      const c = Number(a.toString().replace('.', ''))
      const d = Number(b.toString().replace('.', ''))
      return this.mul(c / d, 10 ** (f - e))
    }
  },

  /**
   * 部分属性复制
   * @param {Object} obj 目标对象
   * @param {Array} attrs 所需属性
   * @param {Boolean} deep 深拷贝？ 默认：false
   * */
  pick(obj = {}, attrs = [], deep = false) {
    return attrs.reduce((i, v) => {
      v in obj && (i[v] = deep ? JSON.parse(JSON.stringify(obj[v])) : obj[v])
      return i
    }, {})
  },
}
