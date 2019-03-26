//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    name: '探长探店',
    userInfo: {},
    phonePop: false,
    baffle: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    bar_Height: wx.getSystemInfoSync().statusBarHeight 
  },
  //事件处理函数
  bindViewTap: function() {
   
  },
  onLoad: function () {
    let _self = this;
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.checkSession({
            success() {
              _self.setData({
                baffle: true
              })
              // wx.switchTab({
              //   url: "../home/home"
              // })
              wx.navigateTo({
                url: '../share/share'
              })
            },
            fail() {
              _self.setData({
                baffle: false
              })
            }
          })
        } else {
          this.setData({
            baffle:false
          })
        }
      }
    })
  },
  getUserInfo: function(e) {  
    console.log(e)  
    let _self = this;
    if (e.detail.errMsg == "getUserInfo:fail auth deny") {
      console.log("拒绝授权用户信息");
      wx.showToast({
        title: "取消授权",
        icon: 'none',
        duration: 2000
      });
    } else {
      console.log("允许授权用户信息");
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
        phonePop: true
      })
      wx.checkSession({
        complete: function () {
          wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              if (res.code) {
                //发起网络请求
                console.log(res)
                wx.request({
                  url: app.util.getUrl('/auth/sign'),
                  method: 'POST',
                  header: {
                    'apiKey': '6b774cc5eb7d45818a9c7cc0a4b6920f' // 默认值
                  },
                  data: {
                    'code': res.code,
                    "iv": e.detail.iv,
                    "encryptedData": e.detail.encryptedData,
                  },
                  success: function (res) {
                    let data = res.data;
                    if (data.code == 200) {
                      if (data.result.token) {
                        wx.setStorageSync('token', data.result.token);
                        app.globalData.token.token = data.result.token;
                      }
                      // wx.switchTab({
                      //     url: "../brand/index"
                      // })
                    } else {
                      wx.showToast({
                        title: data.message,
                        duration: 2000
                      });
                    }
                  }
                })
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
        }
      })
    }
  },
  getPhoneNumber(e) {
    this.setData({
      phonePop: false
    })
    
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) {

        }
      })
    } else {
      app.globalData.userPhone = e.detail.encryptedData
      console.log("获取userPhone")
      console.log(e)
      wx.request({
        url: app.util.getUrl('/phone/bind'),
        method: 'POST',
        data: {
          "iv": e.detail.iv,
          "encryptedData": e.detail.encryptedData,
        },
        header: app.globalData.token,
        success: function (res) {
          let data = res.data;
          if (data.code == 200 || data.code == 405025) {
            wx.switchTab({
              url: '../home/home'
            })

          } else {
            wx.showToast({
                title: data.message,
                duration: 2000
            });
          }
        }
      });
    }

  },
  closePop() {
    this.setData({
      phonePop: false
    })
  }
})
