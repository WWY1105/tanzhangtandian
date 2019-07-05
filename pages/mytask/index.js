import Canvas from '../../utils/ringProgress.js'
const app = getApp()
Page({
  ...Canvas.options,
  /**
   * 页面的初始数据
   */
  data: {
    ...Canvas.data,
    selectBtn: true,
    endshops:'',
    goingshops: '',
    page: 1,
    page2: '',
    pageSize2: 1,
    circleWith:"",
    ongoing:'',
    finished:'',
    timer1:'',
    timer2:'',
    timer3:'',
    timer4:'',
    phonePop:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: app.util.getUrl('/user'),
      method: 'GET',
      header: app.globalData.token,
      success: function (res) {
        let data = res.data;
        if (data.code == 200) {
          console.log(data.result.phone)
          app.globalData.userInfo = data.result
          if (data.result.avatarUrl) {
            that.setData({
              userimg: data.result.avatarUrl
            })
          } else {
            that.setData({
              userimg: ''
            })
          }

          if (data.result.nickname) {
            that.setData({
              nickName: data.result.nickname
            })
          } else {
            that.setData({
              nickName: ''
            })
          }
          if (!data.result.phone && new Date().getTime() > 1562234940000) {
            that.setData({
              phonePop: true
            })
          }else{
            that.setData({
              phonePop: false
            })
          }
        }
      }
    })
  },
  toShare(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../share/share?id=' + id
    })
  },
  toTaskDetail(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../taskDetail/index?id=' + id
    })
  },
  getPhoneNumber(e) {
    wx.showLoading({
      title: '加载中',
    })
    console.log(e)

    if (new Date().getTime() < 1562151607000) {
      return;
    }


    var _self = this
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || e.detail.errMsg == 'getPhoneNumber:user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) {
          wx.hideLoading();
          this.setData({
            phonePop: true
          })
        }
      })
    } else {

      wx.request({
        url: app.util.getUrl('/phone/bind'),
        method: 'POST',
        data: {
          "iv": e.detail.iv,
          "encryptedData": e.detail.encryptedData,
        },
        header: app.globalData.token,
        success: function (res) {
          console.log("/phone/bind")
          console.log(res)
          wx.hideLoading();
          let data = res.data;
          if (data.code == 200 || data.code == 405025) {
            if (data.result) {
              wx.setStorageSync('token', data.result.token);
              app.globalData.token.token = data.result.token
            }
            _self.setData({
              phonePop: false
            })
            wx.showToast({
              title: "授权成功",
              duration: 2000
            });
            _self.onLoad()
          } else {
            // wx.showToast({
            //   title: data.message,
            //   duration: 2000
            // });
          }
        }
      });
    }
  },

  selectBtnFn(e) {
    if (e.currentTarget.dataset.btn == this.data.selectBtn) {
      this.setData({
        selectBtn: !this.data.selectBtn
      })
      this.getshops(this.data.selectBtn, false)
    }
    
  },
  getshops: function (going, put) {
    var _self = this
    if (put) {
      if (going) {
        if (_self.data.pageSize && _self.data.pageSize == this.data.page) {
          return;
        }
        _self.setData({
          page: _self.data.page + 1
        })
      } else {
        if (_self.data.pageSize2 && _self.data.pageSize2 == this.data.page2) {
          return;
        }
        _self.setData({
          page2: _self.data.page2 + 1
        })
      }
    } else {
      if (going) {
        _self.setData({
          page: 1
        })
      } else {
        _self.setData({
          page2: 1
        })
      }
    }
    wx.showLoading({
      title: '加载中',
    })
    if (going) {
      var json = {
        count: 10,
        page: _self.data.page,
        ongoing: going
      }
    } else {
      var json = {
        count: 10,
        page: _self.data.page2,
        ongoing: going
      }
    }
    wx.request({
      url: app.util.getUrl('/tasks', json),
      method: 'GET',
      header: app.globalData.token,
      success: function (res) {
        var tasks = res.data;
        console.log(tasks)
        if (tasks.code == 200) {
          if (going) {
            _self.setData({
              pageSize: res.data.result.pageSize
            })
          } else {
            _self.setData({
              pageSize2: res.data.result.pageSize
            })
          }
          var data = res.data.result.items
          for (var i = 0; i < data.length; i++) {
            var time = new Date(data[i].expiredTime + '').getTime()
            var filter = _self.countdown(time)
            data[i].time = ''
            data[i].time = filter
          }
          if (going) {
            if (put) {
              _self.setData({
                goingshops: _self.data.goingshops.concat(tasks.result.items),
              })

              _self.setData({
                timer1: setInterval(function () {
                  for (var i = 0; i < _self.data.goingshops.length; i++) {
                    var time = new Date(_self.data.goingshops[i].expiredTime + '').getTime()
                    var doc = 'goingshops[' + i + '].time'
                    var filter = _self.countdown(time)
                    _self.setData({
                      [doc]: filter
                    })
                  }
                }, 1000)
              })
            } else {
              _self.setData({
                goingshops: tasks.result.items,
              })

              _self.setData({
                timer2: setInterval(function () {
                  for (var i = 0; i < _self.data.goingshops.length; i++) {
                    var time = new Date(_self.data.goingshops[i].expiredTime + '').getTime()
                    var doc = 'goingshops[' + i + '].time'
                    var filter = _self.countdown(time)
                    _self.setData({
                      [doc]: filter
                    })
                  }
                }, 1000)
              })
            }
            
          } else {
            if (put) {
              _self.setData({
                endshops: _self.data.endshops.concat(tasks.result.items),
              })
              _self.setData({
                timer3: setInterval(function () {
                  for (var i = 0; i < _self.data.endshops.length; i++) {
                    var time = new Date(_self.data.endshops[i].expiredTime + '').getTime()
                    var doc = 'endshops[' + i + '].time'
                    var filter = _self.countdown(time)
                    _self.setData({
                      [doc]: filter
                    })
                  }
                }, 1000)
              })
            } else {
              _self.setData({
                endshops: tasks.result.items
              })
              _self.setData({
                timer4: setInterval(function () {
                  for (var i = 0; i < _self.data.endshops.length; i++) {
                    var time = new Date(_self.data.endshops[i].expiredTime + '').getTime()
                    var doc = 'endshops[' + i + '].time'
                    var filter = _self.countdown(time)
                    _self.setData({
                      [doc]: filter
                    })
                  }
                }, 1000)
              })
            }
          }


          wx.hideLoading();
          
        } else if (tasks.code == 403000) {
          wx.removeStorageSync('token')
          wx.navigateTo({
            url: '../index/index'
          })
        } else {
          wx.hideLoading();
          if(going){
            _self.setData({
              goingshops:""
            })
          }else{
            _self.setData({
              endshops: ""
            })
          }
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: res.message
        });
        wx.hideLoading();
      }
    });
  },
  countdown: function (time) {
    var _self = this
    var leftTime = time - new Date().getTime();
    var d, h, m, s, ms;
    if (leftTime >= 0) {
      d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
      h = Math.floor(leftTime / 1000 / 60 / 60);
      m = Math.floor(leftTime / 1000 / 60 % 60);
      s = Math.floor(leftTime / 1000 % 60);
      ms = Math.floor(leftTime % 1000);
      if (ms < 100) {
        ms = "0" + ms;
      }
      if (s < 10) {
        s = "0" + s;
      }
      if (m < 10) {
        m = "0" + m;
      }
      if (h < 10) {
        h = "0" + h;
      }
    } else {
      h = "00"
      m = "00"
      s = "00"
    }
    var filter = h + ":" + m + ":" + s
    return filter
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
    var that = this
    wx.request({
      url: app.util.getUrl('/user'),
      method: 'GET',
      header: app.globalData.token,
      success: function (res) {
        let data = res.data;
        if (data.code == 200) {
          console.log(data.result.phone)
          app.globalData.userInfo = data.result
          if (data.result.avatarUrl) {
            that.setData({
              userimg: data.result.avatarUrl
            })
          } else {
            that.setData({
              userimg: ''
            })
          }

          if (data.result.nickname) {
            that.setData({
              nickName: data.result.nickname
            })
          } else {
            that.setData({
              nickName: ''
            })
          }
          if (!data.result.phone && new Date().getTime() > 1562234940000) {
            that.setData({
              phonePop: true
            })
          }else{
            that.setData({
              phonePop: false
            })
          }
        }
      }
    })
    wx.request({
      url: app.util.getUrl('/tasks/statistics'),
      method: 'GET',
      header: app.globalData.token,
      success: function (res) {
        let data = res.data;
        if (data.code == 200) {
          that.setData({
           ongoing: data.result.ongoing,
          finished: data.result.finished
         })
        }
      }
    })
    wx.createSelectorQuery().select('#canvasBox').boundingClientRect(function (rect) { //监听canvas的宽高
      console.log(wx.createSelectorQuery().select('#canvasBox'))
      console.log(rect)
      that.setData({
        circleWith: rect.width
      })
    }).exec();
    this.getshops(true, false)
    // this.getshops(false, false)

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this
    clearInterval(that.data.timer1)
    clearInterval(that.data.timer2)
    clearInterval(that.data.timer3)
    clearInterval(that.data.timer4)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this
    clearInterval(that.data.timer1)
    clearInterval(that.data.timer2)
    clearInterval(that.data.timer3)
    clearInterval(that.data.timer4)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (this.data.selectBtn) {
      this.getshops(true, false)
    } else {
      this.getshops(false, true)
    }
   var timer = setTimeout(function(){
      wx.stopPullDownRefresh();
      clearTimeout(timer)
    },1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.selectBtn) {
      this.getshops(true, true)
    } else {
      this.getshops(false, true)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})