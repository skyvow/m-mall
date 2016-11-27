const App = getApp()

Page({
    data: {
        hidden: !0,
        carts: {
            items: []
        }
    },
    onLoad() {
    },
    onShow() {
        this.getCarts()
    },
    getCarts() {
        this.setData({ 
            hidden: !1
        })

        App.HttpService.getCartByUser()
        .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
                data.data.forEach(n => n.goods.thumb_url = App.renderImage(n.goods.images[0] && n.goods.images[0].path))
                this.setData({
                    'carts.items': data.data
                })
            }
            
            this.setData({ 
                hidden: !0
            })
        })
    },
    onPullDownRefresh() {
        this.getCarts()
    },
    navigateTo(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/goods-detail/index', {
            id: e.currentTarget.dataset.id
        })
    },
    confirmOrder(e) {
        console.log(e)
        App.WxService.setStorageSync('confirmOrder', this.data.carts.items)
        App.WxService.navigateTo('/pages/order-confirm/index')
    },
    clear() {
        App.HttpService.clearCartByUser()
        .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
                this.getCarts()
            }
        })
    }
})