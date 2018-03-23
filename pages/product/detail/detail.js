//detail.js
var app = getApp();
var shopId, pdId,pdName
Page({
  data: {
    toTop_style: 'display:none',
  },
  previewImg: function (e) {
    var urls = this.data.swiperImg
    var current = e.currentTarget.dataset.url
    wx.previewImage({
      current: current,
      urls: urls
    })
  },
  addCart: function (e) {
    var that = this
    var pdId = e.currentTarget.dataset.pdid
    app.addCartData(that, shopId, pdId)
  },
  onShareAppMessage: function () {
    var urls = this.data.swiperImg
    return {
      title: pdName,
      path: '/pages/product/detail/detail?shopId=' + shopId + '&&pdId=' + pdId,
      success: function (res) {
        wx.showToast({
          title: '转发成功',
          duration: 2000
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '转发失败',
          duration: 2000
        })
      }
    }
  },
  onLoad: function (opt) {
    app.toLoad()
    shopId = opt.shopId
    pdId = opt.pdId
    wx.setStorageSync('shopId', shopId)
    var that = this
    app.getCartCount(that)
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/product/detail.htm',
      data: {
        shopId: shopId,
        pdId: pdId
      },
      success: function (res) {
        var useData = res.data.data
        var swiperImg = useData.imageList
        pdName = useData.pdName
        var cost = useData.cost
        var price = useData.price
        var isSelling = useData.isSelling
        var introduce = useData.introduce
        var pdstore = useData.pdstore
        wx.setNavigationBarTitle({
          title: pdName
        })
        that.setData({
          swiperImg: swiperImg,
          pdName: pdName,
          shopId: shopId,
          pdId: pdId,
          cost: cost,
          price: price,
          isSelling: isSelling,
          introduce: introduce,
          pdstore: pdstore
        })
        wx.hideLoading()
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 10000)
  }
})
