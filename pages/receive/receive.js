// pages/receive/receive.js
const app = getApp(), key = "86191bf891316ee5baec8a0d22b92b84";//申请的高德地图key
let amapFile = require('../../utils/amap-wx.js');
var timer1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playimg: true,
    userimg: "http://photocdn.sohu.com/20050905/Img226866286.jpg",
    nickName:'',
    videotitle:'不得不说，这是我目前吃到过的最好吃的了，真是太棒了',
    reward: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/spr-hb.png", 'base64'),
    redboximg: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/redbox.png", 'base64'),
    close: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/close.png", 'base64'),
    copconbg: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/copconbg.png", 'base64'),
    failredbox: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/failredbox.png", 'base64'),
    showvideotitle:true,
    allview: false,
    redbox:false,
    closebox:false,
    location:{},
    id:'',
    percent:'',
    self:'',
    selfs: '',
    phonePop:false

  },
  timeupdate(e) {
    this.videoContext = wx.createVideoContext('myVideo')
    var lastTime = wx.getStorageSync('lastTime');
    var nowtime = e.detail.currentTime
    if (lastTime) {
      if (nowtime - lastTime > 3) {
        this.videoContext.seek(parseInt(lastTime));
      } else {
        wx.setStorageSync('lastTime', nowtime);
      }
    } else {
      wx.setStorageSync('lastTime', nowtime);
    }
    // var duration = e.detail.duration
    // var percent = (nowtime / duration * 100+'').slice(0,3)
    // this.setData({
    //   "percent": percent
    // })
  },
  play() {
    if(!this.data.play){
      this.setData({
        playimg: false,
        play: true,
        showvideotitle: false
      })
      this.videoContext = wx.createVideoContext('myVideo')
      this.videoContext.play();
    }
    
  },
  stopplay() {
    this.setData({
      playimg: true,
      play:false,
      showvideotitle: true
    })
  },
  endplay() {
    this.setData({
      playimg: true,
      redbox: true,
      play: false,
      showvideotitle: true
    })
  },
  closebox() {
    this.setData({
      closebox:false
    })
  },
  openbox() {
    wx.showLoading({
      title: '加载中',
    })
    var _self = this
    wx.request({
      url: app.util.getUrl('/user'),
      method: 'GET',
      header: app.globalData.token,
      success: function (res) {
        console.log(res)
        let data = res.data;
        if (data.code == 200) {
          if (data.result.phone) {
            console.log('有手机号')
            wx.getLocation({
              type: 'gcj02', //返回可以用于wx.openLocation的经纬度
              success: function (res) {
                console.log("res")
                console.log(res)
                if (res.errMsg == "getLocation:ok") {
                  _self.loadCity(res.latitude, res.longitude);
                } else {
                  console.log("地理位置授权失败");
                  wx.hideLoading();
                  wx.showToast({
                    title: "授权失败",
                    icon: 'none',
                    duration: 2000
                  });
                }
              },
              fail(res) {
                console.log(res);
              }
            })
          } else {
            _self.setData({
              phonePop: true
            })
          }

        } else {
          wx.hideLoading();
          wx.showToast({
            title: data.message,
            duration: 2000
          });
        }
      }
    })  
    
  },
  //把当前位置的经纬度传给高德地图，调用高德API获取当前地理位置，天气情况等信息
  loadCity: function (latitude, longitude) {
    let _self = this;
    let myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getRegeo({
      location: '' + longitude + ',' + latitude + '',//location的格式为'经度,纬度'
      success: function (data) {
        let address = data[0].regeocodeData.addressComponent;
        _self.setData({
          "location.latitude": latitude,
          "location.longitude": longitude,
          "location.city": address.citycode
        })
        var json = _self.data.location
        wx.request({
          url: app.util.getUrl('/tasks/task/' + _self.data.id + '/benefits'),
          method: 'POST',
          data: json,
          header: app.globalData.token,
          success: function (res) { 
            wx.hideLoading();
            console.log(res)
            var data = res.data
            _self.setData({
              closebox: true
            })
            if (data.code == 200){
              _self.setData({
                self: false,
                selfs: false
              })
            } else if (data.code == 405089) {
              _self.setData({
                self: data.message,
                selfs:false
              })
            } else {
              _self.setData({
                selfs: data.message
              })
            }
          }
        })
        console.log("location")
        console.log(_self.data.location)
      },
      fail: function (info) {
        wx.hideLoading();
        console.log(info)
      }
    });
  },
  toBenefit: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../benefit/index?id=' + id
    })
  },
  toHome() {
    wx.switchTab({
      url: "../home/home"
    })
  },
  toWelfare() {
    wx.navigateTo({
      url: '../welfare/welfare'
    })
  },
  toCoupon(e) {
    console.log(e)
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../coupon/coupon?id=' + id 
    })
  },
  countdown: function (time) {
    var _self = this
    var leftTime = time - new Date().getTime();
    if (leftTime<0) {
      clearInterval(timer1)
      return "00:00:00"
    }
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
  playTime(time) {
    if(time>=60){
      var m = Math.floor(time / 60);
    }else{
      var m = 0
    }
   var  s = Math.floor(time % 60);
    if (s < 10) {
      s = "0" + s;
    }
    if (m < 10) {
      m = "0" + m;
    }
    this.setData({
      playtime: m+":"+s
    })
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
          // wx.navigateTo({
          //   url: '../share/share'
          // })
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
            // wx.navigateTo({
            //   url: '../share/share'
            // })

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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    if (wx.getStorageSync('token')){
      console.log("领取页有token")
    }else{
      console.log("领取页无token")
      wx.navigateTo({
          url: "../index/index"
      })
      return
    }
      this.setData({
        id: options.id
      })
      // wx.request({
      //   url: app.util.getUrl('/user'),
      //   method: 'GET',
      //   header: app.globalData.token,
      //   success: function (res) {
      //     console.log(res)
      //     let data = res.data;
      //     if (data.code == 200) {
      //       if (data.result.phone) {
      //         console.log('有手机号')
      //       } else {
      //         that.setData({
      //           phonePop: true
      //         })
      //       }

      //     } else {
      //       wx.showToast({
      //         title: data.message,
      //         duration: 2000
      //       });
      //     }
      //   }
      // })
      
      wx.request({
        url: app.util.getUrl('/tasks/task/' + options.id + '/receiver'),
        method: 'GET',
        header: app.globalData.token,
        success: function (res) {
          let data = res.data;
          console.log(res)
          if (data.code == 200) {
            wx.hideLoading();
            if(data.result.self){
              wx.reLaunch({
                url: "../share/share?id=" + data.result.id
              })
            }
           
            that.setData({
              posts: data.result,
              userimg: data.result.avatarUrl
            })
            that.playTime(data.result.video.seconds)
            var time = new Date(that.data.posts.expiredTime + '').getTime()
            var doc = 'posts.time'
            timer1 = setInterval(function () {
              that.setData({
                [doc]: that.countdown(time)
              })
            }, 1000)

            var jsons = {
              id: data.result.video.id
            }
            wx.request({
              url: app.util.getUrl('/videos/' + jsons.id, jsons),
              method: 'GET',
              header: app.globalData.token,
              success: function (res) {
                let data = res.data;
                console.log(res)
                if (data.code == 200) {
                  that.setData({
                    video: data.result
                  })
                  console.log(that.data.video)
                } else {
                  wx.showToast({
                    title: data.message,
                    duration: 2000
                  });
                }
              }
            });

          } else {
            wx.showToast({
              title: data.message,
              duration: 2000
            });
          }
        }
      });
    
    
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