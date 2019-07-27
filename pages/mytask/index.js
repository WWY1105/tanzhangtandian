import Canvas from '../../utils/ringProgress.js'
const app = getApp()
Page({
  ...Canvas.options,
  /**
   * 页面的初始数据
   */
  data: {
    ...Canvas.data,
    selectBtn: 1,
    endshops:'',
    goingshops: '',
    page: 1,
    circleWith:"",
    ongoing:'',
    finished:'',
    timer1:'',
    timer2:'',
    timer3:'',
    timer4:'',
    phonePop:false,
    parentThis: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      parentThis: this
    })
   
  },
  againRequest() {
    this.onShow();
  },
  toShare(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../share/share?id=' + id
    })
  },
  toEndTask() {
    wx.navigateTo({
      url: '../endTask/index'
    })
  },
  toTaskDetail(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../taskDetail/index?id=' + id
    })
  },
  getPhoneNumber(e) {
    // wx.showLoading({
    //   title: '加载中',
    // })
    //console.log(e)

    if (new Date().getTime() < 1562151607000) {
      return;
    }


    var _self = this
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || e.detail.errMsg == 'getPhoneNumber:user deny' || e.detail.errMsg == 'getPhoneNumber:fail:user deny') {
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
          //console.log("/phone/bind")
          //console.log(res)
          wx.hideLoading();
          let data = res.data;
          if (data.code == 200) {
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
            _self.onShow()
          } else {
            wx.showToast({
              title: data.message,
              icon: 'none',
              duration: 2000
            });
          }
        }
      });
    }
  },
  showToast() {
    wx.showToast({
      title: '更多功能, 敬请期待',
      icon: 'none',
      duration: 2000
    })
  },

  selectType(e) {
    //console.log(this.data.selectBtn)
    //console.log(e.currentTarget.dataset.num)
    if (e.currentTarget.dataset.num == this.data.selectBtn) {
      return
    }
    //console.log("2222")
    this.setData({
      selectBtn: e.currentTarget.dataset.num
    })
    if (this.data.selectBtn == 1){
      this.getshops(true, false)
    }
    
  },
  getshops: function (going, put) {
    var _self = this
    if (put) {
      if (_self.data.pageSize && _self.data.pageSize == this.data.page) {
        return;
      }
      _self.setData({
        page: _self.data.page + 1
      })
    } else {
      _self.setData({
        page: 1
      })
    }
    // wx.showLoading({
    //   title: '加载中',
    // })
    var json = {
      count: 10,
      page: _self.data.page,
      state: 1000
    }
    app.util.request(_self,{
      url: app.util.getUrl('/tasks', json),
      method: 'GET',
      header: app.globalData.token
    }).then((res)=>{
      var tasks = res.data;
      //console.log(tasks)
      wx.hideLoading();
      if (res.code == 200) {
        _self.setData({
          pageSize: res.result.pageSize
        })
        var data = res.result.items
        for (var i = 0; i < data.length; i++) {
          var time = new Date(data[i].expiredTime + '').getTime()
          var filter = _self.countdown(time)
          data[i].time = ''
          data[i].time = filter
        }
        if (put) {
          _self.setData({
            goingshops: _self.data.goingshops.concat(res.result.items),
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
            goingshops: res.result.items,
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


        wx.hideLoading();

      } else if (res.code == 403000) {
        wx.removeStorageSync('token')

      } else {
        wx.hideLoading();
        _self.setData({
          goingshops: ""
        })
      }
      }).catch((res)=>{
      wx.hideLoading();
    })
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
  getUser: function(){
    var that = this
    if (!wx.getStorageSync('phoneNum') && !wx.getStorageSync('userInfo')) {
      wx.request({
        url: app.util.getUrl('/user'),
        method: 'GET',
        header: app.globalData.token,
        success: function (res) {
          let data = res.data;
          if (data.code == 200) {
            //console.log(data.result.phone)
            app.globalData.userInfo = data.result
            wx.setStorageSync('userInfo', data.result)
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
            } else {
              that.setData({
                phonePop: false
              })
            }
            if (data.result.phone) {
              wx.setStorageSync('phoneNum', data.result.phone)
            } else {
              wx.setStorageSync('phoneNum', false)
            }

          }
        }
      })
    }
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
    
    
    app.util.request(that,{
      url: app.util.getUrl('/tasks/statistics'),
      method: 'GET',
      header: app.globalData.token
    }).then((res)=>{
      if (res.code == 200) {
        that.getUser()
        that.setData({
          ongoing: res.result.ongoing,
          finished: res.result.expired * 1 + res.result.complete * 1
        })
        if (res.result.ongoing > 0) {
          that.getshops(true, false)
        } else {
          that.setData({
            goingshops: ""
          })
        }
      }
    })
     
    wx.createSelectorQuery().select('#canvasBox').boundingClientRect(function (rect) { //监听canvas的宽高
      //console.log(wx.createSelectorQuery().select('#canvasBox'))
      //console.log(rect)
      that.setData({
        circleWith: rect.width
      })
    }).exec();
    
    // this.getshops(false, false)

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this
    clearInterval(that.data.timer1)
    clearInterval(that.data.timer2)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this
    clearInterval(that.data.timer1)
    clearInterval(that.data.timer2)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
   this.getshops(1000, false)
   var timer = setTimeout(function(){
      wx.stopPullDownRefresh();
      clearTimeout(timer)
    },1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getshops(1000, true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})