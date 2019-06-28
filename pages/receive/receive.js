// pages/receive/receive.js
const app = getApp(),
  key = "86191bf891316ee5baec8a0d22b92b84"; //申请的高德地图key
let amapFile = require('../../utils/amap-wx.js');
var timer1;
var num = false

Page({
  data: {
    userimg: "",
    nickName: '',
    reward: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/spr-hb.png", 'base64'),
    marks: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/marks.png", 'base64'),
    redboximg: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/redbox.png", 'base64'),
    close: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/close.png", 'base64'),
    copconbg: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/copconbg.png", 'base64'),
    failredbox: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/failredbox.png", 'base64'),
    playanimat: '',
    clock: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/clock.png", 'base64'),
    clock2: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/clock2.png", 'base64'),
    rectbg: '',
    groupbg: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/groupbg.png", 'base64'),
    groupwhitebg: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/groupwhitebg.png", 'base64'),
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
    init: true,
    nohave: false,
    redbox: true,
    lookvideo: false,
    tasklist: [],
    videoclass: 'video',
    showvideotitle: false,
    animat: true,
    auth: false,
    videoheight: "height:422rpx;",
    load: {},
    switchclass:"home",
    startswitch:"openswitch",
    playimg:false,
    onlyModeState:false,

    groupBox:false,
    groupBox2:false,
    groupFailBox:false,
    joinGroupFailBox: false,
    haveBenefits:false,
    joined: false
  },


  onLoad: function (options) {
    var that = this
    if (options && options.scene) {
      this.setData({
        id: options.scene
      })
    } else if (options.id) {
      this.setData({
        id: options.id
      })
    }


    wx.showLoading({
      title: '加载中'
    })
    //获取页面数据
    that.getdata(that.data.id);
    //判断是否观看过视频
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

    //判断版本
    function compareVersion(v1, v2) {
      v1 = v1.split('.')
      v2 = v2.split('.')
      const len = Math.max(v1.length, v2.length)

      while (v1.length < len) {
        v1.push('0')
      }
      while (v2.length < len) {
        v2.push('0')
      }

      for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i])
        const num2 = parseInt(v2[i])

        if (num1 > num2) {
          return 1
        } else if (num1 < num2) {
          return -1
        }
      }

      return 0
    }

    const version = wx.getSystemInfoSync().SDKVersion

    if (compareVersion(version, '2.1.0') >= 0) {
      wx.loadFontFace({
        family: 'FZFSJW',
        source: 'url("https://saler.sharejoy.cn/static/font/FZFSJW.ttf")',
        success: function (res) {
          console.log("字体加载成功") //  loaded
        },

        fail: function (res) {
          console.log("字体加载失败") //  erro
          console.log(res)

        }
      })
    }


  },

  //下拉刷新
  onPullDownRefresh: function () {
    this.gettask();

    wx.stopPullDownRefresh();
  },
  //分享
  onShareAppMessage: function () {
    var that = this
    var shareText = that.data.posts.mode == '1000' ? '这家店超赞👍送你【独家探店券】,' : '这家店超赞👍邀你瓜分【现金红包】,'
    return {
      title: shareText + this.data.posts.consume.brand + this.data.posts.consume.shopName,
      path: '/pages/receive/receive?id=' + this.data.id,
      imageUrl: this.data.posts.sharePicUrl
    }
  },

  //下拉获取的数据
  gettask(getbenefit) {
    var that = this;
    wx.request({
      url: app.util.getUrl('/tasks/task/' + this.data.id + '/receiver'),
      method: 'GET',
      header: app.globalData.token,
      success: function (res) {
        let data = res.data;
        if (data.code == 200) {
          wx.hideLoading();
          that.setData({
            posts: data.result,
            userimg: data.result.avatarUrl
          })
          var poster = 'posts.poster.content'
          that.setData({
            [poster]: data.result.poster ? data.result.poster.content.replace(/\\n/g, "\n") : ''
          })
          that.playTime(data.result.video.seconds)
          var time = new Date(that.data.posts.expiredTime + '').getTime()
          var doc = 'posts.time'
          timer1 = setInterval(function () {
            that.setData({
              [doc]: that.countdown(time)
            })
          }, 1000)
          var arr = wx.getStorageSync("revealed")
          for(var i in arr){
            if (arr[i] == data.result.id){
              that.setData({
                prougShared: true
              })
            }
          }

          if (getbenefit) {
            if (that.data.posts.obtainedState == '1004') {
              that.setData({
                joinGroupFailBox: true
              })
            } else if (that.data.posts.obtainedState == '1003') {
              that.setData({
                groupSharedBox: true,
                groupBox: false,
                groupBox2: false
              })
            } else {
              that.setData({
                groupBox: true
              })
            }
          }
        }
      }
    })
    
  },
  //登录
  getcheck(id) {
    var that = this;
    wx.request({
      url: app.util.getUrl('/tasks/task/' + id + '/check'),
      method: 'GET',
      header: app.globalData.token,
      success: function (res) {
        console.log("调用/check")
        console.log(res)
        if (res.data.code == 200) {
          if (res.data.result.self) {
            wx.reLaunch({
              url: "../share/share?id=" + data.result.id
            })
            return;
          } else {
            that.setData({
              animat: true,
              needPhone: res.data.result.needPhone
            })
            let pagetimer = setTimeout(() => {
              that.setData({
                init: false
              })
              clearTimeout(pagetimer);
            }, 1000)

            that.videoContext = wx.createVideoContext('myVideo')
            that.videoContext.play();
            that.setData({
              playimg: false,
              videoclass: 'video',
              showvideotitle: true
            })
            // var timer = setTimeout(function () {
            //   if (!that.data.closebox){
            //     that.setData({
            //       playimg: false,
            //       animat: false,
            //       videoclass: 'video',
            //       showvideotitle: true
            //     })
            //   }
            //   that.videoContext.play();
            //   clearTimeout(timer)
            // }, 1000)
            var timer2 = setTimeout(function () {
              that.setData({
                showvideotitle: false
              })
              clearTimeout(timer2)
            }, 5000)
          }
        } else {
          wx.login({
            success: res => {
              if (res.code) {
                //发起网络请求
                wx.request({
                  url: app.util.getUrl('/auth'),
                  method: 'POST',
                  header: app.globalData.token,
                  data: {
                    code: res.code
                  },
                  success: function (res) {
                    console.log("调用/auth")
                    console.log(res)
                    let data = res.data;
                    if (data.code == 200) {
                      if (data.result.token) {
                        wx.setStorageSync('token', data.result.token);
                        app.globalData.token.token = data.result.token;
                      }
                      that.getdata(that.data.id);
                    } else if (data.code == 403000) {
                      clearTimeout(timer)
                      clearTimeout(timer2)
                      that.setData({
                        auth: true,
                        videoclass: 'hiddenvideo',
                        playimg: true,
                        animat: false,
                        init: false
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
      }
    })
  },
  //定位
  gps(formId) {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
   
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        wx.hideLoading();
        console.log("getLocation回调" + new Date())
        console.log("res")
        console.log(res)
        if (res.errMsg == "getLocation:ok") {
          that.setData({
            "location.latitude": res.latitude,
            "location.longitude": res.longitude
          })     
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
        if (res.errMsg == 'getLocation:fail auth deny' || res.errMsg == 'getLocation:fail:auth denied') {
          wx.showModal({
            title: '是否授权当前位置',
            content: '仅限本地用户拆红包，可助力好友获得返现，请确认授权',
            showCancel: false,
            confirmText: "去授权",
            confirmColor: '#576B95',
            success: function (result) {
           
              if (result.confirm) {

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
                      
                    } else {
                      wx.hideLoading();
                      console.log("引导授权" + new Date())
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 5000
                      })
                      that.gps(formId);
                    }
                  }
                })
              }
            }
          })
        } else {
          that.setData({
            "location.latitude": that.data.posts.consume.latitude,
            "location.longitude": that.data.posts.consume.longitude,
            "location.city": that.data.posts.consume.city
          })
        }

      }
    })
  },
  //开红包
  openbox(e) {
    var that = this
    console.log(e)
    console.log("进入" + new Date())
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    console.log("formId= " + e.detail.formId);
    if (e.detail.formId){
      this.setData({
        "location.formId": e.detail.formId
      })
    }
    
    
    if (!this.data.lookvideo) {
      that.setData({
        playimg: true,
        videoclass: 'hiddenvideo'
        
      })
      wx.showModal({
        title: '提示',
        content: '观看完视频才能领取哦',
        success(res) {
          that.setData({
            videoclass: 'video',
            playimg: false,
            animat: false
          })
        }
      })
      wx.hideLoading();
      return;
    }
    if (this.data.posts.existPhone) {
      console.log('有手机号')
      var json = that.data.location;
      that.getbenefits(json);     
    } else {
      wx.hideLoading();
      that.setData({
        phonePop: true,
        videoclass: 'hiddenvideo',
        playimg: true
      })
    }

  },
  openOnlyStateBox() {
    this.closePop()
    this.setData({
      onlyModeState: true,
      closebox: true,
      videoclass: 'hiddenvideo',
      playimg: true
    })
  },
  //已参团弹窗
  openGroupBox() {
    this.setData({
      groupBox2: true,
      videoclass: 'hiddenvideo',
      playimg: true
    })
  },
  //参团成功打开分享
  openGroupShared() {
    this.setData({
      groupSharedBox: true,
      videoclass: 'hiddenvideo',
      playimg: true
    })
  },
  //瓜分失败弹窗
  openGroupFailBox() {
    this.setData({
      groupFailBox: true,
      videoclass: 'hiddenvideo',
      playimg: true
    })
  },
  //参团失败弹窗
  openJoinFailBox() {
    this.setData({
      haveBenefits: true,
      videoclass: 'hiddenvideo',
      playimg: true
    })
  },
  revealed() {
    var that = this
    var arr = wx.getStorageSync("revealed")
    if (arr){
      if (arr.length > 10){
        arr.shift()
      }
    }else{
      arr = []
    }
    arr.push(that.data.posts.id)
    wx.setStorageSync("revealed", arr)
   var timer = setTimeout(()=>{
      that.setData({
        prougShared: true
      })
     clearTimeout(timer)
    },1000)
  },
  //获取优惠券
  getbenefits(json) {
    console.log("json")
    console.log(json)
    var that = this
    wx.request({
      url: app.util.getUrl('/tasks/task/' + that.data.id + '/benefits'),
      method: 'POST',
      data: json,
      header: app.globalData.token,
      success: function (res) {
        console.log("红包接口" + new Date())
        wx.hideLoading();
        console.log("领取红包")
        console.log(res)
        var data = res.data
        that.setData({
          videoclass: 'hiddenvideo',
          playimg: true,
          benefitsCode: data.code
        })
        if (data.code == 200) {
          if(that.data.posts.mode == '1000'){
            that.setData({
              self: false,
              selfs: false,
              closebox: true
            })
          }else{
            that.gettask(true);
            
            
          }
          
        } else if (data.code == 4050894 || data.code == 4050895) {
          if (that.data.posts.mode == '1002') {
            that.setData({
              joinGroupFailBox: true,
              videoclass: 'hiddenvideo',
              playimg: true
            })
          }
        } else if (data.code == 4050890){
          if (that.data.posts.mode == '1000') {
            that.setData({
              selfs: data.message,
              videoclass: 'hiddenvideo',
              playimg: true
            })
          }else{
            wx.showModal({
              title: '参与失败',
              content: data.message + '拆开红包才有参与资格。',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  that.setData({
                   joined:true
                  })
                }
              }
            })
          }
        } else if (data.code == 405088) {
          that.setData({
            nohave: true
          })
        } else if (data.code == 406060) {
          this.setData({
            phonePop: true,
            videoclass: 'hiddenvideo',
            playimg: true
          })
        } else if (data.code == 403000) {
          wx.removeStorageSync('token')

        } else {
          if (that.data.posts.mode == '1000') {
            that.setData({
              selfs: data.message,
              videoclass: 'hiddenvideo',
              playimg: true
            })
          }else{
            wx.showModal({
              title: '参与失败',
              content: data.message,
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  that.setData({
                    videoclass: 'video',
                    playimg: false
                  })
                }
              }
            })
          }
          
        }
      },
      fail(data) {
        console.log("红包接口" + new Date())
        wx.hideLoading();
        wx.showToast({
          title: data.message,
          duration: 2000
        });
      }
    })
  },
  //首次获取的页面数据
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
          } else {
            that.getcheck(id);

          }

          that.setData({
            posts: data.result,
            userimg: data.result.avatarUrl
          })
          var arr = wx.getStorageSync("revealed")
          for (var i in arr) {
            if (arr[i] == data.result.id) {
              that.setData({
                prougShared: true,
                joinGroupBox: false,
                groupSuccessState: false
              })
            }
          }
          var poster = 'posts.poster.content'
          that.setData({
            [poster]: data.result.poster ? data.result.poster.content.replace(/\\n/g, "\n") : ''
          })
          that.playTime(data.result.video.seconds)
          var time = new Date(that.data.posts.expiredTime + '').getTime()
          var doc = 'posts.time'
          timer1 = setInterval(function () {
            that.setData({
              [doc]: that.countdown(time)
            })
          }, 1000)


          if (data.result.video.playUrl) {
            that.setData({
              video: data.result.video.playUrl,
              videoheight: data.result.video.height * 1 > data.result.video.width * 1 ? "height:650rpx;" : "height:422rpx;"
            })
          }else{
            var jsons = {
              id: that.data.id
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
                    video: data.result.url,
                    videoheight: data.result.height * 1 > data.result.width * 1 ? "height:650rpx;" : "height:422rpx;"
                  })
                  console.log(that.data.video)
                  console.log("videoheight: " + that.data.videoheight)
                } else {
                  wx.showToast({
                    title: data.message,
                    duration: 2000
                  });
                }
              }
            });
            var inittimer = setTimeout(function () {
              that.setData({
                init: false
              })
              clearTimeout(inittimer);
            }, 1000)
          }
          

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
                  showCancel: false,
                  confirmText: "去授权",
                  confirmColor: '#576B95',
                  success: function (result) {
                    if (result.confirm) {
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
                            that.gps();
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
                    }
                  }
                })
              } else {
                that.gps();
              }
            }
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
  //禁止拖拽进度条
  timeupdate(e) {
    this.videoContext = wx.createVideoContext('myVideo')
    var lastTime = wx.getStorageSync('lastTime');
    var nowtime = e.detail.currentTime
    if (lastTime) {
      if (nowtime - lastTime > 3) {
        this.videoContext.seek(parseInt(lastTime));
      } else {
        setTimeout(function () {
          wx.setStorageSync('lastTime', nowtime);
        }, 100)
      }
    } else {
      wx.setStorageSync('lastTime', nowtime);
    }
    
  },
  //视频播放错误
  playerror() {
    wx.showModal({
      title: '提示',
      content: '视频播放错误',
      success(res) {

      }
    })
  },
  //视频播放结束
  endplay() {
    var that = this
    this.setData({
      redbox: true,
      playimg: false
    })
    if (this.data.tasklist) {
      if (this.data.tasklist.length > 10) {
        delete this.data.tasklist[0]
      }
      for (var i = 0; i < this.data.tasklist.length; i++) {
        if (this.data.tasklist[i] == this.data.id) {
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
      lookvideo: true
    })


  },
  //关闭红包弹窗
  closebox() {
    var that = this
    this.gettask()
    this.setData({
      closebox: false,
      videoclass: 'video',
      nohave: false,
      playimg: false,
      groupBox: false,
      groupBox2: false,
      groupFailBox: false,
      joinGroupFailBox: false,
      haveBenefits:false,
      groupSharedBox: false,
      joined: false
    })
    // if (!this.data.posts.obtained){
    //   wx.request({
    //     url: app.util.getUrl('/tasks/task/' + that.data.id + '/receiver'),
    //     method: 'GET',
    //     header: app.globalData.token,
    //     success: function (res) {
    //       let data = res.data;
    //       if (data.code == 200) {
    //         wx.hideLoading();
    //         that.setData({
    //           posts: data.result,
    //           userimg: data.result.avatarUrl
    //         })
    //         var poster = 'posts.poster.content'
    //         that.setData({
    //           [poster]: data.result.poster ? data.result.poster.content.replace(/\\n/g, "\n") : ''
    //         })
    //         that.playTime(data.result.video.seconds)
    //         var time = new Date(that.data.posts.expiredTime + '').getTime()
    //         var doc = 'posts.time'
    //         timer1 = setInterval(function () {
    //           that.setData({
    //             [doc]: that.countdown(time)
    //           })
    //         }, 1000)
    //       }
    //     }
    //   })
    // }
    
  },
  makePhone() {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.posts.consume.tel,
      fail: function(res){
        console.log(res)
      }
    })
  },
  toMap() {
    var that = this
    wx.openLocation({
      latitude: that.data.posts.consume.latitude,
      longitude: that.data.posts.consume.longitude,
      scale: 18,
      name: that.data.posts.consume.brand + '(' + that.data.posts.consume.shopName + ')',
      address: that.data.posts.consume.brand + '(' + that.data.posts.consume.shopName + ')'
    })
  },
  //去首页
  toHome() {
    wx.getSetting({
      success: (res) => {
        console.log("授权列表回调" + new Date())
        console.log(res);
        console.log(res.authSetting['scope.userLocation']);
        if (res.authSetting['scope.userInfo'] == undefined || res.authSetting['scope.userInfo'] != true) {
          wx.reLaunch({
            url: "../index/index"
          })

        } else {
          wx.switchTab({
            url: "../home/home"
          })
        }
      }
    })

  },
  //去券列表
  toWelfare() {
    wx.navigateTo({
      url: '../welfare/welfare'
    })
  },
  //倒计时
  countdown(time) {
    var leftTime = time - new Date().getTime();
    var d, h, m, s, ms;
    if (leftTime < 0) {
      clearInterval(timer1)
      return { 'h': '00', 'm': '00', 's': '00' }
    } else if (leftTime >= 0) {
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
    var filter = { 'h': h, 'm': m, 's': s }
    return filter
  },
  //视频时长
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
  //开红包手机号授权
  getPhoneNumber(e) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    console.log(e)
    this.setData({
      phonePop: false,
      videoclass: 'video',
      playimg: false,
      animat: false
    })
    
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || e.detail.errMsg == 'getPhoneNumber:user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) {
          wx.hideLoading();
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
          let data = res.data;
          if (data.code == 200 || data.code == 405025) {
            if (data.result) {
              wx.setStorageSync('token', data.result.token);
              app.globalData.token.token = data.result.token
            }
            that.setData({
              needPhone: false
            })
            var json = that.data.location;
            that.getbenefits(json);
            that.gettask();
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
  //首次进入手机号授权
  needPhoneNumber(e) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || e.detail.errMsg == 'getPhoneNumber:user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) {
          wx.hideLoading();
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
          let data = res.data;
          if (data.code == 200 || data.code == 405025) {
            if (data.result) {
              wx.setStorageSync('token', data.result.token);
              app.globalData.token.token = data.result.token
            }
            that.getdata(
              that.data.id
            );

            that.setData({
              needPhone: false
            })
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
  //关闭 手机号授权弹窗、领取失败弹窗、活动规则弹窗
  closePop() {
    this.setData({
      phonePop: false,
      selfs: false,
      videoclass: 'video',
      playimg: false,
      rulepop: false
    })
  },
  openswitch() {
    num = !num
    if(num){
      this.setData({
        "switchclass": "switch",
        "startswitch": "switchanimat"
      })
    }else{
      this.setData({
        "switchclass": "endswitch",
        "startswitch": "endswitchanimat"
      })
    }
   
  },
  //打开规则说明
  openrule() {
    this.setData({
      rulepop: true,
      videoclass: 'hiddenvideo',
      playimg: true
    })
  },
  //用户信息授权
  getUserInfo(e) {
    let that = this;
    console.log("101010")
    console.log(e)
    wx.showLoading({
      title: '加载中',
    })
    
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
        hasUserInfo: true,
        auth: false
      })
      wx.login({
        success: function (res) {
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
                that.getdata(that.data.id);
                that.setData({
                  auth: false
                })

              } else {
                // wx.showToast({
                //   title: data.message,
                //   duration: 2000
                // });
              }
            }
          })
        }
      })

    }
  },
  //图片加载完毕
  imgload(e) {
    var that = this
    setTimeout(function () {
      var index = e.currentTarget.dataset.index;
      var loading = "loading" + index;
      var img = "img" + index;
      var loadingobj = "load." + loading
      var imgobj = "load." + img
      that.setData({
        [loadingobj]: true,
        [imgobj]: false
      })
    }, 300)
  },
  //loading加载完毕
  loadingload(e) {
    var index = e.currentTarget.dataset.index;
    var loading = "loading" + index;
    var img = "img" + index;
    var loadingobj = "load." + loading
    var imgobj = "load." + img
    this.setData({
      [loadingobj]: false,
      [imgobj]: true
    })
  },
})