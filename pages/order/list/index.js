import __config from '../../../etc/config.js';

const App = getApp();

Page({
  data: {
    activeIndex: 0,
    navList: [],
    order: {},
    prompt: {
      hidden: !0,
      icon: '/assets/images/iconfont-order-default.png',
      title: '您还没有相关的订单',
      text: '可以去看看有哪些想买的',
    },
  },
  onLoad() {
    this.setData({
      navList: [
        { name: '全部', id: 'all' },
        { name: '已提交', id: 'submitted' },
        { name: '已付款', id: 'confirmed' },
        { name: '已发货', id: 'delivery' },
        { name: '已收货', id: 'thegoods' },
        { name: '已完成', id: 'finished' },
        { name: '已取消', id: 'canceled' }
      ]
    });

    this.getList();
    // this.onPullDownRefresh();
  },
  initData() {
    const order = this.data.order
    const params = order && order.params
    const type = params && params.type || 'all';

    this.setData({
      order: {
        items: [],
        params: {
          page: 1,
          limit: 10,
          type: type,
        },
        paginate: {}
      }
    })
  },
  navigateTo(e) {
    console.log(e);
    App.WxService.navigateTo('/pages/order/detail/index', {
      id: e.currentTarget.dataset.id
    })
  },
  getList() {
    var self = this;
    const order = this.data.order
    const params = order && order.params
    const type = params && params.type || 'all';

    var getMyOrderUrl = __config.basePath + '/user/order/lists';
    const requestTask = wx.request({
      url: getMyOrderUrl,
      method: "POST",
      data: { u_id: wx.getStorageSync('session_user_id'), type: type },
      success: function (e) {
        var result = e.data;

        if (result.data.length) {
          self.setData({
            order: {
              items: result.data,
              paginate: {
                total: 1
              }
            },
            prompt: {
              hidden: 1
            }
          });
        }else{
          self.setData({
            prompt: {
              hidden: 0,
              icon: '/assets/images/iconfont-order-default.png',
              title: '您还没有相关的订单',
              text: '可以去看看有哪些想买的',
            },
          });
        }
      }
    });
  },
  onPullDownRefresh() {
    console.info('onPullDownRefresh')
    this.initData();
    this.getList();
  },
  onReachBottom() {
    console.info('onReachBottom')
    if (!this.data.order.paginate.hasNext) return
    this.getList()
  },
  onTapTag(e) {
    const type = e.currentTarget.dataset.type
    const index = e.currentTarget.dataset.index
    this.initData();
    this.setData({
      activeIndex: index,
      'order.params.type': type,
    });
    this.getList();
  },
})