/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
var app = getApp()
Page({
  onLoad: function (opt) {
    app.toLoad()
    var shopId = wx.getStorageSync("shopId")
    var that = this
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/shop/shopinit.htm',
      data: {
        shopId: shopId
      },
      success: function (res) {
        var data = res.data.data
        var shopDetail = data.shop
        that.setData({
          shopId: shopId,
          shopDetail: shopDetail
        })
        wx.hideLoading()
      }
    })
  }
})
