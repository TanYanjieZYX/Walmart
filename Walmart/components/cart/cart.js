// components/cart/cart.js

var helper = require('../../utils/helper.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

    totalPrice: 0,
    totalNum: 0,
    hasData: false,    /*判断购物车是否有数据*/
    cartList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  ready() {


    if (wx.getStorageSync('cartList')) {

      var cartList = JSON.parse(wx.getStorageSync('cartList'));

      // console.log(cartList);

      this.setData({
        cartList: cartList,
        hasData: true
      })


      this.computedPriceNum();
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //减少
    decCart(e) {



      //通过自定义属性实现方法传值

      var index = e.currentTarget.dataset.id;


      var cartList = this.data.cartList;  //把data里面的数据复制给一个cartList变量

      var num = cartList[index].num;/*获取当前索引值的数量*/


      if (num == 1) {
        //删除操作
        // push  unshift  pop  shift    splice数组增加修改删除
        //删除的时候提示一个用户
        wx.showModal({
          title: '提示',
          content: '您确定要删除这个商品吗?',
          success: (res) => {
            if (res.confirm) {

              cartList.splice(index, 1);
              //用到this注意this指向
              this.setData({
                cartList: cartList
              })

              //更新 storage里面购物车的数据
              wx.setStorageSync('cartList', JSON.stringify(cartList));

              this.computedPriceNum();

            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })




      } else {
        cartList[index].num = num - 1;

        this.setData({
          cartList: cartList
        })

        //更新 storage里面购物车的数据
        wx.setStorageSync('cartList', JSON.stringify(cartList));

        this.computedPriceNum();

      }




    },
    //增加
    incCart(e) {

      // console.log(e.currentTarget.dataset.id);

      //通过自定义属性实现方法传值

      var index = e.currentTarget.dataset.id;


      var cartList = this.data.cartList;

      var num = cartList[index].num;/*获取当前索引值的数量*/

      cartList[index].num = num + 1;


      this.setData({
        cartList: cartList
      })

      //更新 storage里面购物车的数据
      wx.setStorageSync('cartList', JSON.stringify(cartList));

      this.computedPriceNum();

    },
    //计算总价和总数量的方法
    computedPriceNum() {

      var cartList = this.data.cartList;

      var allPrice = 0;
      var allNum = 0;


      for (var i = 0; i < cartList.length; i++) {

        allPrice += parseFloat(cartList[i].price) * cartList[i].num;

        allNum += parseFloat(cartList[i].num);
      }


      if (allNum > 0) {  /*有数据*/

        this.setData({

          totalPrice: allPrice,
          totalNum: allNum,
          hasData: true
        })

      } else {
        this.setData({

          totalPrice: allPrice,
          totalNum: allNum,
          hasData: false
        })

      }


    }

    ,

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
        success: (res) => {


          wx.hideLoading();

          if (res.data.result.length > 0) {

            helper.addCart(res.data.result[0]);

            //更新当前页面的数据，需要获取storage的数据

            //获取
            var cartList = JSON.parse(wx.getStorageSync('cartList'));

            //改变data里面的cartList   用到this要注意this的指向
            this.setData({
              cartList: cartList

            }, () => {
              this.computedPriceNum();

            })


            //调用计算总价和总数据量方法      注意 setData异步方法

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
    , goOrder() {

      //不需要判断
      wx.navigateTo({
        url: '../order/order',
      })

    }


  }
})
