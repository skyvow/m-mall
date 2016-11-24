const App = getApp()

Page({
    data: {
        hidden: !0,
        carts: {},
        address: {
            item: {},
        }
    },
    onLoad(option) {
        console.log(option)
    	if (option.id) {
            this.setData({
                address_id: option.id
            })
            this.getAddressDetail(option.id)
        } else {
            this.getDefalutAddress()
        }
        const carts = {
            items: App.WxService.getStorageSync('confirmOrder'), 
            totalAmount: 0, 
        }
        carts.items.forEach(n => carts.totalAmount+=n.totalAmount)
        this.setData({
            carts: carts
        })
        console.log(this.data.carts)
    },
    navigateTo(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/address-confirm/index')
    },
    getDefalutAddress() {
        App.HttpService.getDefalutAddress()
        .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
                this.setData({
                    address_id: data.data._id, 
                    'address.item': data.data, 
                })
            } else {
                this.showModal()
            }
        })
    },
    showModal() {
        App.WxService.showModal({
            title: '友情提示', 
            content: '没有收货地址，请先设置', 
        })
        .then(data => {
            console.log(data)
            if (data.confirm == 1) {
                App.WxService.redirectTo('/pages/address-add/index')
            } else {
                App.WxService.navigateBack()
            }
        })
    },
    getAddressDetail(id) {
        App.HttpService.getAddressDetail(id)
        .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
                this.setData({
                    'address.item': data.data
                })
            }
        })
    },
    addOrder() {
        const items = this.data.carts.items.map(n => n._id)
        const address_id = this.data.address_id
        const params = {
            items: items, 
            address_id: address_id, 
        }
        App.HttpService.postOrder(params)
        .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
                App.WxService.redirectTo('/pages/order-detail/index', {
                    id: data.data._id
                })
            }
        })
        console.log(items)
    },
    clear() {
        App.HttpService.clearCartByUser()
        .then(data => {
            console.log(data)
        })
    },
})