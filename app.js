/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//app.js
let { WeToast } = require('/utils/wetoast/wetoast.js')
App({
  WeToast,
  onLaunch: function () {
    this.toCheckLogin()
  },
  isMobile: function (mobile) {
    if (/^(\(\d{3,4}\)|\d{3,4}-|\+\d{2,4}|\s)?\d{7,14}$/.test(mobile)) {
      return true
    } else {
      return false
    }
  },
  getCartCount: function (pageObj) {
    var cartCount = 0
    var cartList = wx.getStorageSync('cartList')
    var shopId = wx.getStorageSync('shopId')
    if (cartList) {
      for (var i in cartList) {
        if (cartList[i].shopId == shopId) {
          var pdList = cartList[i].pdlist
          for (var j in pdList) {
            cartCount += pdList[j].num
          }
        }
      }
    }
    pageObj.setData({
      cartCount: cartCount
    })
  },
  addCartData: function (pageObj, shopId, pdId) {
    wx.showLoading({
      title: '正在加入购物车',
      mask: true
    })
    var that = this
    var header = wx.getStorageSync('header')
    var lat = wx.getStorageSync('lat')
    var lon = wx.getStorageSync('lon')
    var cartList = wx.getStorageSync('cartList')
    var cartJson = that.getCartStr(shopId, pdId)
    if (cartList) {
      var hasShop = false
      for (var i in cartList) {
        if (cartList[i].shopId == shopId) {
          var pdList = cartList[i].pdlist
          var hasPd = false
          for (var j in pdList) {
            if (pdList[j].pdId == pdId) {
              pdList[j].num += 1
              hasPd = true
              cartList[i].pdlist=pdList
              wx.setStorageSync('cartList', cartList)
              wx.setStorageSync('cartChange', false)
              that.getCartCount(pageObj)
              wx.hideLoading()
              wx.showToast({
                title: '成功加入',
                icon: 'success',
                duration: 1000
              })
            }
          }
          if (!hasPd) {
            wx.request({
              url: 'https://safe.asj.com/pls/appapi/latlng/cart/info-new.htm',
              data: {
                lat: lat,
                lon: lon,
                cartJson: cartJson,
                isOnlyShowSend: false
              },
              header: header,
              success: function (res) {
                var tempList = res.data.data.cartList
                pdList.push(tempList[0].pdlist[0])
                cartList[i].pdlist = pdList
                wx.setStorageSync('cartList', cartList)
                wx.setStorageSync('cartChange', false)
                that.getCartCount(pageObj)
                wx.hideLoading()
                wx.showToast({
                  title: '成功加入',
                  icon: 'success',
                  duration: 1000
                })
              }
            })
            setTimeout(function () {
              wx.hideLoading()
            }, 5000)
          }
          hasShop = true
        }
      }
      if (!hasShop) {
        wx.request({
          url: 'https://safe.asj.com/pls/appapi/latlng/cart/info-new.htm',
          data: {
            lat: lat,
            lon: lon,
            cartJson: cartJson,
            isOnlyShowSend: false
          },
          header: header,
          success: function (res) {
            var tempList = res.data.data.cartList
            cartList = cartList.concat(tempList)
            wx.setStorageSync('cartList', cartList)
            wx.setStorageSync('cartChange', false)
            that.getCartCount(pageObj)
            wx.hideLoading()
            wx.showToast({
              title: '成功加入',
              icon: 'success',
              duration: 1000
            })
          }
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 5000)
      }
    } else {
      wx.request({
        url: 'https://safe.asj.com/pls/appapi/latlng/cart/info-new.htm',
        data: {
          lat: lat,
          lon: lon,
          cartJson: cartJson,
          isOnlyShowSend: false
        },
        header: header,
        success: function (res) {
          cartList = res.data.data.cartList
          wx.setStorageSync('cartList', cartList)
          wx.setStorageSync('cartChange', false)
          that.getCartCount(pageObj)
          wx.hideLoading()
          wx.showToast({
            title: '成功加入',
            icon: 'success',
            duration: 1000
          })
        }
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 5000)
    }
  },
  getCartStr: function (shopId, pdId) {
    this.globalData.cartStr = shopId + '-' + pdId + ':' + '1'
    return this.globalData.cartStr
  },
  getCartJson: function () {
    var that = this
    var cartList = wx.getStorageSync('cartList')
    if (cartList) {
      var tempArr = []
      for (var i in cartList) {
        var pdList = cartList[i].pdlist
        for (var j in pdList) {
          tempArr.push(cartList[i].shopId + '-' + pdList[j].pdId + ':' + pdList[j].num + ':' + pdList[j].isSel)
        }
      }
      that.globalData.cartJson = tempArr.join(',')
      return that.globalData.cartJson
    } else {
      return that.globalData.cartJson
    }
  },
  toWriteOrder: function (shopId) {
    var tempArr = []
    var that = this
    var cartList = wx.getStorageSync('cartList')
    for (var i in cartList) {
      if (cartList[i].shopId == shopId) {
        var pdList = cartList[i].pdlist
        for (var j in pdList) {
          if (pdList[j].isSel == 1) {
            tempArr.push(pdList[j].pdId + ':' + pdList[j].num)
          }
        }
        if (tempArr.length > 0) {
          var pdsJson = tempArr.join(',')
          wx.navigateTo({
            url: '/pages/orders/writeOrder/writeOrder?shopId=' + shopId + '&pdsJson=' + pdsJson,
          })
        } else {
          wx.showModal({
            title: '购物车提示',
            content: '购物车中的商品都未选中，去购物车中选中要结算的商品？',
            confirmText: '去选择',
            success: function (res) {
            }
          })
        }
      }
    }
  },
  getSysDpr: function () {
    var that = this
    if (that.globalData.sysDpr) {
      return that.globalData.sysDpr
    } else {
      //调用获取系统信息接口
      wx.getSystemInfo({
        success: function (res) {
          that.globalData.sysDpr = 750 / res.windowWidth
        }
      })
      return that.globalData.sysDpr
    }
  },
  toCheckLogin: function () {
    //处理header，加入JSESSIONID
    var header = wx.getStorageSync('header')
    if (header == "" || header == null) {
      header = { 'content-type': 'application/json' }
    }
    //检测小程序登录状态、进行登录
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/latlon/member/checkLogin.htm',
      header: header,
      success: function (resA) {
        var data = resA.data.data
        if (!data) {
          wx.login({
            success: function (resB) {
              if (resB.code) {
                //发起网络请求
                wx.request({
                  url: 'https://safe.asj.com/pls/xcx/member/communityLogin.htm',
                  header: header,
                  data: {
                    code: resB.code
                  },
                  success: function (resC) {
                    header = { 'content-type': 'application/json', 'Cookie': 'PLSID=' + resC.data.data}
                    wx.setStorageSync("header", header)
                  }
                })
              }
            }
          });
        }
      }
    })
  },
  toLoad: function () {
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })
  },
  globalData: {
    sysDpr: null,
    cartJson: '',
    cartStr: ''
  }
})
