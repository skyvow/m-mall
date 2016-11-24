const App = getApp()

Page({
	data: {
		userInfo: {},
		items: [
			{
				icon: '../../assets/images/iconfont-order.png',
				text: '我的订单',
				path: '/pages/order/index'
			}, 
			{
				icon: '../../assets/images/iconfont-addr.png',
				text: '收货地址',
				path: '/pages/address/index'
			}, 
			{
				icon: '../../assets/images/iconfont-kefu.png',
				text: '联系客服',
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
        console.log(e)
        App.WxService.navigateTo(e.currentTarget.dataset.path)
    },
})