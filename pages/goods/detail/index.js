import __config from '../../../etc/config.js';

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
    this.setData({
      id: option.id
    });
  },
  onShow() { //在这里获取默认数据
    //获取商品详情
    var goodsDetailsUrl = __config.basePath + "/goods/detail";
    this.getDetail(this.data.id, goodsDetailsUrl);
  },
  addCart(e) {
    var self = this;
    const goods = this.data.goods.item.id;
    var addCardUrl = __config.basePath + "/goods/detail/addcart";

    //执行的是加入购物车
    const requestTask = wx.request({
      url: addCardUrl,
      method: "POST",
      data: { id: goods, u_id: wx.getStorageSync('session_user_id') },
      success: function (e) {
        var result = e.data;
        if (result.status) {
          self.showToast(result.message);
        }
      }
    });
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
  getDetail(id, goodsDetailsUrl) {
    var self = this;
    const requestTask = wx.request({
      url: goodsDetailsUrl,
      data: { id: id },
      success: function (e) {
        var result = e.data;
        if (result.status) {
          self.setData({
            goods: {
              item: result.data
            },
            total: result.data.total

          });
        } else {
          console.log('暂时没有banner图片');
        }
      }
    });
  },
})