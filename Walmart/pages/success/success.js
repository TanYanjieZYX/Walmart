// pages/success/success.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    redirect:'index'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // console.log(options);
    
    var redirect = options.redirect || 'index';  

    this.setData({
      redirect: redirect
    })
      

  },
  //用户点击返回的时候回触发
  onUnload:function(){

    var url = `../${this.data.redirect}/${this.data.redirect}`;
    wx.switchTab({
      url: url
    })
  },
  goHome(){   
    var url = `../${this.data.redirect}/${this.data.redirect}`;
    wx.switchTab({
      url: url
    })
  }
  
})