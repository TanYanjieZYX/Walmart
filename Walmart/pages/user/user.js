// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      {
        "desc": "我的订单",
        'img': '../../assets/images/user/shop_order.png',
        "url": '../userorder/userorder'
      },
      {
        "desc": "线上订单",
        'img': '../../assets/images/user/online_order.png',
      },
      {
        "desc": "地址管理",
        'img': '../../assets/images/user/address.png'
      },
      {
        "desc": "联系客服",
        'img': '../../assets/images/user/tel.png'
      }

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  goPage(e) {

    // console.log(e.currentTarget.dataset);

    var url = e.currentTarget.dataset.url;

    wx.navigateTo({
      url: url,
    })
  }

})