import __config from '../../../etc/config.js';

const App = getApp();

Page({
  data: {
    order: {
      item: {},
    },
  },
  onLoad(option) {
    this.setData({
      id: option.id
    });
  },
  onShow() {
    this.getOrderDetail(this.data.id);
  },
  getOrderDetail(id) {
    var self = this;

    var getOrderDetailUrl = __config.basePath + '/user/order/details';
    const requestTask = wx.request({
      url: getOrderDetailUrl,
      method: "POST",
      data: { u_id: wx.getStorageSync('session_user_id'), id: id },
      success: function (e) {
        var result = e.data;
        self.setData({
          order: {
            item: { 
              totalAmount: result.data.order_amount,
              items: result.data.items,
              _id: result.data.order_sn,
              recipientName: result.data.buy_name,
              recipientGender: result.data.sex,
              recipientTel: result.data.tel,
              recipientAddress: result.data.address,
              created_at: result.data.create_time
            }
          }
        });
      }
    });
  }
});