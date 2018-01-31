import __config from '../../../etc/config.js';

const App = getApp();

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
    //获取收货地址信息
    this.renderForm(this.data.id)
  },
  renderForm(id) {
    var self = this;

    var getAddressUrl = __config.basePath + "/user/address/info";
    const requestTask = wx.request({
      url: getAddressUrl,
      method: "POST",
      data: { id: id },
      success: function (e) {
        var result = e.data;
        if (result.status) {

          if (result.data.sex == 'female') {
            var radio = [
              { name: '先生', value: 'male' },
              { name: '女士', value: 'female', checked: !0, },
            ];
          } else {
            var radio = [
              { name: '先生', value: 'male', checked: !0 },
              { name: '女士', value: 'female' },
            ];
          }

          self.setData({
            form: {
              name: result.data.name,
              gender: result.data.sex,
              tel: result.data.phone,
              address: result.data.address,
              is_def: result.data.default,
            },
            radio: radio
          });
        }
      }
    });

    this.setData({
      form: {
        name: 'Jack Yang',
        gender: 'female',
        tel: '13123456789',
        address: '重庆市江北区江北城华夏银行19楼',
        is_def: 1,
      },
      radio: [
        {
          name: '先生',
          value: 'male',

        },
        {
          name: '女士',
          value: 'female',
          checked: !0,
        },
      ],
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

    var delAddressUrl = __config.basePath + "/user/address/delete";
    const requestTask = wx.request({
      url: delAddressUrl,
      method: "POST",
      data: { id: id, u_id: wx.getStorageSync('session_user_id') },
      success: function (e) {
        var result = e.data;
        if(result.status){
          App.WxService.navigateTo('/pages/address/list/index')
        }
      }
    });

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