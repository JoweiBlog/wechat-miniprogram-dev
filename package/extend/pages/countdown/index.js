Page({
  data: {
    timer: {
      time: 10, // s
      format: 'dd天hh时mm分ss秒',
      sign: 'TIMER_1' // 当单页多个组件使用时需要 标识每个组件
    },
    count: {
      time: 43895,
      format: 'hh:mm:ss',
      timeStyle: 'color: red',
      symbolStyle: 'padding: 0 5px;',
      sign: 'TIMER_2'
    }
  },

  onRunning(v) {
    const {detail = {}} = v
    console.log(detail.sign, detail.time)
  },

  onEnd(v) {
    const { detail = {} } = v
    console.log(detail.sign, '结束.')
  },

})
