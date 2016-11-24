const App = getApp()

Page({
    data: {
    	show: !0,
        form: {
			name   : null, 
			gender : 'male', 
			tel    : null, 
			address: null, 
			is_def : !1, 
        },
        radio: [
            {
            	name: '先生', 
            	value: 'male', 
            	checked: !0, 
            },
            {
            	name: '女士', 
            	value: 'female', 
            },
        ],
    },
    onLoad(option) {
    	this.renderForm(option.id)
    	this.setData({
    		id: option.id
    	})
    },
    renderForm(id) {
    	App.HttpService.getAddressDetail(id)
		.then(data => {
			console.log(data)
			if (data.meta.code == 0) {
				const params = {
					name   : data.data.name, 
					gender : data.data.gender, 
					tel    : data.data.tel, 
					address: data.data.address, 
					is_def : data.data.is_def, 
				}

				const radio = this.data.radio
				radio.forEach(n => n.checked = n.value === data.data.gender)

				this.setData({
					show : !params.is_def, 
					radio: radio, 
					form : params, 
				})
			}
		})
    },
    radioChange(e) {
		console.log('radio发生change事件，携带value值为：', e.detail.value)
		const value = e.detail.value
		const radio = this.data.radio
		radio.forEach(n => n.checked = n.value === value)
		this.setData({
			radio: radio, 
			'form.gender': value, 
		})
	},
	switchChange(e) {
		console.log('switch 发生 change 事件，携带值为', e.detail.value)
		this.setData({
			'form.is_def': e.detail.value, 
		})
	},
	bindKeyInput(e) {
		const model  = e.currentTarget.dataset.model
		const value  = e.detail.value
		const params = {}
		params[model] = value
		this.setData(params)
	},
	submitForm() {
		const id = this.data.id
		const params = this.data.form
		console.log(params)
		App.HttpService.putAddress(id, params)
		.then(data => {
			console.log(data)
			if (data.meta.code == 0) {
				this.showToast(data.meta.message)
			}
		})
	},
	delete() {
		App.HttpService.deleteAddress(this.data.id)
		.then(data => {
			console.log(data)
			if (data.meta.code == 0) {
				this.showToast(data.meta.message)
			}
		})
	},
	showToast(message) {
		App.WxService.showToast({
			title   : message, 
			icon    : 'success', 
			duration: 1500, 
		})
		.then(() => App.WxService.redirectTo('/pages/address/index'))
	},
})