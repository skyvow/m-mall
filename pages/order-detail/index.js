const App = getApp()

Page({
    data: {
        order: {
            item: {},
        },
    },
    onLoad(option) {
        this.setData({
            id: option.id
        })
        this.getOrderDetail()
    },
    getOrderDetail() {
        App.HttpService.getOrderDetail(this.data.id)
        .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
                data.data.totalAmount = 0
                data.data.items.forEach(n => data.data.totalAmount+=n.totalAmount)
                this.setData({
                    'order.item': data.data
                })
            }
        })
    },
})