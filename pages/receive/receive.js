// pages/receive/receive.js
const app = getApp(),
  key = "86191bf891316ee5baec8a0d22b92b84"; //申请的高德地图key
let amapFile = require('../../utils/amap-wx.js');
var timer1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playimg: true,
    userimg: "http://photocdn.sohu.com/20050905/Img226866286.jpg",
    nickName: '',
    videotitle: '不得不说，这是我目前吃到过的最好吃的了，真是太棒了',
    reward: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/spr-hb.png", 'base64'),
    redboximg: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/redbox.png", 'base64'),
    close: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/close.png", 'base64'),
    copconbg: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/copconbg.png", 'base64'),
    failredbox: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/failredbox.png", 'base64'),
    redboximg2: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/redboximg2.png", 'base64'),
    playanimat: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/shishi.png", 'base64'),
    showvideotitle: true,
    allview: false,
    redbox: false,
    closebox: false,
    location: {},
    id: '',
    percent: '',
    self: true,
    selfs: '',
    phonePop: false,
    init:false,
    nohave:false,
    redbox:true,
    lookvideo:false,
    tasklist:[],
    videoclass:'hiddenvideo',
    showvideotitle: false,
    animat:true
  },
  timeupdate(e) {
    this.videoContext = wx.createVideoContext('myVideo')
    var lastTime = wx.getStorageSync('lastTime');
    var nowtime = e.detail.currentTime
    if (lastTime) {
      if (nowtime - lastTime > 3) {
        this.videoContext.seek(parseInt(lastTime));
      } else {
        setTimeout(function() {
          wx.setStorageSync('lastTime', nowtime);
        }, 100)
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
    if (!this.data.play) {
      this.setData({
        playimg: false,
        showvideotitle: false
      })
      this.videoContext = wx.createVideoContext('myVideo')
      this.videoContext.play();
    }

  },
  stopplay() {
    this.setData({
      playimg: true,
      showvideotitle: true
    })
  },
  endplay() {
    var that = this
    this.setData({    
      redbox: true,
      playimg: false
    })
    if (this.data.tasklist){
      if (this.data.tasklist.length > 10){
        delete this.data.tasklist[0]
      }
      for (var i = 0; i < this.data.tasklist.length; i++){
        if (this.data.tasklist[i] == this.data.id){
          console.log("观看过")
          this.setData({
            lookvideo: true
          })
          return
        }
      }
    }
      console.log("未观看")
      this.data.tasklist.push(that.data.id)
    wx.setStorageSync("tasklist", that.data.tasklist)   
      this.setData({
        lookvideo:true
      })
    
    
  },
  closebox() {
    this.setData({
      closebox: false,
      videoclass: 'video',
      nohave:false,
      playimg: false
    })
  },
  openbox(e) {
    wx.showLoading({
      title: '加载中',
    })
   
    var _self = this
    if (!this.data.lookvideo){
      _self.setData({
        videoclass: 'hiddenvideo',
        playimg: true
      })
      wx.showModal({
        title: '提示',
        content: '观看完视频才能领取哦',
        success(res) {
          _self.setData({
            videoclass: 'video',
            playimg:false,
            animat: false
          })
        }
      })
      wx.hideLoading();
      return;
    }
    wx.request({
      url: app.util.getUrl('/user'),
      method: 'GET',
      header: app.globalData.token,
      success: function(res) {
        console.log(res)
        let data = res.data;
        if (data.code == 200) {
          console.log(data.result.phone)
          if (data.result.phone) {
            console.log('有手机号')
            wx.getSetting({
              success: (res) => {
                console.log(res);
                console.log(res.authSetting['scope.userLocation']);
                if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) { //非初始化进入该页面,且未授权
                  wx.showModal({
                    title: '是否授权当前位置',
                    content: '需要获取您的地理位置，请确认授权，否则红包将无法领取',
                    success: function(res) {
                      if (res.cancel) {
                        console.info("1授权失败返回数据");

                      } else if (res.confirm) {
                        wx.openSetting({
                          success: function(data) {
                            console.log(data);
                            if (data.authSetting["scope.userLocation"] == true) {
                              wx.showToast({
                                title: '授权成功',
                                icon: 'success',
                                duration: 5000
                              })
                              //再次授权，调用getLocationt的API
                              _self.gps(e.detail.formId);
                            } else {
                              wx.showToast({
                                title: '授权失败',
                                icon: 'success',
                                duration: 5000
                              })
                            }
                          }
                        })
                      }
                    }
                  })
                } else {
                  _self.gps(e.detail.formId);
                }
              }
            })

          } else {
            wx.hideLoading();
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
  gps: function(formId) {
    var _self = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        console.log("res")
        console.log(res)
        if (res.errMsg == "getLocation:ok") {
          wx.hideLoading();
          _self.loadCity(res.latitude, res.longitude, formId);
        } else {
          console.log("地理位置授权失败");
          wx.hideLoading();
          wx.showToast({
            title: "授权失败",
            icon: 'none',
            duration: 2000
          });
          _self.loadCity('', '', formId);
        }
      },
      fail(res) {
        console.log("函数jps失败")
        console.log(res)
        wx.hideLoading();
        _self.loadCity('', '', formId);

      }
    })
  },
  //把当前位置的经纬度传给高德地图，调用高德API获取当前地理位置，天气情况等信息
  loadCity: function(latitude, longitude, formId) {
    let _self = this;
    let myAmapFun = new amapFile.AMapWX({
      key: key
    });
    myAmapFun.getRegeo({
      location: '' + longitude + ',' + latitude + '', //location的格式为'经度,纬度'
      success: function(data) {
        let address = data[0].regeocodeData.addressComponent;
        _self.setData({
          "location.latitude": latitude,
          "location.longitude": longitude,
          "location.city": address.citycode,
          "location.formId": formId
        })
        var json = _self.data.location
        json.formId = formId;
        wx.request({
          url: app.util.getUrl('/tasks/task/' + _self.data.id + '/benefits'),
          method: 'POST',
          data: json,
          header: app.globalData.token,
          success: function(res) {
            wx.hideLoading();
            console.log(res)
            var data = res.data
            _self.setData({
              videoclass: 'hiddenvideo',
              playimg: true
            })
            if (data.code == 200) {
              _self.setData({
                self: false,
                selfs: false,
                closebox: true
              })
            } else if (data.code == 405089 ) {
              _self.setData({
                self: true,
                selfs: false,
                closebox: true
              })
            } else if (data.code == 405088){
              _self.setData({
                nohave: true
              })
            }else if (data.code == 406060) {
              this.setData({
                phonePop: true
              })
            }else {
              _self.setData({
                selfs: data.message,
                self: false,
                selfs: false
              })
            }
          }
        })
        console.log("location")
        console.log(_self.data.location)
      },
      fail: function(info) {
        wx.hideLoading();
        console.log(info)
      }
    });
  },
  toBenefit: function(e) {
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
  countdown: function(time) {
    var _self = this
    var leftTime = time - new Date().getTime();
    if (leftTime < 0) {
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
    if (time >= 60) {
      var m = Math.floor(time / 60);
    } else {
      var m = 0
    }
    var s = Math.floor(time % 60);
    if (s < 10) {
      s = "0" + s;
    }
    if (m < 10) {
      m = "0" + m;
    }
    this.setData({
      playtime: m + ":" + s
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
        success: function(res) {
          // wx.navigateTo({
          //   url: '../share/share'
          // })
        }
      })
    } else {
      // app.globalData.userPhone = e.detail.encryptedData
      // wx.setStorageSync('userPhone', e.detail.encryptedData);
      // console.log("获取userPhone")
      // console.log(e)
      wx.request({
        url: app.util.getUrl('/phone/bind'),
        method: 'POST',
        data: {
          "iv": e.detail.iv,
          "encryptedData": e.detail.encryptedData,
        },
        header: app.globalData.token,
        success: function(res) {
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
  onLoad: function(options) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    if (wx.getStorageSync('token')) {
      console.log("领取页有token")
    } else {
      console.log("领取页无token")
      wx.navigateTo({
        url: "../index/index?id=" + options.id
      })
      return
    }
    if (true) {
      this.setData({
        id: options.id
      })
    }
    const tasklist = wx.getStorageSync('tasklist')
    if (tasklist) {
      console.log("查找数组")
      that.setData({
        tasklist: tasklist
      })
      for (var i = 0; i < this.data.tasklist.length; i++) {
        if (this.data.tasklist[i] == this.data.id) {
          console.log("观看过")
          that.setData({
            lookvideo: true
          })
        }
      }
    }else{
      that.setData({
        tasklist: new Array()
      })
    }

    wx.request({
      url: app.util.getUrl('/tasks/task/' + options.id + '/receiver'),
      method: 'GET',
      header: app.globalData.token,
      success: function(res) {
        let data = res.data;
        console.log("res")
        console.log(res)
        if (data.code == 200) {
          wx.hideLoading();
          if (data.result.self) {
            wx.reLaunch({
              url: "../share/share?id=" + data.result.id
            })
            
          }else{
            that.setData({
              init:true
            })
          }

          that.setData({
            posts: data.result,
            userimg: data.result.avatarUrl
          })
          var poster = 'posts.poster.content'
          that.setData({
            [poster]: data.result.poster.content.replace(/\\n/g, "\n")
          })
          that.playTime(data.result.video.seconds)
          var time = new Date(that.data.posts.expiredTime + '').getTime()
          var doc = 'posts.time'
          timer1 = setInterval(function() {
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
            success: function(res) {
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
    wx.loadFontFace({
      family: 'FZFSJW',
      source: 'url("https://saler.sharejoy.cn/static/font/FZFSJW.ttf")',
      success: function(res) {
        console.log("字体加载成功") //  loaded
      },

      fail: function(res) {
        console.log("字体加载失败") //  erro
        console.log(res)

      }
    })
    this.videoContext = wx.createVideoContext('myVideo')
    var timer = setTimeout(function() {
      that.setData({
        playimg: false,
        animat:false,
        videoclass:'video',
        showvideotitle:true
      })
      that.videoContext.play();
      clearTimeout(timer)
    }, 7000)
    var timer2 = setTimeout(function () {
      that.setData({
        playimg: false,
        animat: false,
        showvideotitle: false
      })
      clearTimeout(timer2)
    }, 12000)
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