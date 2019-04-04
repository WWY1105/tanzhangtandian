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
    beijing: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/beijing.png", 'base64'),
    playimg:true,
    intop: 'data:image/jpg;base64,' + wx.getFileSystemManager().readFileSync("/img/songni.png", 'base64'),
    text: '不得不说，这是我目前吃到过的最好吃的了，真是太棒了',
    mask:false,
    btnshow:false
  },
  toDetail() {
    wx.navigateTo({
      url: '../detail/detail'
    })
  },
  toHome() {
    wx.switchTab({
      url: '../home/home'
    })
  },
  preventTouchMove(e) {

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