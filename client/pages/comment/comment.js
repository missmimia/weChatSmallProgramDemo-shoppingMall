// pages/comment.js
const qcloud = require('../../vendor/wafer2-client-sdk/index');
const config = require('../../config.js')
const _ = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    commentList: [], // 评论列表
  },

  getCommentList(id) {
    qcloud.request({
      url: config.service.commentList,
      data: {
        product_id: id
      },
      success: result => {
        console.log(20, result)
        let data = result.data
        if (!data.code) {
          this.setData({
            // commentList: data.data.map(item => {
            //   let itemDate = new Date(item.create_time)
            //   item.createTime = _.formatTime(itemDate)
            //   return item
            // })
          })
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options) // 获取上一个页面传递过来的路由参数
    let product = {
      id: options.id,
      price: options.price,
      image: options.image,
      name: options.name,
    }

    this.setData({
      product: product
    })

    this.getCommentList(product.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})