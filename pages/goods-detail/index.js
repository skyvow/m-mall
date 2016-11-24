const App = getApp()

Page({
    data: {
        indicatorDots: !0,
        vertical: !1,
        autoplay: !1,
        interval: 3000,
        duration: 1000,
        goodss: {
            item: {}
        }
    },
    swiperchange(e) {
        // console.log(e.detail.current)
    },
    onLoad(option) {
        console.log(option)
        this.getDetail(option.id)
    },
    addCart(e) {
        const goods = this.data.goodss.item._id
        App.HttpService.addCartByUser(goods)
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
    },
    getDetail(id) {
    	App.HttpService.getDetail(id)
        .then(data => {
        	console.log(data)
        	if (data.meta.code == 0) {
                data.data.images.forEach(n => n.path = App.renderImage(n.path))
        		this.setData({
                    'goodss.item': data.data
                })
        	}
        })
    },
})