const App = getApp()

Page({
	data: {
		userInfo: {},
		items: [
			{
				icon: '../../assets/images/iconfont-order.png',
				text: '我的订单',
				path: '/pages/order/list/index'
			}, 
			{
				icon: '../../assets/images/iconfont-addr.png',
				text: '收货地址',
				path: '/pages/address/list/index'
			}, 
			{
				icon: '../../assets/images/iconfont-kefu.png',
				text: '联系客服',
				path: '18521708248',
			}, 
			{
				icon: '../../assets/images/iconfont-help.png',
				text: '常见问题',
			},
		],
	},
	onLoad() {
		const that = this
		const userInfo = App.globalData.userInfo

		if (userInfo) {
			that.setData({
				userInfo: userInfo
			})
			return
		}

		App.getUserInfo()
		.then(data => {
			console.log(data)
			that.setData({
				userInfo: data
			})
		})
	},
	navigateTo(e) {
		const index = e.currentTarget.dataset.index
		const path = e.currentTarget.dataset.path

		switch(index) {
			case '2':
				App.WxService.makePhoneCall({
					phoneNumber: path
				})
				break
			default:
				App.WxService.navigateTo(path)
		}
    },
})