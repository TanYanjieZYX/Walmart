//index.js
//获取应用实例
const app = getApp()

var helper = require('../../utils/helper.js');



Page({
  data: {
    imgUrls: [

    ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },

  doQcode() {

    var _that = this;

    //扫码获取商品条形码数据

    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res.result);

        _that.getProductInfo(res.result);

      }

    })


  },

  getProductInfo(qcode) {
    wx.showLoading({
      title: '加载中...',
    })

    //get请求数据
    wx.request({
      url: helper.apiUrl + 'api/getProduct', //仅为示例，并非真实的接口地址
      data: {
        qcode: qcode
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);


        wx.hideLoading();
        //服务器获取到了当前条形码对应的数据
        if (res.data.result.length > 0) {

          helper.addCart(res.data.result[0]);


          wx.navigateTo({
            url: '../cart/cart',
          })
        } else {

          wx.showToast({
            title: '此商品不存在',
            icon: 'success',
            duration: 3000
          })
        }


      }
    })


  }


  // 代码的复用性

})
