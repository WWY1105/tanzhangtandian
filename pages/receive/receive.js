const app = getApp()
var timer1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    successline: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/receive/successline.png", 'base64'),
    failline: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/receive/failline.png", 'base64'),
    videoclass: 'video',
    showvideotitle: true,
    videoheight: "height:422rpx;",
    lookvideo:false,
    videoUrl:'',
    oneSelfStatePop: false,
    oneSelfGetPop:false,
    lookvideo: false,
    videolist: [],
    parentThis: '',
    playVideo: false,
    showVideo: true,
    divideGetPop: false,
    prougShared:false,
    init: true
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

          if (data.result.self) {
            wx.reLaunch({
              url: "../share/share?id=" + data.result.id
            })
            return;
          } else {
            that.getcheck(id);

          }

          that.setData({
            posts: data.result
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


          if (data.result.video.playUrl) {
            that.setData({
              videoUrl: data.result.video.playUrl,
              videoheight: data.result.video.height * 1 > data.result.video.width * 1 ? "height:650rpx;" : "height:422rpx;"
            })
          } else {
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
                    videoUrl: data.result.url,
                    videoheight: data.result.height * 1 > data.result.width * 1 ? "height:650rpx;" : "height:422rpx;"
                  })
                  console.log(that.data.video)
                  console.log("videoheight: " + that.data.videoheight)
                  // that.videoContext = wx.createVideoContext('myVideo')
                  // that.videoContext.play();
                } else {
                  console.log(data.message)
                }
              }
            });
          }
          var inittimer = setTimeout(function () {
            that.setData({
              init: false
            })
            wx.hideLoading();
            clearTimeout(inittimer);
          }, 1000)



        } else {
          wx.showToast({
            title: data.message,
            duration: 2000
          });
        }
      }
    });
    var arr = wx.getStorageSync("revealed")
    for (var i in arr) {
      if (arr[i] == id) {
        that.setData({
          prougShared: true
        })
      }
    }

  },
  //下拉获取的数据
  gettask() {
    var that = this;
    wx.request({
      url: app.util.getUrl('/tasks/task/' + that.data.id + '/receiver'),
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
          for (var i in arr) {
            if (arr[i] == data.result.id) {
              that.setData({
                prougShared: true
              })
            }
          }
        }
      }
    })

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
  //视频播放结束
  endplay() {
    var that = this
    if (this.data.videolist) {
      if (this.data.videolist.length > 10) {
        delete this.data.videolist[0]
      }
      for (var i = 0; i < this.data.videolist.length; i++) {
        if (this.data.videolist[i] == this.data.id) {
          console.log("观看过")
          this.setData({
            lookvideo: true
          })
          return
        }
      }
    }
    console.log("未观看")
    this.data.videolist.push(that.data.id)
    wx.setStorageSync("videolist", that.data.videolist)
    this.setData({
      lookvideo: true
    })


  },
  //禁止拖拽进度条
  timeupdate(e) {
    var videoContext = wx.createVideoContext('myVideo')
    var lastTime = wx.getStorageSync('lastTime');
    var nowtime = e.detail.currentTime
    if (lastTime) {
      if (nowtime - lastTime > 3) {
        videoContext.seek(parseInt(lastTime));
      } else {
        setTimeout(function () {
          wx.setStorageSync('lastTime', nowtime);
        }, 100)
      }
    } else {
      wx.setStorageSync('lastTime', nowtime);
    }

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
  //图片加载完毕
  imgload(e) {
    var that = this
    var imgloadtimer = setTimeout(function () {
      var index = e.currentTarget.dataset.index;
      var loading = "loading" + index;
      var img = "img" + index;
      var loadingobj = "load." + loading
      var imgobj = "load." + img
      that.setData({
        [loadingobj]: true,
        [imgobj]: false
      })
      clearTimeout(imgloadtimer)
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
  //打开独享状态弹窗
  openOneSelfStatePop() {
    this.gettask()
    this.closePop();
    this.setData({
      oneSelfStatePop: true,
      showVideo: false
    })
  },
  //打开瓜分状态弹窗
  openDivideStatePop() {
    this.gettask()
    this.closePop();
    this.setData({
      divideStatePop: true,
      showVideo: false
    })
  },
  //关闭弹窗
  closePop() {
    this.setData({
      oneSelfStatePop: false,
      oneSelfGetPop:false,
      divideGetPop:false,
      divideStatePop: false,
      rulepop: false,
      showVideo: true,
      phonePop: false
    })
  },
  //点击领取
  openReceive(e) {
    var that = this
    console.log("点击领取")
    if (!this.data.posts) {
      console.log("数据未加载完毕")
      return false;
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    if (e.detail.formId) {
      this.setData({
        "location.formId": e.detail.formId
      })
    }
    if (!this.data.lookvideo) {
      that.setData({
        showVideo: false
      })
      wx.showModal({
        title: '提示',
        content: '观看完视频才能领取哦',
        success(res) {
          that.setData({
            showVideo: true,
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
        showVideo: false
      })
    }
  },
  //check
  getcheck(id) {
    var that = this;
    app.util.request(that,{
      url: app.util.getUrl('/tasks/task/' + id + '/check'),
      method: 'GET',
      header: app.globalData.token
    }).then((res)=>{
      console.log("调用/check")
      console.log(res)
      if (res.code == 200) {
        if (res.result.self) {
          wx.reLaunch({
            url: "../share/share?id=" + data.result.id
          })
          return;
        } else {
          that.setData({
            needPhonePop: res.result.needPhone
          })
          if (!that.data.needPhonePop){
            that.gps();
          }else{
            that.setData({
              showVideo: false
            })
          }
        }
      }
    })
  },
  //隐藏视频
  hiddenVideo() {
    this.setData({
      showVideo: false
    })
  },
  //记录分享
  revealed() {
    var that = this
    var arr = wx.getStorageSync("revealed")
    if (arr) {
      if (arr.length > 10) {
        arr.shift()
      }
    } else {
      arr = []
    }
    arr.push(that.data.posts.id)
    wx.setStorageSync("revealed", arr)
    var timer = setTimeout(() => {
      that.setData({
        prougShared: true
      })
      clearTimeout(timer)
    }, 1000)
  },
  //授权基本信息后再次执行
  againRequest() {
    var that = this
    this.setData({
      showVideo: true
    })
    this.getdata(that.data.id);
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
        that.gettask();
        that.setData({
          showVideo: false,
          benefitsCode: data.code,
          benefitsMag: data.message
        })
        if (that.data.posts.mode == '1002') {
          that.setData({
            divideGetPop: true
          })
        }else{
          that.setData({
            oneSelfGetPop: true
          })
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
  //定位
  gps() {
    var that = this
    var videoContext = wx.createVideoContext('myVideo')
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        console.log("getLocation回调" + new Date())
        console.log("res")
        console.log(res)
        if (res.errMsg == "getLocation:ok") {
          that.setData({
            "location.latitude": res.latitude,
            "location.longitude": res.longitude
            // "location.latitude": 39.90,
            // "location.longitude": 116.40
          })
        } else {
          console.log("地理位置授权失败");
          wx.showModal({
            title: '定位失败',
            content: '请打开手机定位后再领取',
            cancelText: "取消",
            confirmText: "确认",
            success: function (result) {

            }
          })

        }
        videoContext.play();
      },
      fail(res) {
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
                      var timer = setTimeout(function(){
                        videoContext.play();
                        clearTimeout(timer)
                      },2000)
                      
                      console.log("自动播放")
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 2000
                      })
                    } else {
                      wx.hideLoading();
                      console.log("引导授权" + new Date())
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 2000
                      })
                      that.gps();
                    }
                  }
                })
              }
            }
          })
        } else {
          that.setData({
            "location.latitude": '',
            "location.longitude": '',
            "location.city": that.data.posts.city
          })
          videoContext.play();
        }

      }
    })
  },
  //首次进入手机号授权
  needPhoneNumber(e) {
    var that = this
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
            that.getdata(that.data.id);

            that.setData({
              needPhone: false,
              showVideo: true
            })
            that.gps()
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
  //领券手机号授权
  getPhoneNumber(e) {
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
            that.setData({
              phonePop: false
            })
            var json = that.data.location;
            that.getbenefits(json);
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
  toHome() {
    wx.switchTab({
      url: "../home/home"
    })
  },
  toCouponDetail() {
    wx.navigateTo({
      url: "../coupondetail/index?id=" + this.data.posts.redEnvelopes[0].id
    })
  },
  //打开规则说明
  openrule() {
    this.closePop();
    this.setData({
      rulepop: true,
      showVideo: false
    })
  },
  closeRule() {
    this.setData({
      rulepop: false,
      showVideo: true
    })
  },
  makePhone() {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.posts.shop.tel,
      fail: function (res) {
        console.log(res)
      }
    })
  },
  toMap() {
    var that = this
    wx.openLocation({
      latitude: that.data.posts.shop.latitude,
      longitude: that.data.posts.shop.longitude,
      scale: 18,
      name: that.data.posts.shop.brandName + '(' + that.data.posts.shop.name + ')',
      address: that.data.posts.shop.address
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      parentThis: this
    })
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
      title: '加载中',
      mask: true
    })
    that.getdata(that.data.id);

    const videolist = wx.getStorageSync('videolist')
    if (videolist) {
      console.log("查找数组")
      that.setData({
        videolist: videolist
      })
      for (var i = 0; i < that.data.videolist.length; i++) {
        if (that.data.videolist[i] == that.data.id) {
          console.log("观看过")
          that.setData({
            lookvideo: true
          })
        }
      }
    } else {
      that.setData({
        videolist: new Array()
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
    clearInterval(timer1)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.gettask();
    var timer = setTimeout(function(){
      wx.stopPullDownRefresh();
      clearTimeout(timer);
    },2000)
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
    var that = this
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').nickName) {
      var nickName = wx.getStorageSync('userInfo').nickName
    } else {
      var nickName = that.data.posts.nickname;
    }


    if (that.data.posts.mode == '1000' || that.data.posts.mode == '1001') {
      var shareText = nickName + '邀你领取限量优惠券，一起赚广告分享现金！'
    } else if (that.data.posts.mode == '1002' && that.data.posts.state != '1001') {
      var shareText = nickName + '邀你看商家视频领取现金红包，限前' + that.data.posts.recipientsLimit + '人！'
    } else {
      var shareText = nickName + '邀你发商家视频赚现金红包，我刚获得现金！'
    }
    return {
      title: shareText,
      path: '/pages/receive/receive?id=' + this.data.id,
      imageUrl: this.data.posts.sharePicUrl
    }
  }
})