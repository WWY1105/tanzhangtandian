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
    userimg: "",
    nickName: '',
    reward: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/spr-hb.png", 'base64'),
    marks: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/marks.png", 'base64'),
    redboximg: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/redbox.png", 'base64'),
    close: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/close.png", 'base64'),
    copconbg: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/copconbg.png", 'base64'),
    failredbox: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/failredbox.png", 'base64'),
    redboximg2: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/redboximg2.png", 'base64'),
    playanimat: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/shishi.png", 'base64'),
    clock: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/clock.png", 'base64'),
    rectbg: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/rectbg.png", 'base64'),
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
    init:true,
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
  playerror() {
    wx.showModal({
      title: '提示',
      content: '视频播放错误',
      success(res) {

      }
    })
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
    console.log("进入"+new Date())
    wx.showLoading({
      title: '加载中',
      mask:true
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
        console.log("user接口" + new Date())
        let data = res.data;
        if (data.code == 200) {
          console.log(data.result.phone)
          if (data.result.phone) {
            console.log('有手机号')
            wx.getSetting({
              success: (res) => {
                console.log("授权列表回调" + new Date())
                console.log(res);
                console.log(res.authSetting['scope.userLocation']);
                if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) { 
                  //非初始化进入该页面,且未授权
                  wx.showModal({
                    title: '是否授权当前位置',
                    content: '仅限本地用户拆红包，可助力好友获得返现，请确认授权',
                    cancelText: "去授权",
                    cancelColor: '#576B95',
                    confirmText: "直接领取",
                    confirmColor: '#000000',
                    success: function (result) {
                      if (result.cancel) {
                        wx.openSetting({
                          success: function (data) {
                            console.log("引导授权" + new Date())
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
                              wx.hideLoading();
                              console.log("引导授权" + new Date())
                              wx.showToast({
                                title: '授权失败',
                                icon: 'success',
                                duration: 5000
                              })
                            }
                          }
                        })

                      } else if (result.confirm) {
                        console.info("1授权失败返回数据");
                        // _self.loadCity('', '', e.detail.formId);
                        _self.setData({
                          "location.latitude": '',
                          "location.longitude": '',
                          "location.formId": e.detail.formId
                        })
                        var json = _self.data.location
                        _self.getbenefits(json)  
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

        } else if (data.code == 403000) {
          wx.showModal({
            title: '提示',
            content: data.message,
            success(res) {

            }
          })
          wx.navigateTo({
            url: "../index/index?id=" + _self.data.id
          })
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
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var _self = this
    wx.getLocation({
      // type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        wx.hideLoading();
        console.log("getLocation回调" + new Date())
        console.log("res")
        console.log(res)
        if (res.errMsg == "getLocation:ok") {
          // _self.loadCity(res.latitude, res.longitude, formId);
          _self.setData({
            "location.latitude": res.latitude,
            "location.longitude": res.longitude,
            "location.formId": formId
          })
          var json = _self.data.location
          _self.getbenefits(json)       
        } else {
          console.log("地理位置授权失败");
          wx.showModal({
            title: '定位失败',
            content: '请打开手机定位后重新领取',
            cancelText: "取消",
            confirmText: "确认",
            success: function (result) {
             
            }
          })
          
        }
      },
      fail(res) {
        wx.hideLoading();
        console.log("函数jps失败")
        console.log("getLocation回调" + new Date())
        console.log(res)
        if (res.errMsg == 'getLocation:fail:auth denied'){
          wx.showModal({
            title: '是否授权当前位置',
            content: '仅限本地用户拆红包，可助力好友获得返现，请确认授权',
            cancelText: "去授权",
            cancelColor: '#576B95',
            confirmText: "直接领取",
            confirmColor: '#000000',
            success: function (result) {
              if (result.cancel) {
                wx.openSetting({
                  success: function (data) {
                    console.log("引导授权" + new Date())
                    console.log(data);
                    if (data.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 5000
                      })
                      //再次授权，调用getLocationt的API
                      _self.gps(formId);
                    } else {
                      wx.hideLoading();
                      console.log("引导授权" + new Date())
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 5000
                      })
                    }
                  }
                })
                
              } else if (result.confirm) {
                console.info("1授权失败返回数据");
                // _self.loadCity('', '', formId);
                _self.setData({
                  "location.latitude": '',
                  "location.longitude": '',
                  "location.formId": formId
                })
                var json = _self.data.location
                _self.getbenefits(json)       
              }
            }
          })
        }else{
          wx.showModal({
            title: '定位失败',
            content: '仅限本地用户拆红包，可助力好友获得返现，请开启手机GPS（定位）开关',
            cancelText: "已开启",
            cancelColor: '#576B95',
            confirmText: "直接领取",
            confirmColor: '#000000',
            success: function (result) {
              if (result.cancel) {
                _self.gps(formId)
              } else if (result.confirm) {
                console.info("1授权失败返回数据");
                // _self.loadCity('', '', formId); 
                _self.setData({
                  "location.latitude": '',
                  "location.longitude": '',
                  "location.formId": formId
                })
                var json = _self.data.location
                _self.getbenefits(json)             
              }
            }
          })
        }

      }
    })
  },
  //把当前位置的经纬度传给高德地图，调用高德API获取当前地理位置，天气情况等信息
  loadCity: function(latitude, longitude, formId) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let _self = this;
    let myAmapFun = new amapFile.AMapWX({
      key: key
    });
    
    myAmapFun.getRegeo({
      // location: '' + latitude + ',' + longitude + '', //location的格式为'经度,纬度'
      success: function(data) {
        console.log("反向解析" + new Date())
        let address = data[0].regeocodeData.addressComponent;
        console.log("address")
        console.log(data)
        if (!address.citycode){
          address.citycode=''
        }
        _self.setData({
          "location.latitude": latitude,
          "location.longitude": longitude,
          "location.city": address.citycode,
          "location.formId": formId
        })
        var json = _self.data.location
        json.formId = formId;
        _self.getbenefits(json)
        console.log("location")
        console.log(_self.data.location)
      },
      fail: function(info) {
        console.log("反向解析" + new Date())
        console.log("地理位置解析失败")
        _self.setData({
          "location.latitude": '',
          "location.longitude": '',
          "location.city": '',
          "location.formId": formId
        })
        var json = _self.data.location
        json.formId = formId;
        _self.getbenefits(json)
      }
    });
  },
  getbenefits(json) {
    var _self = this
    wx.request({
      url: app.util.getUrl('/tasks/task/' + _self.data.id + '/benefits'),
      method: 'POST',
      data: json,
      header: app.globalData.token,
      success: function (res) {
        console.log("红包接口" + new Date())
        wx.hideLoading();
        console.log("领取红包")
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
        } else if (data.code == 405089) {
          _self.setData({
            self: true,
            selfs: false,
            closebox: true
          })
        } else if (data.code == 405088) {
          _self.setData({
            nohave: true
          })
        } else if (data.code == 406060) {
          this.setData({
            phonePop: true
          })
        } else if (data.code == 403000) {
          wx.removeStorageSync('token')
          wx.showModal({
            title: '提示',
            content: data.message,
            success(res) {

            }
          })
          wx.navigateTo({
            url: "../index/index?id=" + _self.data.id
          })
        } else {
          _self.setData({
            selfs: data.message
          })
        }
      },
      fail(data){
        console.log("红包接口" + new Date())
        wx.hideLoading();
        wx.showToast({
          title: data.message,
          duration: 2000
        });
      }
    })
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
      return { 'h': '00', 'm': '00', 's': '00' }
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
    var filter = {'h':h,'m':m,'s':s}
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
            wx.showToast({
              title: "授权成功",
              duration: 2000
            });

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
      phonePop: false,
      selfs:false,
      videoclass: 'video',
      playimg: false,
      rulepop: false
    })
  },
  openrule() {
    this.setData({
      rulepop: true
    })
  },
  getdata(id) {
    var that = this;
    wx.request({
      url: app.util.getUrl('/tasks/task/' + id + '/receiver'),
      method: 'GET',
      header: app.globalData.token,
      success: function (res) {
        let data = res.data;
        console.log("res")
        console.log(res)
        if (data.code == 200) {
          wx.hideLoading();
          if (data.result.self) {
            wx.reLaunch({
              url: "../share/share?id=" + data.result.id
            })
            return;
          }

          that.setData({
            posts: data.result,
            userimg: data.result.avatarUrl
          })
          var poster = 'posts.poster.content'
          that.setData({
            [poster]: data.result.poster ? data.result.poster.content.replace(/\\n/g, "\n") :''
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
          that.setData({
            init: false
          })
        } else if (data.code==403000){
          console.log("领取这403000")
          wx.showModal({
            title: '提示',
            content: data.message
          })
          wx.navigateTo({
            url: "../index/index?id=" + that.data.id
          })
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    if (options.scene) {
      this.setData({
        id: options.scene
      })
    } else if (options.id) {
      this.setData({
        id: options.id
      })
    }
    
    
    wx.showLoading({
      title: '加载中',
    })
    if (wx.getStorageSync('token')) {
      console.log("领取页有token")
    } else {
      console.log("领取页无token")
      wx.navigateTo({
        url: "../index/index?id=" + that.data.id
      })
      return
    }
    
    wx.getSetting({
      success(res) {
        console.log(res)
        if (!res.authSetting['scope.userInfo']) {
          console.log("未授权用户信息")
          wx.navigateTo({
            url: "../index/index?id=" + that.data.id
          })
          return
        }else{

          that.getdata(that.data.id);
          that.videoContext = wx.createVideoContext('myVideo')
          var timer = setTimeout(function () {
            that.setData({
              playimg: false,
              animat: false,
              videoclass: 'video',
              showvideotitle: true
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
        }
      }
    })
    
    const tasklist = wx.getStorageSync('tasklist')
    if (tasklist) {
      console.log("查找数组")
      that.setData({
        tasklist: tasklist
      })
      for (var i = 0; i < that.data.tasklist.length; i++) {
        if (that.data.tasklist[i] == that.data.id) {
          console.log("观看过")
          that.setData({
            lookvideo: true
          })
        }
      }
    } else {
      that.setData({
        tasklist: new Array()
      })
    }
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
    this.getdata(
      this.data.id
    );
    wx.stopPullDownRefresh();
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
    return {
      title: '这家店超赞👍送你【独家探店券】,' + this.data.posts.consume.brand + this.data.posts.consume.shopName,
      path: '/pages/receive/receive?id=' + this.data.id,
      imageUrl: this.data.posts.sharePicUrl
    }
  }
})