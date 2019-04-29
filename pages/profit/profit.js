// pages/profit/profit.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userimg: "http://photocdn.sohu.com/20050905/Img226866286.jpg",
    page:1,
    amount:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var json = {
      "count": 20,
      "page": that.data.page
    }
    wx.request({
      url: app.util.getUrl('/tasks/profits/record', json),
      method: 'GET',
      header: app.globalData.token,
      success: function (res) {
        let data = res.data;
        if (data.code == 200) {
          that.setData({
            posts: data.result,
            amount: options.amount
          })
          wx.hideLoading();

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