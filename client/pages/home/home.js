// pages/home/home.js
const qcloud = require('../../vendor/wafer2-client-sdk/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: [], // 商品列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProductList();
  },

  getProductList() {
    wx.showLoading({
      title: '商品数据加载中...',
    })
    qcloud.request({
      url: 'https://zexsphsr.qcloud.la/weapp/product',
      success: result => {
        wx.hideLoading();
        console.log(result);

        let data = result.data
        if (!data.code) {
          console.log(12)
          this.setData({
            productList: data.data
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '商品数据加载错误',
          })
        }
      },
      fail: result => {
        console.log('error!')
      },
      error: error => {
        console.log(error)
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