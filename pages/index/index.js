const App = getApp()

Page({
  data: {
    activeIndex: 0,
    navList: [],
    indicatorDots: !0,
    autoplay: !1,
    current: 0,
    interval: 3000,
    duration: 1000,
    circular: !0,
    goods: {},
    prompt: {
      hidden: !0,
    },
  },
  swiperchange(e) {
    // console.log(e.detail.current)
  },
  onLoad() {
    this.getBanners(); //获取页面banners

    this.setData({

      navList: [
        { id: 1, name: '好吃的' },
        { id: 2, name: '好喝的' },
        { id: 3, name: '好玩的' }
      ],

      goods: {
        items: [
          { id: 1, name: '含笑半步癫', price: 33 },
          { id: 2, name: '七星海棠', price: 50 },
          { id: 3, name: '伸腿瞪眼丸', price: 40 },
          { id: 4, name: '九芝堂浓缩六味地黄丸', price: 20 },
        ],
        paginate: {
          total: 1
        }
      },

    });
  },
  initData() {
    const type = this.data.goods.params && this.data.goods.params.type || ''
    const goods = {
      items: [],
      params: {
        page: 1,
        limit: 10,
        type: type,
      },
      paginate: {}
    };

    this.setData({
      goods: goods
    });
  },
  navigateTo(e) {
    App.WxService.navigateTo('/pages/goods/detail/index', {
      id: e.currentTarget.dataset.id
    });
  },
  search() {
    App.WxService.navigateTo('/pages/search/index');
  },
  getBanners() {
    this.setData({
      images: [
        { path: '../../assets/images/banner1.jpeg' },
        { path: '../../assets/images/banner2.jpg' },
      ]
    });

  },
  getClassify() {
    const activeIndex = this.data.activeIndex;
  },
  getList() {
    const goods = this.data.goods
    const params = goods.params

    // App.HttpService.getGoods(params)
    this.goods.queryAsync(params)
      .then(res => {
        const data = res.data
        console.log(data)
        if (data.meta.code == 0) {
          data.data.items.forEach(n => n.thumb_url = App.renderImage(n.images[0] && n.images[0].path))
          goods.items = [...goods.items, ...data.data.items]
          goods.paginate = data.data.paginate
          goods.params.page = data.data.paginate.next
          goods.params.limit = data.data.paginate.perPage
          this.setData({
            goods: goods,
            'prompt.hidden': goods.items.length,
          })
        }
      })
  },
  onPullDownRefresh() {
    console.info('执行的下拉刷新: onPullDownRefresh');
    // this.initData()
    // this.getList()
  },
  onReachBottom() {
    console.info('执行的上拉刷新: onReachBottom');

    // if (!this.data.goods.paginate.hasNext) return
    // this.getList()
  },
  onTapTag(e) {
    const type = e.currentTarget.dataset.type;
    const index = e.currentTarget.dataset.index;

    this.setData({
      activeIndex: index,
    });

    // 查询相应类型的数据  然后修改goods 的数据
    this.setData({
      goods: {
        items: [
          { id: 1, name: '含笑半步癫' + type, price: 33 },
          { id: 2, name: '七星海棠' + type, price: 50 },
          { id: 3, name: '伸腿瞪眼丸' + type, price: 40 },
          { id: 4, name: '九芝堂浓缩六味地黄丸' + type, price: 20 },
        ],
        paginate: {
          total: 1
        }
      },
    });
  },
})
