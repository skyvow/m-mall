import __config from '../../../etc/config.js';

const App = getApp();

Page({
  data: {
    hidden: !0,
    address: {}
  },
  onLoad(option) {
    console.log(option)
    this.setData({
      ret: option.ret
    })
    this.onPullDownRefresh()
  },
  initData() {
    this.setData({
      address: {
        items: [],
        params: {
          page: 1,
          limit: 10,
        },
        paginate: {}
      }
    })
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    App.WxService.redirectTo('/pages/order/confirm/index', {
      id: e.detail.value
    })
  },
  getAddressList() {

    var self = this;
    var u_id = wx.getStorageSync('session_user_id');

    var getDefaultAddressUrl = __config.basePath + '/user/address';
    const requestTask = wx.request({
      url: getDefaultAddressUrl,
      data: { u_id: u_id },
      success: function (e) {
        var result = e.data;
        if (result.status) {
          self.setData({
            prompt: {
              hidden: !0,
            },
            address: {
              items: result.data,
              paginate: { total: 1 },
            }
          });
        }
      }
    });


  },
  onPullDownRefresh() {
    this.initData()
    this.getAddressList()
  },
  onReachBottom() {
    this.lower()
  },
  lower() {
    if (!this.data.address.paginate.hasNext) return
    this.getAddressList()
  },
})