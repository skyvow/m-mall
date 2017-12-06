const App = getApp()

Page({
  data: {
    canEdit: !1,
    carts: {
      items: []
    },
    prompt: {
      hidden: !0,
      icon: '../../assets/images/iconfont-cart-empty.png',
      title: '购物车空空如也',
      text: '来挑几件好货吧',
      buttons: [
        {
          text: '随便逛',
          bindtap: 'bindtap',
        },
      ],
    },
  },
  bindtap(e) {
    const index = e.currentTarget.dataset.index

    switch (index) {
      case 0:
        App.WxService.switchTab('/pages/index/index')
        break
      default:
        break
    }
  },
  onLoad() {
    this.getCarts(); //获取购物车信息
  },
  onShow() {
    this.getCarts()
  },
  getCarts() {
    this.setData({
      carts: {
        items:
        [
          {
            goods: {
              thumb_url: '../../assets/images/87.gif',
              name: '含笑半步癫',
              price: 22,
              total: 2,
              amount: 22,
              totalAmount: 44
            }
          },
          {
            goods: {
              thumb_url: '../../assets/images/87.gif',
              name: '伸腿瞪眼丸',
              price: 23,
              total: 4,
              amount: 23,
              totalAmount: 92
            }
          },
        ],
      },

    });

  },
  onPullDownRefresh() {
    this.getCarts()
  },
  navigateTo(e) {
    console.log(e)
    App.WxService.navigateTo('/pages/goods/detail/index', {
      id: e.currentTarget.dataset.id
    })
  },
  confirmOrder(e) {
    console.log(e)
    App.WxService.setStorageSync('confirmOrder', this.data.carts.items)
    App.WxService.navigateTo('/pages/order/confirm/index')
  },
  del(e) {
    const id = e.currentTarget.dataset.id

    App.WxService.showModal({
      title: '友情提示',
      content: '确定要删除这个宝贝吗？',
    })
      .then(data => {
        if (data.confirm == 1) {
          App.HttpService.delCartByUser(id)
            .then(res => {
              const data = res.data
              console.log(data)
              if (data.meta.code == 0) {
                this.getCarts()
              }
            })
        }
      })
  },
  clear() {
    App.WxService.showModal({
      title: '友情提示',
      content: '确定要清空购物车吗？',
    })
      .then(data => {
        if (data.confirm == 1) {
          App.HttpService.clearCartByUser()
            .then(res => {
              const data = res.data
              console.log(data)
              if (data.meta.code == 0) {
                this.getCarts()
              }
            })
        }
      })
  },
  onTapEdit(e) {
    this.setData({
      canEdit: !!e.currentTarget.dataset.value
    })
  },
  bindKeyInput(e) {
    const id = e.currentTarget.dataset.id
    const total = Math.abs(e.detail.value)
    if (total < 0 || total > 100) return
    this.putCartByUser(id, {
      total: total
    })
  },
  putCartByUser(id, params) {
    App.HttpService.putCartByUser(id, params)
      .then(res => {
        const data = res.data
        console.log(data)
        if (data.meta.code == 0) {
          this.getCarts()
        }
      })
  },
  decrease(e) {
    const id = e.currentTarget.dataset.id
    const total = Math.abs(e.currentTarget.dataset.total)
    if (total == 1) return
    this.putCartByUser(id, {
      total: total - 1
    })
  },
  increase(e) {
    const id = e.currentTarget.dataset.id
    const total = Math.abs(e.currentTarget.dataset.total)
    if (total == 100) return
    this.putCartByUser(id, {
      total: total + 1
    })
  },
})