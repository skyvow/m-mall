import HttpService from 'helpers/HttpService'
import WxService from 'helpers/WxService'
import Tools from 'helpers/tools'
import Config from 'etc/config'

App({
	onLaunch: function () {
		console.log('onLaunch')
		if (this.WxService.getStorageSync('token')) return
		this.HttpService.signIn({
			username: 'admin', 
			password: '123456', 
		})
		.then(data => {
			console.log(data)
			if (data.meta.code == 0) {
				this.WxService.setStorageSync('token', data.data.token)
			}
		})
	},
	onShow: function() {
		console.log('onShow')
	},
	onHide: function() {
		console.log('onHide')
	},
	getUserInfo: function() {
		return this.WxService.login()
		.then(data => {
			console.log(data)
			return this.WxService.getUserInfo()
		})
		.then(data => {
			console.log(data)
			this.globalData.userInfo = data.userInfo
			return this.globalData.userInfo
		})
	},
	globalData: {
		userInfo: null
	},
	renderImage: function(path) {
        if (!path) return ''
        if (path.indexOf('http') !== -1) return path
        return `${this.Config.fileBasePath}${path}`
    },
	HttpService: HttpService, 
	WxService: new WxService, 
	Tools: new Tools, 
	Config: Config, 
})