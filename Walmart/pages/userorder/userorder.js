// pages/shoporder/shoporder.js
var helper = require('../../utils/helper.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function () {
    
    this.getOrderData();
  },
  getOrderData(){


    var userinfo = wx.getStorageSync('userinfo');  
    //生成签名

    var sign = helper.sign({
      openid: userinfo.openid,
      uid: userinfo._id,
      salt: userinfo.salt    //私钥
    })

    wx.request({
      url: helper.apiUrl +'api/getShopOrder', //仅为示例，并非真实的接口地址
      data: {
        uid: userinfo._id,
        openid: userinfo.openid,
        sign: sign
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) =>{
        console.log(res.data)
        this.setData({
          list: res.data.result
        })
      }
    })
  },
  goOrderDetails(e){

    console.log(e);

    var order_id = e.currentTarget.dataset.orderid;


    wx.navigateTo({
      url: '../userorderdetails/userorderdetails?orderid=' + order_id,
    })


  }

})