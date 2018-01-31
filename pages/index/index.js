import __config from '../../etc/config.js';

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
    //获取banner链接
    var getBannerUrl = __config.basePath + '/index/banner';
    //获取首页导航栏
    var getNavUrl = __config.basePath + '/index/navigation';

    this.getBanners(getBannerUrl); //获取页面banners
    this.getNavigation(getNavUrl); //获取页面navigation

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
  // 跳转到商品详情页面
  navigateTo(e) {
    App.WxService.navigateTo('/pages/goods/detail/index', {
      id: e.currentTarget.dataset.id
    });
  },
  search() {
    App.WxService.navigateTo('/pages/search/index');
  },
  getBanners(getBannerUrl) {
    var self = this;
    const requestTask = wx.request({
      url: getBannerUrl,
      success: function (e) {
        var result = e.data;
        if (result.status){
          self.setData({
            images: result.data
          });
        }else{
          console.log('暂时没有banner图片');
        }
      }
    });
  },
  getNavigation(getNavUrl){
    var self = this;
    const requestTask = wx.request({
      url: getNavUrl,
      success: function (e) {
        var result = e.data;
        if (result.status) {
          self.setData({
            navList: result.data.nav,
            goods:{
              items: result.data.goods,
              paginate: {total: 1}
            },
          });
        } else {
          console.log('暂时没有navigation图片');
        }
      }
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
    var url = __config.basePath + '/index/navigation/goods?id=' + type;
    
    var self = this;
    const requestTask = wx.request({
      url: url,
      success: function (e) {
        var result = e.data;
        if (result.status) {
          self.setData({
            goods: {
              items: result.data,
              paginate: { total: 1 }
            }
          });
        } else {
          console.log('暂时没有navigation图片');
        }
      }
    });
  },
})
