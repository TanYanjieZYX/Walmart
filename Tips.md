# 1.仿沃尔玛无人收银、仿微店无人值守货架 微信小程序项目实战-项目介绍、框架搭建、首页布局
index页面的轮播图（swiper组件）+扫码购物
view标签实现
# 2.仿沃尔玛无人收银、仿微店无人值守货架 微信小程序项目实战-用户中心布局
右侧箭头 after行内元素
css文件
```
.cells .block  .item_right:after{

  content: '';
  display: inline-block;
  width: 10px;
  height: 10px;
  border-width: 2px 2px 0 0;
  border-color: #eee;
  border-style: solid;
  transform: rotate(45deg);


}
```
# 3.仿沃尔玛无人收银、仿微店无人值守货架 微信小程序项目实战-购物车页面布局
相对定位、绝对定位
# 4.仿沃尔玛无人收银、仿微店无人值守货架 微信小程序项目实战-去结算页面布局
display:flex
flex：1
向上箭头：
```
.hide_more:after{
  content: "";
  display: inline-block;
  width: 20rpx;
  height: 20rpx;
  border-left: 1px solid #999;
  border-bottom: 1px solid #999;
  margin-left: 20rpx;
  transform: rotate(135deg);
  position: relative;
  bottom:-4px;
}
```
向下箭头：
```
.show_more:after{
  content: "";
  display: inline-block;
  width: 20rpx;
  height: 20rpx;
  border-left: 1px solid #999;
  border-bottom: 1px solid #999;

  margin-left: 20rpx;
  transform: rotate(-45deg);
  position: relative;
  top:-8rpx;
}
```
# 5.首页扫描商品条形码  获取商品信息
后台接口数据库保存数据
CMS内容管理系统
# 6.扫码成功自动加入购物车 并跳转到购物车页面
判断数据需要几层
判断storage里面有没有数据
```
      没有：直接写入

      有：判断购物车有没有当前数据 {

            没有：拼接数据写入storage
            有：数量的变化
      }
```
# 7.购物车页面数据渲染 以及实现购物车数量的增加、减少 、购物车数据删除
提示框删除最后一个
```
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
    }
  }
```
# 8.购物车数量变化的时候 计算总价、计算数量
注意var i
this的指向
# 9.购物车没有数据的时候提示用户扫码、以及购物车页面实现继续添加商品功能
```
//获取
          var cartList = JSON.parse(wx.getStorageSync('cartList'));

          //改变data里面的cartList   用到this要注意this的指向
          this.setData({
            cartList: cartList

          }, () => {
            this.computedPriceNum();
          })
//调用计算总价和总数据量方法      注意 setData异步方法 利用回调函数
```
# 10.结算页面数据渲染、以及实现商品数据展开收起 以及计算总价
# 11. 底部菜单增加购物车选项 以及把购物车单独抽离成一个组件（component）
注意抽离时候JS文件不太一样
# 12.微信小程序的支付之前的准备工作、以及微信小程序支付流程【小程序支付】
需要平台认证
# 13.调用小程序登录接口、获取openid,请求统一下单接口获取支付参数完成支付、nodejs后台服务器配置【小程序支付】
wx.requestPayment(Object object)
发起微信支付。了解更多信息，请查看微信支付接口文档
商户系统和微信支付系统主要交互：

1、小程序内调用登录接口，获取到用户的openid
获取openid
wx.login()——code——服务器解析code——openid
api地址在后台需要拼接使用
https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code

2、商户server调用支付统一下单
请求接口

3、商户server调用再次签名

4、商户server接收支付通知

5、商户server查询支付结果
要跟后台程序配合

# 14.信小程序根据code获取openid以及用户信息，提交订单、支付【小程序支付 集成到项目里面】
搞清楚接口的一些参数

app.js登录获取用户信息（服务器操作）
# 15.微信小程序提交订单 签名验证以及成功返回到对应成功页面
签名验证——请求数据的安全性问题
不签名验证接口的问题
1. 获取用户的收货地址——写个循环，循环请求api接口随机生成uid，导致用户收货地址被盗取
什么时候用：
用户登录以后，请求的接口都需要做签名验证
如何实现：（32位签名字符串）
客户端生成签名——sign=md5(uid+salt（服务器登录以后暴露的）+openid)
服务器——可以获取uid以及客户端的sign
服务器也生成一个签名sign=md5(uid+根据uid在数据库里面查找的salt+通过uid在数据库查找的openid)
判断：if(客户的sign==服务生成的sign)   正确的请求


GitHub————JS MD5
1、HTML引入2、加密123456，看和服务器加密的一样不，判断客户端的算法和服务器的算法一样
# 16.仿沃尔玛无人收银  用户中心跳转到订单页面、订单页面请求数据、跳转到详情
wx.redirectTo——进行跳转
转换时间戳
# 17.仿沃尔玛无人收银  订单页面.wxs解析时间戳、以及详情页面渲染数据、以及数据显示优化
转换时间戳
1、	后台处理，利用utils的这个函数
```
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
```
2、wxs的写法
