import fetch, { apis } from '../../../../core/fetch.js'

Page({
  data: {
    
  },

  getSomething() {
    // req
    fetch({
      ...apis.order.getOrderList,
      data: {
        page: 1,
        page_size: 10
      },
      succ: (res) => {
        console.log(res)
      },
      fail: (err) => {
        console.log(err)
      },
      done: () => {
        wx.showModal({
          title: 'fetch已结束',
          content: '',
        })
      }
    })
  },

  onLoad() {
    this.getSomething()
  }
})
