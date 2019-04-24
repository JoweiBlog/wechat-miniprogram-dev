  /**
   * 级联选择器
   * 
   * prop:
   * @display: 显示/隐藏
   * @options: 源数据
   * @props:  可配置 级联 属性名， 默认：{ label: 'label', value: 'value', children: 'children' }
   * @_default: 可设置默认选择项； 默认 []
   * event:
   * @bind:close:  选择器关闭触发，返回：
   *  { 
   *    type: 'cancel',  // cancel: 取消选择/点击遮罩层； submit: 确认
   *    valueIns: [],     // 返回已选择的下标；(深度层级)
   *    valueArr: [],     // 返回已选择的下标对应 option 内容
   *  }
   * 
  */

Component({
  properties: {
    display: {
      type: Boolean,
      value: false,
      observer(nv, ov, cp) {
        this.setData({ '_display': nv || false })
      },
    },
    options: {
      // 以： label/value/children 为默认配置属性；
      type: Array, // [{ label: '', value: '', children: [...{ label, value }] }]
      value: [],
      observer: '_initOpt',
    },
    _default: {
      type: Array,
      value: [],
    },
    props: {
      type: Object,
      value: {},
    }
  },

  data: {
    _display: false,
    _ops: [],
    _value: [],
  },

  methods: {

    bindBtn(e) {
      if (this._pickerLock) return  // 基础库 >= v2.3.1 有效

      const _t = e.currentTarget.dataset.type || ''
      this.setData({ '_display': false })
      this.triggerEvent('close', {
        type: _t,  // 'cancel' || 'submit'
        valueIns: this.data._value, // 所选 index 数组
        valueArr: this.data._ops.map((v, i) => v[this.data._value[i]]) // 所选 value 数组
      })
    },

    bindChange(e) {
      let _v = e.detail.value || []
      let _ov = (this.data._value || []).slice(0, -1)

      let _diffIn = _v.slice(0, -1).findIndex((v, i) => _ov[i] !== v)
      if (_diffIn > -1) {
        _v.fill(0, _diffIn + 1)
        this.setData({
          '_ops': this._formatOps(this.data.options, _v)
        }, () => {
          // 滞后更新： 防止 _value 先与_ops 改变，导致数据多次异常更新
          this.setData({ '_value': _v })
        })
      } else {
        this.setData({ '_value': _v })
      }
    },

    bindChangeStart() {
      this._pickerLock = true
    },

    bindChangeEnd() { 
      this._pickerLock = false 
    },

    _initOpt(nv) {
      const _def = this.data._default || []
      const { label, value, children } = this.data.props || {}

      this.setData({
        '_props': {
          value: value || 'value',
          label: label || 'label',
          children: children || 'children'
        }
      }, () => {
        this.setData({
          '_ops': this._formatOps(nv || [], _def)
        }, () => {
          this.setData({
            '_value': (_def.length <= 0)
              ? new Array(this.data._ops.length).fill(0)
              : _def,
          })
        })
      })
    },

    // arr: 源数据； ins: 已选项
    _formatOps(arr = [], ins = []) {
      if (arr.length <= 0) return []

      const { label, value, children} = this.data._props
      let _ins = JSON.parse(JSON.stringify(ins))
      let _child = (arr[_ins[0] || 0] || {})[children]
      let _r = [arr.map(ri => {
        let _o = {}
        _o[label] = ri[label]
        _o[value] = ri[value]
        return _o
      })]

      if (_child && _child.length > 0) {
        _ins.length > 0 && _ins.splice(0, 1)
        _r = [..._r, ...this._formatOps(_child, _ins)]
      }
      
      return _r
    },
  }
})
