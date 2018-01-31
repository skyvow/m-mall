import __config from '../../../etc/config.js';

const App = getApp();

Page({
  data: {
    address: {},
    prompt: {
      hidden: !0,
      icon: '/assets/images/iconfont-addr-empty.png',
      title: '还没有收货地址呢',
      text: '暂时没有相关数据',
    },
  },
  onLoad() {
    this.onPullDownRefresh();
    // this.getList();
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
  toAddressEdit(e) {
    console.log(e)
    App.WxService.navigateTo('/pages/address/edit/index', {
      id: e.currentTarget.dataset.id
    })
  },
  toAddressAdd(e) {
    console.log(e)
    App.WxService.navigateTo('/pages/address/add/index')
  },
  setDefalutAddress(e) {
    const id = e.currentTarget.dataset.id;
    var self = this;

    var setDefaultAddressUrl = __config.basePath + "/user/address/set/default";
    const requestTask = wx.request({
      url: setDefaultAddressUrl,
      method: "POST",
      data: { u_id: wx.getStorageSync('session_user_id'), id: id },
      success: function (e) {
        var result = e.data;
        if(result.status){
          self.getList();
        }
      }
    });
  },
  getList() {
    var self = this;

    var getAddresUrl = __config.basePath + "/user/address";
    const requestTask = wx.request({
      url: getAddresUrl,
      method: "GET",
      data: { u_id: wx.getStorageSync('session_user_id') },
      success: function (e) {
        var result = e.data;
        if (!result.data.length) {
          self.setData({
            prompt: {
              hidden: 0,
              icon: '/assets/images/iconfont-addr-empty.png',
              title: '还没有收货地址呢',
              text: '暂时没有相关数据',
            }
          });
        } else {
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
    this.initData();
    this.getList();
  },
  onReachBottom() {
    console.info('onReachBottom')
    if (!this.data.address.paginate.hasNext) return
    this.getList()
  },
})