// pages/shopDetail/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:'',
    posts:'',
    video:'',
    videoheight:'',
    id:'',
    load: {}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      id: options.id
    })
    this.getdata();
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

  getdata(canvas) {
    var that = this;
    var json = {
      taskId: this.data.id
    }

    wx.request({
      url: app.util.getUrl('/tasks/task/' + this.data.id, json),
      method: 'GET',
      header: app.globalData.token,
      success: function (res) {
        let data = res.data;
        console.log(res)
        if (data.code == 200) {
          that.setData({
            posts: data.result
          })

          //判断背书
          if (data.result.posters) {
            that.setData({
              text: {
                content: data.result.posters[0].content.replace(/\\n/g, "\n"),
                id: data.result.posters[0].id
              }
            })
          } else if (data.result.poster) {
            that.setData({
              text: {
                content: data.result.poster.content.replace(/\\n/g, "\n"),
                id: data.result.poster.id
              }
            })
          } else {
            that.setData({
              text: {
                content: '',
                id: ''
              }
            })
          }

          //写入倒计时
          if (data.result.video.playUrl) {
            that.setData({
              video: data.result.video.playUrl,
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
                    video: data.result.url,
                    videoheight: data.result.height * 1 > data.result.width * 1 ? "height:650rpx;" : "height:422rpx;"
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
          }

          console.log(that.data.posts)


        } else if (data.code == 403000) {
          wx.removeStorageSync('token')
        } else {
          wx.showToast({
            title: data.message,
            duration: 2000
          });
        }

        let inittimer = setTimeout(function () {
          wx.hideLoading();
          that.setData({
            init: false
          })
          clearTimeout(inittimer);
        }, 1000)
      }
    });
  },

  makePhone() {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.posts.consume.tel,
      fail: function (res) {
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