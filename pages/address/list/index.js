const App = getApp()

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
    console.log('收货地址管理');
    // this.address = App.HttpResource('/address/:id', {id: '@id'});
    this.onPullDownRefresh();

    console.log(this.data.address);
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
    console.log('设置默认收货地址,设置的编号为: ' + id);
    // App.HttpService.setDefalutAddress(id)
    // .then(res => {
    //     const data = res.data
    //     console.log(data)
    //     if (data.meta.code == 0) {
    //         this.onPullDownRefresh()
    //     }
    // });
  },
  getList() {
    const address = this.data.address;
    const params = address.params;

    console.log('获取收货地址列表数据');

    this.setData({
      address: {
        items: [
          {
            _id: 1,
            name: 'JackYang', gender: 'boy', tel: 13123456789,
            address: '重庆市江北区江北城金融街华夏银行19楼',
            is_def: true
          },

          {
            _id: 2,
            name: '沈璧君', gender: 'female', tel: 13123456789,
            address: '重庆市江北区观音桥A座',
            is_def: false
          }
        ],
        paginate: { total: 1 },

      }
    });

    // App.HttpService.getAddressList(params)
    // this.address.queryAsync(params)
    // .then(res => {
    //     const data = res.data
    //     console.log(data)
    //     if (data.meta.code == 0) {
    //         address.items = [...address.items, ...data.data.items]
    //         address.paginate = data.data.paginate
    //         address.params.page = data.data.paginate.next
    //         address.params.limit = data.data.paginate.perPage
    //         this.setData({
    //             address: address,
    //             'prompt.hidden': address.items.length,
    //         })
    //     }
    // });
  },
  onPullDownRefresh() {
    console.info('onPullDownRefresh')
    this.initData()
    this.getList()
  },
  onReachBottom() {
    console.info('onReachBottom')
    if (!this.data.address.paginate.hasNext) return
    this.getList()
  },
})