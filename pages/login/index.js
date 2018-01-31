import __config from '../../etc/config.js';

const App = getApp()

Page({
	data: {
		logged: !1,
    code:'',
	},
    onLoad() {},
    onShow() {
    	const token = App.WxService.getStorageSync('token')
    	this.setData({
    		logged: !!token
    	})
    	token && setTimeout(this.goIndex, 1500)
    },
    login() {
      var self = this;
      //wechat login 获取到code
      wx.login({
        success:function(e){
          self.setData({
            code:e.code
          });
          self.getSessionKey(e.code);
        }
      });
      return false;
    	// this.signIn(this.goIndex)
    },
    getSessionKey(code){
      var self = this;
      var requestUrl = __config.basePath + '/get/sessionkey';
      wx.request({
        url: requestUrl,
        data: { code: code },
        success:function(e){
          var userId = e.data.data;

          if(e.data.status){//登录商场系统成功，则记录此账号信息
            wx.setStorageSync('session_user_id', userId);
            self.goIndex();
          }else{
            self.goLogin();
          }
        }
      })
    },
    goIndex() {
    	App.WxService.switchTab('/pages/index/index');
    },
	showModal() {
		App.WxService.showModal({
            title: '友情提示', 
            content: '获取用户登录状态失败，请重新登录', 
            showCancel: !1, 
        })
	},
	wechatDecryptData() {
		let code

		App.WxService.login()
		.then(data => {
			console.log('wechatDecryptData', data.code)
			code = data.code
			return App.WxService.getUserInfo()
		})
		.then(data => {
			return App.HttpService.wechatDecryptData({
				encryptedData: data.encryptedData, 
				iv: data.iv, 
				rawData: data.rawData, 
				signature: data.signature, 
				code: code, 
			})
		})
		.then(data => {
            console.log(data)
		})
	},
	wechatSignIn(cb) {
		if (App.WxService.getStorageSync('token')) return
		App.WxService.login()
		.then(data => {
			console.log('wechatSignIn', data.code)
			return App.HttpService.wechatSignIn({
				code: data.code
			})
		})
		.then(res => {
			const data = res.data
			console.log('wechatSignIn', data)
			if (data.meta.code == 0) {
				App.WxService.setStorageSync('token', data.data.token)
				cb()
			} else if(data.meta.code == 40029) {
				App.showModal()
			} else {
				App.wechatSignUp(cb)
			}
		})
	},
	wechatSignUp(cb) {
		App.WxService.login()
		.then(data => {
			console.log('wechatSignUp', data.code)
			return App.HttpService.wechatSignUp({
				code: data.code
			})
		})
		.then(res => {
			const data = res.data
			console.log('wechatSignUp', data)
			if (data.meta.code == 0) {
				App.WxService.setStorageSync('token', data.data.token)
				cb()
			} else if(data.meta.code == 40029) {
				App.showModal()
			}
		})
	},
	signIn(cb) {
		if (App.WxService.getStorageSync('token')) return;
    console.log('点击了登录');
    // cb();
		// App.HttpService.signIn({
		// 	username: 'admin', 
		// 	password: '123456', 
		// })
		// .then(res => {
    //         const data = res.data
    //         console.log(data)
		// 	if (data.meta.code == 0) {
		// 		App.WxService.setStorageSync('token', data.data.token)
		// 		cb()
		// 	}
		// })
	},
})