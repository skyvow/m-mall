const App = getApp()

Page({
  data: {
    show: !0,
    form: {
      name: '',
      gender: 'male',
      tel: '',
      address: '',
      is_def: !1,
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
    this.WxValidate = App.WxValidate({
      name: {
        required: true,
        minlength: 2,
        maxlength: 10,
      },
      tel: {
        required: true,
        tel: true,
      },
      address: {
        required: true,
        minlength: 2,
        maxlength: 100,
      },
    }, {
        name: {
          required: '请输入收货人姓名',
        },
        tel: {
          required: '请输入收货人电话',
        },
        address: {
          required: '请输入收货人地址',
        },
      })

    // this.address = App.HttpResource('/address/:id', { id: '@id' });
    this.setData({
      id: option.id
    });
  },
  onShow() {
    this.renderForm(this.data.id)
  },
  renderForm(id) {
    this.setData({
      form: {
        name: 'Jack Yang',
        gender: 'male',
        tel: '13123456789',
        address: '重庆市江北区江北城华夏银行19楼',
        is_def: !1,
      }
    });
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const params = e.detail.value
    const value = e.detail.value
    const radio = this.data.radio
    radio.forEach(n => n.checked = n.value === value)
    this.setData({
      radio: radio,
      'form.gender': value,
    })
  },
  submitForm(e) {
    const params = e.detail.value
    const id = this.data.id

    console.log(params)

    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      App.WxService.showModal({
        title: '友情提示',
        content: `${error.param} : ${error.msg}`,
        showCancel: !1,
      })
      return false
    }

    console.log('确定提交编辑信息');
    this.showToast('编辑成功')
    return false;

    // App.HttpService.putAddress(id, params)
    this.address.updateAsync({ id: id }, params)
      .then(res => {
        const data = res.data
        console.log(data)
        if (data.meta.code == 0) {
          
        }
      })
  },
  delete() {
    const id = this.data.id;
    console.log('执行删除操作');
  },
  showToast(message) {
    App.WxService.showToast({
      title: message,
      icon: 'success',
      duration: 15000,
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