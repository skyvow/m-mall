const App = getApp()

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

    console.log('获取订单详情');

    this.setData({
      order: {
        item: {
          totalAmount: 126,
          items: [
            {
              goods: {
                name: '含笑半步癫',
              },
              meta: {
                total: 2,
                totalAmount: 66
              }
            },
            {
              goods: {
                name: '十香软筋散',
              },
              meta: {
                total: 3,
                totalAmount: 60
              }
            },
          ],
          _id: '972056448095213500801',
          recipientName: 'JackYang',
          recipientGender: 'boy',
          recipientTel: 13123456789,
          recipientAddress: '重庆市江北区江北城金融街华夏银行19楼',
          created_at:'2017-12-8 10:04:00'
        }
      }
    });

    // App.HttpService.getOrderDetail(id)
    // this.order.getAsync({id: id})
    // .then(res => {
    //     const data = res.data
    //     console.log(data)
    //     if (data.meta.code == 0) {
    //         this.setData({
    //             'order.item': data.data
    //         })
    //     }
    // });
  },
})