// pages/shop/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts:{},
    load:{}
  },
  imgload: function (e) {
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
  loadingload: function (e) {
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: app.util.getUrl('/shop/' + options.id),
      method: 'GET',
      header: app.globalData.token,
      success: function (res) {
        console.log(res)
        if (res.data.code==200){
          that.setData({
            posts:res.data.result
          })
        }
      }
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