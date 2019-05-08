Page({
  data: {
    city: {
      options: [
        {
          id: 12,
          name: 'shanghai',
          child: [
            {
              id: 121,
              name: 'xuhui'
            }, {
              id: 122,
              name: 'putuo'
            }
          ]
        }, {
          id: 13,
          name: 'beijing',
          child: [
            {
              id: 131,
              name: 'nanhui'
            }, {
              id: 132,
              name: 'pingcheng'
            }
          ]
        }
      ],
      props: {
        label: 'name',
        value: 'id',
        children: 'child'
      },
      display: false,
      value: [] // 最终选择的值
    },
  },

  choose() {
    this.setData({
      'city.display': true
    })
  },

  onClose(v) {
    const { detail = {} } = v
    this.setData({
      'city.display': false,
      'city.value': detail.valueIns || []
    })
    console.log(detail)
  },
})
