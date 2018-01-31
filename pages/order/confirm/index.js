import __config from '../../../etc/config.js';

const App = getApp()

Page({
  data: {
    hidden: !0,
    carts: {},
    address: {
      item: {},
    },
    address_id: null
  },
  onLoad(option) {
    console.log(option);
    var u_id = wx.getStorageSync('session_user_id');

    if (option.id) { //有改变订单收货地址
      this.changeAddress(option.id);
    } else {
      //获取地址信息
      this.getAddress(u_id);
    }
  },
  onShow() {
    //商品数据
    this.getOrderGoodsData(wx.getStorageSync('session_user_id'));
  },
  getOrderGoodsData(u_id) {
    var self = this;

    var getOrderGoodsUrl = __config.basePath + '/order/confirm/goods';
    const requestTask = wx.request({
      url: getOrderGoodsUrl,
      method: "POST",
      data: { u_id: u_id },
      success: function (e) {
        var result = e.data;

        if (result.status) {
          self.setData({
            carts: {
              totalAmount: result.data.all_amount,
              items: result.data.goods,
            }
          });
        }
      }
    });
  },
  changeAddress(id) {
    var self = this;

    var getAddressUrl = __config.basePath + '/user/address/info';
    const requestTask = wx.request({
      url: getAddressUrl,
      method: "POST",
      data: { id: id },
      success: function (e) {
        var result = e.data;

        if (result.status) {
          self.setData({
            address_id: result.data.id,//option.id, //地址编号
            address: {
              item: {
                name: result.data.name,
                gender: result.data.sex,
                tel: result.data.phone,
                address: result.data.address,
                _id: result.data.id
              }
            },
          });
        } else {
          self.showModal();
        }
      }
    });
  },
  getAddress(u_id) {
    var self = this;

    var getDefaultAddressUrl = __config.basePath + '/order/confirm/default/address';
    const requestTask = wx.request({
      url: getDefaultAddressUrl,
      data: { u_id: u_id },
      success: function (e) {
        var result = e.data;

        if (result.status) {
          self.setData({
            address_id: result.data.id,//option.id, //地址编号
            address: {
              item: {
                name: result.data.name,
                gender: result.data.sex,
                tel: result.data.phone,
                address: result.data.address,
                _id: result.data.id
              }
            },
          });
        } else {
          self.showModal();
        }
      }
    });
  },
  redirectTo(e) {
    console.log(e)
    App.WxService.redirectTo('/pages/address/confirm/index', {
      ret: this.data.address_id
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
    });

    console.log(params);
    console.log('提交订单');
    console.log('订单提交成功之后进入支付操作，成功后再进入订单详情页面');


    var addOrderUrl = __config.basePath + '/order/confirm';
    var data = {
      u_id: wx.getStorageSync('session_user_id'),
      dbs: params
    };
    const requestTask = wx.request({
      url: addOrderUrl,
      method: "POST",
      data: data,
      success: function (e) {
        var result = e.data;
        console.log(result);
        App.WxService.redirectTo('/pages/order/detail/index',
          { pay_sn: result.data.pay_sn, amount: result.data.order_amount});
      }
    });
    
  },
  clear() {
    App.HttpService.clearCartByUser()
      .then(res => {
        const data = res.data
        console.log(data)
      })
  },
})