import HttpResource from 'helpers/HttpResource'
import HttpService from 'helpers/HttpService'
import WxService from 'helpers/WxService'
import Tools from 'helpers/Tools'
import Config from 'etc/config'

App({
	onLaunch() {
		console.log('onLaunch')
		this.signIn()
	},
	onShow() {
		console.log('onShow')
	},
	onHide() {
		console.log('onHide')
	},
	signIn() {
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
	getUserInfo() {
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
	renderImage(path) {
        if (!path) return ''
        if (path.indexOf('http') !== -1) return path
        return `${this.Config.fileBasePath}${path}`
    },
	HttpResource: HttpResource, 
	HttpService: new HttpService, 
	WxService: new WxService, 
	Tools: new Tools, 
	Config: Config, 
})