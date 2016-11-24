const App = getApp()

Page({
    data: {
        hidden: !0,
        classify: {
            items: [],
            params: {
                page : 1,
                limit: 10,
            },
            paginate: {}
        },
    },
    onLoad: function() {
    	this.getClassify()       
    },
    navigateTo: function(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/goods/index', {
            type: e.currentTarget.dataset.id
        })
    },
    getClassify: function() {
        const classify = this.data.classify
        const params = classify.params

        this.setData({ 
            hidden: !1
        })

        App.HttpService.getClassify(params)
        .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
                classify.items = classify.items.concat(data.data.items)
                classify.paginate = data.data.paginate
                classify.params.page = data.data.paginate.next
                classify.params.limit = data.data.paginate.perPage
                this.setData({
                    classify: classify
                })
            }

            this.setData({ 
                hidden: !0
            })
        })
    },
    onPullDownRefresh: function () {
        const classify = {
            items: [],
            params: {
                page : 1,
                limit: 10,
            },
            paginate: {}
        }

        this.setData({
            classify: classify
        })

        this.getClassify()
    },
    onReachBottom: function () {
        this.lower()
    },
    lower: function() {
        if (!this.data.classify.paginate.hasNext) return
        this.getClassify()
    },
})