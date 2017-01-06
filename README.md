# 微信小程序-移动端小商城

## 项目说明：

微信小程序：实现一个移动端小商城，项目持续更新中...

使用技术：**Weui.wxss** 、 **ES6**

前台：[m-mall](https://github.com/skyvow/m-mall)

后台：[m-mall-admin](https://github.com/skyvow/m-mall-admin)

## 目录结构：

```
m-mall/
  |-assets/
     |- images/
     |- plugins/
     |- styles/
     |- ...
  |-etc/
     |- config.js
     |- ...
  |-helpers/
     |- HttpResource.js
     |- HttpService.js
     |- ServiceBase.js
     |- Tools.js
     |- WxResource.js
     |- WxService.js
     |- WxValidate.js
     |- ...
  |-pages/
      |- start
        |- index.js
        |- index.json
        |- index.wxml
        |- index.wxss
      |- ...
  |-app.js
  |-app.json
  |-app.wxss
  |-...
```

- assets — 存放静态文件，例如：images、styles、plugins
- etc — 存放配置文件，例如：config.js
- helpers — 存放帮助文件，例如：Promise 微信原生API、Promise wx.request、RESTful http client、Form validation
- pages — 存放项目页面相关文件
- app.js — 小程序逻辑
- app.json — 小程序公共设置
- app.wxss — 小程序公共样式表

## Features

- [Promise 微信原生API](https://github.com/skyvow/m-mall/blob/master/helpers/WxService.js)

- [Promise wx.request](https://github.com/skyvow/m-mall/blob/master/helpers/ServiceBase.js)

- [RESTful http client](https://github.com/skyvow/m-mall/blob/master/helpers/WxResource.js)

- [Form validation](https://github.com/skyvow/m-mall/blob/master/helpers/WxValidate.js)

## Promise 微信原生API

```js
import WxService from 'helpers/WxService'

const Wx = new WxService
Wx.login(data => Wx.getUserInfo()).then(data => console.log(data))
Wx.showModal({title: '提示', content: '这是一个模态弹窗'}).then(data => res.confirm && console.log('用户点击确定'))
```

## Promise wx.request

```js
import ServiceBase from 'helpers/ServiceBase'

const HttpService = new ServiceBase
HttpService.getRequest(url, params, header, dataType)
HttpService.postRequest(url, params, header, dataType)
HttpService.putRequest(url, params, header, dataType)
HttpService.deleteRequest(url, params, header, dataType)
HttpService.headRequest(url, params, header, dataType)
HttpService.optionsRequest(url, params, header, dataType)
HttpService.traceRequest(url, params, header, dataType)
HttpService.connectRequest(url, params, header, dataType)
```

## RESTful http client

```js
import WxResource from 'helpers/WxResource'

// 例如以下为后台提供的接口文档
// GET /api/users：获取所有用户资源
// GET /api/users/ID：获取某个指定用户的信息
// POST /api/users：新建一个用户
// PUT /api/users/ID：更新某个指定用户的信息
// DELETE /api/users/ID：删除某个指定用户
 
// 创建资源实例对象，接收四个参数url, paramDefaults, actions, options
const user = new WxResource('/api/users/:id', {id:'@id'}, {
    list: {
        method: 'GET',
        header: {
            Authorization: 'Authorization',
        },
    },
}, {
    stripTrailingSlashes: true,
    suffix: 'Async',
})
          
// 获取所有用户资源
user.listAsync()
.then(res => console.log(res))
.catch(err => console.log(err))
 
// 获取ID=123用户的信息
user.getAsync({ id: 123 })
.then(res => console.log(res))
.catch(err => console.log(err))
 
// 新建一个用户
user.saveAsync({ name: '微信小程序' })
.then(res => console.log(res))
.catch(err => console.log(err))
 
// 更新ID=123用户的信息
user.updateAsync({ id: 123 },{ name: 'skyvow' })
.then(res => console.log(res))
.catch(err => console.log(err))
 
// 删除ID=123用户的信息
user.deleteAsync({ id: 123 })
.then(res => console.log(res))
.catch(err => console.log(err))
 
// 返回的实例对象包含六个默认方法，getAsync、saveAsync、queryAsync、removeAsync、deleteAsync与一个自定义方法listAsync
//
// user.getAsync({id: 123}) 向/api/users/123发起一个GET请求，params作为填充url中变量，一般用来请求某个指定资源
// user.queryAsync(params) 同getAsync()方法使用类似，一般用来请求多个资源
// user.saveAsync(params, payload) 发起一个POST请，payload作为请求体，一般用来新建一个资源
// user.updateAsync(params, payload) 发起一个PUT请，payload作为请求体，一般用来更新某个指定资源
// user.deleteAsync(params, payload) 发起一个DELETE请求，payload作为请求体，一般用来移除某个指定资源
// user.removeAsync(params, payload) 同deleteAsync()方法使用类似，一般用来移除多个资源
//
// user.listAsync({}) 向/api/users发送一个GET请求
```

## Form validation

```html
<form bindsubmit="submitForm">
    <view class="weui-cells">
        <view class="weui-cell weui-cell_input">
            <view class="weui-cell__hd">
                <view class="weui-label">姓名</view>
            </view>
            <view class="weui-cell__bd">
                <input name="name" value="{{ form.name }}" class="weui-input" type="text" placeholder="请输入姓名" />
            </view>
        </view>
        <view class="weui-cell weui-cell_input">
            <view class="weui-cell__hd">
                <view class="weui-label">邮箱</view>
            </view>
            <view class="weui-cell__bd">
                <input name="email" value="{{ form.email }}" class="weui-input" type="text" placeholder="请输入邮箱" />
            </view>
        </view>
    </view>
    <view class="button-sp-area">
        <button class="weui-btn" type="primary" formType="submit">确定</button>
    </view>
</form>
```

```js
import WxValidate from 'helpers/WxValidate'

Page({
    data: {
    	form: {
			name : '', 
			email: '', 
        },
    },
    onLoad() {
    	this.WxValidate = new WxValidate({
			name: {
				required: true, 
				minlength: 2, 
				maxlength: 10, 
			},
			email: {
				required: true, 
				email: true, 
			},
		}, {
			name: {
				required: '请输入姓名', 
			},
			email: {
				required: '请输入邮箱', 
				email: '请输入有效的电子邮件地址', 
			},
		})
    },
	submitForm(e) {
		const params = e.detail.value
		if (!this.WxValidate.checkForm(e)) {
			const error = this.WxValidate.errorList
			console.log(error)
			return false
		}
	},
})
```

## 项目截图:

<img src="https://github.com/skyvow/m-mall/blob/master/assets/images/screenshots/screenshorts-11.png" width="375px" style="display:inline;">

<img src="https://github.com/skyvow/m-mall/blob/master/assets/images/screenshots/screenshorts-12.png" width="375px" style="display:inline;">

<img src="https://github.com/skyvow/m-mall/blob/master/assets/images/screenshots/screenshorts-13.png" width="375px" style="display:inline;">

<img src="https://github.com/skyvow/m-mall/blob/master/assets/images/screenshots/screenshorts-01.png" width="375px" style="display:inline;">

<img src="https://github.com/skyvow/m-mall/blob/master/assets/images/screenshots/screenshorts-02.png" width="375px" style="display:inline;">

<img src="https://github.com/skyvow/m-mall/blob/master/assets/images/screenshots/screenshorts-03.png" width="375px" style="display:inline;">

<img src="https://github.com/skyvow/m-mall/blob/master/assets/images/screenshots/screenshorts-04.png" width="375px" style="display:inline;">

<img src="https://github.com/skyvow/m-mall/blob/master/assets/images/screenshots/screenshorts-05.png" width="375px" style="display:inline;">

<img src="https://github.com/skyvow/m-mall/blob/master/assets/images/screenshots/screenshorts-06.png" width="375px" style="display:inline;">

<img src="https://github.com/skyvow/m-mall/blob/master/assets/images/screenshots/screenshorts-14.png" width="375px" style="display:inline;">

<img src="https://github.com/skyvow/m-mall/blob/master/assets/images/screenshots/screenshorts-07.png" width="375px" style="display:inline;">

<img src="https://github.com/skyvow/m-mall/blob/master/assets/images/screenshots/screenshorts-08.png" width="375px" style="display:inline;">

<img src="https://github.com/skyvow/m-mall/blob/master/assets/images/screenshots/screenshorts-09.png" width="375px" style="display:inline;">

<img src="https://github.com/skyvow/m-mall/blob/master/assets/images/screenshots/screenshorts-10.png" width="375px" style="display:inline;">

##	贡献

有任何意见或建议都欢迎提 issue

##	License

MIT