// pages/receive/receive.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    playimg: true,
    userimg: "http://photocdn.sohu.com/20050905/Img226866286.jpg",
    videotitle:'不得不说，这是我目前吃到过的最好吃的了，真是太棒了',
    reward: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/spr-hb.png", 'base64'),
    showvideotitle:true,
    allview: false,

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
  },
  play() {
    this.setData({
      playimg: false,
      showvideotitle: false
    }) 
    this.videoContext = wx.createVideoContext('myVideo')
    this.videoContext.play();
  },
  stopplay() {
    this.setData({
      playimg: true
    })
    if (this.data.allview) {
      this.setData({
        showvideotitle: false
      })
    } else {
      this.setData({
        showvideotitle: true
      })
    }
  },
  allview(e) {
    if (e.detail.fullScreen){
      this.setData({
        allview: true,
        showvideotitle: false
      })
    }else{
      this.setData({
        allview: false
      })
      if (this.data.playimg){
        this.setData({
          showvideotitle: true
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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