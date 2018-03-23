/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//writeOrder.js
//获取应用实例
var app = getApp()
var header, shopId, lat, lon, cartJson, addressId, totalPay, addressMobile, addressConsignee, cartList, time, isPd
var deliveryType = 1
var payType = 0
var notice = ''
Page({
  data: {
    getPhoneStyle: 'display:none;'
  },
  changeIptVal: function (e) {
    var iptVal = e.detail.value
    var iptKey = e.currentTarget.dataset.ipt
    if (iptKey == 'name') {
      addressConsignee = iptVal
    } else if (iptKey == 'mobile') {
      addressMobile = iptVal
      if (!app.isMobile(addressMobile)) {
        this.wetoast.toast({
          title: '请输入正确格式的手机号',
          duration: 2000
        })
      }
    } else if (iptKey == 'notice') {
      notice = iptVal
    }
  },
  toSubmit: function () {
    var that = this
    if (addressConsignee.replace(/(^\s*)|(\s*$)/g, "").length < 2) {
      that.wetoast.toast({
        title: '请填写两字以上姓名',
        duration: 2000
      })
      return
    }
    if (!addressMobile) {
      that.wetoast.toast({
        title: '请填写手机号',
        duration: 2000
      })
      return
    } else {
      if (!app.isMobile(addressMobile)) {
        that.wetoast.toast({
          title: '请输入正确格式的手机号',
          duration: 2000
        })
        return
      }
    }
    wx.showLoading({
      title: '订单生成中',
      mask: true
    })
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/latlon/orders/create.htm',
      header: header,
      data: {
        addressId: addressId,
        shopId: shopId,
        cartJson: cartJson,
        deliveryType: deliveryType,
        time: time,
        payType: payType,
        notice: notice,
        addressMobile: addressMobile,
        addressConsignee: addressConsignee
      },
      success: function (res) {
        var ordersNo = res.data.data
        if (ordersNo) {
          if (isPd == 1 || isPd == "1") {
          } else {
            for (var i in cartList) {
              if (cartList[i].shopId == shopId) {
                var pdList = cartList[i].pdlist
                var tempPdList = []
                for (var j in pdList) {
                  if (pdList[j].isSel == 0) {
                    tempPdList.push(pdList[j])
                  }
                }
                if (tempPdList.length > 0) {
                  cartList[i].pdlist = tempPdList
                  wx.setStorageSync('cartList', cartList)
                  wx.setStorageSync('cartChange', false)
                } else {
                  cartList.splice(i, 1)
                  wx.setStorageSync('cartList', cartList)
                  wx.setStorageSync('cartChange', false)
                }
              }
            }
          }
          wx.hideLoading()
          wx.redirectTo({
            url: '/pages/orders/orderPay/orderPay?ordersNo=' + ordersNo,
          })
        } else {
          wx.hideLoading()
          that.wetoast.toast({
            title: '订单生成出错',
            duration: 2000
          })
        }
      }
    })
  },
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  orderInit: function () {
    var that = this
    addressId = wx.getStorageSync('addressId')
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/latlon/orders/write.htm',
      header: header,
      data: {
        shopId: shopId,
        cartJson: cartJson,
        addressId: addressId
      },
      success: function (res) {
        var userData = res.data.data
        totalPay = userData.totalPriceNew.toFixed(2)
        var mobile = userData.mobile
        if (!app.isMobile(mobile)) {
          mobile = ''
        }
        addressMobile = mobile
        addressConsignee = userData.consignee
        that.setData({
          userData: userData,
          mobile: mobile,
          consignee: addressConsignee,
          totalPay: totalPay
        })
        wx.hideLoading()
      }
    })
  },
  onLoad: function (opt) {
    app.toLoad()
    new app.WeToast()
    var that = this
    var nowTime = new Date()
    time = nowTime.getFullYear() + '-' + (nowTime.getMonth() + 1) + '-' + nowTime.getDate() + ' ' + nowTime.getHours() + ':' + nowTime.getMinutes()
    shopId = opt.shopId
    cartJson = opt.pdsJson
    isPd = opt.isPd
    header = wx.getStorageSync('header')
    cartList = wx.getStorageSync('cartList')
    addressId = wx.getStorageSync('addressId')
    lat = wx.getStorageSync('lat')
    lon = wx.getStorageSync('lon')
    if (addressId) {
      that.orderInit()
    } else {
      wx.request({
        url: 'https://safe.asj.com/pls/appapi/latlon/member/address/list.htm',
        header: header,
        success: function (res) {
          var addressList = res.data.data
          if (addressList && addressList.length > 0) {
            var addressId = addressList[0].adId
            wx.setStorageSync('addressId', addressId)
            that.orderInit()
          } else {
            var n = '', m = '', d = ''
            wx.request({
              url: 'https://safe.asj.com/pls/appapi/latlon/address/add.htm',
              header: header,
              data: {
                lon: lon,
                lat: lat,
                n: n,
                m: m,
                d: d
              },
              success: function (res) {
                var addressId = res.data.data
                wx.setStorageSync('addressId', addressId)
                that.orderInit()
              }
            })
          }
        }
      })
    }
    setTimeout(function () {
      wx.hideLoading()
    }, 10000)
  }
})
