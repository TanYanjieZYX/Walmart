var helper = require('../../utils/helper.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);

    this.getOrder(options.orderid)

  },
  getOrder(orderid) {
    wx.showLoading({
      title: '加载中...',
    })


    var userinfo = wx.getStorageSync('userinfo');
    //生成签名

    var sign = helper.sign({
      openid: userinfo.openid,
      uid: userinfo._id,
      salt: userinfo.salt    //私钥
    })

    wx.request({
      url: helper.apiUrl + 'api/getOneShopOrder', //仅为示例，并非真实的接口地址
      data: {
        uid: userinfo._id,
        openid: userinfo.openid,
        orderid: orderid,
        sign: sign
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        console.log(res.data)

        wx.hideLoading();
        this.setData({

          list: res.data.result[0]
        })
      }
    })


  }


})