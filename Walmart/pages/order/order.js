// pages/order/order.js
var helper = require('../../utils/helper.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

    elementHeight: 180,

    isShowMore: false,

    totalPrice: 0,

    totalNum: 0,

    cartList: []   /*模拟的数据*/


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (wx.getStorageSync('cartList')) {

      var cartList = JSON.parse(wx.getStorageSync('cartList'));

      //设置完成数据以后在计算几个   设置数据是一个异步方法
      this.setData({
        cartList: cartList
      }, () => {

        this.computedPrice();
      })
    }

  },
  //显示更多
  showMore() {

    if (!this.data.isShowMore) {
      this.setData({
        elementHeight: this.data.elementHeight * this.data.cartList.length,
        isShowMore: true
      })

      //展开
    } else {
      //合起来
      this.setData({
        elementHeight: 180,
        isShowMore: false
      })

    }

  },
  //计算总价和总数量的方法
  computedPrice() {

    var cartList = this.data.cartList;

    var totalPrice = 0;

    var totalNum = 0;

    for (var i = 0; i < cartList.length; i++) {
      totalPrice += parseFloat(cartList[i].price) * cartList[i].num;

      totalNum += cartList[i].num;

    }
    this.setData({

      totalPrice: totalPrice,
      totalNum: totalNum
    })

  },

  doPay() {



    var that = this;

    var userinfo = wx.getStorageSync('userinfo');  //openid

    wx.showLoading({
      title: '加载中...',
    })


    //生成签名

    var sign = helper.sign({
      openid: userinfo.openid,
      uid: userinfo._id,
      salt: userinfo.salt    //私钥
    })



    wx.request({
      url: helper.apiUrl + 'weixinpay/doOrder',
      method: "POST",
      data: {
        openid: userinfo.openid,
        uid: userinfo._id,
        order: JSON.stringify(that.data.cartList),    //post的数组   购物车中的全部数据
        total_price: that.data.totalPrice,
        total_num: that.data.totalNum,
        derate_price: 0,
        real_price: that.data.totalPrice,
        sign: sign   //下一讲讲 签名验证 接口的安全性问题

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res);


        // "{"out_trade_no":"20180729190510492426","nonceStr":"yELNZj2UamxapWnN","timeStamp":"1532862310","package":"prepay_id = wx29190511245578c23d761a910193872964","paySign":"5fabf74ef07cbffbb76ec0ff51596b29"}"

        wx.hideLoading();
        if (res.data.success) {
          that.wxpay(res.data.result);
        } else {
          wx.showLoading({
            duration: 2000,
            title: '提交订单异常,请求重试...',
          })
        }
      }
    })

  },
  //调用支付方法完成支付
  wxpay: function (data) {
    data = JSON.parse(data);
    wx.requestPayment({
      'timeStamp': data.timeStamp,
      'nonceStr': data.nonceStr,
      'package': data.package,
      'signType': 'MD5',
      'paySign': data.paySign,
      'success': function (res) {

        //清空购物车        
        wx.removeStorageSync('cartList');


        //跳转到成功页面
        wx.navigateTo({
          url: '../success/success?redirect=index'
        })


      },
      'fail': function (res) {
        console.log('失败了---')
      }
    })

  }




})