// pages/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userimg: "",
    state: "2",
    currentTab: 0,
    page: 1,
    goingshops: '',
    endshops: '',
    tasks: '',
    aheight: '',
    page2:'',
    pageSize2:1,
    nickName:'',
    selectBtn: true

  },
  toWelfare() {
    wx.navigateTo({
      url: '../welfare/welfare'
    })
  },
  toShare(e) {
    var id = e.currentTarget.dataset.id;
    var init = e.currentTarget.dataset.init
    wx.navigateTo({
      url: '../share/share?id=' + id + '&init=' + init
    })
  },
  toProfit(e) {
    wx.navigateTo({
      url: '../profit/profit'
    })
  },
  toDetail(e) {
    var id = e.currentTarget.dataset.id;
    var init = e.currentTarget.dataset.init
    wx.navigateTo({
      url: '../task/detail?id=' + id + '&init=' + init
    })
  },
  selectBtnFn(e) {
    console.log(e.currentTarget.dataset.btn)
    if (e.currentTarget.dataset.btn == this.data.selectBtn){
      this.setData({
        selectBtn: !this.data.selectBtn
      })
    }
    
  },

  //滑动切换
  swiperTab: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 500
    })
    if (this.data.currentTab == 0) {
      var height
      if (that.data.goingshops.length > 0){
        height =100 + 406 * that.data.goingshops.length
      }else{
        height = 600
      }
      that.setData({
        aheight: height
      })
    } else {
      var height
      if (that.data.endshops.length > 0) {
        height =100 + 406 * that.data.endshops.length
      } else {
        height = 600
      }
      that.setData({
        aheight: height
      })
    }
  },
  //点击切换
  clickTab: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
    console.log("aheight")
    if (this.data.currentTab == 0) {
      var height
      if (that.data.goingshops.length > 0) {
        height =100 + 406 * that.data.goingshops.length
      } else {
        height = 600
      }
      that.setData({
        aheight: height
      })
    } else {
      var height
      if (that.data.endshops.length > 0) {
        height =100 + 406 * that.data.endshops.length
      } else {
        height = 600
      }
      that.setData({
        aheight: height
      })
    }
  },
  getshops: function(going, put) {
    var _self = this
    if (put) {
      if(going){
        if (_self.data.pageSize && _self.data.pageSize == this.data.page) {
          return;
        }
        _self.setData({
          page: _self.data.page + 1
        })
      }else{
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
   if(going){
     var json = {
       count: 20,
       page: _self.data.page,
       ongoing: going
     }
   }else{
     var json = {
       count: 20,
       page: _self.data.page2,
       ongoing: going
     }
   }
    wx.request({
      url: app.util.getUrl('/tasks', json),
      method: 'GET',
      header: app.globalData.token,
      success: function(res) {
        var tasks = res.data;
       
        console.log(tasks)
        if (tasks.code == 200) {
          if(going){
            _self.setData({
              pageSize: res.data.result.pageSize
            })
          }else{
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
                aheight: 100 + 406 * _self.data.goingshops.length
              })
              _self.setData({
                timer1: setInterval(function() {
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
                aheight: 100 + 406 * _self.data.goingshops.length
              })
              console.log(_self.data.aheight)
              _self.setData({
                timer2: setInterval(function() {
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
                aheight: 100 + 406 * _self.data.endshops.length
              })
              _self.setData({
                timer3: setInterval(function() {
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
                aheight: 100 + 406 * _self.data.endshops.length
              })
              _self.setData({
                timer4: setInterval(function() {
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

          if (_self.data.currentTab == 0) {
            var height
            if (_self.data.goingshops.length > 0) {
              height = 100 + 406 * _self.data.goingshops.length
            } else {
              height = 600
            }
            _self.setData({
              aheight: height
            })
          } else {
            var height
            if (_self.data.endshops.length > 0) {
              height = 100 + 406 * _self.data.endshops.length
            } else {
              height = 600
            }
            _self.setData({
              aheight: height
            })
          }

          wx.hideLoading();

        } else if (tasks.code == 403000) {
          wx.removeStorageSync('token')
          wx.navigateTo({
            url: "../index/index"
          })
        }else {
          wx.hideLoading();
        }
      },
      fail: function(res){
        wx.showModal({
          title: '提示',
          content: res.message
        });
        wx.hideLoading();
      }
    });
  },
  countdown: function(time) {
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
  submitformid: function (e) {
    var formId = { "formId": e.detail.formId }
    console.log(e)
    console.log("调用id=  " + e.detail.formId)
    wx.request({
      url: app.util.getUrl('/notices'),
      method: 'POST',
      header: app.globalData.token,
      data: formId,
      success: function (res) {
        let data = res.data;
        console.log("res")
        console.log(res)
        if (data.code == 200) {
          console.log("调用成功id=  " + e.detail.formId)
        }
      }
    });
  },
  getPhoneNumber(e) {
    wx.showLoading({
      title: '加载中',
    })
    console.log(e)

    if (new Date().getTime() < 1561104007000){
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
            if (data.result){
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
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    console.log(app.globalData.scene)
    wx.request({
      url: app.util.getUrl('/user'),
      method: 'GET',
      header: app.globalData.token,
      success: function(res) {
        let data = res.data;
        if (data.code == 200) {
          console.log(data.result.phone)
          app.globalData.userInfo = data.result
          if (data.result.avatarUrl){
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
          if (!data.result.phone && new Date().getTime() > 1561104007000){
            that.setData({
              phonePop: true
            })
          }
        }
      }
    })
    wx.request({
      url: app.util.getUrl('/tasks/profits'),
      method: 'GET',
      header: app.globalData.token,
      success: function (res) {
        let data = res.data;
        console.log(res)
        if (data.code == 200) {
          wx.hideLoading();
          that.setData({
            info: data.result
          })
          console.log(that.data.info)
        } else if (data.code == 403000) {
          console.log("我的页面403000")
          wx.removeStorageSync('token')
          wx.navigateTo({
            url: "../index/index"
          })
         
        } else {
          wx.hideLoading();
        }
      },
      fail(res){
        console.log(res)
        wx.showToast({
          title: data.message,
          duration: 2000
        })
      }
    });
    // this.getshops(false, false)
    // this.getshops(true, false)
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
    this.getshops(false, false)
    this.getshops(true, false)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    // var that = this
    // clearInterval(that.data.timer1)
    // clearInterval(that.data.timer2)
    // clearInterval(that.data.timer3)
    // clearInterval(that.data.timer4)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    var that = this
    clearInterval(that.data.timer1)
    clearInterval(that.data.timer2)
    clearInterval(that.data.timer3)
    clearInterval(that.data.timer4)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this
    if (this.data.currentTab == 0) {
      this.getshops(true, false)
    } else {
      this.getshops(false, false)
    }
    wx.request({
      url: app.util.getUrl('/tasks/profits'),
      method: 'GET',
      header: app.globalData.token,
      success: function (res) {
        let data = res.data;
        console.log(res)
        if (data.code == 200) {
          that.setData({
            info: data.result
          })
          console.log(that.data.info)
        } else {
          wx.showToast({
            title: data.message,
            duration: 2000
          });
        }
      }
    });
    setTimeout(function(){
      wx.stopPullDownRefresh();
    },500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.currentTab == 0) {
      this.getshops(true, true)
    } else {
      this.getshops(false, true)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    var id = e.target.dataset.id;
    var item = e.target.dataset.item;
    var sharetext = item.mode == '1000' ? '这家店超赞👍送你【独家探店券】,' : '这家店超赞👍邀你瓜分【现金红包】,'
    return {
      title: sharetext + item.brand + item.shopName,
      path: '/pages/receive/receive?id=' + id,
      imageUrl: item.poster
    }
  }
})