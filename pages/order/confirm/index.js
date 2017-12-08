const App = getApp()

Page({
  data: {
    hidden: !0,
    carts: {},
    address: {
      item: {},
    }
  },
  onLoad(option) {
    console.log(option);
    this.setData({
      address_id: 3,//option.id, //地址编号
      totalAmount: 126,
      address: {
        item: {
          name: 'JackYang',
          gender: 'boy',
          tel: '13123456789',
          address: '重庆市江北区金融城华夏银行19楼'
        }
      },
      carts: {
        totalAmount: 126,
        items: [
          {
            goods: {
              _id:1,
              name: '含笑半步癫'
            },
            total: 2,
            totalAmount: 66
          },
          {
            goods: {
              _id:2,
              name: '十香软筋散'
            },
            total: 3,
            totalAmount: 60
          }
        ],
      }
    });

    // const carts = {
    //   items: App.WxService.getStorageSync('confirmOrder'),
    //   totalAmount: 0,
    // }

    // carts.items.forEach(n => carts.totalAmount += n.totalAmount)

    // this.setData({
    //   carts: carts
    // })

    // console.log(this.data.carts)
  },
  onShow() {
    const address_id = this.data.address_id
    if (address_id) {
      // this.getAddressDetail(address_id)
    } else {
      // this.getDefalutAddress()
    }
  },
  redirectTo(e) {
    console.log(e)
    App.WxService.redirectTo('/pages/address/confirm/index', {
      ret: this.data.address_id
    })
  },
  getDefalutAddress() {
    App.HttpService.getDefalutAddress()
      .then(res => {
        const data = res.data
        console.log(data)
        if (data.meta.code == 0) {
          this.setData({
            address_id: data.data._id,
            'address.item': data.data,
          })
        } else {
          this.showModal()
        }
      })
  },
  showModal() {
    App.WxService.showModal({
      title: '友情提示',
      content: '没有收货地址，请先设置',
    })
      .then(data => {
        console.log(data)
        if (data.confirm == 1) {
          App.WxService.redirectTo('/pages/address/add/index')
        } else {
          App.WxService.navigateBack()
        }
      })
  },
  getAddressDetail(id) {
    App.HttpService.getAddressDetail(id)
      .then(res => {
        const data = res.data
        console.log(data)
        if (data.meta.code == 0) {
          this.setData({
            'address.item': data.data
          })
        }
      })
  },
  addOrder() {
    const address_id = this.data.address_id
    const params = {
      items: [],
      address_id: address_id,
    }
    this.data.carts.items.forEach(n => {
      params.items.push({
        id: n.goods._id,
        total: n.total,
      })
    })
    console.log(params);
    console.log('提交订单');
    console.log('订单提交成功之后进入支付操作，成功后再进入订单详情页面');
    App.WxService.redirectTo('/pages/order/detail/index', {});
  },
  clear() {
    App.HttpService.clearCartByUser()
      .then(res => {
        const data = res.data
        console.log(data)
      })
  },
})