const App = getApp()

Page({
    data: {
    	show: !0,
        form: {
			name   : null, 
			gender : 'male', 
			tel    : null, 
			address: '', 
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
    onLoad() {
    	this.WxValidate = new App.WxValidate(this, {
			'form.name': {
				required: '收货人姓名必填。', 
				minlength: 2, 
				maxlength: 10, 
			},
			'form.tel': {
				required: '收货人电话必填。', 
				tel: true, 
			},
			'form.address': {
				required: '收货人地址必填。', 
				minlength: 2, 
				maxlength: 100, 
			},
		})

        this.address = new App.HttpResource('/address/:id', {id: '@id'})
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
	switchChange (e){
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
		setTimeout(() => {
			const params = this.data.form
			console.log(params)

			if (!this.WxValidate.checkForm()) {
				const error = this.WxValidate.errorList[0]
				App.WxService.showModal({
					title: '友情提示', 
  					content: `${error.param} : ${error.msg}`, 
  					showCancel: !1, 
				})
				return false
			}

			// App.HttpService.postAddress(params)
			this.address.saveAsync(params)
			.then(data => {
				console.log(data)
				if (data.meta.code == 0) {
					this.showToast(data.meta.message)
				}
			})
		}, 300)
	},
	showToast(message) {
		App.WxService.showToast({
			title   : message, 
			icon    : 'success', 
			duration: 1500, 
		})
		.then(() => App.WxService.navigateBack())
	},
	chooseLocation() {
		App.WxService.chooseLocation()
	    .then(data => {
	        console.log(data)
	        this.setData({
	        	'form.address': data.address
	        })
	    })
	},
})