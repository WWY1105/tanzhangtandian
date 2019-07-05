// pages/component/auth.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showComponent:	{		// 控制返回箭头是否显示
      type: Boolean,
      value: true
    },
  },

  attached: function () {
    console.log("0000")
    this.authinit()
  },

  /**
   * 组件的初始数据
   */
  data: {
    showImg:false,
    code:'',
    userInfo: '',
    hasUserInfo: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    authinit: function(){
      console.log("11111")
      var _self = this
      if (wx.getStorageSync('token')) {
        console.log("有token")
        wx.checkSession({
          success() {
            
          },
          fail() {
            wx.login({
              success: res => {
                if (res.code) {
                  _self.setData({
                    code: res.code
                  })
                  //发起网络请求
                  wx.request({
                    url: app.util.getUrl('/auth'),
                    method: 'POST',
                    header: app.globalData.token,
                    data: {
                      code: res.code
                    },
                    success: function (res) {
                      let data = res.data;
                      if (data.code == 200) {
                        if (data.result.token) {
                          wx.setStorageSync('token', data.result.token);
                          app.globalData.token.token = data.result.token;
                        }
                      } else {
                        _self.setData({
                          show: true
                        })
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
      } else {
        console.log("无token")
        wx.login({
          success: res => {
            if (res.code) {
              _self.setData({
                code: res.code
              })
              //发起网络请求
              wx.request({
                url: app.util.getUrl('/auth'),
                method: 'POST',
                header: app.globalData.token,
                data: {
                  code: res.code
                },
                success: function (res) {
                  let data = res.data;
                  if (data.code == 200) {
                    if (data.result.token) {
                      wx.setStorageSync('token', data.result.token);
                      app.globalData.token.token = data.result.token;
                    }                   
                  } else {
                    _self.setData({
                      showImg: true
                    })
                  }
                }
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })

      }
    },
    getUserInfo: function (e) {
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
        wx.setStorageSync('userInfo', e.detail.userInfo);
        this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true
        })
        wx.login({
          success: res => {
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
                  that.setData({
                    showImg:false
                  })
                } else {
                  wx.showToast({
                    title: data.message + '',
                    duration: 2000
                  });
                  that.setData({
                    showImg: false
                  })
                }
              }
            })
          }
        })

      }
    },
  }
})
