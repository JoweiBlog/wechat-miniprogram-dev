// home
import fetch, { apis } from '../../core/fetch.js'

Page({
  data: {
    test: '',
  },
  
  onLoad: function () {

    // req
    fetch({
      ...apis.order.getOrderList,
      data: {
        page: 1,
        page_size: 10
      },
      resolve: (res) => {
        console.log(res)
      }
    })
  },
})
