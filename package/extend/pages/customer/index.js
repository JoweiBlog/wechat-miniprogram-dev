Page({
  data: {
    barBg: 'rgba(255,255,255,0)'
  },
  onLoad() {},
  onPageScroll(v) {
    const limit = 200
    const opacity = (Math.max(0, v.scrollTop) / limit).toFixed(2) 
    this.setData({
      barBg: `rgba(255,255,255, ${opacity})`
    })
  }
})