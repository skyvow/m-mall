const App = getApp()

Page({
    data: {
        hidden: !0,
        goods: {
            items: [],
            params: {
                page : 1,
                limit: 10,
            },
            paginate: {}
        }
    },
    onLoad: function(option) {
        this.setData({
            'goods.params.type': option.type
        })
        this.getGoods()
    },
    navigateTo: function(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/goods-detail/index', {
            id: e.currentTarget.dataset.id
        })
    },
    getGoods: function() {
        const goods = this.data.goods
        const params = goods.params

        this.setData({ 
            hidden: !1
        })

        App.HttpService.getGoods(params)
        .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
                data.data.items.forEach(n => n.thumb_url = App.renderImage(n.images[0] && n.images[0].path))
                goods.items = goods.items.concat(data.data.items)
                goods.paginate = data.data.paginate
                goods.params.page = data.data.paginate.next
                goods.params.limit = data.data.paginate.perPage
                this.setData({
                    goods: goods
                })
            }

            this.setData({ 
                hidden: !0
            })
        })
    },
    onPullDownRefresh: function () {
        const type = this.data.goods.params.type    
        const goods = {
            items: [],
            params: {
                page : 1,
                limit: 10,
                type : type,
            },
            paginate: {}
        }

        this.setData({
            goods: goods
        })

        this.getGoods()
    },
    onReachBottom: function () {
        this.lower()
    },
    lower: function() {
        if (!this.data.goods.paginate.hasNext) return
        this.getGoods()
    },
})