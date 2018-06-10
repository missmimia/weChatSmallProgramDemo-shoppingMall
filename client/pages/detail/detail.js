// pages/detail.js
const qcloud = require('../../vendor/wafer2-client-sdk/index');
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.getProductDetail(options.id)
  },

  getProductDetail(id) {

    wx.showLoading({
      title: '正在加载商品详情',
    })

    qcloud.request({

      // url: 'https://zexsphsr.qcloud.la/weapp/product',
      url: config.service.productDetail + id,

      success: result => {

        console.log(result);

        let data = result.data
        if (!data.code) {
          this.setData({
            productList: data.data
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '商品数据加载错误',
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        }
      },
      fail: result => {
        wx.showToast({
          icon: 'none',
          title: '商品数据加载错误',
        })
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})