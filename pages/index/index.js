/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//index.js
//获取应用实例
var app = getApp();
var sysDpr = app.getSysDpr()
var isTopset = false
var lat, lon, shopId, shopName
Page({
  data: {
    toTop_style: 'display:none'
  },
  //页面滑动时对搜索栏的控制
  onPageScroll: function (e) {
    var toTop = e.scrollTop * sysDpr;
    var cPosition = 450
    if (toTop > cPosition) {
      if (isTopset == false) {
        isTopset = true
        this.setData({
          toTop_style: 'display:block'
        })
      }
    }
    if (toTop < cPosition) {
      if (isTopset) {
        isTopset = false
        this.setData({
          toTop_style: 'display:none'
        })
      }
    }
  },
  toTop: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  toCall: function (e) {
    var phoneNo = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phoneNo
    })
  },
  addCart: function (e) {
    var that = this
    var pdId = e.currentTarget.dataset.pdid
    app.addCartData(that, shopId, pdId)
  },
  onShareAppMessage: function () {
    return {
      title: shopName,
      path: 'pages/index/index?shopId=' + shopId + '&lat=' + lat + '&lon=' + lon + '&shopName=' + shopName,
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
    var that = this
    shopId = wx.getStorageSync('shopId')
    if (shopId == "" || shopId == null) {
      if (opt) {
        shopId = opt.shopId
      }
      if (shopId == "" || shopId == null) {
        lat = wx.getStorageSync('lat')
        lon = wx.getStorageSync('lon')
        if (lat == "" || lat == null || lon == "" || lon == null) {
          wx.hideLoading()
          /*wx.showLoading({
            title: '获取定位中',
            mask: true
          })
          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
              lat = parseFloat(res.latitude) + 0.0063
              lon = parseFloat(res.longitude) + 0.0063
              wx.setStorageSync('lat', lat)
              wx.setStorageSync('lon', lon)
              wx.hideLoading()
              that.onLoad()
            }
          })*/
          wx.showToast({
            title: '默认定位宁阳',
            icon:'loading',
            duration:2000
          })
          lat = 35.768668
          lon = 116.80359
          wx.setStorageSync('lat', lat)
          wx.setStorageSync('lon', lon)
          that.onLoad()
        } else {
          wx.hideLoading()
          wx.showLoading({
            title: '获取店铺中',
            mask: true
          })
          var shopCateId = 20
          wx.request({
            url: 'https://safe.asj.com/pls/appapi/latlon/shop/categorys_page.htm',
            data: {
              lat: lat,
              lon: lon,
              shopCateId: shopCateId
            },
            success: function (res) {
              var shopList = res.data.data.shopList
              if (shopList.length > 0) {
                var shopData = shopList[0]
                var shopId = shopData.shopId
                shopName = shopData.shopName
                lat = shopData.lat
                lon = shopData.lon
                wx.setStorageSync('shopName', shopName)
                wx.setStorageSync('lat', lat)
                wx.setStorageSync('lon', lon)
                wx.setStorageSync('shopId', shopId)
                wx.hideLoading()
                that.onLoad()
              } else {
                wx.hideLoading()
                wx.showModal({
                  title: '地址设置提示',
                  content: '该地址范围内，暂时没有开设的店铺，请重新设置一个地址',
                  confirmText: '重设地址',
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '/pages/member/list/list'
                      })
                    }
                  }
                })
              }
            }
          })
        }
      } else {
        lat = opt.lat
        lon = opt.lon
        shopName = opt.shopName
        wx.setStorageSync('shopName', shopName)
        wx.setStorageSync('shopId', shopId)
        wx.setStorageSync('lat', lat)
        wx.setStorageSync('lon', lon)
        that.onLoad()
      }
    } else {
      wx.hideLoading()
      wx.showLoading({
        title: '获取商品中',
        mask: true
      })
      shopName = wx.getStorageSync('shopName')
      wx.setNavigationBarTitle({
        title: shopName
      })
      var cateId = 32
      var typeId = 355
      wx.request({
        url: 'https://safe.asj.com/pls/appapi/shop/pdlist.htm',
        data: {
          shopId: shopId,
          cateId: cateId,
          typeId: typeId
        },
        success: function (resB) {
          var pdPage = resB.data.data.pdpage
          var totalCount = pdPage.totalCount
          if (totalCount > 0) {
            var pdList = pdPage.data
            that.setData({
              shopId: shopId,
              pdList: pdList
            })
          } else {
            wx.showModal({
              title: '商品获取提示',
              content: '该小区内暂无商品上架，请更换一个小区试试',
              confirmText: '切换小区',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/member/list/list'
                  })
                }
              }
            })
          }
          wx.hideLoading()
        }
      })
    }
  }
})
