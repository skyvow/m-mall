const App = getApp()

Page({
    data: {
        hidden: !0,
        order: {
            items: [],
            params: {
                page : 1,
                limit: 10,
            },
            paginate: {}
        }
    },
    onLoad: function() {
        this.getOrderList()
    },
    navigateTo: function(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/order-detail/index', {
            id: e.currentTarget.dataset.id
        })
    },
    getOrderList: function() {
        const order = this.data.order
        const params = order.params

        this.setData({ 
            hidden: !1
        })

        App.HttpService.getOrderList(params)
        .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
                data.data.items.forEach(v => {
                    v.totalAmount = 0
                    v.items.forEach(n => {
                        v.totalAmount+=n.totalAmount
                    })
                })
                order.items = order.items.concat(data.data.items)
                order.paginate = data.data.paginate
                order.params.page = data.data.paginate.next
                order.params.limit = data.data.paginate.perPage
                this.setData({
                    order: order
                })
            }

            this.setData({ 
                hidden: !0
            })
        })
    },
    onPullDownRefresh: function () {
        const order = {
            items: [],
            params: {
                page : 1,
                limit: 10,
            },
            paginate: {}
        }

        this.setData({
            order: order
        })

        this.getOrderList()
    },
    onReachBottom: function () {
        this.lower()
    },
    lower: function() {
        if (!this.data.order.paginate.hasNext) return
        this.getOrderList()
    },
})