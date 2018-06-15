// pages/user/user.js
const qcloud = require('../../vendor/wafer2-client-sdk/index');
const config = require('../../config.js')

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onTapLogin: function () {
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        });
      }
    })
  },

  onTapAddress: function () {
    wx.showToast({
      title: '暂未开放该功能',
      icon: 'none'
    })
  },
  onTapKf: function () {
    wx.showToast({
      title: '暂未开放该功能',
      icon: 'none'
    })
  },
  //  页面载入时，检查用户是否登陆、处在一个会话当中
  checkSession: ({ success, error }) => {
    wx.checkSession({
      //  检查会话成功，就调用 getUserInfo，自动加载用户数据并展示。否则则调用失败情况下的回调函数。
      success: (res) => {
        console.log(res);
      },

      fail: (res) => { },
      complete: (res) => { },
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

    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo: userInfo
        })
      },
      error: () => { }
    })

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