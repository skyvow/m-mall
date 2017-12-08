const App = getApp()

Page({
  data: {
    indicatorDots: !0,
    vertical: !1,
    autoplay: !1,
    interval: 3000,
    duration: 1000,
    current: 0,
    goods: {
      item: {}
    }
  },
  swiperchange(e) {
    this.setData({
      current: e.detail.current,
    })
  },
  onLoad(option) {
    // this.goods = App.HttpResource('/goods/:id', { id: '@id' })
    this.setData({
      id: option.id
    });
  },
  onShow() { //在这里获取默认数据
    this.getDetail(this.data.id);
  },
  addCart(e) {
    const goods = this.data.goods.item._id;
    
    //执行的是加入购物车
    this.showToast('加入购物车');
    // App.HttpService.addCartByUser(goods)
    //   .then(res => {
    //     const data = res.data
    //     console.log(data)
    //     if (data.meta.code == 0) {
    //       this.showToast(data.meta.message)
    //     }
    //   });
  },
  previewImage(e) {
    const urls = this.data.goods && this.data.goods.item.images.map(n => n.path)
    const index = e.currentTarget.dataset.index
    const current = urls[Number(index)]

    App.WxService.previewImage({
      current: current,
      urls: urls,
    })
  },
  showToast(message) {
    App.WxService.showToast({
      title: message,
      icon: 'success',
      duration: 1500,
    })
  },
  getDetail(id) {

    // 测试数据，真实数据要从接口请求获取
    this.setData({
      goods: {
        item: {
          images: [
            { path: '/assets/images/goods/goods_detail_1.jpeg' },
            { path: '/assets/images/goods/goods_detail_2.jpeg' },

          ],
          name:'含笑半步癫',
          price: 33,
          remark: '传说中的含笑半步癫，是以蜂蜜、川贝、桔梗，加上天山雪莲配制而成。今人糖白虎改以跳跳巧克力取而代之，不需冷藏，也没有防腐剂。除了生性猛烈之外，味道还很好！实在是居家旅行，整人自娱，必备良品！'
        }
      },
      total: 2
    });
  },
})