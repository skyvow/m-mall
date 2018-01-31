const App = getApp()

Page({
    data: {
        indicatorDots: !1,
        autoplay: !1,
        current: 0,
        interval: 3000,
        duration: 1000,
        circular: !1,
    },
    onLoad() {
    },
    onShow() {},
    bindload(e) {
      var self = this;
      //判断微信系统是否登录
      setTimeout(function(){
        wx.checkSession({
          success: function (e) {
            var key = 'session_user_id';
            var user = wx.getStorageSync(key);
            //判断是否在商城系统登录
            if(!user){
              self.goLogin();
            }else{
              self.goIndex();
            }
          },
          fail: function () {
            self.goLogin();
          }
        });
      },3000);
    },
    //如果已经登录的话
    logined(){
      wx.getUserInfo({
        success: function (res) {
          var userInfo = res.userInfo
          var nickName = userInfo.nickName
          var avatarUrl = userInfo.avatarUrl
          var gender = userInfo.gender //性别 0：未知、1：男、2：女
          var province = userInfo.province
          var city = userInfo.city
          var country = userInfo.country
        }
      })
    },
    goIndex() {
        App.WxService.switchTab('/pages/index/index')
    },
    goLogin() {
        App.WxService.redirectTo('/pages/login/index')
    },
})
