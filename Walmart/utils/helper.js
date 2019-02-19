
var md5 = require('./md5.js');


var app = {


  apiUrl: 'http://weixin.itying.com/',

  addCart(data) {

    /*
    判断storage里面有没有数据
      没有：直接写入


      有：判断购物车有没有当前数据 {

            没有：拼接数据写入storage
            有：数量的变化
      }

    */

    var cartArray = []

    var cartList = wx.getStorageSync('cartList');

    if (cartList) {

      var cartArray = JSON.parse(cartList);


      if (this.cartHasData(cartArray, data)) {

        for (var i = 0; i < cartArray.length; i++) {

          if (cartArray[i]._id == data._id) {

            cartArray[i].num = cartArray[i].num + 1;

          }

        }

        wx.setStorageSync('cartList', JSON.stringify(cartArray));

      } else {



        //把购物车的数据和当前数据做拼接

        data.num = 1;
        var cartArray = JSON.parse(cartList);

        cartArray.push(data);

        wx.setStorageSync('cartList', JSON.stringify(cartArray));

      }


    } else {//没有


      data.num = 1;

      cartArray.push(data);

      wx.setStorageSync('cartList', JSON.stringify(cartArray));

    }


  },

  cartHasData(cartList, data) {


    for (var i = 0; i < cartList.length; i++) {

      if (cartList[i]._id == data._id) {

        return true;

      }

    }

    return false;

  }
  ,

  //签名方法
  sign(json) {

    var arr = [];
    for (var i in json) {
      arr.push(i);
    }


    // arr = ['cpenid', 'did','alt']


    //如果这个参数被省略，那么元素将按照 ASCII 字符顺序进行升序排列（也就是所谓的自然顺序）
    arr = arr.sort();

    // arr = ['alt', 'cpenid','did']



    var str = '';
    for (let i = 0; i < arr.length; i++) {
      str += arr[i] + json[arr[i]]
    }

    // str = alt + alt值 + cpenid + cpenid值 + did + did值

    return md5(str);

  }



}


module.exports = app;