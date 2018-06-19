// pages/trolley/trolley.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    trolleyList: [], // 购物车商品列表
    trolleyCheckMap: [], // 购物车中选中的id哈希表
    trolleyAccount: 0, // 购物车结算总价
    isTrolleyEdit: false, // 购物车是否处于编辑状态
    isTrolleyTotalCheck: false, // 购物车中商品是否全选
  },

  onTapLogin() {
    app.login({
      success: ({
        userInfo
      }) => {
        this.setData({
          userInfo
        })

        this.getTrolley()
      }
    })
  },

  getTrolley() {
    wx.showLoading({
      title: '刷新购物车数据...',
    })

    qcloud.request({
      url: config.service.trolleyList,
      login: true,
      success: result => {
        // console.log(34, result);

        wx.hideLoading()

        let data = result.data

        if (!data.code) {
          this.setData({
            trolleyList: data.data
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '数据刷新失败',
          })
        }
      },
      fail: () => {
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '数据刷新失败',
        })
      }
    })
  },

  onTapCheckSingle(event) {
    let currentId = event.currentTarget.dataset.id
    let price = event.currentTarget.dataset.price
    let count = event.currentTarget.dataset.count

    let trolleyCheckMap = this.data.trolleyCheckMap
    let trolleyList = this.data.trolleyList
    let trolleyAccount = this.data.trolleyAccount

    let totalCheckedNum;
    let singleCheckedNum = 0; // 这里必须设置初始值为0， 不然下面 累加的时候会变成NaN

    trolleyCheckMap[currentId] = !trolleyCheckMap[currentId]
    totalCheckedNum = trolleyList.length;

    trolleyCheckMap.forEach((isChecked) => {
      singleCheckedNum = isChecked ? singleCheckedNum + 1 : singleCheckedNum;
      trolleyAccount = isChecked ? price * count + trolleyAccount : trolleyAccount
    })

    // 计算总金额
    trolleyAccount = this.calcAccount(trolleyCheckMap, trolleyList)

    //  改变data的值必须通过setData
    this.setData({
      trolleyCheckMap: trolleyCheckMap,
      isTrolleyTotalCheck: (singleCheckedNum === totalCheckedNum) ? true : false,
      trolleyAccount: trolleyAccount.toFixed(2)
    })
  },

  // 全选
  onTapCheckTotal() {
    let isTrolleyTotalCheck = this.data.isTrolleyTotalCheck
    let trolleyCheckMap = this.data.trolleyCheckMap
    let trolleyList = this.data.trolleyList
    let trolleyAccount = this.data.trolleyAccount

    isTrolleyTotalCheck = !isTrolleyTotalCheck

    // 遍历并修改所有商品的状态
    trolleyList.forEach((item) => {
      trolleyCheckMap[item.id] = isTrolleyTotalCheck
    })

    trolleyAccount = this.calcAccount(trolleyCheckMap, trolleyList)

    this.setData({
      isTrolleyTotalCheck: isTrolleyTotalCheck,
      trolleyCheckMap: trolleyCheckMap,
      trolleyAccount: trolleyAccount.toFixed(2)
    })
  },

  calcAccount(trolleyCheckMap, trolleyList) {
    let account = 0;
    trolleyList.forEach((item) => {
      account = trolleyCheckMap[item.id] ? account + item.price * item.count : account;
    })
    return account;
  },

  onTapEditTrolley() {
    let isTrolleyEdit = this.data.isTrolleyEdit

    if (isTrolleyEdit) {
      this.updateTrolley()
    } else {
      this.setData({
        isTrolleyEdit: !isTrolleyEdit
      })
    }
  },

  // 增加单项数量
  // 减少单项数量
  adjustTrolleyProductCount(event) {

    let currentId = event.currentTarget.dataset.id
    let type = event.currentTarget.dataset.type

    let trolleyCheckMap = this.data.trolleyCheckMap
    let trolleyList = this.data.trolleyList

    trolleyList.map((item, index) => {
      if (currentId === item.id) {
        if (type === "minus") {
          if (item.count <= 1) {
            trolleyCheckMap.splice(index, 1)
            trolleyList.splice(index, 1)
          } else {
            item.count -= 1
          }
        } else {
          item.count += 1
        }
      }
    })
    let trolleyAccount = this.calcAccount(trolleyCheckMap, trolleyList)

    // 当购物车为空 同步到服务器
    if (!trolleyList.length) {
      this.updateTrolley()
    }

    this.setData({
      trolleyList: trolleyList,
      trolleyCheckMap: trolleyCheckMap,
      trolleyAccount: trolleyAccount
    })
  },

  updateTrolley() {
    wx.showLoading({
      title: '更新购物车数据...',
    })

    let trolleyList = this.data.trolleyList

    qcloud.request({
      url: config.service.updateTrolley,
      method: 'POST',
      login: true,
      data: {
        list: trolleyList
      },
      success: result => {
        wx.hideLoading()

        let data = result.data

        if (!data.code) {
          this.setData({
            isTrolleyEdit: false
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '更新购物车失败'
          })
        }
      },
      fail: () => {
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '更新购物车失败'
        })
      }
    })
  },

  onTapPay() {
    if (!this.data.trolleyAccount) return

    wx.showLoading({
      title: '结算中..',
    })

    let trolleyList = this.data.trolleyList
    let trolleyCheckMap = this.data.trolleyCheckMap

    let needToPayProductList = trolleyList.filter(item => {
      return !!trolleyCheckMap[item.id]
    })

    qcloud.request({
      url: config.service.addOrder,
      login: true,
      method: 'POST',
      data: {
        list: needToPayProductList
      },
      success: result => {
        wx.hideLoading()

        let data = result.data

        if (!data.code) {
          wx.showToast({
            title: '商品购买成功',
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '商品购买失败',
          })
        }
      },
      fail: () => {
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '商品购买失败',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    app.checkSession({
      success: ({
        userInfo
      }) => {
        this.setData({
          userInfo
        })
        this.getTrolley()
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

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