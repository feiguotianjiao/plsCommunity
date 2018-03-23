/*  
  Author:HouLei
  Contact:353731385@qq.com
  tel:15963115707
  Github: https://github.com/feiguotianjiao/pls_wxApp.git
*/
//cart.js
//获取应用实例
var app = getApp()
var shopId
Page({
  data: {},
  toWriteOrder: function (event) {
    app.toWriteOrder(shopId)
  },
  delPd: function (e) {
    var statusName = 'delPd'
    var pdId = e.currentTarget.dataset.pdid
    this.changeStatus(shopId, statusName, pdId)
  },
  cancelAllSel: function (event) {
    var statusName = 'cancelAllSel'
    var pdId = 0
    this.changeStatus(shopId, statusName, pdId)
  },
  changeAllSel: function (event) {
    var statusName = 'changeAllSel'
    var pdId = 0
    this.changeStatus(shopId, statusName, pdId)
  },
  cancelSel: function (event) {
    var statusName = 'cancelSel'
    var pdId = event.currentTarget.dataset.pdid
    this.changeStatus(shopId, statusName, pdId)
  },
  changeSel: function (event) {
    var statusName = 'changeSel'
    var pdId = event.currentTarget.dataset.pdid
    this.changeStatus(shopId, statusName, pdId)
  },
  addCount: function (event) {
    var statusName = 'addCount'
    var pdId = event.currentTarget.dataset.pdid
    this.changeStatus(shopId, statusName, pdId)
  },
  reduceCount: function (event) {
    var statusName = 'reduceCount'
    var pdId = event.currentTarget.dataset.pdid
    this.changeStatus(shopId, statusName, pdId)
  },
  changeStatus: function (shopId, statusName, pdId) {
    var cartList = wx.getStorageSync('cartList')
    var that = this
    for (var i in cartList) {
      if (cartList[i].shopId == shopId) {
        var pdList = cartList[i].pdlist
        for (var j in pdList) {
          if (statusName == 'changeAllSel') {
            pdList[j].isSel = 1
          } else if (statusName == 'cancelAllSel') {
            pdList[j].isSel = 0
          } else {
            if (pdList[j].pdId == pdId) {
              if (statusName == 'changeSel') {
                pdList[j].isSel = 1
              } else if (statusName == 'cancelSel') {
                pdList[j].isSel = 0
              } else if (statusName == 'addCount') {
                pdList[j].num += 1
              } else if (statusName == 'reduceCount') {
                if (pdList[j].num > 1) {
                  pdList[j].num -= 1
                  that.cartInit(cartList)
                } else {
                  pdList.splice(j, 1)
                  if (pdList.length > 0) {
                    cartList[i].pdlist = pdList
                  } else {
                    cartList.splice(i, 1)
                  }
                  wx.showModal({
                    title: '购物车提示',
                    content: '数量为0，将删除该商品，确定删除该商品？',
                    confirmText: '确定删除',
                    success: function (res) {
                      if (res.confirm) {
                        that.cartInit(cartList)
                      }
                    }
                  })
                }
              } else if (statusName == 'delPd') {
                pdList.splice(j, 1)
                if (pdList.length > 0) {
                  cartList[i].pdlist = pdList
                } else {
                  cartList.splice(i, 1)
                }
                wx.showModal({
                  title: '购物车提示',
                  content: '确定删除该商品？',
                  confirmText: '确定删除',
                  success: function (res) {
                    if (res.confirm) {
                      that.cartInit(cartList)
                    }
                  }
                })
              }
            }
          }
        }
        if (statusName == 'delPd' || statusName == 'reduceCount') {
          wx.hideLoading()
        } else {
          this.cartInit(cartList)
        }
      }
    }
  },
  cartInit: function (cartList) {
    wx.setStorageSync('cartList', cartList)
    wx.setStorageSync('cartChange', false)
    this.onShow()
  },
  onShow: function () {
    var cartChange = wx.getStorageSync('cartChange')
    if (!cartChange) {
      this.onLoad()
    }
  },
  onLoad: function () {
    var that = this
    app.toLoad()
    shopId = wx.getStorageSync('shopId')
    var cartList = wx.getStorageSync('cartList')
    var shopCartList = ''
    if (cartList) {
      var hasShop = false
      for (var i in cartList) {
        if (cartList[i].shopId == shopId) {
          shopCartList = cartList[i]
          var pdList = shopCartList.pdlist
          var totalPri = 0
          var totalSelNum = 0
          var totalNum = 0
          for (var j in pdList) {
            totalNum += parseInt(pdList[j].num)
            if (pdList[j].isSel == 1) {
              var thisSelNum = parseInt(pdList[j].num)
              totalSelNum += thisSelNum
              totalPri += parseFloat(pdList[j].price) * thisSelNum
            }
          }
          totalPri = totalPri.toFixed(2)
          that.setData({
            shopCartList: shopCartList,
            totalNum: totalNum,
            totalSelNum: totalSelNum,
            totalPri: totalPri,
            shopId: shopId
          })
          hasShop = true
        }
      }
      if (!hasShop) {
        that.setData({
          shopCartList: shopCartList
        })
      }
    } else {
      that.setData({
        shopCartList: shopCartList
      })
    }
    wx.setStorageSync('cartChange', true)
    wx.hideLoading()
  }
})
