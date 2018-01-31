const App = getApp()

Page({
    data: {
        inputVal: ''
    },
    clearInput() {
        this.setData({
            inputVal: ''
        })
    },
    inputTyping(e) {
        this.setData({
            inputVal: e.detail.value
        })
        this.search()
    },
    search() {
      var serch = this.data.inputVal;
      if (!serch) return
      console.log(serch);
    },
    redirectTo(e) {
        console.log(e)
        App.WxService.redirectTo('/pages/goods/list/index', {
            keyword: e.currentTarget.dataset.keyword
        })
    },
})