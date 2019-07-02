//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    name: '探长探店',
    userInfo: {},
    phonePop: false,
    baffle: false,
    id:'',
    code:''
  },
  //事件处理函数
  bindViewTap: function() {
   
  },
  onLoad: function (options) {
    let _self = this;
    if (options.id){
      this.setData({
        id: options.id
      })
    }
    // wx.reLaunch({
    //   url: "../receive/receive?id=" + "800a9ee1055242a99e1b60f2d596a0d1"
    // })
    // return;
    // wx.reLaunch({
    //   url: "../receive/receive?id=" + "047c5f7f59f14a4fb99a46e3776ef7c3"
    // })
    // return;
    // wx.reLaunch({
    //   url: "../receive/receive?id=" + "0574306cacf444cd9f85a76f943c3b86"
    // })
    // return;
    wx.showLoading({
      title: '加载中',
    })
    // if (wx.getStorageSync('userInfo')) {
    //   console.log("33333")
    //   app.globalData.userInfo = wx.getStorageSync('userInfo')
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else {
    //   console.log("111111")
    //   wx.hideLoading();
    //   this.setData({
    //     baffle: true
    //   })
    //   wx.login({
    //     success: res => {
    //       if (res.code) {
    //         _self.setData({
    //           code: res.code
    //         })
    //       } else {
    //         console.log('登录失败！' + res.errMsg)
    //       }
    //     }
    //   })
    //   return;
    // }
    
    if (wx.getStorageSync('token')) {
      console.log("有token")
      wx.checkSession({
        success() {
          var pages = getCurrentPages()
          var currPage;
          if (pages.length > 1) {
            console.log("有上级页面")
            console.log(pages)
            currPage = pages[pages.length - 2].route;

            if (currPage == "pages/receive/receive") {
              console.log("上级页面为领取")
              wx.reLaunch({
                url: "../receive/receive?id=" + _self.data.id
              })
            } else {
              wx.switchTab({
                url: "../home/home"
              })
            }
          } else {
            console.log("无上级页面")
            wx.switchTab({
              url: "../home/home"
            })
          
          }
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
                      var pages = getCurrentPages()
                      var currPage;
                      if (pages.length > 1) {
                        console.log("有上级页面")
                        console.log(pages)
                        currPage = pages[pages.length - 2].route;

                        if (currPage == "pages/receive/receive") {
                          console.log("上级页面为领取")
                          wx.reLaunch({
                            url: "../receive/receive?id=" + _self.data.id
                          })
                        } else {
                          wx.switchTab({
                            url: "../home/home"
                          })
                        }
                      } else {
                        console.log("无上级页面")
                        wx.switchTab({
                          url: "../home/home"
                        })
                      }

                    } else {
                      wx.hideLoading();
                      _self.setData({
                        baffle: true
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
                  var pages = getCurrentPages()
                  var currPage;
                  if (pages.length > 1) {
                    console.log("有上级页面")
                    console.log(pages)
                    currPage = pages[pages.length - 2].route;

                    if (currPage == "pages/receive/receive") {
                      console.log("上级页面为领取")
                      wx.reLaunch({
                        url: "../receive/receive?id=" + _self.data.id
                      })
                    } else {
                      wx.switchTab({
                        url: "../home/home"
                      })
                    }
                  } else {
                    console.log("无上级页面")
                    wx.switchTab({
                      url: "../home/home"
                    })
                  }

                } else {
                  wx.hideLoading();
                  _self.setData({
                    baffle: true
                  })
                }
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
      _self.setData({
        baffle: false
      })
      wx.hideLoading();
    }
    
  },
  
  getUserInfo: function(e) {  
    console.log("101010")
    console.log(e)  
    wx.showLoading({
      title: '加载中',
    })
    let _self = this;
    if (e.detail.errMsg == "getUserInfo:fail auth deny") {
      console.log("拒绝授权用户信息");
      wx.showToast({
        title: "取消授权",
        icon: 'none',
        duration: 2000
      });
    } else {
      wx.showLoading({
        title: '加载中',
      })
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
                var pages = getCurrentPages()
                var currPage;
                if (pages.length > 1) {
                  console.log("有上级页面")
                  console.log(pages)
                  currPage = pages[pages.length - 2].route;

                  if (currPage == "pages/receive/receive") {
                    console.log("上级页面为领取")
                    wx.reLaunch({
                      url: "../receive/receive?id=" + _self.data.id
                    })
                  } else {
                    wx.switchTab({
                      url: "../home/home"
                    })
                  }
                } else {
                  console.log("无上级页面")
                  wx.switchTab({
                    url: "../home/home"
                  })
                }

              } else {
                wx.showToast({
                  title: data.message+'',
                  duration: 2000
                });
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
          wx.navigateTo({
            url: '../share/share'
          })
        }
      })
    } else {
      app.globalData.userPhone = e.detail.encryptedData
      wx.setStorageSync('userPhone', e.detail.encryptedData);
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
            wx.navigateTo({
              url: '../share/share'
            })

          } else {
            wx.showToast({
                title: data.message+'',
                duration: 2000
            });
          }
        }
      });
    }
    wx.switchTab({
      url: "../home/home"
    })
},
  closePop() {
    this.setData({
      phonePop: false
    })
  }
})
