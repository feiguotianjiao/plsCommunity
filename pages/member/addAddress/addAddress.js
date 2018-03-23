/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//setAddress.js
var app = getApp()
var adId, header
var n = '',m = '',d = ''
Page({
  data: {
    addrDto:{}
  },
  changeIptVal: function (e) {
    var iptVal = e.detail.value
    var iptKey = e.currentTarget.dataset.ipt
    if (iptKey == 'name') {
      n = iptVal
    } else if (iptKey == 'mobile') {
      m = iptVal
      if (!app.isMobile(m)) {
        this.wetoast.toast({
          title: '请输入正确格式的手机号',
          duration: 2000
        })
      }
    }
  },
  toSubmit: function () {
    var that = this
    if (!n) {
      that.wetoast.toast({
        title: '请填写收货人姓名',
        duration: 2000
      })
      return
    } else {
      if (n.replace(/(^\s*)|(\s*$)/g, "").length < 2) {
        that.wetoast.toast({
          title: '请输入2字符以上的姓名',
          duration: 2000
        })
        return
      }
    }
    if (!m) {
      that.wetoast.toast({
        title: '请填写手机号',
        duration: 2000
      })
      return
    } else {
      if (!app.isMobile(m)) {
        that.wetoast.toast({
          title: '请输入正确格式的手机号',
          duration: 2000
        })
        return
      }
    }
    app.toLoad()
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/address/edit.htm',
      header: header,
      data: {
        adId: adId,
        n: n,
        m: m,
        d: d
      },
      success: function (res) {
        wx.switchTab({
          url: '/pages/member/myIndex/myIndex',
        })
        wx.hideLoading()
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 10000)
  },
  onLoad: function (opt) {
    new app.WeToast()
    var that = this
    header = wx.getStorageSync('header')
    adId = opt.adId
    app.toLoad()
    wx.request({
      url: 'https://safe.asj.com/pls/appapi/latlon/member/address/list.htm',
      header: header,
      success: function (res) {
        var addressList = res.data.data
        if (addressList && addressList.length > 0) {
          if (adId){
            for (var i = 0; i < addressList.length; i++) {
              if (adId == addressList[i].adId) {
                var addrDto = addressList[i]
                that.setData({
                  addrDto: addrDto
                })
                n = addrDto.name
                m = addrDto.mobile
              }
            }
            wx.hideLoading()
          }else{
            var addrDto = addressList[0]
            that.setData({
              addrDto: addrDto
            })
            n = addrDto.name
            m = addrDto.mobile
            adId = addressList[0].adId
            wx.setStorageSync('addressId', adId)
            wx.hideLoading()
          }
        } else {
          lat = wx.getStorageSync('lat')
          lon = wx.getStorageSync('lon')
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
              adId = res.data.data
              wx.setStorageSync('addressId', adId)
              wx.hideLoading()
            }
          })
        }
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 10000)
  }
})
