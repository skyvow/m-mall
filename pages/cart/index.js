const App = getApp()

Page({
    data: {
        carts: {
            items: []
        }
    },
    onLoad: function() {
        this.getCarts()
    },
    getCarts: function() {
        App.HttpService.getCartByUser()
        .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
                data.data.forEach(n => n.goods.thumb_url = App.renderImage(n.goods.images[0] && n.goods.images[0].path))
                this.setData({
                    'carts.items': data.data
                })
            }
        })
    },
    onPullDownRefresh: function() {
        this.getCarts()
    },
    navigateTo: function(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/goods-detail/index', {
            id: e.currentTarget.dataset.id
        })
    },
    confirmOrder: function(e) {
        console.log(e)
        App.WxService.setStorageSync('confirmOrder', this.data.carts.items)
        App.WxService.navigateTo('/pages/order-confirm/index')
    },
})