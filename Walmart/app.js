
var helper = require('./utils/helper.js')

//app.js
App({
  onLaunch: function () {

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId       
        console.log(res);   // code它是变化的，每次获取的都是不一样的  code有过期时间  7200ms


        //获取openid 

        //openid:每一个用户在指定的小程序里面是唯一的


        wx.request({
          url: helper.apiUrl + 'weixinpay/login', //仅为示例，并非真实的接口地址
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {

            console.log(res.data);

            //保存opnenid

            wx.setStorageSync('userinfo', res.data.userinfo);
          }
        })



      }
    })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo;
    //           console.log(res.userInfo);

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    userInfo: null
  }
})