//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

let userInfo;

App({
  onLaunch: function () {
    qcloud.setLoginUrl(config.service.loginUrl)
  },

  login({ success, error }) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo'] === false) {
          // 已拒绝授权
          wx.showModal({
            title: '提示',
            content: '请授权我们获取您的用户信息',
            showCancel: false,
            success: () => {
              wx.openSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo'] === true) {
                    this.doQcloudLogin({ success, error })
                  }
                }
              })
            }
          })
        } else {
          this.doQcloudLogin({ success, error })
        }
      }
    })
  },

  doQcloudLogin({ success, error }) {
    // 设置登录地址 https://cloud.tencent.com/document/product/619/11449
    // qcloud.setLoginUrl(config.service.loginUrl);
    // 调用 qcloud 登陆接口
    qcloud.login({
      success: result => {
        console.log("qcloud login success", result)

        if (result) {
          userInfo = result

          success && success({
            userInfo
          })
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          this.getUserInfo({ success, error })
        }
      },
      fail: () => {
        console.log('login fail', error)
        error && error()
      }
    })
  },

  getUserInfo({ success, error }) {
    if (userInfo) return userInfo

    qcloud.request({
      url: config.service.user,
      login: true,
      success: result => {
        let data = result.data
        if (!data.code) {
          userInfo = data.data
          success && success({
            userInfo
          })
        } else {
          error && error()
        }
      },
      fail: () => {
        error && error()
      }
    })
  },

  checkSession({ success, error }) {
    console.log('执行了checkSession');

    if (userInfo) {
      return success && success({
        userInfo
      })
    }

    wx.checkSession({
      success: () => {
        console.log('checkSession')
        this.getUserInfo({
          success: res => {
            console.log('checkSession getUserInfo success', res)
            userInfo = res.userInfo

            success && success({
              userInfo
            })
          },
          fail: () => {
            error && error()
          }
        })
      },
      fail: () => {
        error && error()
      }
    })
  }
})