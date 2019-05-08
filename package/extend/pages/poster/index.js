// 海报配置
const config = {
  width: 750,
  height: 1200,
  image: [
    {
      url: 'https://joweiblog.oss-cn-shanghai.aliyuncs.com/x.png',
      width: 750,
      height: 1000,
      x: 0,
      y: 0,
      borderRadius: 50,
      borderWidth: 1,
      zIndex: 2,
    }
  ],
  text: [
    {
      text: 'I am Groot.',
      x: 375,
      y: 1050,
      color: '#fff',
      fontSize: 48,
      textAlign: 'center',
      zIndex: 4
    }
  ],
  block: [
    {
      width: 750,
      height: 300,
      x: 0,
      y: 900,
      borderRadius: 50,
      borderWidth: 1,
      bgColor: {
        type: 'linear',
        x1: 0,
        y1: 1200,
        x2: 0,
        y2: 900,
        colorStep: [
          [0, '#717b9c'],
          [1, '#283049'],
        ]
      },
      zIndex: 3,
    },
    {
      width: 700,
      height: 1150,
      x: 25,
      y: 25,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: '#fff',
      zIndex: 4,
    },
  ]
}

Page({
  data: {
    config: config,
    img: '',
    autoMake: false,
  },

  onMakeSucc(v) {
    this.setData({
      'img': v.detail || ''
    })
  },

  onMakeFail(e) {
    console.log(e)
  },
})


