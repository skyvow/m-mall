const App = getApp()

Page({
    data: {
        hidden: !0,
        address: {
            items: [],
            params: {
                page : 1,
                limit: 10,
            },
            paginate: {}
        }
    },
    onLoad: function() {
    	this.getAddressList()
    },
    navigateTo: function(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/address-edit/index', {
            id: e.currentTarget.dataset.id
        })
    },
    redirectToAddress: function(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/address-add/index')
    },
    setDefalutAddress: function(e) {
        const id = e.currentTarget.dataset.id
        App.HttpService.setDefalutAddress(id)
        .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
                this.onPullDownRefresh()
            }
        })
    },
    getAddressList: function() {
        const address = this.data.address
        const params = address.params

        this.setData({ 
            hidden: !1
        })

        App.HttpService.getAddressList(params)
        .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
                address.items = address.items.concat(data.data.items)
                address.paginate = data.data.paginate
                address.params.page = data.data.paginate.next
                address.params.limit = data.data.paginate.perPage
                this.setData({
                    address: address
                })
            }

            this.setData({ 
                hidden: !0
            })
        })
    },
    onPullDownRefresh: function () {
        const address = {
            items: [],
            params: {
                page : 1,
                limit: 10,
            },
            paginate: {}
        }

        this.setData({
            address: address
        })

        this.getAddressList()
    },
    onReachBottom: function () {
        this.lower()
    },
    lower: function() {
        if (!this.data.address.paginate.hasNext) return
        this.getAddressList()
    },
})