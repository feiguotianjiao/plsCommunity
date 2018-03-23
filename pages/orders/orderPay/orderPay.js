/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//orderPay.js
//获取应用实例
var md5 = require('../../../utils/md5.js')
var app = getApp();
var header, orderData, payPrice, accountPrice, newPayPrice, changePrice, ordersNo, payObj, orderList, idt
Page({
  data: {},
  wxPay: function (payObj) {
    var that = this
    var appId = payObj.appId
    var timeStamp = payObj.timeStamp
    var nonceStr = payObj.nonceStr
    var wxPackage = payObj.prepayId
    var paySign = payObj.sign
    wx.requestPayment({
      'timeStamp': timeStamp,
      'nonceStr': nonceStr,
      'package': 'prepay_id='+wxPackage,
      'signType': 'MD5',
      'paySign': paySign,
      'success': function (res) {
        wx.hideLoading()
        wx.redirectTo({
          url: '/pages/orders/success/success?ordersNo=' + ordersNo,
        })
        if (idt) {
          orderList[idt].ordersStatus = 2
          wx.setStorageSync('orderList', orderList)
        }
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showModal({
          title: '支付状态提示',
          content: '支付失败，请重新尝试去微信支付',
          confirmText: '重新支付',
          success: function (res) {
            if (res.confirm) {
              that.wxPay(payObj)
            }else{
              wx.redirectTo({
                url: '/pages/orders/orderList/orderList'
              })
            }
          }
        })
      }
    })
  },
  goPay: function () {
    var that = this
    var payInterface = 0
    if (payPrice > 0){
      payInterface = 1
    }
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/payment/pay.htm',
      header: header,
      data: {
        ordersNo: ordersNo,
		    comflag:'true',
        payInterface: payInterface
      },
      success: function (res) {
        if (payInterface == 1){
          payObj = res.data.data
          that.wxPay(payObj)
        }else{
          wx.hideLoading()
          wx.redirectTo({
            url: '/pages/orders/success/success?ordersNo=' + ordersNo,
          })
          if(idt){
            orderList[idt].ordersStatus = 2
            wx.setStorageSync('orderList', orderList)
          }
        }
      },
      fail:function(res){
        wx.hideLoading()
        wx.showModal({
          title: '支付状态提示',
          content: '支付信息提交失败，请重新提交',
          confirmText: '重新提交',
          success: function (res) {
            if (res.confirm) {
              that.goPay()
            }
          }
        })
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    } , 10000)
  },
  onLoad: function (opt) {
    wx.showLoading({
      title: '订单付款中',
      mask: true
    })
    var that = this
    orderList = wx.getStorageSync('orderList')
    idt = opt.idt
    ordersNo = opt.ordersNo
    header = wx.getStorageSync('header')
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/orders/pay.htm',
      header: header,
      data: {
        ordersNo: ordersNo
      },
      success: function (res) {
        orderData = res.data.data
        payPrice = parseFloat(orderData.payPrice).toFixed(2)
        that.goPay()
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 10000)
  }
})
