import polyfill from 'assets/plugins/polyfill'
import WxValidate from 'helpers/WxValidate'
import HttpResource from 'helpers/HttpResource'
import HttpService from 'helpers/HttpService'
import WxService from 'helpers/WxService'
import Tools from 'helpers/Tools'
import Config from 'etc/config'

App({
	onLaunch() {
		console.log('onLaunch')
		this.signIn()
		// this.wechatSignIn()
	},
	onShow() {
		console.log('onShow')
	},
	onHide() {
		console.log('onHide')
	},
	showModal() {
		this.WxService.showModal({
            title: '友情提示', 
            content: '获取用户登录状态失败，请重新登录', 
            showCancel: !1, 
        })
	},
	wechatSignIn() {
		if (this.WxService.getStorageSync('token')) return
		this.WxService.login()
		.then(data => {
			console.log('wechatSignIn', data.code)
			return this.HttpService.wechatSignIn({
				code: data.code
			})
		})
		.then(data => {
			console.log('wechatSignIn', data)
			if (data.meta.code == 0) {
				this.WxService.setStorageSync('token', data.data.token)
			} else if(data.meta.code == 40029) {
				this.showModal()
			} else {
				this.wechatSignUp()
			}
		})
	},
	wechatSignUp() {
		this.WxService.login()
		.then(data => {
			console.log('wechatSignUp', data.code)
			return this.HttpService.wechatSignUp({
				code: data.code
			})
		})
		.then(data => {
			console.log('wechatSignUp', data)
			if (data.meta.code == 0) {
				this.WxService.setStorageSync('token', data.data.token)
			} else if(data.meta.code == 40029) {
				this.showModal()
			}
		})
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
	WxValidate: (rules, messages) => new WxValidate(rules, messages), 
	HttpResource: (url, paramDefaults, actions, options) => new HttpResource(url, paramDefaults, actions, options).init(), 
	HttpService: new HttpService, 
	WxService: new WxService, 
	Tools: new Tools, 
	Config: Config, 
})