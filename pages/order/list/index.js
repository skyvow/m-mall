const App = getApp()

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
        { name: '已确认', id: 'confirmed' },
        { name: '已完成', id: 'finished' },
        { name: '已取消', id: 'canceled' }
      ]
    });

    this.getList();
    this.onPullDownRefresh();
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
    this.setData({
      order: {
        items: [
          {
            _id: 1,
            totalAmount: 126,
            items: [
              {
                goods: {
                  name: '含笑半步癫'
                },
                meta: {
                  total: 2,
                  totalAmount: 66
                }
              },
              {
                goods: {
                  name: '十香软筋散'
                },
                meta: {
                  total: 3,
                  totalAmount: 60
                }
              }
            ],
          },
        ],
        paginate: {
          total: 1
        }
      },
      prompt: {
        hidden: 1
      }

    });

    // const order = this.data.order
    // const params = order.params

    // // App.HttpService.getOrderList(params)
    // this.order.queryAsync(params)
    // .then(res => {
    //     const data = res.data
    //     console.log(data)
    //     if (data.meta.code == 0) {
    //         order.items = [...order.items, ...data.data.items]
    //         order.paginate = data.data.paginate
    //         order.params.page = data.data.paginate.next
    //         order.params.limit = data.data.paginate.perPage
    //         this.setData({
    //             order: order,
    //             'prompt.hidden': order.items.length,
    //         })
    //     }
    // })
  },
  onPullDownRefresh() {
    console.info('onPullDownRefresh')
    // this.initData();
    // this.getList();
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

    console.log(type);
  },
})