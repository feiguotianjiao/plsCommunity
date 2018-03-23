/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//myIndex.js
//获取应用实例
var app = getApp()
var header
Page({
  data: {
    userInfo: {}
  },
  onLoad: function () {
    new app.WeToast()
    var that = this
    var addressId = wx.getStorageSync('addressId')
    wx.getUserInfo({
      withCredentials: false,
      success: function (res) {
        that.setData({
          userInfo: res.userInfo,
          addressId: addressId
        })
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 10000)
  }
})
