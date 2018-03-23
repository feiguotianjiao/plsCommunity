//shopCart下的common.js
function changePos(that, isShow, itemCount, wHeight) {
  var maxHeight = wHeight - 396;
  var showCount = parseInt(maxHeight / 144);
  if (isShow) {
    that.setData({
      cartTip_top: '',
      cartContent_top: '',
      cartItems_style: '',
      cartMes_left: '',
      mask_style: '',
      isShow: false
    })
  } else {
    itemCount = 7;
    if (itemCount > showCount) {
      var cartTip_top = maxHeight + 196;
      var cartContent_top = maxHeight + 80;
      that.setData({
        cartTip_top: 'top:-' + cartTip_top + 'rpx',
        cartContent_top: 'top:-' + cartContent_top + 'rpx',
        cartItems_style: 'height:' + maxHeight + 'rpx;overflow:auto;',
        cartMes_left: 'left:20rpx;',
        mask_style: 'display:block',
        isShow: true
      })
    } else {
      var itemHeght = itemCount * 144
      var cartTip_top = itemHeght + 196
      var cartContent_top = itemHeght + 80
      that.setData({
        cartTip_top: 'top:-' + cartTip_top + 'rpx',
        cartContent_top: 'top:-' + cartContent_top + 'rpx',
        cartItems_style: 'height:' + itemHeght + 'rpx;overflow:hidden;',
        cartMes_left: 'left:20rpx;',
        mask_style: 'display:block',
        isShow: true
      })
    }
  }
}
module.exports.changePos = changePos