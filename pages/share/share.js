// pages/share/share.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    userimg: "http://photocdn.sohu.com/20050905/Img226866286.jpg",
    play: 'https://s2.ax1x.com/2019/03/28/Awyc4J.png',
    playimg:true,
    intop: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/intop.png", 'base64'),
    inbottom: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/inbottom.png", 'base64'),
    time: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/time.png", 'base64'),
    fanyong: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/fanyong.png", 'base64'),
    wx: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/wx.png", 'base64'),
    pyq: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/pyq.png", 'base64'),
    save: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/save.png", 'base64'),
    tap: [1, 2, 3, 4, 5],
    arr: [],
    text: '[八四老城区炭火牛蛙]轻松获得20元代金券券，还有更多精彩活动，扫码即可简单领取哦',
    mask:false,
    btnshow:false
  },
  toDetail() {
    wx.navigateTo({
      url: '../detail/detail'
    })
  },
  copy() {
    wx.setClipboardData({
      data: this.data.text,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  toHome() {
    wx.switchTab({
      url: '../home/home'
    })
  },
  tapimg(e) {
    var key = e.currentTarget.dataset.key
    var name = 'arr['+key+'].swich';
    var name2 = this.data.arr[key].swich;
    this.setData({
      [name]: !name2
    })
    // this.data.arr[key].swith=false;
    console.log(this.data.arr[key])
  },
  clickbtn(){
    this.setData({
      mask: true
    })
  },
  getPhoneNumber(e) {
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) {

        }
      })
    } else {
      this.setData({
        mask: true,
        btnshow: true
      })
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
  close(){
    this.setData({
      mask:false
    })
  },
  saveimg(){
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功')
            }
          })
        }
      }
    })
    wx.downloadFile({
      url: that.data.userimg,
      success: function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("当初用户拒绝，再次发起授权")
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          },
          complete(res) {
            console.log(res);
          }
        })
      }
    })
  },
  preventTouchMove(e) {

  },
  timeupdate(e) {
    this.videoContext = wx.createVideoContext('myVideo')
    var lastTime = wx.getStorageSync('lastTime');
    var nowtime = e.detail.currentTime
    if (lastTime){
      if (nowtime - lastTime>3){
        this.videoContext.seek(parseInt(lastTime));
      }else{
        wx.setStorageSync('lastTime', nowtime);
      }
    }else{
      wx.setStorageSync('lastTime', nowtime);
    }
  },
  play() {
    this.setData({
      playimg:false
    })
    this.videoContext = wx.createVideoContext('myVideo')
    this.videoContext.play();
  },
  stopplay(){
    this.setData({
      playimg: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var that = this;
    // let base64 = wx.getFileSystemManager().readFileSync(this.data.inbottom, 'base64');
    // that.setData({
    //   'inbottom': 'data:image/jpg;base64,' + base64
    // });
    var arr1 =[];
    for(var i=0; i<this.data.tap.length; i++){
      arr1.push({ 
        'id': this.data.tap[i],
        'swich': true
      })
    }
    this.setData({
      arr: arr1
    })
    var userphone = wx.getStorageSync('userPhone');
    if (userphone){
      this.setData({
        btnshow:true
      })
    }else{
      this.setData({
        btnshow: false
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
    return {
      title:'上宾',
      path:'/pages/receive/receive'
    }
  }
})