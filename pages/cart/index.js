import __config from '../../etc/config.js';

const App = getApp();

Page({
  data: {
    canEdit: !1,
    carts: {
      items: []
    },
    prompt: {
      hidden: 0,
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
    this.getCarts();
  },
  onShow() {
    this.getCarts();
  },
  getCarts() {
    var getCartsGoodsUrl = __config.basePath + '/carts';
    var session_id = wx.getStorageSync('session_user_id');
    var self = this;

    const requestTask = wx.request({
      url: getCartsGoodsUrl,
      data: { u_id: session_id },
      success: function (e) {
        var result = e.data;
        if (result.data.length) {
          self.setData({
            carts: { items: result.data },
            prompt: { hidden: !0 }
          });
        }
      }
    });
  },
  onPullDownRefresh() {
    this.getCarts()
  },
  navigateTo(e) {
    App.WxService.navigateTo('/pages/goods/detail/index', {
      id: e.currentTarget.dataset.id
    });
  },
  confirmOrder(e) {
    wx.showLoading({
      title: '提交中...',
    });

    setTimeout(function () {
      wx.hideLoading();
      App.WxService.navigateTo('/pages/order/confirm/index');
    }, 2000)
  },
  del(e) {
    const id = e.currentTarget.dataset.id;
    var self = this;

    wx.showModal({
      title: '友情提示',
      content: '确定要删除这个宝贝吗？',
      success: function (e) {
        if (e.confirm) {
          self.delGoodsAction(id,self);
        }
      }
    });
  },
  delGoodsAction(id,self) {
    var delCartsGoodsUrl = __config.basePath + "/carts/del/goods";
    const requestTask = wx.request({
      url: delCartsGoodsUrl,
      method: 'POST',
      data: { id: id },
      success: function (e) {
        var result = e.data;
        console.log('到这里了');
        self.getCarts();
      }
    });
  },
  clear() {
    var self = this;
    var u_id = wx.getStorageSync('session_user_id');
    wx.showModal({
      title: '友情提示',
      content: '确定要清空购物车吗？',
      success: function (e) {
        if (e.confirm) {
          self.clearCartsAction(u_id);
        }
      }
    });
  },
  clearCartsAction(u_id) {
    var self = this;
    var clearCartsGoodsUrl = __config.basePath + "/carts/clear";

    const requestTask = wx.request({
      url: clearCartsGoodsUrl,
      method: 'POST',
      data: { u_id: u_id },
      success: function (e) {
        var result = e.data;
        console.log(result);
        if (result.status) {
          self.getCarts();
          self.setData({
            carts: {},
            prompt: {
              hidden: 0,
              icon: '../../assets/images/iconfont-cart-empty.png',
              title: '购物车空空如也',
              text: '来挑几件好货吧',
              buttons: [
                {
                  text: '随便逛',
                  bindtap: 'bindtap',
                },
              ],
            }
          });
        }
      }
    });
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
    });

    console.log(e.detail.value);
  },
  putCartByUser(id, params) {
    var self = this;
    var saveTotalUrl = __config.basePath + "/carts/total/save";
    const requestTask = wx.request({
      url: saveTotalUrl,
      method: 'POST',
      data: { id: id, params: params },
      success: function (e) {
        var result = e.data;
        console.log(result);
        self.getCarts();
      }
    });
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